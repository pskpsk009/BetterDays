import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

import {
  ActivityHeader,
  ActivityProps,
  mentalStyles,
  PrimaryButton,
  SavedOnDeviceNote,
  SecondaryButton,
  SelectionChip,
  toggleItem,
} from "../common/ActivityUI";
import { AppIcon, IconName } from "../common/AppIcon";
import { COLORS } from "../common/AppShell";
import { ChoiceExplorer, ChoiceGroup, ChoiceOption } from "../common/GuidedActivities";
import { DayKey, daysBetween, monthName, todayKey, useStoredState } from "../common/localStore";

// Values Compass: choose the values that matter most, then check in on them,
// use them to weigh a decision, and revisit them as they change. There is no
// score: brighter points only show which values you've acted on lately.

const BRANCH = "Purpose in Life";
const TITLE = "Values Compass";

/** How many recent days the compass glow looks back over. */
const GLOW_DAYS = 14;
/** Check-ins older than this are dropped, so only recent days are kept. */
const KEEP_DAYS = 30;
const REVISIT_DAYS = 90;

const VALUE_GROUPS: ChoiceGroup[] = [
  {
    title: "Connection",
    options: [
      { label: "Family", icon: "home-heart", note: "Being there for the people closest to you." },
      { label: "Friendship", icon: "handshake-outline", note: "Building and keeping meaningful friendships." },
      { label: "Kindness", icon: "heart-outline", note: "Treating others and yourself with care." },
      { label: "Community", icon: "earth", note: "Being part of something bigger than yourself." },
    ],
  },
  {
    title: "Growth",
    options: [
      { label: "Learning", icon: "book-open-variant", note: "Staying curious and building knowledge." },
      { label: "Creativity", icon: "palette-outline", note: "Expressing yourself and making new things." },
      { label: "Achievement", icon: "medal-outline", note: "Working toward goals you care about." },
      { label: "Adventure", icon: "compass-outline", note: "Trying new experiences." },
    ],
  },
  {
    title: "Way of living",
    options: [
      { label: "Health", icon: "leaf", note: "Looking after your body and mind." },
      { label: "Honesty", icon: "eye-check-outline", note: "Being truthful with yourself and others." },
      { label: "Independence", icon: "butterfly-outline", note: "Making your own choices." },
      { label: "Fun", icon: "balloon", note: "Making room for play and enjoyment." },
      { label: "Fairness", icon: "scale-balance", note: "Standing up for what's right." },
      { label: "Calm", icon: "waves", note: "Peace and balance in daily life." },
    ],
  },
];

type Compass = {
  values: ChoiceOption[];
  chosenOn: DayKey;
  /** Values acted on, per day, for the last KEEP_DAYS days only. */
  checkins: Record<DayKey, string[]>;
};

type Fit = "good" | "neutral" | "poor";

const SIZE = 290;
const RADIUS = 108;
const POINT = 52;

export function ValuesCompass({ color, soft, onExit }: ActivityProps) {
  const [compass, setCompass, clearCompass] = useStoredState<Compass | null>("values-compass", null);
  const [stage, setStage] = useState<"pick" | "compass" | "decide">(compass ? "compass" : "pick");

  const header = <ActivityHeader eyebrow={BRANCH} title={TITLE} color={color} />;
  const exit = <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />;
  const today = todayKey();

  if (stage === "pick" || !compass) {
    return (
      <ChoiceExplorer
        color={color}
        soft={soft}
        onExit={compass ? () => setStage("compass") : onExit}
        branch={BRANCH}
        title={TITLE}
        intro="Values are what matter to you, the direction you'd like to head in. Pick up to five that feel most like you right now."
        pickLabel="Your values"
        maxPicks={5}
        groups={VALUE_GROUPS}
        initialPicks={compass?.values.map((value) => ({ ...value, icon: iconOf(value) }))}
        customPlaceholder="Add a value of your own…"
        customNote="A value that's personal to you."
        resultTitle="Your compass"
        resultIntro="These values can guide everyday choices, big and small. They may shift over time, and that's okay."
        completeLabel="Save my compass"
        onComplete={(values) => {
          setCompass({ values, chosenOn: today, checkins: compass?.checkins ?? {} });
          setStage("compass");
        }}
        completion={{ badge: "compass-outline", title: "Compass set", message: "" }}
      />
    );
  }

  if (stage === "decide") {
    return <DecisionHelper values={compass.values} color={color} soft={soft} onBack={() => setStage("compass")} />;
  }

  const todays = compass.checkins[today] ?? [];
  const recentDays = Object.keys(compass.checkins).filter((day) => daysBetween(day, today) < GLOW_DAYS);
  const glow = (label: string) =>
    Math.min(1, recentDays.filter((day) => compass.checkins[day].includes(label)).length / (GLOW_DAYS / 2));
  const needsRevisit = daysBetween(compass.chosenOn, today) >= REVISIT_DAYS;

  function toggleToday(label: string) {
    setCompass((current) => {
      if (!current) return current;
      const kept = Object.fromEntries(
        Object.entries(current.checkins).filter(([day]) => daysBetween(day, today) < KEEP_DAYS),
      );
      kept[today] = toggleItem(kept[today] ?? [], label);
      return { ...current, checkins: kept };
    });
  }

  return (
    <View style={mentalStyles.screen}>
      {header}

      {needsRevisit && (
        <View style={[styles.banner, { backgroundColor: soft }]}>
          <Text style={mentalStyles.body}>
            In {monthName(compass.chosenOn)} you chose these values. Do they still feel right?
          </Text>
          <View style={mentalStyles.row}>
            <SecondaryButton
              flex
              label="Still right"
              color={color}
              onPress={() => setCompass({ ...compass, chosenOn: today })}
            />
            <PrimaryButton flex label="Update them" color={color} onPress={() => setStage("pick")} />
          </View>
        </View>
      )}

      <View style={styles.compassWrap} accessibilityLabel="Your values compass">
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS + 24} fill={soft} />
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={2} />
            {compass.values.map((value, index) => {
              const angle = ((index / compass.values.length) * 360 - 90) * (Math.PI / 180);
              return (
                <Line
                  key={value.label}
                  x1={SIZE / 2}
                  y1={SIZE / 2}
                  x2={SIZE / 2 + RADIUS * Math.cos(angle)}
                  y2={SIZE / 2 + RADIUS * Math.sin(angle)}
                  stroke={color}
                  strokeOpacity={0.15 + glow(value.label) * 0.6}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              );
            })}
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={10} fill={color} />
          </Svg>
          {compass.values.map((value, index) => {
            const angle = ((index / compass.values.length) * 360 - 90) * (Math.PI / 180);
            const x = SIZE / 2 + RADIUS * Math.cos(angle);
            const y = SIZE / 2 + RADIUS * Math.sin(angle);
            const level = glow(value.label);
            return (
              <View key={value.label} style={[styles.pointSlot, { left: x - 40, top: y - POINT / 2 }]}>
                <View
                  style={[
                    styles.point,
                    { borderColor: color, backgroundColor: COLORS.white },
                    level > 0 && { shadowColor: color, shadowOpacity: 0.25 + level * 0.5, shadowRadius: 4 + level * 10, elevation: 2 + level * 6 },
                  ]}
                >
                  <View style={[StyleSheet.absoluteFill, styles.pointFill, { backgroundColor: color, opacity: level * 0.35 }]} />
                  <AppIcon name={iconOf(value)} size={22} color={COLORS.ink} />
                </View>
                <Text numberOfLines={1} style={styles.pointLabel}>
                  {value.label}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={[mentalStyles.muted, styles.center]}>
          Points glow brighter the more you&apos;ve lived by them over the last two weeks.
        </Text>
      </View>

      <View style={[mentalStyles.card, styles.panel]}>
        <Text style={styles.panelTitle}>Did you live by any of these today?</Text>
        <Text style={mentalStyles.muted}>Tap the ones you acted on, even in a small way.</Text>
        <View style={mentalStyles.chips}>
          {compass.values.map((value) => (
            <SelectionChip
              key={value.label}
              icon={iconOf(value)}
              label={value.label}
              color={color}
              selected={todays.includes(value.label)}
              onPress={() => toggleToday(value.label)}
            />
          ))}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => setStage("decide")}
        style={({ pressed }) => [mentalStyles.card, styles.decide, pressed && styles.pressed]}
      >
        <AppIcon name="scale-balance" size={28} color={color} />
        <View style={styles.decideCopy}>
          <Text style={[styles.panelTitle, { color }]}>Stuck on a choice?</Text>
          <Text style={mentalStyles.muted}>Compare two options against your values.</Text>
        </View>
        <Text style={[styles.chevron, { color }]}>›</Text>
      </Pressable>

      <SecondaryButton label="Change my values" color={color} onPress={() => setStage("pick")} />
      <SavedOnDeviceNote
        what="values compass"
        onDelete={() => {
          clearCompass();
          setStage("pick");
        }}
      />
      {exit}
    </View>
  );
}

// Values saved by an older version may still hold an emoji, so look the icon up by label.
const ICON_BY_LABEL = new Map(VALUE_GROUPS.flatMap((group) => group.options.map((option) => [option.label, option.icon])));

function iconOf(value: ChoiceOption) {
  return ICON_BY_LABEL.get(value.label) ?? value.icon;
}

const FITS: { id: Fit; icon: IconName; label: string }[] = [
  { id: "good", icon: "thumb-up-outline", label: "fits well" },
  { id: "neutral", icon: "minus", label: "neutral" },
  { id: "poor", icon: "thumb-down-outline", label: "doesn't fit" },
];

function DecisionHelper({
  values,
  color,
  soft,
  onBack,
}: {
  values: ChoiceOption[];
  color: string;
  soft: string;
  onBack: () => void;
}) {
  const [options, setOptions] = useState(["", ""]);
  const [fits, setFits] = useState<Record<string, Fit>>({});

  const names = options.map((option, index) => option.trim() || `Option ${index === 0 ? "A" : "B"}`);
  const ready = options.every((option) => option.trim());
  const count = (side: number, fit: Fit) => values.filter((value) => fits[`${side}:${value.label}`] === fit).length;
  const rated = Object.keys(fits).length > 0;

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow={TITLE} title="Stuck on a choice?" color={color} />
      <Text style={mentalStyles.body}>
        Write the two options you&apos;re deciding between, then think about how each one fits your values.
      </Text>
      {options.map((option, index) => (
        <TextInput
          key={index}
          accessibilityLabel={`Option ${index === 0 ? "A" : "B"}`}
          value={option}
          onChangeText={(text) => setOptions(options.map((value, i) => (i === index ? text : value)))}
          placeholder={index === 0 ? "Option A, e.g. join the club" : "Option B, e.g. keep my evenings free"}
          placeholderTextColor={COLORS.muted}
          style={mentalStyles.input}
        />
      ))}

      {ready &&
        values.map((value) => (
          <View key={value.label} style={[mentalStyles.card, styles.panel]}>
            <Text style={styles.panelTitle}>
              <AppIcon name={iconOf(value)} size={17} color={color} /> {value.label}
            </Text>
            {[0, 1].map((side) => (
              <View key={side} style={styles.fitRow}>
                <Text numberOfLines={1} style={styles.fitName}>
                  {names[side]}
                </Text>
                <View style={styles.fitChips}>
                  {FITS.map((fit) => {
                    const key = `${side}:${value.label}`;
                    const selected = fits[key] === fit.id;
                    return (
                      <Pressable
                        key={fit.id}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                        accessibilityLabel={`${names[side]} ${fit.label} with ${value.label}`}
                        onPress={() => setFits({ ...fits, [key]: fit.id })}
                        style={[styles.fit, selected && { backgroundColor: soft, borderColor: color }]}
                      >
                        <AppIcon name={fit.icon} size={18} color={selected ? color : COLORS.ink} />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        ))}

      {ready && rated && (
        <View style={[styles.banner, { backgroundColor: soft }]}>
          <View style={styles.summaryRow}>
            {[0, 1].map((side) => (
              <View key={side} style={styles.summaryCol}>
                <Text numberOfLines={2} style={styles.panelTitle}>
                  {names[side]}
                </Text>
                <Text style={mentalStyles.body}><AppIcon name="thumb-up-outline" size={15} color={color} /> {count(side, "good")} · <AppIcon name="thumb-down-outline" size={15} color={color} /> {count(side, "poor")}</Text>
              </View>
            ))}
          </View>
          <Text style={mentalStyles.muted}>
            This only shows how each option sits with what matters to you. You know your situation best, and the
            choice is yours.
          </Text>
        </View>
      )}

      <SecondaryButton label="Back to my compass" color={color} onPress={onBack} />
      <Text style={[mentalStyles.muted, styles.center]}>Your options aren&apos;t saved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.8 },
  banner: { padding: 16, borderRadius: 18, gap: 10 },
  compassWrap: { alignItems: "center", gap: 8 },
  pointSlot: { position: "absolute", width: 80, alignItems: "center" },
  point: {
    width: POINT,
    height: POINT,
    borderRadius: POINT / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pointFill: { borderRadius: POINT / 2 },
  pointLabel: { marginTop: 3, color: COLORS.ink, fontSize: 11, fontWeight: "800" },
  panel: { gap: 10 },
  panelTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "800" },
  decide: { flexDirection: "row", alignItems: "center", gap: 14 },
  decideCopy: { flex: 1, gap: 4 },
  chevron: { fontSize: 28, fontWeight: "500" },
  fitRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  fitName: { flex: 1, color: COLORS.ink, fontSize: 13, fontWeight: "700" },
  fitChips: { flexDirection: "row", gap: 6 },
  fit: {
    width: 44,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCol: { flex: 1, gap: 4 },
});
