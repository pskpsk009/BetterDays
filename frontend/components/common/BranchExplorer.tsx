import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  ActivityCard,
  ActivityProps,
  BackPill,
  BranchCard,
  BranchInfo,
} from "./ActivityUI";
import { COLORS, MobileScreen, ScreenHeader } from "./AppShell";

type ExplorerView =
  | { screen: "main" }
  | { screen: "branch"; branchId: string }
  | { screen: "activity"; branchId: string; activityId: string };

/**
 * Three-level navigation used by the Mind and Body tabs:
 * branch list -> activity list -> activity. Navigation is local state so it
 * stays inside the tab; Android hardware back steps up one level.
 */
export function BranchExplorer({
  title,
  subtitle,
  eyebrow,
  introTitle,
  accent,
  branches,
  activities,
  renderIcon,
  renderHero,
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
  introTitle: string;
  accent: string;
  branches: BranchInfo[];
  activities: Record<string, (props: ActivityProps) => React.ReactNode>;
  renderIcon: (branch: BranchInfo, size: number) => React.ReactNode;
  /** Optional custom hero for a branch's activity list. */
  renderHero?: (branch: BranchInfo) => React.ReactNode | null;
}) {
  const [view, setView] = useState<ExplorerView>({ screen: "main" });

  useEffect(() => {
    if (view.screen === "main") return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      setView(
        view.screen === "activity"
          ? { screen: "branch", branchId: view.branchId }
          : { screen: "main" },
      );
      return true;
    });
    return () => subscription.remove();
  }, [view]);

  const branch =
    view.screen === "main" ? null : branches.find((item) => item.id === view.branchId);

  // Keying the screen resets scroll position and activity state between levels.
  const screenKey =
    view.screen === "main"
      ? "main"
      : view.screen === "branch"
        ? view.branchId
        : `${view.branchId}/${view.activityId}`;

  let content: React.ReactNode = null;

  if (view.screen === "main" || !branch) {
    content = (
      <>
        <ScreenHeader title={title} subtitle={subtitle} />
        <View style={styles.intro}>
          <Text style={[styles.eyebrow, { color: accent }]}>{eyebrow}</Text>
          <Text style={styles.introTitle}>{introTitle}</Text>
        </View>
        <View style={styles.list}>
          {branches.map((item) => (
            <BranchCard
              key={item.id}
              branch={item}
              icon={renderIcon(item, 46)}
              onPress={() => setView({ screen: "branch", branchId: item.id })}
            />
          ))}
        </View>
      </>
    );
  } else if (view.screen === "branch") {
    content = (
      <View style={styles.subscreen}>
        <BackPill
          label="All branches"
          color={branch.color}
          soft={branch.soft}
          onPress={() => setView({ screen: "main" })}
        />
        {renderHero?.(branch) ?? (
          <View style={[styles.hero, { backgroundColor: branch.soft }]}>
            {renderIcon(branch, 64)}
            <Text accessibilityRole="header" style={styles.heroTitle}>
              {branch.title}
            </Text>
            <Text style={styles.heroBody}>{branch.description}</Text>
          </View>
        )}
        <Text style={styles.sectionLabel}>CHOOSE AN ACTIVITY</Text>
        <View style={styles.list}>
          {branch.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              branch={branch}
              onPress={() =>
                setView({ screen: "activity", branchId: branch.id, activityId: activity.id })
              }
            />
          ))}
        </View>
      </View>
    );
  } else {
    const Activity = activities[view.activityId];
    const back = () => setView({ screen: "branch", branchId: branch.id });
    content = (
      <View style={styles.subscreen}>
        <BackPill label={branch.title} color={branch.color} soft={branch.soft} onPress={back} />
        {Activity ? <Activity color={branch.color} soft={branch.soft} onExit={back} /> : null}
      </View>
    );
  }

  return (
    <MobileScreen key={screenKey}>
      <Animated.View entering={FadeIn.duration(220)}>{content}</Animated.View>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  intro: { paddingBottom: 18 },
  eyebrow: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  introTitle: { color: "#315C61", fontSize: 18, fontWeight: "700" },
  list: { gap: 12 },
  subscreen: { gap: 18, paddingTop: 6 },
  hero: { padding: 20, borderRadius: 22, gap: 10 },
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
