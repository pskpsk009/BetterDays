import { StyleSheet, Text, View } from "react-native";

import { mentalStyles } from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { daysBetween, shortDate } from "./progressMath";
import { BarRow, DemoTag, EmptyState, GentleNote } from "./ProgressUI";
import type { Assessment } from "./types";

const METRICS: {
  key: "awareness" | "emotionConfidence" | "perceivedFocus" | "focusMinutes";
  label: string;
  unit: "rating" | "minutes";
}[] = [
  { key: "awareness", label: "Present-moment awareness", unit: "rating" },
  { key: "emotionConfidence", label: "Emotion identification confidence", unit: "rating" },
  { key: "perceivedFocus", label: "Perceived focus", unit: "rating" },
  { key: "focusMinutes", label: "Focus-session duration", unit: "minutes" },
];

function formatValue(value: number, unit: "rating" | "minutes") {
  return unit === "rating" ? `${value}/5` : `${value} min`;
}

/**
 * Compares the first (baseline) check-point with the most recent follow-up.
 * Each assessment repeats the same questions on the same 1-5 scale.
 */
export function AssessmentComparison({
  assessments,
  color,
  isDemo,
  compact = false,
}: {
  assessments: Assessment[];
  color: string;
  isDemo: boolean;
  compact?: boolean;
}) {
  const sorted = [...assessments].sort((a, b) => (a.date < b.date ? -1 : 1));
  const baseline = sorted[0];
  const latest = sorted[sorted.length - 1];

  if (!baseline) {
    return (
      <EmptyState
        compact={compact}
        message="Complete a few activities to start seeing your trends. A short check-in now and again after 2 or 4 weeks will appear here."
      />
    );
  }
  if (sorted.length < 2) {
    return (
      <EmptyState
        compact={compact}
        title="Baseline saved"
        message="A follow-up check-in after 2 or 4 weeks will show a before-and-after comparison here."
      />
    );
  }

  const weeks = Math.round(daysBetween(baseline.date, latest.date) / 7);
  const maxMinutes = Math.max(baseline.focusMinutes, latest.focusMinutes);

  return (
    <View style={styles.wrap}>
      {isDemo && (
        <View style={styles.demoRow}>
          <DemoTag />
          <Text style={styles.demoText}>Demo data — not your actual results.</Text>
        </View>
      )}
      {!compact && (
      <View style={styles.legend} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: color, opacity: 0.4 }]} />
          <Text style={mentalStyles.muted}>
            {baseline.label} · {shortDate(baseline.date)}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: color }]} />
          <Text style={mentalStyles.muted}>
            {latest.label} · {shortDate(latest.date)}
          </Text>
        </View>
      </View>
      )}

      {METRICS.map((metric) => {
        const before = baseline[metric.key];
        const after = latest[metric.key];
        const max = metric.unit === "rating" ? 5 : maxMinutes;
        return (
          <View key={metric.key} style={styles.metric}>
            <Text style={styles.metricLabel}>
              {metric.label}: {formatValue(before, metric.unit)} → {formatValue(after, metric.unit)}
            </Text>
            {!compact && (
              <>
                <BarRow label={baseline.label} value={before} max={max} color={color} faded valueText={formatValue(before, metric.unit)} />
                <BarRow label={latest.label} value={after} max={max} color={color} valueText={formatValue(after, metric.unit)} />
              </>
            )}
          </View>
        );
      })}

      <GentleNote>
        {`These are self-ratings from check-ins ${weeks > 0 ? `about ${weeks} weeks apart` : "taken recently"}. Ratings naturally rise and fall, and a change here is a reflection prompt, not a measure of health or proof of improvement.`}
      </GentleNote>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  demoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  demoText: { color: "#6B5524", fontSize: 12, fontWeight: "700", flexShrink: 1 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 12, height: 12, borderRadius: 3 },
  metric: { gap: 6 },
  metricLabel: { color: COLORS.ink, fontSize: 13, fontWeight: "700" },
});
