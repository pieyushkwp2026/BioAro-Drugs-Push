import { BookOpen, Headphones, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";

const SHOP_LINKS = [
  { label: "All Products", href: ROUTES.shop },
  { label: "Longevity", href: "/shop?category=Longevity" },
  { label: "Focus", href: "/shop?category=Focus" },
  { label: "Recovery", href: "/shop?category=Recovery" },
  { label: "Sleep", href: ROUTES.protocols },
];

const LEARN_LINKS = [
  { label: "Science", href: ROUTES.science },
  { label: "Journal", href: ROUTES.journal },
  { label: "Wellness Quiz", href: ROUTES.quiz },
  { label: "About", href: ROUTES.about },
];

const SUPPORT_LINKS = [
  { label: "Contact Support", href: ROUTES.support },
  { label: "Shipping Policy", href: ROUTES.shipping },
  { label: "Returns & Refunds", href: ROUTES.returns },
  { label: "Supplement Disclaimer", href: ROUTES.disclaimer },
];

const COMPANY_LINKS = [
  { label: "About BioAro", href: ROUTES.about },
  { label: "Partners", href: ROUTES.partners },
];

const QUICK_LINKS = [
  { Icon: BookOpen, label: "Journal", href: ROUTES.journal },
  { Icon: Headphones, label: "Support", href: ROUTES.support },
  { Icon: Users, label: "Partners", href: ROUTES.partners },
];

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <p className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#8a8678]">{title}</p>
      <ul className="mt-[18px] space-y-3 text-[14.5px] text-[#131012]">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.href} className="transition-colors hover:text-forest-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#f1eee6] pt-16">
      <div className="container-bio">
        <div className="grid gap-12 pb-12 md:grid-cols-[1.6fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-[280px]">
            <Link to="/" className="flex items-center gap-3 text-ink">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              <span className="text-[19px] font-semibold tracking-[0.01em]">BioAro Drugs</span>
            </Link>
            <p className="mt-4 text-[14px] leading-6 text-[#131012]">
              Premium bioactive formulas engineered for people who expect more from health.
            </p>
            <div className="mt-6 flex gap-2.5">
              {QUICK_LINKS.map(({ Icon, label, href }) => (
                <Link
                  key={label}
                  to={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd8c9] text-ink transition-colors hover:bg-white"
                >
                  <Icon size={15} />
                </Link>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Learn" links={LEARN_LINKS} />
          <FooterColumn title="Support" links={SUPPORT_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="flex flex-col gap-3 border-t border-[#e1ddce] py-6 text-[13px] text-[#8a8678] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BioAro Drugs Inc.</p>
          <Link to={ROUTES.support} className="transition-colors hover:text-ink">
            support@bioarodrugs.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
