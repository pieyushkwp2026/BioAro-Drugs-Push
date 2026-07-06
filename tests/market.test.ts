import test from "node:test";
import assert from "node:assert/strict";
import { resolveMarket } from "../src/lib/market/resolve";
import { DISCLAIMER_CONTENT, getRegionalPolicyContent, QUALITY_DOCUMENTS } from "../src/data/siteContent";

test("saved market override wins over geo-ip and browser fallback", () => {
  const resolved = resolveMarket({
    savedCountry: "CA",
    bootstrap: { country: "GB", currency: "GBP", experienceRegion: "UK" },
    browserLanguages: ["en-GB"],
  });

  assert.equal(resolved.country, "CA");
  assert.equal(resolved.experienceRegion, "NA");
  assert.equal(resolved.source, "override");
});

test("geo-ip market is used when there is no override", () => {
  const resolved = resolveMarket({
    bootstrap: { country: "GB", currency: "GBP", experienceRegion: "UK" },
    browserLanguages: ["en-US"],
  });

  assert.equal(resolved.country, "GB");
  assert.equal(resolved.experienceRegion, "UK");
  assert.equal(resolved.source, "geoip");
});

test("browser locale fallback prefers the UK experience when appropriate", () => {
  const resolved = resolveMarket({
    browserLanguages: ["en-GB", "en"],
  });

  assert.equal(resolved.country, "GB");
  assert.equal(resolved.experienceRegion, "UK");
  assert.equal(resolved.source, "fallback");
});

test("regional disclaimer content switches between NA and UK language", () => {
  const northAmerica = getRegionalPolicyContent("NA", DISCLAIMER_CONTENT);
  const uk = getRegionalPolicyContent("UK", DISCLAIMER_CONTENT);

  assert.ok(northAmerica.sections.some((section) => section.paragraphs.some((paragraph) => paragraph.includes("Food and Drug Administration"))));
  assert.ok(uk.sections.some((section) => section.paragraphs.some((paragraph) => paragraph.includes("food supplements"))));
});

test("quality library stays empty until documents are explicitly added", () => {
  assert.equal(QUALITY_DOCUMENTS.length, 0);
});
