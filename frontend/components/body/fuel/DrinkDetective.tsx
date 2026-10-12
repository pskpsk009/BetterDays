import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  ActivityHeader,
  ActivityProps,
  mentalStyles,
  SecondaryButton,
  SelectionChip,
  toggleItem,
} from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { DRINKS, DrinkId, estimateDrink, SERVINGS } from "./drinks";

const LEARN = [
  {
    title: "Hydration",
    icon: "💧",
    body: "All of these drinks contain mostly water and contribute to your fluid intake. Plain water does it without caffeine or sugar, which is why it's an easy everyday choice.",
  },
  {
    title: "Caffeine",
    icon: "☕",
    body: "Caffeine can feel energising, and people's sensitivity varies a lot. Having it later in the day can make it harder for some people to fall asleep.",
  },
  {
    title: "Added vs natural sugar",
    icon: "🍬",
    body: "Natural sugars are found in foods like plain milk and whole fruit. Added sugars are put in during preparation, as in many soft drinks. Health guidelines generally suggest keeping added sugars to a small part of what you eat and drink.",
  },
];

export function DrinkDetective({ color, soft }: ActivityProps) {
  const [selected, setSelected] = useState<DrinkId[]>(["water", "soda"]);
  const [servingMl, setServingMl] = useState(250);

  const chosen = DRINKS.filter((drink) => selected.includes(drink.id));

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Fuel Your Body" title="Drink Detective" color={color} />
      <Text style={mentalStyles.body}>
        Pick two or more drinks to compare what&apos;s in a typical serving.
      </Text>

      <View style={styles.grid}>
        {DRINKS.map((drink) => {
          const isSelected = selected.includes(drink.id);
          return (
            <Pressable
              key={drink.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={drink.name}
              onPress={() => setSelected((current) => toggleItem(current, drink.id))}
              style={({ pressed }) => [
                styles.drinkCard,
                isSelected && { borderColor: color, backgroundColor: soft },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.drinkIcon}>{drink.icon}</Text>
              <Text style={[styles.drinkName, isSelected && { color }]}>{drink.name}</Text>
              {isSelected && <Text style={[styles.tick, { color }]}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <Text style={mentalStyles.label}>SERVING SIZE</Text>
      <View style={mentalStyles.chips}>
        {SERVINGS.map((serving) => (
          <SelectionChip
            key={serving.ml}
            label={`${serving.label} · ${serving.ml} ml`}
            color={color}
            selected={servingMl === serving.ml}
            onPress={() => setServingMl(serving.ml)}
          />
        ))}
      </View>

      {chosen.length < 2 ? (
        <View style={[styles.empty, { borderColor: color }]}>
          <Text style={[mentalStyles.body, styles.center]}>
            {chosen.length === 0
              ? "Pick at least two drinks to start comparing."
              : "Pick one more drink to compare."}
          </Text>
        </View>
      ) : (
        <View style={styles.compare}>
          <View style={styles.compareHeader}>
            <Text style={[mentalStyles.label, { color }]}>
              COMPARING {servingMl} ML SERVINGS
            </Text>
            <Text style={styles.estimateBadge}>Estimates</Text>
          </View>
          {chosen.map((drink) => {
            const estimate = estimateDrink(drink, servingMl);
            return (
              <Animated.View
                key={`${drink.id}-${servingMl}`}
                entering={FadeIn.duration(200)}
                style={[mentalStyles.card, styles.compareCard]}
              >
                <View style={styles.compareTitle}>
                  <Text style={styles.compareIcon}>{drink.icon}</Text>
                  <Text style={styles.compareName}>{drink.name}</Text>
                </View>
                <View style={styles.metrics}>
                  <Metric label="Water" value={`≈ ${estimate.waterMl} ml`} />
                  <Metric label="Caffeine" value={`≈ ${estimate.caffeineMg} mg`} />
                  <Metric label="Added sugar" value={`≈ ${estimate.addedSugarG} g`} highlight={estimate.addedSugarG > 0} />
                  <Metric label="Natural sugar" value={`≈ ${estimate.naturalSugarG} g`} />
                </View>
                <Text style={mentalStyles.muted}>{drink.note}</Text>
              </Animated.View>
            );
          })}
          <SecondaryButton
            subtle
            label="Clear selection"
            color={COLORS.muted}
            onPress={() => setSelected([])}
          />
        </View>
      )}

      <Text style={[mentalStyles.muted, styles.center]}>
        Values are rough estimates. Brands, recipes, and serving sizes vary, so
        check the label for specific products.
      </Text>

      <Text style={mentalStyles.label}>GOOD TO KNOW</Text>
      {LEARN.map((item) => (
        <View key={item.title} style={[styles.learn, { backgroundColor: soft }]}>
          <Text style={styles.learnTitle}>
            {item.icon} {item.title}
          </Text>
          <Text style={mentalStyles.body}>{item.body}</Text>
        </View>
      ))}
    </View>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[styles.metric, highlight && styles.metricHighlight]}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={mentalStyles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.78 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  drinkCard: {
    width: "30%",
    flexGrow: 1,
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  drinkIcon: { fontSize: 30 },
  drinkName: { color: COLORS.ink, fontSize: 12, fontWeight: "700", textAlign: "center" },
  tick: { position: "absolute", top: 6, right: 9, fontSize: 14, fontWeight: "900" },
  empty: { padding: 18, borderRadius: 16, borderWidth: 1.5, borderStyle: "dashed" },
  compare: { gap: 12 },
  compareHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  estimateBadge: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#FFF4DE",
    color: "#8A5A00",
    fontSize: 11,
    fontWeight: "800",
  },
  compareCard: { gap: 12 },
  compareTitle: { flexDirection: "row", alignItems: "center", gap: 10 },
  compareIcon: { fontSize: 26 },
  compareName: { color: COLORS.ink, fontSize: 17, fontWeight: "800" },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metric: {
    width: "47%",
    flexGrow: 1,
    gap: 2,
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  metricHighlight: { backgroundColor: "#FFF4DE" },
  metricValue: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  learn: { padding: 16, borderRadius: 16, gap: 6 },
  learnTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "800" },
});
