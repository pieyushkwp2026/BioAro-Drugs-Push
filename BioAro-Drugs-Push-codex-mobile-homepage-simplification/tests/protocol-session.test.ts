import assert from "node:assert/strict";
import test from "node:test";

import { AI_SECTION } from "../src/data/homepage";
import { matchGoals } from "../src/lib/ai/matchGoals";
import { buildProtocol, type GoalId } from "../src/lib/protocol/build";
import {
  changesOutcome,
  isInputCategoryAvailable,
  nextQuestion,
  selectQuestions,
  type PartialAnswers,
} from "../src/lib/protocol/questions";
import { answer, createSession, resetAnswers, setGoals, unanswer, viewSession } from "../src/lib/protocol/session";

/*
 * The selection rule is the product here, so most of these test the rule itself
 * rather than the wording it produces.
 */

test("a question is only asked when its answer could change the protocol", () => {
  // Recovery already puts the recovery formula in the protocol, so no answer about
  // training frequency can move it.
  assert.equal(changesOutcome("training", ["recovery"], {}), false);

  // Focus does not, so training still matters.
  assert.equal(changesOutcome("training", ["focus"], {}), true);
});

test("the energy question is dropped when the goal already supplies the formula", () => {
  // Energy leads with the foundational formula, which is the same thing an energy
  // crash would have added.
  assert.equal(changesOutcome("energy", ["energy"], {}), false);
  assert.equal(changesOutcome("energy", ["focus"], {}), true);
});

test("no goals means nothing to ask", () => {
  assert.deepEqual(selectQuestions([], {}), []);
  assert.equal(nextQuestion([], {}), null);
  assert.equal(changesOutcome("energy", [], {}), false);
});

test("questions are never repeated once answered", () => {
  const goals: GoalId[] = ["focus"];
  let answers: PartialAnswers = {};
  const asked: string[] = [];

  for (let i = 0; i < 10; i += 1) {
    const question = nextQuestion(goals, answers);
    if (!question) break;
    asked.push(question.id);
    answers = { ...answers, [question.field]: question.options[0].value };
  }

  assert.equal(new Set(asked).size, asked.length, `repeated a question: ${asked.join(", ")}`);
  assert.equal(nextQuestion(goals, answers), null, "should run out rather than loop");
});

test("the goal leads the ordering, so the first question is the relevant one", () => {
  assert.equal(nextQuestion(["performance"], {})?.field, "training");
  assert.equal(nextQuestion(["sleep"], {})?.field, "sleep");
  assert.equal(nextQuestion(["focus"], {})?.field, "energy");
});

test("goal-specific phrasing wins over the general question", () => {
  assert.equal(nextQuestion(["focus"], {})?.id, "energy-focus");
  assert.equal(nextQuestion(["longevity"], {})?.id, "energy-general");
  assert.equal(nextQuestion(["performance"], {})?.id, "training-athletic");
});

test("every option value is one the engine actually accepts", () => {
  const valid: Record<string, string[]> = {
    energy: ["steady", "dips", "crashes"],
    sleep: ["restful", "inconsistent", "poor"],
    training: ["daily", "sometimes", "rarely"],
  };

  const goalSets: GoalId[][] = [["focus"], ["sleep"], ["performance"], ["recovery"], ["longevity"], ["energy"]];

  for (const goals of goalSets) {
    for (const question of selectQuestions(goals, {})) {
      for (const option of question.options) {
        assert.ok(
          valid[question.field].includes(option.value),
          `${question.id} offers "${option.value}", which ${question.field} does not accept`,
        );
      }
    }
  }
});

test("completion state moves intent -> refining -> complete", () => {
  let session = setGoals(createSession(), ["focus"]);
  assert.equal(viewSession(session).completionState, "intent");

  const first = viewSession(session).question;
  assert.ok(first);
  session = answer(session, first.field, first.options[1].value);
  assert.equal(viewSession(session).completionState, "refining");

  // Answer everything left.
  for (let i = 0; i < 10; i += 1) {
    const question = viewSession(session).question;
    if (!question) break;
    session = answer(session, question.field, question.options[0].value);
  }

  const view = viewSession(session);
  assert.equal(view.completionState, "complete");
  assert.equal(view.remaining, 0);
  assert.equal(view.progress, 1);
});

test("an empty session has no protocol and is not called complete", () => {
  const view = viewSession(createSession());
  assert.equal(view.completionState, "empty");
  assert.equal(view.protocol, null);
  assert.equal(view.question, null);
});

test("a draft exists from the first goal, before any question is answered", () => {
  const view = viewSession(setGoals(createSession(), ["focus"]));
  assert.ok(view.protocol);
  assert.ok(view.protocol.items.length > 0, "a goal should already produce something to show");
});

test("an unanswered field never adds a product the visitor did not describe", () => {
  // With nothing answered, the draft must match the neutral build — not one that
  // assumes a crash or daily training.
  const goals: GoalId[] = ["focus"];
  const draft = viewSession(setGoals(createSession(), goals)).protocol;
  const neutral = buildProtocol({ goals, energy: "steady", sleep: "restful", training: "rarely" });

  assert.deepEqual(draft, neutral);
});

test("answers survive a goal change, and pointless questions drop out", () => {
  let session = setGoals(createSession(), ["focus"]);
  session = answer(session, "training", "daily");

  session = setGoals(session, ["focus", "recovery"]);
  assert.equal(session.answers.training, "daily", "should not re-ask what was already said");

  const fields = selectQuestions(session.detectedGoals, session.answers).map((question) => question.field);
  assert.ok(!fields.includes("training"));
});

test("unanswer puts a question back, reset clears them all", () => {
  let session = setGoals(createSession(), ["focus"]);
  session = answer(session, "energy", "crashes");
  assert.equal(viewSession(session).session.answers.energy, "crashes");

  session = unanswer(session, "energy");
  assert.equal(session.answers.energy, undefined);

  session = answer(session, "energy", "dips");
  session = answer(session, "sleep", "poor");
  assert.equal(Object.keys(resetAnswers(session).answers).length, 0);
});

test("the original wording is preserved untouched", () => {
  const intent = "I want better focus and energy through the day";
  const session = setGoals(createSession({ originalIntent: intent, source: "bioaro-ai-homepage" }), ["focus"]);

  assert.equal(session.originalIntent, intent);
  assert.equal(session.source, "bioaro-ai-homepage");
});

test("only self-reported input is available; nothing else is claimed", () => {
  assert.equal(isInputCategoryAvailable("self-reported"), true);

  for (const category of ["biomarkers", "lab-results", "genetics", "wearables", "medications"] as const) {
    assert.equal(isInputCategoryAvailable(category), false, `${category} must not be presented as live`);
  }
});

test("every cycling hero prompt resolves to a goal", () => {
  /* The hero bar types these out as examples of what to write. A prompt the matcher
     cannot resolve would be demonstrating input the builder ignores — so each one has
     to land somewhere. */
  for (const prompt of AI_SECTION.prompts) {
    const goals = matchGoals(prompt);
    assert.ok(goals.length > 0, `hero prompt resolves to nothing: "${prompt}"`);
  }
});
