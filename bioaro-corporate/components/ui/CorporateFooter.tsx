import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { FOOTER_COPY, FOOTER_NAV } from "@/data/navigation";

export function CorporateFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[linear-gradient(180deg,#050B14,#03070F)] py-20 md:py-24">
      <div className="absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-bioaro-blue/30 to-transparent" />
      <div className="absolute left-1/2 top-[-14rem] h-96 w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,183,255,0.06),transparent_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
          <div>
            <Image
              src="/images/brand/bioaro-mark.png"
              alt="BioAro"
              width={116}
              height={33}
              className="h-auto w-[110px]"
            />
            <p className="mt-5 max-w-sm text-sm leading-7 text-bioaro-muted">
              {FOOTER_COPY.description}
            </p>
            <div className="mt-8 space-y-3.5 text-sm text-bioaro-text">
              <a
                href="mailto:contact@bioaro.com"
                className="flex items-center gap-3 transition-colors hover:text-bioaro-soft"
              >
                <Mail className="h-4 w-4 text-bioaro-soft/80" />
                contact@bioaro.com
              </a>
              <span className="flex items-center gap-3 text-bioaro-muted">
                <MapPin className="h-4 w-4 text-bioaro-soft/80" />
                Locations placeholder
              </span>
            </div>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.title}>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-bioaro-soft/70">
                {group.title}
              </p>
              <ul className="mt-6 space-y-3.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-bioaro-muted transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/[0.07] pt-8 text-sm text-bioaro-disabled md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} BioAro. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link
              href="/consultation"
              aria-label="Contact BioAro"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-bioaro-muted transition-all duration-300 hover:border-[rgba(92,206,255,0.4)] hover:text-bioaro-soft"
            >
              <Mail className="h-4 w-4" />
            </Link>
            <Link
              href="/#linkedin"
              aria-label="BioAro on LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-bioaro-muted transition-all duration-300 hover:border-[rgba(92,206,255,0.4)] hover:text-bioaro-soft"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
