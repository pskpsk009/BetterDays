import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ActivityProps, BranchInfo } from "../components/common/ActivityUI";
import { COLORS } from "../components/common/AppShell";
import { BranchExplorer } from "../components/common/BranchExplorer";
import { EMOTIONAL_BRANCHES, EmotionalActivityId, EmotionalBranchId } from "../components/emotional/branches";
import { ControlSort } from "../components/emotional/ControlSort";
import { EmotionalBranchIcon } from "../components/emotional/EmotionalBranchIcon";
import { EmotionExplorer } from "../components/emotional/EmotionExplorer";
import { ReflectionDetective } from "../components/emotional/ReflectionDetective";
import { CalmDownToolkit, ChooseYourResponse, PauseBeforeReacting } from "../components/emotional/selfControl";
import { ConversationBuilder, HealthyBoundaries, WalkInTheirShoes } from "../components/emotional/socialCreatures";
import { MyNextStep, PlanB, SupportCircle } from "../components/emotional/standUpAgain";
import { BranchIcon } from "../components/mental/BranchIcon";
import { MENTAL_BRANCHES, MentalActivityId, MentalBranchId } from "../components/mental/branches";
import { BreathingBubble } from "../components/mental/BreathingBubble";
import { JoyExplorer, LittleMoments, TrySomethingNew } from "../components/mental/discoverJoy";
import { DistractionTracker } from "../components/mental/DistractionTracker";
import { FocusSprint } from "../components/mental/FocusSprint";
import { FutureMe, OneSmallStep, ValuesCompass } from "../components/mental/purpose";
import { LessonsNotLabels, LetterToPastSelf, StrengthsGarden } from "../components/mental/selfAcceptance";
import { SensesGrounding } from "../components/mental/SensesGrounding";
import { TargetTap } from "../components/mental/TargetTap";
import { WatchThoughts } from "../components/mental/WatchThoughts";

type Activity = (props: ActivityProps) => React.ReactNode;

const MENTAL_ACTIVITIES: Record<MentalActivityId, Activity> = {
  "letter-to-past-self": LetterToPastSelf,
  "lessons-not-labels": LessonsNotLabels,
  "strengths-garden": StrengthsGarden,
  "joy-explorer": JoyExplorer,
  "try-something-new": TrySomethingNew,
  "little-moments": LittleMoments,
  "values-compass": ValuesCompass,
  "future-me": FutureMe,
  "one-small-step": OneSmallStep,
  "breathing-bubble": BreathingBubble,
  "senses-grounding": SensesGrounding,
  "watch-thoughts": WatchThoughts,
  "focus-sprint": FocusSprint,
  "target-tap": TargetTap,
  "distraction-tracker": DistractionTracker,
};

const EMOTIONAL_ACTIVITIES: Record<EmotionalActivityId, Activity> = {
  "my-next-step": MyNextStep,
  "plan-b": PlanB,
  "support-circle": SupportCircle,
  "emotion-explorer": EmotionExplorer,
  "reflection-detective": ReflectionDetective,
  "what-can-i-control": ControlSort,
  "pause-before-reacting": PauseBeforeReacting,
  "calm-down-toolkit": CalmDownToolkit,
  "choose-your-response": ChooseYourResponse,
  "conversation-builder": ConversationBuilder,
  "walk-in-their-shoes": WalkInTheirShoes,
  "healthy-boundaries": HealthyBoundaries,
};

type SectionId = "mental" | "emotional";

const SECTIONS: Record<
  SectionId,
  {
    label: string;
    title: string;
    subtitle: string;
    eyebrow: string;
    introTitle: string;
    banner: string;
    accent: string;
    background: string;
    branches: BranchInfo[];
    activities: Record<string, Activity>;
    renderIcon: (branch: BranchInfo, size: number) => React.ReactNode;
  }
> = {
  mental: {
    label: "Mental Wellness",
    title: "Mental Wellness",
    subtitle: "Grow from the past, enjoy today, and look ahead with focus.",
    eyebrow: "Mind space",
    introTitle: "Where would you like to start?",
    banner: "Accept the past, find joy and purpose, live in the present, and sharpen your focus.",
    accent: "#2B8273",
    background: "#E6F2EC",
    branches: MENTAL_BRANCHES,
    activities: MENTAL_ACTIVITIES,
    renderIcon: (branch, size) => (
      <BranchIcon branch={branch.id as MentalBranchId} color={branch.color} size={size} />
    ),
  },
  emotional: {
    label: "Emotional Wellness",
    title: "Emotional Wellness",
    subtitle: "Understand your feelings, bounce back, and connect with others.",
    eyebrow: "Heart space",
    introTitle: "What would you like to explore?",
    banner: "Build resilience, understand and steady your emotions, and grow your relationships.",
    accent: "#C2603A",
    background: "#FCEEE6",
    branches: EMOTIONAL_BRANCHES,
    activities: EMOTIONAL_ACTIVITIES,
    renderIcon: (branch, size) => (
      <EmotionalBranchIcon branch={branch.id as EmotionalBranchId} color={branch.color} size={size} />
    ),
  },
};

const SECTION_ORDER: SectionId[] = ["mental", "emotional"];

function SectionSwitch({ value, onChange }: { value: SectionId; onChange: (section: SectionId) => void }) {
  const section = SECTIONS[value];
  return (
    <View style={styles.switchWrap}>
      <View accessibilityRole="tablist" style={styles.switch}>
        {SECTION_ORDER.map((id) => {
          const selected = id === value;
          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onChange(id)}
              style={({ pressed }) => [
                styles.segment,
                selected && { backgroundColor: SECTIONS[id].accent },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                {SECTIONS[id].label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.banner, { backgroundColor: section.background }]}>
        <View style={styles.bannerIcons} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {section.branches.map((branch) => (
            <View key={branch.id}>{section.renderIcon(branch, 30)}</View>
          ))}
        </View>
        <Text style={[styles.bannerText, { color: COLORS.ink }]}>{section.banner}</Text>
      </View>
    </View>
  );
}

export default function MentalScreen() {
  const [sectionId, setSectionId] = useState<SectionId>("mental");
  const section = SECTIONS[sectionId];

  return (
    <BranchExplorer
      // Keyed so switching sections starts fresh at that section's branch list.
      key={sectionId}
      title={section.title}
      subtitle={section.subtitle}
      eyebrow={section.eyebrow}
      introTitle={section.introTitle}
      accent={section.accent}
      branches={section.branches}
      activities={section.activities}
      renderIcon={section.renderIcon}
      headerExtra={<SectionSwitch value={sectionId} onChange={setSectionId} />}
    />
  );
}

const styles = StyleSheet.create({
  switchWrap: { gap: 12, marginTop: -8, marginBottom: 20 },
  switch: {
    flexDirection: "row",
    padding: 4,
    gap: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  segment: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  segmentText: { color: COLORS.muted, fontSize: 13, fontWeight: "800", textAlign: "center" },
  segmentTextSelected: { color: COLORS.white },
  pressed: { opacity: 0.8 },
  banner: { padding: 14, borderRadius: 18, gap: 10 },
  bannerIcons: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  bannerText: { fontSize: 13, lineHeight: 19 },
});
