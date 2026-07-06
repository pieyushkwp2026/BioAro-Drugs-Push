import type { CountryCode, ExperienceRegion, MarketConfig } from "./types";

export const MARKET_STORAGE_KEY = "bioaro.market.country";

export const MARKET_CONFIGS: Record<CountryCode, MarketConfig> = {
  US: {
    country: "US",
    currency: "USD",
    experienceRegion: "NA",
    label: "United States",
    shortLabel: "US",
  },
  CA: {
    country: "CA",
    currency: "CAD",
    experienceRegion: "NA",
    label: "Canada",
    shortLabel: "CA",
  },
  GB: {
    country: "GB",
    currency: "GBP",
    experienceRegion: "UK",
    label: "United Kingdom",
    shortLabel: "UK",
  },
};

export const MARKET_ORDER: CountryCode[] = ["US", "CA", "GB"];

export function isCountryCode(value: string): value is CountryCode {
  return value in MARKET_CONFIGS;
}

export function getMarketConfig(country: CountryCode): MarketConfig {
  return MARKET_CONFIGS[country];
}

export function getExperienceRegion(country: CountryCode): ExperienceRegion {
  return MARKET_CONFIGS[country].experienceRegion;
}

export function currencySymbol(currency: MarketConfig["currency"]): string {
  switch (currency) {
    case "CAD":
      return "CA$";
    case "GBP":
      return "£";
    default:
      return "$";
  }
}

export function formatMoney(amount: number, country: CountryCode): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: getMarketConfig(country).currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
