"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Atom, Dna, Leaf, Share2 } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Buttons";
import {
  BIOARO_DRUGS_URL,
  BIOARO_LABS_URL,
  OFFERINGS_HERO,
  OFFERINGS_STATS,
} from "@/data/navigation";
import { HeroEcosystemVisual } from "@/components/visuals/ScientificVisuals";

const STAT_ICONS = [Dna, Atom, Leaf, Share2];

type AnimatedStatValueProps = {
  value: string;
  reduceMotion: boolean;
};

function AnimatedStatValue({ value, reduceMotion }: AnimatedStatValueProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const match = value.match(/^(\d+)/);
    const target = match ? Number.parseInt(match[1], 10) : 0;

    if (reduceMotion) {
      setCount(target);
      return;
    }

    let animationFrame = 0;
    const startTime = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [reduceMotion, value]);

  const match = value.match(/^(\d+)/);
  const suffix = match ? value.slice(match[1].length) : value;

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion() ?? false;

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative overflow-hidden bg-hero-radial pt-16 md:pt-20">
      <div className="absolute inset-0 bg-grid-fade bg-[size:64px_64px] opacity-[0.04] [mask-image:linear-gradient(180deg,white,transparent_80%)]" />
      <div className="absolute left-[-12%] top-[8%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(0,183,255,0.08),transparent_65%)] blur-3xl" />
      <div className="absolute right-[-10%] top-[16%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(47,211,255,0.06),transparent_68%)] blur-3xl" />

      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid items-center gap-12 pb-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
          <div className="relative z-10">
            <motion.div {...fadeUp(0)} className="flex items-center gap-4">
              <span className="h-4 w-px bg-bioaro-blue/90" />
              <p className="font-mono text-[11px] uppercase tracking-[0.48em] text-bioaro-soft/90">
                {OFFERINGS_HERO.eyebrow}
              </p>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-8 font-display text-[3.6rem] font-semibold leading-[0.92] tracking-tight text-white sm:text-[5.8rem] lg:text-[6.2rem] xl:text-[6.8rem]"
            >
              {OFFERINGS_HERO.headline.split(". ").map((line, index, array) => (
                <span key={line}>
                  {index === array.length - 1 ? (
                    <span className="bg-gradient-to-r from-bioaro-soft via-bioaro-cyan to-bioaro-blue bg-clip-text text-transparent">
                      {line}
                    </span>
                  ) : (
                    <>
                      {line}.
                      <br />
                    </>
                  )}
                </span>
              ))}
            </motion.h1>

            <motion.p
              {...fadeUp(0.24)}
              className="mt-9 max-w-[34rem] text-[1.05rem] leading-8 text-bioaro-text md:text-[1.1rem]"
            >
              {OFFERINGS_HERO.description}
            </motion.p>

            <motion.p
              {...fadeUp(0.34)}
              className="mt-8 max-w-[30rem] border-l border-bioaro-blue/70 pl-4 text-sm leading-7 text-bioaro-muted md:text-[0.95rem]"
            >
              Understand your body at a deeper level. Take action with targeted wellness support.
              Build better long-term health through Living 2.0.
            </motion.p>

            <motion.div {...fadeUp(0.42)} className="mt-11 flex flex-wrap gap-4">
              <PrimaryButton href={BIOARO_LABS_URL}>Explore BioAro Labs</PrimaryButton>
              <SecondaryButton href={BIOARO_DRUGS_URL}>Explore BioAro Drugs</SecondaryButton>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:-mr-4 xl:-mr-10"
          >
            <div className="mb-4 flex justify-start px-5 md:px-7">
              <div className="flex items-center gap-2.5 rounded-full border border-[rgba(92,206,255,0.2)] bg-[rgba(7,19,34,0.78)] px-4 py-2 shadow-ambient backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-bioaro-soft shadow-[0_0_10px_rgba(92,206,255,0.8)]" />
                <span className="text-xs font-medium tracking-wide text-bioaro-text">
                  Genomics-Led Precision Health Ecosystem
                </span>
              </div>
            </div>
            <HeroEcosystemVisual />
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[30px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(7,12,22,0.9),rgba(5,9,17,0.95))] px-6 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:px-8 md:py-7"
        >
          <div className="grid gap-0 md:grid-cols-4">
            {OFFERINGS_STATS.map((stat, index) => {
              const Icon = STAT_ICONS[index];

              return (
                <div
                  key={stat.label}
                  className={`flex gap-4 py-4 md:px-6 md:py-3 ${
                    index < OFFERINGS_STATS.length - 1 ? "md:border-r md:border-white/[0.08]" : ""
                  }`}
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[radial-gradient(circle,rgba(0,183,255,0.12),rgba(3,7,18,0.85)_70%)] shadow-[0_0_24px_rgba(0,183,255,0.12)]">
                    <Icon className="h-7 w-7 text-bioaro-soft" />
                  </div>
                  <div>
                    <p className="font-display text-5xl font-semibold leading-none tracking-tight text-bioaro-soft md:text-[3.4rem]">
                      <AnimatedStatValue value={stat.value} reduceMotion={reduceMotion} />
                    </p>
                    <p className="mt-3 max-w-[13rem] text-sm leading-6 text-bioaro-muted">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
