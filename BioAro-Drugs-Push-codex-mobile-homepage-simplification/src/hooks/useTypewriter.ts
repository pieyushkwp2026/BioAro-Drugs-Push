import { useEffect, useRef, useState } from "react";

/*
 * A cycling typewriter: type a line, hold it, backspace it, move to the next.
 *
 * ---------------------------------------------------------------------------
 * The approach is lifted from the typewriter in AiSearchBar, which is not rendered
 * anywhere. Three things are fixed on the way across:
 *
 *   1. EVERY TIMER IS CLEANED UP. The original cleared its interval but not the
 *      timeout that advanced to the next line, so unmounting mid-hold still fired a
 *      state update on a dead component.
 *   2. IT STOPS WHEN THE TAB IS HIDDEN. A 34ms interval has no business running in a
 *      background tab.
 *   3. REDUCED MOTION IS HONOURED PROPERLY — the full line appears and the list still
 *      cycles, but nothing types and the caret does not blink. A blinking caret next
 *      to per-character animation is precisely what that setting exists for.
 *
 * One timeout drives the whole thing rather than an interval per phase, so there is
 * only ever a single handle to clear and no way for two phases to overlap.
 * ---------------------------------------------------------------------------
 */

const TYPE_MS = 38;
const DELETE_MS = 18; // Backspacing reads as fast in every editor; matching that feels right.
const HOLD_MS = 2400;
const HOLD_REDUCED_MS = 4000;

type Phase = "typing" | "holding" | "deleting";

export interface Typewriter {
  text: string;
  /** False under reduced motion, so the caret is rendered but never blinks. */
  animating: boolean;
}

export function useTypewriter(lines: readonly string[], enabled: boolean): Typewriter {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [reduced, setReduced] = useState(false);
  const timer = useRef<number | null>(null);

  // Read as a live query, not once: someone can change the setting mid-session.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || lines.length === 0) return;

    const line = lines[index % lines.length];

    /* Reduced motion: no per-character work at all. The full line is shown and the
       list still cycles, so the bar is not frozen — it just stops animating. */
    if (reduced) {
      setCount(line.length);
      setPhase("holding");
      timer.current = window.setTimeout(() => setIndex((i) => i + 1), HOLD_REDUCED_MS);
      return () => {
        if (timer.current) window.clearTimeout(timer.current);
      };
    }

    const step = () => {
      if (phase === "typing") {
        if (count < line.length) {
          setCount((c) => c + 1);
        } else {
          setPhase("holding");
        }
        return;
      }
      if (phase === "holding") {
        setPhase("deleting");
        return;
      }
      if (count > 0) {
        setCount((c) => c - 1);
      } else {
        setIndex((i) => i + 1);
        setPhase("typing");
      }
    };

    const delay = phase === "holding" ? HOLD_MS : phase === "deleting" ? DELETE_MS : TYPE_MS;
    timer.current = window.setTimeout(step, delay);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [enabled, lines, index, count, phase, reduced]);

  /* Pause while the tab is in the background, and pick up cleanly on return rather
     than racing through the queued frames. */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      } else if (!document.hidden) {
        // Nudge the effect above by re-committing the current phase.
        setPhase((current) => current);
        setCount((current) => current);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const line = lines.length > 0 ? lines[index % lines.length] : "";

  return { text: line.slice(0, count), animating: !reduced };
}
