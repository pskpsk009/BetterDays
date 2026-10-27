import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon } from "../common/AppIcon";
import { mentalStyles, SelectionChip } from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { formatNumber, PeriodId, PERIODS, relativeDay, Trend } from "./progressMath";
import type { RecentActivity } from "./progressSummary";
import type { DateKey, ProgressArea } from "./types";

// Shared presentation pieces for the Progress page.

export const AREAS: Record<ProgressArea, { title: string; color: string; soft: string }> = {
  mind: { title: "Mind", color: COLORS.mind, soft: COLORS.mindSoft },
  body: { title: "Body", color: COLORS.teal, soft: COLORS.tealSoft },
};

/** Hover and keyboard-focus state for a Pressable (web reports both; native mostly neither). */
export function useInteraction() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  return {
    hovered,
    focused,
    handlers: {
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
  };
}

export function DemoNotice({
  mode,
  onChange,
}: {
  mode: "demo" | "preview";
  onChange: (mode: "demo" | "preview") => void;
}) {
  return (
    <View style={styles.notice} accessibilityRole="summary">
      <Text style={styles.noticeTitle}>
        {mode === "demo" ? "Demo data, not your actual results" : "Preview: a brand-new account"}
      </Text>
      <Text style={mentalStyles.muted}>
        {mode === "demo"
          ? "These figures are sample values that show how this page works. Your own activity isn't saved or shown here yet."
          : "This is how the page looks before any activities are recorded."}
      </Text>
      <View style={mentalStyles.chips} accessibilityLabel="Choose what to preview">
        <SelectionChip
          label="Demo data"
          color={COLORS.teal}
          selected={mode === "demo"}
          onPress={() => onChange("demo")}
        />
        <SelectionChip
          label="Empty view"
          color={COLORS.teal}
          selected={mode === "preview"}
          onPress={() => onChange("preview")}
        />
      </View>
    </View>
  );
}

export function PeriodSelector({
  value,
  onChange,
}: {
  value: PeriodId;
  onChange: (period: PeriodId) => void;
}) {
  return (
    <View style={styles.periodRow} accessibilityLabel="Time period">
      {PERIODS.map((period) => (
        <SelectionChip
          key={period.id}
          label={period.label}
          color={COLORS.teal}
          selected={value === period.id}
          onPress={() => onChange(period.id)}
        />
      ))}
    </View>
  );
}

export function periodPhrase(period: PeriodId): string {
  return period === "7d" ? "the last 7 days" : period === "4w" ? "the last 4 weeks" : "all time";
}

export function DemoTag({ show = true }: { show?: boolean }) {
  if (!show) return null;
  return (
    <View style={styles.demoTag}>
      <Text style={styles.demoTagText}>DEMO</Text>
    </View>
  );
}

/** Neutral change from the previous period: never colored as good or bad. */
export function TrendText({
  trend,
  period,
  unit = "",
  decimals = 0,
}: {
  trend: Trend;
  period: PeriodId;
  unit?: string;
  decimals?: number;
}) {
  if (!trend) return null;
  const previous = period === "7d" ? "previous 7 days" : "previous 4 weeks";
  const size = formatNumber(Math.abs(trend.delta), decimals);
  const text =
    size === formatNumber(0, decimals)
      ? `Similar to the ${previous}`
      : `${trend.delta > 0 ? "↑" : "↓"} ${size}${unit} vs ${previous}`;
  return <Text style={styles.trend}>{text}</Text>;
}

export type MetricSource = "Self-rated" | "Activity log" | "Calculated";

export function MetricTile({
  label,
  value,
  detail,
  source,
  color,
  children,
}: {
  label: string;
  value: string;
  detail?: string;
  source: MetricSource;
  color: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${label}: ${value}. ${detail ?? ""} ${source}.`}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={[styles.tileValue, { color }]}>{value}</Text>
      {detail ? <Text style={mentalStyles.muted}>{detail}</Text> : null}
      {children}
      <Text style={styles.tileSource}>{source}</Text>
    </View>
  );
}

export function MetricGrid({ children }: { children: React.ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

export function SectionCard({
  eyebrow,
  title,
  color,
  icon,
  children,
}: {
  eyebrow?: string;
  title: string;
  color: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={[mentalStyles.card, styles.section]}>
      <View style={styles.sectionHeader}>
        {icon}
        <View style={styles.flex}>
          {eyebrow ? <Text style={[styles.eyebrow, { color }]}>{eyebrow.toUpperCase()}</Text> : null}
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            {title}
          </Text>
        </View>
      </View>
      {children}
    </View>
  );
}

export function SubHeading({ children }: { children: string }) {
  return <Text style={styles.subHeading}>{children}</Text>;
}

/** Collapsible plain-language explanations of each metric. */
export function MetricExplainer({
  color,
  items,
}: {
  color: string;
  items: { term: string; text: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.explainer}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        hitSlop={6}
        style={({ pressed }) => [styles.explainerToggle, pressed && styles.pressed]}
      >
        <Text style={[styles.explainerToggleText, { color }]}>
          {open ? "Hide" : "What do these mean?"} {open ? "▴" : "▾"}
        </Text>
      </Pressable>
      {open &&
        items.map((item) => (
          <Text key={item.term} style={mentalStyles.muted}>
            <Text style={styles.term}>{item.term}: </Text>
            {item.text}
          </Text>
        ))}
    </View>
  );
}

export function GentleNote({ children }: { children: string }) {
  return <Text style={styles.note}>{children}</Text>;
}

export function EmptyState({
  title = "Not enough data yet",
  message = "Complete a few activities to start seeing your trends.",
  compact = false,
}: {
  title?: string;
  message?: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.empty, compact && styles.emptyCompact]} accessible accessibilityLabel={`${title}. ${message}`}>
      <AppIcon name="sprout-outline" size={24} color={COLORS.teal} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={[mentalStyles.muted, styles.center]}>{message}</Text>
    </View>
  );
}

/** Horizontal bar for counts or rates; the value text sits outside the color. */
export function BarRow({
  label,
  value,
  max,
  color,
  valueText,
  faded = false,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  valueText: string;
  faded?: boolean;
}) {
  const share = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <View style={styles.barRow} accessible accessibilityLabel={`${label}: ${valueText}`}>
      <View style={styles.barLabels}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{valueText}</Text>
      </View>
      <View style={styles.barTrack}>
        {share > 0 && (
          <View
            style={[
              styles.barFill,
              { width: `${share * 100}%`, backgroundColor: color, opacity: faded ? 0.4 : 1 },
            ]}
          />
        )}
      </View>
    </View>
  );
}

export function RecentList({ items, today }: { items: RecentActivity[]; today: DateKey }) {
  if (items.length === 0) {
    return <EmptyState compact message="Activities you complete will appear here." />;
  }
  return (
    <View style={styles.recent}>
      {items.map((item) => (
        <View key={item.key} style={styles.recentRow}>
          <View style={[styles.recentDot, { backgroundColor: AREAS[item.area].color }]} />
          <Text style={[styles.recentTitle, styles.flex]}>
            {item.title}
            {item.count > 1 ? <Text style={styles.recentArea}> ×{item.count}</Text> : null}
          </Text>
          <Text style={styles.recentArea}>{AREAS[item.area].title}</Text>
          <Text style={styles.recentDate}>{relativeDay(item.date, today)}</Text>
        </View>
      ))}
    </View>
  );
}

export function BackToOverview({ color, soft, onPress }: { color: string; soft: string; onPress: () => void }) {
  const { focused, handlers } = useInteraction();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to Overview"
      hitSlop={6}
      onPress={onPress}
      {...handlers}
      style={({ pressed }) => [
        styles.backButton,
        { backgroundColor: soft },
        focused && { borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.backText, { color }]}>‹ Back to Overview</Text>
    </Pressable>
  );
}

export const progressStyles = StyleSheet.create({
  stack: { gap: 14 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: "center" },
  pressed: { opacity: 0.78 },
  notice: {
    gap: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C9B98F",
    backgroundColor: "#FFF9EA",
  },
  noticeTitle: { color: "#6B5524", fontSize: 13, fontWeight: "800" },
  periodRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  demoTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "#FFF1CC",
  },
  demoTagText: { color: "#6B5524", fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  trend: { color: COLORS.muted, fontSize: 11, lineHeight: 15 },
  tile: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: 140,
    gap: 3,
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.background,
  },
  tileLabel: { color: COLORS.muted, fontSize: 12, fontWeight: "700" },
  tileValue: { fontSize: 22, fontWeight: "800", letterSpacing: -0.4 },
  tileSource: {
    marginTop: 2,
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    opacity: 0.8,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  section: { gap: 14 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 0.9, marginBottom: 2 },
  sectionTitle: { color: COLORS.ink, fontSize: 19, fontWeight: "800" },
  subHeading: { color: COLORS.ink, fontSize: 13, fontWeight: "800", marginBottom: -4 },
  explainer: { gap: 6 },
  explainerToggle: { alignSelf: "flex-start", minHeight: 32, justifyContent: "center" },
  explainerToggleText: { fontSize: 13, fontWeight: "700" },
  term: { color: COLORS.ink, fontWeight: "700" },
  note: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  empty: {
    alignItems: "center",
    gap: 4,
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: COLORS.background,
  },
  emptyCompact: { paddingVertical: 14 },
  emptyTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "800" },
  barRow: { gap: 5 },
  barLabels: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  barLabel: { color: COLORS.ink, fontSize: 13, flexShrink: 1 },
  barValue: { color: COLORS.ink, fontSize: 13, fontWeight: "700", fontVariant: ["tabular-nums"] },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: "#EAF1EF", overflow: "hidden" },
  barFill: { height: 8, borderRadius: 4 },
  recent: { gap: 2 },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  recentDot: { width: 8, height: 8, borderRadius: 4 },
  recentTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "600" },
  recentArea: { color: COLORS.muted, fontSize: 11, fontWeight: "700" },
  recentDate: { minWidth: 70, textAlign: "right", color: COLORS.muted, fontSize: 11 },
  backButton: {
    minHeight: 40,
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 13,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  backText: { fontSize: 13, fontWeight: "700" },
});
