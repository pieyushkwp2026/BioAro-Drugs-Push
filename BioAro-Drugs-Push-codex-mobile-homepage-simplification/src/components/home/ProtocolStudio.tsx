import { GOALS } from "../../data/homepage";
import type { CatalogProduct } from "../../lib/shopify/types";
import Modal from "../ui/Modal";
import { useProtocolSession } from "../../hooks/useProtocolSession";
import ProtocolPreview from "./ProtocolPreview";
import { GoalChips, IntentBox } from "./protocolControls";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUp,
  Check,
  Clock3,
  CornerDownLeft,
  Plus,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";

import { AI_SECTION } from "../../data/homepage";

import {
  askBioAro,
  SAFETY_NOTE,
  SENSITIVE_BODY,
  SENSITIVE_HEADING,
  type AskAnswer,
  type AskResult,
} from "../../lib/ask";

import { useCart } from "../../hooks/useCart";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";

import {
  formatCatalogMoney,
  isCurrencyAlignedWithMarket,
} from "../../lib/market/config";

import { ROUTES } from "../../lib/routes";

function productHandleFrom(answer: AskAnswer): string | null {
  const match = answer.source.href.match(/^\/products\/([a-z0-9-]+)$/i);
  return match ? match[1] : null;
}

function ProductRow({ product }: { product: CatalogProduct }) {
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const { addProduct } = useCart();

  const [added, setAdded] = useState(false);

  const buyable =
    product.availableForSale &&
    product.price.amount > 0 &&
    isCurrencyAlignedWithMarket(product.price.currencyCode, country);

  const onAdd = async () => {
    await addProduct(product, 1);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-line bg-cream-50 p-2.5">
      <img
        src={product.image?.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="h-12 w-12 shrink-0 rounded-[10px] bg-white object-contain p-1"
      />

      <div className="min-w-0 flex-1">
        <Link
          to={marketHref(`/products/${product.handle}`)}
          className="block truncate text-[14.5px] font-bold tracking-[-0.015em] text-ink hover:text-ember"
        >
          {product.title}
        </Link>

        <p className="mt-0.5 text-[12.5px] tabular-nums text-ink-400">
          {formatCatalogMoney(product.price, country)} · {product.supplyLabel}
        </p>
      </div>

      {buyable && (
        <button
          type="button"
          onClick={() => void onAdd()}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ember px-3.5 text-[12.5px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-ember-600 active:scale-[0.97]"
        >
          {added ? (
            <Check size={13} strokeWidth={2.8} />
          ) : (
            <Plus size={13} strokeWidth={2.8} />
          )}

          {added ? "Added" : "Add"}
        </button>
      )}
    </div>
  );
}

function ChatAiResponse({
  result,
  status,
  revealed,
  byHandle,
  onClose,
}: {
  result: AskResult | null;
  status: "idle" | "searching" | "revealing" | "done";
  revealed: number;
  byHandle: Map<string, CatalogProduct>;
  onClose: () => void;
}) {
  const marketHref = useMarketHref();

  const leadAnswer = result?.kind === "answer" ? result.answers[0] : null;

  const products =
    result?.kind === "answer"
      ? [
          ...new Set(
            result.answers
              .map(productHandleFrom)
              .filter((handle): handle is string => Boolean(handle)),
          ),
        ]
          .map((handle) => byHandle.get(handle))
          .filter((product): product is CatalogProduct => Boolean(product))
          .slice(0, 3)
      : [];

  const supporting = result?.kind === "answer" ? result.answers.slice(1) : [];

  return (
    <div className="mt-4 space-y-4">
      {/* Searching */}
      {status === "searching" && (
        <div className="space-y-2.5" aria-label="Searching" aria-live="polite">
          <div className="h-4 w-[92%] animate-pulse rounded bg-cream-200" />
          <div className="h-4 w-[78%] animate-pulse rounded bg-cream-200" />
          <div className="h-4 w-[54%] animate-pulse rounded bg-cream-200" />
        </div>
      )}

      {/* Sensitive */}
      {result?.kind === "sensitive" && (
        <div>
          <p className="flex items-center gap-2 text-[16px] font-bold text-ink">
            <ShieldAlert size={17} strokeWidth={2.2} className="text-ember" />

            {SENSITIVE_HEADING}
          </p>

          <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink-600">
            {SENSITIVE_BODY}
          </p>

          <Link
            to={marketHref(ROUTES.support)}
            onClick={onClose}
            className="btn-secondary mt-5"
          >
            Contact support
            <ArrowRight size={15} strokeWidth={2.4} />
          </Link>
        </div>
      )}

      {/* Needs quiz */}
      {result?.kind === "needs-quiz" && (
        <div>
          <p className="text-[16px] font-bold text-ink">
            That one is worth a couple of questions.
          </p>

          <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink-600">
            Choosing between formulas depends on your goals and how your days
            run. The Protocol Builder asks four questions and explains why each
            formula is in your result.
          </p>

          <Link
            to={marketHref(ROUTES.quiz)}
            onClick={onClose}
            className="btn-primary mt-5"
          >
            Build My Protocol
            <ArrowRight size={15} strokeWidth={2.4} />
          </Link>
        </div>
      )}

      {/* No match */}
      {result?.kind === "no-match" && (
        <div>
          <p className="text-[16px] font-bold text-ink">
            I do not have an answer for that one.
          </p>

          <p className="mt-2.5 text-[14.5px] leading-[1.6] text-ink-600">
            Try asking about an ingredient and its dose, how the sachets work,
            third-party testing, or what a formula is for.
          </p>
        </div>
      )}

      {/* Actual answer */}
      {leadAnswer && (status === "revealing" || status === "done") && (
        <div>
          <p className="text-pretty text-[15.5px] leading-[1.65] text-ink">
            {leadAnswer.answer.slice(0, revealed)}

            {status === "revealing" && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-ember"
              />
            )}
          </p>

          {status === "done" && (
            <>
              {/* Source */}
              <Link
                to={marketHref(leadAnswer.source.href)}
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-cream-50 px-3.5 py-2 text-[12.5px] font-bold text-ink-600 transition-colors hover:border-line-strong hover:text-ink"
              >
                {leadAnswer.source.label}

                <ArrowRight size={13} strokeWidth={2.4} />
              </Link>

              {/* Products */}
              {products.length > 0 && (
                <div className="mt-5 space-y-2">
                  {products.map((product) => (
                    <ProductRow key={product.handle} product={product} />
                  ))}
                </div>
              )}

              {/* Related answers */}
              {supporting.length > 0 && (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-400">
                    Related
                  </p>

                  <ul className="mt-2.5 space-y-2.5">
                    {supporting.map((answer) => (
                      <li key={answer.question}>
                        <Link
                          to={marketHref(answer.source.href)}
                          onClick={onClose}
                          className="group block"
                        >
                          <span className="text-[14px] font-bold text-ink group-hover:underline">
                            {answer.question}
                          </span>

                          <span className="mt-0.5 block line-clamp-2 text-[13.5px] leading-[1.5] text-ink-600">
                            {answer.answer}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Safety note */}
      {result && (
        <p className="flex items-start gap-2 border-t border-line pt-4 text-[12px] leading-[1.55] text-ink-400">
          <CornerDownLeft
            size={13}
            strokeWidth={2}
            className="mt-0.5 shrink-0"
          />

          {SAFETY_NOTE}
        </p>
      )}
    </div>
  );
}function ChatComposer({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  const inputId = useId();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSend();
  };

  return (
    <form onSubmit={submit} className="relative">
      <label htmlFor={inputId} className="sr-only">
        Ask BioAro Drugs AI
      </label>

      <div className="flex items-end gap-2 rounded-[20px] border border-line-strong bg-white p-2 shadow-glass transition-[border-color,box-shadow] duration-200 focus-within:border-ember/60 focus-within:shadow-[0_0_0_4px_rgba(193,70,42,0.10)]">
        <textarea
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          placeholder="Ask BioAro Drugs AI anything…"
          rows={2}
          className="min-h-[44px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-[14px] leading-[1.5] text-ink outline-none placeholder:text-ink-400"
        />

        <button
          type="submit"
          disabled={!value.trim() || disabled}
          aria-label="Send reply"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember text-white transition-[background-color,transform,opacity] duration-200 hover:bg-ember-600 active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
        >
          <ArrowUp size={17} strokeWidth={2.6} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}


/*
 * The studio — one conversational column, and a protocol taking shape beside it.
 *
 * ---------------------------------------------------------------------------
 * NO MODES.
 *
 * This used to be "Protocol mode" and "Chat mode" behind a toggle, which asked a
 * visitor to understand an implementation detail before they could use the thing.
 * There is now one thread. BioAro Drugs AI asks the next question; the composer
 * underneath takes anything else. A free-text question is answered inline and the
 * outstanding question stays at the bottom, so asking something never abandons the
 * protocol being built.
 *
 * That is the rule chat obeys here: it explains, and it never recommends. Products
 * come from `buildProtocol` and nothing else.
 *
 * ---------------------------------------------------------------------------
 * THE RIGHT PANEL IS HONEST ABOUT HOW FINISHED IT IS.
 *
 * Showing a named product after one word looks like the answer was decided in
 * advance. Every label on that side is driven by `completionState`, so a draft is
 * called a draft until nothing is left that could change it.
 * ---------------------------------------------------------------------------
 */

type Turn =
  | { id: string; kind: "ai"; text: string }
  | { id: string; kind: "you"; text: string }
  | { id: string; kind: "ask"; question: string; result: AskResult | null };

let turnSeq = 0;
const nextTurnId = () => `turn-${(turnSeq += 1)}`;

export default function ProtocolStudio({
  open,
  byHandle,
  onClose,
  onContinue,
  autoFocusInput = false,
}: {
  open: boolean;
  byHandle: Map<string, CatalogProduct>;
  onClose: () => void;
  onContinue: () => void;
  autoFocusInput?: boolean;
}) {
  const headingId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const session = useProtocolSession();
  const { view } = session;
  const { completionState, question, remaining } = view;

  const [thread, setThread] = useState<Turn[]>([]);
  const [composer, setComposer] = useState("");
  const [asking, setAsking] = useState(false);

  const goalLabels = view.session.detectedGoals
    .map((id) => GOALS.find((goal) => goal.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  /* The acknowledgement is derived, not stored: it should always describe the goals
     that are actually selected, including after a chip is toggled off. */
  const acknowledgement =
    goalLabels.length > 0 ? `${AI_SECTION.pickedUp} ${goalLabels.join(" and ")}.` : null;

  const stacked =
    typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches;

  useEffect(() => {
    if (!open || !stacked || completionState === "empty") return;
    const frame = requestAnimationFrame(() =>
      previewRef.current?.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    return () => cancelAnimationFrame(frame);
    // Only on open: re-running as answers land would yank the page mid-tap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stacked]);

  // Keep the newest turn in view without dragging the whole modal around it.
  useEffect(() => {
    if (thread.length === 0) return;
    threadEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [thread]);

  const onAnswer = (value: string, label: string) => {
    if (!question) return;
    // The question and the answer both enter the log, so the thread reads back as a
    // conversation rather than a list of orphaned replies.
    setThread((current) => [
      ...current,
      { id: nextTurnId(), kind: "ai", text: question.prompt },
      { id: nextTurnId(), kind: "you", text: label },
    ]);
    session.answerQuestion(question.field, value);
  };

  const onAsk = async () => {
    const text = composer.trim();
    if (!text || asking) return;

    const id = nextTurnId();
    setComposer("");
    setAsking(true);
    setThread((current) => [...current, { id, kind: "ask", question: text, result: null }]);

    const result = await askBioAro(text);
    setAsking(false);
    setThread((current) =>
      current.map((turn) => (turn.id === id && turn.kind === "ask" ? { ...turn, result } : turn)),
    );
  };

  const onAdjust = () => {
    setThread([]);
    session.adjustAnswers();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={headingId}
      initialFocusRef={autoFocusInput && !stacked ? textareaRef : undefined}
      panelClassName="h-full w-full sm:h-[min(760px,calc(100dvh-48px))] sm:w-[min(1080px,calc(100vw-48px))] sm:rounded-[28px] sm:shadow-glass-lg"
    >
      {/* ------------------------------------------------------------- header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-4 sm:px-7">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(193,70,42,0.09)] text-ember"
        >
          <Sparkles size={17} strokeWidth={2.2} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black uppercase tracking-[0.12em] text-ink">{AI_SECTION.eyebrow}</p>
          <p className="mt-0.5 text-[11.5px] text-ink-400">{AI_SECTION.descriptor}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={AI_SECTION.close}
          className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-cream-50 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
        >
          <X size={20} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </header>

      {/* --------------------------------------------------------------- body */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:overflow-hidden">
        {/* ------------------------------------------------------------ thread */}
        <div className="flex min-h-0 flex-col lg:overflow-hidden">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
            <h2
              id={headingId}
              className="text-balance text-[26px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[30px]"
            >
              {completionState === "complete" ? AI_SECTION.refinedHeadline : AI_SECTION.studioHeadline}
            </h2>

            {/* Intent entry stays until there is something to build on. */}
            {completionState === "empty" && (
              <>
                <IntentBox session={session} onSend={() => void session.send()} textareaRef={textareaRef} rows={3} />
                <GoalChips session={session} />
              </>
            )}

            {acknowledgement && (
              <AiBubble>
                {acknowledgement}{" "}
                <span className="text-ink-400">{AI_SECTION.pickedUpNote}</span>
              </AiBubble>
            )}

            {/* Goals stay adjustable throughout — a wrong match is exactly when
                someone needs to correct it, and burying that behind a back button
                is how a builder starts feeling like a form. */}
            {completionState !== "empty" && <GoalChips session={session} />}

            {thread.map((turn) => {
              if (turn.kind === "ai") return <AiBubble key={turn.id}>{turn.text}</AiBubble>;
              if (turn.kind === "you") return <YouBubble key={turn.id}>{turn.text}</YouBubble>;
              return (
                <div key={turn.id} className="space-y-3">
                  <YouBubble>{turn.question}</YouBubble>
                  <div className="rounded-[18px] rounded-bl-[6px] border border-line bg-cream-50 px-4 py-4">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ember">
                      <Sparkles size={12} strokeWidth={2.2} aria-hidden="true" />
                      {AI_SECTION.eyebrow}
                    </div>
                    {turn.result ? (
                      <ChatAiResponse
                        result={turn.result}
                        status="done"
                        revealed={Number.MAX_SAFE_INTEGER}
                        byHandle={byHandle}
                        onClose={onClose}
                      />
                    ) : (
                      <div className="flex items-center gap-1.5" aria-label="Thinking" aria-live="polite">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember [animation-delay:240ms]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* The outstanding question is always last, so answering a side question
                returns you to building rather than leaving you in a chat. */}
            {question && (
              <div className="space-y-3">
                <AiBubble>{question.prompt}</AiBubble>
                <ul className="flex flex-wrap gap-2.5">
                  {question.options.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => onAnswer(option.value, option.label)}
                        className="rounded-full border border-line bg-white px-4 py-2.5 text-[14.5px] font-bold tracking-[-0.01em] text-ink transition-[background-color,border-color,color] duration-200 hover:border-ember hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {completionState === "complete" && (
              <AiBubble>{AI_SECTION.completeNote}</AiBubble>
            )}

            {session.error && (
              <p role="alert" className="text-[13px] text-ember-700">
                {session.error}
              </p>
            )}

            <div ref={threadEndRef} />
          </div>

          {/* Chat is secondary: one composer, no mode to learn. */}
          {completionState !== "empty" && (
            <div className="shrink-0 border-t border-line bg-white px-5 py-4 sm:px-7">
              <ChatComposer value={composer} onChange={setComposer} onSend={() => void onAsk()} disabled={asking} />
              <p className="mt-2 text-center text-[11px] text-ink-400">{AI_SECTION.askHint}</p>
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------- preview */}
        <div
          ref={previewRef}
          className="border-t border-line bg-cream-50 px-5 py-6 sm:px-7 sm:py-8 lg:border-l lg:border-t-0 lg:overflow-y-auto"
        >
          <ProtocolPreview
            goals={view.session.detectedGoals}
            protocol={view.protocol}
            byHandle={byHandle}
            completionState={completionState}
            remaining={remaining}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- footer */}
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line px-5 py-4 sm:px-7">
        <p className="flex items-center gap-2 text-[13px] text-ink-400">
          <Clock3 size={14} strokeWidth={2} aria-hidden="true" />
          {completionState === "complete"
            ? AI_SECTION.readyMeta
            : remaining > 0
              ? AI_SECTION.remaining(remaining)
              : AI_SECTION.duration}
        </p>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2.5">
          {completionState === "complete" && (
            <button
              type="button"
              onClick={onAdjust}
              className="rounded-full border border-line bg-white px-5 py-3 text-[14px] font-bold text-ink transition-[border-color,background-color,transform] duration-200 hover:border-line-strong hover:bg-cream-50 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              {AI_SECTION.adjust}
            </button>
          )}

          {/* The label never claims the protocol is ready before it is. */}
          <button
            type="button"
            onClick={onContinue}
            disabled={session.submitting || completionState === "empty"}
            className="btn-primary group disabled:opacity-40"
          >
            {completionState === "complete" ? AI_SECTION.viewProtocol : AI_SECTION.continueRefining}
            <ArrowRight
              size={16}
              strokeWidth={2.4}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
            />
          </button>
        </div>
      </footer>
    </Modal>
  );
}

function AiBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] rounded-[18px] rounded-bl-[6px] border border-line bg-cream-50 px-4 py-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ember">
          <Sparkles size={12} strokeWidth={2.2} aria-hidden="true" />
          {AI_SECTION.eyebrow}
        </div>
        <p className="text-[14px] leading-[1.55] text-ink-600">{children}</p>
      </div>
    </div>
  );
}

function YouBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] rounded-[18px] rounded-br-[6px] bg-ember px-4 py-3">
        <p className="whitespace-pre-wrap text-[14px] leading-[1.55] text-white">{children}</p>
      </div>
    </div>
  );
}
