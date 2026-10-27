import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, StyleSheet, Text, View, type ScrollViewInstance } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { SavedOnDeviceNote } from "../components/common/ActivityUI";
import { EMPTY_LOG } from "../components/common/activityLog";
import { COLORS, MobileScreen, ScreenHeader } from "../components/common/AppShell";
import { useStoredState } from "../components/common/localStore";
import { BodyDetail } from "../components/progress/BodyDetail";
import { GrowthTree } from "../components/progress/GrowthTree";
import { MindDetail } from "../components/progress/MindDetail";
import { countDistinctDays, PeriodId, within } from "../components/progress/progressMath";
import { buildContext, otherIn } from "../components/progress/progressSummary";
import { ProgressOverview } from "../components/progress/ProgressOverview";
import {
  AREAS,
  BackToOverview,
  DemoNotice,
  periodPhrase,
  PeriodSelector,
} from "../components/progress/ProgressUI";
import type { DateKey, ProgressArea, ProgressDataset } from "../components/progress/types";
import { DataMode, useProgressData } from "../components/progress/useProgressData";

const DETAIL_COPY: Record<ProgressArea, { heading: string; subtitle: string }> = {
  mind: {
    heading: "Mind Progress",
    subtitle: "Mindfulness, self-awareness and concentration activities, with your own ratings.",
  },
  body: {
    heading: "Body Progress",
    subtitle: "Hydration, balanced plates, movement and sleep activities you've completed.",
  },
};

function areaRecords(data: ProgressDataset, area: ProgressArea): { date: DateKey }[] {
  return area === "mind"
    ? [...data.mindfulness, ...data.reflections, ...data.focus, ...otherIn(data, "mind")]
    : [...data.hydration, ...data.plates, ...data.movement, ...data.sleep, ...data.bedtimeRoutines, ...otherIn(data, "body")];
}

/**
 * Progress page: a Mind-and-Body Growth Tree with three states.
 * selectedArea null shows the overview; "mind" or "body" shows that area's
 * detail. Selection is local state, so it resets on reload and on returning
 * to the tab.
 */
export default function ProgressScreen() {
  const [selectedArea, setSelectedArea] = useState<ProgressArea | null>(null);
  const [period, setPeriod] = useState<PeriodId>("7d");
  const [dataMode, setDataMode] = useState<DataMode>("mine");
  const scrollRef = useRef<ScrollViewInstance>(null);
  const reduceMotion = useReducedMotion();
  // Fade only when switching views; the first render stays static so web
  // static rendering and hydration agree.
  const [hasSwitched, setHasSwitched] = useState(false);

  const { data, today } = useProgressData(dataMode);
  const [, , clearLog] = useStoredState("activity-log", EMPTY_LOG);
  const ctx = useMemo(() => buildContext(data, period, today), [data, period, today]);

  // Opening the tab always starts at the overview.
  useFocusEffect(
    useCallback(() => {
      setSelectedArea(null);
    }, []),
  );

  // Android hardware back steps out of a detail view first.
  useEffect(() => {
    if (!selectedArea) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      setSelectedArea(null);
      return true;
    });
    return () => subscription.remove();
  }, [selectedArea]);

  const showArea = (area: ProgressArea | null) => {
    setHasSwitched(true);
    setSelectedArea(area);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };
  // Tapping the side that is already selected returns to the overview.
  const toggleArea = (area: ProgressArea) => showArea(selectedArea === area ? null : area);

  const treeLabel = (area: ProgressArea) => {
    const records = within(areaRecords(data, area), ctx.window);
    return { count: records.length, days: countDistinctDays(records) };
  };
  const mind = treeLabel("mind");
  const body = treeLabel("body");
  const activityText = (count: number) => `${count} ${count === 1 ? "activity" : "activities"}`;

  return (
    <MobileScreen scrollRef={scrollRef}>
      <ScreenHeader title="Your Progress" subtitle="Your growth, at a glance." />
      <View style={styles.stack}>
        <DemoNotice mode={dataMode} onChange={setDataMode} />
        <PeriodSelector value={period} onChange={setPeriod} />

        <GrowthTree
          selected={selectedArea}
          onSelect={toggleArea}
          mindActivityLabel={activityText(mind.count)}
          bodyActivityLabel={activityText(body.count)}
          mindActiveDays={mind.days}
          bodyActiveDays={body.days}
        />

        <Animated.View
          key={selectedArea ?? "overview"}
          entering={hasSwitched && !reduceMotion ? FadeIn.duration(260) : undefined}
          style={styles.stack}
        >
          {selectedArea === null ? (
            <>
              <Text style={styles.instruction}>
                Select the Mind or Body side of your tree to explore your progress.
              </Text>
              <ProgressOverview ctx={ctx} onSelect={showArea} />
            </>
          ) : (
            <>
              <BackToOverview
                color={AREAS[selectedArea].color}
                soft={AREAS[selectedArea].soft}
                onPress={() => showArea(null)}
              />
              <View style={styles.detailHeader}>
                <Text accessibilityRole="header" style={[styles.detailTitle, { color: AREAS[selectedArea].color }]}>
                  {DETAIL_COPY[selectedArea].heading}
                </Text>
                <Text style={styles.detailSubtitle}>
                  {DETAIL_COPY[selectedArea].subtitle} Showing {periodPhrase(period)}.
                </Text>
              </View>
              {selectedArea === "mind" ? <MindDetail ctx={ctx} /> : <BodyDetail ctx={ctx} />}
            </>
          )}
        </Animated.View>
        {dataMode === "mine" && <SavedOnDeviceNote what="activity history" onDelete={clearLog} />}
      </View>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  instruction: {
    color: "#315C61",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  detailHeader: { gap: 6 },
  detailTitle: { fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  detailSubtitle: { color: COLORS.muted, fontSize: 13, lineHeight: 19 },
});
