import { ArrowRight, Lock } from "lucide-react";
import { GOALS, PERSONAS, PERSONAS_SECTION, PRECISION_TIER } from "../../data/homepage";
import { useProtocolSession } from "../../hooks/useProtocolSession";
import { Eyebrow, Section, SectionHeading } from "./primitives";

/*
 * Named starting points — the section that replaced the testimonial rail.
 *
 * ---------------------------------------------------------------------------
 * WHY A PERSONA IS A BUTTON AND NOT A PICTURE
 *
 * The obvious version of this section is four cards showing four fixed product
 * bundles. That would contradict the entire page: the argument above is that a
 * protocol is derived from what you tell BioAro Drugs AI, and a hardcoded bundle
 * labelled "The Athlete" is the shelf-shopping this site is arguing against.
 *
 * So a card selects GOALS and opens the studio. The protocol that comes out is built
 * by the same builder as any other session, from the same answers. The card is a
 * shortcut to a starting point, and it says so on its face by listing the goals it
 * will select — nothing is hidden behind the name.
 *
 * NO CLAIM ABOUT THE PERSON. "The Executive" describes a situation, not a diagnosis
 * or a recommendation. No card asserts that a person of that description should take
 * anything; it asserts only which goals it is about to tick.
 *
 * THE FIFTH CARD IS DISABLED, AND THAT IS THE POINT. Precision — biomarkers, labs,
 * genetics, wearables — is real positioning and a real roadmap, and it is also a
 * capability this product does not have. Hiding it would understate the company;
 * showing it as live would be a claim we cannot make. So it is shown, marked, and
 * cannot be clicked. It is a <div>, not a disabled <button>: there is no action to
 * offer, and a focusable control that does nothing is worse than plain text.
 * ---------------------------------------------------------------------------
 */

export default function ProtocolPersonas() {
  const session = useProtocolSession();

  return (
    <Section id="protocol-personas" className="scroll-mt-[112px] pb-20 sm:pb-24 lg:pb-28">
      <div className="grid gap-x-16 gap-y-6 border-b border-line-strong pb-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
        <div>
          <Eyebrow>{PERSONAS_SECTION.eyebrow}</Eyebrow>
          <SectionHeading className="mt-4 max-w-[14ch]">
            {PERSONAS_SECTION.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </SectionHeading>
        </div>
        <p className="max-w-[46ch] text-pretty text-[16px] leading-[1.6] text-ink-600 lg:pb-2">
          {PERSONAS_SECTION.body}
        </p>
      </div>

      {/* Four across, not three. Five cards in three columns leaves the second row
          two-thirds empty with the precision card stranded mid-width — the same
          orphan the Why section was rebuilt to avoid. Precision comes out of the grid
          entirely and runs as a full-width strip below, which also stops it reading
          as a fifth thing you can pick. */}
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PERSONAS.map((persona, index) => {
          /* Resolved from GOALS rather than restated on the persona, so a goal's
             outcome wording can never drift between this card and the chip it
             selects. */
          const goals = persona.goals
            .map((id) => GOALS.find((goal) => goal.id === id))
            .filter((goal): goal is (typeof GOALS)[number] => Boolean(goal));

          return (
            <li key={persona.id} data-reveal style={{ ["--reveal-delay" as string]: `${index * 60}ms` }}>
              <button
                type="button"
                onClick={() => {
                  session.startWithGoals(persona.goals);
                  session.openStudio();
                }}
                className="group flex h-full w-full flex-col rounded-[20px] border border-line bg-white p-6 text-left transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-glass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <p className="text-[20px] font-black leading-[1.15] tracking-[-0.03em] text-ink">
                  {persona.name}
                </p>
                <p className="mt-2.5 text-pretty text-[14.5px] leading-[1.55] text-ink-600">
                  {persona.premise}
                </p>

                {/* The goals this card will tick, named. The card's whole honesty
                    rests on showing this rather than on the label above it. */}
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {goals.map((goal) => (
                    <li
                      key={goal.id}
                      className="rounded-full border border-line bg-cream-50 px-2.5 py-1 text-[12px] font-bold tracking-[-0.01em] text-ink-600"
                    >
                      {goal.label}
                    </li>
                  ))}
                </ul>

                {/* Two per goal, not all three. Six phrases joined by middots read
                    as a dumped list and wrapped to three lines in a 290px card;
                    four reads as a line. */}
                <p className="mt-3 text-[12.5px] leading-[1.5] text-ink-400">
                  {goals.flatMap((goal) => goal.outcomes.slice(0, 2)).join(" · ")}
                </p>

                <span className="mt-auto flex items-center gap-1.5 pt-6 text-[13.5px] font-bold text-ember">
                  {PERSONAS_SECTION.cta}
                  <ArrowRight
                    size={15}
                    strokeWidth={2.4}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                  />
                </span>
              </button>
            </li>
          );
        })}

      </ul>

      {/* Not a button, and not a card in the row above. There is nothing to click,
          and saying so plainly beats a control that swallows a tap. */}
      <div
        data-reveal
        style={{ ["--reveal-delay" as string]: `${PERSONAS.length * 60}ms` }}
        className="mt-4 grid gap-x-10 gap-y-3 rounded-[20px] border border-dashed border-line-strong px-6 py-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)_auto] lg:items-center"
      >
        <p className="flex items-center gap-2 text-[17px] font-black tracking-[-0.03em] text-ink-400">
          <Lock size={14} strokeWidth={2.4} aria-hidden="true" />
          {PRECISION_TIER.label}
          <span className="sr-only"> — {PRECISION_TIER.status}</span>
        </p>

        <p className="text-pretty text-[14px] leading-[1.55] text-ink-400">
          {PRECISION_TIER.body}{" "}
          <span className="text-ink-400/80">{PRECISION_TIER.outcomes.join(" · ")}</span>
        </p>

        <span
          aria-hidden="true"
          className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-400 lg:justify-self-end"
        >
          {PRECISION_TIER.status}
        </span>
      </div>
    </Section>
  );
}
