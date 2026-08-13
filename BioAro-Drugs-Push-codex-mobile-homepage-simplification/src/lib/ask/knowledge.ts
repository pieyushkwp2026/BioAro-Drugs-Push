import { PREVIEW_PRODUCTS } from "../../data/products";
import { FAQ_CATEGORIES } from "../../data/siteContent";
import { JOURNAL_ARTICLES } from "../../data/journal";
import { ROUTES } from "../routes";
import type { AskAnswer } from "./types";

/*
 * The knowledge base is BUILT FROM CONTENT THAT ALREADY EXISTS. Nothing here is
 * authored: every answer string is lifted verbatim from the site FAQ, a product's
 * own FAQ, or a journal excerpt, and always carries a link back to where it lives.
 *
 * That is the whole safety argument for shipping this without a language model.
 * The system retrieves approved copy; it never composes a sentence about health.
 */

// These two are placeholder rows in the catalogue and must never be surfaced.
const EXCLUDED_HANDLES = new Set(["sleepo-kids", "sleep0"]);

function buildEntries(): AskAnswer[] {
  const entries: AskAnswer[] = [];

  // 1. Site-wide FAQ, grouped by category (Product Use, Safety, Quality, ...).
  for (const category of FAQ_CATEGORIES) {
    for (const item of category.items) {
      entries.push({
        question: item.question,
        answer: item.answer,
        source: { kind: "faq", label: `FAQ - ${category.title}`, href: ROUTES.faq },
      });
    }
  }

  // 2. Per-product FAQ, plus the product's own positioning and directions.
  for (const product of PREVIEW_PRODUCTS) {
    if (EXCLUDED_HANDLES.has(product.handle)) continue;
    const source = {
      kind: "product" as const,
      label: product.title,
      href: `/products/${product.handle}`,
    };

    for (const item of product.faq ?? []) {
      entries.push({ question: item.question, answer: item.answer, source });
    }

    if (product.bestFor) {
      entries.push({
        question: `Who is ${product.title} for?`,
        answer: product.bestFor,
        source,
      });
    }

    if (product.dosage) {
      entries.push({
        question: `How do I take ${product.title}?`,
        answer: product.dosage,
        source,
      });
    }
  }

  // 3. Journal articles, as a pointer rather than an answer.
  for (const article of JOURNAL_ARTICLES) {
    entries.push({
      question: article.title,
      answer: article.excerpt,
      source: {
        kind: "journal",
        label: `Journal - ${article.cat}`,
        href: `${ROUTES.journal}/${article.slug}`,
      },
    });
  }

  return entries;
}

export const KNOWLEDGE: readonly AskAnswer[] = buildEntries();

/*
 * Topic seeds for the four domain chips. These are query strings, not answers: a chip
 * runs the same retrieval path a typed question does, so there is exactly one code
 * path to reason about and test.
 */
export const DOMAIN_QUERIES: Record<string, string> = {
  Clarity: "focus concentration mental clarity",
  Strength: "strength training performance creatine",
  Recovery: "recovery after training soreness",
  Longevity: "healthy ageing longevity cellular",
};
