import { PDP } from "../../data/productPage";
import type { CatalogProduct, ProductIngredient } from "../../lib/shopify/types";
import Disclosure from "./Disclosure";

/*
 * The formulation table — the centrepiece of the page.
 *
 * It renders EVERY active with its amount. The page it replaces passed ingredients
 * through a `.slice(0, 5)`, which meant LONgevity+ printed five of its six actives
 * here while the homepage printed all six: Vitamin D3 existed on the marketing page
 * and not on the product page. A brand whose argument is dose transparency cannot
 * truncate the doses.
 *
 * Each ingredient's `purpose` sits under its name rather than behind a modal. The old
 * card grid hid purpose and rationale inside a dialog nobody opens, which is the same
 * as not publishing it.
 */

function ServingHeader({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-[13.5px]">
      <span className="text-ink-600">{label}</span>
      <span className="font-bold tabular-nums text-ink">{value}</span>
    </div>
  );
}

function IngredientRows({ ingredients }: { ingredients: ProductIngredient[] }) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Active ingredients and the amount of each per serving</caption>
      <thead>
        <tr className="border-b border-line-strong">
          <th scope="col" className="pb-2 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-400">
            {PDP.formulation.tableIngredient}
          </th>
          <th scope="col" className="pb-2 text-right text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-400">
            {PDP.formulation.tableAmount}
          </th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ingredient) => (
          <tr key={ingredient.name} className="border-b border-line last:border-b-0">
            <th scope="row" className="py-4 pr-6 align-top font-normal">
              <span className="block text-[15.5px] font-bold tracking-[-0.015em] text-ink">{ingredient.name}</span>
              {ingredient.purpose && (
                <span className="mt-1 block max-w-[52ch] text-[13.5px] leading-[1.5] text-ink-600">
                  {ingredient.purpose}
                </span>
              )}
            </th>
            {/* tabular-nums so the dose column aligns rather than drifting per row. */}
            <td className="whitespace-nowrap py-4 text-right align-top text-[15px] font-bold tabular-nums tracking-[-0.01em] text-ink">
              {ingredient.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function FormulationTable({ product }: { product: CatalogProduct }) {
  const ingredients = product.ingredients ?? [];
  if (ingredients.length === 0) return null;

  const servingSize = product.metafields?.servingSize ?? product.servings;
  const servingsPerContainer = product.metafields?.servingsPerContainer;
  const keyIngredients = ingredients.slice(0, 3).map((item) => item.name);

  // Long formulations get a disclosure; short ones do not need one, and wrapping a
  // six-row table in "show more" would be theatre.
  const needsDisclosure = ingredients.length > 8;

  const body = (
    <>
      <div className="mt-6">
        {servingSize && <ServingHeader label={PDP.formulation.servingSize} value={servingSize} />}
        {servingsPerContainer && (
          <ServingHeader label={PDP.formulation.servingsPerContainer} value={servingsPerContainer} />
        )}
      </div>

      <div className="mt-6">
        <IngredientRows ingredients={ingredients} />
      </div>

      {product.otherIngredients && product.otherIngredients.length > 0 && (
        <p className="mt-6 max-w-[70ch] text-[13.5px] leading-[1.6] text-ink-400">
          <span className="font-bold text-ink-600">{PDP.formulation.otherIngredients}: </span>
          {product.otherIngredients.join(", ")}.
        </p>
      )}
    </>
  );

  return (
    <section id="formulation" className="scroll-mt-[132px] border-t border-line-strong pt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">
          {product.metafields?.ingredientsHeadline ?? PDP.formulation.heading}
        </h2>
        {keyIngredients.length > 0 && (
          <p className="text-[13.5px] text-ink-400">
            <span className="font-bold text-ink-600">{PDP.formulation.keyIngredients}: </span>
            {keyIngredients.join(", ")}
          </p>
        )}
      </div>

      {needsDisclosure ? (
        <Disclosure
          collapsedHeight={520}
          showLabel={PDP.formulation.showAll}
          hideLabel={PDP.formulation.showLess}
        >
          {body}
        </Disclosure>
      ) : (
        body
      )}
    </section>
  );
}
