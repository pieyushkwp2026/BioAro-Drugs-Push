/*
 * Homepage content, kept out of JSX so copy stays editable without touching layout.
 *
 * Two rules govern everything in this file:
 *
 *  1. NAMING. The brand is "BioAro Drugs" and the platform is "BioAro Drugs AI".
 *     Never a bare "BioAro" in customer-facing copy.
 *
 *  2. WHAT THE AI IS ALLOWED TO CLAIM. BioAro Drugs AI is the platform identity.
 *     The capability that is actually live is the Protocol Builder: it takes goals
 *     and routine information the visitor types in, and maps them to products and
 *     protocol options. It does NOT analyse biology, biomarkers, genetics,
 *     medications or wearable data, and copy here must never imply that it does.
 *     Equally, the implementation is not described to customers in engineering
 *     terms — no "keyword retrieval", no "rules engine". Plain language only.
 */

export const HERO = {
  /* The third line carries a non-breaking space inside "BioAro Drugs". At 360-390px
     the line is too long to hold at hero scale and must wrap; without this it wraps
     mid-brand, as "Your BioAro / Drugs Protocol." The NBSP forces the break to fall
     after the brand instead. */
  headline: ["Your Goals.", "Your Routine.", "Your BioAro Drugs Protocol."],
  standfirst: "AI-guided personalization meets evidence-informed bioactive formulations.",
  explainer:
    "Tell BioAro Drugs AI what you want to improve. It maps your goals and daily routine to the formulas that fit, and builds you a starting protocol.",
  primaryCta: "Build My Protocol",
  secondaryCta: "Shop BioAro Drugs",
  /* Four words, one hairline row. Every one of them is either demonstrated further
     down the page or already true of the product; none is a certification claim. */
  markers: ["AI-Guided", "Evidence-Informed", "Transparent", "Personalized"],
} as const;

/*
 * The seven goals the builder opens with.
 *
 * `handle` is the product a goal actually leads to, and it is deliberately nullable.
 * Sleep has no shipping product — Sleep0+ is a placeholder listing and SleepO Kids is
 * a draft — so the goal is offered and then answered honestly rather than quietly
 * resolving to something that is not a sleep formula.
 *
 * Chips carry no per-goal colour. The four domain colours (clarity/strength/recovery/
 * longevity) are a fixed four-part system used elsewhere on the site; stretching it
 * to seven would mean inventing three more accents and diluting all of them. Chips
 * are neutral until selected, then ember.
 */
export interface HomepageGoal {
  id: string;
  label: string;
  /** Product handle this goal leads to, or null where no product exists yet. */
  handle: string | null;
}

export const GOALS: HomepageGoal[] = [
  { id: "energy", label: "Energy", handle: "cellomega-plus" },
  { id: "longevity", label: "Longevity", handle: "longevity-plus" },
  { id: "focus", label: "Focus", handle: "creagen-brain-boost" },
  { id: "recovery", label: "Recovery", handle: "creagen-pro-power" },
  { id: "sleep", label: "Sleep", handle: null },
  { id: "performance", label: "Performance", handle: "creagen-raw-power" },
  { id: "womens-health", label: "Women's Health", handle: "creagen-femme-energy" },
];

export const AI_SECTION = {
  /* The AI name belongs HERE and only here in the protocol path: this is the
     interpretation layer, where free text is taken in. The Protocol Builder it hands
     off to stays "Protocols backed by science", because a structured four-question
     workflow is not a model and should not claim to be one.
     AI understands → Builder structures → Science explains → Products fulfil. */
  eyebrow: "BioAro Drugs AI",
  headline: "Build around what matters to you.",
  body: "Tell BioAro Drugs what you want to improve. We will help build a starting protocol around your goals and routine.",
  placeholder: "I want better focus and energy through the day…",
  cta: "Build my protocol",
  duration: "About 60 seconds",
  emptyHint: "Choose a goal to continue",
  send: "Match my goals",
  continueCta: "Continue to your protocol",
  /* The modal frame. `close` is the accessible name for the control and reads as a
     verb because that is what a screen reader announces on focus. */
  dialogLabel: "Build your protocol with BioAro Drugs AI",
  close: "Close",
  /* The modal asks rather than restates. Repeating the section headline and body
     inside a panel opened FROM that section is the duplication this site keeps
     removing — by the time it is open, the pitch has landed and the task is what
     is left. */
  studioHeadline: "What do you want to improve?",
  /* Provenance, stated. These chips came from matching words in the message — the
     copy says "matched", never "understood" or "interpreted", because a keyword
     table is not a model. */
  matchedCaption: "Matched from what you wrote. Change any of them.",
  matchedClear: "Clear",
  noMatch:
    "We could not match that to a goal yet. Pick one below and the protocol will build from there.",
  /* One line of honesty on the homepage; the full `disclosure` below renders on the
     builder page. The steps render on both, at different granularity — labels only
     here as a progress spine, with their bodies on the builder page where someone is
     actually about to walk through them. */
  homepageNote:
    "The builder works from the goals and routine you describe. It does not read biomarkers or genetic data.",

  /* Step 4 is where copy of this kind usually overreaches, so it says what the
     builder produces — a starting point you can adjust — rather than implying a
     clinical output. */
  steps: [
    { title: "Goals", body: "You tell BioAro Drugs what you want to improve and how your days actually run." },
    { title: "Framework", body: "Your answers are matched against the BioAro Drugs range and its formulation framework." },
    { title: "Rationale", body: "You see why a formula is relevant to you, in plain language, before you buy anything." },
    { title: "Starting protocol", body: "You get a suggested starting protocol — a beginning you can adjust, not a prescription." },
  ],
  disclosure:
    "BioAro Drugs AI works from the goals and routine information you provide. It does not diagnose conditions, read biomarkers or genetic data, and it does not replace professional medical advice.",
} as const;

/*
 * The Protocol Builder page. Its own copy, deliberately NOT shared with AI_SECTION:
 * the two labels differ by design — AI at the entry, science at the structured
 * workflow — and pointing the builder at AI_SECTION.eyebrow once already caused both
 * pages to rename together the moment the entry was rebranded.
 */
export const BUILDER = {
  eyebrow: "Protocols backed by science",
  noteLabel: "What you told us",
} as const;

export const PRODUCTS_SECTION = {
  headline: ["Science-led formulas.", "Built to work together."],
  body: "Seven formulas across clarity, strength, recovery and longevity. Every one of them lists what is inside and how much.",
  primaryCta: "Shop All Products",
  secondaryCta: "Build My Protocol",
} as const;

export const WHY_SECTION = {
  eyebrow: "Why BioAro Drugs",
  headline: ["Built by health experts.", "Guided by science."],
  standfirst:
    "Five things that decide what goes into a BioAro Drugs formula, and what stays out.",
  points: [
    {
      title: "AI-guided personalization",
      body: "BioAro Drugs AI turns what you want to improve into a starting protocol, so you are not choosing from a shelf on instinct.",
    },
    {
      title: "Evidence-informed formulation",
      body: "Ingredients earn their place on the evidence behind them and the dose that evidence supports — not on how well they market.",
    },
    {
      title: "Transparent by design",
      body: "Every ingredient, every amount, every reason it is in the formula. No proprietary blends hiding the numbers.",
    },
    {
      title: "Built as protocols",
      body: "The formulas are designed to make sense together across a day, not only to stand alone on a product page.",
    },
    {
      title: "Designed for real routines",
      body: "Single-serve sachets that tear open in seconds, because the protocol that works is the one you actually keep.",
    },
  ],
} as const;

export const SCIENCE_SECTION = {
  headline: ["Know what you're taking.", "Know why."],
  body: "Most supplement labels ask for trust. This is the full formulation of LONgevity+, at the doses it ships with — the same disclosure sits on every product page.",
  /* The handle whose live ingredient table is rendered on the homepage. Pulled from
     the catalogue at runtime, so it can never drift from the product page. */
  featuredHandle: "longevity-plus",
  cta: "See the full science",
  proofPoints: [
    {
      title: "Full formulations",
      body: "Every active, with its amount. Other ingredients and excipients are listed too, not buried.",
    },
    {
      title: "Ingredient-level rationale",
      body: "Each ingredient carries a plain-language reason for being in the formula at that dose.",
    },
    {
      title: "Third-party tested",
      body: "Independently checked for purity and potency, rather than taken on our own word.",
    },
  ],
} as const;

/*
 * The illustrative day.
 *
 * Slot labels are taken from what the product labels ACTUALLY say, not from a tidy
 * morning/noon/night story. LONgevity+ and CellOmega+ both direct "daily with food";
 * Creagen Pro Power says "during or after training" in its own words; Glutara says
 * "daily" with no time attached, so its slot is honest about that rather than
 * inventing an evening instruction the label does not give. Each row also prints the
 * product's real dosage line, so the claim and the evidence sit together.
 */
/* `icon` is a stable key, not a component: this file stays free of UI imports, and
   the component maps the key to a glyph. Keying off the display string instead would
   break the moment a slot is relabelled. */
export type ProtocolSlotIcon = "morning" | "training" | "evening";

export const PROTOCOL_EXAMPLE: {
  slot: string;
  note: string;
  icon: ProtocolSlotIcon;
  handles: string[];
}[] = [
  { slot: "Morning", note: "With food", icon: "morning", handles: ["longevity-plus", "cellomega-plus"] },
  { slot: "Around training", note: "During or after", icon: "training", handles: ["creagen-pro-power"] },
  { slot: "Evening", note: "Any time of day — most people anchor it to the end of theirs", icon: "evening", handles: ["glutara"] },
];

export const PROTOCOL_SECTION = {
  eyebrow: "Your BioAro Drugs Protocol",
  headline: ["One person.", "One protocol."],
  body: "Here is what a protocol looks like when it is built around a goal rather than a shelf. Your starting protocol is shaped by the goals and routine you describe, so it will not look like this one.",
  illustrativeNote: "Example protocol, shown to illustrate the shape. Not a recommendation.",
  cta: "Build My Protocol",
  addAllCta: "Add this protocol to cart",
} as const;

/*
 * FOUNDER — verified details only.
 *
 * The name and the credential line below are the whole of what has been confirmed.
 * Do NOT add "MD", "FRCPC", "Founder & Chairman" or "Precision Health Physician":
 * those were proposed and explicitly withheld pending verification against an
 * authoritative source. No portrait ships until a confirmed image of Dr. Kapoor is
 * supplied — an unverified face under a real person's name is worse than no face.
 */
export const FOUNDER = {
  eyebrow: "From the founder",
  name: "Dr. Anmol S. Kapoor",
  credentials: "Cardiologist · CEO & Founder, BioAro Inc.",
  headline: "Built around precision health.",
  statement: [
    "BioAro Drugs was created around a simple idea: supplementation should become more personalized, transparent and evidence-informed.",
    "People are asked to take things daily without being told what is in them, how much, or why. That is the part we set out to change first.",
  ],
  cta: "Meet Dr. Kapoor",
} as const;

export const LIBRARY_SECTION = {
  eyebrow: "BioAro Drugs Science",
  headline: "The science, written to be understood.",
  body: "Explainers on bioactives, longevity, recovery and formulation quality — in plain language, without the marketing.",
  cta: "Explore BioAro Drugs Science",
} as const;

export const CLOSING_SECTION = {
  headline: "Start building your BioAro Drugs protocol.",
  body: "Two minutes of questions, and you will know what to take and why.",
  /*
   * CLIENT-SUPPLIED CLAIM, retained on explicit instruction (2026-08-14) after being
   * flagged. This project cannot currently evidence it: the confirmed-evidence record
   * is third-party testing only, and PRODUCT.md lists customer counts under "none
   * established". Reconcile or delete before launch.
   */
  trustLine:
    "Trusted by a hundred health experts and thousands of customers, and built to be judged on what is actually in the sachet.",
  primaryCta: "Build My Protocol",
  secondaryCta: "Shop Products",
} as const;
