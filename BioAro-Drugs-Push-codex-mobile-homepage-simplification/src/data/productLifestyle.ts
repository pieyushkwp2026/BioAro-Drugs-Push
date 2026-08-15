import cellOmega from "../assets/products/cellomega-plus-04-lifestyle-1x1.jpg";
import brainBoost from "../assets/science/creagen-brain-boost-lifestyle.jpg";
import femmeEnergy from "../assets/science/creagen-femme-energy-lifestyle.jpg";
import proPower from "../assets/science/creagen-pro-power-lifestyle.jpg";
import rawPower from "../assets/science/creagen-raw-power-lifestyle.jpg";
import glutara from "../assets/science/glutara-lifestyle.jpg";
import longevity from "../assets/science/longevity-plus-lifestyle.jpg";

/*
 * One editorial photograph per product, used to break the run of text on the PDP.
 *
 * These have been in assets/science since the beginning and only Science.tsx and
 * About.tsx ever touched them — the product page, where a buyer looks hardest, showed
 * none of them.
 *
 * All seven legacy products, but not from one source. Six have a 1600x900 editorial
 * shot in assets/science. CellOmega+ has none — its only lifestyle image is a SQUARE
 * product still-life from the gallery, which centre-crops to 16:9 without losing the
 * bottle.
 *
 * That means CellOmega+'s band reads as a product photograph where the others read as
 * scenes. Accepted deliberately: it is CellOmega+'s own picture, and borrowing another
 * product's would repeat the mistake Sleep0+ is making elsewhere on this site, where
 * LONgevity+'s artwork is standing in for it.
 */
export const PRODUCT_LIFESTYLE: Record<string, { src: string; alt: string; position?: string }> = {
  "longevity-plus": { src: longevity, alt: "LONgevity+ as part of a morning routine" },
  "creagen-brain-boost": { src: brainBoost, alt: "Creagen Brain Boost during a working day" },
  "creagen-femme-energy": { src: femmeEnergy, alt: "Creagen Femme Energy in daily use" },
  "creagen-pro-power": { src: proPower, alt: "Creagen Pro Power around training" },
  "creagen-raw-power": { src: rawPower, alt: "Creagen Raw Power around training" },
  glutara: { src: glutara, alt: "Glutara as part of an evening routine" },
  /* Square source. `object-center` keeps the bottle; the crop loses ceiling and table
     edge, neither of which carries the shot. */
  "cellomega-plus": {
    src: cellOmega,
    alt: "CellOmega+ on a breakfast table in morning light",
    position: "object-center",
  },
};

/**
 * Whether a product renders an editorial band.
 *
 * The product page needs this before rendering: the sticky section nav sits directly
 * under the band and takes its top rule from it, so it needs a top margin only when
 * there is no band above it.
 */
export function hasEditorialBand(handle: string): boolean {
  return Boolean(PRODUCT_LIFESTYLE[handle]);
}
