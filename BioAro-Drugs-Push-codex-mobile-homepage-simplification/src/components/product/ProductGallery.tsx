import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { PDP } from "../../data/productPage";
import type { ProductGalleryImage } from "../../lib/shopify/types";

/*
 * Product gallery.
 *
 * THE IMAGE SET IS FIXED. The same five photographs per product, in the same order,
 * as before — this component only changes how they are presented.
 *
 * What changed and why:
 *  - The stage is the largest element on the page rather than one half of a cramped
 *    two-up. Product photography is the reason a visitor believes the jar is real.
 *  - Thumbnails run as a vertical rail beside the stage from `md` up, so the stage
 *    keeps the full column width instead of losing 88px to a filmstrip.
 *  - The active thumbnail is marked with an ember rule and full opacity; the rest sit
 *    back at 55%, so the rail reads as a position indicator rather than five equal
 *    buttons.
 *  - Only the first image is eager and `fetchPriority="high"` — it is the LCP element
 *    on this page. The other four are lazy. Previously all five loaded immediately,
 *    which on Glutara meant ~5.6MB before anything was interactive.
 *  - `object-contain` on a soft ground, because these are packshots on white; cover
 *    would crop the label off the jar.
 */
export default function ProductGallery({ images, title }: { images: ProductGalleryImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLButtonElement>(null);

  const total = images.length;
  const active = images[Math.min(index, total - 1)];

  const step = useCallback(
    (direction: 1 | -1) => setIndex((current) => (current + direction + total) % total),
    [total],
  );

  // Arrow keys move the gallery whenever it is focused, and always while zoomed.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && zoomed) {
        setZoomed(false);
        stageRef.current?.focus();
        return;
      }
      if (!zoomed && !stageRef.current?.contains(document.activeElement)) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomed, step]);

  if (total === 0) return null;

  return (
    <>
      <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
        {/* ------------------------------------------------------------- rail */}
        <ul className="flex shrink-0 gap-2.5 overflow-x-auto md:w-[84px] md:flex-col md:overflow-visible lg:w-[92px]">
          {images.map((image, position) => {
            const isActive = position === index;
            return (
              <li key={`${image.src}-${position}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(position)}
                  aria-label={PDP.gallery.thumbLabel(position + 1, total)}
                  aria-current={isActive}
                  className={`relative block w-[68px] overflow-hidden rounded-[12px] border bg-cream-50 transition-[border-color,opacity] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember md:w-full ${
                    isActive ? "border-ink opacity-100" : "border-line opacity-55 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-contain p-1.5"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* ------------------------------------------------------------ stage */}
        <div className="relative min-w-0 flex-1">
          <button
            ref={stageRef}
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={PDP.gallery.open}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const start = touchStartX.current;
              const end = event.changedTouches[0]?.clientX;
              touchStartX.current = null;
              if (start == null || end == null) return;
              // 48px threshold so a tap-with-drift still opens the lightbox.
              if (Math.abs(end - start) < 48) return;
              step(end < start ? 1 : -1);
            }}
            className="group block w-full overflow-hidden rounded-[24px] border border-line bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
          >
            <img
              key={active.src}
              src={active.src}
              alt={active.alt || title}
              width={1000}
              height={1000}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className="aspect-square w-full object-contain p-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] motion-reduce:transform-none sm:p-8"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/90 text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              <Expand size={16} strokeWidth={2.2} />
            </span>
          </button>

          {/* Counter, not dots: five is past the count where dots stay legible. */}
          <p className="pointer-events-none absolute left-4 top-4 rounded-full border border-line bg-white/90 px-2.5 py-1 text-[11.5px] font-bold tabular-nums text-ink-600">
            {index + 1} / {total}
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------- lightbox */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt || title}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(20,16,13,0.92)] p-4 sm:p-8"
          onClick={() => setZoomed(false)}
        >
          <img
            src={active.src}
            alt={active.alt || title}
            className="max-h-full max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label={PDP.gallery.close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 sm:right-8 sm:top-8"
          >
            <X size={19} strokeWidth={2.3} />
          </button>

          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(direction);
              }}
              aria-label={direction === -1 ? PDP.gallery.previous : PDP.gallery.next}
              className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 ${
                direction === -1 ? "left-3 sm:left-8" : "right-3 sm:right-8"
              }`}
            >
              {direction === -1 ? <ChevronLeft size={21} strokeWidth={2.2} /> : <ChevronRight size={21} strokeWidth={2.2} />}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
