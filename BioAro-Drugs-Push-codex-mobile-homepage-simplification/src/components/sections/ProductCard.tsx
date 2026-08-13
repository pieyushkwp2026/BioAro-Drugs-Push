import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CatalogProduct } from "../../lib/shopify/types";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { formatMoneyOrPending } from "../../lib/market/config";
import { PRODUCT_CARD_IMAGES } from "../../data/productCardImages";
import ProductImageStage from "./ProductImageStage";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const productHref = marketHref(`/products/${product.handle}`);
  const words = product.title.split(" ").filter(Boolean);
  const initials = (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
  const cardImage = PRODUCT_CARD_IMAGES[product.handle] ?? product.image;

  return (
    <article className="group flex h-full flex-col">
      <div className="flex h-full min-h-[452px] flex-col overflow-hidden rounded-[18px] border border-[#E1DED8] bg-[#FBF9F6] shadow-[0_18px_38px_-32px_rgba(28,25,23,0.32)]">
        <Link to={productHref} className="relative block overflow-hidden rounded-t-[18px] bg-[#E1DED8]">
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
              {formatMoneyOrPending(product.price.amount, country)}
            </span>
          </div>

          <div className="mt-2 flex min-h-[44px] items-start justify-between gap-3 text-[13px] leading-5">
            <p className="max-w-[170px] text-[12px] leading-[1.45] text-[#545961]">{product.tagline}</p>
            <span className="whitespace-nowrap text-[10.5px] font-medium text-ember">{product.supplyLabel}</span>
          </div>

          <p className="mt-3 min-h-[17px] text-[11.5px] text-[#6B7078]">
            {product.category} · {product.servings}
          </p>

          <div className="mt-auto pt-4">
            <Link
              to={productHref}
              className="flex h-[40px] w-full items-center justify-center gap-2 rounded-full border border-[#E1DED8] bg-transparent text-[13.5px] font-bold text-ink transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember motion-reduce:active:scale-100"
            >
              View product
              <ArrowRight size={14} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
