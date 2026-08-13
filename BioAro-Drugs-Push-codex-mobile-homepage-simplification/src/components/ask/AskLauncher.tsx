import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircleQuestion, X } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import AskPanel from "./AskPanel";

/*
 * Site-wide launcher for Ask BioAro.
 *
 * z-index: CartDrawer uses z-40 for its scrim and z-50 for the panel, and the header
 * is z-50. This sits at z-30 and hides itself entirely while the cart is open, so it
 * can never overlap the cart or compete with the header.
 */
export default function AskLauncher() {
  const [open, setOpen] = useState(false);
  const { isOpen: cartOpen } = useCart();
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Yield the corner to the cart rather than stacking two floating surfaces.
  if (cartOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-end px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto flex w-full max-w-[440px] flex-col items-end gap-3">
        {open && (
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label="Ask BioAro"
            className="max-h-[min(70vh,560px)] w-full overflow-y-auto overscroll-contain rounded-[28px] border border-line bg-cream p-5 shadow-glass-lg sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[19px] font-bold tracking-[-0.025em] text-ink">Ask BioAro</h2>
                <p className="mt-1 text-[14px] leading-[1.5] text-ink-600">
                  Questions about ingredients, routines or how any of this works.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                aria-label="Close"
                className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>
            <AskPanel compact />
          </div>
        )}

        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white pl-4 pr-5 text-[14px] font-bold tracking-[-0.01em] text-ink shadow-glass transition-[background-color,transform] duration-200 hover:bg-cream active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember motion-reduce:active:scale-100"
        >
          <MessageCircleQuestion size={18} strokeWidth={1.7} className="text-ember" />
          <span>{open ? "Close" : "Ask BioAro"}</span>
        </button>
      </div>
    </div>
  );
}
