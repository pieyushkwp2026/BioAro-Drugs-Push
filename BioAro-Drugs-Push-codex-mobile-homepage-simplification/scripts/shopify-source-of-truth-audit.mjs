#!/usr/bin/env node

/*
 * Read-only audit: what does Shopify actually hold for a product?
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * Product pages are currently a merge — local editorial underneath, Shopify metafields
 * on top — so a field that Shopify has never held still renders, and nobody can tell
 * which is which by looking. Before any local record is deleted, this reports the truth
 * per field so the gaps are a list rather than a surprise.
 *
 * MEASURED AGAINST THE SCHEMA, NOT A SECOND COPY OF IT. The expected field set is
 * imported from shopify-pdp-schema.mjs, so this audit cannot drift from the definitions
 * the rollout script creates.
 *
 * PERFORMS NO MUTATIONS. Queries only. Safe to run against production.
 *
 * Usage:
 *   node --env-file=.env.local scripts/shopify-source-of-truth-audit.mjs --handle sleepo
 *   node --env-file=.env.local scripts/shopify-source-of-truth-audit.mjs        # every known handle
 * ---------------------------------------------------------------------------
 */

import process from "node:process";
import { mkdirSync, writeFileSync } from "node:fs";
import { PRODUCT_METAFIELD_DEFINITIONS, ROCKTOMIC_PRODUCTS } from "./shopify-pdp-schema.mjs";

const argv = process.argv.slice(2);
const handleArgs = argv.flatMap((arg, index) => (arg === "--handle" ? [argv[index + 1]] : []));

/* The keys the storefront asks for that the schema never defines. They cannot be
   populated, and three of them (testimonials, rating_average, rating_count) describe
   evidence PRODUCT.md lists as unconfirmed. Reported so the list is visible rather
   than folklore. */
const REQUESTED_BUT_UNDEFINED = [
  "benefit_cards",
  "final_cta",
  "ingredients",
  "labs_cta",
  "rating_average",
  "rating_count",
  "rating_label",
  "science_steps",
  "testimonials",
  "trust_badges",
];

const BIOARO_HANDLES = [
  "longevity-plus",
  "cellomega-plus",
  "creagen-brain-boost",
  "creagen-smart-start",
  "creagen-femme-energy",
  "creagen-raw-power",
  "creagen-pro-power",
  "glutara",
  "sleepo",
  "sleepo-kids",
];

const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";
const endpoint = shopDomain ? `https://${shopDomain}/admin/api/${apiVersion}/graphql.json` : null;

if (!endpoint || !accessToken) {
  console.error(
    "SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.\n" +
      "Run with: node --env-file=.env.local scripts/shopify-source-of-truth-audit.mjs",
  );
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

const PRODUCT_QUERY = `
  query AuditProduct($query: String!) {
    products(first: 1, query: $query) {
      nodes {
        id
        handle
        title
        status
        publishedAt
        descriptionHtml
        featuredMedia { id }
        media(first: 20) { nodes { id } }
        resourcePublicationsV2(first: 20) {
          nodes { isPublished publication { name } }
        }
        variants(first: 5) {
          nodes {
            id
            sku
            price
            compareAtPrice
            inventoryQuantity
          }
        }
        metafields(first: 250) {
          nodes { namespace key type value }
        }
      }
    }
  }
`;

/** present = has a usable value; empty = defined but blank; absent = never written. */
function classify(node) {
  if (!node) return "absent";
  const value = node.value;
  if (value === null || value === undefined) return "empty";
  const text = String(value).trim();
  if (text === "" || text === "[]" || text === "{}") return "empty";
  return "present";
}

async function auditHandle(handle) {
  const data = await graphql(PRODUCT_QUERY, { query: `handle:'${handle}'` });
  const product = data.products.nodes[0];

  if (!product) return { handle, found: false };

  const byKey = new Map(
    product.metafields.nodes.filter((n) => n.namespace === "custom").map((n) => [n.key, n]),
  );

  /* Definitions are objects ({key, type, name}), not tuples. Normalised here so a
     change of shape in the schema file is a one-line fix rather than a crash. */
  const fields = PRODUCT_METAFIELD_DEFINITIONS.map((definition) => {
    const key = Array.isArray(definition) ? definition[0] : definition.key;
    const type = Array.isArray(definition) ? definition[1] : definition.type;
    return { key, type, state: classify(byKey.get(key)) };
  });

  const variant = product.variants.nodes[0] ?? null;

  return {
    handle: product.handle,
    found: true,
    title: product.title,
    status: product.status,
    publishedAt: product.publishedAt,
    /* A DRAFT product returns nothing to the storefront however complete its metafields
       are — sleepo-kids has 34 of them and is invisible. */
    visibleToStorefront: product.status === "ACTIVE" && Boolean(product.publishedAt),
    publications: product.resourcePublicationsV2.nodes
      .filter((n) => n.isPublished)
      .map((n) => n.publication.name),
    mediaCount: product.media.nodes.length,
    hasFeaturedMedia: Boolean(product.featuredMedia),
    variant: variant
      ? {
          sku: variant.sku || null,
          price: variant.price ?? null,
          compareAtPrice: variant.compareAtPrice ?? null,
          inventoryQuantity: variant.inventoryQuantity ?? null,
        }
      : null,
    fields,
    summary: {
      defined: fields.length,
      present: fields.filter((f) => f.state === "present").length,
      empty: fields.filter((f) => f.state === "empty").length,
      absent: fields.filter((f) => f.state === "absent").length,
    },
    /* Anything in `custom` that the schema does not define — written by a script that
       predates the schema, or by hand in the admin. */
    undefinedButPopulated: [...byKey.keys()].filter(
      (key) =>
        !PRODUCT_METAFIELD_DEFINITIONS.some(
          (d) => (Array.isArray(d) ? d[0] : d.key) === key,
        ),
    ),
  };
}

function markdown(results) {
  const lines = [
    "# Shopify source-of-truth audit",
    "",
    "Read-only. Measured against `PRODUCT_METAFIELD_DEFINITIONS` in `scripts/shopify-pdp-schema.mjs`.",
    "",
    "| handle | found | status | storefront | media | sku | price | present | empty | absent |",
    "|---|---|---|---|---|---|---|---|---|---|",
  ];

  for (const r of results) {
    if (!r.found) {
      lines.push(`| \`${r.handle}\` | **no** | – | – | – | – | – | – | – | – |`);
      continue;
    }
    lines.push(
      `| \`${r.handle}\` | yes | ${r.status} | ${r.visibleToStorefront ? "visible" : "**hidden**"} | ${r.mediaCount} | ${r.variant?.sku ?? "**none**"} | ${r.variant?.price ?? "**none**"} | ${r.summary.present} | ${r.summary.empty} | ${r.summary.absent} |`,
    );
  }

  for (const r of results.filter((x) => x.found)) {
    lines.push("", `## ${r.handle} — ${r.title}`, "");
    if (r.publications.length) lines.push(`Published on: ${r.publications.join(", ")}`, "");
    else lines.push("**Published on no channel.**", "");

    const missing = r.fields.filter((f) => f.state !== "present");
    if (missing.length === 0) {
      lines.push("Every defined metafield is populated.");
    } else {
      lines.push(`### Missing (${missing.length} of ${r.summary.defined})`, "");
      for (const f of missing) lines.push(`- \`custom.${f.key}\` (${f.type}) — ${f.state}`);
    }

    if (r.undefinedButPopulated.length) {
      lines.push(
        "",
        "### Populated but not in the schema",
        "",
        ...r.undefinedButPopulated.map((k) => `- \`custom.${k}\``),
      );
    }
  }

  lines.push(
    "",
    "## Requested by the storefront but never defined",
    "",
    "These cannot be populated. `testimonials`, `rating_average` and `rating_count` describe",
    "evidence PRODUCT.md lists as unconfirmed and should be removed from the request rather",
    "than defined.",
    "",
    ...REQUESTED_BUT_UNDEFINED.map((k) => `- \`custom.${k}\``),
    "",
  );

  return lines.join("\n");
}

async function main() {
  const handles = handleArgs.length
    ? handleArgs
    : [...new Set([...BIOARO_HANDLES, ...ROCKTOMIC_PRODUCTS.map((p) => p.handle)])];

  console.log(`Auditing ${handles.length} handle(s) against ${shopDomain} (${apiVersion}) — read only.\n`);

  const results = [];
  for (const handle of handles) {
    try {
      const result = await auditHandle(handle);
      results.push(result);
      if (!result.found) {
        console.log(`  ${handle.padEnd(24)} not found`);
      } else {
        console.log(
          `  ${result.handle.padEnd(24)} ${result.status.padEnd(8)} ` +
            `${result.visibleToStorefront ? "visible" : "hidden "} ` +
            `media:${String(result.mediaCount).padStart(2)} ` +
            `present:${String(result.summary.present).padStart(2)}/${result.summary.defined}`,
        );
      }
    } catch (error) {
      console.error(`  ${handle.padEnd(24)} ERROR ${error.message}`);
      results.push({ handle, found: false, error: error.message });
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const dir = `migration-reports/${stamp}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/source-of-truth-audit.json`, `${JSON.stringify({ shopDomain, apiVersion, results }, null, 2)}\n`);
  writeFileSync(`${dir}/source-of-truth-audit.md`, markdown(results));

  console.log(`\nWrote ${dir}/source-of-truth-audit.json and .md`);
}

await main();
