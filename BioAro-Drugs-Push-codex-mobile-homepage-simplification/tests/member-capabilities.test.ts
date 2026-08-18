import test from "node:test";
import assert from "node:assert/strict";
import { MARKET_CONFIGS } from "../src/config/markets";
import { capabilitiesForMarket } from "../src/lib/member/capabilities";
import { advancedAiAccessState, hasAdvancedAiAccess } from "../src/lib/member/advancedAi";
import type { MarketCode } from "../src/config/markets";
import type { Membership } from "../src/lib/member/types";

const MARKETS = Object.keys(MARKET_CONFIGS) as MarketCode[];

function membership(overrides: Partial<Membership> = {}): Membership {
  return {
    tierId: "essential",
    label: "Essential",
    status: "active",
    renewsAt: null,
    price: null,
    benefits: [],
    origin: "demo",
    ...overrides,
  };
}

test("advanced AI is available only to active paid members", () => {
  assert.equal(hasAdvancedAiAccess(membership()), true);
  assert.equal(hasAdvancedAiAccess(membership({ tierId: "plus" })), true);
  assert.equal(hasAdvancedAiAccess(membership({ tierId: "none" })), false);
  assert.equal(hasAdvancedAiAccess(membership({ status: "paused" })), false);
  assert.equal(hasAdvancedAiAccess(membership({ status: "cancelled" })), false);
  assert.equal(hasAdvancedAiAccess(undefined), false);
});

test("advanced AI gate states distinguish no membership from inactive membership", () => {
  assert.equal(advancedAiAccessState(undefined), "no-membership");
  assert.equal(advancedAiAccessState(membership({ tierId: "none", status: "none" })), "no-membership");
  assert.equal(advancedAiAccessState(membership({ status: "paused" })), "inactive");
  assert.equal(advancedAiAccessState(membership()), "eligible");
});

/*
 * These are the tests that stop a dashboard screen shipping ahead of the business.
 *
 * Every "not available yet" state reads from `capabilitiesForMarket`, so a capability
 * quietly flipping to true would silently turn six honest empty states into implied
 * promises. Flipping one is meant to be a deliberate act that breaks a test and gets
 * discussed — not a one-character edit nobody notices.
 */

test("ordering capability is the market's own checkoutEnabled, never a second opinion", () => {
  for (const market of MARKETS) {
    const config = MARKET_CONFIGS[market];
    assert.equal(
      capabilitiesForMarket(config).ordering,
      config.checkoutEnabled,
      `${market} ordering must track checkoutEnabled`,
    );
  }
});

test("nothing beyond ordering is switched on in any market", () => {
  for (const market of MARKETS) {
    const capabilities = capabilitiesForMarket(MARKET_CONFIGS[market]);

    assert.equal(capabilities.subscriptions, false, `${market}: no selling plans exist`);
    assert.equal(capabilities.telehealth, false, `${market}: no telehealth partner exists`);
    assert.equal(capabilities.prescriptions, false, `${market}: nothing prescribes`);
    assert.equal(capabilities.clinicalRecords, false, `${market}: no lawful home for records`);
    assert.equal(
      capabilities.protocolPersistence,
      false,
      `${market}: the protocol session is still memory-only`,
    );
  }
});

test("UK and US cannot order today, so their dashboards must say so", () => {
  assert.equal(capabilitiesForMarket(MARKET_CONFIGS.uk).ordering, false);
  assert.equal(capabilitiesForMarket(MARKET_CONFIGS.us).ordering, false);
});
