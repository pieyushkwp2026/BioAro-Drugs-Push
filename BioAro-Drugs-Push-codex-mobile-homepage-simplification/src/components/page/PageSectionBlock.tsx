import type { PageSectionContent } from "../../lib/content/types";

export default function PageSectionBlock({ title, paragraphs, bullets, note }: PageSectionContent) {
  return (
    <section className="rounded-[24px] border border-line bg-white p-7 shadow-glass md:p-9">
      <h2 className="text-balance text-[24px] font-bold leading-[1.15] tracking-[-0.03em] text-ink md:text-[28px]">{title}</h2>
      <div className="mt-5 space-y-4 text-pretty text-[15.5px] leading-[1.65] text-ink-600">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {bullets && (
        <ul className="mt-6 space-y-3 text-[15.5px] leading-[1.6] text-ink-600">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {note && <p className="mt-6 text-[13.5px] leading-[1.6] text-ink-400">{note}</p>}
    </section>
  );
}
