import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "../common/AppShell";
import { BUBBLE_MIN_SCALE, formatClock, getBreathPhase } from "./timing";
import {
  ActivityHeader,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SelectionChip,
  SessionTimer,
  useSessionTimer,
} from "./ui";

const DURATIONS = [1, 3, 5];

type Status = "setup" | "running" | "paused" | "complete";

export function BreathingBubble({
  color,
  soft,
  onExit,
}: {
  color: string;
  soft: string;
  onExit: () => void;
}) {
  const [minutes, setMinutes] = useState(1);
  const [status, setStatus] = useState<Status>("setup");
  const { elapsedMs, remainingMs, reset } = useSessionTimer(
    minutes * 60 * 1000,
    status === "running",
    () => setStatus("complete"),
  );
  const scale = useSharedValue(BUBBLE_MIN_SCALE);

  const phase = getBreathPhase(elapsedMs);
  const isActive = status === "running" || status === "paused";

  // Re-target the bubble at every phase change, and whenever we resume,
  // so the animation stays in step with the timer after a pause.
  useEffect(() => {
    if (status === "running") {
      scale.value = withTiming(phase.targetScale, {
        duration: phase.remainingMs,
        easing: Easing.inOut(Easing.sin),
      });
    } else if (status === "paused") {
      cancelAnimation(scale);
    } else {
      scale.value = withTiming(BUBBLE_MIN_SCALE, { duration: 600 });
    }
    // phase.remainingMs is intentionally read only when the phase changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.step, phase.targetScale, scale, status]);

  useEffect(() => () => cancelAnimation(scale), [scale]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function start() {
    reset();
    setStatus("running");
  }

  function startAgain() {
    reset();
    setStatus("setup");
  }

  if (status === "complete") {
    return (
      <View style={mentalStyles.screen}>
        <ActivityHeader eyebrow="Mindfulness" title="Breathing Bubble" color={color} />
        <CompletionScreen
          badge="○"
          title="Nicely done"
          message={`You gave yourself ${formatClock(elapsedMs / 1000)} of slow breathing. Take a moment to notice how you feel before moving on.`}
          color={color}
          soft={soft}
          primary={{ label: "Breathe again", onPress: startAgain }}
          secondary={{ label: "Back to Mindfulness", onPress: onExit }}
        />
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Mindfulness" title="Breathing Bubble" color={color} />
      <Text style={mentalStyles.body}>
        Let the bubble set a slow pace. Breathe in as it grows and out as it
        shrinks. There is no need to hold your breath.
      </Text>

      <View style={[mentalStyles.card, styles.panel]}>
        {isActive && <SessionTimer remainingMs={remainingMs} color={color} />}

        <View style={styles.stage}>
          <View style={[styles.halo, { backgroundColor: soft }]} />
          <Animated.View style={[styles.bubble, { backgroundColor: color }, bubbleStyle]} />
          <View style={styles.bubbleLabel} pointerEvents="none">
            <Text accessibilityLiveRegion="polite" style={styles.phase}>
              {status === "running" ? phase.label : status === "paused" ? "Paused" : "Ready"}
            </Text>
          </View>
        </View>

        {status === "setup" && (
          <View style={styles.durations}>
            <Text style={mentalStyles.label}>SESSION LENGTH</Text>
            <View style={mentalStyles.chips}>
              {DURATIONS.map((option) => (
                <SelectionChip
                  key={option}
                  label={`${option} min`}
                  color={color}
                  selected={option === minutes}
                  onPress={() => setMinutes(option)}
                />
              ))}
            </View>
          </View>
        )}

        {status === "setup" ? (
          <PrimaryButton label="Start" color={color} onPress={start} />
        ) : (
          <View style={mentalStyles.row}>
            <PrimaryButton
              flex
              label={status === "running" ? "Pause" : "Resume"}
              color={color}
              onPress={() => setStatus(status === "running" ? "paused" : "running")}
            />
            <SecondaryButton flex label="End" color={color} onPress={() => setStatus("complete")} />
          </View>
        )}
      </View>

      <Text style={[mentalStyles.muted, styles.center]}>
        Go at your own pace. You can end the session whenever you like.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  panel: { gap: 14 },
  stage: { height: 250, alignItems: "center", justifyContent: "center" },
  halo: { position: "absolute", width: 236, height: 236, borderRadius: 118 },
  bubble: { width: 216, height: 216, borderRadius: 108, opacity: 0.9 },
  bubbleLabel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  phase: { color: COLORS.white, fontSize: 20, fontWeight: "800" },
  durations: { gap: 9 },
});
