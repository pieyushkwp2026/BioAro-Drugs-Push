import type { CountryCode } from "../market/types";
export type ProductCategory = "LONgevity+" | "Wellness" | "Focus" | "Energy" | "Performance";
export interface MoneyAmount {
  amount: number;
  currencyCode: "USD" | "CAD" | "GBP" | "AED";
}
export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductGalleryImage {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  position?: string;
}

export interface ProductIngredient {
  name: string;
  amount: string;
  purpose: string;
  whyIncluded?: string;
  image?: string;
}
export interface ProductWhyItem {
  icon: "energy" | "aging" | "balance" | "heart" | "brain" | "shield" | "flame" | "droplet" | "sparkle";
  title: string;
  description: string;
}
// Icon key vocabulary for the PDP feature-badge row (product page, below description).
export type FeatureBadgeIcon =
  | "capsule"
  | "noHassle"
  | "routine"
  | "travel"
  | "quality"
  | "omega"
  | "meal"
  | "sachet"
  | "mix"
  | "bag"
  | "formula"
  | "pure"
  | "training"
  | "dosed";
export interface ProductFeatureBadge {
  icon: FeatureBadgeIcon;
  label: string;
}

export interface ProductHeroBadge {
  icon?: string;
  title: string;
  text?: string;
}

export interface ProductEfficacyMetric {
  label: string;
  unit: string;
  placeboValue: number;
  productValue: number;
  caption: string;
}
export interface ProductRating {
  average: number;
  count: number;
}
export interface ProductFact {
  label: string;
  value: string;
}
export interface ProductScienceStep {
  icon?: string;
  title: string;
  description: string;
}

export interface ProductQualityBadge {
  icon?: string;
  title: string;
  text?: string;
  enabled: boolean;
}

export interface ProductBottomCta {
  headline: string;
  text?: string;
  buttonLabel: string;
  buttonLink: string;
}

export interface ProductRelatedProduct {
  handle: string;
  title?: string;
  description?: string;
  image?: ProductImage;
  link?: string;
}
export interface ProductFAQ {
  question: string;
  answer: string;
}
export interface ProductResponsibleBusiness {
  name: string;
  address: string;
}

// Generic shape used by simple JSON metafields like Trust badges, Benefit cards, etc.
export interface MetafieldTitleTextItem {
  title: string;
  text: string;
}

// Shape for testimonial metafields (requires initials, name, location, quote).
export interface MetafieldTestimonial {
  initials: string;
  name: string;
  location: string;
  quote: string;
}

// Shape for comparison table rows (requires label, bioaro, typical).
export interface MetafieldComparisonRow {
  label: string;
  bioaro: string;
  typical: string;
}

export interface ProductMetafields {
  category?: ProductCategory;
  heroEyebrow?: string;
  pdpSubtitle?: string;
  shortDescription?: string;
  heroTags?: string;
  heroBullets?: string;
  heroBadges?: ProductHeroBadge[];
  galleryImages?: ProductGalleryImage[];
  packName?: string;
  supplyLabel?: string;
  availabilityNote?: string;
  bestForLabel?: string;
  bestForDescription?: string;
  servingSize?: string;
  servingsPerContainer?: string;
  productFormat?: string;
  directions?: string;
  warningsHeadline?: string;
  warnings?: string;
  storageInstructions?: string;
  safetySeal?: string;
  allergenInfo?: string;
  otherIngredients?: string[];
  disclaimer?: string;
  ratingAverage?: number;
  ratingCount?: number;
  ratingLabel?: string;
  whyFormulaEyebrow?: string;
  whyFormulaHeadline?: string;
  whyFormulaBody?: string;
  whyPillars?: ProductWhyItem[];
  scienceEyebrow?: string;
  scienceHeadline?: string;
  scienceCards?: ProductScienceStep[];
  ingredientsEyebrow?: string;
  ingredientsHeadline?: string;
  supplementFactsHeadline?: string;
  evidenceHeadline?: string;
  comparisonHeadline?: string;
  comparisonBioaroLabel?: string;
  comparisonTypicalLabel?: string;
  qualityHeadline?: string;
  faqEyebrow?: string;
  faqHeadline?: string;
  bundleEyebrow?: string;
  bundleHeadline?: string;
  bundleDescription?: string;
  relatedProducts?: ProductRelatedProduct[];
  trustBadges?: MetafieldTitleTextItem[];
  benefitCards?: MetafieldTitleTextItem[];
  scienceSteps?: MetafieldTitleTextItem[];
  ingredients?: string;
  ingredientDetails?: ProductIngredient[];
  scienceVisual?: ProductImage;
  supplementFactsRows?: MetafieldTitleTextItem[];
  clinicalEvidence?: MetafieldTitleTextItem[];
  comparisonRows?: MetafieldComparisonRow[];
  qualityBadges?: ProductQualityBadge[];
  faqs?: MetafieldTitleTextItem[];
  testimonials?: MetafieldTestimonial[];
  bottomCtaPrimary?: ProductBottomCta;
  bottomCtaSecondary?: ProductBottomCta;
  labsCta?: string;
  finalCta?: string;
  featureBadges?: ProductFeatureBadge[];
}

export interface ProductEditorial {
  id: string;
  handle: string;
  title: string;
  tagline: string;
  description: string;
  badge?: string;
  isBestseller?: boolean;
  image?: ProductImage;
  galleryImages?: ProductGalleryImage[];
  category: ProductCategory;
  tags: string[];
  bestFor: string;
  bestForLabel?: string;
  dosage: string;
  servings: string;
  supplyLabel: string;
  packName?: string;
  availabilityNote?: string;
  rating: ProductRating;
  benefits: string[];
  whyItems: ProductWhyItem[];
  featureBadges: ProductFeatureBadge[];
  heroBadges?: ProductHeroBadge[];
  trustNotes: string[];
  warnings: string[];
  qualityPoints?: string[];
  qualityBadges?: ProductQualityBadge[];
  responsibleBusiness?: ProductResponsibleBusiness;
  ingredients: ProductIngredient[];
  otherIngredients?: string[];
  supplementFacts: ProductFact[];
  science: ProductScienceStep[];
  evidencePoints: string[];
  efficacyMetric: ProductEfficacyMetric;
  faq: ProductFAQ[];
  testimonials?: MetafieldTestimonial[];
  comparisonRows?: MetafieldComparisonRow[];
  relatedProducts?: ProductRelatedProduct[];
  bottomCtaPrimary?: ProductBottomCta;
  bottomCtaSecondary?: ProductBottomCta;
  priceByCountry: Partial<Record<CountryCode, number>>;
  compareAtByCountry?: Partial<Record<CountryCode, number>>;
  metafields?: ProductMetafields;
}
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ProductImage;
  price: MoneyAmount;
  compareAtPrice?: MoneyAmount;
  availableForSale: boolean;
  isBestseller?: boolean;
  variantId: string;
  metafields?: ProductMetafields;
}
export interface CatalogProduct extends ProductEditorial {
  price: MoneyAmount;
  compareAtPrice?: MoneyAmount;
  availableForSale: boolean;
  variantId: string;
}
export interface CartLine {
  id: string;
  merchandiseId: string;
  quantity: number;
  title: string;
  handle: string;
  price: MoneyAmount;
  image: ProductImage;
}
export interface CartState {
  id: string;
  checkoutUrl: string | null;
  totalQuantity: number;
  subtotal: MoneyAmount;
  total: MoneyAmount;
  lines: CartLine[];
  isPreview: boolean;
}
