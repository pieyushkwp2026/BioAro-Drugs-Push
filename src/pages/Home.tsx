import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CalendarRange,
  Check,
  ClipboardList,
  Dumbbell,
  FileCheck2,
  FlaskConical,
  Globe2,
  Leaf,
  Mail,
  MoonStar,
  ShieldCheck,
  Sparkles,
  SunMedium,
  X,
  Zap,
} from "lucide-react";
import { FlagCA } from "../components/layout/Flags";
import ProductCard from "../components/sections/ProductCard";
import heroCreagenRecovery from "../assets/hero/hero-creagen-recovery.png";
import essentialLongevityEditorial from "../assets/figma-home/essential-longevity-editorial.png";
import essentialFocusEditorial from "../assets/figma-home/essential-focus-editorial.png";
import essentialRecoveryEditorial from "../assets/figma-home/essential-recovery-editorial.png";
import essentialSleepEditorial from "../assets/figma-home/essential-sleep-editorial.png";
import evidenceScientistEditorial from "../assets/figma-home/evidence-scientist-editorial.png";
import founderVisual from "../assets/figma-home/founder-bun-woman.png";
import { SUPPORT_EMAILS } from "../data/siteContent";
import { JOURNAL_ARTICLES } from "../data/journal";
import { useMarket } from "../hooks/useMarket";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";
import { fetchAllProducts } from "../lib/shopify/productService";
import type { CatalogProduct } from "../lib/shopify/types";
import ctaProductVisual from "../assets/cta/dark-luxury-cta-product-visual.png";

const HERO_TRUST_ITEMS = [
  { label: "Evidence-led", subtitle: "Formulas", Icon: FlaskConical },
  { label: "Third-party", subtitle: "Tested", Icon: ShieldCheck },
  { label: "Transparent", subtitle: "Ingredients", Icon: Leaf },
  { label: "Formulated in", subtitle: "Canada", Icon: CanadaFlagIcon },
] as const;

type IconProps = {
  className?: string;
  size?: number;
};

function CanadaFlagIcon({ className, size = 52 }: IconProps) {
  return (
    <FlagCA
      className={className}
      style={{
        width: `${size}px`,
        height: `${Math.round((size * 16) / 24)}px`,
      }}
    />
  );
}

const CREDIBILITY_ITEMS = [
  {
    title: "100+",
    subtitle: "Tests Per Batch",
    Icon: FlaskConical,
  },
  {
    title: "cGMP",
    subtitle: "Certified",
    Icon: ShieldCheck,
  },
  {
    title: "Formulated in Canada",
    subtitle: "Trusted Quality",
    Icon: CanadaFlagIcon,
  },
] as const;

const OUTCOME_PILLS = [
  {
    title: "More Energy",
    description: "Fuel your day, from the inside out.",
    href: `${ROUTES.shop}?category=Longevity`,
    Icon: Zap,
    tone: "bg-[#e3f0e3]",
  },
  {
    title: "Sharper Focus",
    description: "Think clearly. Stay in flow.",
    href: `${ROUTES.shop}?category=Focus`,
    Icon: Brain,
    tone: "bg-[#eae6f5]",
  },
  {
    title: "Recover Faster",
    description: "Support muscles. Bounce back stronger.",
    href: `${ROUTES.shop}?category=Recovery`,
    Icon: Dumbbell,
    tone: "bg-[#f3e6d8]",
  },
  {
    title: "Sleep Deeper",
    description: "Rest well. Wake up refreshed.",
    href: ROUTES.protocols,
    Icon: MoonStar,
    tone: "bg-[#dce6f2]",
  },
  {
    title: "Age Better",
    description: "Support longevity at the cellular level.",
    href: `${ROUTES.shop}?category=Longevity`,
    Icon: Leaf,
    tone: "bg-[#f5dede]",
  },
] as const;

const ESSENTIALS = [
  {
    title: "Longevity",
    description: "Support healthy aging, cellular energy, and long-term vitality.",
    href: `${ROUTES.shop}?category=Longevity`,
    editorialImage: essentialLongevityEditorial,
    editorialAlt: "Young green plant growing from a glass flask in a sunlit laboratory",
    editorialPosition: "center",
    Icon: Leaf,
    chips: ["NMN", "Resveratrol", "Omega-3"],
  },
  {
    title: "Focus",
    description: "Promote mental clarity, sustained energy, and cognitive performance.",
    href: `${ROUTES.shop}?category=Focus`,
    editorialImage: essentialFocusEditorial,
    editorialAlt: "Person writing at a desk in a sunlit laboratory",
    editorialPosition: "center",
    Icon: Brain,
    chips: ["Creatine", "Citicoline", "L-Theanine"],
  },
  {
    title: "Recovery",
    description: "Recover faster, reduce soreness, and support peak performance.",
    href: `${ROUTES.shop}?category=Recovery`,
    editorialImage: essentialRecoveryEditorial,
    editorialAlt: "Athlete resting after training on a sunlit coastal terrace",
    editorialPosition: "center",
    Icon: Dumbbell,
    chips: ["Creatine", "Betaine", "Electrolytes"],
  },
  {
    title: "Sleep",
    description: "Promote deeper sleep, calm your mind, and wake up refreshed.",
    href: ROUTES.protocols,
    editorialImage: essentialSleepEditorial,
    editorialAlt: "Person sleeping in a moonlit bedroom",
    editorialPosition: "60% center",
    Icon: MoonStar,
    chips: ["Magnesium", "Apigenin", "Glycine"],
  },
] as const;

const COMPARISON_ROWS = [
  { label: "Every dose disclosed on label", bioaro: "yes", typical: "no" },
  { label: "Testing or proof status stated clearly", bioaro: "yes", typical: "mixed" },
  { label: "Research-led ingredient selection", bioaro: "yes", typical: "mixed" },
  { label: "No hidden proprietary blends", bioaro: "yes", typical: "no" },
  { label: "Excipient details shown clearly", bioaro: "yes", typical: "mixed" },
  { label: "Manufacturing details stated clearly", bioaro: "yes", typical: "mixed" },
  { label: "Support and policy guidance by market", bioaro: "yes", typical: "no" },
] as const;

const EVIDENCE_ITEMS = [
  {
    title: "Transparent labels",
    description: "Every dose disclosed. No hidden blends.",
    Icon: ClipboardList,
  },
  {
    title: "Documentation ready",
    description: "Quality documents are shared when available.",
    Icon: FileCheck2,
  },
  {
    title: "Traceable ingredient context",
    description: "Ingredient and sourcing notes are added where disclosed.",
    Icon: Leaf,
  },
  {
    title: "Manufacturing context",
    description: "Manufacturing details are shown only when confirmed.",
    Icon: FlaskConical,
  },
  {
    title: "Conservative support language",
    description: "Clear guidance without inflated promises.",
    Icon: ShieldCheck,
  },
] as const;

const METHOD_WINDOWS = [
  { label: "Morning", title: "Awaken", description: "Support energy and focus.", Icon: SunMedium },
  { label: "Midday", title: "Perform", description: "Maintain clarity and consistency.", Icon: Zap },
  { label: "Evening", title: "Recover", description: "Restore while you sleep.", Icon: MoonStar },
] as const;

const PROTOCOL_STEPS: ReadonlyArray<{ step: string; label: string; span?: number }> = [
  { step: "STEP 1", label: "Your goal" },
  { step: "STEP 2", label: "Sleep quality" },
  { step: "STEP 3", label: "Energy level" },
  { step: "STEP 4", label: "Age range" },
  { step: "STEP 5", label: "Recommendation", span: 2 },
] as const;

const PERKS = [
  {
    title: "Clear dosage",
    description: "Guidance on every product page.",
    Icon: ClipboardList,
  },
  {
    title: "Clear local pricing",
    description: "Prices and currency match your region.",
    Icon: Globe2,
  },
  {
    title: "Support first",
    description: "Email help before and after purchase.",
    Icon: Mail,
  },
  {
    title: "Quality information",
    description: "Request quality information when available.",
    Icon: FileCheck2,
  },
  {
    title: "Routine guidance",
    description: "Protocols help reduce guesswork.",
    Icon: CalendarRange,
  },
] as const;

function ComparisonState({ value }: { value: "yes" | "no" | "mixed" }) {
  if (value === "yes") {
    return <Check size={16} className="text-[#2f4f3e]" aria-hidden="true" />;
  }

  if (value === "mixed") {
    return <span className="text-[12px] font-medium text-[#8a8678] sm:text-[13px] md:text-[14px]">Mixed</span>;
  }

  return <X size={16} className="text-[#c4bfaf]" aria-hidden="true" />;
}

function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={heroCreagenRecovery}
        alt=""
        className="hero-campaign-image absolute inset-0 h-full w-full object-cover object-[70%_50%] sm:object-[68%_50%] md:object-[58%_50%] lg:object-[54%_50%] xl:object-center"
      />
    </div>
  );
}

export default function Home() {
  const { country } = useMarket();
  const marketHref = useMarketHref();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const supportEmail = SUPPORT_EMAILS[0]?.value ?? "support@bioarodrugs.com";

  useEffect(() => {
    void fetchAllProducts(country).then(setProducts);
  }, [country]);

  const featuredProducts = products.slice(0, 4);

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || typeof window === "undefined") return;

    const subject = encodeURIComponent("Newsletter subscription request");
    const body = encodeURIComponent(`Please add this email to the BioAro Drugs newsletter list:\n\n${email}`);
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="bg-[#f8f6f4]">
      <style>{`
        @keyframes hero-campaign-breathe {
          from { transform: scale(1); }
          to { transform: scale(1.018); }
        }

        .hero-campaign-image {
          animation: hero-campaign-breathe 24s ease-in-out infinite alternate;
          transform-origin: 62% 52%;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-campaign-image { animation: none; }
        }
      `}</style>
      <section className="overflow-hidden bg-[#f7f2ea]">
        <div className="w-full">
          <div className="relative w-full overflow-hidden bg-[#f7f2ea] md:aspect-[16/10] md:min-h-[820px] xl:min-h-[900px] 2xl:min-h-[940px]">
              <div className="relative flex flex-col md:absolute md:inset-0 md:block">
                <div className="order-1 px-5 pb-9 pt-24 sm:px-8 sm:pt-28 md:absolute md:inset-y-0 md:left-0 md:z-10 md:flex md:w-[51%] md:flex-col md:justify-center md:bg-[linear-gradient(90deg,rgba(247,242,234,0.98)_0%,rgba(247,242,234,0.88)_46%,rgba(247,242,234,0.34)_72%,rgba(247,242,234,0)_100%)] md:px-12 md:pb-40 md:pt-28 lg:w-[48%] lg:px-16 xl:w-[46%] xl:px-[72px]">
                  <div className="max-w-[390px] sm:max-w-[470px] md:max-w-[610px]">
                    <span className="inline-flex max-w-full items-center rounded-full border border-[#d9c9b0]/80 bg-white/58 px-4 py-2 text-center text-[9.5px] font-semibold uppercase leading-[1.35] tracking-[0.16em] text-[#8d602c] backdrop-blur-md sm:px-5 sm:text-[11px] sm:tracking-[0.2em]">
                      SCIENCE. NATURE. YOU.
                    </span>
                    <h1 className="mt-5 max-w-[720px] text-balance text-[clamp(44px,12vw,74px)] leading-[0.96] tracking-[-0.035em] text-ink md:mt-6 md:text-[clamp(68px,6vw,88px)] md:leading-[0.92] xl:text-[94px]">
                      Move better.
                      <br />
                      <span className="italic">Recover smarter.</span>
                    </h1>
                    <p className="mt-6 max-w-[350px] text-[16px] leading-[1.65] text-[#2b2824] sm:max-w-[440px] sm:text-[17px] sm:leading-[1.7] md:mt-7 md:max-w-[500px] md:text-[18px]">
                      Science-backed supplements and nutrition protocols for longevity, performance, recovery, and everyday wellness.
                    </p>
                    <div className="mt-7 flex max-w-[380px] flex-col gap-3 md:mt-9 md:max-w-none lg:flex-row lg:flex-nowrap">
                      <Link to={marketHref(ROUTES.shop)} className="btn-primary min-h-[54px] w-full px-8 py-4 text-[15px] shadow-[0_14px_30px_rgba(25,22,17,0.16)] lg:w-auto">
                        Shop Products <ArrowRight size={15} />
                      </Link>
                      <Link to={marketHref(ROUTES.quiz)} className="btn-secondary min-h-[54px] w-full border-[#cfc5b3]/90 bg-white/58 px-8 py-4 text-[15px] backdrop-blur-md lg:w-auto">
                        Build My Stack <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="order-2 relative aspect-[4/3] min-h-[370px] overflow-hidden sm:min-h-[460px] md:absolute md:inset-0 md:min-h-0 md:aspect-auto">
                  <HeroScene />
                  <span className="sr-only">
                    BioAro products on a sunlit coastal path with a runner and subtle scientific details.
                  </span>
                </div>

                <div className="order-3 border-t border-white/70 bg-[rgba(247,242,234,0.88)] px-5 py-3 backdrop-blur-lg sm:px-8 md:absolute md:inset-x-8 md:bottom-20 md:z-20 md:rounded-[22px] md:border md:border-white/70 md:bg-[rgba(247,242,234,0.84)] md:px-4 md:py-3 md:shadow-[0_18px_50px_rgba(35,29,20,0.08)] lg:inset-x-16 lg:bottom-28 xl:inset-x-[72px] xl:bottom-32">
                  <div className="grid grid-cols-2 md:grid-cols-4">
                    {HERO_TRUST_ITEMS.map((item) => (
                      <div key={item.label} className="flex min-h-[64px] items-center justify-center gap-3 border-white/45 px-3 py-2 text-left even:border-l md:min-h-[62px] md:border-l md:px-5 first:md:border-l-0">
                        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/52 text-ink">
                          <item.Icon size={13} />
                        </div>
                        <p className="text-[11.5px] leading-[1.3] text-[#131012] sm:text-[12px]">
                          <span className="block">{item.label}</span>
                          <span className="block">{item.subtitle}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      <section className="bg-[#f8f3f0] py-9">
        <div className="container-bio">
          <div className="mx-auto grid max-w-[1404px] gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {OUTCOME_PILLS.map((item) => (
              <Link
                key={item.title}
                to={marketHref(item.href)}
                className="flex min-h-[116px] w-full items-center gap-3 rounded-2xl border border-[#e6e2d4] bg-[#fbf9f5] px-5 py-5 transition-colors hover:bg-white"
              >
                <div className={`flex h-[42px] w-[42px] items-center justify-center rounded-[16px_6px_16px_6px] ${item.tone}`}>
                  <item.Icon size={20} className="text-ink" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold text-ink">{item.title}</p>
                  <p className="mt-1 text-[12.5px] leading-5 text-[#1b1b1c]">{item.description}</p>
                </div>
                <span className="text-[26px] text-[#5a5958]">›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-bio">
          <div className="mx-auto max-w-[1040px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[680px]">
              <span className="eyebrow">Built for outcomes</span>
              <h2 className="mt-4 text-[46px] leading-[0.95] text-ink md:text-[62px]">
                Four essentials for
                <br />
                better daily <span className="italic text-forest-600">performance.</span>
              </h2>
            </div>
            <p className="max-w-[300px] text-[15px] leading-6 text-[#131012]">
              Every formula supports one of four core needs: live longer, think sharper, recover faster, and sleep deeper.
            </p>
          </div>
          </div>

          <div className="mx-auto mt-12 max-w-[1440px]">
            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-4">
              {ESSENTIALS.map((item, index) => (
                <Link
                  key={item.title}
                  to={marketHref(item.href)}
                  className="group relative h-[590px] overflow-hidden rounded-[20px] border border-[#d7cfbe] bg-[#222518] shadow-[0_24px_50px_-40px_rgba(27,26,23,0.55)] transition-shadow duration-500 hover:shadow-[0_30px_65px_-35px_rgba(27,26,23,0.72)] sm:h-[640px] lg:h-[720px]"
                >
                  <img
                    src={item.editorialImage}
                    alt={item.editorialAlt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                    style={{ objectPosition: item.editorialPosition }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,20,12,0.16)_0%,rgba(20,24,14,0.02)_28%,rgba(25,29,16,0.28)_47%,rgba(22,25,14,0.78)_69%,rgba(17,20,11,0.96)_100%)]" />
                  <span className="absolute left-5 top-5 text-[15px] font-semibold tracking-[0.04em] text-[#fffdf6]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute left-6 top-[48%] flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/65 bg-[#31422b]/35 text-[#fffdf6] backdrop-blur-sm">
                    <item.Icon size={21} strokeWidth={1.5} />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-7 text-[#fffdf6] sm:p-8">
                    <h3 className="font-display text-[42px] leading-[0.9] tracking-[-0.02em] sm:text-[46px]">{item.title}</h3>
                    <div className="mt-5 h-px w-11 bg-[#f4efdf]/80" />
                    <p className="mt-5 max-w-[24ch] text-[16px] leading-6 text-[#fffdf6]/94 sm:text-[17px]">
                      {item.description}
                    </p>
                    <p className="mt-7 text-[12px] font-medium text-[#e3d4ae]">Featuring</p>
                    <p className="mt-2 text-[14px] leading-6 text-[#fffdf6]">{item.chips.join("  •  ")}</p>
                    <span className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#b8e0c1]">
                      Explore {item.title.toLowerCase()}
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[1040px]">
            <div className="mt-8 flex flex-col gap-6 rounded-[20px] border border-[#e2ded2] bg-[#f6f3f0] px-8 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="flex items-center gap-4">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#e3e8de] text-forest-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-[38px] leading-none text-ink">Not sure where to start?</h3>
                <p className="mt-2 text-[14px] text-[#131012]">Take our 60-second quiz and we&apos;ll build your perfect stack.</p>
              </div>
            </div>
            <Link to={marketHref(ROUTES.quiz)} className="btn-primary whitespace-nowrap">
              <Sparkles size={14} /> Take the Wellness Quiz <ArrowRight size={15} />
            </Link>
          </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="container-bio">
          <div className="mx-auto max-w-[1404px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Daily essentials</span>
              <h2 className="mt-3 text-[40px] leading-none md:text-[46px]">The essentials for better daily performance.</h2>
            </div>
            <Link to={marketHref(ROUTES.shop)} className="text-[15px] text-[#131012] transition-colors hover:text-forest-600">
              All products →
            </Link>
          </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-bio">
          <div className="mx-auto grid max-w-[1040px] gap-14 lg:grid-cols-[0.9fr_1.3fr]">
          <div className="max-w-[550px]">
            <span className="eyebrow">The Difference</span>
            <h2 className="mt-4 text-[42px] leading-[0.98] text-ink md:text-[58px]">Why most supplements fall short.</h2>
            <p className="mt-6 max-w-[420px] text-[15px] leading-8 text-[#131012]">
              Many supplements promise more than they deliver. BioAro Drugs is built around transparency, evidence, and formulations designed with purpose.
            </p>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-[#e6e2d4] bg-[#fbf8f2]">
            <div className="grid grid-cols-[1.55fr_0.85fr_0.7fr] border-b border-[#e6e2d4] text-[9.5px] font-semibold uppercase tracking-[0.06em] sm:text-[10.5px] md:grid-cols-[1.2fr_0.65fr_0.55fr] md:text-[11.5px]">
              <div className="bg-[#f1eee6] px-4 py-4 text-[#131012] sm:px-5">Standard</div>
              <div className="bg-[#eae7dc] px-3 py-4 text-center text-[#131012] sm:px-4 md:px-5">BioAro Drugs</div>
              <div className="bg-[#f1eee6] px-3 py-4 text-center text-[#131012] sm:px-4 md:px-5">Typical</div>
            </div>
            {COMPARISON_ROWS.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.55fr_0.85fr_0.7fr] border-b border-[#e6e2d4] last:border-b-0 md:grid-cols-[1.2fr_0.65fr_0.55fr]">
                <div className="px-4 py-4 text-[13px] leading-[1.45] text-[#1b1a17] sm:px-5 sm:text-[14px] md:py-5">
                  {row.label}
                </div>
                <div className="flex items-center justify-center border-x border-[#e6e2d4] px-3 py-4 sm:px-4 md:px-5 md:py-5">
                  <ComparisonState value={row.bioaro} />
                </div>
                <div className="flex items-center justify-center px-3 py-4 sm:px-4 md:px-5 md:py-5">
                  <ComparisonState value={row.typical} />
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-bio">
          <div className="mx-auto grid max-w-[1472px] gap-[60px] lg:grid-cols-[685px_minmax(0,1fr)] lg:items-center">
            <div className="overflow-hidden rounded-[22px] lg:aspect-[685/930]">
              <img src={evidenceScientistEditorial} alt="Scientist conducting laboratory work" className="h-full w-full object-cover" />
            </div>

            <div className="pt-6 lg:pt-0">
              <span className="eyebrow">Science &amp; Trust</span>
              <h2 className="mt-4 max-w-[640px] text-[42px] leading-[0.96] text-ink md:text-[61px] md:leading-[0.9]">
                Built around evidence,<span className="md:whitespace-nowrap"> not <span className="italic text-forest-600">trends.</span></span>
              </h2>
              <p className="mt-7 max-w-[420px] text-[15px] leading-8 text-[#131012]">
                BioAro Drugs is grounded in transparent labels, useful ingredient context, and quality information where available.
              </p>

              <div className="mt-8 max-w-[620px] space-y-0">
                {EVIDENCE_ITEMS.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 border-b border-[#e1ddce] px-0 py-[18px] last:border-b-0">
                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[19px] bg-[#e3e8de] text-forest-600">
                      <item.Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
                      <p className="mt-1 text-[13.5px] leading-6 text-[#131012]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 w-full max-w-[1200px] overflow-hidden rounded-[28px] border border-[#e2d8c3] bg-[#faf8f4] shadow-[0_12px_30px_-24px_rgba(27,26,23,0.35)]">
                <div className="flex flex-col divide-y divide-[#e1ddce] md:flex-row md:divide-y-0">
                  {CREDIBILITY_ITEMS.map((item) => (
                    <div
                      key={item.title}
                      className={`flex w-full items-center gap-[10px] px-4 py-[18px] md:w-[33.3333%] md:px-4 ${
                        item.title !== "Formulated in Canada" ? "md:border-r md:border-[#e1ddce]" : ""
                      }`}
                    >
                      <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center text-[#0f3d1e]">
                        <item.Icon size={item.title === "Formulated in Canada" ? 52 : 48} className="h-auto w-auto" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-semibold leading-none text-[#1B1A17]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-[11.5px] font-normal leading-none text-[#8A8678]">{item.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-4">
        <div className="container-bio">
          <div className="mx-auto max-w-[680px] text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b5e58]">The BioAro Method</span>
            <h2 className="mx-auto mt-4 max-w-[10ch] text-[36px] leading-[0.98] text-ink sm:text-[42px] md:max-w-none md:text-[62px]">
              <span className="block md:inline md:whitespace-nowrap">One protocol. Three windows.</span>
              <span className="block md:inline md:ml-3">All day.</span>
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-[1404px] gap-5 lg:grid-cols-3">
            {METHOD_WINDOWS.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[#e2ded2] bg-[#f2f0ec] px-[29px] pb-[33px] pt-[29px]">
                <div className="flex h-7 w-7 items-center justify-center text-[#c7923a]">
                  <item.Icon size={18} />
                </div>
                <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b5e58]">{item.label}</p>
                <h3 className="mt-2 text-[21px] leading-none text-ink">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-[21px] text-[#131012]">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-[1404px] rounded-[24px] bg-[#f2f0ec] px-8 py-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="max-w-[420px]">
                <span className="eyebrow">Personalize</span>
                <h2 className="mt-4 text-[40px] leading-[0.98] text-ink md:text-[48px]">Find your perfect protocol.</h2>
                <p className="mt-5 max-w-[380px] text-[17px] leading-8 text-[#131012]">
                  Answer a few simple questions and we&apos;ll recommend the BioAro stack that fits your goals.
                </p>
                <Link to={marketHref(ROUTES.quiz)} className="btn-primary mt-8 inline-flex">
                  Take the Wellness Quiz
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {PROTOCOL_STEPS.map((item) => (
                  <div
                    key={item.step}
                    className={`rounded-[14px] border border-[#e2ded2] bg-[#f6f5f2] px-5 py-5 ${
                      item.span === 2 ? "sm:col-span-2" : ""
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.08em] text-[#8a8678]">{item.step}</p>
                    <p className="mt-2 text-[15.5px] font-semibold text-ink">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-6">
        <div className="container-bio">
          <div className="mx-auto max-w-[620px] text-center">
              <span className="eyebrow">Living 2.0 guidance</span>
            <h2 className="mt-4 text-[42px] leading-[0.95] text-ink md:text-[52px]">Stay consistent. Feel the difference.</h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-[1040px] gap-4 md:grid-cols-2 xl:grid-cols-5">
            {PERKS.map((item) => (
              <div key={item.title} className="rounded-[16px] border border-[#e2ded2] bg-[#f2f0ec] px-5 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f6f1] text-ink">
                  <item.Icon size={18} />
                </div>
                <h3 className="mt-4 text-[15.5px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-[12.5px] leading-6 text-[#131012]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-bio">
          <div className="mx-auto max-w-[700px] text-center">
            <span className="text-[13px] text-gold">★★★★★</span>
            <h2 className="mt-5 text-[40px] leading-[0.98] text-ink md:text-[52px]">Built for people who want clearer answers.</h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-[1040px] gap-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
            <div className="pt-1">
              <span className="eyebrow">LETTER FROM THE FOUNDER</span>
              <blockquote className="mt-6 max-w-[672px] font-display text-[31px] font-normal leading-[1.16] text-ink sm:text-[33px] md:text-[35px]">
                We believe everyone deserves to live better, not by guessing, but by understanding. Through years of research and conversations with 10,000+ participants, we found that people want to take control of their health but often don&apos;t know where to begin. BioAro Drugs exists to make that first step simpler with clear, effective formulas built for longevity, focus, recovery, and sleep. Because better health should feel easier, clearer, and more personal ❤️.
              </blockquote>
              <div className="mt-10 flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-full bg-forest-600" />
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">Dr. Elena Park, PhD</p>
                  <p className="text-[12.5px] text-[#8a8678]">Founder &amp; Chief Science Officer</p>
                </div>
              </div>
              <Link to={marketHref(ROUTES.living)} className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-forest-600">
                Explore Living 2.0 <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[20px] shadow-[0_24px_50px_-40px_rgba(27,26,23,0.35)]">
              <img src={founderVisual} alt="BioAro Labs visual" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-6">
        <div className="container-bio">
          <div className="mx-auto max-w-[1404px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Journal</span>
              <h2 className="mt-3 text-[36px] leading-none md:text-[40px]">Education hub.</h2>
            </div>
            <Link to={marketHref(ROUTES.journal)} className="text-[15px] text-[#131012] transition-colors hover:text-forest-600">
              All articles →
            </Link>
          </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {JOURNAL_ARTICLES.slice(0, 3).map((article) => (
              <Link
                key={article.title}
                to={marketHref(`${ROUTES.journal}/${article.slug}`)}
                className="group overflow-hidden rounded-2xl border border-[#e2ded2] bg-[#f2f0ec] transition-colors hover:bg-white"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#ece8de]">
                  <img
                    src={article.img}
                    alt={article.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-7">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-forest-600">{article.cat}</span>
                  <h3 className="mt-4 text-[25px] leading-[1.05] text-[#1e1816] sm:text-[26px] md:text-[28px]">{article.title}</h3>
                  <p className="mt-4 text-[14px] leading-7 text-[#564b46]">{article.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between pt-4 text-[13px] text-[#8a8678]">
                    <span>{article.readTime}</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

            <div className="mt-12 flex flex-col gap-8 rounded-[24px] border border-[#e2ded2] bg-[#f2f0ec] px-[57px] pb-[55px] pt-[67px] lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[550px]">
              <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#a49a95]">The Dispatch</span>
              <h2 className="mt-3 text-[34px] leading-[0.98] md:text-[43px]">
                Premium wellness, in your inbox
                <br />
                weekly.
              </h2>
              <p className="mt-4 max-w-[360px] text-[14.5px] leading-7 text-[#564b46]">
                New protocols, science deep-dives and member-only drops. No noise. Unsubscribe anytime.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-[377px] flex-col gap-3 sm:flex-row sm:items-start sm:gap-[10px]">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="you@domain.com"
                className="h-12 w-full rounded-full border border-[#ddd8c9] bg-white px-[19px] text-[14px] text-[#757575] outline-none placeholder:text-[#757575]"
                aria-label="Email address"
                required
              />
              <button type="submit" className="btn-primary h-12 whitespace-nowrap !bg-[#161412] !px-[27px] !py-0 hover:!bg-ink">
                Subscribe
              </button>
            </form>
          </div>

          <div
            className="relative mt-12 overflow-hidden rounded-[32px] border border-white/10 px-6 py-12 text-white shadow-[0_32px_90px_-48px_rgba(10,8,6,0.8)] sm:px-10 sm:py-14 lg:px-14 lg:py-16"
            style={{
              background:
                "radial-gradient(circle at 18% 18%, rgba(97,128,71,0.24) 0%, rgba(97,128,71,0) 36%), radial-gradient(circle at 82% 18%, rgba(180,137,63,0.20) 0%, rgba(180,137,63,0) 34%), radial-gradient(circle at 50% 84%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 40%), linear-gradient(180deg, #1b1511 0%, #15100d 100%)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_26%,rgba(255,255,255,0.02)_52%,rgba(255,255,255,0)_76%,rgba(255,255,255,0.035)_100%)] opacity-60" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-14">
              <div className="text-center lg:text-left">
                <span className="eyebrow text-[#c6b59a]">Ready to begin</span>
                <h2 className="mx-auto mt-4 max-w-[11ch] font-display text-[clamp(2.55rem,4.8vw,4.4rem)] leading-[1] tracking-[-0.02em] text-white lg:mx-0">
                  Your daily protocol starts here.
                </h2>
                <p className="mx-auto mt-5 max-w-[34rem] text-[15px] leading-7 text-[#d7cfbf] sm:text-[16px] lg:mx-0 lg:max-w-[34rem]">
                  Science-backed formulas for energy, recovery, focus, sleep, and long-term wellness - built to fit your routine, not complicate it.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                  <Link
                    to={marketHref(ROUTES.shop)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#f6f1e7] px-7 py-3.5 text-[15px] font-medium text-ink transition-transform transition-colors hover:-translate-y-0.5 hover:bg-white sm:w-auto"
                  >
                    Shop Products
                  </Link>
                  <Link
                    to={marketHref(ROUTES.quiz)}
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/22 bg-white/6 px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:border-white/35 hover:bg-white/10 sm:w-auto"
                  >
                    Build My Stack
                  </Link>
                </div>

                <div className="mx-auto mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-[12px] leading-5 text-[#e3ddce] backdrop-blur-sm lg:mx-0 lg:justify-start">
                  <span>Third-party tested</span>
                  <span className="text-white/35">•</span>
                  <span>cGMP certified</span>
                  <span className="text-white/35">•</span>
                  <span>Formulated in Canada</span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
                <div className="absolute inset-6 rounded-[28px] bg-[radial-gradient(circle_at_50%_35%,rgba(111,146,77,0.28)_0%,rgba(111,146,77,0)_48%),radial-gradient(circle_at_70%_30%,rgba(186,141,63,0.24)_0%,rgba(186,141,63,0)_42%)] blur-2xl" />
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_28px_55px_-38px_rgba(0,0,0,0.8)]">
                  <img src={ctaProductVisual} alt="BioAro luxury product visual" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
