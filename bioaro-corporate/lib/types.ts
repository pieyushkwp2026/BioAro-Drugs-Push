export interface NavItem {
  label: string;
  href: string;
}

export interface OfferingCardContent {
  title: string;
  tagline: string;
  description: string;
  href: string;
  cta: string;
  bullets: string[];
}

export interface LabCategory {
  id: string;
  label: string;
}

export interface LabTest {
  title: string;
  category: string;
  description: string;
  badge?: string;
}

export interface DrugProduct {
  title: string;
  category: string;
  description: string;
  href: string;
}

export interface Capability {
  title: string;
  description: string;
}

export interface LivingFlowStep {
  title: string;
  label?: string;
  description: string;
}

export interface FooterNavGroup {
  title: string;
  links: { label: string; href: string }[];
}
