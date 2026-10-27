// DEMO DATA ONLY: not real user history.
//
// Builds a deterministic, illustrative dataset dated relative to `today` so
// the period selector has something to show. Replace `createDemoDataset` with
// Supabase queries that return the same ProgressDataset shape (see
// useProgressData.ts). The assessment values are the illustrative figures
// from the Progress page brief.

import { addDays, toDateKey } from "./progressMath";
import type {
  FocusSession,
  FoodGroup,
  MindfulnessSession,
  MovementSession,
  ProgressDataset,
  Rating,
  ReflectionSession,
} from "./types";

const DEMO_DAYS = 63;

// Small seeded generator so the demo looks the same on every render and device.
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampRating(value: number): Rating {
  return Math.min(5, Math.max(1, Math.round(value))) as Rating;
}

export function createDemoDataset(today: Date = new Date()): ProgressDataset {
  const random = seededRandom(20261013);
  const chance = (probability: number) => random() < probability;
  const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];

  const end = toDateKey(today);
  const data: ProgressDataset = {
    source: "demo",
    mindfulness: [],
    reflections: [],
    focus: [],
    hydration: [],
    plates: [],
    movement: [],
    sleep: [],
    bedtimeRoutines: [],
    other: [],
    assessments: [
      {
        id: "baseline",
        label: "Baseline",
        date: addDays(end, -28),
        awareness: 2,
        emotionConfidence: 2,
        perceivedFocus: 2,
        focusMinutes: 6,
      },
      {
        id: "week-4",
        label: "After 4 weeks",
        date: end,
        awareness: 4,
        emotionConfidence: 4,
        perceivedFocus: 4,
        focusMinutes: 10,
      },
    ],
  };

  for (let ago = DEMO_DAYS - 1; ago >= 0; ago -= 1) {
    const date = addDays(end, -ago);
    // 0 at the start of the demo history, 1 today; nudges demo ratings upward.
    const drift = 1 - ago / DEMO_DAYS;

    if (chance(0.45 + drift * 0.35)) {
      const activity = pick(["breathing-bubble", "senses-grounding", "watch-thoughts"] as const);
      const before = clampRating(2 + drift + random() - 0.3);
      const session: MindfulnessSession = {
        date,
        activity,
        minutes: between(3, 10),
        awarenessBefore: chance(0.85) ? before : null,
        awarenessAfter: chance(0.85) ? clampRating(before + random() * 1.6) : null,
        completed: activity === "senses-grounding" ? chance(0.8) : true,
      };
      data.mindfulness.push(session);
    }

    if (chance(0.3)) {
      const stages = (chance(0.7) ? 4 : between(1, 3)) as ReflectionSession["stagesCompleted"];
      const planned = stages === 4;
      data.reflections.push({
        date,
        activity: pick(["emotion-explorer", "reflection-detective", "what-can-i-control"] as const),
        stagesCompleted: stages,
        emotionConfidence: chance(0.9) ? clampRating(2 + drift * 2 + random() - 0.5) : null,
        nextStepPlanned: planned,
        nextStepDone: planned && chance(0.65),
      });
    }

    if (chance(0.5)) {
      const activity = pick(["focus-sprint", "target-tap", "distraction-tracker"] as const);
      const total = activity === "target-tap" ? between(15, 25) : null;
      const session: FocusSession = {
        date,
        activity,
        minutes: Math.round(6 + drift * 4 + random() * 2 - 1),
        correct: total === null ? null : Math.round(total * (0.6 + drift * 0.2 + random() * 0.15)),
        total,
        distractions: activity === "distraction-tracker" ? between(0, 5) : null,
        perceivedFocus: chance(0.85) ? clampRating(2 + drift * 2 + random() - 0.5) : null,
      };
      data.focus.push(session);
    }

    for (let checkin = between(0, 3); checkin > 0; checkin -= 1) {
      const drinks = between(1, 2);
      data.hydration.push({
        date,
        drinksLogged: drinks,
        waterMl: chance(0.7) ? drinks * pick([200, 250, 330] as const) : null,
      });
    }

    if (chance(0.35)) {
      const groups: FoodGroup[] = ["vegetables", "fruits", "protein", "carbs", "fats"];
      data.plates.push({ date, groups: groups.filter(() => chance(0.85)) });
    }

    if (chance(0.65)) {
      const activity = pick([
        "daily-stretch",
        "desk-break",
        "mobility-flow",
        "movement-dice",
        "body-scan",
      ] as const);
      const session: MovementSession = {
        date,
        activity,
        minutes: activity === "movement-dice" && chance(0.5) ? null : between(3, 12),
      };
      data.movement.push(session);
    }

    // Sleep logging begins partway through the demo history.
    if (ago < 30 && chance(0.7)) {
      const bedtimeMinutes = 22 * 60 + 30 + between(0, 135);
      data.sleep.push({
        date,
        bedtime: { hour: Math.floor(bedtimeMinutes / 60) % 24, minute: bedtimeMinutes % 60 },
        wakeTime: chance(0.9) ? { hour: between(6, 7), minute: pick([0, 15, 30, 45] as const) } : null,
      });
    }

    if (chance(0.4)) {
      data.bedtimeRoutines.push({ date, stepsDone: between(3, 5), stepsTotal: 5 });
    }
  }

  return data;
}

/** A dataset with no records, filled in by useProgressData. */
export function createEmptyDataset(): ProgressDataset {
  return {
    source: "user",
    mindfulness: [],
    reflections: [],
    focus: [],
    hydration: [],
    plates: [],
    movement: [],
    sleep: [],
    bedtimeRoutines: [],
    other: [],
    assessments: [],
  };
}
