import { Link } from "react-router-dom";
import { useMarketHref } from "../../hooks/useMarketHref";
import type { PageCta, PageHeroContent } from "../../lib/content/types";

function ActionButton({ action }: { action: PageCta }) {
  const marketHref = useMarketHref();
  const className =
    action.variant === "secondary"
      ? "btn-secondary"
      : action.variant === "link"
        ? "inline-flex items-center rounded-full py-2 text-[15px] font-bold text-ink underline-offset-[6px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
        : "btn-primary";

  const isExternal = action.href.startsWith("mailto:") || action.href.startsWith("http");

  if (isExternal) {
    return (
      <a href={action.href} className={className}>
        {action.label}
      </a>
    );
  }

  return (
    <Link to={marketHref(action.href)} className={className}>
      {action.label}
    </Link>
  );
}

export default function PageHero({ eyebrow, title, description, note, primaryCta, secondaryCta }: PageHeroContent) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="mt-4 max-w-[18ch] text-balance text-[36px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[46px] lg:text-[56px]">{title}</h1>
      <p className="mt-6 max-w-[58ch] text-pretty text-[17px] leading-[1.6] text-ink-600 sm:text-[18px]">{description}</p>
      {note && <p className="mt-3 max-w-[58ch] text-pretty text-[15px] leading-[1.6] text-ink-400">{note}</p>}
      {(primaryCta || secondaryCta) && (
        <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          {primaryCta && <ActionButton action={primaryCta} />}
          {secondaryCta && <ActionButton action={secondaryCta} />}
        </div>
      )}
    </div>
  );
}
