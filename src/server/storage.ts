import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  FounderApplication,
  ApplicationSubmissionPayload,
  ApplicationStatus,
  StartupStage,
  AdminReviewNote,
} from '../types/application';
import {
  PortfolioRecord,
  CreatePortfolioRecordPayload,
  PortfolioRecordType,
  PortfolioStatus,
} from '../types/portfolio';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'applications.json');
const PORTFOLIO_FILE = path.resolve(DATA_DIR, 'portfolio.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory rate limiting map: ipHash -> array of submission timestamps (ms)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// Hash IP address for privacy while enabling abuse prevention
export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + '-octopus-salt').digest('hex').slice(0, 16);
}

// Check rate limit for IP
export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const ipKey = hashIp(ip);
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ipKey) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  rateLimitMap.set(ipKey, timestamps);
  return { allowed: true };
}

// Safe read from persistent storage
export function readApplications(): FounderApplication[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    if (!raw.trim()) return [];
    return JSON.parse(raw) as FounderApplication[];
  } catch (err) {
    console.error('Error reading applications file:', err);
    return [];
  }
}

// Safe atomic write to persistent storage
export function writeApplications(apps: FounderApplication[]): boolean {
  try {
    const tempFile = `${DATA_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(apps, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (err) {
    console.error('Error saving applications file:', err);
    return false;
  }
}

// Generate unique human-readable accelerator identifier
export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `OCT-${year}-${hex}`;
}

// Validation result type
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// Server-side validation
export function validateApplicationPayload(
  payload: Partial<ApplicationSubmissionPayload>
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!payload.founderName || !payload.founderName.trim()) {
    errors.founderName = 'Founder full name is required.';
  } else if (payload.founderName.trim().length < 2) {
    errors.founderName = 'Founder name must be at least 2 characters.';
  } else if (payload.founderName.length > 100) {
    errors.founderName = 'Founder name exceeds 100 characters limit.';
  }

  if (!payload.email || !payload.email.trim()) {
    errors.email = 'Email address is required.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email.trim())) {
      errors.email = 'Please provide a valid work or founder email address.';
    } else if (payload.email.length > 150) {
      errors.email = 'Email exceeds maximum length.';
    }
  }

  if (!payload.companyName || !payload.companyName.trim()) {
    errors.companyName = 'Company or project name is required.';
  } else if (payload.companyName.length > 120) {
    errors.companyName = 'Company name exceeds 120 characters limit.';
  }

  if (payload.companyWebsite && payload.companyWebsite.trim()) {
    const trimmed = payload.companyWebsite.trim();
    if (trimmed.length > 250) {
      errors.companyWebsite = 'Website URL exceeds 250 characters.';
    }
  }

  const validStages: StartupStage[] = [
    'Idea / Concept',
    'Pre-Seed',
    'Seed',
    'Early Traction / Growth',
  ];
  if (!payload.startupStage || !validStages.includes(payload.startupStage as StartupStage)) {
    errors.startupStage = 'Please select a valid startup stage.';
  }

  if (!payload.industry || !payload.industry.trim()) {
    errors.industry = 'Industry/sector is required.';
  }

  if (!payload.location || !payload.location.trim()) {
    errors.location = 'Location (city, country) is required.';
  }

  if (!payload.shortDescription || !payload.shortDescription.trim()) {
    errors.shortDescription = 'Short description is required.';
  } else if (payload.shortDescription.trim().length < 15) {
    errors.shortDescription = 'Please provide at least 15 characters describing the startup.';
  } else if (payload.shortDescription.length > 1000) {
    errors.shortDescription = 'Description exceeds 1000 characters limit.';
  }

  if (!payload.problemStatement || !payload.problemStatement.trim()) {
    errors.problemStatement = 'Problem statement is required.';
  } else if (payload.problemStatement.trim().length < 20) {
    errors.problemStatement = 'Please provide at least 20 characters explaining the problem.';
  } else if (payload.problemStatement.length > 2500) {
    errors.problemStatement = 'Problem statement exceeds 2500 characters limit.';
  }

  if (!payload.targetCustomer || !payload.targetCustomer.trim()) {
    errors.targetCustomer = 'Target customer is required.';
  } else if (payload.targetCustomer.length > 1000) {
    errors.targetCustomer = 'Target customer description exceeds 1000 characters limit.';
  }

  if (!payload.currentProgress || !payload.currentProgress.trim()) {
    errors.currentProgress = 'Current progress or traction is required.';
  } else if (payload.currentProgress.length > 2500) {
    errors.currentProgress = 'Current progress details exceed 2500 characters limit.';
  }

  if (!payload.whyOctopus || !payload.whyOctopus.trim()) {
    errors.whyOctopus = 'Please state what you hope to gain from Octopus.';
  } else if (payload.whyOctopus.length > 2000) {
    errors.whyOctopus = 'Explanation exceeds 2000 characters limit.';
  }

  if (payload.coFounderInfo && payload.coFounderInfo.length > 2500) {
    errors.coFounderInfo = 'Co-founder information exceeds 2500 characters limit.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Check for recent duplicate submission (within 24h)
export function checkDuplicateSubmission(
  email: string,
  companyName: string
): { isDuplicate: boolean; existingId?: string } {
  const apps = readApplications();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCompany = companyName.trim().toLowerCase();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  const existing = apps.find((app) => {
    const submissionTime = new Date(app.createdAt).getTime();
    if (submissionTime < oneDayAgo) return false;

    return (
      app.email.trim().toLowerCase() === normalizedEmail ||
      app.companyName.trim().toLowerCase() === normalizedCompany
    );
  });

  if (existing) {
    return { isDuplicate: true, existingId: existing.id };
  }
  return { isDuplicate: false };
}

// Persist a new application
export function saveApplication(
  payload: ApplicationSubmissionPayload,
  clientIp: string
): { success: boolean; application?: FounderApplication; error?: string } {
  const apps = readApplications();
  const now = new Date().toISOString();
  const id = generateApplicationId();

  const newApp: FounderApplication = {
    id,
    founderName: payload.founderName.trim(),
    email: payload.email.trim(),
    companyName: payload.companyName.trim(),
    companyWebsite: payload.companyWebsite?.trim() || undefined,
    startupStage: payload.startupStage,
    industry: payload.industry.trim(),
    location: payload.location.trim(),
    shortDescription: payload.shortDescription.trim(),
    problemStatement: payload.problemStatement.trim(),
    targetCustomer: payload.targetCustomer.trim(),
    currentProgress: payload.currentProgress.trim(),
    whyOctopus: payload.whyOctopus.trim(),
    coFounderInfo: payload.coFounderInfo?.trim() || undefined,
    status: 'Received',
    internalNotes: [
      {
        id: crypto.randomUUID(),
        author: 'System',
        note: `Application received and logged from origin: ${hashIp(clientIp)}`,
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  apps.unshift(newApp);
  const written = writeApplications(apps);

  if (!written) {
    return { success: false, error: 'Database persistence failed. Please retry.' };
  }

  return { success: true, application: newApp };
}

// Admin: Update status
export function updateApplicationStatus(
  id: string,
  newStatus: ApplicationStatus,
  author: string = 'Partner Review'
): { success: boolean; application?: FounderApplication; error?: string } {
  const validStatuses: ApplicationStatus[] = [
    'Received',
    'Under Review',
    'Shortlisted',
    'Accepted',
    'Not Moving Forward',
  ];

  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: 'Invalid status value.' };
  }

  const apps = readApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) {
    return { success: false, error: 'Application not found.' };
  }

  const prevStatus = apps[index].status;
  apps[index].status = newStatus;
  apps[index].updatedAt = new Date().toISOString();
  apps[index].internalNotes.push({
    id: crypto.randomUUID(),
    author,
    note: `Status updated from "${prevStatus}" to "${newStatus}"`,
    createdAt: new Date().toISOString(),
  });

  const written = writeApplications(apps);
  if (!written) {
    return { success: false, error: 'Failed to update database.' };
  }

  return { success: true, application: apps[index] };
}

// Admin: Add internal note
export function addApplicationNote(
  id: string,
  author: string,
  note: string
): { success: boolean; application?: FounderApplication; error?: string } {
  if (!note || !note.trim()) {
    return { success: false, error: 'Note content cannot be empty.' };
  }

  const apps = readApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) {
    return { success: false, error: 'Application not found.' };
  }

  const newNote: AdminReviewNote = {
    id: crypto.randomUUID(),
    author: author.trim() || 'Investment Committee',
    note: note.trim(),
    createdAt: new Date().toISOString(),
  };

  apps[index].internalNotes.push(newNote);
  apps[index].updatedAt = new Date().toISOString();

  const written = writeApplications(apps);
  if (!written) {
    return { success: false, error: 'Failed to save note to database.' };
  }

  return { success: true, application: apps[index] };
}

// =========================================================================
// VERIFIED PORTFOLIO & ECOSYSTEM STORAGE
// =========================================================================

// Read portfolio records from persistent storage
export function readPortfolio(onlyPublished: boolean = false): PortfolioRecord[] {
  try {
    if (!fs.existsSync(PORTFOLIO_FILE)) {
      fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
    if (!raw.trim()) return [];
    const records = JSON.parse(raw) as PortfolioRecord[];
    if (onlyPublished) {
      return records.filter((r) => r.published);
    }
    return records;
  } catch (err) {
    console.error('Error reading portfolio file:', err);
    return [];
  }
}

// Write portfolio records atomically
export function writePortfolio(records: PortfolioRecord[]): boolean {
  try {
    const tempFile = `${PORTFOLIO_FILE}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), 'utf-8');
    fs.renameSync(tempFile, PORTFOLIO_FILE);
    return true;
  } catch (err) {
    console.error('Error writing portfolio file:', err);
    return false;
  }
}

// Generate portfolio ID
export function generatePortfolioId(type: PortfolioRecordType): string {
  const prefix = type.slice(0, 3).toUpperCase();
  const hex = crypto.randomBytes(3).toString('hex').toLowerCase();
  return `oct-${prefix}-${hex}`;
}

// Validate portfolio record payload
export function validatePortfolioPayload(
  payload: Partial<CreatePortfolioRecordPayload>
): ValidationResult {
  const errors: Record<string, string> = {};

  const validTypes: PortfolioRecordType[] = [
    'company',
    'investment',
    'founder',
    'partner',
    'mentor',
    'ecosystem',
  ];

  if (!payload.type || !validTypes.includes(payload.type)) {
    errors.type = 'A valid category/record type is required.';
  }

  if (!payload.name || !payload.name.trim()) {
    errors.name = 'Entity or individual name is required.';
  } else if (payload.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (payload.name.length > 150) {
    errors.name = 'Name exceeds 150 characters limit.';
  }

  if (!payload.shortDescription || !payload.shortDescription.trim()) {
    errors.shortDescription = 'Short description or thesis is required.';
  } else if (payload.shortDescription.length > 600) {
    errors.shortDescription = 'Short description exceeds 600 characters limit.';
  }

  if (!payload.sector || !payload.sector.trim()) {
    errors.sector = 'Sector or domain is required.';
  }

  if (!payload.relationship || !payload.relationship.trim()) {
    errors.relationship = 'Relationship description is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Create new verified portfolio record
export function savePortfolioRecord(
  payload: CreatePortfolioRecordPayload
): { success: boolean; record?: PortfolioRecord; error?: string } {
  const validation = validatePortfolioPayload(payload);
  if (!validation.valid) {
    return {
      success: false,
      error: Object.values(validation.errors).join(' '),
    };
  }

  const records = readPortfolio(false);
  const now = new Date().toISOString();
  const id = generatePortfolioId(payload.type);

  const newRecord: PortfolioRecord = {
    id,
    type: payload.type,
    name: payload.name.trim(),
    headline: payload.headline?.trim() || undefined,
    shortDescription: payload.shortDescription.trim(),
    fullDescription: payload.fullDescription?.trim() || undefined,
    sector: payload.sector.trim(),
    batchOrYear: payload.batchOrYear?.trim() || undefined,
    relationship: payload.relationship.trim(),
    status: payload.status || 'active',
    logoUrl: payload.logoUrl?.trim() || undefined,
    imageUrl: payload.imageUrl?.trim() || undefined,
    websiteUrl: payload.websiteUrl?.trim() || undefined,
    externalLinks: payload.externalLinks || [],
    investmentDetails: payload.investmentDetails || undefined,
    location: payload.location?.trim() || undefined,
    founders: payload.founders || [],
    tags: payload.tags || [],
    published: payload.published !== undefined ? payload.published : true,
    featured: payload.featured || false,
    createdAt: now,
    updatedAt: now,
  };

  records.unshift(newRecord);
  const written = writePortfolio(records);
  if (!written) {
    return { success: false, error: 'Failed to write record to storage.' };
  }

  return { success: true, record: newRecord };
}

// Update existing verified portfolio record
export function updatePortfolioRecord(
  id: string,
  updates: Partial<PortfolioRecord>
): { success: boolean; record?: PortfolioRecord; error?: string } {
  const records = readPortfolio(false);
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) {
    return { success: false, error: 'Record not found.' };
  }

  const existing = records[index];
  const updated: PortfolioRecord = {
    ...existing,
    ...updates,
    id: existing.id, // prevent changing ID
    createdAt: existing.createdAt, // prevent changing createdAt
    updatedAt: new Date().toISOString(),
  };

  records[index] = updated;
  const written = writePortfolio(records);
  if (!written) {
    return { success: false, error: 'Failed to persist record update.' };
  }

  return { success: true, record: updated };
}

// Delete portfolio record
export function deletePortfolioRecord(id: string): { success: boolean; error?: string } {
  const records = readPortfolio(false);
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length === records.length) {
    return { success: false, error: 'Record not found.' };
  }

  const written = writePortfolio(filtered);
  if (!written) {
    return { success: false, error: 'Failed to delete record from storage.' };
  }

  return { success: true };
}

