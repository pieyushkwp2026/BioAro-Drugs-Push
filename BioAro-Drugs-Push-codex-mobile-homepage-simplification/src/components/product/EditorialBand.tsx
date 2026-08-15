import { Check } from "lucide-react";
import type { CatalogProduct } from "../../lib/shopify/types";
import { PRODUCT_LIFESTYLE } from "../../data/productLifestyle";

/*
 * The editorial band — photograph, positioning line, and what the formula is for.
 *
 * ---------------------------------------------------------------------------
 * TYPE IS NOT SET OVER THE PHOTOGRAPH, AND THAT IS THE DESIGN
 *
 * The reference sets its headline directly on the image. Our six shots will not carry
 * it: Glutara has open pale sky on the left, Pro Power is busy subject-to-subject
 * across the whole frame. A scrim dark enough to hold text over Pro Power would
 * flatten Glutara into mud, and tuning a scrim per photograph gives seven products
 * seven different treatments.
 *
 * So the image keeps the full width and the words sit beneath it, in the reading
 * column, as one composed unit. Legible on any photograph, identical everywhere.
 *
 * EVERY WORD HERE ALREADY EXISTED. `tagline` is the product's own positioning line and
 * `whyItems` already power "Who is it for?" — this band adds no copy and therefore no
 * claim. It is a new arrangement of what the catalogue already says.
 * ---------------------------------------------------------------------------
 */

export default function EditorialBand({ product }: { product: CatalogProduct }) {
  const image = PRODUCT_LIFESTYLE[product.handle];

  /* No photograph, no band. The twenty US products have none, and an empty frame
     would be worse than the absence nobody notices. */
  if (!image) return null;

  const points = (product.whyItems ?? []).slice(0, 3);

  return (
    <section className="mt-16 md:mt-20">
      <div className="overflow-hidden">
        <img
          src={image.src}
          alt={image.alt}
          width={1600}
          height={900}
          loading="lazy"
          decoding="async"
          className={`h-[280px] w-full object-cover sm:h-[400px] lg:h-[480px] ${image.position ?? "object-center"}`}
        />
      </div>

      <div className="container-bio">
        {/* No bottom rule: the sticky section nav directly below draws its own, and two
            lines 14px apart read as a mistake. */}
        <div className="grid gap-8 pb-14 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <p className="max-w-[20ch] text-balance text-[28px] font-black leading-[1.08] tracking-[-0.035em] text-ink sm:text-[36px] lg:text-[42px]">
            {product.tagline}
          </p>

          {points.length > 0 && (
            <ul className="space-y-4 lg:pt-2">
              {points.map((point) => (
                <li key={point.title} className="flex gap-3 border-b border-line pb-4 last:border-b-0">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember text-white"
                  >
                    <Check size={12} strokeWidth={3.2} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15.5px] font-bold tracking-[-0.02em] text-ink">{point.title}</span>
                    <span className="mt-1 block text-[14px] leading-[1.55] text-ink-600">{point.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
