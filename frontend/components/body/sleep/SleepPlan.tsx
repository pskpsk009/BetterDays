import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  ActivityProps,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SecondaryButton,
} from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { TimePicker } from "../../common/TimePicker";
import { NightBanner } from "./NightBanner";
import {
  ClockTime,
  formatDuration,
  formatTime,
  gradualSchedule,
  minutesUntil,
  shortestShift,
} from "./sleepMath";

type Difficulty = "falling" | "late" | "waking" | "tired";

const DIFFICULTIES: { id: Difficulty; label: string; icon: string }[] = [
  { id: "falling", label: "I have difficulty falling asleep.", icon: "🌀" },
  { id: "late", label: "I tend to sleep and wake up too late.", icon: "🕑" },
  { id: "waking", label: "I wake up during the night.", icon: "🌗" },
  { id: "tired", label: "I sleep but still feel tired.", icon: "🥱" },
];

const DIFFICULTY_TIPS: Record<Difficulty, { title: string; tips: string[] }> = {
  falling: {
    title: "For trouble falling asleep",
    tips: [
      "Try a consistent wind-down routine at roughly the same time each night.",
      "Make your room dark, quiet, and comfortably cool.",
      "If you've been lying awake a long time, getting up for a quiet, low-light activity until you feel sleepy can help some people.",
    ],
  },
  late: {
    title: "For sleeping and waking late",
    tips: [
      "Shift your schedule gradually, about 15–30 minutes every few days, rather than all at once.",
      "Keep your wake-up time consistent, even after a late night.",
      "Get some daylight soon after waking; morning light helps your body clock shift earlier.",
    ],
  },
  waking: {
    title: "For waking during the night",
    tips: [
      "Review caffeine timing; having it earlier in the day may help.",
      "Check for disturbances like light, noise, temperature, or notifications.",
      "Look at evening habits such as late heavy meals or screens close to bedtime.",
    ],
  },
  tired: {
    title: "For feeling tired despite sleeping",
    tips: [
      "Review how long your sleep window really is and how consistent it is across the week.",
      "Irregular sleep times can leave you feeling groggy even when total sleep seems fine.",
      "If tiredness continues for a while or affects your daily life, consider talking to a doctor or health professional.",
    ],
  },
};

const DEFAULTS = {
  usual: { hour: 23, minute: 30 } as ClockTime,
  wake: { hour: 7, minute: 0 } as ClockTime,
  target: { hour: 23, minute: 0 } as ClockTime,
};

const TIME_QUESTIONS = [
  { key: "usual", question: "What time do you usually fall asleep?", hint: "Your best guess is fine." },
  { key: "wake", question: "What time do you usually wake up?", hint: "On a typical day." },
  { key: "target", question: "What is your target bedtime?", hint: "When you'd like to be in bed, winding down." },
] as const;

type Stage = 0 | 1 | 2 | 3 | "plan";

export function SleepPlan({ color, soft, onExit }: ActivityProps) {
  const [stage, setStage] = useState<Stage>(0);
  const [times, setTimes] = useState(DEFAULTS);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const banner = (
    <NightBanner
      eyebrow="Good Night Sleep"
      title="Personalized Sleep Plan"
      subtitle="Four quick questions, then a gentle plan."
    />
  );

  function restart() {
    setTimes(DEFAULTS);
    setDifficulty(null);
    setStage(0);
  }

  if (stage === "plan") {
    return (
      <View style={mentalStyles.screen}>
        {banner}
        <PlanPreview
          times={times}
          difficulty={difficulty}
          color={color}
          soft={soft}
        />
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Edit answers" color={color} onPress={() => setStage(0)} />
          <PrimaryButton flex label="Finish" color={color} onPress={onExit} />
        </View>
        <SecondaryButton subtle label="Start over" color={COLORS.muted} onPress={restart} />
      </View>
    );
  }

  if (stage === 3) {
    return (
      <View style={mentalStyles.screen}>
        {banner}
        <QuestionCard
          stepKey={3}
          label="Question 4 of 4"
          aside="Optional"
          question="What is your biggest sleep difficulty?"
          hint="Choose the one that fits best."
          color={color}
        >
          <View accessibilityRole="radiogroup" style={styles.options}>
            {DIFFICULTIES.map((item) => {
              const selected = difficulty === item.id;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => setDifficulty(item.id)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && { borderColor: color, backgroundColor: soft },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.optionIcon}>{item.icon}</Text>
                  <Text style={[styles.optionLabel, selected && { color }]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage(2)} />
          <PrimaryButton flex label="See my plan" color={color} onPress={() => setStage("plan")} />
        </View>
        {difficulty === null && (
          <Text style={[mentalStyles.muted, styles.center]}>
            You can skip this. The plan will still use your times.
          </Text>
        )}
      </View>
    );
  }

  const question = TIME_QUESTIONS[stage];
  return (
    <View style={mentalStyles.screen}>
      {banner}
      <QuestionCard
        stepKey={stage}
        label={`Question ${stage + 1} of 4`}
        question={question.question}
        hint={question.hint}
        color={color}
      >
        <TimePicker
          key={`${question.key}-${formatTime(times[question.key])}`}
          label={question.question}
          value={times[question.key]}
          color={color}
          soft={soft}
          confirmLabel="Confirm and continue"
          onConfirm={(time) => {
            setTimes((current) => ({ ...current, [question.key]: time }));
            setStage((stage + 1) as Stage);
          }}
        />
      </QuestionCard>
      <SecondaryButton
        label="Back"
        color={color}
        disabled={stage === 0}
        onPress={() => setStage((stage - 1) as Stage)}
      />
    </View>
  );
}

function PlanPreview({
  times,
  difficulty,
  color,
  soft,
}: {
  times: typeof DEFAULTS;
  difficulty: Difficulty | null;
  color: string;
  soft: string;
}) {
  const currentWindow = minutesUntil(times.usual, times.wake);
  const targetWindow = minutesUntil(times.target, times.wake);
  const shift = shortestShift(times.usual, times.target);
  const steps = gradualSchedule(times.usual, times.target, 30);

  return (
    <Animated.View entering={FadeIn.duration(240)} style={styles.plan}>
      <Text style={[mentalStyles.label, { color }]}>YOUR SLEEP PLAN PREVIEW</Text>

      <View style={[mentalStyles.card, styles.section]}>
        <Text style={styles.sectionTitle}>Your current sleep window</Text>
        <Text style={[styles.big, { color }]}>{formatDuration(currentWindow)}</Text>
        <Text style={mentalStyles.body}>
          From about {formatTime(times.usual)} to {formatTime(times.wake)}.
        </Text>
        <Text style={mentalStyles.muted}>
          This is your approximate sleep opportunity: the time available for
          sleep. Actual sleep is usually a bit shorter, because it takes time
          to drift off and most people wake briefly during the night. Time in
          bed can be longer still if you get into bed earlier.
        </Text>
      </View>

      <View style={[mentalStyles.card, styles.section]}>
        <Text style={styles.sectionTitle}>With your target bedtime</Text>
        <Text style={[styles.big, { color }]}>{formatDuration(targetWindow)}</Text>
        <Text style={mentalStyles.body}>
          Winding down from about {formatTime(times.target)}, waking at {formatTime(times.wake)}.
        </Text>
        <Text style={mentalStyles.muted}>
          {targetWindow < 7 * 60
            ? "That's under 7 hours of sleep opportunity. Many adults need around 7–9 hours, and teenagers often need more, so you might want to leave a little more room."
            : "Many adults need around 7–9 hours of sleep, and teenagers often need more. Needs vary, so notice how you feel during the day."}
        </Text>
      </View>

      <View style={[mentalStyles.card, styles.section]}>
        <Text style={styles.sectionTitle}>Getting there gradually</Text>
        {Math.abs(shift) <= 30 ? (
          <Text style={mentalStyles.body}>
            Your target is close to when you usually fall asleep. Focus on
            keeping it consistent, including your wake-up time.
          </Text>
        ) : (
          <>
            <Text style={mentalStyles.body}>
              Your target is {formatDuration(Math.abs(shift))}{" "}
              {shift < 0 ? "earlier" : "later"} than now. Rather than changing
              it overnight, try moving about 30 minutes at a time, every few
              nights or whenever it feels comfortable:
            </Text>
            {steps.map((step, index) => (
              <View key={`${formatTime(step)}-${index}`} style={styles.stepRow}>
                <Text style={[styles.stepDot, { backgroundColor: soft, color }]}>{index + 1}</Text>
                <Text style={mentalStyles.body}>
                  {index === steps.length - 1 ? "Target: " : ""}around {formatTime(step)}
                </Text>
              </View>
            ))}
          </>
        )}
        <Text style={mentalStyles.muted}>
          There&apos;s no guarantee you&apos;ll fall asleep at an exact time, and
          that&apos;s okay. Aim to be winding down around then.
        </Text>
      </View>

      {difficulty && (
        <View style={[styles.section, styles.tips, { backgroundColor: soft }]}>
          <Text style={styles.sectionTitle}>{DIFFICULTY_TIPS[difficulty].title}</Text>
          {DIFFICULTY_TIPS[difficulty].tips.map((tip) => (
            <Text key={tip} style={mentalStyles.body}>
              • {tip}
            </Text>
          ))}
        </View>
      )}

      <Text style={[mentalStyles.muted, styles.center]}>
        This is general guidance, not medical advice. If sleep problems
        continue or affect your daily life, consider speaking with a doctor or
        health professional. Your answers aren&apos;t saved.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.8 },
  options: { gap: 10 },
  option: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  optionIcon: { fontSize: 22 },
  optionLabel: { flex: 1, color: COLORS.ink, fontSize: 14, fontWeight: "700", lineHeight: 20 },
  plan: { gap: 14 },
  section: { gap: 8 },
  sectionTitle: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  big: { fontSize: 28, fontWeight: "800" },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 26,
    fontSize: 12,
    fontWeight: "800",
  },
  tips: { padding: 16, borderRadius: 16 },
});
