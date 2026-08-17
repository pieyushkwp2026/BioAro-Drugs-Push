#!/usr/bin/env node

/*
 * The complete field matrix: every product × every metafield definition in the store.
 *
 * ---------------------------------------------------------------------------
 * WHY IT DISCOVERS THE SCHEMA INSTEAD OF IMPORTING IT
 *
 * `scripts/shopify-pdp-schema.mjs` lists 55 product metafield definitions. The store
 * has 81. Auditing against the file would therefore report a clean bill of health on 26
 * fields nobody in this repo knows exist. The store is the source of truth for what the
 * source of truth can hold, so the definitions are read live.
 *
 * It also records each definition's storefront access: a field set to NONE is invisible
 * to the site however well it is populated, which is how SleepO's `science_visual` sat
 * there looking fine and rendering nothing.
 *
 * Covers EVERY product regardless of status or publication, because a DRAFT product with
 * complete content is a different problem from an ACTIVE one with gaps, and both need
 * naming.
 *
 * Read-only. No mutations.
 * ---------------------------------------------------------------------------
 */

import process from "node:process";
import { mkdirSync, writeFileSync } from "node:fs";

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

/* ------------------------------------------------------------ the definitions */
const defs = [];
let cursor = null;
do {
  const data = await graphql(
    `query($after: String) {
      metafieldDefinitions(first: 100, ownerType: PRODUCT, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes { key name type { name } access { storefront } }
      }
    }`,
    { after: cursor },
  );
  defs.push(...data.metafieldDefinitions.nodes);
  cursor = data.metafieldDefinitions.pageInfo.hasNextPage ? data.metafieldDefinitions.pageInfo.endCursor : null;
} while (cursor);

const storefrontBlind = defs.filter((d) => d.access?.storefront !== "PUBLIC_READ");

/* --------------------------------------------------------------- the products */
const products = [];
cursor = null;
do {
  const data = await graphql(
    `query($after: String) {
      products(first: 40, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          handle title status publishedAt
          media(first: 1) { nodes { id } }
          variants(first: 1) { nodes { sku price availableForSale } }
          metafields(first: 250) { nodes { key value } }
          metafield(namespace: "custom", key: "ingredient_details") {
            references(first: 30) { nodes { ... on Metaobject { handle } } }
          }
        }
      }
    }`,
    { after: cursor },
  );
  products.push(...data.products.nodes);
  cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
} while (cursor);

/** present = usable value; empty = written but blank; absent = never written. */
function state(value) {
  if (value === undefined) return "absent";
  if (value === null) return "empty";
  const text = String(value).trim();
  return text === "" || text === "[]" || text === "{}" ? "empty" : "present";
}

const owners = new Map();
for (const p of products) {
  for (const n of p.metafield?.references?.nodes ?? []) {
    if (!owners.has(n.handle)) owners.set(n.handle, []);
    owners.get(n.handle).push(p.handle);
  }
}
const shared = [...owners.entries()].filter(([, ps]) => ps.length > 1);

const rows = products.map((p) => {
  const values = new Map(p.metafields.nodes.map((m) => [m.key, m.value]));
  const fields = Object.fromEntries(defs.map((d) => [d.key, state(values.get(d.key))]));
  const counts = { present: 0, empty: 0, absent: 0 };
  for (const s of Object.values(fields)) counts[s] += 1;
  const variant = p.variants.nodes[0];
  return {
    handle: p.handle,
    title: p.title,
    status: p.status,
    visibleToStorefront: p.status === "ACTIVE" && Boolean(p.publishedAt),
    hasMedia: p.media.nodes.length > 0,
    sku: variant?.sku || null,
    price: variant?.price ?? null,
    sellable: variant?.availableForSale ?? null,
    ingredientCards: (p.metafield?.references?.nodes ?? []).map((n) => n.handle),
    counts,
    fields,
    /* Keys populated on the product that no definition covers. */
    undefinedKeys: [...values.keys()].filter((k) => !defs.some((d) => d.key === k)),
  };
});

rows.sort((a, b) => b.counts.present - a.counts.present);

/* ------------------------------------------------------------------- reports */
const stamp = new Date().toISOString().slice(0, 10);
const dir = `migration-reports/${stamp}`;
mkdirSync(dir, { recursive: true });
writeFileSync(
  `${dir}/field-matrix.json`,
  `${JSON.stringify({ shopDomain, apiVersion, definitionCount: defs.length, definitions: defs, storefrontBlind, shared, products: rows }, null, 2)}\n`,
);

const md = [
  "# Product field matrix",
  "",
  `${products.length} products × ${defs.length} product metafield definitions, read live from \`${shopDomain}\`.`,
  "",
  `**Definitions not readable by the storefront (${storefrontBlind.length}):** ` +
    (storefrontBlind.length
      ? storefrontBlind.map((d) => `\`${d.key}\` (${d.access?.storefront ?? "unset"})`).join(", ")
      : "none"),
  "",
  "| product | status | storefront | sku | price | media | ing.cards | present | empty | absent |",
  "|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map(
    (r) =>
      `| \`${r.handle}\` | ${r.status} | ${r.visibleToStorefront ? "visible" : "**hidden**"} | ${r.sku ?? "**none**"} | ${r.price ?? "–"} | ${r.hasMedia ? "y" : "**N**"} | ${r.ingredientCards.length} | ${r.counts.present} | ${r.counts.empty} | ${r.counts.absent} |`,
  ),
  "",
  "## Ingredient cards shared between products",
  "",
  shared.length
    ? shared.map(([h, ps]) => `- \`${h}\` → ${ps.join(", ")}`).join("\n")
    : "None. Every product owns its own ingredient cards.",
  "",
  "## Fields absent on every product",
  "",
];

const universallyAbsent = defs
  .map((d) => d.key)
  .filter((key) => rows.every((r) => r.fields[key] !== "present"));
md.push(
  universallyAbsent.length
    ? universallyAbsent.map((k) => `- \`custom.${k}\``).join("\n")
    : "None.",
  "",
);

writeFileSync(`${dir}/field-matrix.md`, `${md.join("\n")}\n`);

/* --------------------------------------------------------------- console view */
console.log(`${products.length} products × ${defs.length} definitions  (${shopDomain})\n`);
console.log("product                 status   storefront  sku          present/empty/absent");
for (const r of rows) {
  console.log(
    `${r.handle.padEnd(23)} ${r.status.padEnd(8)} ${(r.visibleToStorefront ? "visible" : "HIDDEN").padEnd(11)} ` +
      `${String(r.sku ?? "none").padEnd(12)} ${String(r.counts.present).padStart(3)}/${String(r.counts.empty).padStart(2)}/${String(r.counts.absent).padStart(3)}`,
  );
}
console.log(`\nstorefront-blind definitions: ${storefrontBlind.length ? storefrontBlind.map((d) => d.key).join(", ") : "none"}`);
console.log(`shared ingredient cards: ${shared.length ? shared.map(([h, ps]) => `${h}(${ps.join("+")})`).join(", ") : "none"}`);
console.log(`absent on every product: ${universallyAbsent.length}`);
console.log(`\nWrote ${dir}/field-matrix.json and .md`);
