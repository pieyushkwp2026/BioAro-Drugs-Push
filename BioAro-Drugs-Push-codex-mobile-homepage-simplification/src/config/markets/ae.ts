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
  address: {
    line1: "AB Center - 3rd floor office 302",
    line2: "Sheikh Zayed Rd - Al Barsha - Al Barsha 1",
    city: "Dubai",
    country: "United Arab Emirates",
  },
  checkoutEnabled: true,
  checkoutMessage: "Checkout is available through Shopify when products are active in the UAE market.",
  shippingMessage: "UAE delivery options, rates, and timelines are calculated at checkout.",
  taxMessage: "Applicable UAE taxes, duties, and delivery charges are calculated at checkout where required.",
  legalDisclaimer: "Product guidance is provided for general wellness information and may vary by market.",
  shippingPolicyPath: "/shipping-policy",
  returnsPolicyPath: "/returns-refunds",
  privacyPolicyPath: "/privacy-policy",
  /*
   * Glutara is not sold in the UAE and was removed on 2026-08-17.
   *
   * It was listed here and nowhere else: Shopify does not return it for AE, so the app
   * was appending the local record instead (`productService.ts` adds every local product
   * Shopify omitted) and marking it available purely because the handle sat in this
   * array. With checkout open in this market, that advertised a product the store cannot
   * sell, at no price — its `priceByCountry` has no AE entry.
   *
   * The six that remain are all genuinely published to AE with AED prices from Shopify,
   * so their absent local AE prices are irrelevant — Shopify's price wins.
   */
  availableProducts: ["longevity-plus", "cellomega-plus", "creagen-brain-boost", "creagen-smart-start", "creagen-femme-energy", "creagen-raw-power", "creagen-pro-power"],
  comingSoonProducts: [],
  experienceRegion: "AE",
};
