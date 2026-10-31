import React, { useState } from 'react';
import { Container } from '@/src/components/ui/Container';
import { Button } from '@/src/components/ui/Button';
import { Kicker } from '@/src/components/ui/Kicker';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { supportingPagesContent } from '@/src/content/supportingPages';
import { PageView } from '@/src/components/layout/Navbar';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Clock,
  Send,
  Building,
} from 'lucide-react';

interface ContactViewProps {
  onNavigate?: (view: PageView) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const { contact } = supportingPagesContent;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('admissions');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Please provide your name.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Please provide a valid email.';
    if (!message.trim() || message.length < 10)
      errs.message = 'Please provide a message with at least 10 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 1. PAGE HEADER */}
      <PageHeader
        kicker={contact.kicker}
        title={contact.title}
        subtitle={contact.subtitle}
        onBack={onNavigate ? () => onNavigate('home') : undefined}
        backLabel="Back to Overview"
      />

      {/* 2. CONTACT DETAILS & DIRECT CHANNELS */}
      <section className="py-20 md:py-28 border-b border-[#303034]/40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Official Channels & Hub Info */}
            <div className="lg:col-span-5 flex flex-col space-y-8">
              <div>
                <Kicker className="mb-3">COMMUNICATION CHANNELS</Kicker>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F3]">
                  Direct inquiries.
                </h2>
                <p className="mt-3 text-sm text-[#A5A5AA] leading-relaxed">
                  To ensure rapid routing, please direct your message to the appropriate functional channel.
                </p>
              </div>

              {/* Channels List */}
              <div className="space-y-4">
                {contact.channels.map((chan) => (
                  <Card key={chan.id} variant="flat" padding="md" className="border-[#303034]">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-[#171719] border border-[#303034] flex items-center justify-center text-[#F5F5F3] shrink-0 mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[#F5F5F3]">
                          {chan.department}
                        </h3>
                        <a
                          href={`mailto:${chan.email}`}
                          className="text-xs font-mono text-[#F5F5F3] hover:underline block mt-0.5"
                        >
                          {chan.email}
                        </a>
                        <p className="text-xs text-[#A5A5AA] mt-1 leading-relaxed">
                          {chan.purpose}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Physical Hub Policy */}
              <Card variant="flat" padding="md" className="border-[#303034] bg-[#0B0B0D]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#171719] border border-[#303034] flex items-center justify-center text-[#F5F5F3] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F5F3]">
                      {contact.location.hub}
                    </h3>
                    <p className="text-xs text-[#A5A5AA] mt-1 leading-relaxed">
                      {contact.location.note}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Working Functional Contact Form */}
            <div className="lg:col-span-7">
              <Card variant="flat" padding="lg" className="border-[#303034]">
                <div className="pb-6 mb-6 border-b border-[#303034]/60">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#A5A5AA]">
                    DISPATCH FORM
                  </span>
                  <h3 className="text-xl font-bold text-[#F5F5F3] mt-1">
                    Send an institutional dispatch.
                  </h3>
                </div>

                {submitted ? (
                  <div className="py-12 text-center animate-in fade-in duration-300">
                    <CheckCircle2 className="w-12 h-12 text-[#F5F5F3] mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-[#F5F5F3]">Dispatch recorded.</h4>
                    <p className="text-sm text-[#A5A5AA] mt-2 max-w-md mx-auto leading-relaxed">
                      Thank you, {name}. Your inquiry has been routed to the {department} committee.
                      A team member will follow up at <span className="text-[#F5F5F3]">{email}</span> within one business day.
                    </p>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setMessage('');
                      }}
                      className="mt-6"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        placeholder="Ada Lovelace"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                        required
                      />

                      <Input
                        label="Work Email"
                        type="email"
                        placeholder="founder@venture.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="dept-select"
                        className="block text-xs font-medium uppercase tracking-[0.15em] text-[#A5A5AA]"
                      >
                        Destination Channel
                      </label>
                      <select
                        id="dept-select"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full rounded-lg border border-[#303034] bg-[#0B0B0D] px-4 py-3 text-sm text-[#F5F5F3] focus:border-[#F5F5F3] focus:outline-none focus:ring-1 focus:ring-[#F5F5F3] min-h-[44px] cursor-pointer"
                      >
                        <option value="admissions">Admissions & Applications</option>
                        <option value="partnerships">Venture Syndicate & Press</option>
                        <option value="general">General Operations</option>
                      </select>
                    </div>

                    <Textarea
                      label="Inquiry / Message"
                      placeholder="Outline your company focus, traction metrics, or partnership proposal..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      error={errors.message}
                      rows={5}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      className="gap-2 mt-4"
                    >
                      <span>Transmit Dispatch</span>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
