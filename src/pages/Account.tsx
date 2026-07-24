import { Link } from "react-router-dom";
import { useMarketHref } from "../hooks/useMarketHref";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../lib/routes";

export default function Account() {
  const marketHref = useMarketHref();
  const { isAuthenticated, isLoading, customer, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 md:pt-32 md:pb-24 min-h-screen">
        <div className="container-bio">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow">Account access</span>
            <h1 className="mt-3 text-3xl md:text-4xl">Loading your account...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && customer) {
    const displayName = customer.firstName ?? "there";

    return (
      <div className="pt-24 pb-20 md:pt-32 md:pb-24 min-h-screen">
        <div className="container-bio">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow">Account access</span>
            <h1 className="mt-3 text-3xl md:text-4xl">Welcome back, {displayName}.</h1>
            {customer.emailAddress && (
              <p className="mt-4 text-sm leading-relaxed text-ink/55">{customer.emailAddress}</p>
            )}
            <p className="mt-4 text-sm leading-relaxed text-ink/55">
              Order history and saved details are coming soon. For now, you can browse products
              or contact our support team about orders, product questions, and availability.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to={marketHref(ROUTES.shop)} className="btn-primary">
                Browse products
              </Link>
              <Link to={marketHref(ROUTES.support)} className="btn-secondary">
                Contact support
              </Link>
              <button type="button" onClick={logout} className="btn-secondary">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24 min-h-screen">
      <div className="container-bio">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Account access</span>
          <h1 className="mt-3 text-3xl md:text-4xl">Sign in to view your account.</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/55">
            For now, you can browse products and contact our support team about orders, product questions, and availability.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth" className="btn-primary">
              Sign in
            </Link>
            <Link to={marketHref(ROUTES.support)} className="btn-secondary">
              Contact support
            </Link>
            <Link to={marketHref(ROUTES.shop)} className="btn-secondary">
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}