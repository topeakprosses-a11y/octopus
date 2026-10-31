import React, { useState, useEffect } from 'react';
import { PortfolioRecord, PortfolioRecordType, PortfolioStatus, CreatePortfolioRecordPayload } from '@/src/types/portfolio';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Kicker } from '@/src/components/ui/Kicker';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  Download,
  Eye,
  EyeOff,
  Building2,
  Users,
  Shield,
  Layers,
  Sparkles,
  AlertCircle,
  FileCode,
} from 'lucide-react';

interface PortfolioManagerProps {
  token: string;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({ token }) => {
  const [records, setRecords] = useState<PortfolioRecord[]>([]);
  const [counts, setCounts] = useState<{
    total: number;
    published: number;
    drafts: number;
    company: number;
    investment: number;
    founder: number;
    partner: number;
    mentor: number;
    ecosystem: number;
  }>({
    total: 0,
    published: 0,
    drafts: 0,
    company: 0,
    investment: 0,
    founder: 0,
    partner: 0,
    mentor: 0,
    ecosystem: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PortfolioRecord | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CreatePortfolioRecordPayload>>({
    type: 'company',
    name: '',
    headline: '',
    shortDescription: '',
    fullDescription: '',
    sector: '',
    batchOrYear: 'Batch 01 (2026)',
    relationship: 'Seed Investment',
    status: 'active',
    logoUrl: '',
    imageUrl: '',
    websiteUrl: '',
    location: '',
    founders: [],
    published: true,
    featured: false,
  });

  const [foundersInput, setFoundersInput] = useState('');

  // Fetch all records (including drafts)
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to load admin portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [token]);

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData({
      type: 'company',
      name: '',
      headline: '',
      shortDescription: '',
      fullDescription: '',
      sector: 'AI & Machine Learning',
      batchOrYear: 'Batch 01 (2026)',
      relationship: 'Seed Investment',
      status: 'active',
      logoUrl: '',
      imageUrl: '',
      websiteUrl: '',
      location: 'San Francisco, CA',
      published: true,
      featured: false,
    });
    setFoundersInput('');
    setFormError(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (rec: PortfolioRecord) => {
    setEditingRecord(rec);
    setFormData({
      type: rec.type,
      name: rec.name,
      headline: rec.headline || '',
      shortDescription: rec.shortDescription,
      fullDescription: rec.fullDescription || '',
      sector: rec.sector,
      batchOrYear: rec.batchOrYear || '',
      relationship: rec.relationship,
      status: rec.status,
      logoUrl: rec.logoUrl || '',
      imageUrl: rec.imageUrl || '',
      websiteUrl: rec.websiteUrl || '',
      location: rec.location || '',
      published: rec.published,
      featured: rec.featured,
      investmentDetails: rec.investmentDetails,
    });
    setFoundersInput((rec.founders || []).join(', '));
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      const payload: CreatePortfolioRecordPayload = {
        type: formData.type as PortfolioRecordType,
        name: (formData.name || '').trim(),
        headline: (formData.headline || '').trim() || undefined,
        shortDescription: (formData.shortDescription || '').trim(),
        fullDescription: (formData.fullDescription || '').trim() || undefined,
        sector: (formData.sector || '').trim(),
        batchOrYear: (formData.batchOrYear || '').trim() || undefined,
        relationship: (formData.relationship || '').trim(),
        status: (formData.status as PortfolioStatus) || 'active',
        logoUrl: (formData.logoUrl || '').trim() || undefined,
        imageUrl: (formData.imageUrl || '').trim() || undefined,
        websiteUrl: (formData.websiteUrl || '').trim() || undefined,
        location: (formData.location || '').trim() || undefined,
        founders: foundersInput
          ? foundersInput
              .split(',')
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        published: formData.published !== undefined ? formData.published : true,
        featured: Boolean(formData.featured),
        investmentDetails: formData.investmentDetails,
      };

      const url = editingRecord
        ? `/api/admin/portfolio/${editingRecord.id}`
        : '/api/admin/portfolio';
      const method = editingRecord ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to save record.');
        setIsSaving(false);
        return;
      }

      setIsEditorOpen(false);
      fetchRecords();
    } catch (err) {
      console.error('Error saving record:', err);
      setFormError('Network error while saving record.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Published
  const togglePublished = async (rec: PortfolioRecord) => {
    try {
      const res = await fetch(`/api/admin/portfolio/${rec.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !rec.published }),
      });

      if (res.ok) {
        fetchRecords();
      }
    } catch (err) {
      console.error('Failed to toggle published status:', err);
    }
  };

  // Delete Record
  const handleDelete = async (rec: PortfolioRecord) => {
    if (!window.confirm(`Are you sure you want to remove "${rec.name}" from verified records?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/portfolio/${rec.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchRecords();
      }
    } catch (err) {
      console.error('Failed to delete record:', err);
    }
  };

  // Bulk JSON Import
  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);

    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setJsonError('Input must be a valid JSON array of records.');
        return;
      }

      setIsSaving(true);
      let successCount = 0;
      for (const item of parsed) {
        const res = await fetch('/api/admin/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        });
        if (res.ok) successCount++;
      }

      setIsJsonModalOpen(false);
      setJsonInput('');
      fetchRecords();
      alert(`Successfully imported ${successCount} verified record(s).`);
    } catch (err: any) {
      setJsonError(`Invalid JSON syntax: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter === 'published' && !r.published) return false;
    if (statusFilter === 'draft' && r.published) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchSector = r.sector.toLowerCase().includes(q);
      const matchDesc = r.shortDescription.toLowerCase().includes(q);
      const matchRel = r.relationship.toLowerCase().includes(q);
      if (!matchName && !matchSector && !matchDesc && !matchRel) return false;
    }
    return true;
  });

  const sampleJsonSchema = JSON.stringify(
    [
      {
        type: 'company',
        name: 'Example AI Lab',
        headline: 'Next-Generation Sparse Compute Architecture',
        shortDescription: 'Hardware-accelerated sparse kernel execution for large language models.',
        fullDescription: 'Founded by Stanford AI researchers, building zero-latency inference kernels for real-time edge robotics.',
        sector: 'AI & Compute Infrastructure',
        batchOrYear: 'Batch 01 (2026)',
        relationship: 'Seed Investment',
        status: 'active',
        websiteUrl: 'https://example-ai.com',
        location: 'San Francisco, CA',
        founders: ['Dr. Sarah Chen', 'Alex Rivera'],
        investmentDetails: {
          stage: 'Pre-Seed',
          roundParticipation: 'Lead Accelerator Check',
        },
        published: true,
      },
    ],
    null,
    2
  );

  return (
    <div className="space-y-6">
      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
          <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Total Records</span>
          <span className="text-2xl font-bold font-mono text-[#F5F5F3] mt-1 block">{counts.total}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
          <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Published Live</span>
          <span className="text-2xl font-bold font-mono text-emerald-300 mt-1 block">{counts.published}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
          <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Staged Drafts</span>
          <span className="text-2xl font-bold font-mono text-amber-300 mt-1 block">{counts.drafts}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
          <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Companies</span>
          <span className="text-2xl font-bold font-mono text-[#F5F5F3] mt-1 block">{counts.company}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
          <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Founders</span>
          <span className="text-2xl font-bold font-mono text-purple-300 mt-1 block">{counts.founder}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034]">
          <span className="text-xs font-mono uppercase text-[#A5A5AA] block">Partners & Mentors</span>
          <span className="text-2xl font-bold font-mono text-blue-300 mt-1 block">
            {counts.partner + counts.mentor + counts.ecosystem}
          </span>
        </div>
      </div>

      {/* ACTION & CONTROLS TOOLBAR */}
      <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#303034] space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A5A5AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search records by name, sector, or relationship..."
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setJsonInput('');
                setJsonError(null);
                setIsJsonModalOpen(true);
              }}
              className="gap-1.5 text-xs"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Bulk JSON / Schema</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={openCreateModal}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Record</span>
            </Button>
          </div>
        </div>

        {/* Category & Visibility Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#303034]/60 pt-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="font-mono uppercase text-[#A5A5AA] mr-2">Category:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'company', label: 'Companies' },
              { id: 'investment', label: 'Investments' },
              { id: 'founder', label: 'Founders' },
              { id: 'partner', label: 'Partners' },
              { id: 'mentor', label: 'Mentors' },
              { id: 'ecosystem', label: 'Ecosystem' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setTypeFilter(cat.id)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  typeFilter === cat.id
                    ? 'bg-[#F5F5F3] text-[#050505]'
                    : 'bg-[#171719] text-[#A5A5AA] hover:text-[#F5F5F3]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono uppercase text-[#A5A5AA] mr-1">Visibility:</span>
            {(['all', 'published', 'draft'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setStatusFilter(v)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                  statusFilter === v
                    ? 'bg-[#F5F5F3] text-[#050505]'
                    : 'bg-[#171719] text-[#A5A5AA] hover:text-[#F5F5F3]'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RECORDS TABLE */}
      <div className="rounded-xl border border-[#303034] bg-[#0B0B0D] overflow-hidden">
        {isLoading && records.length === 0 ? (
          <div className="py-20 text-center">
            <span className="w-6 h-6 border-2 border-[#F5F5F3] border-t-transparent rounded-full animate-spin inline-block mb-3" />
            <p className="text-sm text-[#A5A5AA]">Loading verified records registry...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-20 text-center px-4">
            <Shield className="w-10 h-10 text-[#303034] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#F5F5F3]">No verified records in this view</h3>
            <p className="text-xs text-[#A5A5AA] max-w-sm mx-auto mt-1 leading-relaxed">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'No cataloged records match the current filter criteria.'
                : 'Zero verified records have been published yet. The owner supplies real records to populate the catalog.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button variant="primary" size="sm" onClick={openCreateModal} className="text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Verified Record</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#303034] bg-[#111114] text-[11px] font-mono uppercase text-[#A5A5AA]">
                  <th className="py-3.5 px-4 font-semibold">Entity / Person</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Sector</th>
                  <th className="py-3.5 px-4 font-semibold">Relationship</th>
                  <th className="py-3.5 px-4 font-semibold">Batch / Year</th>
                  <th className="py-3.5 px-4 font-semibold">Public Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303034]/60">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#171719]/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#F5F5F3]">{rec.name}</div>
                      {rec.headline && (
                        <div className="text-xs text-[#A5A5AA] mt-0.5 line-clamp-1">
                          {rec.headline}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#171719] border border-[#303034] text-[#A5A5AA]">
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-[#F5F5F3] whitespace-nowrap">
                      {rec.sector}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#A5A5AA] whitespace-nowrap">
                      {rec.relationship}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-[#A5A5AA] whitespace-nowrap">
                      {rec.batchOrYear || '—'}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePublished(rec)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          rec.published
                            ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/50'
                            : 'bg-[#171719] border border-[#303034] text-[#A5A5AA] hover:text-[#F5F5F3]'
                        }`}
                      >
                        {rec.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(rec)}
                        className="p-1.5 rounded text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719] cursor-pointer"
                        title="Edit record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(rec)}
                        className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT RECORD MODAL */}
      {isEditorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
        >
          <div className="bg-[#0B0B0D] border border-[#303034] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#303034] bg-[#111114] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#F5F5F3]">
                  {editingRecord ? `Edit Record: ${editingRecord.name}` : 'Add Verified Record'}
                </h2>
                <p className="text-xs text-[#A5A5AA] mt-0.5">
                  Records added here immediately sync with the persistent portfolio storage.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-lg text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Category Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as PortfolioRecordType })
                    }
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  >
                    <option value="company">Portfolio Company</option>
                    <option value="investment">Investment / Deal</option>
                    <option value="founder">Founder Profile</option>
                    <option value="partner">Institutional / Design Partner</option>
                    <option value="mentor">Mentor / Technical Advisor</option>
                    <option value="ecosystem">Ecosystem Connection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Entity / Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NeuralFlux or Dr. Elena Rostova"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Sector / Focus Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI & Machine Learning, Robotics"
                    value={formData.sector || ''}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Relationship Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seed Investment, Visiting Technical Advisor"
                    value={formData.relationship || ''}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Batch / Cohort Timing
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Batch 01 (2026)"
                    value={formData.batchOrYear || ''}
                    onChange={(e) => setFormData({ ...formData, batchOrYear: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as PortfolioStatus })
                    }
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="alumni">Alumni</option>
                    <option value="partner">Partner</option>
                    <option value="advisor">Advisor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                  Headline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Real-Time Streaming Inference Hardware"
                  value={formData.headline || ''}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                  Short Description / Thesis * (Visible on cards)
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Concise 1-2 sentence description..."
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                  Expanded Dossier / Background (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed background, technical breakdown, or verified milestone notes..."
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.websiteUrl || ''}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                    Logo or Portrait URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (or leave blank for monogram)"
                    value={formData.logoUrl || formData.imageUrl || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, logoUrl: e.target.value, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[#A5A5AA] text-[11px] mb-1">
                  Founders / Team Members (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova, Marcus Wei"
                  value={foundersInput}
                  onChange={(e) => setFoundersInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171719] border border-[#303034] rounded-lg text-xs text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                />
              </div>

              {/* Published checkbox */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#111114] border border-[#303034]/60">
                <input
                  type="checkbox"
                  id="publishedToggle"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-[#303034] text-[#F5F5F3] focus:ring-0 w-4 h-4"
                />
                <label htmlFor="publishedToggle" className="cursor-pointer">
                  <span className="font-bold text-[#F5F5F3] block">Publish Record to Public Directory</span>
                  <span className="text-[#A5A5AA] block text-[11px]">
                    When checked, this verified record will be immediately displayed on the public /network page.
                  </span>
                </label>
              </div>

              <div className="p-4 border-t border-[#303034] flex items-center justify-end gap-3 pt-4">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsEditorOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingRecord ? 'Save Changes' : 'Create Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON BULK IMPORT / SCHEMA MODAL */}
      {isJsonModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
        >
          <div className="bg-[#0B0B0D] border border-[#303034] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#303034] bg-[#111114] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#F5F5F3]">
                  Bulk Import & Ecosystem Schema
                </h2>
                <p className="text-xs text-[#A5A5AA] mt-0.5">
                  Paste verified JSON records directly or inspect the official schema definition.
                </p>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="p-2 rounded-lg text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Reference Schema */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Kicker>OFFICIAL VERIFIED RECORD SCHEMA (TEMPLATE)</Kicker>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={() => {
                      navigator.clipboard.writeText(sampleJsonSchema);
                      alert('Template copied to clipboard.');
                    }}
                  >
                    Copy Template
                  </Button>
                </div>
                <pre className="p-4 rounded-xl bg-[#050505] border border-[#303034] text-[11px] font-mono text-[#A5A5AA] overflow-x-auto">
                  {sampleJsonSchema}
                </pre>
              </div>

              {/* Paste Area */}
              <form onSubmit={handleBulkImport} className="space-y-4">
                <Kicker>PASTE VERIFIED JSON ARRAY TO IMPORT</Kicker>
                {jsonError && (
                  <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-200">
                    {jsonError}
                  </div>
                )}
                <textarea
                  rows={8}
                  placeholder="Paste JSON array [...] here"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-[#171719] border border-[#303034] rounded-xl text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-[#A5A5AA]">
                    Adheres strictly to verified non-fabrication standard.
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setIsJsonModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      disabled={isSaving || !jsonInput.trim()}
                    >
                      {isSaving ? 'Importing...' : 'Import Records'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
