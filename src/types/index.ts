export type AIProvider = 'claude' | 'gemini';
export type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.5-pro';

export interface OutputField {
  id: string;
  label: string;
  enabled: boolean;
  required: boolean; // For accurate search mode
}

export interface LeadQuery {
  id: string;
  timestamp: string;
  companyDescription: string;
  locations: string[];
  industry: string[];
  companySizeMin: string;
  companySizeMax: string;
  personas: string[];
  additionalCriteria: string;
  outputFields: OutputField[];
  searchMode: 'accurate' | 'loose';
  maxResults: number;
  pdfData?: string;
}

export interface FormData {
  companyDescription: string;
  locations: string[];
  industry: string[];
  companySizeMin: string;
  companySizeMax: string;
  personas: string[];
  additionalCriteria: string;
  outputFields: OutputField[];
  searchMode: 'accurate' | 'loose';
  maxResults: number;
}
