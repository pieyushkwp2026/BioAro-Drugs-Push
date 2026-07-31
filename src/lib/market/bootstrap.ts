import { getMarketConfigByMarket, isCountryCode, marketFromCountryCode, normalizeMarketIdentifier } from "../../config/markets";
import type { MarketBootstrap } from "./types";

declare global {
  interface Window {
    __BIOARO_BOOTSTRAP__?: Partial<MarketBootstrap>;
  }
}

const BOOTSTRAP_URL = import.meta.env.VITE_MARKET_BOOTSTRAP_URL;

function normalizeBootstrap(value: Partial<MarketBootstrap> | null | undefined): MarketBootstrap | null {
  if (!value) return null;

  const market =
    (value.market && normalizeMarketIdentifier(value.market)) ||
    (value.country && isCountryCode(value.country) ? marketFromCountryCode(value.country) : null);

  if (!market) return null;

  const marketConfig = getMarketConfigByMarket(market);
  return {
    market,
    country: value.country ?? marketConfig.countryCode,
    currency: value.currency ?? marketConfig.currency,
    experienceRegion: value.experienceRegion ?? marketConfig.experienceRegion,
  };
}

export async function loadMarketBootstrap(): Promise<MarketBootstrap | null> {
  const inlineBootstrap = normalizeBootstrap(window.__BIOARO_BOOTSTRAP__);
  if (inlineBootstrap) return inlineBootstrap;

  if (!BOOTSTRAP_URL) return null;

  try {
    const response = await fetch(BOOTSTRAP_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    return normalizeBootstrap((await response.json()) as Partial<MarketBootstrap>);
  } catch {
    return null;
  }
}
