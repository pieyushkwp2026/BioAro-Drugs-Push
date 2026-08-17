import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  Check,
  MessageCircle,
  Plus,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { useAiChat } from "../../hooks/useAiChat";
import { useCart } from "../../hooks/useCart";
import { useCatalog } from "../../hooks/useCatalog";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import {
  formatCatalogMoney,
  isCurrencyAlignedWithMarket,
} from "../../lib/market/config";
import { ROUTES } from "../../lib/routes";
import {
  askBioAro,
  SAFETY_NOTE,
  SENSITIVE_BODY,
  SENSITIVE_HEADING,
  type AskAnswer,
  type AskResult,
} from "../../lib/ask";
import type { CatalogProduct } from "../../lib/shopify/types";

/*
 * BioAro Drugs AI — the chat bot.
 *
 * HONEST SCOPE. Each message is answered on its own against BioAro Drugs' approved
 * copy. There is no memory between turns, so the greeting invites a question rather
 * than a conversation, and nothing in the copy promises it will remember. A follow-up
 * that leans on a pronoun ("how do I take it") will not resolve, which is why the
 * suggested prompts and the empty state both push whole questions.
 *
 * The thread persists for the session so a visitor can scroll back, and it is not sent
 * anywhere: retrieval runs entirely in the browser. It used to be true that nothing was
 * stored either — the dedicated /ai page now keeps a transcript in localStorage so a
 * visitor can find a past conversation, which is listed, deletable, and never includes
 * an attached image. This widget writes nothing itself.
 */

const GREETING =
  "Ask me about an ingredient and its dose, how the sachets work, third-party testing, or what a formula is for.";

const STARTERS = [
  "How much NMN is in LONgevity+?",
  "Are your products third-party tested?",
  "What supports recovery after training?",
];

interface Turn {
  id: number;
  question: string;
  result: AskResult | null;
}

function productHandleFrom(answer: AskAnswer): string | null {
  const match = answer.source.href.match(/^\/products\/([a-z0-9-]+)$/i);
  return match ? match[1] : null;
}

function ChatProductRow({ product }: { product: CatalogProduct }) {
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const { addProduct } = useCart();
  const [added, setAdded] = useState(false);

  const buyable =
    product.availableForSale &&
    product.price.amount > 0 &&
    isCurrencyAlignedWithMarket(product.price.currencyCode, country);

  return (
    <div className="mt-2.5 flex items-center gap-2.5 rounded-[14px] border border-line bg-white p-2">
      <img
        src={product.image?.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="h-10 w-10 shrink-0 rounded-[8px] bg-cream-50 object-contain p-0.5"
      />
      <div className="min-w-0 flex-1">
        <Link
          to={marketHref(`/products/${product.handle}`)}
          className="block truncate text-[13.5px] font-bold text-ink hover:text-ember"
        >
          {product.title}
        </Link>
        <p className="text-[12px] tabular-nums text-ink-400">
          {formatCatalogMoney(product.price, country)}
        </p>
      </div>
      {buyable && (
        <button
          type="button"
          onClick={() => {
            void addProduct(product, 1);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 2000);
          }}
          className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-ember px-3 text-[12px] font-bold text-white transition-colors hover:bg-ember-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
        >
          {added ? (
            <Check size={12} strokeWidth={3} aria-hidden="true" />
          ) : (
            <Plus size={12} strokeWidth={3} aria-hidden="true" />
          )}
          {added ? "Added" : "Add"}
        </button>
      )}
    </div>
  );
}

function AnswerBubble({
  result,
  onAsk,
  byHandle,
}: {
  result: AskResult;
  onAsk: (q: string) => void;
  byHandle: Map<string, CatalogProduct>;
}) {
  const marketHref = useMarketHref();

  if (result.kind === "sensitive") {
    return (
      <div>
        <p className="flex items-center gap-1.5 text-[14px] font-bold text-ink">
          <ShieldAlert
            size={15}
            strokeWidth={2.2}
            aria-hidden="true"
            className="text-ember"
          />
          {SENSITIVE_HEADING}
        </p>
        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-600">
          {SENSITIVE_BODY}
        </p>
        <Link
          to={marketHref(ROUTES.support)}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-ink underline-offset-4 hover:text-ember hover:underline"
        >
          Contact support
          <ArrowRight size={13} strokeWidth={2.4} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  if (result.kind === "needs-quiz") {
    return (
      <div>
        <p className="text-[13.5px] leading-[1.55] text-ink">
          Choosing between formulas depends on your goals and how your days run.
          The Protocol Builder asks four questions and explains why each formula
          is in your result.
        </p>
        <Link
          to={marketHref(ROUTES.quiz)}
          className="btn-primary mt-3 !py-2.5 !text-[13px]"
        >
          Build My Protocol
          <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  if (result.kind === "no-match") {
    return (
      <div>
        <p className="text-[13.5px] leading-[1.55] text-ink">
          I do not have an answer for that one. Try one of these:
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => onAsk(starter)}
              className="rounded-full border border-line bg-white px-2.5 py-1.5 text-[12px] font-medium text-ink-600 transition-colors hover:text-ink"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const [lead, ...rest] = result.answers;
  const handles = [
    ...new Set(
      result.answers
        .map(productHandleFrom)
        .filter((h): h is string => Boolean(h)),
    ),
  ];
  const products = handles
    .map((h) => byHandle.get(h))
    .filter((p): p is CatalogProduct => Boolean(p))
    .slice(0, 2);

  return (
    <div>
      <p className="text-[13.5px] leading-[1.6] text-ink">{lead.answer}</p>
      <Link
        to={marketHref(lead.source.href)}
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] font-bold text-ink-600 transition-colors hover:text-ink"
      >
        {lead.source.label}
        <ArrowRight size={11} strokeWidth={2.6} aria-hidden="true" />
      </Link>

      {products.map((product) => (
        <ChatProductRow key={product.handle} product={product} />
      ))}

      {rest.length > 0 && (
        <div className="mt-3 border-t border-line pt-2.5">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-400">
            Related
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {rest.map((answer) => (
              <li key={answer.question}>
                <button
                  type="button"
                  onClick={() => onAsk(answer.question)}
                  className="text-left text-[12.5px] font-medium text-ink-600 underline-offset-4 hover:text-ember hover:underline"
                >
                  {answer.question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AiChatWidget() {
  const { isOpen, openChat, closeChat, seed, clearSeed } = useAiChat();
  const { isOpen: cartOpen } = useCart();
  // Deferred until the panel is opened — see the note in useCatalog.
  const { byHandle } = useCatalog(isOpen);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pending, setPending] = useState(false);
  const nextId = useRef(0);

  const ask = useCallback(async (value: string) => {
    const question = value.trim();
    if (!question) return;
    const id = (nextId.current += 1);
    setTurns((prev) => [...prev, { id, question, result: null }]);
    setDraft("");
    setPending(true);

    const result = await askBioAro(question);
    setTurns((prev) =>
      prev.map((turn) => (turn.id === id ? { ...turn, result } : turn)),
    );
    setPending(false);
  }, []);

  // A question handed over from the band's CTA runs as soon as the panel opens.
  useEffect(() => {
    if (!isOpen || !seed) return;
    void ask(seed);
    clearSeed();
  }, [isOpen, seed, ask, clearSeed]);

  useEffect(() => {
    if (!isOpen) return;
    const focus = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(focus);
  }, [isOpen]);

  // Keep the newest turn in view without yanking the whole page around it.
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({
      block: "end",
      behavior: turns.length > 1 ? "smooth" : "auto",
    });
  }, [turns, pending]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeChat();
      launcherRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeChat]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void ask(draft);
  };

  // Yield the corner to the cart rather than stacking two floating surfaces.
  if (cartOpen) return null;

  return (
    <>
      {/* ------------------------------------------------------------- launcher */}
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => openChat()}
          aria-label="Open BioAro Drugs AI chat"
          className="group fixed bottom-4 right-4 z-30 flex h-14 items-center gap-2.5 rounded-full bg-ink pl-4 pr-5 text-white shadow-glass-lg transition-[transform,background-color] duration-200 hover:bg-ink-900 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember motion-reduce:active:scale-100 sm:bottom-6 sm:right-6"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember">
            <Sparkles size={15} strokeWidth={2.3} aria-hidden="true" />
          </span>
          <span className="text-[13.5px] font-bold tracking-[-0.01em]">
            BioAro Drugs AI
          </span>
        </button>
      )}

      {/* ---------------------------------------------------------------- panel
          Full-screen sheet on phones, anchored card from sm up. */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="BioAro Drugs AI"
          /* z-[60] beats the fixed header's z-50. On phones this panel is a
             full-screen sheet covering inset-0, and at z-30 the header painted
             straight through its top edge — the wordmark and the cart button sat on
             top of the chat's own header. The launcher stays at z-30 with the other
             floating furniture; only the open sheet needs to outrank the header. */
          className="fixed inset-0 z-[60] flex flex-col bg-cream sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(620px,calc(100vh-96px))] sm:w-[400px] sm:rounded-[24px] sm:border sm:border-line sm:shadow-glass-lg"
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-line bg-white px-4 py-3.5 sm:rounded-t-[24px]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember text-white">
              <Sparkles size={16} strokeWidth={2.3} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-bold tracking-[-0.02em] text-ink">
                BioAro Drugs AI
              </p>
              <p className="text-[12px] text-ink-400">
                Answers from BioAro Drugs&rsquo; own product information
              </p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-cream-50 hover:text-ink"
            >
              <X size={17} strokeWidth={2.4} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            {/* Greeting. Deliberately not "how can I help?" — it names what the
                system actually knows, which sets answerable expectations. */}
            <div className="flex gap-2.5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ember text-white">
                <Sparkles size={13} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <div className="rounded-[16px] rounded-tl-[6px] border border-line bg-white p-3.5">
                <p className="text-[13.5px] leading-[1.6] text-ink">
                  {GREETING}
                </p>
              </div>
            </div>

            {turns.length === 0 && (
              <div className="ml-[38px] mt-2.5 flex flex-wrap gap-1.5">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => void ask(starter)}
                    className="rounded-full border border-line bg-white px-2.5 py-1.5 text-[12px] font-medium text-ink-600 transition-colors hover:border-line-strong hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}

            <ol aria-live="polite" aria-busy={pending}>
              {turns.map((turn) => (
                <li key={turn.id}>
                  <div className="mt-4 flex justify-end">
                    <p className="max-w-[85%] rounded-[16px] rounded-br-[6px] bg-ember px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-white">
                      {turn.question}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ember text-white">
                      <Sparkles
                        size={13}
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0 flex-1 rounded-[16px] rounded-tl-[6px] border border-line bg-white p-3.5">
                      {turn.result ? (
                        <AnswerBubble
                          result={turn.result}
                          onAsk={(q) => void ask(q)}
                          byHandle={byHandle}
                        />
                      ) : (
                        <span className="flex gap-1" aria-label="Searching">
                          {[0, 1, 2].map((dot) => (
                            <span
                              key={dot}
                              className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-400"
                              style={{ animationDelay: `${dot * 160}ms` }}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div ref={threadEndRef} />
          </div>

          <form
            onSubmit={onSubmit}
            className="shrink-0 border-t border-line bg-white px-3 py-3 sm:rounded-b-[24px]"
          >
            <label htmlFor={inputId} className="sr-only">
              Ask BioAro Drugs AI a question
            </label>
            <div className="flex items-center gap-2 rounded-full border border-line bg-cream-50 py-1 pl-4 pr-1 focus-within:border-ember/60">
              <input
                id={inputId}
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask a question"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-ink outline-none placeholder:text-ink-400"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!draft.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember text-white transition-[background-color,opacity] duration-200 hover:bg-ember-600 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <ArrowUp size={16} strokeWidth={2.6} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 px-1 text-[10.5px] leading-[1.45] text-ink-400">
              {SAFETY_NOTE}
            </p>
          </form>
        </div>
      )}
    </>
  );
}

/* Exported for the band, which wants the same mark without the whole widget. */
export function AiMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-ember text-white"
      style={{ height: size, width: size }}
    >
      <MessageCircle
        size={Math.round(size * 0.44)}
        strokeWidth={2.2}
        aria-hidden="true"
      />
    </span>
  );
}
