export type ApplicationStatus =
  | 'Received'
  | 'Under Review'
  | 'Shortlisted'
  | 'Accepted'
  | 'Not Moving Forward';

export type StartupStage =
  | 'Idea / Concept'
  | 'Pre-Seed'
  | 'Seed'
  | 'Early Traction / Growth';

export interface AdminReviewNote {
  id: string;
  author: string;
  note: string;
  createdAt: string;
}

export interface FounderApplication {
  id: string; // e.g. OCT-2026-F8A1B2
  founderName: string;
  email: string;
  companyName: string;
  companyWebsite?: string;
  startupStage: StartupStage;
  industry: string;
  location: string;
  shortDescription: string;
  problemStatement: string;
  targetCustomer: string;
  currentProgress: string;
  whyOctopus: string;
  coFounderInfo?: string;
  status: ApplicationStatus;
  internalNotes: AdminReviewNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationSubmissionPayload {
  founderName: string;
  email: string;
  companyName: string;
  companyWebsite?: string;
  startupStage: StartupStage;
  industry: string;
  location: string;
  shortDescription: string;
  problemStatement: string;
  targetCustomer: string;
  currentProgress: string;
  whyOctopus: string;
  coFounderInfo?: string;
}

export interface ApplicationReceipt {
  success: boolean;
  applicationId: string;
  companyName: string;
  founderName: string;
  email: string;
  createdAt: string;
  message: string;
}
