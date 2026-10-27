import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { useLogCompletion } from "../common/activityLog";
import { COLORS } from "../common/AppShell";
import {
  ActivityHeader,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SupportNote,
} from "../common/ActivityUI";

// Parts carry an optional note for elements that mix both sides. There is no
// "correct" bucket: the activity is about spotting next steps, not grading.
type Part = { text: string; note?: string };
type Bucket = "influence" | "notFully";

const SITUATIONS: { title: string; parts: Part[] }[] = [
  {
    title: "I have an exam next week.",
    parts: [
      { text: "Preparing for the exam" },
      { text: "Asking someone for help" },
      { text: "The exact questions that will appear" },
      {
        text: "How well I sleep the night before",
        note: "Sleep is partly in your hands, like a regular bedtime, and partly not.",
      },
      { text: "How other students do" },
    ],
  },
  {
    title: "My friend seems upset with me.",
    parts: [
      { text: "Asking them kindly how they are" },
      { text: "How they feel right now" },
      { text: "Giving them a little space" },
      { text: "What they decide to share with me" },
      {
        text: "How the conversation goes",
        note: "You can shape your side of a conversation, but not the whole thing.",
      },
    ],
  },
  {
    title: "I have a busy week ahead.",
    parts: [
      { text: "Writing a short plan for each day" },
      { text: "Unexpected tasks that come up" },
      { text: "Taking short breaks" },
      { text: "Other people's deadlines" },
      {
        text: "Saying no to something extra",
        note: "Sometimes possible, sometimes not. It depends on the situation.",
      },
    ],
  },
];

type Stage = "pick" | "custom" | "sort" | "action" | "summary";

export function ControlSort({
  color,
  soft,
  onExit,
}: {
  color: string;
  soft: string;
  onExit: () => void;
}) {
  const [stage, setStage] = useState<Stage>("pick");
  const [situation, setSituation] = useState("");
  const [parts, setParts] = useState<Part[]>([]);
  const [buckets, setBuckets] = useState<(Bucket | null)[]>([]);
  const [lastSorted, setLastSorted] = useState<number | null>(null);
  const [draftPart, setDraftPart] = useState("");
  const [action, setAction] = useState("");
  const [customAction, setCustomAction] = useState("");
  const logCompletion = useLogCompletion();

  function begin(title: string, nextParts: Part[]) {
    setSituation(title);
    setParts(nextParts);
    setBuckets(nextParts.map(() => null));
    setLastSorted(null);
    setAction("");
    setCustomAction("");
    setStage("sort");
  }

  function restart() {
    setSituation("");
    setParts([]);
    setBuckets([]);
    setDraftPart("");
    setLastSorted(null);
    setAction("");
    setCustomAction("");
    setStage("pick");
  }

  function sort(index: number, bucket: Bucket) {
    setBuckets((current) => current.map((value, i) => (i === index ? bucket : value)));
    setLastSorted(index);
  }

  function addCustomPart() {
    const text = draftPart.trim();
    if (!text) return;
    setParts((current) => [...current, { text }]);
    setDraftPart("");
  }

  const header = (
    <ActivityHeader eyebrow="Self-Awareness" title="What Can I Control?" color={color} />
  );

  if (stage === "pick") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.body}>
          Pick a situation. You&apos;ll sort its parts into what you can
          influence and what you can&apos;t fully control, then choose one
          small step.
        </Text>
        <View style={styles.list}>
          {SITUATIONS.map((item) => (
            <Pressable
              key={item.title}
              accessibilityRole="button"
              onPress={() => begin(item.title, item.parts)}
              style={({ pressed }) => [mentalStyles.card, styles.situationCard, pressed && styles.pressed]}
            >
              <Text style={styles.situationText}>{item.title}</Text>
              <Text style={[styles.chevron, { color }]}>›</Text>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSituation("");
              setParts([]);
              setStage("custom");
            }}
            style={({ pressed }) => [
              styles.situationCard,
              styles.customCard,
              { borderColor: color, backgroundColor: soft },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.situationText, { color }]}>+ Create my own situation</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (stage === "custom") {
    const canStart = situation.trim().length > 0 && parts.length > 0;
    return (
      <View style={mentalStyles.screen}>
        {header}
        <View style={[mentalStyles.card, styles.panel]}>
          <Text style={styles.question}>What&apos;s the situation?</Text>
          <TextInput
            accessibilityLabel="Your situation"
            maxLength={120}
            onChangeText={setSituation}
            placeholder="e.g. I'm starting a new job"
            placeholderTextColor={COLORS.muted}
            style={[mentalStyles.input, styles.singleLine]}
            value={situation}
          />
          <Text style={styles.question}>What parts does it have?</Text>
          <Text style={mentalStyles.muted}>
            Add a few things about it, such as tasks, people, or outcomes.
          </Text>
          <View style={mentalStyles.row}>
            <TextInput
              accessibilityLabel="A part of the situation"
              maxLength={80}
              onChangeText={setDraftPart}
              onSubmitEditing={addCustomPart}
              placeholder="e.g. Getting there on time"
              placeholderTextColor={COLORS.muted}
              returnKeyType="done"
              style={[mentalStyles.input, styles.singleLine, styles.flex]}
              value={draftPart}
            />
            <PrimaryButton label="Add" color={color} disabled={!draftPart.trim()} onPress={addCustomPart} />
          </View>
          {parts.map((part, index) => (
            <View key={`${part.text}-${index}`} style={styles.partRow}>
              <Text style={[mentalStyles.body, styles.flex]}>{part.text}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${part.text}`}
                hitSlop={10}
                onPress={() => setParts((current) => current.filter((_, i) => i !== index))}
              >
                <Text style={styles.remove}>✕</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage("pick")} />
          <PrimaryButton
            flex
            label="Start sorting"
            color={color}
            disabled={!canStart}
            onPress={() => begin(situation.trim(), parts)}
          />
        </View>
        <SupportNote />
      </View>
    );
  }

  if (stage === "sort") {
    const current = buckets.indexOf(null);
    const allSorted = current === -1;
    const feedback = lastSorted !== null ? buildFeedback(parts[lastSorted], buckets[lastSorted]) : null;

    return (
      <View style={mentalStyles.screen}>
        {header}
        <View style={[styles.situationBanner, { backgroundColor: soft }]}>
          <Text style={[mentalStyles.label, { color }]}>SITUATION</Text>
          <Text style={styles.situationText}>{situation}</Text>
        </View>

        {!allSorted ? (
          <View style={[mentalStyles.card, styles.panel]}>
            <Text style={[mentalStyles.label, { color }]}>
              CARD {current + 1} OF {parts.length}
            </Text>
            <Animated.Text
              key={current}
              entering={FadeInRight.duration(220)}
              accessibilityLiveRegion="polite"
              style={styles.partCard}
            >
              {parts[current].text}
            </Animated.Text>
            <PrimaryButton label="I can influence this" color={color} onPress={() => sort(current, "influence")} />
            <SecondaryButton
              label="I cannot fully control this"
              color={color}

              onPress={() => sort(current, "notFully")}
            />
          </View>
        ) : (
          <View style={[mentalStyles.card, styles.panel]}>
            <Text style={styles.question}>All sorted</Text>
            <Text style={mentalStyles.body}>
              Many situations have both kinds of parts. Some things are partly
              in your hands and partly not, and that&apos;s normal. Focusing
              on what you can influence can make the next step feel clearer.
            </Text>
          </View>
        )}

        {feedback && (
          <View accessibilityLiveRegion="polite" style={[styles.feedback, { borderColor: color }]}>
            <Text style={mentalStyles.body}>{feedback}</Text>
          </View>
        )}

        <BucketList
          title="I can influence this"
          color={color}
          parts={parts}
          buckets={buckets}
          bucket="influence"
          onMove={(index) => sort(index, "notFully")}
        />
        <BucketList
          title="I cannot fully control this"
          color={color}
          parts={parts}
          buckets={buckets}
          bucket="notFully"
          onMove={(index) => sort(index, "influence")}
        />

        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Restart" color={color} onPress={restart} />
          <PrimaryButton
            flex
            label="Choose an action"
            color={color}
            disabled={!allSorted}
            onPress={() => setStage("action")}
          />
        </View>
      </View>
    );
  }

  if (stage === "action") {
    const options = parts.filter((_, index) => buckets[index] === "influence").map((part) => part.text);
    const chosen = action === "custom" ? customAction.trim() : action;

    return (
      <View style={mentalStyles.screen}>
        {header}
        <View style={[mentalStyles.card, styles.panel]}>
          <Text style={styles.question}>Choose one practical action</Text>
          <Text style={mentalStyles.muted}>
            Something small you could actually try. Pick one from your
            &quot;influence&quot; list or write your own.
          </Text>
          {options.map((option) => (
            <OptionRow
              key={option}
              label={option}
              color={color}
              soft={soft}
              selected={action === option}
              onPress={() => setAction(option)}
            />
          ))}
          <OptionRow
            label="Write my own action"
            color={color}
            soft={soft}
            selected={action === "custom"}
            onPress={() => setAction("custom")}
          />
          {action === "custom" && (
            <TextInput
              accessibilityLabel="Your own action"
              autoFocus
              maxLength={120}
              onChangeText={setCustomAction}
              placeholder="e.g. Study for 25 minutes after dinner"
              placeholderTextColor={COLORS.muted}
              style={[mentalStyles.input, styles.singleLine]}
              value={customAction}
            />
          )}
        </View>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage("sort")} />
          <PrimaryButton
            flex
            label="Continue"
            color={color}
            disabled={!chosen}
            onPress={() => {
              setAction(chosen);
              setStage("summary");
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <View style={[mentalStyles.card, styles.panel]}>
        <Text style={[mentalStyles.label, { color }]}>SITUATION</Text>
        <Text style={styles.situationText}>{situation}</Text>
        <View style={styles.divider} />
        <Text style={[mentalStyles.label, { color }]}>MY NEXT STEP</Text>
        <Text style={styles.question}>{action}</Text>
        <Text style={mentalStyles.body}>
          You don&apos;t need to control everything to move forward. One
          small step is enough for now.
        </Text>
      </View>
      <View style={mentalStyles.row}>
        <SecondaryButton flex label="Restart" color={color} onPress={restart} />
        <PrimaryButton
          flex
          label="Finish"
          color={color}
          onPress={() => {
            logCompletion();
            onExit();
          }}
        />
      </View>
    </View>
  );
}

function buildFeedback(part: Part, bucket: Bucket | null) {
  const base =
    bucket === "influence"
      ? `“${part.text}” could be a good place to start.`
      : `It's okay to let “${part.text}” rest. You can still choose how you respond to it.`;
  return part.note ? `${base} ${part.note}` : base;
}

function BucketList({
  title,
  color,
  parts,
  buckets,
  bucket,
  onMove,
}: {
  title: string;
  color: string;
  parts: Part[];
  buckets: (Bucket | null)[];
  bucket: Bucket;
  onMove: (index: number) => void;
}) {
  const items = parts
    .map((part, index) => ({ part, index }))
    .filter(({ index }) => buckets[index] === bucket);

  return (
    <View style={styles.bucket}>
      <Text style={mentalStyles.label}>
        {title.toUpperCase()} ({items.length})
      </Text>
      {items.length === 0 ? (
        <Text style={[mentalStyles.muted, styles.empty]}>Nothing here yet</Text>
      ) : (
        items.map(({ part, index }) => (
          <Pressable
            key={`${part.text}-${index}`}
            accessibilityRole="button"
            accessibilityHint="Moves this card to the other group"
            onPress={() => onMove(index)}
            style={({ pressed }) => [styles.sortedItem, pressed && styles.pressed]}
          >
            <Text style={[mentalStyles.body, styles.flex]}>{part.text}</Text>
            <Text style={[styles.moveText, { color }]}>Move</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}

function OptionRow({
  label,
  color,
  soft,
  selected,
  onPress,
}: {
  label: string;
  color: string;
  soft: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && { borderColor: color, backgroundColor: soft },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radio, { borderColor: color }]}>
        {selected && <View style={[styles.radioDot, { backgroundColor: color }]} />}
      </View>
      <Text style={[mentalStyles.body, styles.flex]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.78 },
  panel: { gap: 12 },
  list: { gap: 10 },
  question: { color: COLORS.ink, fontSize: 18, fontWeight: "800", lineHeight: 24 },
  singleLine: { minHeight: 48 },
  situationCard: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 64 },
  customCard: { padding: 18, borderRadius: 20, borderWidth: 1.5, borderStyle: "dashed" },
  situationText: { flex: 1, color: COLORS.ink, fontSize: 16, fontWeight: "700", lineHeight: 22 },
  chevron: { fontSize: 26, fontWeight: "500" },
  situationBanner: { padding: 16, borderRadius: 18, gap: 5 },
  partCard: {
    color: COLORS.ink,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 27,
    textAlign: "center",
    paddingVertical: 18,
  },
  feedback: {
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    backgroundColor: COLORS.white,
  },
  bucket: { gap: 8 },
  empty: { fontStyle: "italic" },
  sortedItem: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  moveText: { fontSize: 12, fontWeight: "800" },
  partRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  remove: { color: COLORS.muted, fontSize: 16, fontWeight: "700" },
  option: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  divider: { height: 1, backgroundColor: COLORS.border },
});
