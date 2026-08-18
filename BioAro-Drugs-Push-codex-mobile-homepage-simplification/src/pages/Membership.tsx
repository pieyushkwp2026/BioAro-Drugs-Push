import { useEffect, useState } from "react";
import { ArrowRight, Check, CircleHelp, LockKeyhole, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getMarketConfigByMarket } from "../config/markets";
import { useAuth } from "../hooks/useAuth";
import { useMarket } from "../hooks/useMarket";
import { useMemberSnapshot } from "../hooks/useMemberSnapshot";
import { useMarketHref } from "../hooks/useMarketHref";
import { advancedAiAccessState, hasAdvancedAiAccess } from "../lib/member/advancedAi";
import { membershipService, type MembershipOffer } from "../lib/shopify/membershipService";
import { ROUTES } from "../lib/routes";

const BENEFITS = [
  {
    title: "Build your protocol",
    text: "Turn your goals and routine into a structured starting point you can actually use.",
  },
  {
    title: "Keep your context",
    text: "Return to previous conversations instead of beginning from a blank screen every time.",
  },
  {
    title: "See your day",
    text: "Organize your routine around Morning, Around Training and Evening.",
  },
  {
    title: "Refine over time",
    text: "Answer new questions, change direction and progressively shape a routine that fits.",
  },
];

const COMPARISON = [
  ["Product and ingredient questions", "Available", "Available"],
  ["Regional product availability", "Available", "Available"],
  ["Basic protocol exploration", "Available", "Available"],
  ["Advanced protocol workspace", "Not included", "Included"],
  ["Previous conversations", "Limited", "Saved workspace"],
  ["Morning / Training / Evening view", "Basic", "Full workspace"],
  ["Routine refinement", "Basic", "Advanced"],
];

const FAQS = [
  ["What does membership unlock?", "Membership gives you the persistent BioAro Drugs AI workspace: guided protocol building, saved conversation history, a daily routine view and ongoing refinement."],
  ["How is it different from the public AI?", "Public AI is built for exploration. Membership is built for continuity, so you can return to a workspace and keep building from the context you have already created."],
  ["How much does it cost?", "The canonical launch price is $20 USD per month. The final amount shown for your market will come from Shopify when membership checkout is configured."],
  ["Is BioAro Drugs AI medical advice?", "No. It provides general product and educational guidance. It does not diagnose conditions, prescribe treatment or replace advice from a qualified healthcare professional."],
  ["What happens to my conversations?", "The member workspace is designed for continuity. Exact storage and retention behaviour will follow the verified member service and privacy policy, not a frontend assumption."],
  ["How do I manage membership?", "Once membership management is connected, signed-in members will manage it from their BioAro Drugs account."],
];

function formatPrice(offer: MembershipOffer | null, market: ReturnType<typeof getMarketConfigByMarket>) {
  if (offer) {
    return new Intl.NumberFormat(market.locale, {
      style: "currency",
      currency: offer.price.currencyCode,
      maximumFractionDigits: 2,
    }).format(offer.price.amount);
  }
  return "$20 USD";
}

export default function Membership() {
  const marketHref = useMarketHref();
  const { market, country } = useMarket();
  const marketConfig = getMarketConfigByMarket(market);
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { snapshot, state: memberState } = useMemberSnapshot();
  const [offer, setOffer] = useState<MembershipOffer | null>(null);
  const [offerLoading, setOfferLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setOfferLoading(true);
    void membershipService.loadMembershipOffer(country)
      .then((nextOffer) => {
        if (active) setOffer(nextOffer);
      })
      .catch(() => {
        if (active) setOffer(null);
      })
      .finally(() => {
        if (active) setOfferLoading(false);
      });
    return () => {
      active = false;
    };
  }, [country]);

  const membership = snapshot?.membership;
  const access = memberState === "ready" ? advancedAiAccessState(membership) : null;
  const activeMember = memberState === "ready" && hasAdvancedAiAccess(membership);
  const price = formatPrice(offer, marketConfig);
  const joinHref = marketHref(ROUTES.membershipSuccess);

  async function handlePrimary() {
    if (activeMember) return;
    if (!isAuthenticated) {
      void login(joinHref);
      return;
    }
    if (!offer || !membershipService.isMembershipCheckoutConfigured()) return;

    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const checkoutUrl = await membershipService.startMembershipCheckout(offer, country);
      if (!checkoutUrl) throw new Error("Membership checkout is not available yet.");
      window.location.assign(checkoutUrl);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Membership checkout is unavailable.");
      setCheckoutLoading(false);
    }
  }

  const primaryLabel = activeMember
    ? "Open BioAro Drugs AI"
    : access === "inactive"
      ? membership?.status === "paused" ? "Manage membership" : "Restart membership"
      : "Join BioAro Drugs AI";
  const primaryDisabled = !activeMember && (!offer || !membershipService.isMembershipCheckoutConfigured() || checkoutLoading);

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-line bg-[#eee9e1]">
        <div className="container-bio grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ember/25 bg-white/70 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-ember-600">
              <Sparkles size={14} aria-hidden="true" /> BioIntelligence 2.0
            </div>
            <h1 className="mt-7 max-w-[10ch] text-balance text-[52px] font-black leading-[0.93] tracking-[-0.055em] text-ink sm:text-[72px] lg:text-[88px]">
              One intelligence layer for your everyday health.
            </h1>
            <p className="mt-7 max-w-[58ch] text-pretty text-[18px] leading-[1.6] text-ink-600 sm:text-[20px]">
              A 360° everyday-health assistant combining advanced BioAro knowledge with guidance shaped by clinical experience.
            </p>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.7] text-ink-500">
              Ask questions, build your protocol, keep your conversations and return to refine your routine over time.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              {activeMember ? (
                <Link to={marketHref(ROUTES.ai)} className="btn-primary">
                  {primaryLabel} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <button type="button" onClick={() => void handlePrimary()} disabled={primaryDisabled} className="btn-primary disabled:cursor-not-allowed disabled:bg-ink/35 disabled:shadow-none">
                  {authLoading ? "Checking access…" : checkoutLoading ? "Opening secure checkout…" : primaryLabel} <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
              <a href="#included" className="btn-secondary">
                See what’s included <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-400">
              {checkoutError ?? (offerLoading ? "Checking membership availability for your market…" : offer && membershipService.isMembershipCheckoutConfigured() ? "Billed monthly through Shopify." : "Membership checkout is not connected in this build yet.")}
            </p>
          </div>

          <div className="relative rounded-[28px] bg-ink p-6 text-cream shadow-[0_28px_70px_-28px_rgba(29,25,21,0.5)] sm:p-8 lg:mb-1 lg:p-10">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/55">BioAro Drugs AI</p>
                <h2 className="mt-2 text-[25px] font-bold tracking-[-0.035em]">The workspace that remembers the work.</h2>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember text-white"><Sparkles size={19} aria-hidden="true" /></div>
            </div>
            <div className="grid gap-3 py-7 sm:grid-cols-3 lg:grid-cols-1">
              {["Ask", "Build", "Evolve"].map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-[16px] border border-white/10 bg-white/5 p-4">
                  <span className="text-[12px] font-bold text-ember">0{index + 1}</span>
                  <div><p className="font-bold">{step}</p><p className="mt-1 text-[13px] leading-relaxed text-cream/60">{["Understand products, ingredients and routines.", "Turn goals into a structured daily protocol.", "Return, answer more and refine your routine."][index]}</p></div>
                </div>
              ))}
            </div>
            <div className="flex items-end justify-between border-t border-white/15 pt-5">
              <div><p className="text-[11px] uppercase tracking-[0.15em] text-cream/50">Membership</p><p className="mt-1 text-[14px] text-cream/65">One plan. Monthly access.</p></div>
              <p className="text-[25px] font-bold">{price}<span className="ml-1 text-[13px] font-normal text-cream/55">/ month</span></p>
            </div>
          </div>
        </div>
      </section>

      <section id="included" className="container-bio py-20 sm:py-28">
        <div className="max-w-[620px]">
          <p className="eyebrow">More than answers</p>
          <h2 className="mt-4 text-balance text-[40px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[58px]">A routine you can return to.</h2>
          <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.7] text-ink-600">Membership is not about asking more questions. It is about keeping the useful work in one place, so your next conversation can start where the last one ended.</p>
        </div>
        <div className="mt-14 grid gap-x-10 gap-y-12 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <article key={benefit.title}>
              <span className="text-[13px] font-bold text-ember">0{index + 1}</span>
              <h3 className="mt-6 text-[21px] font-bold tracking-[-0.03em]">{benefit.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-ink-600">{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink py-20 text-cream sm:py-28">
        <div className="container-bio">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div><p className="text-[12px] font-bold uppercase tracking-[0.15em] text-ember">The rhythm</p><h2 className="mt-5 max-w-[8ch] text-[48px] font-black leading-[0.94] tracking-[-0.05em] sm:text-[66px]">Ask. Build. Evolve.</h2></div>
            <div className="grid divide-y divide-white/15 border-y border-white/15">
              {["Tell BioAro Drugs AI what matters to you and ask questions about products, ingredients and routines.", "Turn your goals into a structured BioAro protocol with Morning, Around Training and Evening in view.", "Return to your workspace, answer additional questions and refine the routine as your needs change."].map((text, index) => (
                <div key={text} className="grid gap-4 py-7 sm:grid-cols-[90px_1fr] sm:items-start"><span className="text-[13px] font-bold text-ember">0{index + 1} / {index === 0 ? "ASK" : index === 1 ? "BUILD" : "EVOLVE"}</span><p className="max-w-[52ch] text-[18px] leading-[1.55] text-cream/75">{text}</p></div>
              ))}
            </div>
          </div>
          <div className="mt-14 flex gap-3 border-t border-white/15 pt-6 text-[13px] leading-relaxed text-cream/55"><LockKeyhole size={16} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" /><p>BioAro Drugs AI provides general product and educational guidance. It does not diagnose conditions or replace advice from a qualified healthcare professional.</p></div>
        </div>
      </section>

      <section className="container-bio py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 lg:flex-row lg:items-end"><div><p className="eyebrow">Choose your depth</p><h2 className="mt-4 text-[40px] font-black leading-none tracking-[-0.045em] sm:text-[56px]">Explore freely.<br />Build continuously.</h2></div><p className="max-w-[34ch] text-[15px] leading-[1.65] text-ink-600">The public assistant is the starting point. Membership gives the work somewhere to live.</p></div>
        <div className="mt-8 overflow-x-auto rounded-[20px] border border-line bg-white shadow-glass"><table className="w-full min-w-[680px] border-collapse text-left"><thead><tr className="border-b border-line bg-cream-50"><th className="px-5 py-5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink-400 sm:px-7">Capability</th><th className="px-5 py-5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink-400 sm:px-7">Public AI</th><th className="bg-ember/5 px-5 py-5 text-[12px] font-bold uppercase tracking-[0.12em] text-ember-600 sm:px-7">Membership</th></tr></thead><tbody>{COMPARISON.map(([capability, publicValue, memberValue]) => <tr key={capability} className="border-b border-line last:border-b-0"><td className="px-5 py-4 text-[14px] font-bold text-ink sm:px-7">{capability}</td><td className="px-5 py-4 text-[14px] text-ink-600 sm:px-7">{publicValue}</td><td className="bg-ember/[0.025] px-5 py-4 text-[14px] font-bold text-ink sm:px-7"><span className="inline-flex items-center gap-2"><Check size={15} className="text-ember" aria-hidden="true" />{memberValue}</span></td></tr>)}</tbody></table></div>
      </section>

      <section className="bg-[#e9eee7] py-20 sm:py-28"><div className="container-bio grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-24"><div><p className="eyebrow">One plan</p><h2 className="mt-4 max-w-[12ch] text-[44px] font-black leading-[0.97] tracking-[-0.045em] sm:text-[62px]">Keep building on what matters.</h2><p className="mt-6 max-w-[50ch] text-[17px] leading-[1.7] text-ink-600">A single membership for the BioAro Drugs AI workspace, built around continuity rather than more noise.</p></div><div className="rounded-[24px] border border-line bg-white p-7 shadow-glass sm:p-9"><div className="flex items-start justify-between gap-5"><div><p className="text-[12px] font-bold uppercase tracking-[0.14em] text-ember">BioAro Drugs AI</p><h3 className="mt-3 text-[28px] font-bold tracking-[-0.04em]">Membership</h3></div><Sparkles className="text-ember" size={23} aria-hidden="true" /></div><p className="mt-8 text-[42px] font-black tracking-[-0.05em]">{price}<span className="ml-2 text-[15px] font-medium tracking-normal text-ink-400">/ month</span></p><ul className="mt-7 space-y-3 border-t border-line pt-6 text-[14px] leading-relaxed text-ink-600">{["Advanced BioAro Drugs AI workspace", "Guided protocol building", "Saved conversation history", "Ongoing protocol refinement"].map((item) => <li key={item} className="flex gap-3"><Check size={16} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />{item}</li>)}</ul>{activeMember ? <Link to={marketHref(ROUTES.ai)} className="btn-primary mt-8 w-full">Open BioAro Drugs AI <ArrowRight size={16} aria-hidden="true" /></Link> : <button type="button" onClick={() => void handlePrimary()} disabled={primaryDisabled} className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:bg-ink/35 disabled:shadow-none">{checkoutLoading ? "Opening secure checkout…" : primaryLabel} <ArrowRight size={16} aria-hidden="true" /></button>}<p className="mt-4 text-center text-[12px] leading-relaxed text-ink-400">{checkoutError ?? (offer && membershipService.isMembershipCheckoutConfigured() ? "Secure billing through Shopify." : "Join checkout will appear here once Shopify membership billing is connected.")}</p></div></div></section>

      <section className="container-bio py-20 sm:py-28"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><p className="eyebrow">Clear by design</p><h2 className="mt-4 text-[40px] font-black leading-[0.98] tracking-[-0.045em] sm:text-[56px]">Useful support. Honest boundaries.</h2></div><div className="grid gap-4 sm:grid-cols-2">{["May make mistakes", "General product guidance", "Not a diagnosis", "Not a prescription", "Not biomarker or genetic interpretation", "Not a replacement for professional advice"].map((item) => <div key={item} className="flex gap-3 border-t border-line pt-4 text-[14px] leading-relaxed text-ink-600"><CircleHelp size={17} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />{item}</div>)}</div></div></section>

      <section className="container-bio pb-20 sm:pb-28"><div className="mx-auto max-w-[820px] border-t border-line pt-12"><div className="flex items-center gap-3"><CircleHelp size={18} className="text-ember" aria-hidden="true" /><p className="eyebrow">Questions, answered</p></div><div className="mt-8 divide-y divide-line">{FAQS.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-8 text-[17px] font-bold tracking-[-0.02em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember [&::-webkit-details-marker]:hidden">{question}<span className="text-ember transition-transform group-open:rotate-45">+</span></summary><p className="max-w-[65ch] pt-4 text-[15px] leading-[1.7] text-ink-600">{answer}</p></details>)}</div></div></section>

      <section className="bg-ink py-20 text-cream sm:py-24"><div className="container-bio flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="text-[12px] font-bold uppercase tracking-[0.15em] text-ember">Start where you are</p><h2 className="mt-4 max-w-[12ch] text-[44px] font-black leading-[0.96] tracking-[-0.05em] sm:text-[62px]">Your routine doesn’t have to start over.</h2><p className="mt-5 max-w-[42ch] text-[16px] leading-[1.65] text-cream/65">Build it once. Return to it. Keep refining it with BioAro Drugs AI.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link to={marketHref(ROUTES.ai)} className="btn-primary !bg-white !text-ink hover:!bg-cream-100">Explore public AI <ArrowRight size={16} aria-hidden="true" /></Link><Link to={marketHref(ROUTES.support)} className="btn-secondary !border-white/20 !text-cream hover:!bg-white/10">Need help first?</Link></div></div></section>
    </main>
  );
}
