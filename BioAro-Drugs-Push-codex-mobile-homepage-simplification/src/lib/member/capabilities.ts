import type { MarketConfig } from "../../config/markets/types";
import type { MemberCapabilities } from "./types";

/*
 * What the platform can do, in one function.
 *
 * Every empty state on the dashboard reads from here. The point is that a screen
 * cannot get ahead of the business by accident: if someone builds a consultations
 * table, it renders "not available" until this file says otherwise, and changing this
 * file is a deliberate act with a test attached.
 *
 * `ordering` is the only flag that varies by market, and it is not restated — it is
 * the market's own `checkoutEnabled`, so the two can never disagree.
 */
export function capabilitiesForMarket(config: MarketConfig): MemberCapabilities {
  return {
    ordering: config.checkoutEnabled,

    /* No selling plans exist on any product. `cartService.ts` marks where a
       sellingPlanId would attach when they do. */
    subscriptions: false,

    /* No telehealth partner, no scheduling, no clinician identity. */
    telehealth: false,

    /* Nothing prescribes, and no pharmacy routing exists. */
    prescriptions: false,

    /* There is no server, so there is no lawful home for a clinical record. This one
       is gated on compliance work, not on engineering effort. */
    clinicalRecords: false,

    /* The protocol session lives in React state in Layout. A refresh loses it. */
    protocolPersistence: false,
  };
}
