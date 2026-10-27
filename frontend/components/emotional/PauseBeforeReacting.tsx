import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

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
  toggleItem,
} from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";

// Pause Before Reacting: nobody opens an app mid-argument, so this looks back
// at a moment that already happened. Notice what you did, spot any pause you
// already took, and pick the pause you'd like to try next time.
// Feelings are valid; pausing is about choosing a response, not hiding feelings.

const BRANCH = "Self-Control";

const MOMENTS = [
  "Plans got cancelled",
  "Someone said something unfair",
  "I got a bad mark",
  "I was blamed for something",
  "Something broke or glitched",
  "I was left out",
  "Someone ignored me",
];

const FEELINGS = ["Annoyed", "Frustrated", "Angry", "Hurt", "Disappointed", "Embarrassed", "Stressed"];

const LEVELS = [
  { icon: "🙂", label: "A little" },
  { icon: "😕", label: "Some" },
  { icon: "😠", label: "A lot" },
  { icon: "😤", label: "Very strong" },
  { icon: "🌋", label: "Boiling" },
];

// `pause: true` marks reactions that already include a pause.
const REACTIONS = [
  { label: "Took a short break", pause: true },
  { label: "Took a few deep breaths", pause: true },
  { label: "Walked away for a bit", pause: true },
  { label: "Waited before replying", pause: true },
  { label: "Talked to someone I trust", pause: true },
  { label: "Said something I regretted", pause: false },
  { label: "Snapped or shouted", pause: false },
  { label: "Sent a quick angry message", pause: false },
  { label: "Held it all in", pause: false },
  { label: "Kept thinking about it for hours", pause: false },
];

const OUTCOMES = [
  { id: "better", icon: "🌤", label: "Better than I expected" },
  { id: "okay", icon: "⛅", label: "Okay" },
  { id: "worse", icon: "🌧", label: "Worse than I wanted" },
] as const;

const PAUSES = [
  { icon: "🌬️", label: "Take 3 slow breaths" },
  { icon: "🚶", label: "Step away for 5 minutes" },
  { icon: "⏳", label: "Count to 10 before replying" },
  { icon: "💧", label: "Get a drink of water" },
  { icon: "🎧", label: "Listen to one song" },
  { icon: "💬", label: "Talk to someone first" },
];

const RESPONSES = [
  "Say how I feel, calmly",
  "Ask a question to understand",
  "Let it go for now",
  "Come back to it later",
  "Ask for help",
];

type Outcome = (typeof OUTCOMES)[number]["id"];

export function PauseBeforeReacting({ color, soft, onExit }: ActivityProps) {
  const [step, setStep] = useState(0);
  const [moment, setMoment] = useState<string | null>(null);
  const [ownMoment, setOwnMoment] = useState("");
  const [level, setLevel] = useState<number | null>(null);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [reactions, setReactions] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [pause, setPause] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const what = ownMoment.trim() || moment;
  const pausesTaken = REACTIONS.filter((item) => item.pause && reactions.includes(item.label));
  const header = <ActivityHeader eyebrow={BRANCH} title="Pause Before Reacting" color={color} />;
  const exit = <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />;

  function restart() {
    setStep(0);
    setMoment(null);
    setOwnMoment("");
    setLevel(null);
    setFeeling(null);
    setReactions([]);
    setOutcome(null);
    setPause(null);
    setResponse(null);
  }

  const nav = (back: number, next: number, nextLabel: string, disabled: boolean) => (
    <View style={mentalStyles.row}>
      <SecondaryButton flex label="Back" color={color} onPress={() => setStep(back)} />
      <PrimaryButton flex label={nextLabel} color={color} disabled={disabled} onPress={() => setStep(next)} />
    </View>
  );

  if (step === 6) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="‖"
          title="Pause planned"
          message="Looking back is how the pause gets easier. Next time it might come a little more naturally."
          color={color}
          soft={soft}
          primary={{ label: "Look back at another moment", onPress: restart }}
          secondary={{ label: `Back to ${BRANCH}`, onPress: onExit }}
        />
      </View>
    );
  }

  // Replay: the same moment, with the pause in it.
  if (step === 5) {
    const nodes = [
      { label: "WHEN", text: what ?? "", icon: "⚡" },
      { label: "I'LL PAUSE", text: pause ?? "", icon: PAUSES.find((item) => item.label === pause)?.icon ?? "‖" },
      { label: "THEN I'LL", text: response ?? "", icon: "➜" },
    ];
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.label}>YOUR REPLAY</Text>
        <View style={styles.timeline}>
          {nodes.map((node, index) => (
            <Animated.View key={node.label} entering={FadeInDown.delay(index * 350).duration(300)} style={styles.nodeRow}>
              <View style={styles.nodeRail}>
                <View style={[styles.nodeDot, { backgroundColor: index === 1 ? color : soft, borderColor: color }]}>
                  <Text style={styles.nodeIcon}>{node.icon}</Text>
                </View>
                {index < nodes.length - 1 && <View style={[styles.nodeLine, { backgroundColor: color }]} />}
              </View>
              <View style={[styles.nodeCard, index === 1 && { borderColor: color, backgroundColor: soft }]}>
                <Text style={[mentalStyles.label, index === 1 && { color }]}>{node.label}</Text>
                <Text style={styles.nodeText}>{node.text}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
        <Text style={mentalStyles.body}>
          Your feelings made sense then and they will next time too. The pause just gives you a moment to choose what to do with them.
        </Text>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Change" color={color} onPress={() => setStep(4)} />
          <PrimaryButton flex label="Finish" color={color} onPress={() => setStep(6)} />
        </View>
        <SupportNote />
      </View>
    );
  }

  // Rewind: celebrate any pause already taken, then pick one for next time.
  if (step === 4) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Animated.View entering={FadeIn.duration(260)} style={[styles.feedback, { backgroundColor: soft }]}>
          {pausesTaken.length > 0 ? (
            <>
              <Text style={styles.feedbackTitle}>🎉 You paused</Text>
              <Text style={mentalStyles.body}>
                You {pausesTaken.map((item) => item.label.toLowerCase()).join(" and ")}. That&apos;s exactly the skill, even when the feeling was {LEVELS[level ?? 0].label.toLowerCase()}.
                {outcome === "better" ? " And it turned out better than you expected." : ""}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.feedbackTitle}>⏪ Let&apos;s rewind</Text>
              <Text style={mentalStyles.body}>
                Reacting fast is really common when something hits hard. It doesn&apos;t mean anything is wrong with you. Let&apos;s find a pause that could fit.
              </Text>
            </>
          )}
        </Animated.View>
        <QuestionCard
          stepKey={4}
          label="Next time"
          question="If it happened again, what pause would you try first?"
          color={color}
        >
          <View style={styles.pauseGrid}>
            {PAUSES.map((item) => (
              <Pressable
                key={item.label}
                accessibilityRole="radio"
                accessibilityState={{ checked: pause === item.label }}
                onPress={() => setPause(item.label)}
                style={({ pressed }) => [
                  styles.pauseCard,
                  pause === item.label && { borderColor: color, backgroundColor: soft },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.pauseIcon}>{item.icon}</Text>
                <Text style={[styles.pauseText, pause === item.label && { color }]}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          {pause && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.after}>
              <Text style={mentalStyles.label}>AND AFTER THE PAUSE?</Text>
              <View style={mentalStyles.chips}>
                {RESPONSES.map((option) => (
                  <SelectionChip key={option} label={option} color={color} selected={response === option} onPress={() => setResponse(option)} />
                ))}
              </View>
            </Animated.View>
          )}
        </QuestionCard>
        {nav(3, 5, "See my replay", !pause || !response)}
        {exit}
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey={3} label="Step 4 of 4" question="How did it turn out?" color={color}>
          <View style={styles.outcomes}>
            {OUTCOMES.map((option) => (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: outcome === option.id }}
                onPress={() => setOutcome(option.id)}
                style={({ pressed }) => [
                  styles.outcome,
                  outcome === option.id && { borderColor: color, backgroundColor: soft },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.outcomeIcon}>{option.icon}</Text>
                <Text style={[styles.outcomeText, outcome === option.id && { color }]}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </QuestionCard>
        {nav(2, 4, "Next", !outcome)}
        {exit}
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard
          stepKey={2}
          label="Step 3 of 4"
          question="What did you do in the moment?"
          hint="Pick everything that fits. Be honest; there's no wrong answer here."
          color={color}
        >
          <View style={mentalStyles.chips}>
            {REACTIONS.map((item) => (
              <SelectionChip
                key={item.label}
                label={item.label}
                color={color}
                selected={reactions.includes(item.label)}
                onPress={() => setReactions(toggleItem(reactions, item.label))}
              />
            ))}
          </View>
        </QuestionCard>
        {nav(1, 3, "Next", reactions.length === 0)}
        {exit}
      </View>
    );
  }

  if (step === 1) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey={1} label="Step 2 of 4" question="How strong was the feeling?" hint="Tap the level that fits." color={color}>
          <View style={styles.meter}>
            {LEVELS.map((item, index) => {
              const filled = level !== null && index <= level;
              return (
                <Pressable
                  key={item.label}
                  accessibilityRole="radio"
                  accessibilityLabel={item.label}
                  accessibilityState={{ checked: level === index }}
                  onPress={() => setLevel(index)}
                  style={({ pressed }) => [styles.meterStep, pressed && styles.pressed]}
                >
                  <View
                    style={[
                      styles.meterBar,
                      { height: 22 + index * 14, borderColor: color },
                      filled && { backgroundColor: color, opacity: 0.35 + index * 0.16 },
                    ]}
                  />
                  <Text style={styles.meterIcon}>{item.icon}</Text>
                  <Text style={[styles.meterLabel, level === index && { color }]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[mentalStyles.label, styles.spaced]}>WHAT DID IT FEEL LIKE? (OPTIONAL)</Text>
          <View style={mentalStyles.chips}>
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
        {nav(0, 2, "Next", level === null)}
        {exit}
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Text style={mentalStyles.body}>
        In the heat of the moment it&apos;s hard to stop and think. Looking back afterwards is how a pause becomes easier next time.
      </Text>
      <QuestionCard
        stepKey={0}
        label="Step 1 of 4"
        question="Think of a recent moment you couldn't control. What happened?"
        color={color}
      >
        <View style={mentalStyles.chips}>
          {MOMENTS.map((option) => (
            <SelectionChip
              key={option}
              label={option}
              color={color}
              selected={!ownMoment.trim() && moment === option}
              onPress={() => {
                setOwnMoment("");
                setMoment(option);
              }}
            />
          ))}
        </View>
        <TextInput
          accessibilityLabel="Or describe it in a few words"
          value={ownMoment}
          onChangeText={setOwnMoment}
          maxLength={60}
          placeholder="Or in a few words…"
          placeholderTextColor={COLORS.muted}
          style={[mentalStyles.input, styles.shortInput]}
        />
      </QuestionCard>
      <PrimaryButton label="Next" color={color} disabled={!what} onPress={() => setStep(1)} />
      <Text style={[mentalStyles.muted, styles.center]}>Nothing you enter here is saved.</Text>
      {exit}
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8 },
  center: { textAlign: "center" },
  spaced: { marginTop: 8 },
  shortInput: { minHeight: 48 },
  meter: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 6, paddingTop: 6 },
  meterStep: { flex: 1, alignItems: "center", gap: 4 },
  meterBar: { width: "100%", borderRadius: 10, borderWidth: 1.5 },
  meterIcon: { fontSize: 20 },
  meterLabel: { color: COLORS.muted, fontSize: 11, fontWeight: "700", textAlign: "center" },
  outcomes: { gap: 8 },
  outcome: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  outcomeIcon: { fontSize: 22 },
  outcomeText: { color: COLORS.ink, fontSize: 15, fontWeight: "700" },
  feedback: { padding: 18, borderRadius: 18, gap: 8 },
  feedbackTitle: { color: COLORS.ink, fontSize: 19, fontWeight: "800" },
  pauseGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pauseCard: {
    width: "48%",
    flexGrow: 1,
    minHeight: 84,
    padding: 12,
    gap: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  pauseIcon: { fontSize: 24 },
  pauseText: { color: COLORS.ink, fontSize: 13, fontWeight: "700", lineHeight: 18 },
  after: { gap: 8, marginTop: 6 },
  timeline: { gap: 0 },
  nodeRow: { flexDirection: "row", gap: 12 },
  nodeRail: { alignItems: "center", width: 44 },
  nodeDot: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  nodeIcon: { fontSize: 19 },
  nodeLine: { width: 3, flex: 1, minHeight: 18, opacity: 0.4 },
  nodeCard: {
    flex: 1,
    marginBottom: 12,
    padding: 14,
    gap: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  nodeText: { color: COLORS.ink, fontSize: 16, fontWeight: "800", lineHeight: 22 },
});
