import { getPreviewProductByHandle, PREVIEW_PRODUCTS } from "../../data/products";
import { getMarketConfigByCountry, isProductAvailableInMarket, marketFromCountryCode } from "../../config/markets";
import type { CartLine, CartState, CatalogProduct, MoneyAmount, ProductEditorial } from "./types";
import type { CountryCode } from "../market/types";

export interface PreviewCartSnapshot {
  lines: Array<{ handle: string; quantity: number }>;
}

export const PREVIEW_CART_STORAGE_KEY = "bioaro.preview.cart";
export const SHOPIFY_CART_STORAGE_KEY = "bioaro.shopify.cart.id";

export function previewVariantId(handle: string) {
  return `preview-variant-${handle}`;
}

export function money(amount: number, country: CountryCode): MoneyAmount {
  const marketConfig = getMarketConfigByCountry(country);
  return {
    amount,
    currencyCode: marketConfig.currency,
  };
}

export function buildCatalogProduct(product: ProductEditorial, country: CountryCode): CatalogProduct {
  const market = marketFromCountryCode(country);
  const availableForSale = isProductAvailableInMarket(product.handle, market);
  const priceAmount = availableForSale ? product.priceByCountry[country] ?? 0 : 0;

  return {
    ...product,
    price: money(priceAmount, country),
    compareAtPrice: availableForSale && product.compareAtByCountry?.[country] ? money(product.compareAtByCountry[country], country) : undefined,
    availableForSale,
    variantId: previewVariantId(product.handle),
  };
}

export function buildPreviewCatalog(country: CountryCode): CatalogProduct[] {
  return PREVIEW_PRODUCTS.map((product) => buildCatalogProduct(product, country));
}

export function buildPreviewProductByHandle(handle: string, country: CountryCode) {
  const product = getPreviewProductByHandle(handle);
  return product ? buildCatalogProduct(product, country) : undefined;
}

export function buildPreviewLine(handle: string, quantity: number, country: CountryCode): CartLine | null {
  const product = buildPreviewProductByHandle(handle, country);
  if (!product || !product.availableForSale) return null;

  return {
    id: `preview-line-${handle}`,
    merchandiseId: product.variantId,
    quantity,
    title: product.title,
    handle: product.handle,
    price: product.price,
    image: product.image ?? { src: "", alt: product.title },
  };
}

export function buildPreviewCart(snapshot: PreviewCartSnapshot, country: CountryCode): CartState {
  const lines = snapshot.lines
    .map(({ handle, quantity }) => buildPreviewLine(handle, quantity, country))
    .filter((line): line is CartLine => Boolean(line));

  const subtotalAmount = lines.reduce((sum, line) => sum + line.price.amount * line.quantity, 0);
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    id: "preview-cart",
    checkoutUrl: null,
    totalQuantity,
    subtotal: money(subtotalAmount, country),
    total: money(subtotalAmount, country),
    lines,
    isPreview: true,
  };
}
