import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DEFAULT_MARKET,
  countryFromMarketCode,
  getMarketConfigByMarket,
  marketFromCountryCode,
} from "../../config/markets";
import { buildMarketPath, buildMarketHref, getMarketFromPathname, stripMarketPrefix } from "../marketRouting";
import { loadMarketBootstrap } from "./bootstrap";
import { resolveMarket } from "./resolve";
import type { CountryCode, CurrencyCode, ExperienceRegion, MarketCode, MarketSource } from "./types";
import { MarketContext } from "./market-context";
import { MARKET_STORAGE_KEY } from "./config";

export interface MarketContextValue {
  market: MarketCode;
  country: CountryCode;
  region: ExperienceRegion;
  currency: CurrencyCode;
  source: MarketSource;
  ready: boolean;
  setMarket: (market: MarketCode) => void;
  setCountry: (country: CountryCode) => void;
}

export function MarketProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [bootstrap, setBootstrap] = useState<Awaited<ReturnType<typeof loadMarketBootstrap>> | null>(null);
  const [ready, setReady] = useState(false);
  const [marketState, setMarketState] = useState<ReturnType<typeof resolveMarket>>(() =>
    resolveMarket({
      pathname: location.pathname,
      savedMarket: typeof window === "undefined" ? null : window.localStorage.getItem(MARKET_STORAGE_KEY),
      browserLanguages: typeof navigator === "undefined" ? [] : navigator.languages,
    }),
  );

  useEffect(() => {
    let active = true;
    void loadMarketBootstrap().then((nextBootstrap) => {
      if (!active) return;
      setBootstrap(nextBootstrap);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const supportedMarket = getMarketFromPathname(location.pathname);
    const savedMarket = window.localStorage.getItem(MARKET_STORAGE_KEY);

    if (!supportedMarket) {
      /*
       * "/" used to hardcode DEFAULT_MARKET here while every other market-less path
       * honoured the saved override. Because the redirect target then resolved with
       * source "path", the branch below wrote that market straight back to storage —
       * so one visit to the bare domain silently converted a US visitor into a UK one
       * and kept them there. Any bookmark, ad click or typed-in domain did it.
       * Root now resolves exactly like every other market-less path.
       */
      const nextMarket = (savedMarket && resolveMarket({ savedMarket }).market) || DEFAULT_MARKET;
      const nextPath = buildMarketHref(nextMarket, `${stripMarketPrefix(location.pathname)}${location.search}`);
      if (`${location.pathname}${location.search}` !== nextPath) {
        navigate(nextPath, { replace: true });
      }
      return;
    }

    const resolved = resolveMarket({
      pathname: location.pathname,
      savedMarket,
      bootstrap: bootstrap ?? undefined,
      browserLanguages: typeof navigator === "undefined" ? [] : navigator.languages,
    });

    if (window.localStorage.getItem(MARKET_STORAGE_KEY) !== resolved.market) {
      window.localStorage.setItem(MARKET_STORAGE_KEY, resolved.market);
    }

    setMarketState(resolved);
    setReady(true);
  }, [bootstrap, location.pathname, location.search, navigate]);

  const setMarket = (nextMarket: MarketCode) => {
    window.localStorage.setItem(MARKET_STORAGE_KEY, nextMarket);
    const nextPath = buildMarketPath(nextMarket, stripMarketPrefix(location.pathname));
    navigate(`${nextPath}${location.search}`);
  };

  const setCountry = (nextCountry: CountryCode) => {
    setMarket(marketFromCountryCode(nextCountry));
  };

  const value = useMemo(() => {
    const config = getMarketConfigByMarket(marketState.market);
    return {
      market: marketState.market,
      country: countryFromMarketCode(marketState.market),
      region: config.experienceRegion,
      currency: config.currency,
      source: marketState.source,
      ready,
      setMarket,
      setCountry,
    } satisfies MarketContextValue;
  }, [marketState.market, marketState.source, ready]);

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}
