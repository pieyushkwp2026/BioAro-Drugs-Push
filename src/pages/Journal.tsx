import { ArrowRight } from "lucide-react";
import { JOURNAL_ARTICLES } from "../data/journal";

export default function Journal() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <span className="eyebrow">Journal</span>
        <h1 className="mt-3 max-w-lg text-[clamp(2.5rem,10vw,3rem)] leading-[0.98] md:text-5xl">Education hub.</h1>
        <p className="mt-4 max-w-md text-ink/55">Articles and explainers that support the BioAro product and protocol story in plain language.</p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {JOURNAL_ARTICLES.map((article) => (
            <article key={article.title} className="glass-card group overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden bg-[#f2f0ec]">
                <img src={article.img} alt={article.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-wide text-forest-600">{article.cat}</span>
                <h2 className="mt-2 text-[22px] leading-[1.06] sm:text-xl md:text-[22px]">{article.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{article.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-forest-600 transition-all group-hover:gap-2">
                  Read article <ArrowRight size={13} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
