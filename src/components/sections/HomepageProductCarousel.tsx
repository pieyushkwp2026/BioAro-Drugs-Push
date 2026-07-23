import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCT_CARD_IMAGES } from "../../data/productCardImages";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { formatMoney } from "../../lib/market/config";
import type { CatalogProduct } from "../../lib/shopify/types";

type ProductFallback = {
  badge: string;
  description: string;
  supply: string;
};

const PRODUCT_FALLBACKS: Record<string, ProductFallback> = {
  "longevity-plus": {
    badge: "NAD+ support",
    description: "Supports cellular energy and healthy ageing.",
    supply: "30-day supply",
  },
  "cellomega-plus": {
    badge: "Omega & cellular support",
    description: "Daily support for heart, brain and cellular wellbeing.",
    supply: "30-day supply",
  },
  "creagen-brain-boost": {
    badge: "Cognitive performance",
    description: "Nutritional support for focus, training and everyday clarity.",
    supply: "20-day supply",
  },
  "creagen-femme-energy": {
    badge: "Women's performance",
    description: "Daily nutritional support for energy and active routines.",
    supply: "20-day supply",
  },
  "creagen-raw-power": {
    badge: "Strength & recovery",
    description: "Supports strength-focused training and daily recovery.",
    supply: "20-day supply",
  },
  "creagen-pro-power": {
    badge: "Performance support",
    description: "Nutritional support for demanding training and recovery.",
    supply: "20-day supply",
  },
  glutara: {
    badge: "Daily antioxidant support",
    description: "Daily nutritional support for antioxidant wellbeing.",
    supply: "",
  },
};

function motionBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

export default function HomepageProductCarousel({ products }: { products: CatalogProduct[] }) {
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startScrollLeft: number } | undefined>(undefined);
  const [activePage, setActivePage] = useState(0);
  const [snapPoints, setSnapPoints] = useState<number[]>([0]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const firstCardOffset = (track.firstElementChild as HTMLElement | null)?.offsetLeft ?? 0;
      const positions = Array.from(track.children).reduce<number[]>((points, child) => {
        const position = Math.min(Math.max(0, (child as HTMLElement).offsetLeft - firstCardOffset), maxScroll);
        return points.some((point) => Math.abs(point - position) < 2) ? points : [...points, position];
      }, [0]);
      const currentPage = positions.reduce((closest, position, index) => (
        Math.abs(position - track.scrollLeft) < Math.abs(positions[closest] - track.scrollLeft) ? index : closest
      ), 0);

      setSnapPoints(positions);
      setActivePage(currentPage);
      setAtStart(track.scrollLeft <= 1);
      setAtEnd(track.scrollLeft >= maxScroll - 1);
    };

    update();
    const frame = window.requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(track);
    Array.from(track.children).forEach((child) => observer.observe(child));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [products]);

  const scrollTo = (position: number) => {
    trackRef.current?.scrollTo({ left: position, behavior: motionBehavior() });
  };

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const firstCardOffset = (track.firstElementChild as HTMLElement | null)?.offsetLeft ?? 0;
    const positions = Array.from(track.children).reduce<number[]>((points, child) => {
      const position = Math.min(Math.max(0, (child as HTMLElement).offsetLeft - firstCardOffset), maxScroll);
      return points.some((point) => Math.abs(point - position) < 2) ? points : [...points, position];
    }, [0]);
    const currentPage = positions.reduce((closest, position, index) => (
      Math.abs(position - track.scrollLeft) < Math.abs(positions[closest] - track.scrollLeft) ? index : closest
    ), 0);
    const nextPage = Math.max(0, Math.min(positions.length - 1, currentPage + direction));

    scrollTo(positions[nextPage] ?? 0);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== event.pointerId) return;
    track.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
  };

  const endPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = undefined;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (!products.length) return null;

  return (
    <section className="overflow-hidden pb-24 pt-8 md:pb-28">
      <div className="container-bio">
        <div className="mx-auto max-w-[1404px]">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[500px]">
              <span className="eyebrow text-gold-600">Daily essentials</span>
              <h2 className="mt-3 max-w-[610px] text-[46px] leading-[0.94] text-ink sm:text-[54px] md:text-[64px]">
                Formulas built for everyday performance.
              </h2>
              <p className="mt-5 max-w-[430px] text-[15px] leading-6 text-[#6b6760] md:text-[16px]">
                Science-led nutrition to support your energy, focus, recovery and long-term vitality.
              </p>
            </div>

            <div className="hidden shrink-0 items-end gap-5 md:flex md:flex-col">
              <Link
                to={marketHref("/shop")}
                className="inline-flex items-center gap-2 border-b border-[#b08a4e]/70 pb-1 text-[16px] text-ink transition-colors hover:text-gold-600"
              >
                Shop all products <ArrowRight size={17} />
              </Link>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => scrollByPage(-1)}
                  disabled={atStart}
                  className="inline-flex size-[48px] items-center justify-center rounded-full border border-[#d9d3c7] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
                  aria-label="Show previous products"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage(1)}
                  disabled={atEnd}
                  className="inline-flex size-[48px] items-center justify-center rounded-full border border-[#4a473f] text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
                  aria-label="Show next products"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            <Link
              to={marketHref("/shop")}
              className="inline-flex w-fit items-center gap-2 border-b border-[#b08a4e]/70 pb-1 text-[15px] text-ink md:hidden"
            >
              Shop all products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-9 pl-6 md:mt-11 md:pl-10 lg:pl-16">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-3 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:pr-10 lg:gap-6 lg:pr-16"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointerDrag}
          onPointerCancel={endPointerDrag}
          aria-label="Daily essentials product carousel"
        >
          {products.map((product) => {
            const productHref = marketHref(`/products/${product.handle}`);
            const fallback = PRODUCT_FALLBACKS[product.handle];
            const image = PRODUCT_CARD_IMAGES[product.handle] ?? product.image;
            const description = product.tagline || fallback?.description || product.description;
            const supply = product.supplyLabel || fallback?.supply || "";
            const badge = fallback?.badge || product.category;

            return (
              <article
                key={product.id}
                className="group/card w-[min(82vw,352px)] shrink-0 snap-start overflow-hidden rounded-[20px] border border-[#e5e0d6] bg-[#fbfaf7] shadow-[0_22px_45px_-38px_rgba(27,26,23,0.38)] transition-[border-color,box-shadow] duration-300 hover:border-[#d6c8af] hover:shadow-[0_26px_52px_-34px_rgba(27,26,23,0.46)] sm:w-[330px] lg:w-[352px]"
              >
                <Link to={productHref} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-forest-600">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#eeeae1]">
                    {image?.src ? (
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover/card:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover/card:transform-none"
                      />
                    ) : null}
                    <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.08em] text-ink shadow-sm">
                      {badge}
                    </span>
                    {product.isBestseller ? (
                      <span className="absolute right-4 top-4 rounded-md bg-[#ecd6a6]/95 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#725323] shadow-sm">
                        Bestseller
                      </span>
                    ) : null}
                  </div>

                  <div className="flex min-h-[194px] flex-col px-6 pb-6 pt-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="min-w-0 text-[22px] leading-[1.05] text-ink">{product.title}</h3>
                      <span className="shrink-0 font-body text-[16px] font-semibold text-ink">
                        {formatMoney(product.price.amount, country)}
                      </span>
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <p className="line-clamp-2 max-w-[220px] font-body text-[12.5px] leading-5 text-[#5f5a53]">{description}</p>
                      {supply ? <span className="shrink-0 pt-0.5 font-body text-[11px] text-forest-400">{supply}</span> : null}
                    </div>
                    <div className="mt-auto border-t border-[#e7e2d8] pt-5">
                      <span className="inline-flex items-center gap-2 font-body text-[14px] font-medium text-ink">
                        View product
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover/card:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/card:transform-none" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {snapPoints.length > 1 ? (
          <div className="mt-4 hidden justify-center gap-3 pr-6 md:flex md:pr-10 lg:pr-16" aria-label="Daily essentials carousel pages">
            {snapPoints.map((point, index) => (
              <button
                key={point}
                type="button"
                onClick={() => scrollTo(point)}
                className={`size-2 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-600 ${
                  index === activePage ? "bg-gold" : "bg-[#d8d5d0] hover:bg-[#aaa59b]"
                }`}
                aria-label={`Show product carousel page ${index + 1}`}
                aria-current={index === activePage ? "true" : undefined}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
