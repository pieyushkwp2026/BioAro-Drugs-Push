import { Link, useLocation } from "react-router-dom";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { useAuth } from "../../hooks/useAuth";
import { getMarketConfigByMarket } from "../../config/markets";
import { ROUTES } from "../../lib/routes";
import { MemberPanel, PanelRow } from "./primitives";

/*
 * What an unauthenticated visitor sees at /account and below.
 *
 * Rendered IN PLACE rather than redirected to /auth, for three reasons: the sign-in
 * page renders outside Layout so a redirect drops the header mid-flow; this is the
 * behaviour `pages/Account.tsx` already had; and keeping the URL means the back
 * button behaves and the address bar still says where the visitor was going.
 *
 * `reason` separates "you are signed out" from "sign-in is not switched on in this
 * build" — the second happens whenever the customer-account env vars are absent, and
 * without it the page offers a button that cannot work.
 */
export default function MemberSignedOut({ reason }: { reason: "signed-out" | "unavailable" }) {
  const marketHref = useMarketHref();
  const location = useLocation();
  const { market } = useMarket();
  const marketConfig = getMarketConfigByMarket(market);
  const { login } = useAuth();

  /* Already market-prefixed by the router, so it must NOT go through marketHref or it
     would double the segment. Anything not starting with "/" is discarded — the value
     is internal today, and the check documents that it must stay internal. */
  const path = `${location.pathname}${location.search}`;
  const returnTo = path.startsWith("/") ? path : marketHref(ROUTES.account);

  return (
    <div className="pb-24 pt-28 md:pb-28 md:pt-36">
      <div className="container-bio">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <h1 className="text-balance text-[38px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[46px] lg:text-[54px]">
              Your BioAro Drugs account.
            </h1>

            {reason === "unavailable" ? (
              <p className="mt-6 max-w-[52ch] text-pretty text-[17px] leading-[1.6] text-ink-600">
                Signing in is not switched on in this build, so there is nothing to open yet. You can
                still browse products and build a protocol without an account.
              </p>
            ) : (
              <p className="mt-6 max-w-[52ch] text-pretty text-[17px] leading-[1.6] text-ink-600">
                Sign in to keep your details, your region and your protocol in one place.
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              {reason === "signed-out" && (
                <button type="button" onClick={() => login(returnTo)} className="btn-primary">
                  Sign in
                </button>
              )}
              <Link
                to={marketHref(ROUTES.shop)}
                className="rounded-full py-2 text-[15px] font-bold text-ink underline-offset-[6px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              >
                Browse products
              </Link>
            </div>

            <p className="mt-10 max-w-[46ch] text-[14.5px] leading-[1.6] text-ink-400">
              Questions about a product, availability or an order?{" "}
              <Link
                to={marketHref(ROUTES.support)}
                className="rounded-sm font-medium text-ink underline underline-offset-[4px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              >
                Contact support
              </Link>{" "}
              without signing in.
            </p>
          </div>

          <MemberPanel title="What your account holds">
            <dl className="space-y-5">
              <PanelRow term="Your details">
                Your name and email, held with your BioAro Drugs customer account.
              </PanelRow>
              <PanelRow term="Your region">
                {marketConfig.name} &middot; {marketConfig.currency}. Prices, policies and availability
                follow the region you choose.
              </PanelRow>
              <PanelRow term="Orders">{marketConfig.checkoutMessage}</PanelRow>
            </dl>
          </MemberPanel>
        </div>
      </div>
    </div>
  );
}
