import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { FOUNDER } from "../../data/homepage";
import { Eyebrow, QuietLink, Section } from "./primitives";

/*
 * Short, and typographic rather than photographic.
 *
 * No portrait ships here. Three founder portraits sit unused in src/assets/figma-home/
 * but none is confirmed to be Dr. Kapoor, and an unverified face beneath a real
 * person's name is a worse failure than no face at all. When a confirmed image is
 * supplied it goes to the left of this block.
 *
 * The credential line is exactly what has been verified. See the warning in
 * src/data/homepage.ts before adding to it.
 */
export default function FounderNote() {
  const marketHref = useMarketHref();

  return (
    <Section className="pb-20 sm:pb-24 lg:pb-28">
      <div className="border-y border-line py-12 sm:py-14">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
          <div>
            <Eyebrow>{FOUNDER.eyebrow}</Eyebrow>
            <p className="mt-4 text-[20px] font-bold tracking-[-0.025em] text-ink">{FOUNDER.name}</p>
            <p className="mt-1.5 max-w-[30ch] text-[14px] leading-[1.5] text-ink-400">{FOUNDER.credentials}</p>
          </div>

          <div>
            <h2 className="max-w-[16ch] text-balance text-[28px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[34px]">
              {FOUNDER.headline}
            </h2>
            {FOUNDER.statement.map((paragraph) => (
              <p key={paragraph} className="mt-5 max-w-[58ch] text-pretty text-[16.5px] leading-[1.6] text-ink-600">
                {paragraph}
              </p>
            ))}
            <div className="mt-7">
              <QuietLink to={marketHref(ROUTES.about)}>{FOUNDER.cta}</QuietLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
