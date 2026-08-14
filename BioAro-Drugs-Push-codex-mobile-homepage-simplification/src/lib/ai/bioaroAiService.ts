import type { GoalId } from "../protocol/build";
import { matchGoals } from "./matchGoals";

/*
 * BioAro Drugs AI — the interpretation layer's client boundary.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS FOR
 *
 * The homepage takes free text ("I want better focus and energy through the day").
 * Turning that into structured intent is a model's job, and there is no endpoint yet.
 * This module is the seam: when the endpoint lands, only `interpretGoal` changes —
 * no component moves, no state machine is rewritten, no visual redesign.
 *
 * THE CONTRACT IS NORMALISED ON PURPOSE. The frontend understands the shapes below
 * and nothing else. No provider, model name, or SDK appears anywhere in src/, so
 * swapping what sits behind the endpoint is invisible from here.
 *
 * ---------------------------------------------------------------------------
 * THE DIVISION OF RESPONSIBILITY, which is the whole safety argument
 *
 * The model interprets and structures INTENT. That is all.
 *
 * The application keeps ownership of: the approved product catalogue, market
 * availability, pricing, product eligibility, verified product facts, safety and
 * contraindication rules, and the final recommendation. A returned goal is matched
 * against `GOALS` before it is used, so a model cannot introduce a goal — and
 * therefore cannot introduce a product — that BioAro Drugs has not approved.
 *
 * It follows that the model can never invent a product, ingredient, dose, price,
 * piece of evidence, or medical claim: it is never asked for any of them, and
 * nothing it returns is rendered directly.
 *
 * ---------------------------------------------------------------------------
 * KEYS
 *
 * The endpoint is first-party and server-side. Nothing here is VITE_-prefixed —
 * Vite inlines those into the browser bundle, which is how an API key leaks. The
 * same convention `.env.example` already documents for the Shopify Admin token.
 *
 * `vercel.json` currently rewrites "/(.*)" to /index.html for SPA routing; that has
 * to be narrowed so /api/* is not swallowed. `connect-src 'self' https:` already
 * permits a same-origin call, so the CSP needs no change.
 * ---------------------------------------------------------------------------
 */

export interface InterpretRequest {
  message: string;
  selectedGoals: GoalId[];
  market: string;
  sessionContext?: Record<string, unknown>;
}

export interface InterpretResponse {
  /** Validated against GOALS by the caller before anything is rendered. */
  interpretedGoals: GoalId[];
  confidence: number;
  /** One plain sentence back to the visitor. Never a health claim. */
  summary: string;
  /** The next structured question, when the model wants a clarification first. */
  suggestedNextQuestion?: string;
  builderContext?: { primaryGoals: GoalId[] };
}

export type InterpretResult =
  /** `source` tells the caller which produced this, so the UI can be accurate about
      provenance rather than implying a model read the sentence. */
  | { kind: "interpreted"; data: InterpretResponse; source: "endpoint" | "keywords" }
  /** Nothing in the message was recognised. A real answer, shown to the visitor. */
  | { kind: "no-match" }
  /** Endpoint exists and failed. Chips and the builder still work. */
  | { kind: "error"; message: string };

const ENDPOINT = "/api/bioaro-ai/interpret";

/*
 * Deliberately a runtime check rather than a build flag: whether an endpoint exists
 * is a deployment fact, and this has to be able to answer "no" without the UI having
 * been built differently.
 *
 * While this returns false, `interpretGoal` falls back to keyword matching and tags
 * the result `source: "keywords"`. The UI must use that tag to describe the result
 * accurately — matched from your message, not understood — because a keyword table
 * is not a model and should never be presented as one.
 */
export function isConfigured(): boolean {
  return import.meta.env.VITE_BIOARO_AI_ENABLED === "true";
}

export async function interpretGoal(request: InterpretRequest): Promise<InterpretResult> {
  /*
   * Interim path. Keyword matching, and the UI says so — chips resolved this way are
   * labelled as matched from the message, never as understood or interpreted. When
   * the endpoint lands this branch simply stops being taken; no component changes.
   */
  if (!isConfigured()) {
    const goals = matchGoals(request.message);
    if (goals.length === 0) return { kind: "no-match" };

    return {
      kind: "interpreted",
      source: "keywords",
      data: { interpretedGoals: goals, confidence: 0, summary: "" },
    };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) return { kind: "error", message: "We could not read that just now." };

    const data = (await response.json()) as InterpretResponse;

    // Shape guard. A malformed response degrades rather than throwing into a section
    // the visitor is mid-interaction with.
    if (!Array.isArray(data?.interpretedGoals)) return { kind: "no-match" };
    if (data.interpretedGoals.length === 0) return { kind: "no-match" };

    return { kind: "interpreted", data, source: "endpoint" };
  } catch {
    return { kind: "error", message: "We could not read that just now." };
  }
}

export const bioaroAiService = { isConfigured, interpretGoal };
