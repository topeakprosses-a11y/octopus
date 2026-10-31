import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import {
  checkRateLimit,
  validateApplicationPayload,
  checkDuplicateSubmission,
  saveApplication,
  readApplications,
  updateApplicationStatus,
  addApplicationNote,
  hashIp,
  readPortfolio,
  savePortfolioRecord,
  updatePortfolioRecord,
  deletePortfolioRecord,
} from './src/server/storage';
import { ApplicationStatus, StartupStage } from './src/types/application';
import {
  PortfolioRecord,
  PortfolioRecordType,
  CreatePortfolioRecordPayload,
} from './src/types/portfolio';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

// Configurable Admin Secret Passkey
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'octopus-partner-2026';

// Active admin sessions: token -> expiry timestamp
const adminSessions = new Map<string, number>();
const SESSION_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 hours

// Admin login brute force protection
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

// Authentication middleware for administrative routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Administrative authorization token required.' });
  }

  const token = authHeader.split(' ')[1];
  const expiry = adminSessions.get(token);

  if (!expiry || Date.now() > expiry) {
    if (expiry) adminSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please re-authenticate.' });
  }

  // Refresh token lifetime on active usage
  adminSessions.set(token, Date.now() + SESSION_LIFETIME_MS);
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // =========================================================================
  // PUBLIC APPLICATION SUBMISSION API
  // =========================================================================
  app.post('/api/applications', (req: Request, res: Response) => {
    const clientIp = getClientIp(req);

    // 1. Check rate limit
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Submission rate limit exceeded. Please wait ${rateCheck.retryAfterSeconds} seconds before submitting again.`,
      });
    }

    // 2. Validate payload fields
    const validation = validateApplicationPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed. Please review the highlighted fields.',
        fieldErrors: validation.errors,
      });
    }

    // 3. Duplicate check (same email or company in last 24h)
    const duplicateCheck = checkDuplicateSubmission(req.body.email, req.body.companyName);
    if (duplicateCheck.isDuplicate) {
      return res.status(409).json({
        error:
          'An application with this email or company name was already submitted in the last 24 hours. Our investment team is reviewing your profile.',
        existingApplicationId: duplicateCheck.existingId,
      });
    }

    // 4. Persist application
    const result = saveApplication(req.body, clientIp);
    if (!result.success || !result.application) {
      return res.status(500).json({
        error: result.error || 'Failed to persist application. Please try again.',
      });
    }

    // 5. Return confirmed receipt (never exposes other records or sensitive secrets)
    return res.status(201).json({
      success: true,
      applicationId: result.application.id,
      companyName: result.application.companyName,
      founderName: result.application.founderName,
      email: result.application.email,
      createdAt: result.application.createdAt,
      message: 'Your application has been securely submitted to the Octopus Investment Committee.',
    });
  });

  // =========================================================================
  // PUBLIC VERIFIED PORTFOLIO & ECOSYSTEM API
  // =========================================================================
  app.get('/api/portfolio', (req: Request, res: Response) => {
    // Only return published records to the public
    const allPublished = readPortfolio(true);
    const { category, sector, search, batch } = req.query;

    let filtered = [...allPublished];

    // Filter by category/type if specified and not 'all'
    if (typeof category === 'string' && category && category !== 'all') {
      filtered = filtered.filter((r) => r.type === category);
    }

    // Filter by sector
    if (typeof sector === 'string' && sector && sector !== 'all') {
      filtered = filtered.filter((r) => r.sector.toLowerCase() === sector.toLowerCase());
    }

    // Filter by batch/year
    if (typeof batch === 'string' && batch && batch !== 'all') {
      filtered = filtered.filter((r) => r.batchOrYear && r.batchOrYear.toLowerCase().includes(batch.toLowerCase()));
    }

    // Search query
    if (typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.shortDescription.toLowerCase().includes(q) ||
          r.sector.toLowerCase().includes(q) ||
          r.relationship.toLowerCase().includes(q) ||
          (r.headline && r.headline.toLowerCase().includes(q)) ||
          (r.location && r.location.toLowerCase().includes(q)) ||
          (r.founders && r.founders.some((f) => f.toLowerCase().includes(q))) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Calculate real category counts based on verified published records
    const counts = {
      all: allPublished.length,
      company: allPublished.filter((r) => r.type === 'company').length,
      investment: allPublished.filter((r) => r.type === 'investment').length,
      founder: allPublished.filter((r) => r.type === 'founder').length,
      partner: allPublished.filter((r) => r.type === 'partner').length,
      mentor: allPublished.filter((r) => r.type === 'mentor').length,
      ecosystem: allPublished.filter((r) => r.type === 'ecosystem').length,
    };

    // Extract unique sectors
    const sectors = Array.from(new Set(allPublished.map((r) => r.sector))).filter(Boolean);

    return res.json({
      records: filtered,
      counts,
      sectors,
    });
  });

  // =========================================================================
  // ADMIN AUTHENTICATION
  // =========================================================================
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    const ipKey = hashIp(clientIp);
    const now = Date.now();

    // Check brute force lockout
    const attempt = loginAttempts.get(ipKey) || { count: 0, lockedUntil: 0 };
    if (attempt.lockedUntil > now) {
      const waitSec = Math.ceil((attempt.lockedUntil - now) / 1000);
      return res.status(429).json({
        error: `Too many failed attempts. Access temporarily locked for ${waitSec}s.`,
      });
    }

    const { passkey } = req.body;
    if (!passkey || typeof passkey !== 'string') {
      return res.status(400).json({ error: 'Passkey is required.' });
    }

    // Timing-safe comparison to prevent timing side-channels
    const expectedBuffer = Buffer.from(ADMIN_PASSKEY);
    const providedBuffer = Buffer.from(passkey);

    let match = false;
    if (expectedBuffer.length === providedBuffer.length) {
      match = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    }

    if (!match) {
      attempt.count += 1;
      if (attempt.count >= 5) {
        attempt.lockedUntil = now + 5 * 60 * 1000; // 5 min lockout
        attempt.count = 0;
      }
      loginAttempts.set(ipKey, attempt);
      return res.status(401).json({ error: 'Invalid administrative passkey.' });
    }

    // Reset failed counter
    loginAttempts.delete(ipKey);

    // Issue cryptographic bearer token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = now + SESSION_LIFETIME_MS;
    adminSessions.set(token, expiresAt);

    return res.json({
      success: true,
      token,
      expiresAt,
    });
  });

  app.post('/api/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      adminSessions.delete(token);
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // =========================================================================
  // ADMIN PROTECTED APPLICATION MANAGEMENT
  // =========================================================================

  // List applications with search, status & stage filtering, sorting
  app.get('/api/admin/applications', requireAdminAuth, (req: Request, res: Response) => {
    let apps = readApplications();
    const { search, status, stage, sort } = req.query;

    if (typeof status === 'string' && status && status !== 'All') {
      apps = apps.filter((a) => a.status === status);
    }

    if (typeof stage === 'string' && stage && stage !== 'All') {
      apps = apps.filter((a) => a.startupStage === stage);
    }

    if (typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      apps = apps.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.companyName.toLowerCase().includes(q) ||
          a.founderName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.industry.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sort === 'oldest') {
      apps.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // default: newest first
      apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Calculate status counts
    const allApps = readApplications();
    const counts = {
      total: allApps.length,
      received: allApps.filter((a) => a.status === 'Received').length,
      reviewing: allApps.filter((a) => a.status === 'Under Review').length,
      shortlisted: allApps.filter((a) => a.status === 'Shortlisted').length,
      accepted: allApps.filter((a) => a.status === 'Accepted').length,
      notMovingForward: allApps.filter((a) => a.status === 'Not Moving Forward').length,
    };

    return res.json({
      applications: apps,
      counts,
    });
  });

  // Get single application dossier
  app.get('/api/admin/applications/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const apps = readApplications();
    const appRecord = apps.find((a) => a.id === id);

    if (!appRecord) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    return res.json({ application: appRecord });
  });

  // Update application status
  app.patch('/api/admin/applications/:id/status', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, author } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'New status is required.' });
    }

    const result = updateApplicationStatus(id, status as ApplicationStatus, author);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json({ success: true, application: result.application });
  });

  // Add internal review note
  app.post('/api/admin/applications/:id/notes', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { author, note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Note text cannot be empty.' });
    }

    const result = addApplicationNote(id, author || 'Partner', note);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json({ success: true, application: result.application });
  });

  // =========================================================================
  // ADMIN PROTECTED PORTFOLIO & ECOSYSTEM MANAGEMENT
  // =========================================================================

  // List all portfolio entries (including unpublished drafts)
  app.get('/api/admin/portfolio', requireAdminAuth, (_req: Request, res: Response) => {
    const records = readPortfolio(false);
    const counts = {
      total: records.length,
      published: records.filter((r) => r.published).length,
      drafts: records.filter((r) => !r.published).length,
      company: records.filter((r) => r.type === 'company').length,
      investment: records.filter((r) => r.type === 'investment').length,
      founder: records.filter((r) => r.type === 'founder').length,
      partner: records.filter((r) => r.type === 'partner').length,
      mentor: records.filter((r) => r.type === 'mentor').length,
      ecosystem: records.filter((r) => r.type === 'ecosystem').length,
    };
    return res.json({ records, counts });
  });

  // Create new verified record
  app.post('/api/admin/portfolio', requireAdminAuth, (req: Request, res: Response) => {
    const result = savePortfolioRecord(req.body);
    if (!result.success || !result.record) {
      return res.status(400).json({ error: result.error || 'Failed to create record.' });
    }
    return res.status(201).json({ success: true, record: result.record });
  });

  // Update verified record
  app.patch('/api/admin/portfolio/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const result = updatePortfolioRecord(id, req.body);
    if (!result.success || !result.record) {
      return res.status(400).json({ error: result.error || 'Failed to update record.' });
    }
    return res.json({ success: true, record: result.record });
  });

  // Delete verified record
  app.delete('/api/admin/portfolio/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const result = deletePortfolioRecord(id);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Failed to delete record.' });
    }
    return res.json({ success: true, message: 'Record deleted successfully.' });
  });

  // =========================================================================
  // VITE DEV SERVER / STATIC ASSET DELIVERY
  // =========================================================================
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`OCTOPUS accelerator running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Octopus server:', err);
  process.exit(1);
});
