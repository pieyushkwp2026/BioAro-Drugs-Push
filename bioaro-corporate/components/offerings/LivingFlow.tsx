"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LIVING_FLOW_STEPS } from "@/data/navigation";

const STEP_META = [
  { context: "Powered by BioAro Labs" },
  { context: "Powered by BioAro Drugs" },
  { context: "Powered by Living 2.0" },
];

export function LivingFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

  return (
    <section
      id="living-flow"
      className="relative overflow-hidden bg-section-deep py-32 md:py-44"
    >
      {/* ambient depth */}
      <div className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,183,255,0.09),transparent_65%)] blur-3xl" />
      <div className="absolute inset-0 bg-grid-fade bg-[size:72px_72px] opacity-[0.03] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,white,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-4"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-bioaro-blue/70" />
            <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-bioaro-soft/85">
              Living 2.0
            </p>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-bioaro-blue/70" />
          </motion.div>

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            The philosophy that turns{" "}
            <span className="bg-gradient-to-r from-bioaro-soft to-bioaro-blue bg-clip-text text-transparent">
              insight into action.
            </span>
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-bioaro-muted"
          >
            Living 2.0 connects what you learn about your body with what you do
            next — one continuous loop of understanding, action, and better
            long-term health.
          </motion.p>
        </div>

        <div ref={ref} className="relative mt-24 md:mt-28">
          {/* progression line */}
          <div className="absolute left-[16.66%] right-[16.66%] top-0 hidden h-px bg-white/[0.07] md:block" />
          <motion.div
            style={reduceMotion ? undefined : { scaleX: lineScale }}
            className="absolute left-[16.66%] right-[16.66%] top-0 hidden h-px origin-left bg-gradient-to-r from-bioaro-blue via-bioaro-soft to-bioaro-blue shadow-[0_0_16px_rgba(0,183,255,0.5)] md:block"
          />
          <div className="absolute bottom-16 left-[19px] top-2 w-px bg-white/[0.07] md:hidden" />
          <motion.div
            style={reduceMotion ? undefined : { scaleY: lineScale }}
            className="absolute bottom-16 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-bioaro-blue via-bioaro-soft to-bioaro-blue md:hidden"
          />

          <div className="grid gap-14 md:grid-cols-3 md:gap-10">
            {LIVING_FLOW_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.85, delay: index * 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-14 md:pl-0 md:pt-14 md:text-center"
              >
                {/* node */}
                <span className="absolute left-[13px] top-1.5 flex h-3.5 w-3.5 items-center justify-center md:left-1/2 md:-top-[7px] md:-translate-x-1/2">
                  <span className="absolute h-3.5 w-3.5 rounded-full bg-bioaro-soft/25 animate-pulseLine" />
                  <span className="h-2 w-2 rounded-full bg-bioaro-soft shadow-[0_0_14px_rgba(92,206,255,0.9)]" />
                </span>

                <div className="flex items-center gap-3 md:mb-5 md:justify-center">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(92,206,255,0.18)] bg-[rgba(255,255,255,0.03)] font-display text-[14px] font-semibold tracking-[0.1em] text-bioaro-soft">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:mt-0 md:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-xs text-base leading-8 text-bioaro-muted md:mx-auto">
                  {step.description}
                </p>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-bioaro-soft/65">
                  {STEP_META[index].context}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
