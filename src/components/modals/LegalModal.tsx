import React, { useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
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

  if (!isOpen || !type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[#303034] bg-[#0B0B0D] p-5 sm:p-8 text-[#F5F5F3] shadow-2xl my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#303034]">
          <h2 id="legal-modal-title" className="text-xl font-bold tracking-tight">
            {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A5A5AA] hover:text-[#F5F5F3] rounded-lg border border-[#303034] bg-[#171719] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm text-[#A5A5AA] leading-relaxed">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Effective Date:</strong> October 2026
              </p>
              <p>
                At Octopus, we recognize that confidentiality and intellectual property integrity
                are foundational to the trust between founders and our accelerator team.
              </p>
              <h3 className="text-base font-semibold text-[#F5F5F3] pt-2">1. Founder Information</h3>
              <p>
                All application materials, pitch summaries, code architectures, and financial data
                submitted to Octopus are treated with the utmost discretion and reviewed strictly by our
                investment committee and admissions team.
              </p>
              <h3 className="text-base font-semibold text-[#F5F5F3] pt-2">2. Data Usage & Protection</h3>
              <p>
                We do not sell, rent, or trade founder personal data to third parties. Information is used
                solely to assess cohort suitability, communicate interview schedules, and deliver accelerator
                programming.
              </p>
              <h3 className="text-base font-semibold text-[#F5F5F3] pt-2">3. Direct Contact</h3>
              <p>
                For questions regarding data processing or privacy requests, please contact{' '}
                <span className="text-[#F5F5F3]">privacy@octopus.vc</span>.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Effective Date:</strong> October 2026
              </p>
              <p>
                Welcome to Octopus. By accessing our platform, services, or submitting an application
                to our accelerator programs, you agree to these Terms of Service.
              </p>
              <h3 className="text-base font-semibold text-[#F5F5F3] pt-2">1. Application Submissions</h3>
              <p>
                Founders certify that information provided in application submissions is accurate and
                that they hold the rights to present their company or technology.
              </p>
              <h3 className="text-base font-semibold text-[#F5F5F3] pt-2">2. Proprietary Rights</h3>
              <p>
                All brand identity assets, trademarks, designs, and content on this site are the
                exclusive property of Octopus Accelerator.
              </p>
              <h3 className="text-base font-semibold text-[#F5F5F3] pt-2">3. Accelerator Admission</h3>
              <p>
                Admission to Octopus batches is subject to formal due diligence and execution of standard
                accelerator agreements.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-[#303034] flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
