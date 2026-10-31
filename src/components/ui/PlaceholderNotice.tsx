import React from 'react';
import { Clock, Info } from 'lucide-react';

interface PlaceholderNoticeProps {
  badge?: string;
  title: string;
  children: React.ReactNode;
  icon?: 'clock' | 'info';
  className?: string;
  action?: React.ReactNode;
}

export const PlaceholderNotice: React.FC<PlaceholderNoticeProps> = ({
  badge = 'STATUS: PENDING',
  title,
  children,
  icon = 'clock',
  className = '',
  action,
}) => {
  return (
    <div
      className={`rounded-xl border border-[#303034] bg-[#0B0B0D] p-5 sm:p-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#303034]/60">
        <div className="flex items-center gap-2">
          {icon === 'clock' ? (
            <Clock className="w-4 h-4 text-[#A5A5AA]" />
          ) : (
            <Info className="w-4 h-4 text-[#A5A5AA]" />
          )}
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#A5A5AA]">
            {badge}
          </span>
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="mt-4">
        <h3 className="text-base font-bold text-[#F5F5F3]">{title}</h3>
        <div className="mt-1.5 text-xs sm:text-sm text-[#A5A5AA] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
