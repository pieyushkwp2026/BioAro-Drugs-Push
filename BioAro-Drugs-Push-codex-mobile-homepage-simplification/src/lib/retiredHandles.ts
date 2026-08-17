/*
 * Product handles that have been renamed in Shopify.
 *
 * ---------------------------------------------------------------------------
 * WHY THE APP NEEDS ITS OWN REDIRECT
 *
 * Renaming a handle in Shopify creates a 301 — but only for URLs Shopify itself serves.
 * This storefront is headless: it owns `/:market/products/:handle` and resolves the
 * handle against the Storefront API by itself. An old link therefore never reaches
 * Shopify's redirect; it reaches this app, asks for a handle that no longer exists, and
 * renders a not-found.
 *
 * So every Shopify handle rename needs an entry here, and the entry is permanent — old
 * links, bookmarks and campaign URLs do not expire.
 * ---------------------------------------------------------------------------
 */
export const RETIRED_PRODUCT_HANDLES: Record<string, string> = {
  /* Renamed 2026-08-17: the handle used a digit zero, the product is SleepO. */
  sleep0: "sleepo",
};

/** The handle to use, following a rename if one applies. */
export function resolveProductHandle(handle: string): string {
  return RETIRED_PRODUCT_HANDLES[handle] ?? handle;
}
