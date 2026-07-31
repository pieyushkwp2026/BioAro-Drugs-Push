import { ROUTES } from "./routes";
import { DEFAULT_MARKET, isCountryCode, isMarketCode, marketFromCountryCode, type MarketCode, type MarketIdentifier } from "../config/markets";

const MARKET_SEGMENTS = new Set<MarketCode>(["uk", "us", "ca", "ae"]);

export function isSupportedMarketCode(value: string): value is MarketCode {
  return MARKET_SEGMENTS.has(value as MarketCode);
}

export function normalizeMarketCode(value: MarketIdentifier | string | null | undefined): MarketCode | null {
  if (!value) return null;
  if (isSupportedMarketCode(value.toLowerCase())) return value.toLowerCase() as MarketCode;
  if (isMarketCode(value)) return value;
  const upper = value.toUpperCase();
  if (isCountryCode(upper)) return marketFromCountryCode(upper);
  return null;
}

export function getMarketFromPathname(pathname: string): MarketCode | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return firstSegment && isSupportedMarketCode(firstSegment) ? firstSegment : null;
}

export function stripMarketPrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return "/";

  if (isSupportedMarketCode(segments[0])) {
    const stripped = `/${segments.slice(1).join("/")}`;
    return stripped === "/" ? "/" : stripped;
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function ensureLeadingSlash(path: string): string {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildMarketPath(market: MarketCode, path: string = "/"): string {
  const normalized = ensureLeadingSlash(path);
  if (normalized === "/") return `/${market}`;
  return `/${market}${normalized}`;
}

export function buildMarketHref(market: MarketCode, href: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  const [pathname, search = ""] = href.split("?");
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const marketPath = buildMarketPath(market, normalizedPath);
  return search ? `${marketPath}?${search}` : marketPath;
}

export function resolveEquivalentMarketPath(
  _currentMarket: MarketCode,
  nextMarket: MarketCode,
  pathname: string,
  search: string = "",
): string {
  const stripped = stripMarketPrefix(pathname);
  const nextPath = buildMarketPath(nextMarket, stripped);
  return search ? `${nextPath}${search}` : nextPath;
}

export function redirectToDefaultMarket(pathname: string, search: string = ""): string {
  const stripped = stripMarketPrefix(pathname);
  const target = buildMarketPath(DEFAULT_MARKET, stripped);
  return search ? `${target}${search}` : target;
}

export function isLegacyMarketlessPath(pathname: string): boolean {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return Boolean(firstSegment && !isSupportedMarketCode(firstSegment));
}

export const LEGACY_BASE_ROUTES = new Set([
  ROUTES.home,
  ROUTES.shop,
  ROUTES.quiz,
  ROUTES.science,
  ROUTES.journal,
  ROUTES.about,
  ROUTES.account,
  ROUTES.support,
  ROUTES.disclaimer,
  ROUTES.shipping,
  ROUTES.returns,
  ROUTES.living,
  ROUTES.quality,
  ROUTES.faq,
  ROUTES.protocols,
  ROUTES.partners,
]);
