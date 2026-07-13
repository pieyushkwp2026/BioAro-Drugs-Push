import { AE_MARKET } from "./ae";
import { CA_MARKET } from "./ca";
import { UK_MARKET } from "./uk";
import { US_MARKET } from "./us";
import type { CountryCode, MarketCode, MarketConfig, MarketIdentifier } from "./types";

export { AE_MARKET, CA_MARKET, UK_MARKET, US_MARKET };
export type { CountryCode, CurrencyCode, ExperienceRegion, MarketAddress, MarketCode, MarketConfig, MarketIdentifier } from "./types";

export const MARKET_CONFIGS: Record<MarketCode, MarketConfig> = {
  uk: UK_MARKET,
  us: US_MARKET,
  ca: CA_MARKET,
  ae: AE_MARKET,
};

export const MARKET_ORDER: MarketCode[] = ["uk", "us", "ca", "ae"];
export const DEFAULT_MARKET: MarketCode = "uk";

const COUNTRY_TO_MARKET: Record<CountryCode, MarketCode> = {
  GB: "uk",
  US: "us",
  CA: "ca",
  AE: "ae",
};

export function isMarketCode(value: string): value is MarketCode {
  return value in MARKET_CONFIGS;
}

export function isCountryCode(value: string): value is CountryCode {
  return value in COUNTRY_TO_MARKET;
}

export function normalizeMarketIdentifier(value: MarketIdentifier | string): MarketCode | null {
  const lower = value.toLowerCase();
  if (isMarketCode(lower)) return lower;
  const upper = value.toUpperCase();
  if (isCountryCode(upper)) return COUNTRY_TO_MARKET[upper];
  return null;
}

export function marketFromCountryCode(country: CountryCode): MarketCode {
  return COUNTRY_TO_MARKET[country];
}

export function countryFromMarketCode(market: MarketCode): CountryCode {
  return MARKET_CONFIGS[market].countryCode;
}

export function getMarketConfig(identifier: MarketIdentifier | string): MarketConfig {
  const market = normalizeMarketIdentifier(identifier);
  if (!market) return MARKET_CONFIGS[DEFAULT_MARKET];
  return MARKET_CONFIGS[market];
}

export function getMarketConfigByMarket(market: MarketCode): MarketConfig {
  return MARKET_CONFIGS[market];
}

export function getMarketConfigByCountry(country: CountryCode): MarketConfig {
  return MARKET_CONFIGS[marketFromCountryCode(country)];
}

export function isProductAvailableInMarket(productHandle: string, market: MarketCode): boolean {
  return MARKET_CONFIGS[market].availableProducts.includes(productHandle);
}

export function isProductComingSoonInMarket(productHandle: string, market: MarketCode): boolean {
  return MARKET_CONFIGS[market].comingSoonProducts.includes(productHandle);
}
