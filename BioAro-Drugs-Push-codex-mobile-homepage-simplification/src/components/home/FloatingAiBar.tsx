import { useEffect, useRef } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { useProtocolSession } from "../../hooks/useProtocolSession";
import { IntentBox } from "./protocolControls";

/*
 * The floating BioAro Drugs AI bar.
 *
 * ---------------------------------------------------------------------------
 * It appears once the hero's own bar scrolls out of reach, then GETS OUT OF THE
 * WAY: it collapses itself to the orb after a pause, because a fixed bar at
 * top-84px sits on top of every section headline underneath it — it was covering
 * "One sachet." on the way down the page.
 *
 * It does not collapse while it holds focus or while there is something typed in
 * it. A control that disappears mid-sentence is worse than one that overlaps.
 *
 * The orb keeps a slow pulse so it still reads as live rather than parked, and
 * that pulse is off under prefers-reduced-motion — a permanently blinking element
 * is precisely what that setting exists for.
 *
 * It owns no modal. `openStudio` comes from the session context, so the hero, the
 * hero orb and this share one dialog. Previously this component was mounted twice
 * and put two <dialog> elements on the page.
 * ---------------------------------------------------------------------------
 */

/** Long enough to notice it arrive and use it; short enough not to sit on a heading. */
const AUTO_COLLAPSE_MS = 3800;
const TICK_MS = 400;

type FloatingAiBarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

export default function FloatingAiBar({ collapsed, onCollapsedChange }: FloatingAiBarProps) {
  const session = useProtocolSession();
  const wrapRef = useRef<HTMLDivElement>(null);

  const sendAndOpen = () => {
    void session.send().then(() => session.openStudio({ focusInput: true }));
  };

  /*
   * Collapse itself once it has been seen. Held open while focused or while the
   * box has content, and the timer restarts on either — so it never vanishes out
   * from under someone mid-thought.
   */
  useEffect(() => {
    if (collapsed) return;

    /* Focus is the signal, NOT session.message — that string is shared with the
       hero's box, so keying off it meant typing anywhere on the page pinned this
       bar open forever. Focus inside the bar covers the case it was meant to:
       someone mid-sentence here.

       Polled rather than a single timeout: a one-shot timer that fires while the
       bar is held simply never fires again, so blurring it left the bar open for
       good. This accumulates idle time instead, and resets whenever it is used. */
    let idle = 0;

    const held = () =>
      Boolean(wrapRef.current?.contains(document.activeElement)) || session.studioOpen;

    const tick = window.setInterval(() => {
      if (held()) {
        idle = 0;
        return;
      }
      idle += TICK_MS;
      if (idle >= AUTO_COLLAPSE_MS) onCollapsedChange(true);
    }, TICK_MS);

    return () => window.clearInterval(tick);
  }, [collapsed, onCollapsedChange, session.studioOpen]);







    return (
      <>
        {!collapsed ? (
          <div ref={wrapRef} className="fixed left-1/2 top-[84px] z-[100] w-[min(820px,calc(100vw-32px))] -translate-x-1/2">
            <div className="relative">
              {/* AI floating search */}
              <div
                className="
                relative overflow-hidden
                rounded-[24px]
                border border-ember/20
                bg-white/95
                p-1.5
                shadow-[0_18px_55px_rgba(193,70,42,0.18)]
                backdrop-blur-xl
              "
              >
                {/* subtle glow */}
                <div
                  aria-hidden="true"
                  className="
                  pointer-events-none absolute inset-0
                  bg-[radial-gradient(circle_at_50%_0%,rgba(193,70,42,0.12),transparent_55%)]
                "
                />

                <div className="relative">
                  <IntentBox session={session} onSend={sendAndOpen} />
                </div>
              </div>

              {/* Collapse */}
              <button
                type="button"
                onClick={() => onCollapsedChange?.(true)}
                aria-label="Collapse BioAro Drugs AI"
                title="Collapse AI"
                className="
                absolute
                -right-2
                -top-3
                z-20
                flex h-7 w-7
                items-center justify-center
                rounded-full
                border border-line
                bg-white
                text-ink-400
                shadow-[0_4px_14px_rgba(0,0,0,0.14)]
                transition-all
                duration-200
                hover:scale-105
                hover:text-ink
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-ember
              "
              >
                <ChevronDown size={14} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          /* ----------------------------------------------------------
           COLLAPSED AI ORB
        ---------------------------------------------------------- */
          <button
            type="button"
            onClick={() => onCollapsedChange?.(false)}
            aria-label="Open BioAro Drugs AI"
            data-pulse="true"
            className="
            group
            fixed
            right-5
            top-[84px]
            z-[100]
            flex
            h-14 w-14
            items-center justify-center
            rounded-full
            bg-ember
            text-white
            shadow-[0_10px_35px_rgba(193,70,42,0.35)]
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-[0_14px_45px_rgba(193,70,42,0.45)]
            active:scale-95
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-ember
            sm:right-7
            sm:h-auto
            sm:w-auto
            sm:gap-2.5
            sm:rounded-full
            sm:px-4
            sm:py-2.5
          "
          >
            {/* outer glow */}
            <span
              aria-hidden="true"
              className="
              pointer-events-none
              absolute inset-[-7px]
              rounded-full
              border border-ember/20
              opacity-70
              transition-all
              duration-300
              group-hover:inset-[-9px]
              group-hover:opacity-100
            "
            />

            {/* animated soft ring */}
            <span
              aria-hidden="true"
              className="
              pointer-events-none
              absolute inset-[-12px]
              rounded-full
              border border-ember/10
              opacity-50
            "
            />

            <span
              className="
              relative
              flex h-8 w-8
              items-center justify-center
              rounded-full
              bg-white/15
            "
            >
              <Sparkles
                size={17}
                strokeWidth={2.2}
                aria-hidden="true"
                className="
                transition-transform
                duration-300
                group-hover:rotate-12
              "
              />
            </span>

            <span className="hidden text-[13px] font-bold sm:inline">
              BioAro Drugs AI
            </span>
          </button>
        )}

      </>
    );
  }
