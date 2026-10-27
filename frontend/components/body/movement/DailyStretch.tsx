import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SelectionChip,
  SessionTimer,
  useSessionTimer,
} from "../../common/ActivityUI";
import { AppIcon } from "../../common/AppIcon";
import { COLORS } from "../../common/AppShell";
import { MoveCard, PainReminder } from "./MoveCard";
import { STRETCH_ROUTINES } from "./moves";

type Status = "setup" | "running" | "paused" | "done";

export function DailyStretch({ color, soft, onExit }: ActivityProps) {
  const [routineIndex, setRoutineIndex] = useState(0);
  const [status, setStatus] = useState<Status>("setup");
  const [moveIndex, setMoveIndex] = useState(0);

  const routine = STRETCH_ROUTINES[routineIndex];
  const move = routine.moves[moveIndex];
  const isLast = moveIndex === routine.moves.length - 1;

  const { remainingMs, reset } = useSessionTimer(
    routine.secondsPerMove * 1000,
    status === "running",
    () => next(),
  );

  function next() {
    if (isLast) {
      setStatus("done");
      return;
    }
    reset();
    setMoveIndex((index) => index + 1);
  }

  function start() {
    reset();
    setMoveIndex(0);
    setStatus("running");
  }

  const header = <ActivityHeader eyebrow="Movement & Flexibility" title="Daily Stretch" color={color} />;

  if (status === "done") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="human-handsup"
          title="Routine complete"
          message="Nice work taking a few minutes for yourself. Notice how your body feels now."
          color={color}
          soft={soft}
          primary={{ label: "Stretch again", onPress: () => setStatus("setup") }}
          secondary={{ label: "Back to Body", onPress: onExit }}
        />
      </View>
    );
  }

  if (status === "setup") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.body}>
          A short, guided routine of gentle stretches. Follow one movement at a
          time, and skip anything that doesn&apos;t feel right.
        </Text>
        <Text style={mentalStyles.label}>ROUTINE LENGTH</Text>
        <View style={mentalStyles.chips}>
          {STRETCH_ROUTINES.map((option, index) => (
            <SelectionChip
              key={option.minutes}
              label={`${option.minutes} min`}
              color={color}
              selected={index === routineIndex}
              onPress={() => setRoutineIndex(index)}
            />
          ))}
        </View>
        <View style={[mentalStyles.card, styles.preview]}>
          <Text style={mentalStyles.label}>
            {routine.moves.length} MOVES · {routine.secondsPerMove} SEC EACH
          </Text>
          {routine.moves.map((item, index) => (
            <Text key={`${item.id}-${index}`} style={mentalStyles.body}>
              <AppIcon name={item.icon} size={16} color={color} />  {item.name}
            </Text>
          ))}
        </View>
        <PainReminder />
        <PrimaryButton label={`Start ${routine.minutes}-minute routine`} color={color} onPress={start} />
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <MoveCard
        move={move}
        stepKey={`${routineIndex}-${moveIndex}`}
        stepLabel={`Move ${moveIndex + 1} of ${routine.moves.length}`}
        extra={`${routine.secondsPerMove} sec`}
        color={color}
        soft={soft}
      >
        <View style={styles.timer}>
          <SessionTimer remainingMs={remainingMs} color={color} />
          {status === "paused" && <Text style={mentalStyles.muted}>Paused</Text>}
        </View>
      </MoveCard>

      <View style={mentalStyles.row}>
        <PrimaryButton
          flex
          label={status === "running" ? "Pause" : "Resume"}
          color={color}
          onPress={() => setStatus(status === "running" ? "paused" : "running")}
        />
        <SecondaryButton flex label={isLast ? "Finish" : "Next"} color={color} onPress={next} />
      </View>
      <View style={mentalStyles.row}>
        <SecondaryButton flex subtle label="Restart" color={COLORS.muted} onPress={start} />
        <SecondaryButton flex subtle label="End routine" color={COLORS.muted} onPress={() => setStatus("done")} />
      </View>
      <PainReminder />
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { gap: 8 },
  timer: { alignItems: "center", gap: 2, paddingTop: 4 },
});
