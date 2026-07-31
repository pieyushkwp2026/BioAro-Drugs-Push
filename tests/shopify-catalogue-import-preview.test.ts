import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const dryRunScript = join(repoRoot, "scripts", "shopify-catalogue-dry-run.mjs");
const previewScript = join(repoRoot, "scripts", "shopify-catalogue-import-preview.mjs");

test("builds a no-write import preview from the immutable source manifest", () => {
  const output = mkdtempSync(join(tmpdir(), "bioaro-shopify-import-preview-"));
  execFileSync(process.execPath, [dryRunScript, "--output", output], { cwd: repoRoot, encoding: "utf8" });
  const stdout = execFileSync(process.execPath, [previewScript, "--report-dir", output], { cwd: repoRoot, encoding: "utf8" });
  const preview = JSON.parse(readFileSync(join(output, "import-preview.json"), "utf8"));
  const scopes = JSON.parse(readFileSync(join(output, "write-scope-requirements.json"), "utf8"));

  assert.match(stdout, /Shopify mutations performed: 0/);
  assert.equal(preview.summary.sourceProductCount, 7);
  assert.equal(preview.summary.shopifyMutationsPerformed, 0);
  assert.equal(preview.products.filter((product: { productAction: { action: string } }) => product.productAction.action === "BLOCKED_AWAITING_READ_ONLY_SHOPIFY_AUDIT").length, 7);
  assert.ok(preview.products.every((product: { unresolvedCommercialData: string[] }) => product.unresolvedCommercialData.includes("AED market price")));
  assert.deepEqual(scopes.requiredForApprovedCoreProductsAndExistingMetafields, ["write_products"]);
  assert.deepEqual(scopes.requiredForApprovedProductAndPanelImages, ["write_files"]);
});

test("requires an explicit approval flag before planning an existing-product update", () => {
  const output = mkdtempSync(join(tmpdir(), "bioaro-shopify-import-preview-approved-"));
  execFileSync(process.execPath, [dryRunScript, "--output", output], { cwd: repoRoot, encoding: "utf8" });
  execFileSync(process.execPath, [previewScript, "--report-dir", output, "--approve-existing-product-updates"], { cwd: repoRoot, encoding: "utf8" });
  const preview = JSON.parse(readFileSync(join(output, "import-preview.json"), "utf8"));

  assert.equal(preview.summary.approvedExistingProductUpdates, true);
  assert.equal(preview.summary.shopifyMutationsPerformed, 0);
});

test("records an existing source handle as a replacement only with the explicit replacement flag", () => {
  const output = mkdtempSync(join(tmpdir(), "bioaro-shopify-import-preview-replacement-"));
  execFileSync(process.execPath, [dryRunScript, "--output", output], { cwd: repoRoot, encoding: "utf8" });
  execFileSync(process.execPath, [previewScript, "--report-dir", output, "--replace-existing-source-handles"], { cwd: repoRoot, encoding: "utf8" });
  const preview = JSON.parse(readFileSync(join(output, "import-preview.json"), "utf8"));

  assert.equal(preview.summary.approvedExistingProductReplacement, true);
  assert.equal(preview.summary.exactMatchReplacementCount, 0);
  assert.equal(preview.summary.shopifyMutationsPerformed, 0);
});
