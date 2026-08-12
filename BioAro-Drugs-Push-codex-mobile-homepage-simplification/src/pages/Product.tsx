import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Check, Zap, Dna, Scale, Heart, Brain, Shield, Flame, Droplet, Sparkles, ArrowRight, Quote,
  Pill, Ban, Sun, Briefcase, ShieldCheck, UtensilsCrossed, Package, RefreshCw, FlaskConical, CheckCircle2,
} from "lucide-react";
import AccordionGroup from "../components/page/AccordionGroup";
import IngredientCard from "../components/sections/IngredientCard";
import PlaceholderBottle from "../components/sections/PlaceholderBottle";
import OtherIngredientsSection from "../components/sections/OtherIngredientsSection";
import { fetchProductByHandle, fetchAllProducts } from "../lib/shopify/productService";
import type { CatalogProduct, ProductFeatureBadge, ProductWhyItem } from "../lib/shopify/types";
import { useMarket } from "../hooks/useMarket";
import { useCart } from "../hooks/useCart";
import { formatMoneyOrPending } from "../lib/market/config";
import { useMarketHref } from "../hooks/useMarketHref";
import { ROUTES } from "../lib/routes";
import { COMPARISON_ROWS } from "../data/pdpContent";
import ScienceFormulaVisual from "../components/sections/ScienceFormulaVisual";
import QualityPurityStrip from "../components/sections/QualityPurityStrip";
import ProductMediaGallery, { type ProductGalleryImage } from "../components/sections/ProductMediaGallery";
import { getScienceVisual } from "../data/scienceVisuals";
import { getMarketConfigByMarket } from "../config/markets";
import { absoluteUrl, canonicalForMarket } from "../lib/seo";
import femmeEnergyHero from "../assets/products/creagen-femme-energy-01-hero-1x1.png";
import femmeEnergyOpenPack from "../assets/products/creagen-femme-energy-02-open-pack-1x1.png";
import femmeEnergySachet from "../assets/products/creagen-femme-energy-03-sachet-1x1.png";
import femmeEnergyIngredients from "../assets/products/creagen-femme-energy-04-ingredients-1x1.png";
import femmeEnergyLifestyle from "../assets/products/creagen-femme-energy-05-lifestyle-1x1.png";
import longevityHero from "../assets/products/longevity-plus-01-hero-1x1.png";
import longevityCloseUp from "../assets/products/longevity-plus-02-close-up-1x1.png";
import longevityOpenPack from "../assets/products/longevity-plus-03-open-pack-1x1.png";
import longevityIngredients from "../assets/products/longevity-plus-04-ingredients-1x1.png";
import longevityLifestyle from "../assets/products/longevity-plus-05-lifestyle-1x1.png";
import cellOmegaHero from "../assets/products/cellomega-plus-01-hero-1x1.png";
import cellOmegaIngredients from "../assets/products/cellomega-plus-02-ingredients-1x1.png";
import cellOmegaIngredientsList from "../assets/products/cellomega-plus-03-ingredients-list-1x1.png";
import cellOmegaLifestyle from "../assets/products/cellomega-plus-04-lifestyle-1x1.png";
import cellOmegaProduct from "../assets/products/cellomega-plus-05-product-1x1.png";
import rawPowerHero from "../assets/products/creagen-raw-power-01-hero-1x1.png";
import rawPowerDetail from "../assets/products/creagen-raw-power-02-product-detail-1x1.png";
import rawPowerOpenPack from "../assets/products/creagen-raw-power-03-open-pack-1x1.png";
import rawPowerScene from "../assets/products/creagen-raw-power-04-product-scene-1x1.png";
import rawPowerIngredients from "../assets/products/creagen-raw-power-05-ingredients-1x1.png";
import brainBoostHero from "../assets/products/creagen-brain-boost-01-hero-1x1.png";
import brainBoostOpenPack from "../assets/products/creagen-brain-boost-02-open-pack-1x1.png";
import brainBoostFlatlay from "../assets/products/creagen-brain-boost-03-flatlay-1x1.png";
import brainBoostDetail from "../assets/products/creagen-brain-boost-04-product-detail-1x1.png";
import brainBoostIngredients from "../assets/products/creagen-brain-boost-05-ingredients-1x1.png";
import proPowerHero from "../assets/products/creagen-pro-power-01-hero-1x1.jpg";
import proPowerIngredients from "../assets/products/creagen-pro-power-02-ingredients-1x1.jpg";
import proPowerLifestyle from "../assets/products/creagen-pro-power-03-lifestyle-1x1.jpg";
import proPowerBenefits from "../assets/products/creagen-pro-power-04-benefits-1x1.jpg";
import proPowerRoutine from "../assets/products/creagen-pro-power-05-product-routine-1x1.jpg";
import glutaraHero from "../assets/products/glutara-01-hero-1x1.jpg";
import glutaraIngredients from "../assets/products/glutara-02-ingredients-1x1.jpg";
import glutaraLifestyle from "../assets/products/glutara-03-lifestyle-1x1.jpg";
import glutaraBenefits from "../assets/products/glutara-04-benefits-1x1.jpg";
import glutaraRoutine from "../assets/products/glutara-05-product-routine-1x1.jpg";

const BADGE_ICONS: Record<ProductFeatureBadge["icon"], typeof Pill> = {
  capsule: Pill,
  noHassle: Ban,
  routine: Sun,
  travel: Briefcase,
  quality: ShieldCheck,
  omega: Droplet,
  meal: UtensilsCrossed,
  sachet: Package,
  mix: RefreshCw,
  bag: Briefcase,
  formula: FlaskConical,
  pure: Sparkles,
  training: Flame,
  dosed: CheckCircle2,
};

const WHY_ICONS: Record<ProductWhyItem["icon"], typeof Zap> = {
  energy: Zap,
  aging: Dna,
  balance: Scale,
  heart: Heart,
  brain: Brain,
  shield: Shield,
  flame: Flame,
  droplet: Droplet,
  sparkle: Sparkles,
};

const REGION_DISCLAIMERS = {
  NA: "Statements about wellness support describe general product positioning only and are not intended to diagnose, treat, cure, or prevent disease.",
  UK: "BioAro products are presented as food supplements. Food supplements should not be used as a substitute for a varied, balanced diet and a healthy lifestyle.",
  AE: "BioAro products are presented as food supplements. Product guidance is educational and may vary by market.",
} as const;

function hasLiveShopifyVariant(product: CatalogProduct) {
  return Boolean(product.variantId && !product.variantId.startsWith("missing-variant-") && !product.variantId.startsWith("preview-variant-"));
}

const PRODUCT_GALLERIES: Record<string, ProductGalleryImage[]> = {
  "creagen-femme-energy": [
    { src: femmeEnergyHero, alt: "Creagen Femme Energy jar with an individual sachet", fit: "cover" },
    { src: femmeEnergyOpenPack, alt: "Open Creagen Femme Energy jar with branded lid", fit: "cover" },
    { src: femmeEnergySachet, alt: "Creagen Femme Energy five gram sachet", fit: "cover" },
    { src: femmeEnergyIngredients, alt: "Creagen Femme Energy key ingredients and serving amounts", fit: "contain" },
    { src: femmeEnergyLifestyle, alt: "Woman preparing Creagen Femme Energy sachet with water", fit: "cover", position: "center" },
  ],
  "longevity-plus": [
    { src: longevityHero, alt: "Longevity Plus product box and bottle", fit: "cover" },
    { src: longevityCloseUp, alt: "Longevity Plus bottle in front of product packaging", fit: "cover" },
    { src: longevityOpenPack, alt: "Open Longevity Plus packaging with branded lid", fit: "cover" },
    { src: longevityIngredients, alt: "Longevity Plus key ingredients and serving amounts", fit: "contain" },
    { src: longevityLifestyle, alt: "Woman preparing Longevity Plus as part of a daily routine", fit: "cover", position: "center" },
  ],
  "cellomega-plus": [
    { src: cellOmegaHero, alt: "CellOmega Plus packaging, bottle, and capsules", fit: "cover" },
    { src: cellOmegaIngredients, alt: "CellOmega Plus bottle with algae and supporting ingredients", fit: "cover" },
    { src: cellOmegaIngredientsList, alt: "CellOmega Plus key ingredients and serving amounts", fit: "contain" },
    { src: cellOmegaLifestyle, alt: "CellOmega Plus bottle in a morning wellness routine", fit: "cover", position: "center" },
    { src: cellOmegaProduct, alt: "CellOmega Plus packaging and bottle close-up", fit: "cover" },
  ],
  "creagen-raw-power": [
    { src: rawPowerHero, alt: "Creagen Raw Power product container", fit: "cover" },
    { src: rawPowerDetail, alt: "Creagen Raw Power product container with a serving glass", fit: "cover" },
    { src: rawPowerOpenPack, alt: "Open Creagen Raw Power container with individual sachets", fit: "cover" },
    { src: rawPowerScene, alt: "Creagen Raw Power container and sachets in a dark studio setting", fit: "cover" },
    { src: rawPowerIngredients, alt: "Creagen Raw Power formula benefits and serving information", fit: "contain" },
  ],
  "creagen-brain-boost": [
    { src: brainBoostHero, alt: "Creagen Brain Boost container with sachet and water", fit: "cover" },
    { src: brainBoostOpenPack, alt: "Open Creagen Brain Boost container with individual sachets", fit: "cover" },
    { src: brainBoostFlatlay, alt: "Creagen Brain Boost container and sachets flat lay", fit: "cover" },
    { src: brainBoostDetail, alt: "Creagen Brain Boost container with branded lid and sachet", fit: "cover" },
    { src: brainBoostIngredients, alt: "Creagen Brain Boost key ingredients and serving amounts", fit: "contain" },
  ],
  "creagen-smart-start": [
    { src: brainBoostHero, alt: "Creagen Smart Start container with sachet and water", fit: "cover" },
    { src: brainBoostOpenPack, alt: "Open Creagen Smart Start container with individual sachets", fit: "cover" },
    { src: brainBoostFlatlay, alt: "Creagen Smart Start container and sachets flat lay", fit: "cover" },
    { src: brainBoostDetail, alt: "Creagen Smart Start container with branded lid and sachet", fit: "cover" },
    { src: brainBoostIngredients, alt: "Creagen Smart Start key ingredients and serving amounts", fit: "contain" },
  ],
  "creagen-pro-power": [
    { src: proPowerHero, alt: "Creagen Pro Power container with two individual sachets", fit: "cover" },
    { src: proPowerIngredients, alt: "Creagen Pro Power ingredients with powder and individual sachets", fit: "cover" },
    { src: proPowerLifestyle, alt: "Athlete preparing Creagen Pro Power in a gym", fit: "cover" },
    { src: proPowerBenefits, alt: "Creagen Pro Power formula benefits and performance support information", fit: "contain" },
    { src: proPowerRoutine, alt: "Open Creagen Pro Power container with shaker and sachets", fit: "cover" },
  ],
  glutara: [
    { src: glutaraHero, alt: "Glutara product container on a stone surface", fit: "cover" },
    { src: glutaraIngredients, alt: "Glutara ingredients with sachets and powder samples", fit: "cover" },
    { src: glutaraLifestyle, alt: "Woman preparing Glutara with water as part of a daily routine", fit: "cover" },
    { src: glutaraBenefits, alt: "Glutara formula benefits and antioxidant support information", fit: "contain" },
    { src: glutaraRoutine, alt: "Open Glutara container with sachets, water, and powder", fit: "cover" },
  ],
};

function initialsFor(title: string) {
  const words = title.split(" ").filter(Boolean);
  return (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "");
}

function toTitleCase(value: string) {
  return value
    .split(/[\s/-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function uniqueStrings(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

function fallbackGallery(product: CatalogProduct): ProductGalleryImage[] | undefined {
  if (!product.image?.src) return undefined;
  return Array.from({ length: 5 }, (_, index) => ({
    src: product.image!.src,
    alt: `${product.title} product view ${index + 1}`,
    fit: "contain" as const,
  }));
}

function fallbackFeatureBadges(product: CatalogProduct): ProductFeatureBadge[] {
  const labels: ProductFeatureBadge[] = [];
  const format = product.metafields?.productFormat?.toLowerCase() ?? "";
  const pack = product.packName ?? product.supplyLabel;

  if (format.includes("capsule")) labels.push({ icon: "capsule", label: "Easy Capsules" });
  else if (format.includes("powder")) labels.push({ icon: "mix", label: "Mixable Formula" });
  else if (format.includes("sachet")) labels.push({ icon: "sachet", label: "Single Sachets" });
  else labels.push({ icon: "formula", label: "Daily Formula" });

  if (pack) labels.push({ icon: "routine", label: pack });
  if (product.category === "Performance") labels.push({ icon: "training", label: "Training Support" });
  if (product.category === "Focus") labels.push({ icon: "dosed", label: "Focus Support" });
  if (product.category === "Wellness") labels.push({ icon: "quality", label: "Wellness Routine" });
  labels.push({ icon: "pure", label: "Transparent Label" });
  labels.push({ icon: "quality", label: "Quality Checked" });

  return labels.slice(0, 5);
}

function fallbackWhyItems(product: CatalogProduct): ProductWhyItem[] {
  const baseIcons: ProductWhyItem["icon"][] =
    product.category === "Performance"
      ? ["flame", "energy", "droplet"]
      : product.category === "Focus"
        ? ["brain", "sparkle", "balance"]
        : ["shield", "balance", "heart"];

  const source = product.benefits.length
    ? product.benefits.slice(0, 3)
    : (product.tags.length ? product.tags.slice(0, 3) : [product.title, product.category, "Daily use"]);

  return source.map((item, index) => ({
    icon: baseIcons[index] ?? "shield",
    title: toTitleCase(item.replace(/[.,]+$/g, "")),
    description: `${toTitleCase(item.replace(/[.,]+$/g, ""))} built into a purposeful daily routine.`,
  }));
}

function fallbackScienceSteps(product: CatalogProduct): CatalogProduct["science"] {
  const inputs = product.whyItems.length ? product.whyItems : fallbackWhyItems(product);
  return inputs.slice(0, 4).map((item) => ({
    title: item.title,
    description: item.description,
  }));
}

function isPrimaryIngredientName(name: string) {
  return !/(other ingredients|natural|artificial|flavor|flavour|sucralose|citric acid|malic acid|silicon dioxide|xanthan gum|rice flour|magnesium stearate|hypromellose|gelatin|sea salt|dextrose|maltodextrin|calcium silicate|capsule|erythritol)/i.test(name);
}

function fallbackIngredients(product: CatalogProduct) {
  const curated = product.ingredients.filter((ingredient) => isPrimaryIngredientName(ingredient.name));
  const source = (curated.length ? curated : product.ingredients).slice(0, 5);
  return source.map((ingredient) => ({
    ...ingredient,
    purpose: ingredient.purpose || `${ingredient.name} supports the formula's intended use.`,
    whyIncluded: ingredient.whyIncluded || `Included to round out the ${product.title} routine.`,
  }));
}

function fallbackEvidencePoints(product: CatalogProduct) {
  return uniqueStrings([
    product.category === "Performance" ? "Purpose-built for active routines" : "Purpose-built for daily routines",
    "Transparent label with disclosed ingredients",
    "Third-party tested manufacturing approach",
    "Focused formulation without unnecessary extras",
    product.metafields?.shortDescription ? "Approved product brief used for PDP copy" : "",
  ].filter(Boolean));
}

function fallbackSupplementFacts(product: CatalogProduct) {
  return [
    { label: "Recommended daily intake", value: product.dosage || "Follow the product label directions." },
    { label: "Serving size", value: product.servings || product.metafields?.servingSize || "See label" },
    { label: "Servings per container", value: product.metafields?.servingsPerContainer || product.supplyLabel || "See label" },
    { label: "Format", value: product.metafields?.productFormat || product.packName || "Supplement" },
  ];
}

function fallbackFaq(product: CatalogProduct) {
  const veganAnswer = /vegan/i.test(product.handle) || /vegan/i.test(product.supplyLabel) || /veggie/i.test(product.metafields?.productFormat ?? "")
    ? "This product is positioned for vegetarian or vegan-friendly routines based on the current source material."
    : "Check the final product label and allergen statement before purchase if vegetarian or vegan suitability matters to you.";

  return [
    {
      question: `How should I take ${product.title}?`,
      answer: product.dosage || "Follow the directions on the product label.",
    },
    {
      question: "When will I see results?",
      answer: "Consistency matters most. Individual experiences vary depending on routine, diet, training load, and overall lifestyle.",
    },
    {
      question: "How many servings are included?",
      answer: product.metafields?.servingsPerContainer || product.supplyLabel || product.servings || "See the product label for serving information.",
    },
    {
      question: "Is it suitable for vegetarians?",
      answer: veganAnswer,
    },
    {
      question: "Does it contain any allergens?",
      answer: product.metafields?.allergenInfo || "Check the final product label for the latest allergen information.",
    },
    {
      question: "What is your return policy?",
      answer: "Please refer to the returns and refunds policy linked in the site footer for the latest policy details.",
    },
  ];
}

export default function Product() {
  const { handle } = useParams();
  const location = useLocation();
  const { country, market, region } = useMarket();
  const marketHref = useMarketHref();
  const { addProduct, error: cartError } = useCart();
  const [product, setProduct] = useState<CatalogProduct | null | undefined>(undefined);
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (!handle) return;
    void fetchProductByHandle(handle, country)
      .then((nextProduct) => setProduct(nextProduct ?? null))
      .catch(() => setProduct(null));
  }, [country, handle]);

  useEffect(() => {
    void fetchAllProducts(country).then(setCatalog).catch(() => setCatalog([]));
  }, [country]);

  useEffect(() => {
    document.head.querySelector('script[data-bioaro-product-schema="true"]')?.remove();

    if (!product || !handle) return;

    const marketConfig = getMarketConfigByMarket(market);
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      brand: {
        "@type": "Brand",
        name: "BioAro Drugs",
      },
      sku: product.handle,
      url: canonicalForMarket(market, location.pathname),
    };

    if (product.image?.src) {
      schema.image = [absoluteUrl(product.image.src)];
    }

    if (product.availableForSale) {
      schema.offers = {
        "@type": "Offer",
        price: product.price.amount,
        priceCurrency: marketConfig.currency,
        availability: "https://schema.org/InStock",
        url: canonicalForMarket(market, location.pathname),
      };
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.bioaroProductSchema = "true";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [handle, location.pathname, market, product]);

  const routineMates = useMemo(
    () => catalog.filter((item) => item.handle !== handle).slice(0, 2),
    [catalog, handle],
  );

  if (product === undefined) return <div className="pt-40 text-center text-ink/40">Loading…</div>;
  if (product === null) {
    return (
      <div className="pt-40 pb-20 text-center">
        <p className="text-ink/50">Product not found.</p>
        <Link to={marketHref(ROUTES.shop)} className="text-forest-600 underline mt-2 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  const maxEfficacy = Math.max(product.efficacyMetric.placeboValue, product.efficacyMetric.productValue);
  const showGraph = product.efficacyMetric.label !== "" && maxEfficacy > 0;
  const fallbackScienceVisual = getScienceVisual(product.handle);
  const enrichedWhyItems = product.whyItems.length ? product.whyItems : fallbackWhyItems(product);
  const enrichedScience = product.science.length ? product.science : fallbackScienceSteps(product);
  const enrichedFeatureBadges = product.featureBadges.length ? product.featureBadges : fallbackFeatureBadges(product);
  const enrichedEvidencePoints = product.evidencePoints.length ? product.evidencePoints : fallbackEvidencePoints(product);
  const enrichedSupplementFacts = product.supplementFacts.length ? product.supplementFacts : fallbackSupplementFacts(product);
  const enrichedFaq = product.faq.length ? product.faq : fallbackFaq(product);
  const displayIngredients = fallbackIngredients(product);
  const scienceVisual = product.metafields?.scienceVisual
    ? {
      ...fallbackScienceVisual,
      backgroundImage: product.metafields.scienceVisual.src,
      backgroundImageAlt: product.metafields.scienceVisual.alt,
    }
    : fallbackScienceVisual;
  const productGallery = product.galleryImages?.length
    ? product.galleryImages
    : PRODUCT_GALLERIES[product.handle] ?? fallbackGallery(product);
  const comparisonRows = product.comparisonRows !== undefined ? product.comparisonRows : COMPARISON_ROWS;
  const comparisonBioaroLabel = product.metafields?.comparisonBioaroLabel ?? `BioAro ${product.title.replace(/\+$/, "")}`;
  const comparisonTypicalLabel = product.metafields?.comparisonTypicalLabel ?? "Typical supplement";
  const routineProducts = product.relatedProducts?.length
    ? product.relatedProducts.map((related) => catalog.find((item) => item.handle === related.handle) ?? related)
    : routineMates;
  const bottomCtaPrimary = product.bottomCtaPrimary;
  const bottomCtaSecondary = product.bottomCtaSecondary;
  const hasBestFor = product.bestFor.trim().length > 0;
  const hasBenefits = product.benefits.length > 0;
  const hasWhyItems = enrichedWhyItems.length > 0;
  const hasFeatureBadges = enrichedFeatureBadges.length > 0;
  const hasScience = enrichedScience.length > 0;
  const hasIngredients = displayIngredients.length > 0;
  const hasEvidence = enrichedEvidencePoints.length > 0 || showGraph;
  const hasComparison = comparisonRows.length > 0;
  const hasSupplementFacts = enrichedSupplementFacts.length > 0;
  const hasWarnings = product.warnings.length > 0;
  const hasFaq = enrichedFaq.length > 0;
  const canAddToCart = product.availableForSale && hasLiveShopifyVariant(product);

  async function handleAddToCart() {
    if (!product || !canAddToCart || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await addProduct(product, 1);
    } finally {
      setIsAddingToCart(false);
    }
  }

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <Link to={marketHref(ROUTES.shop)} className="text-sm text-ink/50 hover:text-ink">
          &larr; Shop
        </Link>

        {/* Hero */}
        <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_0.95fr]">
          {productGallery ? (
            <ProductMediaGallery images={productGallery} />
          ) : (
            <div className="flex items-center justify-center rounded-[32px] bg-[#EDEBE4] p-8 lg:p-12">
              {product.image ? (
                <img src={product.image.src} alt={product.image.alt} className="h-auto w-full max-w-[360px] object-contain drop-shadow-[0_24px_48px_rgba(27,26,23,0.18)]" />
              ) : (
                <PlaceholderBottle initials={initialsFor(product.title)} className="w-full max-w-[240px]" />
              )}
            </div>
          )}

          <div>
            <span className="eyebrow">{product.metafields?.heroEyebrow ?? product.category}</span>
            <h1 className="mt-3 text-4xl md:text-5xl">{product.title}</h1>
            <p className="mt-3 text-forest-600">{product.tagline}</p>

            <p className="mt-5 text-ink/60 leading-relaxed">{product.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/55">
                  {tag}
                </span>
              ))}
            </div>

            {hasFeatureBadges && (
              <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {enrichedFeatureBadges.map((item) => {
                  const Icon = BADGE_ICONS[item.icon];
                  return (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-[rgba(255,255,255,0.56)] px-2 py-4 text-center shadow-[0_12px_28px_-24px_rgba(27,26,23,0.24)]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-600/10 text-forest-600">
                        <Icon size={18} />
                      </div>
                      <p className="text-[11px] font-medium uppercase leading-tight tracking-[0.02em] text-ink/60">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="glass-card mt-6 flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-medium">{product.packName ?? product.supplyLabel}</p>
                <p className="mt-1 text-sm text-ink/55">{product.servings}</p>
              </div>
              <p className="font-display text-3xl">
                {formatMoneyOrPending(product.price.amount, country)}
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => void handleAddToCart()}
                disabled={!canAddToCart || isAddingToCart}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(27,26,23,0.65)] transition hover:bg-forest-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 disabled:cursor-not-allowed disabled:bg-ink/25 disabled:text-white/75"
              >
                <span>{isAddingToCart ? "Adding..." : canAddToCart ? "Add to cart" : "Currently unavailable"}</span>
                <ArrowRight size={16} />
              </button>
              {cartError && (
                <p role="alert" className="mt-3 text-sm text-[#9f3d2c]">
                  {cartError}
                </p>
              )}
              {!canAddToCart && (
                <p className="mt-3 text-xs leading-relaxed text-ink/45">
                  Add to cart appears once this product has an active Shopify variant available in your selected market.
                </p>
              )}
              {product.availabilityNote ? (
                <p className="mt-3 text-xs leading-relaxed text-ink/45">{product.availabilityNote}</p>
              ) : null}
            </div>
            {hasBestFor && (
              <div className="mt-4 rounded-[22px] border border-ink/10 bg-[rgba(255,255,255,0.56)] px-4 py-4 shadow-[0_12px_28px_-24px_rgba(27,26,23,0.24)]">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-forest-600">
                  {product.bestForLabel ?? product.metafields?.bestForLabel ?? "Best for"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{product.bestFor}</p>
              </div>
            )}

            {hasBenefits && (
              <div className="mt-8">
                <h2 className="text-xl">Benefits</h2>
                <ul className="mt-4 space-y-3">
                  {product.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-sm text-ink/65">
                      <Check size={16} className="mt-0.5 shrink-0 text-forest-600" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Why this product */}
        {hasWhyItems && (
          <section className="mt-24">
            <span className="eyebrow">{product.metafields?.whyFormulaEyebrow ?? `Why ${product.title}?`}</span>
            <h2 className="mt-2 max-w-xl text-3xl">
              {product.metafields?.whyFormulaHeadline ?? "Built around what matters for this routine, not everything at once."}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {enrichedWhyItems.map((item) => {
                const Icon = WHY_ICONS[item.icon];
                return (
                  <div key={item.title} className="text-center md:text-left">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-600/10 text-forest-600 md:mx-0">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/55">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Science behind the formula */}
        {hasScience && (
          <ScienceFormulaVisual
            backgroundImage={scienceVisual.backgroundImage}
            backgroundImageAlt={scienceVisual.backgroundImageAlt}
            backgroundPosition={scienceVisual.backgroundPosition}
            formulaSteps={enrichedScience}
            eyebrow={product.metafields?.scienceEyebrow}
            headline={product.metafields?.scienceHeadline}
          />
        )}

        {/* Key ingredients */}
        {hasIngredients && (
          <section className="mt-24">
            <div className="flex items-end justify-between">
              <div>
                <span className="eyebrow">{product.metafields?.ingredientsEyebrow ?? "Key ingredients"}</span>
                <h2 className="mt-2 text-3xl">
                  {product.metafields?.ingredientsHeadline ?? "Clinically studied. Purposefully dosed."}
                </h2>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {displayIngredients.map((ingredient) => (
                <IngredientCard key={ingredient.name} ingredient={ingredient} />
              ))}
            </div>
          </section>
        )}

        {product.otherIngredients && product.otherIngredients.length > 0 && (
          <OtherIngredientsSection items={product.otherIngredients} />
        )}

        {/* Backed by science + comparison */}
        {(hasEvidence || hasComparison) && (
          <div className="mt-24 grid gap-5 lg:grid-cols-2">
            {hasEvidence && (
              <section className="glass-card p-6 md:p-8" style={{ background: "linear-gradient(180deg, #EEF2EC, #F8F6F4)" }}>
                <h2 className="text-2xl">{product.metafields?.evidenceHeadline ?? "Backed by science"}</h2>
                {enrichedEvidencePoints.length > 0 && (
                  <ul className="mt-5 space-y-3 text-sm">
                    {enrichedEvidencePoints.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-ink/70">
                        <Check size={16} className="shrink-0 text-forest-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {showGraph && (
                  <div className="mt-6 rounded-2xl bg-white/60 p-5">
                    <p className="text-sm font-medium">{product.efficacyMetric.label}</p>
                    <div className="mt-6 flex items-end justify-center gap-10">
                      <div className="text-center">
                        <div
                          className="mx-auto w-10 rounded-t-md bg-sand"
                          style={{ height: `${(product.efficacyMetric.placeboValue / maxEfficacy) * 96}px` }}
                        />
                        <p className="mt-2 text-xs text-ink/45">Placebo</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="mx-auto w-10 rounded-t-md bg-forest-600"
                          style={{ height: `${(product.efficacyMetric.productValue / maxEfficacy) * 96}px` }}
                        />
                        <p className="mt-2 text-xs text-ink/45">{product.title}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-center text-[11px] text-ink/40">{product.efficacyMetric.caption}</p>
                  </div>
                )}
              </section>
            )}

            {hasComparison && (
              <section className="glass-card p-7 md:p-10">
                <h2 className="text-[28px] leading-tight md:text-[34px]">{product.metafields?.comparisonHeadline ?? "BioAro vs. typical supplements"}</h2>
                <div className="mt-6 divide-y divide-ink/10 text-[15px] md:text-[17px]">
                  <div className="grid grid-cols-3 gap-4 pb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/45 md:text-[12px]">
                    <span />
                    <span>{comparisonBioaroLabel}</span>
                    <span>{comparisonTypicalLabel}</span>
                  </div>
                  {comparisonRows.map((row) => (
                    <div key={row.label} className="grid grid-cols-3 items-center gap-4 py-4 md:py-5">
                      <span className="text-ink/60">{row.label}</span>
                      <span className="font-medium text-forest-600">{row.bioaro}</span>
                      <span className="text-ink/40">{row.typical}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Complete your daily routine */}
        {routineProducts.length > 0 && (
          <section className="glass-card mt-24 p-6 md:p-8">
            <span className="eyebrow">{product.metafields?.bundleEyebrow ?? "Complete your daily routine"}</span>
            <h2 className="mt-2 text-2xl">{product.metafields?.bundleHeadline ?? "Stack your supplements. Amplify your results."}</h2>
            {product.metafields?.bundleDescription ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">{product.metafields.bundleDescription}</p>
            ) : null}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {routineProducts.map((mate) => (
                <Link
                  key={mate.handle}
                  to={marketHref(("tagline" in mate ? `/products/${mate.handle}` : (mate.link ?? `/products/${mate.handle}`)))}
                  className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/50 p-4 transition-colors hover:bg-white"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f1eee6] p-2">
                    {mate.image ? (
                      <img src={mate.image.src} alt={mate.image.alt} className="h-full w-full object-contain" />
                    ) : (
                      <PlaceholderBottle initials={initialsFor(mate.title ?? mate.handle)} className="h-full w-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{mate.title}</p>
                    <p className="text-xs text-ink/45">{"tagline" in mate ? mate.tagline : mate.description}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-ink/30" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {product.testimonials && product.testimonials.length > 0 && (
          <section className="mt-24">
            <span className="eyebrow">What people are saying</span>
            <h2 className="mt-2 text-3xl">Real results from real customers.</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {product.testimonials.map((testimonial) => (
                <div key={testimonial.name} className="glass-card p-6">
                  <Quote size={20} className="text-forest-600/40" />
                  <p className="mt-4 text-sm leading-relaxed text-ink/70">{testimonial.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-600/10 text-xs font-medium text-forest-600">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-ink/45">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Supplement facts + warnings */}
        {(hasSupplementFacts || hasWarnings) && (
          <div className="mt-24 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            {hasSupplementFacts && (
              <section className="glass-card p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl">{product.metafields?.supplementFactsHeadline ?? "Supplement facts"}</h2>
                <div className="mt-5 divide-y divide-ink/10">
                  {enrichedSupplementFacts.map((fact) => (
                    <div key={fact.label} className="flex items-start justify-between gap-3 py-3 text-sm">
                      <span className="shrink-0 text-ink/55">{fact.label}</span>
                      <span className="font-medium text-right">{fact.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-ink/10 bg-white/45 px-4 py-4 text-sm leading-relaxed text-ink/55">
                  {REGION_DISCLAIMERS[region]}
                </div>
              </section>
            )}

            {hasWarnings && (
              <section className="glass-card p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl">{product.metafields?.warningsHeadline ?? "Warnings"}</h2>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink/60">
                  {product.warnings.map((warning) => (
                    <li key={warning} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-forest-600 shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {/* Quality & Purity — above FAQ */}
        <QualityPurityStrip
          title={product.metafields?.qualityHeadline ?? "Quality & Purity"}
          productHandle={product.handle}
          qualityBadges={product.qualityBadges}
        />

        {/* FAQ */}
        {hasFaq && (
          <section className="mt-12 max-w-3xl">
            <span className="eyebrow">{product.metafields?.faqEyebrow ?? "FAQ"}</span>
            <h2 className="mt-2 mb-6 text-3xl">
              {product.metafields?.faqHeadline ?? "Frequently asked questions"}
            </h2>
            <AccordionGroup
              items={enrichedFaq.map((item) => ({
                title: item.question,
                body: item.answer,
              }))}
            />
          </section>
        )}

        {/* Bottom CTA banners */}
        <div className="mt-24 grid gap-5 md:grid-cols-2">
          <div className="glass-dark flex flex-col justify-between rounded-[24px] p-8 text-white">
            <div>
              <h3 className="text-2xl">{bottomCtaPrimary?.headline ?? "Ready to invest in your future?"}</h3>
              <p className="mt-2 text-sm text-white/60">{bottomCtaPrimary?.text ?? "Every healthier tomorrow begins with today's decisions."}</p>
            </div>
            <Link to={marketHref(bottomCtaPrimary?.buttonLink ?? ROUTES.shop)} className="btn-secondary mt-6 !border-white/20 !text-white hover:!bg-white/10">
              {bottomCtaPrimary?.buttonLabel ?? "Browse all formulas"}
            </Link>
          </div>
          <div className="rounded-[24px] bg-[#EEF2EC] p-8">
            <h3 className="text-2xl">{bottomCtaSecondary?.headline ?? "Want a more personalized approach?"}</h3>
            <p className="mt-2 text-sm text-ink/60">{bottomCtaSecondary?.text ?? "Take the quiz to build a routine matched to your goals."}</p>
            <Link to={marketHref(bottomCtaSecondary?.buttonLink ?? ROUTES.quiz)} className="btn-primary mt-6">
              {bottomCtaSecondary?.buttonLabel ?? "Take the quiz"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
