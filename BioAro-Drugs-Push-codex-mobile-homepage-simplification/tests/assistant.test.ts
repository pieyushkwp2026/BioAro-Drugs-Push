import test from "node:test";
import assert from "node:assert/strict";
import { MARKET_CONFIGS } from "../src/config/markets";
import { skillsFor, skillsForSurface } from "../src/lib/assistant/skills";
import { stripForStorage, titleFor } from "../src/lib/assistant/history";
import type { Turn } from "../src/lib/assistant/turns";

/*
 * The assistant's claims, held to what the product can actually do.
 *
 * An assistant is judged on what it says it can do, and these claims are spread across
 * two surfaces. These tests are what stop the catalogue drifting away from reality one
 * convenient edit at a time.
 */

test("every skill that is not live explains itself", () => {
  for (const market of Object.keys(MARKET_CONFIGS) as (keyof typeof MARKET_CONFIGS)[]) {
    for (const skill of skillsFor(MARKET_CONFIGS[market])) {
      if (skill.live) continue;
      assert.ok(
        skill.unavailable && skill.unavailable.trim().length > 0,
        `${market}/${skill.id} is unavailable and says nothing about why`,
      );
    }
  }
});

test("no skill claims to read an image, because nothing can", () => {
  /* The blurb only. `unavailable` is where the honest denials live ("does not read
     prescriptions"), and a naive scan reads a denial as a claim. */
  for (const skill of skillsFor(MARKET_CONFIGS.uk)) {
    const claim = skill.blurb.toLowerCase();
    const readsImages = /\b(reads?|analys\w*|scans?|interprets?)\s+(your\s+|the\s+)?(photo|image|label|prescription)/.test(claim);
    assert.ok(!readsImages, `${skill.id} implies it reads an image`);
  }

  const prescription = skillsFor(MARKET_CONFIGS.uk).find((skill) => skill.id === "prescription");
  assert.equal(prescription?.live, false);
  assert.match(String(prescription?.unavailable), /does not read prescriptions/i);
});

test("order help follows the market's own checkout switch, not a second opinion", () => {
  for (const market of Object.keys(MARKET_CONFIGS) as (keyof typeof MARKET_CONFIGS)[]) {
    const config = MARKET_CONFIGS[market];
    const orders = skillsFor(config).find((skill) => skill.id === "orders");
    assert.equal(orders?.live, config.checkoutEnabled, `${market} orders skill disagrees with checkoutEnabled`);
  }
});

test("the modal offers nothing it cannot finish", () => {
  const modal = skillsForSurface(MARKET_CONFIGS.uk, "modal").map((skill) => skill.id);

  /* Attachments and history live on the full page. Offering them in the modal would be
     a control that hands you to another surface to do the actual thing. */
  assert.ok(!modal.includes("label-scan"));
  assert.ok(!modal.includes("prescription"));
});

/* ------------------------------------------------------------------ history */

const TURNS: Turn[] = [
  { id: "1", kind: "you", text: "I want better focus" },
  { id: "2", kind: "ai", text: "I picked up Focus." },
  { id: "3", kind: "image", intent: "prescription", previewUrl: "blob:x", name: "scan.jpg" },
];

test("an attached photo never reaches stored history", () => {
  const stored = stripForStorage(TURNS);

  assert.equal(stored.length, 2);
  assert.ok(stored.every((turn) => turn.kind !== "image"));
  /* The object URL is the whole risk: it is the only handle onto the blob. */
  assert.ok(!JSON.stringify(stored).includes("blob:"));
});

test("a conversation is titled with the visitor's own words, never generated", () => {
  assert.equal(titleFor(TURNS), "I want better focus");
  assert.equal(titleFor([]), "New conversation");
});

test("a long opening line is trimmed rather than wrapped forever", () => {
  const long: Turn[] = [{ id: "1", kind: "you", text: "x".repeat(200) }];
  assert.ok(titleFor(long).length <= 60);
});
