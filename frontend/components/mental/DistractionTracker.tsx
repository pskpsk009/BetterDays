import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";

import { COLORS } from "../common/AppShell";
import {
  ActivityHeader,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  toggleItem,
} from "../common/ActivityUI";

const CATEGORIES = [
  {
    name: "Phone or notifications",
    icon: "📱",
    tip: "Try silencing notifications or putting your phone out of reach during your next focus session.",
  },
  {
    name: "Random thoughts",
    icon: "💭",
    tip: "Jot the thought on a scrap of paper to come back to later, then return to your task.",
  },
  {
    name: "Noise around me",
    icon: "🔊",
    tip: "Headphones, quiet background sound, or a quieter spot might help next time.",
  },
  {
    name: "Tiredness",
    icon: "😴",
    tip: "A short break, some water, or a few minutes of movement can help you reset.",
  },
  {
    name: "Other tasks",
    icon: "📋",
    tip: "Write the other task down so it's not forgotten, and pick one thing to do first.",
  },
  {
    name: "People interrupting me",
    icon: "🗣️",
    tip: "If you can, let people know when you're focusing, or find a spot with fewer interruptions.",
  },
  {
    name: "Other",
    icon: "✳️",
    tip: "Noticing a distraction is already a step. Gently bring your attention back when you're ready.",
  },
];

type Entry = { id: number; categories: string[]; note: string; at: Date };

export function DistractionTracker({
  color,
  soft,
  onExit,
}: {
  color: string;
  soft: string;
  onExit: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const nextId = useRef(1);

  // Tips follow the current selection, or the most recent entry once added.
  const tipSource = selected.length > 0 ? selected : (entries[0]?.categories ?? []);
  const tips = CATEGORIES.filter((category) => tipSource.includes(category.name));

  function add() {
    if (selected.length === 0) return;
    const entry = { id: nextId.current, categories: selected, note: note.trim(), at: new Date() };
    nextId.current += 1;
    setEntries((current) => [entry, ...current]);
    setSelected([]);
    setNote("");
    setConfirmClear(false);
  }

  function clearAll() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setEntries([]);
    setConfirmClear(false);
  }

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Concentration" title="Distraction Tracker" color={color} />
      <Text style={mentalStyles.body}>
        Lost focus? Note what pulled you away. Spotting the pattern can make it
        easier to plan around next time.
      </Text>

      <View style={[mentalStyles.card, styles.panel]}>
        <Text style={mentalStyles.label}>WHAT DISTRACTED YOU?</Text>
        <View style={styles.grid}>
          {CATEGORIES.map((category) => {
            const isSelected = selected.includes(category.name);
            return (
              <Pressable
                key={category.name}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={category.name}
                onPress={() => setSelected((current) => toggleItem(current, category.name))}
                style={({ pressed }) => [
                  styles.category,
                  isSelected && { borderColor: color, backgroundColor: soft },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryName, isSelected && { color }]}>
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <TextInput
          accessibilityLabel="Optional note"
          maxLength={100}
          onChangeText={setNote}
          placeholder="Optional note, e.g. group chat buzzing"
          placeholderTextColor={COLORS.muted}
          returnKeyType="done"
          style={[mentalStyles.input, styles.noteInput]}
          value={note}
        />
        <PrimaryButton
          label="Add distraction"
          color={color}
          disabled={selected.length === 0}
          onPress={add}
        />
      </View>

      {tips.length > 0 && (
        <Animated.View
          key={tipSource.join("|")}
          entering={FadeIn.duration(220)}
          accessibilityLiveRegion="polite"
          style={[styles.tips, { backgroundColor: soft }]}
        >
          <Text style={[mentalStyles.label, { color }]}>A TIP TO TRY</Text>
          {tips.map((tip) => (
            <Text key={tip.name} style={mentalStyles.body}>
              {tip.icon} {tip.tip}
            </Text>
          ))}
        </Animated.View>
      )}

      <View style={styles.listHeader}>
        <Text style={mentalStyles.label}>THIS SESSION ({entries.length})</Text>
        {entries.length > 0 && (
          <Pressable accessibilityRole="button" hitSlop={10} onPress={clearAll}>
            <Text style={[styles.clear, { color: confirmClear ? "#C9483F" : color }]}>
              {confirmClear ? "Tap again to clear" : "Clear list"}
            </Text>
          </Pressable>
        )}
      </View>

      {entries.length === 0 ? (
        <Text style={[mentalStyles.muted, styles.empty]}>
          Nothing noted yet. Distractions you add will show here.
        </Text>
      ) : (
        <View style={styles.list}>
          {entries.map((entry) => (
            <Animated.View
              key={entry.id}
              entering={FadeInDown.duration(220)}
              exiting={FadeOut.duration(160)}
              style={styles.entry}
            >
              <View style={styles.entryCopy}>
                <Text style={styles.entryTitle}>{entry.categories.join(", ")}</Text>
                {entry.note ? <Text style={mentalStyles.muted}>{entry.note}</Text> : null}
                <Text style={mentalStyles.muted}>
                  {entry.at.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${entry.categories.join(", ")}`}
                hitSlop={10}
                onPress={() => setEntries((current) => current.filter((item) => item.id !== entry.id))}
                style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
              >
                <Text style={styles.removeText}>✕</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      )}

      <Text style={[mentalStyles.muted, styles.center]}>
        This list is temporary. It clears when you leave this activity.
      </Text>
      <SecondaryButton label="Back to Concentration" color={color} onPress={onExit} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.78 },
  panel: { gap: 12 },
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
  categoryIcon: { fontSize: 20 },
  categoryName: { flex: 1, color: COLORS.ink, fontSize: 13, fontWeight: "700", lineHeight: 17 },
  noteInput: { minHeight: 48 },
  tips: { padding: 16, borderRadius: 16, gap: 8 },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  clear: { fontSize: 13, fontWeight: "800" },
  empty: { fontStyle: "italic" },
  list: { gap: 8 },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  entryCopy: { flex: 1, gap: 3 },
  entryTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "700" },
  remove: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  removeText: { color: COLORS.muted, fontSize: 15, fontWeight: "800" },
});
