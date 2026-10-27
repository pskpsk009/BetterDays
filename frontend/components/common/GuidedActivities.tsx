import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SecondaryButton,
  SelectionChip,
  SupportNote,
  toggleItem,
} from "./ActivityUI";
import { useLogCompletion } from "./activityLog";
import { AppIcon } from "./AppIcon";
import { COLORS } from "./AppShell";

// Reusable, content-driven activity templates for the Mental and Emotional
// Wellness branches. Content lives in each branch's activities file; these
// components only render it. Everything is local state and nothing is saved.

type Completion = { badge: string; title: string; message: string };

type GuidedBase = ActivityProps & {
  /** Branch title, shown as the eyebrow and in the exit button. */
  branch: string;
  title: string;
  intro: string;
  completion: Completion;
};

function ExitButton({ branch, onExit }: { branch: string; onExit: () => void }) {
  return <SecondaryButton subtle label={`Back to ${branch}`} color={COLORS.muted} onPress={onExit} />;
}

function Done({ branch, title, completion, color, soft, onExit, onRestart, restartLabel }: GuidedBase & {
  onRestart: () => void;
  restartLabel: string;
}) {
  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow={branch} title={title} color={color} />
      <CompletionScreen
        badge={completion.badge}
        title={completion.title}
        message={completion.message}
        color={color}
        soft={soft}
        primary={{ label: restartLabel, onPress: onRestart }}
        secondary={{ label: `Back to ${branch}`, onPress: onExit }}
      />
    </View>
  );
}

/** A tappable card used for single-choice lists. */
function OptionCard({
  label,
  detail,
  selected,
  color,
  soft,
  onPress,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  color: string;
  soft: string;
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
      <View style={[styles.radio, { borderColor: selected ? color : COLORS.border }]}>
        {selected && <View style={[styles.radioDot, { backgroundColor: color }]} />}
      </View>
      <View style={styles.optionCopy}>
        <Text style={[styles.optionLabel, selected && { color }]}>{label}</Text>
        {detail ? <Text style={mentalStyles.muted}>{detail}</Text> : null}
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Reflection journal: optional written prompts, with an optional lighter path.
// ---------------------------------------------------------------------------

export type JournalPrompt = {
  question: string;
  hint?: string;
  placeholder?: string;
  /** Tap-to-add ideas for people who'd rather not type. */
  ideas?: string[];
};

type JournalPath = { label: string; description: string; prompts: JournalPrompt[] };

type Answer = { text: string; ideas: string[] };

export function ReflectionJournal(
  props: GuidedBase & {
    main: JournalPath;
    /** A gentler, present-focused alternative to the main prompts. */
    light?: JournalPath;
    /** Where "Back" on the first prompt goes when there is no path choice. Defaults to exiting. */
    onBack?: () => void;
  },
) {
  const { branch, title, intro, color, onExit, main, light, onBack = onExit } = props;
  const [path, setPath] = useState<JournalPath | null>(light ? null : main);
  const [step, setStep] = useState<number | "review" | "done">(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  function begin(next: JournalPath) {
    setPath(next);
    setAnswers(next.prompts.map(() => ({ text: "", ideas: [] })));
    setStep(0);
  }

  function restart() {
    setPath(light ? null : main);
    setAnswers(light ? [] : main.prompts.map(() => ({ text: "", ideas: [] })));
    setStep(0);
  }

  const header = <ActivityHeader eyebrow={branch} title={title} color={color} />;

  if (step === "done") {
    return <Done {...props} onRestart={restart} restartLabel="Write another" />;
  }

  if (!path) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.body}>{intro}</Text>
        <Text style={mentalStyles.label}>CHOOSE HOW TO REFLECT</Text>
        {[main, light!].map((option) => (
          <Pressable
            key={option.label}
            accessibilityRole="button"
            onPress={() => begin(option)}
            style={({ pressed }) => [mentalStyles.card, styles.pathCard, pressed && styles.pressed]}
          >
            <Text style={[styles.optionLabel, { color }]}>{option.label}</Text>
            <Text style={mentalStyles.muted}>{option.description}</Text>
          </Pressable>
        ))}
        <Text style={[mentalStyles.muted, styles.center]}>
          Every prompt is optional. You can skip any of them or stop at any time.
        </Text>
        <ExitButton branch={branch} onExit={onExit} />
      </View>
    );
  }

  const current = answers.length ? answers : path.prompts.map(() => ({ text: "", ideas: [] }));

  if (step === "review") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <View style={[mentalStyles.card, styles.panel]}>
          <Text style={[mentalStyles.label, { color }]}>YOUR REFLECTION</Text>
          {path.prompts.map((prompt, index) => {
            const value = [...current[index].ideas, current[index].text.trim()].filter(Boolean).join(" · ");
            return (
              <View key={prompt.question} style={styles.reviewRow}>
                <Text style={mentalStyles.label}>{prompt.question.toUpperCase()}</Text>
                <Text style={[mentalStyles.body, !value && styles.skipped]}>{value || "Skipped"}</Text>
              </View>
            );
          })}
        </View>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStep(path.prompts.length - 1)} />
          <PrimaryButton flex label="Finish" color={color} onPress={() => setStep("done")} />
        </View>
        <SupportNote />
      </View>
    );
  }

  const prompt = path.prompts[step];
  const answer = current[step];
  const update = (next: Partial<Answer>) =>
    setAnswers(current.map((value, index) => (index === step ? { ...value, ...next } : value)));
  const isEmpty = !answer.text.trim() && answer.ideas.length === 0;
  const isLast = step === path.prompts.length - 1;

  return (
    <View style={mentalStyles.screen}>
      {header}
      <QuestionCard
        stepKey={`${path.label}-${step}`}
        label={`Prompt ${step + 1} of ${path.prompts.length}`}
        aside="Optional"
        question={prompt.question}
        hint={prompt.hint}
        color={color}
      >
        {prompt.ideas && (
          <View style={mentalStyles.chips}>
            {prompt.ideas.map((idea) => (
              <SelectionChip
                key={idea}
                label={idea}
                color={color}
                selected={answer.ideas.includes(idea)}
                onPress={() => update({ ideas: toggleItem(answer.ideas, idea) })}
              />
            ))}
          </View>
        )}
        <TextInput
          accessibilityLabel={prompt.question}
          multiline
          value={answer.text}
          onChangeText={(text) => update({ text })}
          placeholder={prompt.placeholder ?? "Write as much or as little as you like…"}
          placeholderTextColor={COLORS.muted}
          style={mentalStyles.input}
          textAlignVertical="top"
        />
      </QuestionCard>
      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Back"
          color={color}
          onPress={() => (step === 0 ? (light ? setPath(null) : onBack()) : setStep(step - 1))}
        />
        <PrimaryButton
          flex
          label={isEmpty ? "Skip" : isLast ? "Review" : "Next"}
          color={color}
          onPress={() => setStep(isLast ? "review" : step + 1)}
        />
      </View>
      <ExitButton branch={branch} onExit={onExit} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Choice explorer: pick options from groups, then see what each one means.
// ---------------------------------------------------------------------------

export type ChoiceOption = { label: string; icon: string; note: string };
export type ChoiceGroup = { title: string; options: ChoiceOption[] };

export function ChoiceExplorer(
  props: GuidedBase & {
    groups: ChoiceGroup[];
    pickLabel: string;
    maxPicks?: number;
    /** Placeholder for adding your own option; omit to disable. */
    customPlaceholder?: string;
    customNote?: string;
    resultTitle: string;
    resultIntro: string;
    /** Optional single choice made from the picked options. */
    followUp?: string;
    followUpAnswer?: (label: string) => string;
    tips?: string[];
    safetyNote?: string;
    /** Picks to start from, e.g. when editing a saved list. */
    initialPicks?: ChoiceOption[];
    /** Replaces the completion screen: receives the picks when the person finishes. */
    onComplete?: (picked: ChoiceOption[]) => void;
    completeLabel?: string;
  },
) {
  const {
    branch, title, intro, color, soft, onExit, groups, pickLabel, maxPicks,
    customPlaceholder, customNote, resultTitle, resultIntro, followUp, followUpAnswer, tips, safetyNote,
    initialPicks, onComplete, completeLabel,
  } = props;
  const [picked, setPicked] = useState<ChoiceOption[]>(initialPicks ?? []);
  const [custom, setCustom] = useState("");
  const [stage, setStage] = useState<"pick" | "result" | "done">("pick");
  const [favourite, setFavourite] = useState<string | null>(null);
  // With onComplete there is no completion screen, so log the finish here.
  const logCompletion = useLogCompletion();

  function restart() {
    setPicked([]);
    setCustom("");
    setFavourite(null);
    setStage("pick");
  }

  const isPicked = (label: string) => picked.some((item) => item.label === label);
  const full = maxPicks !== undefined && picked.length >= maxPicks;

  function toggle(option: ChoiceOption) {
    if (isPicked(option.label)) setPicked(picked.filter((item) => item.label !== option.label));
    else if (!full) setPicked([...picked, option]);
  }

  function addCustom() {
    const label = custom.trim();
    if (!label || isPicked(label) || full) return;
    setPicked([...picked, { label, icon: "star-four-points-outline", note: customNote ?? "Something that matters to you." }]);
    setCustom("");
  }

  const header = <ActivityHeader eyebrow={branch} title={title} color={color} />;

  if (stage === "done") return <Done {...props} onRestart={restart} restartLabel="Start again" />;

  if (stage === "result") {
    return (
      <Animated.View entering={FadeIn.duration(220)} style={mentalStyles.screen}>
        {header}
        <View style={[styles.resultCard, { backgroundColor: soft }]}>
          <Text style={[mentalStyles.label, { color }]}>{resultTitle.toUpperCase()}</Text>
          <Text style={mentalStyles.body}>{resultIntro}</Text>
          {picked.map((item) => (
            <View key={item.label} style={styles.resultRow}>
              <AppIcon name={item.icon} size={22} color={color} style={styles.resultIcon} />
              <View style={styles.optionCopy}>
                <Text style={styles.optionLabel}>{item.label}</Text>
                <Text style={mentalStyles.muted}>{item.note}</Text>
              </View>
            </View>
          ))}
        </View>
        {followUp && (
          <View style={[mentalStyles.card, styles.panel]}>
            <Text style={styles.optionLabel}>{followUp}</Text>
            <View accessibilityRole="radiogroup" style={mentalStyles.chips}>
              {picked.map((item) => (
                <SelectionChip
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  color={color}
                  selected={favourite === item.label}
                  onPress={() => setFavourite(favourite === item.label ? null : item.label)}
                />
              ))}
            </View>
            {favourite && followUpAnswer && (
              <Text accessibilityLiveRegion="polite" style={mentalStyles.body}>
                {followUpAnswer(favourite)}
              </Text>
            )}
          </View>
        )}
        {tips?.map((tip) => (
          <Text key={tip} style={mentalStyles.body}>
            • {tip}
          </Text>
        ))}
        {safetyNote && <Text style={[mentalStyles.muted, styles.safety]}>{safetyNote}</Text>}
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Change picks" color={color} onPress={() => setStage("pick")} />
          <PrimaryButton
            flex
            label={completeLabel ?? "Finish"}
            color={color}
            onPress={() => {
              if (!onComplete) return setStage("done");
              logCompletion();
              onComplete(picked);
            }}
          />
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Text style={mentalStyles.body}>{intro}</Text>
      <Text accessibilityLiveRegion="polite" style={[mentalStyles.label, { color }]}>
        {pickLabel.toUpperCase()} · {picked.length}
        {maxPicks ? ` OF ${maxPicks}` : ""} CHOSEN
      </Text>
      {groups.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={mentalStyles.chips}>
            {group.options.map((option) => (
              <SelectionChip
                key={option.label}
                icon={option.icon}
                label={option.label}
                color={color}
                selected={isPicked(option.label)}
                onPress={() => toggle(option)}
              />
            ))}
          </View>
        </View>
      ))}
      {picked
        .filter((item) => !groups.some((group) => group.options.some((option) => option.label === item.label)))
        .map((item) => (
          <SelectionChip key={item.label} icon="star-four-points-outline" label={item.label} color={color} selected onPress={() => toggle(item)} />
        ))}
      {customPlaceholder && (
        <View style={styles.customRow}>
          <TextInput
            accessibilityLabel="Add your own"
            value={custom}
            onChangeText={setCustom}
            onSubmitEditing={addCustom}
            placeholder={customPlaceholder}
            placeholderTextColor={COLORS.muted}
            style={[mentalStyles.input, styles.customInput]}
            returnKeyType="done"
          />
          <SecondaryButton label="Add" color={color} disabled={!custom.trim() || full} onPress={addCustom} />
        </View>
      )}
      {full && <Text style={[mentalStyles.muted, styles.center]}>That's the most for now. Tap one to swap it.</Text>}
      <PrimaryButton label="See my picks" color={color} disabled={picked.length === 0} onPress={() => setStage("result")} />
      <ExitButton branch={branch} onExit={onExit} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Small step picker: optional context, one small action, and when to try it.
// ---------------------------------------------------------------------------

export function SmallStepPicker(
  props: GuidedBase & {
    context?: { question: string; hint: string; placeholder: string; ideas?: string[] };
    stepQuestion: string;
    groups: { title: string; options: string[] }[];
    customPlaceholder: string;
    whenOptions?: string[];
    tips: string[];
  },
) {
  const { branch, title, intro, color, soft, onExit, context, stepQuestion, groups, customPlaceholder, tips } = props;
  const whenOptions = props.whenOptions ?? ["Today", "Tomorrow", "This week", "Whenever it feels right"];
  const [stage, setStage] = useState<"context" | "choose" | "when" | "result" | "done">(
    context ? "context" : "choose",
  );
  const [situation, setSituation] = useState("");
  const [situationIdeas, setSituationIdeas] = useState<string[]>([]);
  const [choice, setChoice] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [when, setWhen] = useState<string | null>(null);

  function restart() {
    setSituation("");
    setSituationIdeas([]);
    setChoice(null);
    setCustom("");
    setWhen(null);
    setStage(context ? "context" : "choose");
  }

  const step = custom.trim() || choice;
  const header = <ActivityHeader eyebrow={branch} title={title} color={color} />;

  if (stage === "done") return <Done {...props} onRestart={restart} restartLabel="Pick another step" />;

  if (stage === "context" && context) {
    const isEmpty = !situation.trim() && situationIdeas.length === 0;
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.body}>{intro}</Text>
        <QuestionCard stepKey="context" label="Step 1 of 3" aside="Optional" question={context.question} hint={context.hint} color={color}>
          {context.ideas && (
            <View style={mentalStyles.chips}>
              {context.ideas.map((idea) => (
                <SelectionChip
                  key={idea}
                  label={idea}
                  color={color}
                  selected={situationIdeas.includes(idea)}
                  onPress={() => setSituationIdeas(toggleItem(situationIdeas, idea))}
                />
              ))}
            </View>
          )}
          <TextInput
            accessibilityLabel={context.question}
            multiline
            value={situation}
            onChangeText={setSituation}
            placeholder={context.placeholder}
            placeholderTextColor={COLORS.muted}
            style={mentalStyles.input}
            textAlignVertical="top"
          />
        </QuestionCard>
        <PrimaryButton label={isEmpty ? "Skip" : "Next"} color={color} onPress={() => setStage("choose")} />
        <ExitButton branch={branch} onExit={onExit} />
      </View>
    );
  }

  if (stage === "choose") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        {!context && <Text style={mentalStyles.body}>{intro}</Text>}
        <QuestionCard
          stepKey="choose"
          label={context ? "Step 2 of 3" : "Step 1 of 2"}
          question={stepQuestion}
          hint="Pick one, or write your own. Smaller is fine."
          color={color}
        />
        {groups.map((group) => (
          <View key={group.title} style={styles.group} accessibilityRole="radiogroup">
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.options.map((option) => (
              <OptionCard
                key={option}
                label={option}
                selected={!custom.trim() && choice === option}
                color={color}
                soft={soft}
                onPress={() => {
                  setCustom("");
                  setChoice(choice === option ? null : option);
                }}
              />
            ))}
          </View>
        ))}
        <TextInput
          accessibilityLabel="Write your own step"
          value={custom}
          onChangeText={setCustom}
          placeholder={customPlaceholder}
          placeholderTextColor={COLORS.muted}
          style={[mentalStyles.input, styles.customInput]}
        />
        <View style={mentalStyles.row}>
          <SecondaryButton
            flex
            label="Back"
            color={color}
            onPress={() => (context ? setStage("context") : onExit())}
          />
          <PrimaryButton flex label="Next" color={color} disabled={!step} onPress={() => setStage("when")} />
        </View>
        <ExitButton branch={branch} onExit={onExit} />
      </View>
    );
  }

  if (stage === "when") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard
          stepKey="when"
          label={context ? "Step 3 of 3" : "Step 2 of 2"}
          aside="Optional"
          question="When might you try it?"
          hint="No pressure. Plans can change."
          color={color}
        >
          <View accessibilityRole="radiogroup" style={mentalStyles.chips}>
            {whenOptions.map((option) => (
              <SelectionChip
                key={option}
                label={option}
                color={color}
                selected={when === option}
                onPress={() => setWhen(when === option ? null : option)}
              />
            ))}
          </View>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setStage("choose")} />
          <PrimaryButton flex label="See my step" color={color} onPress={() => setStage("result")} />
        </View>
      </View>
    );
  }

  const contextText = [...situationIdeas, situation.trim()].filter(Boolean).join(" · ");
  return (
    <Animated.View entering={FadeIn.duration(220)} style={mentalStyles.screen}>
      {header}
      <View style={[styles.resultCard, { backgroundColor: soft }]}>
        {contextText ? (
          <>
            <Text style={mentalStyles.label}>WHAT'S GOING ON</Text>
            <Text style={mentalStyles.body}>{contextText}</Text>
          </>
        ) : null}
        <Text style={[mentalStyles.label, { color }]}>YOUR SMALL STEP</Text>
        <Text style={styles.bigStep}>{step}</Text>
        {when && <Text style={mentalStyles.body}>When: {when}</Text>}
      </View>
      {tips.map((tip) => (
        <Text key={tip} style={mentalStyles.body}>
          • {tip}
        </Text>
      ))}
      <View style={mentalStyles.row}>
        <SecondaryButton flex label="Change step" color={color} onPress={() => setStage("choose")} />
        <PrimaryButton flex label="Finish" color={color} onPress={() => setStage("done")} />
      </View>
      <SupportNote />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Scenario practice: fictional everyday moments, explore different responses.
// ---------------------------------------------------------------------------

export type Scenario = {
  title: string;
  situation: string;
  question: string;
  options: { label: string; feedback: string }[];
  takeaway: string;
};

export function ScenarioPractice(
  props: GuidedBase & {
    scenarios: Scenario[];
    note?: string;
  },
) {
  const { branch, title, intro, color, soft, onExit, scenarios, note } = props;
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [tried, setTried] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  function restart() {
    setIndex(0);
    setChosen(null);
    setTried([]);
    setDone(false);
  }

  if (done) return <Done {...props} onRestart={restart} restartLabel="Practise again" />;

  const scenario = scenarios[index];
  const isLast = index === scenarios.length - 1;

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow={branch} title={title} color={color} />
      {index === 0 && chosen === null && <Text style={mentalStyles.body}>{intro}</Text>}
      <QuestionCard
        stepKey={index}
        label={`Scenario ${index + 1} of ${scenarios.length}`}
        aside={scenario.title}
        question={scenario.situation}
        color={color}
      >
        <Text style={[mentalStyles.body, styles.scenarioQuestion]}>{scenario.question}</Text>
      </QuestionCard>
      <View accessibilityRole="radiogroup" style={styles.group}>
        {scenario.options.map((option, optionIndex) => (
          <OptionCard
            key={option.label}
            label={option.label}
            selected={chosen === optionIndex}
            detail={tried.includes(optionIndex) && chosen !== optionIndex ? "Explored" : undefined}
            color={color}
            soft={soft}
            onPress={() => {
              setChosen(optionIndex);
              if (!tried.includes(optionIndex)) setTried([...tried, optionIndex]);
            }}
          />
        ))}
      </View>
      {chosen !== null && (
        <Animated.View
          key={`${index}-${chosen}`}
          entering={FadeIn.duration(200)}
          accessibilityLiveRegion="polite"
          style={[styles.resultCard, { backgroundColor: soft }]}
        >
          <Text style={[mentalStyles.label, { color }]}>THINGS TO CONSIDER</Text>
          <Text style={mentalStyles.body}>{scenario.options[chosen].feedback}</Text>
          <Text style={[mentalStyles.muted, styles.takeaway]}>{scenario.takeaway}</Text>
          {tried.length < scenario.options.length && (
            <Text style={mentalStyles.muted}>Tap another option to compare.</Text>
          )}
        </Animated.View>
      )}
      <PrimaryButton
        label={isLast ? "Finish" : "Next scenario"}
        color={color}
        disabled={chosen === null}
        onPress={() => {
          if (isLast) setDone(true);
          else {
            setIndex(index + 1);
            setChosen(null);
            setTried([]);
          }
        }}
      />
      {note && <Text style={[mentalStyles.muted, styles.center]}>{note}</Text>}
      <ExitButton branch={branch} onExit={onExit} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.82 },
  panel: { gap: 12 },
  pathCard: { gap: 6 },
  skipped: { color: COLORS.muted, fontStyle: "italic" },
  reviewRow: { gap: 4 },
  option: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  optionCopy: { flex: 1, gap: 2 },
  optionLabel: { color: COLORS.ink, fontSize: 15, fontWeight: "700", lineHeight: 21 },
  group: { gap: 8 },
  groupTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "800" },
  customRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  customInput: { flex: 1, minHeight: 48 },
  resultCard: { gap: 10, padding: 16, borderRadius: 18 },
  resultRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  resultIcon: { width: 30, textAlign: "center" },
  bigStep: { color: COLORS.ink, fontSize: 19, fontWeight: "800", lineHeight: 25 },
  scenarioQuestion: { fontWeight: "700" },
  takeaway: { fontStyle: "italic" },
  safety: { textAlign: "center" },
});
