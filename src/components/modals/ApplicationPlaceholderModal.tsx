import React, { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { X, CheckCircle2, Clock } from 'lucide-react';

interface ApplicationPlaceholderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationPlaceholderModal: React.FC<ApplicationPlaceholderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [founderName, setFounderName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-placeholder-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#303034] bg-[#0B0B0D] p-5 sm:p-8 text-[#F5F5F3] shadow-2xl my-auto">
        {/* Header / Notice */}
        <div className="flex items-start justify-between pb-5 border-b border-[#303034]">
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium tracking-wider text-[#A5A5AA] uppercase">
              <Clock className="w-3.5 h-3.5 text-[#A5A5AA]" />
              Application Status · Pending
            </span>
            <h2 id="app-placeholder-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F3] mt-1">
              Apply to Octopus
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A5A5AA] hover:text-[#F5F5F3] rounded-lg border border-[#303034] bg-[#171719] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          <div className="p-3.5 rounded-lg bg-[#171719]/80 border border-[#303034]/70 mb-6 text-xs text-[#A5A5AA] leading-relaxed">
            <strong className="text-[#F5F5F3] font-semibold block mb-0.5">
              Notice: Application Workflow in Preparation
            </strong>
            The official application portal for our inaugural cohort is finalizing review.
            We do not accept full pitch submissions until the verified intake system goes live.
          </div>

          {submitted ? (
            <div className="py-6 text-center animate-in fade-in duration-200">
              <CheckCircle2 className="w-10 h-10 text-[#F5F5F3] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#F5F5F3]">Notification preference recorded.</h3>
              <p className="text-sm text-[#A5A5AA] mt-2 leading-relaxed">
                We will email <span className="text-[#F5F5F3] font-medium">{email}</span> the moment
                applications officially open for Batch 01.
              </p>
              <div className="mt-6 flex justify-center">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#A5A5AA] leading-relaxed">
                Leave your details below to receive direct notification and early access instructions
                prior to the public cohort announcement:
              </p>

              <Input
                label="Founder Name"
                placeholder="Ada Lovelace (Optional)"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
              />

              <Input
                label="Work Email"
                type="email"
                placeholder="founder@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                required
              />

              <div className="pt-2 flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Notify Me When Open
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
