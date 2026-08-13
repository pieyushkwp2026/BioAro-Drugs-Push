import { type FormEvent, useCallback, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info, ShieldAlert } from "lucide-react";
import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import {
  askBioAro,
  DOMAIN_QUERIES,
  SAFETY_NOTE,
  SENSITIVE_BODY,
  SENSITIVE_HEADING,
  type AskResult,
} from "../../lib/ask";

/*
 * The shared body of Ask BioAro, used by both the homepage section and the floating
 * launcher so there is one behaviour and one set of states to reason about.
 *
 * Scope: this answers questions. It does NOT recommend a product. A "which one should
 * I take" question returns `needs-quiz` and hands off to the quiz, which is the site's
 * recommendation path. Two surfaces, two jobs.
 */

const DOMAIN_CHIPS = [
  { label: "Clarity", color: "#3B54C4", chipColor: "#3B54C4", tint: "rgba(59,84,196,0.10)" },
  // Ember on its own 10% tint computes to 4.37:1, under the 4.5 floor, so the label
  // takes the darker step. Matches the treatment on the homepage quiz chips.
  { label: "Strength", color: "#C1462A", chipColor: "#A63A21", tint: "rgba(193,70,42,0.10)" },
  { label: "Recovery", color: "#0E767A", chipColor: "#0E767A", tint: "rgba(14,118,122,0.10)" },
  { label: "Longevity", color: "#2A6347", chipColor: "#2A6347", tint: "rgba(42,99,71,0.10)" },
] as const;

export default function AskPanel({ compact = false }: { compact?: boolean }) {
  const marketHref = useMarketHref();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [asked, setAsked] = useState("");

  const run = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    setAsked(trimmed);
    // Resolves locally today. Awaited anyway so a real endpoint changes nothing here.
    setResult(await askBioAro(trimmed));
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(query);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Ask BioAro a question
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What would you like help with?"
            className={`w-full rounded-full border border-line bg-white pl-6 pr-16 text-ink placeholder:text-ink-400 transition-colors focus:border-ink-400 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember ${
              compact ? "h-13 py-3.5 text-[15px]" : "h-16 text-[16px] sm:text-[17px]"
            }`}
          />
          <button
            type="submit"
            aria-label="Ask"
            className={`absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-ember text-white transition-[background-color,transform] duration-200 hover:bg-ember-600 active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember motion-reduce:active:scale-100 ${
              compact ? "h-9 w-9" : "h-11 w-11"
            }`}
          >
            <ArrowRight size={17} strokeWidth={2.4} />
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {DOMAIN_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => {
              const seed = DOMAIN_QUERIES[chip.label] ?? chip.label;
              setQuery(chip.label);
              void run(seed);
            }}
            className="rounded-full px-4 py-2 text-[14px] font-bold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none"
            style={{ backgroundColor: chip.tint, color: chip.chipColor, outlineColor: chip.color }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-7" aria-live="polite">
          {result.kind === "sensitive" && (
            <div className="rounded-[24px] border border-line bg-white p-6">
              <div className="flex items-start gap-3">
                <ShieldAlert size={20} strokeWidth={1.8} className="mt-0.5 shrink-0 text-ember" />
                <div>
                  <h3 className="text-[17px] font-bold tracking-[-0.02em] text-ink">
                    {SENSITIVE_HEADING}
                  </h3>
                  <p className="mt-2 max-w-[58ch] text-pretty text-[15px] leading-[1.6] text-ink-600">
                    {SENSITIVE_BODY}
                  </p>
                  <Link
                    to={marketHref(ROUTES.support)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full text-[14.5px] font-bold text-ink underline-offset-[5px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                  >
                    Contact support
                    <ArrowRight size={15} strokeWidth={2.4} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {result.kind === "needs-quiz" && (
            <div className="rounded-[24px] border border-line bg-white p-6">
              <h3 className="text-[17px] font-bold tracking-[-0.02em] text-ink">
                That one is worth a couple of questions.
              </h3>
              <p className="mt-2 max-w-[58ch] text-pretty text-[15px] leading-[1.6] text-ink-600">
                Choosing a product depends on your routine and what you are aiming for, so the quiz
                will get you a better answer than this box can.
              </p>
              <Link to={marketHref(ROUTES.quiz)} className="btn-primary mt-5">
                Take the 2-minute quiz
                <ArrowRight size={16} strokeWidth={2.4} />
              </Link>
            </div>
          )}

          {result.kind === "no-match" && (
            <div className="rounded-[24px] border border-line bg-white p-6">
              <h3 className="text-[17px] font-bold tracking-[-0.02em] text-ink">
                I do not have an answer for that one.
              </h3>
              <p className="mt-2 max-w-[58ch] text-pretty text-[15px] leading-[1.6] text-ink-600">
                Try asking about ingredients, how the sachets work, third-party testing, or what
                Clarity, Strength, Recovery and Longevity each cover.
              </p>
              <Link
                to={marketHref(ROUTES.support)}
                className="mt-4 inline-flex items-center gap-2 rounded-full text-[14.5px] font-bold text-ink underline-offset-[5px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              >
                Ask a person instead
                <ArrowRight size={15} strokeWidth={2.4} />
              </Link>
            </div>
          )}

          {result.kind === "answer" && (
            <div className="space-y-3">
              <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">
                On &ldquo;{asked}&rdquo;
              </p>
              {result.answers.map((item) => (
                <article
                  key={`${item.source.href}-${item.question}`}
                  className="rounded-[24px] border border-line bg-white p-6"
                >
                  <h3 className="text-[16.5px] font-bold tracking-[-0.02em] text-ink">
                    {item.question}
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-pretty text-[15px] leading-[1.6] text-ink-600">
                    {item.answer}
                  </p>
                  <Link
                    to={marketHref(item.source.href)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full text-[13.5px] font-bold text-ink-400 transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
                  >
                    {item.source.label}
                    <ArrowRight size={13} strokeWidth={2.4} />
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Shown on every state, including successful answers, not just the safety one. */}
          <p className="mt-5 flex items-start gap-2 text-[13px] leading-[1.6] text-ink-400">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span className="max-w-[64ch]">{SAFETY_NOTE}</span>
          </p>
        </div>
      )}
    </div>
  );
}
