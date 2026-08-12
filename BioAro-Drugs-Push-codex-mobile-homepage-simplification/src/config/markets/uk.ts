import type { MarketConfig } from "./types";

export const UK_MARKET: MarketConfig = {
  code: "uk",
  countryCode: "GB",
  name: "United Kingdom",
  shortLabel: "UK",
  locale: "en-GB",
  currency: "GBP",
  currencySymbol: "£",
  flag: "🇬🇧",
  companyName: "BioAro Drugs",
  supportEmail: "support@bioarodrugs.com",
  address: {
    line1: "Vicarage House",
    line2: "58-60 Kensington Church Street",
    city: "London",
    postcode: "W8 4DB",
    country: "United Kingdom",
  },
  checkoutEnabled: false,
  checkoutMessage: "Online checkout is opening soon.",
  shippingMessage: "UK delivery details will be confirmed at launch.",
  taxMessage: "UK taxes and delivery details will be confirmed when ordering becomes available.",
  legalDisclaimer:
    "BioAro products are presented as food supplements. Do not exceed the recommended daily dose and do not use supplements as a substitute for a varied, balanced diet and healthy lifestyle.",
  shippingPolicyPath: "/shipping-policy",
  returnsPolicyPath: "/returns-refunds",
  privacyPolicyPath: "/privacy-policy",
  availableProducts: ["longevity-plus", "cellomega-plus", "creagen-brain-boost", "creagen-femme-energy", "creagen-raw-power", "creagen-pro-power", "glutara"],
  comingSoonProducts: [],
  experienceRegion: "UK",
};
