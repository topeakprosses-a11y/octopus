import React from 'react';
import { PortfolioRecord } from '@/src/types/portfolio';
import { Button } from '@/src/components/ui/Button';
import { Kicker } from '@/src/components/ui/Kicker';
import {
  X,
  ExternalLink,
  Globe,
  MapPin,
  Calendar,
  Building,
  User,
  Shield,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';

interface PortfolioDetailModalProps {
  record: PortfolioRecord;
  onClose: () => void;
}

export const PortfolioDetailModal: React.FC<PortfolioDetailModalProps> = ({
  record,
  onClose,
}) => {
  const isPerson = ['founder', 'partner', 'mentor'].includes(record.type);

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono uppercase bg-[#171719] border border-[#303034] text-[#F5F5F3]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active Portfolio
          </span>
        );
      case 'alumni':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono uppercase bg-[#171719] border border-[#303034] text-[#A5A5AA]">
            Alumni
          </span>
        );
      case 'partner':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono uppercase bg-[#171719] border border-[#303034] text-purple-300">
            Strategic Partner
          </span>
        );
      case 'advisor':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono uppercase bg-[#171719] border border-[#303034] text-amber-300">
            Advisor / Operator
          </span>
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
    >
      <div className="bg-[#0B0B0D] border border-[#303034] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#303034] bg-[#111114] flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {record.logoUrl || record.imageUrl ? (
              <div
                className={`w-16 h-16 rounded-2xl bg-[#171719] border border-[#303034] overflow-hidden flex items-center justify-center p-2 shrink-0 ${
                  isPerson ? 'rounded-full' : ''
                }`}
              >
                <img
                  src={record.logoUrl || record.imageUrl}
                  alt={record.name}
                  className={`w-full h-full object-contain filter grayscale ${
                    isPerson ? 'object-cover' : ''
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div
                className={`w-16 h-16 rounded-2xl bg-[#171719] border border-[#303034] flex items-center justify-center text-lg font-mono font-bold text-[#F5F5F3] shrink-0 ${
                  isPerson ? 'rounded-full' : ''
                }`}
              >
                {initials}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-1">
                {getStatusBadge()}
                <span className="text-[11px] font-mono text-[#A5A5AA] uppercase">
                  {record.type}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-[#F5F5F3]">
                {record.name}
              </h2>

              {record.headline && (
                <p className="text-xs text-[#A5A5AA] mt-1 font-medium">
                  {record.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#A5A5AA] mt-2 font-mono">
                <span className="text-[#F5F5F3]">{record.sector}</span>
                {record.batchOrYear && (
                  <>
                    <span className="text-[#303034]">·</span>
                    <span>{record.batchOrYear}</span>
                  </>
                )}
                {record.location && (
                  <>
                    <span className="text-[#303034]">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {record.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719] cursor-pointer"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
          {/* Executive Overview / Thesis */}
          <div className="space-y-2">
            <Kicker>OVERVIEW & THESIS</Kicker>
            <p className="text-[#F5F5F3] font-medium bg-[#111114] p-4 rounded-xl border border-[#303034]/60">
              {record.shortDescription}
            </p>
          </div>

          {/* Full description if present */}
          {record.fullDescription && (
            <div className="space-y-2">
              <Kicker>EXPANDED DOSSIER</Kicker>
              <div className="bg-[#111114] p-4 rounded-xl border border-[#303034]/60 text-xs text-[#A5A5AA] leading-relaxed whitespace-pre-wrap">
                {record.fullDescription}
              </div>
            </div>
          )}

          {/* Relationship & Program Engagement */}
          <div className="bg-[#111114] p-4 rounded-xl border border-[#303034]/60 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#F5F5F3]" />
              <span className="text-xs font-mono uppercase text-[#F5F5F3] font-semibold">
                Engagement & Verification
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#A5A5AA] block text-[11px] font-mono">Relationship:</span>
                <span className="text-[#F5F5F3] font-medium mt-0.5 block">
                  {record.relationship}
                </span>
              </div>
              {record.batchOrYear && (
                <div>
                  <span className="text-[#A5A5AA] block text-[11px] font-mono">Batch / Cohort:</span>
                  <span className="text-[#F5F5F3] font-medium mt-0.5 block">
                    {record.batchOrYear}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Investment Details (Only rendered if confirmed and supplied) */}
          {record.investmentDetails && (
            <div className="bg-[#111114] p-4 rounded-xl border border-[#303034]/60 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F5F5F3]" />
                <span className="text-xs font-mono uppercase text-[#F5F5F3] font-semibold">
                  Investment Participation (Verified)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {record.investmentDetails.stage && (
                  <div>
                    <span className="text-[#A5A5AA] block text-[11px] font-mono">Financing Stage:</span>
                    <span className="text-[#F5F5F3] font-medium mt-0.5 block">
                      {record.investmentDetails.stage}
                    </span>
                  </div>
                )}
                {record.investmentDetails.roundParticipation && (
                  <div>
                    <span className="text-[#A5A5AA] block text-[11px] font-mono">Role:</span>
                    <span className="text-[#F5F5F3] font-medium mt-0.5 block">
                      {record.investmentDetails.roundParticipation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Founders / Team if present */}
          {record.founders && record.founders.length > 0 && (
            <div className="space-y-2">
              <Kicker>FOUNDERS</Kicker>
              <div className="flex flex-wrap gap-2">
                {record.founders.map((founder, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#111114] border border-[#303034] text-xs font-medium text-[#F5F5F3]"
                  >
                    {founder}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {record.tags && record.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {record.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#171719] text-[#A5A5AA] border border-[#303034]/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#303034] bg-[#111114] flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono text-[#A5A5AA]">
            Octopus Record ID: {record.id}
          </span>

          <div className="flex items-center gap-2">
            {record.websiteUrl && (
              <a
                href={
                  record.websiteUrl.startsWith('http')
                    ? record.websiteUrl
                    : `https://${record.websiteUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                  <span>Visit Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            )}
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
