import type { AskAnswer } from "./types";

/*
 * Scored token overlap, deliberately not the archived component's first-match-wins
 * regex table. That approach had an ordering bug where the focus rule's /work/ also
 * matched the substring in "workout", so "a better workout" returned a focus product.
 * Scoring on whole tokens cannot produce that class of error.
 *
 * The corpus is injected rather than imported so this file stays free of the product
 * and journal data, which import image assets and therefore cannot compile in the
 * `tsc -p tsconfig.test.json` harness. That keeps the ranking logic unit-testable.
 */

const STOP_WORDS = new Set([
  "a","an","and","are","as","at","be","but","by","can","do","does","for","from","get",
  "have","how","i","if","in","is","it","its","me","my","of","on","or","should","so",
  "some","take","that","the","their","them","there","this","to","use","using","was",
  "what","when","where","which","will","with","you","your",
]);

/*
 * Query-side vocabulary bridge.
 *
 * The corpus is verbatim approved copy, so it says what it says: "focus", never
 * "concentration"; "vegetarian-friendly", never "vegan". Visitors do not know which
 * word was chosen. Each entry expands a term the visitor might type into the terms
 * the copy actually uses — this widens the QUERY only, so no answer text is ever
 * altered or implied.
 */
const SYNONYMS: Record<string, string[]> = {
  concentration: ["focus", "cognitive", "mental"],
  concentrate: ["focus", "cognitive"],
  cognition: ["focus", "cognitive", "brain"],
  clarity: ["focus", "mental"],
  tired: ["energy", "fatigue", "vitality"],
  tiredness: ["energy", "fatigue", "vitality"],
  fatigue: ["energy", "vitality"],
  exhausted: ["energy", "fatigue"],
  soreness: ["recovery", "muscle"],
  sore: ["recovery", "muscle"],
  ache: ["recovery", "muscle"],
  vegan: ["vegetarian", "plant"],
  vegetarian: ["vegan", "plant"],
  plantbased: ["vegetarian", "vegan", "plant"],
  price: ["cost", "supply"],
  cost: ["price", "supply"],
  ageing: ["aging", "longevity"],
  aging: ["ageing", "longevity"],
  /*
   * Deliberately NOT mapped to "training". The training products describe themselves
   * as "high-intensity exercise performance"; "training" also appears in generic
   * wellbeing copy ("support for training, work and everyday wellbeing"), so routing
   * workout queries through it pulled in the focus product. These two terms hit the
   * performance range and nothing else.
   */
  workout: ["exercise", "performance"],
  gym: ["exercise", "performance"],
  strength: ["creatine", "power", "performance"],
  dose: ["dosage", "amount", "serving"],
  dosage: ["dose", "amount", "serving"],
  allergen: ["ingredient", "contains"],
  gluten: ["ingredient", "contains"],
};

/*
 * `+` is stripped, not preserved.
 *
 * It used to survive tokenisation, so "CellOmega+" indexed as `cellomega+` and the
 * query "cellomega" could never match it — one of two flagship products was
 * unfindable by name unless the visitor typed the plus sign. Product names are the
 * most likely thing anyone types into a search bar.
 */
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

/*
 * Light suffix folding so "recovery" matches "recover" and "ingredients" matches
 * "ingredient". Cheaper and more predictable than a real stemmer.
 *
 * Order matters and the guard is load-bearing: stripping unconditionally turned
 * "ageing" into "age" but "aging" into "ag", so a longevity brand's core term folded
 * to two different tokens depending on spelling. Short stems are left alone.
 */
function fold(token: string): string {
  let t = token;
  const strip = (pattern: RegExp, floor: number) => {
    const next = t.replace(pattern, "");
    if (next !== t && next.length >= floor) t = next;
  };

  if (t.length >= 5) t = t.replace(/ies$/, "y");
  // Guarded by the RESULT length, not the input's: an unguarded strip turned
  // "ageing" into "age" but "aging" into "ag", splitting a longevity brand's core
  // term in two depending on spelling. Both now survive intact and meet in SYNONYMS.
  strip(/(ing|ed)$/, 4);
  // Plural, then silent e, in that order. Stripping "es" as one unit gave
  // "medicines" -> "medicin" while "medicine" stayed whole, so the site could not
  // find its own approved answer to "Are BioAro products medicines?".
  strip(/s$/, 4);
  strip(/e$/, 4);
  return t;
}

function expand(tokens: string[]): string[] {
  const out = new Set<string>();
  for (const token of tokens) {
    out.add(fold(token));
    for (const alias of SYNONYMS[token] ?? []) out.add(fold(alias));
  }
  return [...out];
}

interface IndexedEntry {
  entry: AskAnswer;
  questionTokens: Set<string>;
  answerTokens: Set<string>;
}

/* Indexing is O(corpus) so it is memoised per corpus reference. In practice there is
   exactly one corpus and it is built once at module load. */
const INDEX_CACHE = new WeakMap<readonly AskAnswer[], IndexedEntry[]>();

function getIndex(corpus: readonly AskAnswer[]): IndexedEntry[] {
  const cached = INDEX_CACHE.get(corpus);
  if (cached) return cached;

  const index = corpus.map((entry) => ({
    entry,
    // The source label is indexed with the question so a product's name reaches
    // every one of its entries: product FAQs ask "Is it suitable for vegetarians?"
    // and never name the product, which made them unreachable by name.
    questionTokens: new Set(expand(tokenise(`${entry.question} ${entry.source.label}`))),
    answerTokens: new Set(expand(tokenise(entry.answer))),
  }));
  INDEX_CACHE.set(corpus, index);
  return index;
}

/*
 * The floor only has to reject genuine noise, which scores 0 because none of its
 * tokens appear anywhere.
 */
export const MIN_SCORE = 0.4;

/*
 * Near-identical rows are collapsed before the top-N slice.
 *
 * Eight products each carry "What is your return policy?" with the same answer, and
 * the synthetic "How do I take X?" duplicates the product's own "How should I take
 * X?" FAQ. Without this, any query naming a product spent two of its three result
 * cards restating one sentence.
 */
function dedupe(rows: { entry: AskAnswer; score: number }[]): { entry: AskAnswer; score: number }[] {
  const seen = new Set<string>();
  const out: { entry: AskAnswer; score: number }[] = [];
  for (const row of rows) {
    const key = `${row.entry.source.label}::${row.entry.answer.slice(0, 90).toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

export function retrieve(query: string, corpus: readonly AskAnswer[], limit = 3): AskAnswer[] {
  const tokens = expand(tokenise(query));
  if (tokens.length === 0) return [];

  return dedupe(
    getIndex(corpus)
      .map(({ entry, questionTokens, answerTokens }) => {
        let hits = 0;
        let score = 0;
        for (const token of tokens) {
          // A hit in the question is a much stronger signal than one in the body.
          if (questionTokens.has(token)) {
            score += 3;
            hits += 1;
          } else if (answerTokens.has(token)) {
            score += 1;
            hits += 1;
          }
        }
        if (hits === 0) return { entry, score: 0 };

        /*
         * Coverage is applied as a square root rather than a raw ratio.
         *
         * The raw ratio multiplied score by hits/tokens, which is an arithmetic
         * death sentence for natural language: a four-token question matching one
         * entry on a single question token scored 3 × 1/4 = 0.75 and fell under the
         * floor. Every question longer than three words was discarded unless one
         * entry happened to contain two of them — the exact shape of query a
         * prominent search bar invites. Damping keeps coverage as a ranking signal
         * without letting sentence length eliminate real matches.
         */
        return { entry, score: score * Math.sqrt(hits / tokens.length) };
      })
      .filter((row) => row.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score),
  )
    .slice(0, limit)
    .map((row) => row.entry);
}
