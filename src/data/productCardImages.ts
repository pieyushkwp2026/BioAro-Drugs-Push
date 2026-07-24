import cellOmegaCard from "../assets/products/cards/cellomega-plus-card.png";
import brainBoostCard from "../assets/products/cards/creagen-brain-boost-card.png";
import femmeEnergyCard from "../assets/products/cards/creagen-femme-energy-card.png";
import proPowerCard from "../assets/products/cards/creagen-pro-power-card.png";
import rawPowerCard from "../assets/products/cards/creagen-raw-power-card.png";
import glutaraCard from "../assets/products/cards/glutara-card.png";
import longevityCard from "../assets/products/cards/longevity-plus-card.png";
import type { ProductImage } from "../lib/shopify/types";

export const PRODUCT_CARD_IMAGES: Record<string, ProductImage> = {
  "longevity-plus": { src: longevityCard, alt: "LONgevity+ product packaging" },
  "cellomega-plus": { src: cellOmegaCard, alt: "CellOmega+ product packaging" },
  "creagen-brain-boost": { src: brainBoostCard, alt: "Creagen Brain Boost product packaging" },
  "creagen-femme-energy": { src: femmeEnergyCard, alt: "Creagen Femme Energy product packaging" },
  "creagen-raw-power": { src: rawPowerCard, alt: "Creagen Raw Power product packaging" },
  "creagen-pro-power": { src: proPowerCard, alt: "Creagen Pro Power product packaging" },
  glutara: { src: glutaraCard, alt: "Glutara product packaging" },
};
