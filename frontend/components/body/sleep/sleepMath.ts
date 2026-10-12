// Pure clock-time helpers for the Good Night Sleep activities.
// Times are 24-hour clock values; internally we use minutes after midnight.

import type { ClockTime } from "../../common/time";

export type { ClockTime };
export { formatTime } from "../../common/time";

const DAY_MINUTES = 24 * 60;

export function toMinutes({ hour, minute }: ClockTime): number {
  return hour * 60 + minute;
}

export function fromMinutes(totalMinutes: number): ClockTime {
  const minutes = ((Math.round(totalMinutes) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  return { hour: Math.floor(minutes / 60), minute: minutes % 60 };
}

/** Minutes from `start` forward to `end`, crossing midnight if needed (0..1439). */
export function minutesUntil(start: ClockTime, end: ClockTime): number {
  return (toMinutes(end) - toMinutes(start) + DAY_MINUTES) % DAY_MINUTES;
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

/**
 * Signed shortest difference from `from` to `to` in minutes, in the range
 * -720..720. Negative means `to` is earlier in the evening/night.
 */
export function shortestShift(from: ClockTime, to: ClockTime): number {
  let diff = toMinutes(to) - toMinutes(from);
  if (diff > DAY_MINUTES / 2) diff -= DAY_MINUTES;
  if (diff < -DAY_MINUTES / 2) diff += DAY_MINUTES;
  return diff;
}

/**
 * Gradual steps from the current bedtime toward a target, moving at most
 * `stepMinutes` at a time. Returns the intermediate targets and the final
 * target (not the starting time). Empty when already at the target.
 */
export function gradualSchedule(
  current: ClockTime,
  target: ClockTime,
  stepMinutes = 30,
): ClockTime[] {
  const shift = shortestShift(current, target);
  if (shift === 0 || stepMinutes <= 0) return [];
  const direction = Math.sign(shift);
  const steps: ClockTime[] = [];
  let moved = 0;
  while (Math.abs(shift - moved) > stepMinutes) {
    moved += direction * stepMinutes;
    steps.push(fromMinutes(toMinutes(current) + moved));
  }
  steps.push(target);
  return steps;
}
