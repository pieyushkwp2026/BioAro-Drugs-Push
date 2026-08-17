import assert from "node:assert/strict";
import test from "node:test";

import { usefulFaqs } from "../src/lib/product/faq";

/* The generic set every shipping product carried, verbatim from LONgevity+. */
const SHARED_SET = [
  { question: "How should I take LONgevity+?", answer: "Take 2 capsules daily with food, or as directed on the product label." },
  { question: "When will I see results?", answer: "Individual experiences vary depending on diet, lifestyle and consistency of use." },
  { question: "Is it suitable for vegetarians?", answer: "Yes, LONgevity+ is formulated in vegan capsules." },
  { question: "Are there any side effects?", answer: "Please follow the recommended intake on the label and consult a healthcare professional." },
  { question: "Is it safe to take with other supplements?", answer: "Check with a healthcare professional if you are on medication." },
  { question: "What is your return policy?", answer: "See our returns & refunds page for full details." },
];

test("the four questions answered better elsewhere on the page are dropped", () => {
  const kept = usefulFaqs(SHARED_SET).map((item) => item.question);

  assert.deepEqual(kept, ["Is it suitable for vegetarians?", "Is it safe to take with other supplements?"]);
});

test("the two that survive are the ones nothing else on the page answers", () => {
  /* Not kept because they are rare — they are on most products. Kept because the
     answer genuinely differs per product and appears nowhere else on the page. */
  const kept = usefulFaqs(SHARED_SET);
  assert.ok(kept.every((item) => item.answer.length > 0));
  assert.equal(kept.length, 2);
});

test("an answer that merely restates the directions is dropped whatever it is called", () => {
  /* The question-text patterns cannot catch every phrasing the store might hold, so
     the directions themselves are the second net. */
  const dosage = "Mix 1 sachet with water daily, or as directed on the product label.";
  const kept = usefulFaqs(
    [
      { question: "What is the recommended serving?", answer: dosage },
      { question: "Is it suitable for vegetarians?", answer: "Yes, this formula is vegetarian-friendly." },
    ],
    dosage,
  );

  assert.deepEqual(kept.map((item) => item.question), ["Is it suitable for vegetarians?"]);
});

test("questions about the page's own draft status never reach a customer", () => {
  const kept = usefulFaqs([
    { question: "Is this the final SleepO PDP?", answer: "No." },
    { question: "Why is the content limited right now?", answer: "Pending approval." },
    { question: "Is SleepO Kids the same as SleepO?", answer: "No, they are different formulas." },
  ]);

  assert.deepEqual(kept.map((item) => item.question), ["Is SleepO Kids the same as SleepO?"]);
});

test("a product with no FAQ at all is handled, not crashed", () => {
  assert.deepEqual(usefulFaqs(undefined), []);
  assert.deepEqual(usefulFaqs([]), []);
});

test("order is preserved, so the store's own sequencing survives", () => {
  const kept = usefulFaqs([
    { question: "Is it safe to take with other supplements?", answer: "Ask a professional." },
    { question: "What is your return policy?", answer: "See the returns page." },
    { question: "Is it suitable for vegetarians?", answer: "Yes." },
  ]);

  assert.deepEqual(kept.map((item) => item.question), [
    "Is it safe to take with other supplements?",
    "Is it suitable for vegetarians?",
  ]);
});

test("an empty dosage does not filter everything out", () => {
  /* normalise("") is "", and a naive includes() check would match every answer and
     leave the page with no questions at all. */
  const kept = usefulFaqs([{ question: "Is it suitable for vegetarians?", answer: "Yes." }], "");
  assert.equal(kept.length, 1);
});
