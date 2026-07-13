import { getPreviewProductByHandle, PREVIEW_PRODUCTS } from "../../data/products";
import { getMarketConfigByCountry } from "../../config/markets";
import type { CountryCode } from "../market/types";
import { isShopifyConfigured, shopifyFetch } from "./client";
import { buildCatalogProduct, buildPreviewCatalog, money } from "./preview";
import type { CatalogProduct, ProductEditorial, ProductImage, ShopifyProduct } from "./types";

const USE_MOCK_DATA = import.meta.env.VITE_SHOPIFY_USE_MOCK_DATA === "true";
type ShopifyCurrencyCode = ShopifyProduct["price"]["currencyCode"];

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
}

interface ProductsQueryData {
  products: { edges: Array<{ node: ShopifyProductNode }> };
}

interface ProductQueryData {
  product: ShopifyProductNode | null;
}

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
`;

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
  };
}

function mergeProduct(previewProduct: ProductEditorial, shopifyProduct: ShopifyProduct | undefined, country: CountryCode): CatalogProduct {
  if (!shopifyProduct) {
    return buildCatalogProduct(previewProduct, country);
  }

  return {
    ...previewProduct,
    id: shopifyProduct.id,
    title: shopifyProduct.title || previewProduct.title,
    description: shopifyProduct.description || previewProduct.description,
    image: shopifyProduct.image.src ? shopifyProduct.image : previewProduct.image,
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

    return PREVIEW_PRODUCTS.map((previewProduct) => mergeProduct(previewProduct, byHandle.get(previewProduct.handle), country));
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

    return {
      id: shopifyProduct.id,
      handle: shopifyProduct.handle,
      title: shopifyProduct.title,
      tagline: "Product information is being finalized.",
      description: shopifyProduct.description,
      badge: undefined,
      image: shopifyProduct.image,
      category: "Longevity",
      tags: [],
      bestFor: "Support details are being finalized.",
      dosage: "Follow the product label guidance once available.",
      servings: "See packaging",
      supplyLabel: "Details coming soon",
      rating: { average: 0, count: 0 },
      benefits: ["Product guidance is being finalized for this market."],
      whyItems: [],
      trustNotes: ["Support can help with product questions while the content library is being finalized."],
      warnings: ["Consult a healthcare professional before use."],
      ingredients: [],
      evidencePoints: [],
      efficacyMetric: { label: "", unit: "", placeboValue: 0, productValue: 0, caption: "" },
      supplementFacts: [
        { label: "Serving size", value: "See packaging" },
        { label: "Servings per container", value: "See packaging" },
      ],
      science: [{ title: "Product information", description: "Editorial content for this product is being finalized." }],
      faq: [{ question: "Need more detail?", answer: "Contact support for guidance while product-specific content is being finalized." }],
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
  } catch {
    return previewProduct ? buildCatalogProduct(previewProduct, country) : undefined;
  }
}
