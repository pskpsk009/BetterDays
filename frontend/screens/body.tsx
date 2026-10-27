import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";

import { ActivityCard, ActivityProps, BackPill } from "../components/common/ActivityUI";
import { ActivityLogProvider } from "../components/common/activityLog";
import { MobileScreen, ScreenHeader } from "../components/common/AppShell";
import { BODY_BRANCHES, BodyActivityId } from "../components/body/branches";
import { BalancedPlate } from "../components/body/fuel/BalancedPlate";
import { HydrationCheckin } from "../components/body/fuel/HydrationCheckin";
import { DailyStretch } from "../components/body/movement/DailyStretch";
import { ScheduleGuidance } from "../components/body/sleep/ScheduleGuidance";

const ACCENT = "#247F7B";

const ACTIVITIES: Partial<Record<BodyActivityId, (props: ActivityProps) => React.ReactNode>> = {
  hydration: HydrationCheckin,
  "balanced-plate": BalancedPlate,
  "daily-stretch": DailyStretch,
  "schedule-guidance": ScheduleGuidance,
};

// Each activity keeps the colours of the branch it came from.
const ENTRIES = BODY_BRANCHES.flatMap((branch) =>
  branch.activities
    .filter((activity) => activity.id in ACTIVITIES)
    .map((activity) => ({ activity, branch })),
);

/** Body tab: a single list of activities, each opening in place. */
export default function BodyScreen() {
  // The Home finder links here with ?open=<activityId>&t=<timestamp>.
  const { open, t } = useLocalSearchParams<{ open?: string; t?: string }>();
  const [activityId, setActivityId] = useState<BodyActivityId | null>(null);
  const [handledAt, setHandledAt] = useState<string | undefined>(undefined);

  // Each new link request opens its activity once.
  if (open && t && t !== handledAt) {
    setHandledAt(t);
    if (open in ACTIVITIES) setActivityId(open as BodyActivityId);
  }

  useEffect(() => {
    if (!activityId) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      setActivityId(null);
      return true;
    });
    return () => subscription.remove();
  }, [activityId]);

  const entry = ENTRIES.find((item) => item.activity.id === activityId);
  const Activity = activityId ? ACTIVITIES[activityId] : undefined;
  const back = () => setActivityId(null);

  return (
    // Keying the screen resets scroll position and activity state between views.
    <MobileScreen key={activityId ?? "main"}>
      <Animated.View entering={FadeIn.duration(220)}>
        {entry && Activity ? (
          <View style={styles.subscreen}>
            <BackPill label="Body" color={entry.branch.color} soft={entry.branch.soft} onPress={back} />
            <ActivityLogProvider activityId={entry.activity.id}>
              <Activity color={entry.branch.color} soft={entry.branch.soft} onExit={back} />
            </ActivityLogProvider>
          </View>
        ) : (
          <>
            <ScreenHeader
              title="Body Functions"
              subtitle="Small choices that help you feel more like you."
            />
            <View style={styles.intro}>
              <Text style={[styles.eyebrow, { color: ACCENT }]}>Body space</Text>
              <Text style={styles.introTitle}>Your daily foundations</Text>
            </View>
            <View style={styles.list}>
              {ENTRIES.map(({ activity, branch }) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  branch={branch}
                  onPress={() => setActivityId(activity.id as BodyActivityId)}
                />
              ))}
            </View>
          </>
        )}
      </Animated.View>
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
});
