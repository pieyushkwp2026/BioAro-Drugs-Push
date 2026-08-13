import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMarketHref } from "../hooks/useMarketHref";
import { useMarket } from "../hooks/useMarket";
import { useAuth } from "../hooks/useAuth";
import { getMarketConfigByMarket } from "../config/markets";
import { ROUTES } from "../lib/routes";

/*
 * Previously three near-identical centred blocks (loading / signed-in / signed-out),
 * each a narrow column stranded in an empty viewport, each with three same-weight
 * CTAs and a repeated eyebrow. Now one shell with a two-column layout: what you can
 * do on the left, what the account actually holds on the right.
 *
 * The copy deliberately does not promise features that do not exist. Ordering is not
 * open in any market (`checkoutEnabled: false` everywhere), so order history is shown
 * as an honest empty state using the market's own `checkoutMessage` rather than a
 * vague "coming soon".
 */

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-28">
      <div className="container-bio">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-16">
          {children}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-line bg-white p-7 shadow-glass sm:p-9">
      <h2 className="text-[19px] font-bold tracking-[-0.025em] text-ink">{title}</h2>
      <dl className="mt-6 space-y-5">{children}</dl>
    </section>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <dt className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">{term}</dt>
      <dd className="mt-1.5 text-pretty text-[15.5px] leading-[1.55] text-ink-600">{children}</dd>
    </div>
  );
}

export default function Account() {
  const marketHref = useMarketHref();
  const { market } = useMarket();
  const marketConfig = getMarketConfigByMarket(market);
  const { isAuthenticated, isLoading, customer, logout } = useAuth();

  if (isLoading) {
    // A shaped skeleton rather than the words "Loading your account...", so the
    // layout does not jump once the auth check resolves.
    return (
      <Shell>
        <div aria-busy="true" aria-label="Loading your account">
          <div className="h-[46px] w-[62%] animate-pulse rounded-2xl bg-cream-200" />
          <div className="mt-6 h-[18px] w-[86%] animate-pulse rounded-lg bg-cream-200" />
          <div className="mt-3 h-[18px] w-[70%] animate-pulse rounded-lg bg-cream-200" />
          <div className="mt-9 h-[52px] w-[180px] animate-pulse rounded-full bg-cream-200" />
        </div>
        <div className="h-[280px] animate-pulse rounded-[28px] border border-line bg-cream-200" />
      </Shell>
    );
  }

  if (isAuthenticated && customer) {
    const displayName = customer.firstName ?? "there";

    return (
      <Shell>
        <div>
          <h1 className="text-balance text-[38px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[46px] lg:text-[54px]">
            Welcome back, {displayName}.
          </h1>
          <p className="mt-6 max-w-[52ch] text-pretty text-[17px] leading-[1.6] text-ink-600">
            You are signed in to the {marketConfig.name} store. Everything you order will appear
            here once ordering opens.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link to={marketHref(ROUTES.shop)} className="btn-primary">
              Browse products
            </Link>
            <Link
              to={marketHref(ROUTES.support)}
              className="rounded-full py-2 text-[15px] font-bold text-ink underline-offset-[6px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
            >
              Contact support
            </Link>
          </div>

          {/* Sign out is deliberately the quietest control on the page; it used to sit
              at the same weight as the primary actions. */}
          <button
            type="button"
            onClick={logout}
            className="mt-10 rounded-full text-[14px] font-medium text-ink-400 underline underline-offset-[5px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
          >
            Sign out
          </button>
        </div>

        <Panel title="Your details">
          {customer.emailAddress && <Row term="Email">{customer.emailAddress}</Row>}
          <Row term="Region">
            {marketConfig.name} &middot; {marketConfig.currency}
          </Row>
          <Row term="Orders">{marketConfig.checkoutMessage}</Row>
        </Panel>
      </Shell>
    );
  }

  return (
    <Shell>
      <div>
        <h1 className="text-balance text-[38px] font-black leading-[1.0] tracking-[-0.035em] text-ink sm:text-[46px] lg:text-[54px]">
          Your BioAro account.
        </h1>
        <p className="mt-6 max-w-[52ch] text-pretty text-[17px] leading-[1.6] text-ink-600">
          Sign in to keep your details and region in one place. Orders will appear here once
          ordering opens in your market.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link to={marketHref("/auth")} className="btn-primary">
            Sign in
          </Link>
          <Link
            to={marketHref(ROUTES.shop)}
            className="rounded-full py-2 text-[15px] font-bold text-ink underline-offset-[6px] transition-colors hover:text-ember hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
          >
            Browse products
          </Link>
        </div>

        <p className="mt-10 max-w-[46ch] text-[14.5px] leading-[1.6] text-ink-400">
          Questions about a product, availability or an order? {" "}
          <Link
            to={marketHref(ROUTES.support)}
            className="rounded-sm font-medium text-ink underline underline-offset-[4px] transition-colors hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
          >
            Contact support
          </Link>{" "}
          without signing in.
        </p>
      </div>

      <Panel title="What your account holds">
        <Row term="Your details">Your name and email, held with your BioAro customer account.</Row>
        <Row term="Your region">
          {marketConfig.name} &middot; {marketConfig.currency}. Prices, policies and availability
          follow the region you choose.
        </Row>
        <Row term="Orders">{marketConfig.checkoutMessage}</Row>
      </Panel>
    </Shell>
  );
}
