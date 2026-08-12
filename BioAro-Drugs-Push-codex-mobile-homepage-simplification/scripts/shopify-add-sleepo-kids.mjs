#!/usr/bin/env node

const PRODUCT = {
  handle: "sleepo-kids",
  title: "SleepO Kids",
  description:
    "SleepO Kids is prepared as a draft-only US product shell while approved pricing, imagery, and final product-specific content are still being finalized. This placeholder intentionally avoids unsupported children’s health claims.",
  heroEyebrow: "Kids Wellness / Sleep Routine",
  category: "Wellness",
  tagline: "US draft placeholder pending approved product brief.",
  tags: ["Kids Routine", "Draft Product", "US Prep"],
  benefits: [
    "Prepared as a separate product from Sleep0+",
    "Held in draft until approved US pricing is available",
    "Uses neutral placeholder content instead of unsupported claims",
  ],
  packName: "Pending approved product packaging",
  supplyLabel: "Price and format pending",
  servingSize: "Pending approved label",
  servingsPerContainer: "Pending approved packaging",
  productFormat: "Pending approved product format",
  directions: "Follow the approved product label directions once finalized.",
  bestFor:
    "Draft-only placeholder entry pending approved product positioning, pricing, and product-specific content.",
  whyHeadline: "Prepared as a separate US draft product while final launch details are still pending.",
  scienceHeadline: "Neutral placeholder content is used until approved SleepO Kids science and product information are provided.",
  ingredientsHeadline: "Ingredient details will be added once the approved product brief is supplied.",
  evidenceHeadline: "Draft shell only — no product-specific evidence claims are published yet",
  comparisonHeadline: "SleepO Kids vs. typical placeholder listings",
  faqHeadline: "SleepO Kids FAQ",
  warnings: [
    "Use only with approved product-specific directions once finalized.",
    "Keep out of reach of children unless the final approved label states otherwise.",
    "Do not use placeholder content as medical or dosage guidance.",
  ],
  ingredients: ["Ingredient details pending approval"],
};

const GLOBAL_PRIMARY_CTA = {
  headline: "Ready to build your routine?",
  supportingText: "Browse all formulas and explore the BioAro Drugs range.",
  buttonLabel: "Browse all formulas",
  buttonLink: "/us/shop",
};

const GLOBAL_SECONDARY_CTA = {
  headline: "Want a more personalized approach?",
  supportingText: "Take the BioAro quiz to find the best fit for your routine.",
  buttonLabel: "Take the quiz",
  buttonLink: "/us/quiz",
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
  const userErrors = result[key]?.userErrors ?? [];
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
          variants(first: 1) {
            nodes {
              id
              barcode
              inventoryItem {
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
      action: existing ? "would_update_existing_draft_product" : "would_create_draft_product",
      handle: PRODUCT.handle,
      note: "SleepO Kids remains a draft-only US product shell with no storefront publication and no live pricing.",
    }, null, 2));
    return;
  }

  if (!existing) {
    await createProduct();
    existing = await productByHandle(PRODUCT.handle);
  }
  if (!existing) throw new Error("Failed to load sleepo-kids after create.");

  const updatedProduct = await updateProduct(existing, metafieldsFor(primaryCtaId, secondaryCtaId, metafieldTypes));

  console.log(JSON.stringify({
    shopDomain,
    apiVersion,
    apply,
    handle: PRODUCT.handle,
    status: updatedProduct.status,
    pricingNote: "No US base price is set in this pass; SleepO Kids remains hidden from storefront visibility until approved pricing is supplied.",
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
