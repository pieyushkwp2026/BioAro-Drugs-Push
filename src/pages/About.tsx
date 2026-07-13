import { FlaskConical, Heart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import ctaProductVisual from "../assets/cta/dark-luxury-cta-product-visual.png";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";

export default function About() {
  const marketHref = useMarketHref();

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <span className="eyebrow">About BioAro</span>
        <h1 className="mt-3 max-w-2xl text-4xl md:text-5xl">BioAro is building a more intentional wellness experience.</h1>

        <div className="mt-14 grid items-center gap-12 md:grid-cols-2">
          <div className="glass-card aspect-[4/5] overflow-hidden order-2 md:order-1">
            <img src={ctaProductVisual} alt="BioAro product lineup" className="h-full w-full object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <p className="font-display text-2xl leading-snug italic text-ink/80">
              "Better health decisions start with better understanding, clearer action, and routines that customers can actually stay with."
            </p>
            <p className="mt-6 text-sm leading-relaxed text-ink/55">
              BioAro Drugs is the action layer of a wider system. The goal is to give customers a premium storefront that explains what each product is for, how it fits into the day, and where support and policy details live when questions arise.
            </p>
            <Link to={marketHref(ROUTES.living)} className="mt-6 inline-flex items-center gap-1 text-sm text-forest-600 transition-all hover:gap-2">
              Read the Living 2.0 approach
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-5 sm:grid-cols-3">
          {[
            { icon: FlaskConical, title: "Evidence-led", desc: "Products are framed with plain-language routine guidance rather than overclaiming." },
            { icon: ShieldCheck, title: "Supportive by design", desc: "Policies, FAQs, and support content are part of the launch surface, not an afterthought." },
            { icon: Heart, title: "Built for consistency", desc: "The experience aims to help customers stay with a routine over time instead of chasing one-off fixes." },
          ].map((value) => (
            <div key={value.title} className="glass-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full glass">
                <value.icon size={19} className="text-forest-600" />
              </div>
              <h2 className="text-lg">{value.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
