import type { ActivityProps } from "../common/ActivityUI";
import { SmallStepPicker } from "../common/GuidedActivities";

// Stand Up Again (resilience). Setbacks are normal; nobody has to be strong
// all the time, recover quickly, or handle problems alone.

const BRANCH = "Stand Up Again";

export function MyNextStep(props: ActivityProps) {
  return (
    <SmallStepPicker
      {...props}
      branch={BRANCH}
      title="My Next Step"
      intro="When something feels hard, you don't have to solve it all at once. Let's find one next step, at your pace."
      context={{
        question: "What's feeling hard right now?",
        hint: "A few words is enough, or skip this.",
        placeholder: "e.g. I'm behind on schoolwork",
        ideas: ["Schoolwork or work", "A friendship", "Family", "Money", "Health", "A big change"],
      }}
      stepQuestion="What could be one next step?"
      groups={[
        {
          title: "Understand it",
          options: ["Write down what's in my control", "Break the problem into smaller parts"],
        },
        {
          title: "Get support",
          options: ["Talk to someone I trust", "Ask a teacher, manager, or advisor for help"],
        },
        {
          title: "Look after myself",
          options: ["Take a short break, then come back", "Get some rest tonight and look again tomorrow"],
        },
        {
          title: "Take action",
          options: ["Do the smallest part for 10 minutes", "Send one message that moves things forward"],
        },
      ]}
      customPlaceholder="Or write your own next step…"
      tips={[
        "It's okay if this takes time. Bouncing back is rarely quick or straight.",
        "Asking for help is a strong step, not a weak one.",
      ]}
      completion={{
        badge: "↑",
        title: "Next step found",
        message: "One step at a time is how hard things get easier. Be kind to yourself along the way.",
      }}
    />
  );
}
