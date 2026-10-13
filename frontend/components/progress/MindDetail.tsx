import { View } from "react-native";

import { EmotionalBranchIcon } from "../emotional/EmotionalBranchIcon";
import { getEmotionalBranch } from "../emotional/branches";
import { BranchIcon } from "../mental/BranchIcon";
import { getMentalBranch } from "../mental/branches";
import { AssessmentComparison } from "./AssessmentComparison";
import { ProgressChart } from "./ProgressChart";
import { formatNumber, formatPercent } from "./progressMath";
import {
  concentrationDetail,
  mindfulnessDetail,
  ProgressContext,
  recentForArea,
  REFLECTION_STAGES,
  selfAwarenessDetail,
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
const rating = (value: number | null) => (value === null ? "—" : `${formatNumber(value, 1)}/5`);
const percent = (value: number | null) => (value === null ? "—" : formatPercent(value));

function MindfulnessMetrics({ ctx }: { ctx: ProgressContext }) {
  const branch = getMentalBranch("live-the-life");
  const d = mindfulnessDetail(ctx);
  return (
    <SectionCard
      eyebrow="Mind · A"
      title="Mindfulness"
      color={branch.color}
      icon={<BranchIcon branch="live-the-life" color={branch.color} size={40} />}
    >
      {d.sessions === 0 ? (
        <EmptyState message="Try Breathing Bubble or 5-Senses Grounding to start seeing your mindfulness practice here." />
      ) : (
        <>
          <MetricGrid>
            <MetricTile label="Practice minutes" value={`${d.totalMinutes} min`} detail={`${d.sessions} sessions`} source="Activity log" color={branch.color} />
            <MetricTile
              label="Practice days"
              value={`${d.practiceDays} of ${d.periodDays}`}
              detail="days with a mindfulness activity"
              source="Calculated"
              color={branch.color}
            />
            <MetricTile
              label="Grounding completed"
              value={percent(d.groundingRate)}
              detail={d.groundingStarted ? `${d.groundingDone} of ${d.groundingStarted} started` : NO_DATA}
              source="Calculated"
              color={branch.color}
            />
            <MetricTile
              label="Awareness after"
              value={rating(d.awarenessAfter)}
              detail={d.ratedSessions ? `${rating(d.awarenessBefore)} before, on average` : NO_DATA}
              source="Self-rated"
              color={branch.color}
            />
          </MetricGrid>

          <SubHeading>Practice minutes</SubHeading>
          <ProgressChart
            data={d.minutesSeries}
            color={branch.color}
            title="Mindfulness minutes"
            format={(value) => `${Math.round(value)} min`}
          />

          <SubHeading>Present-moment awareness, before and after</SubHeading>
          {d.ratedSessions === 0 ? (
            <EmptyState compact message="Rate how present you feel before and after an activity to see this comparison." />
          ) : (
            <View style={progressStyles.stack}>
              <BarRow label="Before activities" value={d.awarenessBefore ?? 0} max={5} color={branch.color} faded valueText={rating(d.awarenessBefore)} />
              <BarRow label="After activities" value={d.awarenessAfter ?? 0} max={5} color={branch.color} valueText={rating(d.awarenessAfter)} />
            </View>
          )}
        </>
      )}
      <MetricExplainer
        color={branch.color}
        items={[
          { term: "Practice minutes", text: "Total time spent in mindfulness activities during the period." },
          { term: "Practice days", text: "How many days included at least one mindfulness activity." },
          { term: "Grounding completed", text: "Grounding exercises finished, compared with the ones you started." },
          {
            term: "Present-moment awareness",
            text: "Your own 1–5 rating of how present you felt, before and after an activity. Only sessions with both ratings are compared.",
          },
        ]}
      />
    </SectionCard>
  );
}

function SelfAwarenessMetrics({ ctx }: { ctx: ProgressContext }) {
  const branch = getEmotionalBranch("self-awareness");
  const d = selfAwarenessDetail(ctx);
  return (
    <SectionCard
      eyebrow="Mind · B"
      title="Self-Awareness"
      color={branch.color}
      icon={<EmotionalBranchIcon branch="self-awareness" color={branch.color} size={40} />}
    >
      {d.sessions === 0 ? (
        <EmptyState message="Try Emotion Explorer or Reflection Detective to start seeing your self-awareness practice here." />
      ) : (
        <>
          <MetricGrid>
            <MetricTile label="Emotion confidence" value={rating(d.emotionConfidence)} detail="average self-rating" source="Self-rated" color={branch.color} />
            <MetricTile
              label="Reflections completed"
              value={percent(d.completionRate)}
              detail={`${d.completed} of ${d.sessions} reached all four stages`}
              source="Calculated"
              color={branch.color}
            />
            <MetricTile
              label="Next steps followed"
              value={percent(d.followThroughRate)}
              detail={d.stepsPlanned ? `${d.stepsDone} of ${d.stepsPlanned} planned steps` : NO_DATA}
              source="Calculated"
              color={branch.color}
            />
          </MetricGrid>

          <SubHeading>Reflection stages reached</SubHeading>
          <View style={progressStyles.stack}>
            {REFLECTION_STAGES.map((stage, index) => (
              <BarRow
                key={stage.title}
                label={`${index + 1}. ${stage.title}: ${stage.prompt}`}
                value={d.stageCounts[index]}
                max={d.sessions}
                color={branch.color}
                valueText={`${d.stageCounts[index]}`}
              />
            ))}
          </View>

          <SubHeading>Reflections over time</SubHeading>
          <ProgressChart
            data={d.reflectionSeries}
            color={branch.color}
            title="Reflections"
            format={(value) => `${Math.round(value)}`}
          />
        </>
      )}
      <GentleNote>
        Your reflections stay private. This page only counts stages and ratings; it never shows what you wrote.
      </GentleNote>
      <MetricExplainer
        color={branch.color}
        items={[
          { term: "Emotion confidence", text: "Your 1–5 rating of how confident you felt naming an emotion." },
          {
            term: "Reflections completed",
            text: "Reflections that reached all four stages: situation, thought, emotion and next step.",
          },
          { term: "Next steps followed", text: "Next steps you chose and later marked done, out of those you planned." },
        ]}
      />
    </SectionCard>
  );
}

function ConcentrationMetrics({ ctx }: { ctx: ProgressContext }) {
  const branch = getMentalBranch("find-your-focus");
  const d = concentrationDetail(ctx);
  return (
    <SectionCard
      eyebrow="Mind · C"
      title="Concentration"
      color={branch.color}
      icon={<BranchIcon branch="find-your-focus" color={branch.color} size={40} />}
    >
      {d.sessions === 0 ? (
        <EmptyState message="Try a Focus Sprint or Target Tap to start seeing your focus sessions here." />
      ) : (
        <>
          <MetricGrid>
            <MetricTile
              label="Average session"
              value={d.averageMinutes === null ? "—" : `${formatNumber(d.averageMinutes, 1)} min`}
              detail={`${d.sessions} focus sessions`}
              source="Calculated"
              color={branch.color}
            />
            <MetricTile
              label="Attention-game accuracy"
              value={percent(d.accuracy)}
              detail={d.gameRounds ? `across ${d.gameRounds} Target Tap rounds` : NO_DATA}
              source="Calculated"
              color={branch.color}
            />
            <MetricTile label="Perceived focus" value={rating(d.perceivedFocus)} detail="average self-rating" source="Self-rated" color={branch.color} />
            <MetricTile
              label="Distractions noticed"
              value={d.distractionsPerSession === null ? "—" : `${formatNumber(d.distractionsPerSession, 1)}`}
              detail={
                d.trackedSessions
                  ? `per tracked session · ${d.distractionFreeSessions} of ${d.trackedSessions} had none`
                  : NO_DATA
              }
              source="Activity log"
              color={branch.color}
            />
          </MetricGrid>

          <SubHeading>Average focus-session length</SubHeading>
          <ProgressChart
            data={d.durationSeries}
            kind="line"
            color={branch.color}
            title="Average focus minutes"
            format={(value) => `${formatNumber(value, 1)} min`}
          />
        </>
      )}
      <GentleNote>
        Noticing a distraction is part of the practice, not a mistake. These numbers describe your sessions; they are
        not a test or a measure of your abilities.
      </GentleNote>
      <MetricExplainer
        color={branch.color}
        items={[
          { term: "Average session", text: "Typical length of a focus session during the period." },
          { term: "Attention-game accuracy", text: "Correct answers divided by all answers in attention games." },
          { term: "Perceived focus", text: "Your 1–5 rating of how focused you felt." },
          { term: "Distractions noticed", text: "Distractions you recorded in Distraction Tracker sessions." },
        ]}
      />
    </SectionCard>
  );
}

export function MindDetail({ ctx }: { ctx: ProgressContext }) {
  const area = AREAS.mind;
  const isDemo = ctx.data.source === "demo";
  return (
    <View style={progressStyles.stack}>
      <MindfulnessMetrics ctx={ctx} />
      <SelfAwarenessMetrics ctx={ctx} />
      <ConcentrationMetrics ctx={ctx} />
      <SectionCard eyebrow="Check-ins" title="Assessment comparison" color={area.color}>
        <AssessmentComparison assessments={ctx.data.assessments} color={area.color} isDemo={isDemo} />
      </SectionCard>
      <SectionCard eyebrow="History" title="Recent Mind activities" color={area.color}>
        <RecentList items={recentForArea(ctx.data, "mind", 6)} today={ctx.today} />
      </SectionCard>
      <GentleNote>
        {`Showing ${periodPhrase(ctx.period)}. Mind progress reflects activities and self-ratings. It is not a diagnosis or an assessment of your mental health.`}
      </GentleNote>
    </View>
  );
}
