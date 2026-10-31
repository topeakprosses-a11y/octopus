import React, { useState, useEffect, useTransition } from 'react';
import { Container } from '@/src/components/ui/Container';
import { Button } from '@/src/components/ui/Button';
import { Kicker } from '@/src/components/ui/Kicker';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { PageView } from '@/src/components/layout/Navbar';
import {
  FounderApplication,
  ApplicationStatus,
  StartupStage,
} from '@/src/types/application';
import { PortfolioManager } from '@/src/components/admin/PortfolioManager';
import {
  Lock,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Building,
  User,
  Globe,
  MapPin,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  LogOut,
  RefreshCw,
  X,
  Send,
  Eye,
  Shield,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

interface AdminViewProps {
  onNavigate: (view: PageView) => void;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  'Received',
  'Under Review',
  'Shortlisted',
  'Accepted',
  'Not Moving Forward',
];

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('octopus_admin_token');
  });

  const [activeAdminTab, setActiveAdminTab] = useState<'applications' | 'portfolio'>('applications');

  // Auth form state
  const [passkeyInput, setPasskeyInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [counts, setCounts] = useState<{
    total: number;
    received: number;
    reviewing: number;
    shortlisted: number;
    accepted: number;
    notMovingForward: number;
  }>({
    total: 0,
    received: 0,
    reviewing: 0,
    shortlisted: 0,
    accepted: 0,
    notMovingForward: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Detail Modal State
  const [selectedApp, setSelectedApp] = useState<FounderApplication | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newNoteAuthor, setNewNoteAuthor] = useState('Partner');
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  // Fetch applications
  const fetchApplications = async (authToken = token) => {
    if (!authToken) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (stageFilter !== 'All') params.append('stage', stageFilter);
      params.append('sort', sortOrder);

      const res = await fetch(`/api/admin/applications?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.status === 401) {
        // Token expired or invalid
        sessionStorage.removeItem('octopus_admin_token');
        setToken(null);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications || []);
        if (data.counts) setCounts(data.counts);

        // Update selected application if modal is open
        if (selectedApp) {
          const updated = (data.applications || []).find(
            (a: FounderApplication) => a.id === selectedApp.id
          );
          if (updated) setSelectedApp(updated);
        }
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApplications(token);
    }
  }, [token, statusFilter, stageFilter, sortOrder]);

  // Handle Search Debounce / Trigger
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      fetchApplications(token);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkeyInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
        setIsLoggingIn(false);
        return;
      }

      sessionStorage.setItem('octopus_admin_token', data.token);
      setToken(data.token);
      setIsLoggingIn(false);
      setPasskeyInput('');
    } catch (err) {
      console.error('Login request error:', err);
      setLoginError('Network error connecting to verification gateway.');
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        // Ignore logout network errors
      }
    }
    sessionStorage.removeItem('octopus_admin_token');
    setToken(null);
    setSelectedApp(null);
  };

  // Handle Status Update
  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!selectedApp || !token) return;
    setStatusUpdating(true);

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, author: newNoteAuthor || 'Partner Review' }),
      });

      const data = await res.json();
      if (res.ok && data.application) {
        setSelectedApp(data.application);
        // Refresh table list
        fetchApplications(token);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Handle Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !token || !newNoteText.trim()) return;

    setIsAddingNote(true);
    setNoteError(null);

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ author: newNoteAuthor.trim() || 'Partner', note: newNoteText.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setNoteError(data.error || 'Failed to record note.');
        setIsAddingNote(false);
        return;
      }

      if (data.application) {
        setSelectedApp(data.application);
        setNewNoteText('');
        fetchApplications(token);
      }
    } catch (err) {
      console.error('Failed to add note:', err);
      setNoteError('Network error recording note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Received':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#171719] border border-[#303034] text-[#F5F5F3]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Received
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/40 border border-amber-800/60 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Under Review
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-950/40 border border-purple-800/60 text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Shortlisted
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Accepted
          </span>
        );
      case 'Not Moving Forward':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#171719] border border-[#303034] text-[#A5A5AA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A5A5AA]" />
            Not Moving Forward
          </span>
        );
    }
  };

  // If not authenticated, render Partner Access Passkey Screen
  if (!token) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)]">
        <PageHeader
          kicker="OCTOPUS · ACCESS GATEWAY"
          title="Partner Portal"
          subtitle="Restricted environment for investment committee review, deal evaluation, and cohort management."
          onBack={() => onNavigate('home')}
          backLabel="Back to Overview"
        />

        <section className="py-20 md:py-28 flex-1 flex items-center">
          <Container size="sm">
            <Card variant="flat" padding="lg" className="border-[#303034] bg-[#0B0B0D]">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#171719] border border-[#303034] flex items-center justify-center text-[#F5F5F3] mb-6">
                  <Shield className="w-6 h-6 text-[#F5F5F3]" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F3]">
                  Partner Verification
                </h2>
                <p className="mt-2 text-sm text-[#A5A5AA] leading-relaxed">
                  Enter your administrative passkey to inspect submitted founder applications and update review statuses.
                </p>

                {loginError && (
                  <div className="mt-6 w-full p-3.5 rounded-lg bg-red-950/50 border border-red-800 text-xs text-red-200 text-left flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="mt-6 w-full space-y-4 text-left">
                  <Input
                    label="Administrator Passkey"
                    type="password"
                    placeholder="Enter partner security passkey..."
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    required
                  />

                  <div className="p-3 rounded-lg bg-[#111114] border border-[#303034]/60 text-[11px] text-[#A5A5AA] leading-relaxed">
                    <span className="font-semibold text-[#F5F5F3]">Partner Notice:</span> Default verification passkey is{' '}
                    <code className="text-[#F5F5F3] font-mono bg-[#171719] px-1 py-0.5 rounded">octopus-partner-2026</code>{' '}
                    or as configured via server environment.
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    disabled={isLoggingIn}
                    className="gap-2 mt-2"
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authenticate Portal Access</span>
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </Container>
        </section>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED PARTNER DASHBOARD
  // =========================================================================
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar for Partner Portal */}
      <div className="bg-[#0B0B0D] border-b border-[#303034] py-4 sticky top-20 z-30">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-base font-bold text-[#F5F5F3] tracking-tight">
                Octopus Partner Review Desk
              </h1>
              <span className="text-xs font-mono text-[#A5A5AA] bg-[#171719] px-2 py-0.5 rounded border border-[#303034]">
                Batch 01
              </span>
            </div>

            {/* Main Admin Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111114] border border-[#303034]">
              <button
                onClick={() => setActiveAdminTab('applications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeAdminTab === 'applications'
                    ? 'bg-[#F5F5F3] text-[#050505] shadow-sm'
                    : 'text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719]'
                }`}
              >
                Applications ({counts.total})
              </button>
              <button
                onClick={() => setActiveAdminTab('portfolio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeAdminTab === 'portfolio'
                    ? 'bg-[#F5F5F3] text-[#050505] shadow-sm'
                    : 'text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719]'
                }`}
              >
                Verified Portfolio & Ecosystem
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchApplications()}
                className="gap-1.5 text-xs"
                disabled={isLoading}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <section className="py-8 md:py-12 flex-1">
        <Container>
          {activeAdminTab === 'portfolio' ? (
            <PortfolioManager token={token} />
          ) : (
            <>
              {/* STATS OVERVIEW CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
              <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Total Applications</span>
              <span className="text-2xl font-bold font-mono text-[#F5F5F3] mt-1 block">{counts.total}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
              <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Received</span>
              <span className="text-2xl font-bold font-mono text-blue-300 mt-1 block">{counts.received}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
              <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Under Review</span>
              <span className="text-2xl font-bold font-mono text-amber-300 mt-1 block">{counts.reviewing}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
              <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Shortlisted</span>
              <span className="text-2xl font-bold font-mono text-purple-300 mt-1 block">{counts.shortlisted}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
              <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Accepted</span>
              <span className="text-2xl font-bold font-mono text-emerald-300 mt-1 block">{counts.accepted}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
              <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Declined</span>
              <span className="text-2xl font-bold font-mono text-[#A5A5AA] mt-1 block">{counts.notMovingForward}</span>
            </div>
          </div>

          {/* FILTER & SEARCH TOOLBAR */}
          <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034] mb-6 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#A5A5AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by company, founder, keyword, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#171719] border border-[#303034] rounded-lg text-sm text-[#F5F5F3] placeholder-[#A5A5AA] focus:border-[#F5F5F3] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5A5AA] hover:text-[#F5F5F3]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Stage Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#A5A5AA] whitespace-nowrap">Stage:</span>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:outline-none"
                >
                  <option value="All">All Stages</option>
                  <option value="Idea / Concept">Idea / Concept</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Early Traction / Growth">Early Traction</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#A5A5AA] whitespace-nowrap">Sort:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-[#303034]/60 pt-3">
              <span className="text-xs font-mono uppercase text-[#A5A5AA] mr-2">Status:</span>
              {['All', 'Received', 'Under Review', 'Shortlisted', 'Accepted', 'Not Moving Forward'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#F5F5F3] text-[#050505]'
                      : 'bg-[#171719] text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#252529]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* APPLICATIONS TABLE / LIST */}
          <div className="rounded-xl border border-[#303034] bg-[#0B0B0D] overflow-hidden">
            {isLoading && applications.length === 0 ? (
              <div className="py-20 text-center">
                <span className="w-6 h-6 border-2 border-[#F5F5F3] border-t-transparent rounded-full animate-spin inline-block mb-3" />
                <p className="text-sm text-[#A5A5AA]">Loading applications registry...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="py-20 text-center px-4">
                <Briefcase className="w-10 h-10 text-[#303034] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#F5F5F3]">No applications found</h3>
                <p className="text-xs text-[#A5A5AA] max-w-sm mx-auto mt-1">
                  {searchQuery || statusFilter !== 'All' || stageFilter !== 'All'
                    ? 'No founder submissions match your active filter criteria.'
                    : 'No founder applications have been submitted yet.'}
                </p>
                {(searchQuery || statusFilter !== 'All' || stageFilter !== 'All') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setStageFilter('All');
                    }}
                    className="mt-4 text-xs"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#303034] bg-[#111114] text-[11px] font-mono uppercase text-[#A5A5AA]">
                      <th className="py-3.5 px-4 font-semibold">ID</th>
                      <th className="py-3.5 px-4 font-semibold">Company & Founder</th>
                      <th className="py-3.5 px-4 font-semibold">Stage & Sector</th>
                      <th className="py-3.5 px-4 font-semibold">Location</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Submitted</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#303034]/60">
                    {applications.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-[#171719]/50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedApp(app)}
                      >
                        <td className="py-4 px-4 font-mono text-xs font-bold text-[#F5F5F3] whitespace-nowrap">
                          {app.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#F5F5F3]">{app.companyName}</div>
                          <div className="text-xs text-[#A5A5AA] mt-0.5 flex items-center gap-1.5">
                            <span>{app.founderName}</span>
                            <span className="text-[#303034]">·</span>
                            <span className="text-xs truncate max-w-[160px]">{app.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-[#171719] border border-[#303034] text-[#F5F5F3]">
                            {app.startupStage}
                          </span>
                          <span className="block text-xs text-[#A5A5AA] mt-1 truncate max-w-[180px]">
                            {app.industry}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-[#A5A5AA] whitespace-nowrap">
                          {app.location}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(app.status)}</td>
                        <td className="py-4 px-4 font-mono text-xs text-[#A5A5AA] whitespace-nowrap">
                          {new Date(app.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#F5F5F3] hover:underline"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
            </>
          )}
        </Container>
      </section>

      {/* =========================================================================
          APPLICATION FULL DOSSIER DRAWER / MODAL
          ========================================================================= */}
      {selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
        >
          <div className="bg-[#0B0B0D] border border-[#303034] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#303034] flex items-start justify-between gap-4 bg-[#111114]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#A5A5AA] bg-[#171719] px-2 py-0.5 rounded border border-[#303034]">
                    {selectedApp.id}
                  </span>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F3] mt-2">
                  {selectedApp.companyName}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#A5A5AA] mt-1">
                  <span className="flex items-center gap-1 text-[#F5F5F3]">
                    <User className="w-3.5 h-3.5 text-[#A5A5AA]" />
                    {selectedApp.founderName} ({selectedApp.email})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedApp.location}
                  </span>
                  {selectedApp.companyWebsite && (
                    <a
                      href={selectedApp.companyWebsite.startsWith('http') ? selectedApp.companyWebsite : `https://${selectedApp.companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#F5F5F3] hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{selectedApp.companyWebsite}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-lg text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719] cursor-pointer"
                aria-label="Close dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1 text-sm leading-relaxed">
              {/* STATUS CONTROLLER */}
              <div className="p-4 rounded-xl bg-[#171719]/60 border border-[#303034] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Review Workflow Status</span>
                  <p className="text-xs text-[#A5A5AA] mt-0.5">
                    Update application state and record audit trail in investment log.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                    disabled={statusUpdating}
                    className="px-3.5 py-2 bg-[#0B0B0D] border border-[#303034] rounded-lg text-xs font-semibold text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-[#0B0B0D] text-[#F5F5F3]">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION: ELEVATOR PITCH & THESIS */}
              <div className="space-y-4">
                <Kicker>THE PROPOSITION</Kicker>
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#A5A5AA] mb-1">One-Sentence Pitch</h4>
                  <p className="text-[#F5F5F3] font-medium bg-[#111114] p-3.5 rounded-xl border border-[#303034]/60">
                    {selectedApp.shortDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111114] p-4 rounded-xl border border-[#303034]/60">
                    <h4 className="text-xs font-mono uppercase text-[#A5A5AA] mb-1.5">Problem Statement</h4>
                    <p className="text-xs text-[#F5F5F3] whitespace-pre-wrap leading-relaxed">
                      {selectedApp.problemStatement}
                    </p>
                  </div>

                  <div className="bg-[#111114] p-4 rounded-xl border border-[#303034]/60">
                    <h4 className="text-xs font-mono uppercase text-[#A5A5AA] mb-1.5">Target Customer & Market</h4>
                    <p className="text-xs text-[#F5F5F3] whitespace-pre-wrap leading-relaxed">
                      {selectedApp.targetCustomer}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION: TRACTION & METRICS */}
              <div className="space-y-4">
                <Kicker>TRACTION & FIT</Kicker>
                <div className="bg-[#111114] p-4 rounded-xl border border-[#303034]/60">
                  <h4 className="text-xs font-mono uppercase text-[#A5A5AA] mb-1.5">Current Progress & Traction</h4>
                  <p className="text-xs text-[#F5F5F3] whitespace-pre-wrap leading-relaxed">
                    {selectedApp.currentProgress}
                  </p>
                </div>

                <div className="bg-[#111114] p-4 rounded-xl border border-[#303034]/60">
                  <h4 className="text-xs font-mono uppercase text-[#A5A5AA] mb-1.5">Why Octopus & Needs</h4>
                  <p className="text-xs text-[#F5F5F3] whitespace-pre-wrap leading-relaxed">
                    {selectedApp.whyOctopus}
                  </p>
                </div>

                {selectedApp.coFounderInfo && (
                  <div className="bg-[#111114] p-4 rounded-xl border border-[#303034]/60">
                    <h4 className="text-xs font-mono uppercase text-[#A5A5AA] mb-1.5">Co-Founders & Team</h4>
                    <p className="text-xs text-[#F5F5F3] whitespace-pre-wrap leading-relaxed">
                      {selectedApp.coFounderInfo}
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION: INTERNAL PARTNER REVIEW NOTES */}
              <div className="space-y-4 pt-4 border-t border-[#303034]/60">
                <div className="flex items-center justify-between">
                  <Kicker>INTERNAL REVIEW NOTES & AUDIT TRAIL</Kicker>
                  <span className="text-xs font-mono text-[#A5A5AA]">
                    {selectedApp.internalNotes.length} recorded
                  </span>
                </div>

                {/* Notes thread */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedApp.internalNotes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg bg-[#111114] border border-[#303034]/60 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#A5A5AA] mb-1">
                        <span className="font-bold text-[#F5F5F3]">{n.author}</span>
                        <span>
                          {new Date(n.createdAt).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                      <p className="text-[#F5F5F3] whitespace-pre-wrap">{n.note}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-3 pt-2">
                  {noteError && (
                    <p className="text-xs text-red-400">{noteError}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        placeholder="Author (e.g. Partner)"
                        value={newNoteAuthor}
                        onChange={(e) => setNewNoteAuthor(e.target.value)}
                        className="w-full px-3 py-2 bg-[#050505] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Add internal evaluation note or follow-up note..."
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        className="w-full px-3 py-2 bg-[#050505] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isAddingNote || !newNoteText.trim()}
                      className="gap-1.5 text-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>{isAddingNote ? 'Saving...' : 'Add Partner Note'}</span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#303034] bg-[#111114] flex items-center justify-between text-xs text-[#A5A5AA]">
              <span>Received: {new Date(selectedApp.createdAt).toUTCString()}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedApp(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
