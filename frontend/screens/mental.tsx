import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  COLORS,
  MobileScreen,
  ScreenHeader,
} from "../components/common/AppShell";
import { BreathingBubble } from "../components/mental/BreathingBubble";
import {
  ActivityId,
  BranchData,
  BranchId,
  BRANCHES,
  getBranch,
} from "../components/mental/branches";
import { ControlSort } from "../components/mental/ControlSort";
import { DistractionTracker } from "../components/mental/DistractionTracker";
import { EmotionExplorer } from "../components/mental/EmotionExplorer";
import { FocusSprint } from "../components/mental/FocusSprint";
import { ReflectionDetective } from "../components/mental/ReflectionDetective";
import { SensesGrounding } from "../components/mental/SensesGrounding";
import { TargetTap } from "../components/mental/TargetTap";
import {
  ActivityCard,
  BackPill,
  BranchCard,
  BranchIcon,
} from "../components/mental/ui";
import { WatchThoughts } from "../components/mental/WatchThoughts";

type MindView =
  | { screen: "main" }
  | { screen: "branch"; branchId: BranchId }
  | { screen: "activity"; branchId: BranchId; activityId: ActivityId };

type ActivityProps = { color: string; soft: string; onExit: () => void };

const ACTIVITIES: Record<ActivityId, (props: ActivityProps) => React.ReactNode> = {
  "breathing-bubble": BreathingBubble,
  "senses-grounding": SensesGrounding,
  "watch-thoughts": WatchThoughts,
  "emotion-explorer": EmotionExplorer,
  "reflection-detective": ReflectionDetective,
  "what-can-i-control": ControlSort,
  "focus-sprint": FocusSprint,
  "target-tap": TargetTap,
  "distraction-tracker": DistractionTracker,
};

export default function MentalScreen() {
  const [view, setView] = useState<MindView>({ screen: "main" });

  // Android hardware back steps up one level inside the Mind tab.
  useEffect(() => {
    if (view.screen === "main") return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setView(
          view.screen === "activity"
            ? { screen: "branch", branchId: view.branchId }
            : { screen: "main" },
        );
        return true;
      },
    );
    return () => subscription.remove();
  }, [view]);

  // Keying the screen resets scroll position and activity state between levels.
  const screenKey =
    view.screen === "main"
      ? "main"
      : view.screen === "branch"
        ? view.branchId
        : `${view.branchId}/${view.activityId}`;

  return (
    <MobileScreen key={screenKey} tone="mind">
      <Animated.View entering={FadeIn.duration(220)}>
        {view.screen === "main" && (
          <MainView
            onOpen={(branchId) => setView({ screen: "branch", branchId })}
          />
        )}
        {view.screen === "branch" && (
          <BranchView
            branch={getBranch(view.branchId)}
            onBack={() => setView({ screen: "main" })}
            onOpen={(activityId) =>
              setView({ screen: "activity", branchId: view.branchId, activityId })
            }
          />
        )}
        {view.screen === "activity" && (
          <ActivityView
            branch={getBranch(view.branchId)}
            activityId={view.activityId}
            onBack={() => setView({ screen: "branch", branchId: view.branchId })}
          />
        )}
      </Animated.View>
    </MobileScreen>
  );
}

function MainView({ onOpen }: { onOpen: (branchId: BranchId) => void }) {
  return (
    <>
      <ScreenHeader
        title="Mental Development"
        subtitle="A calmer, clearer mind, one small practice at a time."
      />
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>Mind space</Text>
        <Text style={styles.introTitle}>Where would you like to start?</Text>
      </View>
      <View style={styles.list}>
        {BRANCHES.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onPress={() => onOpen(branch.id)}
          />
        ))}
      </View>
    </>
  );
}

function BranchView({
  branch,
  onBack,
  onOpen,
}: {
  branch: BranchData;
  onBack: () => void;
  onOpen: (activityId: ActivityId) => void;
}) {
  return (
    <View style={styles.subscreen}>
      <BackPill
        label="All branches"
        color={branch.color}
        soft={branch.soft}
        onPress={onBack}
      />
      <View style={[styles.branchHero, { backgroundColor: branch.soft }]}>
        <BranchIcon branch={branch.id} color={branch.color} size={64} />
        <Text accessibilityRole="header" style={styles.heroTitle}>
          {branch.title}
        </Text>
        <Text style={styles.heroBody}>{branch.description}</Text>
      </View>
      <Text style={styles.sectionLabel}>CHOOSE AN ACTIVITY</Text>
      <View style={styles.list}>
        {branch.activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            branch={branch}
            onPress={() => onOpen(activity.id)}
          />
        ))}
      </View>
    </View>
  );
}

function ActivityView({
  branch,
  activityId,
  onBack,
}: {
  branch: BranchData;
  activityId: ActivityId;
  onBack: () => void;
}) {
  const Activity = ACTIVITIES[activityId];

  return (
    <View style={styles.subscreen}>
      <BackPill
        label={branch.title}
        color={branch.color}
        soft={branch.soft}
        onPress={onBack}
      />
      <Activity color={branch.color} soft={branch.soft} onExit={onBack} />
    </View>
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
  list: { gap: 12 },
  subscreen: { gap: 18, paddingTop: 6 },
  branchHero: {
    padding: 20,
    borderRadius: 22,
    gap: 10,
  },
  heroTitle: {
    color: "#1C4C55",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  heroBody: { color: COLORS.ink, fontSize: 14, lineHeight: 21 },
  sectionLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.9,
    marginBottom: -6,
  },
});
