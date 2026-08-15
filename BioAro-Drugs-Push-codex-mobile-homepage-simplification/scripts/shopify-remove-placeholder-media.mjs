#!/usr/bin/env node

import process from "node:process";

/*
 * The same 19 the media-populate script uploads, and for the same reason:
 * productCreateMedia APPENDS, so without this the blue placeholder stays first
 * and remains the featured image — the upload would change nothing a customer
 * sees. Run this only AFTER confirming the new media attached, so a failed
 * upload never strands a product with no image at all.
 *
 * vitalgreens is absent for the same reason it is absent from the upload: it is
 * not in the supplied list, so its placeholder stays until real artwork exists.
 */
const HANDLES = [
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
  "digestive-enzyme",
  "natural-pct",
  "ultra-test",
  "energized-aminos",
  "adrenal-support-plus",
  "joint-flex",
  "vitamin-k2-d3",
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
  const userErrors = result[key]?.userErrors ?? result[key]?.mediaUserErrors ?? [];
  if (userErrors.length) {
    throw new Error(`${key}: ${userErrors.map((error) => error.message).join("; ")}`);
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
          media(first: 20) {
            nodes {
              ... on MediaImage {
                id
                alt
                status
                image { url }
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

async function deleteMedia(productId, mediaIds) {
  const result = await graphql(
    `mutation ProductDeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        deletedMediaIds
        mediaUserErrors { field message }
        product { id }
      }
    }`,
    { productId, mediaIds },
  );
  return assertNoUserErrors(result, "productDeleteMedia");
}

async function main() {
  const results = [];
  for (const handle of HANDLES) {
    const product = await productByHandle(handle);
    if (!product) {
      throw new Error(`Product ${handle} not found.`);
    }

    const placeholderMediaIds = product.media.nodes
      .filter((node) => node?.image?.url?.includes("image-coming-soon"))
      .map((node) => node.id);

    if (!placeholderMediaIds.length) {
      results.push({ handle, action: "no_placeholder_media_found" });
      continue;
    }

    if (!apply) {
      results.push({ handle, action: "would_delete_placeholder_media", mediaIds: placeholderMediaIds });
      continue;
    }

    const deleted = await deleteMedia(product.id, placeholderMediaIds);
    results.push({ handle, action: "deleted_placeholder_media", mediaIds: deleted.deletedMediaIds });
  }

  console.log(JSON.stringify({ shopDomain, apiVersion, apply, results }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
