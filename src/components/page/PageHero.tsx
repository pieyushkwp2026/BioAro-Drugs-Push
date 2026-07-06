import { Link } from "react-router-dom";
import type { PageCta, PageHeroContent } from "../../lib/content/types";

function ActionButton({ action }: { action: PageCta }) {
  const className =
    action.variant === "secondary"
      ? "btn-secondary"
      : action.variant === "link"
        ? "text-sm text-forest-600 hover:text-forest-700"
        : "btn-primary";

  const isExternal = action.href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a href={action.href} className={className}>
        {action.label}
      </a>
    );
  }

  return (
    <Link to={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export default function PageHero({ eyebrow, title, description, note, primaryCta, secondaryCta }: PageHeroContent) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="mt-3 text-4xl md:text-5xl max-w-2xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-ink/60 leading-relaxed">{description}</p>
      {note && <p className="mt-3 max-w-2xl text-sm text-ink/45 leading-relaxed">{note}</p>}
      {(primaryCta || secondaryCta) && (
        <div className="mt-7 flex flex-wrap gap-3">
          {primaryCta && <ActionButton action={primaryCta} />}
          {secondaryCta && <ActionButton action={secondaryCta} />}
        </div>
      )}
    </div>
  );
}
