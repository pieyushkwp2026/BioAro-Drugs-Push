/*
 * The BioAro Drugs Protocol Builder engine.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS REPLACES
 *
 * The previous version asked four questions and then read `answers[0]`. Questions
 * two, three and four were collected into state and never referenced again, so two
 * people with opposite sleep, energy and training answers received identical output
 * from a four-row lookup table — under a badge reading "Personalized guidance".
 *
 * Every answer now changes the result, and every product in the output carries the
 * answer that put it there, so the "why" shown to the customer is generated from the
 * same data as the recommendation rather than written separately.
 *
 * ---------------------------------------------------------------------------
 * THE SEAM
 *
 * This is a pure function: answers in, protocol out, no imports from React, the
 * catalogue, or the network. When a real model layer arrives it replaces the body of
 * `buildProtocol` (or is called from an async wrapper) without any UI moving, and the
 * `reason` strings become model output instead of literals.
 *
 * Until then, nothing customer-facing may describe this as analysis of the visitor's
 * biology. It matches stated goals and routine answers to products. That is all it
 * does, and the copy says so.
 * ---------------------------------------------------------------------------
 */

export type GoalId =
  | "energy"
  | "longevity"
  | "focus"
  | "recovery"
  | "sleep"
  | "performance"
  | "womens-health";

export type EnergyAnswer = "steady" | "dips" | "crashes";
export type SleepAnswer = "restful" | "inconsistent" | "poor";
export type TrainingAnswer = "daily" | "sometimes" | "rarely";

export interface ProtocolAnswers {
  /* Several goals, in the order they were chosen: the first leads the protocol.
     One product often serves two goals, so the builder de-duplicates rather than
     listing the same formula twice. */
  goals: GoalId[];
  energy: EnergyAnswer;
  sleep: SleepAnswer;
  training: TrainingAnswer;
}

export type ProtocolSlot = "Morning" | "Around training" | "Evening";

export interface ProtocolItem {
  handle: string;
  slot: ProtocolSlot;
  /** Why this product is in THIS protocol, derived from the answers given. */
  reason: string;
}

export interface Protocol {
  items: ProtocolItem[];
  /** Honest caveats. Rendered prominently, never buried. */
  notes: string[];
}

/* Goal → the formula that leads the protocol.
 *
 * `sleep` is deliberately absent. There is no shipping sleep formula — Sleep0+ is a
 * placeholder listing and SleepO Kids is a draft — so the goal resolves to no primary
 * product and the builder says so, instead of quietly returning a non-sleep product
 * and calling it a match the way the old lookup table did. */
const PRIMARY_BY_GOAL: Partial<Record<GoalId, { handle: string; reason: string }>> = {
  energy: { handle: "cellomega-plus", reason: "Your goal is daily energy, and this is the foundational formula the range is built on." },
  longevity: { handle: "longevity-plus", reason: "Your goal is healthy ageing, which is what this formula is built around." },
  focus: { handle: "creagen-brain-boost", reason: "Your goal is focus, so the protocol leads with the cognitive formula." },
  recovery: { handle: "creagen-pro-power", reason: "Your goal is recovery, so the protocol leads with the post-training formula." },
  performance: { handle: "creagen-raw-power", reason: "Your goal is performance, so the protocol leads with straight creatine." },
  "womens-health": { handle: "creagen-femme-energy", reason: "Your goal is women's health, so the protocol leads with the formula made for it." },
};

const SLOT_BY_HANDLE: Record<string, ProtocolSlot> = {
  "longevity-plus": "Morning",
  "cellomega-plus": "Morning",
  "creagen-brain-boost": "Morning",
  "creagen-femme-energy": "Morning",
  "creagen-raw-power": "Around training",
  "creagen-pro-power": "Around training",
  glutara: "Evening",
};

const SLOT_ORDER: ProtocolSlot[] = ["Morning", "Around training", "Evening"];

export function buildProtocol(answers: ProtocolAnswers): Protocol {
  const items: ProtocolItem[] = [];
  const notes: string[] = [];
  const taken = new Set<string>();

  const add = (handle: string, reason: string) => {
    if (taken.has(handle)) return;
    taken.add(handle);
    items.push({ handle, slot: SLOT_BY_HANDLE[handle] ?? "Morning", reason });
  };

  // 1. The goals lead, in the order they were chosen. `add` ignores repeats, so a
  //    formula that serves two of the selected goals appears once.
  const goals = answers.goals ?? [];
  let matchedAnyGoal = false;

  for (const goal of goals) {
    const primary = PRIMARY_BY_GOAL[goal];
    if (!primary) continue;
    add(primary.handle, primary.reason);
    matchedAnyGoal = true;
  }

  // Sleep is the only selectable goal with no formula behind it. Say so, and only
  // when it was actually picked — a visitor who chose Sleep alongside Focus should
  // still be told, but not told twice.
  if (goals.includes("sleep")) {
    notes.push(
      matchedAnyGoal
        ? "BioAro Drugs does not have a sleep formula yet, so this protocol is built around your other goals. We will not recommend something that is not made for the goal you picked."
        : "BioAro Drugs does not have a sleep formula yet, so this protocol is built around the rest of what you told us. We will not recommend something that is not made for the goal you picked.",
    );
  }

  // 2. Training load. Someone training regularly gets recovery support they did not
  //    ask for by name — this is the answer the old builder threw away.
  if (answers.training === "daily") {
    add("creagen-pro-power", "You train daily, so recovery support sits alongside your main goal rather than after it.");
  } else if (answers.training === "sometimes") {
    add("creagen-pro-power", "You train a few times a week, so there is recovery support for the days you do.");
  }

  // 3. Energy pattern.
  if (answers.energy === "crashes") {
    add("cellomega-plus", "You said your energy crashes during the day, so the protocol includes the foundational daily formula.");
  } else if (answers.energy === "dips" && items.length < 2) {
    add("cellomega-plus", "You said your energy dips during the day, so the foundational daily formula is included.");
  }

  // 4. Sleep quality. No sleep product exists, so this adds recovery support and is
  //    explicit about what it is NOT doing.
  if (answers.sleep === "poor" || answers.sleep === "inconsistent") {
    add("glutara", "You told us your sleep is not consistent. This supports recovery generally — it is not a sleep formula.");
    notes.push(
      "Sleep quality is worth raising with a healthcare professional if it persists. Nothing here is intended to treat a sleep problem.",
    );
  }

  // 5. Never return an empty protocol.
  if (items.length === 0) {
    add("cellomega-plus", "A foundational daily formula, as a starting point you can build on.");
  }

  items.sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot));
  return { items, notes };
}
