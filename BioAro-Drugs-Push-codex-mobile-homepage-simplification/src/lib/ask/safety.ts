/*
 * Safety gate. This runs BEFORE any retrieval, so a medical or urgent question can
 * never fall through to a product answer.
 *
 * The base list is carried over from the archived HeroAISearch component, which read
 * as legal-reviewed, with two changes:
 *
 *  1. Word boundaries. The originals were unanchored, so /cure/ matched "secure",
 *     /treat/ matched "retreat" and /liver/ matched "deliver". Harmless in direction
 *     (it over-triggered) but it made the box feel broken.
 *  2. Extended coverage. The original had no term for arthritis, menopause, thyroid,
 *     ADHD, insomnia, cholesterol, statins, blood thinners, chemotherapy, autoimmune
 *     conditions, fertility, or questions asked on behalf of a child.
 *
 * A denylist is unbounded by nature and this one will still have gaps. It is adequate
 * for retrieval of pre-approved copy, where the worst case is that an approved FAQ
 * answer is shown to someone who should see the referral instead. It would NOT be
 * adequate as the safety layer for generated text: see the note in index.ts.
 */
export const SENSITIVE_TERMS: RegExp[] = [
  // Urgent or emergency
  /\b(emergency|urgent|severe pain|chest pain|heart attack|stroke|suicide|self[-\s]?harm|overdose)\b/i,

  // Named conditions
  /\b(cancer|tumou?rs?|diabetes|diabetic|kidney|liver|blood pressure|hypertension|cholesterol|thyroid|arthritis|autoimmune|epilepsy|asthma|ibs|crohn)\b/i,

  // Life stages and populations needing individual advice
  /\b(pregnan\w*|breastfeeding|nursing|menopaus\w*|fertility|ttc|my (son|daughter|child)|toddler|infant|children|kids?)\b/i,

  // Clinical framing and medication
  /\b(diagnos\w*|cure[sd]?|curing|treat(s|ed|ing|ment)?|disease|symptoms?|medications?|medicines?|prescription|statins?|warfarin|blood thinner|antidepressant|chemo\w*|surgery)\b/i,

  // Mental health
  /\b(depression|depressed|anxiety|adhd|bipolar|insomnia)\b/i,
];

export const SAFETY_NOTE =
  "BioAro Drugs AI provides general product guidance using approved BioAro Drugs product information. It does not diagnose conditions or replace professional medical advice.";

export const SENSITIVE_HEADING = "This needs professional guidance";

export const SENSITIVE_BODY =
  "BioAro Drugs AI can help you explore general wellness products, but it cannot assess urgent symptoms, diagnose a condition or replace medical care. Please speak with a qualified healthcare professional for personal guidance.";

/*
 * A deliberately tiny exemption list, checked BEFORE the denylist.
 *
 * These are regulatory-category questions, not clinical ones — "is this a medicine"
 * asks what kind of product this is, and BioAro Drugs has an approved answer to it
 * sitting in the site FAQ: "No. BioAro Drugs products are wellness products and food
 * supplements. They are not intended to replace medical care."
 *
 * Without this, the clinical regex swallowed the query and the brand refused to show
 * its own approved answer to its own published question. Nothing here weakens the
 * gate for symptoms, conditions, medication interactions or life stages; those stay
 * blocked, which is the direction that matters.
 */
const NON_CLINICAL_EXEMPTIONS: RegExp[] = [
  /^\s*(is|are)\s+(this|these|it|they|bioaro\w*)\s+(a\s+)?(medicine|medicines|drug|drugs|medication|medications)\b\s*\??\s*$/i,
  /^\s*(is|are)\s+(this|these|it|they)\s+(a\s+)?(prescription|pharmaceutical)\b\s*\??\s*$/i,
];

export function isSensitive(query: string): boolean {
  if (NON_CLINICAL_EXEMPTIONS.some((pattern) => pattern.test(query))) return false;
  return SENSITIVE_TERMS.some((term) => term.test(query));
}

/*
 * Questions that are really "choose a product for me". BioAro Drugs AI deliberately does
 * not answer these: the quiz is the recommendation path, and duplicating it inside a
 * text box would give the site two competing recommenders.
 */
const RECOMMENDATION_PATTERNS: RegExp[] = [
  /\bwhich (one|product|formula)\b/i,
  /\bwhat (should|do) i (take|try|use|start with|buy)\b/i,
  /*
   * Anchored to first-person intent. This used to be a bare /\brecommend\w*\b/, which
   * also matched "recommended" — so "what is the recommended dosage", the single most
   * common supplement question and a purely factual one the corpus can answer, was
   * bounced to the quiz. BioAro Drugs' own labels use the phrase ("Recommended daily
   * intake"), so the site was refusing to answer its own wording.
   */
  /\b(recommend|suggest)\s+(me|a|an|any|something|which)\b/i,
  /\bwhat.{0,20}\b(do you|would you)\s+recommend\b/i,
  /\bright for me\b/i,
  /\bbest for me\b/i,
  /\bsuit(s|able for)? me\b/i,
  /\bhelp me (choose|pick|decide)\b/i,
  /\bwhere (do|should) i start\b/i,
];

export function isRecommendationRequest(query: string): boolean {
  return RECOMMENDATION_PATTERNS.some((pattern) => pattern.test(query));
}
