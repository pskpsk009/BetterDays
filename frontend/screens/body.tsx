import { ActivityProps } from "../components/common/ActivityUI";
import { BranchExplorer } from "../components/common/BranchExplorer";
import { BodyBranchIcon } from "../components/body/BodyBranchIcon";
import { BODY_BRANCHES, BodyActivityId, BodyBranchId } from "../components/body/branches";
import { BalancedPlate } from "../components/body/fuel/BalancedPlate";
import { DrinkDetective } from "../components/body/fuel/DrinkDetective";
import { HydrationCheckin } from "../components/body/fuel/HydrationCheckin";
import { BodyScan } from "../components/body/movement/BodyScan";
import { DailyStretch } from "../components/body/movement/DailyStretch";
import { DeskBreak } from "../components/body/movement/DeskBreak";
import { MobilityFlow } from "../components/body/movement/MobilityFlow";
import { MovementDice } from "../components/body/movement/MovementDice";
import { BedtimeRoutine } from "../components/body/sleep/BedtimeRoutine";
import { NightBanner } from "../components/body/sleep/NightBanner";
import { ScheduleGuidance } from "../components/body/sleep/ScheduleGuidance";
import { SleepEnvironment } from "../components/body/sleep/SleepEnvironment";
import { SleepPlan } from "../components/body/sleep/SleepPlan";

const ACTIVITIES: Record<BodyActivityId, (props: ActivityProps) => React.ReactNode> = {
  hydration: HydrationCheckin,
  "balanced-plate": BalancedPlate,
  "drink-detective": DrinkDetective,
  "daily-stretch": DailyStretch,
  "desk-break": DeskBreak,
  "mobility-flow": MobilityFlow,
  "movement-dice": MovementDice,
  "body-scan": BodyScan,
  "bedtime-routine": BedtimeRoutine,
  "sleep-environment": SleepEnvironment,
  "sleep-plan": SleepPlan,
  "schedule-guidance": ScheduleGuidance,
};

export default function BodyScreen() {
  return (
    <BranchExplorer
      title="Body Functions"
      subtitle="Small choices that help you feel more like you."
      eyebrow="Body space"
      introTitle="Your daily foundations"
      accent="#247F7B"
      branches={BODY_BRANCHES}
      activities={ACTIVITIES}
      renderIcon={(branch, size) => (
        <BodyBranchIcon branch={branch.id as BodyBranchId} color={branch.color} size={size} />
      )}
      renderHero={(branch) =>
        branch.id === "sleep" ? (
          <NightBanner eyebrow={branch.tagline} title={branch.title} subtitle={branch.description} />
        ) : null
      }
    />
  );
}
