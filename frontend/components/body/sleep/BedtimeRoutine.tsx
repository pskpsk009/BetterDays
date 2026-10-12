import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SelectionChip,
  SessionTimer,
  toggleItem,
  useSessionTimer,
} from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { NIGHT, NightBanner } from "./NightBanner";

const STEPS = [
  { id: "lights", icon: "💡", label: "Dim the lights", why: "Lower light in the evening helps signal to your body that it's nearly time to rest." },
  { id: "read", icon: "📖", label: "Read a book", why: "A calm, low-effort activity gives your mind something gentle to settle on." },
  { id: "music", icon: "🎵", label: "Listen to calm music", why: "Slow, quiet music can help you relax and wind down." },
  { id: "shower", icon: "🚿", label: "Take a warm shower", why: "Many people find warmth relaxing, and cooling down afterwards can feel sleepy." },
  { id: "stretch", icon: "🧘", label: "Gentle stretching or relaxed breathing", why: "Easy movement and slow breaths can ease tension from the day." },
  { id: "prepare", icon: "📝", label: "Put away stimulating activities and prepare for tomorrow", why: "Setting things aside and making a quick plan can help your mind let go of the day." },
];

const DURATIONS = [30, 45, 60];

type Status = "setup" | "running" | "paused" | "done";

export function BedtimeRoutine({ color, soft, onExit }: ActivityProps) {
  const [chosen, setChosen] = useState<string[]>(["lights", "read", "stretch"]);
  const [minutes, setMinutes] = useState(30);
  const [status, setStatus] = useState<Status>("setup");
  const [completed, setCompleted] = useState<string[]>([]);
  const { remainingMs, reset } = useSessionTimer(minutes * 60 * 1000, status === "running", () =>
    setStatus("done"),
  );

  const banner = (
    <NightBanner eyebrow="Good Night Sleep" title="Relaxing Bedtime Routine" subtitle="Choose what helps you wind down." />
  );

  function start() {
    reset();
    setCompleted([]);
    setStatus("running");
  }

  if (status === "done") {
    return (
      <View style={mentalStyles.screen}>
        {banner}
        <CompletionScreen
          badge="🌙"
          title="Time to rest"
          message="Your wind-down time is over. There's no pressure to fall asleep straight away. Just let yourself rest comfortably."
          color={color}
          soft={soft}
          primary={{ label: "Plan another routine", onPress: () => setStatus("setup") }}
          secondary={{ label: "Back to Good Night Sleep", onPress: onExit }}
        />
      </View>
    );
  }

  if (status === "running" || status === "paused") {
    const steps = STEPS.filter((step) => chosen.includes(step.id));
    return (
      <View style={mentalStyles.screen}>
        <View style={styles.nightPanel}>
          <Text style={styles.nightLabel}>WIND-DOWN TIME LEFT</Text>
          <SessionTimer remainingMs={remainingMs} color={NIGHT.text} size="large" />
          {status === "paused" && <Text style={styles.nightMuted}>Paused</Text>}
          <Text style={styles.nightMuted}>Tick things off as you go, in any order.</Text>
        </View>
        <View style={styles.list}>
          {steps.map((step) => {
            const done = completed.includes(step.id);
            return (
              <Pressable
                key={step.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: done }}
                onPress={() => setCompleted((list) => toggleItem(list, step.id))}
                style={({ pressed }) => [styles.item, done && { backgroundColor: soft }, pressed && styles.pressed]}
              >
                <Check checked={done} color={color} />
                <Text style={styles.itemIcon}>{step.icon}</Text>
                <Text style={[styles.itemLabel, done && styles.itemDone]}>{step.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={mentalStyles.row}>
          <PrimaryButton
            flex
            label={status === "running" ? "Pause" : "Resume"}
            color={color}
            onPress={() => setStatus(status === "running" ? "paused" : "running")}
          />
          <SecondaryButton flex label="End routine" color={color} onPress={() => setStatus("done")} />
        </View>
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {banner}
      <Text style={mentalStyles.body}>
        Pick any steps that suit you. They&apos;re all optional, and you can
        change them any night.
      </Text>
      <View style={styles.list}>
        {STEPS.map((step) => {
          const isChosen = chosen.includes(step.id);
          return (
            <Pressable
              key={step.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChosen }}
              accessibilityHint={step.why}
              onPress={() => setChosen((list) => toggleItem(list, step.id))}
              style={({ pressed }) => [
                styles.option,
                isChosen && { borderColor: color, backgroundColor: soft },
                pressed && styles.pressed,
              ]}
            >
              <Check checked={isChosen} color={color} />
              <View style={styles.optionCopy}>
                <Text style={styles.optionLabel}>
                  {step.icon} {step.label}
                </Text>
                <Text style={mentalStyles.muted}>{step.why}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={mentalStyles.label}>WIND-DOWN LENGTH</Text>
      <View style={mentalStyles.chips}>
        {DURATIONS.map((option) => (
          <SelectionChip
            key={option}
            label={`${option} min`}
            color={color}
            selected={option === minutes}
            onPress={() => setMinutes(option)}
          />
        ))}
      </View>

      <PrimaryButton
        label="Start routine"
        color={color}
        disabled={chosen.length === 0}
        onPress={start}
      />
      {chosen.length === 0 && (
        <Text style={[mentalStyles.muted, styles.center]}>Pick at least one step to start.</Text>
      )}
      <Text style={[mentalStyles.muted, styles.center]}>Your choices aren&apos;t saved.</Text>
    </View>
  );
}

function Check({ checked, color }: { checked: boolean; color: string }) {
  return (
    <View style={[styles.check, { borderColor: color }, checked && { backgroundColor: color }]}>
      {checked && <Text style={styles.checkMark}>✓</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.8 },
  list: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  optionCopy: { flex: 1, gap: 4 },
  optionLabel: { color: COLORS.ink, fontSize: 15, fontWeight: "800", lineHeight: 21 },
  check: {
    width: 24,
    height: 24,
    marginTop: 1,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: { color: COLORS.white, fontSize: 14, fontWeight: "900" },
  nightPanel: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: NIGHT.deep,
  },
  nightLabel: { color: NIGHT.muted, fontSize: 10, fontWeight: "800", letterSpacing: 0.9 },
  nightMuted: { color: NIGHT.muted, fontSize: 13, textAlign: "center" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  itemIcon: { fontSize: 20 },
  itemLabel: { flex: 1, color: COLORS.ink, fontSize: 14, fontWeight: "700", lineHeight: 20 },
  itemDone: { color: COLORS.muted, textDecorationLine: "line-through" },
});
