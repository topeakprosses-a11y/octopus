import React from 'react';
import { PortfolioRecord } from '@/src/types/portfolio';
import { Card } from '@/src/components/ui/Card';
import { ExternalLink, ArrowUpRight, Building2, TrendingUp, Layers } from 'lucide-react';

interface PortfolioCardProps {
  record: PortfolioRecord;
  onClick?: () => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ record, onClick }) => {
  const isInvestment = record.type === 'investment';

  // Compute fallback monogram if no logo image provided
  const initials = record.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const getStatusBadge = () => {
    switch (record.status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#171719] border border-[#303034] text-[#F5F5F3]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active Portfolio
          </span>
        );
      case 'alumni':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#171719] border border-[#303034] text-[#A5A5AA]">
            Alumni
          </span>
        );
      case 'partner':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#171719] border border-[#303034] text-purple-300">
            Partner
          </span>
        );
      case 'advisor':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#171719] border border-[#303034] text-amber-300">
            Advisor
          </span>
        );
    }
  };

  return (
    <Card
      variant="flat"
      padding="none"
      className="group relative flex flex-col justify-between overflow-hidden border-[#303034] bg-[#0B0B0D] hover:border-[#F5F5F3]/50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Top meta row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {record.logoUrl ? (
              <div className="w-12 h-12 rounded-xl bg-[#171719] border border-[#303034] overflow-hidden flex items-center justify-center p-2 shrink-0">
                <img
                  src={record.logoUrl}
                  alt={`${record.name} logo`}
                  className="w-full h-full object-contain filter grayscale contrast-125"
                  onError={(e) => {
                    // Fallback to monogram if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#171719] border border-[#303034] flex items-center justify-center text-sm font-mono font-bold text-[#F5F5F3] shrink-0">
                {initials}
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold tracking-tight text-[#F5F5F3] group-hover:text-white transition-colors flex items-center gap-2">
                <span>{record.name}</span>
                <ArrowUpRight className="w-4 h-4 text-[#A5A5AA] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>
              {record.headline && (
                <p className="text-xs text-[#A5A5AA] mt-0.5 font-medium line-clamp-1">
                  {record.headline}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0">{getStatusBadge()}</div>
        </div>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-[#A5A5AA] leading-relaxed line-clamp-3 mb-4 flex-1">
          {record.shortDescription}
        </p>

        {/* Tags / Sector & Batch */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#303034]/60 text-[11px] font-mono text-[#A5A5AA]">
          <span className="px-2 py-0.5 rounded bg-[#171719] border border-[#303034] text-[#F5F5F3]">
            {record.sector}
          </span>

          {record.batchOrYear && (
            <span className="px-2 py-0.5 rounded bg-[#111114] border border-[#303034]/70 text-[#A5A5AA]">
              {record.batchOrYear}
            </span>
          )}

          <span className="ml-auto text-[10px] text-[#A5A5AA] uppercase tracking-wider">
            {record.relationship}
          </span>
        </div>
      </div>

      {/* Footer bar */}
      {record.websiteUrl && (
        <div className="px-6 py-2.5 bg-[#111114] border-t border-[#303034]/40 flex items-center justify-between text-xs text-[#A5A5AA] group-hover:bg-[#171719] transition-colors">
          <span className="truncate max-w-[200px] text-[11px] font-mono">
            {record.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
          <span className="text-[11px] text-[#F5F5F3] flex items-center gap-1 font-medium">
            <span>Dossier</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      )}
    </Card>
  );
};
