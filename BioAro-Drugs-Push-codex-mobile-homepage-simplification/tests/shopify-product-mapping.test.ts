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
  category: "Longevity",
  tags: ["Preview"],
  bestFor: "Preview routine",
  dosage: "Preview dosage",
  servings: "30 servings",
  supplyLabel: "30-day supply",
  rating: { average: 4.8, count: 10 },
  featureBadges: [],
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

test("prefers approved Shopify ingredient references and science imagery for a dedicated PDP", () => {
  const metafields = mapProductMetafields([
    {
      key: "ingredient_details",
      type: "list.metaobject_reference",
      value: "[]",
      references: {
        nodes: [{
          fields: [
            { key: "name", value: "Magnesium Bisglycinate" },
            { key: "amount", value: "170 mg" },
            { key: "purpose", value: "Supports normal muscle function." },
            { key: "why_included", value: "A highly bioavailable magnesium form." },
            { key: "image", value: "gid://shopify/MediaImage/1", reference: { image: { url: "https://cdn.shopify.com/magnesium.png", altText: "Magnesium powder" } } },
          ],
        }],
      },
    },
    {
      key: "science_visual",
      type: "file_reference",
      value: "gid://shopify/MediaImage/2",
      reference: { image: { url: "https://cdn.shopify.com/science.png", altText: "Formula science visual" } },
    },
  ]);

  assert.deepEqual(metafields?.ingredientDetails, [{
    name: "Magnesium Bisglycinate",
    amount: "170 mg",
    purpose: "Supports normal muscle function.",
    whyIncluded: "A highly bioavailable magnesium form.",
    image: "https://cdn.shopify.com/magnesium.png",
  }]);
  assert.deepEqual(metafields?.scienceVisual, {
    src: "https://cdn.shopify.com/science.png",
    alt: "Formula science visual",
  });
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

test("keeps approved editorial ingredient cards until Shopify provides rich ingredient references", () => {
  const editorialWithIngredient = {
    ...previewProduct,
    ingredients: [{ name: "Creatine", amount: "6 g", purpose: "Supports performance.", image: "/creatine.png" }],
  };
  const product = mergeShopifyProduct(
    editorialWithIngredient,
    {
      ...shopifyProduct,
      metafields: mapProductMetafields([
        { key: "ingredients", type: "single_line_text_field", value: "Creatine Monohydrate" },
      ]),
    },
    "GB",
  );

  assert.deepEqual(product.ingredients, editorialWithIngredient.ingredients);
});

test("ignores invalid JSON metafields instead of throwing", () => {
  const metafields = mapProductMetafields([
    { key: "benefit_cards", type: "json", value: "not-json" },
    { key: "hero_bullets", type: "multi_line_text_field", value: "Focus\nClarity" },
  ]);

  assert.equal(metafields?.benefitCards, undefined);
  assert.equal(metafields?.heroBullets, "Focus\nClarity");
});

test("keeps partial Shopify-only PDPs grounded in returned metafields only", () => {
  const partialProduct = createShopifyProduct(
    {
      ...shopifyProduct,
      handle: "partial-shopify-formula",
      metafields: mapProductMetafields([
        { key: "pdp_subtitle", type: "single_line_text_field", value: "Test subtitle" },
        { key: "short_description", type: "multi_line_text_field", value: "Test description for verification" },
        { key: "ingredients", type: "single_line_text_field", value: "Test Ingredient Complex" },
      ]),
    },
    "GB",
  );

  assert.equal(partialProduct.tagline, "Test subtitle");
  assert.equal(partialProduct.description, "Test description for verification");
  assert.deepEqual(partialProduct.ingredients, [{ name: "Test Ingredient Complex", amount: "", purpose: "" }]);
  assert.deepEqual(partialProduct.benefits, []);
  assert.deepEqual(partialProduct.whyItems, []);
  assert.deepEqual(partialProduct.comparisonRows, []);
  assert.deepEqual(partialProduct.supplementFacts, []);
  assert.deepEqual(partialProduct.faq, []);
});

/*
 * Regression guards for content the mapper used to discard silently.
 * All three shapes below are what the live store actually holds.
 */
test("accepts faqs authored as question/answer pairs", () => {
  const metafields = mapProductMetafields([
    { key: "faqs", type: "json", value: '[{"question":"How do I take it?","answer":"Two capsules with food."}]' },
  ]);

  assert.deepEqual(metafields?.faqs, [{ title: "How do I take it?", text: "Two capsules with food." }]);
});

test("accepts title-only rows, which is how trust badges and evidence are authored", () => {
  const metafields = mapProductMetafields([
    { key: "trust_badges", type: "json", value: '[{"title":"Third-party tested"}]' },
    { key: "clinical_evidence", type: "json", value: '[{"title":"27+ published studies reviewed"}]' },
  ]);

  assert.deepEqual(metafields?.trustBadges, [{ title: "Third-party tested", text: "" }]);
  assert.deepEqual(metafields?.clinicalEvidence, [{ title: "27+ published studies reviewed", text: "" }]);
});

/*
 * The parser accepting a title-only row was only half the job: `trustNotes` and
 * `evidencePoints` mapped `.text` straight out, so eight products in the live store were
 * rendering blank rows for fields that audited as populated. The content is the title.
 */
test("a title-only row renders its title, not an empty string", () => {
  const metafields = mapProductMetafields([
    { key: "trust_badges", type: "json", value: '[{"title":"Third-party tested"}]' },
    { key: "clinical_evidence", type: "json", value: '[{"title":"27+ published studies reviewed"}]' },
  ]);

  const shopifyOnly = createShopifyProduct({ ...shopifyProduct, metafields }, "AE");
  assert.deepEqual(shopifyOnly.trustNotes, ["Third-party tested"]);
  assert.deepEqual(shopifyOnly.evidencePoints, ["27+ published studies reviewed"]);

  const merged = mergeShopifyProduct(previewProduct, { ...shopifyProduct, metafields }, "AE");
  assert.deepEqual(merged.trustNotes, ["Third-party tested"]);
  assert.deepEqual(merged.evidencePoints, ["27+ published studies reviewed"]);
});

test("a row with a body but no heading is still rejected", () => {
  const metafields = mapProductMetafields([
    { key: "trust_badges", type: "json", value: '[{"text":"orphaned body copy"}]' },
  ]);

  assert.equal(metafields?.trustBadges, undefined);
});

/*
 * Warnings are sentences, not comma-delimited terms. Splitting on commas turned one
 * warning into three bullets, one of which was the single word "breastfeeding".
 */
test("warnings split on newlines only, so commas inside a sentence survive", () => {
  const warning = "Consult your healthcare professional before use if you are pregnant, breastfeeding, or taking medication.";
  const merged = mergeShopifyProduct(
    previewProduct,
    { ...shopifyProduct, metafields: mapProductMetafields([{ key: "warnings", type: "multi_line_text_field", value: warning }]) },
    "AE",
  );

  assert.ok(merged.warnings.includes(warning), "the sentence must survive intact");
  assert.ok(!merged.warnings.includes("breastfeeding"), "must not split into fragments");
});

test("comma-delimited term lists still split, so tags are unaffected", () => {
  const metafields = mapProductMetafields([
    { key: "hero_tags", type: "single_line_text_field", value: "Cellular Energy, Healthy Aging, NAD+ Support" },
  ]);
  const merged = mergeShopifyProduct(previewProduct, { ...shopifyProduct, metafields }, "AE");

  assert.deepEqual(merged.tags, ["Cellular Energy", "Healthy Aging", "NAD+ Support"]);
});
