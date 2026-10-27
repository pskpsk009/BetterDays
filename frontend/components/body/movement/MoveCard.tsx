import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { AppIcon } from "../../common/AppIcon";
import { mentalStyles } from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { Move, PAIN_REMINDER } from "./moves";

/** Illustrated card for one movement; slides in when `stepKey` changes. */
export function MoveCard({
  move,
  stepLabel,
  extra,
  color,
  soft,
  stepKey,
  children,
}: {
  move: Move;
  stepLabel: string;
  extra?: string;
  color: string;
  soft: string;
  stepKey: string | number;
  children?: React.ReactNode;
}) {
  return (
    <Animated.View
      key={stepKey}
      entering={FadeInRight.duration(240)}
      style={[mentalStyles.card, styles.card]}
    >
      <View style={styles.top}>
        <Text accessibilityLiveRegion="polite" style={[styles.stepLabel, { color }]}>
          {stepLabel.toUpperCase()}
        </Text>
        {extra && <Text style={mentalStyles.muted}>{extra}</Text>}
      </View>
      <View style={[styles.illustration, { backgroundColor: soft }]}>
        <AppIcon name={move.icon} size={56} color={color} />
      </View>
      <Text accessibilityRole="header" style={styles.name}>
        {move.name}
      </Text>
      <View style={[styles.start, { borderColor: color }]}>
        <Text style={[mentalStyles.label, { color }]}>STARTING POSITION</Text>
        <Text style={mentalStyles.body}>{move.start}</Text>
      </View>
      {move.steps.map((step, index) => (
        <View key={step} style={styles.stepRow}>
          <Text style={[styles.stepNumber, { color, backgroundColor: soft }]}>{index + 1}</Text>
          <Text style={[mentalStyles.body, styles.flex]}>{step}</Text>
        </View>
      ))}
      {children}
    </Animated.View>
  );
}

export function PainReminder() {
  return (
    <View style={styles.reminder}>
      <Text style={styles.reminderText}><AppIcon name="alert-outline" size={13} color="#6B4A00" /> {PAIN_REMINDER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 12 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  stepLabel: { flexShrink: 1, fontSize: 11, fontWeight: "800", letterSpacing: 0.9 },
  illustration: {
    alignSelf: "center",
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { color: COLORS.ink, fontSize: 21, fontWeight: "800", textAlign: "center" },
  start: { borderLeftWidth: 3, paddingLeft: 12, gap: 3 },
  stepRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 12,
    fontWeight: "800",
  },
  reminder: { padding: 12, borderRadius: 14, backgroundColor: "#FFF4DE" },
  reminderText: { color: "#6B4A00", fontSize: 12, lineHeight: 18 },
});
