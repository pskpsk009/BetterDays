import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon, IconName } from "../common/AppIcon";
import { mentalStyles, PrimaryButton, SecondaryButton, SelectionChip, toggleItem } from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { NeedId, NEEDS } from "./needs";

// First-open welcome: what the app is, how data is handled, and an optional
// "what would you like help with?" that orders the Home finder.

/** Bump when the privacy wording on the second screen changes. */
export const WELCOME_NOTICE_VERSION = 4;
const MAX_FOCUS = 3;

const AREAS: { icon: IconName; title: string; detail: string; color: string; soft: string }[] = [
  { icon: "brain", title: "Mind", detail: "Short activities for your thoughts, feelings and relationships.", color: COLORS.mind, soft: COLORS.mindSoft },
  { icon: "human", title: "Body", detail: "Water, food, stretching and sleep, one small habit at a time.", color: COLORS.teal, soft: COLORS.tealSoft },
  { icon: "shoe-sneaker", title: "Trail", detail: "Go for a walk and see your trail.", color: COLORS.movement, soft: COLORS.movementSoft },
];

const PRIVACY = [
  "Most activities don't save anything. When you leave, it's gone.",
  "My Support Circle, Values Compass, Develop Your Skill and Sleep Schedule Guidance remember what you add, so you can pick up where you left off.",
  "That stays on this phone unless you choose to turn on backup to your account.",
  "An account is optional. Backup is off until you turn it on in Profile.",
  "Each of those activities has a button to delete what it saved.",
];

export function Welcome({
  visible,
  initialFocus,
  onFinish,
}: {
  visible: boolean;
  initialFocus: NeedId[];
  onFinish: (focus: NeedId[]) => void;
}) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [focus, setFocus] = useState<NeedId[]>(initialFocus);

  function finish(picks: NeedId[]) {
    onFinish(picks);
    setFocus(picks);
    setStep(0);
  }

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={() => finish(focus)}>
      <View style={[styles.screen, { paddingTop: Math.max(insets.top, 18) + 8, paddingBottom: insets.bottom + 18 }]}>
        <View style={styles.top}>
          <Dots step={step} />
          {step < 2 && <SecondaryButton subtle label="Skip" color={COLORS.muted} onPress={() => finish(focus)} />}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View key={step} entering={FadeIn.duration(240)} style={mentalStyles.screen}>
            {step === 0 && (
              <>
                <Text accessibilityRole="header" style={styles.title}>Welcome to MyGrowth</Text>
                <Text style={mentalStyles.body}>
                  Small, optional activities for everyday wellbeing. Open any of them when you need it, for as long as you like.
                </Text>
                {AREAS.map((area) => (
                  <View key={area.title} style={[mentalStyles.card, styles.area]}>
                    <View style={[styles.areaIcon, { backgroundColor: area.soft }]}>
                      <AppIcon name={area.icon} size={26} color={area.color} />
                    </View>
                    <View style={styles.areaCopy}>
                      <Text style={[styles.areaTitle, { color: area.color }]}>{area.title}</Text>
                      <Text style={mentalStyles.muted}>{area.detail}</Text>
                    </View>
                  </View>
                ))}
                <Text style={mentalStyles.muted}>
                  MyGrowth isn&apos;t therapy or medical advice, and it can&apos;t tell how you&apos;re doing.
                </Text>
              </>
            )}

            {step === 1 && (
              <>
                <Text accessibilityRole="header" style={styles.title}>Your data stays with you</Text>
                {PRIVACY.map((line) => (
                  <View key={line} style={styles.bullet}>
                    <AppIcon name="lock-outline" size={18} color={COLORS.teal} style={styles.bulletMark} />
                    <Text style={[mentalStyles.body, styles.bulletText]}>{line}</Text>
                  </View>
                ))}
              </>
            )}

            {step === 2 && (
              <>
                <Text accessibilityRole="header" style={styles.title}>What would you like help with?</Text>
                <Text style={mentalStyles.body}>
                  Pick up to {MAX_FOCUS}. They&apos;ll show first on Home, and you can change them any time. This is optional.
                </Text>
                <View style={mentalStyles.chips}>
                  {NEEDS.map((need) => (
                    <SelectionChip
                      key={need.id}
                      icon={need.icon}
                      label={need.label}
                      color={COLORS.teal}
                      selected={focus.includes(need.id)}
                      onPress={() => {
                        if (focus.includes(need.id) || focus.length < MAX_FOCUS) setFocus(toggleItem(focus, need.id));
                      }}
                    />
                  ))}
                </View>
                <Text style={mentalStyles.muted}>Your picks are saved on this phone only.</Text>
              </>
            )}
          </Animated.View>
        </ScrollView>

        <View style={styles.actions}>
          {step < 2 ? (
            <PrimaryButton label="Next" color={COLORS.teal} onPress={() => setStep(step + 1)} />
          ) : (
            <>
              <PrimaryButton label="Start" color={COLORS.teal} onPress={() => finish(focus)} />
              <SecondaryButton subtle label="Skip for now" color={COLORS.muted} onPress={() => finish([])} />
            </>
          )}
          {step > 0 && <SecondaryButton subtle label="Back" color={COLORS.muted} onPress={() => setStep(step - 1)} />}
        </View>
      </View>
    </Modal>
  );
}

function Dots({ step }: { step: number }) {
  return (
    <View accessibilityLabel={`Step ${step + 1} of 3`} style={styles.dots}>
      {[0, 1, 2].map((index) => (
        <View key={index} style={[styles.dot, index === step && styles.dotActive]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.background },
  top: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dots: { flexDirection: "row", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { width: 22, backgroundColor: COLORS.teal },
  content: { paddingVertical: 16 },
  title: { color: "#1C4C55", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.8 },
  area: { flexDirection: "row", alignItems: "center", gap: 14 },
  areaIcon: { width: 48, height: 48, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  areaCopy: { flex: 1, gap: 4 },
  areaTitle: { fontSize: 16, fontWeight: "800" },
  bullet: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  bulletMark: { lineHeight: 21 },
  bulletText: { flex: 1 },
  actions: { gap: 4 },
});
