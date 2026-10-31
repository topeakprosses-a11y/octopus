export type PortfolioRecordType =
  | 'company'
  | 'investment'
  | 'founder'
  | 'partner'
  | 'mentor'
  | 'ecosystem';

export type PortfolioStatus = 'active' | 'alumni' | 'partner' | 'advisor';

export interface ExternalLinkItem {
  label: string;
  url: string;
}

export interface InvestmentDetails {
  stage?: string;
  roundParticipation?: string;
  syndicatePartners?: string[];
}

export interface PortfolioRecord {
  id: string;
  type: PortfolioRecordType;
  name: string;
  headline?: string;
  shortDescription: string;
  fullDescription?: string;
  sector: string;
  batchOrYear?: string;
  relationship: string;
  status: PortfolioStatus;
  logoUrl?: string;
  imageUrl?: string;
  websiteUrl?: string;
  externalLinks?: ExternalLinkItem[];
  investmentDetails?: InvestmentDetails;
  location?: string;
  founders?: string[];
  tags?: string[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioRecordPayload {
  type: PortfolioRecordType;
  name: string;
  headline?: string;
  shortDescription: string;
  fullDescription?: string;
  sector: string;
  batchOrYear?: string;
  relationship: string;
  status?: PortfolioStatus;
  logoUrl?: string;
  imageUrl?: string;
  websiteUrl?: string;
  externalLinks?: ExternalLinkItem[];
  investmentDetails?: InvestmentDetails;
  location?: string;
  founders?: string[];
  tags?: string[];
  published?: boolean;
  featured?: boolean;
}

export interface PortfolioCategoryMeta {
  id: string;
  label: string;
  typeFilter: PortfolioRecordType | 'all';
  description: string;
  count: number;
}
