export const ROUTES = {
  home: "/",
  shop: "/shop",
  quiz: "/quiz",
  ai: "/ai",
  membership: "/membership",
  membershipSuccess: "/membership/success",
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
  accountProtocol: "/account/protocol",
  accountOrders: "/account/orders",
  accountVault: "/account/health-vault",
  accountCare: "/account/care",
  accountMembership: "/account/membership",
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
  { label: "AI & Protocols", href: ROUTES.ai },
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
      { label: "Protocol Builder", href: ROUTES.ai },
      { label: "BioAro AI Membership", href: ROUTES.membership },
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

/*
 * The member dashboard's own navigation.
 *
 * Kept beside PRIMARY_NAV for the same reason that list exists: the header and the
 * footer used to disagree about the primary nav because each held its own copy. These
 * are the routes the dashboard rail renders, in order, and `tests/routes.test.ts`
 * asserts every one of them resolves and that none of them is public.
 */
export const MEMBER_NAV: NavItem[] = [
  { label: "Overview", href: ROUTES.account },
  { label: "Protocol", href: ROUTES.accountProtocol },
  { label: "Orders", href: ROUTES.accountOrders },
  { label: "Health vault", href: ROUTES.accountVault },
  { label: "Care", href: ROUTES.accountCare },
  { label: "Membership", href: ROUTES.accountMembership },
];

/*
 * Everything behind the sign-in gate.
 *
 * `/account` itself stays in PUBLIC_ROUTE_PATHS because the footer links to it and
 * that list is what the footer test validates — it is a "route the footer may name",
 * not a statement about authentication. The children are not in it, and a test keeps
 * it that way.
 */
export const MEMBER_ROUTE_PATHS: RoutePath[] = [
  ROUTES.account,
  ROUTES.accountProtocol,
  ROUTES.accountOrders,
  ROUTES.accountVault,
  ROUTES.accountCare,
  ROUTES.accountMembership,
];

export const PUBLIC_ROUTE_PATHS: RoutePath[] = [
  ROUTES.home,
  ROUTES.shop,
  ROUTES.quiz,
  ROUTES.ai,
  ROUTES.membership,
  ROUTES.membershipSuccess,
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
