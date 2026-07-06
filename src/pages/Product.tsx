import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import AccordionGroup from "../components/page/AccordionGroup";
import { fetchProductByHandle } from "../lib/shopify/productService";
import type { CatalogProduct } from "../lib/shopify/types";
import { useMarket } from "../hooks/useMarket";
import { formatMoney } from "../lib/market/config";
import { useCart } from "../hooks/useCart";

const REGION_DISCLAIMERS = {
  NA: "Statements about wellness support describe general product positioning only and are not intended to diagnose, treat, cure, or prevent disease.",
  UK: "BioAro products are presented as food supplements. Do not exceed the recommended daily dose and do not use supplements as a substitute for a varied, balanced diet and healthy lifestyle.",
} as const;

export default function Product() {
  const { handle } = useParams();
  const { addProduct } = useCart();
  const { country, region } = useMarket();
  const [product, setProduct] = useState<CatalogProduct | null | undefined>(undefined);

  useEffect(() => {
    if (!handle) return;
    void fetchProductByHandle(handle, country).then((nextProduct) => setProduct(nextProduct ?? null));
  }, [country, handle]);

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

  return (
    <div className="pt-32 pb-24">
      <div className="container-bio">
        <Link to="/shop" className="text-sm text-ink/50 hover:text-ink">
          &larr; Shop
        </Link>

        <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_0.95fr]">
          <div className="glass-card aspect-square overflow-hidden bg-[#EDEBE4] p-10">
            <img src={product.image.src} alt={product.image.alt} className="h-full w-full object-contain" />
          </div>

          <div>
            <span className="eyebrow">{product.category}</span>
            <h1 className="mt-3 text-4xl md:text-5xl">{product.title}</h1>
            <p className="mt-3 text-forest-600">{product.tagline}</p>
            <p className="mt-5 text-ink/60 leading-relaxed">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/55">{product.supplyLabel}</span>
              <span className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/55">{product.servings}</span>
              <span className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/55">Daily guidance included</span>
            </div>
            <p className="mt-4 text-sm text-ink/45">{product.bestFor}</p>

            <div className="glass-card mt-6 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Daily guidance</p>
                  <p className="mt-1 text-sm text-ink/55">{product.dosage}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl">{formatMoney(product.price.amount, country)}</p>
                  {product.compareAtPrice && (
                    <p className="text-xs text-ink/35 line-through">{formatMoney(product.compareAtPrice.amount, country)}</p>
                  )}
                </div>
              </div>
            </div>

            <button onClick={() => void addProduct(product)} className="btn-primary mt-4 w-full !py-4" disabled={!product.availableForSale}>
              {product.availableForSale ? `Add to Cart — ${formatMoney(product.price.amount, country)}` : "Currently unavailable"}
            </button>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.trustNotes.map((note) => (
                <div key={note} className="rounded-2xl border border-ink/10 bg-white/45 px-4 py-4 text-sm leading-relaxed text-ink/55">
                  {note}
                </div>
              ))}
            </div>

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

        <div className="mt-24 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">Supplement facts</h2>
            <div className="mt-5 divide-y divide-ink/10">
              {product.supplementFacts.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="text-ink/55">{fact.label}</span>
                  <span className="font-medium text-right">{fact.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-ink/10 bg-white/45 px-4 py-4 text-sm leading-relaxed text-ink/55">
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

        <section className="mt-24">
          <span className="eyebrow">Ingredients</span>
          <h2 className="mt-2 text-3xl">Why each ingredient is here</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {product.ingredients.map((ingredient) => (
              <div key={ingredient.name} className="glass-card p-5">
                <h3 className="text-lg">{ingredient.name}</h3>
                <p className="mt-2 text-sm font-medium text-forest-600">{ingredient.amount}</p>
                <p className="mt-3 text-sm text-ink/55">{ingredient.purpose}</p>
                {ingredient.whyIncluded && <p className="mt-3 text-xs leading-relaxed text-ink/45">{ingredient.whyIncluded}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <span className="eyebrow">Mechanism to routine</span>
          <h2 className="mt-2 text-3xl">From ingredient context to everyday use</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {product.science.map((step, index) => (
              <div key={step.title} className="glass-card p-5">
                <span className="text-xs text-ink/35">0{index + 1}</span>
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 max-w-3xl">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-2 mb-6 text-3xl">Common questions</h2>
          <AccordionGroup
            items={product.faq.map((item) => ({
              title: item.question,
              body: item.answer,
            }))}
          />
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.title}</p>
            <p className="text-xs text-ink/45">{formatMoney(product.price.amount, country)}</p>
          </div>
          <button onClick={() => void addProduct(product)} className="btn-primary !px-5 !py-3 text-xs" disabled={!product.availableForSale}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
