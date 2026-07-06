import { getExperienceRegion, isCountryCode } from "./config";
import type { CountryCode, ExperienceRegion, MarketBootstrap } from "./types";

export interface ResolveMarketOptions {
  savedCountry?: string | null;
  bootstrap?: Partial<MarketBootstrap> | null;
  browserLanguages?: readonly string[];
}

export interface ResolvedMarket {
  country: CountryCode;
  experienceRegion: ExperienceRegion;
  source: "override" | "geoip" | "fallback";
}

export function resolveMarket({ savedCountry, bootstrap, browserLanguages = [] }: ResolveMarketOptions): ResolvedMarket {
  if (savedCountry && isCountryCode(savedCountry)) {
    return {
      country: savedCountry,
      experienceRegion: getExperienceRegion(savedCountry),
      source: "override",
    };
  }

  if (bootstrap?.country && isCountryCode(bootstrap.country)) {
    return {
      country: bootstrap.country,
      experienceRegion: getExperienceRegion(bootstrap.country),
      source: "geoip",
    };
  }

  const prefersUK = browserLanguages.some((language) => language.toLowerCase().includes("gb"));
  const fallbackCountry: CountryCode = prefersUK ? "GB" : "US";

  return {
    country: fallbackCountry,
    experienceRegion: getExperienceRegion(fallbackCountry),
    source: "fallback",
  };
}
