import React from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Hexagon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface PortfolioEmptyStateProps {
  category: string;
  hasFilters: boolean;
  onClearFilters?: () => void;
  onApply?: () => void;
  onContact?: () => void;
}

export const PortfolioEmptyState: React.FC<PortfolioEmptyStateProps> = ({
  category,
  hasFilters,
  onClearFilters,
  onApply,
  onContact,
}) => {
  const getCategoryDetails = () => {
    switch (category) {
      case 'company':
        return {
          title: 'Batch 01 Portfolios in Selection',
          description:
            'Octopus is actively evaluating early-stage applicants for Batch 01. Confirmed equity investments and venture portfolios will be listed following cohort induction.',
          statusNotice: 'SELECTION PHASE · BATCH 01 ACTIVE',
        };
      case 'investment':
        return {
          title: 'Direct Investment Ledger Pending',
          description:
            'Co-investment syndicates and direct accelerator check allocations are finalized alongside cohort onboarding. Verified terms and syndicates will be published upon deal execution.',
          statusNotice: 'SYNDICATE LEDGER · PENDING CLOSING',
        };
      case 'founder':
        return {
          title: 'Founder Directory in Formation',
          description:
            'A verified index of inducted technical founders, open-source maintainers, and hardware architects will be published once cohort rosters are finalized.',
          statusNotice: 'FOUNDER REGISTRY · COHORT IN FORMATION',
        };
      case 'partner':
        return {
          title: 'Strategic Partners & Design Sponsors',
          description:
            'We are actively formalizing infrastructure grants, enterprise design partnerships, and compute credits with leading technology ecosystems.',
          statusNotice: 'PARTNERSHIP DESK · INQUIRIES OPEN',
        };
      case 'mentor':
        return {
          title: 'Visiting Operators & Advisory Circle',
          description:
            '1-on-1 operator sessions, technical advisory councils, and EIR appointments are reserved for accepted founders and confirmed prior to sprint commencement.',
          statusNotice: 'ADVISORY GUILD · PRIVATE ACCESS',
        };
      case 'ecosystem':
        return {
          title: 'Ecosystem Connections & Research Labs',
          description:
            'Institutional compute clusters, research lab affiliations, and venture syndicate pipelines will be detailed as formal relationships are certified.',
          statusNotice: 'ECOSYSTEM NETWORK · PRE-ANNOUNCEMENT',
        };
      default:
        return {
          title: 'Portfolio & Ecosystem Records Pending',
          description:
            'Octopus adheres to a strict verified-record standard. We do not display speculative logos, mock startups, or unconfirmed investments. Batch 01 selections are currently underway.',
          statusNotice: 'DIRECTORY STATUS · VERIFIED LEDGER ONLY',
        };
    }
  };

  const details = getCategoryDetails();

  if (hasFilters) {
    return (
      <Card
        variant="flat"
        padding="lg"
        className="text-center flex flex-col items-center py-16 px-6 border-[#303034] bg-[#0B0B0D]"
      >
        <div className="w-12 h-12 rounded-xl bg-[#171719] border border-[#303034] flex items-center justify-center text-[#A5A5AA] mb-4">
          <Hexagon className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-[#F5F5F3]">No matching verified records</h3>
        <p className="mt-2 text-xs sm:text-sm text-[#A5A5AA] max-w-md">
          No records match your active search and sector filters. Try adjusting your search query or selecting all sectors.
        </p>
        {onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="mt-6 text-xs"
          >
            Clear Active Filters
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card
      variant="flat"
      padding="lg"
      className="text-center flex flex-col items-center py-16 sm:py-20 md:py-24 px-6 border-[#303034] bg-[#0B0B0D]"
    >
      <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-[#171719] border border-[#303034] flex items-center justify-center text-[#F5F5F3] mb-6 shrink-0 shadow-lg shadow-black/50">
        <Hexagon className="w-7 sm:w-8 h-7 sm:h-8 stroke-[1.5]" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171719] border border-[#303034] text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#A5A5AA] mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F5F5F3] animate-pulse" />
        <span>{details.statusNotice}</span>
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#F5F5F3] text-balance max-w-lg">
        {details.title}
      </h2>

      <p className="mt-4 text-sm sm:text-base text-[#A5A5AA] max-w-xl leading-relaxed text-pretty">
        {details.description}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
        {onApply && (
          <Button
            variant="primary"
            size="md"
            onClick={onApply}
            className="gap-2 justify-center"
          >
            <span>Apply for Batch 01 Consideration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}

        {onContact && (
          <Button
            variant="outline"
            size="md"
            onClick={onContact}
            className="justify-center"
          >
            <span>Inquire for Partner Syndicate</span>
          </Button>
        )}
      </div>
    </Card>
  );
};
