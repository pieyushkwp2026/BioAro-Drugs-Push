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

  /* ---------------------------------------------------------------- new sections
     Every string here frames content that ALREADY EXISTS on the product. Nothing
     below asserts a fact the catalogue does not already carry — the headings give
     approved content a home it did not have, they do not add claims. */
  why: {
    heading: "Why these ingredients?",
    body: "Each active earns its place. This is the reason every one of them is in the formula, at the amount it ships with.",
  },
  composition: {
    heading: "The formula, to scale",
    /* This caption is not decoration. Bars drawn from mixed units imply a hierarchy
       the formula does not have, and this is the line that stops them. */
    caption:
      "Bars show mass per serving, on a compressed scale so smaller amounts stay visible. Mass is not potency — micronutrients work at far smaller doses than the actives above them.",
  },
  alsoInside: {
    heading: "What else is in the capsule",
    /* NOT "what we leave out". These are excipients — binders, flow agents, the shell
       — things that ARE in it. Framing them as omissions would invert the meaning. */
    body: "The non-active ingredients that hold the formula together.",
  },
  routine: {
    heading: "Where it sits in your day",
    body: "When BioAro Drugs AI places this in a protocol.",
  },
  audience: {
    heading: "Who is it for?",
    /* Composed from the product's own approved feature set rather than written per
       product, so it can never drift from what the formula actually claims. */
    lead: "Built for people focused on",
    format: (servings: string) => `Comes as ${servings.toLowerCase()}.`,
  },
  notFor: {
    heading: "Who should not take this",
    /* The warnings were always here; they were headed "Warnings", which reads as
       small print. The first one IS the answer to this question, so it gets asked. */
  },
  quality: {
    heading: "Quality",
    body: "What is verified about this product today.",
    /* NOT AUTHORED HERE. Rendered from the product's own quality attributes, so the
       page can only state what the catalogue actually holds.

       Batch testing, certificates of analysis, lot numbers, manufacturing standard
       and sourcing are records, not copy. They are not invented to fill this section:
       the block below renders only when `qualityDocs` metafields arrive, and stays
       absent until then. A fabricated COA reference on a supplement page is a
       compliance claim nobody could stand behind. */
    pending:
      "Batch-level documentation — certificates of analysis, lot numbers and manufacturing detail — is not published on this page yet.",
  },
  evidence: {
    heading: "Evidence",
    /* Renders ONLY when a product carries references. No citation is generated: an
       invented DOI or PubMed ID beside an ingredient dose is exactly the kind of
       fabricated evidence this codebase refuses everywhere else. */
    body: "Published references for the actives in this formula.",
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
