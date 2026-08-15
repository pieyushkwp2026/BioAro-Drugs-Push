import { PDP } from "../../data/productPage";
import type { ProductIngredient } from "../../lib/shopify/types";

/*
 * The ingredients, as photographs.
 *
 * ---------------------------------------------------------------------------
 * The rationale text shipped a commit ago and the imagery has been in the repo the
 * whole time — 44 files in assets/ingredients, 43 wired into products.ts, and the
 * Shopify `ingredient` metaobjects carry an image too. The product page rendered
 * neither, which is why it read as a table rather than a product.
 *
 * NO PLACEHOLDER FRAMES. An ingredient with no photograph renders as a text card
 * rather than an empty grey box — a missing image should look like a card without a
 * picture, not like a picture that failed.
 * ---------------------------------------------------------------------------
 */

export default function IngredientCards({ ingredients }: { ingredients: ProductIngredient[] }) {
  const shown = ingredients.filter((ingredient) => ingredient.whyIncluded || ingredient.purpose);
  if (shown.length === 0) return null;

  return (
    <section id="why" className="scroll-mt-[132px] border-t border-line-strong pt-12">
      <h2 className="text-[26px] font-black tracking-[-0.03em] text-ink sm:text-[32px]">{PDP.why.heading}</h2>
      <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.6] text-ink-600">{PDP.why.body}</p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {shown.map((ingredient) => (
          <li
            key={ingredient.name}
            className="group overflow-hidden rounded-[20px] border border-line bg-white transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-glass"
          >
            {ingredient.image && (
              <div className="aspect-[16/10] overflow-hidden bg-cream-100">
                <img
                  src={ingredient.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
                />
              </div>
            )}

            <div className="p-5">
              <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-[17px] font-bold tracking-[-0.025em] text-ink">{ingredient.name}</span>
                <span className="text-[13.5px] font-bold tabular-nums text-ember">{ingredient.amount}</span>
              </p>
              <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-600">
                {ingredient.whyIncluded || ingredient.purpose}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
