import { GOALS } from "../../data/homepage";
import type { ProtocolDraft } from "../../hooks/useProtocolDraft";
import type { CatalogProduct } from "../../lib/shopify/types";
import Modal from "../ui/Modal";
import ProtocolPreview from "./ProtocolPreview";
import { GoalChips, IntentBox } from "./protocolControls";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

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

type StudioMode = "protocol" | "chat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function getMatchedLabels(draft: ProtocolDraft) {
  return draft.matched
    .map((id) => GOALS.find((goal) => goal.id === id)?.label)
    .filter(Boolean);
}
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
}

/**
 * The AI feedback that used to sit underneath IntentBox.
 *
 * In protocol mode this lives BELOW the search + chips.
 * In chat mode the same information becomes the first assistant message.
 */
function AiResponse({ draft }: { draft: ProtocolDraft }) {
  const matchedLabels = getMatchedLabels(draft);

  if (!draft.noMatch && matchedLabels.length === 0) {
    return null;
  }

  return (
    <div className="mt-7 animate-[fadeIn_250ms_ease-out] border-t border-line pt-6">
      <div className="rounded-[18px] border border-line bg-cream-50 px-4 py-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(193,70,42,0.09)] text-ember"
          >
            <Sparkles size={14} strokeWidth={2.2} />
          </span>

          <div className="min-w-0">
            {draft.noMatch ? (
              <p
                role="status"
                className="text-[13.5px] leading-[1.55] text-ink-600"
              >
                {AI_SECTION.noMatch}
              </p>
            ) : (
              <>
                <p className="text-[13.5px] leading-[1.55] text-ink-600">
                  I picked up{" "}
                  <span className="font-bold text-ink">
                    {matchedLabels.join(" + ")}
                  </span>{" "}
                  from what you wrote.
                </p>

                <p className="mt-1.5 text-[13px] leading-[1.55] text-ink-400">
                  {AI_SECTION.matchedCaption}{" "}
                  <button
                    type="button"
                    onClick={draft.clearMatched}
                    className="font-bold text-ink underline-offset-4 transition-colors hover:text-ember hover:underline"
                  >
                    {AI_SECTION.matchedClear}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Small chat composer used only after switching the left pane into chat mode.
 *
 * It intentionally does not use ProtocolDraft.message as its value because
 * the original protocol prompt needs to remain available as the first
 * conversation message.
 */
function ChatComposer({
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
        Reply to BioAro AI
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
          placeholder="Tell BioAro AI anything else..."
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

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-[fadeIn_250ms_ease-out]`}
    >
      <div
        className={`
          max-w-[88%] rounded-[18px] px-4 py-3
          ${
            isUser
              ? "rounded-br-[6px] bg-ember text-white"
              : "rounded-bl-[6px] border border-line bg-cream-50 text-ink-600"
          }
        `}
      >
        {!isUser && (
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ember">
            <Sparkles size={12} strokeWidth={2.2} aria-hidden="true" />
            BioAro AI
          </div>
        )}

        <p className="whitespace-pre-wrap text-[14px] leading-[1.55]">
          {message.text}
        </p>
      </div>
    </div>
  );
}

/*
 * The protocol studio — the intent step in a modal.
 *
 * Protocol mode:
 *   search → goals → AI response → disclosure
 *
 * Chat mode:
 *   existing search/result become conversation history → reply composer
 *
 * The right-hand protocol preview stays live in both modes.
 */
export default function ProtocolStudio({
  open,
  draft,
  byHandle,
  onClose,
  onContinue,
  autoFocusInput = false,
}: {
  open: boolean;
  draft: ProtocolDraft;
  byHandle: Map<string, CatalogProduct>;
  onClose: () => void;
  onContinue: () => void;
  autoFocusInput?: boolean;
}) {
  const headingId = useId();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const pendingChatMessageRef = useRef<string | null>(null);

  const [mode, setMode] = useState<StudioMode>("protocol");
  const [chatInput, setChatInput] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  type ChatStatus = "idle" | "searching" | "revealing" | "done";
  const [chatResult, setChatResult] = useState<AskResult | null>(null);

  const [chatStatus, setChatStatus] = useState<ChatStatus>("idle");

  const [chatRevealed, setChatRevealed] = useState(0);

  const chatLeadAnswer =
    chatResult?.kind === "answer" ? chatResult.answers[0] : null;

  useEffect(() => {
    if (chatStatus !== "revealing" || !chatLeadAnswer) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChatRevealed(chatLeadAnswer.answer.length);
      setChatStatus("done");
      return;
    }

    const total = chatLeadAnswer.answer.length;

    const step = Math.max(2, Math.round(total / 90));

    const tick = window.setInterval(() => {
      setChatRevealed((current) => {
        const next = current + step;

        if (next >= total) {
          window.clearInterval(tick);
          setChatStatus("done");

          return total;
        }

        return next;
      });
    }, 16);

    return () => window.clearInterval(tick);
  }, [chatStatus, chatLeadAnswer]);

  const stacked =
    typeof window !== "undefined" &&
    !window.matchMedia("(min-width: 1024px)").matches;

  /*
   * When the modal first opens after the homepage search, seed chat history
   * from the exact interaction that produced the protocol.
   */
  useEffect(() => {
    if (!open || conversation.length > 0 || !draft.message.trim()) {
      return;
    }

    const matchedLabels = getMatchedLabels(draft);

    const assistantText = draft.noMatch
      ? AI_SECTION.noMatch
      : matchedLabels.length > 0
        ? `I picked up ${matchedLabels.join(
            " + ",
          )} from what you wrote. You can change any of those goals before we continue.`
        : "I’ve got your starting point. We can refine it together.";

    setConversation([
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: draft.message.trim(),
      },
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: assistantText,
      },
    ]);
  }, [open, conversation.length, draft]);

  /*
   * When a chat reply finishes resolving, append the AI's response.
   *
   * The message is stored in a ref because React state is a snapshot inside
   * the current event handler; we want the effect to append only after the
   * async draft operation has finished.
   */
  useEffect(() => {
    const pendingMessage = pendingChatMessageRef.current;

    if (mode !== "chat" || !pendingMessage || draft.submitting) {
      return;
    }

    const matchedLabels = getMatchedLabels(draft);

    const assistantText = draft.noMatch
      ? AI_SECTION.noMatch
      : matchedLabels.length > 0
        ? `That sounds like ${matchedLabels.join(
            " + ",
          )}. I’ve updated the starting direction around those goals.`
        : "I understand. We can refine the protocol around that.";

    pendingChatMessageRef.current = null;

    setConversation((current) => [
      ...current,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: assistantText,
      },
    ]);
  }, [draft.submitting, draft.matched, draft.noMatch, mode]);

  /*
   * Keep the newest chat message visible.
   */
  useEffect(() => {
    if (mode !== "chat") return;

    const frame = requestAnimationFrame(() => {
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [conversation, mode]);

  /*
   * Existing mobile behaviour: after a protocol is generated, bring the
   * preview into view on stacked layouts.
   */
  useEffect(() => {
    if (!open || !stacked || draft.goals.length === 0) return;

    const frame = requestAnimationFrame(() =>
      previewRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
      }),
    );

    return () => cancelAnimationFrame(frame);
  }, [open, stacked]);

  const switchToChat = () => {
    setMode("chat");

    requestAnimationFrame(() => {
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const switchToProtocol = () => {
    setMode("protocol");
  };

  const sendChatMessage = async () => {
    const message = chatInput.trim();

    if (!message || chatStatus === "searching") {
      return;
    }

    // Add user message immediately.
    setConversation((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: message,
      },
    ]);

    setChatInput("");
    setChatResult(null);
    setChatRevealed(0);
    setChatStatus("searching");

    const result = await askBioAro(message);

    setChatResult(result);

    setChatStatus(result.kind === "answer" ? "revealing" : "done");
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
          <p className="text-[13px] font-black uppercase tracking-[0.12em] text-ink">
            BioAro AI Studio
          </p>

          <p className="mt-0.5 text-[11.5px] text-ink-400">
            {mode === "protocol"
              ? "Build a starting protocol around your goals"
              : "Refine your protocol with AI"}
          </p>
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
        {/* ------------------------------------------------------- left pane */}
        {mode === "protocol" ? (
          <div className="min-h-0 px-5 py-6 sm:px-7 sm:py-8 lg:overflow-y-auto">
            <h2
              id={headingId}
              className="text-balance text-[26px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[32px]"
            >
              {AI_SECTION.studioHeadline}
            </h2>

            {/* Main protocol-mode search */}
            <div className="mt-6">
              <IntentBox
                draft={draft}
                onSend={() => void draft.send()}
                textareaRef={textareaRef}
                rows={3}
              />
            </div>

            {/* Goal chips */}
            <GoalChips draft={draft} className="mt-5" />

            {/* AI result — BELOW search + chips */}
            <AiResponse draft={draft} />

            {/* Disclosure */}
            <p className="mt-8 max-w-[58ch] border-t border-line pt-6 text-[12.5px] leading-[1.6] text-ink-400">
              {AI_SECTION.disclosure}
            </p>
          </div>
        ) : (
          /* ----------------------------------------------------- chat mode */
          <div className="flex min-h-0 flex-col lg:overflow-hidden">
            {/* Conversation history */}
            <div
              ref={chatScrollRef}
              className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8"
            >
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ember">
                  Your conversation
                </p>

                <h2 className="mt-2 text-[26px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[32px]">
                  Let&apos;s refine it.
                </h2>
              </div>

              {conversation.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}

              {/* Real AI response */}
              {chatResult && (
                <div className="flex justify-start animate-[fadeIn_250ms_ease-out]">
                  <div className="max-w-[92%] rounded-[18px] rounded-bl-[6px] border border-line bg-cream-50 px-4 py-4">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ember">
                      <Sparkles
                        size={12}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                      BioAro AI
                    </div>

                    <ChatAiResponse
                      result={chatResult}
                      status={chatStatus}
                      revealed={chatRevealed}
                      byHandle={byHandle}
                      onClose={onClose}
                    />
                  </div>
                </div>
              )}

              {/* Searching indicator */}
              {chatStatus === "searching" && (
                <div className="flex justify-start">
                  <div className="rounded-[18px] rounded-bl-[6px] border border-line bg-cream-50 px-4 py-3">
                    <div
                      className="flex items-center gap-1.5"
                      aria-label="BioAro AI is thinking"
                      aria-live="polite"
                    >
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat composer */}
            <div className="shrink-0 border-t border-line bg-white px-5 py-4 sm:px-7">
              <ChatComposer
                value={chatInput}
                onChange={setChatInput}
                onSend={sendChatMessage}
                disabled={draft.submitting}
              />

              <p className="mt-2 text-center text-[11px] text-ink-400">
                Press Enter to send · Shift + Enter for a new line
              </p>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- right pane */}
        <div
          ref={previewRef}
          className="border-t border-line bg-cream-50 px-5 py-6 sm:px-7 sm:py-8 lg:border-l lg:border-t-0 lg:overflow-y-auto"
        >
          <ProtocolPreview
            goals={draft.goals}
            protocol={draft.protocol}
            byHandle={byHandle}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- footer */}
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line px-5 py-4 sm:px-7">
        <p className="flex items-center gap-2 text-[13px] text-ink-400">
          <Clock3 size={14} strokeWidth={2} aria-hidden="true" />
          {AI_SECTION.duration}
        </p>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2.5">
          {mode === "protocol" ? (
            <button
              type="button"
              onClick={switchToChat}
              className="rounded-full border border-line bg-white px-5 py-3 text-[14px] font-bold text-ink transition-[border-color,background-color,transform] duration-200 hover:border-line-strong hover:bg-cream-50 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              Switch to chat mode
            </button>
          ) : (
            <button
              type="button"
              onClick={switchToProtocol}
              className="rounded-full border border-line bg-white px-5 py-3 text-[14px] font-bold text-ink transition-[border-color,background-color,transform] duration-200 hover:border-line-strong hover:bg-cream-50 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              Back to protocol mode
            </button>
          )}

          <button
            type="button"
            onClick={onContinue}
            disabled={draft.submitting}
            className="btn-primary group disabled:opacity-70"
          >
            {draft.goals.length > 0 ? AI_SECTION.continueCta : AI_SECTION.cta}

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
