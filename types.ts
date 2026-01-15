export enum Page {
  HOME = 'HOME',
  INSTITUTION = 'INSTITUTION',
  SERVICES = 'SERVICES',
  VAULT = 'VAULT',
  CONCIERGE = 'CONCIERGE'
}

export enum Language {
  EN = 'en',
  AR = 'ar'
}

export interface NavItem {
  label: string;
  page: Page;
}

export interface Artifact {
  id: string;
  title: string;
  collection: string;
  image: string;
  description: string;
  era?: string;
  material?: string;
  img?: string; // Legacy support
}