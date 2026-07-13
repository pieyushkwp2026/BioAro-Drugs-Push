import type { MarketConfig } from "./types";

export const AE_MARKET: MarketConfig = {
  code: "ae",
  countryCode: "AE",
  name: "United Arab Emirates",
  shortLabel: "UAE",
  locale: "en-AE",
  currency: "AED",
  currencySymbol: "AED",
  flag: "🇦🇪",
  companyName: "BioAro Drugs",
  supportEmail: "support@bioarodrugs.com",
  address: null,
  checkoutEnabled: false,
  checkoutMessage: "Online ordering for the UAE is opening soon.",
  shippingMessage: "UAE delivery details will be confirmed at launch.",
  taxMessage: "UAE taxes and delivery details will be confirmed when ordering becomes available.",
  legalDisclaimer:
    "PLACEHOLDER — insert approved UAE regulatory and supplement disclaimer copy before production launch.",
  shippingPolicyPath: "/shipping-policy",
  returnsPolicyPath: "/returns-refunds",
  privacyPolicyPath: "/privacy-policy",
  availableProducts: [],
  comingSoonProducts: ["longevity-plus", "cellomega-plus", "creagen-brain-boost", "creagen-femme-energy", "creagen-raw-power", "creagen-pro-power", "glutara"],
  experienceRegion: "NA",
};
