#!/usr/bin/env node

/**
 * Enriches existing exact-handle Shopify products with rich ingredient cards.
 *
 * Source of truth is the frozen storefront commit. This script only writes the
 * product-level custom.ingredient_details metafield and the supporting
 * ingredient metaobjects/files needed by that one field.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const SOURCE_COMMIT = "2191f22d39e952c35d0df543336496bd28b388c9";
const REPORT_KEY = SOURCE_COMMIT.slice(0, 7);
const root = process.cwd();
const reportDirectory = path.join(root, "migration-reports", REPORT_KEY);
const auditDirectory = path.join(reportDirectory, "live-audit");
const manifestPath = path.join(reportDirectory, "migration-manifest.json");
const args = new Set(process.argv.slice(2));
const rawArgs = process.argv.slice(2);
const apply = args.has("--apply");
const replace = args.has("--replace-existing");
const handleIndex = rawArgs.indexOf("--handle");
const requestedHandle = handleIndex >= 0 ? rawArgs[handleIndex + 1] : null;

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
if (manifest.sourceCommit !== SOURCE_COMMIT) {
  throw new Error(`Manifest source mismatch. Expected ${SOURCE_COMMIT}.`);
}
if (!Array.isArray(manifest.products) || manifest.products.length !== 7) {
  throw new Error("Frozen source manifest must contain exactly seven products.");
}

const domain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
const endpoint = domain
  ? `https://${domain}/admin/api/${process.env.SHOPIFY_ADMIN_API_VERSION ?? "2025-10"}/graphql.json`
  : "";

function selectedRecords() {
  const records = requestedHandle
    ? manifest.products.filter((record) => record.product.handle === requestedHandle)
    : manifest.products;
  if (!records.length) throw new Error(`Unknown source handle: ${requestedHandle}`);
  return records;
}

function gitFile(file) {
  return execFileSync("git", ["show", `${SOURCE_COMMIT}:${file}`], {
    cwd: root,
    encoding: null,
    maxBuffer: 64 * 1024 * 1024,
  });
}

function gitPathExists(file) {
  try {
    execFileSync("git", ["cat-file", "-e", `${SOURCE_COMMIT}:${file}`], { cwd: root });
    return true;
  } catch {
    return false;
  }
}

function writeAudit(name, value) {
  mkdirSync(auditDirectory, { recursive: true });
  writeFileSync(path.join(auditDirectory, name), `${JSON.stringify(value, null, 2)}\n`);
}

async function graphql(query, variables = {}) {
  if (!domain || !token) throw new Error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required for --apply.");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors) throw new Error(JSON.stringify(payload.errors ?? payload));
  return payload.data;
}

function assertNoUserErrors(result, key) {
  const errors = result[key]?.userErrors ?? [];
  if (errors.length) throw new Error(`${key}: ${errors.map((error) => error.message).join("; ")}`);
  return result[key];
}

function mimeType(file) {
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  throw new Error(`Unsupported image type: ${file}`);
}

function fieldValue(fields, key) {
  return fields.find((field) => field.key === key)?.value?.trim() ?? "";
}

async function productByHandle(handle) {
  const data = await graphql(`query ProductByHandle($query: String!) {
    products(first: 2, query: $query) {
      nodes {
        id
        handle
        title
        status
        metafield(namespace: "custom", key: "ingredient_details") {
          id
          type
          value
          references(first: 50) {
            nodes {
              ... on Metaobject {
                id
                fields {
                  key
                  value
                  reference {
                    ... on MediaImage {
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`, { query: `handle:${handle}` });
  return data.products.nodes.find((product) => product.handle === handle) ?? null;
}

async function verifySchema() {
  const data = await graphql(`query IngredientSchema {
    metaobjectDefinitionByType(type: "ingredient") {
      id
      fieldDefinitions {
        key
        type { name }
      }
    }
    metafieldDefinitions(first: 250, ownerType: PRODUCT) {
      nodes {
        id
        namespace
        key
        type { name }
      }
    }
  }`);

  const ingredientDefinition = data.metaobjectDefinitionByType;
  if (!ingredientDefinition) throw new Error("Missing Shopify metaobject definition: ingredient.");
  const ingredientFields = new Map(ingredientDefinition.fieldDefinitions.map((field) => [field.key, field.type.name]));
  for (const [key, type] of [
    ["name", "single_line_text_field"],
    ["amount", "single_line_text_field"],
    ["purpose", "multi_line_text_field"],
    ["why_included", "multi_line_text_field"],
    ["image", "file_reference"],
  ]) {
    if (ingredientFields.get(key) !== type) throw new Error(`ingredient.${key} is missing or incompatible.`);
  }

  const ingredientDetails = data.metafieldDefinitions.nodes.find(
    (definition) => definition.namespace === "custom" && definition.key === "ingredient_details",
  );
  if (ingredientDetails?.type.name !== "list.metaobject_reference") {
    throw new Error("Missing or incompatible product metafield definition: custom.ingredient_details.");
  }
}

async function stagedUpload(file, alt) {
  const filename = path.basename(file);
  const data = gitFile(file);
  const staged = assertNoUserErrors(await graphql(`mutation Staged($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { field message }
    }
  }`, {
    input: [{ filename, mimeType: mimeType(file), resource: "FILE", httpMethod: "POST" }],
  }), "stagedUploadsCreate").stagedTargets[0];

  const form = new FormData();
  for (const parameter of staged.parameters) form.append(parameter.name, parameter.value);
  form.append("file", new Blob([data], { type: mimeType(file) }), filename);
  const upload = await fetch(staged.url, { method: "POST", body: form });
  if (!upload.ok) throw new Error(`Failed uploading ${file}: ${upload.status}`);
  return { source: staged.resourceUrl, alt: alt ?? filename };
}

async function uploadFile(file, alt) {
  const staged = await stagedUpload(file, alt);
  const result = assertNoUserErrors(await graphql(`mutation FileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files { id fileStatus alt }
      userErrors { field message }
    }
  }`, { files: [{ originalSource: staged.source, contentType: "IMAGE", alt: staged.alt }] }), "fileCreate");
  const id = result.files[0]?.id;
  if (!id) throw new Error(`Shopify did not return a file id for ${file}`);
  return id;
}

async function createIngredient(ingredient, imageId) {
  const fields = [
    { key: "name", value: ingredient.name },
    { key: "amount", value: ingredient.amount ?? "" },
    { key: "purpose", value: ingredient.purpose ?? "" },
    { key: "why_included", value: ingredient.whyIncluded ?? "" },
    ...(imageId ? [{ key: "image", value: imageId }] : []),
  ];
  const result = assertNoUserErrors(await graphql(`mutation CreateIngredient($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject { id }
      userErrors { field message }
    }
  }`, { metaobject: { type: "ingredient", fields } }), "metaobjectCreate");
  return result.metaobject.id;
}

async function setIngredientDetails(productId, ingredientIds) {
  const result = assertNoUserErrors(await graphql(`mutation SetIngredientDetails($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { id namespace key type value }
      userErrors { field message code }
    }
  }`, {
    metafields: [{
      ownerId: productId,
      namespace: "custom",
      key: "ingredient_details",
      type: "list.metaobject_reference",
      value: JSON.stringify(ingredientIds),
    }],
  }), "metafieldsSet");
  return result.metafields[0];
}

function existingRichIngredientCount(product) {
  const nodes = product.metafield?.references?.nodes ?? [];
  return nodes.filter((node) => {
    const fields = node.fields ?? [];
    return fieldValue(fields, "name") && fields.find((field) => field.key === "image")?.reference?.image?.url;
  }).length;
}

async function enrichProduct(record) {
  const product = await productByHandle(record.product.handle);
  if (!product) {
    return { handle: record.product.handle, status: "missing_product", wrote: false };
  }

  const existingCount = existingRichIngredientCount(product);
  if (existingCount && !replace) {
    return {
      handle: record.product.handle,
      productId: product.id,
      status: "skipped_existing_rich_ingredients",
      existingCount,
      sourceCount: record.pdp.ingredients.length,
      wrote: false,
    };
  }

  const ingredientIds = [];
  for (const ingredient of record.pdp.ingredients) {
    const imageId = ingredient.image ? await uploadFile(ingredient.image, ingredient.name) : null;
    ingredientIds.push(await createIngredient(ingredient, imageId));
  }
  const metafield = await setIngredientDetails(product.id, ingredientIds);
  return {
    handle: record.product.handle,
    productId: product.id,
    productStatus: product.status,
    sourceCount: record.pdp.ingredients.length,
    ingredientMetaobjectIds: ingredientIds,
    metafieldId: metafield.id,
    wrote: true,
  };
}

async function dryRun() {
  const products = selectedRecords().map((record) => ({
    handle: record.product.handle,
    sourceIngredientCount: record.pdp.ingredients.length,
    imagePaths: record.pdp.ingredients.map((ingredient) => ({
      name: ingredient.name,
      image: ingredient.image,
      existsAtSourceCommit: ingredient.image ? gitPathExists(ingredient.image) : false,
    })),
    proposedWrite: "custom.ingredient_details only",
  }));
  const missingAssets = products.flatMap((product) => product.imagePaths.filter((image) => !image.existsAtSourceCommit));
  const report = { mode: "dry-run", sourceCommit: SOURCE_COMMIT, products, missingAssets };
  writeAudit("ingredient-details-dry-run.json", report);
  console.log(JSON.stringify(report, null, 2));
}

async function main() {
  if (!apply) {
    await dryRun();
    return;
  }

  await verifySchema();
  const results = [];
  for (const record of selectedRecords()) {
    results.push(await enrichProduct(record));
  }
  const report = { mode: replace ? "apply_replace_existing" : "apply_missing_only", sourceCommit: SOURCE_COMMIT, results };
  writeAudit(`ingredient-details-apply-${Date.now()}.json`, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
