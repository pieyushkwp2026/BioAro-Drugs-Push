import { PREVIEW_PRODUCTS } from "../../data/products";
import { FAQ_CATEGORIES, PROTOCOLS, QUALITY_SECTIONS } from "../../data/siteContent";
import { JOURNAL_ARTICLES } from "../../data/journal";
import { ROUTES } from "../routes";
import type { AskAnswer } from "./types";

/*
 * The knowledge base is BUILT FROM CONTENT THAT ALREADY EXISTS. Nothing here is
 * authored: every answer string is lifted verbatim from the site FAQ, a product's
 * own data, or journal copy, and always carries a link back to where it lives.
 *
 * That is the whole safety argument for shipping this without a language model.
 * The system retrieves approved copy; it never composes a sentence about health.
 *
 * ---------------------------------------------------------------------------
 * This used to index four fields — product `faq`, `bestFor`, `dosage`, and journal
 * excerpts — for a total of 82 entries, roughly half of them verbatim duplicates of
 * each other. Everything that makes these products worth buying was invisible to
 * search: 33 ingredient rows carrying real doses, every warning, every supplement
 * fact. "How much NMN is in LONgevity+" could not be answered even though the
 * answer, 500 mg, sits in products.ts.
 *
 * Indexing the rest costs nothing in trust, because it is the same approved copy
 * already rendered on the product pages.
 * ---------------------------------------------------------------------------
 */

// These two are placeholder rows in the catalogue and must never be surfaced.
const EXCLUDED_HANDLES = new Set(["sleepo-kids", "sleepo"]);

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

  // 2. Everything a product knows about itself.
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

    entries.push({
      question: `What is ${product.title}?`,
      answer: `${product.tagline} ${product.description}`,
      source,
    });

    if (product.bestFor) {
      entries.push({ question: `Who is ${product.title} for?`, answer: product.bestFor, source });
    }

    if (product.dosage) {
      entries.push({ question: `How do I take ${product.title}?`, answer: product.dosage, source });
    }

    entries.push({
      question: `How many servings are in ${product.title}?`,
      answer: `${product.supplyLabel}. ${product.servings}.`,
      source,
    });

    // Ingredients, each with its real dose. The highest-value rows in the corpus:
    // this is the disclosure the brand is built on, and it was entirely unsearchable.
    for (const ingredient of product.ingredients ?? []) {
      const why = ingredient.whyIncluded ? ` ${ingredient.whyIncluded}` : "";
      entries.push({
        question: `How much ${ingredient.name} is in ${product.title}?`,
        answer: `${product.title} contains ${ingredient.amount} of ${ingredient.name}. ${ingredient.purpose}${why}`,
        source,
      });
    }

    if (product.otherIngredients?.length) {
      entries.push({
        question: `What other ingredients are in ${product.title}?`,
        answer: `Other ingredients: ${product.otherIngredients.join(", ")}.`,
        source,
      });
    }

    if (product.supplementFacts?.length) {
      entries.push({
        question: `What are the supplement facts for ${product.title}?`,
        answer: product.supplementFacts.map((fact) => `${fact.label}: ${fact.value}`).join(". ") + ".",
        source,
      });
    }

    if (product.warnings?.length) {
      entries.push({
        question: `Are there any warnings or cautions for ${product.title}?`,
        answer: product.warnings.join(" "),
        source,
      });
    }

    if (product.benefits?.length) {
      entries.push({
        question: `What does ${product.title} support?`,
        answer: product.benefits.join(". ") + ".",
        source,
      });
    }

    for (const item of product.whyItems ?? []) {
      entries.push({ question: `${item.title} - ${product.title}`, answer: item.description, source });
    }

    for (const step of product.science ?? []) {
      entries.push({ question: `${step.title} - ${product.title}`, answer: step.description, source });
    }

    if (product.qualityPoints?.length) {
      entries.push({
        question: `How is ${product.title} made and tested?`,
        answer: product.qualityPoints.join(". ") + ".",
        source,
      });
    }
  }

  // 3. Protocols — how the range is meant to fit together.
  for (const protocol of PROTOCOLS) {
    entries.push({
      question: protocol.title,
      answer: `${protocol.description} ${protocol.positioning}`,
      source: { kind: "faq", label: `Protocols - ${protocol.title}`, href: ROUTES.protocols },
    });
  }

  // 4. Quality and testing.
  for (const section of QUALITY_SECTIONS) {
    entries.push({
      question: section.title,
      answer: section.paragraphs.join(" "),
      source: { kind: "faq", label: "Quality & Testing", href: ROUTES.quality },
    });
  }

  // 5. Journal — the article as a pointer, plus each section heading, which turn out
  //    to be near-perfect retrieval targets ("Why dosage matters").
  for (const article of JOURNAL_ARTICLES) {
    const source = {
      kind: "journal" as const,
      label: `Journal - ${article.cat}`,
      href: `${ROUTES.journal}/${article.slug}`,
    };

    entries.push({ question: article.title, answer: article.excerpt, source });

    for (const section of article.article?.sections ?? []) {
      entries.push({ question: section.heading, answer: section.body.join(" "), source });
    }
  }

  return entries;
}

export const KNOWLEDGE: readonly AskAnswer[] = buildEntries();

/*
 * Topic seeds for the four domain chips. These are query strings, not answers: a chip
 * runs the same retrieval path a typed question does, so there is exactly one code
 * path to reason about and test.
 *
 * The previous seeds ("focus concentration mental clarity", "strength training
 * performance creatine") were four tokens each and scored below the floor, so two of
 * the four chips on the shipped UI landed on the empty state. These are phrased as a
 * visitor would actually ask, and every one is covered by a test.
 */
export const DOMAIN_QUERIES: Record<string, string> = {
  Clarity: "focus and mental clarity",
  Strength: "creatine for strength and performance",
  Recovery: "recovery after training",
  Longevity: "healthy ageing and LONgevity+",
};
