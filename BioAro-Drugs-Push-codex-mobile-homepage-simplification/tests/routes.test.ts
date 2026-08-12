import test from "node:test";
import assert from "node:assert/strict";
import { FOOTER_SECTIONS, PUBLIC_ROUTE_PATHS, ROUTES } from "../src/lib/routes";

test("all production footer links resolve to known routes", () => {
  const knownRoutes = new Set(PUBLIC_ROUTE_PATHS);

  for (const section of FOOTER_SECTIONS) {
    for (const link of section.links) {
      assert.ok(knownRoutes.has(link.href), `Missing public route for footer link: ${section.title} -> ${link.label}`);
      assert.notEqual(link.href, "#");
    }
  }
});

test("new launch pages are registered as public routes", () => {
  const requiredRoutes = [
    ROUTES.disclaimer,
    ROUTES.shipping,
    ROUTES.returns,
    ROUTES.support,
    ROUTES.living,
    ROUTES.quality,
    ROUTES.faq,
    ROUTES.protocols,
    ROUTES.partners,
  ];

  for (const route of requiredRoutes) {
    assert.ok(PUBLIC_ROUTE_PATHS.includes(route), `Expected public route ${route} to be registered.`);
  }
});
