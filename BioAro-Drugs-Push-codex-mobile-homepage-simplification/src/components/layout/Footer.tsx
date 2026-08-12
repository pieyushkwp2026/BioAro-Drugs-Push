import { type FormEvent, useState } from "react";
import { ArrowRight, BookOpen, FlaskConical, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import bioAroMark from "../../assets/logo/bioaro-mark.png";
import { FlagCA } from "./Flags";
import RegionSelector from "./RegionSelector";
import { ROUTES } from "../../lib/routes";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { getMarketConfigByMarket } from "../../config/markets";
import { stripMarketPrefix } from "../../lib/marketRouting";

const SHOP_LINKS = [
  { label: "All Products", href: ROUTES.shop },
  { label: "Longevity", href: "/shop?category=Longevity" },
  { label: "Focus", href: "/shop?category=Focus" },
  { label: "Recovery", href: "/shop?category=Recovery" },
  { label: "Sleep", href: ROUTES.protocols },
  { label: "Build My Stack", href: ROUTES.quiz },
];

const SCIENCE_LINKS = [
  { label: "Our Standards", href: ROUTES.quality },
  { label: "Ingredient Library", href: ROUTES.science },
  { label: "Testing & Quality", href: ROUTES.quality },
  { label: "Journal", href: ROUTES.journal },
];

const SUPPORT_LINKS = [
  { label: "Contact Support", href: ROUTES.support },
  { label: "Shipping Policy", href: ROUTES.shipping },
  { label: "Returns & Refunds", href: ROUTES.returns },
  { label: "Supplement Disclaimer", href: ROUTES.disclaimer },
  { label: "FAQs", href: ROUTES.faq },
];

const COMPANY_LINKS = [
  { label: "About BioAro", href: ROUTES.about },
  { label: "Partners", href: ROUTES.partners },
  { label: "Contact", href: ROUTES.support },
];

const TRUST_PILLS = [
  { Icon: ShieldCheck, label: "cGMP Certified" },
  { Icon: FlaskConical, label: "Third-Party Tested" },
  { Icon: FlagCA, label: "Formulated in Canada" },
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
  { Icon: BookOpen, label: "Journal", href: ROUTES.journal },
  { Icon: Users, label: "Partners", href: ROUTES.partners },
];

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  const marketHref = useMarketHref();

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600">{title}</p>
      <ul className="mt-3 space-y-0.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={marketHref(link.href)}
              className="block py-1.5 text-[14px] text-[#2a2723] transition-colors hover:text-forest-600"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { market } = useMarket();
  const marketHref = useMarketHref();
  const { pathname } = useLocation();
  const marketConfig = getMarketConfigByMarket(market);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const isRegionalHomepage = stripMarketPrefix(pathname) === "/";
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
  }

  if (isRegionalHomepage) {
    return (
      <footer className="bg-[#f2eadf] pb-8 pt-6">
        <div className="container-bio max-w-[1380px]">
          <div className="grid gap-10 border-t border-[#ddd2c3] pt-7 lg:grid-cols-[0.9fr_1.3fr_0.8fr] lg:gap-12">
            <div className="max-w-[280px]">
              <Link to={marketHref(ROUTES.home)} className="flex items-center gap-3 text-ink">
                <img src={bioAroMark} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
                <span className="text-[20px] font-medium tracking-[0.01em]">BioAro Drugs</span>
              </Link>
              <p className="mt-4 text-[13px] leading-6 text-[#5a524b]">
                Science-backed wellness designed for real life.
              </p>
              <div className="mt-5 max-w-[210px]">
                <RegionSelector />
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <FooterColumn title="Explore" links={[
                { label: "Science", href: ROUTES.science },
                { label: "Use Cases", href: ROUTES.home },
                { label: "Our Approach", href: ROUTES.science },
                { label: "Journal", href: ROUTES.journal },
                { label: "About", href: ROUTES.about },
              ]} />
              <FooterColumn title="Support" links={[
                { label: "FAQs", href: ROUTES.faq },
                { label: "Contact Us", href: ROUTES.support },
                { label: "Shipping & Returns", href: ROUTES.returns },
                { label: "Privacy Policy", href: ROUTES.shipping },
                { label: "Terms of Service", href: ROUTES.disclaimer },
              ]} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-600">Stay in the know</p>
                <p className="mt-3 text-[13px] leading-6 text-[#5a524b]">
                  Thoughtful insights on health, longevity, and living well.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="mt-4 flex items-center gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="h-11 min-w-0 flex-1 rounded-full border border-[#d7ccbd] bg-[#fbf8f3] px-4 text-[13px] text-[#534b44] outline-none placeholder:text-[#8f867d]"
                    aria-label="Email address"
                    required
                  />
                  <button
                    type="submit"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#12100f] text-white transition-colors hover:bg-[#2c4739]"
                    aria-label="Subscribe"
                  >
                    <ArrowRight size={15} />
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-4 text-[12px] leading-6 text-[#6d645c]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-600">Responsible Food Business</p>
                <p className="mt-2 font-medium text-[#322c28]">BioAro Drugs</p>
                <p>{addressLine}</p>
              </div>
              <a href={`mailto:${marketConfig.supportEmail}`} className="inline-flex items-center gap-2 text-[#4f4942] transition-colors hover:text-forest-600">
                <Mail size={14} />
                <span>{marketConfig.supportEmail}</span>
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[#ddd2c3] pt-5 text-[12px] text-[#8b837b] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} BioAro Drugs Inc. All rights reserved.</p>
            <div className="flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                href.startsWith("http") ? (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8cfbf] bg-[#f8f4ed] text-[#214a35] transition-colors hover:bg-white hover:text-forest-600"
                  >
                    <Icon size={15} />
                  </a>
                ) : (
                  <Link
                    key={label}
                    to={marketHref(href)}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8cfbf] bg-[#f8f4ed] text-[#214a35] transition-colors hover:bg-white hover:text-forest-600"
                  >
                    <Icon size={15} />
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[#ddd4c5] bg-[#eee7db] pt-10 sm:pt-12">
      <div className="container-bio">
        <div className="grid gap-10 pb-8 lg:grid-cols-[minmax(280px,1.05fr)_minmax(0,1.95fr)] lg:gap-12">
          <div className="max-w-[360px]">
            <div>
              <Link to={marketHref(ROUTES.home)} className="flex items-center gap-3 text-ink">
                <img src={bioAroMark} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
                <span className="text-[20px] font-semibold tracking-[0.01em]">BioAro Drugs</span>
              </Link>

              <p className="mt-4 max-w-[320px] text-[14px] leading-6 text-[#2d2a26]">
                Premium bioactive formulas designed for better daily energy, recovery, focus, sleep, and long-term wellness.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {TRUST_PILLS.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[#dfd5c4] bg-white/45 px-3 py-1.5 text-[11.5px] font-medium text-[#214a35]"
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-[13px] leading-6 text-[#4c443d]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf2ea] text-forest-600">
                  <MapPin size={15} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-600">Responsible Food Business</p>
                  <p className="font-medium text-ink">BioAro Drugs</p>
                  <p>{addressLine}</p>
                </div>
              </div>

              <a href={`mailto:${marketConfig.supportEmail}`} className="flex items-center gap-3 transition-colors hover:text-forest-600">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#dfd5c4] bg-white/55 text-forest-600">
                  <Mail size={14} />
                </span>
                <span>{marketConfig.supportEmail}</span>
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-12">
            <FooterColumn title="Shop" links={SHOP_LINKS} />
            <FooterColumn title="Science" links={SCIENCE_LINKS} />
            <FooterColumn title="Support" links={SUPPORT_LINKS} />
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#ddd4c5] py-5 text-[#7d766c] lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <p className="text-[12px]">© {new Date().getFullYear()} BioAro Drugs Inc.</p>

          <div className="flex flex-wrap gap-2.5 lg:justify-end">
            {SOCIAL_LINKS.map(({ Icon, label, href }) => (
              href.startsWith("mailto:") || href.startsWith("http") ? (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cfbf] bg-[#f8f4ed] text-[#214a35] transition-colors hover:bg-white hover:text-forest-600"
                >
                  <Icon size={16} />
                </a>
              ) : (
                <Link
                  key={label}
                  to={marketHref(href)}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cfbf] bg-[#f8f4ed] text-[#214a35] transition-colors hover:bg-white hover:text-forest-600"
                >
                  <Icon size={16} />
                </Link>
              )
            ))}
            <a
              href={`mailto:${marketConfig.supportEmail}`}
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cfbf] bg-[#f8f4ed] text-[#214a35] transition-colors hover:bg-white hover:text-forest-600"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
