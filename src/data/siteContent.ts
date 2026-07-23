import { ROUTES } from "../lib/routes";
import type {
  FAQCategory,
  PageCta,
  PageHeroContent,
  PageSectionContent,
  PolicyPageContent,
  ProtocolContent,
  QualityDocument,
  SupportContactMethod,
} from "../lib/content/types";
import type { ExperienceRegion } from "../lib/market/types";

interface RegionalPolicyContent {
  shared: PolicyPageContent;
  variants: Record<ExperienceRegion, PageSectionContent[]>;
}

export const SUPPORT_EMAILS: SupportContactMethod[] = [
  { label: "Support Email", value: "support@bioarodrugs.com", href: "mailto:support@bioarodrugs.com" },
  { label: "UK Enquiries", value: "uk@bioarodrugs.com", href: "mailto:uk@bioarodrugs.com" },
  { label: "Partnership / Wholesale", value: "partners@bioarodrugs.com", href: "mailto:partners@bioarodrugs.com" },
];

export const SUPPORT_PAGE_HERO: PageHeroContent = {
  eyebrow: "Support",
  title: "Questions before or after purchase? We're here to help.",
  description:
    "Whether you need product guidance, order support, or help choosing the right formula, our team is available to assist.",
  primaryCta: { label: "Email Support", href: "mailto:support@bioarodrugs.com" },
};

export const SUPPORT_TOPICS: string[] = [
  "Product questions",
  "Order updates",
  "Shipping issues",
  "Returns and refunds",
  "Wholesale and distributor enquiries",
];

export const SUPPORT_RESPONSE_TIMELINE = "We aim to respond to most enquiries within 1 to 2 business days.";

export const DISCLAIMER_CONTENT: RegionalPolicyContent = {
  shared: {
    hero: {
      eyebrow: "Policy",
      title: "Supplement Disclaimer",
      description: "Science-backed wellness products. Clear, responsible communication.",
    },
    sections: [
      {
        title: "Important Notice",
        paragraphs: [
          "The information provided on this website is for general educational and informational purposes only. It is not intended as medical advice, diagnosis, or treatment.",
          "Always speak with a qualified healthcare professional before starting any new supplement, especially if you are pregnant, breastfeeding, taking medication, managing a medical condition, or preparing for surgery.",
        ],
      },
      {
        title: "Product-Specific Guidance",
        paragraphs: [
          "Each product page includes product-specific directions for use, warnings, and ingredient details. Please read all product information carefully before use.",
        ],
      },
    ],
    cta: { label: "Contact Support", href: ROUTES.support },
  },
  variants: {
    NA: [
      {
        title: "United States & Canada",
        paragraphs: [
          "Statements made about BioAro Drugs products have not been evaluated by the Food and Drug Administration.",
          "BioAro Drugs products are not intended to diagnose, treat, cure, or prevent any disease.",
          "Any structure/function language on this site is intended to describe how certain ingredients may support normal health and wellness functions in the body.",
        ],
      },
    ],
    UK: [
      {
        title: "United Kingdom",
        paragraphs: [
          "BioAro Drugs products are presented as food supplements.",
          "Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
          "Do not exceed the stated recommended daily dose.",
          "Keep out of reach of children.",
          "Individual ingredient and product information is provided for general guidance only and should not be interpreted as a medicinal claim.",
        ],
      },
    ],
  },
};

export const SHIPPING_CONTENT: RegionalPolicyContent = {
  shared: {
    hero: {
      eyebrow: "Policy",
      title: "Shipping Policy",
      description: "Fast, transparent delivery for your daily routine.",
      note: "Shipping timelines and options may vary by market, product availability, and destination.",
    },
    sections: [
      {
        title: "Order Processing",
        paragraphs: [
          "Orders are typically processed within 1 to 2 business days unless otherwise stated on the product page.",
          "Orders placed on weekends or public holidays will begin processing on the next business day.",
          "You will receive an order confirmation after purchase and a shipping confirmation once your order has been dispatched.",
        ],
      },
      {
        title: "Tracking",
        paragraphs: [
          "Where available, tracking information will be provided once your order has shipped.",
          "If you do not receive a tracking email, please contact support and include your order number.",
        ],
      },
      {
        title: "Incorrect Address Information",
        paragraphs: [
          "Customers are responsible for ensuring shipping details are accurate at the time of purchase.",
          "If an order is delayed, returned, or lost due to incorrect address details, additional shipping charges may apply.",
        ],
      },
      {
        title: "Delivery Delays",
        paragraphs: [
          "While we aim to meet all stated delivery estimates, delays may occasionally occur due to courier issues, customs processing, weather, or periods of unusually high order volume.",
        ],
      },
      {
        title: "Lost or Damaged Orders",
        paragraphs: [
          "If your order arrives damaged, incomplete, or appears lost in transit, please contact support as soon as possible with your order number and relevant details.",
        ],
      },
    ],
    cta: { label: "Need Help With an Order?", href: ROUTES.support },
  },
  variants: {
    NA: [
      {
        title: "United States & Canada Shipping",
        paragraphs: [
          "Standard delivery timelines are shown at checkout.",
          "Shipping rates are calculated at checkout unless a free shipping threshold or promotion applies.",
          "Delivery times may vary depending on destination and carrier conditions.",
        ],
      },
    ],
    UK: [
      {
        title: "United Kingdom Shipping",
        paragraphs: [
          "Standard delivery timelines are shown at checkout.",
          "Shipping rates are calculated at checkout unless a free shipping threshold or promotion applies.",
          "Delivery timelines may vary during promotional periods, public holidays, or carrier delays.",
        ],
      },
    ],
  },
};

export const RETURNS_CONTENT: RegionalPolicyContent = {
  shared: {
    hero: {
      eyebrow: "Policy",
      title: "Returns & Refunds",
      description: "Support you can trust after purchase.",
      note: "If there is an issue with your order, our team will work with you to find a fair resolution in line with our returns policy.",
    },
    sections: [
      {
        title: "Return Eligibility",
        paragraphs: [
          "Return eligibility depends on the product condition, order type, and reason for return.",
          "As ingestible wellness products are safety-sensitive, opened or used products may not be eligible for return unless the item is faulty, damaged, or incorrect.",
        ],
      },
      {
        title: "Damaged, Incorrect, or Missing Items",
        paragraphs: [
          "If your order arrives damaged, incorrect, or incomplete, please contact us promptly with your order number, a brief explanation of the issue, and photos where relevant.",
          "We will review the issue and advise on replacement, refund, or next steps.",
        ],
      },
      {
        title: "Change of Mind",
        paragraphs: [
          "If you wish to request a return for an unopened product, please contact support before sending anything back. Approval is required before returns are accepted.",
          "Products must be unopened, unused, and in saleable condition unless otherwise agreed in writing.",
        ],
      },
      {
        title: "Refund Timing",
        paragraphs: [
          "Approved refunds are processed back to the original payment method. Processing times may vary depending on your bank or payment provider.",
        ],
      },
      {
        title: "Non-Returnable Items",
        paragraphs: [
          "Opened supplement products, used products, and promotional or final-sale items may not be eligible for return unless faulty or incorrect.",
        ],
      },
    ],
    cta: { label: "Start a Support Request", href: ROUTES.support },
  },
  variants: {
    NA: [],
    UK: [],
  },
};

export const LIVING_PAGE_HERO: PageHeroContent = {
  eyebrow: "Living 2.0",
  title: "Understand. Take Action. Build Better Health.",
  description:
    "BioAro is built around a simple idea: better health decisions start with better understanding.",
  primaryCta: { label: "Explore BioAro Drugs", href: ROUTES.shop },
  secondaryCta: { label: "Learn About Our Approach", href: ROUTES.science, variant: "secondary" },
};

export const LIVING_SECTIONS: PageSectionContent[] = [
  {
    title: "The Philosophy",
    paragraphs: [
      "Most wellness products are considered in isolation. Living 2.0 brings clearer information and practical routines together to make health feel more intentional over time.",
      "It begins with understanding your health more clearly, continues with targeted action through daily routines and formulations, and grows through consistency, review, and refinement.",
    ],
  },
  {
    title: "The Three-Part Framework",
    paragraphs: [
      "Understand: use testing, data, practitioner guidance, or personal health insight to build a clearer picture of what matters most.",
      "Take Action: choose targeted formulas, routines, and behaviour changes designed to support your goals in a practical, sustainable way.",
      "Build Better Health: stay consistent, review what's working, and improve your routine over time rather than chasing short-term fixes.",
    ],
  },
  {
    title: "Where BioAro Drugs Fits",
    paragraphs: [
      "BioAro Drugs provides formulations designed to support routines across longevity, focus, recovery, sleep, and daily resilience.",
      "Rather than acting as generic add-ons, they are intended to sit inside a more thoughtful health system.",
    ],
  },
  {
    title: "Where BioAro Labs Fits",
    paragraphs: [
      "BioAro Labs is the understanding layer. Over time, it will help connect product routines to a broader evidence-led approach, giving customers and partners a clearer path from insight to action.",
    ],
  },
  {
    title: "Why It Matters",
    paragraphs: [
      "The goal is not to overwhelm people with complexity. The goal is to make high-quality health support feel clearer, more personal, and easier to act on.",
    ],
  },
];

export const QUALITY_PAGE_HERO: PageHeroContent = {
  eyebrow: "Quality & Testing",
  title: "Proof matters.",
  description:
    "BioAro Drugs products are developed with a quality-first mindset. We believe trust should be earned through transparency, not just claimed in marketing language.",
  primaryCta: { label: "Request Quality Documentation", href: "mailto:partners@bioarodrugs.com" },
};

export const QUALITY_SECTIONS: PageSectionContent[] = [
  {
    title: "Our Quality Approach",
    paragraphs: ["Our quality standards focus on transparent ingredient selection, responsible formulation, manufacturing quality controls, third-party testing where applicable, and clear product guidance."],
  },
  {
    title: "What We Test For",
    paragraphs: ["Testing may include review of identity, purity, potency, contaminants, and batch consistency. Specific testing standards and report availability may vary by product and market."],
  },
  {
    title: "Important Note",
    paragraphs: ["Product information may be available as a clear summary, with more detailed documentation available on request for qualified partners, practitioners, or distributors."],
  },
];

export const QUALITY_DOCUMENTS: QualityDocument[] = [];

export const QUALITY_EMPTY_STATE = {
  title: "Quality documentation is coming soon.",
  description:
    "Product-specific quality information will be added here as it becomes available. Contact support if you have a question about a formula.",
};

export const FAQ_PAGE_HERO: PageHeroContent = {
  eyebrow: "FAQ",
  title: "Answers for everyday product, ordering, and routine questions.",
  description: "Use this page as a starting point for common support and product questions.",
  primaryCta: { label: "Contact Support", href: ROUTES.support },
};

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: "Product Use",
    items: [
      {
        question: "How do I choose the right product?",
        answer: "Start with your primary goal, such as focus, recovery, sleep, or healthy ageing. If you are unsure, use the BioAro quiz or contact support for guidance.",
      },
      {
        question: "How should I take BioAro products?",
        answer: "Always follow the directions shown on the product page and packaging.",
      },
      {
        question: "Can I take more than one BioAro product at a time?",
        answer: "Some products may be used as part of a broader routine, but if you are unsure or are already taking supplements or medications, speak with a qualified healthcare professional first.",
      },
    ],
  },
  {
    title: "Safety",
    items: [
      {
        question: "Are BioAro products medicines?",
        answer: "No. BioAro Drugs products are wellness products and food supplements. They are not intended to replace medical care.",
      },
      {
        question: "Can I use these products if I am pregnant or breastfeeding?",
        answer: "Consult a healthcare professional before use.",
      },
      {
        question: "Can I use these products with prescription medication?",
        answer: "If you are taking medication or have a medical condition, consult a healthcare professional before use.",
      },
    ],
  },
  {
    title: "Quality",
    items: [
      {
        question: "Are your products third-party tested?",
        answer: "Quality and testing information is shared on product pages and in our quality documentation when available.",
      },
      {
        question: "Why do you highlight ingredient forms and dosages?",
        answer: "Because thoughtful formulation, transparency, and consistency matter when building a daily routine.",
      },
    ],
  },
  {
    title: "Orders & Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer: "Shipping timelines vary by market and are shown at checkout and in our shipping policy.",
      },
      {
        question: "Will I receive tracking?",
        answer: "Where available, yes. You will receive tracking details once your order has shipped.",
      },
    ],
  },
  {
    title: "Returns",
    items: [
      {
        question: "Can I return an opened product?",
        answer: "Because these are ingestible products, opened products may not be eligible for return unless faulty or incorrect.",
      },
      {
        question: "What if my order arrives damaged?",
        answer: "Contact support promptly with your order number and photos where possible.",
      },
    ],
  },
];

export const PROTOCOLS_PAGE_HERO: PageHeroContent = {
  eyebrow: "Protocols",
  title: "Build a smarter daily routine.",
  description:
    "BioAro protocols bring complementary formulas together around everyday goals such as longevity, focus, recovery, and sleep.",
  primaryCta: { label: "Explore the Wellness Collection", href: ROUTES.shop },
  secondaryCta: { label: "Take the Wellness Quiz", href: ROUTES.quiz, variant: "secondary" },
};

export const PROTOCOLS_INTRO =
  "Not every customer needs every formula. Many customers do need a clearer path than a shelf full of individual bottles. Our protocol approach helps organise products around real goals, daily rhythms, and practical consistency.";

export const PROTOCOLS: ProtocolContent[] = [
  {
    title: "Morning Longevity Protocol",
    description: "Built for customers focused on healthy ageing, daily vitality, and longer-term routine quality.",
    suggestedFit: ["Longevity+", "CellOmega+"],
    positioning: "Support cellular energy, healthy ageing, and daily foundational wellness in one morning routine.",
    handleGroup: ["longevity-plus", "cellomega-plus"],
  },
  {
    title: "Focus Workday Protocol",
    description: "Built for customers who want support for concentration, cognitive energy, and consistent daytime performance.",
    suggestedFit: ["Creagen Brain Boost", "CellOmega+"],
    positioning: "Support focus, routine consistency, and cognitive energy through your working day.",
    handleGroup: ["creagen-brain-boost", "cellomega-plus"],
  },
  {
    title: "Recovery Performance Protocol",
    description: "Built for training, output, and post-exercise routine support.",
    suggestedFit: ["Creagen Pro Power", "Sleep support product when available"],
    positioning: "Support performance, recovery, and repeatable training consistency.",
    handleGroup: ["creagen-pro-power"],
  },
];

export const PARTNERS_PAGE_HERO: PageHeroContent = {
  eyebrow: "Partners",
  title: "Built for forward-thinking clinics, distributors, and practitioner-led networks.",
  description:
    "We work with clinics, practitioners, distributors, and selected retail partners who value clear product education and thoughtful wellness routines.",
  primaryCta: { label: "Start a Partner Conversation", href: "mailto:partners@bioarodrugs.com" },
};

export const PARTNER_AUDIENCES = [
  "Clinics",
  "Wellness practitioners",
  "Distributors",
  "Select retail partners",
  "Wellness collaborators",
];

export const PARTNER_REASONS = [
  "Premium, modern brand presentation",
  "Clear protocol-based product education",
  "Quality-first positioning",
  "A connected perspective across Labs and Drugs",
  "Support for education and customer confidence",
];

export const PARTNER_OPPORTUNITIES: PageCta[] = [
  { label: "Request Wholesale Pricing", href: "mailto:partners@bioarodrugs.com" },
  { label: "Book a Product Demonstration", href: "mailto:partners@bioarodrugs.com" },
  { label: "Become a BioAro Partner Clinic", href: "mailto:partners@bioarodrugs.com" },
  { label: "Speak to Our UK Team", href: "mailto:uk@bioarodrugs.com" },
  { label: "Apply to Become a UK Distributor", href: "mailto:partners@bioarodrugs.com" },
];

export const PARTNER_BUILDOUT_POINTS = [
  "Clear product education",
  "Transparent quality information",
  "Responsible market-specific communication",
  "Practical connections between insight and action",
];

export function getRegionalPolicyContent(region: ExperienceRegion, content: RegionalPolicyContent): PolicyPageContent {
  return {
    ...content.shared,
    sections: [...content.shared.sections, ...content.variants[region]],
  };
}
