import { Link } from "react-router-dom";
import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { LIBRARY_SECTION } from "../../data/homepage";
import { JOURNAL_ARTICLES } from "../../data/journal";
import { Eyebrow, QuietLink, Section, SectionHeading } from "./primitives";

/*
 * The journal, reframed as a science library.
 *
 * Only the categories that have an article behind them are shown. The wider topic
 * architecture that was proposed — bioactives, metabolic health, AI and precision
 * health, research — would render nine shelves over six articles, and empty shelves
 * read as an abandoned site rather than an ambitious one. The `cat` field already
 * carries the taxonomy, so new buckets appear here the moment articles exist.
 */
export default function ScienceLibrary() {
  const marketHref = useMarketHref();
  const featured = JOURNAL_ARTICLES.slice(0, 3);

  return (
    <Section className="pb-20 sm:pb-24 lg:pb-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>{LIBRARY_SECTION.eyebrow}</Eyebrow>
          <SectionHeading className="mt-4 max-w-[16ch] !text-[28px] sm:!text-[34px] lg:!text-[40px]">
            {LIBRARY_SECTION.headline}
          </SectionHeading>
          <p className="mt-4 max-w-[52ch] text-pretty text-[15.5px] leading-[1.55] text-ink-600">
            {LIBRARY_SECTION.body}
          </p>
        </div>
        <div className="shrink-0">
          <QuietLink to={marketHref(ROUTES.journal)}>{LIBRARY_SECTION.cta}</QuietLink>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((article) => (
          <article key={article.slug} className="group">
            <Link to={marketHref(`${ROUTES.journal}/${article.slug}`)} className="block">
              <div className="aspect-[3/2] overflow-hidden rounded-[24px] bg-cream-200">
                <img
                  src={article.img}
                  alt={article.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
                />
              </div>
              <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-400">
                {article.cat} · {article.readTime}
              </p>
              <h3 className="mt-2 text-balance text-[19px] font-bold leading-[1.25] tracking-[-0.02em] text-ink decoration-ember underline-offset-[5px] group-hover:underline">
                {article.title}
              </h3>
              <p className="mt-2 text-pretty text-[14.5px] leading-[1.55] text-ink-600">{article.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}
