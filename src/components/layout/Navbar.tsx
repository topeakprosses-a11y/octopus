import React, { useState, useEffect } from 'react';
import { OctopusLogo } from '@/src/components/brand/OctopusLogo';
import { Button } from '@/src/components/ui/Button';
import { Menu, X, ArrowRight } from 'lucide-react';

export type PageView = 'home' | 'about' | 'program' | 'network' | 'apply' | 'contact' | 'admin';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onOpenApply: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenApply }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and listen for Escape key when mobile menu is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Clean 4 editorial navigation links adhering to Top Bar Contract
  const navLinks: { label: string; view: PageView }[] = [
    { label: 'About', view: 'about' },
    { label: 'Program', view: 'program' },
    { label: 'Network', view: 'network' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleLinkClick = (view: PageView) => {
    setMobileMenuOpen(false);
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrandClick = () => {
    setMobileMenuOpen(false);
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          scrolled
            ? 'bg-[#050505]/92 backdrop-blur-md border-[#303034]/70 shadow-lg'
            : 'bg-[#050505]/80 backdrop-blur-sm border-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 sm:gap-6 lg:gap-8 px-5 sm:px-8 lg:px-12">
          {/* Zone 1: Brand Lockup with approved Octopus logo */}
          <button
            onClick={handleBrandClick}
            className="group flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F3] rounded-md p-1 -m-1 cursor-pointer shrink-0"
            aria-label="Octopus Home"
          >
            <OctopusLogo variant="lockup" size="md" />
          </button>

          {/* Zone 2: Editorial Navigation Links (About, Program, Network, Contact) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium tracking-wide"
          >
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F3] rounded px-1 min-h-[36px] flex items-center ${
                    isActive
                      ? 'text-[#F5F5F3] font-semibold'
                      : 'text-[#A5A5AA] hover:text-[#F5F5F3]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F5F5F3] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Apply Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={onOpenApply}
              className="gap-2 group shadow-sm hover:shadow-[0_0_24px_rgba(245,245,243,0.18)]"
            >
              <span>Apply to Octopus</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Button>
          </div>

          {/* Mobile Menu Trigger (min-h-[44px] touch target) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#A5A5AA] hover:text-[#F5F5F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F3] rounded-lg border border-[#303034]/60 bg-[#0B0B0D] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-label="Navigation Menu"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-[#050505] p-6 md:hidden animate-in fade-in duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#303034]/60">
            <button
              onClick={handleBrandClick}
              className="flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F3] rounded"
            >
              <OctopusLogo variant="lockup" size="md" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#A5A5AA] hover:text-[#F5F5F3] rounded-lg border border-[#303034] bg-[#0B0B0D] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F3]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-2 py-6 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-left text-2xl font-medium tracking-tight transition-colors cursor-pointer py-3 px-2 rounded-lg flex items-center justify-between min-h-[48px] ${
                    isActive
                      ? 'text-[#F5F5F3] font-bold bg-[#171719]/60'
                      : 'text-[#A5A5AA] hover:text-[#F5F5F3] hover:bg-[#111114]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#F5F5F3]" aria-hidden="true" />}
                </button>
              );
            })}
          </nav>

          {/* Mobile Action */}
          <div className="mt-auto pt-6 border-t border-[#303034]/60 space-y-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApply();
              }}
              className="gap-2 py-3.5 min-h-[48px]"
            >
              <span>Apply to Octopus</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-between pt-2 text-xs text-[#A5A5AA]">
              <span>STARTUP ACCELERATOR</span>
              <span>© 2026 OCTOPUS</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
