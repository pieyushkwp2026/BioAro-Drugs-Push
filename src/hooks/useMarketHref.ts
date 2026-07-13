import { useCallback } from "react";
import { buildMarketHref } from "../lib/marketRouting";
import { useMarket } from "./useMarket";

export function useMarketHref() {
  const { market } = useMarket();

  return useCallback((href: string) => buildMarketHref(market, href), [market]);
}
