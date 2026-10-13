import type { ActivityProps } from "../common/ActivityUI";
import { ChoiceExplorer, ReflectionJournal, SmallStepPicker } from "../common/GuidedActivities";

// Discover Your Joy activities. People enjoy different things, so every list
// is a menu to choose from, never a recommendation that everyone should follow.

const BRANCH = "Discover Your Joy";

export function JoyExplorer(props: ActivityProps) {
  return (
    <ChoiceExplorer
      {...props}
      branch={BRANCH}
      title="Joy Explorer"
      intro="Browse a few ideas and pick anything that sparks even a little interest. There are no right answers."
      pickLabel="Things you might enjoy"
      groups={[
        {
          title: "Creative",
          options: [
            { label: "Drawing or doodling", icon: "✏️", note: "No skill needed: try doodling for five minutes." },
            { label: "Writing", icon: "📝", note: "Stories, poems, or a few lines about your day." },
            { label: "Crafts", icon: "🧶", note: "Knitting, origami, or making something with your hands." },
            { label: "Photography", icon: "📷", note: "Take photos of things that catch your eye." },
          ],
        },
        {
          title: "Music and stories",
          options: [
            { label: "Listening to music", icon: "🎧", note: "Make a playlist for a mood you enjoy." },
            { label: "Playing an instrument", icon: "🎸", note: "Even a few notes or a free app counts." },
            { label: "Reading", icon: "📚", note: "Books, comics, or articles on something you like." },
            { label: "Podcasts", icon: "🎙️", note: "Learn or laugh while you walk or rest." },
          ],
        },
        {
          title: "Nature and movement",
          options: [
            { label: "Time outdoors", icon: "🌳", note: "A short walk, a park bench, or a window view." },
            { label: "Gardening", icon: "🪴", note: "Look after a plant, even a small one indoors." },
            { label: "Dancing", icon: "💃", note: "One song, your own way." },
            { label: "Gentle stretching", icon: "🧘", note: "Move in a way that feels good." },
          ],
        },
        {
          title: "Learning and people",
          options: [
            { label: "Learning a new skill", icon: "💡", note: "Cooking, a language, or a short tutorial." },
            { label: "Games and puzzles", icon: "🧩", note: "Board games, puzzles, or brain teasers." },
            { label: "Time with friends", icon: "👋", note: "A chat, a shared meal, or a game together." },
            { label: "Volunteering", icon: "🤝", note: "Helping others can feel meaningful." },
          ],
        },
      ]}
      customPlaceholder="Add your own interest…"
      customNote="Something you already know you enjoy."
      resultTitle="Your joy list"
      resultIntro="These are worth exploring. Interests can change over time, and that's part of the fun."
      followUp="Which one could you try first?"
      followUpAnswer={(label) => `“${label}” it is. Try Something New can help you plan a small first try.`}
      completion={{
        badge: "☀",
        title: "Joy list ready",
        message: "Knowing what lights you up makes it easier to make room for it. Come back whenever you'd like new ideas.",
      }}
    />
  );
}

export function TrySomethingNew(props: ActivityProps) {
  return (
    <SmallStepPicker
      {...props}
      branch={BRANCH}
      title="Try Something New"
      intro="Pick one small, easy thing to try. It doesn't have to be impressive, just a little different."
      stepQuestion="What would you like to try?"
      groups={[
        {
          title: "About 5 minutes",
          options: [
            "Listen to a song from a genre I don't usually play",
            "Doodle something I can see right now",
            "Step outside and notice the sky",
            "Learn one word in a new language",
          ],
        },
        {
          title: "About 15 minutes",
          options: [
            "Cook or make a simple snack I haven't tried",
            "Read a few pages of something new",
            "Take a different route on a short walk",
            "Try a beginner video for a new hobby",
          ],
        },
        {
          title: "When I have more time",
          options: ["Visit a library, museum, or park", "Invite someone to try an activity together"],
        },
      ]}
      customPlaceholder="Or write your own small idea…"
      tips={[
        "If you don't love it, that's useful to know too. Trying is the win.",
        "Notice how you feel before and after, without judging.",
      ]}
      completion={{
        badge: "+",
        title: "Something new, chosen",
        message: "Small experiments can lead to new favourite things. Enjoy giving it a go, whenever you're ready.",
      }}
    />
  );
}

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
