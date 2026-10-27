import type { ActivityInfo, BranchInfo } from "../common/ActivityUI";

export type BodyBranchId = "fuel" | "movement" | "sleep";

export type BodyActivityId =
  | "hydration"
  | "balanced-plate"
  | "drink-detective"
  | "daily-stretch"
  | "desk-break"
  | "mobility-flow"
  | "movement-dice"
  | "body-scan"
  | "bedtime-routine"
  | "sleep-environment"
  | "schedule-guidance";

export type BodyBranch = BranchInfo & {
  id: BodyBranchId;
  activities: (ActivityInfo & { id: BodyActivityId })[];
};

export const BODY_BRANCHES: BodyBranch[] = [
  {
    id: "fuel",
    title: "Fuel Your Body",
    tagline: "Nourish yourself, one small habit at a time.",
    description:
      "Explore hydration, balanced meals, and everyday nutrition habits. No diets, no judgement, just curiosity.",
    color: "#3A8A4F",
    soft: "#E8F5EA",
    activities: [
      {
        id: "hydration",
        title: "Hydration Check-in",
        detail: "Tap a glass each time you have a drink.",
        glyph: "water-outline",
      },
      {
        id: "balanced-plate",
        title: "Build a Balanced Plate",
        detail: "Fill a plate with food groups and see what each adds.",
        glyph: "silverware-fork-knife",
      },
      {
        id: "drink-detective",
        title: "Drink Detective",
        detail: "Compare water, caffeine, and sugar in common drinks.",
        glyph: "cup-water",
      },
    ],
  },
  {
    id: "movement",
    title: "Movement & Flexibility",
    tagline: "Move comfortably, one small break at a time.",
    description:
      "Short, gentle movement breaks and mobility routines you can fit into an ordinary day.",
    color: "#C15F2C",
    soft: "#FCEEE4",
    activities: [
      {
        id: "daily-stretch",
        title: "Daily Stretch",
        detail: "A guided 3, 5, or 10-minute stretch routine.",
        glyph: "human-handsup",
      },
      {
        id: "desk-break",
        title: "Desk Break",
        detail: "Gentle moves for when you've been sitting a while.",
        glyph: "chair-rolling",
      },
      {
        id: "mobility-flow",
        title: "Mobility Flow",
        detail: "Simple joint-friendly movements, one card at a time.",
        glyph: "rotate-3d-variant",
      },
      {
        id: "movement-dice",
        title: "Movement Dice",
        detail: "Roll for a quick, gentle movement idea.",
        glyph: "dice-5-outline",
      },
      {
        id: "body-scan",
        title: "Body Awareness Scan",
        detail: "Check in with how different areas feel right now.",
        glyph: "human",
      },
    ],
  },
  {
    id: "sleep",
    title: "Good Night Sleep",
    tagline: "Rest better, one habit at a time.",
    description:
      "Build a relaxing bedtime routine, make your space sleep-friendly, and shape a schedule that suits you.",
    color: "#4B4FA0",
    soft: "#EDEDFA",
    activities: [
      {
        id: "bedtime-routine",
        title: "Relaxing Bedtime Routine",
        detail: "Pick calming wind-down steps and start a routine.",
        glyph: "weather-night",
      },
      {
        id: "sleep-environment",
        title: "Improve the Sleep Environment",
        detail: "Simple ways to make your bedroom more restful.",
        glyph: "bed-outline",
      },
      {
        id: "schedule-guidance",
        title: "Sleep Schedule Guidance",
        detail: "See how to shift a sleep schedule gradually.",
        glyph: "calendar-clock",
      },
    ],
  },
];
