import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  Leaf,
  Microscope,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import evidenceLabScene from "../assets/figma-home/evidence-lab-scene-3-4.png";
import formulationResearchCollage from "../assets/science/formulation-research-collage.png";
import labGlasswareStudy from "../assets/science/lab-glassware-study.png";
import coq10 from "../assets/ingredients/coq10.png";
import creatine from "../assets/ingredients/creatine-monohydrate.png";
import glutathione from "../assets/ingredients/liposomal-glutathione.png";
import magnesium from "../assets/ingredients/magnesium-bisglycinate.png";
import omega3 from "../assets/ingredients/omega-3-fatty-acids.png";
import vitaminB12 from "../assets/ingredients/vitamin-b12.png";
import journalQualityDocumentation from "../assets/journal/journal-quality-documentation.png";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

const PRINCIPLES = [
  { number: "01", title: "Evidence", description: "Start with ingredients that have a clear scientific rationale and relevant research context." },
  { number: "02", title: "Transparency", description: "Show ingredient names, amounts, directions, warnings, and product-specific information clearly." },
  { number: "03", title: "Quality", description: "Surface manufacturing, testing, sourcing, and documentation details when they are confirmed." },
  { number: "04", title: "Guidance", description: "Help you understand how a formula can fit into a practical daily routine." },
];

const JOURNEY = [
  { title: "Research", description: "Review the available evidence and intended role of each ingredient." },
  { title: "Ingredients", description: "Select ingredients and forms that suit the purpose of the formula." },
  { title: "Formulation", description: "Combine ingredients with attention to dosage, compatibility, and practical use." },
  { title: "Testing", description: "Apply relevant quality and safety checks through the manufacturing process." },
  { title: "Documentation", description: "Present supplement facts, directions, warnings, and available quality information clearly." },
  { title: "You", description: "Use the information to decide whether a product fits your goals and routine." },
];

const INGREDIENTS = [
  { name: "Magnesium", description: "Explore common magnesium forms and how they differ.", image: magnesium, alt: "Magnesium bisglycinate powder and spoon" },
  { name: "Omega-3", description: "Understand EPA, DHA, algae-derived sources, and daily wellness context.", image: omega3, alt: "Omega-3 fatty acid ingredient visual" },
  { name: "Creatine", description: "Learn why creatine is used across performance, recovery, and cognitive routines.", image: creatine, alt: "Creatine monohydrate ingredient visual" },
  { name: "Glutathione", description: "Explore antioxidant support and liposomal delivery context.", image: glutathione, alt: "Liposomal glutathione ingredient visual" },
  { name: "Vitamin B12", description: "Understand its role in energy metabolism and formulation.", image: vitaminB12, alt: "Vitamin B12 ingredient visual" },
  { name: "CoQ10", description: "Learn how CoQ10 relates to cellular energy and wellness formulas.", image: coq10, alt: "CoQ10 ingredient visual" },
];

const QUALITY_ITEMS = [
  { title: "Manufacturing standards", description: "Confirmed manufacturing and facility information is shown clearly where available.", icon: FlaskConical },
  { title: "Identity and purity checks", description: "Relevant product or ingredient testing information is surfaced when documentation is available.", icon: ShieldCheck },
  { title: "Transparent labels", description: "Ingredient amounts, serving information, and warnings are presented without hidden blends.", icon: ClipboardCheck },
  { title: "Product-specific documentation", description: "Certificates, reports, or supporting documents are made accessible when approved and available.", icon: BookOpen },
];

const PATHWAY = [
  { title: "Science", description: "Understand the BioAro approach to evidence and formulation.", href: ROUTES.science },
  { title: "Product pages", description: "Review ingredients, benefits, directions, warnings, and routine context.", href: ROUTES.shop },
  { title: "Journal", description: "Explore practical explainers about ingredients, routines, recovery, and quality.", href: ROUTES.journal },
  { title: "Wellness Quiz", description: "Find a practical starting point based on your current goals.", href: ROUTES.quiz },
];

function SectionLabel({ children, className = "" }: { children: string; className?: string }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

export default function Science() {
  const marketHref = useMarketHref();

  return (
    <main className="overflow-hidden pb-20 md:pb-28">
      <section className="container-bio pt-28 md:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:gap-20">
          <div className="max-w-2xl">
            <SectionLabel>Science &amp; quality</SectionLabel>
            <h1 className="mt-5 text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em]">Better wellness starts with better information.</h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/60 md:text-xl">
              BioAro explains the evidence, ingredients, formulation choices, and practical guidance behind each formula so you can make more informed decisions.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={marketHref(ROUTES.shop)} className="btn-primary">Explore formulas <ArrowRight size={16} /></Link>
              <a href="#ingredient-library" className="btn-secondary">Browse ingredients <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-[32px] bg-[#e8e2d7] shadow-glass-lg">
            <img src={formulationResearchCollage} alt="BioAro formulation research scene with products, laboratory glassware, study notes, and ingredient evidence" className="aspect-[4/5] h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.02]" />
            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/50 bg-white/55 px-4 py-2 text-xs text-ink backdrop-blur-md">
              <Microscope size={15} className="text-forest-600" /> Evidence-led formulation
            </div>
          </div>
        </div>
      </section>

      <section className="container-bio mt-28 md:mt-40">
        <div className="grid overflow-hidden rounded-[32px] bg-[#e4e9e2] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[380px] overflow-hidden lg:min-h-[560px]">
            <img src={evidenceLabScene} alt="BioAro laboratory still life representing ingredient research and formulation" className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
            <SectionLabel>Research, made useful</SectionLabel>
            <h2 className="mt-5 max-w-xl text-4xl leading-[0.96] md:text-6xl">Research is only valuable when it becomes understandable.</h2>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-ink/60 md:text-lg">
              BioAro turns ingredient evidence, formulation context, dosage information, and product guidance into clear information you can use in everyday life.
            </p>
            <div className="mt-9 flex items-center gap-3 text-sm font-medium text-forest-600"><Leaf size={17} /> Clear context, grounded in evidence</div>
          </div>
        </div>
      </section>

      <section className="container-bio mt-28 md:mt-40">
        <SectionLabel>The BioAro approach</SectionLabel>
        <h2 className="mt-4 max-w-2xl text-4xl leading-[0.96] md:text-6xl">The principles behind every formula.</h2>
        <div className="mt-14 grid border-y border-sand/70 md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-sand/70">
          {PRINCIPLES.map((principle) => (
            <article key={principle.number} className="border-b border-sand/70 py-8 md:px-8 lg:border-b-0 lg:py-10 first:lg:pl-0 last:lg:pr-0">
              <span className="font-display text-5xl text-forest-600/60 md:text-6xl">{principle.number}</span>
              <h3 className="mt-7 text-2xl">{principle.title}</h3>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-ink/55">{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-bio mt-28 md:mt-40">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>Science journey</SectionLabel>
            <h2 className="mt-4 text-4xl leading-[0.96] md:text-6xl">From evidence to everyday use.</h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-ink/55">A clear path from understanding an ingredient to deciding how it fits into your routine.</p>
        </div>
        <div className="relative mt-16 grid gap-8 border-l border-forest-600/35 pl-7 md:grid-cols-3 md:border-l-0 md:border-t md:pl-0 lg:grid-cols-6">
          {JOURNEY.map((step, index) => (
            <article key={step.title} className="relative md:pt-8">
              <span className="absolute -left-[35px] top-0 h-4 w-4 rounded-full border-4 border-cream bg-forest-600 md:-top-[9px] md:left-0" />
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-600">0{index + 1}</span>
              <h3 className="mt-3 text-2xl">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink/55">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-bio mt-28 md:mt-40">
        <div className="grid overflow-hidden rounded-[32px] bg-forest-600 text-cream lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center p-8 md:p-14 lg:p-20">
            <SectionLabel className="!text-cream/75">Clarity matters</SectionLabel>
            <h2 className="mt-5 text-4xl leading-[0.96] text-cream md:text-6xl">Science without unnecessary complexity.</h2>
            <p className="mt-7 max-w-lg leading-relaxed text-cream/70">You should not need specialist knowledge to understand what is in a product, how to use it, or what information is available.</p>
          </div>
          <div className="min-h-[360px] overflow-hidden lg:min-h-[520px]"><img src={labGlasswareStudy} alt="Laboratory glassware, botanical ingredients, and formulation notes used to explain BioAro science" className="h-full w-full object-cover object-right transition-transform duration-1000 hover:scale-[1.03]" /></div>
        </div>
      </section>

      <section id="ingredient-library" className="container-bio mt-28 scroll-mt-24 md:mt-40">
        <SectionLabel>Ingredient library</SectionLabel>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="mt-4 max-w-2xl text-4xl leading-[0.96] md:text-6xl">Understand what goes into the formula.</h2>
          <p className="max-w-sm text-sm leading-relaxed text-ink/55">Plain-language profiles covering ingredient roles, common uses, formulation context, and product applications.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INGREDIENTS.map((ingredient) => (
            <article key={ingredient.name} className="group overflow-hidden rounded-[26px] border border-sand/70 bg-white/55">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#f1ede5] p-9 md:p-10"><img src={ingredient.image} alt={ingredient.alt} loading="lazy" className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="flex min-h-[190px] flex-col p-7 md:p-8"><h3 className="text-2xl">{ingredient.name}</h3><p className="mt-3 text-base leading-relaxed text-ink/55">{ingredient.description}</p><Link to={marketHref(ROUTES.science)} className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-medium text-forest-600">Explore ingredient <ArrowRight size={14} /></Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-bio mt-28 md:mt-40">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="overflow-hidden rounded-[32px] bg-[#e7e1d7]"><img src={journalQualityDocumentation} alt="BioAro quality documentation and botanical product still life" className="aspect-[4/3] h-full w-full object-cover" /></div>
          <div>
            <SectionLabel>Quality &amp; testing</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-4xl leading-[0.96] md:text-6xl">Quality information should be visible, specific, and verifiable.</h2>
            <div className="mt-10 divide-y divide-sand/70 border-y border-sand/70">
              {QUALITY_ITEMS.map((item) => (
                <div key={item.title} className="flex gap-4 py-5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-forest-600"><item.icon size={16} /></div><div><h3 className="text-lg">{item.title}</h3><p className="mt-1 text-sm leading-relaxed text-ink/55">{item.description}</p></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-bio mt-28 md:mt-40">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><SectionLabel>Education pathway</SectionLabel><h2 className="mt-4 text-4xl leading-[0.96] md:text-6xl">Learn at your own pace.</h2></div><p className="max-w-sm text-base leading-relaxed text-ink/55">Move from broad principles to the details that matter for your own routine.</p></div>
        <div className="mt-12 grid border-y border-sand/70 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-sand/70">
          {PATHWAY.map((item) => <Link key={item.title} to={marketHref(item.href)} className="group flex min-h-[150px] flex-col justify-between border-b border-sand/70 px-1 py-6 transition-colors hover:text-forest-600 sm:px-5 lg:border-b-0 lg:px-7 lg:first:pl-0 lg:last:pr-0"><span className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-600">Explore</span><div><h3 className="text-2xl">{item.title}</h3><p className="mt-2 text-base leading-relaxed text-ink/55 group-hover:text-forest-600/75">{item.description}</p></div><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">Open <ArrowRight size={14} /></span></Link>)}
        </div>
      </section>

      <section className="container-bio mt-28 md:mt-40">
        <div className="rounded-[32px] bg-[#e4e9e2] px-6 py-20 text-center md:px-16 md:py-32"><p className="mx-auto max-w-5xl font-display text-4xl leading-[0.95] tracking-[-0.02em] md:text-7xl">“We do not simplify science. We simplify understanding.”</p><span className="mt-8 block text-xs font-semibold uppercase tracking-[0.18em] text-forest-600">BioAro</span></div>
      </section>

      <section className="container-bio mt-28 md:mt-40">
        <div className="rounded-[32px] bg-[#1d1915] px-7 py-16 text-center text-cream shadow-[0_24px_70px_rgba(29,25,21,0.18)] md:px-16 md:py-28"><SectionLabel className="!text-cream/75">Start with clarity</SectionLabel><h2 className="mx-auto mt-5 max-w-4xl text-5xl leading-[0.94] text-cream md:text-7xl">Understand your routine. Take action with confidence.</h2><p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-cream/70 md:text-lg">Explore BioAro formulas, ingredient information, and practical health education.</p><div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Link to={marketHref(ROUTES.shop)} className="btn-primary !bg-cream !text-ink hover:!bg-white">Explore formulas <ArrowRight size={16} /></Link><Link to={marketHref(ROUTES.living)} className="btn-secondary !border-white/25 !bg-white/10 !text-cream hover:!bg-white/15">Explore Living 2.0 <ArrowRight size={16} /></Link></div></div>
      </section>
    </main>
  );
}
