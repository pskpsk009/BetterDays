import type { ActivityProps } from "../common/ActivityUI";
import { ChoiceExplorer, ReflectionJournal } from "../common/GuidedActivities";

// Self-Acceptance activities. Every path offers a lighter, present-focused
// option so nobody is asked to revisit difficult memories.

const BRANCH = "Self-Acceptance";

export function LetterToPastSelf(props: ActivityProps) {
  return (
    <ReflectionJournal
      {...props}
      branch={BRANCH}
      title="Letter to My Past Self"
      intro="Imagine writing to a younger you. Pick a moment that feels comfortable, or keep it light and simply share some encouragement."
      main={{
        label: "Write to a younger me",
        description: "Think of a time you'd like to send some kindness to.",
        prompts: [
          {
            question: "Which version of you are you writing to?",
            hint: "A school year, an age, or a moment. Choose something that feels okay to think about.",
            ideas: ["Me at the start of school", "Me before a big change", "Me on a tough day", "Me as a child"],
          },
          {
            question: "What would you like them to know?",
            hint: "Something you understand now that you didn't then.",
            ideas: ["You were doing your best", "It gets easier", "You don't have to be perfect", "You are not alone"],
          },
          {
            question: "What are you proud of them for?",
            placeholder: "Even small things count…",
          },
          {
            question: "How would you like to sign off?",
            ideas: ["With love", "I've got you", "Keep going", "Thank you"],
          },
        ],
      }}
      light={{
        label: "Keep it light",
        description: "Write a short note of encouragement to yourself, today.",
        prompts: [
          {
            question: "What is one thing you've handled well lately?",
            ideas: ["Showing up", "Asking for help", "Trying again", "Being kind to someone"],
          },
          {
            question: "What would you say to a friend who did the same?",
            placeholder: "Write it to yourself instead…",
          },
        ],
      }}
      completion={{
        badge: "✉",
        title: "Letter written",
        message: "Speaking to yourself with kindness is a skill, and you just practised it. Your words stay with you, not in the app.",
      }}
    />
  );
}

export function LessonsNotLabels(props: ActivityProps) {
  return (
    <ReflectionJournal
      {...props}
      branch={BRANCH}
      title="Lessons, Not Labels"
      intro="A mistake is something that happened, not who you are. Let's turn a label into a lesson."
      main={{
        label: "Look at a small moment",
        description: "Pick an everyday slip-up, like a missed deadline or a message you regret.",
        prompts: [
          {
            question: "What happened?",
            hint: "Just the facts, briefly. A small, everyday moment is perfect.",
            placeholder: "e.g. I forgot to reply to a friend.",
          },
          {
            question: "What label did you put on yourself?",
            hint: "The harsh words your inner critic used.",
            ideas: ["I'm useless", "I always mess up", "I'm a bad friend", "I'm not smart enough"],
          },
          {
            question: "What did the experience teach you?",
            ideas: [
              "I need reminders for important things",
              "I was overloaded",
              "I care about doing well",
              "It's okay to ask for help",
            ],
          },
          {
            question: "Now rewrite the label as a fair, kind sentence.",
            hint: "Try: “I made a mistake, and I'm learning…”",
            placeholder: "I made a mistake, and…",
          },
        ],
      }}
      light={{
        label: "Use an example instead",
        description: "Practise with a made-up situation rather than your own.",
        prompts: [
          {
            question: "Sam forgot their friend's birthday and thinks “I'm a terrible friend.” What might Sam learn?",
            ideas: ["Set reminders", "Sam cares a lot", "One slip doesn't define a friendship", "Say sorry and celebrate late"],
          },
          {
            question: "What kinder sentence could Sam say to themself?",
            placeholder: "I forgot, and I can still…",
          },
        ],
      }}
      completion={{
        badge: "✎",
        title: "Label turned into a lesson",
        message: "Mistakes are how everyone learns. Noticing the lesson, without the label, is a real act of self-acceptance.",
      }}
    />
  );
}

export function StrengthsGarden(props: ActivityProps) {
  return (
    <ChoiceExplorer
      {...props}
      branch={BRANCH}
      title="My Strengths Garden"
      intro="Everyone has strengths, even on days when it doesn't feel like it. Pick the ones you see in yourself, or that others have noticed."
      pickLabel="Plant your strengths"
      maxPicks={6}
      groups={[
        {
          title: "Heart",
          options: [
            { label: "Kind", icon: "🌷", note: "You notice what others need and care about them." },
            { label: "Loyal", icon: "🌻", note: "People can count on you to stick around." },
            { label: "Good listener", icon: "🌼", note: "You help people feel heard." },
            { label: "Fair", icon: "🌸", note: "You try to treat people equally." },
          ],
        },
        {
          title: "Mind",
          options: [
            { label: "Curious", icon: "🌱", note: "You like to learn and ask questions." },
            { label: "Creative", icon: "🌺", note: "You come up with new ideas and ways of doing things." },
            { label: "Problem-solver", icon: "🌿", note: "You look for ways through challenges." },
            { label: "Thoughtful", icon: "🍀", note: "You take time to think things through." },
          ],
        },
        {
          title: "Spirit",
          options: [
            { label: "Determined", icon: "🌳", note: "You keep going when things get hard." },
            { label: "Funny", icon: "🌼", note: "You bring lightness and laughter." },
            { label: "Brave", icon: "🌻", note: "You try things even when you're nervous." },
            { label: "Patient", icon: "🌾", note: "You can wait and stay steady." },
          ],
        },
      ]}
      customPlaceholder="Add another strength…"
      customNote="A strength that's uniquely yours."
      resultTitle="Your garden"
      resultIntro="Here's what's growing. Strengths grow stronger the more you use them."
      followUp="Which one would you like to grow a little more this week?"
      followUpAnswer={(label) =>
        `Look for one small chance to use “${label}” this week, and notice how it feels. Growth areas are part of every garden.`
      }
      completion={{
        badge: "✿",
        title: "Garden planted",
        message: "You named real strengths. On harder days, it can help to come back and remember them.",
      }}
    />
  );
}
