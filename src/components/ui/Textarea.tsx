import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium uppercase tracking-[0.15em] text-[#A5A5AA]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full rounded-lg border bg-[#0B0B0D] px-4 py-3 text-sm text-[#F5F5F3] placeholder:text-[#A5A5AA]/50 transition-all duration-150 focus:border-[#F5F5F3] focus:bg-[#111114] focus:outline-none focus:ring-1 focus:ring-[#F5F5F3] disabled:opacity-50 resize-y min-h-[100px] ${
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

Textarea.displayName = 'Textarea';
