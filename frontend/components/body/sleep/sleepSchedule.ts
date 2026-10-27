// Pure helpers for the saved sleep schedule and morning logs.
//
// A night counts as "on schedule" when both the actual bedtime and wake time
// are within the user's chosen window (±30 min or ±1 h) of that night's
// targets. Each log stores the targets and window it was checked against, so
// changing the schedule later never rewrites past nights.

import { daysBetween, DayKey } from "../../common/localStore";
import { ClockTime, gradualSchedule, shortestShift } from "./sleepMath";

export type SleepWindow = 30 | 60;

export type SleepPlan = {
  /** Bedtime when the plan was made; the gradual steps start from here. */
  startBedtime: ClockTime;
  /** Final target bedtime. */
  bedtime: ClockTime;
  wake: ClockTime;
  window: SleepWindow;
  /** Minutes moved per step (15 or 30). */
  pace: number;
  /** Index into `planSteps(plan)`; the user moves on when ready. */
  step: number;
  createdOn: DayKey;
};

/** One night, filed under the day the user woke up. */
export type SleepLog = {
  day: DayKey;
  bed: ClockTime;
  wake: ClockTime;
  targetBed: ClockTime;
  targetWake: ClockTime;
  window: SleepWindow;
};

/** On-schedule nights at a step before the app suggests the next one. */
export const NIGHTS_BEFORE_NEXT_STEP = 3;
const WEEK = 7;

export function planSteps(plan: SleepPlan): ClockTime[] {
  const steps = gradualSchedule(plan.startBedtime, plan.bedtime, plan.pace);
  return steps.length > 0 ? steps : [plan.bedtime];
}

/** Tonight's bedtime target: the current gradual step. */
export function currentBedTarget(plan: SleepPlan): ClockTime {
  const steps = planSteps(plan);
  return steps[Math.min(plan.step, steps.length - 1)];
}

export function isLastStep(plan: SleepPlan) {
  return plan.step >= planSteps(plan).length - 1;
}

/** Minutes the actual time was off its target: negative is earlier, positive later. */
export function offBy(target: ClockTime, actual: ClockTime) {
  return shortestShift(target, actual);
}

export function bedOnSchedule(log: SleepLog) {
  return Math.abs(offBy(log.targetBed, log.bed)) <= log.window;
}

export function wakeOnSchedule(log: SleepLog) {
  return Math.abs(offBy(log.targetWake, log.wake)) <= log.window;
}

export function nightOnSchedule(log: SleepLog) {
  return bedOnSchedule(log) && wakeOnSchedule(log);
}

/** On-schedule nights logged against the current step's bedtime target. */
export function onScheduleAtStep(logs: SleepLog[], plan: SleepPlan) {
  const target = currentBedTarget(plan);
  return logs.filter(
    (log) =>
      log.targetBed.hour === target.hour && log.targetBed.minute === target.minute && nightOnSchedule(log),
  ).length;
}

export type NightCount = { onSchedule: number; logged: number };

function count(logs: SleepLog[]): NightCount {
  return { onSchedule: logs.filter(nightOnSchedule).length, logged: logs.length };
}

/**
 * First week of logging vs the last 7 days. Only meaningful once the first
 * week is over and both periods have at least two logged nights; otherwise
 * `ready` is false and the UI asks the user to keep logging.
 */
export function compareToStart(logs: SleepLog[], today: DayKey) {
  if (logs.length === 0) return { ready: false as const };
  const first = logs.reduce((earliest, log) => (log.day < earliest ? log.day : earliest), logs[0].day);
  const start = logs.filter((log) => daysBetween(first, log.day) < WEEK);
  // "Recent" never overlaps the first week, so the two periods stay separate.
  const recent = logs.filter((log) => daysBetween(log.day, today) < WEEK && daysBetween(first, log.day) >= WEEK);
  if (start.length < 2 || recent.length < 2) return { ready: false as const };
  return { ready: true as const, start: count(start), recent: count(recent) };
}
