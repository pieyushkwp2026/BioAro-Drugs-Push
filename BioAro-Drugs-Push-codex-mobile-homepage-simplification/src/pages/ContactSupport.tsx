import { type FormEvent, useState } from "react";
import { ArrowRight, Mail, MessageSquareText } from "lucide-react";
import PageHero from "../components/page/PageHero";
import { SUPPORT_EMAILS, SUPPORT_PAGE_HERO, SUPPORT_RESPONSE_TIMELINE, SUPPORT_TOPICS } from "../data/siteContent";

export default function ContactSupport() {
  const [message, setMessage] = useState("");
  const supportEmail = SUPPORT_EMAILS[0]?.value ?? "support@bioarodrugs.com";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const subject = encodeURIComponent("BioAro Drugs support request");
    const body = encodeURIComponent(trimmedMessage);
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="pointer-events-none absolute left-[-12%] top-20 h-[360px] w-[360px] rounded-full bg-forest-100/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-[420px] w-[420px] rounded-full bg-[#E1DED8]/55 blur-3xl" />

      <div className="container-bio relative">
        <PageHero {...SUPPORT_PAGE_HERO} />

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[24px] border border-line bg-white shadow-glass relative overflow-hidden p-6 shadow-[0_28px_90px_rgba(40,35,28,0.08)] md:p-8">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-forest-600/30 to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-forest-700">Support concierge</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">How we can help</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {SUPPORT_TOPICS.map((topic) => (
                <div
                  key={topic}
                  className="rounded-2xl border border-white/70 bg-white/62 px-4 py-4 text-sm text-ink/68 shadow-[0_14px_34px_rgba(55,48,38,0.05)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/78"
                >
                  {topic}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 rounded-[28px] border border-forest-900/10 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.74),0_20px_60px_rgba(35,31,25,0.07)] backdrop-blur-xl md:p-5">
              <label htmlFor="support-message" className="flex items-center gap-3 text-sm font-semibold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 text-forest-700">
                  <MessageSquareText size={17} aria-hidden="true" />
                </span>
                Tell us what’s going on
              </label>
              <textarea
                id="support-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                placeholder="Share your order number, product name, question, or anything we should know."
                className="mt-4 min-h-[150px] w-full resize-y rounded-[22px] border border-ink/10 bg-white/78 px-4 py-4 text-sm leading-relaxed text-ink shadow-inner outline-none transition placeholder:text-ink/36 focus:border-forest-600/45 focus:bg-white focus:ring-4 focus:ring-forest-600/10"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-ink/45">{SUPPORT_RESPONSE_TIMELINE}</p>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(27,26,23,0.18)] transition duration-300 hover:bg-forest-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-600 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Send message
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-[24px] border border-line bg-white shadow-glass relative overflow-hidden p-6 shadow-[0_28px_90px_rgba(40,35,28,0.08)] md:p-8">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-forest-50/70 blur-2xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-forest-700">Contact paths</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">Direct contacts</h2>
            <div className="relative mt-7 space-y-3">
              {SUPPORT_EMAILS.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="group flex items-start gap-4 rounded-2xl border border-white/70 bg-white/62 px-4 py-4 shadow-[0_14px_34px_rgba(55,48,38,0.05)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/80"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700 transition group-hover:bg-forest-100">
                    <Mail size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.2em] text-ink/35">{contact.label}</span>
                    <span className="mt-2 block text-sm font-medium text-ink">{contact.value}</span>
                  </span>
                </a>
              ))}
            </div>
            <div className="relative mt-6 rounded-[24px] border border-ink/10 bg-white/55 px-5 py-5 text-sm leading-relaxed text-ink/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.74)]">
              To help us assist you quickly, include your order number if applicable, the product name, your question, and any relevant photos for damaged deliveries.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
