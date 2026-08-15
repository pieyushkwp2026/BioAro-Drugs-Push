import { createContext } from "react";
import type { GoalId } from "../../lib/protocol/build";
import type { AnswerField } from "../../lib/protocol/questions";
import type { SessionView } from "../../lib/protocol/session";

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

export const ProtocolSessionContext = createContext<ProtocolSessionValue | null>(null);
