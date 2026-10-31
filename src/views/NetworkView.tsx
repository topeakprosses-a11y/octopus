import React, { useState, useEffect } from 'react';
import { Container } from '@/src/components/ui/Container';
import { Button } from '@/src/components/ui/Button';
import { Kicker } from '@/src/components/ui/Kicker';
import { Card } from '@/src/components/ui/Card';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { brand } from '@/src/theme/tokens';
import { supportingPagesContent } from '@/src/content/supportingPages';
import { PageView } from '@/src/components/layout/Navbar';
import { PortfolioRecord, PortfolioRecordType } from '@/src/types/portfolio';
import { PortfolioCard } from '@/src/components/portfolio/PortfolioCard';
import { PersonCard } from '@/src/components/portfolio/PersonCard';
import { PortfolioDetailModal } from '@/src/components/portfolio/PortfolioDetailModal';
import { PortfolioEmptyState } from '@/src/components/portfolio/PortfolioEmptyState';
import {
  ArrowRight,
  Search,
  Building2,
  Users,
  Handshake,
  GraduationCap,
  LayoutGrid,
  List,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  X,
} from 'lucide-react';

interface NetworkViewProps {
  onNavigate: (view: PageView) => void;
  onOpenApply?: () => void;
}

interface CategoryOption {
  id: string;
  typeFilter: string;
  label: string;
  countKey: keyof CategoryCounts;
}

interface CategoryCounts {
  all: number;
  company: number;
  investment: number;
  founder: number;
  partner: number;
  mentor: number;
  ecosystem: number;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', typeFilter: 'all', label: 'All Records', countKey: 'all' },
  { id: 'companies', typeFilter: 'company', label: 'Portfolio Companies', countKey: 'company' },
  { id: 'investments', typeFilter: 'investment', label: 'Investments', countKey: 'investment' },
  { id: 'founders', typeFilter: 'founder', label: 'Founders', countKey: 'founder' },
  { id: 'partners', typeFilter: 'partner', label: 'Partners', countKey: 'partner' },
  { id: 'mentors', typeFilter: 'mentor', label: 'Mentors & Advisors', countKey: 'mentor' },
  { id: 'ecosystem', typeFilter: 'ecosystem', label: 'Ecosystem', countKey: 'ecosystem' },
];

export const NetworkView: React.FC<NetworkViewProps> = ({ onNavigate, onOpenApply }) => {
  const { network } = supportingPagesContent;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [records, setRecords] = useState<PortfolioRecord[]>([]);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [counts, setCounts] = useState<CategoryCounts>({
    all: 0,
    company: 0,
    investment: 0,
    founder: 0,
    partner: 0,
    mentor: 0,
    ecosystem: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeModalRecord, setActiveModalRecord] = useState<PortfolioRecord | null>(null);

  // Fetch verified portfolio records from API
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const selectedCat = CATEGORIES.find((c) => c.id === activeCategory);
      const typeParam = selectedCat ? selectedCat.typeFilter : 'all';

      const params = new URLSearchParams();
      if (typeParam !== 'all') params.append('category', typeParam);
      if (selectedSector !== 'all') params.append('sector', selectedSector);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/portfolio?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
        if (data.counts) setCounts(data.counts);
        if (data.sectors) setAvailableSectors(data.sectors);
      }
    } catch (err) {
      console.error('Failed to load portfolio records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [activeCategory, selectedSector]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecords();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedSector !== 'all');

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSector('all');
  };

  const currentCategoryOption = CATEGORIES.find((c) => c.id === activeCategory);
  const currentCategoryType = currentCategoryOption?.typeFilter || 'all';

  return (
    <div className="flex flex-col">
      {/* 1. PAGE HEADER */}
      <PageHeader
        kicker={network.kicker}
        title={network.title}
        subtitle={network.subtitle}
        onBack={() => onNavigate('home')}
        backLabel="Back to Overview"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('contact')}
              className="gap-2"
            >
              <span>Partner Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        }
      />

      {/* 2. CELESTIAL NETWORK VISUAL BANNER */}
      <section className="py-12 border-b border-[#303034]/40 bg-[#0B0B0D]/20">
        <Container>
          <div className="relative rounded-2xl overflow-hidden border border-[#303034] bg-[#050505] aspect-[21/9] sm:aspect-[2.6/1] group">
            <img
              src={brand.assets.networkGlobe}
              alt="Octopus global network orbits"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#A5A5AA] font-mono gap-2">
              <span className="uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#F5F5F3]" />
                VERIFIED ACCELERATOR DIRECTORY
              </span>
              <span className="text-[#F5F5F3] bg-[#0B0B0D]/80 backdrop-blur-sm px-2.5 py-1 rounded border border-[#303034]">
                {counts.all > 0
                  ? `${counts.all} VERIFIED ENTITIES CATALOGED`
                  : 'BATCH 01 CANDIDATES UNDER INVESTOR REVIEW'}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. REUSABLE DIRECTORY FILTER & CONTROLS */}
      <section className="py-8 border-b border-[#303034]/40 bg-[#0B0B0D]/30 sticky top-20 z-20 backdrop-blur-md">
        <Container>
          <div className="space-y-4">
            {/* Filter Tabs by Category */}
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 sm:pb-0">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0B0B0D] border border-[#303034] shrink-0">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const count = counts[cat.countKey] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setSelectedSector('all');
                      }}
                      className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap min-h-[36px] flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#F5F5F3] text-[#050505] shadow-sm'
                          : 'text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="font-mono text-[10px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* View Switcher (Desktop & Tablet) */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-[#0B0B0D] border border-[#303034] shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#171719] text-[#F5F5F3]'
                      : 'text-[#A5A5AA] hover:text-[#F5F5F3]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#171719] text-[#F5F5F3]'
                      : 'text-[#A5A5AA] hover:text-[#F5F5F3]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search and Secondary Sector Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#A5A5AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, thesis, technology, or sector..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#303034] bg-[#0B0B0D] pl-10 pr-9 py-2 text-xs text-[#F5F5F3] placeholder:text-[#A5A5AA]/50 focus:border-[#F5F5F3] focus:outline-none min-h-[38px]"
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

              {availableSectors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-[#A5A5AA] whitespace-nowrap">
                    Sector:
                  </span>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="px-3 py-2 bg-[#0B0B0D] border border-[#303034] rounded-xl text-xs text-[#F5F5F3] focus:outline-none focus:border-[#F5F5F3] cursor-pointer min-h-[38px]"
                  >
                    <option value="all">All Sectors</option>
                    {availableSectors.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. MAIN RECORDS DISPLAY AREA */}
      <section className="py-16 sm:py-20 border-b border-[#303034]/40 min-h-[420px]">
        <Container>
          {isLoading && records.length === 0 ? (
            <div className="py-24 text-center">
              <span className="w-6 h-6 border-2 border-[#F5F5F3] border-t-transparent rounded-full animate-spin inline-block mb-3" />
              <p className="text-sm font-mono text-[#A5A5AA]">Querying verified directory ledger...</p>
            </div>
          ) : records.length === 0 ? (
            /* Pristine Intentional Empty State */
            <PortfolioEmptyState
              category={currentCategoryType}
              hasFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onApply={onOpenApply || (() => onNavigate('apply'))}
              onContact={() => onNavigate('contact')}
            />
          ) : viewMode === 'grid' ? (
            /* Cards Grid Display */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => {
                const isPerson = ['founder', 'partner', 'mentor'].includes(record.type);
                if (isPerson) {
                  return (
                    <PersonCard
                      key={record.id}
                      record={record}
                      onClick={() => setActiveModalRecord(record)}
                    />
                  );
                }
                return (
                  <PortfolioCard
                    key={record.id}
                    record={record}
                    onClick={() => setActiveModalRecord(record)}
                  />
                );
              })}
            </div>
          ) : (
            /* Dense Venture List Table Display */
            <div className="rounded-xl border border-[#303034] bg-[#0B0B0D] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#303034] bg-[#111114] text-[11px] font-mono uppercase text-[#A5A5AA]">
                      <th className="py-3 px-4 font-semibold">Entity / Person</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Sector</th>
                      <th className="py-3 px-4 font-semibold">Relationship</th>
                      <th className="py-3 px-4 font-semibold">Timing / Batch</th>
                      <th className="py-3 px-4 font-semibold text-right">Dossier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#303034]/60">
                    {records.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setActiveModalRecord(r)}
                        className="hover:bg-[#171719]/50 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#F5F5F3] group-hover:text-white">
                            {r.name}
                          </div>
                          {r.headline && (
                            <div className="text-xs text-[#A5A5AA] mt-0.5 line-clamp-1">
                              {r.headline}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#171719] border border-[#303034] text-[#A5A5AA]">
                            {r.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-[#F5F5F3] whitespace-nowrap">
                          {r.sector}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#A5A5AA] whitespace-nowrap">
                          {r.relationship}
                        </td>
                        <td className="py-4 px-4 text-xs font-mono text-[#A5A5AA] whitespace-nowrap">
                          {r.batchOrYear || '—'}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveModalRecord(r);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#F5F5F3] hover:underline"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 5. ECOSYSTEM EXPANSION ROADMAP */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="max-w-2xl mb-12">
            <Kicker className="mb-3">ECOSYSTEM ENGAGEMENT</Kicker>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F3]">
              How the network connects.
            </h2>
            <p className="mt-4 text-base text-[#A5A5AA]">
              Four structured channels through which founders, operators, and institutional collaborators engage with Octopus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="flat" padding="md" className="border-[#303034] bg-[#0B0B0D]">
              <Building2 className="w-5 h-5 text-[#F5F5F3] mb-4" />
              <h3 className="text-base font-bold text-[#F5F5F3]">Portfolio Companies</h3>
              <p className="text-xs text-[#A5A5AA] mt-2 leading-relaxed">
                Direct peer exchange between founders across kernel engineering, model architecture, enterprise pipelines, and talent.
              </p>
            </Card>

            <Card variant="flat" padding="md" className="border-[#303034] bg-[#0B0B0D]">
              <GraduationCap className="w-5 h-5 text-[#F5F5F3] mb-4" />
              <h3 className="text-base font-bold text-[#F5F5F3]">Operator Mentors</h3>
              <p className="text-xs text-[#A5A5AA] mt-2 leading-relaxed">
                Dedicated 1-on-1 office hours with seasoned CTOs, technical founders, and scaling executives who built enduring companies.
              </p>
            </Card>

            <Card variant="flat" padding="md" className="border-[#303034] bg-[#0B0B0D]">
              <Handshake className="w-5 h-5 text-[#F5F5F3] mb-4" />
              <h3 className="text-base font-bold text-[#F5F5F3]">Enterprise Partners</h3>
              <p className="text-xs text-[#A5A5AA] mt-2 leading-relaxed">
                Pre-negotiated design partner agreements, proof-of-concept testing, and production compute access with infrastructure leaders.
              </p>
            </Card>

            <Card variant="flat" padding="md" className="border-[#303034] bg-[#0B0B0D]">
              <Users className="w-5 h-5 text-[#F5F5F3] mb-4" />
              <h3 className="text-base font-bold text-[#F5F5F3]">Venture Syndicate</h3>
              <p className="text-xs text-[#A5A5AA] mt-2 leading-relaxed">
                Curated institutional investors invited to private Demo Day previews and structured follow-on syndication rounds.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* 6. DETAIL MODAL */}
      {activeModalRecord && (
        <PortfolioDetailModal
          record={activeModalRecord}
          onClose={() => setActiveModalRecord(null)}
        />
      )}
    </div>
  );
};
