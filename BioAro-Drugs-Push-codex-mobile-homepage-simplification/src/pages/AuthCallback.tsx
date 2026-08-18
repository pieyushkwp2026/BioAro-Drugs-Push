import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";
import bioAroMark from "../assets/logo/bioaro-mark.png";

/*
 * The return leg of the handoff, and the screen a customer sees seconds after
 * AuthLogin. It was still on the retired skin (glass card, blurred backdrop, eyebrow,
 * ink/58 body copy, forest-green spinner), so the flow changed appearance halfway
 * through. Same ground, same type, same accent as the page it came from.
 */

const QUIET_LINK =
  "rounded-full text-[14.5px] font-bold text-ink underline-offset-[5px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useAuth();
  const marketHref = useMarketHref();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError("Sign-in was cancelled before it finished.");
      return;
    }

    if (!code || !state) {
      setError("That sign-in link is missing some details.");
      return;
    }

    void (async () => {
      try {
        const returnTo = await handleCallback(code, state);
        navigate(returnTo, { replace: true });
      } catch {
        setError("We could not complete the sign-in.");
      }
    })();
  }, [handleCallback, navigate, searchParams]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-transparent px-5 py-20">
      <div className="w-full max-w-[520px] rounded-[28px] border border-line bg-white p-8 shadow-glass sm:p-10">
        <img src={bioAroMark} alt="" aria-hidden="true" className="h-9 w-9 rounded-[10px] object-contain" />

        {error ? (
          <div role="alert">
            <h1 className="mt-7 text-balance text-[30px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[34px]">
              {error}
            </h1>
            <p className="mt-4 max-w-[46ch] text-pretty text-[15.5px] leading-[1.6] text-ink-600">
              Nothing was changed on your account. You can start again, or reach us and we will
              sort it out with you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link to={marketHref("/auth")} className="btn-primary">
                Try again
                <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
              </Link>
              <Link to={marketHref(ROUTES.support)} className={QUIET_LINK}>
                Contact support
              </Link>
            </div>
          </div>
        ) : (
          <div aria-busy="true" aria-live="polite">
            <h1 className="mt-7 text-[30px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[34px]">
              Signing you in.
            </h1>
            <p className="mt-4 max-w-[46ch] text-pretty text-[15.5px] leading-[1.6] text-ink-600">
              Finishing the secure handoff from Shopify. This takes a moment.
            </p>
            {/* An indeterminate rail rather than a spinner: it reads as progress on a
                wait we cannot measure, and the reduced-motion rule in index.css
                leaves a static bar instead of a frozen half-turn of a circle. */}
            <div
              className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-cream-200"
              aria-hidden="true"
            >
              <div className="bio-auth-rail h-full w-1/3 rounded-full bg-ember" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
