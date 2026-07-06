export type ProductCategory = "Longevity" | "Focus" | "Recovery" | "Sleep";

export interface MoneyAmount {
  amount: number;
  currencyCode: "USD" | "CAD" | "GBP";
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

export interface ProductEditorial {
  id: string;
  handle: string;
  title: string;
  tagline: string;
  description: string;
  badge?: string;
  image: ProductImage;
  category: ProductCategory;
  tags: string[];
  bestFor: string;
  dosage: string;
  servings: string;
  supplyLabel: string;
  benefits: string[];
  trustNotes: string[];
  warnings: string[];
  ingredients: ProductIngredient[];
  supplementFacts: ProductFact[];
  science: ProductScienceStep[];
  faq: ProductFAQ[];
  priceByCountry: Record<"US" | "CA" | "GB", number>;
  compareAtByCountry?: Partial<Record<"US" | "CA" | "GB", number>>;
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
  variantId: string;
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
