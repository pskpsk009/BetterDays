import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";

import { COLORS } from "../common/AppShell";
import {
  ActivityHeader,
  CompletionScreen,
  QuestionCard,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SelectionChip,
  SupportNote,
  toggleItem,
} from "../common/ActivityUI";

type ClueId = "situation" | "thought" | "emotion" | "reaction" | "alternative" | "nextStep";

const CLUES: {
  id: ClueId;
  name: string;
  question: string;
  prompt: string;
  example: string;
  optional: boolean;
}[] = [
  {
    id: "situation",
    name: "Situation",
    question: "What happened?",
    prompt: "Describe just the facts, like a detective writing case notes.",
    example: "My friend hasn't replied to my message.",
    optional: false,
  },
  {
    id: "thought",
    name: "Thought",
    question: "What went through your mind?",
    prompt: "The first thought that popped up, in your own words.",
    example: "Maybe they are upset with me.",
    optional: true,
  },
  {
    id: "emotion",
    name: "Emotion",
    question: "What did you feel?",
    prompt: "Pick any that fit, or add your own words.",
    example: "A bit worried and unsure.",
    optional: true,
  },
  {
    id: "reaction",
    name: "Reaction",
    question: "What did you do?",
    prompt: "What you did, said, or felt like doing next.",
    example: "I kept checking my phone.",
    optional: true,
  },
  {
    id: "alternative",
    name: "Alternative perspective",
    question: "What else might explain the situation?",
    prompt:
      "A good detective looks at more than one possibility. These are ideas to consider, not facts.",
    example: "They might be busy, or haven't seen it yet.",
    optional: true,
  },
  {
    id: "nextStep",
    name: "Next step",
    question: "What could you try next time?",
    prompt: "One small, realistic idea is enough.",
    example: "Wait a little and continue with my plans.",
    optional: true,
  },
];

const EMOTION_CHIPS = [
  "Worried",
  "Sad",
  "Annoyed",
  "Embarrassed",
  "Confused",
  "Hurt",
  "Calm",
  "Hopeful",
];

const emptyAnswers = (): Record<ClueId, string> => ({
  situation: "",
  thought: "",
  emotion: "",
  reaction: "",
  alternative: "",
  nextStep: "",
});

type Stage = number | "summary" | "closed";

export function ReflectionDetective({
  color,
  soft,
  onExit,
}: {
  color: string;
  soft: string;
  onExit: () => void;
}) {
  const [stage, setStage] = useState<Stage>(0);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);

  function restart() {
    setAnswers(emptyAnswers());
    setEmotions([]);
    setEditing(false);
    setStage(0);
  }

  function goNext(index: number) {
    if (editing || index === CLUES.length - 1) {
      setEditing(false);
      setStage("summary");
    } else {
      setStage(index + 1);
    }
  }

  function goBack(index: number) {
    if (editing) {
      setEditing(false);
      setStage("summary");
    } else {
      setStage(Math.max(0, index - 1));
    }
  }

  if (stage === "closed") {
    return (
      <View style={mentalStyles.screen}>
        <ActivityHeader eyebrow="Self-Awareness" title="Reflection Detective" color={color} />
        <CompletionScreen
          badge="🔍"
          title="Case notes complete"
          message="Looking at a moment from a few angles takes practice. You did the detective work. Come back whenever another case comes up."
          color={color}
          soft={soft}
          primary={{ label: "Start a new case", onPress: restart }}
          secondary={{ label: "Back to Self-Awareness", onPress: onExit }}
        />
      </View>
    );
  }

  if (stage === "summary") {
    return (
      <View style={mentalStyles.screen}>
        <ActivityHeader eyebrow="Self-Awareness" title="Reflection Detective" color={color} />
        <View style={[mentalStyles.card, styles.panel]}>
          <Text style={[styles.clueLabel, { color }]}>YOUR CASE FILE</Text>
          {CLUES.map((clue, index) => {
            const value = clueValue(clue.id, answers, emotions);
            return (
              <View key={clue.id} style={styles.summaryRow}>
                <View style={styles.summaryText}>
                  <Text style={mentalStyles.label}>{clue.name.toUpperCase()}</Text>
                  <Text style={[mentalStyles.body, !value && styles.skipped]}>
                    {value || "Skipped"}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${clue.name}`}
                  hitSlop={8}
                  onPress={() => {
                    setEditing(true);
                    setStage(index);
                  }}
                  style={({ pressed }) => [
                    styles.editButton,
                    { backgroundColor: soft },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.editText, { color }]}>Edit</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Restart" color={color} onPress={restart} />
          <PrimaryButton flex label="Finish" color={color} onPress={() => setStage("closed")} />
        </View>
        <SupportNote />
      </View>
    );
  }

  const index = stage;
  const clue = CLUES[index];
  const value = answers[clue.id];
  const hasAnswer =
    value.trim().length > 0 || (clue.id === "emotion" && emotions.length > 0);

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Self-Awareness" title="Reflection Detective" color={color} />
      <QuestionCard
        stepKey={index}
        label={`Clue ${index + 1} of ${CLUES.length} · ${clue.name}`}
        aside={clue.optional ? "Optional" : undefined}
        question={clue.question}
        hint={clue.prompt}
        color={color}
      >
        {clue.id === "emotion" && (
          <View style={mentalStyles.chips}>
            {EMOTION_CHIPS.map((item) => (
              <SelectionChip
                key={item}
                label={item}
                color={color}
                selected={emotions.includes(item)}
                onPress={() => setEmotions((current) => toggleItem(current, item))}
              />
            ))}
          </View>
        )}

        <TextInput
          accessibilityLabel={clue.question}
          maxLength={240}
          multiline
          onChangeText={(text) => setAnswers((current) => ({ ...current, [clue.id]: text }))}
          placeholder={clue.id === "emotion" ? "Other words (optional)" : "Type your answer"}
          placeholderTextColor={COLORS.muted}
          style={mentalStyles.input}
          textAlignVertical="top"
          value={value}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityHint="Fills in the example answer"
          onPress={() => setAnswers((current) => ({ ...current, [clue.id]: clue.example }))}
          style={({ pressed }) => [
            styles.example,
            { backgroundColor: soft },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[mentalStyles.label, { color }]}>EXAMPLE · TAP TO USE</Text>
          <Text style={styles.exampleText}>“{clue.example}”</Text>
        </Pressable>
      </QuestionCard>

      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Back"
          color={color}

          disabled={index === 0 && !editing}
          onPress={() => goBack(index)}
        />
        <PrimaryButton
          flex
          label={editing ? "Save" : index === CLUES.length - 1 ? "See case file" : "Continue"}
          color={color}
          disabled={!clue.optional && !hasAnswer}
          onPress={() => goNext(index)}
        />
      </View>
      {clue.optional && !editing && (
        <SecondaryButton
          subtle
          label="Skip this question"
          color={COLORS.muted}
          onPress={() => goNext(index)}
        />
      )}
    </View>
  );
}

function clueValue(id: ClueId, answers: Record<ClueId, string>, emotions: string[]) {
  const text = answers[id].trim();
  if (id !== "emotion") return text;
  return [emotions.join(", "), text].filter(Boolean).join(" · ");
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.78 },
  panel: { gap: 12 },
  clueLabel: { flexShrink: 1, fontSize: 11, fontWeight: "800", letterSpacing: 0.9 },
  example: { padding: 13, borderRadius: 14, gap: 5 },
  exampleText: { color: COLORS.ink, fontSize: 14, lineHeight: 20, fontStyle: "italic" },
  summaryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  summaryText: { flex: 1, gap: 4 },
  skipped: { color: COLORS.muted, fontStyle: "italic" },
  editButton: { minHeight: 34, paddingHorizontal: 12, borderRadius: 10, justifyContent: "center" },
  editText: { fontSize: 12, fontWeight: "800" },
});
