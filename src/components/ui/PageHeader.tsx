import React from 'react';
import { Container } from '@/src/components/ui/Container';
import { Kicker } from '@/src/components/ui/Kicker';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  kicker: string;
  title: string;
  subtitle: string;
  onBack?: () => void;
  backLabel?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  kicker,
  title,
  subtitle,
  onBack,
  backLabel = 'Back to Home',
  action,
}) => {
  return (
    <div className="pt-10 pb-14 md:pt-16 md:pb-20 border-b border-[#303034]/50 bg-gradient-to-b from-[#0B0B0D]/50 to-transparent">
      <Container>
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A5A5AA] hover:text-[#F5F5F3] mb-6 md:mb-8 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F3] rounded px-1 -mx-1 min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>{backLabel}</span>
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-3xl">
            <Kicker className="mb-3 sm:mb-4">{kicker}</Kicker>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F5F3] leading-[1.1] text-balance break-words">
              {title}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-[#A5A5AA] leading-relaxed max-w-2xl text-pretty">
              {subtitle}
            </p>
          </div>

          {action && <div className="shrink-0 w-full sm:w-auto pt-2 md:pt-0">{action}</div>}
        </div>
      </Container>
    </div>
  );
};
