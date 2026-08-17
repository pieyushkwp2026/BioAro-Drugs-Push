import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock3, History, Moon, RotateCcw, ShieldAlert, Sparkles, Sunrise, Dumbbell } from "lucide-react";

import { AI_SECTION, GOALS } from "../data/homepage";
import { getMarketConfigByMarket } from "../config/markets";
import { useMarket } from "../hooks/useMarket";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";
import { skillsForSurface, type AssistantSkill } from "../lib/assistant/skills";
import SkillPalette from "../components/protocol/SkillPalette";
import ImageAttach from "../components/protocol/ImageAttach";
import ConversationHistory from "../components/protocol/ConversationHistory";
import Modal from "../components/ui/Modal";
import {
  listConversations,
  saveConversation,
  titleFor,
  type Conversation,
} from "../lib/assistant/history";
import { CLINICAL_SCREENER } from "../lib/protocol/questions";
import type { ProtocolSlot } from "../lib/protocol/build";
import { useCatalog } from "../hooks/useCatalog";
import { useProtocolSession } from "../hooks/useProtocolSession";
import {
  AiBubble,
  ChatAiResponse,
  ChatComposer,
  ImageTurn,
  YouBubble,
} from "../components/protocol/conversation";
import ProtocolPreview from "../components/home/ProtocolPreview";
import { GoalChips, IntentBox } from "../components/home/protocolControls";

/*
 * THESIS: the conversation is not the product — the protocol is. The left pane talks;
 * the right pane is a day that rewrites itself as you answer. It refuses the category
 * default, a chat window with a passive result list beside it that you scroll to after
 * the talking stops.
 * OWN-WORLD: BioAro Drugs' own world at instrument scale — ivory and cream grounds,
 * ink text, one ember accent, hairline rules, Plus Jakarta Sans black against Inter.
 * No dark console, no neon, no glass; the warmth is the differentiator here.
 * STORY: a vague intent becomes goals, then a protocol assembles one answer at a time,
 * each item carrying its own reason, placed at the hour it is taken.
 * FIRST VIEWPORT: left, one large question with the intent box and the seven goals;
 * right, the empty day — Morning / Around training / Evening as dimmed stops, so the
 * shape of the outcome is visible before anything is chosen.
 * FORM: two-pane console, 100dvh minus the fixed header, each pane scrolling alone.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
 * review, the verdict, and DESIGN.md.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS ALONGSIDE THE STUDIO MODAL
 *
 * The modal is the quick entry from the homepage: it opens where the visitor already
 * is. This is where the same conversation goes when it deserves the whole screen. Both
 * read ONE session and ONE thread from `ProtocolSessionProvider`, so moving between
 * them keeps every answer and every message — the seam that used to exist between the
 * modal and /quiz is what this closes.
 * ---------------------------------------------------------------------------
 */

const DAY: { slot: ProtocolSlot; icon: typeof Sunrise }[] = [
  { slot: "Morning", icon: Sunrise },
  { slot: "Around training", icon: Dumbbell },
  { slot: "Evening", icon: Moon },
];

/*
 * The day, stated before it is filled.
 *
 * Three stops carrying a count each. Empty, it is the promise — a visitor can see the
 * shape of what they are about to get without a single product being named, which is
 * the honest way to show an outcome you have not earned yet. Filled, it is the fastest
 * read of the protocol: what you take, and when.
 */
function DayStops({ counts, active }: { counts: Record<ProtocolSlot, number>; active: boolean }) {
  return (
    <ol className="flex items-stretch gap-2">
      {DAY.map(({ slot, icon: Icon }) => {
        const count = counts[slot];
        const filled = count > 0;

        return (
          <li
            key={slot}
            className={`flex-1 rounded-[18px] border px-3.5 py-3 transition-colors duration-500 ${
              filled ? "border-line bg-white shadow-glass" : "border-dashed border-line bg-transparent"
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors duration-500 ${
                filled ? "bg-[rgba(193,70,42,0.09)] text-ember" : "bg-cream-200 text-ink-400"
              }`}
            >
              <Icon size={15} strokeWidth={2.1} />
            </span>
            <p
              className={`mt-2.5 text-[12px] font-bold uppercase tracking-[0.1em] ${
                filled ? "text-ink" : "text-ink-400"
              }`}
            >
              {slot}
            </p>
            <p className="mt-0.5 text-[12.5px] tabular-nums text-ink-400">
              {filled ? AI_SECTION.sheetItems(count) : active ? "Nothing here yet" : "—"}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export default function AiExperience() {
  const headingId = useId();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const session = useProtocolSession();
  const { view, thread, pushTurns, askQuestion, asking } = session;
  const { completionState, question, remaining, clinicalAsked, clinicalFlag } = view;

  const { byHandle } = useCatalog();
  const { market } = useMarket();
  const marketConfig = getMarketConfigByMarket(market);
  const marketHref = useMarketHref();
  const skills = skillsForSurface(marketConfig, "page");

  /*
   * Picking a skill is a turn, not a mode.
   *
   * A live skill nudges the conversation the right way; an unavailable one answers
   * honestly and stops. Either way it lands in the thread, so the transcript records
   * what was asked for and what came back — including the noes.
   */
  const onPickSkill = (skill: AssistantSkill) => {
    if (!skill.live) {
      pushTurns(
        { kind: "you", text: skill.label },
        { kind: "ai", text: skill.unavailable ?? AI_SECTION.skillsUnavailable },
      );
      return;
    }

    if (skill.id === "handoff") {
      navigate(marketHref(ROUTES.support));
      return;
    }

    pushTurns({ kind: "you", text: skill.label }, { kind: "ai", text: skill.blurb });
  };
  const [composer, setComposer] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [pane, setPane] = useState<"conversation" | "protocol">("conversation");

  /*
   * History.
   *
   * The conversation id is minted once per mount and the whole thread is rewritten
   * under it on every change, so a conversation is one entry that grows rather than a
   * new row per message. `saveConversation` strips images before anything is written.
   */
  const [conversationId] = useState(() => `c-${Date.now().toString(36)}`);
  const [startedAt] = useState(() => new Date().toISOString());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const refreshHistory = useCallback(() => setConversations(listConversations(market)), [market]);

  useEffect(() => {
    if (thread.length === 0) return;
    saveConversation({
      id: conversationId,
      market,
      title: titleFor(thread),
      startedAt,
      updatedAt: new Date().toISOString(),
      turns: thread,
    });
  }, [thread, conversationId, market, startedAt]);
  const itemCount = view.protocol?.items.length ?? 0;

  const goalLabels = view.session.detectedGoals
    .map((id) => GOALS.find((goal) => goal.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  const acknowledgement =
    goalLabels.length > 0 ? `${AI_SECTION.pickedUp} ${goalLabels.join(" and ")}.` : null;

  const counts = { Morning: 0, "Around training": 0, Evening: 0 } as Record<ProtocolSlot, number>;
  for (const item of view.protocol?.items ?? []) counts[item.slot] += 1;

  /* Keep the newest turn in view. `question` is in the deps because the live question
     renders after the thread rather than as a turn — without it the answer chips can
     sit below the fold with nothing to say they are there. */
  useEffect(() => {
    if (thread.length === 0 && !question) return;
    threadEndRef.current?.scrollIntoView({ block: "end", behavior: thread.length ? "smooth" : "auto" });
  }, [thread, question]);

  const onAnswer = (value: string, label: string) => {
    if (!question) return;
    pushTurns({ kind: "ai", text: question.prompt }, { kind: "you", text: label });
    session.answerQuestion(question.field, value);
  };

  const onAsk = async () => {
    const text = composer.trim();
    if (!text || asking) return;
    setComposer("");
    await askQuestion(text);
  };

  return (
    /* The app frame: the fixed header is 88px, and nothing below it scrolls the window
       — each pane owns its own overflow. A consequence worth having: the header's
       retract-on-scroll never fires here, so the chrome stays put like an application's
       does. */
    <div className="mt-[88px] flex h-[calc(100dvh-88px)] flex-col overflow-hidden bg-cream">
      {/* Below lg the two panes are peers competing for one screen, so they take turns.
          Deliberately NOT the modal's bottom sheet: that pattern exists because a
          <dialog> sits in the top layer and because inside a modal the protocol really
          is secondary. Here they are equals, and a scrim inside a page built to escape
          a modal would re-create the thing we left. Both stay mounted so the scroll
          position and the Add button's state survive a switch. */}
      <div role="tablist" aria-label="View" className="flex shrink-0 gap-2 border-b border-line bg-white px-5 py-2.5 lg:hidden">
        {(["conversation", "protocol"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={pane === value}
            onClick={() => setPane(value)}
            className={`flex-1 rounded-full px-4 py-2 text-[13.5px] font-bold capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
              pane === value ? "bg-ink text-white" : "text-ink-600 hover:bg-cream-50"
            }`}
          >
            {value === "protocol" && itemCount > 0
              ? `Protocol · ${AI_SECTION.sheetItems(itemCount)}`
              : value}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
        {/* ------------------------------------------------------ conversation */}
        <section
          aria-labelledby={headingId}
          className={`min-h-0 flex-col border-line bg-white lg:flex lg:border-r ${
            pane === "conversation" ? "flex" : "hidden"
          }`}
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-4 sm:px-8">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(193,70,42,0.09)] text-ember"
            >
              <Sparkles size={17} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-black uppercase tracking-[0.12em] text-ink">
                {AI_SECTION.eyebrow}
              </p>
              <p className="mt-0.5 text-[11.5px] text-ink-400">{AI_SECTION.descriptor}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                refreshHistory();
                setHistoryOpen(true);
              }}
              className="flex h-11 items-center gap-2 rounded-full px-3 text-[13px] font-bold text-ink-400 transition-colors hover:bg-cream-50 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              <History size={15} strokeWidth={2.2} aria-hidden="true" />
              <span className="hidden sm:inline">{AI_SECTION.historyHeading}</span>
            </button>

            {completionState !== "empty" && (
              <button
                type="button"
                onClick={() => {
                  if (!confirmReset) {
                    setConfirmReset(true);
                    return;
                  }
                  setConfirmReset(false);
                  setComposer("");
                  session.resetAll();
                }}
                onBlur={() => setConfirmReset(false)}
                className={`flex h-11 items-center gap-2 rounded-full px-3 text-[13px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                  confirmReset
                    ? "bg-ember text-white"
                    : "text-ink-400 hover:bg-cream-50 hover:text-ink"
                }`}
              >
                <RotateCcw size={15} strokeWidth={2.2} aria-hidden="true" />
                <span className="hidden sm:inline">
                  {confirmReset ? AI_SECTION.resetConfirm : AI_SECTION.reset}
                </span>
              </button>
            )}
          </header>

          {/* The measure cap is the most important page-scale decision here. In the
              1080px modal the thread was naturally ~500px wide; uncapped at 1440 and
              2560 the bubbles run past 900px and it stops reading as a conversation. */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-7 sm:px-8">
            <div className="mx-auto w-full max-w-[720px] space-y-5">
            <h1
              id={headingId}
              className="max-w-[18ch] text-balance text-[28px] font-black leading-[1.05] tracking-[-0.035em] text-ink sm:text-[34px]"
            >
              {completionState === "complete" ? AI_SECTION.refinedHeadline : AI_SECTION.studioHeadline}
            </h1>

            {completionState === "empty" && (
              <>
                <p className="max-w-[60ch] text-[13.5px] leading-[1.6] text-ink-400">
                  {AI_SECTION.fallibilityLong}
                </p>
                <IntentBox
                  session={session}
                  onSend={() => void session.send()}
                  textareaRef={textareaRef}
                  rows={3}
                />
                <GoalChips session={session} />

                {/* Offered where a visitor is still deciding what to ask for. Once the
                    conversation is running it would compete with the live question. */}
                <SkillPalette skills={skills} onPick={onPickSkill} />
              </>
            )}

            {acknowledgement && (
              <>
                <AiBubble>
                  {acknowledgement}{" "}
                  <span className="text-ink-400">{AI_SECTION.pickedUpNote}</span>
                </AiBubble>
                {completionState !== "empty" && <GoalChips session={session} />}
              </>
            )}

            {thread.map((turn) => {
              if (turn.kind === "ai") return <AiBubble key={turn.id}>{turn.text}</AiBubble>;
              if (turn.kind === "you") return <YouBubble key={turn.id}>{turn.text}</YouBubble>;
              if (turn.kind === "image")
                return (
                  <ImageTurn key={turn.id} intent={turn.intent} previewUrl={turn.previewUrl} name={turn.name} />
                );

              return (
                <div key={turn.id} className="space-y-3">
                  <YouBubble>{turn.question}</YouBubble>
                  <div className="rounded-[18px] rounded-bl-[6px] border border-line bg-cream-50 px-4 py-4">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ember">
                      <Sparkles size={12} strokeWidth={2.4} aria-hidden="true" />
                      {AI_SECTION.eyebrow}
                    </p>
                    {turn.result ? (
                      <ChatAiResponse
                        result={turn.result}
                        status="done"
                        revealed={Number.MAX_SAFE_INTEGER}
                        byHandle={byHandle}
                        onClose={() => undefined}
                      />
                    ) : (
                      <p className="flex items-center gap-1.5" aria-label="Thinking">
                        {[0, 1, 2].map((dot) => (
                          <span
                            key={dot}
                            className="bio-thinking-dot h-1.5 w-1.5 rounded-full bg-ember"
                            style={{ animationDelay: `${dot * 140}ms` }}
                          />
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* The live question is NOT a bubble. It is the one thing the visitor has to
                act on, so it carries more weight than the transcript above it — the
                record recedes, the present question leads. */}
            {question && (
              <div className="bio-turn-in rounded-[22px] border border-line bg-white p-5 shadow-glass sm:p-6">
                <p className="text-[18px] font-bold leading-[1.3] tracking-[-0.025em] text-ink sm:text-[20px]">
                  {question.prompt}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {question.options.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => onAnswer(option.value, option.label)}
                        className="rounded-full border border-line bg-white px-4 py-2.5 text-[14.5px] font-bold tracking-[-0.01em] text-ink transition-colors hover:border-ember hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!question && !clinicalAsked && completionState !== "empty" && (
              <div className="rounded-[22px] border border-line bg-white p-5 shadow-glass sm:p-6">
                <p className="eyebrow">{AI_SECTION.clinicalHeading}</p>
                <p className="mt-2 text-[18px] font-bold leading-[1.3] tracking-[-0.025em] text-ink sm:text-[20px]">
                  {CLINICAL_SCREENER.prompt}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {CLINICAL_SCREENER.options.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => {
                          pushTurns(
                            { kind: "ai", text: CLINICAL_SCREENER.prompt },
                            { kind: "you", text: option.label },
                          );
                          session.answerClinical(option.value === "yes");
                        }}
                        className="rounded-full border border-line bg-white px-4 py-2.5 text-[14.5px] font-bold tracking-[-0.01em] text-ink transition-colors hover:border-ember hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[13px] leading-[1.5] text-ink-400">{AI_SECTION.clinicalNote}</p>
              </div>
            )}

            {clinicalFlag && (
              <div
                role="note"
                className="flex gap-3 rounded-[18px] border border-ember/25 bg-[rgba(193,70,42,0.05)] px-4 py-3.5"
              >
                <ShieldAlert size={17} strokeWidth={2.2} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />
                <p className="text-[13.5px] leading-[1.55] text-ink-600">{AI_SECTION.clinicalRaised}</p>
              </div>
            )}

            {completionState === "complete" && <AiBubble>{AI_SECTION.completeNote}</AiBubble>}

            {completionState === "complete" && (
              /* Named, not offered. The roadmap is stated so the ambition is legible
                 without claiming a capability that has nothing behind it. */
              <div className="rounded-[18px] border border-dashed border-line p-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-ink-400">
                  {AI_SECTION.precisionHeading}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {AI_SECTION.precisionItems.map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-line bg-cream-50 px-3 py-1.5 text-[12.5px] font-bold text-ink-400"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[13px] leading-[1.55] text-ink-600">{AI_SECTION.precisionBody}</p>
              </div>
            )}

            {session.error && (
              <p role="alert" className="text-[13.5px] text-ember-700">
                {session.error}
              </p>
            )}

            <div ref={threadEndRef} />
            </div>
          </div>

          {completionState !== "empty" && (
            <div className="shrink-0 border-t border-line bg-white px-5 py-4 sm:px-8">
              <div className="mx-auto w-full max-w-[720px]">
              <div className="flex items-end gap-2">
                <ImageAttach
                  onAttach={(intent, previewUrl, name) => {
                    session.attachImage(intent, previewUrl, name);
                    /* Answered immediately and honestly, so nobody sits waiting for a
                       reading that is never coming. */
                    pushTurns({ kind: "ai", text: AI_SECTION.attachUnreadable });
                  }}
                />
                <div className="min-w-0 flex-1">
                  <ChatComposer
                    value={composer}
                    onChange={setComposer}
                    onSend={() => void onAsk()}
                    disabled={asking}
                  />
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-ink-400">{AI_SECTION.askHint}</p>
              <p className="mt-1 text-center text-[11px] leading-[1.5] text-ink-400">
                {AI_SECTION.fallibility}
              </p>
              </div>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------------- the day */}
        <aside
          className={`min-h-0 overflow-y-auto overscroll-contain bg-cream px-5 py-7 sm:px-8 lg:block ${
            pane === "protocol" ? "block" : "hidden"
          }`}
        >
          <div className="mx-auto w-full max-w-[560px]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">
              Your day
            </p>
            {completionState === "refining" && remaining > 0 && (
              <p className="flex items-center gap-1.5 text-[12.5px] tabular-nums text-ink-400">
                <Clock3 size={13} strokeWidth={2.2} aria-hidden="true" />
                {AI_SECTION.remaining(remaining)}
              </p>
            )}
          </div>

          <div className="mt-4">
            <DayStops counts={counts} active={completionState !== "empty"} />
          </div>

          <div className="mt-6">
            <ProtocolPreview
              goals={view.session.detectedGoals}
              protocol={view.protocol}
              byHandle={byHandle}
              completionState={completionState}
              remaining={remaining}
            />
          </div>
          </div>
        </aside>
      </div>

      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        label={AI_SECTION.historyHeading}
        panelClassName="h-full w-full sm:h-auto sm:max-h-[min(680px,calc(100dvh-64px))] sm:w-[min(560px,calc(100vw-48px))] sm:rounded-[28px] sm:shadow-glass-lg"
      >
        <div className="flex min-h-0 flex-col">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-6 py-4">
            <h2 className="text-[17px] font-bold tracking-[-0.025em] text-ink">
              {AI_SECTION.historyHeading}
            </h2>
            <button
              type="button"
              onClick={() => setHistoryOpen(false)}
              className="rounded-full px-3 py-2 text-[13px] font-bold text-ink-400 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              Close
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <ConversationHistory conversations={conversations} onChanged={refreshHistory} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
