import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { PRODUCTS_SECTION } from "../../data/homepage";
import type { CatalogProduct } from "../../lib/shopify/types";
import { LEGACY_PRODUCT_ORDER } from "../../lib/shopify/productService";
import type { CatalogState } from "../../hooks/useCatalog";
import ProductCard from "../sections/ProductCard";
import {
  PrimaryCta,
  SecondaryCta,
  Section,
  SectionHeading,
} from "./primitives";

/*
 * Products at position three instead of six.
 *
 * A rail rather than a grid at every size: seven products in a 4-up grid leaves a
 * ragged second row, and horizontal scrolling is the better mobile behaviour anyway.
 * The legacy range is deliberate: it is the clearest first shelf for returning
 * customers. Products without bespoke local card art use their Shopify image instead.
 */
export default function ProductShowcase({
  products,
  state,
}: {
  products: CatalogProduct[];
  state: CatalogState;
}) {
  const marketHref = useMarketHref();
  const railRef = useRef<HTMLDivElement | null>(null);

  const scroll = useCallback((direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: rail.clientWidth * 0.6 * direction,
      behavior: "smooth",
    });
  }, []);

  // Fail quiet rather than render an empty shelf under a confident heading.
  if (state === "failed") return null;

  const legacyIndex = new Map<string, number>(LEGACY_PRODUCT_ORDER.map((handle, index) => [handle, index]));
  const shown = products
    .filter((product) => legacyIndex.has(product.handle))
    .sort((a, b) => (legacyIndex.get(a.handle) ?? 999) - (legacyIndex.get(b.handle) ?? 999));

  return (
    /* py, not pb: this section follows the hero's full-bleed image, and every other
       section on the page carries bottom padding only and inherits its top gap from
       the section above. Nothing sits above this one to provide that, so it needs
       its own — the heading was butting straight up against the photograph. */
    <Section className="pt-8 pb-20 sm:pt-10 sm:pb-24 lg:pt-12 lg:pb-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading className="max-w-[15ch]">
          {PRODUCTS_SECTION.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </SectionHeading>

        <div className="flex shrink-0 items-end gap-2.5">
          <p className="mr-2 hidden max-w-[34ch] text-[15px] leading-[1.55] text-ink-600 lg:block">
            {PRODUCTS_SECTION.body}
          </p>
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scroll(direction)}
              aria-label={
                direction === -1
                  ? "Show previous products"
                  : "Show more products"
              }
              aria-controls="product-rail"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-[border-color,transform] duration-200 hover:border-ink active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:active:scale-100"
            >
              {direction === -1 ? (
                <ChevronLeft size={19} strokeWidth={2.2} />
              ) : (
                <ChevronRight size={19} strokeWidth={2.2} />
              )}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-5 max-w-[52ch] text-[15.5px] leading-[1.55] text-ink-600 lg:hidden">
        {PRODUCTS_SECTION.body}
      </p>
      {/* min-h holds the row height across the loading swap so the page below does
          not jump when the catalogue lands. */}
      <div className="min-h-[468px]">
        {state === "loading" ? (
          <div
            className="mt-10 flex gap-4 overflow-hidden"
            aria-busy="true"
            aria-label="Loading products"
          >
            {[0, 1, 2, 3].map((key) => (
              <div
                key={key}
                className="h-[452px] w-[74vw] shrink-0 animate-pulse rounded-[18px] bg-cream-200 sm:w-[42vw] lg:w-[23.5%]"
              />
            ))}
          </div>
        ) : (
          <div
            ref={railRef}
            id="product-rail"
            role="group"
            aria-label="BioAro Drugs formulas"
            tabIndex={0}
            className="bio-rail -mx-5 mt-10 flex gap-4 overflow-x-auto px-5 pb-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
          >
            {shown.map((product) => (
              <div
                key={product.handle}
                className="w-[74vw] shrink-0 sm:w-[42vw] lg:w-[23.5%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <PrimaryCta
          to={marketHref(ROUTES.shop)}
          className="w-full justify-center sm:w-auto"
        >
          {PRODUCTS_SECTION.primaryCta}
        </PrimaryCta>
        <SecondaryCta
          to={marketHref(ROUTES.quiz)}
          className="w-full justify-center sm:w-auto"
        >
          {PRODUCTS_SECTION.secondaryCta}
        </SecondaryCta>
      </div>
    </Section>
  );
}
