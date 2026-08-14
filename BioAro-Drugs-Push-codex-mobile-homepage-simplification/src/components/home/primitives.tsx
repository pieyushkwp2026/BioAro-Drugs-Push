import type { HTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/*
 * Shared homepage primitives, written against design tokens rather than hex literals.
 *
 * The previous homepage hardcoded #F7F4EF / #1C1917 / #C1462A / #E1DED8 inline at
 * every call site while the rest of the app used the tokens that exist for exactly
 * those values, so the page could not follow a theme change. It also carried its own
 * copy of .btn-primary that differed from the real one by 2px of vertical padding.
 * Both are fixed here: one button, one source of colour.
 */

/** Section shell. Matches .container-bio geometry — box-content is load-bearing. */
export function Section({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
  return (
    <section {...rest} className={`px-5 sm:px-8 lg:px-12 ${className}`}>
      <div className="mx-auto max-w-[1240px]">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

// Rest props are forwarded so callers can attach data-reveal; without this the
// heading silently opts out of the scroll reveal.
export function SectionHeading({
  children,
  className = "",
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...rest}
      className={`text-balance text-[34px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[44px] lg:text-[54px] ${className}`}
    >
      {children}
    </h2>
  );
}

function ArrowGlyph({ size = 17 }: { size?: number }) {
  return (
    <ArrowRight
      size={size}
      strokeWidth={2.4}
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
    />
  );
}

export function PrimaryCta({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`btn-primary group ${className}`}>
      {children}
      <ArrowGlyph />
    </Link>
  );
}

export function SecondaryCta({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`btn-secondary group ${className}`}>
      {children}
      <ArrowGlyph />
    </Link>
  );
}

/** Quiet inline link. `to` routes; `href` is for same-page anchors. */
export function QuietLink({
  to,
  href,
  children,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
}) {
  const className =
    "group inline-flex items-center gap-2 rounded-full py-2 text-[15px] font-bold text-ink underline-offset-[6px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember";

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
        <ArrowGlyph size={16} />
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
      <ArrowGlyph size={16} />
    </a>
  );
}
