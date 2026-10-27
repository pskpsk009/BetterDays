import type { ChoiceGroup, ChoiceOption } from "../common/GuidedActivities";

// Strengths shared by every My Strengths Garden mode, each with small,
// optional challenges for growing it a little more.

export const STRENGTH_GROUPS: ChoiceGroup[] = [
  {
    title: "Heart",
    options: [
      { label: "Kind", icon: "flower-tulip-outline", note: "You notice what others need and care about them." },
      { label: "Loyal", icon: "flower", note: "People can count on you to stick around." },
      { label: "Good listener", icon: "flower-poppy", note: "You help people feel heard." },
      { label: "Fair", icon: "flower-outline", note: "You try to treat people equally." },
    ],
  },
  {
    title: "Mind",
    options: [
      { label: "Curious", icon: "sprout-outline", note: "You like to learn and ask questions." },
      { label: "Creative", icon: "flower-tulip", note: "You come up with new ideas and ways of doing things." },
      { label: "Problem-solver", icon: "leaf", note: "You look for ways through challenges." },
      { label: "Thoughtful", icon: "clover", note: "You take time to think things through." },
    ],
  },
  {
    title: "Spirit",
    options: [
      { label: "Determined", icon: "tree-outline", note: "You keep going when things get hard." },
      { label: "Funny", icon: "flower-poppy", note: "You bring lightness and laughter." },
      { label: "Brave", icon: "flower", note: "You try things even when you're nervous." },
      { label: "Patient", icon: "barley", note: "You can wait and stay steady." },
    ],
  },
];

export const STRENGTHS: ChoiceOption[] = STRENGTH_GROUPS.flatMap((group) => group.options);

export const CHALLENGES: Record<string, string[]> = {
  Kind: [
    "Do one small thing for someone without being asked.",
    "Send a message to someone who might be having a hard week.",
    "Say one kind thing to yourself when you make a mistake today.",
  ],
  Loyal: [
    "Check in on a friend you haven't heard from in a while.",
    "Keep one small promise you made, even if it's easy to skip.",
    "Stand up for someone when they're not in the room.",
  ],
  "Good listener": [
    "In your next conversation, ask one follow-up question before sharing your own story.",
    "Put your phone away for one whole conversation.",
    "Repeat back what someone said in your own words, to check you understood.",
  ],
  Fair: [
    "Notice who hasn't had a turn to speak, and invite them in.",
    "Before deciding something, think about how it looks from the other side.",
    "Share a job or a treat evenly with someone today.",
  ],
  Curious: [
    "Ask one question in class or at work that you'd normally skip.",
    "Look up one thing you've always wondered about.",
    "Ask someone about a hobby of theirs you know nothing about.",
  ],
  Creative: [
    "Solve an everyday problem in a way you haven't tried before.",
    "Spend ten minutes making something just for fun.",
    "Change one small part of your routine and see what happens.",
  ],
  "Problem-solver": [
    "Pick one small annoyance and find a fix for it.",
    "When something goes wrong today, list two possible ways through it.",
    "Help someone think through a problem by asking what they've already tried.",
  ],
  Thoughtful: [
    "Pause for a breath before replying to one message today.",
    "Write down one decision you're facing and two pros and cons.",
    "Thank someone for something specific they did.",
  ],
  Determined: [
    "Spend ten more minutes on something you were about to give up on.",
    "Break a big task into three steps and do the first one.",
    "Try again at something that didn't work the first time.",
  ],
  Funny: [
    "Share something that made you laugh with a friend.",
    "Find the funny side of one small thing that went wrong.",
    "Make someone smile today, in whatever way feels natural.",
  ],
  Brave: [
    "Ask one question in class you'd normally skip.",
    "Say hello to someone you don't usually talk to.",
    "Share an idea or opinion you'd usually keep to yourself.",
  ],
  Patient: [
    "When you feel rushed today, slow down and take one breath first.",
    "Let someone else go first, in a queue or a conversation.",
    "Stick with a slow task for five minutes without switching.",
  ],
};

export const SPOT_PEOPLE = ["A friend", "Family", "A classmate or colleague", "A teacher or mentor", "A stranger", "Me"];
