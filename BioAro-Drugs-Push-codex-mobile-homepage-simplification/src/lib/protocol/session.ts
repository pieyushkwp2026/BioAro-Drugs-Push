import { buildProtocol, type EnergyAnswer, type GoalId, type Protocol, type SleepAnswer, type TrainingAnswer } from "./build";
import { nextQuestion, selectQuestions, type AnswerField, type PartialAnswers, type ProtocolQuestion } from "./questions";

/*
 * BioAroProtocolSession — one state, every surface.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * There were two journeys. The modal resolved goals and handed off to /quiz, which
 * then ran its own state, its own copy and its own step counter. A visitor
 * experienced BioAro Drugs AI, and then a questionnaire — and the seam was visible
 * because there genuinely was one.
 *
 * This is the seam removed. The modal and /quiz are two frames onto this object.
 * Neither owns any protocol state; both read `completionState` rather than deciding
 * independently how finished the protocol is, which is what keeps a draft from being
 * labelled "draft" in one place and final in another.
 *
 * NO REACT AND NO `import.meta` IN THIS FILE. The part with the actual behaviour has
 * to be unit-testable, and `import.meta.env` does not survive the CommonJS test
 * build.
 *
 * ---------------------------------------------------------------------------
 * THE DIVISION OF RESPONSIBILITY IS UNCHANGED
 *
 * `buildProtocol` remains the only thing that decides products, slots, rationale and
 * disclosures. This module holds answers and asks it. A model may interpret intent
 * upstream; it never reaches in here.
 * ---------------------------------------------------------------------------
 */

/**
 * `intent`  — goals known, nothing asked yet. A protocol exists but is a first pass.
 * `refining` — questions outstanding; the protocol is a draft and will move.
 * `complete` — nothing left that would change it. Only now is it a starting protocol.
 */
export type CompletionState = "empty" | "intent" | "refining" | "complete";

export interface ProtocolSession {
  /** Preserved verbatim. Never re-interpreted, never shown back as a claim. */
  originalIntent: string;
  detectedGoals: GoalId[];
  answers: PartialAnswers;
  market: string;
  /** Where the goals came from, so provenance survives the handoff between surfaces. */
  source: "bioaro-ai-homepage" | "chips" | "deep-link";
  /** Whether Stage 2 has been put to the visitor yet, separate from their answer. */
  clinicalAsked?: boolean;
}

export interface SessionView {
  session: ProtocolSession;
  /* Stage 2 has been answered. Drives the notice, never the products. */
  clinicalAsked: boolean;
  clinicalFlag: boolean;
  protocol: Protocol | null;
  completionState: CompletionState;
  question: ProtocolQuestion | null;
  /** Questions still worth asking. Drives "3 questions remaining". */
  remaining: number;
  /** Answered ÷ (answered + remaining). For the progress rail. */
  progress: number;
}

export function createSession(init: Partial<ProtocolSession> = {}): ProtocolSession {
  return {
    originalIntent: init.originalIntent ?? "",
    detectedGoals: init.detectedGoals ?? [],
    answers: init.answers ?? {},
    market: init.market ?? "",
    source: init.source ?? "chips",
  };
}

export function setGoals(session: ProtocolSession, goals: GoalId[], source?: ProtocolSession["source"]): ProtocolSession {
  /*
   * Answers are kept across a goal change on purpose. Someone who adds Recovery after
   * saying they train daily should not be asked again — and `selectQuestions` will
   * drop any question the new goal set has made pointless anyway.
   */
  return { ...session, detectedGoals: goals, source: source ?? session.source };
}

export function answer(session: ProtocolSession, field: AnswerField, value: string): ProtocolSession {
  return { ...session, answers: { ...session.answers, [field]: value } };
}

/** Clears one answer so it gets asked again — the "adjust my answers" path. */
export function unanswer(session: ProtocolSession, field: AnswerField): ProtocolSession {
  const answers = { ...session.answers };
  delete answers[field];
  return { ...session, answers };
}

export function resetAnswers(session: ProtocolSession): ProtocolSession {
  return { ...session, answers: {}, clinicalAsked: false };
}

/**
 * Start over. Clears goals, answers, the screener and the original wording, keeping
 * only the market — which is where the visitor is, not something they told us.
 *
 * Distinct from `resetAnswers`, which keeps the goals so somebody can re-run the
 * questions against the same intent. This one is the blank page.
 */
export function resetSession(session: ProtocolSession): ProtocolSession {
  return createSession({ market: session.market });
}

/** Stage 2. Records the answer and that it was asked; changes no product. */
export function answerClinical(session: ProtocolSession, flagged: boolean): ProtocolSession {
  return { ...session, clinicalAsked: true, answers: { ...session.answers, clinicalFlag: flagged } };
}

/**
 * Everything the surfaces render, derived in one place.
 *
 * The protocol is built from partial answers, so it exists from the first goal and
 * firms up as answers arrive — the visible evolution IS the product. Unanswered
 * fields fall back to the values that add nothing, so a draft never shows a product
 * that was inferred from an answer nobody gave.
 */
export function viewSession(session: ProtocolSession): SessionView {
  const { detectedGoals: goals, answers } = session;

  if (goals.length === 0) {
    return {
      session,
      protocol: null,
      completionState: "empty",
      clinicalAsked: false,
      clinicalFlag: false,
      question: null,
      remaining: 0,
      progress: 0,
    };
  }

  const protocol = buildProtocol({
    ...answers,
    goals,
    energy: (answers.energy ?? "steady") as EnergyAnswer,
    sleep: (answers.sleep ?? "restful") as SleepAnswer,
    training: (answers.training ?? "rarely") as TrainingAnswer,
  });

  const outstanding = selectQuestions(goals, answers);
  /* The clinical answer is not a refinement of the protocol, so it is excluded from
     the progress maths — counting it would imply it moved something. */
  const answered = Object.keys(answers).filter((key) => key !== "clinicalFlag").length;
  const clinicalAsked = session.clinicalAsked === true;

  /* Stage 2 is the last thing between a draft and a finished protocol: the questions
     can be exhausted while the screener is still outstanding. */
  const completionState: CompletionState =
    outstanding.length === 0 && clinicalAsked ? "complete" : answered === 0 ? "intent" : "refining";

  const total = answered + outstanding.length + (clinicalAsked ? 0 : 1);

  return {
    session,
    protocol,
    completionState,
    clinicalAsked,
    clinicalFlag: answers.clinicalFlag === true,
    question: nextQuestion(goals, answers),
    remaining: outstanding.length + (clinicalAsked ? 0 : 1),
    progress: total === 0 ? 1 : answered / total,
  };
}

/** Answered fields, for "adjust my answers". */
export function answeredFields(session: ProtocolSession): AnswerField[] {
  return (Object.keys(session.answers) as AnswerField[]).filter((field) => session.answers[field] !== undefined);
}
