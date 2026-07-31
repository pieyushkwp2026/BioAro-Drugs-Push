#!/usr/bin/env node

/**
 * Applies the explicitly approved DRAFT-only catalogue migration.
 *
 * The frozen source commit is the only content source. This importer refuses
 * to run without the replacement acknowledgement and writes an audit snapshot
 * before deleting the known incorrect LONgevity+ Shopify product.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const SOURCE_COMMIT = "2191f22d39e952c35d0df543336496bd28b388c9";
const args = new Set(process.argv.slice(2));
const rawArgs = process.argv.slice(2);
const root = process.cwd();
const reportDirectory = path.join(root, "migration-reports", SOURCE_COMMIT.slice(0, 7));
const auditDirectory = path.join(reportDirectory, "live-audit");
const apply = args.has("--apply");
const replaceExisting = args.has("--replace-existing-source-handles");
const resumeDrafts = args.has("--resume-drafts");
const handleIndex = rawArgs.indexOf("--handle");
const requestedHandle = handleIndex >= 0 ? rawArgs[handleIndex + 1] : null;

if (!apply || !replaceExisting) {
  throw new Error("Refusing live mutation. Use --apply --replace-existing-source-handles only after approving the DRAFT-only replacement plan.");
}

const domain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
if (!domain || !token) throw new Error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");

const endpoint = `https://${domain}/admin/api/${process.env.SHOPIFY_ADMIN_API_VERSION ?? "2025-10"}/graphql.json`;
const manifest = JSON.parse(readFileSync(path.join(reportDirectory, "migration-manifest.json"), "utf8"));
if (manifest.sourceCommit !== SOURCE_COMMIT || manifest.products.length !== 7) throw new Error("Manifest must contain exactly seven products from the frozen source commit.");

function gitFile(file) {
  // Source images exceed Node's small default child-process buffer.
  return execFileSync("git", ["show", `${SOURCE_COMMIT}:${file}`], { cwd: root, encoding: null, maxBuffer: 64 * 1024 * 1024 });
}

function writeAudit(name, value) {
  mkdirSync(auditDirectory, { recursive: true });
  writeFileSync(path.join(auditDirectory, name), `${JSON.stringify(value, null, 2)}\n`);
}

async function graphql(query, variables = {}) {
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

async function stagedUpload(file, alt) {
  const filename = path.basename(file);
  const data = gitFile(file);
  const staged = assertNoUserErrors(await graphql(`mutation Staged($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) { stagedTargets { url resourceUrl parameters { name value } } userErrors { field message } }
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
    fileCreate(files: $files) { files { id fileStatus alt } userErrors { field message } }
  }`, { files: [{ originalSource: staged.source, contentType: "IMAGE", alt: staged.alt }] }), "fileCreate");
  const id = result.files[0]?.id;
  if (!id) throw new Error(`Shopify did not return a file id for ${file}`);
  return id;
}

async function ensureDefinition(namespace, key, name, type, validation = undefined) {
  const current = await graphql(`query Definitions {
    metafieldDefinitions(first: 250, ownerType: PRODUCT) { nodes { id namespace key type { name } } }
  }`);
  const existing = current.metafieldDefinitions.nodes.find((definition) => definition.namespace === namespace && definition.key === key);
  if (existing) {
    if (existing.type.name !== type) throw new Error(`${namespace}.${key} exists with incompatible type ${existing.type.name}.`);
    return existing.id;
  }
  const definition = { namespace, key, name, ownerType: "PRODUCT", type };
  if (validation) definition.validations = [validation];
  return assertNoUserErrors(await graphql(`mutation CreateDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) { createdDefinition { id } userErrors { field message } }
  }`, { definition }), "metafieldDefinitionCreate").createdDefinition.id;
}

async function productByHandle(handle) {
  const result = await graphql(`query Product($query: String!) {
    products(first: 2, query: $query) { nodes { id title handle status descriptionHtml media(first: 100) { nodes { id alt mediaContentType } } metafields(first: 250) { nodes { id namespace key type value } } } }
  }`, { query: `handle:${handle}` });
  return result.products.nodes.find((product) => product.handle === handle) ?? null;
}

async function deleteExistingTestProduct(product) {
  if (!product) return;
  writeAudit(`before-delete-${product.handle}.json`, product);
  assertNoUserErrors(await graphql(`mutation DeleteProduct($input: ProductDeleteInput!) {
    productDelete(input: $input) { deletedProductId userErrors { field message } }
  }`, { input: { id: product.id } }), "productDelete");
}

function text(value) {
  if (Array.isArray(value)) return value.join("\n");
  return value ?? "";
}

function scalarMetafields(record) {
  const pdp = record.pdp;
  const values = [
    ["pdp_subtitle", pdp.tagline, "single_line_text_field"],
    ["short_description", record.product.description, "multi_line_text_field"],
    // These existing Shopify definitions are single-line strings. The
    // storefront parser supports semicolon-separated lists for both fields.
    ["hero_tags", pdp.tags.join("; "), "single_line_text_field"],
    ["hero_bullets", pdp.benefits.join("; "), "single_line_text_field"],
    ["supply_label", pdp.supplyLabel, "single_line_text_field"],
    ["serving_size", pdp.servings, "single_line_text_field"],
    ["directions", pdp.dosage, "multi_line_text_field"],
    ["warnings", text(pdp.warnings), "multi_line_text_field"],
    ["why_formula_body", pdp.bestFor, "multi_line_text_field"],
    ["ingredients", pdp.ingredients.map((item) => item.name).join(", "), "single_line_text_field"],
    ["benefit_cards", JSON.stringify(pdp.whyItems), "json"],
    ["trust_badges", JSON.stringify(pdp.trustNotes.map((item) => ({ title: item }))), "json"],
    ["science_steps", JSON.stringify(pdp.science), "json"],
    ["supplement_facts_rows", JSON.stringify(pdp.supplementFacts), "json"],
    ["clinical_evidence", JSON.stringify(pdp.evidencePoints.map((item) => ({ title: item }))), "json"],
    ["comparison_rows", JSON.stringify(pdp.comparisonRows), "json"],
    ["faqs", JSON.stringify(pdp.faq), "json"],
  ];
  return values.filter(([, value]) => value).map(([key, value, type]) => ({ namespace: "custom", key, value, type }));
}

async function createIngredient(record, ingredient, imageId) {
  const fields = [
    { key: "name", value: ingredient.name },
    { key: "amount", value: ingredient.amount },
    { key: "purpose", value: ingredient.purpose },
    { key: "why_included", value: ingredient.whyIncluded },
    ...(imageId ? [{ key: "image", value: imageId }] : []),
  ];
  return assertNoUserErrors(await graphql(`mutation Ingredient($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) { metaobject { id } userErrors { field message } }
  }`, { metaobject: { type: "ingredient", fields } }), "metaobjectCreate").metaobject.id;
}

async function createProduct(record, galleryUploads) {
  const product = assertNoUserErrors(await graphql(`mutation ProductCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
    productCreate(product: $product, media: $media) { product { id handle status } userErrors { field message } }
  }`, {
    product: { title: record.product.title, handle: record.product.handle, descriptionHtml: record.product.description, status: "DRAFT" },
    media: galleryUploads.map((image) => ({ originalSource: image.source, alt: image.alt, mediaContentType: "IMAGE" })),
  }), "productCreate").product;
  if (!product) throw new Error(`Shopify did not create ${record.product.handle}`);
  return product;
}

async function migrateProduct(record) {
  const existing = await productByHandle(record.product.handle);
  let product = null;
  let galleryUploads = [];
  if (existing) {
    if (record.product.handle === "longevity-plus") {
      await deleteExistingTestProduct(existing);
    } else if (!resumeDrafts || existing.status !== "DRAFT" || existing.title !== record.product.title) {
      throw new Error(`Refusing to replace unexpected existing Shopify product: ${record.product.handle}`);
    } else {
      // A previous run created this exact DRAFT and attached its gallery. Resume
      // only its incomplete structured PDP content without duplicating media.
      product = existing;
    }
  }

  if (!product) {
    const gallery = record.assets.filter((asset) => asset.role === "primary_media" || asset.role === "gallery_media");
    for (const asset of gallery) galleryUploads.push(await stagedUpload(asset.path, asset.alt));
    product = await createProduct(record, galleryUploads);
  }

  const ingredientIds = [];
  for (const ingredient of record.pdp.ingredients) {
    const imageId = ingredient.image ? await uploadFile(ingredient.image, ingredient.name) : null;
    ingredientIds.push(await createIngredient(record, ingredient, imageId));
  }
  const scienceAsset = record.assets.find((asset) => asset.role === "science_visual");
  const scienceImageId = scienceAsset ? await uploadFile(scienceAsset.path, scienceAsset.alt) : null;
  const metafields = [
    ...scalarMetafields(record),
    { namespace: "custom", key: "ingredient_details", type: "list.metaobject_reference", value: JSON.stringify(ingredientIds) },
    ...(scienceImageId ? [{ namespace: "custom", key: "science_visual", type: "file_reference", value: scienceImageId }] : []),
  ];
  const updated = assertNoUserErrors(await graphql(`mutation ProductUpdate($product: ProductUpdateInput!) {
    productUpdate(product: $product) { product { id handle status } userErrors { field message } }
  }`, { product: { id: product.id, metafields } }), "productUpdate").product;
  writeAudit(`after-create-${record.product.handle}.json`, updated);
  return { handle: record.product.handle, productId: product.id, status: updated.status, ingredientCount: ingredientIds.length, mediaCount: galleryUploads.length || existing?.media.length || 0 };
}

async function main() {
  const existingIngredientDefinition = await graphql(`query IngredientDefinition { metaobjectDefinitionByType(type: "ingredient") { id } }`);
  const ingredientDefinitionId = existingIngredientDefinition.metaobjectDefinitionByType?.id;
  if (!ingredientDefinitionId) throw new Error("The approved ingredient metaobject definition is missing.");
  await ensureDefinition("custom", "ingredient_details", "Ingredient details", "list.metaobject_reference", { name: "metaobject_definition_id", value: ingredientDefinitionId });
  await ensureDefinition("custom", "science_visual", "Science visual", "file_reference");

  writeAudit("import-start.json", { sourceCommit: SOURCE_COMMIT, products: manifest.products.map((record) => record.product.handle), mode: "REPLACE_TEST_RECORD_AND_CREATE_DRAFTS" });
  // Prove the DRAFT creation flow with the six missing products first. The one
  // destructive replacement is deliberately last, after those writes succeed.
  const orderedProducts = [...manifest.products].sort((left, right) => {
    if (left.product.handle === "longevity-plus") return 1;
    if (right.product.handle === "longevity-plus") return -1;
    return left.product.handle.localeCompare(right.product.handle);
  });
  const selectedProducts = requestedHandle
    ? orderedProducts.filter((record) => record.product.handle === requestedHandle)
    : orderedProducts;
  if (!selectedProducts.length) throw new Error(`Unknown source handle: ${requestedHandle}`);
  const results = [];
  for (const record of selectedProducts) results.push(await migrateProduct(record));
  writeAudit("import-complete.json", { sourceCommit: SOURCE_COMMIT, results });
  console.log(JSON.stringify({ sourceCommit: SOURCE_COMMIT, results }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
