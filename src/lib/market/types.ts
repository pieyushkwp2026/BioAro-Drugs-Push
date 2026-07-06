export type CountryCode = "US" | "CA" | "GB";
export type ExperienceRegion = "NA" | "UK";
export type MarketSource = "override" | "geoip" | "fallback";

export interface MarketBootstrap {
  country: CountryCode;
  currency: "USD" | "CAD" | "GBP";
  experienceRegion: ExperienceRegion;
}

export interface MarketConfig {
  country: CountryCode;
  currency: "USD" | "CAD" | "GBP";
  experienceRegion: ExperienceRegion;
  label: string;
  shortLabel: string;
}
