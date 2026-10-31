import React from 'react';
import { Container } from '@/src/components/ui/Container';
import { Button } from '@/src/components/ui/Button';
import { Kicker } from '@/src/components/ui/Kicker';
import { Card } from '@/src/components/ui/Card';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { PlaceholderNotice } from '@/src/components/ui/PlaceholderNotice';
import { brand } from '@/src/theme/tokens';
import { supportingPagesContent } from '@/src/content/supportingPages';
import { PageView } from '@/src/components/layout/Navbar';
import { ArrowRight, ShieldCheck, Globe2, Wrench, Sparkle, Clock } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: PageView) => void;
  onOpenApply?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onOpenApply }) => {
  const { about } = supportingPagesContent;

  return (
    <div className="flex flex-col">
      {/* 1. EDITORIAL PAGE HEADER */}
      <PageHeader
        kicker={about.kicker}
        title={about.title}
        subtitle={about.subtitle}
        onBack={() => onNavigate('home')}
        backLabel="Back to Overview"
        action={
          <Button
            variant="primary"
            size="md"
            onClick={onOpenApply || (() => onNavigate('apply'))}
            className="gap-2"
          >
            <span>Apply to Octopus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        }
      />

      {/* 2. VISUAL MONOLITH BANNER */}
      <section className="py-12 border-b border-[#303034]/40 bg-[#0B0B0D]/20">
        <Container>
          <div className="relative rounded-2xl overflow-hidden border border-[#303034] bg-[#0B0B0D] aspect-[21/9] sm:aspect-[2.6/1] group">
            <img
              src={brand.assets.monolithLandscape}
              alt="Octopus architectural monolith landscape"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs text-[#A5A5AA] font-mono">
              <span className="uppercase tracking-widest">ARCHITECTURAL DISCIPLINE</span>
              <span className="text-[#F5F5F3]">ESTABLISHED 2026</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. CORE THESIS */}
      <section className="py-20 md:py-28 border-b border-[#303034]/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4 flex flex-col">
              <Kicker className="mb-3">{about.thesis.kicker}</Kicker>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F3] leading-tight">
                {about.thesis.headline}
              </h2>
              <div className="mt-8 p-4 rounded-xl border border-[#303034]/60 bg-[#0B0B0D] text-xs text-[#A5A5AA] leading-relaxed">
                <strong className="text-[#F5F5F3] block mb-1">Institutional Transparency</strong>
                Octopus does not claim an artificial decades-long heritage. We are building the
                accelerator we wished existed when we were founders.
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col space-y-6 text-base sm:text-lg text-[#A5A5AA] leading-relaxed">
              {about.thesis.paragraphs.map((p, idx) => (
                <p key={idx} className="text-balance">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. FOUR PHILOSOPHY PILLARS */}
      <section className="py-20 md:py-28 border-b border-[#303034]/40 bg-[#0B0B0D]/30">
        <Container>
          <div className="max-w-2xl mb-14">
            <Kicker className="mb-3">OPERATING PRINCIPLES</Kicker>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F3]">
              How we partner with founders.
            </h2>
            <p className="mt-4 text-base text-[#A5A5AA]">
              Four non-negotiable principles that dictate every decision from investment to board advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {about.philosophyPillars.map((pillar, idx) => {
              const icons = [ShieldCheck, Sparkle, Wrench, Globe2];
              const Icon = icons[idx % icons.length];
              return (
                <Card key={pillar.title} variant="flat" padding="lg" className="border-[#303034] h-full flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#171719] border border-[#303034] flex items-center justify-center text-[#F5F5F3] mb-6">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[#F5F5F3]">{pillar.title}</h3>
                    <p className="mt-3 text-sm sm:text-base text-[#A5A5AA] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. GOVERNANCE & COUNCIL PLACEHOLDERS */}
      <section className="py-20 md:py-28 border-b border-[#303034]/40">
        <Container>
          <div className="max-w-2xl mb-12">
            <Kicker className="mb-3">GOVERNANCE & ADVISORY</Kicker>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F3]">
              Leadership structure & operator council.
            </h2>
            <p className="mt-4 text-base text-[#A5A5AA]">
              To protect founder privacy and maintain regulatory compliance, formal bios and committee
              members are held in confidential review until the public cohort debut.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {about.governancePlaceholders.map((gov) => (
              <PlaceholderNotice
                key={gov.role}
                badge={gov.status === 'in_selection' ? 'IN SELECTION' : 'ANNOUNCEMENT PENDING'}
                title={gov.role}
                className="h-full flex flex-col justify-between"
              >
                <span className="text-xs font-mono uppercase tracking-wider text-[#A5A5AA]/70 block mb-1">
                  {gov.department}
                </span>
                <p>{gov.description}</p>
              </PlaceholderNotice>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. CLOSING CTA */}
      <section className="py-20 md:py-28">
        <Container size="md">
          <div className="border border-[#303034] rounded-2xl bg-[#0B0B0D] p-8 sm:p-12 text-center">
            <Kicker className="mb-3">JOIN THE INAUGURAL COHORT</Kicker>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F3]">
              Ready to explore partnership?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#A5A5AA] max-w-lg mx-auto leading-relaxed">
              We are actively speaking with early-stage founding teams building category-defining
              products in deep software and intelligent systems.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={onOpenApply || (() => onNavigate('apply'))}
                className="gap-2 px-6"
              >
                <span>Apply to Octopus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('program')}
              >
                <span>View Program Curriculum</span>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
