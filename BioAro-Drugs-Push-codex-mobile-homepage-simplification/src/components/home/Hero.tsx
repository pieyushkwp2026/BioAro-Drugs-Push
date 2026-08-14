import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { HERO } from "../../data/homepage";
import { PrimaryCta, SecondaryCta, Section } from "./primitives";
import AiSearchBar from "../ask/AiSearchBar";
import heroRunnersSunrise from "../../assets/home-optimized/hero-runners-sunrise.jpg";

/*
 * First viewport. Type only — no product cards, no photograph competing with the
 * headline. The image lands underneath as a band rather than a 62vh showpiece,
 * which is what lets the AI surface and the products sit near the fold instead of
 * three scrolls down.
 */
export default function Hero() {
  const marketHref = useMarketHref();

  return (
    <>
      <Section className="pt-[116px] sm:pt-[140px] lg:pt-[162px]">
        {/* No max-width: the three lines are authored as blocks, so a measure cap
            only reintroduces wrapping inside line three ("Your BioAro / Drugs
            Protocol."), which turns a deliberate three-beat headline into a ragged
            four-line one. Sizes are tuned per breakpoint so line three — the longest
            at 27 characters — stays on one line down to 360px. */}
        <h1 className="bio-rise text-[34px] font-black leading-[1.0] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[64px] xl:text-[84px]">
          {HERO.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p
          className="bio-rise mt-8 max-w-[38ch] text-[20px] font-medium leading-[1.35] tracking-[-0.02em] text-ink-700 sm:text-[24px] lg:text-[26px]"
          style={{ animationDelay: "90ms" }}
        >
          {HERO.standfirst}
        </p>

        <p
          className="bio-rise mt-5 max-w-[52ch] text-pretty text-[16px] leading-[1.6] text-ink-400 sm:text-[17px]"
          style={{ animationDelay: "150ms" }}
        >
          {HERO.explainer}
        </p>

        {/* The primary control. A search bar is what a visitor reads as AI; the two
            buttons below are the secondary paths, not the main event. The panel it
            opens is absolutely positioned, so an answer never pushes the page down. */}
        {/* `relative z-30` is load-bearing, not decoration. Every bio-rise element
            animates a transform, and a transform creates a stacking context — so the
            answer panel's own z-40 is scoped INSIDE this wrapper. Without a z-index
            here the wrapper sits in the auto group and the later CTA row and marker
            strip, which also carry transforms, painted straight over the answer. */}
        <div className="bio-rise relative z-30 mt-9 max-w-[720px]" style={{ animationDelay: "200ms" }}>
          <AiSearchBar />
        </div>

        <div className="bio-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4" style={{ animationDelay: "260ms" }}>
          <PrimaryCta to={marketHref(ROUTES.quiz)} className="w-full justify-center sm:w-auto">
            {HERO.primaryCta}
          </PrimaryCta>
          <SecondaryCta to={marketHref(ROUTES.shop)} className="w-full justify-center sm:w-auto">
            {HERO.secondaryCta}
          </SecondaryCta>
        </div>

        {/* Four words on one hairline rule. Restraint is the point: this is the row
            where supplement sites usually stack invented certification seals. */}
        <ul
          className="bio-rise mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 sm:gap-x-10"
          style={{ animationDelay: "280ms" }}
        >
          {HERO.markers.map((marker) => (
            <li key={marker} className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">
              {marker}
            </li>
          ))}
        </ul>
      </Section>

      <div className="bio-rise mt-12 overflow-hidden sm:mt-14 lg:mt-16" style={{ animationDelay: "320ms" }}>
        <img
          src={heroRunnersSunrise}
          alt="Four runners moving together at sunrise, a city skyline behind them"
          width={1774}
          height={887}
          fetchPriority="high"
          decoding="async"
          className="h-[34vh] min-h-[240px] w-full object-cover object-[60%_center] sm:h-[40vh] lg:h-[44vh] lg:max-h-[440px]"
        />
      </div>
    </>
  );
}
