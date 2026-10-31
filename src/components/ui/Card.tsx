import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated' | 'ghost' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'flat',
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const base = 'rounded-xl transition-all duration-200';

  const variants = {
    flat: 'bg-[#0B0B0D] border border-[#303034]',
    elevated: 'bg-[#171719] border border-[#303034] shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
    ghost: 'bg-transparent border border-[#303034]/60',
    interactive:
      'bg-[#0B0B0D] border border-[#303034] hover:border-[#A5A5AA]/60 hover:bg-[#111114] cursor-pointer',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div className={`${base} ${variants[variant]} ${paddings[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};
