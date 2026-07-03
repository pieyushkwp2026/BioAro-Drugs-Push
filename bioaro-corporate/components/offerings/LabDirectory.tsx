"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { BIOARO_LABS_URL, LAB_CATEGORIES, LAB_DIRECTORY_COPY, LAB_TESTS } from "@/data/navigation";

const PREVIEW_LIMIT = 6;

export function LabDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const reduceMotion = useReducedMotion();

  const categoryCounts = useMemo(() => {
    return LAB_CATEGORIES.reduce<Record<string, number>>((acc, item) => {
      acc[item.id] =
        item.id === "all"
          ? LAB_TESTS.length
          : LAB_TESTS.filter((test) => test.category === item.id).length;
      return acc;
    }, {});
  }, []);

  const matches = useMemo(() => {
    return LAB_TESTS.filter((test) => {
      const categoryMatch = category === "all" || test.category === category;
      const queryMatch =
        query.trim().length === 0 ||
        `${test.title} ${test.description}`.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  const visible = matches.slice(0, PREVIEW_LIMIT);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[rgba(0,183,255,0.1)] bg-[radial-gradient(ellipse_100%_50%_at_50%_-10%,rgba(0,183,255,0.1),transparent_60%),linear-gradient(180deg,#0C1B31,#060E1B)] p-6 shadow-ambient md:p-9">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-bioaro-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={LAB_DIRECTORY_COPY.placeholder}
          className="w-full rounded-full border border-white/[0.08] bg-[rgba(3,7,18,0.55)] py-4 pl-12 pr-5 text-sm text-white shadow-[inset_0_2px_12px_rgba(0,0,0,0.4)] outline-none transition-all duration-300 placeholder:text-bioaro-disabled focus:border-[rgba(92,206,255,0.4)] focus:shadow-[inset_0_2px_12px_rgba(0,0,0,0.4),0_0_24px_rgba(0,183,255,0.12)]"
        />
      </div>

      {/* category filters */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {LAB_CATEGORIES.map((item) => {
          const active = item.id === category;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              aria-pressed={active}
              className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                active
                  ? "bg-[linear-gradient(135deg,#00B7FF,#2FD3FF)] text-slate-950 shadow-[0_6px_24px_rgba(0,183,255,0.35)]"
                  : "border border-white/[0.08] bg-white/[0.03] text-bioaro-muted hover:border-[rgba(92,206,255,0.3)] hover:text-white"
              }`}
            >
              {item.label}
              <span
                className={`text-[11px] tabular-nums ${
                  active ? "text-slate-800" : "text-bioaro-disabled group-hover:text-bioaro-soft"
                }`}
              >
                {categoryCounts[item.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* results */}
      <div className="mt-8 min-h-[22rem]">
        <AnimatePresence mode="wait">
          {visible.length > 0 ? (
            <motion.div
              key={`${category}-${query}`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {visible.map((test, index) => (
                <motion.article
                  key={test.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col rounded-[24px] bg-[linear-gradient(180deg,rgba(21,37,62,0.65),rgba(9,17,31,0.85))] p-5 ring-1 ring-inset ring-white/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:ring-[rgba(92,206,255,0.3)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-bioaro-soft/70">
                      {LAB_CATEGORIES.find((item) => item.id === test.category)?.label ?? "Test"}
                    </p>
                    {test.badge ? (
                      <span className="rounded-full bg-[rgba(0,183,255,0.14)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-bioaro-soft">
                        {test.badge}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold leading-snug text-white">
                    {test.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-bioaro-muted">
                    {test.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-bioaro-text transition-colors duration-300 group-hover:text-bioaro-soft">
                    View Test
                    <ArrowRight className="h-3.5 w-3.5 text-bioaro-soft transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[22rem] flex-col items-center justify-center text-center"
            >
              <p className="font-display text-xl text-white">No matching tests</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-bioaro-muted">
                Try a broader search term or switch to another diagnostic category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* footer */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-6">
        <p className="text-sm text-bioaro-muted">
          Showing{" "}
          <span className="font-semibold text-white">
            {Math.min(visible.length, matches.length)}
          </span>{" "}
          of <span className="font-semibold text-white">{matches.length}</span> tests
          {category !== "all"
            ? ` in ${LAB_CATEGORIES.find((item) => item.id === category)?.label}`
            : ""}
        </p>
        <a
          href={BIOARO_LABS_URL}
          className="group inline-flex items-center gap-2 rounded-full border border-[rgba(92,206,255,0.25)] bg-[rgba(0,183,255,0.06)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[rgba(92,206,255,0.5)] hover:bg-[rgba(0,183,255,0.12)]"
        >
          Visit BioAro Labs
          <ArrowRight className="h-4 w-4 text-bioaro-soft transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
