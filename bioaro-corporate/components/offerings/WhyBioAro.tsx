"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, FlaskConical, Pill, ScanSearch } from "lucide-react";
import { CAPABILITIES } from "@/data/navigation";
import { SectionShell } from "@/components/ui/SectionShell";

const icons = [FlaskConical, Pill, ScanSearch, BrainCircuit];

const convictions = [
  "Understand your body through advanced health intelligence.",
  "Improve daily performance with targeted wellness formulas.",
  "Build better long-term health through the Living 2.0 philosophy.",
];

export function WhyBioAro() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionShell
      id="why-bioaro"
      label="Why BioAro"
      title="One ecosystem. Two ways to take control of your health."
      description="BioAro combines advanced diagnostics with science-backed wellness formulas to help people move from understanding their health to improving it — a more informed, personalized, and proactive approach to long-term wellbeing."
      className="bg-section-radial"
    >
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div>
          {convictions.map((point, index) => (
            <motion.div
              key={point}
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-7 border-t border-white/[0.09] py-8 first:border-t-0 first:pt-0"
            >
              <span className="font-display text-4xl font-semibold leading-none text-bioaro-soft/30">
                0{index + 1}
              </span>
              <p className="max-w-md pt-1 text-lg leading-8 text-bioaro-text">{point}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {CAPABILITIES.map((capability, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={capability.title}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-[22px] bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(0,183,255,0.1),transparent_60%),linear-gradient(180deg,rgba(21,37,62,0.7),rgba(9,17,31,0.9))] p-7 ring-1 ring-inset ring-white/[0.06] transition-all duration-500 hover:-translate-y-1 hover:ring-[rgba(92,206,255,0.28)]"
              >
                <div className="inline-flex rounded-2xl bg-[rgba(0,183,255,0.1)] p-3.5 text-bioaro-soft shadow-[0_0_24px_rgba(0,183,255,0.12)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-7 font-display text-2xl font-semibold tracking-tight text-white">
                  {capability.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-bioaro-muted">
                  {capability.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
