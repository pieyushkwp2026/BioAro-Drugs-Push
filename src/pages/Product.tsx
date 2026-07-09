import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Star, Zap, Dna, Scale, Heart, Brain, Shield, Flame, Droplet, Sparkles, ArrowRight } from "lucide-react";
import AccordionGroup from "../components/page/AccordionGroup";
import IngredientCard from "../components/sections/IngredientCard";
import PlaceholderBottle from "../components/sections/PlaceholderBottle";
import { fetchProductByHandle, fetchAllProducts } from "../lib/shopify/productService";
import type { CatalogProduct, ProductWhyItem } from "../lib/shopify/types";
import { useMarket } from "../hooks/useMarket";
import { formatMoney } from "../lib/market/config";
import { COMPARISON_ROWS, TESTIMONIALS, FEATURED_TESTIMONIAL } from "../data/pdpContent";

const WHY_ICONS: Record<ProductWhyItem["icon"], typeof Zap> = {
  energy: Zap,
  aging: Dna,
  balance: Scale,
  heart: Heart,
  brain: Brain,
  shield: Shield,
  flame: Flame,
  droplet: Droplet,
  sparkle: Sparkles,
};

const REGION_DISCLAIMERS = {
  NA: "Statements about wellness support describe general product positioning only and are not intended to diagnose, treat, cure, or prevent disease.",
  UK: "BioAro products are presented as food supplements. Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
} as const;

function initialsFor(title: string) {
  const words = title.split(" ").filter(Boolean);
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}

export default function Product() {
  const { handle } = useParams();
  const { country, region } = useMarket();
  const [product, setProduct] = useState<CatalogProduct | null | undefined>(undefined);
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    if (!handle) return;
    void fetchProductByHandle(handle, country).then((nextProduct) => setProduct(nextProduct ?? null));
  }, [country, handle]);

  useEffect(() => {
    void fetchAllProducts(country).then(setCatalog);
  }, [country]);

  const routineMates = useMemo(
    () => catalog.filter((item) => item.handle !== handle).slice(0, 2),
    [catalog, handle],
  );

  if (product === undefined) return <div className="pt-40 text-center text-ink/40">Loading…</div>;
  if (product === null) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p className="text-ink/50">Product not found.</p>
        <Link to="/shop" className="text-forest-600 underline mt-2 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  const maxEfficacy = Math.max(product.efficacyMetric.placeboValue, product.efficacyMetric.productValue);
  const showGraph = product.efficacyMetric.label !== "" && maxEfficacy > 0;

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <Link to="/shop" className="text-sm text-ink/50 hover:text-ink">
          &larr; Shop
        </Link>

        {/* Hero */}
        <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_0.95fr]">
          <div className="flex items-center justify-center rounded-[32px] bg-[#EDEBE4] p-8 lg:p-12">
            {product.image ? (
              <img src={product.image.src} alt={product.image.alt} className="h-auto w-full max-w-[360px] object-contain drop-shadow-[0_24px_48px_rgba(27,26,23,0.18)]" />
            ) : (
              <PlaceholderBottle initials={initialsFor(product.title)} className="w-full max-w-[240px]" />
            )}
          </div>

          <div>
            <span className="eyebrow">{product.category}</span>
            <h1 className="mt-3 text-4xl md:text-5xl">{product.title}</h1>
            <p className="mt-3 text-forest-600">{product.tagline}</p>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-0.5 text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <span className="font-medium text-ink">{product.rating.average}</span>
              <span className="text-ink/40">· {product.rating.count.toLocaleString()} reviews</span>
            </div>

            <p className="mt-5 text-ink/60 leading-relaxed">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/55">
                  {tag}
                </span>
              ))}
            </div>

            <div className="glass-card mt-6 flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">{product.supplyLabel}</p>
                <p className="mt-1 text-sm text-ink/55">{product.servings}</p>
              </div>
              <p className="font-display text-3xl">{formatMoney(product.price.amount, country)}</p>
            </div>
            <p className="mt-3 text-sm text-ink/45">{product.bestFor}</p>

            <div className="mt-8">
              <h2 className="text-xl">What to expect from this page</h2>
              <ul className="mt-4 space-y-3">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm text-ink/65">
                    <Check size={16} className="mt-0.5 shrink-0 text-forest-600" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Why this product */}
        <section className="mt-24">
          <span className="eyebrow">Why {product.title}?</span>
          <h2 className="mt-2 max-w-xl text-3xl">Built around what matters for this routine, not everything at once.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {product.whyItems.map((item) => {
              const Icon = WHY_ICONS[item.icon];
              return (
                <div key={item.title} className="text-center md:text-left">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-600/10 text-forest-600 md:mx-0">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/55">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Science behind the formula */}
        <section className="glass-card mt-10 grid gap-8 p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="eyebrow">Science behind the formula</span>
            <h2 className="mt-2 text-2xl">A synergistic blend of clinically studied ingredients working at the cellular level.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {product.science.map((step, index) => (
              <div key={step.title} className="flex items-center gap-3">
                <div className="w-32 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-forest-600/10 text-forest-600">
                    <Shield size={18} />
                  </div>
                  <p className="mt-2 text-sm font-medium">{step.title}</p>
                  <p className="mt-1 text-xs text-ink/45 leading-snug">{step.description}</p>
                </div>
                {index < product.science.length - 1 && <ArrowRight size={16} className="hidden shrink-0 text-ink/25 md:block" />}
              </div>
            ))}
          </div>
        </section>

        {/* Key ingredients */}
        <section className="mt-24">
          <div className="flex items-end justify-between">
            <div>
              <span className="eyebrow">Key ingredients</span>
              <h2 className="mt-2 text-3xl">Clinically studied. Purposefully dosed.</h2>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {product.ingredients.map((ingredient) => (
              <IngredientCard key={ingredient.name} ingredient={ingredient} />
            ))}
          </div>
        </section>

        {/* Backed by science + comparison */}
        <div className="mt-24 grid gap-5 lg:grid-cols-2">
          <section className="glass-card p-6 md:p-8" style={{ background: "linear-gradient(180deg, #EEF2EC, #F8F6F4)" }}>
            <h2 className="text-2xl">Backed by science</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {product.evidencePoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-ink/70">
                  <Check size={16} className="shrink-0 text-forest-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {showGraph && (
              <div className="mt-6 rounded-2xl bg-white/60 p-5">
                <p className="text-sm font-medium">{product.efficacyMetric.label}</p>
                <div className="mt-6 flex items-end justify-center gap-10">
                  <div className="text-center">
                    <div
                      className="mx-auto w-10 rounded-t-md bg-sand"
                      style={{ height: `${(product.efficacyMetric.placeboValue / maxEfficacy) * 96}px` }}
                    />
                    <p className="mt-2 text-xs text-ink/45">Placebo</p>
                  </div>
                  <div className="text-center">
                    <div
                      className="mx-auto w-10 rounded-t-md bg-forest-600"
                      style={{ height: `${(product.efficacyMetric.productValue / maxEfficacy) * 96}px` }}
                    />
                    <p className="mt-2 text-xs text-ink/45">{product.title}</p>
                  </div>
                </div>
                <p className="mt-4 text-center text-[11px] text-ink/40">{product.efficacyMetric.caption}</p>
              </div>
            )}
          </section>

          <section className="glass-card p-7 md:p-10">
            <h2 className="text-[28px] leading-tight md:text-[34px]">BioAro vs. typical supplements</h2>
            <div className="mt-6 divide-y divide-ink/10 text-[15px] md:text-[17px]">
              <div className="grid grid-cols-3 gap-4 pb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/45 md:text-[12px]">
                <span />
                <span>BioAro {product.title.replace(/\+$/, "")}</span>
                <span>Typical supplement</span>
              </div>
              {COMPARISON_ROWS.map((row) => (
                <div key={row.label} className="grid grid-cols-3 items-center gap-4 py-4 md:py-5">
                  <span className="text-ink/60">{row.label}</span>
                  <span className="font-medium text-forest-600">{row.bioaro}</span>
                  <span className="text-ink/40">{row.typical}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Testimonials */}
        <section className="mt-24">
          <span className="eyebrow">What our customers say</span>
          <h2 className="mt-2 text-3xl">Real people. Real routines.</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.name} className="glass-card p-5">
                  <div className="flex items-center gap-0.5 text-gold-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{testimonial.quote}</p>
                  <p className="mt-4 text-xs font-medium text-ink">{testimonial.name}</p>
                  <p className="text-xs text-ink/40">{testimonial.location}</p>
                </div>
              ))}
            </div>
            <div className="glass-dark relative flex flex-col justify-center overflow-hidden rounded-[24px] p-8 text-white">
              <span className="text-3xl text-white/30">&ldquo;</span>
              <p className="mt-2 text-xl leading-snug">{FEATURED_TESTIMONIAL.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-medium">
                  {FEATURED_TESTIMONIAL.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{FEATURED_TESTIMONIAL.name}</p>
                  <p className="text-xs text-white/50">{FEATURED_TESTIMONIAL.location}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete your daily routine */}
        {routineMates.length > 0 && (
          <section className="glass-card mt-24 p-6 md:p-8">
            <span className="eyebrow">Complete your daily routine</span>
            <h2 className="mt-2 text-2xl">Stack your supplements. Amplify your results.</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {routineMates.map((mate) => (
                <Link
                  key={mate.handle}
                  to={`/shop/${mate.handle}`}
                  className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/50 p-4 transition-colors hover:bg-white"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f1eee6] p-2">
                    {mate.image ? (
                      <img src={mate.image.src} alt={mate.image.alt} className="h-full w-full object-contain" />
                    ) : (
                      <PlaceholderBottle initials={initialsFor(mate.title)} className="h-full w-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{mate.title}</p>
                    <p className="text-xs text-ink/45">{mate.tagline}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-ink/30" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Supplement facts + warnings */}
        <div className="mt-24 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">Supplement facts</h2>
            <div className="mt-5 divide-y divide-ink/10">
              {product.supplementFacts.map((fact) => (
                <div key={fact.label} className="flex items-start justify-between gap-3 py-3 text-sm">
                  <span className="shrink-0 text-ink/55">{fact.label}</span>
                  <span className="font-medium text-right">{fact.value}</span>
                </div>
              ))}
            </div>
            {product.responsibleBusiness && (
              <div className="mt-6 border-t border-ink/10 pt-5 text-xs text-ink/45 leading-relaxed">
                <p className="font-medium text-ink/60">Responsible Food Business</p>
                <p className="mt-1">{product.responsibleBusiness.name}</p>
                <p>{product.responsibleBusiness.address}</p>
              </div>
            )}
            <div className="mt-4 rounded-2xl border border-ink/10 bg-white/45 px-4 py-4 text-sm leading-relaxed text-ink/55">
              {REGION_DISCLAIMERS[region]}
            </div>
          </section>

          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">Warnings</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink/60">
              {product.warnings.map((warning) => (
                <li key={warning} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-forest-600 shrink-0" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Quality & Compliance — above FAQ */}
        {product.qualityPoints && product.qualityPoints.length > 0 && (
          <section className="mt-12 glass-card p-6 md:p-8">
            <span className="eyebrow">Quality & Compliance</span>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.qualityPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-ink/70">
                  <Check size={15} className="shrink-0 text-forest-600" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-12 max-w-3xl">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-2 mb-6 text-3xl">Frequently asked questions</h2>
          <AccordionGroup
            items={product.faq.map((item) => ({
              title: item.question,
              body: item.answer,
            }))}
          />
        </section>

        {/* Bottom CTA banners */}
        <div className="mt-24 grid gap-5 md:grid-cols-2">
          <div className="glass-dark flex flex-col justify-between rounded-[24px] p-8 text-white">
            <div>
              <h3 className="text-2xl">Ready to invest in your future?</h3>
              <p className="mt-2 text-sm text-white/60">Every healthier tomorrow begins with today's decisions.</p>
            </div>
            <Link to="/shop" className="btn-secondary mt-6 !border-white/20 !text-white hover:!bg-white/10">
              Browse all formulas
            </Link>
          </div>
          <div className="rounded-[24px] bg-[#EEF2EC] p-8">
            <h3 className="text-2xl">Want a more personalized approach?</h3>
            <p className="mt-2 text-sm text-ink/60">Take the quiz to build a routine matched to your goals.</p>
            <Link to="/quiz" className="btn-primary mt-6">
              Take the quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}