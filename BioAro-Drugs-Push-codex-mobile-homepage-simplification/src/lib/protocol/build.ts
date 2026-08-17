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

/* The wider intake. Every one of these changes at least one product for some answer —
   that is the bar for existing at all, and `changesOutcome` in questions.ts enforces
   it per session rather than trusting this list. */
export type SexAnswer = "female" | "male" | "prefer-not-to-say";
export type AgeAnswer = "under-30" | "30-49" | "50-plus";
export type ActivityAnswer = "sedentary" | "moderate" | "very-active";
export type StressAnswer = "low" | "moderate" | "high";
export type DietAnswer = "omnivore" | "vegetarian" | "vegan";
export type SupplementsAnswer = "none" | "multivitamin" | "omega-3" | "protein";

export interface ProtocolAnswers {
  /* Several goals, in the order they were chosen: the first leads the protocol.
     One product often serves two goals, so the builder de-duplicates rather than
     listing the same formula twice. */
  goals: GoalId[];
  energy: EnergyAnswer;
  sleep: SleepAnswer;
  training: TrainingAnswer;

  /* Optional so a protocol still builds from goals alone — the preview has to exist
     before the intake is finished. */
  sex?: SexAnswer;
  age?: AgeAnswer;
  activity?: ActivityAnswer;
  stress?: StressAnswer;
  diet?: DietAnswer;
  supplements?: SupplementsAnswer;

  /* CLINICAL CONTEXT. Deliberately NOT read by buildProtocol — see the note at the
     bottom of this file. It travels with the answers so the surfaces can raise a
     notice, and it changes no product. */
  clinicalFlag?: boolean;
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
 * `sleep` is deliberately absent. There is no shipping sleep formula — SleepO is a
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

/* Exported so the PDP can show where a product sits in a day without keeping its own
   copy of the mapping — one source, so the product page and the protocol can never
   disagree about when something is taken. */
export const SLOT_BY_HANDLE: Record<string, ProtocolSlot> = {
  "longevity-plus": "Morning",
  "cellomega-plus": "Morning",
  "creagen-brain-boost": "Morning",
  "creagen-femme-energy": "Morning",
  "creagen-raw-power": "Around training",
  "creagen-pro-power": "Around training",
  glutara: "Evening",

  /* The wider range. Most of these are coming-soon in every market today; the
     builder recommends them anyway and the preview marks them, rather than
     pretending the right answer does not exist. */
  "adrenal-support-plus": "Morning",
  "mens-vitalprime": "Morning",
  "womens-vitalprime": "Morning",
  "vitamin-k2-d3": "Morning",
  plantcore: "Around training",
  "bioprotein-pro": "Around training",
  musclerecover: "Around training",
  magbalance: "Evening",
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

  // 5. Stress load. StressAdapt is the adaptogen formula in the range; "supports the
  //    body's response to stress" is what its own label claims, and no more.
  if (answers.stress === "high") {
    add("adrenal-support-plus", "You described your stress as high, so the protocol includes the adaptogen formula.");
  } else if (answers.stress === "moderate" && answers.sleep !== "restful") {
    add("magbalance", "Moderate stress alongside uneven sleep, so magnesium is included for evening wind-down.");
  }

  // 6. Diet. This is a real fork rather than a preference: the two protein formulas
  //    differ by source, so a vegan answer changes WHICH product, not whether one is
  //    offered. Only relevant when training is actually part of the picture.
  const trains = answers.training === "daily" || answers.training === "sometimes" || answers.activity === "very-active";
  if (trains) {
    if (answers.diet === "vegan" || answers.diet === "vegetarian") {
      add("plantcore", "You eat plant-based, so the protocol uses the pea and rice protein rather than whey.");
    } else if (answers.diet === "omnivore") {
      add("bioprotein-pro", "You train regularly and eat omnivore, so the whey isolate is included for recovery.");
    }
  }

  // 7. Sex and age route the daily multivitamin. `prefer-not-to-say` deliberately
  //    routes nowhere — an answer that declines to answer must not be guessed past.
  if (answers.sex === "female") {
    add("womens-vitalprime", "The daily multivitamin formulated for women.");
  } else if (answers.sex === "male") {
    add("mens-vitalprime", "The daily multivitamin formulated for men.");
  }

  if (answers.age === "50-plus") {
    add("vitamin-k2-d3", "Over fifty, so the protocol includes vitamin D3 and K2 for bone and cardiovascular support.");
  }

  /* 8. WHAT THEY ALREADY TAKE. This is the only rule that REMOVES rather than adds,
        and it is the one that stops the intake being a sales funnel: somebody already
        taking omega-3 does not need to be sold the omega formula, and somebody on a
        multivitamin does not need a second one. Runs last so it can see everything
        the earlier rules added. */
  const alreadyCovered: Partial<Record<NonNullable<ProtocolAnswers["supplements"]>, string[]>> = {
    "omega-3": ["cellomega-plus"],
    multivitamin: ["mens-vitalprime", "womens-vitalprime"],
    protein: ["plantcore", "bioprotein-pro"],
  };

  const covered = answers.supplements ? (alreadyCovered[answers.supplements] ?? []) : [];
  const removed = items.filter((item) => covered.includes(item.handle)).map((item) => item.handle);

  if (removed.length > 0) {
    for (const handle of removed) {
      const index = items.findIndex((item) => item.handle === handle);
      if (index >= 0) items.splice(index, 1);
      taken.delete(handle);
    }
    notes.push(
      "You told us what you already take, so the overlapping formula has been left out rather than duplicated.",
    );
  }

  /* 9. The fallback must not re-add what step 8 just removed. Goal "energy" plus
        "I already take omega-3" removes the only item, and a naive fallback put the
        omega formula straight back — telling somebody to buy the thing they had just
        said they take.

        When there is genuinely nothing left to add, the protocol says so. "What you
        already take covers this" is a real and useful answer, and a better one than
        inventing a product to fill the space. */
  if (items.length === 0) {
    if (!covered.includes("cellomega-plus")) {
      add("cellomega-plus", "A foundational daily formula, as a starting point you can build on.");
    } else {
      notes.push(
        "What you already take covers this goal. There is nothing worth adding on top of it right now.",
      );
    }
  }

  items.sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot));
  return { items, notes };
}

/*
 * ---------------------------------------------------------------------------
 * WHY `clinicalFlag` IS NOT READ ABOVE
 *
 * The intake asks whether someone is pregnant, breastfeeding, taking prescription
 * medication or managing a condition. That answer raises a notice pointing at a
 * healthcare professional, and it changes NOTHING here.
 *
 * Quietly adding or removing a product on the back of it would imply this engine
 * performs an interaction or contraindication check. It does not. A visitor would
 * reasonably read a changed protocol as "the system accounted for my medication",
 * and that inference would be false and potentially harmful.
 *
 * A test asserts the flag changes no item, in either direction.
 * ---------------------------------------------------------------------------
 */
