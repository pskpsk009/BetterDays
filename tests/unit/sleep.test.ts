/// <reference types="node" />
// TC02 (gradual schedule across midnight) and TC03 (night vs window).
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatDuration,
  fromMinutes,
  gradualSchedule,
  minutesUntil,
  shortestShift,
} from "../../frontend/components/body/sleep/sleepMath";
import {
  bedOnSchedule,
  compareToStart,
  currentBedTarget,
  isLastStep,
  nightOnSchedule,
  SleepLog,
  SleepPlan,
  SleepWindow,
} from "../../frontend/components/body/sleep/sleepSchedule";

const t = (hour: number, minute = 0) => ({ hour, minute });

describe("TC02 shortestShift and gradualSchedule across midnight", () => {
  it("01:30 -> 23:00 goes back 150 min, not forward 1290", () => {
    assert.equal(shortestShift(t(1, 30), t(23)), -150);
  });

  it("23:00 -> 00:30 goes forward 90 min", () => {
    assert.equal(shortestShift(t(23), t(0, 30)), 90);
  });

  it("01:30 -> 23:00 in 30-min steps ends exactly on the target", () => {
    assert.deepEqual(gradualSchedule(t(1, 30), t(23)), [t(1), t(0, 30), t(0), t(23, 30), t(23)]);
  });

  it("23:00 -> 00:30 in 30-min steps crosses midnight forwards", () => {
    assert.deepEqual(gradualSchedule(t(23), t(0, 30)), [t(23, 30), t(0), t(0, 30)]);
  });

  it("uses the pace given (15 min)", () => {
    const steps = gradualSchedule(t(23), t(22), 15);
    assert.equal(steps.length, 4);
    assert.deepEqual(steps.at(-1), t(22));
  });

  it("is empty when already at the target or the step is not positive", () => {
    assert.deepEqual(gradualSchedule(t(23), t(23)), []);
    assert.deepEqual(gradualSchedule(t(23), t(22), 0), []);
  });

  it("wraps clock helpers correctly", () => {
    assert.deepEqual(fromMinutes(-30), t(23, 30));
    assert.deepEqual(fromMinutes(24 * 60 + 5), t(0, 5));
    assert.equal(minutesUntil(t(23), t(7)), 480);
    assert.equal(formatDuration(450), "7 h 30 min");
    assert.equal(formatDuration(45), "45 min");
    assert.equal(formatDuration(480), "8 h");
  });
});

function night(bed: { hour: number; minute: number }, window: SleepWindow, day = "2026-11-10"): SleepLog {
  return { day, bed, wake: t(7), targetBed: t(23, 45), targetWake: t(7), window };
}

describe("TC03 night against its window (target 23:45)", () => {
  it("00:10 (25 min late) is on schedule at ±30 and ±1 h", () => {
    assert.equal(bedOnSchedule(night(t(0, 10), 30)), true);
    assert.equal(bedOnSchedule(night(t(0, 10), 60)), true);
  });

  it("00:20 (35 min late) is off at ±30, on at ±1 h", () => {
    assert.equal(bedOnSchedule(night(t(0, 20), 30)), false);
    assert.equal(bedOnSchedule(night(t(0, 20), 60)), true);
  });

  it("00:50 (65 min late) is off in both", () => {
    assert.equal(bedOnSchedule(night(t(0, 50), 30)), false);
    assert.equal(bedOnSchedule(night(t(0, 50), 60)), false);
  });

  it("counts exactly on the edge of the window as on schedule", () => {
    assert.equal(bedOnSchedule(night(t(0, 15), 30)), true);
  });

  it("needs the wake time on schedule too", () => {
    assert.equal(nightOnSchedule({ ...night(t(23, 45), 30), wake: t(8) }), false);
  });
});

describe("sleep plan steps", () => {
  const plan: SleepPlan = {
    startBedtime: t(1),
    bedtime: t(23, 30),
    wake: t(7),
    window: 30,
    pace: 30,
    step: 0,
    createdOn: "2026-11-01",
  };

  it("starts at the first step and knows when it is the last", () => {
    assert.deepEqual(currentBedTarget(plan), t(0, 30));
    assert.equal(isLastStep(plan), false);
    assert.equal(isLastStep({ ...plan, step: 2 }), true);
  });

  it("never goes past the final target", () => {
    assert.deepEqual(currentBedTarget({ ...plan, step: 99 }), t(23, 30));
  });

  it("uses the target as the only step when already there", () => {
    assert.deepEqual(currentBedTarget({ ...plan, startBedtime: t(23, 30) }), t(23, 30));
  });
});

describe("compareToStart", () => {
  const on = (day: string) => ({ ...night(t(23, 45), 30), day });

  it("is not ready with no logs, or only the first week", () => {
    assert.equal(compareToStart([], "2026-11-17").ready, false);
    assert.equal(compareToStart([on("2026-11-10"), on("2026-11-11")], "2026-11-12").ready, false);
  });

  it("compares the first week with the last 7 days, without overlap", () => {
    const logs = [on("2026-11-01"), on("2026-11-02"), on("2026-11-14"), { ...on("2026-11-15"), bed: t(2) }];
    assert.deepEqual(compareToStart(logs, "2026-11-17"), {
      ready: true,
      start: { onSchedule: 2, logged: 2 },
      recent: { onSchedule: 1, logged: 2 },
    });
  });
});
