import { ActivityProps } from "../common/ActivityUI";
import { ChoiceExplorer, ScenarioPractice } from "../common/GuidedActivities";

// Self-Control (emotional regulation). Feelings are valid; regulation is
// about choosing how to respond, never about suppressing or ignoring feelings.
// Pause Before Reacting lives in its own file.

const BRANCH = "Self-Control";

export function CalmDownToolkit(props: ActivityProps) {
  return (
    <ChoiceExplorer
      {...props}
      branch={BRANCH}
      title="Calm-Down Toolkit"
      intro="Different things help different people, and different moments. Pick the tools you'd like in your kit."
      pickLabel="My toolkit"
      groups={[
        {
          title: "Breathe and ground",
          options: [
            { label: "Slow breathing", icon: "weather-windy", note: "Breathe in for 4, out for 6. Repeat a few times." },
            { label: "5-4-3-2-1 grounding", icon: "hand-back-left-outline", note: "Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste." },
            { label: "Cold water", icon: "water-outline", note: "Splash cool water on your face or hold something cold." },
          ],
        },
        {
          title: "Take a break",
          options: [
            { label: "Step away", icon: "door-open", note: "Leave the situation for a few minutes and come back when ready." },
            { label: "Move my body", icon: "walk", note: "A short walk or stretch can release tension." },
            { label: "Listen to music", icon: "headphones", note: "Put on a song that helps you settle." },
          ],
        },
        {
          title: "Connect and express",
          options: [
            { label: "Talk to someone", icon: "chat-outline", note: "Share how you feel with someone you trust." },
            { label: "Write it out", icon: "note-edit-outline", note: "Put your thoughts on paper, then decide what to do next." },
            { label: "Name the feeling", icon: "tag-outline", note: "Saying “I feel frustrated” can make it feel more manageable." },
          ],
        },
      ]}
      customPlaceholder="Add a tool that works for you…"
      customNote="A tool you already know helps."
      resultTitle="Your calm-down toolkit"
      resultIntro="Feelings come and go. These tools help you ride the wave and choose what to do next."
      followUp="Which tool would you like to try first next time?"
      followUpAnswer={(label) =>
        `Next time feelings run high, try “${label}”. If it doesn't help, another tool from your kit might.`
      }
      completion={{
        badge: "toolbox-outline",
        title: "Toolkit ready",
        message: "Calming down isn't about stopping feelings; it's about giving yourself space to respond well.",
      }}
    />
  );
}

export function ChooseYourResponse(props: ActivityProps) {
  return (
    <ScenarioPractice
      {...props}
      branch={BRANCH}
      title="Choose Your Response"
      intro="Everyday moments can stir up strong feelings. Explore a few possible responses and what might follow each one."
      scenarios={[
        {
          title: "Group chat",
          situation: "Someone posts a joke about you in the group chat. You feel embarrassed.",
          question: "What could you do?",
          options: [
            {
              label: "Reply with an angry message right away",
              feedback: "Feeling upset makes sense. A quick angry reply might escalate things, and it can be hard to take back.",
            },
            {
              label: "Message them privately: “That joke didn't feel great”",
              feedback: "Calmly saying how it felt gives them a chance to understand, without an audience.",
            },
            {
              label: "Take a break from the chat and decide later",
              feedback: "Stepping back gives your feelings time to settle, so you can choose what to do with a clearer head.",
            },
          ],
          takeaway: "Your feelings are valid. You get to choose the response that fits your values.",
        },
        {
          title: "Unfair grade",
          situation: "You get a lower grade than you expected and it feels unfair.",
          question: "What might help?",
          options: [
            {
              label: "Complain loudly in class",
              feedback: "The frustration is understandable, but this may not get you the answers you want.",
            },
            {
              label: "Ask the teacher to explain the marking",
              feedback: "Asking to understand is a constructive step and may show you how to improve or whether there was a mistake.",
            },
            {
              label: "Vent to a friend first, then decide",
              feedback: "Talking it through can help release the feeling before you decide what to do next.",
            },
          ],
          takeaway: "Strong feelings often point to something you care about.",
        },
        {
          title: "At home",
          situation: "A family member uses your things without asking. You feel annoyed.",
          question: "What could you try?",
          options: [
            {
              label: "Say nothing, but stay annoyed",
              feedback: "Holding it in can make the frustration build. You're allowed to bring it up.",
            },
            {
              label: "Calmly ask them to check with you first",
              feedback: "Clear and calm requests often work well and help prevent it happening again.",
            },
            {
              label: "Wait until I'm calmer, then talk",
              feedback: "Choosing a calmer moment can make the conversation go more smoothly.",
            },
          ],
          takeaway: "A pause before responding often opens up more options.",
        },
      ]}
      completion={{
        badge: "source-fork",
        title: "Responses explored",
        message: "There's rarely one perfect response. Knowing your options helps you choose in the moment.",
      }}
    />
  );
}
