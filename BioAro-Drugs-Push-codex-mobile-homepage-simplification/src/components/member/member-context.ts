import { useOutletContext } from "react-router-dom";
import type { MarketConfig } from "../../config/markets/types";
import type { MemberState } from "../../hooks/useMemberSnapshot";
import type { MemberCapabilities, MemberSnapshot } from "../../lib/member/types";

/*
 * Split from `MemberShell.tsx` for the same reason `auth-context.ts`, `cart-context.ts`
 * and `session-context.ts` are split from their providers: a file that exports both a
 * component and a non-component breaks Fast Refresh, and the linter says so.
 *
 * The snapshot travels down the router's outlet context rather than a React context,
 * because the shell is already the only parent every dashboard page has — a provider
 * would be a second mechanism doing the same job.
 */
export interface MemberOutletContext {
  snapshot: MemberSnapshot | null;
  state: MemberState;
  source: "endpoint" | "demo" | null;
  capabilities: MemberCapabilities;
  marketConfig: MarketConfig;
}

export function useMemberContext(): MemberOutletContext {
  return useOutletContext<MemberOutletContext>();
}
