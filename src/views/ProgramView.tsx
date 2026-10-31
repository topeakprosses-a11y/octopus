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
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Compass,
  TrendingUp,
  Clock,
  Shield,
  Briefcase,
  Users,
} from 'lucide-react';

interface ProgramViewProps {
  onNavigate: (view: PageView) => void;
  onOpenApply?: () => void;
}

export const ProgramView: React.FC<ProgramViewProps> = ({ onNavigate, onOpenApply }) => {
  const { program } = supportingPagesContent;

  return (
    <div className="flex flex-col">
      {/* 1. PAGE HEADER */}
      <PageHeader
        kicker={program.kicker}
        title={program.title}
        subtitle={program.subtitle}
        onBack={() => onNavigate('home')}
        backLabel="Back to Overview"
        action={
          <Button
            variant="primary"
            size="md"
            onClick={onOpenApply || (() => onNavigate('apply'))}
            className="gap-2"
          >
            <span>Apply to Program</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        }
      />

      {/* 2. PROGRAM VISUAL BANNER */}
      <section className="py-12 border-b border-[#303034]/40 bg-[#0B0B0D]/20">
        <Container>
          <div className="relative rounded-2xl overflow-hidden border border-[#303034] bg-[#0B0B0D] aspect-[21/9] sm:aspect-[2.6/1] group">
            <img
              src={brand.assets.programPortal}
              alt="Program ascent stairway"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs text-[#A5A5AA] font-mono">
              <span className="uppercase tracking-widest">HIGH-INTENSITY RESIDENCY</span>
              <span className="text-[#F5F5F3]">12-WEEK FRAMEWORK</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. WHO THE PROGRAM IS FOR */}
      <section className="py-20 md:py-28 border-b border-[#303034]/40">
        <Container>
          <div className="max-w-2xl mb-12">
            <Kicker className="mb-3">ELIGIBILITY & FIT</Kicker>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F3]">
              {program.audience.headline}
            </h2>
            <p className="mt-4 text-base text-[#A5A5AA] leading-relaxed">
              {program.audience.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {program.audience.criteria.map((item, idx) => (
              <Card key={item.title} variant="flat" padding="lg" className="border-[#303034] h-full flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-[#A5A5AA] tracking-wider block mb-4">
                    CRITERIA 0{idx + 1}
                  </span>
                  <h3 className="text-xl font-bold text-[#F5F5F3]">{item.title}</h3>
                  <p className="mt-3 text-sm text-[#A5A5AA] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. WHAT FOUNDERS CAN EXPECT */}
      <section className="py-20 md:py-28 border-b border-[#303034]/40 bg-[#0B0B0D]/30">
        <Container>
          <div className="max-w-2xl mb-12">
            <Kicker className="mb-3">THE EXPERIENCE</Kicker>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F3]">
              {program.expectations.headline}
            </h2>
            <p className="mt-4 text-base text-[#A5A5AA]">
              Four pillars of active, hands-on collaboration throughout the accelerator tenure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {program.expectations.pillars.map((pillar, idx) => {
              const icons = [Cpu, Users, Briefcase, Shield];
              const Icon = icons[idx % icons.length];
              return (
                <Card key={pillar.title} variant="flat" padding="lg" className="border-[#303034] h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#171719] border border-[#303034] flex items-center justify-center text-[#F5F5F3]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#A5A5AA]">
                        {pillar.subtitle}
                      </span>
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

      {/* 5. PROGRAM TIMELINE & SCHEDULE */}
      <section className="py-20 md:py-28 border-b border-[#303034]/40">
        <Container>
          <div className="max-w-2xl mb-14">
            <Kicker className="mb-3">PROGRAM TIMELINE</Kicker>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F3]">
              The 12-week velocity framework.
            </h2>
            <p className="mt-4 text-base text-[#A5A5AA]">
              Structured in four progressive phases designed to maximize compounding speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {program.timeline.map((phase) => (
              <Card key={phase.phase} variant="flat" padding="lg" className="border-[#303034] h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#303034]/60 text-xs font-mono">
                    <span className="text-[#A5A5AA] font-semibold">{phase.phase}</span>
                    <span className="text-[#F5F5F3]">{phase.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F5F5F3] mt-4">{phase.name}</h3>
                  <p className="mt-3 text-sm text-[#A5A5AA] leading-relaxed">{phase.focus}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-[#A5A5AA]">
                  <Clock className="w-3.5 h-3.5 text-[#A5A5AA]" />
                  <span>Cohort Status: Verified Phase Template</span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. INVESTMENT & ELIGIBILITY TERMS NOTICE */}
      <section className="py-20 md:py-28">
        <Container size="md">
          <PlaceholderNotice
            badge="TERMS & LOGISTICS · PENDING ANNOUNCEMENT"
            title={program.termsNotice.title}
            className="p-8 sm:p-10 border-[#303034]"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenApply || (() => onNavigate('apply'))}
              >
                Request Terms Alert
              </Button>
            }
          >
            <p className="text-sm sm:text-base leading-relaxed text-[#A5A5AA]">
              {program.termsNotice.note}
            </p>
            <div className="mt-6 pt-6 border-t border-[#303034]/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[#A5A5AA]">
              <div>
                <span className="text-[#F5F5F3] block font-semibold mb-0.5">RESIDENCY MODEL</span>
                Hybrid: SF In-Person + Asynchronous Hub
              </div>
              <div>
                <span className="text-[#F5F5F3] block font-semibold mb-0.5">INTAKE FREQUENCY</span>
                Two Selective Batches Annually
              </div>
            </div>
          </PlaceholderNotice>

          <div className="mt-12 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenApply || (() => onNavigate('apply'))}
              className="gap-2 px-8"
            >
              <span>Submit Batch 01 Application Interest</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};
