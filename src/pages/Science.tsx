import { ClipboardCheck, FlaskConical, Leaf, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const PILLARS = [
  {
    icon: FlaskConical,
    title: "Research first",
    desc: "Product storytelling starts from evidence and practical use cases, then gets translated into plain-language guidance.",
  },
  {
    icon: ShieldCheck,
    title: "Clear disclaimers",
    desc: "Market-specific policy and disclaimer blocks help keep the experience responsible for different launch regions.",
  },
  {
    icon: ClipboardCheck,
    title: "Routine structure",
    desc: "Products are presented with dosage, warnings, supplement facts, and protocol context instead of vague merchandising language.",
  },
  {
    icon: Leaf,
    title: "Quality pathway",
    desc: "Quality information is built so customer-facing proof assets can be added as documentation is finalized.",
  },
];

const STEPS = [
  {
    title: "Identify the customer goal",
    desc: "Start with the routine need: focus, longevity, recovery, sleep, or foundational daily support.",
  },
  {
    title: "Explain the product fit",
    desc: "Show what the product is for, where it sits in the day, and what it pairs with in a broader stack.",
  },
  {
    title: "Make guidance visible",
    desc: "Keep dosage, warnings, supplement facts, and FAQ content close to the add-to-cart decision.",
  },
  {
    title: "Connect support surfaces",
    desc: "Use shipping, returns, disclaimer, and support pages to answer questions before they become friction.",
  },
];

export default function Science() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-bio">
        <span className="eyebrow">Science & structure</span>
        <h1 className="mt-3 max-w-2xl text-4xl md:text-5xl">A premium wellness storefront needs more than a product grid.</h1>
        <p className="mt-5 max-w-2xl text-ink/55 leading-relaxed">
          The BioAro launch experience is built around evidence-led storytelling, clearer product guidance, and support content that helps customers act with more confidence.
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
          <h2 className="text-3xl">From product interest to informed action.</h2>
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
            <h2 className="text-3xl md:text-4xl">Living 2.0 connects understanding and action.</h2>
            <p className="mt-4 leading-relaxed text-cream/60">
              BioAro Labs represents the understanding layer, while BioAro Drugs carries the action layer. The storefront is designed to make that connection feel tangible.
            </p>
          </div>
          <div className="flex items-end">
            <Link to="/living-2-0" className="btn-secondary !bg-white/10 !text-cream hover:!bg-white/15">
              Explore Living 2.0
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
