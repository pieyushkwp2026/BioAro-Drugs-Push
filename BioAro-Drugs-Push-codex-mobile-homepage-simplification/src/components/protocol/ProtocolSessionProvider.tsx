import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useMarket } from "../../hooks/useMarket";
import { GOALS } from "../../data/homepage";
import { bioaroAiService } from "../../lib/ai/bioaroAiService";
import type { GoalId } from "../../lib/protocol/build";
import type { AnswerField } from "../../lib/protocol/questions";
import {
  answer as answerField,
  answerClinical as answerClinicalOn,
  createSession,
  resetSession,
  resetAnswers,
  setGoals as setSessionGoals,
  unanswer,
  viewSession,
  type ProtocolSession,
} from "../../lib/protocol/session";
import { ProtocolSessionContext } from "./session-context";

/*
 * The session, lifted above the routes.
 *
 * Mounted in Layout so the homepage modal and the /quiz page read the SAME instance.
 * That is the whole point: a visitor who starts in the modal and continues to the
 * full page should not be able to tell that anything changed, because nothing did.
 * Two providers would recreate exactly the seam this replaced.
 *
 * All protocol logic lives in src/lib/protocol — this file only binds it to React and
 * to the interpretation service.
 */

export const MAX_MESSAGE = 200;

export function ProtocolSessionProvider({ children }: { children: ReactNode }) {
  const { market } = useMarket();

  const [session, setSession] = useState<ProtocolSession>(() => createSession({ market }));
  const [message, setMessageState] = useState("");
  const [matched, setMatched] = useState<GoalId[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioAutoFocus, setStudioAutoFocus] = useState(false);

  const setMessage = useCallback((value: string) => setMessageState(value.slice(0, MAX_MESSAGE)), []);

  const toggleGoal = useCallback((id: GoalId) => {
    setNoMatch(false);
    // Touching a chip makes it the visitor's own choice, matched or not.
    setMatched((current) => current.filter((goal) => goal !== id));
    setSession((current) => {
      const goals = current.detectedGoals.includes(id)
        ? current.detectedGoals.filter((goal) => goal !== id)
        : [...current.detectedGoals, id];
      return setSessionGoals(current, goals, "chips");
    });
  }, []);

  const clearMatched = useCallback(() => {
    setSession((current) =>
      setSessionGoals(
        current,
        current.detectedGoals.filter((goal) => !matched.includes(goal)),
      ),
    );
    setMatched([]);
  }, [matched]);

  const send = useCallback(async () => {
    const text = message.trim();
    if (!text || submitting) return false;

    setError(null);
    setNoMatch(false);
    setSubmitting(true);

    const result = await bioaroAiService.interpretGoal({
      message: text,
      selectedGoals: session.detectedGoals,
      market,
    });
    setSubmitting(false);

    if (result.kind === "interpreted") {
      /* Validated against the approved list, so neither the endpoint nor the keyword
         table can introduce a goal — and so a product — BioAro Drugs has not approved. */
      const approved = result.data.interpretedGoals.filter((id) => GOALS.some((goal) => goal.id === id));
      if (approved.length === 0) {
        setNoMatch(true);
        return false;
      }

      setSession((current) => {
        const goals = [...new Set([...current.detectedGoals, ...approved])];
        // The wording is kept verbatim alongside the goals it produced. It is never
        // re-interpreted and never shown back to the visitor as a claim.
        return { ...setSessionGoals(current, goals, "bioaro-ai-homepage"), originalIntent: text };
      });
      setMatched(approved);
      return true;
    }

    if (result.kind === "error") setError(result.message);
    if (result.kind === "no-match") setNoMatch(true);
    return false;
  }, [message, submitting, session.detectedGoals, market]);

  const openStudio = useCallback((options?: { focusInput?: boolean }) => {
    setStudioAutoFocus(Boolean(options?.focusInput));
    setStudioOpen(true);
  }, []);

  const closeStudio = useCallback(() => setStudioOpen(false), []);

  const answerQuestion = useCallback((field: AnswerField, value: string) => {
    setSession((current) => answerField(current, field, value));
  }, []);

  const editAnswer = useCallback((field: AnswerField) => {
    setSession((current) => unanswer(current, field));
  }, []);

  const answerClinical = useCallback((flagged: boolean) => {
    setSession((current) => answerClinicalOn(current, flagged));
  }, []);

  const adjustAnswers = useCallback(() => {
    setSession((current) => resetAnswers(current));
  }, []);

  /* Everything the visitor put in, including what they typed and anything the
     matcher inferred from it. A reset that left the message behind would refill
     the box the moment the modal reopened. */
  const resetAll = useCallback(() => {
    setSession((current) => resetSession(current));
    setMessageState("");
    setMatched([]);
    setNoMatch(false);
    setError(null);
  }, []);

  const view = useMemo(() => viewSession({ ...session, market }), [session, market]);

  const value = useMemo(
    () => ({
      view,
      message,
      setMessage,
      matched,
      submitting,
      noMatch,
      error,
      send,
      clearMatched,
      toggleGoal,
      studioOpen,
      studioAutoFocus,
      openStudio,
      closeStudio,
      answerQuestion,
      editAnswer,
      answerClinical,
      adjustAnswers,
      resetAll,
    }),
    [
      view,
      message,
      setMessage,
      matched,
      submitting,
      noMatch,
      error,
      send,
      clearMatched,
      toggleGoal,
      studioOpen,
      studioAutoFocus,
      openStudio,
      closeStudio,
      answerQuestion,
      editAnswer,
      answerClinical,
      adjustAnswers,
      resetAll,
    ],
  );

  return <ProtocolSessionContext.Provider value={value}>{children}</ProtocolSessionContext.Provider>;
}
