import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BODY_BRANCHES } from "../body/branches";
import type { SleepLog } from "../body/sleep/sleepSchedule";
import { EMPTY_LOG, LogEntry } from "../common/activityLog";
import { onStoreChange, readRaw } from "../common/localStore";
import { createDemoDataset, createEmptyDataset } from "./mockData";
import { toDateKey } from "./progressMath";
import type {
  DateKey,
  FocusSession,
  MindfulnessSession,
  MovementSession,
  ProgressDataset,
  ReflectionSession,
} from "./types";

export type DataMode = "mine" | "demo";

const MINDFULNESS = new Set<string>(["breathing-bubble", "senses-grounding", "watch-thoughts"]);
const REFLECTION = new Set<string>(["emotion-explorer", "reflection-detective", "what-can-i-control"]);
const FOCUS = new Set<string>(["focus-sprint", "target-tap", "distraction-tracker"]);
const MOVEMENT = new Set<string>(["daily-stretch", "desk-break", "mobility-flow", "movement-dice", "body-scan"]);
const BODY = new Set(BODY_BRANCHES.flatMap((branch) => branch.activities.map((activity) => activity.id)));

/**
 * Builds the Progress dataset from what this device saved: the activity log
 * and the nights logged in Sleep Schedule Guidance. Self-ratings and
 * assessments are not collected yet, so those cards show their empty state.
 */
export function buildUserDataset(log: LogEntry[], sleepLogs: SleepLog[]): ProgressDataset {
  const data = createEmptyDataset();
  for (const entry of log) {
    const { date, activity } = entry;
    const minutes = entry.minutes ?? 1;
    if (MINDFULNESS.has(activity)) {
      data.mindfulness.push({
        date,
        activity: activity as MindfulnessSession["activity"],
        minutes,
        awarenessBefore: null,
        awarenessAfter: null,
        completed: true,
      });
    } else if (REFLECTION.has(activity)) {
      data.reflections.push({
        date,
        activity: activity as ReflectionSession["activity"],
        stagesCompleted: 4,
        emotionConfidence: null,
        nextStepPlanned: false,
        nextStepDone: false,
      });
    } else if (FOCUS.has(activity)) {
      data.focus.push({
        date,
        activity: activity as FocusSession["activity"],
        minutes,
        correct: null,
        total: null,
        distractions: null,
        perceivedFocus: null,
      });
    } else if (activity === "hydration") {
      data.hydration.push({ date, drinksLogged: entry.drinks ?? 1, waterMl: entry.waterMl ?? null });
    } else if (activity === "balanced-plate") {
      data.plates.push({ date, groups: entry.groups ?? [] });
    } else if (MOVEMENT.has(activity)) {
      data.movement.push({ date, activity: activity as MovementSession["activity"], minutes });
    } else {
      data.other.push({ date, activity, area: BODY.has(activity) ? "body" : "mind" });
    }
  }
  for (const night of sleepLogs) {
    data.sleep.push({ date: night.day, bedtime: night.bed, wakeTime: night.wake });
  }
  return data;
}

function readLog(): LogEntry[] {
  const log = readRaw("activity-log");
  return Array.isArray(log) ? (log as LogEntry[]) : EMPTY_LOG;
}

function readSleepLogs(): SleepLog[] {
  const sleep = readRaw("sleep") as { logs?: SleepLog[] } | null;
  return Array.isArray(sleep?.logs) ? sleep.logs : [];
}

/**
 * The single data seam for the Progress page: the user's own records saved on
 * this device, or the illustrative demo dataset. Re-reads when the tab gains
 * focus and whenever saved data changes (an activity finished, a backup
 * restored, or Delete all data).
 */
export function useProgressData(mode: DataMode): { data: ProgressDataset; today: DateKey } {
  const today = toDateKey(new Date());
  const [version, setVersion] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setVersion((value) => value + 1);
    }, []),
  );
  useEffect(
    () =>
      onStoreChange((key) => {
        // Deferred: change events can fire while another component is updating.
        if (key === "activity-log" || key === "sleep") setTimeout(() => setVersion((value) => value + 1), 0);
      }),
    [],
  );

  const data = useMemo(
    () =>
      mode === "demo" ? createDemoDataset(new Date(`${today}T12:00:00`)) : buildUserDataset(readLog(), readSleepLogs()),
    // version forces a re-read of saved data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, today, version],
  );
  return { data, today };
}
