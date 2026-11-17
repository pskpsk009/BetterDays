/// <reference types="node" />
// Progress page maths: dates, periods, chart buckets, sleep averages.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addDays,
  average,
  averageClockTime,
  bucketSeries,
  bucketsFor,
  clockSpread,
  daysBetween,
  periodWindow,
  previousWindow,
  rate,
  relativeDay,
  sleepMinutes,
  trend,
} from "../../frontend/components/progress/progressMath";

const t = (hour: number, minute = 0) => ({ hour, minute });

describe("dates", () => {
  it("adds days across month and year ends and leap days", () => {
    assert.equal(addDays("2026-01-31", 1), "2026-02-01");
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
    assert.equal(addDays("2028-02-28", 1), "2028-02-29");
    assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  });

  it("counts whole days, including across a daylight-saving change", () => {
    assert.equal(daysBetween("2026-03-01", "2026-04-01"), 31);
    assert.equal(daysBetween("2026-10-20", "2026-11-10"), 21);
    assert.equal(daysBetween("2026-11-17", "2026-11-10"), -7);
  });

  it("labels recent days in words", () => {
    assert.equal(relativeDay("2026-11-17", "2026-11-17"), "Today");
    assert.equal(relativeDay("2026-11-16", "2026-11-17"), "Yesterday");
    assert.equal(relativeDay("2026-11-14", "2026-11-17"), "3 days ago");
    assert.equal(relativeDay("2026-11-01", "2026-11-17"), "1 Nov");
  });
});

describe("periods and buckets", () => {
  const today = "2026-11-17";

  it("7 days ends today and has 7 daily buckets", () => {
    const window = periodWindow("7d", today, null);
    assert.deepEqual(window, { start: "2026-11-11", end: today });
    assert.equal(bucketsFor("7d", window).length, 7);
  });

  it("4 weeks has 4 weekly buckets with no gaps or overlap", () => {
    const window = periodWindow("4w", today, null);
    const buckets = bucketsFor("4w", window);
    assert.equal(buckets.length, 4);
    assert.equal(buckets[0].start, window.start);
    assert.equal(buckets.at(-1)?.end, today);
    for (let i = 1; i < buckets.length; i += 1) assert.equal(addDays(buckets[i - 1].end, 1), buckets[i].start);
  });

  it("all time starts at the earliest record, or today with none", () => {
    assert.equal(periodWindow("all", today, "2026-09-01").start, "2026-09-01");
    assert.equal(periodWindow("all", today, null).start, today);
    assert.equal(previousWindow("all", today), null);
  });

  it("the previous period is the same length and ends the day before", () => {
    assert.deepEqual(previousWindow("7d", today), { start: "2026-11-04", end: "2026-11-10" });
  });

  it("sum buckets add values; average buckets leave gaps as null", () => {
    const buckets = bucketsFor("7d", periodWindow("7d", today, null));
    const records = [
      { date: "2026-11-17", minutes: 5 },
      { date: "2026-11-17", minutes: 10 },
    ];
    const summed = bucketSeries(records, buckets, (r) => r.minutes);
    const averaged = bucketSeries(records, buckets, (r) => r.minutes, "average");
    assert.equal(summed.at(-1)?.value, 15);
    assert.equal(summed[0].value, 0);
    assert.equal(averaged.at(-1)?.value, 7.5);
    assert.equal(averaged[0].value, null);
  });
});

describe("numbers", () => {
  it("average skips nulls and is null when empty", () => {
    assert.equal(average([2, null, 4]), 3);
    assert.equal(average([null]), null);
  });

  it("rate and trend return null instead of dividing by zero or guessing", () => {
    assert.equal(rate(1, 4), 0.25);
    assert.equal(rate(0, 0), null);
    assert.deepEqual(trend(5, 3), { delta: 2, previous: 3 });
    assert.equal(trend(5, null), null);
  });
});

describe("sleep averages treat the day as a circle", () => {
  it("23:30 and 00:30 average to 00:00, not noon", () => {
    assert.deepEqual(averageClockTime([t(23, 30), t(0, 30)]), t(0));
  });

  it("spread needs at least 3 nights", () => {
    assert.equal(clockSpread([t(23), t(23, 30)]), null);
    assert.equal(clockSpread([t(23, 30), t(0), t(0, 30)]), 20);
  });

  it("sleep length crosses midnight and ignores missing or zero-length nights", () => {
    assert.equal(sleepMinutes({ bedtime: t(23), wakeTime: t(7) }), 480);
    assert.equal(sleepMinutes({ bedtime: null, wakeTime: t(7) }), null);
    assert.equal(sleepMinutes({ bedtime: t(7), wakeTime: t(7) }), null);
  });
});
