import { ArrowRight } from "lucide-react";
import heroJars from "../assets/hero-jars.jpg";
import essentialLongevity from "../assets/essential-longevity.png";
import essentialFocus from "../assets/essential-focus.png";
import essentialRecovery from "../assets/essential-recovery.png";
import essentialSleep from "../assets/essential-sleep.png";

const ARTICLES = [
  { cat: "Foundations", title: "What are bioactives?", excerpt: "A plain-language starting point for understanding how BioAro frames modern wellness products.", img: heroJars },
  { cat: "Protocols", title: "The Morning Longevity Stack", excerpt: "A look at how protocol-led storytelling helps customers understand what belongs together.", img: essentialLongevity },
  { cat: "Recovery", title: "Why protocol pages matter", excerpt: "How a recovery routine becomes easier to follow when timing, purpose, and pairing are made explicit.", img: essentialRecovery },
  { cat: "Focus", title: "Building a workday routine", excerpt: "Using product detail pages and FAQs to make focus-oriented product choices more grounded.", img: essentialFocus },
  { cat: "Sleep", title: "Planning the next category", excerpt: "How the sleep pillar will complete the broader Living 2.0 system over time.", img: essentialSleep },
  { cat: "Quality", title: "Why documentation deserves a page", excerpt: "Trust grows when quality information has a clear destination in the customer journey.", img: heroJars },
];

export default function Journal() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-bio">
        <span className="eyebrow">Journal</span>
        <h1 className="mt-3 max-w-lg text-4xl md:text-5xl">Education hub.</h1>
        <p className="mt-4 max-w-md text-ink/55">Articles and explainers that support the BioAro product and protocol story in plain language.</p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <article key={article.title} className="glass-card group overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={article.img} alt={article.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-wide text-forest-600">{article.cat}</span>
                <h2 className="mt-2 text-xl">{article.title}</h2>
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
