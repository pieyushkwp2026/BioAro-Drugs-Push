import { useEffect, useState } from "react";

/*
 * Sticky section nav.
 *
 * It is built from the sections that ACTUALLY rendered, not from a fixed list — a tab
 * that scrolls you to nothing is worse than no tab. The page passes only the ids it
 * mounted.
 *
 * Scroll-spy uses IntersectionObserver with a top-weighted rootMargin so a heading
 * becomes active as it reaches the bar rather than when it reaches the viewport
 * centre. Anchors are real hrefs, so the nav works before hydration and a middle
 * click opens the section in a new tab.
 */
export interface NavSection {
  id: string;
  label: string;
}

export default function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Top band only: -128px clears the fixed header and this bar; -55% keeps a
      // single section active rather than flickering between two.
      { rootMargin: "-128px 0px -55% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Product sections"
      className="sticky top-[88px] z-20 -mx-5 border-y border-line bg-cream/95 px-5 backdrop-blur-[2px] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
    >
      <ul className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`inline-block rounded-full px-4 py-2 text-[13.5px] font-bold tracking-[-0.01em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                  isActive ? "bg-ink text-white" : "text-ink-600 hover:bg-white hover:text-ink"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
