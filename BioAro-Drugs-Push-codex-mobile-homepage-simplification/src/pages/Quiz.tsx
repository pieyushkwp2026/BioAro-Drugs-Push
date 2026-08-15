import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronDown, RotateCcw, Sparkles } from "lucide-react";

import { useCatalog } from "../hooks/useCatalog";
import { useMarketHref } from "../hooks/useMarketHref";
import { useProtocolSession } from "../hooks/useProtocolSession";
import { ROUTES } from "../lib/routes";
import { AI_SECTION, BUILDER, GOALS } from "../data/homepage";
import type { GoalId } from "../lib/protocol/build";
import ProtocolPreview from "../components/home/ProtocolPreview";

/*
 * BioAro Drugs AI — the full-page surface.
 *
 * ---------------------------------------------------------------------------
 * THE SAME SESSION AS THE MODAL, NOT A SECOND JOURNEY.
 *
 * This page used to hold its own goals, its own answers and its own step counter,
 * which is why arriving here from the homepage felt like being handed off to a
 * questionnaire: it WAS a different thing wearing the same brand. It now reads the
 * one `ProtocolSessionProvider` mounted in Layout, so somebody who starts in the
 * modal and continues here finds their answers already in place, and somebody who
 * starts here can open the modal to exactly the same state.
 *
 * The route stays /quiz because campaign links, emails and existing pages point at
 * it. Nothing the visitor reads calls it a quiz — no "Step 3 of 5", no "Results".
 * Those were the words doing the damage, not the URL.
 *
 * The question engine is unchanged and still lives in src/lib/protocol. This file
 * renders it; it decides nothing.
 * ---------------------------------------------------------------------------
 */

function isGoalId(value: string): value is GoalId {
  return GOALS.some((goal) => goal.id === value);
}

/*
 * Three worked examples, shown while somebody is still choosing. They are not the
 * visitor's protocol and never claim to be — they exist so a page with no goals yet
 * has something worth reading. Content kept from the previous version of this page.
 */
const EXAMPLE_PROTOCOLS = [
  {
    key: "morning",
    title: "Morning Longevity Protocol",
    description:
      "Built for customers focused on healthy ageing, daily vitality, and longer-term routine quality.",
    suggestedFit: ["Longevity+", "CellOmega+"],
  },
  {
    key: "afternoon",
    title: "Focus Workday Protocol",
    description:
      "Built for customers who want support for concentration, cognitive energy, and consistent daytime performance.",
    suggestedFit: ["Creagen Brain Boost", "CellOmega+"],
  },
  {
    key: "evening",
    title: "Recovery Performance Protocol",
    description: "Built for training, output, and post-exercise routine support.",
    suggestedFit: ["Creagen Pro Power", "Sleep support product when available"],
  },
] as const;

export default function Quiz() {
  const marketHref = useMarketHref();
  const { byHandle } = useCatalog();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const session = useProtocolSession();
  const { view } = session;
  const { completionState, question, remaining, progress } = view;

  /* Deep-link seeding. ?goals= carries several; ?goal= is kept for older links. */
  const seededGoals = useMemo(() => {
    const raw = searchParams.get("goals") ?? searchParams.get("goal") ?? "";
    return raw
      .split(",")
      .map((value) => value.trim())
      .filter(isGoalId);
  }, [searchParams]);

  const note =
    typeof (location.state as { note?: unknown } | null)?.note === "string"
      ? (location.state as { note: string }).note
      : null;

  /*
   * Seed ONCE, and only into an empty session. Arriving from the modal must not wipe
   * answers already given — the URL is a starting point for a cold visit, not the
   * source of truth for a session already underway.
   */
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (view.session.detectedGoals.length > 0) return;
    seededGoals.forEach((goal) => session.toggleGoal(goal));
    // Mount only, deliberately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const intent = view.session.originalIntent || note;
  const goalLabels = view.session.detectedGoals
    .map((id) => GOALS.find((goal) => goal.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  return (
    <div className="bg-cream pb-24 pt-28 md:pt-32">
      <div className="container-bio">
        {/* ---------------------------------------------------------- header */}
        <div className="flex items-center gap-2.5">
          <Sparkles size={15} strokeWidth={2.2} aria-hidden="true" className="text-ember" />
          <p className="eyebrow">{BUILDER.eyebrow}</p>
        </div>

        <h1 className="mt-4 max-w-[18ch] text-balance text-[34px] font-black leading-[1.02] tracking-[-0.035em] text-ink sm:text-[44px]">
          {completionState === "complete" ? AI_SECTION.refinedHeadline : AI_SECTION.studioHeadline}
        </h1>

        {intent && (
          <p className="mt-5 max-w-[60ch] rounded-[16px] border border-line bg-white p-4 text-[14px] leading-[1.55] text-ink-600">
            <span className="mb-1 block text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-400">
              {BUILDER.noteLabel}
            </span>
            {intent}
          </p>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-12">
          {/* ------------------------------------------------------ questions */}
          <div>
            {/* Goals stay editable at every point, not only at the start. */}
            <p className="text-[13px] font-bold tracking-[-0.01em] text-ink">Your goals</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {GOALS.map((goal) => {
                const id = goal.id as GoalId;
                const selected = view.session.detectedGoals.includes(id);
                return (
                  <li key={goal.id}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => session.toggleGoal(id)}
                      className={`rounded-full border px-4 py-2.5 text-[14.5px] font-bold tracking-[-0.01em] transition-[background-color,border-color,color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                        selected
                          ? "border-ember bg-ember text-white"
                          : "border-line bg-white text-ink hover:border-line-strong"
                      }`}
                    >
                      {goal.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* A rail, not a step counter. "Question 3 of 5" is a promise the builder
                cannot keep — how many remain depends on which goals were chosen. */}
            {completionState !== "empty" && (
              <div className="mt-8">
                <div className="flex items-center justify-between gap-4 text-[12.5px] text-ink-400">
                  <span>
                    {completionState === "complete" ? AI_SECTION.readyMeta : AI_SECTION.remaining(remaining)}
                  </span>
                  {completionState === "complete" && (
                    <button
                      type="button"
                      onClick={session.adjustAnswers}
                      className="flex items-center gap-1.5 font-bold text-ink underline-offset-4 hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                    >
                      <RotateCcw size={13} strokeWidth={2.2} aria-hidden="true" />
                      {AI_SECTION.adjust}
                    </button>
                  )}
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(progress * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Protocol progress"
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
                >
                  <div
                    className="h-full rounded-full bg-ember transition-[width] duration-500"
                    style={{ width: `${Math.max(progress * 100, 4)}%` }}
                  />
                </div>
              </div>
            )}

            {question && (
              <div className="mt-8 rounded-[24px] border border-line bg-white p-6 shadow-glass sm:p-8">
                <p className="text-[20px] font-bold tracking-[-0.03em] text-ink sm:text-[24px]">{question.prompt}</p>
                <ul className="mt-6 space-y-2.5">
                  {question.options.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => session.answerQuestion(question.field, option.value)}
                        className="group flex w-full items-center justify-between gap-4 rounded-[16px] border border-line bg-cream-50 px-5 py-4 text-left text-[15.5px] font-bold tracking-[-0.015em] text-ink transition-[border-color,background-color] duration-200 hover:border-ember hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                      >
                        {option.label}
                        <ArrowRight
                          size={16}
                          strokeWidth={2.4}
                          aria-hidden="true"
                          className="shrink-0 text-line-strong transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-ember motion-reduce:transform-none"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {completionState === "empty" && (
              <p className="mt-8 max-w-[52ch] text-[15px] leading-[1.6] text-ink-600">
                Choose what you want to improve and BioAro Drugs AI will start building a protocol around it.
              </p>
            )}

            {completionState === "complete" && (
              <p className="mt-8 max-w-[56ch] text-[15px] leading-[1.6] text-ink-600">{AI_SECTION.completeNote}</p>
            )}

            {/* Worked examples, while there is nothing personal to show yet. */}
            {completionState === "empty" && (
              <div className="mt-10 space-y-3">
                <p className="text-[13px] font-bold tracking-[-0.01em] text-ink">What a protocol looks like</p>
                {EXAMPLE_PROTOCOLS.map((example) => (
                  <details
                    key={example.key}
                    className="group rounded-[18px] border border-line bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-bold tracking-[-0.02em] text-ink">
                      {example.title}
                      <ChevronDown
                        size={17}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className="shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180 motion-reduce:transform-none"
                      />
                    </summary>
                    <p className="mt-3 text-[14px] leading-[1.55] text-ink-600">{example.description}</p>
                    <p className="mt-2 text-[13px] text-ink-400">Often includes: {example.suggestedFit.join(" · ")}</p>
                  </details>
                ))}
              </div>
            )}

            <p className="mt-10 max-w-[62ch] border-t border-line pt-6 text-[12.5px] leading-[1.6] text-ink-400">
              {AI_SECTION.disclosure}
            </p>
          </div>

          {/* -------------------------------------------------------- protocol */}
          <div className="lg:sticky lg:top-[112px] lg:self-start">
            <ProtocolPreview
              goals={view.session.detectedGoals}
              protocol={view.protocol}
              byHandle={byHandle}
              completionState={completionState}
              remaining={remaining}
            />

            {completionState === "complete" && goalLabels.length > 0 && (
              <Link
                to={marketHref(ROUTES.shop)}
                className="group mt-4 inline-flex items-center gap-2 text-[14px] font-bold text-ink underline-offset-4 hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                Browse the full range
                <ArrowRight
                  size={15}
                  strokeWidth={2.4}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
