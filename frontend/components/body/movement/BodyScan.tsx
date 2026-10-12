import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SecondaryButton,
  SelectionChip,
  toggleItem,
} from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";

type Area = "face" | "neck" | "shoulders" | "back" | "hands" | "legs";
type Feeling = "Comfortable" | "A little tense" | "Tired" | "Not sure";

const AREAS: { id: Area; name: string; plural: boolean }[] = [
  { id: "face", name: "Face and jaw", plural: true },
  { id: "neck", name: "Neck", plural: false },
  { id: "shoulders", name: "Shoulders", plural: true },
  { id: "back", name: "Back", plural: false },
  { id: "hands", name: "Hands", plural: true },
  { id: "legs", name: "Legs", plural: true },
];

const FEELINGS: Feeling[] = ["Comfortable", "A little tense", "Tired", "Not sure"];

const TENSE_TIPS: Record<Area, string> = {
  face: "Let your teeth part slightly and soften your jaw and forehead.",
  neck: "Try a slow, small head tilt to each side, or bring your screen closer to eye level.",
  shoulders: "Let your shoulders drop away from your ears as you breathe out slowly.",
  back: "Try changing position, or stand and reach your arms up gently.",
  hands: "Open and close your hands a few times and make slow wrist circles.",
  legs: "Stand up, shift your weight from foot to foot, or take a short walk.",
};

const TIRED_TIPS: Record<Area, string> = {
  face: "Close your eyes for a few breaths, or look at something far away.",
  neck: "Rest your head back against a chair for a moment if you can.",
  shoulders: "Let your arms hang loose and gently shake them out.",
  back: "Change position or lean back and rest for a moment.",
  hands: "Rest your hands in your lap and let them go loose.",
  legs: "A short break, a change of position, or putting your feet up may help.",
};

function suggestionFor(area: Area, feeling: Feeling | undefined): string {
  if (!feeling) return "Skipped. That's completely fine.";
  if (feeling === "Comfortable") return "Nice. Notice what's helping this area feel at ease.";
  if (feeling === "A little tense") return TENSE_TIPS[area];
  if (feeling === "Tired") return TIRED_TIPS[area];
  return "That's okay. Noticing without needing a label is part of the practice.";
}

type Stage = "choose" | "ask" | "summary";

export function BodyScan({ color, soft, onExit }: ActivityProps) {
  const [stage, setStage] = useState<Stage>("choose");
  const [selected, setSelected] = useState<Area[]>([]);
  const [index, setIndex] = useState(0);
  const [feelings, setFeelings] = useState<Partial<Record<Area, Feeling>>>({});

  const ordered = AREAS.filter((area) => selected.includes(area.id));
  const current = ordered[index];
  const header = <ActivityHeader eyebrow="Movement & Flexibility" title="Body Awareness Scan" color={color} />;

  function toggleArea(area: Area) {
    setSelected((list) => toggleItem(list, area));
  }

  function restart() {
    setSelected([]);
    setFeelings({});
    setIndex(0);
    setStage("choose");
  }

  function next() {
    if (index < ordered.length - 1) setIndex(index + 1);
    else setStage("summary");
  }

  if (stage === "summary") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="🧍"
          title="Scan complete"
          message="Thanks for checking in with your body. Here are some gentle ideas based on what you noticed."
          color={color}
          soft={soft}
          primary={{ label: "Scan again", onPress: restart }}
          secondary={{ label: "Back to Movement", onPress: onExit }}
        >
          <View style={styles.summary}>
            {ordered.map((area) => (
              <View key={area.id} style={styles.summaryRow}>
                <Text style={mentalStyles.label}>
                  {area.name.toUpperCase()} · {(feelings[area.id] ?? "Skipped").toUpperCase()}
                </Text>
                <Text style={mentalStyles.body}>{suggestionFor(area.id, feelings[area.id])}</Text>
              </View>
            ))}
          </View>
        </CompletionScreen>
        <Text style={[mentalStyles.muted, styles.center]}>
          This is a moment of awareness, not a health check. If discomfort is
          strong or keeps coming back, consider talking with a health
          professional. Nothing here is saved.
        </Text>
      </View>
    );
  }

  if (stage === "ask" && current) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard
          stepKey={current.id}
          label={`Area ${index + 1} of ${ordered.length}`}
          aside="Optional"
          question={`How ${current.plural ? "do" : "does"} your ${current.name.toLowerCase()} feel right now?`}
          hint="Just notice. There's no right answer."
          color={color}
        >
          <Silhouette selected={[current.id]} focus={current.id} color={color} />
          <View style={mentalStyles.chips}>
            {FEELINGS.map((feeling) => (
              <SelectionChip
                key={feeling}
                label={feeling}
                color={color}
                selected={feelings[current.id] === feeling}
                onPress={() => setFeelings((list) => ({ ...list, [current.id]: feeling }))}
              />
            ))}
          </View>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton
            flex
            label="Back"
            color={color}
            onPress={() => (index === 0 ? setStage("choose") : setIndex(index - 1))}
          />
          <PrimaryButton
            flex
            label={index === ordered.length - 1 ? "See suggestions" : "Continue"}
            color={color}
            onPress={next}
          />
        </View>
        <SecondaryButton
          subtle
          label="Skip this area"
          color={COLORS.muted}
          onPress={() => {
            setFeelings((list) => ({ ...list, [current.id]: undefined }));
            next();
          }}
        />
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Text style={mentalStyles.body}>
        Take a slow breath. Choose the areas you&apos;d like to check in with:
        tap the figure or the list below.
      </Text>
      <View style={[mentalStyles.card, styles.chooser]}>
        <Silhouette selected={selected} color={color} onToggle={toggleArea} />
        <View style={mentalStyles.chips}>
          {AREAS.map((area) => (
            <SelectionChip
              key={area.id}
              label={area.name}
              color={color}
              selected={selected.includes(area.id)}
              onPress={() => toggleArea(area.id)}
            />
          ))}
        </View>
      </View>
      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Select all"
          color={color}
          onPress={() => setSelected(AREAS.map((area) => area.id))}
        />
        <PrimaryButton
          flex
          label="Start scan"
          color={color}
          disabled={selected.length === 0}
          onPress={() => {
            setIndex(0);
            setStage("ask");
          }}
        />
      </View>
    </View>
  );
}

/** A simple, neutral figure. Areas are tappable when `onToggle` is given. */
function Silhouette({
  selected,
  focus,
  color,
  onToggle,
}: {
  selected: Area[];
  focus?: Area;
  color: string;
  onToggle?: (area: Area) => void;
}) {
  const fillFor = (area: Area) =>
    focus === area ? color : selected.includes(area) ? color : "#DCE5E3";
  const opacityFor = (area: Area) => (focus && focus !== area ? 0.35 : selected.includes(area) ? 0.85 : 1);
  const press = (area: Area) => (onToggle ? () => onToggle(area) : undefined);

  return (
    <View style={styles.figure} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={130} height={250} viewBox="0 0 120 240">
        {/* arms (neutral, not selectable) */}
        <Rect x={16} y={62} width={13} height={80} rx={6.5} fill="#E7EEEC" />
        <Rect x={91} y={62} width={13} height={80} rx={6.5} fill="#E7EEEC" />
        <Circle cx={60} cy={26} r={18} fill={fillFor("face")} opacity={opacityFor("face")} onPress={press("face")} />
        <Rect x={52} y={44} width={16} height={14} rx={4} fill={fillFor("neck")} opacity={opacityFor("neck")} onPress={press("neck")} />
        <Rect x={22} y={56} width={76} height={16} rx={8} fill={fillFor("shoulders")} opacity={opacityFor("shoulders")} onPress={press("shoulders")} />
        <Rect x={36} y={74} width={48} height={66} rx={10} fill={fillFor("back")} opacity={opacityFor("back")} onPress={press("back")} />
        <Circle cx={22} cy={152} r={10} fill={fillFor("hands")} opacity={opacityFor("hands")} onPress={press("hands")} />
        <Circle cx={98} cy={152} r={10} fill={fillFor("hands")} opacity={opacityFor("hands")} onPress={press("hands")} />
        <Rect x={39} y={144} width={19} height={92} rx={9} fill={fillFor("legs")} opacity={opacityFor("legs")} onPress={press("legs")} />
        <Rect x={62} y={144} width={19} height={92} rx={9} fill={fillFor("legs")} opacity={opacityFor("legs")} onPress={press("legs")} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  chooser: { gap: 14 },
  figure: { alignItems: "center" },
  summary: { alignSelf: "stretch", gap: 12 },
  summaryRow: { gap: 4, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
});
