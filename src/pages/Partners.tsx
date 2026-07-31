import PageHero from "../components/page/PageHero";
import { PARTNER_AUDIENCES, PARTNER_BUILDOUT_POINTS, PARTNER_OPPORTUNITIES, PARTNER_REASONS, PARTNERS_PAGE_HERO } from "../data/siteContent";

export default function Partners() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <PageHero {...PARTNERS_PAGE_HERO} />

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">Who this is for</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {PARTNER_AUDIENCES.map((audience) => (
                <span key={audience} className="rounded-full bg-white/55 px-4 py-2 text-sm text-ink/65">
                  {audience}
                </span>
              ))}
            </div>

            <h3 className="mt-8 text-xl">Why partner with BioAro</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink/65">
              {PARTNER_REASONS.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-forest-600 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">Opportunities</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PARTNER_OPPORTUNITIES.map((opportunity) => (
                <a
                  key={opportunity.label}
                  href={opportunity.href}
                  className="rounded-2xl bg-white/55 px-4 py-4 text-sm font-medium text-ink transition-colors hover:bg-white/70"
                >
                  {opportunity.label}
                </a>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-ink/10 bg-white/45 px-5 py-6">
              <p className="text-lg font-medium">How we work together</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/60">
                {PARTNER_BUILDOUT_POINTS.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-forest-600 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
