
export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    location?: string;
    website?: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string; // Keep as a block of text/markdown for simplicity in editing
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export enum ResumeStyle {
  MODERN = 'Modern',
  CLASSIC = 'Classic',
  MINIMAL = 'Minimal',
  TECH = 'Tech',
  CREATIVE = 'Creative',
}

export enum Industry {
  GENERAL = 'General',
  TECH = 'Technology',
  FINANCE = 'Finance',
  CREATIVE = 'Creative',
  HEALTHCARE = 'Healthcare',
  MARKETING = 'Marketing',
  ENGINEERING = 'Engineering',
  SALES = 'Sales',
  EDUCATION = 'Education',
  LEGAL = 'Legal',
  CUSTOMER_SERVICE = 'Customer Service',
  REAL_ESTATE = 'Real Estate',
  HR = 'Human Resources',
}

export interface GenerationState {
  isParsing: boolean;
  isImproving: boolean;
  loadingMessage: string;
}
