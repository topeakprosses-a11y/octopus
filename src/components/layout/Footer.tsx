import React from 'react';
import { OctopusLogo } from '@/src/components/brand/OctopusLogo';
import { Container } from '@/src/components/ui/Container';
import { homepageContent } from '@/src/content/homepage';
import { PageView } from '@/src/components/layout/Navbar';

interface FooterProps {
  onNavigate: (view: PageView) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
  onOpenApply: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal, onOpenApply }) => {
  const handleNav = (view: PageView) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#303034]/60 bg-[#050505] pt-16 pb-12 text-[#A5A5AA]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-12 border-b border-[#303034]/40">
          {/* Brand Lockup & Description */}
          <div className="flex flex-col gap-3 max-w-sm">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 cursor-pointer text-left hover:opacity-90 transition-opacity"
            >
              <OctopusLogo variant="lockup" size="md" />
            </button>
            <p className="text-xs text-[#A5A5AA] leading-relaxed">
              Octopus is a startup accelerator for ambitious founders turning promising ideas
              into enduring companies.
            </p>
          </div>

          {/* Minimal Navigation Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5F5F3]">
              Navigation
            </span>
            <nav aria-label="Footer Navigation" className="flex flex-col gap-2 text-sm">
              <button
                onClick={() => handleNav('about')}
                className="text-left text-[#A5A5AA] hover:text-[#F5F5F3] transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => handleNav('program')}
                className="text-left text-[#A5A5AA] hover:text-[#F5F5F3] transition-colors cursor-pointer"
              >
                Program
              </button>
              <button
                onClick={() => handleNav('network')}
                className="text-left text-[#A5A5AA] hover:text-[#F5F5F3] transition-colors cursor-pointer"
              >
                Network
              </button>
              <button
                onClick={() => handleNav('contact')}
                className="text-left text-[#A5A5AA] hover:text-[#F5F5F3] transition-colors cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={() => handleNav('apply')}
                className="text-left text-[#A5A5AA] hover:text-[#F5F5F3] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </nav>
          </div>

          {/* Contact Placeholders */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5F5F3]">
              Inquiries
            </span>
            <div className="flex flex-col gap-2 text-sm text-[#A5A5AA]">
              <div>
                <span className="text-xs text-[#A5A5AA]/70 block">Admissions</span>
                <a
                  href={`mailto:${homepageContent.footer.admissionsEmail}`}
                  className="hover:text-[#F5F5F3] transition-colors"
                >
                  {homepageContent.footer.admissionsEmail}
                </a>
              </div>
              <div className="mt-1">
                <span className="text-xs text-[#A5A5AA]/70 block">General</span>
                <a
                  href={`mailto:${homepageContent.footer.inquiriesEmail}`}
                  className="hover:text-[#F5F5F3] transition-colors"
                >
                  {homepageContent.footer.inquiriesEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Legal Placeholders, Partner Portal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-[#A5A5AA]/80">
          <p>{homepageContent.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#F5F5F3] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#F5F5F3] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="hover:text-[#F5F5F3] transition-colors cursor-pointer text-[#A5A5AA]/60 hover:text-[#A5A5AA]"
              title="Restricted Investment Committee Review"
            >
              Partner Portal
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
};
