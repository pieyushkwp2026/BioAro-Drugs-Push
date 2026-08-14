import { useEffect, useMemo, useState } from "react";
import { useMarket } from "./useMarket";
import { fetchAllProducts } from "../lib/shopify/productService";
import type { CatalogProduct } from "../lib/shopify/types";

export type CatalogState = "loading" | "ready" | "failed";

/*
 * One catalogue fetch shared by every homepage section that needs products.
 *
 * The homepage previously fetched the catalogue inside the product rail alone. Both
 * the product section and the protocol section need it now, and two components each
 * running their own request against the same market would double the network work to
 * render one page.
 */
/*
 * `enabled` exists so a component mounted on every route can defer its request.
 * The chat widget lives in Layout, so an unconditional fetch here would add a
 * catalogue round trip to every page on the site to populate a panel most visitors
 * never open. It passes its own open state instead.
 */
export function useCatalog(enabled = true) {
  const { country } = useMarket();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [state, setState] = useState<CatalogState>("loading");

  useEffect(() => {
    if (!enabled) return;
    // Guard against a stale response landing last when the market changes quickly.
    let active = true;
    setState("loading");

    fetchAllProducts(country, { preserveServerOrder: true })
      .then((next) => {
        if (!active) return;
        setProducts(next);
        setState("ready");
      })
      .catch(() => {
        // fetchAllProducts already falls back to the preview catalogue internally,
        // so reaching here means something is genuinely wrong. Fail quiet rather
        // than render a broken section.
        if (active) setState("failed");
      });

    return () => {
      active = false;
    };
  }, [country, enabled]);

  const byHandle = useMemo(() => {
    const map = new Map<string, CatalogProduct>();
    for (const product of products) map.set(product.handle, product);
    return map;
  }, [products]);

  return { products, byHandle, state };
}
