import { getPreviewProductByHandle, PREVIEW_PRODUCTS } from "../../data/products";
import { getMarketConfigByCountry } from "../../config/markets";
import type { CountryCode } from "../market/types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import { buildCatalogProduct, buildPreviewCatalog, money } from "./preview";
import type { CatalogProduct, MetafieldComparisonRow, MetafieldTestimonial, MetafieldTitleTextItem, ProductEditorial, ProductImage, ProductMetafields, ShopifyProduct } from "./types";

const USE_MOCK_DATA = import.meta.env.VITE_SHOPIFY_USE_MOCK_DATA === "true";
type ShopifyCurrencyCode = ShopifyProduct["price"]["currencyCode"];

interface ShopifyMetafieldNode {
  key: string;
  value: string;
  type: string;
}

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  featuredImage?: { url: string; altText: string | null } | null;
  selectedOrFirstAvailableVariant?: {
    id: string;
    image?: { url: string; altText: string | null } | null;
    price: { amount: string; currencyCode: ShopifyCurrencyCode };
    compareAtPrice?: { amount: string; currencyCode: ShopifyCurrencyCode } | null;
  } | null;
  metafields?: (ShopifyMetafieldNode | null)[];
}

interface ProductsQueryData {
  products: { edges: Array<{ node: ShopifyProductNode }> };
}

interface ProductQueryData {
  product: ShopifyProductNode | null;
}

const METAFIELD_IDENTIFIERS: { namespace: string; key: string }[] = [
  { namespace: "custom", key: "pdp_subtitle" },
  { namespace: "custom", key: "short_description" },
  { namespace: "custom", key: "hero_tags" },
  { namespace: "custom", key: "hero_bullets" },
  { namespace: "custom", key: "supply_label" },
  { namespace: "custom", key: "serving_size" },
  { namespace: "custom", key: "directions" },
  { namespace: "custom", key: "warnings" },
  { namespace: "custom", key: "storage_instructions" },
  { namespace: "custom", key: "allergen_info" },
  { namespace: "custom", key: "disclaimer" },
  { namespace: "custom", key: "rating_average" },
  { namespace: "custom", key: "rating_count" },
  { namespace: "custom", key: "rating_label" },
  { namespace: "custom", key: "why_formula_headline" },
  { namespace: "custom", key: "why_formula_body" },
  { namespace: "custom", key: "science_headline" },
  { namespace: "custom", key: "ingredients_headline" },
  { namespace: "custom", key: "evidence_headline" },
  { namespace: "custom", key: "faq_headline" },
  { namespace: "custom", key: "bundle_headline" },
  { namespace: "custom", key: "bundle_description" },
  { namespace: "custom", key: "trust_badges" },
  { namespace: "custom", key: "benefit_cards" },
  { namespace: "custom", key: "science_steps" },
  { namespace: "custom", key: "ingredients" },
  { namespace: "custom", key: "supplement_facts_rows" },
  { namespace: "custom", key: "clinical_evidence" },
  { namespace: "custom", key: "comparison_rows" },
  { namespace: "custom", key: "faqs" },
  { namespace: "custom", key: "testimonials" },
  { namespace: "custom", key: "labs_cta" },
  { namespace: "custom", key: "final_cta" },
];

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  featuredImage {
    url
    altText
  }
  selectedOrFirstAvailableVariant {
    id
    image {
      url
      altText
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
  }
  metafields(identifiers: [
    ${METAFIELD_IDENTIFIERS.map((m) => `{namespace: "${m.namespace}", key: "${m.key}"}`).join(",\n    ")}
  ]) {
    key
    value
    type
  }
`;

function safeJsonArray<T>(value: string): T[] | undefined {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function mapMetafields(nodes: (ShopifyMetafieldNode | null)[] | undefined): ProductMetafields | undefined {
  if (!nodes || nodes.length === 0) return undefined;

  const byKey = new Map<string, ShopifyMetafieldNode>();
  for (const node of nodes) {
    if (node) byKey.set(node.key, node);
  }

  const str = (key: string) => byKey.get(key)?.value;
  const num = (key: string) => {
    const v = byKey.get(key)?.value;
    return v !== undefined ? Number(v) : undefined;
  };
  const jsonArr = <T,>(key: string) => {
    const v = byKey.get(key)?.value;
    return v !== undefined ? safeJsonArray<T>(v) : undefined;
  };

  const metafields: ProductMetafields = {
    pdpSubtitle: str("pdp_subtitle"),
    shortDescription: str("short_description"),
    heroTags: str("hero_tags"),
    heroBullets: str("hero_bullets"),
    supplyLabel: str("supply_label"),
    servingSize: str("serving_size"),
    directions: str("directions"),
    warnings: str("warnings"),
    storageInstructions: str("storage_instructions"),
    allergenInfo: str("allergen_info"),
    disclaimer: str("disclaimer"),
    ratingAverage: num("rating_average"),
    ratingCount: num("rating_count"),
    ratingLabel: str("rating_label"),
    whyFormulaHeadline: str("why_formula_headline"),
    whyFormulaBody: str("why_formula_body"),
    scienceHeadline: str("science_headline"),
    ingredientsHeadline: str("ingredients_headline"),
    evidenceHeadline: str("evidence_headline"),
    faqHeadline: str("faq_headline"),
    bundleHeadline: str("bundle_headline"),
    bundleDescription: str("bundle_description"),
    trustBadges: jsonArr<MetafieldTitleTextItem>("trust_badges"),
    benefitCards: jsonArr<MetafieldTitleTextItem>("benefit_cards"),
    scienceSteps: jsonArr<MetafieldTitleTextItem>("science_steps"),
    ingredients: str("ingredients"),
    supplementFactsRows: jsonArr<MetafieldTitleTextItem>("supplement_facts_rows"),
    clinicalEvidence: jsonArr<MetafieldTitleTextItem>("clinical_evidence"),
    comparisonRows: jsonArr<MetafieldComparisonRow>("comparison_rows"),
    faqs: jsonArr<MetafieldTitleTextItem>("faqs"),
    testimonials: jsonArr<MetafieldTestimonial>("testimonials"),
    labsCta: str("labs_cta"),
    finalCta: str("final_cta"),
  };

  return metafields;
}

function mapProductImage(node: ShopifyProductNode): ProductImage {
  const fallbackAlt = `${node.title} product image`;
  if (node.selectedOrFirstAvailableVariant?.image?.url) {
    return {
      src: node.selectedOrFirstAvailableVariant.image.url,
      alt: node.selectedOrFirstAvailableVariant.image.altText ?? fallbackAlt,
    };
  }

  return {
    src: node.featuredImage?.url ?? "",
    alt: node.featuredImage?.altText ?? fallbackAlt,
  };
}

function mapShopifyProduct(node: ShopifyProductNode): ShopifyProduct {
  const amount = Number(node.selectedOrFirstAvailableVariant?.price.amount ?? 0);
  const compareAtAmount = node.selectedOrFirstAvailableVariant?.compareAtPrice?.amount;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    image: mapProductImage(node),
    price: {
      amount,
      currencyCode: node.selectedOrFirstAvailableVariant?.price.currencyCode ?? "USD",
    },
    compareAtPrice: compareAtAmount
      ? {
          amount: Number(compareAtAmount),
          currencyCode: node.selectedOrFirstAvailableVariant?.compareAtPrice?.currencyCode ?? "USD",
        }
      : undefined,
    availableForSale: node.availableForSale,
    variantId: node.selectedOrFirstAvailableVariant?.id ?? `missing-variant-${node.handle}`,
    metafields: mapMetafields(node.metafields),
  };
}

// Builds a full CatalogProduct purely from Shopify data + metafields, used when
// there is no matching local preview product (new Shopify-only products).
function buildShopifyOnlyProduct(shopifyProduct: ShopifyProduct): CatalogProduct {
  const mf = shopifyProduct.metafields;

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    tagline: mf?.pdpSubtitle || "Product details will be available soon.",
    description: mf?.shortDescription || shopifyProduct.description,
    badge: undefined,
    image: shopifyProduct.image,
    category: "Longevity",
    tags: [],
    bestFor: mf?.whyFormulaBody || "Contact support for guidance when this product becomes available.",
    dosage: mf?.directions || "Follow the product label guidance once available.",
    servings: mf?.servingSize || "See packaging",
    supplyLabel: mf?.supplyLabel || "Availability coming soon",
    rating: {
      average: mf?.ratingAverage ?? 0,
      count: mf?.ratingCount ?? 0,
    },
    benefits: mf?.benefitCards?.map((item) => item.text) ?? ["Product guidance will be available when this market opens."],
    whyItems: [],
    trustNotes: mf?.trustBadges?.map((item) => item.text) ?? ["Contact support with product questions while availability is being prepared."],
    warnings: mf?.warnings ? mf.warnings.split("\n").filter(Boolean) : ["Consult a healthcare professional before use."],
    ingredients: mf?.ingredients
      ? [{ name: mf.ingredients, amount: "", purpose: "" }]
      : [],
    evidencePoints: mf?.clinicalEvidence?.map((item) => item.text) ?? [],
    efficacyMetric: { label: "", unit: "", placeboValue: 0, productValue: 0, caption: "" },
    supplementFacts:
      mf?.supplementFactsRows?.map((item) => ({ label: item.title, value: item.text })) ?? [
        { label: "Serving size", value: mf?.servingSize || "See packaging" },
        { label: "Servings per container", value: "See packaging" },
      ],
    science: mf?.scienceSteps?.map((item) => ({ title: item.title, description: item.text })) ?? [
      { title: "Product information", description: "Product-specific information will be available when this market opens." },
    ],
    faq: mf?.faqs?.map((item) => ({ question: item.title, answer: item.text })) ?? [
      { question: "Need more detail?", answer: "Contact support for guidance when this product becomes available." },
    ],
    testimonials: mf?.testimonials,
    comparisonRows: mf?.comparisonRows,
    priceByCountry: {
      US: shopifyProduct.price.currencyCode === "USD" ? shopifyProduct.price.amount : money(shopifyProduct.price.amount, "US").amount,
      CA: shopifyProduct.price.currencyCode === "CAD" ? shopifyProduct.price.amount : money(shopifyProduct.price.amount, "CA").amount,
      GB: shopifyProduct.price.currencyCode === "GBP" ? shopifyProduct.price.amount : money(shopifyProduct.price.amount, "GB").amount,
    },
    price: shopifyProduct.price,
    compareAtPrice: shopifyProduct.compareAtPrice,
    availableForSale: shopifyProduct.availableForSale,
    variantId: shopifyProduct.variantId,
  };
}

function mergeProduct(previewProduct: ProductEditorial, shopifyProduct: ShopifyProduct | undefined, country: CountryCode): CatalogProduct {
  if (!shopifyProduct) {
    return buildCatalogProduct(previewProduct, country);
  }

  const mf = shopifyProduct.metafields;

  return {
    ...previewProduct,
    id: shopifyProduct.id,
    title: shopifyProduct.title || previewProduct.title,
    tagline: mf?.pdpSubtitle || previewProduct.tagline,
    description: mf?.shortDescription || shopifyProduct.description || previewProduct.description,
    image: shopifyProduct.image.src ? shopifyProduct.image : previewProduct.image,
    supplyLabel: mf?.supplyLabel || previewProduct.supplyLabel,
    servings: mf?.servingSize || previewProduct.servings,
    bestFor: mf?.whyFormulaBody || previewProduct.bestFor,
    dosage: mf?.directions || previewProduct.dosage,
    rating: {
      average: mf?.ratingAverage ?? previewProduct.rating.average,
      count: mf?.ratingCount ?? previewProduct.rating.count,
    },
    benefits: mf?.benefitCards?.map((item) => item.text) ?? previewProduct.benefits,
    trustNotes: mf?.trustBadges?.map((item) => item.text) ?? previewProduct.trustNotes,
    warnings: mf?.warnings ? mf.warnings.split("\n").filter(Boolean) : previewProduct.warnings,
    evidencePoints: mf?.clinicalEvidence?.map((item) => item.text) ?? previewProduct.evidencePoints,
    science: mf?.scienceSteps?.map((item) => ({ title: item.title, description: item.text })) ?? previewProduct.science,
    faq: mf?.faqs?.map((item) => ({ question: item.title, answer: item.text })) ?? previewProduct.faq,
    supplementFacts:
      mf?.supplementFactsRows?.map((item) => ({ label: item.title, value: item.text })) ?? previewProduct.supplementFacts,
    testimonials: mf?.testimonials ?? previewProduct.testimonials,
    comparisonRows: mf?.comparisonRows ?? previewProduct.comparisonRows,
    price: shopifyProduct.price,
    compareAtPrice: shopifyProduct.compareAtPrice,
    availableForSale: shopifyProduct.availableForSale,
    variantId: shopifyProduct.variantId,
  };
}

async function fetchShopifyProducts(country: CountryCode) {
  const data = await shopifyFetch<ProductsQueryData>(
    `
      query Products($country: CountryCode!) @inContext(country: $country) {
        products(first: 24, sortKey: BEST_SELLING) {
          edges {
            node {
              ${PRODUCT_FIELDS}
            }
          }
        }
      }
    `,
    { country },
  );

  return data.products.edges.map(({ node }) => mapShopifyProduct(node));
}

async function fetchShopifyProduct(handle: string, country: CountryCode) {
  const data = await shopifyFetch<ProductQueryData>(
    `
      query Product($handle: String!, $country: CountryCode!) @inContext(country: $country) {
        product(handle: $handle) {
          ${PRODUCT_FIELDS}
        }
      }
    `,
    { handle, country },
  );

  return data.product ? mapShopifyProduct(data.product) : undefined;
}

export async function fetchAllProducts(country: CountryCode): Promise<CatalogProduct[]> {
  const marketConfig = getMarketConfigByCountry(country);

  if (!marketConfig.availableProducts.length) {
    return buildPreviewCatalog(country);
  }

  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    return buildPreviewCatalog(country);
  }

  try {
    const shopifyProducts = await fetchShopifyProducts(country);
    const byHandle = new Map(shopifyProducts.map((product) => [product.handle, product]));

    const mergedPreviewProducts = PREVIEW_PRODUCTS.map((previewProduct) =>
      mergeProduct(previewProduct, byHandle.get(previewProduct.handle), country),
    );

    const previewHandles = new Set(PREVIEW_PRODUCTS.map((p) => p.handle));
    const shopifyOnlyProducts = shopifyProducts
      .filter((product) => !previewHandles.has(product.handle))
      .map((product) => buildShopifyOnlyProduct(product));

    return [...mergedPreviewProducts, ...shopifyOnlyProducts];
  } catch {
    return buildPreviewCatalog(country);
  }
}

export async function fetchProductByHandle(handle: string, country: CountryCode): Promise<CatalogProduct | undefined> {
  const previewProduct = getPreviewProductByHandle(handle);
  const marketConfig = getMarketConfigByCountry(country);

  if (!marketConfig.availableProducts.length) {
    return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
  }

  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
  }

  try {
    const shopifyProduct = await fetchShopifyProduct(handle, country);
    if (previewProduct) return mergeProduct(previewProduct, shopifyProduct, country);
    if (!shopifyProduct) return undefined;

    return buildShopifyOnlyProduct(shopifyProduct);
  } catch {
    return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
  }
}