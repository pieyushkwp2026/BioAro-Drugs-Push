import {
  DEFAULT_MARKET,
  MARKET_CONFIGS as REGIONAL_MARKET_CONFIGS,
  MARKET_ORDER as REGIONAL_MARKET_ORDER,
  countryFromMarketCode,
  getMarketConfigByCountry,
  getMarketConfigByMarket,
  isCountryCode,
  isMarketCode,
  marketFromCountryCode,
  type CountryCode,
  type CurrencyCode,
  type ExperienceRegion,
  type MarketCode,
  type MarketConfig,
} from "../../config/markets";
import type { MarketIdentifier } from "./types";

export const MARKET_STORAGE_KEY = "bioaro.market.code";

export const MARKET_CONFIGS = REGIONAL_MARKET_CONFIGS;
export const MARKET_ORDER = REGIONAL_MARKET_ORDER;
export { DEFAULT_MARKET, isCountryCode, isMarketCode, marketFromCountryCode, countryFromMarketCode, getMarketConfigByCountry, getMarketConfigByMarket };
export type { CountryCode, CurrencyCode, ExperienceRegion, MarketCode, MarketConfig, MarketIdentifier };

export function getMarketConfig(identifier: MarketIdentifier | string): MarketConfig {
  if (isMarketCode(identifier)) {
    return getMarketConfigByMarket(identifier);
  }
  if (isCountryCode(identifier)) {
    return getMarketConfigByCountry(identifier);
  }
  const normalized = identifier.toLowerCase();
  if (isMarketCode(normalized)) return getMarketConfigByMarket(normalized);
  const upper = identifier.toUpperCase();
  if (isCountryCode(upper)) return getMarketConfigByCountry(upper);
  return getMarketConfigByMarket(DEFAULT_MARKET);
}

export function getExperienceRegion(country: CountryCode): ExperienceRegion {
  return getMarketConfigByCountry(country).experienceRegion;
}

export function currencySymbol(currency: CurrencyCode): string {
  switch (currency) {
    case "CAD":
      return "CA$";
    case "AED":
      return "AED";
    case "GBP":
      return "£";
    default:
      return "$";
  }
}

export function formatMoney(amount: number, countryOrMarket: CountryCode | MarketCode): string {
  const market = isMarketCode(countryOrMarket) ? countryOrMarket : marketFromCountryCode(countryOrMarket);
  const marketConfig = getMarketConfigByMarket(market);

  return new Intl.NumberFormat(marketConfig.locale, {
    style: "currency",
    currency: marketConfig.currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
