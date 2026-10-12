// Pure date, period and statistics helpers for the Progress page.
// Functions return null when there is not enough data, so the UI can show an
// empty state instead of inventing a result.

import { minutesUntil, shortestShift, toMinutes, fromMinutes } from "../body/sleep/sleepMath";
import type { ClockTime, DateKey } from "./types";

export type PeriodId = "7d" | "4w" | "all";

export const PERIODS: { id: PeriodId; label: string; days: number | null }[] = [
  { id: "7d", label: "7 days", days: 7 },
  { id: "4w", label: "4 weeks", days: 28 },
  { id: "all", label: "All time", days: null },
];

/** Inclusive date range. */
export type DateWindow = { start: DateKey; end: DateKey };

export type Bucket = DateWindow & { label: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MS = 24 * 60 * 60 * 1000;

/** Sleep-schedule consistency needs at least this many complete nights. */
export const MIN_CONSISTENCY_NIGHTS = 3;

export function toDateKey(date: Date): DateKey {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Noon avoids daylight-saving shifts moving a date across midnight.
function fromDateKey(key: DateKey): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

export function addDays(key: DateKey, days: number): DateKey {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: DateKey, to: DateKey): number {
  return Math.round((fromDateKey(to).getTime() - fromDateKey(from).getTime()) / DAY_MS);
}

export function inWindow(date: DateKey, window: DateWindow): boolean {
  return date >= window.start && date <= window.end;
}

export function windowDays(window: DateWindow): number {
  return daysBetween(window.start, window.end) + 1;
}

/** "Today", "Yesterday", "3 days ago" or "14 Sep". */
export function relativeDay(date: DateKey, today: DateKey): string {
  const ago = daysBetween(date, today);
  if (ago === 0) return "Today";
  if (ago === 1) return "Yesterday";
  if (ago > 1 && ago < 7) return `${ago} days ago`;
  return shortDate(date);
}

export function shortDate(date: DateKey): string {
  const value = fromDateKey(date);
  return `${value.getDate()} ${MONTHS[value.getMonth()]}`;
}

/**
 * The selected period ending today. "All time" starts at the earliest record,
 * or today when there are no records yet.
 */
export function periodWindow(period: PeriodId, today: DateKey, earliest: DateKey | null): DateWindow {
  const days = PERIODS.find((item) => item.id === period)?.days ?? null;
  if (days === null) {
    return { start: earliest && earliest < today ? earliest : today, end: today };
  }
  return { start: addDays(today, -(days - 1)), end: today };
}

/** The equally long period just before, or null for "All time". */
export function previousWindow(period: PeriodId, today: DateKey): DateWindow | null {
  const days = PERIODS.find((item) => item.id === period)?.days ?? null;
  if (days === null) return null;
  return { start: addDays(today, -(2 * days - 1)), end: addDays(today, -days) };
}

/** Chart buckets: one per day for 7 days, otherwise one per 7 days ending today. */
export function bucketsFor(period: PeriodId, window: DateWindow): Bucket[] {
  const buckets: Bucket[] = [];
  if (period === "7d") {
    for (let day = window.start; day <= window.end; day = addDays(day, 1)) {
      buckets.push({ start: day, end: day, label: WEEKDAYS[fromDateKey(day).getDay()] });
    }
    return buckets;
  }
  let end = window.end;
  while (end >= window.start) {
    const start = addDays(end, -6) < window.start ? window.start : addDays(end, -6);
    buckets.unshift({ start, end, label: shortDate(start) });
    end = addDays(start, -1);
  }
  return buckets;
}

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/** Mean of the non-null values, or null when there are none. */
export function average(values: (number | null)[]): number | null {
  const present = values.filter((value): value is number => value !== null);
  return present.length === 0 ? null : sum(present) / present.length;
}

/** done / total as 0-1, or null when nothing was started. */
export function rate(done: number, total: number): number | null {
  return total > 0 ? done / total : null;
}

export function countDistinctDays(records: { date: DateKey }[]): number {
  return new Set(records.map((record) => record.date)).size;
}

export function within<T extends { date: DateKey }>(records: T[], window: DateWindow): T[] {
  return records.filter((record) => inWindow(record.date, window));
}

/**
 * One value per bucket. `sum` adds the per-record values; `average` returns
 * null for buckets without data so charts can show a gap rather than a zero.
 */
export function bucketSeries<T extends { date: DateKey }>(
  records: T[],
  buckets: Bucket[],
  value: (record: T) => number | null,
  mode: "sum" | "average" = "sum",
): { label: string; value: number | null }[] {
  return buckets.map((bucket) => {
    const values = within(records, bucket).map(value);
    return {
      label: bucket.label,
      value: mode === "sum" ? sum(values.map((item) => item ?? 0)) : average(values),
    };
  });
}

/** Sleep length in minutes, crossing midnight when needed; null if a time is missing. */
export function sleepMinutes(entry: { bedtime: ClockTime | null; wakeTime: ClockTime | null }): number | null {
  if (!entry.bedtime || !entry.wakeTime) return null;
  const minutes = minutesUntil(entry.bedtime, entry.wakeTime);
  return minutes === 0 ? null : minutes;
}

/**
 * Average clock time that treats the day as a circle, so 23:30 and 00:30
 * average to 00:00 rather than noon.
 */
export function averageClockTime(times: ClockTime[]): ClockTime | null {
  if (times.length === 0) return null;
  const reference = times[0];
  const offset = average(times.map((time) => shortestShift(reference, time))) ?? 0;
  return fromMinutes(toMinutes(reference) + offset);
}

/**
 * Typical distance in minutes between each time and the average time, or
 * null when there are fewer than MIN_CONSISTENCY_NIGHTS entries.
 */
export function clockSpread(times: ClockTime[]): number | null {
  if (times.length < MIN_CONSISTENCY_NIGHTS) return null;
  const mean = averageClockTime(times);
  if (!mean) return null;
  return average(times.map((time) => Math.abs(shortestShift(mean, time))));
}

export type Trend = { delta: number; previous: number } | null;

/** Change from the previous period; null when either side is unavailable. */
export function trend(current: number | null, previous: number | null): Trend {
  if (current === null || previous === null) return null;
  return { delta: current - previous, previous };
}

export function formatNumber(value: number, decimals = 0): string {
  const factor = 10 ** decimals;
  return String(Math.round(value * factor) / factor);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
