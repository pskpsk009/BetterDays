// Pure timing helpers for the Breathing Bubble.

// No breath-holding phase: it only alternates a
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
