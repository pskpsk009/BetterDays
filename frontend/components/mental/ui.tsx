import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

import { COLORS } from "../common/AppShell";
import type { ActivityData, BranchData, BranchId } from "./branches";
import { elapsedFor, formatClock } from "./timing";

// Shared building blocks for the Mental Development branches and activities.

export function BranchIcon({
  branch,
  color,
  size = 46,
}: {
  branch: BranchId;
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {branch === "mindfulness" && (
        <>
          <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
          <Circle cx={24} cy={24} r={13} fill={color} opacity={0.24} />
          <Path
            d="M24 33c-6-3.5-8-8-6.5-13.5C22 21 24 24 24 33Zm0 0c6-3.5 8-8 6.5-13.5C26 21 24 24 24 33Z"
            fill={color}
          />
        </>
      )}
      {branch === "awareness" && (
        <>
          <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
          <Path
            d="M10 24c4-7 9-10 14-10s10 3 14 10c-4 7-9 10-14 10s-10-3-14-10Z"
            fill="none"
            stroke={color}
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
          <Circle cx={24} cy={24} r={5} fill={color} />
        </>
      )}
      {branch === "concentration" && (
        <>
          <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
          <Circle cx={24} cy={24} r={13} fill="none" stroke={color} strokeWidth={2.6} />
          <Circle cx={24} cy={24} r={7} fill="none" stroke={color} strokeWidth={2.6} />
          <Circle cx={24} cy={24} r={2.6} fill={color} />
        </>
      )}
    </Svg>
  );
}

export function BranchCard({
  branch,
  onPress,
}: {
  branch: BranchData;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${branch.title}. ${branch.tagline}`}
      onPress={onPress}
      style={({ pressed }) => [mentalStyles.card, styles.branchCard, pressed && styles.cardPressed]}
    >
      <View style={[styles.branchAccent, { backgroundColor: branch.color }]} />
      <View style={[styles.branchIcon, { backgroundColor: branch.soft }]}>
        <BranchIcon branch={branch.id} color={branch.color} />
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.branchTitle}>{branch.title}</Text>
        <Text style={styles.cardDetail}>{branch.tagline}</Text>
      </View>
      <Text style={[styles.chevron, { color: branch.color }]}>›</Text>
    </Pressable>
  );
}

export function ActivityCard({
  activity,
  branch,
  onPress,
}: {
  activity: ActivityData;
  branch: BranchData;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${activity.title}. ${activity.detail}`}
      onPress={onPress}
      style={({ pressed }) => [styles.activityCard, pressed && styles.cardPressed]}
    >
      <View style={[styles.activityGlyph, { backgroundColor: branch.soft }]}>
        <Text style={[styles.activityGlyphText, { color: branch.color }]}>
          {activity.glyph}
        </Text>
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.cardDetail}>{activity.detail}</Text>
      </View>
      <Text style={[styles.chevron, { color: branch.color }]}>›</Text>
    </Pressable>
  );
}

export function BackPill({
  label,
  color,
  soft,
  onPress,
}: {
  label: string;
  color: string;
  soft: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Back to ${label}`}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.backPill,
        { backgroundColor: soft },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.backPillText, { color }]}>‹ {label}</Text>
    </Pressable>
  );
}

export function ActivityHeader({
  eyebrow,
  title,
  color,
}: {
  eyebrow: string;
  title: string;
  color: string;
}) {
  return (
    <View style={styles.activityHeader}>
      <Text style={[styles.eyebrow, { color }]}>{eyebrow.toUpperCase()}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

type ButtonProps = {
  label: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  flex?: boolean;
};

export function PrimaryButton({ label, color, onPress, disabled, flex }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        flex && styles.flex,
        { backgroundColor: color },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, { color: COLORS.white }]}>{label}</Text>
    </Pressable>
  );
}

/** Outlined button, or a quiet text-only button when `subtle` is set. */
export function SecondaryButton({
  label,
  color,
  onPress,
  disabled,
  flex,
  subtle = false,
}: ButtonProps & { subtle?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        flex && styles.flex,
        !subtle && { borderWidth: 1.5, borderColor: color, backgroundColor: COLORS.white },
        subtle && styles.subtleButton,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, subtle && styles.subtleText, { color }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SelectionChip({
  label,
  color,
  selected,
  onPress,
}: {
  label: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: color, borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipText, selected && { color: COLORS.white }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** A row of numbered circles; `labels[i]` describes rating i + 1. */
export function RatingSelector({
  value,
  onChange,
  color,
  labels,
}: {
  value: number | null;
  onChange: (value: number) => void;
  color: string;
  labels: string[];
}) {
  return (
    <View style={styles.rating}>
      <View accessibilityRole="radiogroup" style={styles.ratingRow}>
        {labels.map((label, index) => {
          const rating = index + 1;
          const selected = value === rating;
          return (
            <Pressable
              key={label}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${rating} of ${labels.length}, ${label}`}
              onPress={() => onChange(rating)}
              style={({ pressed }) => [
                styles.ratingOption,
                { borderColor: selected ? color : COLORS.border },
                selected && { backgroundColor: color },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.ratingValue, { color: selected ? COLORS.white : color }]}>
                {rating}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={[mentalStyles.body, styles.center]}>
        {value ? labels[value - 1] : `Tap a number from 1 to ${labels.length}`}
      </Text>
    </View>
  );
}

/**
 * A pausable countdown. Time is measured from the clock rather than by
 * counting ticks, so pausing, resuming and ending stay accurate. The
 * interval is cleared on pause, finish and unmount.
 */
export function useSessionTimer(
  durationMs: number,
  running: boolean,
  onFinish: () => void,
) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const bankedMs = useRef(0);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const next = elapsedFor(bankedMs.current, startedAt, Date.now(), durationMs);
      setElapsedMs(next);
      if (next >= durationMs) {
        clearInterval(timer);
        onFinishRef.current();
      }
    }, 200);
    return () => {
      clearInterval(timer);
      bankedMs.current = elapsedFor(bankedMs.current, startedAt, Date.now(), durationMs);
    };
  }, [durationMs, running]);

  const reset = useCallback(() => {
    bankedMs.current = 0;
    setElapsedMs(0);
  }, []);

  return { elapsedMs, remainingMs: Math.max(0, durationMs - elapsedMs), reset };
}

export function SessionTimer({
  remainingMs,
  color,
  size = "medium",
}: {
  remainingMs: number;
  color: string;
  size?: "medium" | "large";
}) {
  const clock = formatClock(remainingMs / 1000);
  return (
    <Text
      accessibilityRole="timer"
      accessibilityLabel={`Time remaining ${clock}`}
      style={[styles.timer, size === "large" && styles.timerLarge, { color }]}
    >
      {clock}
    </Text>
  );
}

/** Card for one step of a guided activity; slides in when `stepKey` changes. */
export function QuestionCard({
  stepKey,
  label,
  aside,
  question,
  hint,
  color,
  children,
}: {
  stepKey: string | number;
  label: string;
  aside?: string;
  question: string;
  hint?: string;
  color: string;
  children?: React.ReactNode;
}) {
  return (
    <Animated.View
      key={stepKey}
      entering={FadeInRight.duration(240)}
      style={[mentalStyles.card, styles.questionCard]}
    >
      <View style={styles.questionTop}>
        <Text accessibilityLiveRegion="polite" style={[styles.stepLabel, { color }]}>
          {label.toUpperCase()}
        </Text>
        {aside && <Text style={mentalStyles.muted}>{aside}</Text>}
      </View>
      <Text accessibilityRole="header" style={styles.question}>
        {question}
      </Text>
      {hint && <Text style={mentalStyles.muted}>{hint}</Text>}
      {children}
    </Animated.View>
  );
}

type CompletionAction = { label: string; onPress: () => void };

export function CompletionScreen({
  badge,
  title,
  message,
  color,
  soft,
  primary,
  secondary,
  children,
}: {
  badge: string;
  title: string;
  message: string;
  color: string;
  soft: string;
  primary: CompletionAction;
  secondary?: CompletionAction;
  children?: React.ReactNode;
}) {
  return (
    <Animated.View entering={FadeInRight.duration(240)} style={[mentalStyles.card, styles.completion]}>
      <View style={[styles.completionBadge, { backgroundColor: soft }]}>
        <Text style={[styles.completionBadgeText, { color }]}>{badge}</Text>
      </View>
      <Text accessibilityRole="header" style={styles.completionTitle}>
        {title}
      </Text>
      <Text style={[mentalStyles.body, styles.center]}>{message}</Text>
      {children}
      <View style={styles.completionActions}>
        <PrimaryButton label={primary.label} color={color} onPress={primary.onPress} />
        {secondary && (
          <SecondaryButton label={secondary.label} color={color} onPress={secondary.onPress} />
        )}
      </View>
    </Animated.View>
  );
}

export function SupportNote({ children }: { children?: string }) {
  return (
    <Text style={[mentalStyles.muted, styles.center]}>
      {children ?? "Nothing you enter here is saved."} If something feels
      heavy or unsafe, please reach out to someone you trust or a local
      support line.
    </Text>
  );
}

export function toggleItem<T>(items: T[], item: T): T[] {
  return items.includes(item)
    ? items.filter((value) => value !== item)
    : [...items, item];
}

export const mentalStyles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    shadowColor: "#205655",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  input: {
    minHeight: 86,
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    color: COLORS.ink,
    fontSize: 15,
    lineHeight: 21,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  body: { color: COLORS.ink, fontSize: 14, lineHeight: 21 },
  muted: { color: COLORS.muted, fontSize: 12, lineHeight: 18 },
  label: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  row: { flexDirection: "row", gap: 10 },
  screen: { gap: 16 },
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: "center" },
  pressed: { opacity: 0.78 },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.4 },
  branchCard: {
    minHeight: 104,
    paddingLeft: 20,
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
  },
  branchAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5 },
  branchIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCopy: { flex: 1, gap: 5 },
  branchTitle: { color: COLORS.ink, fontSize: 17, fontWeight: "800" },
  cardDetail: { color: COLORS.muted, fontSize: 13, lineHeight: 19 },
  chevron: { fontSize: 28, fontWeight: "500" },
  activityCard: {
    minHeight: 84,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  activityGlyph: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  activityGlyphText: { fontSize: 22, fontWeight: "800" },
  activityTitle: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  backPill: {
    minHeight: 40,
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 13,
    borderRadius: 12,
  },
  backPillText: { fontSize: 13, fontWeight: "700" },
  activityHeader: { gap: 4 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 0.9 },
  title: {
    color: "#1C4C55",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  button: {
    minHeight: 50,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 15, fontWeight: "800" },
  subtleButton: { minHeight: 44 },
  subtleText: { fontSize: 14, fontWeight: "700" },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipText: { color: COLORS.ink, fontSize: 13, fontWeight: "600" },
  rating: { gap: 10 },
  ratingRow: { flexDirection: "row", justifyContent: "space-between", gap: 6, paddingTop: 8 },
  ratingOption: {
    flex: 1,
    maxWidth: 56,
    aspectRatio: 1,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  ratingValue: { fontSize: 18, fontWeight: "800" },
  timer: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  timerLarge: { fontSize: 68, letterSpacing: -1.5 },
  questionCard: { gap: 12 },
  questionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  stepLabel: { flexShrink: 1, fontSize: 11, fontWeight: "800", letterSpacing: 0.9 },
  question: { color: COLORS.ink, fontSize: 19, fontWeight: "800", lineHeight: 25 },
  completion: { alignItems: "center", gap: 14, paddingVertical: 26 },
  completionBadge: {
    minWidth: 72,
    height: 72,
    paddingHorizontal: 16,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  completionBadgeText: { fontSize: 28, fontWeight: "800" },
  completionTitle: { color: COLORS.ink, fontSize: 21, fontWeight: "800", textAlign: "center" },
  completionActions: { alignSelf: "stretch", gap: 10, marginTop: 6 },
});
