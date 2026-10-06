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

const bodyCards: WellnessCardData[] = [
  {
    title: "Sleep",
    detail: "Rest that helps you feel restored.",
    progress: 88,
    value: "7h 30m",
    icon: "z",
  },
  {
    title: "Nutrition",
    detail: "Fuel your day with care and balance.",
    progress: 67,
    value: "2 / 3",
    icon: "+",
  },
  {
    title: "Energy",
    detail: "Check in with your natural rhythm.",
    progress: 76,
    value: "Good",
    icon: "*",
  },
  {
    title: "Physical Activity",
    detail: "A little movement makes a difference.",
    progress: 54,
    value: "16 min",
    icon: ">",
  },
  {
    title: "Health",
    detail: "Listen closely to what your body needs.",
    progress: 80,
    value: "Steady",
    icon: "+",
  },
];

export default function BodyScreen() {
  return (
    <MobileScreen tone="body">
      <ScreenHeader
        title="Body Functions"
        subtitle="Small choices that help you feel more like you."
      />
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>Body space</Text>
        <Text style={styles.introTitle}>Your daily foundations</Text>
      </View>
      <WellnessCardList cards={bodyCards} tone="body" />
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  intro: { paddingBottom: 18 },
  eyebrow: {
    marginBottom: 8,
    color: COLORS.teal,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  introTitle: { color: "#315C61", fontSize: 18, fontWeight: "700" },
});
