import PageHero from "../components/page/PageHero";
import PageSectionBlock from "../components/page/PageSectionBlock";
import { QUALITY_DOCUMENTS, QUALITY_EMPTY_STATE, QUALITY_PAGE_HERO, QUALITY_SECTIONS } from "../data/siteContent";

export default function QualityTesting() {
  const hasDocuments = QUALITY_DOCUMENTS.length > 0;

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <PageHero {...QUALITY_PAGE_HERO} />
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {QUALITY_SECTIONS.map((section) => (
              <PageSectionBlock key={section.title} {...section} />
            ))}
          </div>
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">Documentation library</h2>
            {hasDocuments ? (
              <div className="mt-5 space-y-3">
                {QUALITY_DOCUMENTS.map((document) => (
                  <a key={document.title} href={document.href} className="block rounded-2xl bg-white/55 px-4 py-4 hover:bg-white/70">
                    <p className="text-sm font-medium">{document.title}</p>
                    <p className="mt-2 text-sm text-ink/55">{document.description}</p>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-ink/10 bg-white/50 px-5 py-6">
                <p className="text-lg font-medium">{QUALITY_EMPTY_STATE.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{QUALITY_EMPTY_STATE.description}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
