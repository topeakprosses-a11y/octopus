/**
 * Octopus Supporting Pages Content Configuration
 * Centralized, editorial copy and structured placeholders for About, Program, Network, and Contact.
 * Strictly adheres to non-fabrication rules: no invented history, fake teams, or unverified claims.
 */

export interface TeamPlaceholderRole {
  role: string;
  department: string;
  status: 'to_be_announced' | 'in_selection' | 'confidential';
  description: string;
}

export interface ProgramPillar {
  title: string;
  subtitle: string;
  description: string;
  statusText?: string;
}

export interface NetworkCategory {
  id: 'all' | 'companies' | 'founders' | 'partners' | 'mentors';
  label: string;
  count: number;
}

export const supportingPagesContent = {
  about: {
    kicker: 'ABOUT OCTOPUS',
    title: 'Backing exceptional founders from the ground up.',
    subtitle:
      'Octopus is a startup accelerator founded on the belief that enduring institutions are built by ambitious, technical, and mission-obsessed founders.',
    thesis: {
      kicker: 'CORE THESIS',
      headline: 'The craft of company building, restored.',
      paragraphs: [
        'Over the past decade, early-stage acceleration has trended toward industrial volume. Cohorts swelled to hundreds of teams, transforming high-potential founders into anonymous index-fund entries. True advisory was displaced by generic lectures, and high-conviction partnership was replaced by transactional speed.',
        'Octopus operates on an opposing thesis: venture creation is an artisanal discipline that demands intimate, focused, and unreserved partnership. We deliberately limit our cohort size so that our partners, experienced operators, and advisors can immerse themselves alongside founders during the most critical early decisions.',
        'We believe the most valuable enterprises of the coming decades will tackle fundamental, hard problems in distributed infrastructure, intelligent software, bio-computation, and physical-world systems.',
      ],
    },
    philosophyPillars: [
      {
        title: 'Founder First, Unconditionally',
        description:
          'We safeguard founder autonomy, equity integrity, and decision velocity. We do not impose board control or restrictive covenants.',
      },
      {
        title: 'High-Conviction Intimacy',
        description:
          'Small batches mean direct access. When challenges arise in product architecture or customer negotiations, our partners are in the trenches with you.',
      },
      {
        title: 'Compound Horizons',
        description:
          'We do not optimize for early hype cycles. We design business models, governance, and technology stacks engineered to compound value across decades.',
      },
      {
        title: 'Global Native',
        description:
          'Category-defining founders emerge from every continent. We connect regional technical talent directly to premier international capital and enterprise buyers.',
      },
    ],
    governancePlaceholders: [
      {
        role: 'Managing Partners & Investment Committee',
        department: 'Fund Leadership',
        status: 'to_be_announced' as const,
        description:
          'Founding partners and principal investors. Formal bios and backgrounds will be published upon cohort launch.',
      },
      {
        role: 'Visiting Founders & Operator Council',
        department: 'Mentorship & Systems Architecture',
        status: 'in_selection' as const,
        description:
          'Curated council of founders who have scaled engineering systems to global scale, participating in confidential weekly critiques.',
      },
      {
        role: 'Advisory Syndicate & Syndicate Leads',
        department: 'Ecosystem & Capital',
        status: 'to_be_announced' as const,
        description:
          'Institutional angel syndicate and tier-one venture partners participating in private demo sessions.',
      },
    ] as TeamPlaceholderRole[],
  },

  program: {
    kicker: 'THE ACCELERATOR EXPERIENCE',
    title: 'A focused, high-intensity program for ambitious founders.',
    subtitle:
      'Designed to take exceptional technical and product founders from core thesis to enduring company architecture.',
    audience: {
      headline: 'Who the program is for',
      description:
        'Octopus is designed specifically for early-stage founders who are solving fundamental problems and prize execution velocity over presentation.',
      criteria: [
        {
          title: 'Technical and Domain Depth',
          description:
            'Founders with distinct technical capability or proprietary insight into underserved enterprise, scientific, or infrastructure bottlenecks.',
        },
        {
          title: 'Relentless Shipping Velocity',
          description:
            'Teams that measure progress in working software, user feedback loops, and deployment speed rather than theoretical decks.',
        },
        {
          title: 'Long-term Company Builders',
          description:
            'Founders dedicated to constructing lasting institutions with sustainable unit economics and defensible moats.',
        },
      ],
    },
    expectations: {
      headline: 'What founders can expect',
      pillars: [
        {
          title: 'Direct Architectural Reviews',
          subtitle: 'Technical Foundation',
          description:
            'Deep-dive sessions with seasoned engineering leads to evaluate scalability, security boundaries, and data pipelines.',
        },
        {
          title: 'Customer Discovery & Validation',
          subtitle: 'Market Fit',
          description:
            'Targeted introductions to qualified enterprise design partners and prospective early adopters.',
        },
        {
          title: 'Narrative & Syndicate Design',
          subtitle: 'Fundraising Clarity',
          description:
            'Crafting an undeniable, data-backed pitch narrative and assembling high-conviction syndicate leads.',
        },
        {
          title: 'Lifelong Alumni Partnership',
          subtitle: 'Post-Program Support',
          description:
            'Continued follow-on investment reserves, hiring support, and executive advisory throughout future funding stages.',
        },
      ],
    },
    termsNotice: {
      title: 'Standard Investment & Eligibility Terms',
      status: 'Terms Pending Formal Announcement',
      note: 'Octopus provides standardized equity investment to each admitted team. Final check sizes, equity percentages, and residency hub logistics are undergoing regulatory and fund governance finalization.',
    },
    timeline: [
      {
        phase: 'PHASE 01',
        name: 'Foundation & Stress-Testing',
        duration: 'Weeks 1–4',
        focus:
          'Problem validation, customer problem discovery, technical architecture stress-testing, and initial core metrics tracking.',
        status: 'Scheduled',
      },
      {
        phase: 'PHASE 02',
        name: 'Velocity & Customer Adoption',
        duration: 'Weeks 5–8',
        focus:
          'Intensive product sprints, deploying to design partners, user retention analysis, and pricing model exploration.',
        status: 'Scheduled',
      },
      {
        phase: 'PHASE 03',
        name: 'Positioning & Enterprise Distribution',
        duration: 'Weeks 9–10',
        focus:
          'Sales motion design, defensibility narratives, financial modeling, and syndicate syndication.',
        status: 'Scheduled',
      },
      {
        phase: 'PHASE 04',
        name: 'Investor Showcase & Syndicate Day',
        duration: 'Weeks 11–12+',
        focus:
          'Curated private presentations to tier-one venture capital firms, follow-on syndicate closing, and ongoing alumni access.',
        status: 'Scheduled',
      },
    ],
  },

  network: {
    kicker: 'THE OCTOPUS NETWORK',
    title: 'A curated community of builders and partners.',
    subtitle:
      'We are assembling a global network of founders, technical advisors, and institutional partners. Verified records will populate as cohorts are formalized.',
    categories: [
      { id: 'all', label: 'All Records', count: 0 },
      { id: 'companies', label: 'Companies', count: 0 },
      { id: 'founders', label: 'Founders', count: 0 },
      { id: 'partners', label: 'Partners', count: 0 },
      { id: 'mentors', label: 'Advisors & Mentors', count: 0 },
    ] as NetworkCategory[],
    emptyNotice: {
      heading: 'Inaugural Batch Directory in Preparation',
      description:
        'We do not publish placeholder companies or simulated profiles. Once our inaugural cohort selections are finalized, comprehensive company profiles, founder dossiers, and ecosystem partner directories will be published here.',
    },
  },

  contact: {
    kicker: 'CONTACT & INQUIRIES',
    title: 'Get in touch with Octopus.',
    subtitle:
      'Have a question about our program, admissions process, or institutional partnerships? Reach out to our dedicated channels below.',
    channels: [
      {
        id: 'admissions',
        department: 'Admissions & Applications',
        email: 'admissions@octopus.vc',
        purpose: 'Cohort eligibility, application timeline, and founder questions.',
      },
      {
        id: 'partnerships',
        department: 'Institutional Partnerships & Press',
        email: 'press@octopus.vc',
        purpose: 'Venture syndicate inquiries, enterprise partnerships, and media.',
      },
      {
        id: 'general',
        department: 'General Inquiries',
        email: 'inquiries@octopus.vc',
        purpose: 'General operations and ecosystem collaboration.',
      },
    ],
    location: {
      hub: 'San Francisco Residency Hub',
      note: 'In-person residency location details are provided directly to admitted founders and invited partners.',
    },
  },
};
