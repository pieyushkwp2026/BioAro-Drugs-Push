import type { GoalId } from "../protocol/build";

/*
 * Interim goal matching, until the interpretation endpoint exists.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS, HONESTLY
 *
 * A keyword table. It reads the words someone typed and returns the goals those
 * words name. It does not reason, infer intent, or handle a sentence whose meaning
 * is not carried by one of the terms below — "I'm dragging by 3pm" matches nothing,
 * because no word in it is in the table.
 *
 * That limitation is the reason the UI labels these results as matched from the
 * message rather than understood: the provenance is stated, so nothing here claims
 * to be a model.
 *
 * The whole table is visible in one screen on purpose. If it ever needs a paragraph
 * of explanation, it has stopped being a keyword match and should be the endpoint.
 *
 * NO `import.meta` AND NO REACT IN THIS FILE. `bioaroAiService` cannot be unit
 * tested because `import.meta.env` does not survive the CommonJS test build; keeping
 * the matching logic separate means the part with actual behaviour is testable.
 * ---------------------------------------------------------------------------
 */

const GOAL_KEYWORDS: Record<GoalId, string[]> = {
  energy: ["energy", "energetic", "tired", "tiredness", "fatigue", "fatigued", "exhausted", "slump", "crash", "vitality"],
  longevity: ["longevity", "ageing", "aging", "age", "younger", "long-term", "healthspan", "cellular"],
  focus: ["focus", "focused", "concentration", "concentrate", "clarity", "sharp", "sharpness", "brain", "cognitive", "memory"],
  recovery: ["recovery", "recover", "soreness", "sore", "aching", "repair", "bounce"],
  sleep: ["sleep", "sleeping", "asleep", "insomnia", "restless", "rest"],
  performance: ["performance", "strength", "strong", "training", "workout", "workouts", "gym", "endurance", "stamina", "power"],
  "womens-health": ["women", "woman", "womens", "female", "hormonal", "menstrual"],
};

/* Word-boundary matching. Substring matching is how "work" ends up inside "workout"
   and a training sentence returns a focus product — a bug this codebase has already
   fixed once in the search engine. */
function firstIndexOf(haystack: string, term: string): number {
  const pattern = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return haystack.search(pattern);
}

/**
 * Goals named in `message`, ordered by where they first appear — so the thing someone
 * mentions first leads the protocol, the same way the first chip tapped does.
 *
 * Returns `[]` when nothing matches. That is a real answer and the caller shows it.
 */
export function matchGoals(message: string): GoalId[] {
  const text = message.trim();
  if (!text) return [];

  const hits: { goal: GoalId; at: number }[] = [];

  for (const [goal, keywords] of Object.entries(GOAL_KEYWORDS) as [GoalId, string[]][]) {
    let earliest = -1;
    for (const keyword of keywords) {
      const at = firstIndexOf(text, keyword);
      if (at !== -1 && (earliest === -1 || at < earliest)) earliest = at;
    }
    if (earliest !== -1) hits.push({ goal, at: earliest });
  }

  return hits.sort((a, b) => a.at - b.at).map((hit) => hit.goal);
}
