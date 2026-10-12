// Pure timing helpers shared by the timed Mental Development activities.

// Breathing Bubble pattern. No breath-holding phase: it only alternates a
// gentle in-breath and a longer out-breath.
export const INHALE_MS = 4000;
export const EXHALE_MS = 6000;
export const CYCLE_MS = INHALE_MS + EXHALE_MS;

export const BUBBLE_MIN_SCALE = 0.6;
export const BUBBLE_MAX_SCALE = 1;

export type BreathPhase = {
  label: "Breathe in" | "Breathe out";
  /** Increments every phase change; useful as an animation key. */
  step: number;
  remainingMs: number;
  targetScale: number;
};

export function getBreathPhase(elapsedMs: number): BreathPhase {
  const safeElapsed = Math.max(0, elapsedMs);
  const cycle = Math.floor(safeElapsed / CYCLE_MS);
  const position = safeElapsed % CYCLE_MS;

  if (position < INHALE_MS) {
    return {
      label: "Breathe in",
      step: cycle * 2,
      remainingMs: INHALE_MS - position,
      targetScale: BUBBLE_MAX_SCALE,
    };
  }

  return {
    label: "Breathe out",
    step: cycle * 2 + 1,
    remainingMs: CYCLE_MS - position,
    targetScale: BUBBLE_MIN_SCALE,
  };
}

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
