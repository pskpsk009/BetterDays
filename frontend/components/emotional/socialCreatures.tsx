import type { ActivityProps } from "../common/ActivityUI";
import { ScenarioPractice } from "../common/GuidedActivities";

// Social Creatures. Social success is never measured by numbers of friends or
// messages; every comfort level and preference is respected.

const BRANCH = "Social Creatures";
const COMFORT_NOTE = "Everyone's social comfort is different. Practise at your own pace; there's no score.";

export function ConversationBuilder(props: ActivityProps) {
  return (
    <ScenarioPractice
      {...props}
      branch={BRANCH}
      title="Conversation Builder"
      intro="Starting a conversation can feel awkward for anyone. Try out some openers and see what tends to keep a conversation going."
      note={COMFORT_NOTE}
      scenarios={[
        {
          title: "New class",
          situation: "You sit next to someone new before class starts.",
          question: "Which opener would you try?",
          options: [
            {
              label: "“Do you like this class?”",
              feedback: "A closed question: they can answer “yes” or “no”. That's fine, and you can follow up with “What do you like about it?”",
            },
            {
              label: "“What got you interested in this course?”",
              feedback: "An open-ended question invites a longer answer and gives you something to respond to.",
            },
            {
              label: "Smile and say “Hi, I'm …”",
              feedback: "A simple introduction is friendly and low-pressure. It's a great start for anyone.",
            },
          ],
          takeaway: "Open questions often start with what, how, or why.",
        },
        {
          title: "Club meeting",
          situation: "You join a new club and don't know anyone yet.",
          question: "What might you say?",
          options: [
            {
              label: "“How long have you been coming here?”",
              feedback: "A friendly, easy question. It shows interest and can lead to tips about the club.",
            },
            {
              label: "“What do you enjoy most about this club?”",
              feedback: "Open-ended and positive. People usually like sharing what they enjoy.",
            },
            {
              label: "Wait for someone to talk to me",
              feedback: "That's okay too, especially if you're feeling shy. Even a smile can signal you're open to chatting.",
            },
          ],
          takeaway: "Shared interests make easy starting points.",
        },
        {
          title: "Keeping it going",
          situation: "Your friend says they went hiking at the weekend.",
          question: "How could you respond?",
          options: [
            {
              label: "“Cool.”",
              feedback: "Short replies are fine, but they may end the topic quickly.",
            },
            {
              label: "“Nice! Where did you go, and how was it?”",
              feedback: "A follow-up question shows you're listening and interested.",
            },
            {
              label: "Share a related story of my own",
              feedback: "Sharing helps people connect. Try to leave room for them to keep talking too.",
            },
          ],
          takeaway: "Listening and asking a follow-up question helps conversations flow.",
        },
      ]}
      completion={{
        badge: "❝",
        title: "Openers practised",
        message: "Conversation skills grow with practice, and small chats count.",
      }}
    />
  );
}

export function WalkInTheirShoes(props: ActivityProps) {
  return (
    <ScenarioPractice
      {...props}
      branch={BRANCH}
      title="Walk in Their Shoes"
      intro="We can't know exactly what others think, but imagining their side can help us understand them. These are fictional situations."
      scenarios={[
        {
          title: "Short reply",
          situation: "Alex sends a one-word reply to a long message from their friend.",
          question: "What might Alex be feeling or dealing with?",
          options: [
            {
              label: "Alex is busy or tired",
              feedback: "Quite possible. People often reply briefly when they're in the middle of something.",
            },
            {
              label: "Alex is upset with their friend",
              feedback: "It could be, but there's not enough information to know. Asking gently is one way to find out.",
            },
            {
              label: "Alex didn't know what to say",
              feedback: "Sometimes long messages are hard to answer, especially about something emotional.",
            },
          ],
          takeaway: "When we're unsure, there are usually several possible explanations.",
        },
        {
          title: "Grumpy coworker",
          situation: "Jordan snaps at a coworker who asked a simple question.",
          question: "What might be going on for Jordan?",
          options: [
            {
              label: "Jordan is under a lot of pressure",
              feedback: "Stress can make anyone shorter-tempered. It doesn't make snapping okay, but it may explain it.",
            },
            {
              label: "Jordan doesn't like the coworker",
              feedback: "Possible, but one moment isn't enough to tell. It may not be personal at all.",
            },
            {
              label: "Jordan is having a hard day",
              feedback: "Everyone has hard days. A little patience, or a check-in later, can help.",
            },
          ],
          takeaway: "Understanding someone's side doesn't mean you have to accept unkind behaviour.",
        },
        {
          title: "New student",
          situation: "Priya, a new student, sits alone at lunch and doesn't talk much.",
          question: "What might Priya be feeling?",
          options: [
            {
              label: "Nervous about being new",
              feedback: "Being new can feel overwhelming. A friendly hello could make a difference.",
            },
            {
              label: "Happy to have some quiet time",
              feedback: "Some people genuinely enjoy time alone, and that's okay too.",
            },
            {
              label: "Unsure how to join in",
              feedback: "Joining an existing group can be hard. An invitation, with no pressure, can help.",
            },
          ],
          takeaway: "People have different preferences. Asking is often better than assuming.",
        },
      ]}
      completion={{
        badge: "⇆",
        title: "Perspectives explored",
        message: "Imagining another point of view builds empathy, and it helps with your own relationships too.",
      }}
    />
  );
}

export function HealthyBoundaries(props: ActivityProps) {
  return (
    <ScenarioPractice
      {...props}
      branch={BRANCH}
      title="Healthy Boundaries"
      intro="Boundaries are how we let others know what's okay for us. Practise saying what you need in a way that's clear and respectful."
      note={COMFORT_NOTE}
      scenarios={[
        {
          title: "Borrowing",
          situation: "A friend keeps borrowing your notes and returning them late.",
          question: "How could you respond?",
          options: [
            {
              label: "Keep lending them and say nothing",
              feedback: "This avoids an awkward moment now, but your needs matter too, and the frustration may grow.",
            },
            {
              label: "“I need my notes back by Friday. Can you do that?”",
              feedback: "Clear and kind. You're stating your need and inviting them to respect it.",
            },
            {
              label: "“You're so annoying, I'm never lending you anything again!”",
              feedback: "The frustration makes sense, but this may hurt the friendship more than needed.",
            },
          ],
          takeaway: "Clear, kind, and specific requests are often the easiest to hear.",
        },
        {
          title: "Late messages",
          situation: "Someone messages you late at night expecting a quick reply.",
          question: "What might you say?",
          options: [
            {
              label: "“I don't check messages after 10pm, but I'll reply tomorrow.”",
              feedback: "Calm and respectful. It sets the boundary while keeping the connection friendly.",
            },
            {
              label: "Reply instantly every time, even when tired",
              feedback: "That's caring, but your rest matters too. It's okay to protect your time.",
            },
            {
              label: "Ignore them completely",
              feedback: "Sometimes that's the right choice, especially if someone isn't respectful. If it's a friend, letting them know your limit may help.",
            },
          ],
          takeaway: "You're allowed to protect your time, energy, and rest.",
        },
        {
          title: "Saying no",
          situation: "You're invited to an event, but you'd rather have a quiet night.",
          question: "How could you decline?",
          options: [
            {
              label: "“Thanks for inviting me! I'm going to sit this one out.”",
              feedback: "Friendly and honest. You don't owe a long explanation.",
            },
            {
              label: "Say yes, then feel drained",
              feedback: "Sometimes we go to make others happy, and that's okay occasionally. Your needs count too.",
            },
            {
              label: "“Not this time, but let's catch up soon?”",
              feedback: "This declines while showing you still value the connection.",
            },
          ],
          takeaway: "Saying no to something can mean saying yes to what you need.",
        },
      ]}
      completion={{
        badge: "▢",
        title: "Boundaries practised",
        message: "Healthy boundaries help relationships feel respectful and safe for everyone.",
      }}
    />
  );
}
