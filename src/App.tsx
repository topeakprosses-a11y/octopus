/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, PageView } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { HomeView } from '@/src/views/HomeView';
import { AboutView } from '@/src/views/AboutView';
import { ProgramView } from '@/src/views/ProgramView';
import { NetworkView } from '@/src/views/NetworkView';
import { ApplyView } from '@/src/views/ApplyView';
import { ContactView } from '@/src/views/ContactView';
import { AdminView } from '@/src/views/AdminView';
import { LegalModal } from '@/src/components/modals/LegalModal';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Sync view with hash on mount and hash changes
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['about', 'program', 'network', 'apply', 'contact', 'admin'].includes(hash)) {
        setCurrentView(hash as PageView);
      } else {
        setCurrentView('home');
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Sync document title with current view
  useEffect(() => {
    const titles: Record<PageView, string> = {
      home: 'Octopus — Startup Accelerator',
      about: 'About — Octopus Startup Accelerator',
      program: 'Program — Octopus Startup Accelerator',
      network: 'The Octopus Network — Startup Accelerator',
      contact: 'Contact — Octopus Startup Accelerator',
      apply: 'Apply — Octopus Startup Accelerator',
      admin: 'Octopus — Partner Review Desk',
    };
    document.title = titles[currentView] || 'Octopus — Startup Accelerator';
  }, [currentView]);

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    if (view === 'home') {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#F5F5F3] font-sans antialiased selection:bg-[#F5F5F3] selection:text-[#050505]">
      {/* Top Navigation conforming to strict Top Bar Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenApply={() => handleNavigate('apply')}
      />

      {/* Main Content Supporting Page / Home View Container */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onOpenApply={() => handleNavigate('apply')}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'about' && (
          <AboutView
            onNavigate={handleNavigate}
            onOpenApply={() => handleNavigate('apply')}
          />
        )}
        {currentView === 'program' && (
          <ProgramView
            onNavigate={handleNavigate}
            onOpenApply={() => handleNavigate('apply')}
          />
        )}
        {currentView === 'network' && (
          <NetworkView
            onNavigate={handleNavigate}
            onOpenApply={() => handleNavigate('apply')}
          />
        )}
        {currentView === 'apply' && (
          <ApplyView onNavigate={handleNavigate} />
        )}
        {currentView === 'contact' && (
          <ContactView onNavigate={handleNavigate} />
        )}
        {currentView === 'admin' && (
          <AdminView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Institutional Footer with Supporting Page Routing */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenApply={() => handleNavigate('apply')}
      />

      {/* Legal Dialog Modal */}
      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
