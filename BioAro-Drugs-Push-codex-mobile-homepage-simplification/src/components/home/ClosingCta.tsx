import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { CLOSING_SECTION } from "../../data/homepage";
import { PrimaryCta } from "./primitives";
import closingScene from "../../assets/home-optimized/closing-scene.jpg";

/*
 * The close. A real anchor rather than a newsletter block.
 *
 * This absorbs the old standalone trust band: the client-retained trust line rides
 * here as supporting copy so it costs no extra section on a page whose whole purpose
 * was to get shorter. Two scrims — a left-weighted one for the copy column and a
 * light top wash — so the headline holds contrast wherever the photograph lands.
 */
export default function ClosingCta() {
  const marketHref = useMarketHref();

  return (
    <section className="relative overflow-hidden">
      <img
        src={closingScene}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[58%_26%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(20,16,13,0.90)_0%,rgba(20,16,13,0.74)_34%,rgba(20,16,13,0.38)_62%,rgba(20,16,13,0.12)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,13,0.32)_0%,rgba(20,16,13,0)_42%)]" />

      <div className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="max-w-[16ch] text-balance text-[38px] font-black leading-[1.0] tracking-[-0.04em] text-white sm:text-[52px] lg:text-[62px]">
            {CLOSING_SECTION.headline}
          </h2>
          <p className="mt-6 max-w-[46ch] text-pretty text-[17px] leading-[1.6] text-white/80">
            {CLOSING_SECTION.body}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <PrimaryCta to={marketHref(ROUTES.quiz)} className="w-full justify-center sm:w-auto">
              {CLOSING_SECTION.primaryCta}
            </PrimaryCta>
            <a
              href={marketHref(ROUTES.shop)}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-[15px] font-bold tracking-[-0.01em] text-white transition-[background-color,transform] duration-200 hover:bg-white/10 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:active:scale-100 sm:w-auto"
            >
              {CLOSING_SECTION.secondaryCta}
            </a>
          </div>

          <p className="mt-12 max-w-[54ch] border-t border-white/15 pt-6 text-[14.5px] leading-[1.6] text-white/70">
            {CLOSING_SECTION.trustLine}
          </p>
        </div>
      </div>
    </section>
  );
}
