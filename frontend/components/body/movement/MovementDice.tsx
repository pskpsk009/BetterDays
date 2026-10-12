import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Rect } from "react-native-svg";

import {
  ActivityHeader,
  ActivityProps,
  mentalStyles,
  PrimaryButton,
} from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { DICE_SUGGESTIONS, PAIN_REMINDER } from "./moves";

const ROLL_MS = 650;

// Pip positions on a 100x100 die face for faces 1-6.
const PIPS: [number, number][][] = [
  [[50, 50]],
  [[28, 28], [72, 72]],
  [[28, 28], [50, 50], [72, 72]],
  [[28, 28], [72, 28], [28, 72], [72, 72]],
  [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]],
];

export function MovementDice({ color, soft }: ActivityProps) {
  const [face, setFace] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  function roll() {
    if (rolling) return;
    // Never repeat the same suggestion twice in a row.
    const options = DICE_SUGGESTIONS.map((_, i) => i).filter((i) => i !== face);
    const next = options[Math.floor(Math.random() * options.length)];

    if (reduceMotion) {
      setFace(next);
      return;
    }
    setRolling(true);
    rotation.value = withTiming(rotation.value + 720, {
      duration: ROLL_MS,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withSequence(
      withTiming(0.85, { duration: ROLL_MS / 2 }),
      withTiming(1, { duration: ROLL_MS / 2 }),
    );
    timeout.current = setTimeout(() => {
      setFace(next);
      setRolling(false);
    }, ROLL_MS);
  }

  const diceStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const suggestion = face === null ? null : DICE_SUGGESTIONS[face];

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Movement & Flexibility" title="Movement Dice" color={color} />
      <Text style={mentalStyles.body}>
        Not sure how to take a break? Roll the dice for a quick, gentle idea.
      </Text>

      <View style={styles.stage}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={face === null ? "Roll the dice" : `Dice showing ${face + 1}. Roll again`}
          accessibilityState={{ busy: rolling }}
          onPress={roll}
        >
          <Animated.View style={diceStyle}>
            <Svg width={150} height={150} viewBox="0 0 100 100">
              <Rect x={4} y={4} width={92} height={92} rx={20} fill={color} />
              <Rect x={4} y={4} width={92} height={92} rx={20} fill="#FFFFFF" opacity={0.08} />
              {(face === null || rolling ? PIPS[4] : PIPS[face]).map(([cx, cy]) => (
                <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={8} fill="#FFFFFF" />
              ))}
            </Svg>
          </Animated.View>
        </Pressable>
        <Text style={mentalStyles.muted}>{rolling ? "Rolling…" : "Tap the dice to roll"}</Text>
      </View>

      {suggestion && !rolling ? (
        <Animated.View
          key={face}
          entering={FadeIn.duration(220)}
          accessibilityLiveRegion="polite"
          style={[styles.suggestion, { backgroundColor: soft }]}
        >
          <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
          <Text style={styles.suggestionText}>{suggestion.text}</Text>
        </Animated.View>
      ) : (
        <View style={[styles.suggestion, styles.placeholder]}>
          <Text style={[mentalStyles.body, styles.center]}>
            {rolling ? "…" : "Your movement idea will appear here."}
          </Text>
        </View>
      )}

      <PrimaryButton
        label={face === null ? "Roll the dice" : "Roll again"}
        color={color}
        disabled={rolling}
        onPress={roll}
      />
      <Text style={[mentalStyles.muted, styles.center]}>{PAIN_REMINDER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  stage: { alignItems: "center", gap: 10, paddingVertical: 10 },
  suggestion: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 20,
    borderRadius: 20,
  },
  placeholder: { borderWidth: 1.5, borderStyle: "dashed", borderColor: COLORS.border },
  suggestionIcon: { fontSize: 40 },
  suggestionText: {
    color: COLORS.ink,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 25,
    textAlign: "center",
  },
});
