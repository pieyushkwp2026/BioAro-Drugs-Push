import { createContext } from "react";
import type { ImageIntent, Turn } from "../../lib/assistant/turns";
import type { GoalId } from "../../lib/protocol/build";
import type { AnswerField } from "../../lib/protocol/questions";
import type { SessionView } from "../../lib/protocol/session";

/* The turn union lives in lib/assistant so the pure history module can use it without
   pulling React in. Re-exported here because everything already imports it from this
   file. */
export type { ImageIntent, Turn };

/*
 * Kept in its own module so the provider file exports only a component — Vite's fast
 * refresh warns when a file mixes component and non-component exports, and the cart
 * and chat contexts in this project already follow the same split.
 */

export interface ProtocolSessionValue {
  /** Everything derived: protocol, completion state, next question, remaining count. */
  view: SessionView;

  // ------------------------------------------------------------------ intent
  message: string;
  setMessage: (value: string) => void;
  /** Goals that came from the message rather than a tap, so chips can say so. */
  matched: GoalId[];
  submitting: boolean;
  noMatch: boolean;
  error: string | null;
  /** Resolves goals from the message. True when at least one landed. */
  send: () => Promise<boolean>;
  clearMatched: () => void;

  // ------------------------------------------------------------------- goals
  toggleGoal: (id: GoalId) => void;
  /**
   * Clear everything and start on exactly these goals — the persona cards.
   *
   * Idempotent, unlike calling `toggleGoal` once per id, which would cancel the
   * selection out if the same card were clicked twice.
   */
  startWithGoals: (ids: GoalId[]) => void;

  // ------------------------------------------------------------------ studio
  /* The modal's open state lives here so ONE dialog serves every trigger. It used
     to live in the entry component, which was mounted twice — hero and floating —
     putting two <dialog> elements on the page that opened independently. */
  studioOpen: boolean;
  /** True when a text box opened it, so the caret continues where it was. */
  studioAutoFocus: boolean;
  openStudio: (options?: { focusInput?: boolean }) => void;
  closeStudio: () => void;

  // -------------------------------------------------------- the conversation
  /*
   * The thread lives here, beside the session it describes.
   *
   * It used to be local state inside the studio modal, which meant walking from the
   * modal to a full page kept the answers and threw away the conversation that
   * produced them. Two surfaces now read the same log, exactly as they already read
   * the same session.
   */
  thread: Turn[];
  /** Append turns; ids are issued here so no two surfaces can collide. */
  pushTurns: (...turns: TurnInput[]) => void;
  /**
   * Attach a photo. The object URL is created by the caller and revoked on reset — the
   * image is never uploaded, never stored, and never read.
   */
  attachImage: (intent: ImageIntent, previewUrl: string, name: string) => void;
  /** Owns the free-text round trip: logs the question, then patches its answer in. */
  askQuestion: (text: string) => Promise<void>;
  /** True while a typed question is in flight. */
  asking: boolean;
  clearThread: () => void;

  // --------------------------------------------------------------- questions
  answerQuestion: (field: AnswerField, value: string) => void;
  /** Puts one question back so it is asked again. */
  editAnswer: (field: AnswerField) => void;
  /** Stage 2. Records the answer and raises the notice; changes no product. */
  answerClinical: (flagged: boolean) => void;
  /** Clears every answer but keeps the goals and the original wording. */
  adjustAnswers: () => void;
  /** Start over: goals, answers, screener and typed message all cleared. */
  resetAll: () => void;
}

/** A turn without its id — the provider issues that. */
export type TurnInput =
  | { kind: "ai"; text: string }
  | { kind: "you"; text: string };

export const ProtocolSessionContext = createContext<ProtocolSessionValue | null>(null);
