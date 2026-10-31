import React from 'react';
import { Container } from '@/src/components/ui/Container';
import { Button } from '@/src/components/ui/Button';
import { Kicker } from '@/src/components/ui/Kicker';
import { Card } from '@/src/components/ui/Card';
import { brand } from '@/src/theme/tokens';
import { homepageContent } from '@/src/content/homepage';
import {
  ArrowRight,
  ArrowDown,
  Clock,
  Layers,
  Compass,
  TrendingUp,
  CheckCircle2,
  Hexagon,
  Sparkles,
} from 'lucide-react';

import { PageView } from '@/src/components/layout/Navbar';

interface HomeViewProps {
  onOpenApply: () => void;
  onNavigate?: (view: PageView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenApply, onNavigate }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { hero, proposition, program, founderFocus, network, finalCta } = homepageContent;

  return (
    <div className="flex flex-col">
      {/* =========================================================================
          1. HERO SECTION
          Confident, typography-led, generous negative space, approved logo
          ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-36 overflow-hidden border-b border-[#303034]/40">
        {/* Subtle atmospheric ambient glow */}
        <div className="absolute top-0 right-1/4 w-[640px] h-[640px] bg-gradient-to-b from-[#252529]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Typography-led Hero */}
            <div className="lg:col-span-7 flex flex-col items-start z-10">
              <Kicker className="mb-4 sm:mb-6">
                OCTOPUS <span className="text-[#303034] mx-1">·</span> STARTUP ACCELERATOR
              </Kicker>

              {/* Provisional Headline per Prompt */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-bold tracking-tight text-[#F5F5F3] leading-[1.08] text-balance break-words">
                {hero.headline}
              </h1>

              {/* Provisional Supporting Copy */}
              <p className="mt-5 sm:mt-8 text-base sm:text-lg text-[#A5A5AA] leading-relaxed max-w-xl text-pretty">
                {hero.supportingCopy}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onOpenApply}
                  className="gap-2 group shadow-sm justify-center"
                >
                  <span>{hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection('about')}
                  className="gap-2 text-[#A5A5AA] hover:text-[#F5F5F3] justify-center"
                >
                  <span>{hero.secondaryCta}</span>
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              {/* Clear Application Status Placeholder Note */}
              <div className="mt-6 sm:mt-8 flex items-center gap-2 text-xs text-[#A5A5AA]">
                <Clock className="w-3.5 h-3.5 text-[#A5A5AA]/80 shrink-0" />
                <span className="leading-snug">
                  Application status: <span className="text-[#F5F5F3] font-medium">Inaugural Cohort · Admissions Preparing</span>
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual - The approved metallic Octopus logo */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative w-full">
              <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-square rounded-2xl overflow-hidden border border-[#303034]/60 bg-[#0B0B0D] shadow-[0_12px_48px_rgba(0,0,0,0.85)] group">
                <img
                  src={brand.assets.logo}
                  alt="Approved Octopus Logo Emblem"
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('/public/')) {
                      target.src = '/public' + brand.assets.logo;
                    }
                  }}
                />
                {/* Vignette and hairline inner ring */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />

                {/* Status bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#A5A5AA] bg-[#050505]/75 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#303034]/50">
                  <span className="tracking-wider uppercase font-mono text-[11px]">COHORT 01</span>
                  <span className="text-[#F5F5F3]">Founders First</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          2. DIRECTION STRIP
          ========================================================================= */}
      <section className="border-b border-[#303034]/60 bg-[#0B0B0D]/50 py-6">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em] text-[#A5A5AA] font-medium">
                IDEAS
              </span>
              <span className="text-sm font-semibold tracking-wider text-[#F5F5F3] mt-1 flex items-center gap-1.5">
                COMPANIES <ArrowRight className="w-3 h-3 text-[#A5A5AA]" />
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em] text-[#A5A5AA] font-medium">
                FOUNDERS
              </span>
              <span className="text-sm font-semibold tracking-wider text-[#F5F5F3] mt-1 flex items-center gap-1.5">
                GLOBAL IMPACT <ArrowRight className="w-3 h-3 text-[#A5A5AA]" />
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em] text-[#A5A5AA] font-medium">
                CAPITAL
              </span>
              <span className="text-sm font-semibold tracking-wider text-[#F5F5F3] mt-1 flex items-center gap-1.5">
                ECOSYSTEM <ArrowRight className="w-3 h-3 text-[#A5A5AA]" />
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em] text-[#A5A5AA] font-medium">
                BUILDERS
              </span>
              <span className="text-sm font-semibold tracking-wider text-[#F5F5F3] mt-1 flex items-center gap-1.5">
                WHAT&apos;S NEXT <ArrowRight className="w-3 h-3 text-[#A5A5AA]" />
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          3. ACCELERATOR PROPOSITION
          Positioning themes without unverified claims (Founder development,
          Company building, Strategic guidance, Connections and collaboration)
          ========================================================================= */}
      <section id="about" className="py-24 md:py-36 border-b border-[#303034]/40 scroll-mt-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Proposition Statement */}
            <div className="lg:col-span-5 flex flex-col">
              <Kicker className="mb-4">{proposition.kicker}</Kicker>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F3] leading-tight">
                {proposition.headline}
              </h2>
              <p className="mt-6 text-base sm:text-lg text-[#A5A5AA] leading-relaxed">
                {proposition.supportingCopy}
              </p>

              {/* Minimalist Monolith Backdrop */}
              <div className="mt-10 rounded-xl overflow-hidden border border-[#303034] bg-[#0B0B0D] aspect-video relative group">
                <img
                  src={brand.assets.monolithLandscape}
                  alt="Architectural obsidian monolith landscape"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 text-xs tracking-widest uppercase text-[#A5A5AA] font-mono">
                  PRINCIPLED FOUNDATIONS
                </div>
              </div>

              {onNavigate && (
                <div className="mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('about')}
                    className="gap-2 text-xs"
                  >
                    <span>Read founding thesis & principles</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Right: 4 Positioning Themes */}
            <div className="lg:col-span-7 flex flex-col divide-y divide-[#303034]/60">
              {proposition.themes.map((theme) => (
                <div
                  key={theme.id}
                  className="py-8 first:pt-0 last:pb-0 flex items-start gap-6 group"
                >
                  <span className="font-mono text-sm sm:text-base font-semibold text-[#A5A5AA] tracking-wider pt-1 shrink-0">
                    {theme.number}
                  </span>
                  <div className="flex flex-col">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F3] group-hover:text-white transition-colors">
                      {theme.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-[#A5A5AA] leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          4. PROGRAM OVERVIEW
          Clear section explaining the accelerator program.
          Placeholders for unknown details clearly marked as pending or TBA.
          ========================================================================= */}
      <section id="program" className="py-24 md:py-36 border-b border-[#303034]/40 bg-[#0B0B0D]/30 scroll-mt-20">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <Kicker className="mb-4">{program.kicker}</Kicker>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F3]">
                {program.headline}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#A5A5AA] leading-relaxed">
                {program.supportingCopy}
              </p>
            </div>

            {onNavigate && (
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('program')}
                className="gap-2 shrink-0 self-start md:self-end"
              >
                <span>View full program details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          {/* Program Parameter Specifications with Transparent Placeholders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {program.details.map((detail) => (
              <Card
                key={detail.label}
                variant="flat"
                padding="md"
                className="flex flex-col justify-between border-[#303034]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs uppercase tracking-[0.18em] text-[#A5A5AA] font-mono">
                      {detail.label}
                    </span>
                    <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border border-[#303034] text-[#A5A5AA] bg-[#171719]">
                      {detail.status === 'pending' ? 'Pending' : 'To be announced'}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-[#F5F5F3] mt-2">
                    {detail.value}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Three Phases Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card variant="flat" padding="lg" className="flex flex-col justify-between group hover:border-[#A5A5AA]/60">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#171719] border border-[#303034] flex items-center justify-center mb-6 text-[#F5F5F3]">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono tracking-widest text-[#A5A5AA] uppercase block mb-1">
                  {program.phases[0].phase}
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F3]">
                  {program.phases[0].title}
                </h3>
                <p className="mt-3 text-sm text-[#A5A5AA] leading-relaxed">
                  {program.phases[0].focus}
                </p>
              </div>
            </Card>

            <Card variant="flat" padding="lg" className="flex flex-col justify-between group hover:border-[#A5A5AA]/60">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#171719] border border-[#303034] flex items-center justify-center mb-6 text-[#F5F5F3]">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono tracking-widest text-[#A5A5AA] uppercase block mb-1">
                  {program.phases[1].phase}
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F3]">
                  {program.phases[1].title}
                </h3>
                <p className="mt-3 text-sm text-[#A5A5AA] leading-relaxed">
                  {program.phases[1].focus}
                </p>
              </div>
            </Card>

            <Card variant="flat" padding="lg" className="flex flex-col justify-between group hover:border-[#A5A5AA]/60">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#171719] border border-[#303034] flex items-center justify-center mb-6 text-[#F5F5F3]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono tracking-widest text-[#A5A5AA] uppercase block mb-1">
                  {program.phases[2].phase}
                </span>
                <h3 className="text-xl font-bold text-[#F5F5F3]">
                  {program.phases[2].title}
                </h3>
                <p className="mt-3 text-sm text-[#A5A5AA] leading-relaxed">
                  {program.phases[2].focus}
                </p>
              </div>
            </Card>
          </div>

          {/* Transparent Notice */}
          <div className="mt-12 p-4 rounded-xl border border-[#303034]/60 bg-[#0B0B0D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-[#A5A5AA] leading-relaxed">
              <strong className="text-[#F5F5F3] font-medium mr-1.5">Schedule Transparency:</strong>
              Official cohort calendar, residency hub details, and standard equity terms will be released prior to admissions intake.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenApply}
              className="shrink-0"
            >
              Get Schedule Alerts
            </Button>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          5. FOUNDER-FOCUSED SECTION
          Clean typography and thoughtful layout.
          No stock photography. No fake success rates or claims.
          ========================================================================= */}
      <section id="founders" className="py-24 md:py-36 border-b border-[#303034]/40 scroll-mt-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Attributes and Conviction */}
            <div className="lg:col-span-7 flex flex-col">
              <Kicker className="mb-4">{founderFocus.kicker}</Kicker>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F3] leading-tight">
                {founderFocus.headline}
              </h2>
              <p className="mt-6 text-base sm:text-lg text-[#A5A5AA] leading-relaxed">
                {founderFocus.supportingCopy}
              </p>

              {/* Four Focus Attributes */}
              <div className="mt-10 space-y-6">
                {founderFocus.attributes.map((attr) => (
                  <div key={attr.id} className="flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-[#F5F5F3] shrink-0 mt-1" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#F5F5F3]">
                        {attr.title}
                      </h3>
                      <p className="text-sm text-[#A5A5AA] mt-1 leading-relaxed">
                        {attr.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Architectural Monolith Sculpture */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#303034] bg-[#0B0B0D] aspect-[4/3] sm:aspect-square lg:aspect-[4/5] shadow-2xl group">
                <img
                  src={brand.assets.programPortal}
                  alt="Architectural ascension stairway and light portal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#0B0B0D]/85 backdrop-blur-md border border-[#303034]">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#A5A5AA] font-mono">
                    FOUNDER PROFILE
                  </p>
                  <p className="text-sm text-[#F5F5F3] mt-2 font-medium leading-relaxed">
                    &ldquo;We look for founders with extreme clarity of purpose and the technical stamina to endure the hardest problems.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          6. PORTFOLIO AND ECOSYSTEM AREA (THE OCTOPUS NETWORK)
          Dedicated, spacious section for future portfolio companies, investments,
          founders, and partners. Clean, intentional empty state. Straightforward
          to populate later.
          ========================================================================= */}
      <section id="network" className="py-24 md:py-36 border-b border-[#303034]/40 bg-[#0B0B0D]/20 scroll-mt-20">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <Kicker className="mb-4">{network.kicker}</Kicker>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F3]">
                {network.headline}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#A5A5AA] leading-relaxed">
                {network.supportingCopy}
              </p>
            </div>

            {onNavigate && (
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('network')}
                className="gap-2 shrink-0 self-start md:self-end"
              >
                <span>Explore network directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          {/* If portfolio companies exist in the future, render them dynamically;
              Otherwise, render the intentional, spacious empty state */}
          {network.portfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {network.portfolio.map((item) => (
                <Card key={item.id} variant="flat" padding="md">
                  <span className="text-xs font-mono text-[#A5A5AA]">{item.cohort}</span>
                  <h3 className="text-lg font-bold text-[#F5F5F3] mt-2">{item.name}</h3>
                  <p className="text-sm text-[#A5A5AA] mt-1">{item.oneLiner}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card
              variant="flat"
              padding="lg"
              className="text-center flex flex-col items-center py-20 sm:py-24 border-[#303034]"
            >
              {/* Minimal geometric network motif */}
              <div className="w-16 h-16 rounded-2xl bg-[#171719] border border-[#303034] flex items-center justify-center text-[#F5F5F3] mb-6">
                <Hexagon className="w-8 h-8 stroke-[1.5]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F3]">
                {network.emptyState.title}
              </h3>

              <p className="mt-4 text-base text-[#A5A5AA] max-w-lg leading-relaxed">
                {network.emptyState.description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <Button
                  variant="outline"
                  size="md"
                  onClick={onOpenApply}
                  className="gap-2"
                >
                  <span>{network.emptyState.actionPrompt}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          )}
        </Container>
      </section>

      {/* =========================================================================
          7. FINAL CTA
          Understated invitation with the same application placeholder as the hero
          ========================================================================= */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        {/* Subtle luminous horizon curve */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#252529]/15 via-transparent to-transparent pointer-events-none" />

        <Container size="md">
          <div className="flex flex-col items-center text-center">
            <Kicker className="mb-4">{finalCta.kicker}</Kicker>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F5F5F3] leading-tight">
              {finalCta.headline}
            </h2>

            <p className="mt-6 text-base sm:text-lg text-[#A5A5AA] max-w-xl leading-relaxed">
              {finalCta.supportingCopy}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenApply}
                className="gap-2 group px-8 justify-center"
              >
                <span>{finalCta.primaryCta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onOpenApply}
                className="px-6 justify-center"
              >
                <span>{finalCta.secondaryCta}</span>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
