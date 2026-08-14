import { useState } from "react";
import { Check, Dumbbell, Info, Moon, Plus, Sunrise } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { formatCatalogMoney, isCurrencyAlignedWithMarket } from "../../lib/market/config";
import { ROUTES } from "../../lib/routes";
import { PROTOCOL_EXAMPLE, PROTOCOL_SECTION, type ProtocolSlotIcon } from "../../data/homepage";
import type { CatalogProduct } from "../../lib/shopify/types";
import { Eyebrow, PrimaryCta, Section, SectionHeading } from "./primitives";

/*
 * What the builder produces, made concrete.
 *
 * Laid out as a day running down the page rather than three cards, so it reads as a
 * routine instead of another product grid — the fourth grid in a row would be the
 * rhythm this restructure exists to break.
 *
 * "Add this protocol to cart" is real: it batches every handle into a single cart
 * mutation via addProducts(). It only renders when every product in the protocol is
 * actually purchasable in this market, because a button that silently drops two of
 * four items is worse than no button.
 */
/* Time of day, as a glyph. The slots are the only structure in this list, so they
   carry the marker; the product rows stay unadorned and the eye can find the three
   moments of the day without reading them. */
const SLOT_ICONS: Record<ProtocolSlotIcon, typeof Sunrise> = {
  morning: Sunrise,
  training: Dumbbell,
  evening: Moon,
};

export default function ProtocolExample({ byHandle }: { byHandle: Map<string, CatalogProduct> }) {
  const marketHref = useMarketHref();
  const { country } = useMarket();
  const { addProducts } = useCart();
  const [added, setAdded] = useState(false);

  const slots = PROTOCOL_EXAMPLE.map((slot) => ({
    ...slot,
    products: slot.handles.map((handle) => byHandle.get(handle)).filter((p): p is CatalogProduct => Boolean(p)),
  })).filter((slot) => slot.products.length > 0);

  const all = slots.flatMap((slot) => slot.products);
  if (all.length === 0) return null;

  // A price we cannot display honestly is a price we do not sell against, so the
  // currency check gates the button as well as the number (see formatCatalogMoney).
  const purchasable = all.filter(
    (product) =>
      product.availableForSale &&
      product.price.amount > 0 &&
      isCurrencyAlignedWithMarket(product.price.currencyCode, country),
  );
  const canAddAll = purchasable.length === all.length;
  const total = all.reduce((sum, product) => sum + product.price.amount, 0);
  // Summing across currencies would invent a number, so the total is only
  // denominated when every line agrees.
  const currencies = new Set(all.map((product) => product.price.currencyCode));
  const totalCurrency = currencies.size === 1 ? [...currencies][0] : "MIXED";

  const onAddAll = async () => {
    await addProducts(all, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  return (
    <Section id="protocols" className="scroll-mt-[112px] pb-20 sm:pb-24 lg:pb-28">
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="lg:sticky lg:top-[112px] lg:self-start">
          <Eyebrow>{PROTOCOL_SECTION.eyebrow}</Eyebrow>
          <SectionHeading className="mt-4 max-w-[10ch] lg:!text-[62px]">
            {PROTOCOL_SECTION.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </SectionHeading>
          <p className="mt-6 max-w-[44ch] text-pretty text-[16.5px] leading-[1.6] text-ink-600">
            {PROTOCOL_SECTION.body}
          </p>

          <p className="mt-6 flex max-w-[44ch] items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-400">
            <Info size={15} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            {PROTOCOL_SECTION.illustrativeNote}
          </p>

          <div className="mt-8">
            <PrimaryCta to={marketHref(ROUTES.quiz)}>{PROTOCOL_SECTION.cta}</PrimaryCta>
          </div>
        </div>

        {/* -------------------------------------------------- the day */}
        <ol>
          {slots.map((slot) => (
            <li key={slot.slot} className="border-t border-line py-7 first:border-t-0 first:pt-0">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-line bg-cream-50 text-ember"
                >
                  {(() => {
                    const Icon = SLOT_ICONS[slot.icon];
                    return <Icon size={15} strokeWidth={2} aria-hidden="true" />;
                  })()}
                </span>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-[19px] font-bold tracking-[-0.025em] text-ink">{slot.slot}</h3>
                  <span className="text-[13.5px] text-ink-400">{slot.note}</span>
                </div>
              </div>

              <ul className="mt-4 space-y-4">
                {slot.products.map((product) => (
                  <li key={product.handle} className="flex items-start gap-4">
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
                        <a
                          href={marketHref(`/products/${product.handle}`)}
                          className="text-[16px] font-bold tracking-[-0.02em] text-ink underline-offset-[5px] hover:text-ember hover:underline"
                        >
                          {product.title}
                        </a>
                        <span className="text-[14.5px] font-bold tabular-nums text-ink">
                          {formatCatalogMoney(product.price, country)}
                        </span>
                      </div>
                      {/* The product's own label wording, not a paraphrase of it. */}
                      <p className="mt-1 max-w-[52ch] text-[13.5px] leading-[1.55] text-ink-600">{product.dosage}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          <li className="border-t border-line-strong pt-7">
            {canAddAll ? (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-[15px] font-bold text-ink">{all.length} formulas</span>
                  <span className="text-[17px] font-bold tabular-nums tracking-[-0.02em] text-ink">
                    {formatCatalogMoney({ amount: total, currencyCode: totalCurrency }, country)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void onAddAll()}
                  className="btn-primary mt-5 w-full justify-center"
                >
                  {added ? (
                    <>
                      Added to cart
                      <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      {PROTOCOL_SECTION.addAllCta}
                      <Plus size={16} strokeWidth={2.6} aria-hidden="true" />
                    </>
                  )}
                </button>
              </>
            ) : (
              <p className="text-[14px] leading-[1.55] text-ink-400">
                Not every formula in this example is available in your region yet, so it
                cannot be added as a set. Each one that is available can be added on its own.
              </p>
            )}
          </li>
        </ol>
      </div>
    </Section>
  );
}
