import type { ActivityProps } from "../common/ActivityUI";
import { ChoiceExplorer, ScenarioPractice, SmallStepPicker } from "../common/GuidedActivities";

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

export function PlanB(props: ActivityProps) {
  return (
    <ScenarioPractice
      {...props}
      branch={BRANCH}
      title="Plan B"
      intro="Plans don't always work out, and that's frustrating. Practise exploring other ways forward with a few everyday examples."
      scenarios={[
        {
          title: "Study plans",
          situation: "You planned to study at the library, but it's closed today.",
          question: "What could Plan B be?",
          options: [
            {
              label: "Find another quiet spot, like a café or a quiet room at home",
              feedback: "Adapting the location keeps your plan going. It may take a few minutes to settle in, and that's fine.",
            },
            {
              label: "Swap tasks: do lighter review now, deep study tomorrow",
              feedback: "Matching the task to the setting is a smart adjustment. You still make progress, just differently.",
            },
            {
              label: "Give up on studying today",
              feedback: "Sometimes a break really is the right call, especially if you're tired. If the work is time-sensitive, a smaller version might help you feel better later.",
            },
          ],
          takeaway: "A Plan B doesn't have to be perfect. It just has to keep a door open.",
        },
        {
          title: "Team project",
          situation: "A teammate dropped out of your group project a week before it's due.",
          question: "What could you try?",
          options: [
            {
              label: "Meet with the team and split their part fairly",
              feedback: "Sharing the load helps nobody burn out. Talking it through also keeps everyone on the same page.",
            },
            {
              label: "Tell the teacher or supervisor what happened",
              feedback: "They may be able to adjust the scope or deadline. Asking isn't complaining; it gives them information.",
            },
            {
              label: "Do all of their part myself without telling anyone",
              feedback: "That's generous, but it can lead to stress and exhaustion. You don't have to carry it alone.",
            },
          ],
          takeaway: "When plans change, getting others involved often opens up more options.",
        },
        {
          title: "Weekend plans",
          situation: "Your friend cancelled the plans you were looking forward to.",
          question: "What might help?",
          options: [
            {
              label: "Suggest another day to meet",
              feedback: "Rescheduling keeps the plan alive and shows you value the time together.",
            },
            {
              label: "Do something enjoyable on my own instead",
              feedback: "Turning the free time into something you like can soften the disappointment.",
            },
            {
              label: "Feel disappointed for a while",
              feedback: "That's a completely valid reaction. Letting yourself feel it can make it easier to move on.",
            },
          ],
          takeaway: "Feeling let down is normal. Plan B can include taking care of how you feel.",
        },
      ]}
      completion={{
        badge: "⇄",
        title: "Plan B practised",
        message: "Being able to adjust when plans change is a skill that grows with practice.",
      }}
    />
  );
}

export function SupportCircle(props: ActivityProps) {
  return (
    <ChoiceExplorer
      {...props}
      branch={BRANCH}
      title="My Support Circle"
      intro="Nobody has to handle everything alone. Pick the people and places you could turn to. You don't need to share names."
      pickLabel="My circle"
      groups={[
        {
          title: "People",
          options: [
            { label: "A friend", icon: "🧑‍🤝‍🧑", note: "Someone to talk to, or just spend time with." },
            { label: "A family member", icon: "🏡", note: "Someone at home or further away who cares about you." },
            { label: "A teacher or mentor", icon: "🎓", note: "Can help with school or work worries, and point you to support." },
            { label: "A coach or club leader", icon: "🏅", note: "Someone from an activity you're part of." },
            { label: "A classmate or colleague", icon: "👋", note: "Can help with shared tasks and everyday stress." },
          ],
        },
        {
          title: "Professional support",
          options: [
            { label: "School or campus counsellor", icon: "💬", note: "Trained to listen and help you work through difficulties." },
            { label: "Doctor or nurse", icon: "🩺", note: "For health concerns, including how you're feeling." },
            { label: "A support line", icon: "📞", note: "Confidential support by phone or chat in many places." },
          ],
        },
        {
          title: "Things that help me",
          options: [
            { label: "A calming place", icon: "🌳", note: "Somewhere you feel settled and safe." },
            { label: "An online community", icon: "💻", note: "A safe, moderated group with shared interests." },
            { label: "A pet", icon: "🐾", note: "Companionship and comfort." },
          ],
        },
      ]}
      customPlaceholder="Add someone or something else…"
      customNote="Part of your support circle."
      resultTitle="Your support circle"
      resultIntro="These are the people and places you can lean on. Reaching out is a strength."
      followUp="Who might you reach out to first, if you needed to?"
      followUpAnswer={(label) =>
        `Good to know. Even a short message like “Can we talk?” to ${label.toLowerCase()} is a great start.`
      }
      safetyNote="If you ever feel unsafe or in crisis, please contact your local emergency number or a crisis support line right away."
      completion={{
        badge: "◍",
        title: "Circle mapped",
        message: "Knowing who you can turn to makes hard moments a little lighter. You're not alone.",
      }}
    />
  );
}
