import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  ActivityHeader,
  ActivityProps,
  ModeCard,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SecondaryButton,
  SelectionChip,
  SupportNote,
  toggleItem,
} from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { Scenario, ScenarioPractice } from "../common/GuidedActivities";

// Plan B: practise with examples, or work through a real plan that fell
// through by finding what you wanted from it and other ways to get that.

const BRANCH = "Stand Up Again";
const TITLE = "Plan B";

const SETBACKS = [
  "A trip got cancelled",
  "I didn't get in",
  "Plans with a friend fell through",
  "A deadline went badly",
  "Something I saved for didn't happen",
  "An event got called off",
];

type Need = { id: string; label: string; icon: string; ideas: string[] };

// What people often wanted from a plan, and other ways to get some of it.
const NEEDS: Need[] = [
  {
    id: "fun",
    label: "Fun or excitement",
    icon: "🎉",
    ideas: ["Plan a smaller fun thing this week", "Try something new nearby", "Have a games or movie night", "Put a new date in the calendar"],
  },
  {
    id: "people",
    label: "Time with someone",
    icon: "🤝",
    ideas: ["Suggest another day to meet", "Call or video chat instead", "Invite them to something simpler", "Spend time with someone else I like"],
  },
  {
    id: "progress",
    label: "Progress toward a goal",
    icon: "📈",
    ideas: ["Look for another route to the same goal", "Ask someone what else I could try", "Apply or try again next round", "Work on one skill that helps for next time"],
  },
  {
    id: "rest",
    label: "Rest or a break",
    icon: "🛋️",
    ideas: ["Take a slow day at home", "Do something relaxing I enjoy", "Get outside for a short walk", "Book a small break for later"],
  },
  {
    id: "change",
    label: "A change of scene",
    icon: "🗺️",
    ideas: ["Explore a part of town I don't know", "Take a day trip closer to home", "Rearrange or refresh my space", "Visit a park, museum, or library"],
  },
  {
    id: "proud",
    label: "Feeling proud",
    icon: "🏅",
    ideas: ["Finish a smaller challenge", "Share what I did manage", "Set a new, reachable goal", "Write down what I learned"],
  },
];

const WHEN = ["Today", "Tomorrow", "This week", "Whenever it feels right"];

const SCENARIOS: Scenario[] = [
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
];

const COMPLETION = {
  badge: "⇄",
  title: "Plan B practised",
  message: "Being able to adjust when plans change is a skill that grows with practice.",
};

type Stage = "start" | "examples" | "setback" | "wanted" | "ideas" | "when" | "result" | "done";

export function PlanB(props: ActivityProps) {
  const { color, soft, onExit } = props;
  const [stage, setStage] = useState<Stage>("start");
  const [setback, setSetback] = useState("");
  const [setbackChip, setSetbackChip] = useState<string | null>(null);
  const [wanted, setWanted] = useState<string[]>([]);
  const [idea, setIdea] = useState<string | null>(null);
  const [customIdea, setCustomIdea] = useState("");
  const [when, setWhen] = useState<string | null>(null);

  const header = <ActivityHeader eyebrow={BRANCH} title={TITLE} color={color} />;
  const exit = <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />;

  const setbackText = setback.trim() || setbackChip;
  const plan = customIdea.trim() || idea;
  const wantedNeeds = NEEDS.filter((need) => wanted.includes(need.id));

  function restart() {
    setStage("start");
    setSetback("");
    setSetbackChip(null);
    setWanted([]);
    setIdea(null);
    setCustomIdea("");
    setWhen(null);
  }

  if (stage === "examples") {
    return <ScenarioPractice {...props} branch={BRANCH} title={TITLE} intro="Practise exploring other ways forward with a few everyday examples." scenarios={SCENARIOS} completion={COMPLETION} />;
  }

  if (stage === "done") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="⇄"
          title="Plan B ready"
          message="Plans falling through is disappointing. Finding another way forward, even a small one, keeps a door open."
          color={color}
          soft={soft}
          primary={{ label: "Make another Plan B", onPress: restart }}
          secondary={{ label: `Back to ${BRANCH}`, onPress: onExit }}
        />
      </View>
    );
  }

  if (stage === "start") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.body}>
          Plans don&apos;t always work out, and that&apos;s frustrating. Let&apos;s explore other ways forward.
        </Text>
        <Text style={mentalStyles.label}>HOW WOULD YOU LIKE TO START?</Text>
        <ModeCard
          icon="💡"
          title="Something fell through for me"
          detail="Work through a real plan that didn't happen and find a Plan B."
          color={color}
          soft={soft}
          onPress={() => setStage("setback")}
        />
        <ModeCard
          icon="📚"
          title="Practise with an example"
          detail="Try three everyday situations and see different ways forward."
          color={color}
          soft={soft}
          onPress={() => setStage("examples")}
        />
        {exit}
      </View>
    );
  }

  if (stage === "setback") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey="setback" label="Step 1 of 4" question="What plan fell through?" hint="A few words is enough. Pick one or write your own." color={color}>
          <View style={mentalStyles.chips}>
            {SETBACKS.map((item) => (
              <SelectionChip
                key={item}
                label={item}
                color={color}
                selected={!setback.trim() && setbackChip === item}
                onPress={() => {
                  setSetback("");
                  setSetbackChip(setbackChip === item ? null : item);
                }}
              />
            ))}
          </View>
          <TextInput
            accessibilityLabel="What plan fell through?"
            value={setback}
            onChangeText={setSetback}
            placeholder="e.g. My concert tickets got cancelled"
            placeholderTextColor={COLORS.muted}
            style={mentalStyles.input}
          />
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage("start")} />
          <PrimaryButton flex label="Next" color={color} disabled={!setbackText} onPress={() => setStage("wanted")} />
        </View>
        {exit}
      </View>
    );
  }

  if (stage === "wanted") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard
          stepKey="wanted"
          label="Step 2 of 4"
          question="What did you want from it?"
          hint="The plan is gone, but what you wanted from it might still be within reach. Pick any that fit."
          color={color}
        >
          <View style={mentalStyles.chips}>
            {NEEDS.map((need) => (
              <SelectionChip
                key={need.id}
                label={`${need.icon} ${need.label}`}
                color={color}
                selected={wanted.includes(need.id)}
                onPress={() => setWanted(toggleItem(wanted, need.id))}
              />
            ))}
          </View>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage("setback")} />
          <PrimaryButton flex label="Show ideas" color={color} disabled={wanted.length === 0} onPress={() => setStage("ideas")} />
        </View>
        {exit}
      </View>
    );
  }

  if (stage === "ideas") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey="ideas" label="Step 3 of 4" question="Other ways to get that" hint="Pick the one that feels most doable, or write your own." color={color} />
        {wantedNeeds.map((need) => (
          <View key={need.id} style={styles.group}>
            <Text style={styles.groupTitle}>
              {need.icon} {need.label}
            </Text>
            <View style={mentalStyles.chips}>
              {need.ideas.map((option) => (
                <SelectionChip
                  key={option}
                  label={option}
                  color={color}
                  selected={!customIdea.trim() && idea === option}
                  onPress={() => {
                    setCustomIdea("");
                    setIdea(idea === option ? null : option);
                  }}
                />
              ))}
            </View>
          </View>
        ))}
        <TextInput
          accessibilityLabel="Your own Plan B"
          value={customIdea}
          onChangeText={setCustomIdea}
          placeholder="Or write your own Plan B…"
          placeholderTextColor={COLORS.muted}
          style={mentalStyles.input}
        />
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage("wanted")} />
          <PrimaryButton flex label="Next" color={color} disabled={!plan} onPress={() => setStage("when")} />
        </View>
        {exit}
      </View>
    );
  }

  if (stage === "when") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey="when" label="Step 4 of 4" aside="Optional" question="When might you try it?" hint="No pressure. Plans can change." color={color}>
          <View accessibilityRole="radiogroup" style={mentalStyles.chips}>
            {WHEN.map((option) => (
              <SelectionChip
                key={option}
                label={option}
                color={color}
                selected={when === option}
                onPress={() => setWhen(when === option ? null : option)}
              />
            ))}
          </View>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage("ideas")} />
          <PrimaryButton flex label="See my Plan B" color={color} onPress={() => setStage("result")} />
        </View>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(220)} style={mentalStyles.screen}>
      {header}
      <View style={[styles.resultCard, { backgroundColor: soft }]}>
        <Text style={mentalStyles.label}>WHAT FELL THROUGH</Text>
        <Text style={mentalStyles.body}>{setbackText}</Text>
        <Text style={mentalStyles.label}>WHAT I WANTED</Text>
        <Text style={mentalStyles.body}>{wantedNeeds.map((need) => need.label.toLowerCase()).join(", ")}</Text>
        <Text style={[mentalStyles.label, { color }]}>MY PLAN B</Text>
        <Text style={styles.bigStep}>{plan}</Text>
        {when && <Text style={mentalStyles.body}>When: {when}</Text>}
      </View>
      <Text style={mentalStyles.body}>• It&apos;s okay to feel disappointed first. Plan B can wait until you&apos;re ready.</Text>
      <Text style={mentalStyles.body}>• A Plan B doesn&apos;t have to be as big as Plan A to be worth doing.</Text>
      <View style={mentalStyles.row}>
        <SecondaryButton flex label="Change idea" color={color} onPress={() => setStage("ideas")} />
        <PrimaryButton flex label="Finish" color={color} onPress={() => setStage("done")} />
      </View>
      <SupportNote />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  groupTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "800" },
  resultCard: { padding: 18, borderRadius: 20, gap: 8 },
  bigStep: { color: COLORS.ink, fontSize: 20, fontWeight: "800", lineHeight: 27 },
});
