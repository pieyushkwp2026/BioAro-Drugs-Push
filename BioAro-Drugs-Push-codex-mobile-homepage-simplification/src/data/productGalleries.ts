import type { ProductGalleryImage } from "../lib/shopify/types";

/*
 * Product gallery imagery — five photographs per product.
 *
 * MOVED VERBATIM out of src/pages/Product.tsx. Not one src, order or alt string has
 * changed; only the file it lives in. The page now composes the gallery instead of
 * carrying 35 asset imports at the top of a view component.
 *
 * These images are fixed by decision. `gallery_images` metaobjects exist in the
 * Shopify schema and are populated on zero products, so this map stays the source
 * until that content is entered — at which point `product.galleryImages` takes
 * precedence and this becomes the fallback.
 */

import femmeEnergyHero from "../assets/products/creagen-femme-energy-01-hero-1x1.jpg";
import femmeEnergyOpenPack from "../assets/products/creagen-femme-energy-02-open-pack-1x1.jpg";
import femmeEnergySachet from "../assets/products/creagen-femme-energy-03-sachet-1x1.jpg";
import femmeEnergyIngredients from "../assets/products/creagen-femme-energy-04-ingredients-1x1.jpg";
import femmeEnergyLifestyle from "../assets/products/creagen-femme-energy-05-lifestyle-1x1.jpg";
import longevityHero from "../assets/products/longevity-plus-01-hero-1x1.jpg";
import longevityCloseUp from "../assets/products/longevity-plus-02-close-up-1x1.jpg";
import longevityOpenPack from "../assets/products/longevity-plus-03-open-pack-1x1.jpg";
import longevityIngredients from "../assets/products/longevity-plus-04-ingredients-1x1.jpg";
import longevityLifestyle from "../assets/products/longevity-plus-05-lifestyle-1x1.jpg";
import cellOmegaHero from "../assets/products/cellomega-plus-01-hero-1x1.jpg";
import cellOmegaIngredients from "../assets/products/cellomega-plus-02-ingredients-1x1.jpg";
import cellOmegaIngredientsList from "../assets/products/cellomega-plus-03-ingredients-list-1x1.jpg";
import cellOmegaLifestyle from "../assets/products/cellomega-plus-04-lifestyle-1x1.jpg";
import cellOmegaProduct from "../assets/products/cellomega-plus-05-product-1x1.jpg";
import rawPowerHero from "../assets/products/creagen-raw-power-01-hero-1x1.jpg";
import rawPowerDetail from "../assets/products/creagen-raw-power-02-product-detail-1x1.jpg";
import rawPowerOpenPack from "../assets/products/creagen-raw-power-03-open-pack-1x1.jpg";
import rawPowerScene from "../assets/products/creagen-raw-power-04-product-scene-1x1.jpg";
import rawPowerIngredients from "../assets/products/creagen-raw-power-05-ingredients-1x1.jpg";
import brainBoostHero from "../assets/products/creagen-brain-boost-01-hero-1x1.jpg";
import brainBoostOpenPack from "../assets/products/creagen-brain-boost-02-open-pack-1x1.jpg";
import brainBoostFlatlay from "../assets/products/creagen-brain-boost-03-flatlay-1x1.jpg";
import brainBoostDetail from "../assets/products/creagen-brain-boost-04-product-detail-1x1.jpg";
import brainBoostIngredients from "../assets/products/creagen-brain-boost-05-ingredients-1x1.jpg";
import proPowerHero from "../assets/products/creagen-pro-power-01-hero-1x1.jpg";
import proPowerIngredients from "../assets/products/creagen-pro-power-02-ingredients-1x1.jpg";
import proPowerLifestyle from "../assets/products/creagen-pro-power-03-lifestyle-1x1.jpg";
import proPowerBenefits from "../assets/products/creagen-pro-power-04-benefits-1x1.jpg";
import proPowerRoutine from "../assets/products/creagen-pro-power-05-product-routine-1x1.jpg";
import glutaraHero from "../assets/products/glutara-01-hero-1x1.jpg";
import glutaraIngredients from "../assets/products/glutara-02-ingredients-1x1.jpg";
import glutaraLifestyle from "../assets/products/glutara-03-lifestyle-1x1.jpg";
import glutaraBenefits from "../assets/products/glutara-04-benefits-1x1.jpg";
import glutaraRoutine from "../assets/products/glutara-05-product-routine-1x1.jpg";

export const PRODUCT_GALLERIES: Record<string, ProductGalleryImage[]> = {
  "creagen-femme-energy": [
    { src: femmeEnergyHero, alt: "Creagen Femme Energy jar with an individual sachet", fit: "cover" },
    { src: femmeEnergyOpenPack, alt: "Open Creagen Femme Energy jar with branded lid", fit: "cover" },
    { src: femmeEnergySachet, alt: "Creagen Femme Energy five gram sachet", fit: "cover" },
    { src: femmeEnergyIngredients, alt: "Creagen Femme Energy key ingredients and serving amounts", fit: "contain" },
    { src: femmeEnergyLifestyle, alt: "Woman preparing Creagen Femme Energy sachet with water", fit: "cover", position: "center" },
  ],
  "longevity-plus": [
    { src: longevityHero, alt: "LONgevity+ product box and bottle", fit: "cover" },
    { src: longevityCloseUp, alt: "LONgevity+ bottle in front of product packaging", fit: "cover" },
    { src: longevityOpenPack, alt: "Open LONgevity+ packaging with branded lid", fit: "cover" },
    { src: longevityIngredients, alt: "LONgevity+ key ingredients and serving amounts", fit: "contain" },
    { src: longevityLifestyle, alt: "Woman preparing LONgevity+ as part of a daily routine", fit: "cover", position: "center" },
  ],
  "cellomega-plus": [
    { src: cellOmegaHero, alt: "CellOmega Plus packaging, bottle, and capsules", fit: "cover" },
    { src: cellOmegaIngredients, alt: "CellOmega Plus bottle with algae and supporting ingredients", fit: "cover" },
    { src: cellOmegaIngredientsList, alt: "CellOmega Plus key ingredients and serving amounts", fit: "contain" },
    { src: cellOmegaLifestyle, alt: "CellOmega Plus bottle in a morning wellness routine", fit: "cover", position: "center" },
    { src: cellOmegaProduct, alt: "CellOmega Plus packaging and bottle close-up", fit: "cover" },
  ],
  "creagen-raw-power": [
    { src: rawPowerHero, alt: "Creagen Raw Power product container", fit: "cover" },
    { src: rawPowerDetail, alt: "Creagen Raw Power product container with a serving glass", fit: "cover" },
    { src: rawPowerOpenPack, alt: "Open Creagen Raw Power container with individual sachets", fit: "cover" },
    { src: rawPowerScene, alt: "Creagen Raw Power container and sachets in a dark studio setting", fit: "cover" },
    { src: rawPowerIngredients, alt: "Creagen Raw Power formula benefits and serving information", fit: "contain" },
  ],
  "creagen-brain-boost": [
    { src: brainBoostHero, alt: "Creagen Brain Boost container with sachet and water", fit: "cover" },
    { src: brainBoostOpenPack, alt: "Open Creagen Brain Boost container with individual sachets", fit: "cover" },
    { src: brainBoostFlatlay, alt: "Creagen Brain Boost container and sachets flat lay", fit: "cover" },
    { src: brainBoostDetail, alt: "Creagen Brain Boost container with branded lid and sachet", fit: "cover" },
    { src: brainBoostIngredients, alt: "Creagen Brain Boost key ingredients and serving amounts", fit: "contain" },
  ],
  "creagen-smart-start": [
    { src: brainBoostHero, alt: "Creagen Smart Start container with sachet and water", fit: "cover" },
    { src: brainBoostOpenPack, alt: "Open Creagen Smart Start container with individual sachets", fit: "cover" },
    { src: brainBoostFlatlay, alt: "Creagen Smart Start container and sachets flat lay", fit: "cover" },
    { src: brainBoostDetail, alt: "Creagen Smart Start container with branded lid and sachet", fit: "cover" },
    { src: brainBoostIngredients, alt: "Creagen Smart Start key ingredients and serving amounts", fit: "contain" },
  ],
  "creagen-pro-power": [
    { src: proPowerHero, alt: "Creagen Pro Power container with two individual sachets", fit: "cover" },
    { src: proPowerIngredients, alt: "Creagen Pro Power ingredients with powder and individual sachets", fit: "cover" },
    { src: proPowerLifestyle, alt: "Athlete preparing Creagen Pro Power in a gym", fit: "cover" },
    { src: proPowerBenefits, alt: "Creagen Pro Power formula benefits and performance support information", fit: "contain" },
    { src: proPowerRoutine, alt: "Open Creagen Pro Power container with shaker and sachets", fit: "cover" },
  ],
  glutara: [
    { src: glutaraHero, alt: "Glutara product container on a stone surface", fit: "cover" },
    { src: glutaraIngredients, alt: "Glutara ingredients with sachets and powder samples", fit: "cover" },
    { src: glutaraLifestyle, alt: "Woman preparing Glutara with water as part of a daily routine", fit: "cover" },
    { src: glutaraBenefits, alt: "Glutara formula benefits and antioxidant support information", fit: "contain" },
    { src: glutaraRoutine, alt: "Open Glutara container with sachets, water, and powder", fit: "cover" },
  ],
};

