import { Check } from "lucide-react";
import { SACHET_SECTION } from "../../data/homepage";
import routineTraining from "../../assets/home-optimized/routine-training.jpg";
import routineMorning from "../../assets/home-optimized/routine-morning.jpg";
import { Section, SectionHeading } from "./primitives";

/*
 * "One sachet. Wherever the day goes."
 *
 * ---------------------------------------------------------------------------
 * Restored from the pre-restructure homepage, where it ran as section 3. The
 * composition is the original — headline, lead, demoted adherence line, a 1.42/1
 * image pair, proof points in a quiet row beneath — because that arrangement was
 * right: the photography carries the section, and a column of text beside it would
 * have competed with the images rather than supporting them.
 *
 * REBUILT RATHER THAN PASTED BACK. The original wrote #E7E4DE, #4A4F57, #2E3238 and
 * a #2A6347 green inline at every call site, which is the habit that stopped the old
 * page from being able to follow a theme change. This uses the tokens, so the check
 * plates take the ember accent instead of reintroducing the retired forest green.
 * ---------------------------------------------------------------------------
 */

const IMAGES = [routineTraining, routineMorning];

export default function SachetRoutine() {
  return (
    <Section className="pb-20 sm:pb-24 lg:pb-28">
      <SectionHeading data-reveal>
        {SACHET_SECTION.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </SectionHeading>

      <p
        data-reveal
        style={{ ["--reveal-delay" as string]: "80ms" }}
        className="mt-7 max-w-[52ch] text-pretty text-[18px] leading-[1.6] text-ink-600 sm:text-[20px]"
      >
        {SACHET_SECTION.body}
      </p>

      <p
        data-reveal
        style={{ ["--reveal-delay" as string]: "140ms" }}
        className="mt-4 max-w-[52ch] text-pretty text-[15.5px] leading-[1.6] text-ink-400"
      >
        {SACHET_SECTION.adherence}
      </p>

      {/* Uneven on purpose: a 50/50 pair reads as a comparison, and these are two
          moments in one routine rather than two options. */}
      <div className="mt-12 grid gap-4 lg:grid-cols-[1.42fr_1fr]">
        {SACHET_SECTION.images.map((image, index) => (
          <div
            key={image.alt}
            data-reveal
            style={{ ["--reveal-delay" as string]: `${180 + index * 100}ms` }}
            className="group overflow-hidden rounded-[32px] bg-cream-200"
          >
            <img
              src={IMAGES[index]}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className={`h-full min-h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transform-none sm:min-h-[420px] lg:min-h-[520px] ${image.position}`}
            />
          </div>
        ))}
      </div>

      <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {SACHET_SECTION.points.map((point, index) => (
          <li
            key={point}
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 70}ms` }}
            className="flex items-start gap-3"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(193,70,42,0.10)] text-ember"
            >
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="text-[15.5px] leading-[1.5] text-ink">{point}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
