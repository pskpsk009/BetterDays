import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";

import { AppIcon } from "../common/AppIcon";
import { COLORS } from "../common/AppShell";
import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SecondaryButton,
  SelectionChip,
} from "../common/ActivityUI";
import {
  DISRUPTORS,
  DisruptorId,
  FocusFix,
  getDisruptor,
  setFocusPlan,
  SprintResult,
  takeSprintResult,
} from "./focusPlan";

// Distraction Tracker: look back at a focus or study session, spot what
// disrupted it, and build a small plan to try in the next Focus Sprint.

const BRANCH = "Find Your Focus";
const MAX_DISRUPTORS = 3;

const SESSIONS = ["A Focus Sprint", "Studying", "Homework", "Reading", "Work or a project", "Something else"];

const OUTCOMES = [
  { id: "on-track", icon: "target", label: "Mostly on track" },
  { id: "drifted", icon: "waves", label: "Drifted a few times" },
  { id: "pulled", icon: "weather-tornado", label: "Kept getting pulled away" },
] as const;

type Outcome = (typeof OUTCOMES)[number]["id"];
type Stage = "session" | "disruptors" | "fixes" | "plan" | "clear";

export function DistractionTracker({ color, soft, onExit, openActivity }: ActivityProps) {
  // Opened from a finished sprint: start from what that sprint noted.
  const [fromSprint] = useState<SprintResult | null>(() => takeSprintResult());
  const [stage, setStage] = useState<Stage>(fromSprint ? "disruptors" : "session");
  const [session, setSession] = useState<string | null>(fromSprint ? "A Focus Sprint" : null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [picked, setPicked] = useState<DisruptorId[]>(() =>
    fromSprint ? [...new Set(fromSprint.disruptors)].slice(0, MAX_DISRUPTORS) : [],
  );
  const [fixIndex, setFixIndex] = useState(0);
  const [fixes, setFixes] = useState<FocusFix[]>([]);

  const header = <ActivityHeader eyebrow={BRANCH} title="Distraction Tracker" color={color} />;
  const exit = <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />;

  function restart() {
    setStage("session");
    setSession(null);
    setOutcome(null);
    setPicked([]);
    setFixIndex(0);
    setFixes([]);
  }

  function togglePick(id: DisruptorId) {
    if (picked.includes(id)) setPicked(picked.filter((item) => item !== id));
    else if (picked.length < MAX_DISRUPTORS) setPicked([...picked, id]);
  }

  function chooseFix(fix: string) {
    const disruptor = picked[fixIndex];
    const next = [...fixes.filter((item) => item.disruptor !== disruptor), { disruptor, fix }];
    setFixes(next);
    if (fixIndex + 1 < picked.length) setFixIndex(fixIndex + 1);
    else setStage("plan");
  }

  if (stage === "clear") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="target"
          title="Nothing got in the way"
          message="Nice. Whatever you did that session (the place, the time, the task size) is worth repeating."
          color={color}
          soft={soft}
          primary={{ label: "Look at another session", onPress: restart }}
          secondary={{ label: `Back to ${BRANCH}`, onPress: onExit }}
        />
      </View>
    );
  }

  if (stage === "plan") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Animated.View entering={FadeIn.duration(240)} style={[styles.plan, { backgroundColor: soft }]}>
          <Text style={[mentalStyles.label, { color }]}>MY FOCUS PLAN</Text>
          {fixes.map((item) => {
            const disruptor = getDisruptor(item.disruptor);
            return (
              <View key={item.disruptor} style={styles.planRow}>
                <AppIcon name={disruptor.icon} size={26} color={color} />
                <View style={styles.planCopy}>
                  <Text style={mentalStyles.muted}>If {disruptor.label.toLowerCase()} gets in the way</Text>
                  <Text style={styles.planFix}>{item.fix}</Text>
                </View>
              </View>
            );
          })}
        </Animated.View>
        <Text style={mentalStyles.body}>
          Try one session with this plan and see what changes. You can always swap a fix.
        </Text>
        {openActivity && (
          <PrimaryButton
            label="Try it in a Focus Sprint"
            color={color}
            onPress={() => {
              setFocusPlan(fixes);
              openActivity("focus-sprint");
            }}
          />
        )}
        <View style={mentalStyles.row}>
          <SecondaryButton
            flex
            label="Change fixes"
            color={color}
            onPress={() => {
              setFixIndex(0);
              setStage("fixes");
            }}
          />
          <SecondaryButton flex label="Start over" color={color} onPress={restart} />
        </View>
        {exit}
      </View>
    );
  }

  if (stage === "fixes") {
    const disruptor = getDisruptor(picked[fixIndex]);
    const chosen = fixes.find((item) => item.disruptor === disruptor.id)?.fix;
    return (
      <View style={mentalStyles.screen}>
        {header}
        <View style={styles.progressRow}>
          {picked.map((id, index) => (
            <View
              key={id}
              style={[styles.progressDot, { borderColor: color }, index <= fixIndex && { backgroundColor: color }]}
            />
          ))}
        </View>
        <Animated.View key={disruptor.id} entering={FadeInRight.duration(260)} style={[mentalStyles.card, styles.fixCard]}>
          <AppIcon name={disruptor.icon} size={40} color={color} style={styles.fixIcon} />
          <Text style={mentalStyles.label}>
            DISRUPTION {fixIndex + 1} OF {picked.length}
          </Text>
          <Text style={styles.fixTitle}>{disruptor.label}</Text>
          <Text style={mentalStyles.muted}>Pick the fix you&apos;d most like to try.</Text>
          <View style={styles.fixList}>
            {disruptor.fixes.map((fix) => (
              <Pressable
                key={fix}
                accessibilityRole="button"
                accessibilityState={{ selected: chosen === fix }}
                onPress={() => chooseFix(fix)}
                style={({ pressed }) => [
                  styles.fixOption,
                  chosen === fix && { borderColor: color, backgroundColor: soft },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.fixOptionText, chosen === fix && { color }]}>{fix}</Text>
                <Text style={[styles.chevron, { color }]}>›</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
        <SecondaryButton
          label="Back"
          color={color}
          onPress={() => (fixIndex > 0 ? setFixIndex(fixIndex - 1) : setStage("disruptors"))}
        />
      </View>
    );
  }

  if (stage === "disruptors") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        {fromSprint && (
          <View style={[styles.banner, { backgroundColor: soft }]}>
            <Text style={[mentalStyles.label, { color }]}>FROM YOUR FOCUS SPRINT</Text>
            <Text style={mentalStyles.body}>
              {fromSprint.task} · {fromSprint.minutes} min · {fromSprint.finished ? "finished" : "ended early"}
              {fromSprint.disruptors.length > 0 ? ` · pulled away ${fromSprint.disruptors.length}×` : ""}
            </Text>
          </View>
        )}
        <QuestionCard
          stepKey="disruptors"
          label={fromSprint ? "Step 1 of 2" : "Step 2 of 3"}
          question="What disrupted your focus?"
          hint={`Pick up to ${MAX_DISRUPTORS}, the ones that pulled you away the most.`}
          color={color}
        >
          <View style={styles.grid}>
            {DISRUPTORS.map((item) => {
              const selected = picked.includes(item.id);
              const full = !selected && picked.length >= MAX_DISRUPTORS;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected, disabled: full }}
                  accessibilityLabel={item.label}
                  onPress={() => togglePick(item.id)}
                  style={({ pressed }) => [
                    styles.category,
                    selected && { borderColor: color, backgroundColor: soft },
                    full && styles.dim,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppIcon name={item.icon} size={20} color={selected ? color : COLORS.ink} />
                  <Text style={[styles.categoryName, selected && { color }]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </QuestionCard>
        <PrimaryButton
          label="Find fixes"
          color={color}
          disabled={picked.length === 0}
          onPress={() => {
            setFixIndex(0);
            setStage("fixes");
          }}
        />
        <View style={mentalStyles.row}>
          {!fromSprint && <SecondaryButton flex label="Back" color={color} onPress={() => setStage("session")} />}
          <SecondaryButton flex label="Nothing disrupted it" color={color} onPress={() => setStage("clear")} />
        </View>
        {exit}
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Text style={mentalStyles.body}>
        Think about your last focus or study session. Spotting what got in the way makes it easier to plan around next time.
      </Text>
      <QuestionCard stepKey="session" label="Step 1 of 3" question="What kind of session was it?" color={color}>
        <View style={mentalStyles.chips}>
          {SESSIONS.map((option) => (
            <SelectionChip key={option} label={option} color={color} selected={session === option} onPress={() => setSession(option)} />
          ))}
        </View>
        <Text style={[mentalStyles.label, styles.spaced]}>HOW DID IT GO?</Text>
        <View style={styles.outcomes}>
          {OUTCOMES.map((option) => (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: outcome === option.id }}
              onPress={() => setOutcome(option.id)}
              style={({ pressed }) => [
                styles.outcome,
                outcome === option.id && { borderColor: color, backgroundColor: soft },
                pressed && styles.pressed,
              ]}
            >
              <AppIcon name={option.icon} size={22} color={outcome === option.id ? color : COLORS.ink} />
              <Text style={[styles.outcomeText, outcome === option.id && { color }]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </QuestionCard>
      <PrimaryButton
        label="Next"
        color={color}
        disabled={!session || !outcome}
        onPress={() => setStage("disruptors")}
      />
      {exit}
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.78 },
  dim: { opacity: 0.45 },
  spaced: { marginTop: 8 },
  banner: { padding: 14, borderRadius: 16, gap: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  category: {
    width: "48%",
    flexGrow: 1,
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  categoryName: { flex: 1, color: COLORS.ink, fontSize: 13, fontWeight: "700", lineHeight: 17 },
  outcomes: { gap: 8 },
  outcome: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  outcomeText: { color: COLORS.ink, fontSize: 15, fontWeight: "700" },
  progressRow: { flexDirection: "row", justifyContent: "center", gap: 8 },
  progressDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  fixCard: { gap: 8, alignItems: "stretch" },
  fixIcon: { alignSelf: "center" },
  fixTitle: { color: COLORS.ink, fontSize: 21, fontWeight: "800" },
  fixList: { gap: 8, marginTop: 6 },
  fixOption: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  fixOptionText: { flex: 1, color: COLORS.ink, fontSize: 14, fontWeight: "700", lineHeight: 19 },
  chevron: { fontSize: 24, fontWeight: "500" },
  plan: { padding: 18, borderRadius: 18, gap: 12 },
  planRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  planCopy: { flex: 1, gap: 2 },
  planFix: { color: COLORS.ink, fontSize: 16, fontWeight: "800", lineHeight: 22 },
});
