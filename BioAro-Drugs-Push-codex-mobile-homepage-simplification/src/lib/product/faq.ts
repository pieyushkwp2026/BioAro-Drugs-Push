/*
 * Which product questions are worth printing.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A FILTER AND NOT JUST BETTER DATA
 *
 * Every shipping product carried the same six questions, differing only in the product
 * name in the first one. They were cut from src/data/products.ts — but the product page
 * prefers the Shopify `faqs` metafield over the local data, so the generic set kept
 * rendering from the store, and the Shopify Admin token currently 401s so it cannot be
 * corrected at source.
 *
 * Rather than wait, the rule lives here and is applied to whatever the page is given.
 * That is the better place for it anyway: one policy, enforced no matter which source
 * the FAQ arrives from, and it keeps holding after the metafield is fixed.
 *
 * WHAT COUNTS AS NOT WORTH PRINTING. Only two kinds:
 *
 *   1. A question the SAME PAGE already answers in a better place — dosage lives in the
 *      How-to-use panel, safety in the warnings block, returns on the returns page
 *      linked from every footer.
 *   2. A question whose answer says nothing. "When will I see results?" was answered
 *      "Individual experiences vary depending on diet, lifestyle and consistency of
 *      use" on seven products. That is a shrug in the shape of an answer.
 *
 * It does NOT remove a question merely for appearing on several products. "Is it
 * suitable for vegetarians?" is on most of them and stays, because the answer genuinely
 * differs — vegan capsules on one, vegetarian-friendly sachets on another — and nothing
 * else on the page tells you.
 * ---------------------------------------------------------------------------
 */

export interface ProductFaqItem {
  question: string;
  answer: string;
}

/** Answered better elsewhere on the same page, or not answered at all. */
const REDUNDANT_QUESTION = [
  /^\s*how (should|do) i take\b/i, // the dosage line, printed in How to use
  /^\s*when will i see results\b/i, // "individual experiences vary" — a non-answer
  /^\s*are there any side effects\b/i, // restates the warnings block
  /^\s*what is your return policy\b/i, // a policy page, linked in every footer
];

/*
 * Questions about the page's own completeness, which two placeholder listings carried:
 * "Is this the final SleepO PDP?", "Why is the content limited right now?". Internal
 * process, facing customers. A page should not discuss its own draft status.
 */
const ABOUT_THE_PAGE =
  /\b(final .*(pdp|product information)|content .*(limited|coming)|reflect final|live in the us store|view the product in the us catalog)\b/i;

const normalise = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();

/**
 * The questions worth showing, in their original order.
 *
 * `dosage` is the product's own directions line: any answer that simply restates it is
 * dropped whatever the question was called, which catches the wording variations the
 * question patterns above would miss.
 */
export function usefulFaqs<T extends ProductFaqItem>(faqs: T[] | undefined, dosage?: string): T[] {
  const directions = normalise(dosage ?? "");

  return (faqs ?? []).filter((item) => {
    if (REDUNDANT_QUESTION.some((pattern) => pattern.test(item.question))) return false;
    if (ABOUT_THE_PAGE.test(item.question)) return false;

    if (directions) {
      const answer = normalise(item.answer);
      // Either direction: the FAQ may quote the directions or be quoted by them.
      if (answer === directions || answer.includes(directions) || directions.includes(answer)) {
        return false;
      }
    }

    return true;
  });
}
