"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { DRUG_PRODUCTS, TRUST_CLAIMS } from "@/data/navigation";
import { ProductVesselVisual, type VesselVariant } from "@/components/visuals/ScientificVisuals";

const VARIANTS: VesselVariant[] = ["tall", "capsule", "wide"];

export function ProductCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const onScroll = () => {
      const max = node.scrollWidth - node.clientWidth;
      setProgress(max > 0 ? node.scrollLeft / max : 0);
    };

    onScroll();
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: direction === "right" ? 400 : -400,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-6">
        <p className="max-w-xl text-base leading-8 text-bioaro-muted">
          A curated wellness line designed as part of the wider BioAro
          precision-health ecosystem.
        </p>
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll products left"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.03] text-white transition-all duration-300 hover:border-[rgba(92,206,255,0.4)] hover:bg-[rgba(0,183,255,0.08)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll products right"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.03] text-white transition-all duration-300 hover:border-[rgba(92,206,255,0.4)] hover:bg-[rgba(0,183,255,0.08)]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {DRUG_PRODUCTS.map((product, index) => (
          <motion.article
            key={product.title}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-[82%] snap-start sm:min-w-[380px]"
          >
            <Link
              href={product.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[rgba(0,183,255,0.1)] bg-card-sheen p-3 shadow-ambient transition-all duration-500 hover:-translate-y-1.5 hover:border-[rgba(0,183,255,0.28)] hover:shadow-lift"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                <ProductVesselVisual
                  variant={VARIANTS[index % VARIANTS.length]}
                  accent={(index % 3) + 1}
                />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-7 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bioaro-soft/75">
                  {product.category}
                </p>
                <h3 className="mt-3 font-display text-[1.7rem] font-semibold tracking-tight text-white">
                  {product.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-bioaro-muted">
                  {product.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-bioaro-soft">
                  Learn More
                  <ArrowRight className="h-4 w-4 text-bioaro-soft transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* scroll progress */}
      <div className="mt-6 hidden h-px w-full bg-white/[0.07] md:block">
        <div
          className="h-px bg-gradient-to-r from-bioaro-blue to-bioaro-soft transition-transform duration-150 ease-out"
          style={{
            width: "25%",
            transform: `translateX(${progress * 300}%)`,
          }}
        />
      </div>

      {/* trust line */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-white/[0.07] pt-9">
        {TRUST_CLAIMS.map((claim) => (
          <span key={claim} className="inline-flex items-center gap-2.5 text-sm text-bioaro-muted">
            <ShieldCheck className="h-4 w-4 text-bioaro-soft/80" />
            {claim}
          </span>
        ))}
      </div>
    </div>
  );
}
