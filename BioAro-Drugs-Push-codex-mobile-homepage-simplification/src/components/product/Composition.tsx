import { PDP } from "../../data/productPage";
import { compositionBars } from "../../lib/product/amount";
import type { ProductIngredient } from "../../lib/shopify/types";

/*
 * The formula, drawn to scale.
 *
 * ---------------------------------------------------------------------------
 * THE HONESTY PROBLEM THIS SOLVES RATHER THAN CREATES
 *
 * A supplement label mixes units: 500 mg of NMN beside 25 µg of vitamin D3. Drawn
 * linearly, D3 is 0.005% of the width — a sliver that reads as "barely in it", which
 * is false. Micronutrients work at far smaller masses; small dose does not mean small
 * role.
 *
 * Two things keep this straight. `compositionBars` compresses the scale so a
 * micro-dosed active stays visible, and the caption says outright that the bars show
 * MASS and that mass is not potency. An uncaptioned chart would quietly assert a
 * hierarchy the formula does not have — worse than the plain table it sits beside.
 *
 * The printed amount is always the label's own string, never re-formatted from the
 * parsed number, so the text stays true even if the parser is wrong about the bar.
 * ---------------------------------------------------------------------------
 */

export default function Composition({ ingredients }: { ingredients: ProductIngredient[] }) {
  const bars = compositionBars(ingredients);

  // Nothing parseable — a proprietary blend, say. No chart rather than an empty one.
  if (bars.length < 2) return null;

  return (
    <section className="border-t border-line-strong pt-12">
      <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">{PDP.composition.heading}</h2>

      <ul className="mt-8 space-y-4">
        {bars.map((bar) => (
          <li key={bar.name}>
            <p className="flex items-baseline justify-between gap-4 text-[14.5px]">
              <span className="font-bold tracking-[-0.015em] text-ink">{bar.name}</span>
              <span className="shrink-0 tabular-nums text-ink-400">{bar.amount}</span>
            </p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-200">
              <div
                className="h-full rounded-full bg-ember/80"
                style={{ width: `${Math.max(bar.share * 100, 3)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Load-bearing. Without it the chart implies a dose hierarchy. */}
      <p className="mt-6 max-w-[62ch] text-[13px] leading-[1.6] text-ink-400">{PDP.composition.caption}</p>
    </section>
  );
}
