import { Link } from "react-router-dom";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

export default function Account() {
  const marketHref = useMarketHref();

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24 min-h-screen">
      <div className="container-bio">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Account access</span>
          <h1 className="mt-3 text-3xl md:text-4xl">Account access is coming soon.</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/55">
            For now, you can browse products and contact our support team about orders, product questions, and availability.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={marketHref(ROUTES.support)} className="btn-primary">
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
