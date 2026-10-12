import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import {
  ActivityHeader,
  ActivityProps,
  mentalStyles,
  SecondaryButton,
  SelectionChip,
} from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";

const SIZES = [150, 250, 350, 500];
const TARGET_STEP = 250;
const TARGET_MIN = 1000;
const TARGET_MAX = 4000;
const MAX_EMPTY_GLASSES = 12;
const WATER = "#5BA8E0";

export function formatMl(ml: number) {
  return `${String(ml).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ml`;
}

export function HydrationCheckin({ color, soft }: ActivityProps) {
  const [sizeMl, setSizeMl] = useState(250);
  const [targetMl, setTargetMl] = useState(2000);
  const [entries, setEntries] = useState<number[]>([]);

  const loggedMl = entries.reduce((sum, ml) => sum + ml, 0);
  const remainingMl = Math.max(0, targetMl - loggedMl);
  const emptyGlasses =
    remainingMl === 0 ? 1 : Math.min(MAX_EMPTY_GLASSES, Math.ceil(remainingMl / sizeMl));

  const message =
    loggedMl === 0
      ? "Tap an empty glass whenever you have a drink. Small sips across the day all count."
      : loggedMl < targetMl
        ? "Nice. Regular drinks through the day add up. Keep a glass or bottle within reach."
        : "You've reached the target you set. Keep listening to your thirst for the rest of the day.";

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Fuel Your Body" title="Hydration Check-in" color={color} />

      <View style={[mentalStyles.card, styles.panel]}>
        <View style={styles.totals}>
          <View>
            <Text style={mentalStyles.label}>LOGGED</Text>
            <Text accessibilityLiveRegion="polite" style={[styles.total, { color }]}>
              {formatMl(loggedMl)}
            </Text>
          </View>
          <View style={styles.targetBlock}>
            <Text style={mentalStyles.label}>YOUR TARGET</Text>
            <View style={styles.stepper}>
              <StepButton
                label="−"
                accessibilityLabel="Lower target"
                color={color}
                disabled={targetMl <= TARGET_MIN}
                onPress={() => setTargetMl((value) => Math.max(TARGET_MIN, value - TARGET_STEP))}
              />
              <Text style={styles.targetValue}>{formatMl(targetMl)}</Text>
              <StepButton
                label="+"
                accessibilityLabel="Raise target"
                color={color}
                disabled={targetMl >= TARGET_MAX}
                onPress={() => setTargetMl((value) => Math.min(TARGET_MAX, value + TARGET_STEP))}
              />
            </View>
          </View>
        </View>

        <Text style={mentalStyles.label}>DRINK SIZE</Text>
        <View style={mentalStyles.chips}>
          {SIZES.map((size) => (
            <SelectionChip
              key={size}
              label={formatMl(size)}
              color={color}
              selected={size === sizeMl}
              onPress={() => setSizeMl(size)}
            />
          ))}
        </View>

        <View style={styles.glasses}>
          {entries.map((ml, index) => (
            <Animated.View
              key={`full-${index}`}
              entering={ZoomIn.duration(220)}
              accessibilityLabel={`Drink ${index + 1}, ${ml} millilitres`}
              style={styles.glassCell}
            >
              <Glass fill={1} />
              <Text style={styles.glassLabel}>{ml}</Text>
            </Animated.View>
          ))}
          {Array.from({ length: emptyGlasses }, (_, index) => (
            <Pressable
              key={`empty-${index}`}
              accessibilityRole="button"
              accessibilityLabel={`Log a ${sizeMl} millilitre drink`}
              onPress={() => setEntries((current) => [...current, sizeMl])}
              style={({ pressed }) => [styles.glassCell, pressed && styles.pressed]}
            >
              <Glass fill={0} />
              <Text style={[styles.glassLabel, styles.glassLabelEmpty]}>+{sizeMl}</Text>
            </Pressable>
          ))}
        </View>

        <View style={mentalStyles.row}>
          <SecondaryButton
            flex
            label="Undo last"
            color={color}
            disabled={entries.length === 0}
            onPress={() => setEntries((current) => current.slice(0, -1))}
          />
          <SecondaryButton
            flex
            label="Reset"
            color={color}
            disabled={entries.length === 0}
            onPress={() => setEntries([])}
          />
        </View>
      </View>

      <View style={[styles.message, { backgroundColor: soft }]}>
        <Text style={mentalStyles.body}>💧 {message}</Text>
      </View>

      <Text style={[mentalStyles.muted, styles.center]}>
        Hydration needs vary with activity, weather, health, and individual
        circumstances. The target is just a reference point you choose, and
        food and other drinks count too. Nothing here is saved.
      </Text>
    </View>
  );
}

function StepButton({
  label,
  accessibilityLabel,
  color,
  disabled,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  color: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.stepButton,
        { borderColor: color },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.stepButtonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

function Glass({ fill }: { fill: number }) {
  return (
    <Svg width={44} height={54} viewBox="0 0 44 54">
      {fill > 0 && <Path d="M8 16 L36 16 L33 50 L11 50 Z" fill={WATER} opacity={0.85} />}
      <Path
        d="M5 4 L39 4 L34 50 Q33.6 52 31.5 52 L12.5 52 Q10.4 52 10 50 Z"
        fill="none"
        stroke={fill > 0 ? "#3D86BF" : "#B9CDD6"}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.35 },
  panel: { gap: 12 },
  totals: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 12,
  },
  total: { fontSize: 28, fontWeight: "800", fontVariant: ["tabular-nums"] },
  targetBlock: { alignItems: "flex-end", gap: 6 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  stepButtonText: { fontSize: 20, fontWeight: "800", lineHeight: 22 },
  targetValue: { minWidth: 76, textAlign: "center", color: COLORS.ink, fontSize: 15, fontWeight: "800" },
  glasses: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4, paddingVertical: 6 },
  glassCell: { width: "25%", alignItems: "center", paddingVertical: 8, gap: 2 },
  glassLabel: { color: "#3D86BF", fontSize: 11, fontWeight: "800" },
  glassLabelEmpty: { color: COLORS.muted },
  message: { padding: 16, borderRadius: 16 },
});
