#!/usr/bin/env node

/*
 * Fix SleepO's borrowed content.
 *
 * ---------------------------------------------------------------------------
 * WHAT WENT WRONG
 *
 * SleepO was created by duplicating LONgevity+ on 2026-07-25 (created 9h39m apart).
 * Shopify's duplicate action copies metafield VALUES INCLUDING REFERENCES, so SleepO
 * pointed at LONgevity+'s ingredient cards. Whoever set it up afterwards rewrote the
 * plain text fields with SleepO's real content — directions, warnings, the melatonin
 * ingredient text — but never opened the reference-backed fields. The result: a live,
 * sellable US listing stating it contains NMN 500 mg, resveratrol, CoQ10, curcumin,
 * B12 and D3. It contains melatonin 1.25 mg.
 *
 * WHAT THIS DOES
 *
 * 1. Snapshots every field it will touch, so the change is reversible.
 * 2. Creates SleepO's OWN ingredient card — Melatonin 1.25 mg, taken from SleepO's own
 *    `custom.ingredients` text, which is the one place its real formulation was stored.
 * 3. Points `ingredient_details` at that card alone.
 * 4. Unsets the other fields still holding LONgevity+'s content.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *
 * It writes `name` and `amount` only. `purpose`, `why_included` and `image` are
 * claim-bearing copy that nobody has approved for SleepO, and inventing them here would
 * repeat the original mistake in a tidier font. An ingredient card with a name and a
 * dose is true and incomplete; one with a borrowed purpose is neither.
 *
 * Dry run by default. Pass --apply to write.
 * ---------------------------------------------------------------------------
 */

import process from "node:process";
import { mkdirSync, writeFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");
const HANDLE = "sleepo";

/* Fields carrying LONgevity+'s content on SleepO. `comparison_rows` is excluded: it is
   `[]` on both products, so it is empty rather than borrowed. */
const BORROWED = ["clinical_evidence", "trust_badges", "benefit_cards", "science_visual"];

const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";
const endpoint = shopDomain ? `https://${shopDomain}/admin/api/${apiVersion}/graphql.json` : null;

if (!endpoint || !accessToken) {
  console.error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
  process.exit(1);
}

async function graphql(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Shopify returned ${response.status} ${response.statusText}`);
  const json = await response.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

function assertNoUserErrors(payload, label) {
  const errors = payload?.userErrors ?? [];
  if (errors.length) throw new Error(`${label}: ${errors.map((e) => `${e.field} ${e.message}`).join("; ")}`);
  return payload;
}

const data = await graphql(
  `query($q: String!) {
    products(first: 1, query: $q) {
      nodes {
        id handle title
        metafields(first: 250) { nodes { id key type value } }
      }
    }
  }`,
  { q: `handle:${HANDLE}` },
);

const product = data.products.nodes[0];
if (!product) throw new Error(`Product ${HANDLE} not found.`);

const byKey = new Map(product.metafields.nodes.map((m) => [m.key, m]));

/* The real formulation, from the only field that held it. Parsed rather than typed in,
   so the dose on the card is the dose the store already stated. */
const ingredientsText = String(byKey.get("ingredients")?.value ?? "");
const match = ingredientsText.match(/^\s*([A-Za-z][A-Za-z0-9\s-]*?)\s+([\d.]+\s*(?:mg|µg|mcg|g|IU))\b/);
if (!match) throw new Error(`Could not read a name and dose from custom.ingredients: "${ingredientsText.slice(0, 80)}"`);
const [, activeName, activeAmount] = match;

console.log(`Product: ${product.title} (${product.handle})`);
console.log(`Active read from custom.ingredients: ${activeName.trim()} ${activeAmount.trim()}\n`);

const snapshot = {
  takenAt: new Date().toISOString(),
  shopDomain,
  productId: product.id,
  handle: product.handle,
  note: "Pre-fix values. Restore by writing these back with metafieldsSet.",
  fields: Object.fromEntries(
    ["ingredient_details", ...BORROWED, "ingredients", "comparison_rows", "supply_label"].map((key) => [
      key,
      byKey.get(key) ? { id: byKey.get(key).id, type: byKey.get(key).type, value: byKey.get(key).value } : null,
    ]),
  ),
};

const dir = `migration-reports/${new Date().toISOString().slice(0, 10)}`;
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/sleepo-prefix-snapshot.json`, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Snapshot written to ${dir}/sleepo-prefix-snapshot.json`);

console.log("\nPlanned changes:");
console.log(`  create metaobject  ingredient: name="${activeName.trim()}" amount="${activeAmount.trim()}"`);
console.log(`  set    custom.ingredient_details -> [that card]  (was ${
  JSON.parse(byKey.get("ingredient_details")?.value ?? "[]").length
} LONgevity+ cards)`);
for (const key of BORROWED) {
  console.log(`  unset  custom.${key}${byKey.get(key) ? "" : "  (already absent, skipping)"}`);
}

if (!APPLY) {
  console.log("\nDry run. Re-run with --apply to write.");
  process.exit(0);
}

console.log("\nApplying…");

const created = assertNoUserErrors(
  (
    await graphql(
      `mutation($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject { id handle type }
          userErrors { field message }
        }
      }`,
      {
        metaobject: {
          type: "ingredient",
          handle: `${activeName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}-sleepo`,
          capabilities: { publishable: { status: "ACTIVE" } },
          fields: [
            { key: "name", value: activeName.trim() },
            { key: "amount", value: activeAmount.trim() },
          ],
        },
      },
    )
  ).metaobjectCreate,
  "metaobjectCreate",
).metaobject;

console.log(`  created ${created.handle} (${created.id})`);

assertNoUserErrors(
  (
    await graphql(
      `mutation($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { key }
          userErrors { field message }
        }
      }`,
      {
        metafields: [
          {
            ownerId: product.id,
            namespace: "custom",
            key: "ingredient_details",
            type: "list.metaobject_reference",
            value: JSON.stringify([created.id]),
          },
        ],
      },
    )
  ).metafieldsSet,
  "metafieldsSet",
);
console.log("  ingredient_details -> SleepO's own card");

const toDelete = BORROWED.map((key) => byKey.get(key)).filter(Boolean);
if (toDelete.length) {
  assertNoUserErrors(
    (
      await graphql(
        `mutation($metafields: [MetafieldIdentifierInput!]!) {
          metafieldsDelete(metafields: $metafields) {
            deletedMetafields { key }
            userErrors { field message }
          }
        }`,
        {
          metafields: toDelete.map((m) => ({
            ownerId: product.id,
            namespace: "custom",
            key: m.key,
          })),
        },
      )
    ).metafieldsDelete,
    "metafieldsDelete",
  );
  console.log(`  unset ${toDelete.map((m) => m.key).join(", ")}`);
}

console.log("\nDone. Verify on the storefront before trusting it.");
