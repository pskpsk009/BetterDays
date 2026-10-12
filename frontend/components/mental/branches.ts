import type { ActivityInfo, BranchInfo } from "../common/ActivityUI";

export type BranchId = "mindfulness" | "awareness" | "concentration";

export type ActivityId =
  | "breathing-bubble"
  | "senses-grounding"
  | "watch-thoughts"
  | "emotion-explorer"
  | "reflection-detective"
  | "what-can-i-control"
  | "focus-sprint"
  | "target-tap"
  | "distraction-tracker";

export type ActivityData = ActivityInfo & { id: ActivityId };

export type BranchData = BranchInfo & {
  id: BranchId;
  activities: ActivityData[];
};

export const BRANCHES: BranchData[] = [
  {
    id: "mindfulness",
    title: "Mindfulness",
    tagline: "Learn to notice the present moment.",
    description:
      "Slow down, notice the present moment, and become more aware of thoughts and surroundings.",
    color: "#2B8273",
    soft: "#E4F3EE",
    activities: [
      {
        id: "breathing-bubble",
        title: "Breathing Bubble",
        detail: "Follow a slow, gentle circle as you breathe.",
        glyph: "○",
      },
      {
        id: "senses-grounding",
        title: "5-Senses Grounding",
        detail: "Notice what is around you, one sense at a time.",
        glyph: "5",
      },
      {
        id: "watch-thoughts",
        title: "Watch Your Thoughts",
        detail: "Observe a thought and let it drift by.",
        glyph: "~",
      },
    ],
  },
  {
    id: "awareness",
    title: "Self-Awareness",
    tagline: "Learn to understand emotions, thoughts, and behaviors.",
    description:
      "Explore emotions, thoughts, reactions, and personal habits.",
    color: "#7E5DB5",
    soft: "#F2EDFA",
    activities: [
      {
        id: "emotion-explorer",
        title: "Emotion Explorer",
        detail: "Put a name to what you are feeling.",
        glyph: "♡",
      },
      {
        id: "reflection-detective",
        title: "Reflection Detective",
        detail: "Look gently at a moment from your day.",
        glyph: "?",
      },
      {
        id: "what-can-i-control",
        title: "What Can I Control?",
        detail: "Sort what is in your hands and what is not.",
        glyph: "◐",
      },
    ],
  },
  {
    id: "concentration",
    title: "Concentration",
    tagline: "Practice directing and maintaining attention.",
    description:
      "Practice focusing attention, maintaining focus, and returning to tasks after distractions.",
    color: "#3F6FC4",
    soft: "#EAF0FB",
    activities: [
      {
        id: "focus-sprint",
        title: "Focus Sprint",
        detail: "A short, single-task block of attention.",
        glyph: "»",
      },
      {
        id: "target-tap",
        title: "Target Tap",
        detail: "A quick game: tap only the shapes that match.",
        glyph: "◎",
      },
      {
        id: "distraction-tracker",
        title: "Distraction Tracker",
        detail: "Note what pulls you away, and get a tip.",
        glyph: "↺",
      },
    ],
  },
];

export function getBranch(id: BranchId): BranchData {
  const branch = BRANCHES.find((item) => item.id === id);
  if (!branch) throw new Error(`Unknown branch: ${id}`);
  return branch;
}
