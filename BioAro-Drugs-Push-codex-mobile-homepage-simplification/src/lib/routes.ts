export const ROUTES = {
  home: "/",
  shop: "/shop",
  quiz: "/quiz",
  science: "/science",
  journal: "/journal",
  about: "/about",
  product: "/products/:handle",
  support: "/contact-support",
  disclaimer: "/supplement-disclaimer",
  shipping: "/shipping-policy",
  returns: "/returns-refunds",
  living: "/living-2-0",
  quality: "/quality-testing",
  faq: "/faq",
  protocols: "/protocols",
  partners: "/partners",
  account: "/account",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export interface NavItem {
  label: string;
  href: RoutePath;
}

export interface FooterLink {
  label: string;
  href: RoutePath;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

/*
 * Kept in step with Header.tsx's own NAV. These used to disagree — this list carried
 * a "Quiz" item while the header's comment said the quiz was deliberately excluded —
 * so the site had two sources of truth for its primary navigation.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: "BioAro Drugs BI", href: ROUTES.quiz },
  { label: "Shop", href: ROUTES.shop },
  { label: "Protocols", href: ROUTES.protocols },
  { label: "Science", href: ROUTES.science },
  { label: "About", href: ROUTES.about },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: ROUTES.shop },
      { label: "Protocols", href: ROUTES.protocols },
      { label: "Protocol Builder", href: ROUTES.quiz },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Science", href: ROUTES.science },
      { label: "Journal", href: ROUTES.journal },
      { label: "Living 2.0", href: ROUTES.living },
      { label: "Quality & Testing", href: ROUTES.quality },
      { label: "FAQ", href: ROUTES.faq },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Support", href: ROUTES.support },
      { label: "Shipping Policy", href: ROUTES.shipping },
      { label: "Returns & Refunds", href: ROUTES.returns },
      { label: "Supplement Disclaimer", href: ROUTES.disclaimer },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About BioAro Drugs", href: ROUTES.about },
      { label: "Partners", href: ROUTES.partners },
      { label: "My Account", href: ROUTES.account },
    ],
  },
];

export const PUBLIC_ROUTE_PATHS: RoutePath[] = [
  ROUTES.home,
  ROUTES.shop,
  ROUTES.quiz,
  ROUTES.science,
  ROUTES.journal,
  ROUTES.about,
  ROUTES.product,
  ROUTES.support,
  ROUTES.disclaimer,
  ROUTES.shipping,
  ROUTES.returns,
  ROUTES.living,
  ROUTES.quality,
  ROUTES.faq,
  ROUTES.protocols,
  ROUTES.partners,
  ROUTES.account,
];
