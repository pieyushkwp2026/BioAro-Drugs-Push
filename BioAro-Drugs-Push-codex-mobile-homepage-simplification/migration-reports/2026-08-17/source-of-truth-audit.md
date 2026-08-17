# Shopify source-of-truth audit

Read-only. Measured against `PRODUCT_METAFIELD_DEFINITIONS` in `scripts/shopify-pdp-schema.mjs`.

| handle | found | status | storefront | media | sku | price | present | empty | absent |
|---|---|---|---|---|---|---|---|---|---|
| `sleepo` | yes | ACTIVE | visible | 6 | BACT-1C6D5 | 89.99 | 12 | 1 | 42 |
| `sleep0` | **no** | – | – | – | – | – | – | – | – |

## sleepo — SleepO

Published on: For bioarodrugs 25 july 2026, My Store Headless, Readonly inspector, My Store Headless 03, My Store Headless 04, Online Store, Shop, Point of Sale

### Missing (43 of 55)

- `custom.hero_eyebrow` (single_line_text_field) — absent
- `custom.gallery_images` (list.metaobject_reference) — absent
- `custom.hero_badges` (list.metaobject_reference) — absent
- `custom.pack_name` (single_line_text_field) — absent
- `custom.availability_note` (multi_line_text_field) — absent
- `custom.best_for_label` (single_line_text_field) — absent
- `custom.best_for_description` (multi_line_text_field) — absent
- `custom.servings_per_container` (single_line_text_field) — absent
- `custom.product_format` (single_line_text_field) — absent
- `custom.warnings_headline` (single_line_text_field) — absent
- `custom.storage_instructions` (multi_line_text_field) — absent
- `custom.safety_seal` (multi_line_text_field) — absent
- `custom.allergen_info` (multi_line_text_field) — absent
- `custom.other_ingredients` (multi_line_text_field) — absent
- `custom.disclaimer` (multi_line_text_field) — absent
- `custom.why_formula_eyebrow` (single_line_text_field) — absent
- `custom.why_formula_headline` (single_line_text_field) — absent
- `custom.why_pillars` (list.metaobject_reference) — absent
- `custom.science_visual` (file_reference) — absent
- `custom.science_eyebrow` (single_line_text_field) — absent
- `custom.science_headline` (single_line_text_field) — absent
- `custom.science_cards` (list.metaobject_reference) — absent
- `custom.ingredients_eyebrow` (single_line_text_field) — absent
- `custom.ingredients_headline` (single_line_text_field) — absent
- `custom.supplement_facts_headline` (single_line_text_field) — absent
- `custom.evidence_headline` (single_line_text_field) — absent
- `custom.clinical_evidence` (multi_line_text_field) — absent
- `custom.comparison_headline` (single_line_text_field) — absent
- `custom.comparison_bioaro_label` (single_line_text_field) — absent
- `custom.comparison_typical_label` (single_line_text_field) — absent
- `custom.comparison_rows` (list.metaobject_reference) — empty
- `custom.bundle_eyebrow` (single_line_text_field) — absent
- `custom.bundle_headline` (single_line_text_field) — absent
- `custom.bundle_description` (multi_line_text_field) — absent
- `custom.related_products` (list.metaobject_reference) — absent
- `custom.quality_headline` (single_line_text_field) — absent
- `custom.quality_badges` (list.metaobject_reference) — absent
- `custom.faq_eyebrow` (single_line_text_field) — absent
- `custom.faq_headline` (single_line_text_field) — absent
- `custom.bottom_cta_primary` (metaobject_reference) — absent
- `custom.bottom_cta_secondary` (metaobject_reference) — absent
- `custom.pdp_badges` (json) — absent
- `custom.category` (single_line_text_field) — absent

### Populated but not in the schema

- `custom.ingredients`
- `custom.science_steps`

## Requested by the storefront but never defined

These cannot be populated. `testimonials`, `rating_average` and `rating_count` describe
evidence PRODUCT.md lists as unconfirmed and should be removed from the request rather
than defined.

- `custom.benefit_cards`
- `custom.final_cta`
- `custom.ingredients`
- `custom.labs_cta`
- `custom.rating_average`
- `custom.rating_count`
- `custom.rating_label`
- `custom.science_steps`
- `custom.testimonials`
- `custom.trust_badges`
