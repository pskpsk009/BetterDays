import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ActivityProps, mentalStyles, SecondaryButton, SelectionChip } from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { NIGHT, NightBanner } from "./NightBanner";
import { ClockTime, formatDuration, formatTime, gradualSchedule, shortestShift } from "./sleepMath";
import { TimeField } from "./TimeField";

const PACES = [15, 30];
const MAX_SHOWN_STEPS = 8;

const PRINCIPLES = [
  {
    icon: "⏰",
    title: "Anchor your wake-up time",
    body: "A consistent wake-up time, even on days off where possible, does a lot of the work of setting your body clock.",
  },
  {
    icon: "☀️",
    title: "Get morning light",
    body: "Daylight soon after waking helps your body clock shift earlier. A few minutes outside or near a window helps.",
  },
  {
    icon: "😴",
    title: "Leave room for enough sleep",
    body: "Plan a sleep window that gives you enough rest. Many adults need around 7–9 hours, and teenagers often more.",
  },
  {
    icon: "🐢",
    title: "Go at your own pace",
    body: "Move when it feels manageable. If a step feels hard, stay there for a few more nights before moving again.",
  },
  {
    icon: "🌍",
    title: "Your schedule is yours",
    body: "There's no single right bedtime. Shift work, study, family, and natural night-owl or early-bird tendencies all differ.",
  },
];

export function ScheduleGuidance({ color, soft, onExit }: ActivityProps) {
  const [current, setCurrent] = useState<ClockTime>({ hour: 2, minute: 0 });
  const [preferred, setPreferred] = useState<ClockTime>({ hour: 0, minute: 0 });
  const [pace, setPace] = useState(30);

  const shift = shortestShift(current, preferred);
  const steps = gradualSchedule(current, preferred, pace);
  const shown = steps.slice(0, MAX_SHOWN_STEPS);
  const hidden = steps.length - shown.length;

  return (
    <View style={mentalStyles.screen}>
      <NightBanner
        eyebrow="Good Night Sleep"
        title="Sleep Schedule Guidance"
        subtitle="Small, steady shifts tend to stick better than big jumps."
      />
      <Text style={mentalStyles.body}>
        Try it with your own times. Tap a time to change it with the clock
        picker.
      </Text>
      <TimeField label="Current bedtime" value={current} onChange={setCurrent} color={color} soft={soft} />
      <TimeField label="Preferred bedtime" value={preferred} onChange={setPreferred} color={color} soft={soft} />

      <Text style={mentalStyles.label}>SHIFT EACH STEP BY</Text>
      <View style={mentalStyles.chips}>
        {PACES.map((option) => (
          <SelectionChip
            key={option}
            label={`${option} min`}
            color={color}
            selected={option === pace}
            onPress={() => setPace(option)}
          />
        ))}
      </View>

      <Animated.View
        key={`${formatTime(current)}-${formatTime(preferred)}-${pace}`}
        entering={FadeIn.duration(220)}
        style={styles.timeline}
      >
        {shift === 0 ? (
          <Text style={styles.nightText}>
            You&apos;re already at your preferred bedtime. Keeping it steady is the goal now.
          </Text>
        ) : (
          <>
            <Text style={styles.nightMuted}>
              {formatDuration(Math.abs(shift))} {shift < 0 ? "earlier" : "later"} in total ·{" "}
              {steps.length} step{steps.length === 1 ? "" : "s"}
            </Text>
            <TimelineRow icon="🌙" label="Current bedtime" time={current} first />
            {shown.map((step, index) => (
              <TimelineRow
                key={`${formatTime(step)}-${index}`}
                icon={index === steps.length - 1 ? "⭐" : "✦"}
                label={
                  index === steps.length - 1
                    ? "Preferred bedtime"
                    : index === 0
                      ? "Initial target"
                      : "Next target"
                }
                time={step}
              />
            ))}
            {hidden > 0 && (
              <Text style={styles.nightMuted}>
                …and {hidden} more step{hidden === 1 ? "" : "s"}. Continue adjusting
                gradually toward your preferred time.
              </Text>
            )}
          </>
        )}
      </Animated.View>
      <Text style={[mentalStyles.muted, styles.center]}>
        Stay at each step for a few nights, or longer if you need. The pace is
        flexible.
      </Text>

      <Text style={mentalStyles.label}>WHAT HELPS</Text>
      {PRINCIPLES.map((item) => (
        <View key={item.title} style={[styles.principle, { backgroundColor: soft }]}>
          <Text style={styles.principleTitle}>
            {item.icon} {item.title}
          </Text>
          <Text style={mentalStyles.body}>{item.body}</Text>
        </View>
      ))}
      <SecondaryButton label="Back to Good Night Sleep" color={color} onPress={onExit} />
    </View>
  );
}

function TimelineRow({
  icon,
  label,
  time,
  first = false,
}: {
  icon: string;
  label: string;
  time: ClockTime;
  first?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        {!first && <View style={styles.railLine} />}
        <Text style={styles.railIcon}>{icon}</Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.nightMuted}>{label}</Text>
        <Text style={styles.rowTime}>{formatTime(time)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  timeline: { padding: 18, borderRadius: 22, backgroundColor: NIGHT.deep, gap: 4 },
  nightText: { color: NIGHT.text, fontSize: 15, lineHeight: 22 },
  nightMuted: { color: NIGHT.muted, fontSize: 12, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 50 },
  rail: { width: 30, alignItems: "center", justifyContent: "center", alignSelf: "stretch" },
  railLine: {
    position: "absolute",
    top: -8,
    height: 18,
    width: 2,
    backgroundColor: NIGHT.lavender,
    opacity: 0.6,
  },
  railIcon: { color: "#F6EFC8", fontSize: 18 },
  rowCopy: { flex: 1 },
  rowTime: { color: NIGHT.text, fontSize: 18, fontWeight: "800", fontVariant: ["tabular-nums"] },
  principle: { padding: 16, borderRadius: 16, gap: 6 },
  principleTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "800" },
});
