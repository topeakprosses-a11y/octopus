import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]';

    const variants = {
      // Primary high-contrast button matching "Apply to Octopus ->" in mockup
      primary:
        'bg-[#F5F5F3] text-[#050505] hover:bg-[#FFFFFF] hover:shadow-[0_0_20px_rgba(245,245,243,0.15)] active:scale-[0.99] rounded-full font-semibold',
      // Secondary graphite surface
      secondary:
        'bg-[#171719] text-[#F5F5F3] hover:bg-[#252529] border border-[#303034] active:scale-[0.99] rounded-full',
      // Outline button with subtle border
      outline:
        'border border-[#303034] bg-transparent text-[#F5F5F3] hover:border-[#A5A5AA] hover:bg-[#171719]/40 active:scale-[0.99] rounded-full',
      // Subtle ghost button
      ghost:
        'bg-transparent text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#171719]/60 rounded-full',
      // Editorial text link button
      link:
        'bg-transparent text-[#A5A5AA] hover:text-[#F5F5F3] underline-offset-4 hover:underline p-0 h-auto rounded-none',
    };

    const sizes = {
      sm: 'text-xs py-2 px-3.5 min-h-[36px] gap-1.5',
      md: 'text-sm py-2.5 px-5 min-h-[42px] gap-2',
      lg: 'text-sm sm:text-base py-3 px-6 min-h-[46px] sm:min-h-[48px] gap-2.5',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
