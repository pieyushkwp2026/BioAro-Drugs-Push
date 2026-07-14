import { ClipboardCheck, FlaskConical, Leaf, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

const PILLARS = [
  {
    icon: FlaskConical,
    title: "Research first",
    desc: "We explain the evidence behind each formula in clear, practical language.",
  },
  {
    icon: ShieldCheck,
    title: "Clear disclaimers",
    desc: "Clear safety, policy, and disclaimer information helps you make informed decisions in your region.",
  },
  {
    icon: ClipboardCheck,
    title: "Routine structure",
    desc: "Product pages bring together dosage, warnings, supplement facts, and routine guidance in one place.",
  },
  {
    icon: Leaf,
    title: "Quality pathway",
    desc: "Quality information is shared clearly whenever product-specific documentation is available.",
  },
];

const STEPS = [
  {
    title: "Start with your goal",
    desc: "Start with the routine need: focus, longevity, recovery, sleep, or foundational daily support.",
  },
  {
    title: "Understand the formula",
    desc: "See what the product supports, when it fits into your day, and how it may complement your routine.",
  },
  {
    title: "Make guidance visible",
    desc: "Find dosage, warnings, supplement facts, and common questions alongside the product information.",
  },
  {
    title: "Find help when you need it",
    desc: "Shipping, returns, safety, and support information are available whenever you have a question.",
  },
];

export default function Science() {
  const marketHref = useMarketHref();

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <span className="eyebrow">Science &amp; quality</span>
        <h1 className="mt-3 max-w-2xl text-4xl md:text-5xl">Better wellness starts with better information.</h1>
        <p className="mt-5 max-w-2xl text-ink/55 leading-relaxed">
          BioAro explains the evidence, ingredients, and practical guidance behind each formula so you can choose and use products with more confidence.
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="glass-card p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full glass">
                <pillar.icon size={17} className="text-forest-600" />
              </div>
              <h2 className="text-lg">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-3xl">From questions to informed choices.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.title} className="glass-card p-6">
                <span className="text-xs text-ink/35">0{index + 1}</span>
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-dark mt-24 grid gap-10 rounded-4xl p-12 text-cream md:grid-cols-2 md:p-16">
          <div>
            <h2 className="text-3xl md:text-4xl">Understand your routine. Take action with confidence.</h2>
            <p className="mt-4 leading-relaxed text-cream/60">
              Explore practical health education from BioAro Labs alongside formulas designed to support everyday routines from BioAro Drugs.
            </p>
          </div>
          <div className="flex items-end">
            <Link to={marketHref(ROUTES.living)} className="btn-secondary !bg-white/10 !text-cream hover:!bg-white/15">
              Explore Living 2.0
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
