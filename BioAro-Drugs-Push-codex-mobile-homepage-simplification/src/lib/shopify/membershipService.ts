import type { CountryCode, CurrencyCode } from "../market/types";
import { isShopifyConfigured, shopifyFetch } from "./client";

const MEMBERSHIP_HANDLE = import.meta.env.VITE_SHOPIFY_MEMBERSHIP_HANDLE;
const CHECKOUT_API_ENABLED = import.meta.env.VITE_MEMBERSHIP_CHECKOUT_API_ENABLED === "true";

export interface MembershipOffer {
  productId: string;
  variantId: string;
  sellingPlanId: string;
  title: string;
  price: { amount: number; currencyCode: CurrencyCode };
  interval: string;
}

interface ShopifyMoney {
  amount: string;
  currencyCode: CurrencyCode;
}

interface ShopifyMembershipProduct {
  id: string;
  title: string;
  variants: { nodes: Array<{ id: string; price: ShopifyMoney }> };
  sellingPlanGroups: {
    nodes: Array<{
      sellingPlans: {
        nodes: Array<{
          id: string;
          name: string;
          priceAdjustments: Array<{
            adjustmentValue:
              | { __typename: "SellingPlanFixedPriceAdjustment"; price: ShopifyMoney }
              | { __typename: "SellingPlanPercentagePriceAdjustment"; adjustmentPercentage: number }
              | { __typename: "SellingPlanFixedAmountPriceAdjustment"; adjustmentAmount: ShopifyMoney };
          }>;
          billingPolicy?: { interval: string } | null;
        }>;
      };
    }>;
  };
}

interface MembershipQueryData {
  product: ShopifyMembershipProduct | null;
}

function configuredHandle() {
  return typeof MEMBERSHIP_HANDLE === "string" && MEMBERSHIP_HANDLE.trim().length > 0
    ? MEMBERSHIP_HANDLE.trim()
    : null;
}

/**
 * Reads the membership offer from Shopify only. There is intentionally no local
 * currency conversion or fallback offer: a paid CTA must be backed by a real
 * variant and selling plan.
 */
export async function loadMembershipOffer(country: CountryCode): Promise<MembershipOffer | null> {
  const handle = configuredHandle();
  if (!handle || !isShopifyConfigured()) return null;

  const data = await shopifyFetch<MembershipQueryData>(
    `
      query MembershipOffer($handle: String!, $country: CountryCode!) @inContext(country: $country) {
        product(handle: $handle) {
          id
          title
          variants(first: 1) {
            nodes {
              id
              price { amount currencyCode }
            }
          }
          sellingPlanGroups(first: 10) {
            nodes {
              sellingPlans(first: 10) {
                nodes {
                  id
                  name
                  priceAdjustments {
                    adjustmentValue {
                      __typename
                      ... on SellingPlanFixedPriceAdjustment {
                        price { amount currencyCode }
                      }
                      ... on SellingPlanPercentagePriceAdjustment {
                        adjustmentPercentage
                      }
                      ... on SellingPlanFixedAmountPriceAdjustment {
                        adjustmentAmount { amount currencyCode }
                      }
                    }
                  }
                  billingPolicy {
                    ... on SellingPlanRecurringBillingPolicy { interval }
                  }
                }
              }
            }
          }
        }
      }
    `,
    { handle, country },
  );

  const product = data.product;
  const variant = product?.variants.nodes[0];
  const sellingPlan = product?.sellingPlanGroups.nodes[0]?.sellingPlans.nodes[0];
  if (!product || !variant || !sellingPlan) return null;

  const adjustment = sellingPlan.priceAdjustments[0]?.adjustmentValue;
  let amount = Number(variant.price.amount);
  let currencyCode = variant.price.currencyCode;

  if (adjustment?.__typename === "SellingPlanFixedPriceAdjustment") {
    amount = Number(adjustment.price.amount);
    currencyCode = adjustment.price.currencyCode;
  } else if (adjustment?.__typename === "SellingPlanFixedAmountPriceAdjustment") {
    amount = Math.max(0, amount - Number(adjustment.adjustmentAmount.amount));
    currencyCode = adjustment.adjustmentAmount.currencyCode;
  } else if (adjustment?.__typename === "SellingPlanPercentagePriceAdjustment") {
    amount *= 1 - adjustment.adjustmentPercentage / 100;
  }

  return {
    productId: product.id,
    variantId: variant.id,
    sellingPlanId: sellingPlan.id,
    title: product.title,
    price: {
      amount,
      currencyCode,
    },
    interval: sellingPlan.billingPolicy?.interval ?? "month",
  };
}

export function isMembershipCheckoutConfigured() {
  return CHECKOUT_API_ENABLED;
}

/** Checkout creation belongs behind a first-party endpoint so identity can be bound server-side. */
export async function startMembershipCheckout(offer: MembershipOffer, country: CountryCode) {
  if (!isMembershipCheckoutConfigured()) return null;

  const response = await fetch("/api/membership/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country,
      productId: offer.productId,
      variantId: offer.variantId,
      sellingPlanId: offer.sellingPlanId,
    }),
  });

  if (!response.ok) throw new Error("Membership checkout is unavailable.");
  const payload = (await response.json()) as { checkoutUrl?: string };
  return payload.checkoutUrl ?? null;
}

export const membershipService = {
  loadMembershipOffer,
  isMembershipCheckoutConfigured,
  startMembershipCheckout,
};
