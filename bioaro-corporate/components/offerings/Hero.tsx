"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { BIOARO_DRUGS_URL, BIOARO_LABS_URL } from "@/data/navigation";
import { HeroEcosystemVisual } from "@/components/visuals/ScientificVisuals";

const stats = [
  ["50+", "Advanced diagnostic tests"],
  ["8", "Health intelligence categories"],
  ["9", "Bioactive wellness formulas"],
  ["1", "Connected ecosystem"],
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative overflow-hidden bg-hero-radial pt-36 md:pt-44">
      <div className="absolute inset-0 bg-grid-fade bg-[size:64px_64px] opacity-[0.04] [mask-image:linear-gradient(180deg,white,transparent_80%)]" />
      <div className="absolute left-[-10%] top-[10%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(0,183,255,0.08),transparent_65%)] blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-16 pb-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
          <div className="relative z-10">
            <motion.div {...fadeUp(0)} className="flex items-center gap-4">
              <span className="h-px w-12 bg-gradient-to-r from-bioaro-blue to-transparent" />
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-bioaro-soft/80">
                Our Offerings
              </p>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-8 font-display text-[3.4rem] font-semibold leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-[5.2rem]"
            >
              Two ecosystems.
              <br />
              One mission.
              <br />
              <span className="bg-gradient-to-r from-bioaro-soft via-bioaro-cyan to-bioaro-blue bg-clip-text text-transparent">
                Living 2.0.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.24)}
              className="mt-9 max-w-xl text-lg leading-8 text-bioaro-text"
            >
              BioAro is the intelligence layer for personalized healthcare —
              connecting advanced diagnostics through BioAro Labs with
              science-backed daily action through BioAro Drugs.
            </motion.p>

            <motion.div {...fadeUp(0.36)} className="mt-11 flex flex-wrap gap-4">
              <PrimaryButton href={BIOARO_LABS_URL}>Explore BioAro Labs</PrimaryButton>
              <SecondaryButton href={BIOARO_DRUGS_URL}>Explore BioAro Drugs</SecondaryButton>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:-mr-10 xl:-mr-20"
          >
            <HeroEcosystemVisual />
          </motion.div>
        </div>

        {/* institutional stat strip */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/[0.07] py-12 md:grid-cols-4"
        >
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {value}
              </p>
              <p className="mt-3 text-sm leading-6 text-bioaro-muted">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
