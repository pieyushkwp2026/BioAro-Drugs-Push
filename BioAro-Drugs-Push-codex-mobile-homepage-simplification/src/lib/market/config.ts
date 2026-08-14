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

export function formatMoneyOrPending(amount: number | null | undefined, countryOrMarket: CountryCode | MarketCode, pendingLabel = "Price pending"): string {
  if (amount == null || amount <= 0) return pendingLabel;
  return formatMoney(amount, countryOrMarket);
}

/*
 * Does the currency a price actually arrived in match the one this market renders?
 *
 * This gap is invisible by construction. `formatMoney` above formats with the
 * MARKET's currency and ignores `price.currencyCode` entirely, so when Shopify has
 * no market configured for a country it falls back to the shop's default currency
 * and we print a GBP number as "$113.99". Nothing about that looks wrong on screen.
 * The hosted Shopify checkout then renders in the real currency, so a US buyer can
 * be shown dollars all the way through the site and pounds at the payment step.
 *
 * A missing/empty code is treated as a match: preview carts stamp the market's own
 * currency, and refusing to sell over absent data would be worse than the bug.
 */
export function isCurrencyAlignedWithMarket(
  currencyCode: string | null | undefined,
  countryOrMarket: CountryCode | MarketCode,
): boolean {
  if (!currencyCode) return true;
  const market = isMarketCode(countryOrMarket) ? countryOrMarket : marketFromCountryCode(countryOrMarket);
  return currencyCode.toUpperCase() === getMarketConfigByMarket(market).currency;
}

/*
 * The only safe way to print a price that came from Shopify.
 *
 * `formatMoney` formats with the MARKET's currency and ignores what the amount is
 * actually denominated in, so a mismatch is rendered as a correct-looking local
 * price. This is live today: the Storefront API does not recognise CA as a market on
 * this store — `@inContext(country: CA)` answers with `localization.country = US` —
 * so /ca receives USD amounts and printed them with Canada's "$". A visitor saw
 * $113.99 for a product the cart charges CAD 89.99 for.
 *
 * When the denomination does not match the market we withhold the number rather than
 * mislabel it. Fixing this properly means configuring the missing market in Shopify;
 * until then, no price is better than a wrong one.
 */
export function formatCatalogMoney(
  money: { amount: number; currencyCode?: string | null } | null | undefined,
  countryOrMarket: CountryCode | MarketCode,
  pendingLabel = "Price pending",
): string {
  if (!money || money.amount == null || money.amount <= 0) return pendingLabel;
  if (!isCurrencyAlignedWithMarket(money.currencyCode, countryOrMarket)) return pendingLabel;
  return formatMoney(money.amount, countryOrMarket);
}
