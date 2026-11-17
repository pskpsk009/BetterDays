/// <reference types="node" />
// TC01: every "What do you need right now?" pick opens a real activity.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findSuggestion, NEEDS, orderNeeds } from "../../frontend/components/home/needs";

describe("TC01 need finder", () => {
  it("has 8 needs with 3 picks each", () => {
    assert.equal(NEEDS.length, 8);
    for (const need of NEEDS) assert.equal(need.picks.length, 3, need.id);
  });

  it("resolves all 24 picks to an existing activity", () => {
    const missing = NEEDS.flatMap((need) => need.picks.filter((id) => !findSuggestion(id)).map((id) => `${need.id} -> ${id}`));
    assert.deepEqual(missing, []);
  });

  it("has no duplicate pick within a need", () => {
    for (const need of NEEDS) assert.equal(new Set(need.picks).size, 3, need.id);
  });

  it("sends each pick to the tab that owns it", () => {
    assert.equal(findSuggestion("breathing-bubble")?.tab, "mental");
    assert.equal(findSuggestion("calm-down-toolkit")?.tab, "mental"); // Emotional Wellness lives in the Mind tab
    assert.equal(findSuggestion("hydration")?.tab, "body");
  });

  it("returns undefined for an unknown activity", () => {
    assert.equal(findSuggestion("not-an-activity"), undefined);
  });
});

describe("orderNeeds", () => {
  it("puts the welcome picks first, in the order chosen", () => {
    const ordered = orderNeeds(["energy", "focus"]).map((need) => need.id);
    assert.deepEqual(ordered.slice(0, 2), ["energy", "focus"]);
    assert.equal(ordered.length, NEEDS.length);
  });

  it("keeps the usual order when nothing was picked", () => {
    assert.deepEqual(
      orderNeeds([]).map((need) => need.id),
      NEEDS.map((need) => need.id),
    );
  });

  it("does not change NEEDS itself", () => {
    const before = NEEDS.map((need) => need.id);
    orderNeeds(["people"]);
    assert.deepEqual(
      NEEDS.map((need) => need.id),
      before,
    );
  });
});
