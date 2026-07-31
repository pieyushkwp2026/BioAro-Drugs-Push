import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMarketConfigByMarket } from "../../config/markets";
import { useMarket } from "../../hooks/useMarket";
import { canonicalForMarket, defaultMarketUrl, regionalAlternates } from "../../lib/seo";

const DEFAULT_TITLE = "BioAro Drugs | Premium Bioactive Formulas";
const DEFAULT_DESCRIPTION =
  "Explore clear, science-informed formulas for energy, focus, recovery, sleep, and long-term wellness.";

const PRODUCT_NAMES: Record<string, string> = {
  "longevity-plus": "Longevity+",
  "cellomega-plus": "CellOmega+",
  "creagen-brain-boost": "Creagen Brain Boost",
  "creagen-femme-energy": "Creagen Femme Energy",
  "creagen-raw-power": "Creagen Raw Power",
  "creagen-pro-power": "Creagen Pro Power",
  glutara: "Glutara",
};

function getSeoContent(pathname: string, marketName: string) {
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1];
  const handle = section === "products" ? segments[2] : undefined;

  if (handle && PRODUCT_NAMES[handle]) {
    const name = PRODUCT_NAMES[handle];
    return {
      title: `${name} | BioAro Drugs | ${marketName}`,
      description: `Explore ${name}, with clear ingredient, routine, and product guidance from BioAro Drugs.`,
    };
  }

  const pages: Record<string, { title: string; description: string }> = {
    shop: {
      title: `Shop BioAro Drugs | ${marketName}`,
      description: "Browse BioAro formulas for longevity, focus, recovery, sleep, and everyday wellness.",
    },
    science: {
      title: `Science & Quality | BioAro Drugs | ${marketName}`,
      description: "Learn how BioAro approaches ingredients, formulation, dosage, quality, and product guidance.",
    },
    journal: {
      title: `BioAro Journal | ${marketName}`,
      description: "Read practical guides on bioactives, routines, recovery, focus, sleep, and supplement quality.",
    },
    quiz: {
      title: `Wellness Quiz | BioAro Drugs | ${marketName}`,
      description: "Answer a few questions to find a BioAro starting point for your daily wellness goals.",
    },
    about: {
      title: `About BioAro Drugs | ${marketName}`,
      description: "Learn about BioAro Drugs and our approach to clear, practical wellness routines.",
    },
    "living-2-0": {
      title: `Living 2.0 | BioAro Drugs | ${marketName}`,
      description: "Explore a clearer approach to understanding, building, and improving everyday health routines.",
    },
    "quality-testing": {
      title: `Quality & Testing | BioAro Drugs | ${marketName}`,
      description: "Learn about BioAro ingredient selection, manufacturing controls, testing, and product guidance.",
    },
  };

  return pages[section ?? ""] ?? { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
}

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
    const seo = getSeoContent(location.pathname, config.name);

    document.title = seo.title;

    upsertMeta('meta[name="description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      return tag;
    }, seo.description);

    upsertMeta('meta[property="og:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:title");
      return tag;
    }, seo.title);

    upsertMeta('meta[property="og:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("property", "og:description");
      return tag;
    }, seo.description);

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

    upsertMeta('meta[name="twitter:card"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:card");
      return tag;
    }, "summary_large_image");

    upsertMeta('meta[name="twitter:title"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:title");
      return tag;
    }, seo.title);

    upsertMeta('meta[name="twitter:description"]', () => {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "twitter:description");
      return tag;
    }, seo.description);

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
