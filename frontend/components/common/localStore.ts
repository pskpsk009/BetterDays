import { useEffect, useState } from "react";

import { readItem, removeItem, writeItem } from "./storage";

// Saved activity data lives on this device, under one prefix so it is easy to
// find, export, and delete. Every saving activity offers its own delete.
// When the user turns on backup, cloudSync mirrors these keys to their account.

const PREFIX = "mygrowth:";
/** When each key last changed on this device (ms), so sync knows which copy is newer. */
const META_KEY = `${PREFIX}meta`;

export const STORE_KEYS = ["support-circle", "values-compass", "skills", "sleep", "welcome", "activity-log"] as const;

export type StoreKey = (typeof STORE_KEYS)[number];

// Mounted useStoredState hooks reload when their key changes outside them
// (Delete all data, or a backup restored from the account).
const reloadListeners = new Set<(key: StoreKey) => void>();
// cloudSync listens here to upload changes.
const changeListeners = new Set<(key: StoreKey) => void>();

export function onLocalChange(listener: (key: StoreKey) => void) {
  changeListeners.add(listener);
  return () => {
    changeListeners.delete(listener);
  };
}

/** Calls `listener` after any saved key changes here, is restored from backup, or is deleted. */
export function onStoreChange(listener: (key: StoreKey) => void) {
  changeListeners.add(listener);
  reloadListeners.add(listener);
  return () => {
    changeListeners.delete(listener);
    reloadListeners.delete(listener);
  };
}

function readMeta(): Partial<Record<StoreKey, number>> {
  try {
    const raw = readItem(META_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function touch(key: StoreKey, at: number) {
  try {
    writeItem(META_KEY, JSON.stringify({ ...readMeta(), [key]: at }));
  } catch {
    // Without a timestamp the key just looks old to sync; nothing breaks.
  }
}

/** When `key` last changed on this device, or 0 if never (or before tracking began). */
export function changedAt(key: StoreKey): number {
  return readMeta()[key] ?? 0;
}

/** The raw saved JSON for `key`, or null. Used by backup and export. */
export function readRaw(key: StoreKey): unknown {
  try {
    const raw = readItem(PREFIX + key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Writes a value that came from the account backup, keeping its timestamp. */
export function applyRemote(key: StoreKey, value: unknown, at: number) {
  try {
    writeItem(PREFIX + key, JSON.stringify(value));
    touch(key, at);
  } catch {
    return;
  }
  reloadListeners.forEach((reload) => reload(key));
}

/** Deletes everything MyGrowth saved on this device. */
export function clearAllSaved() {
  for (const key of STORE_KEYS) {
    try {
      removeItem(PREFIX + key);
    } catch {
      // Nothing to delete.
    }
  }
  // Keep only deletion times: if the backup can't be reached right now, the
  // next sync sees the deletion as newest and removes the backup copy too.
  try {
    const now = Date.now();
    writeItem(META_KEY, JSON.stringify(Object.fromEntries(STORE_KEYS.map((key) => [key, now]))));
  } catch {
    // Without timestamps, an unreachable backup could restore old data on next sync.
  }
  STORE_KEYS.forEach((key) => reloadListeners.forEach((reload) => reload(key)));
}

/**
 * Removes everything from this device without recording a deletion, used when
 * signing out on a shared phone. The account backup is untouched, and signing
 * in again restores it (unlike clearAllSaved, whose deletion wins on sync).
 */
export function forgetOnThisDevice() {
  for (const key of [...STORE_KEYS.map((item) => PREFIX + item), META_KEY]) {
    try {
      removeItem(key);
    } catch {
      // Nothing to delete.
    }
  }
  STORE_KEYS.forEach((key) => reloadListeners.forEach((reload) => reload(key)));
}

export function hasSavedData() {
  return STORE_KEYS.some((key) => readRaw(key) !== null);
}

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
    touch(key, Date.now());
  } catch {
    // Storage can be unavailable (private browsing, full disk). The activity
    // keeps working for this session; it just won't be remembered.
    return;
  }
  changeListeners.forEach((listener) => listener(key));
}

/** Updates a saved value from outside a component (e.g. the activity log). */
export function updateSaved<T>(key: StoreKey, fallback: T, next: (previous: T) => T) {
  save(key, next(load(key, fallback)));
  reloadListeners.forEach((reload) => reload(key));
}

/**
 * Like useState, but the value is saved on the device and restored next time.
 * `clear` deletes the saved value and resets to the fallback.
 */
export function useStoredState<T>(key: StoreKey, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback));

  useEffect(() => {
    const reload = (changed: StoreKey) => {
      if (changed === key) setValue(load(key, fallback));
    };
    reloadListeners.add(reload);
    return () => {
      reloadListeners.delete(reload);
    };
  }, [key, fallback]);

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
      touch(key, Date.now());
    } catch {
      // Nothing to delete.
    }
    setValue(fallback);
    changeListeners.forEach((listener) => listener(key));
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
