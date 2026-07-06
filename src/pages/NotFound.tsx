import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="pt-36 pb-24">
      <div className="container-bio text-center">
        <span className="eyebrow">Not found</span>
        <h1 className="mt-3 text-4xl md:text-5xl">This page isn't available.</h1>
        <p className="mx-auto mt-5 max-w-md text-ink/55">
          The route may have moved as the BioAro launch structure comes together. Use the main navigation or head back to the shop.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">
            Go to shop
          </Link>
          <Link to="/" className="btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
