import {
  buildProtocol,
  type ProtocolAnswers,
  type EnergyAnswer,
  type GoalId,
  type SleepAnswer,
  type TrainingAnswer,
} from "./build";

/*
 * Which questions BioAro Drugs AI asks, and which it does not.
 *
 * ---------------------------------------------------------------------------
 * A QUESTION HAS TO EARN ITS SLOT
 *
 * The rule is not "ask three" or "ask the ones that feel related". It is: ask a
 * question only when the answer can still change the protocol.
 *
 * That is computed, not judged — `changesOutcome` builds the protocol for every
 * possible answer and keeps the question only when the results differ. So somebody
 * whose goal is Recovery is never asked how often they train, because the recovery
 * formula is already in their protocol and no answer would move it. Somebody whose
 * goal is Energy is never asked about their energy pattern, for the same reason.
 *
 * This is what stops the builder feeling like a form. The alternative — asking
 * everyone the same four questions and discarding most of the answers — is what a
 * quiz does, and it is why the previous flow read as one.
 *
 * ---------------------------------------------------------------------------
 * PHRASING ADAPTS; THE ENGINE DOES NOT
 *
 * Every question answers one of the three fields `buildProtocol` already consumes.
 * Goal-specific variants are better WORDING of the same question, never a new input
 * with nowhere to go — an answer the engine cannot read is decoration, and the
 * visitor cannot tell the difference until the protocol ignores what they said.
 *
 * Each variant's option labels must describe the same thing its value means. "Most
 * days" for `rarely` would be a lie in the one place a visitor cannot check it.
 * ---------------------------------------------------------------------------
 */

export type AnswerField =
  | "energy"
  | "sleep"
  | "training"
  | "sex"
  | "age"
  | "activity"
  | "stress"
  | "diet"
  | "supplements";

/*
 * The three stages of the intake.
 *
 *   about    — changes the protocol. Everything in Stage 1.
 *   clinical — raises a notice and changes NOTHING. See the note in build.ts.
 *   precision — biomarkers, labs, genetics, wearables. Named, never asked.
 */
export type QuestionStage = "about" | "clinical" | "precision";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface ProtocolQuestion {
  id: string;
  field: AnswerField;
  stage: QuestionStage;
  prompt: string;
  options: QuestionOption[];
  /** Goals this phrasing is written for. Omitted means it is the general fallback. */
  appliesTo?: GoalId[];
}

/** Answers gathered so far. Every field is optional — the protocol builds regardless. */
export type PartialAnswers = Partial<Omit<ProtocolAnswers, "goals">>;

const FIELD_VALUES: Record<AnswerField, string[]> = {
  energy: ["steady", "dips", "crashes"],
  sleep: ["restful", "inconsistent", "poor"],
  training: ["daily", "sometimes", "rarely"],
  sex: ["female", "male", "prefer-not-to-say"],
  age: ["under-30", "30-49", "50-plus"],
  activity: ["sedentary", "moderate", "very-active"],
  stress: ["low", "moderate", "high"],
  diet: ["omnivore", "vegetarian", "vegan"],
  supplements: ["none", "multivitamin", "omega-3", "protein"],
};

/*
 * The bank. Goal-specific variants first — `selectQuestions` takes the first match,
 * so a more specific phrasing always wins over the general one.
 */
const QUESTIONS: ProtocolQuestion[] = [
  // ------------------------------------------------------------------ energy
  {
    id: "energy-focus",
    field: "energy",
    stage: "about",
    appliesTo: ["focus"],
    prompt: "When does your focus start to fade?",
    options: [
      { value: "steady", label: "It holds up" },
      { value: "dips", label: "Mid-afternoon" },
      { value: "crashes", label: "Most of the day" },
    ],
  },
  {
    id: "energy-general",
    field: "energy",
    stage: "about",
    prompt: "How is your energy by mid-afternoon?",
    options: [
      { value: "steady", label: "Steady all day" },
      { value: "dips", label: "It dips a little" },
      { value: "crashes", label: "It crashes hard" },
    ],
  },

  // ------------------------------------------------------------------- sleep
  {
    id: "sleep-focused",
    field: "sleep",
    stage: "about",
    appliesTo: ["sleep"],
    prompt: "How often do you wake up rested?",
    options: [
      { value: "restful", label: "Most days" },
      { value: "inconsistent", label: "Some days" },
      { value: "poor", label: "Rarely" },
    ],
  },
  {
    id: "sleep-general",
    field: "sleep",
    stage: "about",
    prompt: "How has your sleep been lately?",
    options: [
      { value: "restful", label: "Restful" },
      { value: "inconsistent", label: "Inconsistent" },
      { value: "poor", label: "Poor" },
    ],
  },

  // ---------------------------------------------------------------- training
  {
    id: "training-athletic",
    field: "training",
    stage: "about",
    appliesTo: ["performance", "recovery"],
    prompt: "How hard are you training right now?",
    options: [
      { value: "daily", label: "Most days" },
      { value: "sometimes", label: "A few times a week" },
      { value: "rarely", label: "Not much right now" },
    ],
  },
  {
    id: "training-general",
    field: "training",
    stage: "about",
    prompt: "How often do you train?",
    options: [
      { value: "daily", label: "Most days" },
      { value: "sometimes", label: "A few times a week" },
      { value: "rarely", label: "Rarely" },
    ],
  },

  // ----------------------------------------------------------------- stress
  {
    id: "stress-general",
    field: "stress",
    stage: "about",
    prompt: "How much stress are you carrying at the moment?",
    options: [
      { value: "low", label: "Not much" },
      { value: "moderate", label: "A fair amount" },
      { value: "high", label: "A lot" },
    ],
  },

  // ------------------------------------------------------------------- diet
  {
    id: "diet-general",
    field: "diet",
    stage: "about",
    prompt: "How do you eat?",
    options: [
      { value: "omnivore", label: "I eat everything" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "vegan", label: "Vegan" },
    ],
  },

  // -------------------------------------------------------------- activity
  {
    id: "activity-general",
    field: "activity",
    stage: "about",
    prompt: "How active are your days overall?",
    options: [
      { value: "sedentary", label: "Mostly sitting" },
      { value: "moderate", label: "On my feet a fair bit" },
      { value: "very-active", label: "Very active" },
    ],
  },

  // -------------------------------------------------------------------- sex
  {
    id: "sex-general",
    field: "sex",
    stage: "about",
    /* "Prefer not to say" is a real option that routes NOWHERE, rather than being
       quietly treated as one of the other two. Declining to answer is an answer. */
    prompt: "Which daily multivitamin should this be built around?",
    options: [
      { value: "female", label: "The one for women" },
      { value: "male", label: "The one for men" },
      { value: "prefer-not-to-say", label: "Skip this" },
    ],
  },

  // -------------------------------------------------------------------- age
  {
    id: "age-general",
    field: "age",
    stage: "about",
    prompt: "Which age range are you in?",
    options: [
      { value: "under-30", label: "Under 30" },
      { value: "30-49", label: "30 to 49" },
      { value: "50-plus", label: "50 or over" },
    ],
  },

  // ------------------------------------------------------------ supplements
  {
    id: "supplements-general",
    field: "supplements",
    stage: "about",
    /* The only question whose answer can REMOVE a product. Asked late, so it can see
       what the rest of the intake has already put in the protocol. */
    prompt: "Are you already taking anything daily?",
    options: [
      { value: "none", label: "Nothing right now" },
      { value: "multivitamin", label: "A multivitamin" },
      { value: "omega-3", label: "Omega-3" },
      { value: "protein", label: "Protein" },
    ],
  },
];

/*
 * Stage 2. One screener, and it changes no product — see the note at the foot of
 * build.ts. It is kept out of QUESTIONS because `selectQuestions` only returns things
 * that alter the protocol, and by design this never does.
 */
export const CLINICAL_SCREENER = {
  id: "clinical-screener",
  stage: "clinical" as const,
  prompt:
    "Are you pregnant or breastfeeding, taking prescription medication, or managing a diagnosed condition?",
  options: [
    { value: "no", label: "None of these" },
    { value: "yes", label: "Yes, one or more" },
  ],
} as const;

/*
 * Ordering. The field closest to what someone actually asked for goes first, so the
 * builder opens on the question they were already thinking about.
 */
const REST: AnswerField[] = ["stress", "diet", "activity", "sex", "age", "supplements"];

const FIELD_PRIORITY: Record<GoalId, AnswerField[]> = {
  energy: ["energy", "sleep", "training", ...REST],
  focus: ["energy", "sleep", "training", ...REST],
  longevity: ["energy", "sleep", "training", ...REST],
  sleep: ["sleep", "energy", "training", ...REST],
  recovery: ["training", "sleep", "energy", ...REST],
  performance: ["training", "energy", "sleep", ...REST],
  "womens-health": ["energy", "sleep", "training", ...REST],
};

const DEFAULT_ORDER: AnswerField[] = ["energy", "sleep", "training", ...REST];

/**
 * Whether any answer to `field` would still change the protocol, given what is
 * already known. This is the whole selection rule.
 */
export function changesOutcome(field: AnswerField, goals: GoalId[], answers: PartialAnswers): boolean {
  if (goals.length === 0) return false;

  const shapes = FIELD_VALUES[field].map((value) => {
    /* Unanswered fields are held at the value that adds nothing, so the comparison
       measures THIS field's effect rather than the absence of the others. */
    const merged = {
      ...answers,
      energy: (answers.energy ?? "steady") as EnergyAnswer,
      sleep: (answers.sleep ?? "restful") as SleepAnswer,
      training: (answers.training ?? "rarely") as TrainingAnswer,
      [field]: value,
    } as Omit<ProtocolAnswers, "goals">;

    // Items, slots, reasons AND notes — a question that only changes the wording of
    // a disclosure is still doing work, because that disclosure is the honest part.
    return JSON.stringify(buildProtocol({ goals, ...merged }));
  });

  return new Set(shapes).size > 1;
}

/**
 * The questions still worth asking, in order. Returns `[]` when the protocol is as
 * refined as the engine can make it — which is how the UI knows it is finished.
 */
export function selectQuestions(goals: GoalId[], answers: PartialAnswers): ProtocolQuestion[] {
  if (goals.length === 0) return [];

  const order = FIELD_PRIORITY[goals[0]] ?? DEFAULT_ORDER;

  return order
    .filter((field) => answers[field] === undefined)
    .filter((field) => changesOutcome(field, goals, answers))
    .map((field) => {
      const specific = QUESTIONS.find(
        (question) =>
          question.field === field && question.appliesTo?.some((goal) => goals.includes(goal)),
      );
      const general = QUESTIONS.find((question) => question.field === field && !question.appliesTo);
      return specific ?? general;
    })
    .filter((question): question is ProtocolQuestion => Boolean(question));
}

/** The next question, or null when there is nothing left worth asking. */
export function nextQuestion(goals: GoalId[], answers: PartialAnswers): ProtocolQuestion | null {
  return selectQuestions(goals, answers)[0] ?? null;
}

/*
 * ---------------------------------------------------------------------------
 * PRECISION-HEALTH INPUTS — ARCHITECTURE ONLY, DELIBERATELY UNREACHABLE
 *
 * The shape these will take when BioAro Drugs can genuinely read them. Nothing here
 * is rendered, offered, or hinted at, and `selectQuestions` cannot return one:
 * `AVAILABLE_INPUT_CATEGORIES` is what the UI is allowed to ask about, and it lists
 * only the three that exist.
 *
 * Declaring the type is not the same as claiming the capability. A "coming soon"
 * badge for biomarker analysis would be a claim about what this product does, and
 * it does not do it yet.
 * ---------------------------------------------------------------------------
 */
export type InputCategory =
  | "self-reported"
  | "biomarkers"
  | "lab-results"
  | "genetics"
  | "wearables"
  | "medications";

export const AVAILABLE_INPUT_CATEGORIES: InputCategory[] = ["self-reported"];

export function isInputCategoryAvailable(category: InputCategory): boolean {
  return AVAILABLE_INPUT_CATEGORIES.includes(category);
}
