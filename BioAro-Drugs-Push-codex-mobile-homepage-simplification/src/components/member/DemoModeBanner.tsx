/*
 * The standing notice that nothing on screen is real.
 *
 * Rendered off `source === "demo"` rather than off the environment flag, because the
 * data is what is or is not fabricated — if a real endpoint ever answers, this
 * disappears on its own with no second switch to remember.
 *
 * In flow rather than fixed, and not dismissible: it has to survive a screenshot and
 * a scroll, and a banner someone can close is a banner that will be closed before the
 * screenshot is taken.
 */
export default function DemoModeBanner() {
  return (
    <div role="note" className="border-b border-ember/25 bg-ember/10">
      <div className="container-bio py-3">
        <p className="text-pretty text-[14px] font-medium leading-[1.5] text-ink">
          <span className="font-bold uppercase tracking-[0.12em] text-ember-600">Demonstration</span>{" "}
          — this dashboard is showing sample data. Nothing here is a real order, record,
          prescription or consultation.
        </p>
      </div>
    </div>
  );
}
