import type { ActivityProps } from "../common/ActivityUI";
import { ReflectionJournal } from "../common/GuidedActivities";

// Discover Your Joy activities. People enjoy different things, so every list
// is a menu to choose from, never a recommendation that everyone should follow.

const BRANCH = "Discover Your Joy";

export function LittleMoments(props: ActivityProps) {
  return (
    <ReflectionJournal
      {...props}
      branch={BRANCH}
      title="Little Moments Journal"
      intro="Big joys are rare, but small good moments happen often. Let's notice one."
      main={{
        label: "Capture a moment",
        description: "",
        prompts: [
          {
            question: "What was a small moment that felt good recently?",
            hint: "A warm drink, a funny message, a nice song, a quiet minute…",
            placeholder: "Describe it in a few words…",
          },
          {
            question: "How did it feel?",
            ideas: ["Enjoyable", "Interesting", "Peaceful", "Meaningful", "Funny", "Cosy"],
          },
          {
            question: "What made it good?",
            ideas: ["The people", "The place", "Taking a break", "Doing something I like", "Feeling proud"],
          },
        ],
      }}
      completion={{
        badge: "❋",
        title: "Moment captured",
        message: "Noticing small good moments can help them stand out more over time. You can come back to add another.",
      }}
    />
  );
}
