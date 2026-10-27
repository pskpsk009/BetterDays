import { useState } from "react";

import { readItem, removeItem, writeItem } from "./storage";

// Saved activity data lives only on this device, under one prefix so it is
// easy to find, export, and delete. Every saving activity offers its own delete.

const PREFIX = "mygrowth:";

export type StoreKey = "support-circle" | "values-compass" | "skills";

function load<T>(key: StoreKey, fallback: T): T {
  try {
    const raw = readItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function save<T>(key: StoreKey, value: T) {
  try {
    writeItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private browsing, full disk). The activity
    // keeps working for this session; it just won't be remembered.
  }
}

/**
 * Like useState, but the value is saved on the device and restored next time.
 * `clear` deletes the saved value and resets to the fallback.
 */
export function useStoredState<T>(key: StoreKey, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback));

  function update(next: T | ((previous: T) => T)) {
    setValue((previous) => {
      const resolved = typeof next === "function" ? (next as (previous: T) => T)(previous) : next;
      save(key, resolved);
      return resolved;
    });
  }

  function clear() {
    try {
      removeItem(PREFIX + key);
    } catch {
      // Nothing to delete.
    }
    setValue(fallback);
  }

  return [value, update, clear] as const;
}

// ---------- Dates (local calendar days, no times stored) ----------

export type DayKey = string; // YYYY-MM-DD

export function todayKey(date = new Date()): DayKey {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function daysBetween(from: DayKey, to: DayKey): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000);
}

/** A stable pick for the day, so "today's" prompt doesn't change on every visit. */
export function pickForDay<T>(items: T[], salt = 0, day: DayKey = todayKey()): T {
  const seed = day.split("-").reduce((sum, part) => sum * 31 + Number(part), salt);
  return items[Math.abs(seed) % items.length];
}

export function monthName(day: DayKey) {
  const [year, month] = day.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString(undefined, { month: "long" });
}
