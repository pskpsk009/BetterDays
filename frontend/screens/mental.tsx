import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import {
  COLORS,
  MobileScreen,
  ScreenHeader,
} from "../components/common/AppShell";

const GROUNDING_STEPS = [
  { sense: "see", count: 5, prompt: "Name 5 things you can see." },
  { sense: "touch", count: 4, prompt: "Notice 4 things you can touch." },
  { sense: "hear", count: 3, prompt: "Listen for 3 things you can hear." },
  { sense: "smell", count: 2, prompt: "Find 2 things you can smell." },
  { sense: "taste", count: 1, prompt: "Notice 1 thing you can taste." },
];

export default function MentalScreen() {
  const [activeBranch, setActiveBranch] = useState<
    "mindfulness" | "awareness" | null
  >(null);

  return (
    <MobileScreen tone="mind">
      {activeBranch === null && (
        <ScreenHeader
          title="Mental Development"
          subtitle="A calmer mind, one small practice at a time."
        />
      )}
      {activeBranch === null && (
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>Mind space</Text>
          <Text style={styles.introTitle}>How are you growing today?</Text>
        </View>
      )}
      {activeBranch === null ? (
        <View style={styles.branchList}>
          <MindfulnessBranch onPress={() => setActiveBranch("mindfulness")} />
          <SelfAwarenessBranch onPress={() => setActiveBranch("awareness")} />
        </View>
      ) : (
        <View style={styles.content}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setActiveBranch(null)}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.backButtonText}>‹ All branches</Text>
          </Pressable>
          {activeBranch === "mindfulness" ? (
            <MindfulnessPractice />
          ) : (
            <GroundingExercise />
          )}
        </View>
      )}
    </MobileScreen>
  );
}

function MindfulnessBranch({ onPress }: { onPress: () => void }) {
  return (
    <BranchButton
      number="01"
      title="Mindfulness Branch"
      detail="Breathing and present-moment practice"
      onPress={onPress}
    />
  );
}

function SelfAwarenessBranch({ onPress }: { onPress: () => void }) {
  return (
    <BranchButton
      number="02"
      title="Self-Awareness Branch"
      detail="Notice thoughts, feelings, and patterns"
      onPress={onPress}
    />
  );
}

function BranchButton({
  number,
  title,
  detail,
  onPress,
}: {
  number: string;
  title: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.branchButton, pressed && styles.pressed]}
    >
      <View style={styles.branchNumber}>
        <Text style={styles.branchNumberText}>{number}</Text>
      </View>
      <View style={styles.branchCopy}>
        <Text style={styles.branchTitle}>{title}</Text>
        <Text style={styles.branchDetail}>{detail}</Text>
      </View>
      <Text style={styles.branchArrow}>{">"}</Text>
    </Pressable>
  );
}

function MindfulnessPractice() {
  const [durationMinutes, setDurationMinutes] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startedAt = useRef(0);
  const scale = useSharedValue(0.78);
  const totalSeconds = durationMinutes * 60;
  const secondsLeft = Math.max(0, totalSeconds - elapsedSeconds);
  const isComplete = !isRunning && elapsedSeconds > 0 && secondsLeft === 0;
  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const phasePosition = elapsedSeconds % 12;
  const phase =
    phasePosition < 4
      ? "Breathe in"
      : phasePosition < 6
        ? "Hold"
        : "Breathe out";
  const phaseSeconds =
    phasePosition < 4
      ? 4 - phasePosition
      : phasePosition < 6
        ? 6 - phasePosition
        : 12 - phasePosition;
  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (isRunning) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000 }),
          withTiming(0.78, {
            duration: 6000,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        false,
      );
      const timer = setInterval(() => {
        const nextElapsed = Math.min(
          durationMinutes * 60,
          Math.floor((Date.now() - startedAt.current) / 1000),
        );
        setElapsedSeconds(nextElapsed);
        if (nextElapsed >= durationMinutes * 60) setIsRunning(false);
      }, 250);
      return () => clearInterval(timer);
    }
    cancelAnimation(scale);
    scale.value = 0.78;
  }, [durationMinutes, isRunning, scale]);

  function startPractice() {
    if (secondsLeft === 0) setElapsedSeconds(0);
    startedAt.current =
      Date.now() - (secondsLeft === 0 ? 0 : elapsedSeconds) * 1000;
    setIsRunning(true);
  }

  function stopPractice() {
    setIsRunning(false);
    setElapsedSeconds(0);
  }

  function chooseDuration(minutes: number) {
    setIsRunning(false);
    setDurationMinutes(minutes);
    setElapsedSeconds(0);
  }

  return (
    <View style={styles.practice}>
      <View style={styles.practiceHeading}>
        <View style={styles.practiceIcon}>
          <Text style={styles.practiceIconText}>01</Text>
        </View>
        <View style={styles.practiceHeadingCopy}>
          <Text style={styles.practiceEyebrow}>MINDFULNESS PRACTICE</Text>
          <Text style={styles.practiceTitle}>Guided breathing</Text>
        </View>
      </View>
      <Text style={styles.goalLabel}>TODAY'S INTENTION</Text>
      <Text style={styles.goalText}>
        Slow down, notice the present moment, and make space for your thoughts
        and feelings.
      </Text>
      <View style={styles.breathingPanel}>
        <View style={styles.breathingTopline}>
          <Text style={styles.breathingToplineLabel}>TIME LEFT</Text>
          <Text
            accessibilityLabel={`Time remaining ${formattedTime}`}
            style={styles.timerText}
          >
            {formattedTime}
          </Text>
        </View>
        <View style={styles.breathingVisual}>
          <View style={styles.outerRing} />
          <Animated.View style={[styles.breathingCircle, breathingStyle]}>
            <Text style={styles.breathingPhase}>
              {isRunning ? phase : "Ready"}
            </Text>
            {isRunning && (
              <Text style={styles.breathingCount}>{phaseSeconds} sec</Text>
            )}
          </Animated.View>
        </View>
        <Text style={styles.breathingHint}>
          {isRunning
            ? "Follow the circle's pace"
            : isComplete
              ? "Session complete. Take a moment before continuing."
              : "Breathe in for 4 · hold for 2 · out for 6"}
        </Text>
        <View style={styles.durationBlock}>
          <Text style={styles.durationLabel}>SESSION LENGTH</Text>
          <View style={styles.durationOptions}>
            {[1, 3, 5, 10].map((minutes) => (
              <Pressable
                key={minutes}
                accessibilityRole="button"
                accessibilityState={{ selected: durationMinutes === minutes }}
                onPress={() => chooseDuration(minutes)}
                style={({ pressed }) => [
                  styles.durationOption,
                  durationMinutes === minutes && styles.durationOptionSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.durationOptionText,
                    durationMinutes === minutes &&
                      styles.durationOptionTextSelected,
                  ]}
                >
                  {minutes} min
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={isRunning ? stopPractice : startPractice}
          style={({ pressed }) => [
            styles.practiceButton,
            pressed && styles.practiceButtonPressed,
          ]}
        >
          <Text style={styles.practiceButtonText}>
            {isRunning
              ? "Stop practice"
              : isComplete
                ? "Begin again"
                : "Begin breathing"}
          </Text>
          <Text style={styles.practiceButtonArrow}>
            {isRunning ? "×" : ">"}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.practiceFootnote}>
        Take this at your own pace. You can stop whenever you like.
      </Text>
    </View>
  );
}

function GroundingExercise() {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(() =>
    GROUNDING_STEPS.map(({ count }) => Array.from({ length: count }, () => "")),
  );
  const [reflection, setReflection] = useState("");
  const isComplete = activeStep >= GROUNDING_STEPS.length;
  const step = GROUNDING_STEPS[activeStep];

  function updateAnswer(entryIndex: number, value: string) {
    setAnswers((currentAnswers) =>
      currentAnswers.map((entries, stepIndex) =>
        stepIndex === activeStep
          ? entries.map((entry, index) =>
              index === entryIndex ? value : entry,
            )
          : entries,
      ),
    );
  }

  function restartExercise() {
    setActiveStep(0);
    setAnswers(
      GROUNDING_STEPS.map(({ count }) =>
        Array.from({ length: count }, () => ""),
      ),
    );
    setReflection("");
  }

  return (
    <View style={styles.grounding}>
      <View style={styles.practiceHeading}>
        <View style={styles.practiceIcon}>
          <Text style={styles.practiceIconText}>02</Text>
        </View>
        <View style={styles.practiceHeadingCopy}>
          <Text style={styles.practiceEyebrow}>SELF-AWARENESS PRACTICE</Text>
          <Text style={styles.practiceTitle}>5-4-3-2-1 grounding</Text>
        </View>
      </View>
      <Text style={styles.goalText}>
        Gently bring your attention to what is around you, one sense at a time.
      </Text>

      {isComplete ? (
        <View style={styles.groundingCard}>
          <Text style={styles.groundingStepEyebrow}>PRACTICE COMPLETE</Text>
          <Text style={styles.groundingStepTitle}>Take a moment to notice</Text>
          <Text style={styles.groundingStepDetail}>
            how do you feel after this exercise? You can write a reflection
            below or leave it blank.
          </Text>
          <TextInput
            accessibilityLabel="Optional reflection after grounding"
            multiline
            onChangeText={setReflection}
            placeholder="does this help you calm down and reduce your anxiety?"
            placeholderTextColor={COLORS.muted}
            style={[styles.groundingInput, styles.reflectionInput]}
            textAlignVertical="top"
            value={reflection}
          />
          <Text style={styles.groundingFootnote}>
            Your reflection is not saved.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={restartExercise}
            style={({ pressed }) => [
              styles.practiceButton,
              pressed && styles.practiceButtonPressed,
            ]}
          >
            <Text style={styles.practiceButtonText}>Start again</Text>
            <Text style={styles.practiceButtonArrow}>{">"}</Text>
          </Pressable>
        </View>
      ) : step ? (
        <View style={styles.groundingCard}>
          <View style={styles.groundingProgressRow}>
            <Text style={styles.groundingStepEyebrow}>
              STEP {activeStep + 1} OF {GROUNDING_STEPS.length}
            </Text>
            <Text style={styles.groundingStepCount}>
              {step.count} {step.sense}
            </Text>
          </View>
          <Text style={styles.groundingStepTitle}>{step.prompt}</Text>
          <View style={styles.groundingEntries}>
            {answers[activeStep].map((entry, entryIndex) => (
              <View
                key={`${step.sense}-${entryIndex}`}
                style={styles.groundingEntryRow}
              >
                <Text style={styles.groundingEntryNumber}>
                  {entryIndex + 1}
                </Text>
                <TextInput
                  accessibilityLabel={`${step.sense} observation ${entryIndex + 1}`}
                  onChangeText={(value) => updateAnswer(entryIndex, value)}
                  placeholder={`Something you can ${step.sense}`}
                  placeholderTextColor={COLORS.muted}
                  returnKeyType={
                    entryIndex === step.count - 1 ? "done" : "next"
                  }
                  style={styles.groundingInput}
                  value={entry}
                />
              </View>
            ))}
          </View>
          <Text style={styles.groundingFootnote}>
            You can leave any entry blank and continue.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setActiveStep((currentStep) => currentStep + 1)}
            style={({ pressed }) => [
              styles.practiceButton,
              pressed && styles.practiceButtonPressed,
            ]}
          >
            <Text style={styles.practiceButtonText}>
              {activeStep === GROUNDING_STEPS.length - 1
                ? "Finish grounding"
                : "Continue"}
            </Text>
            <Text style={styles.practiceButtonArrow}>{">"}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { paddingBottom: 18 },
  branchList: { gap: 12 },
  branchButton: {
    minHeight: 84,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  pressed: { opacity: 0.78 },
  branchNumber: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: COLORS.mindSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  branchNumberText: { color: COLORS.mind, fontSize: 12, fontWeight: "800" },
  branchCopy: { flex: 1, gap: 5 },
  branchTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "800" },
  branchDetail: { color: COLORS.muted, fontSize: 12, lineHeight: 17 },
  branchArrow: { color: COLORS.mind, fontSize: 22, fontWeight: "600" },
  content: { gap: 14, paddingTop: 34 },
  backButton: {
    minHeight: 38,
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 11,
    borderRadius: 11,
    backgroundColor: COLORS.mindSoft,
  },
  backButtonText: { color: COLORS.mind, fontSize: 13, fontWeight: "700" },
  practice: { gap: 15 },
  practiceHeading: { flexDirection: "row", alignItems: "center", gap: 12 },
  practiceIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.mindSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  practiceIconText: { color: COLORS.mind, fontSize: 12, fontWeight: "800" },
  practiceHeadingCopy: { gap: 3 },
  practiceEyebrow: {
    color: COLORS.mind,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  practiceTitle: { color: COLORS.ink, fontSize: 20, fontWeight: "800" },
  goalLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  goalText: { marginTop: -8, color: COLORS.ink, fontSize: 14, lineHeight: 21 },
  breathingPanel: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    shadowColor: "#205655",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  breathingTopline: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breathingToplineLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  timerText: {
    color: COLORS.mind,
    fontSize: 13,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  breathingVisual: {
    width: 206,
    height: 206,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 9,
  },
  outerRing: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: "#D8E2FA",
    backgroundColor: "#F7F9FE",
  },
  breathingCircle: {
    width: 146,
    height: 146,
    borderRadius: 73,
    backgroundColor: COLORS.mind,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.mind,
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 5,
  },
  breathingPhase: { color: COLORS.white, fontSize: 18, fontWeight: "800" },
  breathingCount: {
    marginTop: 5,
    color: "#E8EDFF",
    fontSize: 12,
    fontWeight: "600",
  },
  breathingHint: {
    minHeight: 18,
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
  },
  durationBlock: { width: "100%", marginTop: 17, gap: 9 },
  durationLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  durationOptions: { flexDirection: "row", gap: 7 },
  durationOption: {
    flex: 1,
    minHeight: 39,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  durationOptionSelected: {
    borderColor: COLORS.mind,
    backgroundColor: COLORS.mindSoft,
  },
  durationOptionText: { color: COLORS.muted, fontSize: 11, fontWeight: "700" },
  durationOptionTextSelected: { color: COLORS.mind },
  practiceButton: {
    width: "100%",
    minHeight: 48,
    marginTop: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.mind,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  practiceButtonPressed: { opacity: 0.84 },
  practiceButtonText: { color: COLORS.white, fontSize: 14, fontWeight: "800" },
  practiceButtonArrow: { color: COLORS.white, fontSize: 19, fontWeight: "600" },
  practiceFootnote: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },
  grounding: { gap: 15 },
  groundingGuide: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.mindSoft,
    gap: 8,
  },
  groundingGuideTitle: {
    color: COLORS.mind,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  groundingGuideItem: { color: COLORS.ink, fontSize: 13, lineHeight: 19 },
  groundingGuideCount: { color: COLORS.mind, fontWeight: "800" },
  groundingCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  groundingProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groundingStepEyebrow: {
    color: COLORS.mind,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  groundingStepCount: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  groundingStepTitle: {
    color: COLORS.ink,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 23,
  },
  groundingStepDetail: { color: COLORS.muted, fontSize: 13, lineHeight: 19 },
  groundingEntries: { gap: 8 },
  groundingEntryRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  groundingEntryNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    overflow: "hidden",
    textAlign: "center",
    textAlignVertical: "center",
    color: COLORS.mind,
    backgroundColor: COLORS.mindSoft,
    fontSize: 11,
    fontWeight: "800",
  },
  groundingInput: {
    minHeight: 42,
    flex: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    color: COLORS.ink,
    fontSize: 13,
  },
  reflectionInput: { minHeight: 96 },
  groundingFootnote: { color: COLORS.muted, fontSize: 11, lineHeight: 16 },
  eyebrow: {
    marginBottom: 8,
    color: COLORS.mind,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  introTitle: { color: "#315C61", fontSize: 18, fontWeight: "700" },
});
