import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-[0.15em] text-[#A5A5AA]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border bg-[#0B0B0D] px-4 py-3 text-sm text-[#F5F5F3] placeholder:text-[#A5A5AA]/50 transition-all duration-150 focus:border-[#F5F5F3] focus:bg-[#111114] focus:outline-none focus:ring-1 focus:ring-[#F5F5F3] disabled:opacity-50 ${
            error ? 'border-red-500/80' : 'border-[#303034]'
          } ${className}`}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[#A5A5AA]">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
