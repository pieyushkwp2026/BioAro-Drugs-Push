import Link from "next/link";

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-hero-radial px-6 pt-40 text-white md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-bioaro-soft/75">Consultation</p>
        <h1 className="mt-6 font-display text-5xl md:text-6xl">Book a consultation.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-bioaro-text">
          Placeholder destination for consultations and enterprise inquiries. This route is ready
          for future booking flow or CRM integration.
        </p>
        <Link href="/our-offerings" className="mt-8 inline-flex text-sm font-semibold text-bioaro-soft">
          Back to Our Offerings
        </Link>
      </div>
    </div>
  );
}
