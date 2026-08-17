import type {
  CatalogProduct,
  FeatureBadgeIcon,
  MetafieldComparisonRow,
  MetafieldTestimonial,
  MetafieldTitleTextItem,
  ProductBottomCta,
  ProductEditorial,
  ProductCategory,
  ProductFeatureBadge,
  ProductGalleryImage,
  ProductHeroBadge,
  ProductIngredient,
  ProductMetafields,
  ProductQualityBadge,
  ProductRelatedProduct,
  ProductScienceStep,
  ProductWhyItem,
  ShopifyProduct,
} from "./types";
import type { CountryCode } from "../market/types";

/*
 * The only bridge between authored Shopify values and the app's categories. Keys are
 * matched lowercased (see `productCategory`), so casing in Shopify is tolerant.
 *
 * `wellness` is deliberately ABSENT. It used to catch 12 of 30 products, and those
 * products have been redistributed individually — aliasing the old value to any single
 * new one would silently mis-file sleep products as foundations, or vice versa. An
 * unmapped value returns undefined, which now reads as "uncategorised" rather than
 * defaulting into a bucket, so the gap is visible until Shopify is rewritten.
 */
const CATEGORY_BY_METAFIELD_VALUE: Record<string, ProductCategory> = {
  longevity: "Longevity",
  focus: "Focus",
  energy: "Energy",
  performance: "Performance",
  recovery: "Recovery",
  sleep: "Sleep & Calm",
  hormonal: "Hormonal Health",
  foundations: "Daily Foundations",
};

const KNOWN_WHY_ICONS = new Set(["energy", "aging", "balance", "heart", "brain", "shield", "flame", "droplet", "sparkle"]);

export interface ShopifyMetafieldNode {
  key: string;
  value: string;
  type: string;
  reference?: ShopifyReference | null;
  references?: { nodes: ShopifyMetaobjectReference[] } | null;
}

export interface ShopifyImageReference {
  image?: { url: string; altText?: string | null } | null;
}

export interface ShopifyReference extends ShopifyImageReference {
  fields?: Array<{
    key: string;
    value: string;
    reference?: ShopifyImageReference | null;
  }>;
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

function whyIcon(value: string | undefined): ProductWhyItem["icon"] {
  return (value && KNOWN_WHY_ICONS.has(value) ? value : "shield") as ProductWhyItem["icon"];
}

/*
 * Accepts the shapes the store ACTUALLY uses, not only the one this parser was
 * written against.
 *
 * Three metafields held real content on every one of the seven live products and all
 * of it was being discarded here:
 *
 *  - `faqs` is authored as [{question, answer}]. Neither key was recognised, so the
 *    FAQ silently fell back to editorial copy and the CMS entry did nothing.
 *  - `trust_badges` and `clinical_evidence` are authored as [{title}] with no second
 *    field. The old `title && text` guard rejected every row, so both always came
 *    from editorial too.
 *
 * A title-only row is now valid and carries an empty `text`; callers already render
 * the title alone where that is all there is.
 *
 * FOLLOW-UP (audit, 2026-08-17): two callers did NOT. `trustNotes` and `evidencePoints`
 * mapped `.text` straight out, so a title-only row reached the page as an empty string —
 * eight products were rendering blank trust and evidence rows while auditing as populated.
 * Both now fall back to the title, which is the only content those rows have. This unlocks roughly fourteen fields'
 * worth of populated content across seven products without any data entry.
 */
function titleTextItems(value: string): MetafieldTitleTextItem[] | undefined {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;

    const items = parsed.flatMap((item) => {
      const record = asRecord(item);
      const title =
        textFrom(record?.title) ??
        textFrom(record?.name) ??
        textFrom(record?.label) ??
        textFrom(record?.question);
      const text =
        textFrom(record?.text) ??
        textFrom(record?.description) ??
        textFrom(record?.value) ??
        textFrom(record?.answer);
      // A row with only a heading is still content. A row with only a body is not —
      // there is nowhere to put it.
      return title ? [{ title, text: text ?? "" }] : [];
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

/*
 * Line-separated prose, for fields whose entries are SENTENCES rather than terms.
 *
 * `textList` above splits on commas, which is correct for `hero_tags` and
 * `other_ingredients` — those really are comma-delimited lists. It is wrong for
 * `warnings`, where every entry is a sentence that contains commas: the live UK
 * warning "Consult your healthcare professional before use if you are pregnant,
 * breastfeeding, taking medication or have a medical condition." was rendering as
 * three separate bullets, one of which was the single word "breastfeeding".
 *
 * Newlines only. A JSON array is still honoured first.
 */
function sentenceList(value: string | undefined): string[] | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const values = parsed.flatMap((item) => (typeof item === "string" && item.trim() ? [item.trim()] : []));
      if (values.length) return values;
    }
  } catch {
    // Plain-text metafields are supported below.
  }

  const values = value.split(/\r?\n+/).map((item) => item.trim()).filter(Boolean);
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

function imageItem(reference: ShopifyImageReference | null | undefined, fallbackAlt: string) {
  const image = reference?.image;
  return image?.url ? { src: image.url, alt: image.altText ?? fallbackAlt } : undefined;
}

function fieldMap(reference: ShopifyMetaobjectReference) {
  return new Map((reference.fields ?? []).map((field) => [field.key, field]));
}

function galleryReferenceItems(references: ShopifyMetaobjectReference[] | undefined): ProductGalleryImage[] | undefined {
  if (!references?.length) return undefined;
  const gallery = references.flatMap((reference) => {
    const fields = fieldMap(reference);
    const imageField = fields.get("image") ?? fields.get("file");
    const image = imageItem(imageField?.reference, fields.get("alt")?.value?.trim() ?? "Product gallery image");
    if (!image) return [];
    return [{
      ...image,
      fit: (fields.get("fit")?.value?.trim() as ProductGalleryImage["fit"] | undefined) ?? "contain",
      position: fields.get("position")?.value?.trim() || undefined,
    }];
  });
  return gallery.length ? gallery : undefined;
}

function heroBadgeReferences(references: ShopifyMetaobjectReference[] | undefined): ProductHeroBadge[] | undefined {
  if (!references?.length) return undefined;
  const badges = references.flatMap((reference) => {
    const fields = fieldMap(reference);
    const title = fields.get("title")?.value?.trim() || fields.get("label")?.value?.trim();
    if (!title) return [];
    return [{
      icon: fields.get("icon")?.value?.trim() || undefined,
      title,
      text: fields.get("text")?.value?.trim() || fields.get("description")?.value?.trim() || undefined,
    }];
  });
  return badges.length ? badges : undefined;
}

function whyPillarReferences(references: ShopifyMetaobjectReference[] | undefined): ProductWhyItem[] | undefined {
  if (!references?.length) return undefined;
  const pillars = references.flatMap((reference) => {
    const fields = fieldMap(reference);
    const title = fields.get("title")?.value?.trim();
    const description = fields.get("description")?.value?.trim() || fields.get("text")?.value?.trim();
    if (!title || !description) return [];
    return [{
      icon: whyIcon(fields.get("icon")?.value?.trim()),
      title,
      description,
    }];
  });
  return pillars.length ? pillars : undefined;
}

function scienceCardReferences(references: ShopifyMetaobjectReference[] | undefined): ProductScienceStep[] | undefined {
  if (!references?.length) return undefined;
  const cards = references.flatMap((reference) => {
    const fields = fieldMap(reference);
    const title = fields.get("title")?.value?.trim();
    const description = fields.get("description")?.value?.trim() || fields.get("text")?.value?.trim();
    if (!title || !description) return [];
    return [{
      icon: fields.get("icon")?.value?.trim() || undefined,
      title,
      description,
    }];
  });
  return cards.length ? cards : undefined;
}

function relatedProductReferences(references: ShopifyMetaobjectReference[] | undefined): ProductRelatedProduct[] | undefined {
  if (!references?.length) return undefined;
  const items = references.flatMap((reference) => {
    const fields = fieldMap(reference);
    const handle = fields.get("product_handle")?.value?.trim() || fields.get("handle")?.value?.trim();
    if (!handle) return [];
    return [{
      handle,
      title: fields.get("title")?.value?.trim() || undefined,
      description: fields.get("description")?.value?.trim() || fields.get("text")?.value?.trim() || undefined,
      image: imageItem(fields.get("image")?.reference, fields.get("title")?.value?.trim() || handle),
      link: fields.get("link")?.value?.trim() || undefined,
    }];
  });
  return items.length ? items : undefined;
}

function qualityBadgeReferences(references: ShopifyMetaobjectReference[] | undefined): ProductQualityBadge[] | undefined {
  if (!references?.length) return undefined;
  const badges = references.flatMap((reference) => {
    const fields = fieldMap(reference);
    const title = fields.get("title")?.value?.trim() || fields.get("label")?.value?.trim();
    if (!title) return [];
    const enabledValue = fields.get("enabled")?.value?.trim().toLowerCase();
    return [{
      icon: fields.get("icon")?.value?.trim() || undefined,
      title,
      text: fields.get("text")?.value?.trim() || fields.get("description")?.value?.trim() || undefined,
      enabled: enabledValue ? enabledValue !== "false" : true,
    }];
  });
  return badges.length ? badges : undefined;
}

function bottomCtaReference(reference: ShopifyMetaobjectReference | null | undefined): ProductBottomCta | undefined {
  if (!reference) return undefined;
  const fields = fieldMap(reference);
  const headline = fields.get("headline")?.value?.trim();
  const buttonLabel = fields.get("button_label")?.value?.trim();
  const buttonLink = fields.get("button_link")?.value?.trim();
  if (!headline || !buttonLabel || !buttonLink) return undefined;
  return {
    headline,
    text: fields.get("text")?.value?.trim() || fields.get("supporting_text")?.value?.trim() || undefined,
    buttonLabel,
    buttonLink,
  };
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
    heroEyebrow: str("hero_eyebrow"),
    pdpSubtitle: str("pdp_subtitle"),
    shortDescription: str("short_description"),
    heroTags: str("hero_tags"),
    heroBullets: str("hero_bullets"),
    heroBadges: heroBadgeReferences(byKey.get("hero_badges")?.references?.nodes),
    galleryImages: galleryReferenceItems(byKey.get("gallery_images")?.references?.nodes),
    packName: str("pack_name"),
    supplyLabel: str("supply_label"),
    availabilityNote: str("availability_note"),
    bestForLabel: str("best_for_label"),
    bestForDescription: str("best_for_description"),
    servingSize: str("serving_size"),
    servingsPerContainer: str("servings_per_container"),
    productFormat: str("product_format"),
    directions: str("directions"),
    warningsHeadline: str("warnings_headline"),
    warnings: str("warnings"),
    storageInstructions: str("storage_instructions"),
    safetySeal: str("safety_seal"),
    allergenInfo: str("allergen_info"),
    otherIngredients: textList(str("other_ingredients")),
    disclaimer: str("disclaimer"),
    ratingAverage: num("rating_average"),
    ratingCount: num("rating_count"),
    ratingLabel: str("rating_label"),
    whyFormulaEyebrow: str("why_formula_eyebrow"),
    whyFormulaHeadline: str("why_formula_headline"),
    whyFormulaBody: str("why_formula_body"),
    whyPillars: whyPillarReferences(byKey.get("why_pillars")?.references?.nodes),
    scienceEyebrow: str("science_eyebrow"),
    scienceHeadline: str("science_headline"),
    scienceCards: scienceCardReferences(byKey.get("science_cards")?.references?.nodes),
    ingredientsEyebrow: str("ingredients_eyebrow"),
    ingredientsHeadline: str("ingredients_headline"),
    supplementFactsHeadline: str("supplement_facts_headline"),
    evidenceHeadline: str("evidence_headline"),
    comparisonHeadline: str("comparison_headline"),
    comparisonBioaroLabel: str("comparison_bioaro_label"),
    comparisonTypicalLabel: str("comparison_typical_label"),
    qualityHeadline: str("quality_headline"),
    faqEyebrow: str("faq_eyebrow"),
    faqHeadline: str("faq_headline"),
    bundleEyebrow: str("bundle_eyebrow"),
    bundleHeadline: str("bundle_headline"),
    bundleDescription: str("bundle_description"),
    relatedProducts: relatedProductReferences(byKey.get("related_products")?.references?.nodes),
    trustBadges: items("trust_badges"),
    benefitCards: items("benefit_cards"),
    scienceSteps: items("science_steps"),
    ingredients: str("ingredients"),
    ingredientDetails: ingredientReferenceItems(byKey.get("ingredient_details")?.references?.nodes),
    scienceVisual: productImageReference(byKey.get("science_visual")?.reference, "Product science visual"),
    supplementFactsRows: items("supplement_facts_rows"),
    clinicalEvidence: items("clinical_evidence"),
    comparisonRows: comparisonRows(str("comparison_rows")),
    qualityBadges: qualityBadgeReferences(byKey.get("quality_badges")?.references?.nodes),
    faqs: items("faqs"),
    testimonials: testimonials(str("testimonials")),
    bottomCtaPrimary: bottomCtaReference(byKey.get("bottom_cta_primary")?.reference),
    bottomCtaSecondary: bottomCtaReference(byKey.get("bottom_cta_secondary")?.reference),
    labsCta: str("labs_cta"),
    finalCta: str("final_cta"),
    featureBadges: featureBadgeItems(str("pdp_badges")),
  };
}

function applyMetafields(editorial: ProductEditorial, shopifyProduct: ShopifyProduct): ProductEditorial {
  const metafields = shopifyProduct.metafields;
  const benefitItems = metafields?.benefitCards;
  const warnings = [
    ...(sentenceList(metafields?.warnings) ?? editorial.warnings),
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
    galleryImages: metafields?.galleryImages ?? editorial.galleryImages,
    tags: textList(metafields?.heroTags) ?? editorial.tags,
    bestForLabel: metafields?.bestForLabel || editorial.bestForLabel,
    supplyLabel: metafields?.supplyLabel || editorial.supplyLabel,
    packName: metafields?.packName || editorial.packName,
    availabilityNote: metafields?.availabilityNote || editorial.availabilityNote,
    servings: metafields?.servingSize || editorial.servings,
    bestFor: metafields?.bestForDescription || metafields?.whyFormulaBody || editorial.bestFor,
    dosage: metafields?.directions || editorial.dosage,
    rating: {
      average: metafields?.ratingAverage ?? editorial.rating.average,
      count: metafields?.ratingCount ?? editorial.rating.count,
    },
    benefits: benefitItems?.map((item) => item.text) ?? textList(metafields?.heroBullets) ?? editorial.benefits,
    whyItems: metafields?.whyPillars ?? whyItemsForKnownProduct(editorial, benefitItems),
    trustNotes: metafields?.trustBadges?.map((item) => item.text || item.title) ?? editorial.trustNotes,
    featureBadges: metafields?.featureBadges ?? editorial.featureBadges ?? [],
    heroBadges: metafields?.heroBadges ?? editorial.heroBadges,
    warnings,
    qualityBadges: metafields?.qualityBadges ?? editorial.qualityBadges,
    // A basic Shopify text list cannot replace the approved ingredient cards.
    // Only the rich, image-capable reference field is authoritative for a known PDP.
    ingredients: ingredientDetailsForKnownProduct(editorial.ingredients, metafields?.ingredientDetails),
    otherIngredients: metafields?.otherIngredients ?? editorial.otherIngredients,
    supplementFacts: facts(metafields?.supplementFactsRows) ?? editorial.supplementFacts,
    evidencePoints: metafields?.clinicalEvidence?.map((item) => item.text || item.title) ?? editorial.evidencePoints,
    science: metafields?.scienceCards ?? science(metafields?.scienceSteps) ?? editorial.science,
    faq: metafields?.faqs?.map((item) => ({ question: item.title, answer: item.text })) ?? editorial.faq,
    testimonials: metafields?.testimonials ?? editorial.testimonials,
    comparisonRows: metafields?.comparisonRows ?? editorial.comparisonRows,
    relatedProducts: metafields?.relatedProducts ?? editorial.relatedProducts,
    bottomCtaPrimary: metafields?.bottomCtaPrimary ?? editorial.bottomCtaPrimary,
    bottomCtaSecondary: metafields?.bottomCtaSecondary ?? editorial.bottomCtaSecondary,
    metafields,
  };
}

export function mergeShopifyProduct(previewProduct: ProductEditorial, shopifyProduct: ShopifyProduct, country: CountryCode): CatalogProduct {
  const editorial = applyMetafields(previewProduct, shopifyProduct);
  const alignedUsdPrice = ROCKTOMIC_USD_PRICE_BY_HANDLE[shopifyProduct.handle];
  return {
    ...editorial,
    priceByCountry: {
      ...editorial.priceByCountry,
      ...(alignedUsdPrice !== undefined ? { US: alignedUsdPrice } : {}),
      [country]: shopifyProduct.price.amount,
    },
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
  const alignedUsdPrice = ROCKTOMIC_USD_PRICE_BY_HANDLE[shopifyProduct.handle];
  const warnings = [
    ...(sentenceList(metafields?.warnings) ?? []),
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
    galleryImages: metafields?.galleryImages,
    /* No invented default. An uncategorised product shows no category rather than
       being filed under one nobody chose. */
    category: metafields?.category,
    tags: textList(metafields?.heroTags) ?? [],
    bestFor: metafields?.bestForDescription || metafields?.whyFormulaBody || "",
    bestForLabel: metafields?.bestForLabel,
    dosage: metafields?.directions || "",
    servings: metafields?.servingSize || "",
    supplyLabel: metafields?.supplyLabel || "",
    packName: metafields?.packName,
    availabilityNote: metafields?.availabilityNote,
    rating: { average: metafields?.ratingAverage ?? 0, count: metafields?.ratingCount ?? 0 },
    benefits: metafields?.benefitCards?.map((item) => item.text) ?? textList(metafields?.heroBullets) ?? [],
    whyItems: metafields?.whyPillars ?? metafields?.benefitCards?.map((item) => ({ icon: "shield" as const, title: item.title, description: item.text })) ?? [],
    trustNotes: metafields?.trustBadges?.map((item) => item.text || item.title) ?? [],
    featureBadges: metafields?.featureBadges ?? [],
    heroBadges: metafields?.heroBadges,
    warnings,
    qualityBadges: metafields?.qualityBadges,
    ingredients: metafields?.ingredientDetails ?? ingredientItems(metafields?.ingredients) ?? [],
    otherIngredients: metafields?.otherIngredients,
    supplementFacts: facts(metafields?.supplementFactsRows) ?? [],
    science: metafields?.scienceCards ?? science(metafields?.scienceSteps) ?? [],
    evidencePoints: metafields?.clinicalEvidence?.map((item) => item.text || item.title) ?? [],
    efficacyMetric: { label: "", unit: "", placeboValue: 0, productValue: 0, caption: "" },
    faq: metafields?.faqs?.map((item) => ({ question: item.title, answer: item.text })) ?? [],
    testimonials: metafields?.testimonials,
    comparisonRows: metafields?.comparisonRows ?? [],
    relatedProducts: metafields?.relatedProducts,
    bottomCtaPrimary: metafields?.bottomCtaPrimary,
    bottomCtaSecondary: metafields?.bottomCtaSecondary,
    priceByCountry: {
      ...(alignedUsdPrice !== undefined ? { US: alignedUsdPrice } : {}),
      [country]: shopifyProduct.price.amount,
    },
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
import { ROCKTOMIC_USD_PRICE_BY_HANDLE } from "../../data/rocktomicUsdPrices";
