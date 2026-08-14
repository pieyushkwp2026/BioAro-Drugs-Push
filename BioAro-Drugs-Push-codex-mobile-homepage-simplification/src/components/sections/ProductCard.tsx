import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Plus } from "lucide-react";
import type { CatalogProduct } from "../../lib/shopify/types";
import { useCart } from "../../hooks/useCart";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { formatCatalogMoney, isCurrencyAlignedWithMarket } from "../../lib/market/config";
import { PRODUCT_CARD_IMAGES } from "../../data/productCardImages";
import ProductImageStage from "./ProductImageStage";

/*
 * Catalogue card, used by the homepage rail and the shop grid.
 *
 * It now buys as well as browses. The card already received a full CatalogProduct
 * and useCart() is provided app-wide, so adding the action needed no plumbing — it
 * was simply missing, and every purchase had to detour through the product page.
 */
export default function ProductCard({ product }: { product: CatalogProduct }) {
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const { addProduct } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const productHref = marketHref(`/products/${product.handle}`);
  const words = product.title.split(" ").filter(Boolean);
  const initials = (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
  const cardImage = PRODUCT_CARD_IMAGES[product.handle] ?? product.image;

  // A product whose price we cannot show honestly is not offered for sale. That
  // covers no price at all (every AE product today) and a price denominated in a
  // currency this market does not use (every CA product, until Shopify has a
  // Canadian market — see formatCatalogMoney).
  const currencyMismatch = !isCurrencyAlignedWithMarket(product.price.currencyCode, country);
  const isPurchasable = product.availableForSale && product.price.amount > 0 && !currencyMismatch;

  const onAdd = async () => {
    await addProduct(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <article className="group flex h-full flex-col">
      <div className="flex h-full min-h-[452px] flex-col overflow-hidden rounded-[18px] border border-line bg-cream-50 shadow-[0_18px_38px_-32px_rgba(28,25,23,0.32)]">
        <Link to={productHref} className="relative block overflow-hidden rounded-t-[18px] bg-line">
          {/* Only render a badge when the product actually has one. This used to fall
              back to the literal string "Bestseller", and createShopifyProduct sets
              badge: undefined, so every live Shopify product wore a claim nothing
              in the app measures. */}
          {product.badge ? (
            <span className="absolute left-3.5 top-3.5 z-10 rounded-md bg-white/95 px-2 py-[3px] text-[9.5px] font-bold uppercase tracking-[0.07em] text-ink">
              {product.badge}
            </span>
          ) : null}
          <ProductImageStage src={cardImage?.src} alt={cardImage?.alt} initials={initials} />
        </Link>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
          <div className="flex min-h-[36px] items-start justify-between gap-3">
            <Link to={productHref} className="min-w-0 flex-1">
              <h3 className="max-w-[200px] text-[18px] font-bold leading-[1.12] tracking-[-0.02em] text-ink">{product.title}</h3>
            </Link>
            <span className="pt-0.5 text-[15px] font-bold tracking-[-0.01em] text-ink">
              {formatCatalogMoney(product.price, country)}
            </span>
          </div>

          <div className="mt-2 flex min-h-[44px] items-start justify-between gap-3 text-[13px] leading-5">
            <p className="max-w-[170px] text-[12px] leading-[1.45] text-ink-600">{product.tagline}</p>
            <span className="whitespace-nowrap text-[10.5px] font-medium text-ember">{product.supplyLabel}</span>
          </div>

          <p className="mt-3 min-h-[17px] text-[11.5px] text-ink-400">
            {product.category} · {product.servings}
          </p>

          <div className="mt-auto flex flex-col gap-2 pt-4">
            {isPurchasable ? (
              <button
                type="button"
                onClick={() => void onAdd()}
                className="flex h-[40px] w-full items-center justify-center gap-2 rounded-full bg-ember text-[13.5px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-ember-600 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember motion-reduce:active:scale-100"
              >
                {justAdded ? (
                  <>
                    Added
                    <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Add to cart
                    <Plus size={14} strokeWidth={2.6} aria-hidden="true" />
                  </>
                )}
              </button>
            ) : (
              /* Two different failures, two different messages. "Coming soon" is
                 true when a product is not yet on sale here; it is a lie when the
                 product exists and only its pricing is unconfigured for this
                 market, so that case says what it actually is. */
              <span className="flex h-[40px] w-full items-center justify-center rounded-full border border-dashed border-line px-3 text-center text-[12.5px] font-bold leading-tight text-ink-400">
                {currencyMismatch ? "Pricing unavailable in your region" : product.availabilityNote ?? "Coming soon"}
              </span>
            )}

            <Link
              to={productHref}
              className="flex h-[40px] w-full items-center justify-center gap-2 rounded-full border border-line bg-transparent text-[13.5px] font-bold text-ink transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember motion-reduce:active:scale-100"
            >
              View science
              <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
