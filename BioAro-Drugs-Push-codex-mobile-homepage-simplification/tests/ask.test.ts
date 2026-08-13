import test from "node:test";
import assert from "node:assert/strict";
import { isRecommendationRequest, isSensitive, SENSITIVE_TERMS } from "../src/lib/ask/safety";
import { retrieve } from "../src/lib/ask/match";
import type { AskAnswer } from "../src/lib/ask/types";

/*
 * The real corpus is built from product and journal data, which import image assets
 * and so cannot compile in this harness. `retrieve` takes its corpus as a parameter
 * precisely so the ranking logic can be tested against a fixture.
 */
const CORPUS: AskAnswer[] = [
  {
    question: "How should I take BioAro products?",
    answer: "Always follow the directions shown on the product page and packaging.",
    source: { kind: "faq", label: "FAQ - Product Use", href: "/faq" },
  },
  {
    question: "What is in a sachet?",
    answer: "Each single-serve sachet contains one measured dose of the formula.",
    source: { kind: "faq", label: "FAQ - Product Use", href: "/faq" },
  },
  {
    question: "How do I take Creagen Raw Power?",
    answer: "Mix 1 sachet with water daily, before or after training.",
    source: { kind: "product", label: "Creagen Raw Power", href: "/products/creagen-raw-power" },
  },
  {
    question: "Who is Creagen Brain Boost for?",
    answer: "Nutritional support for training, work and everyday wellbeing.",
    source: { kind: "product", label: "Creagen Brain Boost", href: "/products/creagen-brain-boost" },
  },
  {
    question: "Are your products third-party tested?",
    answer: "Every batch is independently checked for purity and potency.",
    source: { kind: "faq", label: "FAQ - Quality", href: "/faq" },
  },
];

test("safety gate catches every sensitive category", () => {
  const queries = [
    "I have chest pain, what helps?",       // urgent
    "is this ok with diabetes",             // named condition
    "can I take this while pregnant",       // life stage
    "will this treat my symptoms",          // clinical framing
    "does it help with anxiety",            // mental health
    "I take warfarin, is this safe",        // medication
    "anything for menopause",               // previously uncovered
    "is it safe for my daughter",           // asked for a child
  ];

  for (const query of queries) {
    assert.equal(isSensitive(query), true, `should be treated as sensitive: ${query}`);
  }
});

test("safety terms are word-bounded, so ordinary words do not trip them", () => {
  // The archived list was unanchored: /cure/ matched "secure", /treat/ matched
  // "retreat" and /liver/ matched "deliver".
  for (const query of ["is my data secure", "do you deliver on weekends", "a weekend retreat"]) {
    assert.equal(isSensitive(query), false, `should not be sensitive: ${query}`);
  }
});

test("recommendation questions are handed to the quiz, not answered", () => {
  for (const query of [
    "which one should I take",
    "what should I start with",
    "can you recommend something",
    "which product is right for me",
    "help me choose",
  ]) {
    assert.equal(isRecommendationRequest(query), true, `should route to quiz: ${query}`);
  }
});

test("ordinary questions are not mistaken for recommendation requests", () => {
  for (const query of ["what is in a sachet", "are you third party tested", "how do I take it"]) {
    assert.equal(isRecommendationRequest(query), false, `should be answerable: ${query}`);
  }
});

test('"workout" does not match the focus entry (the archived first-match-wins bug)', () => {
  const results = retrieve("a better workout", CORPUS);
  const titles = results.map((r) => r.question);
  assert.ok(
    !titles.includes("Who is Creagen Brain Boost for?"),
    "substring matching would have returned the focus product here",
  );
});

test("retrieval finds the right entry and ranks question hits above body hits", () => {
  const sachet = retrieve("what is in a sachet", CORPUS);
  assert.ok(sachet.length > 0, "expected a result for a direct question");
  assert.equal(sachet[0]?.question, "What is in a sachet?");

  const tested = retrieve("third party tested", CORPUS);
  assert.equal(tested[0]?.question, "Are your products third-party tested?");
});

test("retrieval folds simple suffixes so recovery matches recover", () => {
  const results = retrieve("training", CORPUS);
  assert.ok(results.length > 0, "expected training to match at least one entry");
});

test("gibberish and empty input return nothing rather than a weak guess", () => {
  assert.equal(retrieve("qwertyuiop zxcvbnm", CORPUS).length, 0);
  assert.equal(retrieve("", CORPUS).length, 0);
  assert.equal(retrieve("the and of", CORPUS).length, 0);
});

test("every sensitive pattern is case-insensitive", () => {
  for (const term of SENSITIVE_TERMS) {
    assert.ok(term.flags.includes("i"), `pattern must be case-insensitive: ${term}`);
  }
});
