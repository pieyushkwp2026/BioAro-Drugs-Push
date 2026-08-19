#!/usr/bin/env node

/*
 * Shopify PDP glossary importer.
 *
 * Default mode is read-only. It creates reviewable reports and never mutates Shopify.
 * Applying content requires both --apply and --confirm-workbook-import.
 */
import process from "node:process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import zlib from "node:zlib";

const DEFAULT_BOOK = "/Users/pieyush/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/BDD85B5C-6C46-4802-B28B-94714F53D2A5/BioAro_PDP_Glossary_UPDATED.xlsx";
const workbookPath = process.argv.includes("--book")
  ? process.argv[process.argv.indexOf("--book") + 1]
  : DEFAULT_BOOK;
const apply = process.argv.includes("--apply");
const confirmed = process.argv.includes("--confirm-workbook-import");
const workbookOnly = process.argv.includes("--workbook-only");

const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";
const endpoint = shopDomain ? `https://${shopDomain}/admin/api/${apiVersion}/graphql.json` : null;

if (apply && !confirmed) {
  throw new Error("Refusing to apply: pass --confirm-workbook-import after reviewing the generated reports.");
}
if (!workbookOnly && (!endpoint || !accessToken)) {
  throw new Error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
}

/* This workbook uses inline strings. The small reader intentionally avoids a second
   spreadsheet dependency and preserves cell text, including units and line breaks. */
function readXlsx(path) {
  const buffer = readFileSync(path);
  const files = new Map();
  let eocd = buffer.length - 22;
  while (eocd > 0 && buffer.readUInt32LE(eocd) !== 0x06054b50) eocd -= 1;
  let entry = buffer.readUInt32LE(eocd + 16);
  const count = buffer.readUInt16LE(eocd + 10);
  for (let i = 0; i < count; i += 1) {
    const nameLength = buffer.readUInt16LE(entry + 28);
    const extraLength = buffer.readUInt16LE(entry + 30);
    const commentLength = buffer.readUInt16LE(entry + 32);
    const localOffset = buffer.readUInt32LE(entry + 42);
    const name = buffer.toString("utf8", entry + 46, entry + 46 + nameLength);
    const method = buffer.readUInt16LE(localOffset + 8);
    const size = buffer.readUInt32LE(localOffset + 18);
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buffer.subarray(start, start + size);
    files.set(name, method === 0 ? raw : zlib.inflateRawSync(raw));
    entry += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

function worksheetCells(files) {
  const xml = files.get("xl/worksheets/sheet1.xml")?.toString("utf8") ?? "";
  const cells = new Map();
  for (const match of xml.matchAll(/<c r="([A-Z]+)(\d+)"[^>]*>([\s\S]*?)<\/c>/g)) {
    const [, col, row, body] = match;
    const inline = [...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join("");
    const plain = body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
    const value = (inline || plain)
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
    if (value) cells.set(`${col}${row}`, value);
  }
  return cells;
}

const cells = worksheetCells(readXlsx(workbookPath));
const at = (col, row) => cells.get(`${col}${row}`) ?? "";
const columns = [];
for (let col = 1; col <= 65; col += 1) {
  let n = col;
  let name = "";
  while (n) { const rem = (n - 1) % 26; name = String.fromCharCode(65 + rem) + name; n = Math.floor((n - 1) / 26); }
  columns.push(name);
}
const headers = columns.map((col) => at(col, 5));
const field = (row, label) => at(columns[headers.indexOf(label)], row);
const products = [];
for (let row = 6; row <= 35; row += 1) {
  const sku = field(row, "SKU");
  if (!sku) continue;
  products.push(Object.fromEntries(headers.map((header) => [header, field(row, header)])));
}

const requiredHeaders = ["SKU", "PDP Display Name", "PDP Slug / Handle", "Approval / Publish Status"];
for (const header of requiredHeaders) if (!headers.includes(header)) throw new Error(`Workbook is missing required column: ${header}`);
const duplicate = (key) => [...products.reduce((map, product) => map.set(product[key], (map.get(product[key]) ?? 0) + 1), new Map())]
  .filter(([, count]) => count > 1).map(([value]) => value);
const duplicateSkus = duplicate("SKU");
const duplicateHandles = duplicate("PDP Slug / Handle");

const READY = "Ready for review";
const BLOCK_MARKERS = /TBC|confirm|blocked|pending|not supplied|source required|requires|do not design/i;
const isBlocked = (product) => product["Approval / Publish Status"] !== READY || Object.values(product).some((value) => BLOCK_MARKERS.test(value));

const scalarMap = {
  "Product Badge / Eyebrow": ["hero_eyebrow", "single_line_text_field"],
  "Hero Subtitle / Short Description": ["pdp_subtitle", "single_line_text_field"],
  "Long Description": ["short_description", "multi_line_text_field"],
  "Benefit / Use-case Tags": ["hero_tags", "single_line_text_field"],
  "Pack / Count": ["pack_name", "single_line_text_field"],
  "Serving Size": ["serving_size", "single_line_text_field"],
  "Servings / Container": ["servings_per_container", "single_line_text_field"],
  "Format / Formula Type": ["product_format", "single_line_text_field"],
  "Availability / Region Readiness": ["availability_note", "multi_line_text_field"],
  "How to Use / Directions": ["directions", "multi_line_text_field"],
  "Who Is It For?": ["best_for_description", "multi_line_text_field"],
  "Warnings": ["warnings", "multi_line_text_field"],
  "Allergens": ["allergen_info", "multi_line_text_field"],
  "Other Ingredients": ["other_ingredients", "multi_line_text_field"],
  "Formula Intro / Why Formula Exists": ["why_formula_body", "multi_line_text_field"],
  "Quality / Testing": ["clinical_evidence", "multi_line_text_field"],
};
async function graphql(query, variables = {}) {
  const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken }, body: JSON.stringify({ query, variables }) });
  const json = await response.json();
  if (!response.ok || json.errors?.length) throw new Error(JSON.stringify(json.errors ?? json));
  return json.data;
}

const definitions = workbookOnly
  ? []
  : (await graphql(`query { metafieldDefinitions(first: 250, ownerType: PRODUCT) { nodes { namespace key type { name } access { storefront } } } }`)).metafieldDefinitions.nodes;
const definitionByKey = new Map(definitions.filter((d) => d.namespace === "custom").map((d) => [d.key, d]));
const metaobjectDefinitions = workbookOnly
  ? []
  : (await graphql(`query { metaobjectDefinitions(first: 100) { nodes { type name } } }`)).metaobjectDefinitions.nodes;
const metaobjectTypeByName = new Map(metaobjectDefinitions.map((definition) => [definition.name, definition.type]));
const shopifyProducts = [];
if (!workbookOnly) {
  let cursor = null;
  do {
    const data = await graphql(`query($after: String) { products(first: 100, after: $after) { pageInfo { hasNextPage endCursor } nodes { id handle title status publishedAt variants(first: 10) { nodes { sku } } } } }`, { after: cursor });
    shopifyProducts.push(...data.products.nodes);
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (cursor);
}

const matches = products.map((product) => {
  const bySku = shopifyProducts.filter((live) => live.variants.nodes.some((variant) => variant.sku === product.SKU));
  const byHandle = shopifyProducts.filter((live) => live.handle === product["PDP Slug / Handle"]);
  const live = bySku.length === 1 && byHandle.length === 1 && bySku[0].id === byHandle[0].id ? bySku[0] : null;
  const fields = [];
  for (const [source, [key, expectedType]] of Object.entries(scalarMap)) {
    const value = product[source];
    if (!value || BLOCK_MARKERS.test(value)) continue;
    const definition = definitionByKey.get(key);
    fields.push({ source, target: `custom.${key}`, expectedType, actualType: definition?.type?.name ?? null, storefront: definition?.access?.storefront ?? null, status: !definition ? "unsupported" : definition.type.name !== expectedType ? "type-mismatch" : "supported" });
  }
  return { sku: product.SKU, handle: product["PDP Slug / Handle"], workbookName: product["PDP Display Name"], liveProduct: live ? { id: live.id, title: live.title, status: live.status, publishedAt: live.publishedAt } : null, skuMatches: bySku.map((p) => p.handle), handleMatches: byHandle.map((p) => p.handle), blocked: isBlocked(product), approvalStatus: product["Approval / Publish Status"], fields };
});

function contentUpdates(product, match) {
  const updates = [];
  for (const [source, [key, expectedType]] of Object.entries(scalarMap)) {
    const value = product[source];
    const field = match.fields.find((item) => item.source === source);
    if (!value || BLOCK_MARKERS.test(value) || field?.status !== "supported") continue;
    updates.push({ namespace: "custom", key, type: expectedType, value });
  }
  const benefits = [1, 2, 3].flatMap((index) => {
    const title = product[`Benefit ${index} Title`];
    const description = product[`Benefit ${index} Description`];
    return title ? [`${title}${description ? `: ${description}` : ""}`] : [];
  });
  const heroBullets = benefits.join("\n");
  const heroDefinition = definitionByKey.get("hero_bullets");
  if (heroBullets && heroDefinition?.type?.name === "single_line_text_field") {
    updates.push({ namespace: "custom", key: "hero_bullets", type: "single_line_text_field", value: benefits.join(" | ") });
  }
  return updates;
}

function structuredValues(product) {
  const ingredients = [1, 2, 3].flatMap((index) => {
    const name = product[`Key Active ${index}`];
    if (!name || BLOCK_MARKERS.test(name)) return [];
    return [{ name, amount: product[`Amount ${index}`], purpose: product[`Why Included ${index}`] }];
  });
  const faqs = [1, 2, 3, 4, 5, 6].flatMap((index) => {
    const question = product[`FAQ ${index} — Question`];
    const answer = product[`FAQ ${index} — Answer`];
    return question && answer && !BLOCK_MARKERS.test(`${question} ${answer}`) ? [{ question, answer }] : [];
  });
  const facts = product["Supplement Facts / Formula"] && !BLOCK_MARKERS.test(product["Supplement Facts / Formula"])
    ? product["Supplement Facts / Formula"].split(/\r?\n+/).map((value, index) => value.trim()).filter(Boolean).map((value, index) => ({ label: `Supplement fact ${index + 1}`, value }))
    : [];
  return { ingredients, faqs, facts };
}

const stamp = new Date().toISOString().slice(0, 10);
const dir = `migration-reports/${stamp}/pdp-glossary`;
mkdirSync(dir, { recursive: true });
const write = (name, value) => writeFileSync(`${dir}/${name}`, `${JSON.stringify(value, null, 2)}\n`);
const blocked = matches.filter((match) => match.blocked);
const unsupported = matches.flatMap((match) => match.fields.filter((field) => field.status !== "supported").map((field) => ({ handle: match.handle, sku: match.sku, ...field })));
const importPlan = matches.map((match) => ({ ...match, action: !match.liveProduct ? "block-missing-or-ambiguous-match" : match.blocked ? "stage-draft-review" : "import-approved-content" }));

write("pdp-workbook-manifest.json", { workbookPath, productCount: products.length, products });
write("pdp-field-compatibility.json", { definitionCount: definitions.length, fields: scalarMap, unsupported });
write("pdp-import-plan.json", { generatedAt: new Date().toISOString(), namePolicy: "keep-current-shopify-title-and-handle", pricingPolicy: "content-only-no-price-writes", products: importPlan });
write("pdp-blocked-products.json", { products: blocked });
write("pdp-import-audit.json", { generatedAt: new Date().toISOString(), productCount: products.length, uniqueSkus: new Set(products.map((p) => p.SKU)).size, uniqueHandles: new Set(products.map((p) => p["PDP Slug / Handle"])).size, duplicateSkus, duplicateHandles, exactMatches: matches.filter((m) => m.liveProduct).length, ambiguousOrMissing: matches.filter((m) => !m.liveProduct), blockedCount: blocked.length, unsupported });

console.log(JSON.stringify({ workbook: workbookPath, products: products.length, ready: products.length - blocked.length, blocked: blocked.length, exactMatches: matches.filter((m) => m.liveProduct).length, ambiguousOrMissing: matches.filter((m) => !m.liveProduct).length, unsupportedFields: unsupported.length, reports: dir, mode: workbookOnly ? "workbook-only" : apply ? "apply-requested" : "read-only" }, null, 2));

if (!apply) {
  console.log("Read-only dry run complete. No Shopify mutations were made.");
  process.exit(0);
}

const matched = matches.filter((match) => match.liveProduct);
const skipped = matches.filter((match) => !match.liveProduct);
if (skipped.length) console.log(`Skipping ${skipped.length} unmatched product(s): ${skipped.map((item) => item.handle).join(", ")}`);

function assertNoUserErrors(payload, label) {
  const errors = payload?.userErrors ?? [];
  if (errors.length) throw new Error(`${label}: ${errors.map((error) => error.message).join("; ")}`);
}

async function upsertMetaobject(type, handle, fields) {
  const created = await graphql(`mutation($metaobject: MetaobjectCreateInput!) { metaobjectCreate(metaobject: $metaobject) { metaobject { id } userErrors { field message } } }`, {
    metaobject: { type, handle, fields },
  });
  const result = created.metaobjectCreate;
  if (!result.userErrors?.length) return result.metaobject.id;
  if (!result.userErrors.some((error) => /taken|already exists/i.test(error.message ?? ""))) {
    throw new Error(`metaobjectCreate ${handle}: ${result.userErrors.map((error) => error.message).join("; ")}`);
  }
  const found = await graphql(`query($type: String!, $handle: String!) { metaobjectByHandle(handle: { type: $type, handle: $handle }) { id } }`, { type, handle });
  if (!found.metaobjectByHandle?.id) throw new Error(`Existing metaobject ${type}/${handle} could not be resolved.`);
  return found.metaobjectByHandle.id;
}

for (const match of matched) {
  const product = products.find((item) => item.SKU === match.sku);
  const updates = contentUpdates(product, match);
  const structured = structuredValues(product);
  const ingredientType = metaobjectTypeByName.get("Ingredient") ?? "ingredient";
  const faqType = metaobjectTypeByName.get("FAQ") ?? "faq";
  const factType = metaobjectTypeByName.get("BioAro supplement fact row");
  const ingredientIds = [];
  for (const [index, item] of structured.ingredients.entries()) {
    ingredientIds.push(await upsertMetaobject(ingredientType, `${match.handle}-ingredient-${index + 1}`, [
      { key: "name", value: item.name },
      ...(item.amount ? [{ key: "amount", value: item.amount }] : []),
      ...(item.purpose ? [{ key: "purpose", value: item.purpose }] : []),
    ]));
  }
  const faqIds = [];
  for (const [index, item] of structured.faqs.entries()) {
    faqIds.push(await upsertMetaobject(faqType, `${match.handle}-faq-${index + 1}`, [
      { key: "question", value: item.question },
      { key: "answer", value: item.answer },
    ]));
  }
  const factIds = [];
  if (factType) {
    for (const [index, item] of structured.facts.entries()) {
      factIds.push(await upsertMetaobject(factType, `${match.handle}-fact-${index + 1}`, [
        { key: "label", value: item.label },
        { key: "value", value: item.value },
      ]));
    }
  }
  const ingredientDefinition = definitionByKey.get("ingredient_details");
  const faqDefinition = definitionByKey.get("faqs");
  const factsDefinition = definitionByKey.get("supplement_facts_rows");
  if (ingredientIds.length && ingredientDefinition?.type?.name === "list.metaobject_reference") {
    updates.push({ namespace: "custom", key: "ingredient_details", type: "list.metaobject_reference", value: JSON.stringify(ingredientIds) });
  }
  if (faqDefinition?.type?.name === "json" && structured.faqs.length) {
    updates.push({ namespace: "custom", key: "faqs", type: "json", value: JSON.stringify(structured.faqs.map((item) => ({ title: item.question, text: item.answer }))) });
  }
  if (factsDefinition?.type?.name === "json" && structured.facts.length) {
    updates.push({ namespace: "custom", key: "supplement_facts_rows", type: "json", value: JSON.stringify(structured.facts.map((item) => ({ title: item.label, text: item.value }))) });
  }
  const values = updates.map((update) => ({ ownerId: match.liveProduct.id, ...update }));
  for (let i = 0; i < values.length; i += 25) {
    const result = await graphql(`mutation($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { metafields { key } userErrors { field message code } } }`, { metafields: values.slice(i, i + 25) });
    assertNoUserErrors(result.metafieldsSet, `metafieldsSet ${match.handle}`);
  }

  if (match.blocked) {
    const result = await graphql(`mutation($input: ProductInput!) { productUpdate(input: $input) { product { id status } userErrors { field message } } }`, { input: { id: match.liveProduct.id, status: "DRAFT" } });
    assertNoUserErrors(result.productUpdate, `productUpdate ${match.handle}`);
  }
  console.log(`${match.blocked ? "DRAFT" : "LIVE  "} ${match.handle} (${updates.length} metafields)`);
}

console.log(`Applied ${matched.length - blocked.length} ready product(s) live and ${blocked.filter((item) => item.liveProduct).length} blocked product(s) as drafts.`);
