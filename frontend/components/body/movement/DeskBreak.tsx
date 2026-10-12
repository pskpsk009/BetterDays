import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SessionTimer,
  useSessionTimer,
} from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { MoveCard, PainReminder } from "./MoveCard";
import { DESK_BREAK } from "./moves";

type TimerState = "off" | "running" | "paused" | "done";

export function DeskBreak({ color, soft, onExit }: ActivityProps) {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>("off");

  const move = DESK_BREAK[index];
  const isLast = index === DESK_BREAK.length - 1;
  const { remainingMs, reset } = useSessionTimer(
    move.seconds * 1000,
    timerState === "running",
    () => setTimerState("done"),
  );

  function goTo(nextIndex: number) {
    reset();
    setTimerState("off");
    setIndex(nextIndex);
  }

  function startTimer() {
    reset();
    setTimerState("running");
  }

  function restart() {
    goTo(0);
    setFinished(false);
  }

  const header = <ActivityHeader eyebrow="Movement & Flexibility" title="Desk Break" color={color} />;

  if (finished) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="🪑"
          title="Break done"
          message="However many moves you did, your body got a change of pace. Come back whenever you've been sitting for a while."
          color={color}
          soft={soft}
          primary={{ label: "Take another break", onPress: restart }}
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
        stepLabel={`Step ${index + 1} of ${DESK_BREAK.length}`}
        extra="Optional"
        color={color}
        soft={soft}
      >
        <View style={[styles.timerBox, { backgroundColor: soft }]}>
          {timerState === "off" ? (
            <SecondaryButton
              subtle
              label={`Start optional ${move.seconds}-sec timer`}
              color={color}
              onPress={startTimer}
            />
          ) : timerState === "done" ? (
            <Text style={[mentalStyles.body, styles.center]}>⏱️ Time&apos;s up. Move on whenever you&apos;re ready.</Text>
          ) : (
            <>
              <SessionTimer remainingMs={remainingMs} color={color} />
              <SecondaryButton
                subtle
                label={timerState === "running" ? "Pause timer" : "Resume timer"}
                color={color}
                onPress={() => setTimerState(timerState === "running" ? "paused" : "running")}
              />
            </>
          )}
        </View>
      </MoveCard>

      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Previous"
          color={color}
          disabled={index === 0}
          onPress={() => goTo(index - 1)}
        />
        <PrimaryButton
          flex
          label={isLast ? "Finish" : "Next"}
          color={color}
          onPress={() => (isLast ? setFinished(true) : goTo(index + 1))}
        />
      </View>
      <SecondaryButton
        subtle
        label="End break now"
        color={COLORS.muted}
        onPress={() => setFinished(true)}
      />
      <Text style={[mentalStyles.muted, styles.center]}>
        Every step is optional. Skip anything you don&apos;t feel like doing.
      </Text>
      <PainReminder />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  timerBox: { alignItems: "center", padding: 10, borderRadius: 14, gap: 2 },
});
