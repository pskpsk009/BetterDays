import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppIcon } from "../common/AppIcon";
import { useLogCompletion } from "../common/activityLog";
import { COLORS } from "../common/AppShell";
import {
  ActivityHeader,
  QuestionCard,
  RatingSelector,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SelectionChip,
  SupportNote,
  toggleItem,
} from "../common/ActivityUI";

const EMOTIONS = [
  { name: "Happy", face: "emoticon-happy-outline", feelings: ["Content", "Grateful", "Proud", "Relieved", "Cheerful"] },
  { name: "Sad", face: "emoticon-cry-outline", feelings: ["Lonely", "Disappointed", "Down", "Hurt", "Homesick"] },
  { name: "Angry", face: "emoticon-angry-outline", feelings: ["Irritated", "Annoyed", "Resentful", "Offended", "Heated"] },
  { name: "Anxious", face: "emoticon-sad-outline", feelings: ["Worried", "Nervous", "Uneasy", "Overwhelmed", "Tense"] },
  { name: "Calm", face: "emoticon-outline", feelings: ["Relaxed", "Peaceful", "Settled", "At ease", "Steady"] },
  { name: "Confused", face: "emoticon-confused-outline", feelings: ["Unsure", "Torn", "Lost", "Puzzled", "Mixed-up"] },
  { name: "Excited", face: "emoticon-excited-outline", feelings: ["Eager", "Hopeful", "Energised", "Inspired", "Curious"] },
  { name: "Frustrated", face: "emoticon-frown-outline", feelings: ["Stuck", "Impatient", "Fed up", "Restless", "Blocked"] },
];

const INTENSITY_LABELS = ["A little", "Some", "Moderate", "Strong", "Very strong"];

const CONTRIBUTORS = [
  "School or work",
  "Relationships",
  "Uncertainty",
  "Tiredness",
  "Something else",
  "I'm not sure",
];

const QUESTIONS = [
  {
    question: "Which emotion is closest right now?",
    hint: "There are no right or wrong answers. Pick whatever fits best.",
  },
  { question: "Can you get more specific?", hint: "Choose any that fit." },
  { question: "How strong is this feeling?", hint: undefined },
  { question: "What might be contributing to this feeling?", hint: "Choose any that fit." },
  { question: "Anything else you want to note?", hint: "Only a few words is fine." },
];

const STEP_COUNT = QUESTIONS.length;

export function EmotionExplorer({
  color,
  soft,
  onExit,
}: {
  color: string;
  soft: string;
  onExit: () => void;
}) {
  const [step, setStep] = useState(0);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [feelings, setFeelings] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<number | null>(null);
  const [contributors, setContributors] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const logCompletion = useLogCompletion();

  const selected = EMOTIONS.find((item) => item.name === emotion);
  const isSummary = step >= STEP_COUNT;

  function chooseEmotion(name: string) {
    if (name !== emotion) setFeelings([]);
    setEmotion(name);
  }

  function restart() {
    setEmotion(null);
    setFeelings([]);
    setIntensity(null);
    setContributors([]);
    setNote("");
    setStep(0);
  }

  const next = () => setStep((value) => value + 1);
  const back = () => setStep((value) => Math.max(0, value - 1));

  if (isSummary) {
    return (
      <View style={mentalStyles.screen}>
        <ActivityHeader eyebrow="Self-Awareness" title="Emotion Explorer" color={color} />
        <View style={[mentalStyles.card, styles.panel]}>
          <Text style={[styles.stepLabel, { color }]}>YOUR CHECK-IN</Text>
          <View style={styles.summaryHero}>
            <Text style={styles.summaryFace}>{selected?.face}</Text>
            <Text style={styles.question}>Feeling {emotion?.toLowerCase()}</Text>
          </View>
          <SummaryRow label="More specifically" value={feelings.join(", ")} />
          <SummaryRow
            label="Intensity"
            value={intensity ? `${intensity} of 5 · ${INTENSITY_LABELS[intensity - 1]}` : ""}
          />
          <SummaryRow label="Might be contributing" value={contributors.join(", ")} />
          <SummaryRow label="Note" value={note.trim()} />
          <Text style={[mentalStyles.body, styles.center]}>
            Every feeling makes sense in its own way. Noticing it is a useful
            first step.
          </Text>
        </View>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={back} />
          <PrimaryButton
            flex
            label="Finish"
            color={color}
            onPress={() => {
              logCompletion();
              onExit();
            }}
          />
        </View>
        <SecondaryButton subtle label="Start over" color={COLORS.muted} onPress={restart} />
        <SupportNote />
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Self-Awareness" title="Emotion Explorer" color={color} />
      <QuestionCard
        stepKey={step}
        label={`Step ${step + 1} of ${STEP_COUNT}`}
        aside={step >= 3 ? "Optional" : undefined}
        question={
          step === 1 && selected
            ? `${selected.name}. Can you get more specific?`
            : QUESTIONS[step].question
        }
        hint={QUESTIONS[step].hint}
        color={color}
      >
        {step === 0 && (
          <View style={styles.grid}>
            {EMOTIONS.map((item) => {
              const isSelected = item.name === emotion;
              return (
                <Pressable
                  key={item.name}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={item.name}
                  onPress={() => chooseEmotion(item.name)}
                  style={({ pressed }) => [
                    styles.emotionCard,
                    isSelected && { borderColor: color, backgroundColor: soft },
                    pressed && styles.pressed,
                  ]}
                >
                  <AppIcon name={item.face} size={32} color={isSelected ? color : COLORS.ink} />
                  <Text style={[styles.emotionName, isSelected && { color }]}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {step === 1 && selected && (
          <View style={mentalStyles.chips}>
            {selected.feelings.map((feeling) => (
              <SelectionChip
                key={feeling}
                label={feeling}
                color={color}
                selected={feelings.includes(feeling)}
                onPress={() => setFeelings((current) => toggleItem(current, feeling))}
              />
            ))}
          </View>
        )}

        {step === 2 && (
          <RatingSelector
            value={intensity}
            onChange={setIntensity}
            color={color}
            labels={INTENSITY_LABELS}
          />
        )}

        {step === 3 && (
          <View style={mentalStyles.chips}>
            {CONTRIBUTORS.map((item) => (
              <SelectionChip
                key={item}
                label={item}
                color={color}
                selected={contributors.includes(item)}
                onPress={() => setContributors((current) => toggleItem(current, item))}
              />
            ))}
          </View>
        )}

        {step === 4 && (
          <>
            <TextInput
              accessibilityLabel="Optional note about this feeling"
              maxLength={200}
              multiline
              onChangeText={setNote}
              placeholder="e.g. I noticed it after my morning class"
              placeholderTextColor={COLORS.muted}
              style={mentalStyles.input}
              textAlignVertical="top"
              value={note}
            />
            <SupportNote>Your note is not saved.</SupportNote>
          </>
        )}
      </QuestionCard>

      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Back"
          color={color}
          disabled={step === 0}
          onPress={back}
        />
        <PrimaryButton
          flex
          label={step === STEP_COUNT - 1 ? "See summary" : "Continue"}
          color={color}
          disabled={step === 0 && !emotion}
          onPress={next}
        />
      </View>
      {step > 0 && (
        <SecondaryButton subtle label="Skip this step" color={COLORS.muted} onPress={next} />
      )}
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={mentalStyles.label}>{label.toUpperCase()}</Text>
      <Text style={[mentalStyles.body, !value && styles.skipped]}>
        {value || "Skipped"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.78 },
  panel: { gap: 12 },
  stepLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.9 },
  question: { color: COLORS.ink, fontSize: 19, fontWeight: "800", lineHeight: 25 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  emotionCard: {
    width: "47.5%",
    flexGrow: 1,
    minHeight: 86,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  emotionName: { color: COLORS.ink, fontSize: 14, fontWeight: "700" },
  summaryHero: { alignItems: "center", gap: 4, paddingVertical: 6 },
  summaryFace: { fontSize: 44 },
  summaryRow: { gap: 4, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  skipped: { color: COLORS.muted, fontStyle: "italic" },
});
