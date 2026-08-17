import { useScrollReveal } from "../hooks/useScrollReveal";
import { useCatalog } from "../hooks/useCatalog";
import { SCIENCE_SECTION } from "../data/homepage";
import { useNavigate } from "react-router-dom";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";
import Hero from "../components/home/Hero";
import ProductShowcase from "../components/home/ProductShowcase";
import WhyBioAro from "../components/home/WhyBioAro";
import SachetRoutine from "../components/home/SachetRoutine";
import ScienceProof from "../components/home/ScienceProof";
import ProtocolExample from "../components/home/ProtocolExample";
import ProtocolPersonas from "../components/home/ProtocolPersonas";
import FounderNote from "../components/home/FounderNote";
import ScienceLibrary from "../components/home/ScienceLibrary";
import ClosingCta from "../components/home/ClosingCta";
import { useEffect, useRef, useState } from "react";
import FloatingAiBar from "../components/home/FloatingAiBar";
import ProtocolStudio from "../components/home/ProtocolStudio";
import { useProtocolSession } from "../hooks/useProtocolSession";

/*
 * THESIS: BioAro Drugs is an AI-guided precision-bioactive company whose supplements
 * are the intervention layer, not the identity. It refuses the supplement-store
 * arrangement it used to be — emotional hero, lifestyle stories, four pillars, then
 * finally a product rail — and puts the guided protocol surface at the front door.
 *
 * OWN-WORLD: unchanged and inherited. Ivory #F7F4EF ground with a fine SVG grain,
 * warm charcoal ink, one ember accent, flat white panels with hairline borders. New:
 * Plus Jakarta Sans display over Inter body. One signed-off exception to the flat
 * rule: the BioAro Drugs AI band carries a gradient field, because it has to read as
 * the AI product rather than as another content section. It is the only one.
 *
 * STORY: here are the formulas → I can tell it what I want to improve and it builds
 * me a protocol → here is why this company is different → here is literally what is in
 * the product and how much → here is what a protocol looks like as a day → here are
 * four ways to start one → a person stands behind it → here is the reading → start.
 *
 * FIRST VIEWPORT: three lines of headline at up to 92px, a standfirst, one plain
 * sentence of what actually happens, two buttons, and four words on a hairline. No
 * photograph competing with the type; the image lands under the fold as a band.
 *
 * FORM: ten sections, alternating density on purpose — interactive panel, then a
 * product rail, then quiet hairline rows, then the densest block on the page (a real
 * ingredient table), then a timeline, a card row, and a short founder note. Never two
 * grids in a row.
 *
 * The load-bearing idea is section five. Every competitor asserts transparency; this
 * one prints the formulation — real actives at real doses, read live from the same
 * catalogue the product page uses. It is the one section a competitor cannot
 * copy-paste, because copying it would mean publishing their own doses.
 */

const SCOPED_CSS = `
/* Entrance. 620ms and 16px: the previous 1000ms/22px also animated filter: blur(12px)
   on the LCP text block, which is a compositing cost paid on the exact element the
   page is measured by. The blur is gone; the easing is unchanged. */
@keyframes bioRise {
  from { opacity: 0; transform: translate3d(0, 16px, 0); }
  to   { opacity: 1; transform: none; }
}
.bio-home .bio-rise { animation: bioRise 620ms cubic-bezier(0.16, 1, 0.3, 1) both; }

/* index.css carries a global reduced-motion reset, but this page owns its own
   guard so the entrance never depends on a file outside this component. */
@media (prefers-reduced-motion: reduce) {
  .bio-home .bio-rise { animation: none; }
}

.bio-home .bio-rail {
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.bio-home .bio-rail::-webkit-scrollbar { display: none; }
.bio-home .bio-rail > * { scroll-snap-align: start; }

/* Scroll reveal. The hidden state is applied by JS on mount, never in the stylesheet,
   so with JS unavailable the content simply renders visible instead of disappearing. */
.bio-home [data-anim] {
  transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}
.bio-home [data-anim="hidden"] { opacity: 0; transform: translate3d(0, 16px, 0); }
@media (prefers-reduced-motion: reduce) {
  .bio-home [data-anim] { transition: none; }
  .bio-home [data-anim="hidden"] { opacity: 1; transform: none; }
}
`;

export default function Home() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  const session = useProtocolSession();
  const navigate = useNavigate();
  const marketHref = useMarketHref();
  const { products, byHandle, state } = useCatalog();
  const [floatingAiCollapsed, setFloatingAiCollapsed] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!searchRef.current) return;

      const rect = searchRef.current.getBoundingClientRect();

      // Show floating search once the original search bar reaches the header area.
      setShowFloatingSearch(rect.bottom <= 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={revealRef} className="bio-home bg-cream text-ink">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* 1 — Thesis. What this is, and the one thing to do about it. */}
      <Hero searchRef={searchRef} />
      {showFloatingSearch && (
        <FloatingAiBar collapsed={floatingAiCollapsed} onCollapsedChange={setFloatingAiCollapsed} />
      )}

      {/* 2 — Commerce, early. Buyable from the card, not two clicks away. The hero
             search bar is the front door; what follows it should be the range, not a
             second interactive surface before a visitor has seen a product. */}
      <ProductShowcase products={products} state={state} />

      {/* 3 — The protocol entry. Not branded as the AI: a goal picker that opens a
             four-question builder is a protocol tool, and the AI name stays on the
             surfaces where a question actually gets typed. */}

      {/* 4 — Differentiation. Quiet hairline rows after a row of cards. */}
      <WhyBioAro />

      {/* 5 — Format. The adherence argument, carried by two routine photographs. */}
      <SachetRoutine />

      {/* 6 — Proof. The densest block on the page, and the reason to believe. */}
      <ScienceProof product={byHandle.get(SCIENCE_SECTION.featuredHandle)} />

      {/* 7 — The output, as a day. */}
      <ProtocolExample byHandle={byHandle} />

      {/* 8 — Entry, immediately after the shape. Section 7 shows what a protocol
             looks like; this offers four ways into building one. Deliberately in
             that order — an invitation to start reads better once you have seen
             what you are starting. Replaced the testimonial rail that used to sit
             on the page: four goal sets assert nothing, four unattributed quotes
             asserted results we cannot evidence. */}
      <ProtocolPersonas />

      {/* The AI band. Mid-page on the homepage rather than pre-footer, so it does
          not stack against the closing photograph. Layout renders it above the
          footer on every other route. */}
      {/* <AiBand /> */}

      {/* 9 — A person stands behind it. Short, and typographic. */}
      <FounderNote />

      {/* 10 — The reading. */}
      <ScienceLibrary />

      {/* 11 — Close, anchored. */}
      <ClosingCta />

      {/* ONE studio for the page. It used to be mounted inside the entry component,
          which rendered twice — hero and floating — putting two <dialog> elements on
          the page that opened independently of each other. */}
      <ProtocolStudio
        open={session.studioOpen}
        byHandle={byHandle}
        onClose={session.closeStudio}
        onContinue={() => {
          const goals = session.view.session.detectedGoals;
          navigate(`${marketHref(ROUTES.ai)}${goals.length > 0 ? `?goals=${goals.join(",")}` : ""}`, {
            state: session.message.trim() ? { note: session.message.trim() } : undefined,
          });
        }}
        autoFocusInput={session.studioAutoFocus}
      />
    </div>
  );
}
