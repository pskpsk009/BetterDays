// Data contracts for the Progress page.
//
// Each record type mirrors one future Supabase table row (one row per
// completed or started activity). The page only ever reads a ProgressDataset,
// so swapping the demo source for real records does not touch the UI.
// Private reflection text is deliberately absent: the dashboard only needs
// counts and self-ratings, never what a user wrote.

import type { FoodGroup } from "../body/fuel/plateFeedback";
import type { ClockTime } from "../common/time";

export type { ClockTime, FoodGroup };

/** Local calendar date, YYYY-MM-DD. */
export type DateKey = string;

/** A 1-5 self-rating. */
export type Rating = 1 | 2 | 3 | 4 | 5;

export type MindfulnessSession = {
  date: DateKey;
  activity: "breathing-bubble" | "senses-grounding" | "watch-thoughts";
  minutes: number;
  /** Present-moment awareness self-rating before and after, if given. */
  awarenessBefore: Rating | null;
  awarenessAfter: Rating | null;
  completed: boolean;
};

export type ReflectionSession = {
  date: DateKey;
  activity: "emotion-explorer" | "reflection-detective" | "what-can-i-control";
  /** Reflection stages reached: situation, thought, emotion, next step (0-4). */
  stagesCompleted: 0 | 1 | 2 | 3 | 4;
  emotionConfidence: Rating | null;
  nextStepPlanned: boolean;
  nextStepDone: boolean;
};

export type FocusSession = {
  date: DateKey;
  activity: "focus-sprint" | "target-tap" | "distraction-tracker";
  minutes: number;
  /** Attention-game answers; null when the activity has no questions. */
  correct: number | null;
  total: number | null;
  /** Distractions noted during the session; null when not tracked. */
  distractions: number | null;
  perceivedFocus: Rating | null;
};

export type HydrationCheckin = {
  date: DateKey;
  drinksLogged: number;
  /** Estimated water content; null when the drink size was not logged. */
  waterMl: number | null;
};

export type PlateActivity = {
  date: DateKey;
  groups: FoodGroup[];
};

export type MovementSession = {
  date: DateKey;
  activity: "daily-stretch" | "desk-break" | "mobility-flow" | "movement-dice" | "body-scan";
  /** Routine length when the activity reports it. */
  minutes: number | null;
};

/** One night of sleep, filed under the date the user woke up. */
export type SleepEntry = {
  date: DateKey;
  bedtime: ClockTime | null;
  wakeTime: ClockTime | null;
};

export type BedtimeRoutine = {
  date: DateKey;
  stepsDone: number;
  stepsTotal: number;
};

/** A repeated check-point questionnaire with the same questions each time. */
export type Assessment = {
  id: string;
  label: string;
  date: DateKey;
  awareness: Rating;
  emotionConfidence: Rating;
  perceivedFocus: Rating;
  focusMinutes: number;
};

export type ProgressDataset = {
  /**
   * "demo" for illustrative mock data, "preview" for the empty new-user view,
   * and "user" once real records load from Supabase.
   */
  source: "demo" | "preview" | "user";
  mindfulness: MindfulnessSession[];
  reflections: ReflectionSession[];
  focus: FocusSession[];
  hydration: HydrationCheckin[];
  plates: PlateActivity[];
  movement: MovementSession[];
  sleep: SleepEntry[];
  bedtimeRoutines: BedtimeRoutine[];
  assessments: Assessment[];
};

export type ProgressArea = "mind" | "body";
