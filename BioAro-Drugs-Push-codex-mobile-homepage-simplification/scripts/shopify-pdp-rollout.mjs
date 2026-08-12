#!/usr/bin/env node

import process from "node:process";
import { METAOBJECT_DEFINITIONS, PRODUCT_METAFIELD_DEFINITIONS, ROCKTOMIC_PRODUCTS } from "./shopify-pdp-schema.mjs";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const createDefinitions = args.has("--create-definitions");

const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";

const endpoint = shopDomain ? `https://${shopDomain}/admin/api/${apiVersion}/graphql.json` : null;

function ensureConfigured() {
  if (!endpoint || !accessToken) {
    throw new Error(
      "SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required for Shopify Admin rollout commands.",
    );
  }
}

async function graphql(query, variables = {}) {
  ensureConfigured();
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

async function metafieldDefinitionsByOwner(ownerType) {
  const data = await graphql(
    `query Definitions($ownerType: MetafieldOwnerType!) {
      metafieldDefinitions(first: 250, ownerType: $ownerType) {
        nodes { id namespace key type { name } }
      }
    }`,
    { ownerType },
  );
  return data.metafieldDefinitions.nodes;
}

async function metaobjectDefinitions() {
  const data = await graphql(`query MetaobjectDefinitions {
    metaobjectDefinitions(first: 100) {
      nodes { id type name }
    }
  }`);
  return data.metaobjectDefinitions.nodes;
}

function canonicalMetaobjectType(type) {
  if (typeof type !== "string") return type;
  if (type.startsWith("$app:")) return type.slice("$app:".length);
  const appMatch = type.match(/^app--\d+--(.+)$/);
  return appMatch ? appMatch[1] : type;
}

function metaobjectTypeForMetafield(key) {
  const byKey = {
    gallery_images: "bioaro_gallery_image",
    hero_badges: "bioaro_hero_badge",
    why_pillars: "bioaro_why_pillar",
    science_cards: "bioaro_science_card",
    ingredient_details: "bioaro_ingredient_card",
    comparison_rows: "bioaro_comparison_row",
    related_products: "bioaro_related_product",
    quality_badges: "bioaro_quality_badge",
    faqs: "bioaro_faq_item",
    bottom_cta_primary: "bioaro_bottom_cta",
    bottom_cta_secondary: "bioaro_bottom_cta",
    supplement_facts_rows: "bioaro_supplement_fact_row",
  };
  return byKey[key];
}

async function productExistsByHandle(handle) {
  const data = await graphql(
    `query ProductByHandle($query: String!) {
      products(first: 1, query: $query) {
        nodes { id handle title }
      }
    }`,
    { query: `handle:${handle}` },
  );
  return data.products.nodes[0] ?? null;
}

async function createMetafieldDefinition(definition, metaobjectDefinitionId) {
  const validations = metaobjectDefinitionId
    ? [{ name: "metaobject_definition_id", value: metaobjectDefinitionId }]
    : undefined;
  const data = await graphql(
    `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition { id key namespace }
        userErrors { field message code }
      }
    }`,
    {
      definition: {
        name: definition.name,
        namespace: "custom",
        key: definition.key,
        ownerType: "PRODUCT",
        type: definition.type,
        access: { storefront: "PUBLIC_READ" },
        ...(validations ? { validations } : {}),
      },
    },
  );
  return data.metafieldDefinitionCreate;
}

async function createMetaobjectDefinition(definition) {
  const data = await graphql(
    `mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition { id type name }
        userErrors { field message code }
      }
    }`,
    {
      definition: {
        name: definition.name,
        type: definition.type,
        displayNameKey: definition.displayNameKey,
        access: { admin: "MERCHANT_READ_WRITE", storefront: "PUBLIC_READ" },
        fieldDefinitions: definition.fields,
      },
    },
  );
  return data.metaobjectDefinitionCreate;
}

async function runDryRun() {
  ensureConfigured();
  const [existingMetafields, existingMetaobjects] = await Promise.all([
    metafieldDefinitionsByOwner("PRODUCT"),
    metaobjectDefinitions(),
  ]);

  const existingMetafieldKeys = new Set(existingMetafields.map((item) => `custom.${item.key}`));
  const existingMetaobjectTypes = new Set(existingMetaobjects.map((item) => canonicalMetaobjectType(item.type)));
  const productChecks = [];
  for (const product of ROCKTOMIC_PRODUCTS) {
    const existing = await productExistsByHandle(product.handle);
    productChecks.push({ ...product, existsInShopify: Boolean(existing) });
  }

  const missingMetafields = PRODUCT_METAFIELD_DEFINITIONS.filter(
    (definition) => !existingMetafieldKeys.has(`custom.${definition.key}`),
  );
  const missingMetaobjects = METAOBJECT_DEFINITIONS.filter(
    (definition) => !existingMetaobjectTypes.has(canonicalMetaobjectType(definition.type)),
  );

  console.log(JSON.stringify({
    shopDomain,
    apiVersion,
    metafieldDefinitionCount: PRODUCT_METAFIELD_DEFINITIONS.length,
    metaobjectDefinitionCount: METAOBJECT_DEFINITIONS.length,
    missingMetafields,
    missingMetaobjects,
    products: productChecks,
  }, null, 2));
}

async function runDefinitionCreate() {
  ensureConfigured();
  const [existingMetafields, existingMetaobjects] = await Promise.all([
    metafieldDefinitionsByOwner("PRODUCT"),
    metaobjectDefinitions(),
  ]);

  const existingMetafieldKeys = new Set(existingMetafields.map((item) => `custom.${item.key}`));
  const existingMetaobjectTypes = new Set(existingMetaobjects.map((item) => canonicalMetaobjectType(item.type)));
  const metaobjectIdsByType = new Map(existingMetaobjects.map((item) => [canonicalMetaobjectType(item.type), item.id]));

  for (const definition of METAOBJECT_DEFINITIONS) {
    const definitionType = canonicalMetaobjectType(definition.type);
    if (existingMetaobjectTypes.has(definitionType)) continue;
    const result = await createMetaobjectDefinition(definition);
    if (result.userErrors?.length) {
      throw new Error(`Failed to create metaobject ${definition.type}: ${result.userErrors.map((error) => error.message).join("; ")}`);
    }
    const created = result.metaobjectDefinition;
    if (created?.type && created?.id) metaobjectIdsByType.set(canonicalMetaobjectType(created.type), created.id);
  }

  for (const definition of PRODUCT_METAFIELD_DEFINITIONS) {
    if (existingMetafieldKeys.has(`custom.${definition.key}`)) continue;
    const linkedMetaobjectType = metaobjectTypeForMetafield(definition.key);
    const metaobjectDefinitionId = linkedMetaobjectType ? metaobjectIdsByType.get(linkedMetaobjectType) : undefined;
    if (linkedMetaobjectType && !metaobjectDefinitionId) {
      throw new Error(`Cannot create metafield ${definition.key}: missing metaobject definition ${linkedMetaobjectType}.`);
    }
    const result = await createMetafieldDefinition(definition, metaobjectDefinitionId);
    if (result.userErrors?.length) {
      throw new Error(`Failed to create metafield ${definition.key}: ${result.userErrors.map((error) => error.message).join("; ")}`);
    }
  }

  console.log("Shopify PDP definitions created or already present.");
}

async function main() {
  if (dryRun) {
    await runDryRun();
    return;
  }

  if (createDefinitions) {
    await runDefinitionCreate();
    return;
  }

  console.log("Usage: npm run shopify:pdp:dry-run or npm run shopify:pdp:definitions");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
