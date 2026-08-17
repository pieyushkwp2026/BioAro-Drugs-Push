#!/usr/bin/env node

/*
 * Take SleepO Kids live.
 *
 * ---------------------------------------------------------------------------
 * WHY IT WAS INVISIBLE
 *
 * `status: ACTIVE` with `publishedAt: NULL` and zero sales channels. ACTIVE only means
 * "not archived"; publication to a channel is what makes a product visible, and it had
 * none — so no storefront in any market returned it, despite 34 authored metafields.
 *
 * WHAT THIS SETS, all supplied rather than inferred:
 *   sku    BACT-5I2G5   (from the SKU sheet)
 *   price  45.99        (base variant, so it is sellable at all)
 *   US     45.99 USD    (fixed entry in the United States price list, so American
 *                        customers see exactly $45.99 rather than a converted figure)
 *
 * Channels are MIRRORED FROM SleepO rather than hardcoded: the two are siblings and
 * should behave identically, and copying the live set avoids guessing publication ids
 * that differ per store.
 *
 * NOT TOUCHED: `product_format`, which still reads "Pending approved product format".
 * That is a note-to-self in a customer-facing field and needs a real value from you —
 * inventing a format for a children's supplement is not mine to do.
 *
 * Dry run by default. --apply writes.
 * ---------------------------------------------------------------------------
 */

import process from "node:process";
import { mkdirSync, writeFileSync } from "node:fs";

const APPLY = process.argv.includes("--apply");

const HANDLE = "sleepo-kids";
const SIBLING = "sleepo";
const SKU = "BACT-5I2G5";
const PRICE = "45.99";
const US_PRICE = "45.99";
const US_CATALOG_ID = "gid://shopify/Catalog/70731956327";

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

function assertNoUserErrors(payload, label) {
  const errors = payload?.userErrors ?? [];
  if (errors.length) throw new Error(`${label}: ${errors.map((e) => `${e.field} ${e.message}`).join("; ")}`);
  return payload;
}

const PRODUCT = `
  query($q: String!) {
    products(first: 1, query: $q) {
      nodes {
        id handle title status publishedAt
        resourcePublicationsV2(first: 30) { nodes { isPublished publication { id name } } }
        variants(first: 1) { nodes { id sku price } }
      }
    }
  }
`;

const target = (await graphql(PRODUCT, { q: `handle:${HANDLE}` })).products.nodes[0];
if (!target) throw new Error(`${HANDLE} not found`);

const sibling = (await graphql(PRODUCT, { q: `handle:${SIBLING}` })).products.nodes[0];
if (!sibling) throw new Error(`${SIBLING} not found — cannot mirror its channels`);

const siblingPublications = sibling.resourcePublicationsV2.nodes
  .filter((n) => n.isPublished)
  .map((n) => n.publication);
const alreadyOn = new Set(
  target.resourcePublicationsV2.nodes.filter((n) => n.isPublished).map((n) => n.publication.id),
);
const toPublish = siblingPublications.filter((p) => !alreadyOn.has(p.id));

const variant = target.variants.nodes[0];
if (!variant) throw new Error(`${HANDLE} has no variant`);

const priceList = (
  await graphql(
    `query($id: ID!) { catalog(id: $id) { title ... on MarketCatalog { priceList { id currency } } } }`,
    { id: US_CATALOG_ID },
  )
).catalog?.priceList;
if (!priceList) throw new Error("No US price list found");
if (priceList.currency !== "USD") throw new Error(`US price list is ${priceList.currency}, expected USD`);

console.log(`${target.title} (${target.handle})`);
console.log(`  status=${target.status}  publishedAt=${target.publishedAt ?? "NULL"}`);
console.log(`  now on ${alreadyOn.size} channel(s); ${SIBLING} is on ${siblingPublications.length}\n`);
console.log("Planned changes:");
console.log(`  sku    ${variant.sku || "(none)"}  ->  ${SKU}`);
console.log(`  price  ${variant.price}  ->  ${PRICE}   (base currency)`);
console.log(`  US     fixed ${US_PRICE} USD in "${priceList.id.split("/").pop()}"`);
console.log(`  publish to ${toPublish.length} channel(s): ${toPublish.map((p) => p.name).join(", ") || "(already everywhere)"}`);

const dir = `migration-reports/${new Date().toISOString().slice(0, 10)}`;
mkdirSync(dir, { recursive: true });
writeFileSync(
  `${dir}/sleepo-kids-prefix-snapshot.json`,
  `${JSON.stringify(
    {
      takenAt: new Date().toISOString(),
      shopDomain,
      before: {
        productId: target.id,
        status: target.status,
        publishedAt: target.publishedAt,
        publications: [...alreadyOn],
        variantId: variant.id,
        sku: variant.sku,
        price: variant.price,
      },
    },
    null,
    2,
  )}\n`,
);
console.log(`\nSnapshot written to ${dir}/sleepo-kids-prefix-snapshot.json`);

if (!APPLY) {
  console.log("\nDry run. Re-run with --apply to write.");
  process.exit(0);
}

console.log("\nApplying…");

assertNoUserErrors(
  (
    await graphql(
      `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants { id sku price }
          userErrors { field message }
        }
      }`,
      { productId: target.id, variants: [{ id: variant.id, price: PRICE, inventoryItem: { sku: SKU } }] },
    )
  ).productVariantsBulkUpdate,
  "productVariantsBulkUpdate",
);
console.log(`  sku ${SKU}, price ${PRICE}`);

if (toPublish.length) {
  assertNoUserErrors(
    (
      await graphql(
        `mutation($id: ID!, $input: [PublicationInput!]!) {
          publishablePublish(id: $id, input: $input) {
            publishable { availablePublicationsCount { count } }
            userErrors { field message }
          }
        }`,
        { id: target.id, input: toPublish.map((p) => ({ publicationId: p.id })) },
      )
    ).publishablePublish,
    "publishablePublish",
  );
  console.log(`  published to ${toPublish.length} channel(s)`);
}

assertNoUserErrors(
  (
    await graphql(
      `mutation($priceListId: ID!, $prices: [PriceListPriceInput!]!) {
        priceListFixedPricesAdd(priceListId: $priceListId, prices: $prices) {
          prices { price { amount currencyCode } }
          userErrors { field message }
        }
      }`,
      {
        priceListId: priceList.id,
        prices: [{ variantId: variant.id, price: { amount: US_PRICE, currencyCode: "USD" } }],
      },
    )
  ).priceListFixedPricesAdd,
  "priceListFixedPricesAdd",
);
console.log(`  US fixed price ${US_PRICE} USD`);

console.log("\nDone. Verify on the storefront before trusting it.");
