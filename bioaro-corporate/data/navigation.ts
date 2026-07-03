import type {
  Capability,
  DrugProduct,
  FooterNavGroup,
  LabCategory,
  LabTest,
  LivingFlowStep,
  NavItem,
  OfferingCardContent,
} from "@/lib/types";

export const BIOARO_LABS_URL = "https://bioarolabs.com";
export const BIOARO_DRUGS_URL = "https://bioarodrugs.com";

export const OFFERINGS_HERO = {
  eyebrow: "Genomics-Led Precision Health Ecosystem",
  headline: "Two ecosystems. One mission. Living 2.0.",
  description:
    "BioAro connects advanced genomic, microbiome, and biomarker intelligence with science-backed bioactive wellness support — helping people move from biological insight to better daily health decisions.",
};

export const HERO_INTELLIGENCE_TOKENS = [
  "Genomic intelligence",
  "Microbiome insight",
  "Biomarker context",
];

export const OFFERINGS_STATS = [
  { value: "50+", label: "genomic, biomarker & wellness tests" },
  { value: "8+", label: "precision health categories" },
  { value: "9", label: "bioactive wellness formulas" },
  { value: "1", label: "connected Living 2.0 ecosystem" },
];

export const OFFERINGS_LABS_SECTION = {
  title: "Advanced genomics-led diagnostics for precision health intelligence.",
  description:
    "BioAro Labs turns genomic, microbiome, biomarker, hormone, nutrient, inflammation, brain health, and longevity data into clearer, more personalized health intelligence.",
  capabilityPoints: [
    {
      title: "Genomic Intelligence",
      description: "DNA, epigenetic, and inherited health intelligence.",
    },
    {
      title: "Microbiome & Gut Health",
      description: "Gut ecosystem testing for deeper digestive and metabolic context.",
    },
    {
      title: "Biomarker & Longevity Panels",
      description: "Inflammation, aging, hormones, vitamins, and cellular health markers.",
    },
    {
      title: "Actionable Health Reports",
      description: "Clear insights designed to support targeted next steps.",
    },
  ],
};

export const OFFERINGS_DRUGS_SECTION = {
  title: "Precision-informed bioactive formulas for everyday health performance.",
  description:
    "BioAro Drugs extends Living 2.0 into daily action with science-backed bioactive formulas designed to support cellular health, energy, focus, recovery, sleep, antioxidant protection, and long-term wellbeing.",
  bridge:
    "From insight to action: formulas designed to support the daily health goals revealed through genomic, microbiome, and biomarker context.",
};

export const WHY_BIOARO_COPY = {
  title: "One precision health ecosystem. Two ways to understand and improve your biology.",
  description:
    "BioAro brings together genomics-led diagnostics, microbiome and biomarker intelligence, and science-backed bioactive wellness support to help people move beyond generic health decisions. Through Living 2.0, BioAro connects biological insight with targeted daily action.",
  convictions: [
    "Decode your biology through genomic, microbiome, biomarker, hormone, nutrient, and longevity testing.",
    "Translate insight into action with personalized healthcare intelligence and targeted wellness pathways.",
    "Build better long-term health through the Living 2.0 philosophy: understand, act, and optimize.",
  ],
};

export const LIVING_FLOW_COPY = {
  label: "Living 2.0",
  title: "The philosophy that turns insight into action.",
  description:
    "Living 2.0 is BioAro’s approach to precision health: understanding your biology through advanced testing, translating that insight into informed action, and supporting better long-term health through daily wellness decisions.",
  steps: [
    "Decode your biology through genomics, microbiome, biomarkers, and health intelligence.",
    "Use personalized healthcare intelligence to guide targeted wellness choices.",
    "Support long-term wellbeing through consistent, informed daily action.",
  ],
};

export const CTA_COPY = {
  label: "Start Here",
  title: "Start Your Living 2.0 Journey",
  description:
    "Whether you’re ready to understand your biology through genomics-led diagnostics or act on that insight with precision-informed bioactive formulas, BioAro is designed to help you take the next step with confidence.",
};

export const FOOTER_COPY = {
  description:
    "The genomics-led precision health ecosystem connecting advanced health insight with science-backed action.",
};

export const LAB_DIRECTORY_COPY = {
  placeholder: "Search genomic, microbiome, biomarker, or wellness tests",
  footerCta: "Visit BioAro Labs",
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Ecosystem", href: "/#ecosystem" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Platform", href: "/#platform" },
  { label: "Our Offerings", href: "/our-offerings" },
  { label: "Clinical Intelligence", href: "/#clinical-intelligence" },
  { label: "Infrastructure", href: "/#infrastructure" },
  { label: "About", href: "/#about" },
];

export const OFFERINGS: OfferingCardContent[] = [
  {
    title: "BioAro Labs",
    tagline: "Understand your biology.",
    description:
      "BioAro Labs delivers genomics-led diagnostics across microbiome health, inflammation, hormones, nutrients, longevity, brain health, and healthy aging — helping individuals and healthcare professionals uncover deeper biological insight from advanced health data.",
    href: BIOARO_LABS_URL,
    cta: "Explore Precision Health Tests",
    bullets: ["50+ Tests", "Clinical Grade", "Advanced Technology", "Actionable Insights"],
  },
  {
    title: "BioAro Drugs",
    tagline: "Act on your health intelligence.",
    description:
      "BioAro Drugs offers science-backed bioactive wellness formulas designed to support daily performance, recovery, sleep, cellular health, focus, and long-term wellbeing — turning health insight into meaningful action.",
    href: BIOARO_DRUGS_URL,
    cta: "Explore Bioactive Formulas",
    bullets: ["Longevity", "Focus", "Recovery", "Daily Performance"],
  },
];

export const LAB_CATEGORIES: LabCategory[] = [
  { id: "all", label: "All Tests" },
  { id: "genomic-intelligence", label: "Genomic Intelligence" },
  { id: "microbiome-health", label: "Microbiome Health" },
  { id: "epigenetics-longevity", label: "Epigenetics & Longevity" },
  { id: "hormones-metabolism", label: "Hormones & Metabolism" },
  { id: "inflammation-aging", label: "Inflammation & Aging" },
  { id: "brain-health", label: "Brain Health" },
  { id: "nutrient-optimization", label: "Nutrient Optimization" },
  { id: "womens-health", label: "Women’s Health" },
];

export const LAB_TESTS: LabTest[] = [
  { title: "GDF-15", category: "epigenetics-longevity", description: "Longevity-linked biomarker used to understand systemic stress and biological decline." },
  { title: "IL-6", category: "inflammation-aging", description: "Inflammation marker that helps reveal immune activation patterns." },
  { title: "IL-10", category: "inflammation-aging", description: "Anti-inflammatory marker for contextualizing immune balance." },
  { title: "The BioGut Test", category: "microbiome-health", description: "Digestive wellness panel focused on microbiome-driven insight." },
  { title: "The BioSkin Test", category: "inflammation-aging", description: "Skin-health oriented test with inflammatory and wellness signals." },
  { title: "The BioDental Test", category: "inflammation-aging", description: "Oral-health diagnostic view designed to surface hidden burden." },
  { title: "The BioFemme Test", category: "womens-health", description: "Women’s health panel for targeted hormonal and wellness review." },
  { title: "Telomere Length Testing", category: "epigenetics-longevity", description: "Biological aging signal to support longevity-focused interpretation.", badge: "Popular" },
  { title: "DNA Methylation Test", category: "epigenetics-longevity", description: "Epigenetic test used to estimate biological aging patterns." },
  { title: "GutVital™ Inflammation Panel", category: "microbiome-health", description: "Gut-linked inflammation markers in one focused panel." },
  { title: "GenomeGut Insight™", category: "genomic-intelligence", description: "Integrated genetics and gut-health view for personalized interpretation." },
  { title: "LifeMap Complete™", category: "epigenetics-longevity", description: "Comprehensive precision-health profile spanning multiple systems." },
  { title: "Progesterone", category: "hormones-metabolism", description: "Core hormone marker used in cycle and endocrine interpretation." },
  { title: "Total Testosterone", category: "hormones-metabolism", description: "Hormonal baseline marker for energy, recovery, and performance." },
  { title: "Cortisol", category: "hormones-metabolism", description: "Stress-response hormone used to understand resilience and load." },
  { title: "Resveratrol", category: "epigenetics-longevity", description: "Wellness-related assay placeholder for longevity protocol context." },
  { title: "Vitamin D, 25-Hydroxy", category: "nutrient-optimization", description: "Foundational vitamin status marker for immune and skeletal support." },
  { title: "Vitamin K2", category: "nutrient-optimization", description: "Micronutrient marker relevant to bone and cardiovascular context." },
  { title: "Vitamin E", category: "nutrient-optimization", description: "Antioxidant nutrient marker within broader wellness interpretation." },
  { title: "GutVital™ Nutrient Optimization Panel", category: "microbiome-health", description: "Nutrition-focused diagnostic set linked to gut performance." },
  { title: "GutVital™ Stress & Hormone Panel", category: "microbiome-health", description: "Digestive plus endocrine context in one integrated panel." },
  { title: "GutVital™ Total", category: "microbiome-health", description: "Expanded gut-health bundle covering inflammation, nutrition, and balance." },
  { title: "hs-CRP", category: "inflammation-aging", description: "Widely used high-sensitivity marker of systemic inflammation." },
  { title: "sTNFR1", category: "inflammation-aging", description: "Advanced inflammatory signal used in deeper risk interpretation." },
  { title: "MCP-1", category: "inflammation-aging", description: "Immune signaling biomarker supporting advanced inflammation review." },
  { title: "PAI-1 Total", category: "inflammation-aging", description: "Marker used in vascular, metabolic, and inflammatory context." },
  { title: "Cystatin C", category: "epigenetics-longevity", description: "Kidney-linked marker often used in healthy aging interpretation." },
  { title: "β2-Microglobulin", category: "epigenetics-longevity", description: "Systemic marker used in advanced biological status review." },
  { title: "TIMP-1", category: "epigenetics-longevity", description: "Matrix remodeling marker supporting advanced inflammatory insight." },
  { title: "p-Tau217", category: "brain-health", description: "Advanced neurology-oriented biomarker for cognitive risk context." },
  { title: "Beta-Amyloid 40/42 Ratio", category: "brain-health", description: "Brain-health marker used in precision cognitive screening." },
  { title: "SHBG", category: "hormones-metabolism", description: "Hormone transport marker important in endocrine interpretation." },
  { title: "DHEA-S", category: "hormones-metabolism", description: "Adrenal and aging-related hormone marker." },
  { title: "Androstenedione", category: "hormones-metabolism", description: "Hormonal precursor marker for deeper endocrine analysis." },
  { title: "Vitamin K1", category: "nutrient-optimization", description: "Vitamin status marker supporting nutritional interpretation." },
  { title: "Vitamin A", category: "nutrient-optimization", description: "Micronutrient marker included in essential nutrient analysis." },
  { title: "The Epigenetic Test", category: "epigenetics-longevity", description: "Precision-aging view built around epigenetic interpretation.", badge: "Signature" },
  { title: "InFlare™ Gut & Inflammation Panel", category: "inflammation-aging", description: "Focused gut and inflammatory insight in one profile." },
  { title: "BioAro GenomeGut Insight™", category: "genomic-intelligence", description: "BioAro branded integrated gut and genomic intelligence offering.", badge: "Featured" },
  { title: "Estradiol", category: "hormones-metabolism", description: "Core hormonal marker used in women’s and men’s health contexts." },
  { title: "DHT", category: "hormones-metabolism", description: "Androgen metabolite marker used in targeted hormone review." },
  { title: "Hormone Health", category: "hormones-metabolism", description: "Structured hormone panel for foundational endocrine insight." },
  { title: "Ultra Hormone Health", category: "hormones-metabolism", description: "Expanded endocrine panel for deeper personalized analysis." },
  { title: "Essential Vitamin Health", category: "nutrient-optimization", description: "Foundational vitamins panel for daily health optimization." },
  { title: "Brain Health", category: "brain-health", description: "Targeted brain-health profile for cognition-oriented screening." },
  { title: "Core Inflammation Aging", category: "inflammation-aging", description: "Foundational panel linking inflammation with healthy aging." },
  { title: "Advanced Inflammation Aging", category: "inflammation-aging", description: "Expanded longevity and inflammation biomarker set." },
  { title: "Ultra Inflammation Aging", category: "inflammation-aging", description: "Highest-depth inflammatory aging profile for advanced use." },
];

export const DRUG_PRODUCTS: DrugProduct[] = [
  { title: "Longevity Plus", category: "Longevity", description: "Daily longevity support designed around cellular energy and healthy aging.", href: BIOARO_DRUGS_URL },
  { title: "CellOmega Plus", category: "Cellular Health", description: "Omega-focused support for heart, brain, and membrane health.", href: BIOARO_DRUGS_URL },
  { title: "Creagen Brain Boost", category: "Focus", description: "A cognitive-performance formula built to support daily clarity.", href: BIOARO_DRUGS_URL },
  { title: "Creagen Femme Energy", category: "Women’s Wellness", description: "Targeted daily energy support with a female-focused positioning.", href: BIOARO_DRUGS_URL },
  { title: "Creagen Raw Power", category: "Performance", description: "Performance-forward creatine positioning for output and resilience.", href: BIOARO_DRUGS_URL },
  { title: "Creagen Pro Power", category: "Recovery", description: "A recovery-focused performance formula for training support.", href: BIOARO_DRUGS_URL },
  { title: "Glutara", category: "Cellular Support", description: "A supportive formula focused on antioxidant and resilience pathways.", href: BIOARO_DRUGS_URL },
  { title: "Sleepo", category: "Sleep", description: "Evening wellness support for deeper recovery and restorative routines.", href: BIOARO_DRUGS_URL },
  { title: "Sleepo Kids", category: "Family Wellness", description: "A gentler sleep-support concept positioned for family routines.", href: BIOARO_DRUGS_URL },
];

export const CAPABILITIES: Capability[] = [
  { title: "Genomic Intelligence", description: "DNA, epigenetic, and inherited health insights." },
  { title: "Microbiome & Gut Health", description: "Gut ecosystem testing for deeper digestive and metabolic understanding." },
  { title: "Biomarker & Longevity Panels", description: "Inflammation, aging, hormones, vitamins, and cellular health markers." },
  { title: "Actionable Health Reports", description: "Clearer insights designed to support informed health decisions." },
];

export const LIVING_FLOW_STEPS: LivingFlowStep[] = [
  {
    title: "Understand",
    label: "Genomic intelligence",
    description: "Decode your biology through genomics, microbiome, biomarkers, and health intelligence.",
  },
  {
    title: "Take Action",
    label: "Targeted action",
    description: "Use personalized healthcare intelligence to guide targeted wellness choices.",
  },
  {
    title: "Build Better Health",
    label: "Living 2.0",
    description: "Support long-term wellbeing through consistent, informed daily action.",
  },
];

export const TRUST_CLAIMS = [
  "Science-backed",
  "Clinically informed",
  "Manufactured in cGMP",
  "Third-party tested",
  "Transparent ingredients",
];

export const FOOTER_NAV: FooterNavGroup[] = [
  {
    title: "Ecosystem",
    links: [
      { label: "BioAro Labs", href: BIOARO_LABS_URL },
      { label: "BioAro Drugs", href: BIOARO_DRUGS_URL },
      { label: "Living 2.0", href: "/our-offerings#living-flow" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Clinical Intelligence", href: "/#clinical-intelligence" },
      { label: "Our Offerings", href: "/our-offerings" },
      { label: "Book a Consultation", href: "/consultation" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Ecosystem", href: "/#ecosystem" },
      { label: "Infrastructure", href: "/#infrastructure" },
      { label: "About", href: "/#about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/consultation" },
      { label: "Locations", href: "/#locations" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Compliance", href: "/compliance" },
    ],
  },
];
