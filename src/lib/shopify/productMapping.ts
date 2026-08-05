import type {
  CatalogProduct,
  FeatureBadgeIcon,
  MetafieldComparisonRow,
  MetafieldTestimonial,
  MetafieldTitleTextItem,
  ProductEditorial,
  ProductCategory,
  ProductFeatureBadge,
  ProductIngredient,
  ProductMetafields,
  ProductScienceStep,
  ShopifyProduct,
} from "./types";
import type { CountryCode } from "../market/types";

const CATEGORY_BY_METAFIELD_VALUE: Record<string, ProductCategory> = {
  longevity: "Longevity",
  wellness: "Wellness",
  focus: "Focus",
  energy: "Energy",
  performance: "Performance",
};

export interface ShopifyMetafieldNode {
  key: string;
  value: string;
  type: string;
  reference?: ShopifyImageReference | null;
  references?: { nodes: ShopifyMetaobjectReference[] } | null;
}

export interface ShopifyImageReference {
  image?: { url: string; altText?: string | null } | null;
}

export interface ShopifyMetaobjectReference {
  fields?: Array<{
    key: string;
    value: string;
    reference?: ShopifyImageReference | null;
  }>;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function textFrom(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function productCategory(value: string | undefined): ProductCategory | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized ? CATEGORY_BY_METAFIELD_VALUE[normalized] : undefined;
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

const KNOWN_BADGE_ICONS = new Set([
  "capsule", "noHassle", "routine", "travel", "quality", "omega",
  "meal", "sachet", "mix", "bag", "formula", "pure", "training", "dosed",
]);

function featureBadgeItems(value: string | undefined): ProductFeatureBadge[] | undefined {
  if (!value) return undefined;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;

    const items = parsed.flatMap((item) => {
      const record = asRecord(item);
      const label = textFrom(record?.label) ?? textFrom(record?.title) ?? textFrom(record?.text);
      const iconRaw = textFrom(record?.icon);
      const icon: FeatureBadgeIcon = (iconRaw && KNOWN_BADGE_ICONS.has(iconRaw) ? iconRaw : "quality") as FeatureBadgeIcon;
      return label ? [{ icon, label }] : [];
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
    const values = textList(value);
    return values?.map((name) => ({
      name,
      amount: "",
      purpose: "",
    }));
  }
}

function imageFromReference(reference: ShopifyImageReference | null | undefined): ProductIngredient["image"] | undefined {
  const image = reference?.image;
  return image?.url ? image.url : undefined;
}

function ingredientReferenceItems(references: ShopifyMetaobjectReference[] | undefined): ProductIngredient[] | undefined {
  if (!references?.length) return undefined;

  const ingredients = references.flatMap((reference) => {
    const fields = new Map((reference.fields ?? []).map((field) => [field.key, field]));
    const name = fields.get("name")?.value?.trim();
    if (!name) return [];

    const imageField = fields.get("image");
    return [{
      name,
      amount: fields.get("amount")?.value?.trim() ?? "",
      purpose: fields.get("purpose")?.value?.trim() ?? "",
      whyIncluded: fields.get("why_included")?.value?.trim() || undefined,
      image: imageFromReference(imageField?.reference),
    }];
  });

  return ingredients.length ? ingredients : undefined;
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function isCompleteIngredient(ingredient: ProductIngredient) {
  return Boolean(
    ingredient.name.trim()
    && ingredient.amount.trim()
    && ingredient.purpose.trim()
    && ingredient.whyIncluded?.trim()
    && ingredient.image,
  );
}

function ingredientDetailsForKnownProduct(
  editorialIngredients: ProductIngredient[],
  shopifyIngredients: ProductIngredient[] | undefined,
) {
  if (!shopifyIngredients?.length) return editorialIngredients;
  if (shopifyIngredients.every(isCompleteIngredient)) return shopifyIngredients;

  const shopifyByName = new Map(shopifyIngredients.map((ingredient) => [normalizeKey(ingredient.name), ingredient]));

  return editorialIngredients.map((editorialIngredient) => {
    const shopifyIngredient = shopifyByName.get(normalizeKey(editorialIngredient.name));
    if (!shopifyIngredient) return editorialIngredient;

    return {
      name: shopifyIngredient.name.trim() || editorialIngredient.name,
      amount: shopifyIngredient.amount.trim() || editorialIngredient.amount,
      purpose: shopifyIngredient.purpose.trim() || editorialIngredient.purpose,
      whyIncluded: shopifyIngredient.whyIncluded?.trim() || editorialIngredient.whyIncluded,
      image: shopifyIngredient.image || editorialIngredient.image,
    };
  });
}

function whyItemsForKnownProduct(editorial: ProductEditorial, benefitItems: MetafieldTitleTextItem[] | undefined) {
  if (!benefitItems?.length) return editorial.whyItems;
  if (benefitItems.length !== editorial.whyItems.length) return editorial.whyItems;

  return benefitItems.map((item, index) => ({
    ...editorial.whyItems[index],
    title: item.title,
    description: item.text,
  }));
}

function productImageReference(reference: ShopifyImageReference | null | undefined, fallbackAlt: string) {
  const image = reference?.image;
  return image?.url ? { src: image.url, alt: image.altText ?? fallbackAlt } : undefined;
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
    category: productCategory(str("category")),
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
    ingredientDetails: ingredientReferenceItems(byKey.get("ingredient_details")?.references?.nodes),
    scienceVisual: productImageReference(byKey.get("science_visual")?.reference, "Product science visual"),
    supplementFactsRows: items("supplement_facts_rows"),
    clinicalEvidence: items("clinical_evidence"),
    comparisonRows: comparisonRows(str("comparison_rows")),
    faqs: items("faqs"),
    testimonials: testimonials(str("testimonials")),
    labsCta: str("labs_cta"),
    finalCta: str("final_cta"),
    featureBadges: featureBadgeItems(str("pdp_badges")),
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
    category: metafields?.category ?? editorial.category,
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
    whyItems: whyItemsForKnownProduct(editorial, benefitItems),
    trustNotes: metafields?.trustBadges?.map((item) => item.text) ?? editorial.trustNotes,
    featureBadges: metafields?.featureBadges ?? editorial.featureBadges ?? [],
    warnings,
    // A basic Shopify text list cannot replace the approved ingredient cards.
    // Only the rich, image-capable reference field is authoritative for a known PDP.
    ingredients: ingredientDetailsForKnownProduct(editorial.ingredients, metafields?.ingredientDetails),
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
    isBestseller: shopifyProduct.isBestseller,
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
    category: metafields?.category ?? "Wellness",
    tags: textList(metafields?.heroTags) ?? [],
    bestFor: metafields?.whyFormulaBody || "",
    dosage: metafields?.directions || "",
    servings: metafields?.servingSize || "",
    supplyLabel: metafields?.supplyLabel || "",
    rating: { average: metafields?.ratingAverage ?? 0, count: metafields?.ratingCount ?? 0 },
    benefits: metafields?.benefitCards?.map((item) => item.text) ?? textList(metafields?.heroBullets) ?? [],
    whyItems: metafields?.benefitCards?.map((item) => ({ icon: "shield" as const, title: item.title, description: item.text })) ?? [],
    trustNotes: metafields?.trustBadges?.map((item) => item.text) ?? [],
    featureBadges: metafields?.featureBadges ?? [],
    warnings,
    ingredients: metafields?.ingredientDetails ?? ingredientItems(metafields?.ingredients) ?? [],
    supplementFacts: facts(metafields?.supplementFactsRows) ?? [],
    science: science(metafields?.scienceSteps) ?? [],
    evidencePoints: metafields?.clinicalEvidence?.map((item) => item.text) ?? [],
    efficacyMetric: { label: "", unit: "", placeboValue: 0, productValue: 0, caption: "" },
    faq: metafields?.faqs?.map((item) => ({ question: item.title, answer: item.text })) ?? [],
    testimonials: metafields?.testimonials,
    comparisonRows: metafields?.comparisonRows ?? [],
    priceByCountry: { [country]: shopifyProduct.price.amount },
    metafields,
  };

  return {
    ...editorial,
    price: shopifyProduct.price,
    compareAtPrice: shopifyProduct.compareAtPrice,
    availableForSale: shopifyProduct.availableForSale,
    isBestseller: shopifyProduct.isBestseller,
    variantId: shopifyProduct.variantId,
  };
}