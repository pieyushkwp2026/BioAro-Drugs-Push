import PageHero from "../components/page/PageHero";
import PageSectionBlock from "../components/page/PageSectionBlock";
import { QUALITY_DOCUMENTS, QUALITY_PAGE_HERO, QUALITY_SECTIONS } from "../data/siteContent";

/*
 * THE DOCUMENTATION LIBRARY IS NOT RENDERED WHILE IT IS EMPTY.
 *
 * It used to occupy the whole right column with a heading over "Quality documentation
 * is coming soon. Product-specific quality information will be added here as it becomes
 * available." — the same sentence the homepage was also printing. A page whose subject
 * is proof cannot lead with a promise of proof arriving later; the empty shelf drew the
 * eye straight to the absence and committed us to a date nobody has set.
 *
 * The library returns automatically the moment QUALITY_DOCUMENTS has anything in it,
 * and the layout goes back to two columns with it. Nothing needs re-adding by hand.
 */
export default function QualityTesting() {
  const hasDocuments = QUALITY_DOCUMENTS.length > 0;

  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="container-bio">
        <PageHero {...QUALITY_PAGE_HERO} />
        <div className={`mt-12 grid gap-5 ${hasDocuments ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
          <div className="space-y-5">
            {QUALITY_SECTIONS.map((section) => (
              <PageSectionBlock key={section.title} {...section} />
            ))}
          </div>

          {hasDocuments && (
            <section className="glass-card p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl">Documentation library</h2>
              <div className="mt-5 space-y-3">
                {QUALITY_DOCUMENTS.map((document) => (
                  <a key={document.title} href={document.href} className="block rounded-2xl bg-white/55 px-4 py-4 hover:bg-white/70">
                    <p className="text-sm font-medium">{document.title}</p>
                    <p className="mt-2 text-sm text-ink/55">{document.description}</p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
