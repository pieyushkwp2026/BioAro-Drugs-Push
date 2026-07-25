#!/usr/bin/env node

/**
 * Generates the review package for a future Shopify import.
 *
 * This script only reads reports produced by the frozen-source dry run. It never
 * receives credentials, calls Shopify, uploads files, or writes Shopify content.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const SOURCE_COMMIT = "2191f22d39e952c35d0df543336496bd28b388c9";
const args = process.argv.slice(2);
const reportDirectory = path.resolve(process.cwd(), valueFor("--report-dir") ?? path.join("migration-reports", SOURCE_COMMIT.slice(0, 7)));
const approvedExistingProductUpdates = args.includes("--approve-existing-product-updates");
const approvedExistingProductReplacement = args.includes("--replace-existing-source-handles");

function valueFor(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function readJson(filename) {
  const filepath = path.join(reportDirectory, filename);
  if (!existsSync(filepath)) throw new Error(`Missing ${filename}. Run shopify:catalogue:dry-run before generating the import preview.`);
  return JSON.parse(readFileSync(filepath, "utf8"));
}

function writeJson(filename, value) {
  writeFileSync(path.join(reportDirectory, filename), `${JSON.stringify(value, null, 2)}\n`);
}

function fieldDefinitionMap(dryRunPlan) {
  const definitions = dryRunPlan.shopifyInspection?.data?.metafieldDefinitions?.nodes ?? [];
  return new Map(definitions.map((definition) => [`${definition.namespace}.${definition.key}`, definition.type.name]));
}

function mappingStatus(mapping, definitions) {
  const existingType = definitions.get(mapping.target);
  if (!existingType) {
    return { status: "BLOCKED_NO_EXISTING_DEFINITION", existingType: null };
  }
  if (existingType !== mapping.expectedShopifyType) {
    return { status: "BLOCKED_TYPE_MISMATCH", existingType };
  }
  if (mapping.source === "ingredients") {
    return {
      status: "BLOCKED_RICH_INGREDIENTS_NEED_REFERENCE_FIELD",
      existingType,
      reason: "The current text field can preserve ingredient names only. It cannot retain ingredient doses, purposes, why-included copy, or ingredient images.",
    };
  }
  return { status: "READY_AFTER_PRODUCT_APPROVAL", existingType };
}

function productAction(record, exactMatches, shopifyAudited) {
  if (!shopifyAudited) {
    return {
      action: "BLOCKED_AWAITING_READ_ONLY_SHOPIFY_AUDIT",
      productId: null,
      currentStatus: null,
      reason: "A current read-only Shopify handle audit is required before deciding whether this product is a DRAFT creation or an existing-product update.",
    };
  }
  const match = exactMatches.get(record.product.handle);
  return match
    ? {
      action: approvedExistingProductReplacement
        ? "REPLACE_EXISTING_TEST_PRODUCT_WITH_DRAFT_AFTER_SNAPSHOT"
        : approvedExistingProductUpdates
          ? "UPDATE_AFTER_APPROVED_BEFORE_AFTER_SNAPSHOT"
        : "UPDATE_BLOCKED_REQUIRES_BEFORE_AFTER_APPROVAL",
      productId: match.id,
      currentStatus: match.status,
      reason: approvedExistingProductReplacement
        ? "Exact Shopify handle match is approved as test data replacement. The live importer must first save a complete audit snapshot, then delete only this exact product ID and create the frozen-source product as DRAFT."
        : approvedExistingProductUpdates
        ? "Exact Shopify handle match. Before mutation, the importer must save the current Shopify product, media, and mapped metafields to an audit file; it may then update only fields mapped from the frozen source snapshot."
        : "Exact Shopify handle match. No active product is changed until the generated before/after preview is approved.",
    }
    : {
      action: "CREATE_DRAFT_AFTER_APPROVAL",
      productId: null,
      currentStatus: null,
      reason: "No exact Shopify handle match. The future importer may create this source product only as DRAFT after approval.",
    };
}

function assetAction(asset) {
  if (asset.role === "primary_media" || asset.role === "gallery_media") {
    return {
      ...asset,
      proposedAction: "UPLOAD_AND_ATTACH_AS_PRODUCT_MEDIA_AFTER_APPROVAL",
      approvalBlocker: null,
    };
  }
  return {
    ...asset,
    proposedAction: "UPLOAD_TO_SHOPIFY_FILES_AFTER_APPROVAL",
    approvalBlocker: "A compatible product reference field is required before this image can be connected to a PDP panel without losing its product-specific meaning.",
  };
}

function main() {
  const manifest = readJson("migration-manifest.json");
  const dryRunPlan = readJson("dry-run-plan.json");
  if (manifest.sourceCommit !== SOURCE_COMMIT || dryRunPlan.sourceCommit !== SOURCE_COMMIT) {
    throw new Error(`Import preview must use frozen source ${SOURCE_COMMIT}.`);
  }

  const exactMatches = new Map((dryRunPlan.shopifyCatalogue?.exactHandleMatches ?? []).map((match) => [match.handle, match]));
  const shopifyAudited = dryRunPlan.shopifyInspection?.completed === true;
  const definitions = fieldDefinitionMap(dryRunPlan);
  const products = manifest.products.map((record) => {
    const mappings = record.proposedMappings.map((mapping) => ({ ...mapping, ...mappingStatus(mapping, definitions) }));
    return {
      handle: record.product.handle,
      title: record.product.title,
      source: record.source,
      productAction: productAction(record, exactMatches, shopifyAudited),
      coreFields: {
        title: record.product.title,
        handle: record.product.handle,
        description: record.product.description,
        category: record.product.category,
        targetStatus: "DRAFT",
      },
      fieldMappings: mappings,
      assetActions: record.assets.map(assetAction),
      unresolvedCommercialData: record.product.missingCommercialData,
    };
  });

  const blockers = products.flatMap((product) => [
    ...product.fieldMappings
      .filter((field) => field.status.startsWith("BLOCKED"))
      .map((field) => ({ handle: product.handle, kind: "field", source: field.source, target: field.target, status: field.status, detail: field.reason ?? null })),
    ...product.assetActions
      .filter((asset) => asset.approvalBlocker)
      .map((asset) => ({ handle: product.handle, kind: "asset", source: asset.path, target: asset.proposedShopifyTarget, status: "BLOCKED_REFERENCE_FIELD_DECISION", detail: asset.approvalBlocker })),
    ...product.unresolvedCommercialData.map((field) => ({ handle: product.handle, kind: "commercial", source: field, target: null, status: "BLOCKED_SOURCE_DATA_MISSING", detail: "Must be supplied or configured in Shopify; the migration will not guess it." })),
  ]);

  const scopeRequirements = {
    sourceCommit: SOURCE_COMMIT,
    currentPhase: "PREVIEW_ONLY_NO_SHOPIFY_MUTATIONS",
    requiredForApprovedCoreProductsAndExistingMetafields: ["write_products"],
    requiredForApprovedProductAndPanelImages: ["write_files"],
    alreadyAvailableForOptionalReuseOfExistingIngredientMetaobjects: ["write_metaobjects"],
    notRequiredUnlessYouExplicitlyApproveNewSchemaDefinitions: ["write_metaobject_definitions"],
    explicitlyNotRequiredForThisMigration: ["write_publications", "write_orders", "write_customers"],
    rule: "No credential is read by this preview generator, and no scope is used until the user approves the generated before/after plan.",
  };

  const summary = {
    sourceCommit: SOURCE_COMMIT,
    mode: "LOCAL_PREVIEW_ONLY",
    approvedExistingProductUpdates,
    approvedExistingProductReplacement,
    shopifyReadAuditCompleted: shopifyAudited,
    sourceProductCount: products.length,
    createDraftCount: products.filter((product) => product.productAction.action === "CREATE_DRAFT_AFTER_APPROVAL").length,
    exactMatchUpdateCount: products.filter((product) => product.productAction.action.startsWith("UPDATE_")).length,
    exactMatchReplacementCount: products.filter((product) => product.productAction.action === "REPLACE_EXISTING_TEST_PRODUCT_WITH_DRAFT_AFTER_SNAPSHOT").length,
    awaitingShopifyAuditCount: products.filter((product) => product.productAction.action === "BLOCKED_AWAITING_READ_ONLY_SHOPIFY_AUDIT").length,
    readyFieldWriteCount: products.flatMap((product) => product.fieldMappings).filter((field) => field.status === "READY_AFTER_PRODUCT_APPROVAL").length,
    blockedItemCount: blockers.length,
    shopifyMutationsPerformed: 0,
  };

  writeJson("import-preview.json", { summary, products });
  writeJson("import-blockers.json", { sourceCommit: SOURCE_COMMIT, blockers });
  writeJson("write-scope-requirements.json", scopeRequirements);

  console.log(`Import preview complete for ${summary.sourceProductCount} products.`);
  console.log(`Creates pending approval: ${summary.createDraftCount}; existing-product updates in this preview: ${summary.exactMatchUpdateCount}; approved test-product replacements: ${summary.exactMatchReplacementCount}.`);
  console.log(`Shopify mutations performed: 0`);
}

main();
