#!/usr/bin/env node

/*
 * Write `custom.category` for all 30 products.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS REPLACES
 *
 * Before: "Wellness" held 12 of 30 products — sleep, gut, joints, bone, hormones,
 * stress, skin and greens behind one word — 8 products had no category at all, and
 * "LONgevity+" was a product name serving as a category with one product in it.
 *
 * After: eight categories, none holding more than six, none empty, and six of the eight
 * are `GoalId` values from the protocol engine so the shop and the builder finally share
 * a vocabulary.
 *
 * Values are the lowercase keys `CATEGORY_BY_METAFIELD_VALUE` maps; the app lowercases
 * before lookup, so casing here is tolerant but consistency is cheap.
 *
 * Dry run by default. --apply writes.
 * ---------------------------------------------------------------------------
 */

import process from "node:process";
import { mkdirSync, writeFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");

const CATEGORIES = {
  longevity: ["longevity-plus", "cellomega-plus", "glutara", "biocollagen"],
  focus: ["mindsync", "creagen-brain-boost", "creagen-smart-start"],
  energy: ["bioignite", "creagen-femme-energy", "energized-aminos"],
  performance: [
    "creagen-raw-power",
    "creagen-pro-power",
    "bioprotein-pro",
    "plantcore",
    "nitricflow",
    "nitric-roots",
  ],
  recovery: ["musclerecover", "hydrareload", "joint-flex"],
  sleep: ["sleepo", "sleepo-kids", "magbalance", "adrenal-support-plus"],
  hormonal: ["womens-vitalprime", "mens-vitalprime", "natural-pct", "ultra-test"],
  foundations: ["vitalgreens", "digestive-enzyme", "vitamin-k2-d3"],
};

const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";
const endpoint = shopDomain ? `https://${shopDomain}/admin/api/${apiVersion}/graphql.json` : null;

if (!endpoint || !accessToken) {
  console.error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
  process.exit(1);
}

async function graphql(query, variables = {}, attempt = 1) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
    body: JSON.stringify({ query, variables }),
  });
  if (response.status === 429 || response.status >= 500) {
    if (attempt > 5) throw new Error(`Shopify returned ${response.status}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt * attempt));
    return graphql(query, variables, attempt + 1);
  }
  const json = await response.json();
  if (json.errors?.some((e) => /throttl/i.test(e.message ?? ""))) {
    if (attempt > 5) throw new Error("Still throttled");
    await new Promise((r) => setTimeout(r, 1000 * attempt * attempt));
    return graphql(query, variables, attempt + 1);
  }
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

const wanted = Object.entries(CATEGORIES).flatMap(([value, handles]) =>
  handles.map((handle) => ({ handle, value })),
);

const seen = new Set();
for (const { handle } of wanted) {
  if (seen.has(handle)) throw new Error(`${handle} appears in two categories`);
  seen.add(handle);
}
console.log(`${wanted.length} products across ${Object.keys(CATEGORIES).length} categories\n`);

/* Resolve every handle first. A handle the store does not have is a stop, not a create. */
const resolved = [];
const missing = [];
for (const target of wanted) {
  const data = await graphql(
    `query($q: String!) { products(first: 1, query: $q) { nodes { id handle title metafields(first: 250) { nodes { key value } } } } }`,
    { q: `handle:${target.handle}` },
  );
  const node = data.products.nodes[0];
  if (!node || node.handle !== target.handle) missing.push(target.handle);
  else {
    const before = node.metafields.nodes.find((m) => m.key === "category")?.value ?? null;
    resolved.push({ ...target, id: node.id, title: node.title, before });
  }
}

if (missing.length) {
  console.error(`Not found in Shopify: ${missing.join(", ")}`);
  console.error("Refusing to continue.");
  process.exit(1);
}

console.log("product                   was            ->  will be");
for (const [value, handles] of Object.entries(CATEGORIES)) {
  console.log(`\n  ${value}  (${handles.length})`);
  for (const row of resolved.filter((r) => r.value === value)) {
    const changed = (row.before ?? "").toLowerCase() !== row.value;
    console.log(
      `    ${row.title.padEnd(24)} ${String(row.before ?? "(none)").padEnd(14)} ->  ${row.value}${changed ? "" : "   (unchanged)"}`,
    );
  }
}

const stamp = new Date().toISOString().slice(0, 10);
const dir = `migration-reports/${stamp}`;
mkdirSync(dir, { recursive: true });
writeFileSync(
  `${dir}/category-prefix-snapshot.json`,
  `${JSON.stringify({ takenAt: new Date().toISOString(), shopDomain, before: resolved.map(({ handle, title, before }) => ({ handle, title, category: before })) }, null, 2)}\n`,
);
console.log(`\nSnapshot written to ${dir}/category-prefix-snapshot.json`);

if (!APPLY) {
  console.log("\nDry run. Re-run with --apply to write.");
  process.exit(0);
}

console.log("\nApplying…");
for (let i = 0; i < resolved.length; i += 25) {
  const batch = resolved.slice(i, i + 25);
  const payload = (
    await graphql(
      `mutation($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) { metafields { key } userErrors { field message } }
      }`,
      {
        metafields: batch.map((row) => ({
          ownerId: row.id,
          namespace: "custom",
          key: "category",
          type: "single_line_text_field",
          value: row.value,
        })),
      },
    )
  ).metafieldsSet;
  if (payload.userErrors?.length) {
    throw new Error(payload.userErrors.map((e) => `${e.field} ${e.message}`).join("; "));
  }
  console.log(`  wrote ${batch.length}`);
}

console.log("\nDone. Re-run scripts/shopify-field-matrix.mjs to confirm category on all 30.");
