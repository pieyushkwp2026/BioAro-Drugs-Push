/*
 * Delivery-resolution derivatives: the source card PNGs are ~1MB each (7.8MB total)
 * and render at roughly 400px. These are the same art at 900px JPEG (508KB total).
 * Originals stay in ../assets/products/cards/ for print and other surfaces.
 */
import cellOmegaCard from "../assets/products/cards-optimized/cellomega-plus-card.jpg";
import brainBoostCard from "../assets/products/cards-optimized/creagen-brain-boost-card.jpg";
import femmeEnergyCard from "../assets/products/cards-optimized/creagen-femme-energy-card.jpg";
import proPowerCard from "../assets/products/cards-optimized/creagen-pro-power-card.jpg";
import rawPowerCard from "../assets/products/cards-optimized/creagen-raw-power-card.jpg";
import glutaraCard from "../assets/products/cards-optimized/glutara-card.jpg";
import longevityCard from "../assets/products/cards-optimized/longevity-plus-card.jpg";
import type { ProductImage } from "../lib/shopify/types";

export const PRODUCT_CARD_IMAGES: Record<string, ProductImage> = {
  "longevity-plus": { src: longevityCard, alt: "LONgevity+ product packaging" },
  "cellomega-plus": { src: cellOmegaCard, alt: "CellOmega+ product packaging" },
  "creagen-brain-boost": { src: brainBoostCard, alt: "Creagen Brain Boost product packaging" },
  "sleepo-kids": { src: longevityCard, alt: "SleepO Kids placeholder product packaging" },
  "creagen-femme-energy": { src: femmeEnergyCard, alt: "Creagen Femme Energy product packaging" },
  "creagen-raw-power": { src: rawPowerCard, alt: "Creagen Raw Power product packaging" },
  "creagen-pro-power": { src: proPowerCard, alt: "Creagen Pro Power product packaging" },
  glutara: { src: glutaraCard, alt: "Glutara product packaging" },
};

/*
 * Handles whose card art is their OWN, not borrowed from another product.
 *
 * Two entries above reuse someone else's photograph: creagen-smart-start wears the
 * Brain Boost card and sleepo-kids wears the LONgevity+ card. Derived here rather
 * than hardcoded as a list of exclusions, so it stays correct on its own: add real
 * art for a product and it qualifies automatically, and any product with no entry
 * at all (including Shopify-only products that would fall back to the placeholder
 * bottle) is excluded without anyone having to remember to update a denylist.
 */
export const HANDLES_WITH_OWN_CARD_ART: ReadonlySet<string> = (() => {
  const seen = new Map<string, string>();
  for (const [handle, image] of Object.entries(PRODUCT_CARD_IMAGES)) {
    if (!seen.has(image.src)) seen.set(image.src, handle);
  }
  return new Set(seen.values());
})();
