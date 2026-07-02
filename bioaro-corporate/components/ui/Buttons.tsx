import Link from "next/link";
import { ArrowRight } from "lucide-react";

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  const external = isExternalHref(href);
  const className =
    "group inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(135deg,#00B7FF,#2FD3FF)] px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-button transition-all duration-300 hover:shadow-[0_10px_44px_rgba(0,183,255,0.44),inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-bioaro-soft/60 focus:ring-offset-2 focus:ring-offset-bioaro-bg";

  if (external) {
    return (
      <a href={href} className={className}>
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  const external = isExternalHref(href);
  const className =
    "group inline-flex items-center gap-2.5 rounded-full border border-[rgba(146,167,194,0.25)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[rgba(92,206,255,0.45)] hover:bg-[linear-gradient(180deg,rgba(0,183,255,0.1),rgba(255,255,255,0.02))] focus:outline-none focus:ring-2 focus:ring-bioaro-soft/40 focus:ring-offset-2 focus:ring-offset-bioaro-bg";

  if (external) {
    return (
      <a href={href} className={className}>
        {children}
        <ArrowRight className="h-4 w-4 text-bioaro-soft transition-transform duration-300 group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {children}
      <ArrowRight className="h-4 w-4 text-bioaro-soft transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = isExternalHref(href);
  const className =
    "group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors duration-300 hover:text-bioaro-soft";

  if (external) {
    return (
      <a href={href} className={className}>
        {children}
        <ArrowRight className="h-4 w-4 text-bioaro-soft transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {children}
      <ArrowRight className="h-4 w-4 text-bioaro-soft transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
