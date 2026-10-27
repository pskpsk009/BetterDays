import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  ActivityProps,
  mentalStyles,
  PrimaryButton,
  SavedOnDeviceNote,
  SecondaryButton,
  SelectionChip,
} from "../../common/ActivityUI";
import { AppIcon, IconName } from "../../common/AppIcon";
import { daysBetween, todayKey, useStoredState } from "../../common/localStore";
import { NIGHT, NightBanner } from "./NightBanner";
import { ClockTime, formatDuration, formatTime, gradualSchedule, shortestShift } from "./sleepMath";
import {
  bedOnSchedule,
  compareToStart,
  currentBedTarget,
  isLastStep,
  NIGHTS_BEFORE_NEXT_STEP,
  nightOnSchedule,
  offBy,
  onScheduleAtStep,
  planSteps,
  SleepLog,
  SleepPlan,
  SleepWindow,
  wakeOnSchedule,
} from "./sleepSchedule";
import { SleepEnvironmentTips } from "./SleepEnvironment";
import { TimeField } from "./TimeField";

const PACES = [15, 30];
const WINDOWS: { value: SleepWindow; label: string }[] = [
  { value: 30, label: "Within 30 min" },
  { value: 60, label: "Within 1 hour" },
];
const MAX_SHOWN_STEPS = 8;
const KEEP_DAYS = 180;

type SleepData = { plan: SleepPlan | null; logs: SleepLog[] };
// Module-level so the stored-state fallback is stable between renders.
const EMPTY: SleepData = { plan: null, logs: [] };

export function ScheduleGuidance({ color, soft, onExit }: ActivityProps) {
  const [data, setData, clearData] = useStoredState<SleepData>("sleep", EMPTY);
  const [editing, setEditing] = useState(false);

  const banner = (
    <NightBanner
      eyebrow="Good Night Sleep"
      title="Sleep Schedule Guidance"
      subtitle="Small, steady shifts tend to stick better than big jumps."
    />
  );

  if (!data.plan || editing) {
    return (
      <View style={mentalStyles.screen}>
        {banner}
        <Planner
          color={color}
          soft={soft}
          initial={data.plan}
          onSave={(plan) => {
            setData((current) => ({ ...current, plan }));
            setEditing(false);
          }}
          onCancel={data.plan ? () => setEditing(false) : undefined}
        />
        <SleepEnvironmentTips color={color} soft={soft} />
        <SecondaryButton label="Back to Body" color={color} onPress={onExit} />
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {banner}
      <MySchedule
        color={color}
        soft={soft}
        plan={data.plan}
        logs={data.logs}
        onLog={(log) =>
          setData((current) => ({
            ...current,
            // One log per morning; logging again replaces it. Old nights are trimmed.
            logs: [log, ...current.logs.filter((item) => item.day !== log.day)]
              .filter((item) => daysBetween(item.day, todayKey()) < KEEP_DAYS)
              .sort((a, b) => (a.day < b.day ? 1 : -1)),
          }))
        }
        onNextStep={() =>
          setData((current) => (current.plan ? { ...current, plan: { ...current.plan, step: current.plan.step + 1 } } : current))
        }
        onEdit={() => setEditing(true)}
      />
      <SavedOnDeviceNote what="sleep schedule and sleep logs" onDelete={clearData} />
      <SleepEnvironmentTips color={color} soft={soft} />
      <SecondaryButton label="Back to Body" color={color} onPress={onExit} />
    </View>
  );
}

// ---------- Planner: current and preferred bedtime, wake time, window ----------

function Planner({
  color,
  soft,
  initial,
  onSave,
  onCancel,
}: {
  color: string;
  soft: string;
  initial: SleepPlan | null;
  onSave: (plan: SleepPlan) => void;
  onCancel?: () => void;
}) {
  const [current, setCurrent] = useState<ClockTime>(initial ? currentBedTarget(initial) : { hour: 2, minute: 0 });
  const [preferred, setPreferred] = useState<ClockTime>(initial?.bedtime ?? { hour: 0, minute: 0 });
  const [wake, setWake] = useState<ClockTime>(initial?.wake ?? { hour: 8, minute: 0 });
  const [pace, setPace] = useState(initial?.pace ?? 30);
  const [windowSize, setWindowSize] = useState<SleepWindow>(initial?.window ?? 30);

  const shift = shortestShift(current, preferred);
  const steps = gradualSchedule(current, preferred, pace);
  const shown = steps.slice(0, MAX_SHOWN_STEPS);
  const hidden = steps.length - shown.length;

  return (
    <>
      <Text style={mentalStyles.body}>
        Set your times, then save them to log each morning and see how closely you follow your schedule. Tap a time to change it.
      </Text>
      <TimeField label="Current bedtime" value={current} onChange={setCurrent} color={color} soft={soft} />
      <TimeField label="Preferred bedtime" value={preferred} onChange={setPreferred} color={color} soft={soft} />
      <TimeField label="Wake-up time" value={wake} onChange={setWake} color={color} soft={soft} />

      <Text style={mentalStyles.label}>SHIFT EACH STEP BY</Text>
      <View style={mentalStyles.chips}>
        {PACES.map((option) => (
          <SelectionChip key={option} label={`${option} min`} color={color} selected={option === pace} onPress={() => setPace(option)} />
        ))}
      </View>

      <Animated.View
        key={`${formatTime(current)}-${formatTime(preferred)}-${pace}`}
        entering={FadeIn.duration(220)}
        style={styles.timeline}
      >
        {shift === 0 ? (
          <Text style={styles.nightText}>
            You&apos;re already at your preferred bedtime. Keeping it steady is the goal now.
          </Text>
        ) : (
          <>
            <Text style={styles.nightMuted}>
              {formatDuration(Math.abs(shift))} {shift < 0 ? "earlier" : "later"} in total ·{" "}
              {steps.length} step{steps.length === 1 ? "" : "s"}
            </Text>
            <TimelineRow icon="weather-night" label="Current bedtime" time={current} first />
            {shown.map((step, index) => (
              <TimelineRow
                key={`${formatTime(step)}-${index}`}
                icon={index === steps.length - 1 ? "star-outline" : "circle-small"}
                label={index === steps.length - 1 ? "Preferred bedtime" : index === 0 ? "Initial target" : "Next target"}
                time={step}
              />
            ))}
            {hidden > 0 && (
              <Text style={styles.nightMuted}>
                …and {hidden} more step{hidden === 1 ? "" : "s"}. Continue adjusting gradually toward your preferred time.
              </Text>
            )}
          </>
        )}
      </Animated.View>
      <Text style={[mentalStyles.muted, styles.center]}>
        Stay at each step for a few nights, or longer if you need. The pace is flexible.
      </Text>

      <Text style={mentalStyles.label}>WHAT COUNTS AS ON SCHEDULE?</Text>
      <View style={mentalStyles.chips}>
        {WINDOWS.map((option) => (
          <SelectionChip
            key={option.value}
            label={option.label}
            color={color}
            selected={windowSize === option.value}
            onPress={() => setWindowSize(option.value)}
          />
        ))}
      </View>
      <Text style={mentalStyles.muted}>
        A night counts when both your bedtime and wake-up time are this close to your targets. Pick what feels doable.
      </Text>

      <PrimaryButton
        label={initial ? "Save changes" : "Save my schedule"}
        color={color}
        onPress={() =>
          onSave({
            startBedtime: current,
            bedtime: preferred,
            wake,
            window: windowSize,
            pace,
            step: 0,
            createdOn: todayKey(),
          })
        }
      />
      {onCancel && <SecondaryButton subtle label="Cancel" color={color} onPress={onCancel} />}
    </>
  );
}

// ---------- Saved schedule: targets, morning log, last 7 nights, progress ----------

function MySchedule({
  color,
  soft,
  plan,
  logs,
  onLog,
  onNextStep,
  onEdit,
}: {
  color: string;
  soft: string;
  plan: SleepPlan;
  logs: SleepLog[];
  onLog: (log: SleepLog) => void;
  onNextStep: () => void;
  onEdit: () => void;
}) {
  const today = todayKey();
  const targetBed = currentBedTarget(plan);
  const steps = planSteps(plan);
  const todays = logs.find((log) => log.day === today);
  const [relogging, setRelogging] = useState(false);
  const [bed, setBed] = useState<ClockTime>(todays?.bed ?? targetBed);
  const [wake, setWake] = useState<ClockTime>(todays?.wake ?? plan.wake);

  const readyForNext = !isLastStep(plan) && onScheduleAtStep(logs, plan) >= NIGHTS_BEFORE_NEXT_STEP;
  const comparison = compareToStart(logs, today);
  const windowLabel = plan.window === 30 ? "±30 min" : "±1 hour";

  function save() {
    onLog({ day: today, bed, wake, targetBed, targetWake: plan.wake, window: plan.window });
    setRelogging(false);
  }

  return (
    <>
      <View style={styles.timeline}>
        <Text style={styles.nightMuted}>
          MY SCHEDULE · {windowLabel}
          {steps.length > 1 ? ` · step ${Math.min(plan.step, steps.length - 1) + 1} of ${steps.length}` : ""}
        </Text>
        <TimelineRow icon="weather-night" label="Tonight's bedtime" time={targetBed} first />
        <TimelineRow icon="white-balance-sunny" label="Wake-up time" time={plan.wake} />
        {!isLastStep(plan) && (
          <Text style={styles.nightMuted}>Working toward {formatTime(plan.bedtime)}, one step at a time.</Text>
        )}
      </View>

      {readyForNext && (
        <Animated.View entering={FadeIn.duration(240)} style={[styles.card, { backgroundColor: soft }]}>
          <Text style={[mentalStyles.label, { color }]}>READY FOR THE NEXT STEP?</Text>
          <Text style={mentalStyles.body}>
            You&apos;ve been on schedule {NIGHTS_BEFORE_NEXT_STEP} nights at {formatTime(targetBed)}. Next target:{" "}
            {formatTime(steps[plan.step + 1])}.
          </Text>
          <View style={mentalStyles.row}>
            <PrimaryButton flex label="Move to next step" color={color} onPress={onNextStep} />
          </View>
          <Text style={mentalStyles.muted}>Or stay here longer. There&apos;s no rush.</Text>
        </Animated.View>
      )}

      {todays && !relogging ? (
        <Animated.View entering={FadeIn.duration(240)} style={[mentalStyles.card, styles.logged]}>
          <Text style={mentalStyles.label}>LAST NIGHT</Text>
          <Text style={styles.loggedTitle}>
            {nightOnSchedule(todays) ? "On schedule" : "Logged"}
          </Text>
          <Text style={mentalStyles.body}>
            Bed {formatTime(todays.bed)} · {describe(offBy(todays.targetBed, todays.bed), bedOnSchedule(todays))}
          </Text>
          <Text style={mentalStyles.body}>
            Up {formatTime(todays.wake)} · {describe(offBy(todays.targetWake, todays.wake), wakeOnSchedule(todays))}
          </Text>
          <SecondaryButton subtle label="Change last night" color={color} onPress={() => setRelogging(true)} />
        </Animated.View>
      ) : (
        <View style={[mentalStyles.card, styles.logged]}>
          <Text style={mentalStyles.label}>MORNING CHECK-IN</Text>
          <Text style={styles.loggedTitle}>How did last night go?</Text>
          <TimeField label="I went to bed at" value={bed} onChange={setBed} color={color} soft={soft} />
          <TimeField label="I woke up at" value={wake} onChange={setWake} color={color} soft={soft} />
          <PrimaryButton label="Save last night" color={color} onPress={save} />
        </View>
      )}

      <View style={[mentalStyles.card, styles.logged]}>
        <Text style={mentalStyles.label}>LAST 7 NIGHTS</Text>
        <LastSeven logs={logs} color={color} />
        <Text style={mentalStyles.muted}>Filled moon: on schedule · Ring: logged · Dot: not logged</Text>
      </View>

      <View style={[styles.card, { backgroundColor: soft }]}>
        <Text style={[mentalStyles.label, { color }]}>SINCE YOU STARTED</Text>
        {comparison.ready ? (
          <>
            <View style={styles.compare}>
              <View style={styles.compareCol}>
                <Text style={mentalStyles.muted}>First week</Text>
                <Text style={styles.compareValue}>
                  {comparison.start.onSchedule} of {comparison.start.logged}
                </Text>
              </View>
              <Text style={[styles.arrow, { color }]}>→</Text>
              <View style={styles.compareCol}>
                <Text style={mentalStyles.muted}>Last 7 days</Text>
                <Text style={styles.compareValue}>
                  {comparison.recent.onSchedule} of {comparison.recent.logged}
                </Text>
              </View>
            </View>
            <Text style={mentalStyles.muted}>Nights on schedule, out of the nights you logged.</Text>
          </>
        ) : (
          <Text style={mentalStyles.body}>
            Keep logging. After your first week, you&apos;ll see how your nights compare with when you started.
          </Text>
        )}
      </View>

      <SecondaryButton label="Change my schedule" color={color} onPress={onEdit} />
    </>
  );
}

function LastSeven({ logs, color }: { logs: SleepLog[]; color: string }) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return { key: todayKey(date), letter: date.toLocaleDateString(undefined, { weekday: "narrow" }) };
  });
  return (
    <View style={styles.week}>
      {days.map((day) => {
        const log = logs.find((item) => item.day === day.key);
        const on = log ? nightOnSchedule(log) : false;
        return (
          <View
            key={day.key}
            accessibilityLabel={`${day.key}: ${log ? (on ? "on schedule" : "logged, off schedule") : "not logged"}`}
            style={styles.day}
          >
            <View
              style={[
                styles.moon,
                log ? { borderColor: color } : styles.moonEmpty,
                on && { backgroundColor: color },
              ]}
            />
            <Text style={mentalStyles.muted}>{day.letter}</Text>
          </View>
        );
      })}
    </View>
  );
}

function describe(minutes: number, onSchedule: boolean) {
  if (minutes === 0) return "right on time";
  const amount = formatDuration(Math.abs(minutes));
  const side = minutes < 0 ? "earlier" : "later";
  return onSchedule ? `${amount} ${side}, within your window` : `${amount} ${side} than your target`;
}

function TimelineRow({
  icon,
  label,
  time,
  first = false,
}: {
  icon: IconName;
  label: string;
  time: ClockTime;
  first?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        {!first && <View style={styles.railLine} />}
        <AppIcon name={icon} size={18} color="#F6EFC8" />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.nightMuted}>{label}</Text>
        <Text style={styles.rowTime}>{formatTime(time)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  timeline: { padding: 18, borderRadius: 22, backgroundColor: NIGHT.deep, gap: 4 },
  nightText: { color: NIGHT.text, fontSize: 15, lineHeight: 22 },
  nightMuted: { color: NIGHT.muted, fontSize: 12, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 50 },
  rail: { width: 30, alignItems: "center", justifyContent: "center", alignSelf: "stretch" },
  railLine: {
    position: "absolute",
    top: -8,
    height: 18,
    width: 2,
    backgroundColor: NIGHT.lavender,
    opacity: 0.6,
  },
  rowCopy: { flex: 1 },
  rowTime: { color: NIGHT.text, fontSize: 18, fontWeight: "800", fontVariant: ["tabular-nums"] },
  card: { padding: 16, borderRadius: 18, gap: 8 },
  logged: { gap: 10 },
  loggedTitle: { color: "#1C4C55", fontSize: 18, fontWeight: "800" },
  week: { flexDirection: "row", justifyContent: "space-between" },
  day: { alignItems: "center", gap: 6 },
  moon: { width: 26, height: 26, borderRadius: 13, borderWidth: 2 },
  moonEmpty: { width: 10, height: 10, borderRadius: 5, borderWidth: 0, backgroundColor: "#D5E2E0", marginVertical: 8 },
  compare: { flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  compareCol: { alignItems: "center", gap: 2 },
  compareValue: { color: "#1C4C55", fontSize: 24, fontWeight: "800" },
  arrow: { fontSize: 24, fontWeight: "800" },
});
