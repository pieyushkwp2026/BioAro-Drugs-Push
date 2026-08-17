import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
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
import { askBioAro } from "../../lib/ask";
import { ProtocolSessionContext, type TurnInput } from "./session-context";
import type { ImageIntent, Turn } from "../../lib/assistant/turns";

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

  const [thread, setThread] = useState<Turn[]>([]);
  const [asking, setAsking] = useState(false);
  /* A ref, not a module-level counter. The counter this replaces was module scope, so
     a second surface reading the same thread would have carried on from wherever the
     first one left off — and two mounts would have issued the same ids. */
  const turnSeq = useRef(0);
  const nextTurnId = useCallback(() => `turn-${(turnSeq.current += 1)}`, []);

  const pushTurns = useCallback(
    (...turns: TurnInput[]) => {
      setThread((current) => [...current, ...turns.map((turn) => ({ ...turn, id: nextTurnId() }))]);
    },
    [nextTurnId],
  );

  /*
   * Attachments are revoked, not just dropped.
   *
   * An object URL keeps its blob alive until it is revoked, so clearing the thread
   * without this would leak every photo a visitor attached for as long as the tab
   * lived — which is exactly the guarantee the upload copy makes.
   */
  const clearThread = useCallback(() => {
    setThread((current) => {
      for (const turn of current) {
        if (turn.kind === "image") URL.revokeObjectURL(turn.previewUrl);
      }
      return [];
    });
  }, []);

  const attachImage = useCallback(
    (intent: ImageIntent, previewUrl: string, name: string) => {
      setThread((current) => [...current, { id: nextTurnId(), kind: "image", intent, previewUrl, name }]);
    },
    [nextTurnId],
  );

  /*
   * A typed question, answered in the same thread as the protocol questions.
   *
   * The turn is logged with `result: null` first so the thinking state has something
   * to attach to, then patched by id when the answer lands. Ordering is preserved even
   * if two questions overlap, because each patches its own id rather than the tail.
   */
  const askQuestion = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || asking) return;

      const id = nextTurnId();
      setAsking(true);
      setThread((current) => [...current, { id, kind: "ask", question, result: null }]);

      const result = await askBioAro(question);
      setAsking(false);
      setThread((current) =>
        current.map((turn) => (turn.id === id && turn.kind === "ask" ? { ...turn, result } : turn)),
      );
    },
    [asking, nextTurnId],
  );

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
    /* The log described answers that are being thrown away; keeping it would leave a
       transcript of questions the visitor is about to be asked again. */
    setThread([]);
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
    setThread([]);
  }, []);

  /*
   * Start a fresh session on a named set of goals — what a persona card does.
   *
   * One action rather than resetAll() followed by a toggleGoal() per id. The toggle
   * route works (every setter here is functional, so the calls compose in one tick)
   * but it is a toggle: run it twice on the same persona and the goals cancel out.
   * This is idempotent, which is the behaviour a card that can be clicked twice
   * needs.
   *
   * The source is recorded as "personas" so the session can tell a named starting
   * point apart from a chip tap or a matched sentence. A persona is a shortcut to a
   * goal set, not a claim about the person.
   */
  const startWithGoals = useCallback((ids: GoalId[]) => {
    setMessageState("");
    setMatched([]);
    setNoMatch(false);
    setError(null);
    setThread([]);
    setSession((current) => setSessionGoals(resetSession(current), [...new Set(ids)], "personas"));
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
      startWithGoals,
      thread,
      pushTurns,
      attachImage,
      askQuestion,
      asking,
      clearThread,
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
      startWithGoals,
      thread,
      pushTurns,
      attachImage,
      askQuestion,
      asking,
      clearThread,
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
