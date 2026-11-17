/// <reference types="node" />
// Activity rules: Build a Balanced Plate and the Target Tap focus game.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  countPlate,
  describeComposition,
  plateFeedback,
  PlateSlice,
  SLICE_COUNT,
} from "../../frontend/components/body/fuel/plateFeedback";
import {
  distractorLooks,
  LEVELS,
  makeBoard,
  matchesRule,
  ruleFor,
  summarizeRound,
} from "../../frontend/components/mental/targetTapRules";

/** Repeatable "random" numbers so boards are the same on every run. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 2 ** 32;
    return state / 2 ** 32;
  };
}

describe("Build a Balanced Plate", () => {
  it("has five 20% slices", () => {
    assert.equal(SLICE_COUNT, 5);
    assert.equal(describeComposition(["vegetables", "vegetables", "protein", null, null]), "40% vegetables · 20% protein");
  });

  it("counts each food group and ignores empty slices", () => {
    assert.deepEqual(countPlate(["fruits", null, "fruits", "fats", null]), {
      vegetables: 0,
      fruits: 2,
      protein: 0,
      carbs: 0,
      fats: 1,
    });
  });

  it("asks for food on an empty plate", () => {
    assert.equal(plateFeedback([null, null, null, null, null]).title, "Your plate is empty");
  });

  it("gives every filled plate a title and at least one point", () => {
    const groups: PlateSlice[] = ["vegetables", "fruits", "protein", "carbs", "fats"];
    for (const group of groups) {
      const feedback = plateFeedback([group, group, group, group, group]);
      assert.ok(feedback.title.length > 0, String(group));
      assert.ok(feedback.points.length > 0, String(group));
    }
    const mixed = plateFeedback(groups);
    assert.ok(mixed.points.length > 0);
  });
});

describe("Target Tap", () => {
  it("places exactly the level's number of targets on every board", () => {
    for (const level of LEVELS) {
      for (let board = 0; board < 6; board += 1) {
        const cells = makeBoard(level, board, seeded(board + 1));
        const rule = ruleFor(level, board);
        assert.equal(cells.length, level.cells, level.id);
        assert.equal(cells.filter((cell) => cell.isTarget).length, level.targets, level.id);
        for (const cell of cells) assert.equal(cell.isTarget, matchesRule(cell, rule), `${level.id} ${cell.id}`);
      }
    }
  });

  it("gives every cell a unique id", () => {
    const cells = makeBoard(LEVELS[2], 3, seeded(7));
    assert.equal(new Set(cells.map((cell) => cell.id)).size, cells.length);
  });

  it("Easy distractors share neither the target's colour nor its shape", () => {
    const easy = LEVELS[0];
    const rule = ruleFor(easy, 0);
    for (const look of distractorLooks(easy, rule)) {
      assert.notEqual(look.shape, rule.shape);
      assert.notEqual(look.color, rule.color);
    }
  });

  it("only Hard switches the rule between boards", () => {
    assert.deepEqual(ruleFor(LEVELS[0], 0), ruleFor(LEVELS[0], 1));
    assert.notDeepEqual(ruleFor(LEVELS[2], 0), ruleFor(LEVELS[2], 1));
  });

  it("scores +10 / -5, never below zero, with no accuracy before any tap", () => {
    assert.deepEqual(summarizeRound(4, 1), { score: 35, correct: 4, incorrect: 1, accuracy: 80 });
    assert.equal(summarizeRound(0, 3).score, 0);
    assert.equal(summarizeRound(0, 0).accuracy, null);
  });
});
