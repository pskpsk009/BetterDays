import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { COLORS } from "../common/AppShell";
import { formatClock } from "../common/time";
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
} from "../common/ActivityUI";
import { DISRUPTORS, DisruptorId, getDisruptor, getFocusPlan, setSprintResult } from "./focusPlan";

const DURATIONS = [5, 10, 15, 25];
const TASK_IDEAS = ["Studying", "Reading", "Coding", "Writing"];
const REFOCUS_PROMPTS = [
  "That's okay. Notice what pulled you away, then gently come back to",
  "Distractions happen. Take one breath and return to",
  "No problem. Set it aside for now and pick up",
];
// Long enough to tap what pulled you away.
const PROMPT_MS = 15000;

type Status = "setup" | "running" | "paused" | "finished" | "ended";

export function FocusSprint({ color, soft, onExit, openActivity }: ActivityProps) {
  const [minutes, setMinutes] = useState(10);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState<Status>("setup");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [promptCount, setPromptCount] = useState(0);
  // What pulled the user away this sprint, tapped from the refocus prompt.
  const [disruptors, setDisruptors] = useState<DisruptorId[]>([]);
  // A plan made in Distraction Tracker, shown as reminders.
  const [plan] = useState(() => getFocusPlan());
  const { elapsedMs, remainingMs, reset } = useSessionTimer(
    minutes * 60 * 1000,
    status === "running",
    () => setStatus("finished"),
  );

  const taskLabel = task.trim() || "your task";
  const isActive = status === "running" || status === "paused";

  // The refocus prompt hides itself after a few seconds.
  useEffect(() => {
    if (!prompt) return;
    const timeout = setTimeout(() => setPrompt(null), PROMPT_MS);
    return () => clearTimeout(timeout);
  }, [prompt, promptCount]);

  function start() {
    reset();
    setPrompt(null);
    setDisruptors([]);
    setStatus("running");
  }

  function showRefocus() {
    setPrompt(REFOCUS_PROMPTS[promptCount % REFOCUS_PROMPTS.length]);
    setPromptCount((count) => count + 1);
  }

  function noteDisruptor(id: DisruptorId) {
    setDisruptors((current) => [...current, id]);
    setPrompt(null);
  }

  function newSession() {
    reset();
    setPrompt(null);
    setDisruptors([]);
    setStatus("setup");
  }

  const header = <ActivityHeader eyebrow="Find Your Focus" title="Focus Sprint" color={color} />;

  if (status === "finished" || status === "ended") {
    const finished = status === "finished";
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge={finished ? "check-circle-outline" : "timer-outline"}
          title={finished ? "Sprint complete" : "Sprint ended"}
          message={
            finished
              ? `You stayed with ${taskLabel} for ${minutes} minutes. Consider a short break: stretch, drink some water, or look into the distance.`
              : `You spent ${formatClock(elapsedMs / 1000)} on ${taskLabel}. Stopping early is fine. Every bit of focused time counts.`
          }
          color={color}
          soft={soft}
          primary={{ label: "Start another sprint", onPress: newSession }}
          secondary={{ label: "Back to Find Your Focus", onPress: onExit }}
        />
        {disruptors.length > 0 && (
          <View style={[styles.pulled, { backgroundColor: soft }]}>
            <Text style={[mentalStyles.label, { color }]}>PULLED AWAY {disruptors.length}×</Text>
            <Text style={mentalStyles.body}>
              {[...new Set(disruptors)].map((id) => `${getDisruptor(id).icon} ${getDisruptor(id).label}`).join("  ·  ")}
            </Text>
          </View>
        )}
        {openActivity && (
          <SecondaryButton
            label="Fix what disrupted me"
            color={color}
            onPress={() => {
              setSprintResult({ task: task.trim() || "Focus time", minutes, finished, disruptors });
              openActivity("distraction-tracker");
            }}
          />
        )}
      </View>
    );
  }

  if (isActive) {
    return (
      <View style={mentalStyles.screen}>
        <View style={[mentalStyles.card, styles.focusPanel]}>
          <Text style={mentalStyles.label}>FOCUSING ON</Text>
          <Text numberOfLines={2} style={styles.taskName}>
            {task.trim() || "Focus time"}
          </Text>
          <View style={styles.timerWrap}>
            <SessionTimer remainingMs={remainingMs} color={color} size="large" />
            {status === "paused" && <Text style={mentalStyles.muted}>Paused</Text>}
          </View>
          <View style={mentalStyles.row}>
            <PrimaryButton
              flex
              label={status === "running" ? "Pause" : "Resume"}
              color={color}
              onPress={() => setStatus(status === "running" ? "paused" : "running")}
            />
            <SecondaryButton flex label="End" color={color} onPress={() => setStatus("ended")} />
          </View>
        </View>

        {plan.length > 0 && <PlanReminder plan={plan} color={color} soft={soft} />}

        {prompt ? (
          <Animated.View
            key={promptCount}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            accessibilityLiveRegion="polite"
            style={[styles.prompt, { backgroundColor: soft, borderColor: color }]}
          >
            <Text style={mentalStyles.body}>
              {prompt} <Text style={styles.promptTask}>{taskLabel}</Text>.
            </Text>
            <Text style={[mentalStyles.label, styles.spaced]}>WHAT PULLED YOU AWAY? (OPTIONAL)</Text>
            <View style={styles.disruptorChips}>
              {DISRUPTORS.map((item) => (
                <SelectionChip
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  color={color}
                  selected={false}
                  onPress={() => noteDisruptor(item.id)}
                />
              ))}
            </View>
            <SecondaryButton subtle label="Back to it" color={color} onPress={() => setPrompt(null)} />
          </Animated.View>
        ) : (
          <SecondaryButton
            subtle
            label="I'm distracted"
            color={COLORS.muted}
            disabled={status !== "running"}
            onPress={showRefocus}
          />
        )}
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Text style={mentalStyles.body}>
        Pick one task and a short block of time. When the timer is running,
        give that task your full attention.
      </Text>
      <View style={[mentalStyles.card, styles.panel]}>
        <Text style={mentalStyles.label}>WHAT WILL YOU FOCUS ON?</Text>
        <TextInput
          accessibilityLabel="Task to focus on"
          maxLength={60}
          onChangeText={setTask}
          placeholder="e.g. Chapter 3 reading"
          placeholderTextColor={COLORS.muted}
          returnKeyType="done"
          style={[mentalStyles.input, styles.taskInput]}
          value={task}
        />
        <View style={mentalStyles.chips}>
          {TASK_IDEAS.map((idea) => (
            <SelectionChip
              key={idea}
              label={idea}
              color={color}
              selected={task === idea}
              onPress={() => setTask(idea)}
            />
          ))}
        </View>
        <Text style={[mentalStyles.label, styles.spaced]}>HOW LONG?</Text>
        <View style={mentalStyles.chips}>
          {DURATIONS.map((option) => (
            <SelectionChip
              key={option}
              label={`${option} min`}
              color={color}
              selected={option === minutes}
              onPress={() => setMinutes(option)}
            />
          ))}
        </View>
      </View>
      {plan.length > 0 && <PlanReminder plan={plan} color={color} soft={soft} />}
      <PrimaryButton label={`Start ${minutes}-minute sprint`} color={color} onPress={start} />
    </View>
  );
}

function PlanReminder({ plan, color, soft }: { plan: ReturnType<typeof getFocusPlan>; color: string; soft: string }) {
  return (
    <View style={[styles.pulled, { backgroundColor: soft }]}>
      <Text style={[mentalStyles.label, { color }]}>YOUR FOCUS PLAN</Text>
      {plan.map((item) => (
        <Text key={item.disruptor} style={mentalStyles.body}>
          {getDisruptor(item.disruptor).icon} {item.fix}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 12 },
  spaced: { marginTop: 6 },
  taskInput: { minHeight: 50 },
  focusPanel: { alignItems: "stretch", gap: 10, paddingVertical: 28, marginTop: 12 },
  taskName: {
    color: COLORS.ink,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  timerWrap: { alignItems: "center", paddingVertical: 34, gap: 4 },
  prompt: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 4 },
  promptTask: { fontWeight: "800" },
  disruptorChips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pulled: { padding: 14, borderRadius: 16, gap: 6 },
});
