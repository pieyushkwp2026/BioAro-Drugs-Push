import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getMarketConfig, MARKET_STORAGE_KEY } from "./config";
import { loadMarketBootstrap } from "./bootstrap";
import { resolveMarket } from "./resolve";
import type { CountryCode, MarketSource } from "./types";
import { MarketContext } from "./market-context";

export interface MarketContextValue {
  country: CountryCode;
  region: "NA" | "UK";
  currency: "USD" | "CAD" | "GBP";
  source: MarketSource;
  ready: boolean;
  setCountry: (country: CountryCode) => void;
}

const initialMarket = resolveMarket({
  savedCountry: typeof window === "undefined" ? null : window.localStorage.getItem(MARKET_STORAGE_KEY),
  browserLanguages: typeof navigator === "undefined" ? [] : navigator.languages,
});

export function MarketProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>(initialMarket.country);
  const [source, setSource] = useState<MarketSource>(initialMarket.source);
  const [ready, setReady] = useState(initialMarket.source === "override");

  useEffect(() => {
    let active = true;
    const savedCountry = window.localStorage.getItem(MARKET_STORAGE_KEY);

    if (savedCountry) {
      setReady(true);
      return () => {
        active = false;
      };
    }

    void (async () => {
      const bootstrap = await loadMarketBootstrap();
      if (!active) return;
      const resolved = resolveMarket({
        bootstrap,
        browserLanguages: navigator.languages,
      });
      setCountryState(resolved.country);
      setSource(resolved.source);
      setReady(true);
    })();

    return () => {
      active = false;
    };
  }, []);

  const setCountry = (nextCountry: CountryCode) => {
    window.localStorage.setItem(MARKET_STORAGE_KEY, nextCountry);
    setCountryState(nextCountry);
    setSource("override");
    setReady(true);
  };

  const value = useMemo(() => {
    const config = getMarketConfig(country);
    return {
      country,
      region: config.experienceRegion,
      currency: config.currency,
      source,
      ready,
      setCountry,
    } satisfies MarketContextValue;
  }, [country, ready, source]);

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}
