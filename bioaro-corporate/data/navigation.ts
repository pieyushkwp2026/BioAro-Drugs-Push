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
    tagline: "Understand your body.",
    description:
      "Advanced diagnostics across genetics, gut health, hormones, inflammation, healthy aging, vitamins, and brain health to support more informed decisions.",
    href: BIOARO_LABS_URL,
    cta: "Explore BioAro Labs",
    bullets: ["50+ Tests", "Clinical Grade", "Advanced Technology", "Actionable Insights"],
  },
  {
    title: "BioAro Drugs",
    tagline: "Improve your daily performance.",
    description:
      "Science-backed bioactive wellness formulas designed to support longevity, focus, recovery, sleep, cellular health, and everyday wellbeing.",
    href: BIOARO_DRUGS_URL,
    cta: "Explore BioAro Drugs",
    bullets: ["Longevity", "Focus", "Recovery", "Daily Performance"],
  },
];

export const LAB_CATEGORIES: LabCategory[] = [
  { id: "all", label: "All Tests" },
  { id: "genetics", label: "Genetics" },
  { id: "gut-health", label: "Gut Health" },
  { id: "brain-health", label: "Brain Health" },
  { id: "hormones", label: "Hormones" },
  { id: "longevity", label: "Longevity" },
  { id: "inflammation", label: "Inflammation" },
  { id: "womens-health", label: "Women’s Health" },
  { id: "vitamins", label: "Vitamins" },
];

export const LAB_TESTS: LabTest[] = [
  { title: "GDF-15", category: "longevity", description: "Longevity-linked biomarker used to understand systemic stress and biological decline." },
  { title: "IL-6", category: "inflammation", description: "Inflammation marker that helps reveal immune activation patterns." },
  { title: "IL-10", category: "inflammation", description: "Anti-inflammatory marker for contextualizing immune balance." },
  { title: "The BioGut Test", category: "gut-health", description: "Digestive wellness panel focused on microbiome-driven insight." },
  { title: "The BioSkin Test", category: "inflammation", description: "Skin-health oriented test with inflammatory and wellness signals." },
  { title: "The BioDental Test", category: "inflammation", description: "Oral-health diagnostic view designed to surface hidden burden." },
  { title: "The BioFemme Test", category: "womens-health", description: "Women’s health panel for targeted hormonal and wellness review." },
  { title: "Telomere Length Testing", category: "longevity", description: "Biological aging signal to support longevity-focused interpretation.", badge: "Popular" },
  { title: "DNA Methylation Test", category: "longevity", description: "Epigenetic test used to estimate biological aging patterns." },
  { title: "GutVital™ Inflammation Panel", category: "gut-health", description: "Gut-linked inflammation markers in one focused panel." },
  { title: "GenomeGut Insight™", category: "genetics", description: "Integrated genetics and gut-health view for personalized interpretation." },
  { title: "LifeMap Complete™", category: "longevity", description: "Comprehensive precision-health profile spanning multiple systems." },
  { title: "Progesterone", category: "hormones", description: "Core hormone marker used in cycle and endocrine interpretation." },
  { title: "Total Testosterone", category: "hormones", description: "Hormonal baseline marker for energy, recovery, and performance." },
  { title: "Cortisol", category: "hormones", description: "Stress-response hormone used to understand resilience and load." },
  { title: "Resveratrol", category: "longevity", description: "Wellness-related assay placeholder for longevity protocol context." },
  { title: "Vitamin D, 25-Hydroxy", category: "vitamins", description: "Foundational vitamin status marker for immune and skeletal support." },
  { title: "Vitamin K2", category: "vitamins", description: "Micronutrient marker relevant to bone and cardiovascular context." },
  { title: "Vitamin E", category: "vitamins", description: "Antioxidant nutrient marker within broader wellness interpretation." },
  { title: "GutVital™ Nutrient Optimization Panel", category: "gut-health", description: "Nutrition-focused diagnostic set linked to gut performance." },
  { title: "GutVital™ Stress & Hormone Panel", category: "gut-health", description: "Digestive plus endocrine context in one integrated panel." },
  { title: "GutVital™ Total", category: "gut-health", description: "Expanded gut-health bundle covering inflammation, nutrition, and balance." },
  { title: "hs-CRP", category: "inflammation", description: "Widely used high-sensitivity marker of systemic inflammation." },
  { title: "sTNFR1", category: "inflammation", description: "Advanced inflammatory signal used in deeper risk interpretation." },
  { title: "MCP-1", category: "inflammation", description: "Immune signaling biomarker supporting advanced inflammation review." },
  { title: "PAI-1 Total", category: "inflammation", description: "Marker used in vascular, metabolic, and inflammatory context." },
  { title: "Cystatin C", category: "longevity", description: "Kidney-linked marker often used in healthy aging interpretation." },
  { title: "β2-Microglobulin", category: "longevity", description: "Systemic marker used in advanced biological status review." },
  { title: "TIMP-1", category: "longevity", description: "Matrix remodeling marker supporting advanced inflammatory insight." },
  { title: "p-Tau217", category: "brain-health", description: "Advanced neurology-oriented biomarker for cognitive risk context." },
  { title: "Beta-Amyloid 40/42 Ratio", category: "brain-health", description: "Brain-health marker used in precision cognitive screening." },
  { title: "SHBG", category: "hormones", description: "Hormone transport marker important in endocrine interpretation." },
  { title: "DHEA-S", category: "hormones", description: "Adrenal and aging-related hormone marker." },
  { title: "Androstenedione", category: "hormones", description: "Hormonal precursor marker for deeper endocrine analysis." },
  { title: "Vitamin K1", category: "vitamins", description: "Vitamin status marker supporting nutritional interpretation." },
  { title: "Vitamin A", category: "vitamins", description: "Micronutrient marker included in essential nutrient analysis." },
  { title: "The Epigenetic Test", category: "longevity", description: "Precision-aging view built around epigenetic interpretation.", badge: "Signature" },
  { title: "InFlare™ Gut & Inflammation Panel", category: "inflammation", description: "Focused gut and inflammatory insight in one profile." },
  { title: "BioAro GenomeGut Insight™", category: "genetics", description: "BioAro branded integrated gut and genomic intelligence offering.", badge: "Featured" },
  { title: "Estradiol", category: "hormones", description: "Core hormonal marker used in women’s and men’s health contexts." },
  { title: "DHT", category: "hormones", description: "Androgen metabolite marker used in targeted hormone review." },
  { title: "Hormone Health", category: "hormones", description: "Structured hormone panel for foundational endocrine insight." },
  { title: "Ultra Hormone Health", category: "hormones", description: "Expanded endocrine panel for deeper personalized analysis." },
  { title: "Essential Vitamin Health", category: "vitamins", description: "Foundational vitamins panel for daily health optimization." },
  { title: "Brain Health", category: "brain-health", description: "Targeted brain-health profile for cognition-oriented screening." },
  { title: "Core Inflammation Aging", category: "inflammation", description: "Foundational panel linking inflammation with healthy aging." },
  { title: "Advanced Inflammation Aging", category: "inflammation", description: "Expanded longevity and inflammation biomarker set." },
  { title: "Ultra Inflammation Aging", category: "inflammation", description: "Highest-depth inflammatory aging profile for advanced use." },
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
  { title: "Advanced Diagnostics", description: "Precision-led testing designed to reveal deeper health patterns with more confidence." },
  { title: "Bioactive Products", description: "Targeted wellness formulas designed to help turn insight into daily action." },
  { title: "Personalized Healthcare", description: "An ecosystem that connects understanding, action, and long-term behavior change." },
  { title: "Health Intelligence", description: "A premium interpretation layer focused on clarity, context, and next-step guidance." },
];

export const LIVING_FLOW_STEPS: LivingFlowStep[] = [
  { title: "Understand", description: "Advanced diagnostics reveal what is really happening inside your body — from genetics to inflammation." },
  { title: "Take Action", description: "Science-backed wellness formulas turn your results into precise, targeted daily support." },
  { title: "Build Better Health", description: "Consistent, informed decisions compound into stronger long-term health outcomes." },
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
