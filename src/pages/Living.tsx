import {
  Activity,
  ArrowRight,
  Brain,
  Clock,
  Dna,
  FlaskConical,
  HeartPulse,
  Leaf,
  LineChart,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import ctaProductVisual from "../assets/cta/dark-luxury-cta-product-visual.png";
import evidenceLabScene from "../assets/figma-home/evidence-lab-scene-3-4.png";
import heroScenery from "../assets/hero/hero-scenery.png";
import morningRoutine from "../assets/journal/journal-morning-longevity-stack.png";
import sleepRoutine from "../assets/journal/journal-sleep-category.png";
import workdayFocus from "../assets/journal/journal-workday-focus.png";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

type HealthGapStep = {
  icon: LucideIcon;
  label: string;
  message: string;
};

const healthGapSteps = [
  { label: "Today's Healthcare", message: "Diagnose illness", icon: HeartPulse },
  { label: "Preventive Health", message: "Understand biology", icon: Dna },
  { label: "Living 2.0", message: "Improve every day", icon: Sparkles },
] satisfies HealthGapStep[];

const frameworkSteps = [
  {
    number: "01",
    title: "Understand",
    items: ["Testing", "Biomarkers", "DNA", "Microbiome"],
    description: "Build a clearer picture of what matters most before choosing what to do next.",
    icon: Brain,
  },
  {
    number: "02",
    title: "Take Action",
    items: ["Protocols", "Nutrition", "Supplements", "Habits"],
    description: "Choose practical routines designed around your goals, schedule, and baseline.",
    icon: Target,
  },
  {
    number: "03",
    title: "Build",
    items: ["Consistency", "Tracking", "Review", "Optimisation"],
    description: "Improve the system over time rather than chasing short-term fixes.",
    icon: LineChart,
  },
];

const ecosystemNodes = [
  {
    title: "BioAro Labs",
    role: "Understanding",
    description: "Testing, biomarkers, health insights and evidence.",
    icon: FlaskConical,
  },
  {
    title: "BioAro Drugs",
    role: "Action",
    description: "Science-backed formulations and daily protocols.",
    icon: ShieldCheck,
  },
  {
    title: "Daily Routine",
    role: "Consistency",
    description: "Habits, timing, recovery, movement and nutrition.",
    icon: Clock,
  },
  {
    title: "Better Outcomes",
    role: "Improvement",
    description: "Clearer decisions and routines that evolve over time.",
    icon: Activity,
  },
];

const principles = [
  { title: "Science First", description: "Start with evidence, not trends.", icon: FlaskConical },
  { title: "Evidence Driven", description: "Use ingredients and approaches that are studied and understood.", icon: Dna },
  { title: "Daily Habits", description: "Small, consistent actions create lasting change.", icon: Sun },
  { title: "Measured Progress", description: "Review, learn and adjust using real information.", icon: LineChart },
  { title: "Long-Term Thinking", description: "Build for decades, not quick fixes.", icon: Leaf },
];

const upgradeModules = [
  {
    title: "Morning",
    description: "Begin with focus, clarity and intention.",
    image: morningRoutine,
    alt: "Calm morning wellness ritual with capsules, water and botanical details",
    icon: Sun,
  },
  {
    title: "Recovery",
    description: "Give the body what it needs to rebuild.",
    image: workdayFocus,
    alt: "Soft focus workspace scene representing mental clarity and recovery routines",
    icon: RefreshCw,
  },
  {
    title: "Longevity",
    description: "Build routines that support long-term health.",
    image: sleepRoutine,
    alt: "Restful sleep scene representing long-term recovery and daily rhythm",
    icon: Moon,
  },
];

const journeyStages = ["Discover", "Understand", "Build", "Improve", "Repeat"];

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-3xl">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 text-4xl leading-[0.98] md:text-6xl">{title}</h2>
      {description ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/62">{description}</p> : null}
    </div>
  );
}

function IconBubble({ icon: Icon, className = "" }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={`flex h-12 w-12 items-center justify-center rounded-full border border-[#d8cfbf] bg-[#fbf8f1] text-forest-600 ${className}`}>
      <Icon size={20} strokeWidth={1.8} />
    </span>
  );
}

export default function Living() {
  const marketHref = useMarketHref();

  return (
    <div className="bg-[#f7f3ec] pt-20 text-ink md:pt-24">
      <section className="container-bio">
        <div className="relative min-h-[720px] overflow-hidden rounded-[34px] border border-white/55 bg-ink text-white shadow-[0_32px_100px_-70px_rgba(28,24,18,0.55)] md:min-h-[800px] lg:rounded-[44px]">
          <img
            src={heroScenery}
            alt="Cinematic coastal landscape representing the Living 2.0 philosophy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,29,23,0.86)_0%,rgba(20,29,23,0.58)_38%,rgba(20,29,23,0.18)_72%,rgba(20,29,23,0.1)_100%)]" />
          <div className="relative z-10 flex min-h-[720px] items-center px-7 py-16 md:min-h-[800px] md:px-14 lg:px-20">
            <div className="max-w-[660px]">
              <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#d8c29c]">Living 2.0</span>
              <h1 className="mt-6 font-display text-[68px] leading-[0.9] tracking-[-0.03em] sm:text-[82px] md:text-[104px] lg:text-[116px]">
                Understand.
                <br />
                Take Action.
                <br />
                Live Better.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/72 md:text-xl">
                BioAro is building an ecosystem where testing, science and daily routines work together to support better health decisions over time.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link to={marketHref(ROUTES.shop)} className="btn-primary !bg-white !text-ink hover:!bg-[#f4ead8]">
                  Explore BioAro Drugs <ArrowRight size={16} />
                </Link>
                <Link to={marketHref(ROUTES.science)} className="btn-secondary !border-white/28 !bg-white/8 !text-white hover:!bg-white/14">
                  Learn the Philosophy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-bio py-24 md:py-32">
        <SectionIntro
          eyebrow="The health gap"
          title="Health should not begin when something goes wrong."
          description="Living 2.0 shifts the experience from reacting to symptoms toward building a clearer, more practical system for daily health."
        />
        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16.666%] right-[16.666%] top-12 hidden h-px bg-[#d9cfbd] md:block" />
          {healthGapSteps.map((step, index) => (
            <div key={step.label} className="relative rounded-[30px] border border-[#ded6c9] bg-[#fcfaf6]/70 p-7 shadow-[0_24px_70px_-62px_rgba(42,34,23,0.45)]">
              <IconBubble icon={step.icon} />
              <span className="mt-8 block text-xs font-semibold uppercase tracking-[0.18em] text-ink/38">0{index + 1}</span>
              <h3 className="mt-3 text-3xl leading-none">{step.label}</h3>
              <p className="mt-4 text-lg text-forest-700">{step.message}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e2d9cb] bg-[#fcfaf6] py-24 md:py-32">
        <div className="container-bio">
          <SectionIntro eyebrow="The framework" title="A better system for better health." />
          <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-0">
            {frameworkSteps.map((step, index) => (
              <article key={step.title} className={`lg:px-10 ${index === 0 ? "lg:pl-0" : "lg:border-l lg:border-[#ded5c6]"} ${index === 2 ? "lg:pr-0" : ""}`}>
                <div className="flex items-start justify-between gap-8">
                  <span className="font-display text-[96px] leading-none text-[#d6c4a6] md:text-[128px]">{step.number}</span>
                  <IconBubble icon={step.icon} className="mt-3" />
                </div>
                <h3 className="mt-3 text-4xl">{step.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-ink/58">{step.description}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {step.items.map((item) => (
                    <span key={item} className="rounded-full border border-[#d9d0c2] bg-[#f8f2e8] px-4 py-2 text-sm text-ink/64">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-bio py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionIntro
              eyebrow="The ecosystem"
              title="Better health happens when everything works together."
              description="Living 2.0 is not a single product or a single test. It is a connected way to understand, act, stay consistent and improve over time."
            />
          </div>
          <div className="relative rounded-[40px] border border-[#ded6c9] bg-[#fcfaf6] p-5 shadow-[0_34px_90px_-75px_rgba(42,34,23,0.55)] md:p-8">
            <div className="absolute inset-x-12 top-1/2 hidden h-px bg-[#d9cfbd] lg:block" />
            <div className="absolute inset-y-12 left-1/2 hidden w-px bg-[#d9cfbd] lg:block" />
            <div className="relative grid gap-4 sm:grid-cols-2">
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[32px] border border-[#dcd2c3] bg-[#f5efe4] p-8 text-center sm:col-span-2">
                <IconBubble icon={UserRound} />
                <h3 className="mt-5 text-5xl">You</h3>
                <p className="mt-3 max-w-md leading-relaxed text-ink/58">The center of the system: your goals, routines, decisions and progress.</p>
              </div>
              {ecosystemNodes.map((node) => (
                <article key={node.title} className="rounded-[28px] border border-[#e1d8cb] bg-white/72 p-6">
                  <IconBubble icon={node.icon} className="h-11 w-11" />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-forest-600">{node.role}</p>
                  <h4 className="mt-2 font-display text-2xl">{node.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink/55">{node.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-bio pb-24 md:pb-32">
        <div className="grid overflow-hidden rounded-[40px] border border-[#dcd2c3] bg-[#173f2e] text-white lg:grid-cols-2">
          <div className="min-h-[420px] overflow-hidden lg:min-h-[620px]">
            <img
              src={evidenceLabScene}
              alt="BioAro products in a laboratory setting representing evidence and quality"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-14 lg:p-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#d8c29c]">Why it matters</span>
            <h2 className="mt-4 text-4xl leading-[1.02] md:text-6xl">Health should not begin when something goes wrong.</h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/72">
              <p>Most people are not given the tools to understand their health until it is too late.</p>
              <p>Living 2.0 shifts the focus from reacting to problems toward building a stronger foundation every day.</p>
              <p>It is not about perfect habits. It is about better decisions, made consistently.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-bio pb-24 md:pb-32">
        <SectionIntro eyebrow="Five principles" title="Built on principles that last." />
        <div className="mt-14 grid gap-x-0 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {principles.map((principle, index) => (
            <article key={principle.title} className={`pr-6 lg:px-6 ${index === 0 ? "lg:pl-0" : "lg:border-l lg:border-[#ddd4c6]"}`}>
              <IconBubble icon={principle.icon} className="h-11 w-11" />
              <h3 className="mt-6 text-2xl leading-tight">{principle.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/56">{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fcfaf6] py-24 md:py-32">
        <div className="container-bio">
          <SectionIntro
            eyebrow="Living the upgrade"
            title="Support every part of your day."
            description="The system becomes useful when it shows up in the actual rhythm of your life: morning, recovery, sleep and the long arc of wellbeing."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {upgradeModules.map((module) => (
              <article key={module.title} className="group overflow-hidden rounded-[34px] border border-[#ded6c9] bg-white shadow-[0_28px_80px_-68px_rgba(42,34,23,0.55)]">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={module.image} alt={module.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                </div>
                <div className="p-7">
                  <IconBubble icon={module.icon} className="h-10 w-10" />
                  <h3 className="mt-5 text-3xl">{module.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink/58">{module.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-bio py-24 md:py-32">
        <div className="rounded-[40px] bg-[#171714] px-7 py-24 text-center text-white md:px-16 md:py-32">
          <p className="mx-auto max-w-5xl font-display text-[44px] leading-[1.02] md:text-[72px]">
            We do not believe supplements should exist alone. They should belong to a complete health system.
          </p>
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#d8c29c]">BioAro</p>
        </div>
      </section>

      <section className="container-bio pb-24 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionIntro
              eyebrow="The journey"
              title="A system that evolves with you."
              description="Living 2.0 is designed as a repeatable loop, not a one-time answer."
            />
          </div>
          <div className="relative rounded-[36px] border border-[#ded6c9] bg-[#fcfaf6] p-6 md:p-8">
            <div className="absolute left-10 top-12 bottom-12 w-px bg-[#d9cfbd] md:left-12 lg:left-12" />
            <div className="space-y-5">
              {journeyStages.map((stage, index) => (
                <div key={stage} className="relative flex items-center gap-5 rounded-[24px] bg-white/70 p-5">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d2c4b0] bg-[#f7f3ec] text-sm font-semibold text-forest-700">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl">{stage}</h3>
                    <p className="text-sm text-ink/50">{index === journeyStages.length - 1 ? "Return to the system with better information." : "Move forward with clearer context and a practical next step."}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-bio pb-24 md:pb-32">
        <div className="grid overflow-hidden rounded-[40px] border border-[#302b25] bg-[#171714] text-white lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center p-8 md:p-14 lg:p-16">
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#d8c29c]">Ready to begin</span>
            <h2 className="mt-4 text-4xl leading-[1.02] md:text-6xl">Ready to build better health?</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/66">
              Explore the BioAro ecosystem and find a clearer starting point for energy, recovery, focus, sleep and long-term wellness.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={marketHref(ROUTES.shop)} className="btn-primary !bg-white !text-ink hover:!bg-[#f4ead8]">
                Shop BioAro Drugs <ArrowRight size={16} />
              </Link>
              <Link to={marketHref(ROUTES.science)} className="btn-secondary !border-white/24 !bg-white/8 !text-white hover:!bg-white/14">
                Explore the Science
              </Link>
            </div>
          </div>
          <div className="min-h-[360px] overflow-hidden lg:min-h-[560px]">
            <img src={ctaProductVisual} alt="BioAro product ecosystem visual" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
