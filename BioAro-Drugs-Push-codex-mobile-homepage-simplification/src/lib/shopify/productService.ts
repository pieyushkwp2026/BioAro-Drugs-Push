import { getPreviewProductByHandle } from "../../data/products";
import { isProductAvailableInMarket, isProductComingSoonInMarket, marketFromCountryCode } from "../../config/markets";
import type { CountryCode } from "../market/types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import { buildCatalogProduct, buildPreviewCatalog } from "./preview";
import { createShopifyProduct, mapProductMetafields, mergeShopifyProduct, type ShopifyMetafieldNode } from "./productMapping";
import type { CatalogProduct, ProductImage, ShopifyProduct } from "./types";

const USE_MOCK_DATA = import.meta.env.VITE_SHOPIFY_USE_MOCK_DATA === "true";
type ShopifyCurrencyCode = ShopifyProduct["price"]["currencyCode"];

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  bestseller?: { value: string } | null;
  featuredImage?: { url: string; altText: string | null } | null;
  selectedOrFirstAvailableVariant?: ShopifyVariantNode | null;
  variants?: { nodes: ShopifyVariantNode[] };
  metafields?: (ShopifyMetafieldNode | null)[];
}

interface ShopifyVariantNode {
    id: string;
    image?: { url: string; altText: string | null } | null;
    price: { amount: string; currencyCode: ShopifyCurrencyCode };
    compareAtPrice?: { amount: string; currencyCode: ShopifyCurrencyCode } | null;
}

interface ProductsQueryData {
  products: { edges: Array<{ node: ShopifyProductNode }> };
}

interface ProductQueryData {
  product: ShopifyProductNode | null;
}

const LEGACY_PRODUCT_ORDER = [
  "longevity-plus",
  "cellomega-plus",
  "creagen-brain-boost",
  "creagen-femme-energy",
  "creagen-raw-power",
  "creagen-pro-power",
  "glutara",
] as const;

const LEGACY_PRODUCT_ORDER_MAP = new Map<string, number>(LEGACY_PRODUCT_ORDER.map((handle, index) => [handle, index]));

const METAFIELD_IDENTIFIERS: { namespace: string; key: string }[] = [
  { namespace: "custom", key: "category" },
  { namespace: "custom", key: "hero_eyebrow" },
  { namespace: "custom", key: "pdp_subtitle" },
  { namespace: "custom", key: "short_description" },
  { namespace: "custom", key: "gallery_images" },
  { namespace: "custom", key: "hero_tags" },
  { namespace: "custom", key: "hero_badges" },
  { namespace: "custom", key: "hero_bullets" },
  { namespace: "custom", key: "pack_name" },
  { namespace: "custom", key: "supply_label" },
  { namespace: "custom", key: "availability_note" },
  { namespace: "custom", key: "best_for_label" },
  { namespace: "custom", key: "best_for_description" },
  { namespace: "custom", key: "serving_size" },
  { namespace: "custom", key: "servings_per_container" },
  { namespace: "custom", key: "product_format" },
  { namespace: "custom", key: "directions" },
  { namespace: "custom", key: "warnings_headline" },
  { namespace: "custom", key: "warnings" },
  { namespace: "custom", key: "storage_instructions" },
  { namespace: "custom", key: "safety_seal" },
  { namespace: "custom", key: "allergen_info" },
  { namespace: "custom", key: "other_ingredients" },
  { namespace: "custom", key: "disclaimer" },
  { namespace: "custom", key: "rating_average" },
  { namespace: "custom", key: "rating_count" },
  { namespace: "custom", key: "rating_label" },
  { namespace: "custom", key: "why_formula_eyebrow" },
  { namespace: "custom", key: "why_formula_headline" },
  { namespace: "custom", key: "why_formula_body" },
  { namespace: "custom", key: "why_pillars" },
  { namespace: "custom", key: "science_eyebrow" },
  { namespace: "custom", key: "science_headline" },
  { namespace: "custom", key: "science_cards" },
  { namespace: "custom", key: "ingredients_eyebrow" },
  { namespace: "custom", key: "ingredients_headline" },
  { namespace: "custom", key: "supplement_facts_headline" },
  { namespace: "custom", key: "evidence_headline" },
  { namespace: "custom", key: "comparison_headline" },
  { namespace: "custom", key: "comparison_bioaro_label" },
  { namespace: "custom", key: "comparison_typical_label" },
  { namespace: "custom", key: "quality_headline" },
  { namespace: "custom", key: "faq_eyebrow" },
  { namespace: "custom", key: "faq_headline" },
  { namespace: "custom", key: "bundle_eyebrow" },
  { namespace: "custom", key: "bundle_headline" },
  { namespace: "custom", key: "bundle_description" },
  { namespace: "custom", key: "related_products" },
  { namespace: "custom", key: "trust_badges" },
  { namespace: "custom", key: "benefit_cards" },
  { namespace: "custom", key: "science_steps" },
  { namespace: "custom", key: "ingredients" },
  { namespace: "custom", key: "ingredient_details" },
  { namespace: "custom", key: "science_visual" },
  { namespace: "custom", key: "supplement_facts_rows" },
  { namespace: "custom", key: "clinical_evidence" },
  { namespace: "custom", key: "comparison_rows" },
  { namespace: "custom", key: "quality_badges" },
  { namespace: "custom", key: "faqs" },
  { namespace: "custom", key: "testimonials" },
  { namespace: "custom", key: "bottom_cta_primary" },
  { namespace: "custom", key: "bottom_cta_secondary" },
  { namespace: "custom", key: "labs_cta" },
  { namespace: "custom", key: "final_cta" },
  { namespace: "custom", key: "pdp_badges" },
];

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  bestseller: metafield(namespace: "custom", key: "bestseller") {
    value
  }
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
  variants(first: 1) {
    nodes {
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
  }
  metafields(identifiers: [
    ${METAFIELD_IDENTIFIERS.map((m) => `{namespace: "${m.namespace}", key: "${m.key}"}`).join(",\n    ")}
  ]) {
    key
    value
    type
    reference {
      ... on MediaImage {
        image {
          url
          altText
        }
      }
      ... on Metaobject {
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
    references(first: 50) {
      nodes {
        ... on Metaobject {
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

function mapProductImage(node: ShopifyProductNode): ProductImage {
  const fallbackAlt = `${node.title} product image`;
  const variant = node.selectedOrFirstAvailableVariant ?? node.variants?.nodes[0];
  if (variant?.image?.url) {
    return {
      src: variant.image.url,
      alt: variant.image.altText ?? fallbackAlt,
    };
  }

  return {
    src: node.featuredImage?.url ?? "",
    alt: node.featuredImage?.altText ?? fallbackAlt,
  };
}

function mapShopifyProduct(node: ShopifyProductNode): ShopifyProduct {
  // Products can be unavailable in a market while still having a contextual price.
  const variant = node.selectedOrFirstAvailableVariant ?? node.variants?.nodes[0];
  const amount = Number(variant?.price.amount ?? 0);
  const compareAtAmount = variant?.compareAtPrice?.amount;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    image: mapProductImage(node),
    price: {
      amount,
      currencyCode: variant?.price.currencyCode ?? "USD",
    },
    compareAtPrice: compareAtAmount
      ? {
          amount: Number(compareAtAmount),
          currencyCode: variant?.compareAtPrice?.currencyCode ?? "USD",
        }
      : undefined,
    availableForSale: node.availableForSale,
    isBestseller: node.bestseller?.value === "true",
    variantId: variant?.id ?? `missing-variant-${node.handle}`,
    metafields: mapProductMetafields(node.metafields),
  };
}

function isVisibleInConfiguredMarket(handle: string, country: CountryCode) {
  const market = marketFromCountryCode(country);
  return isProductAvailableInMarket(handle, market) || isProductComingSoonInMarket(handle, market);
}

function shouldRestrictToConfiguredCatalog(country: CountryCode) {
  return country === "CA";
}

function orderProducts(products: CatalogProduct[]) {
  return [...products].sort((a, b) => {
    const aLegacyIndex = LEGACY_PRODUCT_ORDER_MAP.get(a.handle);
    const bLegacyIndex = LEGACY_PRODUCT_ORDER_MAP.get(b.handle);

    if (aLegacyIndex != null && bLegacyIndex != null) return aLegacyIndex - bLegacyIndex;
    if (aLegacyIndex != null) return -1;
    if (bLegacyIndex != null) return 1;

    const aAvailable = a.availableForSale ? 1 : 0;
    const bAvailable = b.availableForSale ? 1 : 0;
    if (aAvailable !== bAvailable) return bAvailable - aAvailable;

    return a.title.localeCompare(b.title);
  });
}

async function fetchShopifyProducts(country: CountryCode) {
  const data = await shopifyFetch<ProductsQueryData>(
    `
      query Products($country: CountryCode!) @inContext(country: $country) {
        products(first: 60, sortKey: BEST_SELLING) {
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

  const products = data.products.edges.map(({ node }) => mapShopifyProduct(node));
  return shouldRestrictToConfiguredCatalog(country)
    ? products.filter((product) => isVisibleInConfiguredMarket(product.handle, country))
    : products;
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

/**
 * `preserveServerOrder` keeps Shopify's `sortKey: BEST_SELLING` ranking (already
 * requested in fetchShopifyProducts) instead of re-sorting by LEGACY_PRODUCT_ORDER.
 *
 * It is opt-in precisely so the Shop grid's curated ordering does not change: only
 * the homepage bestsellers rail passes it, and only that rail is allowed to claim a
 * sales ranking. Without Shopify configured there is no ranking to preserve, so the
 * curated order is returned either way, which is the honest fallback.
 */
export async function fetchAllProducts(
  country: CountryCode,
  options: { preserveServerOrder?: boolean } = {},
): Promise<CatalogProduct[]> {
  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    return buildPreviewCatalog(country);
  }

  try {
    const shopifyProducts = await fetchShopifyProducts(country);
    const mergedProducts = shopifyProducts.map((shopifyProduct) => {
      const previewProduct = getPreviewProductByHandle(shopifyProduct.handle);
      return previewProduct
        ? mergeShopifyProduct(previewProduct, shopifyProduct, country)
        : createShopifyProduct(shopifyProduct, country);
    });
    const previewOnlyProducts = buildPreviewCatalog(country).filter(
      (previewProduct) => !shopifyProducts.some((shopifyProduct) => shopifyProduct.handle === previewProduct.handle),
    );

    if (options.preserveServerOrder) {
      // Shopify's ranked products first, in rank order; anything preview-only after.
      return [...mergedProducts, ...orderProducts(previewOnlyProducts)];
    }

    return orderProducts([...mergedProducts, ...previewOnlyProducts]);
  } catch {
    return orderProducts(buildPreviewCatalog(country));
  }
}

export async function fetchProductByHandle(handle: string, country: CountryCode): Promise<CatalogProduct | undefined> {
  const previewProduct = getPreviewProductByHandle(handle);

  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
  }

  try {
    if (shouldRestrictToConfiguredCatalog(country) && !isVisibleInConfiguredMarket(handle, country)) {
      return undefined;
    }
    const shopifyProduct = await fetchShopifyProduct(handle, country);
    if (previewProduct && shopifyProduct) return mergeShopifyProduct(previewProduct, shopifyProduct, country);
    if (!shopifyProduct) return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
    return createShopifyProduct(shopifyProduct, country);
  } catch {
    return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
  }
}
