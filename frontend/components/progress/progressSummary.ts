// Pure selectors that turn a ProgressDataset into what the Progress page shows.
// They work the same on demo data and on future Supabase records.

import { BODY_BRANCHES } from "../body/branches";
import { EMOTIONAL_BRANCHES } from "../emotional/branches";
import { MENTAL_BRANCHES } from "../mental/branches";
import {
  average,
  bucketSeries,
  bucketsFor,
  clockSpread,
  averageClockTime,
  countDistinctDays,
  DateWindow,
  PeriodId,
  periodWindow,
  previousWindow,
  rate,
  sleepMinutes,
  sum,
  trend,
  Trend,
  within,
  windowDays,
  Bucket,
} from "./progressMath";
import type {
  ClockTime,
  DateKey,
  FoodGroup,
  MovementSession,
  ProgressArea,
  ProgressDataset,
} from "./types";

export type Series = { label: string; value: number | null }[];

export type ProgressContext = {
  data: ProgressDataset;
  period: PeriodId;
  today: DateKey;
  window: DateWindow;
  /** Null for "All time" or when history does not reach back far enough. */
  previous: DateWindow | null;
  buckets: Bucket[];
};

const ACTIVITY_RECORDS = [
  "mindfulness",
  "reflections",
  "focus",
  "hydration",
  "plates",
  "movement",
  "sleep",
  "bedtimeRoutines",
] as const;

export function earliestRecord(data: ProgressDataset): DateKey | null {
  let earliest: DateKey | null = null;
  for (const key of ACTIVITY_RECORDS) {
    for (const record of data[key]) {
      if (earliest === null || record.date < earliest) earliest = record.date;
    }
  }
  return earliest;
}

export function buildContext(data: ProgressDataset, period: PeriodId, today: DateKey): ProgressContext {
  const earliest = earliestRecord(data);
  const window = periodWindow(period, today, earliest);
  const before = previousWindow(period, today);
  return {
    data,
    period,
    today,
    window,
    previous: before && earliest !== null && earliest <= before.start ? before : null,
    buckets: bucketsFor(period, window),
  };
}

// Runs `measure` on the current and previous windows and pairs the results.
function withTrend(
  ctx: ProgressContext,
  measure: (window: DateWindow) => number | null,
): { value: number | null; trend: Trend } {
  const value = measure(ctx.window);
  return { value, trend: ctx.previous ? trend(value, measure(ctx.previous)) : null };
}

// ---------- Overview summaries ----------

export function mindSummary(ctx: ProgressContext) {
  const { data } = ctx;
  return {
    activityCount:
      within(data.mindfulness, ctx.window).length +
      within(data.reflections, ctx.window).length +
      within(data.focus, ctx.window).length,
    practiceMinutes: withTrend(ctx, (w) => sum(within(data.mindfulness, w).map((s) => s.minutes))),
    awareness: withTrend(ctx, (w) => average(within(data.mindfulness, w).map((s) => s.awarenessAfter))),
    emotionConfidence: withTrend(ctx, (w) =>
      average(within(data.reflections, w).map((s) => s.emotionConfidence)),
    ),
    perceivedFocus: withTrend(ctx, (w) => average(within(data.focus, w).map((s) => s.perceivedFocus))),
  };
}

export function bodySummary(ctx: ProgressContext) {
  const { data } = ctx;
  const count = (records: { date: DateKey }[]) => withTrend(ctx, (w) => within(records, w).length);
  const sleepAndRoutines = withTrend(
    ctx,
    (w) => within(data.sleep, w).length + within(data.bedtimeRoutines, w).length,
  );
  return {
    hydrationCheckins: count(data.hydration),
    plates: count(data.plates),
    movementSessions: count(data.movement),
    sleepAndRoutines,
    activityCount:
      within(data.hydration, ctx.window).length +
      within(data.plates, ctx.window).length +
      within(data.movement, ctx.window).length +
      (sleepAndRoutines.value ?? 0),
  };
}

// ---------- Mind detail ----------

export function mindfulnessDetail(ctx: ProgressContext) {
  const sessions = within(ctx.data.mindfulness, ctx.window);
  const grounding = sessions.filter((s) => s.activity === "senses-grounding");
  const rated = sessions.filter((s) => s.awarenessBefore !== null && s.awarenessAfter !== null);
  return {
    sessions: sessions.length,
    totalMinutes: sum(sessions.map((s) => s.minutes)),
    practiceDays: countDistinctDays(sessions),
    periodDays: windowDays(ctx.window),
    groundingStarted: grounding.length,
    groundingDone: grounding.filter((s) => s.completed).length,
    groundingRate: rate(grounding.filter((s) => s.completed).length, grounding.length),
    ratedSessions: rated.length,
    awarenessBefore: average(rated.map((s) => s.awarenessBefore)),
    awarenessAfter: average(rated.map((s) => s.awarenessAfter)),
    minutesSeries: bucketSeries(sessions, ctx.buckets, (s) => s.minutes),
  };
}

export const REFLECTION_STAGES = [
  { title: "Situation", prompt: "What happened?" },
  { title: "Thought", prompt: "What was going through my mind?" },
  { title: "Emotion", prompt: "What did I feel?" },
  { title: "Next step", prompt: "What could I try next?" },
];

export function selfAwarenessDetail(ctx: ProgressContext) {
  const sessions = within(ctx.data.reflections, ctx.window);
  const complete = sessions.filter((s) => s.stagesCompleted === 4).length;
  const planned = sessions.filter((s) => s.nextStepPlanned);
  const done = planned.filter((s) => s.nextStepDone).length;
  return {
    sessions: sessions.length,
    emotionConfidence: average(sessions.map((s) => s.emotionConfidence)),
    completed: complete,
    completionRate: rate(complete, sessions.length),
    stageCounts: REFLECTION_STAGES.map(
      (_, index) => sessions.filter((s) => s.stagesCompleted > index).length,
    ),
    stepsPlanned: planned.length,
    stepsDone: done,
    followThroughRate: rate(done, planned.length),
    reflectionSeries: bucketSeries(sessions, ctx.buckets, () => 1),
  };
}

export function concentrationDetail(ctx: ProgressContext) {
  const sessions = within(ctx.data.focus, ctx.window);
  const games = sessions.filter((s) => s.total !== null && s.correct !== null);
  const correct = sum(games.map((s) => s.correct ?? 0));
  const total = sum(games.map((s) => s.total ?? 0));
  const tracked = sessions.filter((s) => s.distractions !== null);
  const distractions = sum(tracked.map((s) => s.distractions ?? 0));
  return {
    sessions: sessions.length,
    averageMinutes: average(sessions.map((s) => s.minutes)),
    gameRounds: games.length,
    accuracy: rate(correct, total),
    perceivedFocus: average(sessions.map((s) => s.perceivedFocus)),
    durationSeries: bucketSeries(sessions, ctx.buckets, (s) => s.minutes, "average"),
    trackedSessions: tracked.length,
    distractions,
    distractionsPerSession: tracked.length > 0 ? distractions / tracked.length : null,
    distractionFreeSessions: tracked.filter((s) => s.distractions === 0).length,
  };
}

// ---------- Body detail ----------

export function hydrationDetail(ctx: ProgressContext) {
  const checkins = within(ctx.data.hydration, ctx.window);
  const sized = checkins.filter((c) => c.waterMl !== null);
  return {
    checkins: checkins.length,
    activeDays: countDistinctDays(checkins),
    periodDays: windowDays(ctx.window),
    drinks: sum(checkins.map((c) => c.drinksLogged)),
    sizedCheckins: sized.length,
    estimatedWaterMl: sized.length > 0 ? sum(sized.map((c) => c.waterMl ?? 0)) : null,
    series: bucketSeries(checkins, ctx.buckets, () => 1),
  };
}

export function nutritionDetail(ctx: ProgressContext) {
  const plates = within(ctx.data.plates, ctx.window);
  const groupCounts: Record<FoodGroup, number> = { vegetables: 0, fruits: 0, protein: 0, carbs: 0, fats: 0 };
  for (const plate of plates) for (const group of plate.groups) groupCounts[group] += 1;
  return {
    plates: plates.length,
    activeDays: countDistinctDays(plates),
    groupCounts,
    series: bucketSeries(plates, ctx.buckets, () => 1),
  };
}

export const MOVEMENT_TYPES: { id: MovementSession["activity"]; label: string; kind: "stretch" | "move" }[] = [
  { id: "daily-stretch", label: "Daily Stretch", kind: "stretch" },
  { id: "mobility-flow", label: "Mobility Flow", kind: "stretch" },
  { id: "desk-break", label: "Desk Break", kind: "move" },
  { id: "movement-dice", label: "Movement Dice", kind: "move" },
  { id: "body-scan", label: "Body Awareness Scan", kind: "move" },
];

export function movementDetail(ctx: ProgressContext) {
  const sessions = within(ctx.data.movement, ctx.window);
  const timed = sessions.filter((s) => s.minutes !== null);
  return {
    sessions: sessions.length,
    activeDays: countDistinctDays(sessions),
    stretching: sessions.filter((s) => MOVEMENT_TYPES.find((t) => t.id === s.activity)?.kind === "stretch")
      .length,
    byActivity: MOVEMENT_TYPES.map((type) => ({
      ...type,
      count: sessions.filter((s) => s.activity === type.id).length,
    })),
    timedSessions: timed.length,
    totalMinutes: timed.length > 0 ? sum(timed.map((s) => s.minutes ?? 0)) : null,
    averageMinutes: average(timed.map((s) => s.minutes)),
    series: bucketSeries(sessions, ctx.buckets, () => 1),
  };
}

export function sleepDetail(ctx: ProgressContext) {
  const nights = within(ctx.data.sleep, ctx.window);
  const complete = nights.filter((n) => sleepMinutes(n) !== null);
  const bedtimes = nights.map((n) => n.bedtime).filter((t): t is ClockTime => t !== null);
  const wakeTimes = nights.map((n) => n.wakeTime).filter((t): t is ClockTime => t !== null);
  const routines = within(ctx.data.bedtimeRoutines, ctx.window);
  const stepsDone = sum(routines.map((r) => r.stepsDone));
  const stepsTotal = sum(routines.map((r) => r.stepsTotal));
  return {
    nightsLogged: nights.length,
    completeNights: complete.length,
    averageMinutes: average(complete.map(sleepMinutes)),
    averageBedtime: averageClockTime(bedtimes),
    averageWake: averageClockTime(wakeTimes),
    bedtimeSpread: clockSpread(bedtimes),
    wakeSpread: clockSpread(wakeTimes),
    routines: routines.length,
    routineStepRate: rate(stepsDone, stepsTotal),
    durationSeries: bucketSeries(nights, ctx.buckets, sleepMinutes, "average").map((point) => ({
      ...point,
      value: point.value === null ? null : point.value / 60,
    })),
  };
}

// ---------- Recent activity ----------

const ACTIVITY_TITLES: Record<string, string> = Object.fromEntries(
  [...MENTAL_BRANCHES, ...EMOTIONAL_BRANCHES, ...BODY_BRANCHES].flatMap((branch) =>
    branch.activities.map((activity) => [activity.id, activity.title]),
  ),
);

export type RecentActivity = {
  key: string;
  date: DateKey;
  area: ProgressArea;
  title: string;
  /** How many times this activity was done that day. */
  count: number;
};

/**
 * Most recent activities across both areas, with repeats on the same day
 * grouped. Never includes reflection text.
 */
export function recentActivities(data: ProgressDataset, limit = 5): RecentActivity[] {
  const items: Omit<RecentActivity, "key" | "count">[] = [
    ...data.mindfulness.map((s) => ({ date: s.date, area: "mind" as const, title: ACTIVITY_TITLES[s.activity] })),
    ...data.reflections.map((s) => ({ date: s.date, area: "mind" as const, title: ACTIVITY_TITLES[s.activity] })),
    ...data.focus.map((s) => ({ date: s.date, area: "mind" as const, title: ACTIVITY_TITLES[s.activity] })),
    ...data.hydration.map((s) => ({ date: s.date, area: "body" as const, title: ACTIVITY_TITLES.hydration })),
    ...data.plates.map((s) => ({ date: s.date, area: "body" as const, title: ACTIVITY_TITLES["balanced-plate"] })),
    ...data.movement.map((s) => ({ date: s.date, area: "body" as const, title: ACTIVITY_TITLES[s.activity] })),
    ...data.sleep.map((s) => ({ date: s.date, area: "body" as const, title: "Sleep logged" })),
    ...data.bedtimeRoutines.map((s) => ({
      date: s.date,
      area: "body" as const,
      title: ACTIVITY_TITLES["bedtime-routine"],
    })),
  ];
  const grouped = new Map<string, RecentActivity>();
  for (const item of items) {
    const key = `${item.date}|${item.title}`;
    const existing = grouped.get(key);
    if (existing) existing.count += 1;
    else grouped.set(key, { ...item, key, count: 1 });
  }
  return [...grouped.values()]
    .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

export function recentForArea(data: ProgressDataset, area: ProgressArea, limit = 5): RecentActivity[] {
  return recentActivities(data, Number.MAX_SAFE_INTEGER)
    .filter((item) => item.area === area)
    .slice(0, limit);
}
