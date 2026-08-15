import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import aboutHeroProtocolPreparation from "../assets/about/about-hero-protocol-preparation.jpg";
import labGlasswareStudy from "../assets/science/lab-glassware-study.jpg";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

export default function About() {
  const marketHref = useMarketHref();

  return (
    <main className="overflow-hidden">
      <section className="relative isolate min-h-[680px] overflow-hidden bg-cream md:min-h-[760px]">
        <img
          src={aboutHeroProtocolPreparation}
          alt="Hand preparing a BioAro Drugs Creagen drink alongside the BioAro Drugs product range"
          className="absolute inset-0 h-full w-full object-cover object-[60%_47%] transition-transform duration-700 hover:scale-[1.015] motion-reduce:transition-none motion-reduce:hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/20 to-transparent md:via-cream/30" />
        <div className="container-bio relative flex min-h-[680px] items-center py-24 md:min-h-[760px]">
          <div className="max-w-xl">
            <span className="eyebrow">About BioAro Drugs</span>
            <h1 className="mt-5 max-w-lg text-5xl leading-[0.95] md:text-7xl">
              A better future for everyday health.
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-ink/65 md:text-lg">
              BioAro Drugs exists to make better health decisions easier through evidence, transparency, and practical education.
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
            {/* "Founded in Canada · 2021" was removed on 16 Aug 2026 alongside the
                "Formulated in Canada" product claim. The country could not be
                reconciled with the London and San Jose addresses in the footer, and a
                founding country asserted here while the rest of the site says
                something else reads as carelessness on a health brand. The year is
                kept because it is not in dispute. */}
            <span className="eyebrow">Founded 2021</span>
            <h2 className="mt-4 max-w-md text-4xl leading-tight md:text-5xl">
              Built from a search for supplements that truly work.
            </h2>
          </div>
          <div className="max-w-xl self-end">
            <p className="text-base leading-relaxed text-ink/65 md:text-lg">
              BioAro Drugs is a family-founded company, born from a simple search for supplements that delivered meaningful results. When we could not find what we were looking for, we set out to create it ourselves.
            </p>
            <blockquote className="mt-8 border-l-2 border-forest-600 pl-5 font-display text-2xl italic leading-snug text-forest-700 md:text-3xl">
              By bringing together science, innovation, and premium ingredients, we develop high-quality formulations designed to support long-term health and wellbeing.
            </blockquote>
            <a
              href="https://bioaro.com"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-forest-600 transition-all hover:gap-3"
            >
              Visit BioAro.com <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/*
        * TWO SECTIONS WERE REMOVED HERE. Do not restore either one to this page.
        *
        * "Our principles" — Science first / Complete transparency / Built for the long
        * term. The homepage Why section makes the same three arguments at greater
        * length, and /science and /living-2-0 each carried a third and fourth copy of
        * the list. Four statements of one idea across four pages is not emphasis, it is
        * a site with nothing new to say on any page after the first. The homepage keeps
        * it; every other page dropped it.
        *
        * "Our ecosystem" — Labs → Drugs → Daily Routine → Better Outcomes. The identical
        * four nodes are the centrepiece of /living-2-0, which is the page whose whole
        * subject is that model. About now points there rather than redrawing it.
        */}

      <section className="container-bio py-8 md:py-12">
        <div className="grid overflow-hidden rounded-[32px] bg-white shadow-glass md:grid-cols-2">
          <div className="min-h-[360px] overflow-hidden md:min-h-[560px]">
            {/*
              * KNOWN ISSUE, LEFT VISIBLE ON PURPOSE — this photograph needs replacing.
              *
              * Its left third is a dark panel with TEXT BURNED INTO THE JPEG: "Premium
              * Inputs / Traceable, high-quality ingredients", "Rigorous Testing /
              * Third-party tested for purity and potency", "Real Outcomes /
              * Evidence-led formulation for everyday results". That is a fourth copy of
              * the principles list this page just dropped, and another statement of the
              * third-party testing claim — inside an image, where no content edit can
              * reach it.
              *
              * Reframing was tried and is worse: this container is close to square, so
              * even object-right leaves the panel half in shot and clips the words
              * mid-letter. The fix is a new photograph without type in it, which is a
              * design deliverable, not a copy change. Until then the image ships as it
              * was rather than looking broken.
              */}
            <img
              src={labGlasswareStudy}
              alt="Laboratory glassware and formulation notes arranged for research"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
            <span className="eyebrow">Science backed. Human focused.</span>
            <h2 className="mt-4 max-w-md text-4xl leading-tight md:text-5xl">Behind every formula is a thoughtful process.</h2>
            {/* The four-step list that sat here — evidence review, ingredient selection,
                formulation design, quality assurance — is the same process /science
                sets out as its science journey. The section now points at it instead of
                restating it, which is what the link underneath was always for. */}
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
              From evidence review through ingredient selection, formulation and quality checks — set
              out step by step on the science page.
            </p>
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
          <p className="relative mt-6 text-sm font-medium text-forest-600">BioAro Drugs</p>
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
              {/* The handoff that replaces the ecosystem diagram removed above. It
                  names where that model now lives instead of drawing it twice. */}
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                How testing, formulas and daily routines fit together is set out in Living 2.0.
              </p>
            </div>
            <div className="relative flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <Link to={marketHref(ROUTES.shop)} className="btn-primary">
                Explore products <ArrowRight size={16} />
              </Link>
              <Link to={marketHref(ROUTES.living)} className="btn-secondary border-white/40 text-white hover:bg-white/10">
                Living 2.0 <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
