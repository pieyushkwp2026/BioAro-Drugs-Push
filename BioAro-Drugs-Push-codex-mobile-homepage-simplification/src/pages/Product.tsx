import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { fetchAllProducts, fetchProductByHandle } from "../lib/shopify/productService";
import { getMarketConfigByMarket } from "../config/markets";
import { absoluteUrl, canonicalForMarket } from "../lib/seo";
import { useMarket } from "../hooks/useMarket";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";
import { PDP } from "../data/productPage";
import { PRODUCT_GALLERIES } from "../data/productGalleries";
import { JOURNAL_ARTICLES } from "../data/journal";
import type { CatalogProduct } from "../lib/shopify/types";
import AccordionGroup from "../components/page/AccordionGroup";
import ProductCard from "../components/sections/ProductCard";
import ProductGallery from "../components/product/ProductGallery";
import BuyRail from "../components/product/BuyRail";
import FormulationTable from "../components/product/FormulationTable";
import Disclosure from "../components/product/Disclosure";
import SectionNav, { type NavSection } from "../components/product/SectionNav";

/*
 * THESIS: this page exists to answer "what is actually in it, and how much" before it
 * asks for the sale. It refuses the arrangement it replaced — twenty-three blocks in
 * a flat list, twelve of them restating each other.
 *
 * STRUCTURE: photography and the buy rail share the first viewport; the rail stays
 * with the reader. Below it, one long column: the full formulation, then warnings,
 * then questions. A sticky nav tracks whichever of those actually rendered.
 *
 * ONE HOME PER FACT. Dosage lives in How to use. Servings live in the table headers.
 * Ingredients live in the table, complete — the old page passed them through
 * `.slice(0, 5)` and dropped Vitamin D3 from LONgevity+ while the homepage printed
 * all six. Quality attributes live in the rail. Warnings live once, with the regional
 * disclaimer de-duplicated against them.
 *
 * WHAT IS GONE, and why: the comparison table (duplicated /science, and its data has
 * `label === bioaro` so it printed the same words in two columns), the placebo bar
 * chart, the evidence card, the "Why {title}?" cards and the science visual (all
 * restatements of `benefits`), the testimonials block (no product has ever supplied
 * one), the bundle section, and two hardcoded bottom CTAs that no product populated.
 * Seven `fallback*` generators went with them: a metafield-authoritative page shows
 * what exists rather than inventing filler.
 *
 * NOT BUILT, deliberately: reviews (no review system — `rating` is a static literal
 * with nothing behind it), variant options (single-variant products), and Subscribe &
 * Save (no selling plans in Shopify). Each would be a promise the store cannot keep.
 */

/* Regional legal line. Rendered once, and de-duplicated against `warnings` below —
   on a UK PDP the identical sentence used to print twice, ~30px apart. */
const REGION_DISCLAIMERS: Record<string, string> = {
  NA: "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.",
  UK: "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
  AE: "Consult a qualified healthcare professional before use if you are pregnant, breastfeeding, or taking medication.",
};

const normalise = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

export default function Product() {
  const { handle } = useParams();
  const location = useLocation();
  const { country, market, region } = useMarket();
  const marketHref = useMarketHref();

  const [product, setProduct] = useState<CatalogProduct | null | undefined>(undefined);
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    if (!handle) return;
    setProduct(undefined);
    void fetchProductByHandle(handle, country)
      .then((next) => setProduct(next ?? null))
      .catch(() => setProduct(null));
  }, [country, handle]);

  useEffect(() => {
    void fetchAllProducts(country).then(setCatalog).catch(() => setCatalog([]));
  }, [country]);

  useEffect(() => {
    document.head.querySelector('script[data-bioaro-product-schema="true"]')?.remove();
    if (!product || !handle) return;

    const marketConfig = getMarketConfigByMarket(market);
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      brand: { "@type": "Brand", name: "BioAro Drugs" },
      sku: product.handle,
      url: canonicalForMarket(market, location.pathname),
    };
    if (product.image?.src) schema.image = [absoluteUrl(product.image.src)];
    if (product.availableForSale) {
      schema.offers = {
        "@type": "Offer",
        price: product.price.amount,
        priceCurrency: marketConfig.currency,
        availability: "https://schema.org/InStock",
        url: canonicalForMarket(market, location.pathname),
      };
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.bioaroProductSchema = "true";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => script.remove();
  }, [handle, location.pathname, market, product]);

  const related = useMemo(() => {
    if (!product) return [];
    const others = catalog.filter((item) => item.handle !== product.handle);
    const sameCategory = others.filter((item) => item.category === product.category);
    return [...sameCategory, ...others.filter((item) => item.category !== product.category)].slice(0, 3);
  }, [catalog, product]);

  // Journal pieces whose category brushes the product's own. No product↔article
  // relation exists in the CMS, so this is derived rather than authored.
  const reading = useMemo(() => {
    if (!product) return [];
    const needle = normalise(product.category);
    return JOURNAL_ARTICLES.filter((article) => {
      const cat = normalise(article.cat);
      return cat.includes(needle) || needle.includes(cat);
    })
      .slice(0, 3)
      .map((article) => ({ title: article.title, href: marketHref(`${ROUTES.journal}/${article.slug}`) }));
  }, [product, marketHref]);

  if (product === undefined) {
    return (
      <div className="container-bio pb-24 pt-32 md:pt-40" aria-busy="true" aria-label="Loading product">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="aspect-square animate-pulse rounded-[24px] bg-cream-200" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-cream-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-cream-200" />
            <div className="h-4 w-full animate-pulse rounded bg-cream-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-cream-200" />
            <div className="h-12 w-40 animate-pulse rounded-full bg-cream-200" />
          </div>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="container-bio pb-24 pt-32 text-center md:pt-40">
        <h1 className="text-[28px] font-black tracking-[-0.03em] text-ink">We could not find that formula.</h1>
        <p className="mt-3 text-[15.5px] text-ink-600">It may have moved, or the link may be out of date.</p>
        <Link to={marketHref(ROUTES.shop)} className="btn-primary mt-7">
          Browse all formulas
          <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  const gallery = product.galleryImages?.length
    ? product.galleryImages
    : PRODUCT_GALLERIES[product.handle] ?? (product.image ? [{ ...product.image, fit: "contain" as const }] : []);

  const disclaimer = REGION_DISCLAIMERS[region];
  // The regional line and the product's own warnings overlap word for word on UK
  // products, so the duplicate is removed from the list rather than printed twice.
  const warnings = product.warnings.filter((warning) => !disclaimer || normalise(warning) !== normalise(disclaimer));

  const attributes = product.featureBadges.map((badge) => badge.label);

  /*
   * Dosage has one home: the rail's "How to use" panel. Every product's FAQ also
   * carries a "How should I take X?" entry whose answer is the same sentence, so it
   * printed twice on one page. The FAQ copy is dropped rather than the panel — the
   * rail is where someone deciding whether to buy actually looks.
   */
  const dosage = normalise(product.dosage ?? "");
  const faq = (product.faq ?? []).filter((item) => {
    if (!dosage) return true;
    const answer = normalise(item.answer);
    return !(answer === dosage || answer.includes(dosage) || dosage.includes(answer));
  });

  // Only the sections that actually rendered reach the nav — a tab that scrolls to
  // nothing is worse than no tab.
  /* `whyIncluded` has been on every ingredient all along — in the Shopify metaobject
     and in the local fallback — and was never rendered. The formulation table shows
     `purpose`; this shows the rationale that was being dropped. */
  const rationale = (product.ingredients ?? []).filter((ingredient) => ingredient.whyIncluded);

  const audience = (product.whyItems ?? []).map((item) => item.title);
  /* Quality means testing and composition, not convenience. `attributes` mixes the
     two — "Tested for Quality" sits beside "Compact for Travel" and "No Mixing
     Required" — and listing a travel format under a Quality heading dresses a
     convenience feature up as a credential. Allow-listed rather than filtered by
     exclusion, so a new format badge cannot leak in by default. */
  const QUALITY_TERMS = /tested|third-party|third party|non-gmo|gluten|purity|potency|quality|allergen|vegan/i;
  const qualityBadges = (product.qualityBadges ?? []).filter((badge) => badge.enabled);
  const qualityClaims =
    qualityBadges.length > 0
      ? qualityBadges.map((badge) => badge.title)
      : attributes.filter((attribute) => QUALITY_TERMS.test(attribute));

  const candidates: (NavSection | null)[] = [
    product.ingredients?.length ? { id: "formulation", label: PDP.nav.formulation } : null,
    rationale.length ? { id: "why", label: PDP.why.heading } : null,
    audience.length ? { id: "audience", label: PDP.audience.heading } : null,
    warnings.length ? { id: "warnings", label: PDP.notFor.heading } : null,
    { id: "quality", label: PDP.quality.heading },
    faq.length ? { id: "questions", label: PDP.nav.faq } : null,
  ];
  const sections = candidates.filter((section): section is NavSection => section !== null);

  return (
    <div className="pb-24 pt-28 md:pt-32">
      <div className="container-bio">
        {/* ------------------------------------------------------- breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-ink-400">
          <Link to={marketHref(ROUTES.shop)} className="rounded hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">
            Shop
          </Link>
          <ChevronRight size={13} strokeWidth={2.2} aria-hidden="true" />
          <span className="truncate text-ink-600">{product.title}</span>
        </nav>

        {/* ---------------------------------------------- gallery + buy rail */}
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <ProductGallery images={gallery} title={product.title} />
          <BuyRail product={product} attributes={attributes} reading={reading} />
        </div>
      </div>

      {sections.length > 1 && (
        <div className="mt-16 md:mt-20">
          <div className="container-bio">
            <SectionNav sections={sections} />
          </div>
        </div>
      )}

      <div className="container-bio">
        <div className="mt-12 max-w-[820px] space-y-14">
          {product.ingredients?.length ? <FormulationTable product={product} /> : null}

          {/* ------------------------------------------- why these ingredients */}
          {rationale.length > 0 && (
            <section id="why" className="scroll-mt-[132px] border-t border-line-strong pt-12">
              <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">{PDP.why.heading}</h2>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.6] text-ink-600">{PDP.why.body}</p>

              <ul className="mt-8 space-y-6">
                {rationale.map((ingredient) => (
                  <li key={ingredient.name} className="border-l-2 border-ember/30 pl-5">
                    <p className="flex flex-wrap items-baseline gap-x-3 text-[16px] font-bold tracking-[-0.02em] text-ink">
                      {ingredient.name}
                      <span className="text-[13.5px] font-medium tabular-nums text-ink-400">{ingredient.amount}</span>
                    </p>
                    <p className="mt-1.5 max-w-[68ch] text-[15px] leading-[1.6] text-ink-600">{ingredient.whyIncluded}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* -------------------------------------------------------- audience */}
          {audience.length > 0 && (
            <section id="audience" className="scroll-mt-[132px] border-t border-line-strong pt-12">
              <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">
                {PDP.audience.heading}
              </h2>
              <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.55] text-ink-600">
                {PDP.audience.lead}{" "}
                <span className="font-bold text-ink">{audience.join(", ").toLowerCase()}</span>.
                {product.servings ? ` ${PDP.audience.format(product.servings)}` : ""}
              </p>
            </section>
          )}

          {/* --------------------------------------------------------- warnings */}
          {warnings.length > 0 && (
            <section id="warnings" className="scroll-mt-[132px] border-t border-line-strong pt-12">
              <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">
                {product.metafields?.warningsHeadline ?? PDP.notFor.heading}
              </h2>

              <Disclosure
                collapsedHeight={warnings.length > 4 ? 220 : 4000}
                showLabel={PDP.warnings.showAll}
                hideLabel={PDP.warnings.showLess}
              >
                <ul className="mt-6 space-y-3">
                  {warnings.map((warning) => (
                    <li key={warning} className="flex gap-3 text-[15px] leading-[1.6] text-ink-600">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </Disclosure>

              {disclaimer && (
                <p className="mt-8 max-w-[70ch] border-t border-line pt-5 text-[13px] leading-[1.6] text-ink-400">
                  {disclaimer}{" "}
                  <Link to={marketHref(ROUTES.disclaimer)} className="font-bold text-ink-600 underline-offset-4 hover:text-ember hover:underline">
                    Full disclaimer
                  </Link>
                </p>
              )}
            </section>
          )}

          {/* -------------------------------------------------------- questions */}
          {/* ---------------------------------------------------------- quality */}
          <section id="quality" className="scroll-mt-[132px] border-t border-line-strong pt-12">
            <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">{PDP.quality.heading}</h2>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.6] text-ink-600">{PDP.quality.body}</p>

            {/* Only what the product itself carries. */}
            {qualityClaims.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {qualityClaims.map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-line bg-white px-4 py-2 text-[13.5px] font-bold text-ink"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            )}

            {/* Records, not copy. Absent until real documents exist. */}
            <p className="mt-6 max-w-[70ch] border-t border-line pt-5 text-[13px] leading-[1.6] text-ink-400">
              {PDP.quality.pending}
            </p>
          </section>

          {faq.length > 0 && (
            <section id="questions" className="scroll-mt-[132px] border-t border-line-strong pt-12">
              <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">
                {product.metafields?.faqHeadline ?? PDP.faq.heading}
              </h2>
              <div className="mt-6">
                <AccordionGroup items={faq.map((item) => ({ title: item.question, body: item.answer }))} />
              </div>
            </section>
          )}
        </div>

        {/* ---------------------------------------------------------- related */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-line-strong pt-12">
            <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">
              {PDP.related.heading}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.handle} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
