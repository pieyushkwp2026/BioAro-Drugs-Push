import { useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, FlaskConical, Info, Plus, RotateCcw } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useCatalog } from "../hooks/useCatalog";
import { useMarket } from "../hooks/useMarket";
import { useMarketHref } from "../hooks/useMarketHref";
import { formatCatalogMoney, isCurrencyAlignedWithMarket } from "../lib/market/config";
import { ROUTES } from "../lib/routes";
import { AI_SECTION, BUILDER, GOALS } from "../data/homepage";
import { buildProtocol, type GoalId, type ProtocolAnswers } from "../lib/protocol/build";
import type { CatalogProduct } from "../lib/shopify/types";

/*
 * BioAro Drugs Protocol Builder.
 *
 * Renamed from "Wellness quiz". The route stays /quiz so existing links, redirects
 * and search results keep working; only the experience is renamed, and the site now
 * uses one vocabulary for it — "Protocols backed by science" is the label, the
 * Protocol Builder is the flow, "Build My Protocol" is the action. Six competing
 * labels ("Find your fit", "Find my fit", quiz, stack, protocol, Ask BioAro) collapse
 * into that one. The AI name lives on the hero search, the band and the chat — the
 * surfaces where a question actually gets typed.
 *
 * The homepage passes ?goal=, so a visitor who already chose on the homepage is not
 * asked the same question again — which is exactly what the previous version did.
 */

const STEPS = [
  {
    key: "goal" as const,
    question: "What do you want to improve?",
    options: GOALS.map((goal) => ({ value: goal.id, label: goal.label })),
  },
  {
    key: "energy" as const,
    question: "How is your energy by mid-afternoon?",
    options: [
      { value: "steady", label: "Steady all day" },
      { value: "dips", label: "It dips a little" },
      { value: "crashes", label: "It crashes hard" },
    ],
  },
  {
    key: "sleep" as const,
    question: "How has your sleep been lately?",
    options: [
      { value: "restful", label: "Restful" },
      { value: "inconsistent", label: "Inconsistent" },
      { value: "poor", label: "Poor" },
    ],
  },
  {
    key: "training" as const,
    question: "How often do you train?",
    options: [
      { value: "daily", label: "Most days" },
      { value: "sometimes", label: "A few times a week" },
      { value: "rarely", label: "Rarely" },
    ],
  },
];

function isGoalId(value: string | null): value is GoalId {
  return Boolean(value) && GOALS.some((goal) => goal.id === value);
}

export default function Quiz() {
  const marketHref = useMarketHref();
  const { country } = useMarket();
  const { byHandle } = useCatalog();
  const { addProducts } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  /* What the visitor typed on the homepage, carried in router state rather than the
     query string. Shown back to them so the handoff is visible and their words are
     evidently not discarded — and so that, once the interpretation endpoint exists,
     this is already the place its summary renders. */
  const note = typeof (location.state as { note?: unknown } | null)?.note === "string"
    ? ((location.state as { note: string }).note)
    : null;

  /*
   * Goals chosen on the homepage pre-answer step one. `?goals=` is the multi-select
   * form; `?goal=` is still read so older links keep working.
   *
   * Goals are held as their own typed array rather than inside the string map: they
   * are the one answer that is a list, and the previous shape forced a
   * `as unknown as ProtocolAnswers` cast at the call site. That cast silently
   * survived the engine's single-goal-to-multi-goal change and would have shipped a
   * builder that quietly produced a generic protocol. Typed properly, the compiler
   * catches the next such change.
   */
  const seededGoals = useMemo(() => {
    const raw = searchParams.get("goals") ?? searchParams.get("goal") ?? "";
    return raw.split(",").map((value) => value.trim()).filter(isGoalId);
  }, [searchParams]);

  const [goals, setGoals] = useState<GoalId[]>(seededGoals);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(() => (seededGoals.length > 0 ? 1 : 0));
  const [added, setAdded] = useState(false);

  const done = step >= STEPS.length;
  const progress = done ? 100 : (step / STEPS.length) * 100;

  const protocol = useMemo(() => {
    if (!done) return null;
    return buildProtocol({
      goals,
      energy: (answers.energy ?? "steady") as ProtocolAnswers["energy"],
      sleep: (answers.sleep ?? "restful") as ProtocolAnswers["sleep"],
      training: (answers.training ?? "rarely") as ProtocolAnswers["training"],
    });
  }, [answers, goals, done]);

  const resolved = useMemo(() => {
    if (!protocol) return [];
    return protocol.items
      .map((item) => ({ item, product: byHandle.get(item.handle) }))
      .filter((row): row is { item: (typeof protocol.items)[number]; product: CatalogProduct } => Boolean(row.product));
  }, [protocol, byHandle]);

  const select = (key: string, value: string) => {
    if (key === "goal") {
      if (isGoalId(value)) setGoals([value]);
    } else {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    }
    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => Math.max(0, prev - 1));

  const restart = () => {
    setAnswers({});
    setGoals([]);
    setStep(0);
    setAdded(false);
  };

  const purchasable = resolved.filter(
    ({ product }) =>
      product.availableForSale &&
      product.price.amount > 0 &&
      isCurrencyAlignedWithMarket(product.price.currencyCode, country),
  );
  const canAddAll = purchasable.length > 0 && purchasable.length === resolved.length;
  const total = resolved.reduce((sum, { product }) => sum + product.price.amount, 0);
  const currencies = new Set(resolved.map(({ product }) => product.price.currencyCode));
  const totalCurrency = currencies.size === 1 ? [...currencies][0] : "MIXED";

  const onAddAll = async () => {
    await addProducts(resolved.map(({ product }) => product), 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  const current = STEPS[step];

  return (
    <div className="bg-cream pb-20 pt-28 sm:pb-24 md:pt-32 lg:pt-36">
      <div className="container-bio">
        <div className="mx-auto max-w-[880px]">
          {/* Matches the homepage section that links here. The label must not change
              as a visitor clicks through: this is the protocol path, and the AI name
              stays on the surfaces where a question actually gets typed. */}
          <div className="flex items-center gap-2.5">
            <FlaskConical size={15} strokeWidth={2.2} aria-hidden="true" className="text-ember" />
            <p className="eyebrow">{BUILDER.eyebrow}</p>
          </div>
          <h1 className="mt-4 max-w-[18ch] text-balance text-[36px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[46px] lg:text-[54px]">
            Protocol Builder
          </h1>
          <p className="mt-5 max-w-[56ch] text-pretty text-[16.5px] leading-[1.6] text-ink-600">
            Four questions about your goals and how your days run. Every answer changes
            what you are shown, and each formula comes with the reason it is there.
          </p>

          {note && (
            <figure className="mt-6 max-w-[56ch] rounded-[18px] border border-line bg-white p-5">
              <figcaption className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">
                {BUILDER.noteLabel}
              </figcaption>
              <blockquote className="mt-2 text-[15px] leading-[1.55] text-ink">{note}</blockquote>
            </figure>
          )}

          {/* Moved here from the homepage. It explains a flow, so it belongs
              immediately before the flow starts rather than three scrolls up a
              homepage. Hidden once the builder is underway — by then it is answered. */}
          {!done && (
            <ol className="mt-10 grid gap-x-8 gap-y-7 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {AI_SECTION.steps.map((step, index) => (
                <li key={step.title}>
                  <span className="text-[12.5px] font-bold tabular-nums text-ember">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 text-[16px] font-bold tracking-[-0.02em] text-ink">{step.title}</h2>
                  <p className="mt-2 text-pretty text-[14px] leading-[1.55] text-ink-600">{step.body}</p>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-10 rounded-[28px] border border-line bg-white p-6 shadow-glass sm:p-9">
            {!done && current && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-400">
                    Step {step + 1} of {STEPS.length}
                  </span>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={back}
                      className="group inline-flex items-center gap-1.5 rounded-full text-[13.5px] font-bold text-ink-600 transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                    >
                      <ArrowLeft size={14} strokeWidth={2.4} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none" />
                      Back
                    </button>
                  )}
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={step + 1}
                  aria-valuemin={1}
                  aria-valuemax={STEPS.length}
                  aria-label="Protocol Builder progress"
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-cream-200"
                >
                  <div className="h-full rounded-full bg-ember transition-[width] duration-500" style={{ width: `${progress}%` }} />
                </div>

                <h2 className="mt-8 max-w-[20ch] text-balance text-[28px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[36px]">
                  {current.question}
                </h2>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {current.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => select(current.key, option.value)}
                      className="group flex min-h-[64px] items-center justify-between gap-4 rounded-[18px] border border-line bg-cream-50 px-5 py-4 text-left text-[15.5px] font-bold tracking-[-0.015em] text-ink transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember motion-reduce:hover:transform-none"
                    >
                      {option.label}
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink-400 transition-colors group-hover:border-ember group-hover:text-ember">
                        <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                      </span>
                    </button>
                  ))}
                </div>

                {/* De-branded with the rest of the protocol path. The claim is the
                    same; it just no longer attributes it to the AI. */}
                <p className="mt-6 text-[13px] leading-[1.55] text-ink-400">
                  The builder works from what you tell it here. It does not diagnose
                  conditions or replace professional medical advice.
                </p>
              </>
            )}

            {done && protocol && (
              <div>
                <p className="eyebrow">Your starting protocol</p>
                <h2 className="mt-4 text-balance text-[30px] font-black leading-[1.02] tracking-[-0.03em] text-ink sm:text-[38px]">
                  {resolved.length === 1 ? "One formula to start with." : `${resolved.length} formulas, built around your answers.`}
                </h2>

                {protocol.notes.map((note) => (
                  <p key={note} className="mt-5 flex max-w-[62ch] items-start gap-2.5 rounded-[18px] border border-line bg-cream-50 px-4 py-3.5 text-[14px] leading-[1.55] text-ink-600">
                    <Info size={15} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-ember" />
                    {note}
                  </p>
                ))}

                <ol className="mt-8">
                  {resolved.map(({ item, product }) => (
                    <li key={item.handle} className="border-t border-line py-5 first:border-t-0 first:pt-0">
                      <div className="flex items-start gap-4">
                        <img
                          src={product.image?.src}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                          className="h-16 w-16 shrink-0 rounded-[14px] border border-line bg-cream-50 object-contain p-1.5"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <Link
                              to={marketHref(`/products/${product.handle}`)}
                              className="text-[17px] font-bold tracking-[-0.02em] text-ink underline-offset-[5px] hover:text-ember hover:underline"
                            >
                              {product.title}
                            </Link>
                            <span className="text-[15px] font-bold tabular-nums text-ink">
                              {formatCatalogMoney(product.price, country)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink-400">{item.slot}</p>
                          {/* Generated from the same answers as the recommendation,
                              so the explanation cannot drift from the logic. */}
                          <p className="mt-2 max-w-[56ch] text-pretty text-[14.5px] leading-[1.55] text-ink-600">{item.reason}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                {canAddAll && (
                  <div className="mt-6 border-t border-line-strong pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="text-[15px] font-bold text-ink">{resolved.length} formulas</span>
                      <span className="text-[17px] font-bold tabular-nums tracking-[-0.02em] text-ink">
                        {formatCatalogMoney({ amount: total, currencyCode: totalCurrency }, country)}
                      </span>
                    </div>
                    <button type="button" onClick={() => void onAddAll()} className="btn-primary mt-5 w-full justify-center">
                      {added ? (
                        <>
                          Added to cart
                          <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          Add this protocol to cart
                          <Plus size={16} strokeWidth={2.6} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to={marketHref(ROUTES.shop)} className="btn-secondary justify-center">
                    Browse everything
                  </Link>
                  <button type="button" onClick={restart} className="btn-secondary justify-center">
                    <RotateCcw size={15} strokeWidth={2.2} aria-hidden="true" />
                    Start again
                  </button>
                </div>

                <p className="mt-7 max-w-[62ch] text-[13px] leading-[1.6] text-ink-400">
                  This is a starting point built from the goals and routine information you
                  provided. It is not a diagnosis, a treatment, or a substitute for advice
                  from a qualified healthcare professional.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
