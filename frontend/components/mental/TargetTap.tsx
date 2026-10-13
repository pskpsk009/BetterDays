import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Svg, { Circle, Polygon, Rect } from "react-native-svg";

import { COLORS } from "../common/AppShell";
import {
  Cell,
  describeRule,
  Level,
  LEVELS,
  makeBoard,
  Rule,
  ruleFor,
  ShapeColor,
  ShapeKind,
  summarizeRound,
} from "./targetTapRules";
import {
  ActivityHeader,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SessionTimer,
  useSessionTimer,
} from "../common/ActivityUI";

const SHAPE_COLORS: Record<ShapeColor, string> = {
  blue: "#3F6FC4",
  orange: "#DD7424",
  green: "#2E9A5E",
  pink: "#C94F8A",
};

const CORRECT_TINT = "#E2F4E9";
const WRONG_TINT = "#FBE3E3";
const WRONG_MARK = "#C9483F";
const NEXT_BOARD_MS = 350;
const WRONG_FLASH_MS = 450;

type Status = "setup" | "playing" | "results";

export function TargetTap({
  color,
  soft,
  onExit,
}: {
  color: string;
  soft: string;
  onExit: () => void;
}) {
  const [level, setLevel] = useState<Level>(LEVELS[0]);
  const [status, setStatus] = useState<Status>("setup");
  const [boardIndex, setBoardIndex] = useState(0);
  const [board, setBoard] = useState<Cell[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const timeouts = useRef(new Set<ReturnType<typeof setTimeout>>());
  const advancing = useRef(false);

  const { remainingMs, reset } = useSessionTimer(level.roundMs, status === "playing", () =>
    setStatus("results"),
  );

  function later(callback: () => void, ms: number) {
    const timeout = setTimeout(() => {
      timeouts.current.delete(timeout);
      callback();
    }, ms);
    timeouts.current.add(timeout);
  }

  function clearPending() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current.clear();
    advancing.current = false;
  }

  // Clear feedback and board timers on unmount and when a round ends.
  useEffect(() => clearPending, []);
  useEffect(() => {
    if (status === "results") clearPending();
  }, [status]);

  function showBoard(index: number, forLevel: Level) {
    setBoardIndex(index);
    setBoard(makeBoard(forLevel, index));
    setFound([]);
    setWrong([]);
    advancing.current = false;
  }

  function play(forLevel: Level = level) {
    clearPending();
    reset();
    setLevel(forLevel);
    setCorrect(0);
    setIncorrect(0);
    showBoard(0, forLevel);
    setStatus("playing");
  }

  function tap(cell: Cell) {
    if (status !== "playing" || advancing.current || found.includes(cell.id)) return;

    if (cell.isTarget) {
      const nextFound = [...found, cell.id];
      setFound(nextFound);
      setCorrect((value) => value + 1);
      if (nextFound.length === level.targets) {
        advancing.current = true;
        later(() => showBoard(boardIndex + 1, level), NEXT_BOARD_MS);
      }
    } else {
      setIncorrect((value) => value + 1);
      setWrong((current) => [...current, cell.id]);
      later(() => setWrong((current) => current.filter((id) => id !== cell.id)), WRONG_FLASH_MS);
    }
  }

  const header = <ActivityHeader eyebrow="Find Your Focus" title="Target Tap" color={color} />;

  if (status === "results") {
    const summary = summarizeRound(correct, incorrect);
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="◎"
          title="Round over"
          message={`${level.name} level. Nice work keeping your eyes on the targets.`}
          color={color}
          soft={soft}
          primary={{ label: "Play again", onPress: () => play() }}
          secondary={{ label: "Change level", onPress: () => setStatus("setup") }}
        >
          <View style={styles.stats}>
            <Stat label="Score" value={String(summary.score)} color={color} />
            <Stat label="Correct" value={String(summary.correct)} color={color} />
            <Stat label="Incorrect" value={String(summary.incorrect)} color={color} />
            <Stat
              label="Accuracy"
              value={summary.accuracy === null ? "–" : `${summary.accuracy}%`}
              color={color}
            />
          </View>
        </CompletionScreen>
        <SecondaryButton subtle label="Back to Find Your Focus" color={COLORS.muted} onPress={onExit} />
      </View>
    );
  }

  if (status === "playing") {
    const rule = ruleFor(level, boardIndex);
    return (
      <View style={mentalStyles.screen}>
        <View style={styles.hud}>
          <SessionTimer remainingMs={remainingMs} color={color} />
          <Text style={styles.hudScore}>
            ✓ {correct} · ✕ {incorrect}
          </Text>
        </View>

        <Animated.View
          key={`${rule.color}-${rule.shape}`}
          entering={FadeIn.duration(250)}
          accessibilityLiveRegion="polite"
          style={[styles.rule, { backgroundColor: soft }]}
        >
          <ShapeIcon rule={rule} size={34} />
          <Text style={styles.ruleText}>{describeRule(rule)}</Text>
        </Animated.View>

        <View style={styles.grid}>
          {board.map((cell) => {
            const isFound = found.includes(cell.id);
            const isWrong = wrong.includes(cell.id);
            return (
              <View key={cell.id} style={[styles.cellWrap, { width: `${100 / level.columns}%` }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${cell.color} ${cell.shape}`}
                  accessibilityState={{ selected: isFound }}
                  onPress={() => tap(cell)}
                  style={[
                    styles.cell,
                    isFound && { backgroundColor: CORRECT_TINT, borderColor: SHAPE_COLORS.green },
                    isWrong && { backgroundColor: WRONG_TINT, borderColor: WRONG_MARK },
                  ]}
                >
                  <View style={isFound && styles.faded}>
                    <ShapeIcon rule={cell} size={level.columns > 3 ? 40 : 48} />
                  </View>
                  {isFound && <Text style={[styles.mark, { color: SHAPE_COLORS.green }]}>✓</Text>}
                  {isWrong && <Text style={[styles.mark, { color: WRONG_MARK }]}>✕</Text>}
                </Pressable>
              </View>
            );
          })}
        </View>

        <SecondaryButton subtle label="End round" color={COLORS.muted} onPress={() => setStatus("results")} />
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Text style={mentalStyles.body}>
        A quick attention game. Tap only the shapes that match the instruction
        before the {level.roundMs / 1000}-second timer runs out.
      </Text>
      <View style={styles.levels}>
        {LEVELS.map((option) => {
          const selected = option.id === level.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setLevel(option)}
              style={({ pressed }) => [
                styles.levelCard,
                selected && { borderColor: color, backgroundColor: soft },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.levelName, selected && { color }]}>{option.name}</Text>
              <Text style={mentalStyles.muted}>{option.detail}</Text>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton label={`Play ${level.name}`} color={color} onPress={() => play()} />
      <Text style={[mentalStyles.muted, styles.center]}>
        Just for fun. It isn&apos;t a test, and scores are not saved.
      </Text>
    </View>
  );
}

function ShapeIcon({ rule, size }: { rule: Rule | Pick<Cell, "shape" | "color">; size: number }) {
  const fill = SHAPE_COLORS[rule.color];
  const shape: ShapeKind = rule.shape;
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      {shape === "circle" && <Circle cx={20} cy={20} r={16} fill={fill} />}
      {shape === "square" && <Rect x={5} y={5} width={30} height={30} rx={5} fill={fill} />}
      {shape === "triangle" && <Polygon points="20,4 37,35 3,35" fill={fill} />}
    </Svg>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={mentalStyles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.78 },
  hud: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  hudScore: { color: COLORS.muted, fontSize: 15, fontWeight: "700" },
  rule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
  },
  ruleText: { flex: 1, color: COLORS.ink, fontSize: 18, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  cellWrap: { padding: 4 },
  cell: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  faded: { opacity: 0.3 },
  mark: { position: "absolute", fontSize: 26, fontWeight: "900" },
  levels: { gap: 10 },
  levelCard: {
    padding: 16,
    gap: 4,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  levelName: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  stats: {
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  stat: {
    flexGrow: 1,
    width: "45%",
    alignItems: "center",
    gap: 2,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: COLORS.background,
  },
  statValue: { fontSize: 24, fontWeight: "800" },
});
