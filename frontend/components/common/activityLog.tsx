import { createContext, useCallback, useContext, useMemo, useRef } from "react";

import type { FoodGroup } from "../body/fuel/plateFeedback";
import { DayKey, daysBetween, todayKey, updateSaved } from "./localStore";

// A small history of finished activities for the Progress page, saved on the
// device under "activity-log" (and backed up with the other keys when backup
// is on). Each entry says which activity, on which day and for roughly how
// long. Nothing the user typed or picked inside an activity is kept, except
// the drink count and food groups that Progress charts.

export type LogEntry = {
  id: string;
  date: DayKey;
  activity: string;
  minutes?: number;
  drinks?: number;
  waterMl?: number;
  groups?: FoodGroup[];
};

// Module-level so the stored-state fallback is stable between renders.
export const EMPTY_LOG: LogEntry[] = [];

const KEEP_DAYS = 365;
// Keeps the saved value well under the 64 KB backup limit.
const MAX_ENTRIES = 500;

/** Adds an entry, or replaces the one with the same id. Newest first. */
export function saveLogEntry(entry: LogEntry) {
  updateSaved("activity-log", EMPTY_LOG, (log) =>
    [entry, ...log.filter((item) => item.id !== entry.id)]
      .filter((item) => daysBetween(item.date, todayKey()) < KEEP_DAYS)
      .slice(0, MAX_ENTRIES),
  );
}

export function removeLogEntry(id: string) {
  updateSaved("activity-log", EMPTY_LOG, (log) => log.filter((item) => item.id !== id));
}

function newId(activity: string) {
  return `${activity}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const ActivityContext = createContext<{ activityId: string; startedAt: { current: number } } | null>(null);

/** Wrap an open activity so its completion can be logged. Key it by activity id. */
export function ActivityLogProvider({ activityId, children }: { activityId: string; children: React.ReactNode }) {
  const startedAt = useRef(Date.now());
  const value = useMemo(() => ({ activityId, startedAt }), [activityId]);
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

/**
 * Returns a function that records one completion of the open activity, with
 * the minutes since it opened (or since the last completion, for "do again").
 * Does nothing outside an ActivityLogProvider.
 */
export function useLogCompletion() {
  const context = useContext(ActivityContext);
  return useCallback(() => {
    if (!context) return;
    const now = Date.now();
    const minutes = Math.max(1, Math.round((now - context.startedAt.current) / 60_000));
    context.startedAt.current = now;
    saveLogEntry({ id: newId(context.activityId), date: todayKey(), activity: context.activityId, minutes });
  }, [context]);
}

/**
 * For activities that build up over a visit (water, plate): one entry per
 * visit that is updated as the user goes, or removed when they clear it.
 */
export function useVisitEntry(activity: string) {
  const id = useRef(newId(activity));
  return useMemo(
    () => ({
      save: (details: Omit<LogEntry, "id" | "date" | "activity">) =>
        saveLogEntry({ id: id.current, date: todayKey(), activity, ...details }),
      remove: () => removeLogEntry(id.current),
    }),
    [activity],
  );
}
