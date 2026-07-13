import type { CountryCode } from "../market/types";
import { getMarketConfigByCountry } from "../../config/markets";
import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  buildPreviewCart,
  PREVIEW_CART_STORAGE_KEY,
  SHOPIFY_CART_STORAGE_KEY,
} from "./preview";
import type { CartState, CatalogProduct, MoneyAmount, ProductImage } from "./types";

const USE_MOCK_DATA = import.meta.env.VITE_SHOPIFY_USE_MOCK_DATA === "true";
type ShopifyCurrencyCode = MoneyAmount["currencyCode"];

interface ShopifyCartNode {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: ShopifyCurrencyCode };
    totalAmount: { amount: string; currencyCode: ShopifyCurrencyCode };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          image?: { url: string; altText: string | null } | null;
          price: { amount: string; currencyCode: ShopifyCurrencyCode };
          product: {
            handle: string;
            title: string;
            featuredImage?: { url: string; altText: string | null } | null;
          };
        };
      };
    }>;
  };
}

interface CartQueryData {
  cart: ShopifyCartNode | null;
}

interface CartMutationData {
  cartCreate?: { cart: ShopifyCartNode | null; userErrors: Array<{ message: string }> };
  cartLinesAdd?: { cart: ShopifyCartNode | null; userErrors: Array<{ message: string }> };
  cartLinesUpdate?: { cart: ShopifyCartNode | null; userErrors: Array<{ message: string }> };
  cartLinesRemove?: { cart: ShopifyCartNode | null; userErrors: Array<{ message: string }> };
  cartBuyerIdentityUpdate?: { cart: ShopifyCartNode | null; userErrors: Array<{ message: string }> };
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 20) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            product {
              handle
              title
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

function readPreviewSnapshot() {
  const raw = window.localStorage.getItem(PREVIEW_CART_STORAGE_KEY);
  if (!raw) return { lines: [] };

  try {
    const parsed = JSON.parse(raw) as { lines?: Array<{ handle: string; quantity: number }> };
    return { lines: parsed.lines ?? [] };
  } catch {
    return { lines: [] };
  }
}

function writePreviewSnapshot(lines: Array<{ handle: string; quantity: number }>) {
  window.localStorage.setItem(PREVIEW_CART_STORAGE_KEY, JSON.stringify({ lines }));
}

function mapMoney(value: { amount: string; currencyCode: ShopifyCurrencyCode }): MoneyAmount {
  return {
    amount: Number(value.amount),
    currencyCode: value.currencyCode,
  };
}

function mapCartImage(image: ShopifyCartNode["lines"]["edges"][number]["node"]["merchandise"]["image"], fallback: ShopifyCartNode["lines"]["edges"][number]["node"]["merchandise"]["product"]["featuredImage"], title: string): ProductImage {
  const source = image?.url ?? fallback?.url ?? "";
  return {
    src: source,
    alt: image?.altText ?? fallback?.altText ?? `${title} product image`,
  };
}

function mapCart(cart: ShopifyCartNode): CartState {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: mapMoney(cart.cost.subtotalAmount),
    total: mapMoney(cart.cost.totalAmount),
    lines: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      merchandiseId: node.merchandise.id,
      quantity: node.quantity,
      title: node.merchandise.product.title,
      handle: node.merchandise.product.handle,
      price: mapMoney(node.merchandise.price),
      image: mapCartImage(node.merchandise.image, node.merchandise.product.featuredImage, node.merchandise.product.title),
    })),
    isPreview: false,
  };
}

function assertNoUserErrors(result: { userErrors: Array<{ message: string }> }) {
  if (result.userErrors.length) {
    throw new Error(result.userErrors[0]?.message ?? "Shopify cart mutation failed.");
  }
}

export function getStoredCartId() {
  return window.localStorage.getItem(SHOPIFY_CART_STORAGE_KEY);
}

function setStoredCartId(cartId: string) {
  window.localStorage.setItem(SHOPIFY_CART_STORAGE_KEY, cartId);
}

function clearStoredCartId() {
  window.localStorage.removeItem(SHOPIFY_CART_STORAGE_KEY);
}

export async function loadCart(country: CountryCode): Promise<CartState> {
  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    return buildPreviewCart(readPreviewSnapshot(), country);
  }

  const cartId = getStoredCartId();
  if (!cartId) {
    return {
      id: "",
      checkoutUrl: null,
      totalQuantity: 0,
      subtotal: { amount: 0, currencyCode: getMarketConfigByCountry(country).currency },
      total: { amount: 0, currencyCode: getMarketConfigByCountry(country).currency },
      lines: [],
      isPreview: false,
    };
  }

  try {
    const data = await shopifyFetch<CartQueryData>(
      `
        query Cart($cartId: ID!, $country: CountryCode!) @inContext(country: $country) {
          cart(id: $cartId) {
            ${CART_FIELDS}
          }
        }
      `,
      { cartId, country },
    );

    if (!data.cart) {
      clearStoredCartId();
      return loadCart(country);
    }

    return mapCart(data.cart);
  } catch {
    return {
      id: "",
      checkoutUrl: null,
      totalQuantity: 0,
      subtotal: { amount: 0, currencyCode: getMarketConfigByCountry(country).currency },
      total: { amount: 0, currencyCode: getMarketConfigByCountry(country).currency },
      lines: [],
      isPreview: false,
    };
  }
}

export async function addCartItem(product: CatalogProduct, quantity: number, country: CountryCode): Promise<CartState> {
  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    const snapshot = readPreviewSnapshot();
    const nextLines = [...snapshot.lines];
    const existingIndex = nextLines.findIndex((line) => line.handle === product.handle);
    if (existingIndex >= 0) {
      nextLines[existingIndex] = { ...nextLines[existingIndex], quantity: nextLines[existingIndex].quantity + quantity };
    } else {
      nextLines.push({ handle: product.handle, quantity });
    }
    writePreviewSnapshot(nextLines);
    return buildPreviewCart({ lines: nextLines }, country);
  }

  const cartId = getStoredCartId();
  const lines = [{ merchandiseId: product.variantId, quantity }];
  const mutation = cartId ? "cartLinesAdd" : "cartCreate";
  const query =
    mutation === "cartCreate"
      ? `
          mutation CartCreate($country: CountryCode!, $lines: [CartLineInput!]) {
            cartCreate(input: { buyerIdentity: { countryCode: $country }, lines: $lines }) {
              cart {
                ${CART_FIELDS}
              }
              userErrors {
                message
              }
            }
          }
        `
      : `
          mutation CartLinesAdd($cartId: ID!, $country: CountryCode!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                ${CART_FIELDS}
              }
              userErrors {
                message
              }
            }
          }
        `;

  const variables = mutation === "cartCreate" ? { country, lines } : { cartId, country, lines };
  const data = await shopifyFetch<CartMutationData>(query, variables);
  const result = mutation === "cartCreate" ? data.cartCreate : data.cartLinesAdd;

  if (!result?.cart) {
    throw new Error("Shopify returned no cart.");
  }

  assertNoUserErrors(result);
  setStoredCartId(result.cart.id);
  return mapCart(result.cart);
}

export async function updateCartLine(lineId: string, quantity: number, country: CountryCode): Promise<CartState> {
  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    const snapshot = readPreviewSnapshot();
    const nextLines = snapshot.lines
      .map((line) => (line.handle === lineId.replace("preview-line-", "") ? { ...line, quantity } : line))
      .filter((line) => line.quantity > 0);
    writePreviewSnapshot(nextLines);
    return buildPreviewCart({ lines: nextLines }, country);
  }

  const cartId = getStoredCartId();
  if (!cartId) return loadCart(country);

  const data = await shopifyFetch<CartMutationData>(
    `
      mutation CartLinesUpdate($cartId: ID!, $country: CountryCode!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            message
          }
        }
      }
    `,
    { cartId, country, lines: [{ id: lineId, quantity }] },
  );

  const result = data.cartLinesUpdate;
  if (!result?.cart) throw new Error("Shopify returned no cart.");
  assertNoUserErrors(result);
  return mapCart(result.cart);
}

export async function removeCartLine(lineId: string, country: CountryCode): Promise<CartState> {
  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    const snapshot = readPreviewSnapshot();
    const nextLines = snapshot.lines.filter((line) => `preview-line-${line.handle}` !== lineId);
    writePreviewSnapshot(nextLines);
    return buildPreviewCart({ lines: nextLines }, country);
  }

  const cartId = getStoredCartId();
  if (!cartId) return loadCart(country);

  const data = await shopifyFetch<CartMutationData>(
    `
      mutation CartLinesRemove($cartId: ID!, $country: CountryCode!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            message
          }
        }
      }
    `,
    { cartId, country, lineIds: [lineId] },
  );

  const result = data.cartLinesRemove;
  if (!result?.cart) throw new Error("Shopify returned no cart.");
  assertNoUserErrors(result);
  return mapCart(result.cart);
}

export async function syncCartMarket(country: CountryCode): Promise<CartState> {
  if (!isShopifyConfigured() || USE_MOCK_DATA) {
    return buildPreviewCart(readPreviewSnapshot(), country);
  }

  const cartId = getStoredCartId();
  if (!cartId) return loadCart(country);

  const data = await shopifyFetch<CartMutationData>(
    `
      mutation CartBuyerIdentityUpdate($cartId: ID!, $country: CountryCode!) {
        cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: { countryCode: $country }) {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            message
          }
        }
      }
    `,
    { cartId, country },
  );

  const result = data.cartBuyerIdentityUpdate;
  if (!result?.cart) throw new Error("Shopify returned no cart.");
  assertNoUserErrors(result);
  return mapCart(result.cart);
}
