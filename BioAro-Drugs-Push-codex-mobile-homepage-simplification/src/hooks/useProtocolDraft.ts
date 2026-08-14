import { useCallback, useMemo, useState } from "react";
import { GOALS } from "../data/homepage";
import { bioaroAiService } from "../lib/ai/bioaroAiService";
import { buildProtocol, type GoalId, type Protocol } from "../lib/protocol/build";
import { useMarket } from "./useMarket";

/*
 * The protocol draft — one piece of state, shown in two frames.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A HOOK AND NOT COMPONENT STATE
 *
 * The homepage section and the modal show the SAME draft, not a copy of it. If the
 * modal owned its own state, opening it would need a seed object threaded through and
 * kept in sync, and every divergence between the two would be a bug waiting to be
 * found by a visitor rather than by us.
 *
 * It also makes quitting safe. The modal unmounting its state would mean closing it
 * silently discarded the goals someone had just chosen — an exit that costs you your
 * work is not an easy exit, it is a trap. State lives out here, so closing and
 * reopening resumes exactly where you left off.
 * ---------------------------------------------------------------------------
 */

/** Neutral stand-ins for the three questions this surface has not asked yet. That is
    precisely why the output is labelled a preview: the builder can still change it. */
const PREVIEW_ANSWERS = { energy: "steady", sleep: "restful", training: "rarely" } as const;

export interface ProtocolDraft {
  goals: GoalId[];
  /** Which goals came from the message rather than a tap, so the chips can say where
      they came from. That provenance is what keeps keyword matching honest instead of
      implying something read the sentence. */
  matched: GoalId[];
  message: string;
  submitting: boolean;
  noMatch: boolean;
  error: string | null;
  protocol: Protocol | null;
  setMessage: (value: string) => void;
  toggleGoal: (id: GoalId) => void;
  clearMatched: () => void;
  /** Resolves goals from the message. Resolves to true when at least one landed. */
  send: () => Promise<boolean>;
}

export const MAX_MESSAGE = 200;

export function useProtocolDraft(): ProtocolDraft {
  const { market } = useMarket();

  const [goals, setGoals] = useState<GoalId[]>([]);
  const [matched, setMatched] = useState<GoalId[]>([]);
  const [message, setMessageState] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [noMatch, setNoMatch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setMessage = useCallback((value: string) => setMessageState(value.slice(0, MAX_MESSAGE)), []);

  const toggleGoal = useCallback((id: GoalId) => {
    setNoMatch(false);
    // Touching a chip makes it the visitor's own choice, matched or not.
    setMatched((current) => current.filter((goal) => goal !== id));
    setGoals((current) => (current.includes(id) ? current.filter((goal) => goal !== id) : [...current, id]));
  }, []);

  const clearMatched = useCallback(() => {
    setGoals((current) => current.filter((goal) => !matched.includes(goal)));
    setMatched([]);
  }, [matched]);

  const send = useCallback(async () => {
    const text = message.trim();
    if (!text || submitting) return false;

    setError(null);
    setNoMatch(false);
    setSubmitting(true);

    const result = await bioaroAiService.interpretGoal({ message: text, selectedGoals: goals, market });
    setSubmitting(false);

    if (result.kind === "interpreted") {
      /* Validated against the approved list, so neither the endpoint nor the keyword
         table can introduce a goal — and so a product — BioAro Drugs has not approved. */
      const approved = result.data.interpretedGoals.filter((id) => GOALS.some((goal) => goal.id === id));
      if (approved.length === 0) {
        setNoMatch(true);
        return false;
      }
      setGoals((current) => [...new Set([...current, ...approved])]);
      setMatched(approved);
      return true;
    }

    if (result.kind === "error") setError(result.message);
    if (result.kind === "no-match") setNoMatch(true);
    return false;
  }, [message, submitting, goals, market]);

  /* Real engine output — the same `buildProtocol` the Protocol Builder runs, not a
     mock of one. A visitor picking Energy and Focus sees the products they would
     actually be given, in the real slot each belongs to. */
  const protocol = useMemo(
    () => (goals.length > 0 ? buildProtocol({ goals, ...PREVIEW_ANSWERS }) : null),
    [goals],
  );

  return {
    goals,
    matched,
    message,
    submitting,
    noMatch,
    error,
    protocol,
    setMessage,
    toggleGoal,
    clearMatched,
    send,
  };
}
