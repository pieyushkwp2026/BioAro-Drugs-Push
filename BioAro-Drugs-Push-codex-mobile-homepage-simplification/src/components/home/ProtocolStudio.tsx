import { useEffect, useId, useRef } from "react";
import { ArrowRight, Clock3, Sparkles, X } from "lucide-react";
import { AI_SECTION } from "../../data/homepage";
import type { ProtocolDraft } from "../../hooks/useProtocolDraft";
import type { CatalogProduct } from "../../lib/shopify/types";
import Modal from "../ui/Modal";
import ProtocolPreview from "./ProtocolPreview";
import { GoalChips, IntentBox } from "./protocolControls";

/*
 * The protocol studio — the intent step, in a modal.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS NOT ON THE PAGE
 *
 * Inline, the preview pane had to be sized for a protocol that does not exist until
 * you engage, so half the section sat empty on every first view. Here it costs
 * nothing until it is asked for, and when it is asked for it gets the whole frame.
 *
 * The disclosure moved here from the homepage, where a fuller version belongs next
 * to the thing it qualifies. The four-step spine did NOT come with it: it already
 * renders on the builder page, and a second copy inside a panel one click away from
 * that page is the duplication this site keeps removing.
 *
 * It owns no state. The draft is passed in, so closing this never discards anything.
 * ---------------------------------------------------------------------------
 */

export default function ProtocolStudio({
  open,
  draft,
  byHandle,
  onClose,
  onContinue,
  autoFocusInput = false,
}: {
  open: boolean;
  draft: ProtocolDraft;
  byHandle: Map<string, CatalogProduct>;
  onClose: () => void;
  onContinue: () => void;
  /** True when the text box opened this, so the caret continues where it was. */
  autoFocusInput?: boolean;
}) {
  const headingId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  /*
   * Below `lg` the two panes stack, and the preview lands under a screenful of
   * controls — so someone who typed a sentence and pressed send arrives at the box
   * they just used, with the protocol they asked for out of sight. Bringing it into
   * view is the whole payoff of the interaction.
   *
   * Deliberately NOT done by reordering with CSS `order`, which would leave the DOM
   * and the visual order disagreeing for anyone reading by keyboard or screen reader.
   */
  const stacked = typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches;

  useEffect(() => {
    if (!open || !stacked || draft.goals.length === 0) return;
    const frame = requestAnimationFrame(() =>
      previewRef.current?.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    return () => cancelAnimationFrame(frame);
    // Only on open: re-running as goals change would yank the page while someone is
    // still tapping chips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stacked]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={headingId}
      /* Never on a stacked viewport: autofocusing the box raises the on-screen
         keyboard over the preview, on behalf of someone who has finished typing. */
      initialFocusRef={autoFocusInput && !stacked ? textareaRef : undefined}
      /* Full-bleed sheet on phones, a framed panel from sm up. `min-h-0` on the
         column plus `overflow-y-auto` on the body is what keeps the header and the
         footer fixed while only the middle scrolls. */
      panelClassName="h-full w-full sm:h-[min(760px,calc(100dvh-48px))] sm:w-[min(1080px,calc(100vw-48px))] sm:rounded-[28px] sm:shadow-glass-lg"
    >
      {/* ------------------------------------------------------------- header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-4 sm:px-7">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(193,70,42,0.09)] text-ember"
        >
          <Sparkles size={17} strokeWidth={2.2} />
        </span>
        <p className="eyebrow min-w-0 flex-1 truncate">{AI_SECTION.eyebrow}</p>
        {/* The way out, at every size, without scrolling. 44px target. */}
        <button
          type="button"
          onClick={onClose}
          aria-label={AI_SECTION.close}
          className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-cream-50 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
        >
          <X size={20} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </header>

      {/* --------------------------------------------------------------- body */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:overflow-hidden">
        {/* ------------------------------------------------------- controls */}
        <div className="px-5 py-6 sm:px-7 sm:py-8 lg:overflow-y-auto">
          <h2
            id={headingId}
            className="text-balance text-[26px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[32px]"
          >
            {AI_SECTION.studioHeadline}
          </h2>

          <div className="mt-6">
            <IntentBox draft={draft} onSend={() => void draft.send()} textareaRef={textareaRef} rows={3} />
          </div>

          <GoalChips draft={draft} className="mt-5" />

          {draft.error && (
            <p role="alert" className="mt-4 text-[13px] text-ember-700">
              {draft.error}
            </p>
          )}


          <p className="mt-8 max-w-[58ch] border-t border-line pt-6 text-[12.5px] leading-[1.6] text-ink-400">
            {AI_SECTION.disclosure}
          </p>
        </div>

        {/* -------------------------------------------------------- preview
            Tinted, so the output side reads as a different kind of thing from the
            controls rather than as more of the same column. */}
        <div
          ref={previewRef}
          className="border-t border-line bg-cream-50 px-5 py-6 sm:px-7 sm:py-8 lg:border-l lg:border-t-0 lg:overflow-y-auto"
        >
          <ProtocolPreview goals={draft.goals} protocol={draft.protocol} byHandle={byHandle} />
        </div>
      </div>

      {/* ------------------------------------------------------------- footer */}
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line px-5 py-4 sm:px-7">
        <p className="flex items-center gap-2 text-[13px] text-ink-400">
          <Clock3 size={14} strokeWidth={2} aria-hidden="true" />
          {AI_SECTION.duration}
        </p>
        <button
          type="button"
          onClick={onContinue}
          disabled={draft.submitting}
          className="btn-primary group ml-auto disabled:opacity-70"
        >
          {draft.goals.length > 0 ? AI_SECTION.continueCta : AI_SECTION.cta}
          <ArrowRight
            size={16}
            strokeWidth={2.4}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
          />
        </button>
      </footer>
    </Modal>
  );
}
