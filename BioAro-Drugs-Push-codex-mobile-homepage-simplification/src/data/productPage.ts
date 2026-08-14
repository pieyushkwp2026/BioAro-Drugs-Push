/*
 * PDP labels and section copy.
 *
 * Every string a product supplies about itself comes from Shopify metafields. What
 * lives here is only the page's own furniture — section headings, column labels,
 * button text — so the layout can be relabelled without touching components.
 *
 * Naming rule applies as everywhere: never a bare "BioAro".
 */

export const PDP = {
  nav: {
    formulation: "Formulation",
    howToUse: "How to use",
    warnings: "Warnings",
    faq: "Questions",
  },

  gallery: {
    thumbLabel: (index: number, total: number) => `Show image ${index} of ${total}`,
    open: "Open full size",
    close: "Close",
    previous: "Previous image",
    next: "Next image",
  },

  rail: {
    quantity: "Quantity",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    addToCart: "Add to cart",
    adding: "Adding…",
    added: "Added to cart",
    /* Replaces the developer-facing string the old page showed shoppers, which named
       Shopify variants and the selected market. */
    unavailable: "Not available in your region yet",
    unavailableBody: "This formula is not on sale here at the moment. Contact us and we will let you know when it is.",
    contact: "Contact support",
    verified: "Verified",
    howToUse: "How to use",
    related: "Related",
    reading: "Reading",
  },

  formulation: {
    heading: "Formulation",
    keyIngredients: "Key ingredients",
    servingSize: "Serving size",
    servingsPerContainer: "Servings per container",
    tableIngredient: "Ingredient",
    tableAmount: "Amount",
    otherIngredients: "Other ingredients",
    showAll: "Show full formulation",
    showLess: "Show less",
  },

  warnings: {
    heading: "Warnings",
    showAll: "Show all warnings",
    showLess: "Show less",
  },

  faq: {
    heading: "Frequent questions",
  },

  related: {
    heading: "Goes well with",
  },
} as const;
