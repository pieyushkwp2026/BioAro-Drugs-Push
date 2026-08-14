import { useEffect, useRef } from "react";

/*
 * Reveals every [data-reveal] descendant as it enters the viewport.
 *
 * IntersectionObserver rather than a scroll listener: no per-frame work, and each
 * element is unobserved once it has arrived so nothing keeps running down the page.
 *
 * The hidden state is applied by JS on mount and never declared in the stylesheet.
 * That ordering matters: with JS unavailable the content simply renders visible
 * instead of disappearing permanently.
 *
 * Lifted out of Home.tsx so every homepage section can share one observer setup
 * rather than each re-implementing it.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el) => el.setAttribute("data-anim", "hidden"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-anim", "shown");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
