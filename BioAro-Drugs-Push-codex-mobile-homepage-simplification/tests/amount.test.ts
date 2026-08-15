import assert from "node:assert/strict";
import test from "node:test";

import { amountToMg, compositionBars } from "../src/lib/product/amount";

test("reads the units that appear on real labels", () => {
  assert.equal(amountToMg("500 mg"), 500);
  assert.equal(amountToMg("1,000 mg"), 1000);
  assert.equal(amountToMg("2 g"), 2000);
  assert.equal(amountToMg("250 mcg"), 0.25);
  assert.equal(amountToMg("100mg"), 100);
});

test("both micro signs parse — real label data uses each", () => {
  // U+00B5 micro sign and U+03BC greek mu look identical and are different characters.
  assert.equal(amountToMg("25 µg"), 0.025);
  assert.equal(amountToMg("25 μg"), 0.025);
});

test("IU is ignored, and the mass beside it is used", () => {
  /* IU measures biological activity, not mass, and converts differently per
     substance. Reading 1,000 IU as a mass would draw a bar 40,000x too long. */
  assert.equal(amountToMg("25 µg / 1,000 IU"), 0.025);
  assert.equal(amountToMg("400 IU"), null);
});

test("anything it cannot trust returns null rather than a guess", () => {
  for (const input of ["", "a pinch", "Proprietary blend", "—", "0 mg", "-5 mg"]) {
    assert.equal(amountToMg(input), null, `should refuse: ${JSON.stringify(input)}`);
  }
});

test("unparseable ingredients drop their bar instead of rendering a wrong one", () => {
  const bars = compositionBars([
    { name: "NMN", amount: "500 mg" },
    { name: "Mystery Blend", amount: "proprietary" },
    { name: "Vitamin D3", amount: "25 µg / 1,000 IU" },
  ]);

  assert.deepEqual(
    bars.map((bar) => bar.name),
    ["NMN", "Vitamin D3"],
    "the unparseable one is absent, the others are ordered heaviest first",
  );
});

test("a micro-dosed active stays visible rather than collapsing to nothing", () => {
  const bars = compositionBars([
    { name: "NMN", amount: "500 mg" },
    { name: "Vitamin D3", amount: "25 µg" },
  ]);

  const d3 = bars.find((bar) => bar.name === "Vitamin D3");
  assert.ok(d3);
  // Linear share would be 0.00005 — an invisible sliver reading as "not really in it".
  assert.ok(d3.share > 0.05, `D3 share was ${d3.share}, too small to see`);
  assert.ok(d3.share < 1, "and still clearly smaller than the largest");
});

test("the printed label is passed through untouched", () => {
  const [bar] = compositionBars([{ name: "Vitamin D3", amount: "25 µg / 1,000 IU" }]);
  assert.equal(bar.amount, "25 µg / 1,000 IU", "never re-formatted from the parsed number");
});

test("no parseable amounts means no chart at all", () => {
  assert.deepEqual(compositionBars([{ name: "Blend", amount: "proprietary" }]), []);
  assert.deepEqual(compositionBars([]), []);
});
