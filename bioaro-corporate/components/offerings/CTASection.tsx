"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import { BIOARO_DRUGS_URL, BIOARO_LABS_URL } from "@/data/navigation";
import { CTAHalo } from "@/components/visuals/ScientificVisuals";

export function CTASection() {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative overflow-hidden py-32 md:py-44">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(0,183,255,0.13),transparent_65%),linear-gradient(180deg,#071322,#030712)]" />
      <CTAHalo />

      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-10">
        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-bioaro-blue/70" />
          <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-bioaro-soft/85">
            Start Here
          </p>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-bioaro-blue/70" />
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="mt-8 font-display text-5xl font-semibold tracking-tight text-white md:text-7xl"
        >
          Start Your Living 2.0 Journey
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-bioaro-muted"
        >
          Understand your health through advanced diagnostics, or improve your
          daily performance with science-backed wellness formulas — BioAro helps
          you take the next step with confidence.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <PrimaryButton href={BIOARO_LABS_URL}>Explore BioAro Labs</PrimaryButton>
          <SecondaryButton href={BIOARO_DRUGS_URL}>Explore BioAro Drugs</SecondaryButton>
          <SecondaryButton href="/consultation">Book a Consultation</SecondaryButton>
        </motion.div>
      </div>
    </section>
  );
}
