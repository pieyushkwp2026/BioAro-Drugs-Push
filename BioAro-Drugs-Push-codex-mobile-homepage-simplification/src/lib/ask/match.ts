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

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

/* Light suffix folding so "recovery" matches "recover" and "ingredients" matches
   "ingredient". Cheaper and more predictable than a real stemmer. */
function fold(token: string): string {
  return token.replace(/ies$/, "y").replace(/(ing|ed|es|s)$/, "");
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
    questionTokens: new Set(tokenise(entry.question).map(fold)),
    answerTokens: new Set(tokenise(entry.answer).map(fold)),
  }));
  INDEX_CACHE.set(corpus, index);
  return index;
}

/*
 * The floor only has to reject genuine noise, which scores 0 because none of its
 * tokens appear anywhere. Setting it at 2 meant a single-word query whose only hit
 * was in an answer body ("training") scored 1 and was thrown away. Ranking, not the
 * threshold, is what decides which results are worth showing.
 */
export const MIN_SCORE = 1;

export function retrieve(query: string, corpus: readonly AskAnswer[], limit = 3): AskAnswer[] {
  const tokens = [...new Set(tokenise(query).map(fold))];
  if (tokens.length === 0) return [];

  return getIndex(corpus)
    .map(({ entry, questionTokens, answerTokens }) => {
      let score = 0;
      for (const token of tokens) {
        // A hit in the question is a much stronger signal than one in the body.
        if (questionTokens.has(token)) score += 3;
        else if (answerTokens.has(token)) score += 1;
      }
      // Weight by how much of the question we actually covered, so a long answer that
      // happens to contain one common word cannot outrank a direct question match.
      const covered = tokens.filter((t) => questionTokens.has(t) || answerTokens.has(t)).length;
      return { entry, score: score * (covered / tokens.length) };
    })
    .filter((row) => row.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.entry);
}
