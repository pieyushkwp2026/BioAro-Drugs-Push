import { useState } from "react";
import type { ProductIngredient } from "../../lib/shopify/types";

export default function IngredientCard({ ingredient }: { ingredient: ProductIngredient }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center gap-4 rounded-3xl border border-ink/8 bg-white/60 px-4 py-6 text-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <div className="h-36 w-36 overflow-hidden rounded-3xl bg-[#f1eee6] shadow-[0_14px_28px_-20px_rgba(27,26,23,0.3)] sm:h-40 sm:w-40 lg:h-44 lg:w-44">
        {ingredient.image ? (
          <img src={ingredient.image} alt={ingredient.name} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <p className="text-sm leading-snug text-ink">{ingredient.name}</p>
      <p className="text-[13px] font-medium text-forest-600">{ingredient.amount}</p>

      {open && (
        <div className="absolute inset-x-0 bottom-full z-20 mb-4 rounded-2xl border border-ink/10 bg-white p-4 text-left shadow-glass-lg">
          <p className="text-sm font-medium text-ink">{ingredient.name}</p>
          <p className="mt-0.5 text-xs font-medium text-forest-600">{ingredient.amount}</p>
          <p className="mt-2 text-xs leading-relaxed text-ink/60">{ingredient.purpose}</p>
          {ingredient.whyIncluded && <p className="mt-1.5 text-[11px] leading-relaxed text-ink/40">{ingredient.whyIncluded}</p>}
        </div>
      )}
    </div>
  );
}
