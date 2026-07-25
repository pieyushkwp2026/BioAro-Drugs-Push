import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useMarketHref } from "../hooks/useMarketHref";
import bioAroMark from "../assets/logo/bioaro-mark.png";

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
      setError("Sign-in was cancelled or denied.");
      return;
    }

    if (!code || !state) {
      setError("Missing sign-in details. Please try again.");
      return;
    }

    void (async () => {
      try {
        const returnTo = await handleCallback(code, state);
        navigate(returnTo, { replace: true });
      } catch {
        setError("Sign-in failed. Please try again.");
      }
    })();
  }, [handleCallback, navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f3ed] px-4 py-24">
      <div className="w-full max-w-[520px] rounded-[32px] border border-white/70 bg-white/72 p-8 text-center shadow-[0_30px_90px_rgba(35,29,20,0.12)] backdrop-blur-2xl sm:p-10">
        <img src={bioAroMark} alt="" aria-hidden="true" className="mx-auto h-10 w-10 rounded-xl object-contain" />
        {error ? (
          <div className="mt-6">
            <p className="eyebrow">Account access</p>
            <h1 className="mt-3 text-4xl leading-none tracking-[-0.02em] text-ink">Sign-in failed</h1>
            <p className="mt-4 text-sm leading-6 text-ink/58">{error}</p>
            <Link
              to={marketHref("/auth")}
              className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-forest-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-600"
            >
              Try again
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-forest-600" aria-hidden="true" />
            <p className="mt-6 eyebrow">Account access</p>
            <h1 className="mt-3 text-4xl leading-none tracking-[-0.02em] text-ink">Signing you in...</h1>
            <p className="mt-4 text-sm leading-6 text-ink/58">Please wait while we securely connect your BioAro account.</p>
          </div>
        )}
      </div>
    </div>
  );
}
