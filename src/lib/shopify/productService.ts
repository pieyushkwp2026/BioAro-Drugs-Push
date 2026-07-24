import { getPreviewProductByHandle } from "../../data/products";
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
  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    return buildPreviewCatalog(country);
  }

  try {
    const shopifyProducts = await fetchShopifyProducts(country);
    return shopifyProducts.map((shopifyProduct) => {
      const previewProduct = getPreviewProductByHandle(shopifyProduct.handle);
      return previewProduct
        ? mergeShopifyProduct(previewProduct, shopifyProduct, country)
        : createShopifyProduct(shopifyProduct, country);
    });
  } catch {
    return buildPreviewCatalog(country);
  }
}

export async function fetchProductByHandle(handle: string, country: CountryCode): Promise<CatalogProduct | undefined> {
  const previewProduct = getPreviewProductByHandle(handle);

  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
  }

  try {
    const shopifyProduct = await fetchShopifyProduct(handle, country);
    if (previewProduct && shopifyProduct) return mergeShopifyProduct(previewProduct, shopifyProduct, country);
    if (!shopifyProduct) return undefined;
    return createShopifyProduct(shopifyProduct, country);
  } catch {
    return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
  }
}
