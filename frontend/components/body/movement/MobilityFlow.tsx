import { useState } from "react";
import { View } from "react-native";

import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
} from "../../common/ActivityUI";
import { MoveCard, PainReminder } from "./MoveCard";
import { MOBILITY_FLOW } from "./moves";

export function MobilityFlow({ color, soft, onExit }: ActivityProps) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const move = MOBILITY_FLOW[index];
  const isLast = index === MOBILITY_FLOW.length - 1;
  const header = <ActivityHeader eyebrow="Movement & Flexibility" title="Mobility Flow" color={color} />;

  if (finished) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="🔄"
          title="Flow complete"
          message="You moved your shoulders, spine, hips, and ankles through easy ranges of motion. Nice."
          color={color}
          soft={soft}
          primary={{
            label: "Start from the top",
            onPress: () => {
              setIndex(0);
              setFinished(false);
            },
          }}
          secondary={{ label: "Back to Movement", onPress: onExit }}
        />
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <MoveCard
        move={move}
        stepKey={index}
        stepLabel={`Movement ${index + 1} of ${MOBILITY_FLOW.length}`}
        extra={move.reps}
        color={color}
        soft={soft}
      />
      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Previous"
          color={color}
          disabled={index === 0}
          onPress={() => setIndex(index - 1)}
        />
        <PrimaryButton
          flex
          label={isLast ? "Finish" : "Next"}
          color={color}
          onPress={() => (isLast ? setFinished(true) : setIndex(index + 1))}
        />
      </View>
      <PainReminder />
    </View>
  );
}
