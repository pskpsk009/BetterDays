import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../common/AppShell";

export type WellnessCardData = {
  title: string;
  detail: string;
  progress: number;
  value: string;
  icon: string;
};

type WellnessTone = "mind" | "body";

export function WellnessCardList({
  cards,
  tone,
}: {
  cards: WellnessCardData[];
  tone: WellnessTone;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const accent = tone === "mind" ? COLORS.mind : COLORS.teal;
  const softAccent = tone === "mind" ? COLORS.mindSoft : COLORS.tealSoft;

  return (
    <>
      <View style={styles.cardList}>
        {cards.map((card) => (
          <Pressable
            key={card.title}
            onPress={() => setSelected(card.title)}
            style={({ pressed }) => [
              styles.wellnessCard,
              selected === card.title && { borderColor: accent },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.cardIcon, { backgroundColor: softAccent }]}>
              <Text style={[styles.cardIconText, { color: accent }]}>
                {card.icon}
              </Text>
            </View>
            <View style={styles.cardCopy}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text numberOfLines={1} style={styles.cardDetail}>
                {card.detail}
              </Text>
            </View>
            <Text style={[styles.cardValue, { color: accent }]}>
              {card.value}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${card.progress}%`, backgroundColor: accent },
                ]}
              />
            </View>
          </Pressable>
        ))}
      </View>
      {selected && (
        <View style={styles.selectionNote}>
          <View>
            <Text style={styles.selectionTitle}>{selected}</Text>
            <Text style={styles.selectionSub}>
              Ready for your next small step.
            </Text>
          </View>
          <Pressable onPress={() => setSelected(null)} style={styles.close}>
            <Text>x</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardList: { gap: 12 },
  wellnessCard: {
    minHeight: 104,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#205655",
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  pressed: { opacity: 0.82 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconText: { fontSize: 19, fontWeight: "800" },
  cardCopy: { flex: 1, minWidth: 130, gap: 5 },
  cardTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "800" },
  cardDetail: { color: COLORS.muted, fontSize: 11 },
  cardValue: { fontSize: 12, fontWeight: "800" },
  progressTrack: {
    width: "100%",
    height: 7,
    borderRadius: 7,
    backgroundColor: "#EDF3F1",
    overflow: "hidden",
  },
  progressFill: { height: 7, borderRadius: 7 },
  selectionNote: {
    position: "absolute",
    bottom: 95,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#205655",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  selectionTitle: { color: "#245963", fontSize: 13, fontWeight: "800" },
  selectionSub: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.tealSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
