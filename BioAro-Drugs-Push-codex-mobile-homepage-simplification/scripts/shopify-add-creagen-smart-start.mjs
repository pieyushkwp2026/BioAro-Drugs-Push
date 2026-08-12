#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const PRODUCT = {
  handle: "creagen-smart-start",
  title: "Creagen Smart Start",
  sku: "44447196",
  gtin: "8405357828727",
  description:
    "BioAro Creagen Smart Start Green Apple Stick Packs 5g x 20s is a convenient dietary supplement designed to support daily mental performance and overall wellness. A dual-action formula supporting both mental stamina and physical recovery for students, working professionals, and active individuals.",
  heroEyebrow: "Focus / Recovery Support",
  category: "Focus",
  tagline: "Fuel focus. Recover smarter.",
  tags: ["Mental Stamina", "Physical Recovery", "Daily Focus"],
  benefits: [
    "Supports mental stamina during cognitively demanding days",
    "Designed as a foundational daily focus and recovery routine",
    "Single-serve stick packs are easy to mix and carry",
  ],
  packName: "Green Apple Stick Packs",
  supplyLabel: "20-day supply",
  servingSize: "1 stick pack (5 g)",
  servingsPerContainer: "20",
  productFormat: "Stick packs",
  directions:
    "Mix one stick pack with water or a non-carbonated beverage and consume as directed on the product label or by a healthcare professional.",
  bestFor:
    "Students, working professionals, and active individuals under high cognitive demand who want a simple focus and recovery routine.",
  whyHeadline: "A foundational routine for focus, metabolism support, and recovery.",
  scienceHeadline: "Creatine monohydrate with vitamins B6 and B12 in a convenient daily sachet format.",
  ingredientsHeadline: "Purposeful core ingredients for a simple daily start.",
  evidenceHeadline: "Backed by a transparent, easy-to-understand formula",
  comparisonHeadline: "BioAro vs typical daily focus supplements",
  faqHeadline: "Creagen Smart Start FAQ",
  warnings: [
    "Consult your healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.",
    "Do not exceed the recommended daily intake.",
    "Keep out of reach of young children.",
    "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
  ],
  ingredients: [
    "Creatine Monohydrate 1.5 g",
    "Vitamin B6 0.8 mg",
    "Vitamin B12 1.2 mcg",
  ],
  mediaPath: path.resolve("src/assets/products/creagen-brain-boost-primary.png"),
};

const GLOBAL_PRIMARY_CTA = {
  headline: "Ready to build your routine?",
  supportingText: "Browse all formulas and explore the BioAro Drugs range.",
  buttonLabel: "Browse all formulas",
  buttonLink: "/uk/shop",
};

const GLOBAL_SECONDARY_CTA = {
  headline: "Want a more personalized approach?",
  supportingText: "Take the BioAro quiz to find the best fit for your routine.",
  buttonLabel: "Take the quiz",
  buttonLink: "/uk/quiz",
};

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
          title
          status
          media(first: 10) {
            nodes {
              ... on MediaImage {
                id
                alt
                image { url }
              }
            }
          }
          variants(first: 1) {
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

async function metafieldDefinitions() {
  const data = await graphql(`query MetafieldDefinitions {
    metafieldDefinitions(first: 250, ownerType: PRODUCT) {
      nodes { namespace key type { name } }
    }
  }`);
  return data.metafieldDefinitions.nodes.filter((definition) => definition.namespace === "custom");
}

async function metaobjectDefinitions() {
  const data = await graphql(`query MetaobjectDefinitions {
    metaobjectDefinitions(first: 100) {
      nodes { id type name }
    }
  }`);
  return data.metaobjectDefinitions.nodes;
}

async function metaobjectByHandle(type, handle) {
  const data = await graphql(
    `query MetaobjectByHandle($handle: MetaobjectHandleInput!) {
      metaobjectByHandle(handle: $handle) { id type handle }
    }`,
    { handle: { type, handle } },
  );
  return data.metaobjectByHandle ?? null;
}

async function createMetaobject(type, handle, fields) {
  const result = await graphql(
    `mutation MetaobjectCreate($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject { id type handle }
        userErrors { field message }
      }
    }`,
    { metaobject: { type, handle, fields } },
  );
  return assertNoUserErrors(result, "metaobjectCreate").metaobject;
}

async function resolveBottomCtaType() {
  const definitions = await metaobjectDefinitions();
  const match = definitions.find((definition) => definition.type.endsWith("--bioaro_bottom_cta"));
  if (!match) throw new Error("Could not find the BioAro bottom CTA metaobject definition.");
  return match.type;
}

async function ensureBottomCta(type, handle, cta) {
  const existing = await metaobjectByHandle(type, handle);
  if (existing) return existing.id;
  const created = await createMetaobject(type, handle, [
    { key: "headline", value: cta.headline },
    { key: "supporting_text", value: cta.supportingText },
    { key: "button_label", value: cta.buttonLabel },
    { key: "button_link", value: cta.buttonLink },
  ]);
  return created.id;
}

function formatValueForType(value, type) {
  if (value == null) return "";
  if (type === "single_line_text_field") {
    if (Array.isArray(value)) return value.join("; ");
    return String(value).replace(/\s*\n+\s*/g, "; ");
  }
  if (type === "multi_line_text_field") {
    if (Array.isArray(value)) return value.join("\n");
    return String(value);
  }
  return String(value);
}

function metafieldsFor(primaryCtaId, secondaryCtaId, types) {
  return [
    ["hero_eyebrow", PRODUCT.heroEyebrow, "single_line_text_field"],
    ["category", PRODUCT.category, "single_line_text_field"],
    ["pdp_subtitle", PRODUCT.tagline, "single_line_text_field"],
    ["short_description", PRODUCT.description, "multi_line_text_field"],
    ["hero_tags", PRODUCT.tags, "single_line_text_field"],
    ["hero_bullets", PRODUCT.benefits, "multi_line_text_field"],
    ["pack_name", PRODUCT.packName, "single_line_text_field"],
    ["supply_label", PRODUCT.supplyLabel, "single_line_text_field"],
    ["serving_size", PRODUCT.servingSize, "single_line_text_field"],
    ["servings_per_container", PRODUCT.servingsPerContainer, "single_line_text_field"],
    ["product_format", PRODUCT.productFormat, "single_line_text_field"],
    ["directions", PRODUCT.directions, "multi_line_text_field"],
    ["warnings_headline", "Warnings", "single_line_text_field"],
    ["warnings", PRODUCT.warnings, "multi_line_text_field"],
    ["best_for_label", "Best for", "single_line_text_field"],
    ["best_for_description", PRODUCT.bestFor, "multi_line_text_field"],
    ["why_formula_eyebrow", `Why ${PRODUCT.title}?`, "single_line_text_field"],
    ["why_formula_headline", PRODUCT.whyHeadline, "single_line_text_field"],
    ["why_formula_body", PRODUCT.bestFor, "multi_line_text_field"],
    ["science_eyebrow", "Science behind the formula", "single_line_text_field"],
    ["science_headline", PRODUCT.scienceHeadline, "single_line_text_field"],
    ["ingredients_eyebrow", "Key ingredients", "single_line_text_field"],
    ["ingredients_headline", PRODUCT.ingredientsHeadline, "single_line_text_field"],
    ["supplement_facts_headline", "Supplement facts", "single_line_text_field"],
    ["evidence_headline", PRODUCT.evidenceHeadline, "single_line_text_field"],
    ["comparison_headline", PRODUCT.comparisonHeadline, "single_line_text_field"],
    ["comparison_bioaro_label", PRODUCT.title, "single_line_text_field"],
    ["comparison_typical_label", "Typical supplement", "single_line_text_field"],
    ["quality_headline", "Quality & Purity", "single_line_text_field"],
    ["faq_eyebrow", "FAQ", "single_line_text_field"],
    ["faq_headline", PRODUCT.faqHeadline, "single_line_text_field"],
    ["ingredients", PRODUCT.ingredients.join(", "), "single_line_text_field"],
    ["bottom_cta_primary", primaryCtaId, "metaobject_reference"],
    ["bottom_cta_secondary", secondaryCtaId, "metaobject_reference"],
  ].map(([key, value, fallbackType]) => {
    const type = types.get(key) ?? fallbackType;
    return {
      namespace: "custom",
      key,
      type,
      value: formatValueForType(value, type),
    };
  });
}

async function createProduct() {
  const result = await graphql(
    `mutation ProductCreate($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product { id handle title status }
        userErrors { field message }
      }
    }`,
    {
      product: {
        title: PRODUCT.title,
        handle: PRODUCT.handle,
        descriptionHtml: PRODUCT.description,
        status: "DRAFT",
      },
    },
  );
  return assertNoUserErrors(result, "productCreate").product;
}

async function updateProduct(existing, metafields) {
  const result = await graphql(
    `mutation ProductUpdate($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product { id handle title status }
        userErrors { field message }
      }
    }`,
    {
      product: {
        id: existing.id,
        title: PRODUCT.title,
        descriptionHtml: PRODUCT.description,
        metafields,
      },
    },
  );
  return assertNoUserErrors(result, "productUpdate").product;
}

async function updateVariant(existing) {
  const variant = existing.variants.nodes[0];
  if (!variant) throw new Error("No default variant found for the product.");
  const result = await graphql(
    `mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          barcode
          inventoryItem { sku tracked }
        }
        userErrors { field message }
      }
    }`,
    {
      productId: existing.id,
      variants: [
        {
          id: variant.id,
          barcode: PRODUCT.gtin,
          inventoryItem: {
            sku: PRODUCT.sku,
            tracked: false,
          },
        },
      ],
    },
  );
  return assertNoUserErrors(result, "productVariantsBulkUpdate").productVariants[0];
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
  if (!upload.ok) throw new Error(`Failed uploading ${filename}: ${upload.status}`);
  return { originalSource: staged.resourceUrl, alt: altText };
}

async function attachMedia(productId) {
  const mediaInput = await stagedUpload(PRODUCT.mediaPath, `${PRODUCT.title} product image`);
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
  const metafieldTypes = new Map((await metafieldDefinitions()).map((definition) => [definition.key, definition.type.name]));
  const bottomCtaType = await resolveBottomCtaType();
  const primaryCtaId = await ensureBottomCta(bottomCtaType, "global-primary-cta", GLOBAL_PRIMARY_CTA);
  const secondaryCtaId = await ensureBottomCta(bottomCtaType, "global-secondary-cta", GLOBAL_SECONDARY_CTA);

  let existing = await productByHandle(PRODUCT.handle);
  if (!apply) {
    console.log(JSON.stringify({
      shopDomain,
      apiVersion,
      apply,
      action: existing ? "would_update_existing_product" : "would_create_draft_product",
      handle: PRODUCT.handle,
      mediaSource: PRODUCT.mediaPath,
      note: "Shop base currency is CAD, so AED pricing is intentionally kept out of the Shopify base variant fields in this pass.",
    }, null, 2));
    return;
  }

  if (!existing) {
    await createProduct();
    existing = await productByHandle(PRODUCT.handle);
  }
  if (!existing) throw new Error("Failed to load creagen-smart-start after create.");

  const updatedProduct = await updateProduct(existing, metafieldsFor(primaryCtaId, secondaryCtaId, metafieldTypes));
  const updatedVariant = await updateVariant(existing);
  const hasMedia = existing.media.nodes.some((node) => node?.alt === `${PRODUCT.title} product image`);
  const mediaResult = hasMedia ? null : await attachMedia(existing.id);

  console.log(JSON.stringify({
    shopDomain,
    apiVersion,
    apply,
    handle: PRODUCT.handle,
    status: updatedProduct.status,
    variant: {
      sku: updatedVariant.inventoryItem?.sku ?? null,
      tracked: updatedVariant.inventoryItem?.tracked ?? null,
      barcode: updatedVariant.barcode ?? null,
    },
    mediaAdded: Boolean(mediaResult),
    pricingNote: "Base Shopify currency is CAD. AED pricing remains in the local/UAE storefront preview until market pricing support is configured.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
