import type { ActivityInfo, BranchInfo } from "../common/ActivityUI";

// Mental Wellness: five branches, three activities each.
// Activity IDs reused from the original Mind branches are unchanged.

export type MentalBranchId =
  | "self-acceptance"
  | "discover-joy"
  | "purpose"
  | "live-the-life"
  | "find-your-focus";

export type MentalActivityId =
  | "letter-to-past-self"
  | "lessons-not-labels"
  | "strengths-garden"
  | "joy-explorer"
  | "develop-your-skill"
  | "little-moments"
  | "values-compass"
  | "future-me"
  | "one-small-step"
  | "breathing-bubble"
  | "senses-grounding"
  | "watch-thoughts"
  | "focus-sprint"
  | "target-tap"
  | "distraction-tracker";

export type MentalActivity = ActivityInfo & { id: MentalActivityId };

export type MentalBranch = BranchInfo & {
  id: MentalBranchId;
  activities: [MentalActivity, MentalActivity, MentalActivity];
};

export const MENTAL_BRANCHES: MentalBranch[] = [
  {
    id: "self-acceptance",
    title: "Self-Acceptance",
    tagline: "Make peace with the past.",
    description:
      "Look back with kindness, learn from experiences without being defined by them, and notice your strengths.",
    color: "#5E8C61",
    soft: "#EAF3EA",
    activities: [
      {
        id: "letter-to-past-self",
        title: "Letter to My Past Self",
        detail: "Write a few kind words to a younger you.",
        glyph: "✉",
      },
      {
        id: "lessons-not-labels",
        title: "Lessons, Not Labels",
        detail: "Find what an experience taught you, without judging yourself.",
        glyph: "✎",
      },
      {
        id: "strengths-garden",
        title: "My Strengths Garden",
        detail: "Pick the strengths and qualities you'd like to grow.",
        glyph: "✿",
      },
    ],
  },
  {
    id: "discover-joy",
    title: "Discover Your Joy",
    tagline: "Enjoy today by finding what you love.",
    description:
      "Explore interests, try something small and new, and notice the moments that make everyday life feel good.",
    color: "#B7791F",
    soft: "#FBF1DE",
    activities: [
      {
        id: "joy-explorer",
        title: "Joy Explorer",
        detail: "Pick a field and roll the dice for an idea to try.",
        glyph: "☀",
      },
      {
        id: "develop-your-skill",
        title: "Develop Your Skill",
        detail: "Polish a skill you have, or find one to start.",
        glyph: "◎",
      },
      {
        id: "little-moments",
        title: "Little Moments Journal",
        detail: "Capture a small moment that felt good.",
        glyph: "❋",
      },
    ],
  },
  {
    id: "purpose",
    title: "Purpose in Life",
    tagline: "Explore what matters to you, for tomorrow.",
    description:
      "Discover your values and hopes. You don't need your whole future figured out, and small goals count too.",
    color: "#3D7F8F",
    soft: "#E3F1F4",
    activities: [
      {
        id: "values-compass",
        title: "Values Compass",
        detail: "Choose the values that matter most to you.",
        glyph: "✦",
      },
      {
        id: "future-me",
        title: "Future Me",
        detail: "Imagine what a meaningful future could look like.",
        glyph: "→",
      },
      {
        id: "one-small-step",
        title: "One Small Step",
        detail: "Pick one manageable action toward a goal.",
        glyph: "↗",
      },
    ],
  },
  {
    id: "live-the-life",
    title: "Live the Life",
    tagline: "Notice and enjoy the present moment.",
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
    id: "find-your-focus",
    title: "Find Your Focus",
    tagline: "Practice directing and holding attention.",
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
        detail: "Spot what disrupted your focus session and plan a fix.",
        glyph: "↺",
      },
    ],
  },
];

export function getMentalBranch(id: MentalBranchId): MentalBranch {
  const branch = MENTAL_BRANCHES.find((item) => item.id === id);
  if (!branch) throw new Error(`Unknown mental branch: ${id}`);
  return branch;
}
