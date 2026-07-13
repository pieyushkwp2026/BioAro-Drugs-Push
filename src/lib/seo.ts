import { DEFAULT_MARKET, MARKET_ORDER, getMarketConfigByMarket, type MarketCode } from "../config/markets";
import { buildMarketPath, stripMarketPrefix } from "./marketRouting";

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://bioarodrugs.com";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function regionalAlternates(pathname: string) {
  const strippedPath = stripMarketPrefix(pathname);

  return MARKET_ORDER.map((market) => {
    const config = getMarketConfigByMarket(market);
    return {
      market,
      hrefLang: config.locale,
      href: absoluteUrl(buildMarketPath(market, strippedPath)),
    };
  });
}

export function canonicalForMarket(market: MarketCode, pathname: string): string {
  return absoluteUrl(buildMarketPath(market, stripMarketPrefix(pathname)));
}

export function defaultMarketUrl(pathname: string): string {
  return absoluteUrl(buildMarketPath(DEFAULT_MARKET, stripMarketPrefix(pathname)));
}
