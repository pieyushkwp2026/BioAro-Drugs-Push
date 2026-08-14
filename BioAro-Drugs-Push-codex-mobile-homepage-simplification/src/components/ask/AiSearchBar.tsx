import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  Check,
  CornerDownLeft,
  Plus,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
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
 * BioAro Drugs AI — the search bar.
 *
 * WHAT THIS IS, PRECISELY. It retrieves BioAro Drugs' own approved copy: site FAQ,
 * product data including every ingredient and its dose, protocols, quality notes and
 * journal writing. It never composes a sentence about health, and it answers a
 * medical question with a referral rather than an answer.
 *
 * The reveal is paced rather than instant. That is a presentation choice, not a
 * claim: the copy already exists the moment you press enter, and pacing it makes a
 * wall of text readable as it arrives. Nothing in the UI says the system is
 * "thinking", "generating" or "analysing you" — it says it is searching, which is
 * what it is doing.
 */

const PLACEHOLDERS = [
  "How much NMN is in LONgevity+?",
  "What is the difference between Raw Power and Pro Power?",
  "Are your products third-party tested?",
  "How do I take the sachets?",
  "What supports focus and mental clarity?",
  "Which ingredients are in CellOmega+?",
];

const SUGGESTIONS = [
  "How much NMN is in LONgevity+?",
  "Are your products third-party tested?",
  "What supports recovery after training?",
  "How do I take the sachets?",
];

type Status = "idle" | "searching" | "revealing" | "done";

function productHandleFrom(answer: AskAnswer): string | null {
  const match = answer.source.href.match(/^\/products\/([a-z0-9-]+)$/i);
  return match ? match[1] : null;
}

/** Compact buyable row. The full ProductCard is 452px tall and would swamp a panel. */
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
    window.setTimeout(() => setAdded(false), 2000);
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
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ember px-3.5 text-[12.5px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-ember-600 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember motion-reduce:active:scale-100"
        >
          {added ? (
            <Check size={13} strokeWidth={2.8} aria-hidden="true" />
          ) : (
            <Plus size={13} strokeWidth={2.8} aria-hidden="true" />
          )}
          {added ? "Added" : "Add"}
        </button>
      )}
    </div>
  );
}

export default function AiSearchBar({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const inputId = useId();
  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const marketHref = useMarketHref();
  const { byHandle } = useCatalog();

  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [revealed, setRevealed] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typed, setTyped] = useState("");

  const open = status !== "idle";
  const isHero = variant === "hero";

  /* --------------------------------------------------------- typewriter idle state */
  useEffect(() => {
    if (open || query) return;
    const full = PLACEHOLDERS[placeholderIndex];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(full);
      const hold = window.setTimeout(
        () => setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length),
        4000,
      );
      return () => window.clearTimeout(hold);
    }

    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(tick);
        window.setTimeout(
          () => setPlaceholderIndex((n) => (n + 1) % PLACEHOLDERS.length),
          2600,
        );
      }
    }, 34);
    return () => window.clearInterval(tick);
  }, [placeholderIndex, open, query]);

  /* ------------------------------------------------------------------ ⌘K to focus */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setRevealed(0);
  }, []);

  /* ----------------------------------------------- escape + outside click to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      inputRef.current?.focus();
    };
    const onDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node))
        close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  /* ------------------------------------------------------------------- paced reveal */
  const leadAnswer = result?.kind === "answer" ? result.answers[0] : null;

  useEffect(() => {
    if (status !== "revealing" || !leadAnswer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(leadAnswer.answer.length);
      setStatus("done");
      return;
    }
    const total = leadAnswer.answer.length;
    const step = Math.max(2, Math.round(total / 90));
    const tick = window.setInterval(() => {
      setRevealed((current) => {
        const next = current + step;
        if (next >= total) {
          window.clearInterval(tick);
          setStatus("done");
          return total;
        }
        return next;
      });
    }, 16);
    return () => window.clearInterval(tick);
  }, [status, leadAnswer]);

  const run = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    setAsked(trimmed);
    setQuery(trimmed);
    setStatus("searching");
    setResult(null);
    setRevealed(0);

    const next = await askBioAro(trimmed);
    setResult(next);
    setStatus(next.kind === "answer" ? "revealing" : "done");
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void run(query);
  };

  /* Products mentioned by the retrieved sources, de-duplicated, max three. */
  const products = useMemo(() => {
    if (result?.kind !== "answer") return [];
    const handles = [
      ...new Set(
        result.answers
          .map(productHandleFrom)
          .filter((h): h is string => Boolean(h)),
      ),
    ];
    return handles
      .map((h) => byHandle.get(h))
      .filter((p): p is CatalogProduct => Boolean(p))
      .slice(0, 3);
  }, [result, byHandle]);

  const supporting = result?.kind === "answer" ? result.answers.slice(1) : [];

  return (
    <div ref={wrapRef} className="relative">
      {/* ------------------------------------------------------------------ the bar */}
      <form onSubmit={onSubmit} role="search">
        <label htmlFor={inputId} className="sr-only">
          Ask BioAro Drugs AI a question
        </label>
        <div
          className={`group flex items-center gap-3 rounded-full border bg-white transition-[border-color,box-shadow] duration-200 focus-within:border-ember/60 focus-within:shadow-[0_0_0_4px_rgba(193,70,42,0.12)] ${
            open
              ? "border-ember/60 shadow-[0_0_0_4px_rgba(193,70,42,0.12)]"
              : "border-line-strong shadow-glass"
          } ${isHero ? "h-[62px] pl-5 pr-2 sm:h-[68px] sm:pl-6 sm:pr-2.5" : "h-[52px] pl-4 pr-1.5"}`}
        >
          <Sparkles
            size={isHero ? 19 : 17}
            strokeWidth={2.1}
            aria-hidden="true"
            className="shrink-0 text-ember transition-transform duration-300 group-focus-within:scale-110 motion-reduce:transform-none"
          />
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={query ? "" : typed || PLACEHOLDERS[0]}
            autoComplete="off"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            className={`min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-400 ${
              isHero ? "text-[16px] sm:text-[17.5px]" : "text-[15px]"
            }`}
          />
          {/* The shortcut hint is a real affordance, and it disappears on the small
              screens where there is no keyboard to press it with. */}
          {!query && !open && isHero && (
            <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-line bg-cream-50 px-1.5 py-1 font-mono text-[11px] font-bold text-ink-400 lg:flex">
              ⌘K
            </kbd>
          )}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                close();
                inputRef.current?.focus();
              }}
              aria-label="Clear"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:text-ink"
            >
              <X size={15} strokeWidth={2.4} />
            </button>
          )}
          <button
            type="submit"
            aria-label="Ask BioAro Drugs AI"
            className={`flex shrink-0 items-center justify-center rounded-full bg-ember text-white transition-[background-color,transform] duration-200 hover:bg-ember-600 active:scale-[0.95] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember motion-reduce:active:scale-100 ${
              isHero ? "h-[46px] w-[46px] sm:h-[50px] sm:w-[50px]" : "h-10 w-10"
            }`}
          >
            <ArrowUp
              size={isHero ? 19 : 17}
              strokeWidth={2.6}
              aria-hidden="true"
            />
          </button>
        </div>
      </form>

      {/* Suggested prompts. One tap to a real answer.
          Kept mounted AND live while the panel is open, rather than unmounted:
          removing them collapsed 97px out of the hero the moment anyone searched,
          shunting the rest of the page upward. Leaving them interactive turns them
          into follow-up prompts instead of four dead controls under an open panel. */}
      {isHero && (
        <ul className="mt-3.5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => void run(suggestion)}
                className="rounded-full border border-line bg-white/70 px-3.5 py-2 text-[13px] font-medium text-ink-600 transition-[background-color,border-color,color] duration-200 hover:border-line-strong hover:bg-white hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ----------------------------------------------------------------- the panel
          Absolutely positioned so an answer never pushes the hero down the page. */}
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-label="BioAro Drugs AI answer"
          className="absolute inset-x-0 top-[calc(100%+12px)] z-40 max-h-[min(66vh,560px)] overflow-y-auto overscroll-contain rounded-[24px] border border-line bg-white p-5 shadow-glass-lg sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="min-w-0 flex-1 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">
              <span className="text-ember">BioAro Drugs AI</span>
              <span className="mx-2 text-line-strong">/</span>
              <span className="normal-case tracking-normal text-ink-600">
                {asked}
              </span>
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Close answer"
              className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-cream-50 hover:text-ink"
            >
              <X size={16} strokeWidth={2.4} />
            </button>
          </div>

          <div
            aria-live="polite"
            aria-busy={status === "searching"}
            className="mt-4"
          >
            {status === "searching" && (
              <div className="space-y-2.5" aria-label="Searching">
                <div className="h-4 w-[92%] animate-pulse rounded bg-cream-200" />
                <div className="h-4 w-[78%] animate-pulse rounded bg-cream-200" />
                <div className="h-4 w-[54%] animate-pulse rounded bg-cream-200" />
              </div>
            )}

            {result?.kind === "sensitive" && (
              <div>
                <p className="flex items-center gap-2 text-[16px] font-bold tracking-[-0.02em] text-ink">
                  <ShieldAlert
                    size={17}
                    strokeWidth={2.2}
                    aria-hidden="true"
                    className="text-ember"
                  />
                  {SENSITIVE_HEADING}
                </p>
                <p className="mt-2.5 text-pretty text-[14.5px] leading-[1.6] text-ink-600">
                  {SENSITIVE_BODY}
                </p>
                <Link
                  to={marketHref(ROUTES.support)}
                  onClick={close}
                  className="btn-secondary mt-5"
                >
                  Contact support
                  <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
                </Link>
              </div>
            )}

            {result?.kind === "needs-quiz" && (
              <div>
                <p className="text-[16px] font-bold tracking-[-0.02em] text-ink">
                  That one is worth a couple of questions.
                </p>
                <p className="mt-2.5 max-w-[58ch] text-pretty text-[14.5px] leading-[1.6] text-ink-600">
                  Choosing between formulas depends on your goals and how your
                  days run. The Protocol Builder asks four questions and
                  explains why each formula is in your result.
                </p>
                <Link
                  to={marketHref(ROUTES.quiz)}
                  onClick={close}
                  className="btn-primary mt-5"
                >
                  Build My Protocol
                  <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
                </Link>
              </div>
            )}

            {result?.kind === "no-match" && (
              <div>
                <p className="text-[16px] font-bold tracking-[-0.02em] text-ink">
                  I do not have an answer for that one.
                </p>
                <p className="mt-2.5 max-w-[58ch] text-pretty text-[14.5px] leading-[1.6] text-ink-600">
                  Try asking about an ingredient and its dose, how the sachets
                  work, third-party testing, or what a formula is for.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.slice(0, 3).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void run(suggestion)}
                      className="rounded-full border border-line bg-cream-50 px-3 py-1.5 text-[12.5px] font-medium text-ink-600 transition-colors hover:bg-white hover:text-ink"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    <Link
                      to={marketHref(leadAnswer.source.href)}
                      onClick={close}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-cream-50 px-3.5 py-2 text-[12.5px] font-bold text-ink-600 transition-colors hover:border-line-strong hover:text-ink"
                    >
                      {leadAnswer.source.label}
                      <ArrowRight
                        size={13}
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                    </Link>

                    {products.length > 0 && (
                      <div className="mt-5 space-y-2">
                        {products.map((product) => (
                          <ProductRow key={product.handle} product={product} />
                        ))}
                      </div>
                    )}

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
                                onClick={close}
                                className="group block"
                              >
                                <span className="text-[14px] font-bold tracking-[-0.015em] text-ink decoration-ember underline-offset-[4px] group-hover:underline">
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
          </div>

          <p className="mt-6 flex items-start gap-2 border-t border-line pt-4 text-[12px] leading-[1.55] text-ink-400">
            <CornerDownLeft
              size={13}
              strokeWidth={2}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            {SAFETY_NOTE}
          </p>
        </div>
      )}
    </div>
  );
}
