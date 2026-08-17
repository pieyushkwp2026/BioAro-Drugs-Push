import type { MarketConfig } from "../../config/markets/types";
import { capabilitiesForMarket } from "./capabilities";
import { isDemoDataEnabled } from "./demoMode";
import { buildDemoSnapshot } from "./demoSnapshot";
import type { MemberResult, MemberSnapshot } from "./types";

/*
 * The member data seam — the client boundary for everything the dashboard shows.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS FOR
 *
 * The dashboard needs a protocol, orders, records and a membership. None of those has
 * a server behind it. This module is the seam: when the endpoint lands, only
 * `getMemberSnapshot` changes — no component moves, no state is rewritten, no screen
 * is redesigned. It is the same shape `lib/ai/bioaroAiService.ts` uses for the
 * interpretation endpoint, on purpose.
 *
 * THE CONTRACT IS NORMALISED. Components understand `MemberResult<MemberSnapshot>` and
 * nothing else. No provider, host, model or SDK appears anywhere in src/, so what ends
 * up behind the endpoint is invisible from here.
 *
 * ---------------------------------------------------------------------------
 * THE DIVISION OF RESPONSIBILITY
 *
 * The endpoint returns records. The application keeps ownership of what those records
 * are allowed to mean: `capabilities` decides whether a section is even offered, the
 * approved catalogue decides which handles can be shown, and the market decides
 * pricing and availability. A response cannot introduce a capability the business has
 * not switched on, because capabilities are computed here from the market config and
 * not read from the wire.
 *
 * ---------------------------------------------------------------------------
 * KEYS AND TOKENS
 *
 * The endpoint is first-party and server-side. Nothing here is VITE_-prefixed except
 * the two switches below — Vite inlines those into the browser bundle, which is how a
 * key leaks. Same convention `.env.example` already documents for the Shopify Admin
 * token.
 *
 * The access token is PASSED IN rather than read from storage here, so the eventual
 * move from a localStorage token to an httpOnly cookie session changes one call site
 * instead of this file.
 *
 * `vercel.json` currently rewrites "/(.*)" to /index.html for SPA routing; that has to
 * be narrowed so /api/* is not swallowed before any of this can be called. The CSP's
 * `connect-src 'self' https:` already permits a same-origin request.
 * ---------------------------------------------------------------------------
 */

export interface MemberRequest {
  /** Null when signed out. Never read from storage inside this module. */
  accessToken: string | null;
  customerId: string | null;
  marketConfig: MarketConfig;
}

const ENDPOINT = "/api/member/snapshot";

/*
 * A runtime check rather than a build flag, for the same reason the AI service uses
 * one: whether an endpoint exists is a deployment fact, and this has to be able to
 * answer "no" without the dashboard having been built differently.
 */
export function isConfigured(): boolean {
  return import.meta.env.VITE_MEMBER_API_ENABLED === "true";
}

export async function getMemberSnapshot(
  request: MemberRequest,
): Promise<MemberResult<MemberSnapshot>> {
  /* Demonstration mode has no signed-in customer by design — see RequireAuth. */
  if (!request.customerId && !isDemoDataEnabled()) return { kind: "unauthenticated" };

  if (isConfigured()) {
    try {
      const response = await fetch(ENDPOINT, {
        method: "GET",
        headers: request.accessToken
          ? { Authorization: `Bearer ${request.accessToken}` }
          : undefined,
      });

      if (!response.ok) {
        return { kind: "error", message: "We could not load your account just now." };
      }

      const payload = (await response.json()) as Partial<MemberSnapshot>;

      /* Shape-guarded before use, exactly as `interpretGoal` guards its response. A
         malformed payload is an error, not a half-rendered dashboard. */
      if (!payload || typeof payload !== "object" || !payload.profile) {
        return { kind: "error", message: "We could not load your account just now." };
      }

      return {
        kind: "ready",
        source: "endpoint",
        data: {
          ...(payload as MemberSnapshot),
          /* Computed here, never taken from the wire — see the note above. */
          capabilities: capabilitiesForMarket(request.marketConfig),
        },
      };
    } catch {
      return { kind: "error", message: "We could not load your account just now." };
    }
  }

  if (isDemoDataEnabled()) {
    return { kind: "ready", source: "demo", data: buildDemoSnapshot(request.marketConfig) };
  }

  /* The honest default, and what production returns today. Not an error: there is
     simply nothing to show yet, and the dashboard says so section by section. */
  return { kind: "unavailable" };
}

export const memberService = { isConfigured, getMemberSnapshot };
