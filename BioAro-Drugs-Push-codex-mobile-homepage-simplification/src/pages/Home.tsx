import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Dumbbell, Heart, Infinity, Leaf, Sparkles, Target, Waves } from "lucide-react";
import heroRunnersSunrise from "../assets/hero/hero-runners-sunrise.png";
import essentialLongevityEditorial from "../assets/figma-home/essential-longevity-mountain-couple.png";
import essentialFocusEditorial from "../assets/figma-home/essential-focus-study-man.png";
import essentialRecoveryEditorial from "../assets/figma-home/essential-recovery-coastal-woman.png";
import essentialLongevityCard from "../assets/figma-home/essential-longevity-card.png";
import essentialFocusCard from "../assets/figma-home/essential-focus-card.png";
import essentialRecoveryCard from "../assets/figma-home/essential-recovery-card.png";
import essentialSleepCard from "../assets/figma-home/essential-sleep-card.png";
import evidenceScientistEditorial from "../assets/figma-home/evidence-scientist-editorial.png";
import founderVisual from "../assets/figma-home/founder-sikh-portrait.png";
import realRoutinesNadiaLongevity from "../assets/home/real-routines-nadia-longevity.png";
import { JOURNAL_ARTICLES } from "../data/journal";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

const HOME_PILLARS = [
  {
    title: "Clarity",
    description: "Clear mind. Better decisions.",
    Icon: Brain,
  },
  {
    title: "Strength",
    description: "Move, train and build.",
    Icon: Dumbbell,
  },
  {
    title: "Recovery",
    description: "Bounce back. Feel like yourself.",
    Icon: Waves,
  },
  {
    title: "Longevity",
    description: "Support today. Protect tomorrow.",
    Icon: Infinity,
  },
] as const;

const HOME_STORIES = [
  {
    title: "Focus & Clarity",
    description: "Stay sharp. Make clearer decisions. Lead with confidence.",
    image: essentialFocusEditorial,
    alt: "Professional working with calm focus near a laptop",
    href: ROUTES.science,
    imageClassName: "object-[50%_44%]",
  },
  {
    title: "Strength & Recovery",
    description: "Train hard. Recover smarter. Keep moving forward.",
    image: essentialRecoveryEditorial,
    alt: "Man resting after training in warm natural light",
    href: ROUTES.science,
    imageClassName: "object-[54%_50%]",
  },
  {
    title: "Daily Vitality",
    description: "Support your energy, immunity, and long-term well-being.",
    image: essentialLongevityEditorial,
    alt: "Woman enjoying a quiet wellness moment beside a bright window",
    href: ROUTES.about,
    imageClassName: "object-[62%_50%]",
  },
] as const;

const PHILOSOPHY_POINTS = [
  {
    title: "No complicated 12-step routines.",
    description: "Wellness that's easy to understand and simple to follow.",
    Icon: Sparkles,
  },
  {
    title: "Built for consistency, not perfection.",
    description: "Small choices. Sustainable change.",
    Icon: Target,
  },
  {
    title: "Designed to travel with your life.",
    description: "At home, at work, or across the world.",
    Icon: Leaf,
  },
  {
    title: "Support that fits into modern routines.",
    description: "Real life is busy. Your wellness should fit.",
    Icon: Heart,
  },
] as const;

const APPROACH_TILES = [
  {
    title: "Brain & Clarity",
    description: "Support focus, memory, and mental sharpness.",
    image: essentialLongevityCard,
    alt: "Profile silhouette with illuminated brain concept",
  },
  {
    title: "Cellular Health",
    description: "Nourish your cells and protect what matters most.",
    image: essentialFocusCard,
    alt: "Abstract cellular forms floating in an ivory environment",
  },
  {
    title: "Strength & Recovery",
    description: "Build strength, recover better, move with confidence.",
    image: essentialRecoveryCard,
    alt: "Athlete seated after training in a sunlit studio",
  },
  {
    title: "Daily Vitality",
    description: "Foundations for energy, immunity, and whole-body balance.",
    image: essentialSleepCard,
    alt: "Woman outdoors in a calm daily vitality portrait",
  },
] as const;

const SCIENCE_POINTS = [
  "Science-led formulation philosophy",
  "Thoughtful, well-researched ingredients",
  "Made for modern routines",
  "Quality and trust, always",
] as const;

const FOOTER_JOURNAL_ARTICLES = JOURNAL_ARTICLES.slice(0, 3);

function HomeSectionLabel({ children, className = "" }: { children: string; className?: string }) {
  return <span className={`eyebrow text-[10px] tracking-[0.22em] text-[#8e887f] ${className}`}>{children}</span>;
}

function HomeCta({
  children,
  href,
  variant = "primary",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      to={href}
      className={
        variant === "primary"
          ? "inline-flex items-center gap-2 rounded-full bg-[#12100f] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#2c4739]"
          : "inline-flex items-center gap-2 rounded-full px-1 py-3 text-[13px] font-semibold text-[#1f1a17] transition-colors hover:text-[#2c4739]"
      }
    >
      {children}
      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
    </Link>
  );
}

function HomeStoryCard({
  title,
  description,
  image,
  alt,
  href,
  imageClassName,
}: (typeof HOME_STORIES)[number]) {
  const marketHref = useMarketHref();

  return (
    <Link
      to={marketHref(href)}
      className="group overflow-hidden rounded-[28px] bg-[#fbf8f2] shadow-[0_18px_45px_-36px_rgba(38,31,24,0.16)] transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="aspect-[1.13/1] overflow-hidden rounded-[28px] bg-[#efe9de]">
        <img
          src={image}
          alt={alt}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none ${imageClassName}`}
        />
      </div>
      <div className="px-5 pb-6 pt-5 sm:px-6">
        <h3 className="font-display text-[22px] leading-[1.02] tracking-[-0.02em] text-[#1d1916] sm:text-[25px]">{title}</h3>
        <p className="mt-3 max-w-[25ch] text-[14px] leading-6 text-[#6b635b]">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#1d1916]">
          Explore
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  const marketHref = useMarketHref();

  return (
    <div className="bg-[#f8f4ee] text-[#1b1714]">
      <section className="px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10">
        <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[34px] bg-[#f4efe7] shadow-[0_24px_70px_-48px_rgba(35,29,20,0.32)]">
          <div className="relative min-h-[760px] overflow-hidden lg:min-h-[880px] xl:min-h-[920px]">
            <img
              src={heroRunnersSunrise}
              alt="People running beside the water in warm sunrise light"
              className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,239,231,0.98)_0%,rgba(244,239,231,0.93)_29%,rgba(244,239,231,0.62)_47%,rgba(244,239,231,0.18)_66%,rgba(244,239,231,0)_78%)]" />
            <div className="relative z-10 flex min-h-[760px] items-start px-8 pb-36 pt-28 sm:px-10 lg:min-h-[880px] lg:px-14 lg:pt-36 xl:min-h-[920px] xl:px-20">
              <div className="max-w-[430px] pt-10 sm:max-w-[470px] lg:pt-16">
                <p className="text-[12px] font-medium tracking-[0.02em] text-[#5f564f]">BioAro — Live Forward.</p>
                <h1 className="mt-8 max-w-[8ch] font-display text-[54px] leading-[0.9] tracking-[-0.04em] text-[#1b1714] sm:text-[68px] lg:text-[84px] xl:text-[88px]">
                  Keep more of what makes life yours.
                </h1>
                <p className="mt-7 max-w-[31ch] text-[15px] leading-7 text-[#514841] sm:text-[16px]">
                  Science-backed wellness for real life. Clarity for the people who depend on you. Recovery for everything you still want to do.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <HomeCta href={marketHref(`${ROUTES.home}#our-approach`)} variant="primary">
                    Explore our approach
                  </HomeCta>
                  <HomeCta href={marketHref(`${ROUTES.home}#use-cases`)} variant="secondary">
                    See use cases
                  </HomeCta>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8">
            <div className="relative -mt-12 rounded-[28px] bg-[#fbf8f2] px-5 py-4 shadow-[0_18px_40px_-34px_rgba(34,28,21,0.22)] sm:-mt-14 sm:px-8 sm:py-5">
              <div className="grid gap-y-5 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-0">
                {HOME_PILLARS.map(({ title, description, Icon }, index) => (
                  <div
                    key={title}
                    className={`flex items-center gap-4 px-3 lg:px-8 ${index > 0 ? "lg:border-l lg:border-[#e8dfd2]" : ""}`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e4d9cb] text-[#4a453e]">
                      <Icon size={18} strokeWidth={1.55} />
                    </span>
                    <div>
                      <p className="text-[14px] font-medium text-[#1d1916]">{title}</p>
                      <p className="mt-1 text-[12px] leading-5 text-[#71685e]">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="scroll-mt-28 pb-16 pt-8 sm:pb-20 lg:pt-14">
        <div className="container-bio max-w-[1290px]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.75fr] lg:items-end lg:gap-12">
            <div>
              <HomeSectionLabel>REAL LIVES. REAL REASONS.</HomeSectionLabel>
              <h2 className="mt-4 max-w-[8ch] font-display text-[42px] leading-[0.94] tracking-[-0.03em] text-[#1d1916] sm:text-[54px] lg:text-[66px]">
                Different lives. Different goals.
              </h2>
            </div>
            <p className="max-w-[26ch] justify-self-start text-[15px] leading-7 text-[#6f675f] lg:justify-self-end lg:text-right">
              Wellness looks different for everyone. Support what matters most to you.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {HOME_STORIES.map((story) => (
              <HomeStoryCard key={story.title} {...story} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#ece3d7] bg-[#faf7f2] py-14 sm:py-16">
        <div className="container-bio max-w-[1320px]">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <HomeSectionLabel>WELLNESS THAT FITS REAL LIFE</HomeSectionLabel>
              <h2 className="mt-4 max-w-[8.5ch] font-display text-[40px] leading-[0.98] tracking-[-0.03em] text-[#1d1916] sm:text-[50px] lg:text-[58px]">
                Simple. Science-backed. Made for how you live.
              </h2>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {PHILOSOPHY_POINTS.map(({ title, description, Icon }) => (
                <div key={title} className="max-w-[220px]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfce] text-[#b98d56]">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 text-[14px] font-semibold leading-6 text-[#1e1a17]">{title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#756d64]">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="our-approach" className="scroll-mt-28 py-16 sm:py-20">
        <div className="container-bio max-w-[1320px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <HomeSectionLabel>OUR APPROACH</HomeSectionLabel>
              <h2 className="mt-4 max-w-[10ch] font-display text-[40px] leading-[0.98] tracking-[-0.03em] text-[#1d1916] sm:text-[50px] lg:text-[56px]">
                Support what matters most.
              </h2>
            </div>
            <Link
              to={marketHref(ROUTES.science)}
              className="inline-flex items-center gap-2 self-start text-[14px] font-semibold text-[#433d37] transition-colors hover:text-[#2c4739] md:self-auto"
            >
              Learn more about our approach
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {APPROACH_TILES.map((tile) => (
              <Link
                key={tile.title}
                to={marketHref(ROUTES.science)}
                className="group overflow-hidden rounded-[24px] bg-[#fbf8f2] shadow-[0_18px_40px_-34px_rgba(35,29,20,0.16)]"
              >
                <div className="aspect-[1.08/1] overflow-hidden bg-[#efe8dc]">
                  <img
                    src={tile.image}
                    alt={tile.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none"
                  />
                </div>
                <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  <h3 className="font-display text-[22px] leading-[1.02] tracking-[-0.02em] text-[#1d1916]">{tile.title}</h3>
                  <p className="mt-2 max-w-[22ch] text-[13px] leading-6 text-[#72695f]">{tile.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container-bio max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-10">
            <div className="lg:pr-8">
              <HomeSectionLabel>SCIENCE. QUALITY. TRUST.</HomeSectionLabel>
              <h2 className="mt-4 font-display text-[42px] leading-[0.96] tracking-[-0.03em] text-[#1d1916] sm:text-[52px]">
                Evidence, not noise.
              </h2>
              <ul className="mt-8 space-y-4">
                {SCIENCE_POINTS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] leading-6 text-[#554c44]">
                    <span className="mt-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#c9beb0] text-[10px] text-[#49423b]">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-[28px] bg-[#ebe3d7]">
              <img
                src={evidenceScientistEditorial}
                alt="Scientist conducting careful laboratory research"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-bio max-w-[1320px]">
          <div className="grid gap-6 rounded-[28px] bg-[#fbf8f3] p-4 shadow-[0_18px_40px_-34px_rgba(35,29,20,0.16)] lg:grid-cols-[0.96fr_1.04fr] lg:p-5">
            <div className="overflow-hidden rounded-[22px] bg-[#e8dfd2]">
              <img
                src={founderVisual}
                alt="Founder portrait for BioAro"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex items-center px-4 py-5 sm:px-6 lg:px-10">
              <div className="max-w-[420px]">
                <HomeSectionLabel>OUR WHY</HomeSectionLabel>
                <h2 className="mt-4 font-display text-[40px] leading-[0.98] tracking-[-0.03em] text-[#1d1916] sm:text-[52px]">
                  Why BioAro exists.
                </h2>
                <p className="mt-5 text-[15px] leading-7 text-[#524941]">
                  I didn&apos;t want to wait for something to go wrong before I started thinking about my health.
                </p>
                <p className="mt-4 text-[15px] leading-7 text-[#524941]">
                  BioAro was born from a simple belief: health support should be clear, effective, and livable.
                </p>
                <p className="mt-4 text-[15px] leading-7 text-[#524941]">
                  We combine science with empathy so you can move forward with confidence, every day.
                </p>
                <div className="mt-8">
                  <p className="font-display text-[28px] italic leading-none text-[#1d1916]">Anju Singh</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#8f867d]">Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-bio max-w-[1320px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <HomeSectionLabel>FROM OUR JOURNAL</HomeSectionLabel>
              <h2 className="mt-4 font-display text-[40px] leading-[0.98] tracking-[-0.03em] text-[#1d1916] sm:text-[50px]">
                Ideas for living well.
              </h2>
            </div>
            <Link
              to={marketHref(ROUTES.journal)}
              className="inline-flex items-center gap-2 self-start text-[14px] font-semibold text-[#433d37] transition-colors hover:text-[#2c4739] md:self-auto"
            >
              Explore all articles
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {FOOTER_JOURNAL_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                to={marketHref(`${ROUTES.journal}/${article.slug}`)}
                className="group overflow-hidden rounded-[24px] bg-[#fbf8f2] shadow-[0_18px_40px_-34px_rgba(35,29,20,0.16)]"
              >
                <div className="aspect-[1.64/1] overflow-hidden bg-[#ece3d8]">
                  <img
                    src={article.img}
                    alt={article.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transform-none"
                  />
                </div>
                <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a9289]">{article.cat}</p>
                  <h3 className="mt-3 font-display text-[24px] leading-[1.04] tracking-[-0.02em] text-[#1d1916]">{article.title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#72695f]">{article.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#1d1916]">
                    Read more
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-0 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1380px] overflow-hidden rounded-t-[30px] bg-[#16110d]">
          <div className="relative min-h-[420px] overflow-hidden sm:min-h-[480px] lg:min-h-[460px]">
            <img
              src={realRoutinesNadiaLongevity}
              alt="Quiet evening reflection by the water"
              className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,14,11,0.94)_0%,rgba(18,14,11,0.85)_34%,rgba(18,14,11,0.3)_62%,rgba(18,14,11,0)_82%)]" />
            <div className="relative z-10 flex min-h-[420px] items-center px-7 py-10 sm:min-h-[480px] sm:px-10 lg:min-h-[460px] lg:px-14">
              <div className="max-w-[340px] text-white sm:max-w-[380px]">
                <h2 className="font-display text-[46px] leading-[0.92] tracking-[-0.03em] sm:text-[58px]">
                  Keep living like yourself.
                </h2>
                <p className="mt-5 text-[15px] leading-7 text-white/78">
                  More mornings. More movement. More conversations. More independence. More life.
                </p>
                <div className="mt-8">
                  <HomeCta href={marketHref(`${ROUTES.home}#our-approach`)} variant="primary">
                    Explore our approach
                  </HomeCta>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
