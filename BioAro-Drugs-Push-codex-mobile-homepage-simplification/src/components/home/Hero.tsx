import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { HERO } from "../../data/homepage";
import { PrimaryCta, SecondaryCta, Section } from "./primitives";
import heroRunnersSunrise from "../../assets/home-optimized/hero-runners-sunrise.jpg";
import AiProtocolEntry from "./AiProtocolEntry";
import type { CatalogProduct } from "../../lib/shopify/types";
import type { RefObject } from "react";

type HeroProps = {
  searchRef: RefObject<HTMLDivElement | null>;
  byHandle: Map<string, CatalogProduct>;
};

export default function Hero({ searchRef, byHandle }: HeroProps) {
  const marketHref = useMarketHref();

  return (
    <>
      <Section className="pt-16 sm:pt-20 lg:pt-24">
        {" "}
        {/* HERO HEADER + IMAGE ONLY */}
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14 xl:gap-20">
          {/* LEFT — HEADER */}
          <div>
            <h1
              className="bio-rise text-[34px] font-black leading-[1.0] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[64px] xl:text-[84px]"
              style={{ animationDelay: "40ms" }}
            >
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
          </div>

          {/* RIGHT — IMAGE */}
          <div
            className="bio-rise overflow-hidden rounded-[24px]"
            style={{ animationDelay: "120ms" }}
          >
            <img
              src={heroRunnersSunrise}
              alt="Four runners moving together at sunrise, a city skyline behind them"
              width={1774}
              height={887}
              fetchPriority="high"
              decoding="async"
              className="h-[320px] w-full object-cover object-[60%_center] sm:h-[420px] lg:h-[500px] xl:h-[560px]"
            />
          </div>
        </div>
        {/* -------------------------------------------------- */}
        {/* FULL-WIDTH AI / CHAT SECTION */}
        {/* -------------------------------------------------- */}
        <div
          ref={searchRef}
          className="bio-rise relative z-30 mt-10 w-full"
          style={{ animationDelay: "180ms" }}
        >
          <AiProtocolEntry byHandle={byHandle} variant="hero" />
        </div>
        {/* CTA BUTTONS */}
        <div
          className="bio-rise mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          style={{ animationDelay: "240ms" }}
        >
          <PrimaryCta
            to={marketHref(ROUTES.quiz)}
            className="w-full justify-center sm:w-auto"
          >
            {HERO.primaryCta}
          </PrimaryCta>

          <SecondaryCta
            to={marketHref(ROUTES.shop)}
            className="w-full justify-center sm:w-auto"
          >
            {HERO.secondaryCta}
          </SecondaryCta>
        </div>
        {/* MARKERS */}
        <ul
          className="bio-rise mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 sm:gap-x-10"
          style={{ animationDelay: "280ms" }}
        >
          {HERO.markers.map((marker) => (
            <li
              key={marker}
              className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400"
            >
              {marker}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
