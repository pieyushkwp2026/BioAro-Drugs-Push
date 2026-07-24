import {
  ArrowRight,
  CalendarDays,
  FlaskConical,
  Heart,
  Leaf,
  Microscope,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import aboutHeroProtocolPreparation from "../assets/about/about-hero-protocol-preparation.png";
import labGlasswareStudy from "../assets/science/lab-glassware-study.png";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

const principles = [
  {
    icon: FlaskConical,
    title: "Science first",
    body: "Every formula begins with evidence. We look at the research before everything else.",
  },
  {
    icon: ShieldCheck,
    title: "Complete transparency",
    body: "We show what is in our products, why it is there, and how much of each ingredient is included.",
  },
  {
    icon: Heart,
    title: "Built for the long term",
    body: "Clear formulas and practical guidance support consistent daily routines over time.",
  },
];

const ecosystem = [
  { icon: Microscope, title: "BioAro Labs", body: "We study ingredients, biology, and real-world context." },
  { icon: FlaskConical, title: "BioAro Drugs", body: "We create practical formulas with purpose and transparency." },
  { icon: CalendarDays, title: "Daily Routine", body: "You use the right information to build better habits." },
  { icon: TrendingUp, title: "Better Outcomes", body: "Small daily choices lead to meaningful long-term results." },
];

const formulationSteps = [
  { title: "Evidence review", body: "We evaluate scientific research and ingredient data." },
  { title: "Ingredient selection", body: "We choose forms and amounts with a clear purpose." },
  { title: "Formulation design", body: "We build formulas that work together, not against each other." },
  { title: "Quality assurance", body: "We review quality information for purity, potency, and consistency." },
];

export default function About() {
  const marketHref = useMarketHref();

  return (
    <main className="overflow-hidden">
      <section className="relative isolate min-h-[680px] overflow-hidden bg-cream md:min-h-[760px]">
        <img
          src={aboutHeroProtocolPreparation}
          alt="Hand preparing a BioAro Creagen drink alongside the BioAro product range"
          className="absolute inset-0 h-full w-full object-cover object-[60%_47%] transition-transform duration-700 hover:scale-[1.015] motion-reduce:transition-none motion-reduce:hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/20 to-transparent md:via-cream/30" />
        <div className="container-bio relative flex min-h-[680px] items-center py-24 md:min-h-[760px]">
          <div className="max-w-xl">
            <span className="eyebrow">About BioAro</span>
            <h1 className="mt-5 max-w-lg text-5xl leading-[0.95] md:text-7xl">
              A better future for everyday health.
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-ink/65 md:text-lg">
              BioAro exists to make better health decisions easier through evidence, transparency, and practical education.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={marketHref(ROUTES.shop)} className="btn-primary">
                Explore our products <ArrowRight size={16} />
              </Link>
              <Link to={marketHref(ROUTES.science)} className="btn-secondary">
                Explore our science <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-bio py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-24">
          <div>
            <span className="eyebrow">Our purpose</span>
            <h2 className="mt-4 max-w-md text-4xl leading-tight md:text-5xl">
              Our mission isn&apos;t to sell supplements. It&apos;s to help you make better health decisions.
            </h2>
          </div>
          <div className="max-w-xl self-end">
            <p className="text-base leading-relaxed text-ink/65 md:text-lg">
              The wellness space is noisy and confusing. We believe clarity creates confidence. That&apos;s why we explain the evidence, the ingredients, and the reasoning behind every formula.
            </p>
            <blockquote className="mt-8 border-l-2 border-forest-600 pl-5 font-display text-2xl italic leading-snug text-forest-700 md:text-3xl">
              “Better health decisions start with better understanding, clearer action, and routines that customers can actually stay with.”
            </blockquote>
            <Link to={marketHref(ROUTES.living)} className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-forest-600 transition-all hover:gap-3">
              Read the Living 2.0 approach <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-bio border-t border-sand py-16 md:py-20">
        <span className="eyebrow">Our principles</span>
        <div className="mt-8 grid divide-y divide-sand md:grid-cols-3 md:divide-x md:divide-y-0">
          {principles.map(({ icon: Icon, title, body }) => (
            <article key={title} className="py-7 first:pt-0 last:pb-0 md:px-8 md:py-2 first:md:pl-0 last:md:pr-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest-600">
                <Icon size={20} strokeWidth={1.7} />
              </div>
              <h2 className="mt-5 text-xl">{title}</h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60 md:text-base">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-bio border-t border-sand py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-20">
          <div>
            <span className="eyebrow">Our ecosystem</span>
            <h2 className="mt-4 max-w-sm text-4xl leading-tight md:text-5xl">From research to real-world impact.</h2>
          </div>
          <div className="grid gap-8 border-l border-sand pl-6 sm:grid-cols-2 md:grid-cols-4 md:gap-0 md:border-l-0 md:pl-0">
            {ecosystem.map(({ icon: Icon, title, body }, index) => (
              <article key={title} className="relative md:border-l md:border-sand md:px-5 first:md:border-l-0 first:md:pl-0 last:md:pr-0">
                <div className="absolute -left-[35px] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-sand bg-cream text-forest-600 sm:-left-[35px] md:static md:mb-5 md:h-12 md:w-12">
                  <Icon size={15} className="md:h-5 md:w-5" strokeWidth={1.7} />
                </div>
                <span className="text-xs font-semibold text-gold-600">0{index + 1}</span>
                <h3 className="mt-2 text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-bio py-8 md:py-12">
        <div className="grid overflow-hidden rounded-[32px] bg-white shadow-glass md:grid-cols-2">
          <div className="min-h-[360px] overflow-hidden md:min-h-[560px]">
            <img
              src={labGlasswareStudy}
              alt="Lab glassware, formulation notes, and BioAro products arranged for research"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
            <span className="eyebrow">Science backed. Human focused.</span>
            <h2 className="mt-4 max-w-md text-4xl leading-tight md:text-5xl">Behind every formula is a thoughtful process.</h2>
            <div className="mt-8 space-y-5">
              {formulationSteps.map(({ title, body }, index) => (
                <div key={title} className="flex gap-4 border-b border-sand pb-5 last:border-0 last:pb-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-xs font-semibold text-forest-600">0{index + 1}</span>
                  <div>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/55">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to={marketHref(ROUTES.science)} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-forest-600 transition-all hover:gap-3">
              Explore our science standards <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-bio py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[28px] border border-sand bg-white px-7 py-14 text-center md:px-16 md:py-20">
          <Leaf className="absolute -left-3 top-8 h-28 w-28 rotate-[-25deg] text-forest/10 md:left-10 md:h-40 md:w-40" strokeWidth={1} />
          <Leaf className="absolute -right-5 bottom-4 h-24 w-24 rotate-[35deg] text-gold/20 md:right-12 md:h-36 md:w-36" strokeWidth={1} />
          <blockquote className="relative mx-auto max-w-3xl font-display text-3xl leading-tight md:text-5xl">
            “We believe everyone deserves clear, honest information so they can take control of their health.”
          </blockquote>
          <p className="relative mt-6 text-sm font-medium text-forest-600">— BioAro</p>
        </div>
      </section>

      <section className="container-bio pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-[32px] bg-forest-700 px-8 py-14 text-white md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10">
            <div className="absolute inset-10 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-gold-400/60" />
          </div>
          <div className="relative flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="eyebrow text-white/70">Ready to take the next step?</span>
              <h2 className="mt-4 text-4xl leading-tight text-white md:text-6xl">Better information. Better decisions. Better health.</h2>
            </div>
            <div className="relative flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <Link to={marketHref(ROUTES.shop)} className="btn-primary bg-white text-ink hover:bg-cream">
                Explore products <ArrowRight size={16} />
              </Link>
              <Link to={marketHref(ROUTES.science)} className="btn-secondary border-white/40 text-white hover:bg-white/10">
                Explore the science <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
