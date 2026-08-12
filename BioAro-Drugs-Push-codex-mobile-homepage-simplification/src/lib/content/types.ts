export interface PageCta {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "link";
}

export interface PageHeroContent {
  eyebrow?: string;
  title: string;
  description: string;
  note?: string;
  primaryCta?: PageCta;
  secondaryCta?: PageCta;
}

export interface PageSectionContent {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

export interface PolicyPageContent {
  hero: PageHeroContent;
  sections: PageSectionContent[];
  cta?: PageCta;
}

export interface SupportContactMethod {
  label: string;
  value: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export interface ProtocolContent {
  title: string;
  description: string;
  suggestedFit: string[];
  positioning: string;
  handleGroup: string[];
}

export interface QualityDocument {
  title: string;
  description: string;
  href: string;
}
