import { Link } from "react-router-dom";

export default function Account() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24 min-h-screen">
      <div className="container-bio">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">Account access</span>
          <h1 className="mt-3 text-3xl md:text-4xl">Customer accounts are not exposed in this launch surface yet.</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/55">
            Orders, product questions, and support requests are handled through the product pages, cart flow, and support team while the wider account experience is being finalized.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact-support" className="btn-primary">
              Contact support
            </Link>
            <Link to="/shop" className="btn-secondary">
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
