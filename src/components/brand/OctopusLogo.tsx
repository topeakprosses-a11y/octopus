import React from 'react';
import { brand } from '@/src/theme/tokens';

interface OctopusLogoProps {
  /**
   * 'emblem': Just the silver octopus icon
   * 'lockup': Emblem + 'OCTOPUS' wordmark (as seen in header and footer)
   * 'hero': Large centered presentation
   */
  variant?: 'emblem' | 'lockup' | 'hero';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const OctopusLogo: React.FC<OctopusLogoProps> = ({
  variant = 'lockup',
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const logoSrc = brand.assets.logo;

  // Sizing tokens for the emblem
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.22em]',
    md: 'text-base tracking-[0.25em]',
    lg: 'text-xl tracking-[0.28em]',
  };

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 overflow-hidden rounded-full border border-[#303034]/60 bg-[#0B0B0D] shadow-2xl">
          <img
            src={logoSrc}
            alt="Octopus Accelerator Emblem"
            className="w-full h-full object-cover scale-110 contrast-125"
            loading="eager"
            onError={(e) => {
              // Try fallback path if needed
              const target = e.currentTarget;
              if (!target.src.includes('/public/')) {
                target.src = '/public' + logoSrc;
              }
            }}
          />
          {/* Subtle vignette blend */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#050505]/80 pointer-events-none" />
        </div>
        <h1 className="mt-8 font-sans font-bold text-2xl sm:text-3xl tracking-[0.3em] text-[#F5F5F3] uppercase">
          {brand.name}
        </h1>
        {showSubtitle && (
          <p className="mt-2 text-xs sm:text-sm tracking-[0.35em] text-[#A5A5AA] uppercase font-medium">
            {brand.tagline}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem container: uses the top portion of the official asset cropped to the octopus head & tentacles */}
      <div
        className={`relative ${emblemSizes[size]} shrink-0 overflow-hidden rounded-md border border-[#303034]/40 bg-[#0B0B0D]`}
      >
        <img
          src={logoSrc}
          alt="Octopus Logo"
          className="w-full h-full object-cover scale-125 -translate-y-[8%]"
          loading="eager"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('/public/')) {
              target.src = '/public' + logoSrc;
            }
          }}
        />
        <div className="absolute inset-0 bg-radial from-transparent to-[#050505]/40 pointer-events-none" />
      </div>

      {variant === 'lockup' && (
        <div className="flex flex-col">
          <span className={`font-sans font-bold ${textSizes[size]} text-[#F5F5F3] uppercase leading-none whitespace-nowrap`}>
            {brand.name}
          </span>
          {showSubtitle && (
            <span className="text-[9px] tracking-[0.25em] text-[#A5A5AA] uppercase font-medium mt-1">
              {brand.descriptor}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
