#!/usr/bin/env node

/**
 * Read-only Shopify catalogue migration planner.
 *
 * The planner reads a frozen Git commit directly. It never scrapes a local
 * browser preview and it never sends a Shopify mutation.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const DEFAULT_SOURCE_COMMIT = "5b47d18de0df3827975398c8dccc83058e05d3b9";
const TOOL_ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const sourceCommit = valueFor("--source") ?? DEFAULT_SOURCE_COMMIT;
const sourceRoot = resolveSourceRoot();
const outputDirectory = valueFor("--output") ?? path.join("migration-reports", sourceCommit.slice(0, 7));
const inspectShopify = args.has("--shopify");

function valueFor(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function resolveSourceRoot() {
  const explicit = valueFor("--source-root");
  if (explicit) return path.resolve(TOOL_ROOT, explicit);

  const candidates = [
    TOOL_ROOT,
    path.resolve(TOOL_ROOT, "..", "bioaro-drugs-latest"),
  ];

  for (const candidate of candidates) {
    try {
      execFileSync("git", ["cat-file", "-e", sourceCommit], { cwd: candidate, stdio: "ignore" });
      return candidate;
    } catch {
      // Try the next candidate.
    }
  }

  return TOOL_ROOT;
}

function git(...args) {
  return execFileSync("git", args, { cwd: sourceRoot, encoding: "utf8" }).trimEnd();
}

function gitFile(commit, file) {
  return git("show", `${commit}:${file}`);
}

function gitPathExists(commit, file) {
  try {
    git("cat-file", "-e", `${commit}:${file}`);
    return true;
  } catch {
    return false;
  }
}

function normalizedRepositoryPath(fromFile, importPath) {
  return path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), importPath));
}

function collectImports(sourceFile, filePath) {
  const imports = new Map();
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const binding = statement.importClause.name;
    if (binding) imports.set(binding.text, normalizedRepositoryPath(filePath, statement.moduleSpecifier.text));
  }
  return imports;
}

function evaluate(expression, imports) {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text;
  if (ts.isNumericLiteral(expression)) return Number(expression.text);
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (expression.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isParenthesizedExpression(expression) || ts.isAsExpression(expression) || ts.isTypeAssertionExpression(expression)) {
    return evaluate(expression.expression, imports);
  }
  if (ts.isIdentifier(expression)) return imports.get(expression.text) ?? `__unresolved_identifier__:${expression.text}`;
  if (ts.isArrayLiteralExpression(expression)) return expression.elements.map((item) => evaluate(item, imports));
  if (ts.isObjectLiteralExpression(expression)) {
    const output = {};
    for (const property of expression.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : undefined;
      if (key) output[key] = evaluate(property.initializer, imports);
    }
    return output;
  }
  return `__unsupported_expression__:${ts.SyntaxKind[expression.kind]}`;
}

function findVariableInitializer(source, name) {
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer) return declaration.initializer;
    }
  }
  throw new Error(`Could not find ${name} in frozen source.`);
}

function sourceObject(commit, filePath, variableName) {
  const source = ts.createSourceFile(filePath, gitFile(commit, filePath), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  return evaluate(findVariableInitializer(source, variableName), collectImports(source, filePath));
}

function sourceProducts(commit) {
  const products = sourceObject(commit, "src/data/products.ts", "PREVIEW_PRODUCTS");
  if (!Array.isArray(products) || products.length !== 7) throw new Error("Frozen source must contain exactly seven products.");
  return products;
}

function sourceGallery(commit) {
  return sourceObject(commit, "src/pages/Product.tsx", "PRODUCT_GALLERIES");
}

function sourceScienceVisuals(commit) {
  return sourceObject(commit, "src/data/scienceVisuals.ts", "SCIENCE_VISUALS");
}

function toAsset(assetPath, role, alt = undefined) {
  if (typeof assetPath !== "string" || !assetPath.startsWith("src/assets/")) return undefined;
  return {
    role,
    path: assetPath,
    alt: alt ?? null,
    existsAtSourceCommit: gitPathExists(sourceCommit, assetPath),
    proposedShopifyTarget: role === "primary_media" || role === "gallery_media" ? "product media" : "Shopify Files + file reference",
  };
}

function simpleField(source, target, expectedShopifyType, transform = "direct") {
  return { source, target, expectedShopifyType, transform, mode: "use_only_if_existing_definition_is_compatible" };
}

function proposedMappings(product) {
  return [
    simpleField("tagline", "custom.pdp_subtitle", "single_line_text_field"),
    simpleField("description", "custom.short_description", "multi_line_text_field"),
    simpleField("tags", "custom.hero_tags", "single_line_text_field", "join_with_semicolon"),
    simpleField("benefits", "custom.hero_bullets", "single_line_text_field", "join_with_newline"),
    simpleField("supplyLabel", "custom.supply_label", "single_line_text_field"),
    simpleField("servings", "custom.serving_size", "single_line_text_field"),
    simpleField("dosage", "custom.directions", "multi_line_text_field"),
    simpleField("warnings", "custom.warnings", "multi_line_text_field", "join_with_newline"),
    simpleField("bestFor", "custom.why_formula_body", "multi_line_text_field"),
    simpleField("whyItems", "custom.benefit_cards", "json", "title_text_array"),
    simpleField("trustNotes", "custom.trust_badges", "json", "title_text_array"),
    simpleField("science", "custom.science_steps", "json", "title_text_array"),
    simpleField("supplementFacts", "custom.supplement_facts_rows", "json", "title_text_array"),
    simpleField("evidencePoints", "custom.clinical_evidence", "json", "title_text_array"),
    simpleField("comparisonRows", "custom.comparison_rows", "json", "comparison_row_array"),
    simpleField("faq", "custom.faqs", "json", "title_text_array"),
    simpleField("testimonials", "custom.testimonials", "json", "testimonial_array"),
    // The current product field stores only plain text. Rich ingredient data and
    // ingredient images remain approval-blocked until a compatible reference field exists.
    simpleField("ingredients", "custom.ingredients", "single_line_text_field", "names_only"),
  ].map((mapping) => ({ ...mapping, handle: product.handle }));
}

function productManifest(product, galleryByHandle, scienceByHandle) {
  const assets = [
    toAsset(product.image?.src, "primary_media", product.image?.alt),
    ...(Array.isArray(galleryByHandle[product.handle])
      ? galleryByHandle[product.handle].map((image) => toAsset(image.src, "gallery_media", image.alt))
      : []),
    ...(Array.isArray(product.ingredients)
      ? product.ingredients.map((ingredient) => toAsset(ingredient.image, "ingredient_image", ingredient.name))
      : []),
    toAsset(scienceByHandle[product.handle]?.backgroundImage, "science_visual", scienceByHandle[product.handle]?.backgroundImageAlt),
  ].filter(Boolean);

  return {
    source: { commit: sourceCommit, productData: "src/data/products.ts" },
    product: {
      handle: product.handle,
      title: product.title,
      description: product.description,
      status: "DRAFT_ON_APPROVED_LIVE_IMPORT",
      category: product.category,
      badge: product.badge ?? null,
      sku: null,
      priceByCountry: product.priceByCountry ?? {},
      missingCommercialData: ["sku", "inventory", "AED market price"],
    },
    pdp: {
      tagline: product.tagline,
      tags: product.tags,
      supplyLabel: product.supplyLabel,
      servings: product.servings,
      dosage: product.dosage,
      bestFor: product.bestFor,
      benefits: product.benefits,
      whyItems: product.whyItems,
      trustNotes: product.trustNotes,
      qualityPoints: product.qualityPoints ?? [],
      warnings: product.warnings,
      ingredients: product.ingredients,
      otherIngredients: product.otherIngredients ?? [],
      supplementFacts: product.supplementFacts,
      science: product.science,
      evidencePoints: product.evidencePoints,
      faq: product.faq,
      comparisonRows: product.comparisonRows ?? [],
    },
    assets,
    proposedMappings: proposedMappings(product),
  };
}

function schemaProposal() {
  return {
    sourceCommit,
    policy: "proposal_only_no_shopify_mutations",
    existingStorefrontIdentifiers: [
      "custom.pdp_subtitle", "custom.short_description", "custom.hero_tags", "custom.hero_bullets",
      "custom.supply_label", "custom.serving_size", "custom.directions", "custom.warnings", "custom.why_formula_body",
    ],
    proposedMetaobjects: ["ingredient", "benefit", "faq", "comparison_row", "protocol_step", "trust_point", "science_feature"],
    sharedUiAssetsKeptInCode: ["Lucide icons", "navigation icons", "shared quality symbols", "decorative UI artwork", "generic section backgrounds"],
    rule: "A future live importer may write only definitions and fields explicitly approved after this proposal is reviewed.",
  };
}

function buildCompatibility(manifest, shopifyInspection) {
  const definitions = new Map(
    shopifyInspection.completed
      ? shopifyInspection.data.metafieldDefinitions.nodes.map((definition) => [
        `${definition.namespace}.${definition.key}`,
        definition.type.name,
      ])
      : [],
  );

  return manifest.flatMap((record) => record.proposedMappings.map((mapping) => ({
    ...mapping,
    shopifyDefinitionStatus: !shopifyInspection.requested
      ? "not_queried_without_--shopify"
      : !shopifyInspection.completed
        ? "not_queried_shopify_inspection_failed"
        : !definitions.has(mapping.target)
          ? "definition_missing"
          : definitions.get(mapping.target) === mapping.expectedShopifyType
            ? "compatible_existing_definition"
            : "existing_definition_type_mismatch",
    existingShopifyType: definitions.get(mapping.target) ?? null,
    action: "skip_until_definition_is_verified_and_approved",
  })));
}

async function inspectShopifyReadOnly(handles) {
  const domain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !token) {
    return { requested: true, completed: false, reason: "SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required for optional read-only inspection." };
  }

  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2025-10";
  const endpoint = `https://${domain}/admin/api/${apiVersion}/graphql.json`;
  const query = `query ProductsForDryRun($query: String!) {
    products(first: 250, query: $query) {
      nodes {
        id handle title status
        featuredMedia { alt mediaContentType preview { image { url altText } } }
        media(first: 100) { nodes { id alt mediaContentType preview { image { url altText } } } }
        metafields(first: 250) { nodes { namespace key type value } }
      }
    }
  }`;
  const runQuery = async (document, variables = {}) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query: document, variables }),
    });
    const payload = await response.json();
    if (!response.ok || payload.errors) return { completed: false, errors: payload.errors ?? payload };
    return { completed: true, data: payload.data };
  };

  // Each query is isolated so an optional scope does not block product/schema inspection.
  const [products, metafieldDefinitions, metaobjectDefinitions, files, accessScopes] = await Promise.all([
    runQuery(query, { query: handles.map((handle) => `handle:${handle}`).join(" OR ") }),
    runQuery(`query ProductMetafieldDefinitions { metafieldDefinitions(first: 250, ownerType: PRODUCT) { nodes { namespace key name type { name category } } } }`),
    runQuery(`query MetaobjectDefinitions { metaobjectDefinitions(first: 250) { nodes { type name } } }`),
    runQuery(`query FilesForDryRun { files(first: 250) { nodes { id alt fileStatus preview { image { url altText } } } } }`),
    runQuery(`query AppScopes { currentAppInstallation { accessScopes { handle } } }`),
  ]);

  const errors = Object.entries({ products, metafieldDefinitions, metaobjectDefinitions, files, accessScopes })
    .filter(([, result]) => !result.completed)
    .map(([area, result]) => ({ area, errors: result.errors }));
  const data = {
    products: products.data?.products ?? { nodes: [] },
    metafieldDefinitions: metafieldDefinitions.data?.metafieldDefinitions ?? { nodes: [] },
    metaobjectDefinitions: metaobjectDefinitions.data?.metaobjectDefinitions ?? { nodes: [] },
    files: files.data?.files ?? { nodes: [] },
    currentAppInstallation: accessScopes.data?.currentAppInstallation ?? null,
  };
  return {
    requested: true,
    completed: products.completed,
    partial: errors.length > 0,
    reason: products.completed ? null : "Shopify product inspection failed.",
    errors,
    data,
  };
}

function shopifyCatalogueSummary(handles, shopifyInspection) {
  if (!shopifyInspection.completed) {
    return { status: "not_available", reason: shopifyInspection.reason ?? "Shopify inspection was not requested." };
  }

  const sourceHandles = new Set(handles);
  const products = shopifyInspection.data.products.nodes;
  const productsByHandle = new Map(products.map((product) => [product.handle, product]));
  return {
    status: "read_only_inspected",
    accessScopes: shopifyInspection.data.currentAppInstallation?.accessScopes.map((scope) => scope.handle) ?? [],
    exactHandleMatches: handles.filter((handle) => productsByHandle.has(handle)).map((handle) => {
      const product = productsByHandle.get(handle);
      return {
        handle,
        id: product.id,
        title: product.title,
        status: product.status,
        metafields: product.metafields.nodes.map((metafield) => ({
          namespace: metafield.namespace,
          key: metafield.key,
          type: metafield.type,
        })),
        media: product.media.nodes.map((media) => ({
          id: media.id,
          alt: media.alt,
          mediaContentType: media.mediaContentType,
          previewUrl: media.preview?.image?.url ?? null,
        })),
      };
    }),
    missingSourceHandlesInShopify: handles.filter((handle) => !productsByHandle.has(handle)),
    unexpectedReturnedHandles: products.filter((product) => !sourceHandles.has(product.handle)).map((product) => product.handle),
    existingProductMetafieldDefinitions: shopifyInspection.data.metafieldDefinitions.nodes,
    existingMetaobjectDefinitions: shopifyInspection.data.metaobjectDefinitions.nodes,
    existingFiles: shopifyInspection.data.files.nodes.map((file) => ({
      id: file.id,
      alt: file.alt,
      fileStatus: file.fileStatus,
      previewUrl: file.preview?.image?.url ?? null,
    })),
  };
}

function writeJson(directory, filename, value) {
  writeFileSync(path.join(directory, filename), `${JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  const resolvedCommit = git("rev-parse", sourceCommit);
  if (resolvedCommit !== DEFAULT_SOURCE_COMMIT) throw new Error(`Source must resolve to ${DEFAULT_SOURCE_COMMIT}; received ${resolvedCommit}.`);

  const products = sourceProducts(resolvedCommit);
  const duplicateHandles = products.map((product) => product.handle).filter((handle, index, handles) => handles.indexOf(handle) !== index);
  if (duplicateHandles.length) throw new Error(`Duplicate source handles: ${duplicateHandles.join(", ")}`);

  const galleryByHandle = sourceGallery(resolvedCommit);
  const scienceByHandle = sourceScienceVisuals(resolvedCommit);
  const manifest = products.map((product) => productManifest(product, galleryByHandle, scienceByHandle));
  const assets = manifest.flatMap((record) => record.assets);
  const missingAssets = assets.filter((asset) => !asset.existsAtSourceCommit);
  const output = path.resolve(TOOL_ROOT, outputDirectory);
  const previousPlanPath = path.join(output, "dry-run-plan.json");
  const previousPlan = existsSync(previousPlanPath) ? JSON.parse(readFileSync(previousPlanPath, "utf8")) : undefined;
  const cachedInspection = previousPlan?.sourceCommit === resolvedCommit && previousPlan?.shopifyInspection?.completed
    ? previousPlan.shopifyInspection
    : undefined;
  const shopifyInspection = inspectShopify
    ? await inspectShopifyReadOnly(products.map((product) => product.handle))
    : cachedInspection ?? {
      requested: false,
      completed: false,
      reason: "Run with --shopify and restricted Admin credentials for read-only Shopify inspection.",
    };
  const compatibility = buildCompatibility(manifest, shopifyInspection);
  const shopifyCatalogue = shopifyCatalogueSummary(products.map((product) => product.handle), shopifyInspection);

  mkdirSync(output, { recursive: true });
  writeJson(output, "migration-manifest.json", { sourceCommit: resolvedCommit, products: manifest });
  writeJson(output, "shopify-schema-proposal.json", schemaProposal());
  writeJson(output, "dry-run-plan.json", {
    sourceCommit: resolvedCommit,
    sourceRoot,
    mode: "READ_ONLY",
    productCount: manifest.length,
    productHandles: manifest.map((record) => record.product.handle),
    allowedOperations: ["read source commit", "read local asset inventory", "optional read-only Shopify query"],
    prohibitedOperations: ["product create", "product update", "file upload", "metafield write", "definition create", "publication", "price update"],
    shopifyInspection,
    shopifyCatalogue,
  });
  writeJson(output, "field-compatibility-report.json", compatibility);
  writeJson(output, "missing-source-data.json", {
    sourceCommit: resolvedCommit,
    unresolvedForEveryProduct: ["sku", "inventory", "AED market price"],
    productHandles: manifest.map((record) => record.product.handle),
  });
  writeJson(output, "asset-inventory.json", { sourceCommit: resolvedCommit, assets, missingAssets });
  writeJson(output, "errors.json", {
    sourceCommit: resolvedCommit,
    errors: [
      ...missingAssets.map((asset) => ({ type: "missing_source_asset", asset })),
      ...(!shopifyInspection.completed && shopifyInspection.requested
        ? [{ type: "shopify_read_only_inspection_failed", details: shopifyInspection.errors ?? shopifyInspection.reason }]
        : []),
    ],
  });

  console.log(`Read-only Shopify catalogue dry run complete for ${manifest.length} products.`);
  console.log(`Reports written to ${output}`);
  console.log(`Shopify mutations performed: 0`);
  if (inspectShopify && !shopifyInspection.completed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
