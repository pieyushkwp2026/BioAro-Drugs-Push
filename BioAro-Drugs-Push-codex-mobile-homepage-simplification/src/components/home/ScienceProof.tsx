import { Dna, FlaskConical } from "lucide-react";
import { useMarketHref } from "../../hooks/useMarketHref";
import { ROUTES } from "../../lib/routes";
import { SCIENCE_SECTION } from "../../data/homepage";
import { QUALITY_DOCUMENTS, QUALITY_EMPTY_STATE } from "../../data/siteContent";
import type { CatalogProduct } from "../../lib/shopify/types";
import { QuietLink, Section, SectionHeading } from "./primitives";
import ScienceDisclosureRow from "./ScienceDisclosureRow";
import evidenceFormulation from "../../assets/home-optimized/evidence-formulation.jpg";
import routineVitality from "../../assets/home-optimized/story-vitality.jpg";

/*
 * The proof section. Perform transparency rather than assert it.
 *
 * Every other supplement homepage says "transparent" and links away. This one prints
 * the actual formulation — real actives at the real doses, read live from the same
 * catalogue the product page uses, so the two can never drift apart. A competitor
 * cannot copy-paste this section, because they would have to publish their doses.
 *
 * The detail is now OPT-IN. Two icon-marked rows open independently, and both start
 * closed: this is a homepage, and a six-row clinical table is not what most visitors
 * came for. What stays on screen is the claim itself — a proof line counted live from
 * the catalogue — so the section still says "we publish our doses" rather than
 * "we might". The count comes from `ingredients.length`, so it cannot drift from the
 * table it introduces; this is the section that caught the PDP quietly dropping an
 * ingredient, and a hand-written number would have hidden that.
 *
 * The documentation slot reads QUALITY_DOCUMENTS and shows the site's own empty
 * state while it is empty, which it is. No invented certification seals, no
 * placeholder COA badges. Restraint is the credibility asset here.
 */
export default function ScienceProof({ product }: { product: CatalogProduct | undefined }) {
  const marketHref = useMarketHref();
  const ingredients = product?.ingredients ?? [];
  const hasDocuments = QUALITY_DOCUMENTS.length > 0;
  const activeCount = ingredients.length;

  return (
    <Section className="pb-20 sm:pb-24 lg:pb-28">
      {/* 44 / 56 with a 64px gutter. The interactive column is the wider one, which
          is the right way round: it holds the thing a reader can act on. */}
      <div className="grid items-start gap-x-16 gap-y-10 lg:grid-cols-[44fr_56fr]">
        {/* ---------------------------------------------------------- editorial
            Headline, one paragraph, one image. The proof points used to hang off
            the bottom of this column, which is what made it run 1084px against a
            306px card; they are now a full-width strip below both columns. */}
        <div>
          <SectionHeading className="max-w-[13ch]">
            {SCIENCE_SECTION.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </SectionHeading>

          <p className="mt-6 max-w-[46ch] text-pretty text-[16.5px] leading-[1.6] text-ink-600">
            {SCIENCE_SECTION.body}
          </p>

          {/* Fixed height rather than an aspect ratio: at this column width 4:3 ran
              past 500px and drove the whole imbalance. object-cover keeps the crop
              honest at the shorter height. */}
          <img
            src={evidenceFormulation}
            alt="Formulation bench: beakers, test tubes, a powdered ingredient in a petri dish and handwritten notes"
            loading="lazy"
            decoding="async"
            className="mt-9 h-[300px] w-full rounded-[28px] object-cover sm:h-[380px] lg:h-[420px]"
          />
        </div>

        {/* -------------------------------------------------- the actual formulation
            Sticky from lg up. Collapsing the rows took this card from roughly 1080px
            to ~309px against a 721px editorial column. Sticky was the interim fix for
            that; the image below the card is the better one, because it balances the
            column instead of hiding the imbalance. Sticky is deliberately gone — it
            would have pinned the card while this column's own image scrolled past
            underneath it, which reads as a bug rather than a behaviour. */}
        <div>
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-glass sm:p-8">
          {product && ingredients.length > 0 ? (
            <>
              <h3 className="text-[22px] font-bold tracking-[-0.025em] text-ink">{product.title}</h3>

              {/* Standing facts, so a closed card never reads as empty. Composed from
                  the catalogue rather than written: the count is `ingredients.length`
                  and the serving string is the product's own, so neither can drift
                  from the table they introduce. "Third-party tested" is the single
                  evidence claim PRODUCT.md records as confirmed. */}
              <ul className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-[1.5] text-ink-600">
                {[`${activeCount} actives`, product.servings, "Third-party tested"].map((fact, index) => (
                  <li key={fact} className="flex items-center gap-2">
                    {index > 0 && (
                      <span aria-hidden="true" className="text-line-strong">
                        ·
                      </span>
                    )}
                    {fact}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <ScienceDisclosureRow
                  icon={Dna}
                  title="Formulation"
                  summary={`All ${activeCount} actives with their amounts`}
                >
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Active ingredients in {product.title}, with the amount of each per serving
                </caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    <th scope="col" className="pb-2 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-400">
                      Ingredient
                    </th>
                    <th scope="col" className="pb-2 text-right text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink-400">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.name} className="border-b border-line last:border-b-0">
                      <th scope="row" className="py-3.5 pr-4 align-top font-normal">
                        <span className="block text-[15.5px] font-bold tracking-[-0.015em] text-ink">{ingredient.name}</span>
                        <span className="mt-1 block max-w-[34ch] text-[13.5px] leading-[1.5] text-ink-600">
                          {ingredient.purpose}
                        </span>
                      </th>
                      {/* tabular-nums so the dose column aligns on the decimal
                          rather than drifting per row. */}
                      <td className="py-3.5 text-right align-top text-[15px] font-bold tabular-nums tracking-[-0.01em] text-ink">
                        {ingredient.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {product.otherIngredients && product.otherIngredients.length > 0 && (
                <p className="mt-5 text-[13px] leading-[1.6] text-ink-400">
                  <span className="font-bold text-ink-600">Other ingredients: </span>
                  {product.otherIngredients.join(", ")}.
                </p>
              )}

                  <div className="mt-6">
                    <QuietLink to={marketHref(`/products/${product.handle}`)}>See the full label</QuietLink>
                  </div>
                </ScienceDisclosureRow>

                <ScienceDisclosureRow
                  icon={FlaskConical}
                  title="Quality &amp; testing"
                  summary="How the formula is checked, and what we can show you"
                >
                  <p className="max-w-[46ch] text-[14px] leading-[1.6] text-ink-600">
                    Independently checked for purity and potency, rather than taken on our own word.
                  </p>

                  <h5 className="mt-6 text-[12px] font-bold uppercase tracking-[0.12em] text-ink-400">
                    Quality documentation
                  </h5>
                  {hasDocuments ? (
                    <ul className="mt-3 space-y-2">
                      {QUALITY_DOCUMENTS.map((document) => (
                        <li key={document.title}>
                          <a
                            href={document.href}
                            className="text-[14.5px] font-bold text-ink underline-offset-[5px] hover:text-ember hover:underline"
                          >
                            {document.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.55] text-ink-600">
                      {QUALITY_EMPTY_STATE.title} {QUALITY_EMPTY_STATE.description}
                    </p>
                  )}

                  <div className="mt-5">
                    <QuietLink to={marketHref(ROUTES.quality)}>{SCIENCE_SECTION.cta}</QuietLink>
                  </div>
                </ScienceDisclosureRow>
              </div>
            </>
          ) : (
            /* The catalogue is still loading or this handle is unavailable in the
               current market. Hold the shape rather than collapsing the layout. */
            <div aria-busy="true" aria-label="Loading formulation">
              <div className="h-6 w-1/2 animate-pulse rounded-lg bg-cream-200" />
              <div className="mt-6 space-y-4">
                {[0, 1, 2, 3, 4, 5].map((key) => (
                  <div key={key} className="h-12 animate-pulse rounded-lg bg-cream-200" />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* The counterweight. The left column carries a 420px still-life of the
            formulation bench; a collapsed card alone left this side ~410px shorter,
            so the two columns never met at the bottom. A second image closes that
            gap and earns its place editorially: the lab shot is the formula, this is
            a person taking it. Height is tuned so the bottom edges land together. */}
        <img
          src={routineVitality}
          alt="A woman at home holding a BioAro Drugs supplement as part of her evening routine"
          loading="lazy"
          decoding="async"
          className="mt-6 hidden h-[386px] w-full rounded-[28px] object-cover object-[62%_38%] lg:block"
        />
        </div>
      </div>

      {/* ------------------------------------------------------- shared proof strip
          These three claims belong to the section, not to the left column. Hanging
          them off the bottom of the editorial block is what made that column run
          ~780px taller than the card beside it. As a full-width band under both
          columns they read as the section's footing, and the composition closes. */}
      <dl className="mt-14 grid gap-x-12 gap-y-8 border-t border-line-strong pt-9 sm:grid-cols-3">
        {SCIENCE_SECTION.proofPoints.map((point) => (
          <div key={point.title}>
            <dt className="text-[16px] font-bold tracking-[-0.02em] text-ink">{point.title}</dt>
            <dd className="mt-2 max-w-[38ch] text-pretty text-[14.5px] leading-[1.55] text-ink-600">
              {point.body}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
