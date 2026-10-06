import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const COLORS = {
  background: "#F5FAF8",
  ink: "#183B42",
  muted: "#6D8589",
  border: "#DCEBE8",
  white: "#FFFFFF",
  teal: "#247F7B",
  tealSoft: "#E7F5F0",
  mind: "#6587D9",
  mindSoft: "#EDF1FC",
  movement: "#DD8C43",
  movementSoft: "#FFF1DF",
};

type Tone = "teal" | "mind" | "body" | "movement";

export function MobileScreen({
  children,
  tone: _tone = "teal",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 18) }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 105 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.replace("/")} style={styles.back}>
        <Text style={styles.backArrow}>{"<"}</Text>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20 },
  header: { paddingTop: 3, paddingBottom: 23 },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 23,
  },
  backArrow: { color: COLORS.muted, fontSize: 21 },
  backText: { color: COLORS.muted, fontSize: 13 },
  title: {
    color: "#1C4C55",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    maxWidth: 340,
    marginTop: 10,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
  },
});
