# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Health-conscious adults roughly 35–55 who are balancing career, family, and an active lifestyle.

Their situation: they are not sick and not in crisis. They are busy, carrying responsibility for other people, and aware that the things they rely on — energy, mental clarity, strength, recovery — are the things that quietly erode first.

Their job: proactively maintain energy, mental clarity, strength, recovery, and long-term health rather than wait for something to go wrong. They are choosing to act early, and they need support that survives contact with a real schedule.

## Product Purpose

BioAro Drugs provides practical, science-led nutritional support across the health areas that matter in everyday life — clarity, strength, recovery, and longevity.

Success is a customer who understands what they are taking and why, and who stays on it. Adherence over intensity: a routine that is actually sustained beats a more elaborate one that is abandoned.

## Positioning

**BioAro is built across both testing and intervention.** BioAro Labs helps people understand their biology; BioAro Drugs provides the practical, science-led nutritional support to act on it. The durable differentiator is this broader **"Understand → Act"** model — one company covering both halves of the loop.

**Hard constraint on how this is expressed:** this is *not* a claim that every supplement is individually genomics-personalized to the customer. Design and copy must never imply per-customer genomic personalization of products.

Supporting differentiators, secondary to the above:

- **Sachet format** — convenience that drives adherence
- **Ingredient transparency** — plain-language ingredient, dosage, and supplement-facts disclosure
- **Evidence-led formulation**

## Operating Context

- Direct-to-consumer ecommerce. Markets: **UK, US, CA, AE**, served from market-prefixed routes (`/:market`, default `/uk`). US and CA share the `NA` experience region; `GB` maps to `UK`.
- Region resolution order: saved manual override → Geo-IP/bootstrap response → browser-language fallback.
- Products are taken as **sachets** as part of a daily routine.
- Product detail pages are editorially structured to carry dosage, warnings, supplement facts, ingredients, FAQs, and market-aware disclaimer blocks.
- Existing customer-facing surfaces: shop, product detail, quiz, science, journal, about, protocols, Living 2.0, quality & testing, partners, FAQ, policy pages, account.

## Capabilities and Constraints

- **Stack (existing):** Vite + React 19 + TypeScript SPA, Tailwind 3.4, react-router-dom v7. Verification is `npm run lint && npm run test && npm run build`; `tsc -b` runs with `noUnusedLocals`/`noUnusedParameters`, so unused imports fail the build.
- **Commerce:** Shopify Storefront API for catalog and cart, with preview-catalog fallback when env vars are absent.
- **Regulatory:** supplement marketing claims must stay compliant per market, and US/UK requirements differ. Market-aware disclaimer blocks exist for this reason. Copy must stay hedged rather than overclaiming.
- **Missing routes:** there is no `/privacy-policy` or `/terms-of-service` route. The homepage footer currently labels links "Privacy Policy" and "Terms of Service" but points them at `/shipping-policy` and `/supplement-disclaimer`. Left as-is by explicit decision (2026-08-12); revisit before public launch.
- **Explicitly undecided:** launch scope (US only / UK only / both), and whether this SPA is the launch storefront or an interim prototype ahead of a Shopify migration. Tracked in `BioAro-Launch-Checklist-US-UK.md`.

## Brand Commitments

- **Name:** BioAro. Sibling entity **BioAro Labs** (testing); this product is **BioAro Drugs** (intervention).
- **Founder:** Anju Singh — real, named, and personally present on the homepage.
- **Tagline in use:** "Live Forward."
- **Four health pillars in use:** Clarity, Strength, Recovery, Longevity.
- **Voice:** plain language, non-alarmist, proactive rather than fear-based. A customer should not need specialist knowledge to understand what is in a product, how to use it, or what evidence exists. Hedged and specific over sweeping.

## Evidence on Hand

**Confirmed and usable:**

- **Third-party test results.**

**Not confirmed — future work must not fabricate, imply, or design placeholders that read as real:**

- **cGMP certification and "Formulated in Canada"** — currently asserted as trust pills in the legacy footer (`src/components/layout/Footer.tsx`). Not confirmed in this interview. Verify before reusing, or remove.
- **Customer testimonials** — none confirmed real. The removed `Testimonials` component must not be reinstated with invented people or quotes.
- **Published research citations** — no confirmed citable study list yet, despite "evidence-led formulation" positioning.
- **Clinical outcomes, benchmarks, customer counts, awards, press, partner logos** — none established.

## Product Principles

1. **Understand → Act.** Every surface should make sense as one half of a loop that begins with understanding your biology and ends with doing something about it.
2. **Proactive, not reactive.** Speak to people acting before there is a problem. Never sell through fear of illness.
3. **Comprehensible without specialist knowledge.** If a claim needs a background in biochemistry to evaluate, it is not yet finished.
4. **Adherence is the outcome.** Convenience and livability are strategic, not cosmetic — a sachet taken daily beats a protocol abandoned in week two.
5. **Claim only what is verifiable.** Given how thin the confirmed evidence base currently is, restraint is a credibility asset with this audience.
