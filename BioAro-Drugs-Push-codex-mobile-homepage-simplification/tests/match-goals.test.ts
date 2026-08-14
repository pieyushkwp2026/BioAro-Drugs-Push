import assert from "node:assert/strict";
import test from "node:test";

import { matchGoals } from "../src/lib/ai/matchGoals";

test("names the goals a sentence mentions", () => {
  assert.deepEqual(matchGoals("I want better focus and energy through the day"), ["focus", "energy"]);
});

/* The first thing someone mentions leads the protocol, the same as the first chip
   tapped — so order of mention has to survive. */
test("orders goals by where they first appear", () => {
  assert.deepEqual(matchGoals("energy first, then focus"), ["energy", "focus"]);
  assert.deepEqual(matchGoals("focus first, then energy"), ["focus", "energy"]);
});

/*
 * Substring matching is how "work" ends up inside "workout" and a training sentence
 * returns a focus product. The search engine already had that bug once.
 */
test("matches on word boundaries, not substrings", () => {
  const result = matchGoals("I want a better workout");
  assert.ok(result.includes("performance"), "workout is a performance term");
  assert.ok(!result.includes("focus"), "and must not drag in focus");
});

test("gibberish and empty input return nothing rather than a guess", () => {
  assert.deepEqual(matchGoals("qwerty zxcvb"), []);
  assert.deepEqual(matchGoals(""), []);
  assert.deepEqual(matchGoals("   "), []);
});

test("is case-insensitive", () => {
  assert.deepEqual(matchGoals("FOCUS"), ["focus"]);
});

/*
 * The matcher can only ever produce ids the app already knows. This is what stops a
 * goal — and therefore a product — appearing that BioAro Drugs has not approved.
 */
test("only ever returns known goal ids", () => {
  const known = new Set(["energy", "longevity", "focus", "recovery", "sleep", "performance", "womens-health"]);
  const sentences = [
    "tired and sore after training",
    "help me sleep and recover",
    "healthy ageing and strength",
    "women's health and hormonal balance",
    "brain fog, memory, concentration",
  ];

  for (const sentence of sentences) {
    for (const goal of matchGoals(sentence)) {
      assert.ok(known.has(goal), `unexpected goal id: ${goal}`);
    }
  }
});

test("a sentence whose meaning is not carried by a keyword matches nothing", () => {
  // Deliberate: this is the limitation the endpoint exists to remove, and the UI
  // states it rather than guessing.
  assert.deepEqual(matchGoals("I'm dragging by 3pm"), []);
});
