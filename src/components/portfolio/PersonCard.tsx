import React from 'react';
import { PortfolioRecord } from '@/src/types/portfolio';
import { Card } from '@/src/components/ui/Card';
import { ArrowUpRight, User, ExternalLink, Globe } from 'lucide-react';

interface PersonCardProps {
  record: PortfolioRecord;
  onClick?: () => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ record, onClick }) => {
  const initials = record.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const getRoleLabel = () => {
    switch (record.type) {
      case 'founder':
        return 'Founder';
      case 'partner':
        return 'Partner';
      case 'mentor':
        return 'Mentor / Advisor';
      case 'ecosystem':
        return 'Ecosystem Partner';
      default:
        return 'Participant';
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
        {/* Header with portrait or initials */}
        <div className="flex items-start gap-4 mb-4">
          {record.imageUrl ? (
            <div className="w-14 h-14 rounded-full bg-[#171719] border border-[#303034] overflow-hidden shrink-0">
              <img
                src={record.imageUrl}
                alt={record.name}
                className="w-full h-full object-cover filter grayscale"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#171719] border border-[#303034] flex items-center justify-center text-sm font-mono font-bold text-[#F5F5F3] shrink-0">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold tracking-tight text-[#F5F5F3] group-hover:text-white transition-colors truncate">
                {record.name}
              </h3>
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#171719] border border-[#303034] text-[#A5A5AA]">
                {getRoleLabel()}
              </span>
            </div>

            {record.headline && (
              <p className="text-xs text-[#A5A5AA] mt-1 font-medium line-clamp-1">
                {record.headline}
              </p>
            )}

            <div className="text-[11px] font-mono text-[#A5A5AA] mt-1">
              {record.relationship}
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs sm:text-sm text-[#A5A5AA] leading-relaxed line-clamp-3 mb-4 flex-1">
          {record.shortDescription}
        </p>

        {/* Footer Sector & Batch */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#303034]/60 text-[11px] font-mono text-[#A5A5AA]">
          <span className="px-2 py-0.5 rounded bg-[#171719] border border-[#303034] text-[#F5F5F3]">
            {record.sector}
          </span>

          {record.location && (
            <span className="text-[11px] text-[#A5A5AA]">{record.location}</span>
          )}
        </div>
      </div>

      {/* External link footer if present */}
      {record.websiteUrl && (
        <div className="px-6 py-2.5 bg-[#111114] border-t border-[#303034]/40 flex items-center justify-between text-xs text-[#A5A5AA] group-hover:bg-[#171719] transition-colors">
          <span className="truncate max-w-[200px] text-[11px] font-mono">
            {record.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
          <span className="text-[11px] text-[#F5F5F3] flex items-center gap-1 font-medium">
            <span>Profile</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      )}
    </Card>
  );
};
