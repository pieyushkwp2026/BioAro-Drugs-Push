import { type ReactNode, type RefObject, useEffect, useRef } from "react";

/*
 * Modal, on the native <dialog> element.
 *
 * ---------------------------------------------------------------------------
 * WHY THE PLATFORM ELEMENT RATHER THAN A DIV
 *
 * `showModal()` supplies three things that are genuinely hard to get right by hand,
 * and that every hand-rolled overlay in this codebase is currently missing at least
 * one of:
 *
 *   1. A real focus trap. Tab cannot escape to the page behind. Hand-written traps
 *      are where modals go wrong — they miss shadow roots, iframes, or the browser
 *      chrome — and there is no reason to write one.
 *   2. Escape, and background inertness. Everything outside the dialog stops being
 *      reachable by keyboard, screen reader, or pointer.
 *   3. The TOP LAYER, which removes the z-index question entirely. A modal dialog
 *      paints above every stacking context no matter what z-index anything else
 *      claims. This codebase has been bitten by exactly that class of bug twice —
 *      the chat sheet rendering beneath the z-50 header, and CTAs painting over the
 *      AI answer panel because an animated transform created a stacking context. The
 *      floating chat launcher also ends up correctly behind the backdrop with no
 *      coordination code between the two components.
 *
 * Support is Chrome 37+, Firefox 98+, Safari 15.4+ — a deliberate baseline, not an
 * oversight.
 *
 * WHAT IS ADDED ON TOP: body scroll lock, backdrop-click-to-close, and syncing the
 * platform's own close back into React state. The UA stylesheet reset and the
 * ::backdrop styling live in index.css as `.bio-dialog` — neither is expressible as
 * a Tailwind utility.
 *
 * NOT ADDED: focus restoration. The HTML spec has the dialog remember the previously
 * focused element and return focus to it on close, and re-implementing that here
 * would fight the browser rather than help it.
 * ---------------------------------------------------------------------------
 */

export default function Modal({
  open,
  onClose,
  label,
  labelledBy,
  children,
  panelClassName = "",
  initialFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name. Use `labelledBy` instead when a visible heading already says it. */
  label?: string;
  labelledBy?: string;
  children: ReactNode;
  panelClassName?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Drive the platform from the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /*
   * Escape is handled by the browser, which closes the dialog WITHOUT telling React.
   * Listening for the resulting `close` event is what keeps the `open` prop from
   * desyncing from the DOM — otherwise the next open would be a no-op because React
   * still believed it was open.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onDialogClose = () => onClose();
    dialog.addEventListener("close", onDialogClose);
    return () => dialog.removeEventListener("close", onDialogClose);
  }, [onClose]);

  /*
   * Scroll lock. The compensating padding matters on platforms with classic
   * scrollbars: removing the scrollbar without it widens the viewport and the whole
   * page behind the modal jumps sideways as it opens.
   */
  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  // Put the caret somewhere useful rather than leaving it on the panel.
  useEffect(() => {
    if (!open) return;
    const target = initialFocusRef?.current;
    if (!target) return;
    // After the dialog has been promoted to the top layer and taken focus itself.
    const frame = requestAnimationFrame(() => target.focus());
    return () => cancelAnimationFrame(frame);
  }, [open, initialFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      aria-labelledby={labelledBy}
      className="bio-dialog flex items-end justify-center sm:items-center sm:p-6"
      /* The dialog element IS the full-viewport hit area and the panel is its child,
         so a click landing on the dialog itself came from the backdrop. Comparing
         against the ref rather than using a wrapper avoids the usual bug where a drag
         that starts inside the panel and releases outside counts as a backdrop click. */
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className={`bio-dialog-panel flex min-h-0 flex-col bg-white ${panelClassName}`}>{children}</div>
    </dialog>
  );
}
