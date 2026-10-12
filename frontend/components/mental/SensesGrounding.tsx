import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../common/AppShell";
import {
  ActivityHeader,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SecondaryButton,
} from "./ui";

const SENSES = [
  {
    count: 5,
    sense: "see",
    title: "5 things you can see",
    hint: "Look around slowly. A colour, a shape, light on a surface.",
  },
  {
    count: 4,
    sense: "feel",
    title: "4 things you can feel through touch",
    hint: "Your feet on the floor, fabric on your skin, the air temperature.",
  },
  {
    count: 3,
    sense: "hear",
    title: "3 things you can hear",
    hint: "Near or far, loud or quiet. Silence counts too.",
  },
  {
    count: 2,
    sense: "smell",
    title: "2 things you can smell",
    hint: "If nothing stands out, that's fine. You can skip this one.",
  },
  {
    count: 1,
    sense: "taste",
    title: "1 taste or sensation in your mouth",
    hint: "A lingering flavour, the feel of your tongue or teeth.",
  },
];

const emptySelections = () => SENSES.map(({ count }) => Array(count).fill(false));

export function SensesGrounding({
  color,
  soft,
  onExit,
}: {
  color: string;
  soft: string;
  onExit: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<boolean[][]>(emptySelections);

  function toggle(itemIndex: number) {
    setSelections((current) =>
      current.map((items, index) =>
        index === stepIndex
          ? items.map((value, i) => (i === itemIndex ? !value : value))
          : items,
      ),
    );
  }

  function noticeNext() {
    const next = selections[stepIndex].indexOf(false);
    if (next !== -1) toggle(next);
  }

  function restart() {
    setSelections(emptySelections());
    setStepIndex(0);
  }

  const header = <ActivityHeader eyebrow="Mindfulness" title="5-Senses Grounding" color={color} />;

  if (stepIndex >= SENSES.length) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="5·4·3·2·1"
          title="You're here, right now"
          message="You took time to notice your surroundings through your senses. Carry that sense of the present with you, if it helps."
          color={color}
          soft={soft}
          primary={{ label: "Restart", onPress: restart }}
          secondary={{ label: "Back to Mindfulness", onPress: onExit }}
        />
      </View>
    );
  }

  const step = SENSES[stepIndex];
  const items = selections[stepIndex];
  const allNoticed = items.every(Boolean);
  const isLast = stepIndex === SENSES.length - 1;

  return (
    <View style={mentalStyles.screen}>
      {header}
      <QuestionCard
        stepKey={stepIndex}
        label={`Step ${stepIndex + 1} of ${SENSES.length}`}
        question={`Notice ${step.title}`}
        hint={step.hint}
        color={color}
      >
        <View style={styles.slots}>
          {items.map((checked, index) => (
            <Pressable
              key={`${step.sense}-${index}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              accessibilityLabel={`Thing ${index + 1} you can ${step.sense}`}
              accessibilityHint={checked ? "Tap to remove" : "Tap when you notice it"}
              onPress={() => toggle(index)}
              style={({ pressed }) => [
                styles.slot,
                { borderColor: checked ? color : COLORS.border },
                checked && { backgroundColor: color },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.slotText, { color: checked ? COLORS.white : color }]}>
                {checked ? "✓" : index + 1}
              </Text>
            </Pressable>
          ))}
        </View>
        <SecondaryButton
          label={allNoticed ? "All noticed" : "I noticed one"}
          color={color}
          disabled={allNoticed}
          onPress={noticeNext}
        />
        <Text style={[mentalStyles.muted, styles.center]}>
          Tap a circle again to remove it. No need to write anything down.
        </Text>
      </QuestionCard>

      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Back"
          color={color}
          disabled={stepIndex === 0}
          onPress={() => setStepIndex((index) => Math.max(0, index - 1))}
        />
        <PrimaryButton
          flex
          label={isLast ? "Finish" : "Continue"}
          color={color}
          onPress={() => setStepIndex((index) => index + 1)}
        />
      </View>
      <SecondaryButton
        subtle
        label="Skip this sense"
        color={COLORS.muted}
        onPress={() => setStepIndex((index) => index + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.78 },
  slots: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 14,
  },
  slot: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  slotText: { fontSize: 18, fontWeight: "800" },
});
