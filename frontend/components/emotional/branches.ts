import type { ActivityInfo, BranchInfo } from "../common/ActivityUI";

// Emotional Wellness: four branches, three activities each.
// The Self-Awareness activities keep their original IDs.

export type EmotionalBranchId =
  | "stand-up-again"
  | "self-awareness"
  | "self-control"
  | "social-creatures";

export type EmotionalActivityId =
  | "my-next-step"
  | "plan-b"
  | "support-circle"
  | "emotion-explorer"
  | "reflection-detective"
  | "what-can-i-control"
  | "pause-before-reacting"
  | "calm-down-toolkit"
  | "choose-your-response"
  | "conversation-builder"
  | "walk-in-their-shoes"
  | "healthy-boundaries";

export type EmotionalActivity = ActivityInfo & { id: EmotionalActivityId };

export type EmotionalBranch = BranchInfo & {
  id: EmotionalBranchId;
  activities: [EmotionalActivity, EmotionalActivity, EmotionalActivity];
};

export const EMOTIONAL_BRANCHES: EmotionalBranch[] = [
  {
    id: "stand-up-again",
    title: "Stand Up Again",
    tagline: "Find your way through setbacks.",
    description:
      "Work through hard moments one step at a time, adapt when plans change, and remember you don't have to do it alone.",
    color: "#C2603A",
    soft: "#FBEDE6",
    activities: [
      {
        id: "my-next-step",
        title: "My Next Step",
        detail: "Turn something hard into one doable action.",
        glyph: "↑",
      },
      {
        id: "plan-b",
        title: "Plan B",
        detail: "Explore other ways forward when a plan falls through.",
        glyph: "⇄",
      },
      {
        id: "support-circle",
        title: "My Support Circle",
        detail: "Notice the people and places you could turn to.",
        glyph: "◍",
      },
    ],
  },
  {
    id: "self-awareness",
    title: "Self-Awareness",
    tagline: "Understand emotions, thoughts, and reactions.",
    description: "Explore emotions, thoughts, reactions, and personal habits.",
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
    id: "self-control",
    title: "Self-Control",
    tagline: "Pause, then choose how to respond.",
    description:
      "All feelings are valid. Practise pausing, calming your body, and choosing a response that works for you.",
    color: "#B5527A",
    soft: "#F9EAF1",
    activities: [
      {
        id: "pause-before-reacting",
        title: "Pause Before Reacting",
        detail: "Look back at a tough moment and plan your pause for next time.",
        glyph: "‖",
      },
      {
        id: "calm-down-toolkit",
        title: "Calm-Down Toolkit",
        detail: "Build a set of ways to settle when feelings run high.",
        glyph: "❖",
      },
      {
        id: "choose-your-response",
        title: "Choose Your Response",
        detail: "Explore different responses to everyday moments.",
        glyph: "⑂",
      },
    ],
  },
  {
    id: "social-creatures",
    title: "Social Creatures",
    tagline: "Connect, communicate, and set boundaries.",
    description:
      "Practise starting conversations, seeing other points of view, and expressing your needs, at your own comfort level.",
    color: "#C9802A",
    soft: "#FCF0DF",
    activities: [
      {
        id: "conversation-builder",
        title: "Conversation Builder",
        detail: "Practise openers and open-ended questions.",
        glyph: "❝",
      },
      {
        id: "walk-in-their-shoes",
        title: "Walk in Their Shoes",
        detail: "Imagine how someone else might see a situation.",
        glyph: "⇆",
      },
      {
        id: "healthy-boundaries",
        title: "Healthy Boundaries",
        detail: "Practise saying what you need, kindly and clearly.",
        glyph: "▢",
      },
    ],
  },
];

export function getEmotionalBranch(id: EmotionalBranchId): EmotionalBranch {
  const branch = EMOTIONAL_BRANCHES.find((item) => item.id === id);
  if (!branch) throw new Error(`Unknown emotional branch: ${id}`);
  return branch;
}
