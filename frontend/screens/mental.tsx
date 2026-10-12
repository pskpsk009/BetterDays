import { ActivityProps } from "../components/common/ActivityUI";
import { COLORS } from "../components/common/AppShell";
import { BranchExplorer } from "../components/common/BranchExplorer";
import { BranchIcon } from "../components/mental/BranchIcon";
import { ActivityId, BranchId, BRANCHES } from "../components/mental/branches";
import { BreathingBubble } from "../components/mental/BreathingBubble";
import { ControlSort } from "../components/mental/ControlSort";
import { DistractionTracker } from "../components/mental/DistractionTracker";
import { EmotionExplorer } from "../components/mental/EmotionExplorer";
import { FocusSprint } from "../components/mental/FocusSprint";
import { ReflectionDetective } from "../components/mental/ReflectionDetective";
import { SensesGrounding } from "../components/mental/SensesGrounding";
import { TargetTap } from "../components/mental/TargetTap";
import { WatchThoughts } from "../components/mental/WatchThoughts";

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
  return (
    <BranchExplorer
      title="Mental Development"
      subtitle="A calmer, clearer mind, one small practice at a time."
      eyebrow="Mind space"
      introTitle="Where would you like to start?"
      accent={COLORS.teal}
      branches={BRANCHES}
      activities={ACTIVITIES}
      renderIcon={(branch, size) => (
        <BranchIcon branch={branch.id as BranchId} color={branch.color} size={size} />
      )}
    />
  );
}
