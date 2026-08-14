import { WHY_SECTION } from "../../data/homepage";
import { Eyebrow, Section, SectionHeading } from "./primitives";

/*
 * A numbered index, not a card grid and not a two-column list.
 *
 * Five items in two columns is the arrangement this section had, and five is odd:
 * the fifth point sat alone in the left column with a dead quadrant beside it, so a
 * quarter of the section was empty for no compositional reason. Five full-width rows
 * cannot produce an orphan.
 *
 * The register is deliberate too. This sits between a row of product cards and the
 * densest block on the page, so it wants to read as an index — hairline rules, a
 * tabular number, one idea per line — rather than a third grid in a row. Numbering
 * also does something a bulleted list does not: it says the list is finite and
 * considered, which is the claim the section is making.
 */
export default function WhyBioAro() {
  return (
    <Section id="why-bioaro-drugs" className="scroll-mt-[112px] pb-20 sm:pb-24 lg:pb-28">
      {/* Heading and standfirst share the top rule, so the eye starts left and the
          right column is occupied rather than abandoned. */}
      <div className="grid gap-x-16 gap-y-6 border-b border-line-strong pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
        <div>
          <Eyebrow>{WHY_SECTION.eyebrow}</Eyebrow>
          <SectionHeading className="mt-4 max-w-[15ch]">
            {WHY_SECTION.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </SectionHeading>
        </div>
        <p className="max-w-[42ch] text-pretty text-[16px] leading-[1.6] text-ink-600 lg:pb-2">
          {WHY_SECTION.standfirst}
        </p>
      </div>

      <ol>
        {WHY_SECTION.points.map((point, index) => (
          <li
            key={point.title}
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 60}ms` }}
            className="grid grid-cols-[38px_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-line py-7 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[64px_minmax(0,0.9fr)_minmax(0,1.5fr)] lg:gap-x-10"
          >
            <span
              aria-hidden="true"
              className="pt-1 text-[12.5px] font-bold tabular-nums tracking-[0.06em] text-ember"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-balance text-[19px] font-bold leading-[1.25] tracking-[-0.025em] text-ink sm:text-[21px]">
              {point.title}
            </h3>
            {/* Starts in the number's column on small screens so the body copy uses
                the full measure instead of a 38px-indented ribbon. */}
            <p className="col-start-1 col-end-3 max-w-[54ch] text-pretty text-[15.5px] leading-[1.6] text-ink-600 sm:col-start-2 lg:col-start-3 lg:col-end-4 lg:pt-0.5">
              {point.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
