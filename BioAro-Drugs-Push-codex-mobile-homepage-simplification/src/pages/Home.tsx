import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CandyOff,
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Infinity as InfinityIcon,
  NutOff,
  Sprout,
  Vegan,
  Waves,
  WheatOff,
} from "lucide-react";

/*
 * Delivery-resolution derivatives of the source art, generated for this page:
 * the originals are 0.7-2.3MB PNGs each and totalled ~16MB for one homepage.
 * These are the same images at the sizes they are actually rendered (1.6MB total).
 * Originals remain untouched in their original folders for other surfaces.
 */
import heroRunnersSunrise from "../assets/home-optimized/hero-runners-sunrise.jpg";
import storyWork from "../assets/home-optimized/story-work.jpg";
import storyTraining from "../assets/home-optimized/story-training.jpg";
import storyRecovery from "../assets/home-optimized/story-recovery.jpg";
import storyVitality from "../assets/home-optimized/story-vitality.jpg";
import storyAgeing from "../assets/home-optimized/story-ageing.jpg";
/*
 * Two real routine moments rather than a studio arrangement. Still not the
 * everyday-CARRY shot (sachet into a handbag, beside a passport, in a gym bag) -
 * nothing in the repo shows the product in transit, so the portability claim in
 * the copy is still carried by words alone. Swap either import when that lands.
 */
import routineTraining from "../assets/home-optimized/routine-training.jpg";
import routineMorning from "../assets/home-optimized/routine-morning.jpg";
import storyBand from "../assets/home-optimized/story-band.jpg";
// Client-supplied formulation still life. Replaces the previous researcher shot,
// which read as generic stock next to this section's restrained copy.
import evidenceFormulation from "../assets/home-optimized/evidence-formulation.jpg";
import closingScene from "../assets/home-optimized/closing-scene.jpg";

import ProductCard from "../components/sections/ProductCard";
import Testimonials from "../components/sections/Testimonials";
import AskPanel from "../components/ask/AskPanel";
import { fetchAllProducts } from "../lib/shopify/productService";
import type { CatalogProduct } from "../lib/shopify/types";
import { HANDLES_WITH_OWN_CARD_ART } from "../data/productCardImages";
import { useMarket } from "../hooks/useMarket";
import { JOURNAL_ARTICLES } from "../data/journal";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

/*
impeccable:direction seed=brief-pinned/apple-health+nike
THESIS: A progression through one life, not a rack of sections. Refuses the supplement-store
product grid and the cream-and-serif wellness editorial this site previously wore.
OWN-WORLD: Warm-neutral ground, white grouped panels with hairline rules (Apple Health's
grouped-list grammar) cut against full-bleed human photography at Nike scale. Four health
domains own four colours, used as fills and marks and never as decoration. Satoshi 900
declaratives at -0.045em. No eyebrows anywhere.
STORY: I want that life -> that's me -> I could actually keep this up -> I trust it ->
I understand what it supports -> help me find my fit.
FIRST VIEWPORT: Light ground clearing the fixed header, 96px headline, ember "Find your fit"
pill, then the sunrise runners full-bleed edge to edge beneath.
FORM: Emotion -> Recognition -> Convenience -> Trust -> Understanding -> Bestsellers -> Quiz.
Direction brief-pinned (Apple Health + Nike), so the concept roll is skipped by the pin.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, and DESIGN.md
*/

const SCOPED_CSS = `
@keyframes bioRise {
  from { opacity: 0; transform: translate3d(0, 22px, 0); filter: blur(12px); }
  to   { opacity: 1; transform: none; filter: blur(0); }
}
.bio-home .bio-rise { animation: bioRise 1s cubic-bezier(0.16, 1, 0.3, 1) both; }

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

@keyframes bioSwash {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}
.bio-home .bio-swash path {
  stroke-dasharray: 1;
  pathLength: 1;
  animation: bioSwash 900ms cubic-bezier(0.16, 1, 0.3, 1) 250ms both;
}
@media (prefers-reduced-motion: reduce) {
  .bio-home .bio-swash path { animation: none; stroke-dashoffset: 0; }
}

/* Scroll reveal. The hidden state is applied by JS on mount, never in the stylesheet,
   so with JS unavailable the content simply renders visible instead of disappearing. */
.bio-home [data-anim] {
  transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}
.bio-home [data-anim="hidden"] { opacity: 0; transform: translate3d(0, 20px, 0); }
@media (prefers-reduced-motion: reduce) {
  .bio-home [data-anim] { transition: none; }
  .bio-home [data-anim="hidden"] { opacity: 1; transform: none; }
}
`;

const PILLARS = [
  {
    name: "Clarity",
    line: "Support focus, memory and mental sharpness.",
    Icon: Brain,
    color: "#3B54C4",
    tint: "rgba(59,84,196,0.10)",
    // Larger, softer wash for the pillar surfaces; the 10% tint above stays
    // for the small chips so the quiz row keeps its lighter touch.
    field: "rgba(59,84,196,0.13)",
  },
  {
    name: "Strength",
    line: "Support training, performance and physical capability.",
    Icon: Dumbbell,
    color: "#C1462A",
    // Ember on its own 10% tint computes to 4.37:1, just under the 4.5 floor,
    // so the chip takes the darker step. The other three clear it as-is.
    chipColor: "#A63A21",
    tint: "rgba(193,70,42,0.10)",
    field: "rgba(193,70,42,0.11)",
  },
  {
    name: "Recovery",
    line: "Support the systems that help the body reset and continue.",
    Icon: Waves,
    color: "#0E767A",
    tint: "rgba(14,118,122,0.10)",
    field: "rgba(14,118,122,0.13)",
  },
  {
    name: "Longevity",
    line: "Support the foundations of healthy ageing and long-term vitality.",
    Icon: InfinityIcon,
    color: "#2A6347",
    tint: "rgba(42,99,71,0.10)",
    field: "rgba(42,99,71,0.13)",
  },
] as const;

/*
 * Emotional headline leads, category label follows. The label sits below the
 * heading rather than above it, and stays in one muted neutral: "Daily Vitality"
 * has no pillar colour, and inventing a fifth accent would dilute the four-colour
 * system the quiz chips depend on.
 */
const STORIES = [
  {
    context: "Longevity",
    title: "Still first up the hill.",
    line: "Independence is worth protecting long before you need to think about it.",
    image: storyAgeing,
    alt: "An older couple hiking together along a mountain path",
    position: "object-[50%_38%]",
  },
  {
    context: "Focus & Clarity",
    title: "Sharp at 4pm, not just at 9am.",
    line: "The fifth meeting of the day still needs the best version of you.",
    image: storyWork,
    alt: "A man writing in a notebook at a sunlit desk",
    position: "object-[50%_42%]",
  },
  {
    context: "Strength & Recovery",
    title: "The session is only half of it.",
    line: "What you do afterwards decides whether you show up again tomorrow.",
    image: storyTraining,
    alt: "A woman resting on a low wall after training, with the sea behind her",
    position: "object-[52%_42%]",
  },
  {
    context: "Recovery",
    title: "Back to yourself, faster.",
    line: "After the training block, the overnight flight, the week that ran long.",
    image: storyRecovery,
    alt: "A quiet bedroom at night with moonlight over the water outside",
    position: "object-[58%_50%]",
  },
  {
    context: "Daily Vitality",
    title: "Energy that lasts the whole day.",
    line: "Support shaped around what your body is actually being asked to do.",
    image: storyVitality,
    alt: "A woman at home in the evening holding a BioAro supplement",
    position: "object-[62%_38%]",
  },
] as const;

/*
 * "One a day, whenever it actually suits you" was removed: the sachet directions
 * are "Mix 1 sachet with water daily", but Raw Power says "before or after
 * training" and Pro Power "during or after training", so flexible timing is not
 * supported across the range. Once-daily is; arbitrary timing is not.
 */
const CONVENIENCE_POINTS = [
  "Tears open in seconds",
  "Fits pockets, handbags and carry-ons",
  "No scoops. Nothing to measure.",
  "Built for travel",
  "One simple daily routine",
] as const;

/*
 * Drawn in the page's own stroke and type voice rather than using the supplied
 * seal PNGs. Those are opaque 1254px rasters, so each carries its own off-white
 * card and a baked-in strapline that is unreadable at any size on this page -
 * five of them side by side read as a certification wall. As a side effect this
 * also removes ~5.5MB of imagery that was being rendered at 138px.
 *
 * Note for whoever picks this up: src/assets/certifications/gluten-free.png
 * actually contains the NON-GMO artwork and non-gmo.png contains the GLUTEN FREE
 * artwork. The filenames are swapped at the source.
 */
const BADGES = [
  { label: "Non-GMO", Icon: Sprout },
  { label: "Gluten free", Icon: WheatOff },
  { label: "Sugar free", Icon: CandyOff },
  { label: "Nut free", Icon: NutOff },
  { label: "Vegan", Icon: Vegan },
] as const;

const EVIDENCE_POINTS = [
  {
    title: "Ingredient transparency",
    line: "Understand what you are taking and why. Plain language covering what each ingredient is, the dose, and the role it plays.",
  },
  {
    title: "Third-party tested",
    line: "Independently checked for purity and potency, rather than taken on our own word.",
  },
  {
    title: "Clear formulation philosophy",
    line: "Designed around practical everyday use, not around what looks impressive on a label.",
  },
  {
    title: "Formulation before marketing",
    line: "We avoid ingredients simply because they are fashionable. The evidence settles the formula first.",
  },
] as const;

/*
 * CLIENT-SUPPLIED CLAIM, isolated deliberately. This project cannot evidence it:
 * the confirmed-evidence record is third-party testing only, and PRODUCT.md lists
 * customer counts under "none established". Kept on the client's instruction.
 * Reconcile or delete this one line before launch.
 */
const TRUST_LINE =
  "Trusted by a hundred health experts and thousands of customers, and built to be judged on what is actually in the sachet.";

const JOURNAL_PICKS = JOURNAL_ARTICLES.slice(0, 3);

function PrimaryCta({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2.5 rounded-full bg-[#C1462A] px-7 py-4 text-[15px] font-bold tracking-[-0.01em] text-white shadow-[0_12px_28px_-14px_rgba(193,70,42,0.9)] transition-[background-color,transform] duration-200 hover:bg-[#A63A21] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A] motion-reduce:active:scale-100"
    >
      {children}
      <ArrowRight
        size={17}
        strokeWidth={2.4}
        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
      />
    </Link>
  );
}

function QuietLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-full py-2 text-[15px] font-bold text-[#1C1917] underline-offset-[6px] transition-colors hover:text-[#C1462A] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A]"
    >
      {children}
      <ArrowRight
        size={16}
        strokeWidth={2.4}
        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
      />
    </a>
  );
}

// Rest props are forwarded so callers can attach data-* hooks (the scroll reveal
// marks its targets with data-reveal); without this the heading silently opted out.
function SectionHeading({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...rest}
      className={`text-balance text-[34px] font-black leading-[0.98] tracking-[-0.035em] text-[#1C1917] sm:text-[44px] lg:text-[54px] ${className}`}
    >
      {children}
    </h2>
  );
}

/*
 * IntersectionObserver rather than a scroll listener: no per-frame work, and it
 * unobserves once an element has arrived so nothing keeps running down the page.
 */
function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el) => el.setAttribute("data-anim", "hidden"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-anim", "shown");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function Home() {
  const marketHref = useMarketHref();
  const railRef = useRef<HTMLDivElement | null>(null);
  const bestsellerRailRef = useRef<HTMLDivElement | null>(null);
  const convenienceRef = useScrollReveal<HTMLElement>();
  const storyRef = useScrollReveal<HTMLElement>();
  const { country } = useMarket();
  const [bestsellers, setBestsellers] = useState<CatalogProduct[]>([]);
  const [bestsellerState, setBestsellerState] = useState<"loading" | "ready" | "failed">("loading");

  const quizHref = marketHref(ROUTES.quiz);

  useEffect(() => {
    // Guard against a stale response landing last when the market changes quickly.
    let active = true;
    setBestsellerState("loading");

    fetchAllProducts(country, { preserveServerOrder: true })
      .then((products) => {
        if (!active) return;
        // Allowlist, not a denylist: only products with their own card photography.
        // Anything borrowing another product's art, or with none at all, is out.
        setBestsellers(products.filter((product) => HANDLES_WITH_OWN_CARD_ART.has(product.handle)));
        setBestsellerState("ready");
      })
      .catch(() => {
        // fetchAllProducts already falls back to the preview catalogue internally,
        // so reaching here means something is genuinely wrong. Fail quiet rather
        // than render a broken rail.
        if (active) setBestsellerState("failed");
      });

    return () => {
      active = false;
    };
  }, [country]);

  const scrollRail = useCallback((direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: rail.clientWidth * 0.72 * direction, behavior: "smooth" });
  }, []);

  const scrollBestsellers = useCallback((direction: 1 | -1) => {
    const rail = bestsellerRailRef.current;
    if (!rail) return;
    rail.scrollBy({ left: rail.clientWidth * 0.6 * direction, behavior: "smooth" });
  }, []);

  return (
    <div className="bio-home bg-[#F7F4EF] text-[#1C1917]">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* 1 - Emotion. The offer is the life, not the product. */}
      <section className="px-5 pt-[116px] sm:px-8 sm:pt-[140px] lg:px-12 lg:pt-[162px]">
        <div className="mx-auto max-w-[1240px]">
          <h1 className="bio-rise max-w-[15ch] text-balance text-[46px] font-black leading-[0.92] tracking-[-0.045em] text-[#1C1917] sm:text-[68px] lg:text-[88px] xl:text-[96px]">
            Keep more of what makes life yours.
          </h1>
          <div
            className="bio-rise mt-8 space-y-1.5 text-[20px] font-medium leading-[1.35] tracking-[-0.02em] text-[#2E3238] sm:text-[24px] lg:text-[27px]"
            style={{ animationDelay: "90ms" }}
          >
            <p>For the work you still want to do.</p>
            <p>The people you want to show up for.</p>
            <p>And the years you want to feel like yourself.</p>
          </div>
          <p
            className="bio-rise mt-6 max-w-[46ch] text-[16px] leading-[1.6] text-[#6B7078] sm:text-[17px]"
            style={{ animationDelay: "150ms" }}
          >
            Practical, science-led support designed to fit real life.
          </p>
          <div
            className="bio-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
            style={{ animationDelay: "220ms" }}
          >
            <div>
              <PrimaryCta to={quizHref}>Find your fit</PrimaryCta>
              <p className="mt-2.5 pl-1 text-[13px] font-medium text-[#5F646B]">
                2-minute wellness quiz
              </p>
            </div>
            <QuietLink href="#our-approach">Explore our approach</QuietLink>
          </div>
        </div>
      </section>

      <div
        className="bio-rise mt-12 overflow-hidden sm:mt-16 lg:mt-20"
        style={{ animationDelay: "260ms" }}
      >
        <img
          src={heroRunnersSunrise}
          alt="Four runners moving together at sunrise, a city skyline behind them"
          width={1774}
          height={887}
          fetchPriority="high"
          decoding="async"
          className="h-[46vh] min-h-[280px] w-full object-cover object-[60%_center] sm:h-[56vh] lg:h-[62vh] lg:max-h-[620px]"
        />
      </div>

      {/* 2 - Recognition. Five lives; the visitor should find themselves in one of them. */}
      <section id="use-cases" className="scroll-mt-[128px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading className="max-w-[16ch]">
              Different lives. Same thing worth keeping.
            </SectionHeading>
            <div className="flex shrink-0 gap-2.5">
              <button
                type="button"
                onClick={() => scrollRail(-1)}
                aria-label="Show previous stories"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DEDBD5] bg-white text-[#1C1917] transition-[border-color,transform] duration-200 hover:border-[#1C1917] active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1917] motion-reduce:active:scale-100"
              >
                <ChevronLeft size={19} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => scrollRail(1)}
                aria-label="Show more stories"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DEDBD5] bg-white text-[#1C1917] transition-[border-color,transform] duration-200 hover:border-[#1C1917] active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C1917] motion-reduce:active:scale-100"
              >
                <ChevronRight size={19} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <div
            ref={railRef}
            role="group"
            aria-label="Lifestyle stories"
            tabIndex={0}
            className="rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A] bio-rail -mx-5 mt-11 flex gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
          >
            {STORIES.map((story) => (
              <article key={story.context} className="w-[86vw] shrink-0 sm:w-[54vw] lg:w-[36%] xl:w-[27.5%]">
                <div className="aspect-[4/5] overflow-hidden rounded-[28px] bg-[#E7E4DE]">
                  <img
                    src={story.image}
                    alt={story.alt}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover ${story.position}`}
                  />
                </div>
                <h3 className="mt-6 text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-[#1C1917] sm:min-h-[62px] sm:text-[28px]">
                  {story.title}
                </h3>
                <p className="mt-2 text-[13px] font-bold tracking-[0.01em] text-[#8A8078]">
                  {story.context}
                </p>
                <p className="mt-3 text-pretty text-[15.5px] leading-[1.55] text-[#545961]">{story.line}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3 - Convenience. Where BioAro becomes something you could actually keep up. */}
      {/* Out of the boxed white panel the other sections use: this is the one place
          BioAro has a differentiator competitors cannot copy, so it gets the largest
          type on the page after the hero and the photography leads rather than sits
          beside the copy. Two moments, not one, because the claim is "wherever the
          day goes" - a post-training garden room and a weekday kitchen make that
          argument in a way a single still life cannot. */}
      <section ref={convenienceRef} className="px-5 pb-24 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-[1240px]">
          {/* Two sentences, so the break is set at the sentence boundary rather than
              left to wrapping, which fragmented this into four ragged lines at 64px. */}
          <SectionHeading data-reveal className="!text-[38px] sm:!text-[52px] lg:!text-[60px]">
            <span className="block">One sachet.</span>
            <span className="block">Wherever the day goes.</span>
          </SectionHeading>

          <p
            data-reveal
            style={{ ["--reveal-delay" as string]: "80ms" }}
            className="mt-7 max-w-[52ch] text-pretty text-[18px] leading-[1.6] text-[#4A4F57] sm:text-[20px]"
          >
            Single-serve sachets made for real routines. Tear, pour, go. At home, at work or
            wherever the day takes you.
          </p>
          {/* Adherence is the strategic point, so it stays; demoted to a secondary line
              so the lead paragraph can be short. */}
          <p
            data-reveal
            style={{ ["--reveal-delay" as string]: "140ms" }}
            className="mt-4 max-w-[52ch] text-pretty text-[15.5px] leading-[1.6] text-[#6B7078]"
          >
            The difference between a routine you keep and one that quietly stops in week two.
          </p>

          <div className="mt-12 grid gap-4 lg:grid-cols-[1.42fr_1fr]">
            <div
              data-reveal
              style={{ ["--reveal-delay" as string]: "180ms" }}
              className="group overflow-hidden rounded-[32px] bg-[#E7E4DE]"
            >
              <img
                src={routineTraining}
                alt="A man in training kit tipping a CREAGEN sachet into a shaker on a bench in a garden room"
                width={1500}
                height={1120}
                loading="lazy"
                decoding="async"
                className="h-full min-h-[300px] w-full object-cover object-[46%_center] transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transform-none sm:min-h-[420px] lg:min-h-[520px]"
              />
            </div>
            <div
              data-reveal
              style={{ ["--reveal-delay" as string]: "280ms" }}
              className="group overflow-hidden rounded-[32px] bg-[#E7E4DE]"
            >
              <img
                src={routineMorning}
                alt="A woman pouring a sachet into a glass of water in a bright kitchen at breakfast"
                width={1100}
                height={1100}
                loading="lazy"
                decoding="async"
                className="h-full min-h-[300px] w-full object-cover object-[52%_center] transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transform-none sm:min-h-[420px] lg:min-h-[520px]"
              />
            </div>
          </div>

          {/* The proof points drop to a quiet row beneath so the imagery carries the
              section rather than competing with a column of text beside it. */}
          <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {CONVENIENCE_POINTS.map((point, index) => (
              <li
                key={point}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${index * 70}ms` }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(42,99,71,0.10)] text-[#2A6347]">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-[15.5px] leading-[1.5] text-[#2E3238]">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 - Trust. Small, factual and per-product. Deliberately not a certification wall. */}
      <section className="border-y border-[#E5E2DC] bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeading className="max-w-[18ch] !text-[30px] sm:!text-[38px] lg:!text-[42px]">
                What we leave out matters too.
              </SectionHeading>
              <p className="mt-5 max-w-[46ch] text-pretty text-[16px] leading-[1.6] text-[#545961]">
                Third-party tested for purity and potency. Product attributes apply per product, as
                stated on each label.
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5">
              {BADGES.map((badge) => (
                <li key={badge.label} className="flex flex-col items-start gap-3.5">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D5DBD3] text-[#2A6347]">
                    <badge.Icon size={30} strokeWidth={1.5} />
                  </span>
                  <span className="text-[14.5px] font-bold tracking-[-0.015em] text-[#2E3238]">
                    {badge.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5 - Understanding. Apple Health's grouped list: four domains, four colours. */}
      <section id="our-approach" className="scroll-mt-[128px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading className="max-w-[12ch]">What BioAro supports.</SectionHeading>
          <p className="mt-6 max-w-[56ch] text-[17px] leading-[1.6] text-[#545961]">
            Four areas, explained plainly. This is not a catalogue, just what we work on.
          </p>

          {/* Soft tinted colour worlds rather than a grouped list. No imagery: the
              repo has no coherent four-image set (two abstract science renders, a
              sepia sprinter and a blue night photo, in three clashing treatments),
              and a mismatched set would read worse than colour. */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.name}
                className="group flex min-h-[248px] flex-col justify-between rounded-[30px] px-8 py-9 transition-transform duration-500 hover:-translate-y-1 motion-reduce:transform-none sm:min-h-[288px] sm:px-10 sm:py-11"
                style={{ backgroundColor: pillar.field }}
              >
                <span
                  className="flex h-[62px] w-[62px] items-center justify-center rounded-[20px] bg-white/70 transition-transform duration-500 group-hover:scale-[1.05] motion-reduce:transform-none"
                  style={{ color: pillar.color }}
                >
                  <pillar.Icon size={28} strokeWidth={1.8} />
                </span>
                <div className="mt-10">
                  <h3
                    className="text-[30px] font-black tracking-[-0.035em] sm:text-[36px]"
                    style={{ color: pillar.color }}
                  >
                    {pillar.name}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[16.5px] leading-[1.5] text-[#4A4F57] sm:text-[17.5px]">
                    {pillar.line}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 - Bestsellers. Real Shopify BEST_SELLING order when the store is
          connected; the curated order otherwise. No star ratings or review counts:
          the rating values in the catalogue are hand-typed and include a 4.8 average
          with zero reviews, so there is nothing honest to render. */}
      {bestsellerState !== "failed" && (
        <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-balance text-[34px] font-black leading-[0.98] tracking-[-0.035em] text-[#1C1917] sm:text-[44px] lg:text-[54px]">
                Our{" "}
                <span className="relative inline-block">
                  bestsellers
                  {/* top-full anchors it under the inline box so it underlines rather
                      than striking through; the small pull-up closes the gap. */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 730 34"
                    preserveAspectRatio="none"
                    className="bio-swash absolute left-0 top-full -mt-2 h-[0.22em] w-full text-[#C1462A]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={14}
                    strokeLinecap="round"
                  >
                    <path d="M14 24C70 12 148 6 310 4c55 0 196 0 404 12" />
                  </svg>
                </span>
              </h2>
              <p className="mt-6 max-w-[46ch] text-pretty text-[17px] leading-[1.6] text-[#545961]">
                The formulas people come back for.
              </p>

              <div className="mt-8 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => scrollBestsellers(-1)}
                  aria-label="Show previous products"
                  aria-controls="bestseller-rail"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DEDBD5] bg-white text-[#1C1917] transition-colors hover:border-[#1C1917] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1462A]"
                >
                  <ChevronLeft size={19} strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBestsellers(1)}
                  aria-label="Show more products"
                  aria-controls="bestseller-rail"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DEDBD5] bg-white text-[#1C1917] transition-colors hover:border-[#1C1917] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1462A]"
                >
                  <ChevronRight size={19} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Height reserved so nothing below shifts when the data lands. */}
            <div className="mt-11 min-h-[468px]">
              {bestsellerState === "loading" ? (
                <div aria-hidden="true" className="flex gap-5 overflow-hidden">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="h-[452px] w-[78vw] shrink-0 animate-pulse rounded-[18px] border border-[#E1DED8] bg-[#F0EBE3] sm:w-[46vw] lg:w-[31%] xl:w-[24%]"
                    />
                  ))}
                </div>
              ) : (
                <div
                  ref={bestsellerRailRef}
                  id="bestseller-rail"
                  role="group"
                  aria-label="Bestselling products"
                  tabIndex={0}
                  className="bio-rail -mx-5 flex gap-5 overflow-x-auto px-5 pb-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
                >
                  {bestsellers.map((product) => (
                    <div
                      key={product.handle}
                      className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[31%] xl:w-[24%]"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 7 - Evidence. Restraint is the credibility asset with this audience. */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeading className="max-w-[10ch] lg:!text-[62px]">
                Evidence, not noise.
              </SectionHeading>
              <p className="mt-6 max-w-[46ch] text-pretty text-[18px] leading-[1.55] text-[#4A4F57] sm:text-[19px]">
                Restraint is the point. We would rather say less and be right than promise an
                outcome we cannot stand behind.
              </p>
              <dl className="mt-11 space-y-8">
                {EVIDENCE_POINTS.map((point) => (
                  <div key={point.title} className="border-t border-[#E1DED8] pt-5">
                    <dt className="text-[19px] font-bold tracking-[-0.025em] text-[#1C1917]">
                      {point.title}
                    </dt>
                    <dd className="mt-2 max-w-[52ch] text-pretty text-[15.5px] leading-[1.6] text-[#545961]">
                      {point.line}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="overflow-hidden rounded-[28px] bg-[#E9E6E0]">
              <img
                src={evidenceFormulation}
                alt="Formulation bench: beakers, test tubes, a powdered ingredient in a petri dish and handwritten notes"
                width={960}
                height={1200}
                loading="lazy"
                decoding="async"
                className="h-full max-h-[640px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8 - Founder section removed at the client's request (2026-08-13). The page
          currently states no "why BioAro exists" belief; restore this block when a
          confirmed founder name and portrait exist. */}

      {/* 8 - Ask BioAro. Deliberately framed as "have questions", not "tell us your
          goal": this answers, the quiz chooses. A recommendation-style question here
          hands off to the quiz rather than duplicating it. Sits after Evidence so the
          reader has the context to ask something specific, and before the quiz so the
          two read as a pair. */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="rounded-[32px] bg-white px-7 py-14 shadow-[0_28px_60px_-46px_rgba(28,25,23,0.45)] sm:px-12 sm:py-16 lg:px-16">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
              <div>
                <SectionHeading className="max-w-[14ch] !text-[34px] sm:!text-[42px] lg:!text-[48px]">
                  Have questions? Ask BioAro.
                </SectionHeading>
                <p className="mt-6 max-w-[46ch] text-pretty text-[17px] leading-[1.6] text-[#545961]">
                  Ingredients, sachets, routines, testing, or what each of the four areas actually
                  covers. Ask in your own words.
                </p>
                <QuietLink href="#use-cases">See use cases</QuietLink>
              </div>

              <AskPanel />
            </div>
          </div>
        </div>
      </section>

      {/* 9 - Conversion climax. The page has earned the ask by this point. */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="rounded-[36px] bg-white px-7 py-20 text-center shadow-[0_36px_80px_-52px_rgba(28,25,23,0.5)] sm:px-14 sm:py-28">
            <SectionHeading className="mx-auto max-w-[15ch] !text-[40px] sm:!text-[54px] lg:!text-[68px]">
              Find what actually fits you.
            </SectionHeading>
            <p className="mx-auto mt-7 max-w-[56ch] text-pretty text-[18px] leading-[1.6] text-[#4A4F57] sm:text-[19px]">
              A few questions about your routine, goals and what you want more of. We&apos;ll help
              point you toward the BioAro support that makes sense for you.
            </p>

            {/* The four domains double as the first choice of the quiz, so the colour
                system established above becomes the way in rather than mere decoration. */}
            <p className="mt-12 text-[14px] font-bold text-[#6B7078]">
              What matters most right now?
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {PILLARS.map((pillar) => (
                <Link
                  key={pillar.name}
                  to={quizHref}
                  className="rounded-full px-6 py-3 text-[16px] font-bold transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none"
                  style={{
                    backgroundColor: pillar.tint,
                    color: "chipColor" in pillar ? pillar.chipColor : pillar.color,
                    outlineColor: pillar.color,
                  }}
                >
                  {pillar.name}
                </Link>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
              <div>
                <PrimaryCta to={quizHref}>Find my fit</PrimaryCta>
                <p className="mt-2.5 text-[13px] font-medium text-[#5F646B]">About 2 minutes</p>
              </div>
              <QuietLink href="#use-cases">See use cases</QuietLink>
            </div>
          </div>
        </div>
      </section>

      {/* 9b - Trust band. The figure below is a CLIENT-SUPPLIED claim, not something
          this project can evidence: PRODUCT.md records customer counts as "none
          established", and the confirmed-evidence list is third-party testing only.
          Isolated to TRUST_LINE so it is one edit to reconcile or remove. */}
      <section ref={storyRef} className="pb-24 sm:pb-28 lg:pb-32">
        <div className="px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <div data-reveal className="relative overflow-hidden rounded-[32px] bg-[#1C1917]">
              <img
                src={storyBand}
                alt=""
                aria-hidden="true"
                width={1800}
                height={1013}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(100deg, rgba(20,16,13,0.90) 0%, rgba(20,16,13,0.72) 38%, rgba(20,16,13,0.30) 68%, rgba(20,16,13,0.10) 100%)",
                }}
              />
              <div className="relative z-10 px-7 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
                <p className="max-w-[20ch] text-balance text-[30px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-[40px] lg:text-[48px]">
                  Built for the life you are already living.
                </p>
                <p className="mt-6 max-w-[46ch] text-pretty text-[16.5px] leading-[1.6] text-white/80 sm:text-[18px]">
                  {TRUST_LINE}
                </p>
                <div className="mt-9">
                  <PrimaryCta to={quizHref}>Find your fit</PrimaryCta>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      <Testimonials />

      {/* 10 - Journal. Deliberately quiet: the exit for readers, not the main path. */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading className="!text-[28px] sm:!text-[34px] lg:!text-[38px]">
              Ideas for living well.
            </SectionHeading>
            <Link
              to={marketHref(ROUTES.journal)}
              className="group inline-flex items-center gap-2 self-start rounded-full text-[15px] font-bold text-[#1C1917] underline-offset-[6px] transition-colors hover:text-[#C1462A] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A] md:self-auto"
            >
              Read the journal
              <ArrowRight
                size={16}
                strokeWidth={2.4}
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          </div>

          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {JOURNAL_PICKS.map((article) => (
              <Link
                key={article.slug}
                to={marketHref(`${ROUTES.journal}/${article.slug}`)}
                className="group rounded-[24px] transition-transform duration-200 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A] motion-reduce:active:scale-100"
              >
                <div className="aspect-[3/2] overflow-hidden rounded-[24px] bg-[#E7E4DE]">
                  <img
                    src={article.img}
                    alt={article.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
                  />
                </div>
                <h3 className="mt-4 text-balance text-[19px] font-bold leading-[1.2] tracking-[-0.025em] text-[#1C1917] group-hover:underline group-hover:decoration-[#C1462A] group-hover:underline-offset-[5px]">
                  {article.title}
                </h3>
                <p className="mt-2 text-pretty text-[15px] leading-[1.55] text-[#545961]">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11 - Close. Return to the promise, with the quiz as the natural next step. */}
      <section className="relative overflow-hidden">
        <img
          src={closingScene}
          alt=""
          aria-hidden="true"
          width={1800}
          height={1013}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[58%_26%]"
        />
        {/* Weighted to the left so the copy stays legible while the golden light on the
            right survives, rather than flattening the whole frame to grey. Warm charcoal
            rather than a neutral black so the scrim sits in the page's own temperature. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(20,16,13,0.90) 0%, rgba(20,16,13,0.74) 34%, rgba(20,16,13,0.38) 62%, rgba(20,16,13,0.12) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(20,16,13,0.32) 0%, rgba(20,16,13,0) 42%)",
          }}
        />
        <div className="relative z-10 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="max-w-[14ch] text-balance text-[38px] font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-[52px] lg:text-[64px]">
              Keep living like yourself.
            </h2>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-white/85 sm:text-[19px]">
              More mornings. More movement. More of the things you would hate to give up.
            </p>
            <div className="mt-9">
              <PrimaryCta to={quizHref}>Find your fit</PrimaryCta>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
