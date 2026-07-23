import type {
  CountryCode as RegionalCountryCode,
  CurrencyCode as RegionalCurrencyCode,
  ExperienceRegion as RegionalExperienceRegion,
  MarketAddress,
  MarketCode as RegionalMarketCode,
  MarketConfig as RegionalMarketConfig,
  MarketIdentifier,
} from "../../config/markets";

export type CountryCode = RegionalCountryCode;
export type ExperienceRegion = RegionalExperienceRegion;
export type MarketCode = RegionalMarketCode;
export type CurrencyCode = RegionalCurrencyCode;
export type MarketConfig = RegionalMarketConfig;

export interface MarketBootstrap {
  market?: MarketCode;
  country?: CountryCode;
  currency?: CurrencyCode;
  experienceRegion?: ExperienceRegion;
}

export type MarketSource = "override" | "geoip" | "fallback" | "path";

export type { MarketAddress, MarketIdentifier };
