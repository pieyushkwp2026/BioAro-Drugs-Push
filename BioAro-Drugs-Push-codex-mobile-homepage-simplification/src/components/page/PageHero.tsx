import { Link } from "react-router-dom";
import { useMarketHref } from "../../hooks/useMarketHref";
import type { PageCta, PageHeroContent } from "../../lib/content/types";

function ActionButton({ action }: { action: PageCta }) {
  const marketHref = useMarketHref();
  const className =
    action.variant === "secondary"
      ? "btn-secondary"
      : action.variant === "link"
        ? "text-sm text-forest-600 hover:text-forest-700"
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
      <h1 className="mt-3 max-w-2xl text-3xl leading-tight sm:text-4xl md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60 sm:mt-5 sm:text-base">{description}</p>
      {note && <p className="mt-3 max-w-2xl text-sm text-ink/45 leading-relaxed">{note}</p>}
      {(primaryCta || secondaryCta) && (
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {primaryCta && <ActionButton action={primaryCta} />}
          {secondaryCta && <ActionButton action={secondaryCta} />}
        </div>
      )}
    </div>
  );
}
