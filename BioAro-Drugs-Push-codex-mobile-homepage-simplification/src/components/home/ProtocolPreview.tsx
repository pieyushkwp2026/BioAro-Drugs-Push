import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Dumbbell, Info, Moon, ShieldCheck, Sunrise, Target } from "lucide-react";
import { AI_SECTION, GOALS } from "../../data/homepage";
import { PRODUCT_GALLERIES } from "../../data/productGalleries";
import { useCart } from "../../hooks/useCart";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { isCurrencyAlignedWithMarket } from "../../lib/market/config";
import type { GoalId, Protocol, ProtocolSlot } from "../../lib/protocol/build";
import type { CompletionState } from "../../lib/protocol/session";
import type { CatalogProduct } from "../../lib/shopify/types";

/*
 * The protocol, taking shape.
 *
 * ---------------------------------------------------------------------------
 * IT SAYS HOW FINISHED IT IS.
 *
 * Naming a product after one word looks like the recommendation was decided before
 * the conversation started, which is the fastest way to lose a visitor's trust in
 * the whole thing. Every label here is driven by `completionState`:
 *
 *   intent    → "Potential fit"                    (one goal, nothing asked)
 *   refining  → "Draft protocol · 2 questions left" (it will still move)
 *   complete  → "Your BioAro Drugs Starting Protocol"
 *
 * This component never decides that itself — the session does, so the modal and the
 * /quiz page cannot disagree about whether a protocol is final.
 *
 * The output is genuine `buildProtocol` output, not a mock-up: the products shown
 * are the ones that would actually be given, in the slot each belongs to, with the
 * rationale the engine derived from the answers given.
 * ---------------------------------------------------------------------------
 */

const SLOT_ICONS: Record<ProtocolSlot, typeof Sunrise> = {
  Morning: Sunrise,
  "Around training": Dumbbell,
  Evening: Moon,
};

function Plate({ icon: Icon }: { icon: typeof Sunrise }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(193,70,42,0.08)] text-ember"
    >
      <Icon size={19} strokeWidth={1.9} />
    </span>
  );
}

/*
 * The curated hero shot, not the raw Shopify featured image.
 *
 * `product.image` is whatever is first on the Shopify product, which is not always
 * the branded pack shot. `PRODUCT_GALLERIES` holds the five images chosen per
 * product, hero first — the same artwork the PDP shows. Falls back to Shopify only
 * for a handle the map does not cover, so a new product still renders something.
 */
function heroImage(product: CatalogProduct): string | undefined {
  return PRODUCT_GALLERIES[product.handle]?.[0]?.src ?? product.image?.src;
}

export default function ProtocolPreview({
  goals,
  protocol,
  byHandle,
  completionState = "intent",
  remaining = 0,
}: {
  goals: GoalId[];
  protocol: Protocol | null;
  byHandle: Map<string, CatalogProduct>;
  completionState?: CompletionState;
  remaining?: number;
}) {
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const { addProducts, openCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const goalLabels = goals
    .map((id) => GOALS.find((goal) => goal.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  const rows = (protocol?.items ?? [])
    .map((item) => ({ item, product: byHandle.get(item.handle) }))
    .filter((row): row is { item: NonNullable<Protocol["items"]>[number]; product: CatalogProduct } =>
      Boolean(row.product),
    );

  /* The engine routes across the whole range, but a market only carries part of it.
     Those items used to vanish between the engine and this list with no trace — the
     protocol quietly got shorter. Counted here so it can be said out loud. */
  const notInRegion = (protocol?.items.length ?? 0) - rows.length;

  const complete = completionState === "complete";

  /* Grouped by time of day once it is final, so the protocol reads as a day rather
     than a list of products. While it is still a draft the rows stay flat — grouping
     a two-item draft into headed sections makes it look more settled than it is. */
  const slots = (["Morning", "Around training", "Evening"] as ProtocolSlot[])
    .map((slot) => ({ slot, items: rows.filter(({ item }) => item.slot === slot) }))
    .filter(({ items }) => items.length > 0);

  const heading = complete
    ? AI_SECTION.previewFinal
    : completionState === "refining"
      ? AI_SECTION.previewDraft
      : AI_SECTION.previewPotential;

  /* Withheld rather than faked where the market cannot transact. `/ca` has no
     Shopify market, so its prices are unaligned and its products are not buyable —
     offering "Add protocol to cart" there would fail at the checkout it hands to. */
  const buyable = rows.filter(
    ({ product }) =>
      product.availableForSale &&
      product.price.amount > 0 &&
      isCurrencyAlignedWithMarket(product.price.currencyCode, country),
  );

  const buyableHandles = new Set(buyable.map(({ product }) => product.handle));
  const withheld = rows.length - buyable.length;

  const onAddAll = async () => {
    setAdding(true);
    await addProducts(
      buyable.map(({ product }) => product),
      1,
    );
    setAdding(false);
    setAdded(true);
    openCart();
  };

  return (
    <div className="rounded-[24px] border border-line bg-white p-5 shadow-glass sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ember">{heading}</p>
        {completionState === "refining" && remaining > 0 && (
          <p className="text-[12.5px] tabular-nums text-ink-400">{AI_SECTION.remaining(remaining)}</p>
        )}
        {complete && (
          <p className="flex items-center gap-2 text-[12.5px] text-ink-400">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-longevity" />
            Ready
          </p>
        )}
      </div>

      {goalLabels.length === 0 ? (
        /* Also the error and unavailable state. One empty state, so a visitor never
           sees a different message depending on why nothing is shown. */
        <div className="mt-5 rounded-[18px] border border-dashed border-line px-5 py-10 text-center">
          <p className="text-[15px] font-bold tracking-[-0.02em] text-ink">{AI_SECTION.emptyHint}</p>
          <p className="mx-auto mt-2 max-w-[34ch] text-[13.5px] leading-[1.55] text-ink-600">
            Pick what you want to improve and a starting protocol appears here.
          </p>
        </div>
      ) : (
        <>
          {!complete && (
            <p className="mt-3 text-[13px] leading-[1.5] text-ink-400">{AI_SECTION.previewDraftNote}</p>
          )}

          <div className="mt-5 overflow-hidden rounded-[18px] border border-line">
            <div className="flex items-center gap-4 border-b border-line p-4">
              <Plate icon={Target} />
              <div className="min-w-0">
                <p className="text-[12.5px] text-ink-400">Goal</p>
                <p className="text-[17px] font-bold tracking-[-0.025em] text-ink">{goalLabels.join(" + ")}</p>
              </div>
            </div>

            {(complete ? slots.flatMap(({ slot, items }) => [{ slotHeading: slot }, ...items]) : rows).map((entry) => {
              if ("slotHeading" in entry) {
                return (
                  <p
                    key={`slot-${entry.slotHeading}`}
                    className="border-b border-line bg-cream-50 px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-400"
                  >
                    {entry.slotHeading}
                  </p>
                );
              }
              const { item, product } = entry;
              return (
              <div key={item.handle} className="border-b border-line p-4 last:border-b-0">
                <div className="flex items-center gap-4">
                  <Plate icon={SLOT_ICONS[item.slot]} />
                  <div className="min-w-0 flex-1">
                    {!complete && <p className="text-[12.5px] font-bold text-ember">{item.slot}</p>}
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[16px] font-bold tracking-[-0.025em] text-ink">
                      <span>{product.title}</span>
                      {/* The engine recommends the right product even when the market
                          cannot sell it yet. Saying so beats quietly dropping it. */}
                      {!buyableHandles.has(product.handle) && (
                        <span className="shrink-0 rounded-full border border-line bg-cream-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                          {AI_SECTION.comingSoon}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[13.5px] leading-[1.45] text-ink-600">{product.tagline}</p>
                  </div>
                  <img
                    src={heroImage(product)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="hidden h-16 w-16 shrink-0 rounded-[10px] object-contain sm:block"
                  />
                </div>

                {/* The rationale is only shown once the protocol has stopped moving.
                    Explaining a choice that is about to change teaches a visitor the
                    explanation is boilerplate. */}
                {complete && (
                  <div className="mt-3 rounded-[14px] bg-cream-50 p-3.5">
                    <p className="text-[13px] font-bold tracking-[-0.015em] text-ink">{AI_SECTION.whyThis}</p>
                    <p className="mt-1 text-[13px] leading-[1.5] text-ink-600">{item.reason}</p>
                    {/* One link, to a section that exists. The PDP keeps ingredients
                        inside the formulation table by design, so separate
                        "ingredients" and "science" links would scroll to nothing. */}
                    <Link
                      to={`${marketHref(`/products/${product.handle}`)}#formulation`}
                      className="group mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-ink underline-offset-4 hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                    >
                      {AI_SECTION.viewFormulation}
                      <ArrowRight
                        size={13}
                        strokeWidth={2.4}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
                      />
                    </Link>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </>
      )}

      {/* Engine notes are surfaced, not swallowed — this is where the "no sleep
          formula yet" disclosure has to appear if someone picked Sleep. */}
      {protocol?.notes.map((note) => (
        <p
          key={note}
          className="mt-4 flex items-start gap-2.5 rounded-[16px] bg-cream-50 p-4 text-[13px] leading-[1.55] text-ink-600"
        >
          <Info size={15} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-ember" />
          {note}
        </p>
      ))}

      {notInRegion > 0 && goalLabels.length > 0 && (
        <p className="mt-4 rounded-[16px] bg-cream-50 p-4 text-[13px] leading-[1.55] text-ink-600">
          {AI_SECTION.notInRegion(notInRegion)}
        </p>
      )}

      {/* What the cart could not take, stated rather than silently dropped. */}
      {complete && buyable.length > 0 && withheld > 0 && (
        <p className="mt-4 rounded-[16px] bg-cream-50 p-4 text-[13px] leading-[1.55] text-ink-600">
          {AI_SECTION.cartWithheld(withheld)}
        </p>
      )}

      {complete && buyable.length > 0 && (
        <button
          type="button"
          onClick={() => void onAddAll()}
          disabled={adding}
          className="btn-primary group mt-5 w-full disabled:opacity-70"
        >
          {added ? <Check size={16} strokeWidth={2.8} aria-hidden="true" /> : null}
          {added ? "Added to cart" : AI_SECTION.addProtocol}
          {!added && (
            <ArrowRight
              size={16}
              strokeWidth={2.4}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
            />
          )}
        </button>
      )}

      {/* Nothing here is buyable in this market, so the stack action is withheld
          rather than offered and then failing at checkout. */}
      {complete && rows.length > 0 && buyable.length === 0 && (
        <p className="mt-5 rounded-[16px] bg-cream-50 p-4 text-[13px] leading-[1.55] text-ink-600">
          These are not available to order in your region yet. Each product page has the full formulation.
        </p>
      )}

      {rows.length > 0 && !complete && (
        <div className="mt-4 flex items-start gap-3 rounded-[16px] bg-cream-50 p-4">
          <ShieldCheck size={18} strokeWidth={1.9} aria-hidden="true" className="mt-0.5 shrink-0 text-ember" />
          <div>
            <p className="text-[14.5px] font-bold tracking-[-0.02em] text-ink">Based on what we know so far</p>
            <p className="mt-1 text-[13.5px] leading-[1.5] text-ink-600">
              A few more details will refine this. Nothing is final yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
