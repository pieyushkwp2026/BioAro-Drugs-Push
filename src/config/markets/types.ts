export type MarketCode = "uk" | "us" | "ca" | "ae";
export type CountryCode = "GB" | "US" | "CA" | "AE";
export type CurrencyCode = "GBP" | "USD" | "CAD" | "AED";
export type ExperienceRegion = "UK" | "NA";

export interface MarketAddress {
  line1: string;
  line2?: string;
  city?: string;
  postcode?: string;
  country: string;
}

export interface MarketConfig {
  code: MarketCode;
  countryCode: CountryCode;
  name: string;
  shortLabel: string;
  locale: string;
  currency: CurrencyCode;
  currencySymbol: string;
  flag: string;
  companyName: string;
  supportEmail: string;
  address: MarketAddress | null;
  checkoutEnabled: boolean;
  checkoutMessage: string;
  shippingMessage: string;
  taxMessage: string;
  legalDisclaimer: string;
  shippingPolicyPath: string;
  returnsPolicyPath: string;
  privacyPolicyPath: string;
  availableProducts: string[];
  comingSoonProducts: string[];
  experienceRegion: ExperienceRegion;
}

export type MarketIdentifier = MarketCode | CountryCode;
