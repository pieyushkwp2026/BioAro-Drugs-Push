"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/data/navigation";

export function CorporateNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <div
          className={`flex items-center justify-between rounded-[18px] border px-5 py-3 transition-all duration-500 ${
            scrolled
              ? "border-[rgba(255,255,255,0.08)] bg-[rgba(5,11,20,0.88)] shadow-ambient backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link href="/" className="font-display text-xl font-semibold tracking-[0.04em] text-white">
            BioAro
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    active
                      ? "text-white"
                      : "text-bioaro-muted hover:text-white"
                  }`}
                >
                  <span className="relative pb-1.5">
                    {item.label}
                    {active ? (
                      <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-bioaro-soft to-transparent" />
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/consultation"
              className="hidden rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm text-white transition-colors hover:border-[rgba(92,206,255,0.28)] hover:bg-[rgba(255,255,255,0.05)] md:inline-flex"
            >
              Talk to us
            </Link>
            <button
              type="button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.03)] text-white lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.nav
              initial={reduceMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mt-3 rounded-[20px] border border-white/10 bg-[rgba(5,11,20,0.92)] p-5 shadow-ambient backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`border-b border-white/5 pb-3 text-sm last:border-none last:pb-0 ${
                      pathname === item.href ? "text-white" : "text-bioaro-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
