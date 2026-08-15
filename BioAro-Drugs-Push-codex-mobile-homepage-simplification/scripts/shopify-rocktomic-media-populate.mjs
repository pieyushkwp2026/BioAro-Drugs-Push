#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

/*
 * Source artwork: the Rocktomic SKU thumbnail renders, matched to handles using the
 * supplied "Description and names" PDF.
 *
 * VitalGreens is DELIBERATELY ABSENT. The PDF lists 19 products and the folder holds
 * 20 images; VitalGreens is the extra one, with no row naming it, so it is not in the
 * supplied list and must not be uploadable even by a run with no --handle filter.
 *
 * The two Vital Prime files were ambiguous by filename and were resolved by opening
 * them: "Vital Prime.png" is the blue MEN'S bottle (60 capsules), "Vital Prime
 * Final.png" is the pink WOMEN'S one (30 servings). "Final" reads like a version, not
 * a gender, and transposing these would put the men's multivitamin on the women's page.
 */
const PRODUCTS = [
  {
    handle: "bioprotein-pro",
    title: "BioProtein Pro",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Bio Protein Pro final.png",
  },
  {
    handle: "plantcore",
    title: "PlantCore",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Plant Core.png",
  },
  {
    handle: "bioignite",
    title: "BioIgnite",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/BioIgnite.png",
  },
  {
    handle: "musclerecover",
    title: "MuscleRecover",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Muscle Recovery final.png",
  },
  {
    handle: "hydrareload",
    title: "HydraReload",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/HydraReload_final.png",
  },
  {
    handle: "womens-vitalprime",
    title: "Women's VitalPrime",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Vital Prime Final.png",
  },
  {
    handle: "nitricflow",
    title: "NitricFlow",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Nitric Flow Final.png",
  },
  {
    handle: "mens-vitalprime",
    title: "Men's VitalPrime",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Vital Prime.png",
  },
  {
    handle: "biocollagen",
    title: "BioCollagen",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Bio Collagen.png",
  },
  {
    handle: "nitric-roots",
    title: "Nitric Roots",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Nitric Roots.png",
  },
  {
    handle: "mindsync",
    title: "MindSync",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Mind Sync Final.png",
  },
  {
    handle: "magbalance",
    title: "MagBalance",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Mag Balance.png",
  },
  {
    handle: "digestive-enzyme",
    title: "Digestive Enzyme",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Bio Digest.png",
  },
  {
    handle: "natural-pct",
    title: "Natural PCT",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/natural PCT.png",
  },
  {
    handle: "ultra-test",
    title: "Ultra Test",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Andro Core.png",
  },
  {
    handle: "energized-aminos",
    title: "Energized Aminos",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Amino boost.png",
  },
  {
    handle: "adrenal-support-plus",
    title: "Adrenal Support Plus",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Stress Adapt.png",
  },
  {
    handle: "joint-flex",
    title: "Joint Flex",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Flex Motion.png",
  },
  {
    handle: "vitamin-k2-d3",
    title: "Vitamin K2 + D3",
    sourcePath: "/Users/pieyush/Downloads/Rocktomic SKU Thumbnail Images/Bone Vital.png",
  },
];

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const force = args.has("--force");
const handleIndex = process.argv.indexOf("--handle");
const requestedHandle = handleIndex >= 0 ? process.argv[handleIndex + 1] : null;

const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";

if (!shopDomain || !accessToken) {
  throw new Error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
}

const endpoint = `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`;
const tempDirectory = path.join(os.tmpdir(), "bioaro-rocktomic-product-media");
mkdirSync(tempDirectory, { recursive: true });

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
          title
          status
          media(first: 20) {
            nodes {
              ... on MediaImage {
                id
                alt
                mediaContentType
                status
                image { url altText }
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

function toPng(sourcePath, handle) {
  const outputPath = path.join(tempDirectory, `${handle}.png`);
  execFileSync("sips", ["-s", "format", "png", sourcePath, "--out", outputPath], { stdio: "pipe" });
  return outputPath;
}

function mimeType(filePath) {
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  throw new Error(`Unsupported media file type for ${filePath}`);
}

async function stagedUpload(filePath, altText) {
  const filename = path.basename(filePath);
  const mime = mimeType(filePath);
  const staged = assertNoUserErrors(
    await graphql(
      `mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets { url resourceUrl parameters { name value } }
          userErrors { field message }
        }
      }`,
      {
        input: [{ filename, mimeType: mime, resource: "FILE", httpMethod: "POST" }],
      },
    ),
    "stagedUploadsCreate",
  ).stagedTargets[0];

  const form = new FormData();
  for (const parameter of staged.parameters) {
    form.append(parameter.name, parameter.value);
  }
  form.append("file", new Blob([readFileSync(filePath)], { type: mime }), filename);
  const upload = await fetch(staged.url, { method: "POST", body: form });
  if (!upload.ok) {
    throw new Error(`Failed uploading ${filename}: ${upload.status}`);
  }
  return { originalSource: staged.resourceUrl, alt: altText };
}

async function attachMedia(productId, mediaInput) {
  const result = await graphql(
    `mutation ProductCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media {
          ... on MediaImage {
            id
            alt
            status
            image { url altText }
          }
        }
        mediaUserErrors { field message }
        product { id title }
      }
    }`,
    {
      productId,
      media: [{ ...mediaInput, mediaContentType: "IMAGE" }],
    },
  );
  return assertNoUserErrors(result, "productCreateMedia");
}

async function main() {
  const candidates = requestedHandle
    ? PRODUCTS.filter((product) => product.handle === requestedHandle)
    : PRODUCTS;

  if (!candidates.length) {
    throw new Error(`Unknown handle: ${requestedHandle}`);
  }

  const results = [];

  for (const product of candidates) {
    const existing = await productByHandle(product.handle);
    if (!existing) {
      throw new Error(`Product ${product.handle} does not exist in Shopify.`);
    }

    const altText = `${product.title} product image`;
    const matchingMedia = existing.media.nodes.find((node) => node?.alt === altText);
    if (matchingMedia && !force) {
      results.push({
        handle: product.handle,
        action: "skipped_existing_media",
        mediaCount: existing.media.nodes.length,
      });
      continue;
    }

    const pngPath = toPng(product.sourcePath, product.handle);
    const uploaded = await stagedUpload(pngPath, altText);

    if (!apply) {
      results.push({
        handle: product.handle,
        action: "would_attach_media",
        sourcePath: product.sourcePath,
        convertedPath: pngPath,
        existingMediaCount: existing.media.nodes.length,
      });
      continue;
    }

    const attached = await attachMedia(existing.id, uploaded);
    results.push({
      handle: product.handle,
      action: "attached_media",
      mediaCountBefore: existing.media.nodes.length,
      mediaCountAfter: existing.media.nodes.length + (attached.media?.length ?? 0),
      uploadedStatuses: attached.media?.map((node) => node.status) ?? [],
    });
  }

  console.log(JSON.stringify({
    shopDomain,
    apiVersion,
    apply,
    force,
    requestedHandle,
    results,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
