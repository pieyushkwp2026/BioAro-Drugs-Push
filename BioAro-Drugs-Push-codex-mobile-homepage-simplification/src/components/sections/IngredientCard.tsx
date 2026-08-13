import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ProductIngredient } from "../../lib/shopify/types";

export default function IngredientCard({ ingredient }: { ingredient: ProductIngredient }) {
  const [open, setOpen] = useState(false);
  const placeholderLabel = ingredient.name
    .split(/\s+/)
    .slice(0, 2)
    .join(" ");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Learn more about ${ingredient.name}`}
        className="group flex w-full flex-col items-center gap-4 rounded-3xl border border-ink/8 bg-white/60 px-4 py-6 text-center transition-colors hover:border-forest-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:ring-offset-2"
      >
        <div className="h-36 w-36 overflow-hidden rounded-3xl bg-[#F0EBE3] shadow-[0_14px_28px_-20px_rgba(27,26,23,0.3)] sm:h-40 sm:w-40 lg:h-44 lg:w-44">
          {ingredient.image ? (
            <img src={ingredient.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full w-full items-end justify-start bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.92),_rgba(241,238,230,0.88)_62%,_rgba(231,225,213,0.94))] p-4 text-left">
              <span className="max-w-[7rem] text-[12px] font-medium leading-tight text-[#545961]">
                {placeholderLabel}
              </span>
            </div>
          )}
        </div>
        <span className="text-sm leading-snug text-ink">{ingredient.name}</span>
        <span className="text-[13px] font-medium text-forest-600">{ingredient.amount}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="presentation">
          <button type="button" className="absolute inset-0 bg-ink/45 backdrop-blur-sm" aria-label="Close ingredient details" onClick={() => setOpen(false)} />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`ingredient-${ingredient.name}`}
            className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-[#FBF9F6] p-6 shadow-glass-lg sm:p-8"
          >
            <button
              type="button"
              aria-label="Close ingredient details"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600"
            >
              <X size={18} aria-hidden="true" />
            </button>
            {ingredient.image && (
              <div className="mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-[#F0EBE3]">
                <img src={ingredient.image} alt={ingredient.name} className="h-full w-full object-cover" />
              </div>
            )}
            <span className="eyebrow">Ingredient detail</span>
            <h3 id={`ingredient-${ingredient.name}`} className="mt-2 font-display text-3xl leading-tight text-ink">{ingredient.name}</h3>
            {ingredient.amount && <p className="mt-2 text-sm font-medium text-forest-600">{ingredient.amount}</p>}
            {ingredient.purpose && <p className="mt-5 text-sm leading-relaxed text-ink/70">{ingredient.purpose}</p>}
            {ingredient.whyIncluded && <p className="mt-3 text-sm leading-relaxed text-ink/55">{ingredient.whyIncluded}</p>}
          </section>
        </div>
      )}
    </>
  );
}
