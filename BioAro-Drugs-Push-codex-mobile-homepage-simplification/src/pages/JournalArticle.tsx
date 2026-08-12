import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getJournalArticleBySlug } from "../data/journal";
import { ROUTES } from "../lib/routes";
import { useMarketHref } from "../hooks/useMarketHref";

export default function JournalArticle() {
  const { slug } = useParams();
  const marketHref = useMarketHref();
  const article = getJournalArticleBySlug(slug);

  if (!article) {
    return (
      <div className="pt-24 pb-20 md:pt-32 md:pb-24">
        <div className="container-bio">
          <Link to={marketHref(ROUTES.journal)} className="inline-flex items-center gap-2 text-sm text-forest-600">
            <ArrowLeft size={14} />
            Back to Journal
          </Link>
          <div className="mt-10 max-w-2xl">
            <span className="eyebrow">Journal</span>
            <h1 className="mt-4 text-[clamp(2.5rem,8vw,4.8rem)] leading-[0.95]">Article not found.</h1>
            <p className="mt-5 text-lg leading-8 text-ink/60">
              This article may have moved. Return to the education hub to browse the latest BioAro guides.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <Link to={marketHref(ROUTES.journal)} className="inline-flex items-center gap-2 text-sm text-forest-600">
          <ArrowLeft size={14} />
          Back to Journal
        </Link>

        <header className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.75fr)] lg:items-end">
          <div>
            <span className="eyebrow">{article.cat}</span>
            <h1 className="mt-4 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.92]">{article.article.title}</h1>
            <p className="mt-6 max-w-3xl text-[18px] leading-8 text-ink/60">{article.article.heroSummary}</p>
            <div className="mt-6 text-sm text-ink/45">{article.readTime}</div>
          </div>

          <div className="overflow-hidden rounded-[28px] bg-[#f2f0ec] shadow-[0_28px_70px_-55px_rgba(27,26,23,0.5)]">
            <img src={article.img} alt={article.alt} className="h-full max-h-[520px] w-full object-cover" />
          </div>
        </header>

        <div className="mx-auto mt-16 max-w-[820px] space-y-12">
          {article.article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[32px] leading-[1.02] text-ink md:text-[40px]">{section.heading}</h2>
              <div className="mt-5 space-y-5">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-[17px] leading-8 text-ink/62">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <Link
            to={marketHref(ROUTES.shop)}
            className="inline-flex items-center gap-2 rounded-full bg-[#171613] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-700"
          >
            {article.article.cta}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
