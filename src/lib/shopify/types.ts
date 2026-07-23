import type { CountryCode } from "../market/types";
export type ProductCategory = "Longevity" | "Wellness" | "Focus" | "Energy" | "Performance";
export interface MoneyAmount {
  amount: number;
  currencyCode: "USD" | "CAD" | "GBP" | "AED";
}
export interface ProductImage {
  src: string;
  alt: string;
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
  title: string;
  description: string;
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
  pdpSubtitle?: string;
  shortDescription?: string;
  heroTags?: string;
  heroBullets?: string;
  supplyLabel?: string;
  servingSize?: string;
  directions?: string;
  warnings?: string;
  storageInstructions?: string;
  allergenInfo?: string;
  disclaimer?: string;
  ratingAverage?: number;
  ratingCount?: number;
  ratingLabel?: string;
  whyFormulaHeadline?: string;
  whyFormulaBody?: string;
  scienceHeadline?: string;
  ingredientsHeadline?: string;
  evidenceHeadline?: string;
  faqHeadline?: string;
  bundleHeadline?: string;
  bundleDescription?: string;
  trustBadges?: MetafieldTitleTextItem[];
  benefitCards?: MetafieldTitleTextItem[];
  scienceSteps?: MetafieldTitleTextItem[];
  ingredients?: string;
  supplementFactsRows?: MetafieldTitleTextItem[];
  clinicalEvidence?: MetafieldTitleTextItem[];
  comparisonRows?: MetafieldComparisonRow[];
  faqs?: MetafieldTitleTextItem[];
  testimonials?: MetafieldTestimonial[];
  labsCta?: string;
  finalCta?: string;
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
  category: ProductCategory;
  tags: string[];
  bestFor: string;
  dosage: string;
  servings: string;
  supplyLabel: string;
  rating: ProductRating;
  benefits: string[];
  whyItems: ProductWhyItem[];
  trustNotes: string[];
  warnings: string[];
  qualityPoints?: string[];
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
