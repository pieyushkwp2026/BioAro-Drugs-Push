import { useId, useState, type ComponentType, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/*
 * One opt-in row of the homepage science card.
 *
 * A third disclosure pattern, deliberately, rather than a forced reuse:
 *  - `components/product/Disclosure.tsx` truncates long content behind a fade with
 *    the trigger underneath. That suits a PDP table someone is already reading. This
 *    needs the opposite — a labelled header that opens a closed region.
 *  - `components/page/AccordionGroup.tsx` is single-open and takes plain strings;
 *    these two rows must open independently and hold real markup.
 *
 * The region is never `aria-hidden` when closed. A collapsed row should still be
 * reachable by in-page find, and hiding the formulation from assistive tech to save
 * a homepage some height would be the wrong trade on exactly this content.
 */
export default function ScienceDisclosureRow({
  icon: Icon,
  title,
  summary,
  children,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div className="border-t border-line first:border-t-0">
      <h4>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={regionId}
          className="group flex w-full items-center gap-3.5 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
        >
          {/* The icon is the differentiator between rows, so it carries the accent
              and a tinted plate rather than sitting as a grey glyph. */}
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-line bg-cream-50 text-ember transition-colors duration-200 group-hover:border-line-strong"
          >
            <Icon size={18} strokeWidth={1.9} aria-hidden />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-[15.5px] font-bold tracking-[-0.02em] text-ink">{title}</span>
            <span className="mt-0.5 block text-[13.5px] leading-[1.45] text-ink-400">{summary}</span>
          </span>

          <ChevronDown
            size={17}
            strokeWidth={2.3}
            aria-hidden="true"
            className={`shrink-0 text-ink-400 transition-transform duration-300 motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h4>

      <div
        id={regionId}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        {/* The 0fr→1fr grid row is what lets this animate to content height without
            hardcoding a max-height that would clip a longer formulation. */}
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
