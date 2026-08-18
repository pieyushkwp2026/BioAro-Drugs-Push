import test from "node:test";
import assert from "node:assert/strict";
import {
  FOOTER_SECTIONS,
  PRIMARY_NAV,
  MEMBER_NAV,
  MEMBER_ROUTE_PATHS,
  PUBLIC_ROUTE_PATHS,
  ROUTES,
} from "../src/lib/routes";

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
    ROUTES.ai,
    ROUTES.membership,
    ROUTES.membershipSuccess,
  ];

  for (const route of requiredRoutes) {
    assert.ok(PUBLIC_ROUTE_PATHS.includes(route), `Expected public route ${route} to be registered.`);
  }
});

/*
 * The dashboard sits behind a sign-in gate, and PUBLIC_ROUTE_PATHS is what the footer
 * test treats as "routes that may be linked publicly". Adding a member route to that
 * list would not open a hole by itself — RequireAuth is what guards it — but it would
 * make the two lists disagree about what the account area is, which is the confusion
 * PRIMARY_NAV already had to be de-duplicated to fix.
 */
test("only the account entry point is public; its sections are not", () => {
  const publicMemberRoutes = MEMBER_ROUTE_PATHS.filter((route) => PUBLIC_ROUTE_PATHS.includes(route));

  assert.deepEqual(publicMemberRoutes, [ROUTES.account]);
});

test("every dashboard section lives under the account route", () => {
  for (const route of MEMBER_ROUTE_PATHS) {
    if (route === ROUTES.account) continue;
    assert.ok(route.startsWith("/account/"), `Expected ${route} to be nested under /account.`);
  }
});

test("every dashboard nav item resolves to a registered member route", () => {
  const known = new Set(MEMBER_ROUTE_PATHS);

  for (const item of MEMBER_NAV) {
    assert.ok(known.has(item.href), `Missing member route for nav item: ${item.label}`);
    assert.notEqual(item.href, "#");
  }
});

/*
 * PRIMARY_NAV had no test until it gained a route. The footer has had one since the
 * two lists disagreed about the primary navigation, and this is the same failure with
 * a different list.
 */
test("every primary nav item resolves to a known public route", () => {
  const known = new Set(PUBLIC_ROUTE_PATHS);

  for (const item of PRIMARY_NAV) {
    assert.ok(known.has(item.href), `Missing public route for nav item: ${item.label}`);
    assert.notEqual(item.href, "#");
  }
});

/* "Leave /quiz working" turned from a memory into a check. */
test("the quiz route stays registered even though nothing links to it", () => {
  assert.ok(PUBLIC_ROUTE_PATHS.includes(ROUTES.quiz));
});
