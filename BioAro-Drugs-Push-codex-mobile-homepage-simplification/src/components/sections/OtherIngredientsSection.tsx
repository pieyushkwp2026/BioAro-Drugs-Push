type OtherIngredientsSectionProps = {
  items: string[];
};

export default function OtherIngredientsSection({ items }: OtherIngredientsSectionProps) {
  if (!items.length) return null;

  return (
    <section className="mt-16">
      <span className="eyebrow">Other ingredients</span>
      <div className="glass-card mt-4 p-6 md:p-8">
        <p className="text-sm leading-relaxed text-ink/55">
          Inactive ingredients and excipients listed for transparency.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((ingredient) => (
            <li
              key={ingredient}
              className="rounded-2xl border border-ink/10 bg-white/55 px-4 py-3 text-sm leading-relaxed text-ink/70"
            >
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
