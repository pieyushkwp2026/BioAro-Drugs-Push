"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { OFFERINGS } from "@/data/navigation";
import { LabsSceneVisual, DrugsSceneVisual } from "@/components/visuals/ScientificVisuals";

export function OfferingCards() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="ecosystem" className="relative bg-bioaro-bg py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-10 lg:grid-cols-2">
        {OFFERINGS.map((offering, index) => {
          const isLabs = offering.title === "BioAro Labs";

          return (
            <motion.div
              key={offering.title}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Link
                href={offering.href}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[rgba(0,183,255,0.1)] p-3 shadow-ambient transition-all duration-500 hover:-translate-y-1.5 hover:border-[rgba(0,183,255,0.28)] hover:shadow-lift ${
                  isLabs
                    ? "bg-[radial-gradient(ellipse_110%_60%_at_20%_-10%,rgba(0,183,255,0.13),transparent_55%),linear-gradient(180deg,#0C1B31,#060E1B)]"
                    : "bg-[radial-gradient(ellipse_110%_60%_at_80%_-10%,rgba(0,183,255,0.13),transparent_55%),linear-gradient(180deg,#0C1B31,#060E1B)]"
                }`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {isLabs ? <LabsSceneVisual /> : <DrugsSceneVisual />}

                <div className="flex flex-1 flex-col px-6 pb-8 pt-9 md:px-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-bioaro-soft/75">
                    {offering.title}
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-[2.6rem]">
                    {offering.tagline}
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-8 text-bioaro-muted">
                    {offering.description}
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-x-8">
                    {offering.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="flex items-center gap-3 border-t border-white/[0.07] py-3.5"
                      >
                        <span className="h-1 w-1 rounded-full bg-bioaro-soft" />
                        <span className="text-sm text-bioaro-text">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <span className="mt-auto inline-flex items-center gap-2 pt-9 text-sm font-semibold text-white transition-colors duration-300 group-hover:text-bioaro-soft">
                    {offering.cta}
                    <ArrowRight className="h-4 w-4 text-bioaro-soft transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
