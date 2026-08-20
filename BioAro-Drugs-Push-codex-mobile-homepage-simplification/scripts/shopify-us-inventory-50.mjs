#!/usr/bin/env node

/*
 * Set the available inventory for the active US catalogue to exactly 50.
 *
 * Dry run:
 *   node --env-file=.env.local scripts/shopify-us-inventory-50.mjs
 * Apply:
 *   node --env-file=.env.local scripts/shopify-us-inventory-50.mjs --apply --confirm-us-inventory-50
 *
 * The location is discovered at runtime. The script refuses to guess when the
 * token cannot read locations or when more than one online fulfilment location
 * is active.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import process from "node:process";

const TARGET_QUANTITY = 50;
const TARGET_HANDLES = [
  "longevity-plus",
  "cellomega-plus",
  "creagen-brain-boost",
  "creagen-femme-energy",
  "creagen-raw-power",
  "creagen-pro-power",
  "glutara",
  "sleepo",
  "bioprotein-pro",
  "plantcore",
  "bioignite",
  "musclerecover",
  "hydrareload",
  "womens-vitalprime",
  "nitricflow",
  "mens-vitalprime",
  "biocollagen",
  "nitric-roots",
  "mindsync",
  "magbalance",
  "vitalgreens",
  "joint-flex",
  "natural-pct",
  "ultra-test",
  "digestive-enzyme",
  "vitamin-k2-d3",
  "energized-aminos",
  "adrenal-support-plus",
];

const APPLY = process.argv.includes("--apply");
const CONFIRM = process.argv.includes("--confirm-us-inventory-50");
const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";
const endpoint = shopDomain ? `https://${shopDomain}/admin/api/${apiVersion}/graphql.json` : null;

if (!endpoint || !accessToken) {
  throw new Error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
}
if (APPLY && !CONFIRM) {
  throw new Error("Apply mode requires --confirm-us-inventory-50.");
}

async function graphql(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (!response.ok || json.errors?.length) {
    const message = json.errors?.map((error) => error.message).join("; ") ?? `${response.status} ${response.statusText}`;
    throw new Error(message);
  }
  return json.data;
}

async function discoverLocation() {
  const data = await graphql(`query InventoryLocations {
    locations(first: 50) {
      nodes { id name isActive fulfillsOnlineOrders }
    }
  }`);
  const candidates = data.locations.nodes.filter((location) => location.isActive && location.fulfillsOnlineOrders);
  if (candidates.length !== 1) {
    throw new Error(`Expected exactly one active online fulfilment location; found ${candidates.length}. ${JSON.stringify(candidates)}`);
  }
  return candidates[0];
}

async function loadProducts() {
  const data = await graphql(`query InventoryProducts {
    products(first: 250, query: "status:active") {
      nodes {
        id
        handle
        title
        status
        resourcePublicationsV2(first: 50) {
          nodes { isPublished publication { id name } }
        }
        variants(first: 100) {
          nodes {
            id
            sku
            inventoryItem {
              id
              tracked
              inventoryLevels(first: 50) {
                nodes {
                  location { id name }
                  quantities(names: ["available"]) { name quantity }
                }
              }
            }
          }
        }
      }
    }
  }`);

  const byHandle = new Map(data.products.nodes.map((product) => [product.handle, product]));
  return TARGET_HANDLES.map((handle) => byHandle.get(handle) ?? null);
}

function quantityAtLocation(inventoryItem, locationId) {
  const level = inventoryItem?.inventoryLevels?.nodes.find((item) => item.location.id === locationId);
  return level?.quantities?.find((quantity) => quantity.name === "available")?.quantity ?? 0;
}

async function enableTracking(product) {
  const result = await graphql(`mutation EnableInventoryTracking($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      userErrors { field message }
    }
  }`, {
    productId: product.id,
    variants: product.variants.nodes.map((variant) => ({ id: variant.id, inventoryItem: { tracked: true } })),
  });
  const errors = result.productVariantsBulkUpdate.userErrors;
  if (errors.length) throw new Error(`Tracking update failed: ${errors.map((error) => error.message).join("; ")}`);
}

async function setQuantities(quantities) {
  const result = await graphql(`mutation SetInventory($input: InventorySetQuantitiesInput!) {
    inventorySetQuantities(input: $input) {
      userErrors { field message code }
    }
  }`, {
    input: {
      name: "available",
      reason: "correction",
      referenceDocumentUri: "bioaro://inventory/us/50",
      quantities,
    },
  });
  const errors = result.inventorySetQuantities.userErrors;
  if (errors.length) throw new Error(`Inventory update failed: ${errors.map((error) => error.message).join("; ")}`);
}

async function main() {
  const location = await discoverLocation();
  const products = await loadProducts();
  const results = [];

  for (const product of products) {
    if (!product) {
      results.push({ action: "missing_or_not_active", quantity: TARGET_QUANTITY });
      continue;
    }

    const published = product.resourcePublicationsV2.nodes.filter((entry) => entry.isPublished);
    const variants = product.variants.nodes;
    const entry = {
      handle: product.handle,
      title: product.title,
      status: product.status,
      publications: published.map((entry) => entry.publication.name),
      location: { id: location.id, name: location.name },
      variants: variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        trackedBefore: variant.inventoryItem?.tracked ?? null,
        quantityBefore: quantityAtLocation(variant.inventoryItem, location.id),
        quantityAfter: TARGET_QUANTITY,
      })),
      action: "dry_run",
    };

    if (!published.length) {
      entry.action = "skipped_not_published";
    } else if (!variants.length || variants.some((variant) => !variant.inventoryItem?.id)) {
      entry.action = "skipped_missing_inventory_item";
    } else if (APPLY) {
      try {
        if (variants.some((variant) => !variant.inventoryItem.tracked)) await enableTracking(product);
        await setQuantities(variants.map((variant) => ({
          inventoryItemId: variant.inventoryItem.id,
          locationId: location.id,
          quantity: TARGET_QUANTITY,
        })));
        entry.action = "updated";
      } catch (error) {
        entry.action = "failed";
        entry.error = error instanceof Error ? error.message : String(error);
      }
    }

    results.push(entry);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    apply: APPLY,
    targetQuantity: TARGET_QUANTITY,
    excludedHandles: ["sleepo-kids"],
    location: { id: location.id, name: location.name },
    targetHandles: TARGET_HANDLES,
    results,
  };
  const outputDir = `migration-reports/${new Date().toISOString().slice(0, 10)}/inventory-50`;
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(`${outputDir}/us-inventory-50.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
}

await main();
