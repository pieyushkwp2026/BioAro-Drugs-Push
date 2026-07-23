import type {
  CatalogProduct,
  MetafieldComparisonRow,
  MetafieldTestimonial,
  MetafieldTitleTextItem,
  ProductEditorial,
  ProductIngredient,
  ProductMetafields,
  ProductScienceStep,
  ShopifyProduct,
} from "./types";
import type { CountryCode } from "../market/types";

export interface ShopifyMetafieldNode {
  key: string;
  value: string;
  type: string;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function textFrom(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function titleTextItems(value: string): MetafieldTitleTextItem[] | undefined {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;

    const items = parsed.flatMap((item) => {
      const record = asRecord(item);
      const title = textFrom(record?.title) ?? textFrom(record?.name) ?? textFrom(record?.label);
      const text = textFrom(record?.text) ?? textFrom(record?.description) ?? textFrom(record?.value);
      return title && text ? [{ title, text }] : [];
    });

    return items.length ? items : undefined;
  } catch {
    return undefined;
  }
}

function textList(value: string | undefined): string[] | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const values = parsed.flatMap((item) => {
        if (typeof item === "string") return item.trim() ? [item.trim()] : [];
        const record = asRecord(item);
        const text = textFrom(record?.text) ?? textFrom(record?.title) ?? textFrom(record?.name) ?? textFrom(record?.label);
        return text ? [text] : [];
      });
      return values.length ? values : undefined;
    }
  } catch {
    // Plain-text metafields are supported below.
  }

  const values = value.split(/\r?\n|\s*[,;]\s*/).map((item) => item.trim()).filter(Boolean);
  return values.length ? values : undefined;
}

function ingredientItems(value: string | undefined): ProductIngredient[] | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;

    const ingredients = parsed.flatMap((item) => {
      const record = asRecord(item);
      const name = textFrom(record?.name) ?? textFrom(record?.title);
      if (!name) return [];

      return [{
        name,
        amount: textFrom(record?.amount) ?? textFrom(record?.dose) ?? "",
        purpose: textFrom(record?.purpose) ?? textFrom(record?.description) ?? textFrom(record?.text) ?? "",
        whyIncluded: textFrom(record?.whyIncluded),
      }];
    });

    return ingredients.length ? ingredients : undefined;
  } catch {
    return undefined;
  }
}

function facts(items: MetafieldTitleTextItem[] | undefined) {
  return items?.map((item) => ({ label: item.title, value: item.text }));
}

function science(items: MetafieldTitleTextItem[] | undefined): ProductScienceStep[] | undefined {
  return items?.map((item) => ({ title: item.title, description: item.text }));
}

function comparisonRows(value: string | undefined): MetafieldComparisonRow[] | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;
    const rows = parsed.flatMap((item) => {
      const record = asRecord(item);
      const label = textFrom(record?.label);
      const bioaro = textFrom(record?.bioaro);
      const typical = textFrom(record?.typical);
      return label && bioaro && typical ? [{ label, bioaro, typical }] : [];
    });
    return rows.length ? rows : undefined;
  } catch {
    return undefined;
  }
}

function testimonials(value: string | undefined): MetafieldTestimonial[] | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;
    const entries = parsed.flatMap((item) => {
      const record = asRecord(item);
      const initials = textFrom(record?.initials);
      const name = textFrom(record?.name);
      const location = textFrom(record?.location);
      const quote = textFrom(record?.quote);
      return initials && name && location && quote ? [{ initials, name, location, quote }] : [];
    });
    return entries.length ? entries : undefined;
  } catch {
    return undefined;
  }
}

export function mapProductMetafields(nodes: (ShopifyMetafieldNode | null)[] | undefined): ProductMetafields | undefined {
  if (!nodes?.length) return undefined;

  const byKey = new Map<string, ShopifyMetafieldNode>();
  for (const node of nodes) {
    if (node) byKey.set(node.key, node);
  }

  const str = (key: string) => byKey.get(key)?.value;
  const num = (key: string) => {
    const value = str(key);
    const parsed = value === undefined ? undefined : Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };
  const items = (key: string) => {
    const value = str(key);
    return value ? titleTextItems(value) : undefined;
  };

  return {
    pdpSubtitle: str("pdp_subtitle"),
    shortDescription: str("short_description"),
    heroTags: str("hero_tags"),
    heroBullets: str("hero_bullets"),
    supplyLabel: str("supply_label"),
    servingSize: str("serving_size"),
    directions: str("directions"),
    warnings: str("warnings"),
    storageInstructions: str("storage_instructions"),
    allergenInfo: str("allergen_info"),
    disclaimer: str("disclaimer"),
    ratingAverage: num("rating_average"),
    ratingCount: num("rating_count"),
    ratingLabel: str("rating_label"),
    whyFormulaHeadline: str("why_formula_headline"),
    whyFormulaBody: str("why_formula_body"),
    scienceHeadline: str("science_headline"),
    ingredientsHeadline: str("ingredients_headline"),
    evidenceHeadline: str("evidence_headline"),
    faqHeadline: str("faq_headline"),
    bundleHeadline: str("bundle_headline"),
    bundleDescription: str("bundle_description"),
    trustBadges: items("trust_badges"),
    benefitCards: items("benefit_cards"),
    scienceSteps: items("science_steps"),
    ingredients: str("ingredients"),
    supplementFactsRows: items("supplement_facts_rows"),
    clinicalEvidence: items("clinical_evidence"),
    comparisonRows: comparisonRows(str("comparison_rows")),
    faqs: items("faqs"),
    testimonials: testimonials(str("testimonials")),
    labsCta: str("labs_cta"),
    finalCta: str("final_cta"),
  };
}

function applyMetafields(editorial: ProductEditorial, shopifyProduct: ShopifyProduct): ProductEditorial {
  const metafields = shopifyProduct.metafields;
  const benefitItems = metafields?.benefitCards;
  const warnings = [
    ...(textList(metafields?.warnings) ?? editorial.warnings),
    metafields?.storageInstructions ? `Storage: ${metafields.storageInstructions}` : undefined,
    metafields?.allergenInfo ? `Allergens: ${metafields.allergenInfo}` : undefined,
    metafields?.disclaimer,
  ].filter((item): item is string => Boolean(item));

  return {
    ...editorial,
    id: shopifyProduct.id,
    title: shopifyProduct.title || editorial.title,
    tagline: metafields?.pdpSubtitle || editorial.tagline,
    description: metafields?.shortDescription || shopifyProduct.description || editorial.description,
    image: shopifyProduct.image.src ? shopifyProduct.image : editorial.image,
    tags: textList(metafields?.heroTags) ?? editorial.tags,
    supplyLabel: metafields?.supplyLabel || editorial.supplyLabel,
    servings: metafields?.servingSize || editorial.servings,
    bestFor: metafields?.whyFormulaBody || editorial.bestFor,
    dosage: metafields?.directions || editorial.dosage,
    rating: {
      average: metafields?.ratingAverage ?? editorial.rating.average,
      count: metafields?.ratingCount ?? editorial.rating.count,
    },
    benefits: benefitItems?.map((item) => item.text) ?? textList(metafields?.heroBullets) ?? editorial.benefits,
    whyItems: benefitItems?.map((item) => ({ icon: "shield" as const, title: item.title, description: item.text })) ?? editorial.whyItems,
    trustNotes: metafields?.trustBadges?.map((item) => item.text) ?? editorial.trustNotes,
    warnings,
    ingredients: ingredientItems(metafields?.ingredients) ?? editorial.ingredients,
    supplementFacts: facts(metafields?.supplementFactsRows) ?? editorial.supplementFacts,
    evidencePoints: metafields?.clinicalEvidence?.map((item) => item.text) ?? editorial.evidencePoints,
    science: science(metafields?.scienceSteps) ?? editorial.science,
    faq: metafields?.faqs?.map((item) => ({ question: item.title, answer: item.text })) ?? editorial.faq,
    testimonials: metafields?.testimonials ?? editorial.testimonials,
    comparisonRows: metafields?.comparisonRows ?? editorial.comparisonRows,
    metafields,
  };
}

export function mergeShopifyProduct(previewProduct: ProductEditorial, shopifyProduct: ShopifyProduct, country: CountryCode): CatalogProduct {
  const editorial = applyMetafields(previewProduct, shopifyProduct);
  return {
    ...editorial,
    priceByCountry: { ...editorial.priceByCountry, [country]: shopifyProduct.price.amount },
    price: shopifyProduct.price,
    compareAtPrice: shopifyProduct.compareAtPrice,
    availableForSale: shopifyProduct.availableForSale,
    variantId: shopifyProduct.variantId,
  };
}

export function createShopifyProduct(shopifyProduct: ShopifyProduct, country: CountryCode): CatalogProduct {
  const metafields = shopifyProduct.metafields;
  const title = shopifyProduct.title;
  const warnings = [
    ...(textList(metafields?.warnings) ?? []),
    metafields?.storageInstructions ? `Storage: ${metafields.storageInstructions}` : undefined,
    metafields?.allergenInfo ? `Allergens: ${metafields.allergenInfo}` : undefined,
    metafields?.disclaimer,
  ].filter((item): item is string => Boolean(item));
  const editorial: ProductEditorial = {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title,
    tagline: metafields?.pdpSubtitle || shopifyProduct.description || "",
    description: metafields?.shortDescription || shopifyProduct.description || "",
    badge: undefined,
    image: shopifyProduct.image,
    category: "Wellness",
    tags: textList(metafields?.heroTags) ?? [],
    bestFor: metafields?.whyFormulaBody || "",
    dosage: metafields?.directions || "",
    servings: metafields?.servingSize || "",
    supplyLabel: metafields?.supplyLabel || "",
    rating: { average: metafields?.ratingAverage ?? 0, count: metafields?.ratingCount ?? 0 },
    benefits: metafields?.benefitCards?.map((item) => item.text) ?? textList(metafields?.heroBullets) ?? [],
    whyItems: metafields?.benefitCards?.map((item) => ({ icon: "shield" as const, title: item.title, description: item.text })) ?? [],
    trustNotes: metafields?.trustBadges?.map((item) => item.text) ?? [],
    warnings,
    ingredients: ingredientItems(metafields?.ingredients) ?? [],
    supplementFacts: facts(metafields?.supplementFactsRows) ?? [],
    science: science(metafields?.scienceSteps) ?? [],
    evidencePoints: metafields?.clinicalEvidence?.map((item) => item.text) ?? [],
    efficacyMetric: { label: "", unit: "", placeboValue: 0, productValue: 0, caption: "" },
    faq: metafields?.faqs?.map((item) => ({ question: item.title, answer: item.text })) ?? [],
    testimonials: metafields?.testimonials,
    comparisonRows: metafields?.comparisonRows,
    priceByCountry: { [country]: shopifyProduct.price.amount },
    metafields,
  };

  return {
    ...editorial,
    price: shopifyProduct.price,
    compareAtPrice: shopifyProduct.compareAtPrice,
    availableForSale: shopifyProduct.availableForSale,
    variantId: shopifyProduct.variantId,
  };
}
