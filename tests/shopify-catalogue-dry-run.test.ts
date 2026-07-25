import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const script = join(repoRoot, "scripts", "shopify-catalogue-dry-run.mjs");

function runDryRun() {
  const output = mkdtempSync(join(tmpdir(), "bioaro-shopify-dry-run-"));
  const stdout = execFileSync(process.execPath, [script, "--output", output], { cwd: repoRoot, encoding: "utf8" });
  return { output, stdout };
}

test("extracts one migration manifest record for each frozen storefront product", () => {
  const { output, stdout } = runDryRun();
  const report = JSON.parse(readFileSync(join(output, "migration-manifest.json"), "utf8"));

  assert.match(stdout, /Shopify mutations performed: 0/);
  assert.equal(report.sourceCommit, "2191f22d39e952c35d0df543336496bd28b388c9");
  assert.equal(report.products.length, 7);
  assert.deepEqual(report.products.map((record: { product: { handle: string } }) => record.product.handle), [
    "longevity-plus", "cellomega-plus", "creagen-brain-boost", "creagen-femme-energy",
    "creagen-raw-power", "creagen-pro-power", "glutara",
  ]);
});

test("reports field compatibility as approval-only and preserves source asset references", () => {
  const { output } = runDryRun();
  const compatibility = JSON.parse(readFileSync(join(output, "field-compatibility-report.json"), "utf8"));
  const assets = JSON.parse(readFileSync(join(output, "asset-inventory.json"), "utf8"));
  const plan = JSON.parse(readFileSync(join(output, "dry-run-plan.json"), "utf8"));

  assert.ok(compatibility.length > 0);
  assert.ok(compatibility.every((field: { action: string }) => field.action === "skip_until_definition_is_verified_and_approved"));
  assert.ok(assets.assets.some((asset: { role: string }) => asset.role === "ingredient_image"));
  assert.ok(assets.assets.every((asset: { existsAtSourceCommit: boolean }) => asset.existsAtSourceCommit));
  assert.deepEqual(plan.prohibitedOperations, ["product create", "product update", "file upload", "metafield write", "definition create", "publication", "price update"]);
  assert.ok(existsSync(join(output, "errors.json")));
});
