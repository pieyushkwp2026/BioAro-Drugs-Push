import assert from "node:assert/strict";
import test from "node:test";

import { buildProtocol, type ProtocolAnswers } from "../src/lib/protocol/build";

const BASE: ProtocolAnswers = { goals: ["longevity"], energy: "steady", sleep: "restful", training: "rarely" };

const answers = (overrides: Partial<ProtocolAnswers> = {}): ProtocolAnswers => ({ ...BASE, ...overrides });
const handles = (input: ProtocolAnswers) => buildProtocol(input).items.map((item) => item.handle);

/*
 * The regression this whole engine exists to prevent.
 *
 * The previous builder asked four questions and read answers[0]. Everything after the
 * goal was collected into state and never referenced, so two people with opposite
 * routines got byte-identical output while the UI called it "Personalized guidance".
 */
test("every answer changes the protocol, not just the goal", () => {
  const sedentary = handles(answers());
  const athlete = handles(answers({ training: "daily", energy: "crashes", sleep: "poor" }));

  assert.notDeepEqual(sedentary, athlete);
  assert.ok(athlete.length > sedentary.length, "more context should produce a fuller protocol");
});

test("the goal leads the protocol", () => {
  assert.equal(handles(answers({ goals: ["focus"] }))[0], "creagen-brain-boost");
  assert.equal(handles(answers({ goals: ["performance"] }))[0], "creagen-raw-power");
  assert.equal(handles(answers({ goals: ["womens-health"] }))[0], "creagen-femme-energy");
});

test("training frequency adds recovery support the visitor did not name", () => {
  assert.ok(!handles(answers({ training: "rarely" })).includes("creagen-pro-power"));
  assert.ok(handles(answers({ training: "daily" })).includes("creagen-pro-power"));
  assert.ok(handles(answers({ training: "sometimes" })).includes("creagen-pro-power"));
});

test("an energy crash pulls in the foundational formula", () => {
  assert.ok(!handles(answers({ energy: "steady" })).includes("cellomega-plus"));
  assert.ok(handles(answers({ energy: "crashes" })).includes("cellomega-plus"));
});

/*
 * There is no sleep formula. The old lookup table answered "Sleep deeper" with
 * CellOmega+ and called it a match; this must never silently happen again.
 */
test("the sleep goal is answered honestly rather than with a non-sleep product", () => {
  const result = buildProtocol(answers({ goals: ["sleep"] }));

  assert.ok(result.notes.length > 0, "a missing product range must be disclosed");
  assert.ok(
    result.notes.some((note) => note.toLowerCase().includes("does not have a sleep formula")),
    "the note must say plainly that no sleep formula exists",
  );
  assert.ok(!result.items.some((item) => item.handle === "sleepo" || item.handle === "sleepo-kids"));
});

test("poor sleep adds recovery support and disclaims that it is not a sleep formula", () => {
  const result = buildProtocol(answers({ sleep: "poor" }));
  const glutara = result.items.find((item) => item.handle === "glutara");

  assert.ok(glutara, "recovery support should be included");
  assert.ok(glutara!.reason.includes("not a sleep formula"));
  assert.ok(result.notes.some((note) => note.includes("healthcare professional")));
});

test("a protocol is never empty and never contains duplicates", () => {
  const goals = ["energy", "longevity", "focus", "recovery", "sleep", "performance", "womens-health"] as const;
  const energies = ["steady", "dips", "crashes"] as const;
  const sleeps = ["restful", "inconsistent", "poor"] as const;
  const trainings = ["daily", "sometimes", "rarely"] as const;

  for (const goal of goals) {
    for (const energy of energies) {
      for (const sleep of sleeps) {
        for (const training of trainings) {
          const result = buildProtocol({ goals: [goal], energy, sleep, training });
          const list = result.items.map((item) => item.handle);

          assert.ok(list.length > 0, `empty protocol for ${goal}/${energy}/${sleep}/${training}`);
          assert.equal(new Set(list).size, list.length, `duplicate handles for ${goal}`);
          // Placeholder and draft rows must never reach a customer.
          assert.ok(!list.includes("sleepo") && !list.includes("sleepo-kids"));
          // Every product must explain itself; a silent recommendation is the bug.
          assert.ok(result.items.every((item) => item.reason.trim().length > 0));
        }
      }
    }
  }
});

test("items are ordered through the day", () => {
  const result = buildProtocol(answers({ goals: ["longevity"], training: "daily", sleep: "poor" }));
  const order = ["Morning", "Around training", "Evening"];
  const positions = result.items.map((item) => order.indexOf(item.slot));

  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

/* ---------------------------------------------------------------- multi-goal */

test("several goals each contribute their formula, first goal leading", () => {
  const list = handles(answers({ goals: ["focus", "energy"] }));

  assert.equal(list[0], "creagen-brain-boost", "the first goal chosen leads");
  assert.ok(list.includes("cellomega-plus"), "the second goal is represented too");
});

test("a formula serving two selected goals appears once", () => {
  // Energy and longevity both lead with foundational formulas; whatever overlaps
  // must not be listed twice.
  const list = handles(answers({ goals: ["energy", "longevity", "focus"] }));

  assert.equal(new Set(list).size, list.length, "no duplicate handles across goals");
});

/*
 * Day order beats selection order, and that is deliberate: a protocol is read as a
 * day. Selection order only survives WITHIN a slot, which is what this asserts —
 * both of these goals lead with a Morning formula.
 */
test("within a slot, the goal chosen first is listed first", () => {
  const focusFirst = handles(answers({ goals: ["focus", "energy"] }));
  const energyFirst = handles(answers({ goals: ["energy", "focus"] }));

  assert.equal(focusFirst[0], "creagen-brain-boost");
  assert.equal(energyFirst[0], "cellomega-plus");
});

test("day order wins over selection order across slots", () => {
  // Performance is an around-training formula and focus is a morning one, so the
  // morning item leads even though performance was picked first.
  const result = buildProtocol(answers({ goals: ["performance", "focus"] }));
  const order = ["Morning", "Around training", "Evening"];
  const positions = result.items.map((item) => order.indexOf(item.slot));

  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.equal(result.items[0]?.slot, "Morning");
});

test("sleep alongside a real goal still discloses that no sleep formula exists", () => {
  const result = buildProtocol(answers({ goals: ["focus", "sleep"] }));

  assert.ok(result.items.some((item) => item.handle === "creagen-brain-boost"));
  assert.ok(
    result.notes.some((note) => note.toLowerCase().includes("does not have a sleep formula")),
    "picking sleep must be disclosed even when other goals matched",
  );
  assert.equal(
    result.notes.filter((note) => note.toLowerCase().includes("does not have a sleep formula")).length,
    1,
    "and disclosed exactly once",
  );
});

test("no goals at all still returns a usable protocol", () => {
  const result = buildProtocol(answers({ goals: [] }));

  assert.ok(result.items.length > 0, "an empty selection must not produce an empty protocol");
  assert.ok(result.items.every((item) => item.reason.trim().length > 0));
});
