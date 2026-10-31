import React from 'react';

interface KickerProps {
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
}

export const Kicker: React.FC<KickerProps> = ({
  children,
  className = '',
  withDot = false,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#A5A5AA] ${className}`}
    >
      {withDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#A5A5AA]/60 shrink-0" aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
};
