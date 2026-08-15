import { Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { useMarketHref } from "../../hooks/useMarketHref";
import { useProtocolSession } from "../../hooks/useProtocolSession";
import { ROUTES } from "../../lib/routes";
import { AI_SECTION, HERO } from "../../data/homepage";
import { PrimaryCta, SecondaryCta, Section } from "./primitives";
import { GoalChips, IntentBox } from "./protocolControls";
import heroRunnersSunrise from "../../assets/home-optimized/hero-runners-sunrise.jpg";
import type { RefObject } from "react";

/*
 * The hero — one composition, not three stacked ones.
 *
 * ---------------------------------------------------------------------------
 * It used to be a two-column grid holding only the headline and the photograph,
 * then a FULL-WIDTH AI block beneath it, then the CTAs. The AI block read as a
 * separate band bolted under the hero, and the proposition needed two screens.
 *
 * Now the left column carries the whole argument — headline, standfirst, the AI
 * entry, goals, disclosure, CTAs — and the photograph holds the right, with the
 * orb overlapping its corner. The rings used to sit in an empty column of their
 * own; on the image they are doing something.
 *
 * It owns no modal. `openStudio` comes from the session context so one dialog
 * serves the hero, the orb and the floating bar alike.
 * ---------------------------------------------------------------------------
 */

export default function Hero({ searchRef }: { searchRef: RefObject<HTMLDivElement | null> }) {
  const marketHref = useMarketHref();
  const session = useProtocolSession();

  /* Send resolves goals first, then opens, so the studio appears with the chips
     already lit rather than rearranging itself while someone is looking at it. */
  const sendAndOpen = () => {
    void session.send().then(() => session.openStudio({ focusInput: true }));
  };


  /* The header is fixed and 89px tall at EVERY width — pt-20 (80px) tucked the
     headline underneath it at 390 and at 1440 alike. */
  return (
    <Section className="pt-28 sm:pt-28 lg:pt-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_0.92fr] lg:items-start lg:gap-14 xl:gap-20">
        {/* ------------------------------------------------------------ left */}
        <div>
          <h1
            className="bio-rise text-[34px] font-black leading-[1.0] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[58px] xl:text-[68px]"
            style={{ animationDelay: "40ms" }}
          >
            {HERO.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p
            className="bio-rise mt-6 max-w-[40ch] text-[18px] font-medium leading-[1.35] tracking-[-0.02em] text-ink-700 sm:text-[21px]"
            style={{ animationDelay: "90ms" }}
          >
            {HERO.standfirst}
          </p>

          {/* z-30 is load-bearing: bio-rise animates a transform, which creates a
              stacking context, and without it the CTAs painted over the panel the
              AI entry opens. */}
          <div
            ref={searchRef}
            className="bio-rise relative z-30 mt-8"
            style={{ animationDelay: "150ms" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-ember/20 bg-white px-3.5 py-2 shadow-[0_4px_18px_rgba(193,70,42,0.08)]">
              <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-ember/10">
                <Sparkles size={13} strokeWidth={2.2} className="text-ember" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">{AI_SECTION.eyebrow}</span>
            </div>

            <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.55] text-ink-600">{AI_SECTION.body}</p>

            <div className="mt-5">
              <IntentBox session={session} onSend={sendAndOpen} />
            </div>

            <GoalChips session={session} className="mt-4" onPick={() => session.openStudio()} />

            <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-400">
              <Clock3 size={14} strokeWidth={2} aria-hidden="true" />
              {AI_SECTION.duration}
            </p>

            {/* The honesty line, given a frame rather than left as loose small print. */}
            <div className="mt-5 flex max-w-[54ch] items-start gap-3 rounded-[16px] border border-line bg-white/70 p-4">
              <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-ember" />
              <p className="text-[13px] leading-[1.55] text-ink-600">{AI_SECTION.homepageNote}</p>
            </div>
          </div>

          <div
            className="bio-rise mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <PrimaryCta to={marketHref(ROUTES.quiz)} className="w-full justify-center sm:w-auto">
              {HERO.primaryCta}
            </PrimaryCta>
            <SecondaryCta to={marketHref(ROUTES.shop)} className="w-full justify-center sm:w-auto">
              {HERO.secondaryCta}
            </SecondaryCta>
          </div>
        </div>

        {/* ----------------------------------------------------------- right */}
        <div className="bio-rise relative" style={{ animationDelay: "120ms" }}>
          <div className="overflow-hidden rounded-[24px]">
            <img
              src={heroRunnersSunrise}
              alt="Four runners moving together at sunrise, a city skyline behind them"
              width={1774}
              height={887}
              fetchPriority="high"
              decoding="async"
              className="h-[320px] w-full object-cover object-[60%_center] sm:h-[440px] lg:h-[560px] xl:h-[620px]"
            />
          </div>

          {/* The orb, overlapping the corner. Rings are decorative and sized past
              the image edge on purpose — clipped, they read as a flat badge. */}
          <div className="pointer-events-none absolute -bottom-[90px] -right-[80px] hidden lg:block">
            <div className="relative flex h-[240px] w-[240px] items-center justify-center">
              {[240, 190, 145].map((size) => (
                <span
                  key={size}
                  aria-hidden="true"
                  style={{ height: size, width: size }}
                  className="absolute rounded-full border border-dashed border-ember/25"
                />
              ))}
              <span
                aria-hidden="true"
                className="absolute h-[150px] w-[150px] rounded-full bg-[radial-gradient(circle,rgba(193,70,42,0.18),transparent_70%)] blur-xl"
              />
              <button
                type="button"
                onClick={() => session.openStudio({ focusInput: true })}
                aria-label={AI_SECTION.dialogLabel}
                className="group pointer-events-auto relative flex h-[124px] w-[124px] flex-col items-center justify-center rounded-full bg-ember text-white shadow-[0_20px_55px_rgba(193,70,42,0.4)] transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-[0_24px_65px_rgba(193,70,42,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember motion-reduce:hover:transform-none"
              >
                <Sparkles
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="mb-1.5 transition-transform duration-300 group-hover:rotate-12 motion-reduce:transform-none"
                />
                <span className="text-[13.5px] font-bold leading-tight">
                  BioAro
                  <br />
                  Drugs AI
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Four words, one rule. Every one is demonstrated further down the page. */}
      <ul
        className="bio-rise mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 sm:gap-x-10"
        style={{ animationDelay: "280ms" }}
      >
        {HERO.markers.map((marker) => (
          <li key={marker} className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">
            {marker}
          </li>
        ))}
      </ul>

    </Section>
  );
}
