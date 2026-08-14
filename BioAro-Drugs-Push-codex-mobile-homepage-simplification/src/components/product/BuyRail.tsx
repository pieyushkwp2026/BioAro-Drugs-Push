import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { formatCatalogMoney, isCurrencyAlignedWithMarket } from "../../lib/market/config";
import { ROUTES } from "../../lib/routes";
import { PDP } from "../../data/productPage";
import type { CatalogProduct } from "../../lib/shopify/types";

/*
 * The buy rail.
 *
 * NO variant selector and NO subscription toggle, deliberately: the Storefront query
 * asks for `variants(first: 1)` and the mapper collapses to a single variantId, and
 * there are no selling plans anywhere in the Shopify configuration. Rendering either
 * control would be a promise the store cannot keep. The markup is structured so both
 * slot in above the quantity row when they become real.
 *
 * A quantity stepper is new and is real — `addProduct(product, qty)` has always
 * accepted a count; the old page hardcoded 1.
 */

function RailPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-5">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function BuyRail({
  product,
  attributes,
  reading,
}: {
  product: CatalogProduct;
  attributes: string[];
  reading: { title: string; href: string }[];
}) {
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const { addProduct, error: cartError } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

  const currencyAligned = isCurrencyAlignedWithMarket(product.price.currencyCode, country);
  const liveVariant =
    Boolean(product.variantId) &&
    !product.variantId.startsWith("preview-variant-") &&
    !product.variantId.startsWith("missing-variant-");
  const canBuy = product.availableForSale && liveVariant && product.price.amount > 0 && currencyAligned;

  const onAdd = async () => {
    if (!canBuy || busy) return;
    setBusy(true);
    try {
      await addProduct(product, quantity);
      setAdded(true);
      window.setTimeout(() => setAdded(false), 2200);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="lg:sticky lg:top-[104px]">
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">
        {product.metafields?.heroEyebrow ?? product.category}
      </p>
      <h1 className="mt-3 text-balance text-[30px] font-black leading-[1.08] tracking-[-0.03em] text-ink sm:text-[36px]">
        {product.title}
      </h1>
      {product.tagline && (
        <p className="mt-3 text-pretty text-[16.5px] leading-[1.5] text-ink-700">{product.tagline}</p>
      )}
      {product.description && (
        <p className="mt-4 text-pretty text-[15px] leading-[1.6] text-ink-600">{product.description}</p>
      )}

      {/* ------------------------------------------------------------- price */}
      <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[30px] font-black tabular-nums tracking-[-0.03em] text-ink">
          {formatCatalogMoney(product.price, country)}
        </span>
        {product.compareAtPrice && product.compareAtPrice.amount > product.price.amount && (
          <span className="text-[16px] font-medium tabular-nums text-ink-400 line-through">
            {formatCatalogMoney(product.compareAtPrice, country)}
          </span>
        )}
        <span className="text-[14px] text-ink-400">{product.packName ?? product.supplyLabel}</span>
      </div>

      {canBuy ? (
        <>
          <div className="mt-6 flex items-stretch gap-3">
            <div className="flex items-center gap-1 rounded-full border border-line bg-white px-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label={PDP.rail.decrease}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-50 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <Minus size={15} strokeWidth={2.6} />
              </button>
              <span aria-live="polite" className="w-8 text-center text-[15px] font-bold tabular-nums text-ink">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(12, q + 1))}
                disabled={quantity >= 12}
                aria-label={PDP.rail.increase}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-50 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <Plus size={15} strokeWidth={2.6} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => void onAdd()}
              disabled={busy}
              className="btn-primary flex-1 justify-center disabled:opacity-70"
            >
              {added ? (
                <>
                  {PDP.rail.added}
                  <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                </>
              ) : (
                <>{busy ? PDP.rail.adding : PDP.rail.addToCart}</>
              )}
            </button>
          </div>

          {cartError && (
            <p role="alert" className="mt-3 text-[13px] leading-[1.5] text-ember-700">
              {cartError}
            </p>
          )}
        </>
      ) : (
        /* One honest state, replacing copy that used to name Shopify variants and
           the visitor's selected market. */
        <div className="mt-6 rounded-[18px] border border-line bg-cream-50 p-5">
          <p className="text-[15px] font-bold tracking-[-0.02em] text-ink">{PDP.rail.unavailable}</p>
          <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-600">
            {product.availabilityNote ?? PDP.rail.unavailableBody}
          </p>
          <Link
            to={marketHref(ROUTES.support)}
            className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-ink underline-offset-4 hover:text-ember hover:underline"
          >
            {PDP.rail.contact}
            <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {attributes.length > 0 && (
          <RailPanel title={PDP.rail.verified}>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {attributes.map((attribute) => (
                <li key={attribute} className="flex items-start gap-2 text-[13.5px] leading-[1.4] text-ink-600">
                  <Check size={14} strokeWidth={2.8} aria-hidden="true" className="mt-0.5 shrink-0 text-ember" />
                  {attribute}
                </li>
              ))}
            </ul>
          </RailPanel>
        )}

        {product.dosage && (
          <RailPanel title={PDP.rail.howToUse}>
            <p className="text-[14px] leading-[1.6] text-ink-600">{product.dosage}</p>
          </RailPanel>
        )}

        {product.tags.length > 0 && (
          <RailPanel title={PDP.rail.related}>
            <ul className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    to={marketHref(ROUTES.shop)}
                    className="inline-block rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-600 transition-colors hover:border-line-strong hover:text-ink"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </RailPanel>
        )}

        {reading.length > 0 && (
          <RailPanel title={PDP.rail.reading}>
            <ul className="space-y-2.5">
              {reading.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="group flex items-start gap-2 text-[13.5px] font-medium leading-[1.45] text-ink-600 transition-colors hover:text-ink"
                  >
                    <ArrowRight
                      size={13}
                      strokeWidth={2.4}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-ink-400 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </RailPanel>
        )}
      </div>
    </div>
  );
}
