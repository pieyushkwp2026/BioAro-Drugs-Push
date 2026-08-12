#!/usr/bin/env node

import process from "node:process";

const PRODUCTS = [
  { sku: "ROC2821", handle: "bioprotein-pro", title: "BioProtein Pro", priceUsd: 36.36 },
  { sku: "ROC263V", handle: "plantcore", title: "PlantCore", priceUsd: 39.16 },
  { sku: "ROC606", handle: "bioignite", title: "BioIgnite", priceUsd: 23.84 },
  { sku: "ROC603", handle: "musclerecover", title: "MuscleRecover", priceUsd: 21.66 },
  { sku: "ROC017", handle: "hydrareload", title: "HydraReload", priceUsd: 22.57 },
  { sku: "ROC507W", handle: "womens-vitalprime", title: "Women's VitalPrime", priceUsd: 13.5 },
  { sku: "ROC018", handle: "nitricflow", title: "NitricFlow", priceUsd: 29.72 },
  { sku: "ROC507", handle: "mens-vitalprime", title: "Men's VitalPrime", priceUsd: 11.98 },
  { sku: "ROC450", handle: "biocollagen", title: "BioCollagen", priceUsd: 22.36 },
  { sku: "ROC914", handle: "nitric-roots", title: "Nitric Roots", priceUsd: 10.08 },
  { sku: "ROC812", handle: "mindsync", title: "MindSync", priceUsd: 8.6 },
  { sku: "ROC824", handle: "magbalance", title: "MagBalance", priceUsd: 18.16 },
  { sku: "ROC937", handle: "vitalgreens", title: "VitalGreens", priceUsd: 23.74 },
  { sku: "ROC808", handle: "joint-flex", title: "Joint Flex", priceUsd: 9.06 },
  { sku: "ROC503", handle: "natural-pct", title: "Natural PCT", priceUsd: 11.93 },
  { sku: "ROC506", handle: "ultra-test", title: "Ultra Test", priceUsd: 13.31 },
  { sku: "ROC303", handle: "digestive-enzyme", title: "Digestive Enzyme", priceUsd: 15.57 },
  { sku: "ROC831", handle: "vitamin-k2-d3", title: "Vitamin K2 + D3", priceUsd: 11.68 },
  { sku: "ROC613", handle: "energized-aminos", title: "Energized Aminos", priceUsd: 26.39 },
  { sku: "ROC736", handle: "adrenal-support-plus", title: "Adrenal Support Plus", priceUsd: 22.36 },
];

const apply = process.argv.includes("--apply");
const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";

if (!shopDomain || !accessToken) {
  throw new Error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
}

const endpoint = `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`;

async function graphql(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (!response.ok || json.errors?.length) {
    throw new Error(JSON.stringify(json.errors ?? json, null, 2));
  }
  return json.data;
}

function assertNoUserErrors(result, key) {
  const errors = result[key]?.userErrors ?? [];
  if (errors.length) {
    throw new Error(`${key}: ${errors.map((error) => error.message).join("; ")}`);
  }
  return result[key];
}

async function productByHandle(handle) {
  const data = await graphql(
    `query ProductByHandle($query: String!) {
      products(first: 2, query: $query) {
        nodes {
          id
          handle
          title
          status
          variants(first: 2) {
            nodes {
              id
              price
              compareAtPrice
              barcode
              inventoryItem {
                id
                sku
                tracked
              }
            }
          }
        }
      }
    }`,
    { query: `handle:${handle}` },
  );
  return data.products.nodes.find((item) => item.handle === handle) ?? null;
}

async function updateVariant(productId, variantId, sku, priceUsd, tracked) {
  const result = await graphql(
    `mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          inventoryItem { sku tracked }
        }
        userErrors { field message }
      }
    }`,
    {
      productId,
      variants: [
        {
          id: variantId,
          price: String(priceUsd),
          inventoryItem: {
            sku,
            tracked,
          },
        },
      ],
    },
  );
  return assertNoUserErrors(result, "productVariantsBulkUpdate").productVariants[0];
}

async function main() {
  const results = [];

  for (const product of PRODUCTS) {
    const existing = await productByHandle(product.handle);

    if (!existing) {
      results.push({ handle: product.handle, sku: product.sku, action: "missing_product" });
      continue;
    }

    if (existing.variants.nodes.length !== 1) {
      results.push({
        handle: product.handle,
        sku: product.sku,
        action: "skipped_variant_count_mismatch",
        variantCount: existing.variants.nodes.length,
      });
      continue;
    }

    const variant = existing.variants.nodes[0];
    const existingSku = variant.inventoryItem?.sku ?? null;
    if (existingSku && existingSku !== product.sku) {
      results.push({
        handle: product.handle,
        sku: product.sku,
        action: "skipped_sku_mismatch",
        existingSku,
        currentPrice: variant.price,
      });
      continue;
    }

    if (!apply) {
      results.push({
        handle: product.handle,
        sku: product.sku,
        action: "would_align_price",
        currentPrice: variant.price,
        targetPrice: product.priceUsd,
        currentSku: existingSku,
      });
      continue;
    }

    const updated = await updateVariant(
      existing.id,
      variant.id,
      product.sku,
      product.priceUsd,
      variant.inventoryItem?.tracked ?? false,
    );

    results.push({
      handle: product.handle,
      sku: product.sku,
      action: "aligned_price",
      targetPrice: product.priceUsd,
      updatedPrice: updated.price,
      updatedSku: updated.inventoryItem?.sku ?? null,
    });
  }

  console.log(JSON.stringify({
    shopDomain,
    apiVersion,
    apply,
    total: PRODUCTS.length,
    results,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
