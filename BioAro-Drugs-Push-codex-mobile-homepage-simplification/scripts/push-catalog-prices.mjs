#!/usr/bin/env node

/*
 * Fixed US prices for the 20 Rocktomic products.
 *
 * Usage:
 *   node --env-file=.env.local scripts/push-catalog-prices.mjs            # dry run
 *   node --env-file=.env.local scripts/push-catalog-prices.mjs --apply
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS CHANGES, AND WHY IT IS A PRICE LIST RATHER THAN A VARIANT EDIT
 *
 * The shop's base currency is CAD, so the US storefront currently shows converted
 * amounts (BioProtein Pro reads $27.00 against a 36.36 CAD base). Writing fixed prices
 * into the United States price list replaces conversion with the intended US price and
 * leaves the CAD base — and every other market — untouched.
 *
 * VARIANT IDS WERE VERIFIED AGAINST THE STORE before this file was committed: all 20
 * resolve to the product named beside them, each carrying its expected ROC SKU. One
 * label differs from the store and is called out in place.
 *
 * NOTE ON MARKETS: price lists exist for the United States (USD), United Kingdom (GBP)
 * and United Arab Emirates (AED). There is NO Canada price list, which is why /ca
 * receives USD amounts and the app withholds those prices.
 * ---------------------------------------------------------------------------
 */

import process from "node:process";

const APPLY = process.argv.includes("--apply");

/* The repo's convention is the SHOPIFY_ADMIN_ prefix; .env.local has no SHOPIFY_SHOP_DOMAIN. */
const SHOP = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VER = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";
const ENDPOINT = `https://${SHOP}/admin/api/${API_VER}/graphql.json`;

/* The US market catalog. Verified: its price list is USD. */
const CATALOG_ID = "gid://shopify/Catalog/70731956327";

if (!SHOP || !TOKEN) {
  console.error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
  process.exit(1);
}

const prices = [
  { variantId: "gid://shopify/ProductVariant/44400737878119", price: "36.99", label: "BioProtein Pro" },
  { variantId: "gid://shopify/ProductVariant/44400770187367", price: "39.99", label: "PlantCore" },
  { variantId: "gid://shopify/ProductVariant/44400775168103", price: "24.99", label: "BioIgnite" },
  { variantId: "gid://shopify/ProductVariant/44400779690087", price: "33.99", label: "MuscleRecover" },
  { variantId: "gid://shopify/ProductVariant/44400790405223", price: "25.99", label: "HydraReload" },
  { variantId: "gid://shopify/ProductVariant/44400804003943", price: "19.99", label: "Women's VitalPrime" },
  { variantId: "gid://shopify/ProductVariant/44400808231015", price: "22.99", label: "NitricFlow" },
  { variantId: "gid://shopify/ProductVariant/44400813310055", price: "20.99", label: "Men's VitalPrime" },
  { variantId: "gid://shopify/ProductVariant/44400819470439", price: "22.99", label: "BioCollagen" },
  { variantId: "gid://shopify/ProductVariant/44400828285031", price: "16.99", label: "Nitric Roots" },
  { variantId: "gid://shopify/ProductVariant/44401316331623", price: "24.99", label: "MindSync" },
  { variantId: "gid://shopify/ProductVariant/44401316364391", price: "18.99", label: "MagBalance" },
  { variantId: "gid://shopify/ProductVariant/44401316626535", price: "29.99", label: "VitalGreens" },
  { variantId: "gid://shopify/ProductVariant/44401316560999", price: "12.99", label: "FlexMotion" },
  { variantId: "gid://shopify/ProductVariant/44401316429927", price: "14.99", label: "Hormone Reset" },
  { variantId: "gid://shopify/ProductVariant/44401316462695", price: "16.99", label: "AndroCore" },
  /* Store title is "Digestive Enzyme", not "BioDigest". The variant is correct (ROC303);
     only the name differs, presumably a rename that has not happened yet. */
  { variantId: "gid://shopify/ProductVariant/44401316397159", price: "17.99", label: "BioDigest / Digestive Enzyme" },
  { variantId: "gid://shopify/ProductVariant/44401316593767", price: "13.99", label: "BoneVital" },
  { variantId: "gid://shopify/ProductVariant/44401316495463", price: "26.99", label: "AminoBoost" },
  { variantId: "gid://shopify/ProductVariant/44401316528231", price: "25.99", label: "StressAdapt" },
];

async function gql(query, variables = {}, attempt = 1) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });

  if (res.status === 429 || res.status >= 500) {
    if (attempt > 5) throw new Error(`Shopify returned ${res.status} after ${attempt} attempts`);
    await new Promise((r) => setTimeout(r, 1000 * attempt * attempt));
    return gql(query, variables, attempt + 1);
  }

  const { data, errors } = await res.json();
  if (errors?.some((e) => /throttl/i.test(e.message ?? ""))) {
    if (attempt > 5) throw new Error("Still throttled after 5 attempts");
    await new Promise((r) => setTimeout(r, 1000 * attempt * attempt));
    return gql(query, variables, attempt + 1);
  }
  if (errors?.length) throw new Error(JSON.stringify(errors));
  return data;
}

/* Step 1 — the price list for the US catalog. */
const catalogData = await gql(
  `query($id: ID!) {
    catalog(id: $id) { title ... on MarketCatalog { priceList { id currency } } }
  }`,
  { id: CATALOG_ID },
);

const priceList = catalogData.catalog?.priceList;
if (!priceList) throw new Error(`No price list on catalog ${CATALOG_ID}`);
if (priceList.currency !== "USD") {
  throw new Error(`Refusing to continue: price list currency is ${priceList.currency}, expected USD`);
}
console.log(`Catalog: ${catalogData.catalog.title}`);
console.log(`Price list: ${priceList.id} (${priceList.currency})\n`);

/* Step 2 — show what changes, against what the variants cost today. */
const current = await gql(
  `query($ids: [ID!]!) {
    nodes(ids: $ids) { ... on ProductVariant { id price sku product { title } } }
  }`,
  { ids: prices.map((p) => p.variantId) },
);

console.log("product                   sku        base(CAD)   -> US fixed");
let unresolved = 0;
current.nodes.forEach((node, index) => {
  const target = prices[index];
  if (!node) {
    console.log(`  ${target.label.padEnd(26)} VARIANT NOT FOUND`);
    unresolved += 1;
    return;
  }
  console.log(
    `  ${node.product.title.padEnd(24)} ${String(node.sku ?? "-").padEnd(10)} ${String(node.price).padEnd(11)} -> ${target.price}`,
  );
});

if (unresolved) {
  console.error(`\n${unresolved} variant(s) could not be resolved. Refusing to continue.`);
  process.exit(1);
}

if (!APPLY) {
  console.log("\nDry run. Re-run with --apply to write these prices.");
  process.exit(0);
}

/* Step 3 — set them. */
const result = await gql(
  `mutation PriceListFixedPricesAdd($priceListId: ID!, $prices: [PriceListPriceInput!]!) {
    priceListFixedPricesAdd(priceListId: $priceListId, prices: $prices) {
      prices { variant { id } price { amount currencyCode } }
      userErrors { field message }
    }
  }`,
  {
    priceListId: priceList.id,
    prices: prices.map((p) => ({ variantId: p.variantId, price: { amount: p.price, currencyCode: "USD" } })),
  },
);

const { prices: written, userErrors } = result.priceListFixedPricesAdd;
if (userErrors.length) {
  console.error("\nErrors:");
  for (const e of userErrors) console.error(`  ${e.field} ${e.message}`);
  process.exit(1);
}
console.log(`\n${written.length} US prices set. Verify on the storefront with @inContext(country: US).`);
