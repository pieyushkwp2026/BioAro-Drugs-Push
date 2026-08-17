#!/usr/bin/env node

/*
 * Import PDP content for the 20 Rocktomic products from the content master workbook.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS EXISTS TO FIX
 *
 * All 20 products are live and sellable with 34–44 metafields filled, and not one of them
 * has a single ingredient card. Two carry LONgevity+'s copy, because they were populated
 * from a template and the reference-backed and JSON fields were never revisited.
 *
 * THE WORKBOOK IS THE SOURCE. Nothing here is authored, inferred or paraphrased: every
 * value is read from a cell. Doses in particular are copied verbatim, including the rows
 * that read "see label", because that is what the label says.
 *
 * ---------------------------------------------------------------------------
 * TWO RULES THAT ARE NOT NEGOTIABLE
 *
 * 1. IT NEVER WRITES A PRODUCT TITLE. The workbook still carries the pre-rename names
 *    (Joint Flex, Ultra Test, Natural PCT, Vitamin K2 + D3, Energized Aminos, Adrenal
 *    Support Plus). Shopify has FlexMotion, AndroCore, Hormone Reset, BoneVital,
 *    AminoBoost and StressAdapt, and those are final. Writing names from this sheet would
 *    rename six products backwards. The sheet's Handle column is the key; its name column
 *    is used only for console output.
 *
 * 2. EVERY INGREDIENT CARD IS PER PRODUCT. Cards are created with a handle suffixed by
 *    the product handle, so two products can never reference the same card. That is the
 *    SleepO defect made structurally impossible rather than merely avoided.
 *
 * Dry run by default. --apply writes.
 * ---------------------------------------------------------------------------
 */

import process from "node:process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import zlib from "node:zlib";

const APPLY = process.argv.includes("--apply");
const bookArg = process.argv.indexOf("--book");
const BOOK =
  bookArg !== -1
    ? process.argv[bookArg + 1]
    : "/Users/pieyush/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/255956DA-F5E1-44C9-B07D-9E1A66E57811/BioAro-US-PDP-Content-Master-v2.xlsx";

/* Contaminated fields with no replacement in the workbook. Everything else the sheet
   covers is fixed by being overwritten. */
const DELETE_FIELDS = { "joint-flex": ["science_steps"] };

/*
 * Six products were renamed in Shopify after this workbook was written, and the old name
 * is not only in its name column — it is inside the FAQ copy: "What is Joint Flex designed
 * to support?" on a product called FlexMotion. Writing that verbatim would publish the
 * wrong product name to customers.
 *
 * The substitution is deliberately narrow: FAQ text only. Directions, warnings and
 * allergen statements are label copy and are never rewritten, and none of them mentions a
 * product name anyway (verified against the payload).
 */
const RENAMED = {
  "joint-flex": ["Joint Flex", "FlexMotion"],
  "natural-pct": ["Natural PCT", "Hormone Reset"],
  "ultra-test": ["Ultra Test", "AndroCore"],
  "vitamin-k2-d3": ["Vitamin K2 + D3", "BoneVital"],
  "energized-aminos": ["Energized Aminos", "AminoBoost"],
  "adrenal-support-plus": ["Adrenal Support Plus", "StressAdapt"],
};

const renames = [];

function withCurrentName(handle, text) {
  const pair = RENAMED[handle];
  if (!pair || !text) return text;
  const [old, current] = pair;
  if (!text.includes(old)) return text;
  renames.push({ handle, from: old, to: current });
  return text.split(old).join(current);
}

const shopDomain = process.env.SHOPIFY_ADMIN_SHOP_DOMAIN;
const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION ?? "2026-07";
const endpoint = shopDomain ? `https://${shopDomain}/admin/api/${apiVersion}/graphql.json` : null;

if (!endpoint || !accessToken) {
  console.error("SHOPIFY_ADMIN_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are required.");
  process.exit(1);
}

/* ------------------------------------------------------------------ xlsx reader
 * Minimal on purpose: no openpyxl here, and this workbook stores its strings INLINE
 * rather than in sharedStrings.xml, so a reader that only handles shared strings comes
 * back empty. Central directory parse + inline-string extraction is all that is needed.
 */
function readXlsx(path) {
  const buf = readFileSync(path);
  const files = new Map();
  let offset = buf.length - 22;
  while (offset > 0 && buf.readUInt32LE(offset) !== 0x06054b50) offset -= 1;
  let entry = buf.readUInt32LE(offset + 16);
  const count = buf.readUInt16LE(offset + 10);

  for (let i = 0; i < count; i += 1) {
    const nameLength = buf.readUInt16LE(entry + 28);
    const extraLength = buf.readUInt16LE(entry + 30);
    const commentLength = buf.readUInt16LE(entry + 32);
    const localOffset = buf.readUInt32LE(entry + 42);
    const name = buf.toString("utf8", entry + 46, entry + 46 + nameLength);

    const method = buf.readUInt16LE(localOffset + 8);
    const compressedSize = buf.readUInt32LE(localOffset + 18);
    const localNameLength = buf.readUInt16LE(localOffset + 26);
    const localExtraLength = buf.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const raw = buf.subarray(start, start + compressedSize);

    files.set(name, method === 0 ? raw : zlib.inflateRawSync(raw));
    entry += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

function sheetCells(xml) {
  const text = xml.toString("utf8");
  const cells = new Map();
  const cellRe = /<c r="([A-Z]+)(\d+)"[^>]*>([\s\S]*?)<\/c>/g;
  let match;
  while ((match = cellRe.exec(text))) {
    const [, col, row, body] = match;
    const inline = [...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join("");
    const plain = body.match(/<v>([\s\S]*?)<\/v>/);
    const value = (inline || plain?.[1] || "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    if (value) cells.set(`${col}${row}`, value);
  }
  return cells;
}

const book = readXlsx(BOOK);
const sheet = (n) => sheetCells(book.get(`xl/worksheets/sheet${n}.xml`));
const OVERVIEW = sheet(1);
const BENEFITS = sheet(2);
const ACTIVES = sheet(3);
const FACTS = sheet(4);
const FAQS = sheet(5);
const DIRECTIONS = sheet(6);

const rowsOf = (cells) => [...new Set([...cells.keys()].map((k) => Number(k.match(/\d+/)[0])))].filter((r) => r > 1).sort((a, b) => a - b);
const at = (cells, col, row) => cells.get(`${col}${row}`) ?? "";

/* ------------------------------------------------------- assemble per product */
const products = new Map();
for (const row of rowsOf(OVERVIEW)) {
  const sku = at(OVERVIEW, "B", row);
  const handle = at(OVERVIEW, "E", row);
  if (!sku || !handle) continue;
  products.set(sku, {
    sku,
    handle,
    sheetName: at(OVERVIEW, "C", row),
    category: at(OVERVIEW, "F", row),
    format: at(OVERVIEW, "G", row),
    servingSize: at(OVERVIEW, "H", row),
    servingsPerContainer: at(OVERVIEW, "I", row),
    benefits: [],
    actives: [],
    factRows: [],
    otherIngredients: "",
    faqs: [],
    directions: "",
    warnings: "",
    allergens: "",
  });
}

for (const row of rowsOf(BENEFITS)) {
  const p = products.get(at(BENEFITS, "A", row));
  if (!p) continue;
  for (const [t, d] of [["C", "D"], ["E", "F"], ["G", "H"]]) {
    const title = at(BENEFITS, t, row);
    const description = at(BENEFITS, d, row);
    if (title) p.benefits.push(description ? { title, description } : { title });
  }
}

for (const row of rowsOf(ACTIVES)) {
  const p = products.get(at(ACTIVES, "A", row));
  if (!p) continue;
  const name = at(ACTIVES, "D", row);
  if (!name) continue;
  p.actives.push({ name, amount: at(ACTIVES, "E", row), purpose: at(ACTIVES, "F", row) });
}

for (const row of rowsOf(FACTS)) {
  const p = products.get(at(FACTS, "A", row));
  if (!p) continue;
  const label = at(FACTS, "E", row);
  if (label) {
    const amount = [at(FACTS, "F", row), at(FACTS, "G", row)].filter(Boolean).join(" ");
    const dv = at(FACTS, "H", row);
    const value = [amount, dv && `(${dv})`].filter(Boolean).join(" ");
    if (value) p.factRows.push({ label, value });
  }
  if (!p.otherIngredients) p.otherIngredients = at(FACTS, "I", row);
  if (!p.servingSize) p.servingSize = at(FACTS, "C", row);
  if (!p.servingsPerContainer) p.servingsPerContainer = at(FACTS, "D", row);
}

for (const row of rowsOf(FAQS)) {
  const p = products.get(at(FAQS, "A", row));
  if (!p) continue;
  for (const [q, a] of [["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"], ["K", "L"], ["M", "N"]]) {
    const question = at(FAQS, q, row);
    const answer = at(FAQS, a, row);
    if (question && answer)
      p.faqs.push({
        question: withCurrentName(p.handle, question),
        answer: withCurrentName(p.handle, answer),
      });
  }
}

for (const row of rowsOf(DIRECTIONS)) {
  const p = products.get(at(DIRECTIONS, "A", row));
  if (!p) continue;
  p.directions = at(DIRECTIONS, "C", row);
  p.warnings = at(DIRECTIONS, "D", row);
  p.allergens = at(DIRECTIONS, "E", row);
  if (at(DIRECTIONS, "F", row)) p.otherIngredients = at(DIRECTIONS, "F", row);
}

/* ------------------------------------------------------------- update objects */
function updatesFor(p) {
  const out = [];
  const push = (key, type, value) => {
    const empty = value === "" || value === undefined || value === null || (Array.isArray(value) && !value.length);
    if (!empty) out.push({ productHandle: p.handle, metafieldKey: key, metafieldNamespace: "custom", metafieldType: type, value });
  };

  push("category", "single_line_text_field", p.category);
  push("product_format", "single_line_text_field", p.format);
  push("serving_size", "single_line_text_field", p.servingSize);
  push("servings_per_container", "single_line_text_field", p.servingsPerContainer);
  push("directions", "multi_line_text_field", p.directions);
  push("warnings", "multi_line_text_field", p.warnings);
  push("allergen_info", "multi_line_text_field", p.allergens);
  push("other_ingredients", "multi_line_text_field", p.otherIngredients);
  /* The flat text list. Overwriting it is what clears FlexMotion's LONgevity+ actives. */
  push("ingredients", "single_line_text_field", p.actives.map((a) => a.name).join(", "));
  push("benefit_cards", "json", p.benefits);
  push("faqs", "json", p.faqs);
  push("supplement_facts_rows", "json", p.factRows);
  return out;
}

const all = [...products.values()];
const updates = all.flatMap(updatesFor);

const stamp = new Date().toISOString().slice(0, 10);
const dir = `migration-reports/${stamp}`;
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/pdp-content-updates.json`, `${JSON.stringify(updates, null, 2)}\n`);

console.log(`Workbook: ${BOOK.split("/").pop()}`);
console.log(`${all.length} products, ${updates.length} metafield updates, ${all.reduce((n, p) => n + p.actives.length, 0)} ingredient cards\n`);
console.log("handle                  cat/fmt  actives facts faqs benefits  dir/warn/allerg");
for (const p of all) {
  console.log(
    `${p.handle.padEnd(23)} ${(p.category ? "y" : "-") + "/" + (p.format ? "y" : "-")}      ` +
      `${String(p.actives.length).padStart(2)}     ${String(p.factRows.length).padStart(3)}   ${String(p.faqs.length).padStart(2)}    ${String(p.benefits.length).padStart(2)}       ` +
      `${p.directions ? "y" : "-"}/${p.warnings ? "y" : "-"}/${p.allergens ? "y" : "-"}`,
  );
}
if (renames.length) {
  const grouped = renames.reduce((acc, r) => ({ ...acc, [r.handle]: (acc[r.handle] ?? 0) + 1 }), {});
  console.log("\nFAQ copy corrected to the current product name:");
  for (const [handle, count] of Object.entries(grouped)) {
    const [old, current] = RENAMED[handle];
    console.log(`  ${handle.padEnd(23)} "${old}" -> "${current}"  (${count} place${count === 1 ? "" : "s"})`);
  }
}

console.log(`\nWrote ${dir}/pdp-content-updates.json`);

/* ------------------------------------------------------------------- Shopify */
/*
 * Retries on throttling rather than aborting.
 *
 * The first run of this script stopped after sixteen products: twenty products times up
 * to four metaobject creates plus a metafieldsSet drains the Admin API's cost bucket, and
 * a thrown THROTTLED error killed the loop midway. Backing off and retrying is the
 * difference between a resumable import and a half-finished one.
 */
async function graphql(query, variables = {}, attempt = 1) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 429 || response.status >= 500) {
    if (attempt > 6) throw new Error(`Shopify returned ${response.status} after ${attempt} attempts`);
    await new Promise((r) => setTimeout(r, 1000 * attempt * attempt));
    return graphql(query, variables, attempt + 1);
  }
  if (!response.ok) throw new Error(`Shopify returned ${response.status} ${response.statusText}`);

  const json = await response.json();
  const throttled = json.errors?.some((e) => /throttl/i.test(e.message ?? "") || e.extensions?.code === "THROTTLED");
  if (throttled) {
    if (attempt > 6) throw new Error("Still throttled after 6 attempts");
    await new Promise((r) => setTimeout(r, 1000 * attempt * attempt));
    return graphql(query, variables, attempt + 1);
  }
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

function assertNoUserErrors(payload, label) {
  const errors = payload?.userErrors ?? [];
  if (errors.length) throw new Error(`${label}: ${errors.map((e) => `${e.field} ${e.message}`).join("; ")}`);
  return payload;
}

/* Resolve every handle before writing anything. A handle the store does not have is a
   stop, not a create: this script must never invent a product. */
const resolved = new Map();
const missing = [];
for (const p of all) {
  const data = await graphql(
    `query($q: String!) { products(first: 1, query: $q) { nodes { id handle title metafields(first: 250) { nodes { key value } } } } }`,
    { q: `handle:${p.handle}` },
  );
  const node = data.products.nodes[0];
  if (!node || node.handle !== p.handle) missing.push(p.handle);
  else resolved.set(p.handle, node);
}

if (missing.length) {
  console.error(`\nNot found in Shopify: ${missing.join(", ")}`);
  console.error("Refusing to continue — this script does not create products.");
  process.exit(1);
}
console.log(`\nAll ${resolved.size} handles resolved in Shopify.`);
for (const p of all) {
  const live = resolved.get(p.handle);
  if (live.title !== p.sheetName) console.log(`  note: ${p.handle} is "${live.title}" in Shopify, "${p.sheetName}" in the sheet — Shopify wins, no title is written`);
}

const snapshot = all.map((p) => {
  const live = resolved.get(p.handle);
  const values = new Map(live.metafields.nodes.map((m) => [m.key, m.value]));
  const keys = [...new Set([...updatesFor(p).map((u) => u.metafieldKey), ...(DELETE_FIELDS[p.handle] ?? []), "ingredient_details"])];
  return { handle: p.handle, productId: live.id, before: Object.fromEntries(keys.map((k) => [k, values.get(k) ?? null])) };
});
writeFileSync(`${dir}/pdp-content-prefix-snapshot.json`, `${JSON.stringify({ takenAt: new Date().toISOString(), shopDomain, snapshot }, null, 2)}\n`);
console.log(`Snapshot written to ${dir}/pdp-content-prefix-snapshot.json`);

if (!APPLY) {
  console.log("\nDry run. Re-run with --apply to write.");
  process.exit(0);
}

const handleArgs = process.argv.flatMap((a, i) => (a === "--handle" ? [process.argv[i + 1]] : []));
const targets = handleArgs.length ? all.filter((p) => handleArgs.includes(p.handle)) : all;

console.log(`\nApplying to ${targets.length} product(s)…`);
for (const p of targets) {
  const live = resolved.get(p.handle);

  /*
   * Idempotent. A product that already has its cards is left alone rather than having a
   * second set created beside the first — this script has to be safe to re-run after a
   * partial import, which is exactly how the first run ended.
   */
  const existing = live.metafields.nodes.find((m) => m.key === "ingredient_details");
  let existingCount = 0;
  try { existingCount = JSON.parse(existing?.value ?? "[]").length; } catch { existingCount = 0; }
  if (existingCount > 0) {
    console.log(`  ${p.handle.padEnd(23)} already has ${existingCount} cards, skipping`);
    continue;
  }

  /* Ingredient cards first, so ingredient_details is set in the same pass as the rest. */
  const cardIds = [];
  for (const active of p.actives) {
    const slug = `${active.name} ${p.handle}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
    const fields = [{ key: "name", value: active.name }];
    if (active.amount) fields.push({ key: "amount", value: active.amount });
    if (active.purpose) fields.push({ key: "purpose", value: active.purpose });

    const result = (
      await graphql(
        `mutation($metaobject: MetaobjectCreateInput!) {
          metaobjectCreate(metaobject: $metaobject) { metaobject { id } userErrors { field message } }
        }`,
        { metaobject: { type: "ingredient", handle: slug, capabilities: { publishable: { status: "ACTIVE" } }, fields } },
      )
    ).metaobjectCreate;

    if (result.userErrors?.length) {
      /* A handle already taken means a previous run created this exact card. Reuse it —
         creating a near-duplicate under a suffixed handle is how a store ends up with two
         of everything. */
      const taken = result.userErrors.some((e) => /taken|already exists/i.test(e.message ?? ""));
      if (!taken) throw new Error(`metaobjectCreate ${slug}: ${result.userErrors.map((e) => e.message).join("; ")}`);
      const found = await graphql(
        `query($type: String!, $handle: String!) { metaobjectByHandle(handle: { type: $type, handle: $handle }) { id } }`,
        { type: "ingredient", handle: slug },
      );
      if (!found.metaobjectByHandle?.id) throw new Error(`metaobjectCreate ${slug}: handle taken but not findable`);
      cardIds.push(found.metaobjectByHandle.id);
      continue;
    }
    cardIds.push(result.metaobject.id);
  }

  const metafields = updatesFor(p).map((u) => ({
    ownerId: live.id,
    namespace: "custom",
    key: u.metafieldKey,
    type: u.metafieldType,
    value: u.metafieldType === "json" ? JSON.stringify(u.value) : String(u.value),
  }));
  if (cardIds.length) {
    metafields.push({
      ownerId: live.id,
      namespace: "custom",
      key: "ingredient_details",
      type: "list.metaobject_reference",
      value: JSON.stringify(cardIds),
    });
  }

  for (let i = 0; i < metafields.length; i += 25) {
    assertNoUserErrors(
      (
        await graphql(
          `mutation($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) { metafields { key } userErrors { field message } }
          }`,
          { metafields: metafields.slice(i, i + 25) },
        )
      ).metafieldsSet,
      `metafieldsSet ${p.handle}`,
    );
  }

  const toDelete = DELETE_FIELDS[p.handle] ?? [];
  if (toDelete.length) {
    assertNoUserErrors(
      (
        await graphql(
          `mutation($metafields: [MetafieldIdentifierInput!]!) {
            metafieldsDelete(metafields: $metafields) { deletedMetafields { key } userErrors { field message } }
          }`,
          { metafields: toDelete.map((key) => ({ ownerId: live.id, namespace: "custom", key })) },
        )
      ).metafieldsDelete,
      `metafieldsDelete ${p.handle}`,
    );
  }

  console.log(`  ${p.handle.padEnd(23)} ${cardIds.length} cards, ${metafields.length} fields${toDelete.length ? `, deleted ${toDelete.join(",")}` : ""}`);
}

console.log("\nDone. Re-run scripts/shopify-field-matrix.mjs to verify.");
