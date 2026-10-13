import type { ActivityProps } from "../common/ActivityUI";
import { ChoiceExplorer, ReflectionJournal, SmallStepPicker } from "../common/GuidedActivities";

// Purpose in Life activities: exploration, not pressure. Purpose can change,
// and small everyday goals are meaningful too.

const BRANCH = "Purpose in Life";

export function ValuesCompass(props: ActivityProps) {
  return (
    <ChoiceExplorer
      {...props}
      branch={BRANCH}
      title="Values Compass"
      intro="Values are what matter to you, the direction you'd like to head in. Pick up to five that feel most like you right now."
      pickLabel="Your values"
      maxPicks={5}
      groups={[
        {
          title: "Connection",
          options: [
            { label: "Family", icon: "🏡", note: "Being there for the people closest to you." },
            { label: "Friendship", icon: "🤝", note: "Building and keeping meaningful friendships." },
            { label: "Kindness", icon: "💛", note: "Treating others and yourself with care." },
            { label: "Community", icon: "🌍", note: "Being part of something bigger than yourself." },
          ],
        },
        {
          title: "Growth",
          options: [
            { label: "Learning", icon: "📖", note: "Staying curious and building knowledge." },
            { label: "Creativity", icon: "🎨", note: "Expressing yourself and making new things." },
            { label: "Achievement", icon: "🏅", note: "Working toward goals you care about." },
            { label: "Adventure", icon: "🧭", note: "Trying new experiences." },
          ],
        },
        {
          title: "Way of living",
          options: [
            { label: "Health", icon: "🌿", note: "Looking after your body and mind." },
            { label: "Honesty", icon: "🔍", note: "Being truthful with yourself and others." },
            { label: "Independence", icon: "🦋", note: "Making your own choices." },
            { label: "Fun", icon: "🎈", note: "Making room for play and enjoyment." },
            { label: "Fairness", icon: "⚖️", note: "Standing up for what's right." },
            { label: "Calm", icon: "🌊", note: "Peace and balance in daily life." },
          ],
        },
      ]}
      customPlaceholder="Add a value of your own…"
      customNote="A value that's personal to you."
      resultTitle="Your compass"
      resultIntro="These values can guide everyday choices, big and small. They may shift over time, and that's okay."
      followUp="Which value would you like to act on this week?"
      followUpAnswer={(label) =>
        `One small way to live “${label}” this week could become your next step. One Small Step can help you choose it.`
      }
      completion={{
        badge: "✦",
        title: "Compass set",
        message: "When a choice feels hard, asking “which option fits my values?” can help point the way.",
      }}
    />
  );
}

export function FutureMe(props: ActivityProps) {
  return (
    <ReflectionJournal
      {...props}
      branch={BRANCH}
      title="Future Me"
      intro="Let's imagine a future that feels meaningful. It's fine not to know. Daydreaming is allowed, and nothing here is a promise."
      main={{
        label: "Imagine a year from now",
        description: "Picture a good, ordinary day about a year from now.",
        prompts: [
          {
            question: "What does a good day in your future include?",
            ideas: ["Time with people I like", "Learning something", "Feeling healthy", "Doing creative things", "Time to rest"],
          },
          {
            question: "What might you be learning or working on?",
            placeholder: "A subject, a skill, a project…",
          },
          {
            question: "What kind of person do you hope to be?",
            ideas: ["Kind", "Confident", "Calm", "Curious", "Brave", "Supportive"],
          },
          {
            question: "What's one thing today-you can do to help future-you?",
            placeholder: "Something small is perfect…",
          },
        ],
      }}
      light={{
        label: "Just next month",
        description: "Too far ahead? Keep it close and simple.",
        prompts: [
          {
            question: "What would make next month feel good?",
            ideas: ["Less stress", "More sleep", "Seeing friends", "Finishing something", "Trying a hobby"],
          },
          {
            question: "What's one small thing that could help?",
            placeholder: "Something manageable…",
          },
        ],
      }}
      completion={{
        badge: "→",
        title: "A glimpse of Future Me",
        message: "Hopes can change as you grow. Imagining what matters is a great place to start.",
      }}
    />
  );
}

export function OneSmallStep(props: ActivityProps) {
  return (
    <SmallStepPicker
      {...props}
      branch={BRANCH}
      title="One Small Step"
      intro="Big goals start with small steps. Choose one manageable action connected to something you care about."
      context={{
        question: "What goal or hope is this step for?",
        hint: "It can be big or small, or skip this if you just want an idea.",
        placeholder: "e.g. feel more prepared for exams",
        ideas: ["Studies", "Health", "Friendships", "A hobby", "Saving money", "Feeling calmer"],
      }}
      stepQuestion="What's one small step you could take?"
      groups={[
        {
          title: "Learn",
          options: ["Spend 10 minutes researching my goal", "Ask someone who has done it for one tip"],
        },
        {
          title: "Prepare",
          options: ["Write down the first three tiny steps", "Set up what I need (space, tools, a reminder)"],
        },
        {
          title: "Do",
          options: ["Spend 15 minutes on it today", "Tell someone about my goal for encouragement"],
        },
      ]}
      customPlaceholder="Or write your own step…"
      tips={[
        "If the step feels too big, make it smaller. Five minutes still counts.",
        "Progress isn't always a straight line. Coming back to a goal is part of it.",
      ]}
      completion={{
        badge: "↗",
        title: "Step chosen",
        message: "Every meaningful journey is made of small steps like this one.",
      }}
    />
  );
}
