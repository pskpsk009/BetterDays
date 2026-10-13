import { View } from "react-native";

import { BodyBranchIcon } from "../body/BodyBranchIcon";
import { BODY_BRANCHES, BodyBranchId } from "../body/branches";
import { FOOD_GROUPS, GROUP_ORDER } from "../body/fuel/plateFeedback";
import { formatDuration, formatTime } from "../body/sleep/sleepMath";
import { ProgressChart } from "./ProgressChart";
import { formatNumber, formatPercent, MIN_CONSISTENCY_NIGHTS } from "./progressMath";
import {
  hydrationDetail,
  movementDetail,
  nutritionDetail,
  ProgressContext,
  recentForArea,
  sleepDetail,
} from "./progressSummary";
import {
  AREAS,
  BarRow,
  EmptyState,
  GentleNote,
  MetricExplainer,
  MetricGrid,
  MetricTile,
  periodPhrase,
  progressStyles,
  RecentList,
  SectionCard,
  SubHeading,
} from "./ProgressUI";

const NO_DATA = "Not enough data yet";
const count = (value: number) => `${Math.round(value)}`;

function branchOf(id: BodyBranchId) {
  const branch = BODY_BRANCHES.find((item) => item.id === id);
  if (!branch) throw new Error(`Unknown body branch: ${id}`);
  return branch;
}

function HydrationMetrics({ ctx }: { ctx: ProgressContext }) {
  const branch = branchOf("fuel");
  const d = hydrationDetail(ctx);
  return (
    <SectionCard eyebrow="Body · A" title="Hydration" color={branch.color} icon={<BodyBranchIcon branch="fuel" color={branch.color} size={40} />}>
      {d.checkins === 0 ? (
        <EmptyState message="Use Hydration Check-in to log a drink and your activity will appear here." />
      ) : (
        <>
          <MetricGrid>
            <MetricTile label="Check-ins" value={count(d.checkins)} detail={`on ${d.activeDays} of ${d.periodDays} days`} source="Activity log" color={branch.color} />
            <MetricTile label="Drinks logged" value={count(d.drinks)} detail="with the glass and bottle controls" source="Activity log" color={branch.color} />
            <MetricTile
              label="Estimated water"
              value={d.estimatedWaterMl === null ? "—" : `${formatNumber(d.estimatedWaterMl / 1000, 1)} L`}
              detail={
                d.estimatedWaterMl === null
                  ? "No drink sizes logged yet"
                  : `from the ${d.sizedCheckins} of ${d.checkins} check-ins that included a size`
              }
              source="Calculated"
              color={branch.color}
            />
          </MetricGrid>
          <SubHeading>Check-ins</SubHeading>
          <ProgressChart data={d.series} color={branch.color} title="Hydration check-ins" format={count} />
        </>
      )}
      <GentleNote>
        Check-ins show when you paused to notice your drinks. They don't record everything you drink, so they can't
        tell whether you are hydrated.
      </GentleNote>
    </SectionCard>
  );
}

function NutritionMetrics({ ctx }: { ctx: ProgressContext }) {
  const branch = branchOf("fuel");
  const d = nutritionDetail(ctx);
  return (
    <SectionCard eyebrow="Body · B" title="Balanced Nutrition" color={branch.color} icon={<BodyBranchIcon branch="fuel" color={branch.color} size={40} />}>
      {d.plates === 0 ? (
        <EmptyState message="Try Build a Balanced Plate to start seeing your plate-building activities here." />
      ) : (
        <>
          <MetricGrid>
            <MetricTile label="Plates built" value={count(d.plates)} detail={`on ${d.activeDays} different days`} source="Activity log" color={branch.color} />
          </MetricGrid>
          <SubHeading>Food groups you included</SubHeading>
          <View style={progressStyles.stack}>
            {GROUP_ORDER.map((group) => (
              <BarRow
                key={group}
                label={`${FOOD_GROUPS[group].icon} ${FOOD_GROUPS[group].name}`}
                value={d.groupCounts[group]}
                max={d.plates}
                color={branch.color}
                valueText={`${d.groupCounts[group]} of ${d.plates} plates`}
              />
            ))}
          </View>
          <SubHeading>Plates built over time</SubHeading>
          <ProgressChart data={d.series} color={branch.color} title="Balanced Plate activities" format={count} />
        </>
      )}
      <GentleNote>
        The plate is a learning activity with five equal slices. It isn't a dietary rule or a measure of what you
        eat, and this page never tracks calories or weight.
      </GentleNote>
    </SectionCard>
  );
}

function MovementMetrics({ ctx }: { ctx: ProgressContext }) {
  const branch = branchOf("movement");
  const d = movementDetail(ctx);
  const most = Math.max(1, ...d.byActivity.map((item) => item.count));
  return (
    <SectionCard
      eyebrow="Body · C"
      title="Movement and Flexibility"
      color={branch.color}
      icon={<BodyBranchIcon branch="movement" color={branch.color} size={40} />}
    >
      {d.sessions === 0 ? (
        <EmptyState message="Try a Desk Break or Daily Stretch whenever it suits you, and it will appear here." />
      ) : (
        <>
          <MetricGrid>
            <MetricTile label="Sessions" value={count(d.sessions)} detail={`on ${d.activeDays} different days`} source="Activity log" color={branch.color} />
            <MetricTile label="Stretching routines" value={count(d.stretching)} detail="Daily Stretch and Mobility Flow" source="Activity log" color={branch.color} />
            <MetricTile
              label="Time moving"
              value={d.totalMinutes === null ? "—" : formatDuration(d.totalMinutes)}
              detail={
                d.averageMinutes === null
                  ? NO_DATA
                  : `about ${Math.round(d.averageMinutes)} min per timed routine (${d.timedSessions} of ${d.sessions})`
              }
              source="Calculated"
              color={branch.color}
            />
          </MetricGrid>
          <SubHeading>Routines completed</SubHeading>
          <View style={progressStyles.stack}>
            {d.byActivity.map((item) => (
              <BarRow key={item.id} label={item.label} value={item.count} max={most} color={branch.color} valueText={count(item.count)} />
            ))}
          </View>
          <SubHeading>Sessions over time</SubHeading>
          <ProgressChart data={d.series} color={branch.color} title="Movement sessions" format={count} />
        </>
      )}
      <GentleNote>
        Any movement counts, and there's no target to hit. Rest days are part of looking after your body too.
      </GentleNote>
    </SectionCard>
  );
}

function SleepMetrics({ ctx }: { ctx: ProgressContext }) {
  const branch = branchOf("sleep");
  const d = sleepDetail(ctx);
  const spread = d.bedtimeSpread;
  return (
    <SectionCard eyebrow="Body · D" title="Sleep" color={branch.color} icon={<BodyBranchIcon branch="sleep" color={branch.color} size={40} />}>
      {d.nightsLogged === 0 && d.routines === 0 ? (
        <EmptyState message="Log a bedtime and wake time, or try the Relaxing Bedtime Routine, to see your sleep activity here." />
      ) : (
        <>
          <MetricGrid>
            <MetricTile
              label="Average sleep"
              value={d.averageMinutes === null ? "—" : formatDuration(Math.round(d.averageMinutes))}
              detail={d.completeNights ? `from ${d.completeNights} nights with both times` : NO_DATA}
              source="Calculated"
              color={branch.color}
            />
            <MetricTile
              label="Typical bedtime"
              value={d.averageBedtime ? formatTime(d.averageBedtime) : "—"}
              detail={d.averageWake ? `waking around ${formatTime(d.averageWake)}` : NO_DATA}
              source="Calculated"
              color={branch.color}
            />
            <MetricTile
              label="Bedtime routines"
              value={count(d.routines)}
              detail={d.routineStepRate === null ? NO_DATA : `${formatPercent(d.routineStepRate)} of routine steps done`}
              source="Activity log"
              color={branch.color}
            />
          </MetricGrid>

          <SubHeading>Hours of sleep</SubHeading>
          <ProgressChart
            data={d.durationSeries}
            kind="line"
            color={branch.color}
            title="Average hours of sleep"
            format={(value) => `${formatNumber(value, 1)} h`}
            maxValue={12}
            emptyMessage="Log a few nights with both a bedtime and wake time to see this trend."
          />

          <SubHeading>Schedule consistency</SubHeading>
          {spread === null ? (
            <EmptyState
              compact
              message={`Not enough data yet. After ${MIN_CONSISTENCY_NIGHTS} or more logged bedtimes, you'll see how much they vary.`}
            />
          ) : (
            <GentleNote>
              {`Your bedtimes were usually within about ${Math.round(spread)} minutes of ${
                d.averageBedtime ? formatTime(d.averageBedtime) : "your typical time"
              }${d.wakeSpread === null ? "" : `, and wake times within about ${Math.round(d.wakeSpread)} minutes`}. Many people find a steadier rhythm helps them feel rested, and some variation is completely normal.`}
            </GentleNote>
          )}
        </>
      )}
      <GentleNote>
        Sleep entries here describe what was logged. They can't diagnose a sleep problem, and one night never tells the
        whole story.
      </GentleNote>
      <MetricExplainer
        color={branch.color}
        items={[
          { term: "Average sleep", text: "Time from bedtime to wake time, including nights that cross midnight." },
          { term: "Typical bedtime", text: "The average of your logged bedtimes and wake times." },
          { term: "Schedule consistency", text: "How far, on average, each bedtime was from your typical bedtime." },
        ]}
      />
    </SectionCard>
  );
}

function BodyActivityOverview({ ctx }: { ctx: ProgressContext }) {
  const area = AREAS.body;
  const hydration = hydrationDetail(ctx);
  const plates = nutritionDetail(ctx);
  const movement = movementDetail(ctx);
  const sleep = sleepDetail(ctx);
  const rows = [
    { label: "Hydration check-ins", value: hydration.checkins },
    { label: "Balanced Plate activities", value: plates.plates },
    { label: "Movement and stretching", value: movement.sessions },
    { label: "Sleep logs and bedtime routines", value: sleep.nightsLogged + sleep.routines },
  ];
  const most = Math.max(1, ...rows.map((row) => row.value));
  return (
    <SectionCard eyebrow="At a glance" title="Body activity overview" color={area.color}>
      <View style={progressStyles.stack}>
        {rows.map((row) => (
          <BarRow key={row.label} label={row.label} value={row.value} max={most} color={area.color} valueText={count(row.value)} />
        ))}
      </View>
      <GentleNote>
        These are activities completed in the app. They show the habits you've practised, not measurements of your
        health.
      </GentleNote>
    </SectionCard>
  );
}

export function BodyDetail({ ctx }: { ctx: ProgressContext }) {
  return (
    <View style={progressStyles.stack}>
      <BodyActivityOverview ctx={ctx} />
      <HydrationMetrics ctx={ctx} />
      <NutritionMetrics ctx={ctx} />
      <MovementMetrics ctx={ctx} />
      <SleepMetrics ctx={ctx} />
      <SectionCard eyebrow="History" title="Recent Body activities" color={AREAS.body.color}>
        <RecentList items={recentForArea(ctx.data, "body", 6)} today={ctx.today} />
      </SectionCard>
      <GentleNote>
        {`Showing ${periodPhrase(ctx.period)}. Body progress counts activities you completed. It is not medical or nutritional advice.`}
      </GentleNote>
    </View>
  );
}
