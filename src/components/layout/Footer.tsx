import { BookOpen, FlaskConical, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import bioAroMark from "../../assets/logo/bioaro-mark.png";
import { FlagCA } from "./Flags";
import { ROUTES } from "../../lib/routes";
import { useMarket } from "../../hooks/useMarket";
import { useMarketHref } from "../../hooks/useMarketHref";
import { getMarketConfigByMarket } from "../../config/markets";

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

const SOCIAL_LINKS = [
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
  const marketConfig = getMarketConfigByMarket(market);
  const addressLine = marketConfig.address
    ? `${marketConfig.address.line1}, ${marketConfig.address.line2}, ${marketConfig.address.city}, ${marketConfig.address.postcode}, ${marketConfig.address.country}`
    : "Regional business details pending approval.";

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
