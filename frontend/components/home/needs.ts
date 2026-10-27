import type { ActivityInfo, BranchInfo } from "../common/ActivityUI";
import { BODY_BRANCHES, BodyActivityId } from "../body/branches";
import { EMOTIONAL_BRANCHES, EmotionalActivityId } from "../emotional/branches";
import { MENTAL_BRANCHES, MentalActivityId } from "../mental/branches";

// "What do you need right now?": everyday needs mapped to three activities
// each, so people can find something without knowing which branch it lives in.
// These are suggestions only, never a check of how someone is doing.

export type NeedId = "stressed" | "low" | "focus" | "setback" | "choice" | "people" | "grow" | "energy";

type ActivityId = MentalActivityId | EmotionalActivityId | BodyActivityId;

export type Need = {
  id: NeedId;
  icon: string;
  label: string;
  picks: [ActivityId, ActivityId, ActivityId];
};

export const NEEDS: Need[] = [
  { id: "stressed", icon: "😣", label: "Stressed", picks: ["breathing-bubble", "calm-down-toolkit", "senses-grounding"] },
  { id: "low", icon: "😔", label: "Feeling low", picks: ["little-moments", "strengths-garden", "support-circle"] },
  { id: "focus", icon: "😵", label: "Can't focus", picks: ["focus-sprint", "distraction-tracker", "target-tap"] },
  { id: "setback", icon: "🌧", label: "Something went wrong", picks: ["plan-b", "my-next-step", "lessons-not-labels"] },
  { id: "choice", icon: "🤔", label: "Facing a choice", picks: ["values-compass", "what-can-i-control", "one-small-step"] },
  { id: "people", icon: "💬", label: "People stuff", picks: ["conversation-builder", "healthy-boundaries", "walk-in-their-shoes"] },
  { id: "grow", icon: "🌱", label: "Want to grow", picks: ["develop-your-skill", "joy-explorer", "future-me"] },
  { id: "energy", icon: "😴", label: "Tired or sluggish", picks: ["schedule-guidance", "hydration", "daily-stretch"] },
];

export type Suggestion = { tab: "mental" | "body"; activity: ActivityInfo; branch: BranchInfo };

const SOURCES: [Suggestion["tab"], BranchInfo[]][] = [
  ["mental", MENTAL_BRANCHES],
  ["mental", EMOTIONAL_BRANCHES],
  ["body", BODY_BRANCHES],
];

export function findSuggestion(activityId: string): Suggestion | undefined {
  for (const [tab, branches] of SOURCES) {
    for (const branch of branches) {
      const activity = branch.activities.find((item) => item.id === activityId);
      if (activity) return { tab, activity, branch };
    }
  }
  return undefined;
}

/** The user's welcome picks first, then the rest in their usual order. */
export function orderNeeds(focus: NeedId[]): Need[] {
  return [...NEEDS].sort((a, b) => rank(focus, a.id) - rank(focus, b.id));
}

function rank(focus: NeedId[], id: NeedId) {
  const index = focus.indexOf(id);
  return index === -1 ? focus.length : index;
}
