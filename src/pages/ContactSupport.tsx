import PageHero from "../components/page/PageHero";
import { SUPPORT_EMAILS, SUPPORT_PAGE_HERO, SUPPORT_RESPONSE_TIMELINE, SUPPORT_TOPICS } from "../data/siteContent";

export default function ContactSupport() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <PageHero {...SUPPORT_PAGE_HERO} />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">How we can help</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {SUPPORT_TOPICS.map((topic) => (
                <div key={topic} className="rounded-2xl bg-white/55 px-4 py-4 text-sm text-ink/65">
                  {topic}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-ink/50">{SUPPORT_RESPONSE_TIMELINE}</p>
          </section>

          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl">Direct contacts</h2>
            <div className="mt-5 space-y-3">
              {SUPPORT_EMAILS.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="block rounded-2xl bg-white/55 px-4 py-4 transition-colors hover:bg-white/70"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/35">{contact.label}</p>
                  <p className="mt-2 text-sm font-medium text-ink">{contact.value}</p>
                </a>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-ink/10 bg-white/45 px-4 py-4 text-sm leading-relaxed text-ink/55">
              To help us assist you quickly, include your order number if applicable, the product name, your question, and any relevant photos for damaged deliveries.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
