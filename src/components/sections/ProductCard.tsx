import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CatalogProduct } from "../../lib/shopify/types";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { formatMoney } from "../../lib/market/config";
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
      <div className="flex h-full min-h-[548px] flex-col overflow-hidden rounded-[18px] border border-[#e2ded2] bg-[#f8f6f1] shadow-[0_24px_50px_-40px_rgba(27,26,23,0.35)]">
        <Link to={productHref} className="relative block overflow-hidden rounded-t-[18px] bg-[#ddd8ca]">
          <span className="absolute left-4 top-4 z-10 rounded-md bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-ink">
            {product.badge ?? "Bestseller"}
          </span>
          <ProductImageStage src={cardImage?.src} alt={cardImage?.alt} initials={initials} />
        </Link>

        <div className="flex flex-1 flex-col px-5 pb-4 pt-3">
          <div className="flex min-h-[40px] items-start justify-between gap-3">
            <Link to={productHref} className="min-w-0 flex-1">
              <h3 className="max-w-[220px] text-[21px] leading-[1.08] text-ink">{product.title}</h3>
            </Link>
            <span className="pt-1 text-[16px] font-semibold text-ink">
              {formatMoney(product.price.amount, country)}
            </span>
          </div>

          <div className="mt-2.5 flex min-h-[56px] items-start justify-between gap-4 text-[13px] leading-5">
            <p className="max-w-[180px] text-[12.5px] leading-5 text-[#6b5e58]">{product.tagline}</p>
            <span className="whitespace-nowrap text-[11px] text-forest-400">{product.supplyLabel}</span>
          </div>

          <p className="mt-4 min-h-[19px] text-[12.5px] text-[#8a8678]">
            {product.category} · {product.servings}
          </p>

          <div className="mt-auto pt-6">
            <Link
              to={productHref}
              className="flex h-[43px] w-full items-center justify-center gap-2 rounded-full border border-[#ddd8c9] bg-transparent text-[14px] font-medium text-ink transition-colors hover:bg-white"
            >
              View product
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
