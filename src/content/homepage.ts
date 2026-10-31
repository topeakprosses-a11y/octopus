/**
 * Octopus Homepage Content Configuration
 * Centralized, editorial copy and structured placeholders.
 * All content is provisional and strictly avoids unverified claims or fake entities.
 */

export interface PropositionTheme {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ProgramDetail {
  label: string;
  value: string;
  status: 'confirmed' | 'pending' | 'tba';
}

export interface FounderFocusAttribute {
  id: string;
  title: string;
  description: string;
}

export interface PortfolioCompany {
  id: string;
  name: string;
  oneLiner: string;
  category: string;
  cohort: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export const homepageContent = {
  hero: {
    kicker: 'OCTOPUS · STARTUP ACCELERATOR',
    headline: 'For founders building what comes next.',
    supportingCopy:
      'Octopus is a startup accelerator for ambitious founders turning promising ideas into enduring companies.',
    primaryCta: 'Apply to Octopus',
    secondaryCta: 'Explore Proposition',
    batchTag: 'Inaugural Cohort · Admissions Preparing',
  },

  proposition: {
    kicker: 'ACCELERATOR PROPOSITION',
    headline: 'An institution designed around the builder.',
    supportingCopy:
      'We are creating a high-conviction environment focused on deep company fundamentals, strategic clarity, and lifelong peer alignment.',
    themes: [
      {
        id: 'founder-development',
        number: '01',
        title: 'Founder Development',
        description:
          'Sharpening leadership stamina, decision architecture, and executive clarity during high-velocity early phases.',
      },
      {
        id: 'company-building',
        number: '02',
        title: 'Company Building',
        description:
          'Hands-on problem validation, rigorous systems architecture, customer discovery, and engineering discipline.',
      },
      {
        id: 'strategic-guidance',
        number: '03',
        title: 'Strategic Guidance',
        description:
          'Unvarnished critique, defensibility assessment, go-to-market design, and long-term positioning strategy.',
      },
      {
        id: 'connections-collaboration',
        number: '04',
        title: 'Connections & Collaboration',
        description:
          'Fostering a close-knit cohort of ambitious peers, future design partners, and aligned ecosystem collaborators.',
      },
    ] as PropositionTheme[],
  },

  program: {
    kicker: 'PROGRAM OVERVIEW',
    headline: 'Structured for velocity and focus.',
    supportingCopy:
      'A deliberate, high-intensity accelerator framework designed to help founders transition from foundational concept to enduring enterprise.',
    details: [
      {
        label: 'Program Duration',
        value: '12 Weeks',
        status: 'pending',
      },
      {
        label: 'Cohort Schedule',
        value: 'Inaugural Batch · Dates pending',
        status: 'pending',
      },
      {
        label: 'Funding Terms',
        value: 'Standardized equity terms',
        status: 'tba',
      },
      {
        label: 'Eligibility',
        value: 'Pre-seed & seed stage teams',
        status: 'pending',
      },
      {
        label: 'Format',
        value: 'Residency with hybrid sprint phases',
        status: 'pending',
      },
      {
        label: 'Selection Criteria',
        value: 'Technical depth, domain insight, execution speed',
        status: 'pending',
      },
    ] as ProgramDetail[],
    phases: [
      {
        phase: 'PHASE 01',
        title: 'Foundational Validation',
        focus: 'Problem definition, initial customer stress-testing, and technical architecture.',
      },
      {
        phase: 'PHASE 02',
        title: 'Product & Engine Building',
        focus: 'Iterative build velocity, product feedback loops, and early usage validation.',
      },
      {
        phase: 'PHASE 03',
        title: 'Ecosystem & Investor Showcase',
        focus: 'Positioning refinement, syndicate introductions, and long-term advisory alignment.',
      },
    ],
  },

  founderFocus: {
    kicker: 'FOR FOUNDERS',
    headline: 'Who we intend to back.',
    supportingCopy:
      'We seek builders who care deeply about the craft of company building, operate with urgency, and aim to solve fundamental problems.',
    attributes: [
      {
        id: 'technical-depth',
        title: 'Technical Conviction & Depth',
        description:
          'Engineers, researchers, and domain experts building at the frontier of infrastructure, software, and real-world systems.',
      },
      {
        id: 'execution-urgency',
        title: 'Relentless Execution Urgency',
        description:
          'Founders who prize shipping cadence, rapid feedback iteration, and demonstrable progress over vanity presentation.',
      },
      {
        id: 'high-integrity',
        title: 'Long-term Integrity & Focus',
        description:
          'Leaders committed to building enduring institutions that generate compound value for their customers and teams.',
      },
      {
        id: 'global-ambition',
        title: 'Global Mindset from Day Zero',
        description:
          'Teams looking beyond regional borders to address global markets and scalable opportunities.',
      },
    ] as FounderFocusAttribute[],
  },

  network: {
    kicker: 'THE OCTOPUS NETWORK',
    headline: 'A community of builders and partners.',
    supportingCopy:
      'We are assembling a curated ecosystem of founders, technical advisors, and institutional partners.',
    // Ready for future portfolio companies: initially empty per strict non-fabrication requirement
    portfolio: [] as PortfolioCompany[],
    emptyState: {
      title: 'Portfolio companies coming soon.',
      description:
        'We are currently selecting founders for our inaugural cohort. Portfolio companies and strategic partners will be published here upon official cohort commencement.',
      actionPrompt: 'Be notified when the inaugural batch is announced',
    },
  },

  finalCta: {
    kicker: 'APPLICATIONS PENDING',
    headline: 'Ready to build what comes next?',
    supportingCopy:
      'Our application portal is currently in final preparation. Register your interest below to receive priority access the moment applications open.',
    primaryCta: 'Apply to Octopus',
    secondaryCta: 'Register for Updates',
  },

  footer: {
    brandName: 'OCTOPUS',
    tagline: 'STARTUP ACCELERATOR',
    copyright: '© 2026 Octopus. All rights reserved.',
    inquiriesEmail: 'inquiries@octopus.vc',
    admissionsEmail: 'admissions@octopus.vc',
  },
};
