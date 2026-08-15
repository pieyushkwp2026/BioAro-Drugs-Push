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
 * Six products, not seven: CellOmega+ has no lifestyle shot, so its page simply does
 * not get the break rather than borrowing another product's photograph. Sleep0+ is
 * already showing LONgevity+'s artwork elsewhere on the site and that is a bug, not a
 * pattern to repeat.
 */
export const PRODUCT_LIFESTYLE: Record<string, { src: string; alt: string }> = {
  "longevity-plus": { src: longevity, alt: "LONgevity+ as part of a morning routine" },
  "creagen-brain-boost": { src: brainBoost, alt: "Creagen Brain Boost during a working day" },
  "creagen-femme-energy": { src: femmeEnergy, alt: "Creagen Femme Energy in daily use" },
  "creagen-pro-power": { src: proPower, alt: "Creagen Pro Power around training" },
  "creagen-raw-power": { src: rawPower, alt: "Creagen Raw Power around training" },
  glutara: { src: glutara, alt: "Glutara as part of an evening routine" },
};
