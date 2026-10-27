import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";

import { AppIcon } from "../common/AppIcon";
import { ActivityCard, mentalStyles } from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { findSuggestion, NeedId, orderNeeds } from "./needs";

/** Home card: pick a need, get three activities that fit, open one in one tap. */
export function NeedFinder({ focus }: { focus: NeedId[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<NeedId | null>(null);
  const needs = orderNeeds(focus);
  const need = needs.find((item) => item.id === selected);

  function open(activityId: string) {
    const suggestion = findSuggestion(activityId);
    if (!suggestion) return;
    // `t` makes each tap a new request, so the same activity can be reopened.
    router.push({
      pathname: suggestion.tab === "body" ? "/body" : "/mental",
      params: { open: activityId, t: String(Date.now()) },
    });
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>What do you need right now?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}
      >
        {needs.map((item) => {
          const active = item.id === selected;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(active ? null : item.id)}
              style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                <AppIcon name={item.icon} size={15} color={active ? COLORS.white : COLORS.teal} /> {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {need ? (
        <Animated.View key={need.id} entering={FadeIn.duration(220)} style={styles.list}>
          {need.picks.map((id) => {
            const suggestion = findSuggestion(id);
            return suggestion ? (
              <ActivityCard
                key={id}
                activity={suggestion.activity}
                branch={suggestion.branch}
                onPress={() => open(id)}
              />
            ) : null;
          })}
          <Text style={[mentalStyles.muted, styles.center]}>
            These are small, optional ideas. If you ever feel unsafe, contact someone you trust or a
            local emergency or support line.
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, marginTop: 22 },
  title: { color: "#1C4C55", fontSize: 17, fontWeight: "800", paddingHorizontal: 4 },
  chipScroll: { marginHorizontal: -20 },
  chips: { gap: 8, paddingHorizontal: 20 },
  chip: {
    minHeight: 40,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: { backgroundColor: COLORS.teal, borderColor: COLORS.teal },
  chipText: { color: COLORS.ink, fontSize: 13, fontWeight: "700" },
  chipTextActive: { color: COLORS.white },
  pressed: { opacity: 0.78 },
  list: { gap: 10 },
  center: { textAlign: "center" },
});
