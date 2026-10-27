import { IconName } from "../common/AppIcon";

// Shared by Focus Sprint and Distraction Tracker: the things that disrupt a
// focus session, three fixes for each, and a small in-memory hand-off so a
// sprint can open the tracker (and the tracker's plan can follow into the next
// sprint). Nothing here is saved; it clears when the app closes.

export type DisruptorId =
  | "phone"
  | "thoughts"
  | "noise"
  | "tired"
  | "other-tasks"
  | "people"
  | "hungry"
  | "stuck"
  | "bored";

export type Disruptor = { id: DisruptorId; icon: IconName; label: string; fixes: [string, string, string] };

export const DISRUPTORS: Disruptor[] = [
  {
    id: "phone",
    icon: "cellphone",
    label: "Phone or notifications",
    fixes: ["Put my phone in another room", "Turn on Do Not Disturb", "Leave it face down until the timer ends"],
  },
  {
    id: "thoughts",
    icon: "thought-bubble-outline",
    label: "Random thoughts",
    fixes: ["Keep a scrap of paper to park thoughts", "Write my worry down before I start", "Notice it, then say “later” and return"],
  },
  {
    id: "noise",
    icon: "volume-high",
    label: "Noise around me",
    fixes: ["Wear headphones or earplugs", "Play quiet background sound", "Move to a quieter spot"],
  },
  {
    id: "tired",
    icon: "sleep",
    label: "Feeling tired",
    fixes: ["Drink water and stretch first", "Pick a shorter sprint", "Study at a time I feel more awake"],
  },
  {
    id: "other-tasks",
    icon: "clipboard-list-outline",
    label: "Other tasks on my mind",
    fixes: ["List them first, then pick one", "Do a 2-minute task before starting", "Plan a sprint for each task"],
  },
  {
    id: "people",
    icon: "account-voice",
    label: "People interrupting",
    fixes: ["Tell people I'm focusing until a set time", "Find a spot with fewer people", "Use headphones as a “busy” sign"],
  },
  {
    id: "hungry",
    icon: "food-apple-outline",
    label: "Hungry or thirsty",
    fixes: ["Have a snack before starting", "Keep water next to me", "Plan a snack for the break"],
  },
  {
    id: "stuck",
    icon: "wall",
    label: "Didn't know where to start",
    fixes: ["Break it into the first tiny step", "Start with the easiest part", "Ask someone or check notes first"],
  },
  {
    id: "bored",
    icon: "emoticon-neutral-outline",
    label: "Task felt boring",
    fixes: ["Set a small goal for this sprint", "Add a reward when the timer ends", "Switch how I study (quiz, draw, explain)"],
  },
];

export function getDisruptor(id: DisruptorId) {
  return DISRUPTORS.find((item) => item.id === id)!;
}

export type FocusFix = { disruptor: DisruptorId; fix: string };

export type SprintResult = {
  task: string;
  minutes: number;
  finished: boolean;
  disruptors: DisruptorId[];
};

let lastSprint: SprintResult | null = null;
let plan: FocusFix[] = [];

/** Focus Sprint hands its result to the Distraction Tracker. */
export function setSprintResult(result: SprintResult) {
  lastSprint = result;
}

/** Read once: the tracker takes the sprint result so it isn't reused later. */
export function takeSprintResult() {
  const result = lastSprint;
  lastSprint = null;
  return result;
}

export function setFocusPlan(next: FocusFix[]) {
  plan = next;
}

export function getFocusPlan() {
  return plan;
}
