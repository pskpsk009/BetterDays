import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ActivityProps, mentalStyles, SecondaryButton, toggleItem } from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { NightBanner } from "./NightBanner";

const TIPS = [
  {
    id: "dark",
    icon: "🌑",
    tip: "Keep the bedroom dark",
    why: "Darkness helps your body recognise it's night. Curtains, blinds, or an eye mask can block out light.",
  },
  {
    id: "quiet",
    icon: "🤫",
    tip: "Reduce noise and distractions",
    why: "Sudden sounds can disturb rest. Earplugs, a fan, or soft steady background sound may help.",
  },
  {
    id: "cool",
    icon: "❄️",
    tip: "Keep the room comfortably cool",
    why: "Many people sleep better in a slightly cool room. Light layers make it easy to adjust.",
  },
  {
    id: "bedding",
    icon: "🛏️",
    tip: "Use comfortable bedding",
    why: "A pillow, mattress, and blankets that feel comfortable to you make it easier to settle.",
  },
  {
    id: "screens",
    icon: "📵",
    tip: "Reduce notifications and screens before bed",
    why: "Silencing notifications and putting screens away a little earlier lowers late-night stimulation.",
  },
  {
    id: "consistent",
    icon: "🔁",
    tip: "Keep your sleep space consistent",
    why: "When your bed and room feel familiar each night, your body learns that this is where you rest.",
  },
];

export function SleepEnvironment({ color, soft, onExit }: ActivityProps) {
  const [trying, setTrying] = useState<string[]>([]);

  return (
    <View style={mentalStyles.screen}>
      <NightBanner
        eyebrow="Good Night Sleep"
        title="Improve the Sleep Environment"
        subtitle="Small changes to your space can make rest easier."
      />
      <Text style={mentalStyles.body}>
        Read through the ideas and tap &quot;I&apos;ll try this&quot; on any you&apos;d like to
        experiment with tonight.
      </Text>

      {TIPS.map((item) => {
        const isTrying = trying.includes(item.id);
        return (
          <View key={item.id} style={[mentalStyles.card, styles.card, isTrying && { borderColor: color }]}>
            <View style={styles.top}>
              <View style={[styles.icon, { backgroundColor: soft }]}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <Text style={styles.tip}>{item.tip}</Text>
            </View>
            <Text style={mentalStyles.body}>{item.why}</Text>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isTrying }}
              accessibilityLabel={`I'll try: ${item.tip}`}
              onPress={() => setTrying((list) => toggleItem(list, item.id))}
              style={({ pressed }) => [
                styles.tryButton,
                { borderColor: color },
                isTrying && { backgroundColor: color },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.tryText, { color: isTrying ? COLORS.white : color }]}>
                {isTrying ? "✓ I'll try this" : "I'll try this"}
              </Text>
            </Pressable>
          </View>
        );
      })}

      <View style={[styles.summary, { backgroundColor: soft }]}>
        <Text style={mentalStyles.body}>
          {trying.length === 0
            ? "No ideas picked yet. Even one small change is a good start."
            : `Tonight you'll try: ${TIPS.filter((item) => trying.includes(item.id))
                .map((item) => item.tip.toLowerCase())
                .join("; ")}.`}
        </Text>
      </View>
      <Text style={[mentalStyles.muted, styles.center]}>
        Everyone&apos;s ideal sleep space is different. Your picks aren&apos;t saved.
      </Text>
      <SecondaryButton label="Back to Good Night Sleep" color={color} onPress={onExit} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.8 },
  card: { gap: 10 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 22 },
  tip: { flex: 1, color: COLORS.ink, fontSize: 16, fontWeight: "800", lineHeight: 22 },
  tryButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tryText: { fontSize: 13, fontWeight: "800" },
  summary: { padding: 16, borderRadius: 16 },
});
