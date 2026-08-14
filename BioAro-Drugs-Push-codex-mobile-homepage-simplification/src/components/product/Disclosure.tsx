import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/*
 * Progressive disclosure for long content.
 *
 * Collapsed height is a max-height clip with a fade, not a truncated list, so the
 * content underneath stays in the DOM and remains searchable, selectable and
 * indexable. `aria-expanded`/`aria-controls` carry the state; the clipped region is
 * never `aria-hidden`, because a screen-reader user gains nothing from the visual
 * truncation and would otherwise lose the ingredient list entirely.
 */
export default function Disclosure({
  children,
  collapsedHeight = 320,
  showLabel,
  hideLabel,
}: {
  children: ReactNode;
  collapsedHeight?: number;
  showLabel: string;
  hideLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div>
      <div
        id={regionId}
        className="relative overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ maxHeight: open ? 4000 : collapsedHeight }}
      >
        {children}
        {!open && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(247,244,239,0)_0%,#F7F4EF_88%)]"
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={regionId}
        className="group mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-[13.5px] font-bold tracking-[-0.01em] text-ink transition-[background-color,border-color] duration-200 hover:border-line-strong hover:bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      >
        {open ? hideLabel : showLabel}
        <ChevronDown
          size={15}
          strokeWidth={2.4}
          aria-hidden="true"
          className={`transition-transform duration-300 motion-reduce:transform-none ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
