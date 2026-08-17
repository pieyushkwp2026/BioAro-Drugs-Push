import test from "node:test";
import assert from "node:assert/strict";
import { mapProductMetafields } from "../src/lib/shopify/productMapping";
import type { ProductCategory } from "../src/lib/shopify/types";

/*
 * The category taxonomy had no test at all — unlike goals, which are guarded in
 * tests/protocol-session.test.ts. That asymmetry is why "Wellness" grew to 12 of 30
 * products and eight had no category, with nothing to notice.
 */

const category = (value: string) =>
  mapProductMetafields([{ key: "category", type: "single_line_text_field", value }])?.category;

const EXPECTED: Record<string, ProductCategory> = {
  longevity: "Longevity",
  focus: "Focus",
  energy: "Energy",
  performance: "Performance",
  recovery: "Recovery",
  sleep: "Sleep & Calm",
  hormonal: "Hormonal Health",
  foundations: "Daily Foundations",
};

test("every authored category value resolves to a category", () => {
  for (const [value, expected] of Object.entries(EXPECTED)) {
    assert.equal(category(value), expected, `custom.category="${value}"`);
  }
});

test("matching is case and whitespace tolerant, because Shopify holds title case", () => {
  assert.equal(category("Performance"), "Performance");
  assert.equal(category("  SLEEP  "), "Sleep & Calm");
});

/*
 * The retired values. "Wellness" is deliberately unmapped: its 12 products were
 * redistributed individually, so aliasing it to any single category would mis-file most
 * of them. Unmapped must mean uncategorised, never a default bucket — inventing one is
 * how SleepO silently became a Wellness product.
 */
test("retired and unknown values return undefined rather than a default", () => {
  assert.equal(category("wellness"), undefined);
  assert.equal(category("LONgevity+"), undefined);
  assert.equal(category("not-a-category"), undefined);
  assert.equal(category(""), undefined);
});

test("no category is a product name", () => {
  for (const value of Object.values(EXPECTED)) {
    assert.ok(!value.includes("+"), `${value} looks like a product name, not a category`);
  }
});
