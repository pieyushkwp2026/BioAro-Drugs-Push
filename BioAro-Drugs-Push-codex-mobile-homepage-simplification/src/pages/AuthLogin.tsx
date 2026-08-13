import { useCallback, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useMarket } from "../hooks/useMarket";
import { useMarketHref } from "../hooks/useMarketHref";
import { getMarketConfigByMarket } from "../config/markets";
import { isCustomerAuthConfigured } from "../lib/shopify/customerAuth";
import { ROUTES } from "../lib/routes";
import bioAroMark from "../assets/logo/bioaro-mark.png";
// JPEG rather than the 2.26MB source PNG: 408KB for the same 1448px, and this is the
// only blocking image on the page a customer waits behind to sign in.
import authVisual from "../assets/auth/shopify-account-runner-products.jpg";

/*
 * The sign-in handoff. This route renders outside Layout (see App.tsx), so it owns
 * its own way back to the store and its own footer links.
 *
 * What was here before: a floating glass card on blurred blobs, an eyebrow, a 68px
 * headline over a half-empty column, a paragraph on the photo repeating the paragraph
 * beside it, and three icons promising "View order details" on a store where
 * checkoutEnabled is false in every market. Rebuilt in the homepage language, and the
 * three icons are replaced by the one thing worth saying at a handoff: what happens
 * when you click.
 *
 * Four flow defects fixed at the same time:
 *  1. `disabled={isLoading}` used the provider's mount-time auth check, so the button
 *     read "Redirecting..." and was dead before anyone touched it. Redirecting is now
 *     local state set by the click.
 *  2. login() defaulted returnTo to window.location.pathname, which on /auth is this
 *     page, so a successful sign-in landed you back on the sign-in screen. It now
 *     returns to the account.
 *  3. Signed-in visitors were shown the sign-in page. They are redirected.
 *  4. With the Customer Account API unconfigured, startLogin throws a message naming
 *     the missing env vars, and the page rendered it to the customer verbatim. That
 *     state is now detected before the button exists.
 */

/* The "you continue on Shopify" step was dropped once the client's own redirect note
   went back under the button, which already says it. These two add what it does not. */
const HANDOFF_STEPS = [
  {
    title: "BioAro never sees your password",
    body: "Only a sign-in token comes back. No password is sent to or stored by this site.",
  },
  {
    title: "You come straight back",
    body: "You land on your BioAro account with your region and details already in place.",
  },
] as const;

/* Matches the quiet-link treatment used on Account and elsewhere. */
const QUIET_LINK =
  "rounded-full text-[14.5px] font-bold text-ink underline-offset-[5px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember";

export default function AuthLogin() {
  const { login, isLoading, isAuthenticated, error } = useAuth();
  const marketHref = useMarketHref();
  const { market } = useMarket();
  const marketConfig = getMarketConfigByMarket(market);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const accountHref = marketHref(ROUTES.account);
  const accountsAvailable = isCustomerAuthConfigured();

  const onSignIn = useCallback(async () => {
    setIsRedirecting(true);
    // Sends you to the account rather than back to this page. On success the browser
    // leaves, so the pending state is only cleared when startLogin failed.
    await login(accountHref);
    setIsRedirecting(false);
  }, [accountHref, login]);

  // Already signed in: nothing to do here.
  if (isAuthenticated) return <Navigate to={accountHref} replace />;

  return (
    /* Pinned to the viewport at lg so the photo is never taller than the screen and
       its caption cannot fall below the fold on a short laptop. The form column takes
       the scroll instead, which only happens under roughly 860px of height. */
    <div className="grid min-h-[100dvh] bg-cream lg:h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)]">
      {/* -------------------------------------------------- form */}
      <div className="flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:overflow-y-auto lg:px-14 lg:py-12 xl:px-20">
        <Link
          to={marketHref(ROUTES.home)}
          className="group inline-flex w-fit items-center gap-3 rounded-full text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
        >
          <ArrowLeft
            size={16}
            strokeWidth={2.2}
            aria-hidden="true"
            className="text-ink-400 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none"
          />
          <img src={bioAroMark} alt="" aria-hidden="true" className="h-8 w-8 rounded-[10px] object-contain" />
          <span className="text-[16px] font-bold tracking-[-0.02em]">BioAro Drugs</span>
        </Link>

        <main className="flex flex-1 items-center py-12 lg:py-10">
          <div className="w-full max-w-[440px]">
            {isLoading ? (
              /* Shaped skeleton, so the form does not flash before an existing
                 session resolves and redirects. */
              <div aria-busy="true" aria-label="Checking your session">
                <div className="h-[44px] w-[78%] animate-pulse rounded-2xl bg-cream-200" />
                <div className="mt-6 h-[17px] w-full animate-pulse rounded-lg bg-cream-200" />
                <div className="mt-3 h-[17px] w-[64%] animate-pulse rounded-lg bg-cream-200" />
                <div className="mt-9 h-[52px] w-[190px] animate-pulse rounded-full bg-cream-200" />
              </div>
            ) : (
              <>
                {/* Eyebrow, heading, body, button label and redirect note are the
                    client's own strings, kept verbatim. Only the type and colour move
                    to the site system. */}
                <p className="eyebrow">Account access</p>
                <h1 className="mt-4 text-balance text-[36px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[42px] lg:text-[46px]">
                  Sign in to your account.
                </h1>
                <p className="mt-6 max-w-[46ch] text-pretty text-[16.5px] leading-[1.6] text-ink-600">
                  Access your orders, saved details, and account preferences through BioAro&rsquo;s
                  secure Shopify customer account.
                </p>

                {accountsAvailable ? (
                  <>
                    {error && (
                      <p
                        role="alert"
                        className="mt-7 rounded-[18px] border border-ember/25 bg-forest-50 px-5 py-4 text-[14.5px] leading-[1.55] text-ember-700"
                      >
                        {error}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => void onSignIn()}
                      disabled={isRedirecting}
                      className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                    >
                      <span>{isRedirecting ? "Redirecting..." : "Get Started"}</span>
                      <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
                    </button>

                    <p className="mt-4 max-w-[46ch] text-[13.5px] leading-[1.55] text-ink-400">
                      You will be redirected to Shopify&rsquo;s secure Customer Account sign-in.
                    </p>

                    <ol className="mt-10 border-t border-line">
                      {/* The page footer rule closes the list, so the last row drops
                          its own border rather than stacking two hairlines. */}
                      {HANDOFF_STEPS.map((step, index) => (
                        <li key={step.title} className="flex gap-4 border-b border-line py-4 last:border-b-0">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 text-[12.5px] font-bold tabular-nums text-ember"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="text-[15px] font-bold tracking-[-0.02em] text-ink">
                              {step.title}
                            </p>
                            <p className="mt-1 text-pretty text-[14.5px] leading-[1.55] text-ink-600">
                              {step.body}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : (
                  /* The Customer Account API has no credentials. Say so in the same
                     voice the markets use for checkout, and never surface the thrown
                     message, which names environment variables. */
                  <div className="mt-8 rounded-[24px] border border-line bg-white p-7 shadow-glass">
                    <h2 className="text-[17px] font-bold tracking-[-0.02em] text-ink">
                      Accounts are opening soon.
                    </h2>
                    <p className="mt-2 max-w-[46ch] text-pretty text-[15px] leading-[1.6] text-ink-600">
                      Customer accounts are not open in {marketConfig.name} yet. You can browse the
                      full range now, and reach us any time without an account.
                    </p>
                    {/* One action only. The page footer already carries the support
                        link, and repeating it here put the same link on screen twice. */}
                    <Link to={marketHref(ROUTES.shop)} className="btn-primary mt-6">
                      Browse products
                      <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <footer className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-6">
          <Link to={marketHref(ROUTES.shop)} className={QUIET_LINK}>
            Browse without signing in
          </Link>
          <Link to={marketHref(ROUTES.support)} className={QUIET_LINK}>
            Contact support
          </Link>
        </footer>
      </div>

      {/* -------------------------------------------------- visual */}
      <div className="relative min-h-[320px] overflow-hidden bg-ink sm:min-h-[400px] lg:min-h-0">
        {/* object-position is biased right of centre: the container is portrait at lg,
            and a true centre crop cut the LONgevity+ label off the edge at 1280. */}
        <img
          src={authVisual}
          alt="A runner at first light on a coastal trail, with BioAro LONgevity+ and CellOmega+ beside them."
          className="absolute inset-0 h-full w-full object-cover object-[58%_center]"
          loading="eager"
          decoding="async"
        />
        {/* Scrim only. The glass caption card that used to sit here repeated the
            paragraph in the left column and added a second, softer material the rest
            of the site no longer uses. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,16,0.34)_0%,rgba(20,18,16,0)_28%,rgba(20,18,16,0.7)_100%)]" />

        {/* Which regional store you are signing in to. It was buried in the footer,
            where at 1280 it wrapped to a line that fell out of view. */}
        <p className="absolute right-7 top-7 rounded-full border border-white/25 px-3.5 py-1.5 text-[12.5px] font-bold tracking-[-0.01em] text-white sm:right-10 sm:top-10">
          {marketConfig.name} &middot; {marketConfig.currency}
        </p>
        <p className="absolute inset-x-7 bottom-7 max-w-[19ch] text-balance text-[26px] font-black leading-[1.06] tracking-[-0.03em] text-white sm:inset-x-10 sm:bottom-10 sm:text-[32px] lg:text-[34px]">
          Understand what you take. Then keep it simple.
        </p>
      </div>
    </div>
  );
}
