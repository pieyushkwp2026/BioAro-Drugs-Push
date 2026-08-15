/*
 * Turning a printed amount into a number, for the composition bars.
 *
 * ---------------------------------------------------------------------------
 * THE REASON THIS IS A MODULE AND NOT A REGEX INLINE
 *
 * Amounts on a supplement label are not a number. They are "500 mg", "25 µg / 1,000
 * IU", "1,000 mg", "2 g", and sometimes something this parser has never seen. Getting
 * one wrong draws a bar of the wrong length next to a dose someone is about to
 * swallow, so it is worth testing rather than eyeballing.
 *
 * WHAT IT REFUSES TO DO. Anything it cannot parse returns null, and the caller draws
 * no bar for it. A guessed length is worse than an absent one: the row still shows
 * its printed amount either way, so nothing is lost by declining.
 *
 * IU IS DELIBERATELY IGNORED. International Units are a measure of biological
 * activity, not mass, and the conversion differs per substance — 1,000 IU of vitamin
 * D3 is 25 µg, but 1,000 IU of vitamin E is not 25 µg of anything. Where a label
 * carries both, the mass half is parsed and the IU half is left alone.
 * ---------------------------------------------------------------------------
 */

/** Everything normalises to milligrams, the unit most actives are printed in. */
const TO_MG: Record<string, number> = {
  g: 1000,
  mg: 1,
  mcg: 0.001,
  µg: 0.001, // U+00B5 micro sign
  μg: 0.001, // U+03BC greek small letter mu — both occur in real label data
  ug: 0.001,
};

/* The leading minus is captured deliberately. Without it "-5 mg" matches the "5 mg"
   and silently becomes a positive bar — the exact guess this module refuses to make.
   Captured, it fails the `value <= 0` check below and returns null. */
const AMOUNT = /(-?\d[\d,.]*)\s*(g|mg|mcg|µg|μg|ug)\b/i;

/**
 * Milligrams, or null when the string carries no mass this can trust.
 *
 * Takes the FIRST mass it finds, so "25 µg / 1,000 IU" reads the µg and ignores the
 * IU, which is not a mass at all.
 */
export function amountToMg(amount: string): number | null {
  const match = AMOUNT.exec(amount ?? "");
  if (!match) return null;

  const value = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;

  const factor = TO_MG[match[2].toLowerCase()] ?? TO_MG[match[2]];
  if (!factor) return null;

  return value * factor;
}

export interface CompositionBar {
  name: string;
  /** The label exactly as printed. Never re-formatted from the parsed number. */
  amount: string;
  mg: number;
  /** 0–1 of the largest parsed amount in the formula. */
  share: number;
}

/**
 * Bars for every ingredient whose amount could be parsed, ordered heaviest first.
 *
 * `share` uses a fourth-root curve rather than a linear one. Linear is technically
 * accurate and visually useless here: 25 µg beside 500 mg is 0.005% of the width — an
 * invisible sliver that reads as "this ingredient is not really in it". A compressed
 * scale keeps small doses legible while preserving the order. The caption tells the
 * reader the bars show mass and that mass is not potency, which is the honest framing
 * for either curve.
 */
export function compositionBars(
  ingredients: { name: string; amount: string }[],
): CompositionBar[] {
  const parsed = ingredients
    .map((ingredient) => ({ ...ingredient, mg: amountToMg(ingredient.amount) }))
    .filter((ingredient): ingredient is { name: string; amount: string; mg: number } => ingredient.mg !== null);

  if (parsed.length === 0) return [];

  const largest = Math.max(...parsed.map((ingredient) => ingredient.mg));

  return parsed
    .sort((a, b) => b.mg - a.mg)
    .map((ingredient) => ({
      ...ingredient,
      share: Math.pow(ingredient.mg / largest, 1 / 4),
    }));
}
