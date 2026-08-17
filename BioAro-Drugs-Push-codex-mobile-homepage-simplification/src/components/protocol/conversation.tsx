import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  Check,
  CornerDownLeft,
  Plus,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { AI_SECTION } from "../../data/homepage";
import type { ImageIntent } from "../../lib/assistant/turns";
import {
  SAFETY_NOTE,
  SENSITIVE_BODY,
  SENSITIVE_HEADING,
  type AskAnswer,
  type AskResult,
} from "../../lib/ask";
import { formatCatalogMoney, isCurrencyAlignedWithMarket } from "../../lib/market/config";
import { ROUTES } from "../../lib/routes";
import type { CatalogProduct } from "../../lib/shopify/types";
import { useCart } from "../../hooks/useCart";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";

/*
 * The conversation's parts, shared by the two surfaces that hold one.
 *
 * These grew inside the studio modal, which was the only place a thread existed. The
 * dedicated page at /ai needs the same bubbles, the same answer rendering and the same
 * composer, and duplicating them would let the two drift — the modal is the quick
 * entry, the page is the full experience, and a visitor moving between them must not
 * notice a seam.
 *
 * Everything here is presentational. The thread itself lives in
 * `ProtocolSessionProvider`, so both surfaces read one log.
 */

function productHandleFrom(answer: AskAnswer): string | null {
  const match = answer.source.href.match(/^\/products\/([a-z0-9-]+)$/i);
  return match ? match[1] : null;
}

export function ProductRow({ product }: { product: CatalogProduct }) {
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

export function ChatAiResponse({
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

export function ChatComposer({
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

export function AiBubble({ children }: { children: ReactNode }) {
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

export function YouBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] rounded-[18px] rounded-br-[6px] bg-ember px-4 py-3">
        <p className="whitespace-pre-wrap text-[14px] leading-[1.55] text-white">{children}</p>
      </div>
    </div>
  );
}

/*
 * An attached photo, in the thread.
 *
 * Rendered on both surfaces even though only the page can create one: the thread is
 * shared, so a photo attached on /ai is part of the conversation the homepage modal
 * shows. The privacy line travels with the image rather than sitting in a policy page,
 * because the moment a visitor looks at their own prescription on screen is the moment
 * the question "where did this go?" occurs to them.
 */
export function ImageTurn({
  intent,
  previewUrl,
  name,
}: {
  intent: ImageIntent;
  previewUrl: string;
  name: string;
}) {
  return (
    <div className="ml-auto max-w-[88%] overflow-hidden rounded-[18px] rounded-br-[6px] border border-line bg-white">
      <img src={previewUrl} alt={name} className="max-h-[220px] w-full object-cover" />
      <div className="border-t border-line px-4 py-3">
        <p className="text-[13px] font-bold tracking-[-0.01em] text-ink">
          {intent === "prescription" ? AI_SECTION.attachIntentPrescription : AI_SECTION.attachIntentLabel}
        </p>
        <p className="mt-1 text-[12px] leading-[1.5] text-ink-400">{AI_SECTION.attachPrivacy}</p>
        {intent === "prescription" && (
          <p className="mt-1.5 text-[12px] leading-[1.5] text-ink-400">
            {AI_SECTION.attachPrescriptionNote}
          </p>
        )}
      </div>
    </div>
  );
}
