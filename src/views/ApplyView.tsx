import React, { useState } from 'react';
import { Container } from '@/src/components/ui/Container';
import { Button } from '@/src/components/ui/Button';
import { Kicker } from '@/src/components/ui/Kicker';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { PageView } from '@/src/components/layout/Navbar';
import {
  StartupStage,
  ApplicationSubmissionPayload,
  ApplicationReceipt,
} from '@/src/types/application';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Building,
  User,
  Compass,
  TrendingUp,
  FileCheck2,
  Clock,
  Printer,
} from 'lucide-react';

interface ApplyViewProps {
  onNavigate: (view: PageView) => void;
}

const STAGES: { value: StartupStage; label: string; desc: string }[] = [
  { value: 'Idea / Concept', label: 'Idea / Concept', desc: 'Pre-code or thesis stage' },
  { value: 'Pre-Seed', label: 'Pre-Seed', desc: 'Prototype or early MVP in progress' },
  { value: 'Seed', label: 'Seed', desc: 'Working product with initial users or pilots' },
  { value: 'Early Traction / Growth', label: 'Early Traction', desc: 'Recurring revenue or strong usage' },
];

const INDUSTRIES = [
  'Artificial Intelligence & ML',
  'Enterprise Software / SaaS',
  'Developer Infrastructure & Tools',
  'FinTech & Financial Systems',
  'Robotics & Deep Tech',
  'BioTech & Computational Health',
  'Security & Cryptographic Systems',
  'Consumer Platforms',
  'Other Frontier Tech',
];

export const ApplyView: React.FC<ApplyViewProps> = ({ onNavigate }) => {
  // Form State
  const [formData, setFormData] = useState<ApplicationSubmissionPayload>({
    founderName: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    startupStage: 'Pre-Seed',
    industry: 'Artificial Intelligence & ML',
    location: '',
    shortDescription: '',
    problemStatement: '',
    targetCustomer: '',
    currentProgress: '',
    whyOctopus: '',
    coFounderInfo: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleInputChange = (field: keyof ApplicationSubmissionPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (generalError) setGeneralError(null);
  };

  const validateClientSide = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.founderName.trim()) {
      errors.founderName = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company / startup name is required.';
    }
    if (!formData.location.trim()) {
      errors.location = 'Location (city, country) is required.';
    }
    if (!formData.shortDescription.trim()) {
      errors.shortDescription = 'Please provide a 1-2 sentence description.';
    } else if (formData.shortDescription.trim().length < 15) {
      errors.shortDescription = 'Description should be at least 15 characters.';
    }
    if (!formData.problemStatement.trim()) {
      errors.problemStatement = 'Problem statement is required.';
    } else if (formData.problemStatement.trim().length < 20) {
      errors.problemStatement = 'Please provide at least 20 characters explaining the problem.';
    }
    if (!formData.targetCustomer.trim()) {
      errors.targetCustomer = 'Please describe your target customer.';
    }
    if (!formData.currentProgress.trim()) {
      errors.currentProgress = 'Please describe current progress or traction.';
    }
    if (!formData.whyOctopus.trim()) {
      errors.whyOctopus = 'Please state what you hope to gain from Octopus.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateClientSide()) {
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setGeneralError(data.error || 'Submission failed. Please check the form and try again.');
        setIsSubmitting(false);
        return;
      }

      // Success verified from persistent database
      setReceipt({
        success: true,
        applicationId: data.applicationId,
        companyName: data.companyName,
        founderName: data.founderName,
        email: data.email,
        createdAt: data.createdAt,
        message: data.message,
      });
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission request failed:', err);
      setGeneralError('Network connection error. Please verify your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (receipt?.applicationId) {
      navigator.clipboard.writeText(receipt.applicationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {/* 1. STANDARDIZED PAGE HEADER */}
      <PageHeader
        kicker="OCTOPUS ACCELERATOR · BATCH 01"
        title="Apply to Octopus"
        subtitle="For founders building what comes next. Submissions are reviewed continuously by our investment committee."
        onBack={() => onNavigate('home')}
        backLabel="Back to Overview"
      />

      <section className="py-12 md:py-20 flex-1">
        <Container size="md">
          {/* =========================================================================
              SUCCESS RECEIPT STATE (Displayed only after database persistence)
              ========================================================================= */}
          {receipt ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              <Card variant="flat" padding="lg" className="border-[#303034] bg-[#0B0B0D]">
                <div className="flex flex-col items-center text-center max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#171719] border border-[#303034] flex items-center justify-center text-[#F5F5F3] mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#F5F5F3]" />
                  </div>

                  <Kicker className="mb-2">OFFICIAL SUBMISSION RECEIPT</Kicker>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F3]">
                    Application received.
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-[#A5A5AA] leading-relaxed">
                    Thank you, <span className="text-[#F5F5F3] font-medium">{receipt.founderName}</span>.
                    Your application for <span className="text-[#F5F5F3] font-medium">{receipt.companyName}</span> has
                    been securely recorded and encrypted in the Octopus registry.
                  </p>

                  {/* Application ID Card */}
                  <div className="mt-8 w-full p-5 rounded-xl bg-[#111114] border border-[#303034] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#A5A5AA] font-mono block">
                        Application Identifier
                      </span>
                      <span className="text-xl sm:text-2xl font-mono font-bold text-[#F5F5F3] tracking-tight">
                        {receipt.applicationId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleCopyId}
                        className="gap-2 text-xs"
                      >
                        {copiedId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Reference</span>
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="gap-2 text-xs hidden sm:inline-flex"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Receipt</span>
                      </Button>
                    </div>
                  </div>

                  {/* Submission Metadata */}
                  <div className="mt-4 w-full grid grid-cols-2 gap-3 text-left">
                    <div className="p-3.5 rounded-lg bg-[#171719]/40 border border-[#303034]/60">
                      <span className="text-[11px] font-mono uppercase text-[#A5A5AA] block">Logged Timestamp</span>
                      <span className="text-xs font-mono text-[#F5F5F3]">
                        {new Date(receipt.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#171719]/40 border border-[#303034]/60">
                      <span className="text-[11px] font-mono uppercase text-[#A5A5AA] block">Contact Registered</span>
                      <span className="text-xs font-mono text-[#F5F5F3] truncate block" title={receipt.email}>
                        {receipt.email}
                      </span>
                    </div>
                  </div>

                  {/* Review Timeline */}
                  <div className="mt-8 pt-8 border-t border-[#303034]/60 w-full text-left space-y-4">
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-[#F5F5F3]">
                      What happens next
                    </h3>

                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-7 h-7 rounded-full bg-[#171719] border border-[#303034] flex items-center justify-center shrink-0 text-xs font-mono text-[#F5F5F3]">
                          1
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#F5F5F3]">Dossier Review</h4>
                          <p className="text-xs text-[#A5A5AA] mt-0.5 leading-relaxed">
                            Our investment team conducts rolling evaluations. You will receive an initial status update within 72 hours.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-7 h-7 rounded-full bg-[#171719] border border-[#303034] flex items-center justify-center shrink-0 text-xs font-mono text-[#F5F5F3]">
                          2
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#F5F5F3]">Partner Interview</h4>
                          <p className="text-xs text-[#A5A5AA] mt-0.5 leading-relaxed">
                            Shortlisted founding teams participate in a focused 30-minute technical and product discussion with managing partners.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-7 h-7 rounded-full bg-[#171719] border border-[#303034] flex items-center justify-center shrink-0 text-xs font-mono text-[#F5F5F3]">
                          3
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#F5F5F3]">Cohort Selection & Terms</h4>
                          <p className="text-xs text-[#A5A5AA] mt-0.5 leading-relaxed">
                            Admitted founders receive formal term sheets and onboarding materials prior to Batch 01 kickoff.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => onNavigate('home')}
                      className="flex-1"
                    >
                      Return to Homepage
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setReceipt(null);
                        setFormData({
                          founderName: '',
                          email: '',
                          companyName: '',
                          companyWebsite: '',
                          startupStage: 'Pre-Seed',
                          industry: 'Artificial Intelligence & ML',
                          location: '',
                          shortDescription: '',
                          problemStatement: '',
                          targetCustomer: '',
                          currentProgress: '',
                          whyOctopus: '',
                          coFounderInfo: '',
                        });
                      }}
                      className="flex-1"
                    >
                      Submit Another Application
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            /* =========================================================================
               APPLICATION FORM WORKFLOW
               ========================================================================= */
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* General Error Banner */}
              {generalError && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-sm flex items-start gap-3 animate-in fade-in"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-200">Submission Alert</p>
                    <p className="text-xs text-red-300/90 mt-1 leading-relaxed">{generalError}</p>
                  </div>
                </div>
              )}

              {/* Confidentiality Notice Header */}
              <div className="p-5 rounded-xl bg-[#0B0B0D] border border-[#303034]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#171719] border border-[#303034] text-[#F5F5F3] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F5F3]">Founder Confidentiality Protocol</h3>
                    <p className="text-xs text-[#A5A5AA] mt-1 leading-relaxed">
                      All information submitted is confidential and reviewed exclusively by Octopus investment partners.
                      We never share founder data or require confidential intellectual property.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 font-mono text-[11px] text-[#A5A5AA] uppercase bg-[#171719] px-2.5 py-1 rounded border border-[#303034]">
                  Batch 01 · Rolling Review
                </div>
              </div>

              {/* SECTION 1: FOUNDER & CONTACT DETAILS */}
              <div className="space-y-6">
                <div className="border-b border-[#303034]/60 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#A5A5AA]" />
                    <h3 className="text-base font-bold tracking-tight text-[#F5F5F3]">
                      1. Founder & Contact Information
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#A5A5AA]">Step 1 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Founder Full Name"
                    placeholder="e.g. Elena Vance"
                    value={formData.founderName}
                    onChange={(e) => handleInputChange('founderName', e.target.value)}
                    error={fieldErrors.founderName}
                    required
                  />

                  <Input
                    label="Work / Founder Email"
                    type="email"
                    placeholder="founder@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={fieldErrors.email}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Headquarters / Location"
                    placeholder="e.g. San Francisco, CA or London, UK"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    error={fieldErrors.location}
                    required
                  />

                  <div>
                    <Input
                      label="Company Website / Link"
                      placeholder="https://company.io (optional)"
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                      error={fieldErrors.companyWebsite}
                    />
                    <span className="text-[11px] text-[#A5A5AA] mt-1 block">
                      Leave empty if building in stealth or pre-launch.
                    </span>
                  </div>
                </div>

                <Textarea
                  label="Co-founders & Key Team (Optional)"
                  placeholder="Names, LinkedIn profiles, roles, and technical backgrounds of co-founders..."
                  value={formData.coFounderInfo}
                  onChange={(e) => handleInputChange('coFounderInfo', e.target.value)}
                  rows={2}
                />
              </div>

              {/* SECTION 2: STARTUP PROFILE & STAGE */}
              <div className="space-y-6">
                <div className="border-b border-[#303034]/60 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-[#A5A5AA]" />
                    <h3 className="text-base font-bold tracking-tight text-[#F5F5F3]">
                      2. Startup Profile & Stage
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#A5A5AA]">Step 2 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Startup or Project Name"
                    placeholder="e.g. Helix Systems (or Project Stealth)"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    error={fieldErrors.companyName}
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5AA] mb-2">
                      Primary Industry / Sector <span className="text-[#F5F5F3]">*</span>
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0B0B0D] border border-[#303034] rounded-lg text-sm text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none transition-colors cursor-pointer"
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#0B0B0D] text-[#F5F5F3]">
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Startup Stage Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5AA] mb-3">
                    Current Startup Stage <span className="text-[#F5F5F3]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {STAGES.map((s) => {
                      const isSelected = formData.startupStage === s.value;
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => handleInputChange('startupStage', s.value)}
                          className={`p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-[#171719] border-[#F5F5F3] text-[#F5F5F3] shadow-sm'
                              : 'bg-[#0B0B0D] border-[#303034] text-[#A5A5AA] hover:border-[#A5A5AA] hover:text-[#F5F5F3]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#F5F5F3]">{s.label}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#F5F5F3]" />}
                          </div>
                          <span className="text-[11px] leading-tight block text-[#A5A5AA]">{s.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 3: THE PROPOSITION & THESIS */}
              <div className="space-y-6">
                <div className="border-b border-[#303034]/60 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-[#A5A5AA]" />
                    <h3 className="text-base font-bold tracking-tight text-[#F5F5F3]">
                      3. The Thesis & Problem Space
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#A5A5AA]">Step 3 of 4</span>
                </div>

                <Textarea
                  label="One-Sentence Elevator Pitch"
                  placeholder="e.g. We provide autonomous compliance monitoring for high-frequency trading firms, cutting manual review time by 90%."
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  error={fieldErrors.shortDescription}
                  rows={2}
                  required
                />

                <Textarea
                  label="The Problem Being Solved"
                  placeholder="What is fundamentally broken, expensive, slow, or missing in the market? Why does this pain exist today?"
                  value={formData.problemStatement}
                  onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                  error={fieldErrors.problemStatement}
                  rows={3}
                  required
                />

                <Textarea
                  label="Target Customer & Ideal Buyer"
                  placeholder="Who specifically suffers from this problem? Describe your initial beachhead ICP (ideal customer profile)."
                  value={formData.targetCustomer}
                  onChange={(e) => handleInputChange('targetCustomer', e.target.value)}
                  error={fieldErrors.targetCustomer}
                  rows={2}
                  required
                />
              </div>

              {/* SECTION 4: TRACTION & ACCELERATOR FIT */}
              <div className="space-y-6">
                <div className="border-b border-[#303034]/60 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-[#A5A5AA]" />
                    <h3 className="text-base font-bold tracking-tight text-[#F5F5F3]">
                      4. Traction & Accelerator Fit
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#A5A5AA]">Step 4 of 4</span>
                </div>

                <Textarea
                  label="Current Progress & Traction"
                  placeholder="What have you shipped? Mention prototype progress, waitlist count, active pilot programs, revenue, or key technical breakthroughs."
                  value={formData.currentProgress}
                  onChange={(e) => handleInputChange('currentProgress', e.target.value)}
                  error={fieldErrors.currentProgress}
                  rows={3}
                  required
                />

                <Textarea
                  label="What do you hope to gain from Octopus?"
                  placeholder="Why Octopus over other paths? What are your top 2-3 bottlenecks right now (e.g. enterprise distribution, technical scaling, pricing, fundraising)?"
                  value={formData.whyOctopus}
                  onChange={(e) => handleInputChange('whyOctopus', e.target.value)}
                  error={fieldErrors.whyOctopus}
                  rows={3}
                  required
                />
              </div>

              {/* SUBMIT ACTION & SUMMARY */}
              <div className="pt-6 border-t border-[#303034]/60 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#A5A5AA] flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#F5F5F3]" />
                    <span>Applications are strictly reviewed under partner non-disclosure standards.</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[220px] gap-2 py-3 shadow-md hover:shadow-[0_0_24px_rgba(245,245,243,0.18)]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Dossier...</span>
                      </span>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Container>
      </section>
    </div>
  );
};
