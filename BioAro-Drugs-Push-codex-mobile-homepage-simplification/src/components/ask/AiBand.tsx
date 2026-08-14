import { ArrowRight, Sparkles } from "lucide-react";
import { useAiChat } from "../../hooks/useAiChat";

/*
 * The BioAro Drugs AI band. Appears once on every page.
 *
 * ON THE GRADIENT. The rest of this design system is flat — src/index.css records
 * that glassmorphism was removed by decision, and the homepage contract says "no
 * glass and no gradients". This band is a deliberate, signed-off exception: it is the
 * one surface that has to read as the AI product rather than as another content
 * section, and it is the only decorative gradient in the codebase. Everything else
 * stays flat. The stops are built from the site's own palette — ember through plum to
 * a dusk blue — so it echoes the sunrise photography in the hero instead of
 * importing another brand's colour.
 *
 * It is also the reason a light band works here at all: several pages already close
 * on a dark slab, and the footer opens dark, so a dark band would have stacked three
 * or four dark fields in a row. A saturated mid-tone separates cleanly from both the
 * ivory page above it and the near-black footer below.
 */
export default function AiBand() {
  const { openChat } = useAiChat();

  return (
    <section aria-labelledby="ai-band-heading" className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="relative overflow-hidden rounded-[28px] px-7 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* Two washes rather than one: a broad diagonal for the field, and a soft
              radial warm spot so the surface has a light source instead of reading
              as a flat CSS ramp. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(107deg,#8E3019_0%,#C1462A_26%,#A8566B_54%,#6E5C93_78%,#4A4A82_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(120%_140%_at_18%_15%,rgba(255,232,214,0.34)_0%,rgba(255,232,214,0)_52%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14">
            <div>
              <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-white/70">
                <Sparkles size={14} strokeWidth={2.3} aria-hidden="true" />
                BioAro Drugs AI
              </p>
              <h2
                id="ai-band-heading"
                className="mt-4 max-w-[16ch] text-balance text-[32px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-[40px] lg:text-[46px]"
              >
                What belongs in my routine?
              </h2>
              <p className="mt-5 max-w-[46ch] text-pretty text-[16px] leading-[1.6] text-white/80 sm:text-[17px]">
                Ask about any ingredient and its dose, how the sachets work, or what a
                formula is for. Answers come from BioAro Drugs&rsquo; own product
                information, with a link to where each one lives.
              </p>
            </div>

            {/* The card. Translucent over the wash with a hairline edge — the
                reference's material, at a blur radius small enough not to cost a
                full-surface repaint on scroll. */}
            <div className="rounded-[22px] border border-white/25 bg-white/12 p-6 backdrop-blur-[6px] sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ember">
                  <Sparkles size={19} strokeWidth={2.3} aria-hidden="true" />
                </span>
                <p className="text-[21px] font-bold tracking-[-0.025em] text-white sm:text-[24px]">
                  Ask BioAro Drugs AI.
                </p>
              </div>
              <p className="mt-4 text-[15px] leading-[1.55] text-white/80">
                It answers from approved product information. It does not give medical
                advice.
              </p>
              <button
                type="button"
                onClick={() => openChat()}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14.5px] font-bold tracking-[-0.01em] text-ink transition-[background-color,transform] duration-200 hover:bg-cream active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:active:scale-100 sm:w-auto"
              >
                Start a conversation
                <ArrowRight
                  size={15}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
