// Pure time helpers shared by timed activities.

/** Formats seconds as m:ss, rounding up so a countdown never shows 0:00 early. */
export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * Elapsed time for a pausable timer: time banked from earlier runs plus the
 * current run (if any), capped at the session length.
 */
export function elapsedFor(
  bankedMs: number,
  runStartedAt: number | null,
  now: number,
  durationMs: number,
): number {
  const running = runStartedAt === null ? 0 : Math.max(0, now - runStartedAt);
  return Math.min(durationMs, bankedMs + running);
}

/** A 24-hour clock time (hour 0-23), as picked in the TimePicker. */
export type ClockTime = { hour: number; minute: number };

/** Formats as 24-hour HH:MM, e.g. 23:30 or 07:05. */
export function formatTime(time: ClockTime): string {
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`;
}
