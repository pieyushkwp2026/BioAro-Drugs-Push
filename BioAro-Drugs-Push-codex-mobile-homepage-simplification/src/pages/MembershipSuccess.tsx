import { useEffect, useState } from "react";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMarketHref } from "../hooks/useMarketHref";
import { useMemberSnapshot } from "../hooks/useMemberSnapshot";
import { hasAdvancedAiAccess } from "../lib/member/advancedAi";
import { ROUTES } from "../lib/routes";

export default function MembershipSuccess() {
  const marketHref = useMarketHref();
  const navigate = useNavigate();
  const { snapshot, state, reload } = useMemberSnapshot();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (state === "ready" && hasAdvancedAiAccess(snapshot?.membership)) {
      navigate(marketHref(ROUTES.ai), { replace: true });
      return;
    }

    if (attempts >= 4 || state === "unauthenticated" || state === "error") return;

    const timer = window.setTimeout(() => {
      setAttempts((value) => value + 1);
      reload();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [attempts, marketHref, navigate, reload, snapshot?.membership, state]);

  const timedOut = attempts >= 4;
  const unavailable = state === "unavailable" || state === "error";

  return (
    <main className="flex min-h-[calc(100dvh-88px)] items-center px-5 py-16 sm:px-8 sm:py-24">
      <div className="container-bio w-full">
        <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[30px] border border-line bg-white p-8 shadow-glass sm:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ember/10 text-ember"><RefreshCw size={20} aria-hidden="true" /></div>
            <p className="mt-9 eyebrow text-ember-600">BioAro Drugs AI Membership</p>
            <h1 className="mt-4 max-w-[13ch] text-balance text-[46px] font-black leading-[0.96] tracking-[-0.05em] sm:text-[62px]">Confirming your membership.</h1>
            <p className="mt-6 max-w-[50ch] text-[17px] leading-[1.65] text-ink-600">Your purchase cannot unlock Advanced AI by itself. We are checking the verified membership record connected to your BioAro account.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              {!unavailable && !timedOut && <span className="inline-flex items-center gap-2 rounded-full border border-line bg-cream-50 px-4 py-2 text-[13px] font-bold text-ink-600"><RefreshCw size={14} className="animate-spin" aria-hidden="true" /> Checking access</span>}
              {(unavailable || timedOut) && <button type="button" onClick={() => { setAttempts(0); reload(); }} className="btn-primary">Try again <RefreshCw size={15} aria-hidden="true" /></button>}
              <Link to={marketHref(ROUTES.support)} className="btn-secondary">Contact support <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </section>
          <aside className="rounded-[28px] border border-line bg-[#e9eee7] p-7 sm:p-9">
            <h2 className="text-[20px] font-bold tracking-[-0.025em]">What happens next?</h2>
            <ol className="mt-7 space-y-6">
              {["Shopify records the purchase.", "Your BioAro account is matched to the membership.", "Verified access opens your regional AI workspace."].map((item, index) => <li key={item} className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-bold text-ember">{index + 1}</span><p className="pt-1 text-[14px] leading-[1.55] text-ink-600">{item}</p></li>)}
            </ol>
            <div className="mt-9 border-t border-ink/10 pt-6"><p className="flex gap-2 text-[13px] leading-relaxed text-ink-500"><Check size={15} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />We never unlock the workspace from a redirect or query parameter alone.</p></div>
          </aside>
        </div>
      </div>
    </main>
  );
}
