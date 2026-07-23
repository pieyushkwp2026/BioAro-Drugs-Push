import test from "node:test";
import assert from "node:assert/strict";
import { createShopifyProduct, mapProductMetafields, mergeShopifyProduct } from "../src/lib/shopify/productMapping";
import type { ProductEditorial, ShopifyProduct } from "../src/lib/shopify/types";

const shopifyProduct: ShopifyProduct = {
  id: "gid://shopify/Product/123",
  handle: "shopify-only-formula",
  title: "Shopify Only Formula",
  description: "A product returned directly by Shopify.",
  image: { src: "https://cdn.shopify.com/product.png", alt: "Shopify Only Formula packaging" },
  price: { amount: 189, currencyCode: "AED" },
  compareAtPrice: undefined,
  availableForSale: false,
  variantId: "gid://shopify/ProductVariant/123",
  metafields: mapProductMetafields([
    { key: "pdp_subtitle", type: "single_line_text_field", value: "Daily support" },
    { key: "hero_bullets", type: "multi_line_text_field", value: "Energy\nRecovery" },
    { key: "benefit_cards", type: "json", value: '[{"title":"Energy","text":"Supports steady energy."}]' },
    { key: "ingredients", type: "json", value: '[{"name":"Magnesium","amount":"100 mg","purpose":"Daily support"}]' },
    { key: "supplement_facts_rows", type: "json", value: '[{"title":"Serving size","text":"Two capsules"}]' },
    { key: "faqs", type: "json", value: '[{"title":"When should I take it?","text":"With food."}]' },
    { key: "storage_instructions", type: "single_line_text_field", value: "Store in a cool, dry place." },
  ]),
};

const previewProduct: ProductEditorial = {
  id: "preview-product",
  handle: "shopify-only-formula",
  title: "Preview Formula",
  tagline: "Preview tagline",
  description: "Preview description",
  category: "Wellness",
  tags: ["Preview"],
  bestFor: "Preview routine",
  dosage: "Preview dosage",
  servings: "30 servings",
  supplyLabel: "30-day supply",
  rating: { average: 4.8, count: 10 },
  benefits: ["Preview benefit"],
  whyItems: [{ icon: "shield", title: "Preview", description: "Preview description" }],
  trustNotes: ["Preview trust note"],
  warnings: ["Preview warning"],
  ingredients: [],
  supplementFacts: [],
  science: [],
  evidencePoints: [],
  efficacyMetric: { label: "", unit: "", placeboValue: 0, productValue: 0, caption: "" },
  faq: [],
  priceByCountry: { GB: 89.99 },
};

test("maps Shopify metafields into a Shopify-only regional PDP model", () => {
  const product = createShopifyProduct(shopifyProduct, "AE");

  assert.equal(product.price.amount, 189);
  assert.equal(product.price.currencyCode, "AED");
  assert.equal(product.availableForSale, false);
  assert.equal(product.tagline, "Daily support");
  assert.deepEqual(product.benefits, ["Supports steady energy."]);
  assert.deepEqual(product.ingredients, [{ name: "Magnesium", amount: "100 mg", purpose: "Daily support", whyIncluded: undefined }]);
  assert.deepEqual(product.supplementFacts, [{ label: "Serving size", value: "Two capsules" }]);
  assert.deepEqual(product.faq, [{ question: "When should I take it?", answer: "With food." }]);
  assert.ok(product.warnings.includes("Storage: Store in a cool, dry place."));
});

test("uses Shopify data when present and preserves editorial fields when metafields are absent", () => {
  const product = mergeShopifyProduct(
    previewProduct,
    { ...shopifyProduct, metafields: undefined, price: { amount: 113.99, currencyCode: "USD" } },
    "US",
  );

  assert.equal(product.title, "Shopify Only Formula");
  assert.equal(product.price.amount, 113.99);
  assert.equal(product.price.currencyCode, "USD");
  assert.equal(product.priceByCountry.US, 113.99);
  assert.deepEqual(product.benefits, ["Preview benefit"]);
  assert.deepEqual(product.warnings, ["Preview warning"]);
});

test("ignores invalid JSON metafields instead of throwing", () => {
  const metafields = mapProductMetafields([
    { key: "benefit_cards", type: "json", value: "not-json" },
    { key: "hero_bullets", type: "multi_line_text_field", value: "Focus\nClarity" },
  ]);

  assert.equal(metafields?.benefitCards, undefined);
  assert.equal(metafields?.heroBullets, "Focus\nClarity");
});
