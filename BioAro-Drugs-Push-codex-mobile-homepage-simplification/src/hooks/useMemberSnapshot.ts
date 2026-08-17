import { useCallback, useEffect, useMemo, useState } from "react";
import { getMarketConfigByMarket } from "../config/markets";
import { capabilitiesForMarket } from "../lib/member/capabilities";
import { getMemberSnapshot } from "../lib/member/memberService";
import { getStoredTokens } from "../lib/shopify/customerAuth";
import type { MemberCapabilities, MemberSnapshot } from "../lib/member/types";
import { useAuth } from "./useAuth";
import { useMarket } from "./useMarket";

export type MemberState = "loading" | "ready" | "unauthenticated" | "unavailable" | "error";

/*
 * One read of the member snapshot, shaped like `useCatalog`.
 *
 * Fetched once in the dashboard shell and passed down, rather than called per page:
 * `AuthProvider` already re-fetches the customer every 30 seconds, and a second
 * polling loop would double that for nothing.
 *
 * `capabilities` is returned separately and is ALWAYS populated — even while loading,
 * even when unauthenticated, even on error. Screens use it to decide whether a section
 * exists at all, and that answer does not depend on whether a fetch succeeded.
 */
export function useMemberSnapshot(): {
  snapshot: MemberSnapshot | null;
  state: MemberState;
  source: "endpoint" | "demo" | null;
  capabilities: MemberCapabilities;
  reload: () => void;
} {
  const { customer, isLoading: authLoading } = useAuth();
  const { market } = useMarket();
  const marketConfig = useMemo(() => getMarketConfigByMarket(market), [market]);
  const capabilities = useMemo(() => capabilitiesForMarket(marketConfig), [marketConfig]);

  const [snapshot, setSnapshot] = useState<MemberSnapshot | null>(null);
  const [state, setState] = useState<MemberState>("loading");
  const [source, setSource] = useState<"endpoint" | "demo" | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  useEffect(() => {
    if (authLoading) {
      setState("loading");
      return;
    }

    /* Guards a response from a previous market or customer landing after a newer one
       — the same stale-response guard `useCatalog` uses. */
    let active = true;
    setState("loading");

    void getMemberSnapshot({
      accessToken: getStoredTokens()?.accessToken ?? null,
      customerId: customer?.id ?? null,
      marketConfig,
    }).then((result) => {
      if (!active) return;

      if (result.kind === "ready") {
        setSnapshot(result.data);
        setSource(result.source);
        setState("ready");
        return;
      }

      setSnapshot(null);
      setSource(null);
      setState(result.kind === "error" ? "error" : result.kind);
    });

    return () => {
      active = false;
    };
  }, [authLoading, customer?.id, marketConfig, nonce]);

  return { snapshot, state, source, capabilities, reload };
}
