import { type FormEvent, useState } from "react";
import { ArrowRight, Check, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import bioAroMark from "../../assets/logo/bioaro-mark.png";
import RegionSelector from "./RegionSelector";
import { FOOTER_SECTIONS, ROUTES } from "../../lib/routes";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { getMarketConfigByMarket } from "../../config/markets";

/*
 * ONE footer, every route. This previously carried two full variants keyed off
 * `isRegionalHomepage`, which is the same split that made the header look broken
 * when you navigated off the homepage.
 *
 * Link IA comes from FOOTER_SECTIONS in lib/routes.ts, which was already exported
 * and imported by nothing. The local arrays it replaced contained real bugs:
 * "/shop?category=Recovery" is not a valid Shop filter (Shop.tsx:8 allows only
 * All/LONgevity+/Wellness/Focus/Energy/Performance, and normalizeFilter silently
 * falls back to All), "Sleep" pointed at /protocols, and three pairs of links had
 * duplicate destinations. Living 2.0 and the account page were missing entirely.
 *
 * No payment-method icons: `checkoutEnabled` is false in every market config, so
 * advertising card brands on a store that cannot take payment would be untrue.
 */

/* Only claims that are actually confirmed. Deliberately no customer counts, no
   awards, no "clinically tested" - none of those are substantiated. */
const MARQUEE_ITEMS = [
  "Third-party tested",
  "Non-GMO",
  "Gluten free",
  "Sugar free",
  "Nut free",
  "Vegan",
];

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.78 3h3.07l-6.7 7.66L22 21h-6.15l-4.82-6.3L5.51 21H2.44l7.17-8.2L2 3h6.31l4.35 5.75L17.78 3Zm-1.08 16.18h1.7L7.38 4.72H5.56L16.7 19.18Z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { Icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/bioarodrugs?igsh=MTlmcGZrMGg0d3owdQ==" },
  { Icon: XIcon, label: "X", href: "https://x.com/bioarodrugs?s=11" },
];

const LINK_CLASS =
  "inline-block py-1.5 text-[15px] text-[rgba(247,244,239,0.72)] transition-colors hover:text-[#F7F4EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A] rounded-sm";

/*
 * Each run repeats the list, because the loop is only seamless while ONE run is at
 * least as wide as the viewport — the two runs are translated by exactly -50%, so a
 * short run leaves a visible gap crossing the screen. Six short words measured 1464px,
 * which held at 1440 and broke on anything wider. Doubling clears 2900px, so the
 * ribbon stays continuous on large displays without hardcoding a breakpoint.
 */
const MARQUEE_REPEATS = 2;

function MarqueeRun() {
  return (
    <>
      {Array.from({ length: MARQUEE_REPEATS }).flatMap((_, pass) =>
        MARQUEE_ITEMS.map((item) => (
          <span
            key={`${pass}-${item}`}
            className="bio-marquee-item flex flex-none items-center gap-8 whitespace-nowrap pr-8 text-[22px] font-bold tracking-[-0.02em] text-[#F7F4EF] sm:text-[28px] lg:text-[34px]"
          >
            {item}
          </span>
        )),
      )}
    </>
  );
}

export default function Footer() {
  const { market } = useMarket();
  const marketHref = useMarketHref();
  const marketConfig = getMarketConfigByMarket(market);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const addressLine = marketConfig.address
    ? [
        marketConfig.address.line1,
        marketConfig.address.line2,
        marketConfig.address.city,
        marketConfig.address.postcode,
        marketConfig.address.country,
      ].filter(Boolean).join(", ")
    : "Regional address details will be published when ordering opens.";

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || typeof window === "undefined") return;

    const subject = encodeURIComponent("Footer newsletter subscription request");
    const body = encodeURIComponent(`Please add this email to the BioAro Drugs newsletter list:\n\n${email}`);
    window.location.href = `mailto:${marketConfig.supportEmail}?subject=${subject}&body=${body}`;
    // Previously the field was never cleared and nothing acknowledged the submit,
    // so on a machine with no mail handler the form appeared simply not to work.
    setNewsletterEmail("");
    setSubscribed(true);
  }

  return (
    <footer className="text-[#F7F4EF]">
      {/* Warm charcoal rather than a saturated colour block: the page is soft ivory
          throughout and the closing photo band above already ends dark, so this
          continues that ending instead of interrupting it with a promotional slab.
          Terracotta survives only as a small accent on the submit pill and hovers.
          The three bands sit a few points apart so the seams read as intentional. */}
      <div className="bg-[linear-gradient(180deg,#211D19_0%,#1A1613_100%)]">
        <div className="container-bio py-16 sm:py-20">
          <div className="grid gap-12 xl:grid-cols-[1.55fr_auto_0.8fr] xl:gap-16">
            {/* Four sections, so four columns at lg. A 3-col grid wrapped Company
                onto its own row and left a hole. */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {FOOTER_SECTIONS.map((section) => (
                <nav key={section.title} aria-label={section.title}>
                  <h2 className="text-[15px] font-bold tracking-[-0.01em] text-[#F7F4EF]">{section.title}</h2>
                  <ul className="mt-4 space-y-0.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link to={marketHref(link.href)} className={LINK_CLASS}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>

            <div aria-hidden="true" className="hidden w-px bg-[rgba(247,244,239,0.14)] xl:block" />

            <div>
              <h2 className="text-balance text-[30px] font-black leading-[1.02] tracking-[-0.035em] text-[#F7F4EF] sm:text-[36px]">
                Stay in the loop
              </h2>

              <form onSubmit={handleNewsletterSubmit} className="mt-6">
                <label htmlFor="footer-email" className="mb-2 block text-[13px] font-medium text-[rgba(247,244,239,0.68)]">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.target.value);
                      if (subscribed) setSubscribed(false);
                    }}
                    placeholder="you@example.com"
                    className="h-14 w-full rounded-full border border-[rgba(247,244,239,0.22)] bg-[rgba(247,244,239,0.06)] pl-5 pr-16 text-[15px] text-[#F7F4EF] placeholder:text-[rgba(247,244,239,0.45)] transition-colors focus:border-[rgba(247,244,239,0.55)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ember text-[#F7F4EF] transition-transform duration-200 hover:bg-ember-600 active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1462A] motion-reduce:active:scale-100"
                  >
                    <ArrowRight size={17} strokeWidth={2.4} />
                  </button>
                </div>
              </form>

              <p className="mt-4 flex items-start gap-2 text-[14px] leading-[1.6] text-[rgba(247,244,239,0.68)]" aria-live="polite">
                {subscribed ? (
                  <>
                    <Check size={16} strokeWidth={2.6} className="mt-0.5 shrink-0" />
                    <span>Thanks. Your email app should open with a request ready to send.</span>
                  </>
                ) : (
                  <span>Occasional notes on health, LONgevity+ and living well. No noise.</span>
                )}
              </p>

              <div className="mt-9 flex items-center gap-3">
                {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(247,244,239,0.20)] text-[#F7F4EF] transition-colors hover:border-ember hover:bg-ember hover:text-[#F7F4EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1462A]"
                  >
                    <Icon size={17} />
                  </a>
                ))}
                <a
                  href={`mailto:${marketConfig.supportEmail}`}
                  aria-label="Email support"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(247,244,239,0.20)] text-[#F7F4EF] transition-colors hover:border-ember hover:bg-ember hover:text-[#F7F4EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C1462A]"
                >
                  <Mail size={17} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee. Two identical runs translated by -50% give a seamless loop. */}
      <div className="bio-marquee-viewport overflow-hidden border-y border-[rgba(247,244,239,0.10)] bg-[#262019] py-5">
        <div className="bio-marquee" style={{ ["--marquee-duration" as string]: "46s" }}>
          <div className="flex flex-none items-center">
            <MarqueeRun />
          </div>
          <div aria-hidden="true" className="flex flex-none items-center">
            <MarqueeRun />
          </div>
        </div>
      </div>

      <div className="bg-[#1A1613]">
        <div className="container-bio py-8">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link
                to={marketHref(ROUTES.home)}
                className="flex items-center gap-2.5 rounded-full text-[#F7F4EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A]"
              >
                <img src={bioAroMark} alt="" aria-hidden="true" className="h-[22px] w-[22px] object-contain" />
                <span className="text-[15px] font-bold tracking-[-0.02em]">BioAro Drugs</span>
              </Link>
              <p className="text-[13px] text-[rgba(247,244,239,0.62)]">
                &copy; {new Date().getFullYear()} BioAro Drugs Inc. All rights reserved.
              </p>
            </div>

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {[
                  { label: "Shipping", href: ROUTES.shipping },
                  { label: "Returns", href: ROUTES.returns },
                  { label: "Disclaimer", href: ROUTES.disclaimer },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={marketHref(link.href)}
                      className="rounded-sm text-[13px] text-[rgba(247,244,239,0.62)] transition-colors hover:text-[#F7F4EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C1462A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <RegionSelector />
            </div>
          </div>

          <p className="mt-6 flex items-start gap-2 text-[12.5px] leading-[1.6] text-[rgba(247,244,239,0.52)]">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span>{addressLine}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
