import test from "node:test";
import assert from "node:assert/strict";
import { MARKET_CONFIGS } from "../src/config/markets";
import { buildDemoSnapshot } from "../src/lib/member/demoSnapshot";

const snapshot = buildDemoSnapshot(MARKET_CONFIGS.uk);

/*
 * The demonstration data is fabricated, and these tests are the standing guarantee
 * that it can always be recognised as fabricated.
 *
 * PRODUCT.md forbids placeholders that read as real. A banner and a tag are UI, and UI
 * gets refactored; these assertions hold at the data layer, where a future panel that
 * forgets to render the tag still cannot produce a record that looks genuine.
 */

test("every demonstration record declares where it came from", () => {
  const records: { origin: string }[] = [
    snapshot.profile,
    snapshot.membership,
    ...snapshot.protocols,
    ...snapshot.orders,
    ...snapshot.vault,
    ...snapshot.consultations,
  ];

  assert.ok(records.length > 0, "the fixture should not be empty");
  for (const record of records) {
    assert.equal(record.origin, "demo");
  }
});

test("human-visible identifiers carry the word demo, so a cropped screenshot still reads", () => {
  for (const order of snapshot.orders) {
    assert.match(order.number, /demo/i, `order ${order.id} must be recognisable`);
    for (const line of order.lines) {
      assert.match(line.title, /demo/i, `line "${line.title}" must be recognisable`);
    }
  }

  for (const consultation of snapshot.consultations) {
    assert.match(String(consultation.clinicianName), /demo/i);
  }

  assert.match(snapshot.membership.label, /demo/i);
});

test("no clinical record carries a result, and the type has nowhere to put one", () => {
  const forbidden = /^(result|value|range|flag|interpretation|reading|measurement)/i;

  const clinical = snapshot.vault.filter((entry) => entry.category === "clinical");
  assert.ok(clinical.length > 0, "the fixture should exercise the clinical branch");

  for (const entry of clinical) {
    for (const key of Object.keys(entry)) {
      assert.ok(
        !forbidden.test(key),
        `ClinicalRecordRef gained a "${key}" field. A clinical result is PHI and must not exist in this bundle.`,
      );
    }
  }
});

test("capabilities are never faked, even in demonstration mode", () => {
  /* The records are invented; what the platform can actually do is not. A demo that
     switched telehealth on would be demonstrating a lie rather than a layout. */
  assert.equal(snapshot.capabilities.telehealth, false);
  assert.equal(snapshot.capabilities.prescriptions, false);
  assert.equal(snapshot.capabilities.clinicalRecords, false);
  assert.equal(snapshot.capabilities.ordering, MARKET_CONFIGS.uk.checkoutEnabled);
});

test("demonstration protocols reference real catalogue handles and carry a reason each", () => {
  const available = new Set(MARKET_CONFIGS.uk.availableProducts);

  for (const record of snapshot.protocols) {
    assert.ok(record.items.length > 0);
    for (const item of record.items) {
      assert.ok(available.has(item.handle), `${item.handle} is not a live UK product`);
      assert.ok(item.reason.trim().length > 0, `${item.handle} must explain itself`);
    }
  }
});

test("the protocol history forms a chain, which is the shape persistence has to keep", () => {
  const [latest, first] = snapshot.protocols;

  assert.equal(latest.version, 2);
  assert.equal(first.version, 1);
  assert.equal(latest.supersedesId, first.id);
  assert.equal(first.supersedesId, null);
});
