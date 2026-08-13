import { KNOWLEDGE } from "./knowledge";
import { retrieve } from "./match";
import { isRecommendationRequest, isSensitive } from "./safety";
import type { AskResult } from "./types";

export type { AskAnswer, AskResult, AskSource, AskSourceKind } from "./types";
export { SAFETY_NOTE, SENSITIVE_BODY, SENSITIVE_HEADING } from "./safety";
export { DOMAIN_QUERIES } from "./knowledge";

/**
 * The single entry point for Ask BioAro.
 *
 * It is async even though it currently resolves synchronously. That is deliberate:
 * every caller already awaits, so replacing the body with a `fetch("/api/ask")` is a
 * change to this file alone and no component has to move.
 *
 * ---------------------------------------------------------------------------
 * If a real model is put behind this later, these are the conditions:
 *
 *  - The API key stays server-side. `.env.example` already documents that convention
 *    for the Shopify Admin token; follow it. Never a VITE_ prefixed variable, which
 *    Vite inlines into the browser bundle.
 *  - `vercel.json` currently rewrites "/(.*)"  to /index.html for SPA routing. That
 *    has to be narrowed so /api/* is not swallowed.
 *  - `connect-src 'self' https:` already permits a same-origin call, so no CSP change
 *    is needed for a first-party endpoint.
 *  - THE SAFETY CLASSIFIER MUST MOVE SERVER-SIDE. The regex denylist in safety.ts is
 *    adequate for retrieving pre-approved copy, where the worst outcome is showing an
 *    approved FAQ answer to someone who should have seen the referral. It is not
 *    adequate for generated text: a denylist is unbounded by nature, it ships to the
 *    browser where anyone can read exactly what it does not cover, and a model can
 *    produce a health claim the list never anticipated.
 * ---------------------------------------------------------------------------
 */
export async function askBioAro(query: string): Promise<AskResult> {
  const trimmed = query.trim();
  if (!trimmed) return { kind: "no-match" };

  // Safety first, always. Nothing below this line can run for a medical question.
  if (isSensitive(trimmed)) return { kind: "sensitive" };

  // "Which one should I take" is the quiz's job, not this box's.
  if (isRecommendationRequest(trimmed)) return { kind: "needs-quiz" };

  const answers = retrieve(trimmed, KNOWLEDGE);
  return answers.length > 0 ? { kind: "answer", answers } : { kind: "no-match" };
}
