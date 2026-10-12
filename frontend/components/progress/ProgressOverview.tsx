import { Pressable, StyleSheet, Text, View } from "react-native";

import { mentalStyles } from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { AssessmentComparison } from "./AssessmentComparison";
import { formatNumber, Trend } from "./progressMath";
import { bodySummary, mindSummary, ProgressContext, recentActivities } from "./progressSummary";
import {
  AREAS,
  DemoTag,
  progressStyles,
  RecentList,
  SectionCard,
  TrendText,
  useInteraction,
} from "./ProgressUI";
import type { ProgressArea } from "./types";

type SummaryRow = { label: string; value: string; trend: Trend; unit?: string; decimals?: number };

function SummaryCard({
  area,
  rows,
  ctx,
  onPress,
}: {
  area: ProgressArea;
  rows: SummaryRow[];
  ctx: ProgressContext;
  onPress: () => void;
}) {
  const meta = AREAS[area];
  const { hovered, focused, handlers } = useInteraction();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${meta.title} summary. ${rows.map((row) => `${row.label} ${row.value}`).join(". ")}`}
      accessibilityHint={`Opens ${meta.title} progress details`}
      onPress={onPress}
      {...handlers}
      style={({ pressed }) => [
        mentalStyles.card,
        styles.card,
        hovered && { borderColor: meta.color },
        focused && [styles.focused, { borderColor: meta.color }],
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: meta.color }]} />
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: meta.color }]}>{meta.title}</Text>
        <DemoTag show={ctx.data.source === "demo"} />
        <Text style={[styles.open, { color: meta.color }]}>Details ›</Text>
      </View>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <View style={styles.rowValue}>
            <Text style={styles.value}>{row.value}</Text>
            <TrendText trend={row.trend} period={ctx.period} unit={row.unit} decimals={row.decimals} />
          </View>
        </View>
      ))}
    </Pressable>
  );
}

const ratingText = (value: number | null) => (value === null ? "Not enough data yet" : `${formatNumber(value, 1)}/5`);

export function MindSummaryCard({ ctx, onPress }: { ctx: ProgressContext; onPress: () => void }) {
  const s = mindSummary(ctx);
  return (
    <SummaryCard
      area="mind"
      ctx={ctx}
      onPress={onPress}
      rows={[
        { label: "Mindfulness practice", value: `${s.practiceMinutes.value ?? 0} min`, trend: s.practiceMinutes.trend, unit: " min" },
        { label: "Present-moment awareness", value: ratingText(s.awareness.value), trend: s.awareness.trend, decimals: 1 },
        { label: "Emotion identification confidence", value: ratingText(s.emotionConfidence.value), trend: s.emotionConfidence.trend, decimals: 1 },
        { label: "Perceived focus", value: ratingText(s.perceivedFocus.value), trend: s.perceivedFocus.trend, decimals: 1 },
      ]}
    />
  );
}

export function BodySummaryCard({ ctx, onPress }: { ctx: ProgressContext; onPress: () => void }) {
  const s = bodySummary(ctx);
  const countRow = (label: string, metric: { value: number | null; trend: Trend }): SummaryRow => ({
    label,
    value: `${metric.value ?? 0}`,
    trend: metric.trend,
  });
  return (
    <SummaryCard
      area="body"
      ctx={ctx}
      onPress={onPress}
      rows={[
        countRow("Hydration check-ins", s.hydrationCheckins),
        countRow("Balanced Plate activities", s.plates),
        countRow("Movement and stretching", s.movementSessions),
        countRow("Sleep logs and bedtime routines", s.sleepAndRoutines),
      ]}
    />
  );
}

export function ProgressOverview({
  ctx,
  onSelect,
}: {
  ctx: ProgressContext;
  onSelect: (area: ProgressArea) => void;
}) {
  const isDemo = ctx.data.source === "demo";
  return (
    <View style={progressStyles.stack}>
      <MindSummaryCard ctx={ctx} onPress={() => onSelect("mind")} />
      <BodySummaryCard ctx={ctx} onPress={() => onSelect("body")} />
      <SectionCard eyebrow="Recently" title="Recent activities" color={COLORS.teal}>
        <RecentList items={recentActivities(ctx.data, 5)} today={ctx.today} />
      </SectionCard>
      <SectionCard eyebrow="Check-ins" title="Assessment changes" color={COLORS.mind}>
        <AssessmentComparison assessments={ctx.data.assessments} color={COLORS.mind} isDemo={isDemo} compact />
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10, paddingLeft: 22, overflow: "hidden", borderWidth: 1.5 },
  focused: { borderWidth: 2.5 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  accent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 19, fontWeight: "800" },
  open: { marginLeft: "auto", fontSize: 13, fontWeight: "700" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  rowLabel: { flex: 1, color: COLORS.ink, fontSize: 13, lineHeight: 18 },
  rowValue: { alignItems: "flex-end", maxWidth: "52%" },
  value: { color: COLORS.ink, fontSize: 15, fontWeight: "800", textAlign: "right" },
});
