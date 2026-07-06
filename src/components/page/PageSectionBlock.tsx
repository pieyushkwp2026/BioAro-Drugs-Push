import type { PageSectionContent } from "../../lib/content/types";

export default function PageSectionBlock({ title, paragraphs, bullets, note }: PageSectionContent) {
  return (
    <section className="glass-card p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/65">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {bullets && (
        <ul className="mt-5 space-y-2 text-sm text-ink/65">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-forest-600 shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {note && <p className="mt-5 text-xs text-ink/45">{note}</p>}
    </section>
  );
}
