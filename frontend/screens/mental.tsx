import { StyleSheet, Text, View } from "react-native";

import {
  COLORS,
  MobileScreen,
  ScreenHeader,
} from "../components/common/AppShell";
import {
  WellnessCardList,
  WellnessCardData,
} from "../components/wellness/WellnessCardList";

const mentalCards: WellnessCardData[] = [
  {
    title: "Focus & Attention",
    detail: "Keep your attention where it matters.",
    progress: 72,
    value: "18 min",
    icon: "o",
  },
  {
    title: "Learning & Memory",
    detail: "Make space for something new today.",
    progress: 58,
    value: "12 min",
    icon: "+",
  },
  {
    title: "Emotional Wellbeing",
    detail: "Notice how you feel, without judgment.",
    progress: 84,
    value: "Good",
    icon: "u",
  },
  {
    title: "Mindfulness & Habits",
    detail: "Small rituals build a steadier rhythm.",
    progress: 64,
    value: "4 / 6",
    icon: "~",
  },
];

export default function MentalScreen() {
  return (
    <MobileScreen tone="mind">
      <ScreenHeader
        title="Mental Development"
        subtitle="A calmer mind, one small practice at a time."
      />
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>Mind space</Text>
        <Text style={styles.introTitle}>How are you growing today?</Text>
      </View>
      <WellnessCardList cards={mentalCards} tone="mind" />
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  intro: { paddingBottom: 18 },
  eyebrow: {
    marginBottom: 8,
    color: COLORS.mind,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  introTitle: { color: "#315C61", fontSize: 18, fontWeight: "700" },
});
