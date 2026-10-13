import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SecondaryButton,
  SelectionChip,
  SupportNote,
} from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { ChoiceExplorer, ScenarioPractice } from "../common/GuidedActivities";

// Self-Control (emotional regulation). Feelings are valid; regulation is
// about choosing how to respond, never about suppressing or ignoring feelings.

const BRANCH = "Self-Control";

const SITUATIONS = [
  "Someone interrupts me",
  "A message annoys me",
  "Plans change last minute",
  "A game or app glitches",
  "I'm blamed for something",
];
const FEELINGS = ["Annoyed", "Frustrated", "Angry", "Hurt", "Disappointed", "Embarrassed"];
const RESPONSES = [
  "Say how I feel, calmly",
  "Take a short break first",
  "Ask a question to understand",
  "Let it go for now",
  "Come back to it later",
];
const BREATHS = 3;

export function PauseBeforeReacting({ color, soft, onExit }: ActivityProps) {
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState<string | null>(null);
  const [ownSituation, setOwnSituation] = useState("");
  const [feeling, setFeeling] = useState<string | null>(null);
  const [breaths, setBreaths] = useState(0);
  const [response, setResponse] = useState<string | null>(null);

  function restart() {
    setStep(0);
    setSituation(null);
    setOwnSituation("");
    setFeeling(null);
    setBreaths(0);
    setResponse(null);
  }

  const header = <ActivityHeader eyebrow={BRANCH} title="Pause Before Reacting" color={color} />;
  const trigger = ownSituation.trim() || situation;
  const exit = <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />;

  if (step === 5) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="‖"
          title="Pause practised"
          message="A short pause gives you space to choose. The more you practise, the more naturally it comes."
          color={color}
          soft={soft}
          primary={{ label: "Practise again", onPress: restart }}
          secondary={{ label: `Back to ${BRANCH}`, onPress: onExit }}
        />
      </View>
    );
  }

  if (step === 4) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <View style={[styles.plan, { backgroundColor: soft }]}>
          <Text style={[mentalStyles.label, { color }]}>MY PAUSE PLAN</Text>
          <Text style={styles.planText}>
            When {trigger?.toLowerCase()} and I feel {feeling?.toLowerCase() ?? "upset"}, I can pause, take{" "}
            {BREATHS} slow breaths, and then {response?.toLowerCase()}.
          </Text>
        </View>
        <Text style={mentalStyles.body}>
          Your feelings make sense. Pausing doesn't mean pushing them away; it gives you a moment to choose what
          to do with them.
        </Text>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Change" color={color} onPress={() => setStep(3)} />
          <PrimaryButton flex label="Finish" color={color} onPress={() => setStep(5)} />
        </View>
        <SupportNote />
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard
          stepKey={3}
          label="Step 4 of 4 · Proceed"
          question="Now, how would you like to respond?"
          hint="There's no single right answer. Pick what fits the moment."
          color={color}
        >
          <View accessibilityRole="radiogroup" style={mentalStyles.chips}>
            {RESPONSES.map((option) => (
              <SelectionChip
                key={option}
                label={option}
                color={color}
                selected={response === option}
                onPress={() => setResponse(option)}
              />
            ))}
          </View>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStep(2)} />
          <PrimaryButton flex label="See my plan" color={color} disabled={!response} onPress={() => setStep(4)} />
        </View>
        {exit}
      </View>
    );
  }

  if (step === 2) {
    const finished = breaths >= BREATHS;
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard
          stepKey={2}
          label="Step 3 of 4 · Breathe"
          question="Take three slow breaths."
          hint="Breathe in gently, then out a little longer. Tap after each breath."
          color={color}
        >
          <View style={styles.breathRow} accessibilityLiveRegion="polite">
            {Array.from({ length: BREATHS }, (_, index) => (
              <View
                key={index}
                style={[styles.breathDot, { borderColor: color }, index < breaths && { backgroundColor: color }]}
              />
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`I took a breath. ${breaths} of ${BREATHS} done`}
            disabled={finished}
            onPress={() => setBreaths(breaths + 1)}
            style={({ pressed }) => [
              styles.breathButton,
              { backgroundColor: soft, borderColor: color },
              finished && styles.dim,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.breathText, { color }]}>
              {finished ? "Nicely done" : `I took a breath (${breaths}/${BREATHS})`}
            </Text>
          </Pressable>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStep(1)} />
          <PrimaryButton flex label={finished ? "Next" : "Skip"} color={color} onPress={() => setStep(3)} />
        </View>
        {exit}
      </View>
    );
  }

  if (step === 1) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard
          stepKey={1}
          label="Step 2 of 4 · Notice"
          aside="Optional"
          question="What might you feel in that moment?"
          hint="All feelings are okay. Naming one can make it a little easier to handle."
          color={color}
        >
          <View accessibilityRole="radiogroup" style={mentalStyles.chips}>
            {FEELINGS.map((option) => (
              <SelectionChip
                key={option}
                label={option}
                color={color}
                selected={feeling === option}
                onPress={() => setFeeling(feeling === option ? null : option)}
              />
            ))}
          </View>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStep(0)} />
          <PrimaryButton flex label={feeling ? "Next" : "Skip"} color={color} onPress={() => setStep(2)} />
        </View>
        {exit}
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Text style={mentalStyles.body}>
        When something frustrates us, we often react straight away. A short pause (stop, breathe, notice, then
        choose) can give you more options. Let's practise with an everyday moment.
      </Text>
      <QuestionCard
        stepKey={0}
        label="Step 1 of 4 · Stop"
        question="Pick a frustrating moment to practise with."
        color={color}
      >
        <View accessibilityRole="radiogroup" style={mentalStyles.chips}>
          {SITUATIONS.map((option) => (
            <SelectionChip
              key={option}
              label={option}
              color={color}
              selected={!ownSituation.trim() && situation === option}
              onPress={() => {
                setOwnSituation("");
                setSituation(option);
              }}
            />
          ))}
        </View>
        <TextInput
          accessibilityLabel="Or describe your own moment"
          value={ownSituation}
          onChangeText={setOwnSituation}
          placeholder="Or describe your own…"
          placeholderTextColor={COLORS.muted}
          style={[mentalStyles.input, styles.shortInput]}
        />
      </QuestionCard>
      <PrimaryButton label="Next" color={color} disabled={!trigger} onPress={() => setStep(1)} />
      {exit}
    </View>
  );
}

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
            { label: "Slow breathing", icon: "🌬️", note: "Breathe in for 4, out for 6. Repeat a few times." },
            { label: "5-4-3-2-1 grounding", icon: "🖐️", note: "Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste." },
            { label: "Cold water", icon: "💧", note: "Splash cool water on your face or hold something cold." },
          ],
        },
        {
          title: "Take a break",
          options: [
            { label: "Step away", icon: "🚪", note: "Leave the situation for a few minutes and come back when ready." },
            { label: "Move my body", icon: "🚶", note: "A short walk or stretch can release tension." },
            { label: "Listen to music", icon: "🎧", note: "Put on a song that helps you settle." },
          ],
        },
        {
          title: "Connect and express",
          options: [
            { label: "Talk to someone", icon: "💬", note: "Share how you feel with someone you trust." },
            { label: "Write it out", icon: "📝", note: "Put your thoughts on paper, then decide what to do next." },
            { label: "Name the feeling", icon: "🏷️", note: "Saying “I feel frustrated” can make it feel more manageable." },
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
        badge: "❖",
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
        badge: "⑂",
        title: "Responses explored",
        message: "There's rarely one perfect response. Knowing your options helps you choose in the moment.",
      }}
    />
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.82 },
  dim: { opacity: 0.6 },
  plan: { gap: 10, padding: 18, borderRadius: 18 },
  planText: { color: COLORS.ink, fontSize: 17, fontWeight: "700", lineHeight: 25 },
  breathRow: { flexDirection: "row", justifyContent: "center", gap: 14, paddingVertical: 6 },
  breathDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  breathButton: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  breathText: { fontSize: 15, fontWeight: "800" },
  shortInput: { minHeight: 48 },
});
