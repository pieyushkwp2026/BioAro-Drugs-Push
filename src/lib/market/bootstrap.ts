import { isCountryCode } from "./config";
import type { MarketBootstrap } from "./types";

declare global {
  interface Window {
    __BIOARO_BOOTSTRAP__?: Partial<MarketBootstrap>;
  }
}

const BOOTSTRAP_URL = import.meta.env.VITE_MARKET_BOOTSTRAP_URL;

function normalizeBootstrap(value: Partial<MarketBootstrap> | null | undefined): MarketBootstrap | null {
  if (!value?.country || !isCountryCode(value.country)) return null;

  return {
    country: value.country,
    currency: value.currency ?? (value.country === "CA" ? "CAD" : value.country === "GB" ? "GBP" : "USD"),
    experienceRegion: value.experienceRegion ?? (value.country === "GB" ? "UK" : "NA"),
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
