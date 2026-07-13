import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMarketConfigByMarket } from "../../config/markets";
import { useMarket } from "../../hooks/useMarket";
import { canonicalForMarket, defaultMarketUrl, regionalAlternates } from "../../lib/seo";

const DEFAULT_TITLE = "BioAro Drugs | Premium Bioactive Formulas";
const DEFAULT_DESCRIPTION =
  "Premium bioactive formulas designed for energy, focus, recovery, sleep, and long-term wellness.";

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLink(selector: string, create: () => HTMLLinkElement, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export default function RegionalSeo() {
  const location = useLocation();
  const { market } = useMarket();

  useEffect(() => {
    const config = getMarketConfigByMarket(market);
    const canonical = canonicalForMarket(market, location.pathname);

    document.title = DEFAULT_TITLE;

    upsertMeta('meta[name="description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      return tag;
    }, DEFAULT_DESCRIPTION);

    upsertMeta('meta[property="og:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:title");
      return tag;
    }, DEFAULT_TITLE);

    upsertMeta('meta[property="og:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:description");
      return tag;
    }, DEFAULT_DESCRIPTION);

    upsertMeta('meta[property="og:locale"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:locale");
      return tag;
    }, config.locale.replace("-", "_"));

    upsertMeta('meta[property="og:url"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:url");
      return tag;
    }, canonical);

    upsertLink('link[rel="canonical"]', () => {
      const tag = document.createElement("link");
      tag.setAttribute("rel", "canonical");
      return tag;
    }, canonical);

    document.head.querySelectorAll('link[data-bioaro-hreflang="true"]').forEach((tag) => tag.remove());
    for (const alternate of regionalAlternates(location.pathname)) {
      const tag = document.createElement("link");
      tag.setAttribute("rel", "alternate");
      tag.setAttribute("hreflang", alternate.hrefLang);
      tag.setAttribute("href", alternate.href);
      tag.setAttribute("data-bioaro-hreflang", "true");
      document.head.appendChild(tag);
    }

    const defaultTag = document.createElement("link");
    defaultTag.setAttribute("rel", "alternate");
    defaultTag.setAttribute("hreflang", "x-default");
    defaultTag.setAttribute("href", defaultMarketUrl(location.pathname));
    defaultTag.setAttribute("data-bioaro-hreflang", "true");
    document.head.appendChild(defaultTag);
  }, [location.pathname, market]);

  return null;
}
