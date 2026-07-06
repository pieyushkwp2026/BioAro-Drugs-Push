import cellomegaImg from "../assets/products/cellomega.png";
import longevityImg from "../assets/products/longevity.png";
import creagenBrainImg from "../assets/products/creagen-brain.png";
import creagenProImg from "../assets/products/creagen-pro.png";
import type { ProductEditorial } from "../lib/shopify/types";

export const PREVIEW_PRODUCTS: ProductEditorial[] = [
  {
    id: "cellomega",
    handle: "cellomega-plus",
    title: "CellOmega+",
    badge: "Bestseller",
    tagline: "Cellular omega support.",
    description:
      "CellOmega+ is designed to support a daily wellness routine with purified omega-3s and clear usage guidance.",
    image: {
      src: cellomegaImg,
      alt: "BioAro Drugs CellOmega+ bottle",
    },
    category: "Recovery",
    tags: ["Omega-3", "Daily routine"],
    bestFor: "Foundational daily support and routine consistency.",
    dosage: "Take 2 softgels daily with food, or follow the product label guidance.",
    servings: "60 softgels",
    supplyLabel: "30-day supply",
    benefits: [
      "Supports a consistent daily routine",
      "Pairs easily with focus and longevity protocols",
      "Built for customers who want a simple omega foundation",
    ],
    trustNotes: [
      "Full ingredient and usage guidance appears directly on the product page.",
      "Quality documentation can be requested through the support team while the library is being finalized.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Do not exceed the recommended daily intake shown on the label.",
    ],
    ingredients: [
      { name: "EPA", amount: "650 mg", purpose: "Daily omega support", whyIncluded: "Selected as part of a routine-focused omega profile." },
      { name: "DHA", amount: "450 mg", purpose: "Daily wellness support", whyIncluded: "Included to round out the omega complex." },
    ],
    supplementFacts: [
      { label: "Serving size", value: "2 softgels" },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Softgels" },
    ],
    science: [
      { title: "Identify the role", description: "Start with the routine need: a practical omega foundation that is easy to take consistently." },
      { title: "Choose the format", description: "Pair key omega forms in a clear serving format that fits an everyday plan." },
      { title: "Keep guidance simple", description: "Explain when to take it, what it pairs with, and who should ask a practitioner first." },
    ],
    faq: [
      { question: "When should I take CellOmega+?", answer: "Take it with food as part of your daily routine, or follow the label guidance once finalized." },
      { question: "Can I stack CellOmega+ with other BioAro products?", answer: "Yes, it is positioned as a foundational product in several routines. If you are unsure, check with a healthcare professional first." },
      { question: "Where can I find quality documentation?", answer: "The quality library will surface finalized summaries here, and support can help with requests in the meantime." },
    ],
    priceByCountry: { US: 99, CA: 132, GB: 79 },
  },
  {
    id: "longevity",
    handle: "longevity-plus",
    title: "Longevity+",
    badge: "Bestseller",
    tagline: "The complete longevity protocol.",
    description:
      "Longevity+ is positioned as a daily support formula for customers focused on healthy ageing, energy routines, and steady long-term habits.",
    image: {
      src: longevityImg,
      alt: "BioAro Drugs Longevity+ bottle",
    },
    category: "Longevity",
    tags: ["Healthy ageing", "Morning routine"],
    bestFor: "Customers building a daily longevity-focused routine.",
    dosage: "Take 2 capsules daily with breakfast, or follow the final label guidance.",
    servings: "60 capsules",
    supplyLabel: "30-day supply",
    benefits: [
      "Supports a daily longevity-oriented routine",
      "Designed to fit morning protocol planning",
      "Works well alongside foundational products such as CellOmega+",
    ],
    trustNotes: [
      "Usage, warnings, and ingredient context are shown directly on the product page.",
      "Claims stay focused on routine support until final substantiation is published.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Keep out of reach of children.",
    ],
    ingredients: [
      { name: "NMN", amount: "250 mg", purpose: "Longevity routine support", whyIncluded: "Selected for customers building a long-term morning protocol." },
      { name: "Resveratrol", amount: "100 mg", purpose: "Protocol pairing", whyIncluded: "Included as part of the broader longevity positioning." },
      { name: "CoQ10", amount: "100 mg", purpose: "Daily routine support", whyIncluded: "Used to support a broader everyday formulation story." },
    ],
    supplementFacts: [
      { label: "Serving size", value: "2 capsules" },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Capsules" },
    ],
    science: [
      { title: "Start with routine design", description: "Longevity products work best when they are part of a repeatable morning plan rather than isolated purchases." },
      { title: "Explain the fit", description: "Show how the ingredients sit within a healthy ageing routine using plain language instead of hype." },
      { title: "Support consistency", description: "Daily guidance and pairing suggestions help customers stay with the protocol over time." },
    ],
    faq: [
      { question: "Is Longevity+ a medicine?", answer: "No. It is presented as a wellness product and food supplement, not as a medicine." },
      { question: "What routine does it fit into best?", answer: "It is positioned for morning use alongside foundational support products." },
      { question: "Can I take it every day?", answer: "Follow the product directions and speak with a healthcare professional if you need personal advice." },
    ],
    priceByCountry: { US: 150, CA: 199, GB: 119 },
  },
  {
    id: "creagen-brain",
    handle: "creagen-brain-boost",
    title: "Creagen Brain Boost",
    badge: "Bestseller",
    tagline: "Creatine for cognition.",
    description:
      "Creagen Brain Boost is positioned for customers who want support for concentration, cognitive energy, and steady daytime performance.",
    image: {
      src: creagenBrainImg,
      alt: "BioAro Drugs Creagen Brain Boost bottle",
    },
    category: "Focus",
    tags: ["Focus", "Workday routine"],
    bestFor: "Workdays, study blocks, and customers building a repeatable focus routine.",
    dosage: "Take 1 serving earlier in the day, or follow the final label guidance.",
    servings: "30 servings",
    supplyLabel: "30-day supply",
    benefits: [
      "Supports focus-oriented routine planning",
      "Built for daytime consistency",
      "Fits neatly into the focus workday protocol",
    ],
    trustNotes: [
      "Product pages are written conservatively and focus on routine guidance.",
      "Support can help customers decide whether the focus protocol is the right starting point.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Avoid taking it later in the day if that does not suit your routine.",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "5 g", purpose: "Focus routine support", whyIncluded: "Positioned as part of a workday performance stack." },
    ],
    supplementFacts: [
      { label: "Serving size", value: "1 scoop" },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Powder" },
    ],
    science: [
      { title: "Keep the goal clear", description: "Focus customers tend to need routine consistency more than a long list of ingredients." },
      { title: "Guide the timing", description: "Show when to take it and what it pairs with during a normal workday." },
      { title: "Pair where useful", description: "Use protocol suggestions to reduce guesswork and support consistent use." },
    ],
    faq: [
      { question: "Can I use this alongside CellOmega+?", answer: "Yes, that pairing is used in the focus workday protocol as a suggested fit." },
      { question: "Is this meant for evening use?", answer: "It is positioned as a daytime product. Follow the label guidance that ships with the product." },
      { question: "How should I choose between this and Longevity+?", answer: "Start with your primary goal. Focus routines suit customers prioritizing daytime concentration, while Longevity+ suits long-horizon routine building." },
    ],
    priceByCountry: { US: 50, CA: 67, GB: 40 },
  },
  {
    id: "creagen-pro",
    handle: "creagen-pro-power",
    title: "Creagen Pro Power",
    badge: "Bestseller",
    tagline: "Performance-grade creatine.",
    description:
      "Creagen Pro Power is positioned for customers building repeatable training, output, and recovery support routines.",
    image: {
      src: creagenProImg,
      alt: "BioAro Drugs Creagen Pro Power bottle",
    },
    category: "Recovery",
    tags: ["Recovery", "Training routine"],
    bestFor: "Training blocks, output-heavy weeks, and customers who want a recovery-support protocol.",
    dosage: "Take 1 serving daily, or follow the final label guidance.",
    servings: "30 servings",
    supplyLabel: "30-day supply",
    benefits: [
      "Supports recovery-oriented routine planning",
      "Built for customers who train consistently",
      "Sits at the center of the recovery performance protocol",
    ],
    trustNotes: [
      "Positioning stays focused on recovery support rather than guaranteed performance outcomes.",
      "Protocol suggestions help explain when it belongs in a broader stack.",
    ],
    warnings: [
      "Consult a healthcare professional before use if you are pregnant, breastfeeding, taking medication, or managing a medical condition.",
      "Keep the product in a cool, dry place and follow the label instructions.",
    ],
    ingredients: [
      { name: "Creatine Monohydrate", amount: "5 g", purpose: "Recovery routine support", whyIncluded: "Used as the foundation of the recovery protocol story." },
    ],
    supplementFacts: [
      { label: "Serving size", value: "1 scoop" },
      { label: "Servings per container", value: "30" },
      { label: "Format", value: "Powder" },
    ],
    science: [
      { title: "Support the training loop", description: "Recovery products work best when they fit clearly into the cadence of training and rest." },
      { title: "Explain the routine", description: "Customers should know what to take, when to take it, and why it belongs in the plan." },
      { title: "Connect to the wider protocol", description: "Recovery support becomes easier to follow when it is presented as part of a complete routine." },
    ],
    faq: [
      { question: "Is this a bundle?", answer: "No. Protocols suggest how products can fit together, but they do not imply a bundle purchase unless one is clearly offered." },
      { question: "Can I use it on non-training days?", answer: "Follow the label guidance and use the routine instructions on the product page as your starting point." },
      { question: "What should I pair it with?", answer: "The recovery protocol suggests pairing it with sleep-support products once that part of the range is live." },
    ],
    priceByCountry: { US: 50, CA: 67, GB: 40 },
  },
];

export function getPreviewProductByHandle(handle: string) {
  return PREVIEW_PRODUCTS.find((product) => product.handle === handle);
}
