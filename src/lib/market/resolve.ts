import { DEFAULT_MARKET, countryFromMarketCode, normalizeMarketIdentifier, type MarketCode } from "../../config/markets";
import type { CountryCode, ExperienceRegion, MarketBootstrap, MarketSource } from "./types";

export interface ResolveMarketOptions {
  pathname?: string;
  savedMarket?: string | null;
  bootstrap?: Partial<MarketBootstrap> | null;
  browserLanguages?: readonly string[];
}

export interface ResolvedMarket {
  market: MarketCode;
  country: CountryCode;
  experienceRegion: ExperienceRegion;
  source: MarketSource;
}

function marketFromLanguage(language: string): MarketCode | null {
  const normalized = language.toLowerCase();
  if (normalized.includes("ae")) return "ae";
  if (normalized.includes("ca")) return "ca";
  if (normalized.includes("gb") || normalized.includes("uk")) return "uk";
  if (normalized.includes("us") || normalized.includes("en")) return "us";
  return null;
}

export function resolveMarket({ pathname, savedMarket, bootstrap, browserLanguages = [] }: ResolveMarketOptions): ResolvedMarket {
  if (pathname) {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    const fromPath = firstSegment ? normalizeMarketIdentifier(firstSegment) : null;
    if (fromPath) {
      return {
        market: fromPath,
        country: countryFromMarketCode(fromPath),
        experienceRegion: fromPath === "uk" ? "UK" : "NA",
        source: "path",
      };
    }
  }

  if (savedMarket) {
    const fromSaved = normalizeMarketIdentifier(savedMarket);
    if (fromSaved) {
      return {
        market: fromSaved,
        country: countryFromMarketCode(fromSaved),
        experienceRegion: fromSaved === "uk" ? "UK" : "NA",
        source: "override",
      };
    }
  }

  if (bootstrap?.market) {
    const market = normalizeMarketIdentifier(bootstrap.market) ?? DEFAULT_MARKET;
    return {
      market,
      country: countryFromMarketCode(market),
      experienceRegion: market === "uk" ? "UK" : "NA",
      source: "geoip",
    };
  }

  if (bootstrap?.country) {
    const market = normalizeMarketIdentifier(bootstrap.country) ?? DEFAULT_MARKET;
    return {
      market,
      country: countryFromMarketCode(market),
      experienceRegion: market === "uk" ? "UK" : "NA",
      source: "geoip",
    };
  }

  const preferredMarket = browserLanguages.map(marketFromLanguage).find((market): market is MarketCode => Boolean(market));
  const market = preferredMarket ?? DEFAULT_MARKET;

  return {
    market,
    country: countryFromMarketCode(market),
    experienceRegion: market === "uk" ? "UK" : "NA",
    source: "fallback",
  };
}
