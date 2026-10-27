import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SavedOnDeviceNote,
  SecondaryButton,
  SelectionChip,
  toggleItem,
} from "../common/ActivityUI";
import { AppIcon, IconName } from "../common/AppIcon";
import { COLORS } from "../common/AppShell";
import { DayKey, daysBetween, pickForDay, todayKey, useStoredState } from "../common/localStore";
import {
  INTERESTS,
  polishSteps,
  SKILL_AREAS,
  SKILL_LEVELS,
  SkillArea,
  SkillLevel,
  SkillStep,
  startSteps,
  suggestSkills,
} from "./skillPlans";

// Develop Your Skill: polish a skill someone already has, or help them find
// one to start. Saved skills open on their own page with a practice idea for
// today, a session log, and step-by-step progress. Saved on the device only.

const BRANCH = "Discover Your Joy";
const TITLE = "Develop Your Skill";

/** Logged sessions on a step before suggesting the next one. */
const SESSIONS_PER_STEP = 3;
const TRIAL_DAYS = 14;
const KEEP_RECENT = 10;

type Mode = "polish" | "find";
type Feel = "easy" | "okay" | "hard";

type Session = { day: DayKey; minutes: number | null; feel: Feel | null };

type SavedSkill = {
  id: string;
  name: string;
  mode: Mode;
  level: SkillLevel | null;
  areaId: string | null;
  step: number;
  sessions: number;
  sessionsAtStep: number;
  startedOn: DayKey;
  recent: Session[];
};

type View_ =
  | { screen: "list" }
  | { screen: "start" }
  | { screen: "polish-skill" }
  | { screen: "polish-level" }
  | { screen: "find-interests" }
  | { screen: "find-pick" }
  | { screen: "plan"; step: number }
  | { screen: "done" }
  | { screen: "skill"; id: string };

const MINUTES = [10, 20, 30, 45];
const FEELS: { id: Feel; label: string; icon: IconName }[] = [
  { id: "easy", label: "Easy", icon: "emoticon-outline" },
  { id: "okay", label: "Okay", icon: "emoticon-happy-outline" },
  { id: "hard", label: "Hard", icon: "emoticon-frown-outline" },
];

function stepsFor(skill: Pick<SavedSkill, "name" | "mode" | "level" | "areaId">): SkillStep[] {
  const area = SKILL_AREAS.find((item) => item.id === skill.areaId);
  return skill.mode === "polish" ? polishSteps(skill.name, skill.level ?? "some", area) : startSteps(skill.name);
}

export function DevelopSkill({ color, soft, onExit }: ActivityProps) {
  const [skills, setSkills, clearSkills] = useStoredState<SavedSkill[]>("skills", []);
  const [mode, setMode] = useState<Mode>("polish");
  const [view, setView] = useState<View_>(skills.length ? { screen: "list" } : { screen: "start" });
  const [area, setArea] = useState<SkillArea | null>(null);
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState<SkillLevel | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [customPick, setCustomPick] = useState("");
  /** Set while re-reading the plan of a saved skill, so Finish returns to its page. */
  const [reviewing, setReviewing] = useState<string | null>(null);

  const header = <ActivityHeader eyebrow={BRANCH} title={TITLE} color={color} />;
  const exit = <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />;

  // "Something else" needs a typed name; other areas can stand in for one.
  const polishSkill = skillName.trim() || (area && area.id !== "other" ? area.label.toLowerCase() : "");
  const findSkill = (picked === "custom" ? customPick.trim() : picked) ?? "";
  const skill = mode === "polish" ? polishSkill : findSkill;
  const steps: SkillStep[] =
    mode === "polish" ? polishSteps(polishSkill, level ?? "some", area ?? undefined) : startSteps(findSkill);

  function resetDraft() {
    setArea(null);
    setSkillName("");
    setLevel(null);
    setInterests([]);
    setPicked(null);
    setCustomPick("");
    setReviewing(null);
  }

  function addSkill() {
    const id = `${Date.now()}`;
    setSkills([
      ...skills,
      {
        id,
        name: skill,
        mode,
        level: mode === "polish" ? level : null,
        areaId: mode === "polish" ? area?.id ?? null : null,
        step: 0,
        sessions: 0,
        sessionsAtStep: 0,
        startedOn: todayKey(),
        recent: [],
      },
    ]);
    resetDraft();
    setView({ screen: "skill", id });
  }

  function openPlan(saved: SavedSkill) {
    setMode(saved.mode);
    setArea(SKILL_AREAS.find((item) => item.id === saved.areaId) ?? null);
    setLevel(saved.level);
    setSkillName(saved.mode === "polish" ? saved.name : "");
    setPicked(saved.mode === "find" ? "custom" : null);
    setCustomPick(saved.mode === "find" ? saved.name : "");
    setReviewing(saved.id);
    setView({ screen: "plan", step: saved.step });
  }

  const updateSkill = (id: string, change: (skill: SavedSkill) => SavedSkill) =>
    setSkills((list) => list.map((item) => (item.id === id ? change(item) : item)));

  if (view.screen === "list") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.label}>MY SKILLS</Text>
        {skills.map((item) => {
          const total = stepsFor(item).length;
          return (
            <PathCard
              key={item.id}
              icon={item.mode === "polish" ? "target" : "sprout-outline"}
              title={item.name}
              detail={`${item.mode === "polish" ? "Polishing" : "Starting"} · Step ${Math.min(item.step + 1, total)} of ${total} · ${item.sessions} session${item.sessions === 1 ? "" : "s"}`}
              color={color}
              soft={soft}
              onPress={() => setView({ screen: "skill", id: item.id })}
            />
          );
        })}
        <PrimaryButton
          label="+ Add a skill"
          color={color}
          onPress={() => {
            resetDraft();
            setView({ screen: "start" });
          }}
        />
        <SavedOnDeviceNote
          what="skills"
          onDelete={() => {
            clearSkills();
            setView({ screen: "start" });
          }}
        />
        {exit}
      </View>
    );
  }

  if (view.screen === "skill") {
    const saved = skills.find((item) => item.id === view.id);
    if (!saved) return null;
    return (
      <SkillPage
        key={saved.id}
        skill={saved}
        color={color}
        soft={soft}
        onUpdate={(change) => updateSkill(saved.id, change)}
        onRemove={() => {
          const rest = skills.filter((item) => item.id !== saved.id);
          setSkills(rest);
          setView(rest.length ? { screen: "list" } : { screen: "start" });
        }}
        onTryDifferent={() => {
          setSkills(skills.filter((item) => item.id !== saved.id));
          resetDraft();
          setMode("find");
          setView({ screen: "find-interests" });
        }}
        onOpenPlan={() => openPlan(saved)}
        onBack={() => setView({ screen: "list" })}
        exit={exit}
      />
    );
  }

  if (view.screen === "start") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.body}>
          Get step-by-step ideas to grow a skill. Already have one in mind? We&apos;ll help you
          polish it. Not sure yet? We&apos;ll help you find one.
        </Text>
        <Text style={mentalStyles.label}>DO YOU HAVE A SKILL IN MIND?</Text>
        <PathCard
          icon="target"
          title="Yes, I have a skill to polish"
          detail="Get a step-by-step plan to get better at it."
          color={color}
          soft={soft}
          onPress={() => {
            setMode("polish");
            setView({ screen: "polish-skill" });
          }}
        />
        <PathCard
          icon="compass-outline"
          title="Not yet, help me find one"
          detail="Explore what you enjoy and pick a skill to start."
          color={color}
          soft={soft}
          onPress={() => {
            setMode("find");
            setView({ screen: "find-interests" });
          }}
        />
        {skills.length > 0 && (
          <SecondaryButton label="Back to my skills" color={color} onPress={() => setView({ screen: "list" })} />
        )}
        {exit}
      </View>
    );
  }

  if (view.screen === "polish-skill") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey="polish-skill" label="Your skill" question="Which skill would you like to polish?" hint="Pick an area, type the skill, or both." color={color}>
          <View style={mentalStyles.chips}>
            {SKILL_AREAS.map((item) => (
              <SelectionChip
                key={item.id}
                icon={item.icon}
                label={item.label}
                color={color}
                selected={area?.id === item.id}
                onPress={() => setArea(area?.id === item.id ? null : item)}
              />
            ))}
          </View>
          <TextInput
            accessibilityLabel="Skill name"
            value={skillName}
            onChangeText={setSkillName}
            placeholder={area ? `e.g. ${area.examples.toLowerCase()}` : "e.g. guitar, drawing, football"}
            placeholderTextColor={COLORS.muted}
            style={mentalStyles.input}
          />
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setView({ screen: "start" })} />
          <PrimaryButton flex label="Next" color={color} disabled={!polishSkill} onPress={() => setView({ screen: "polish-level" })} />
        </View>
        {exit}
      </View>
    );
  }

  if (view.screen === "polish-level") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey="polish-level" label="Where you are now" question={`How would you describe your ${polishSkill} right now?`} hint="There's no wrong answer. It just shapes the advice." color={color}>
          {SKILL_LEVELS.map((item) => (
            <PathCard
              key={item.id}
              title={item.label}
              detail={item.detail}
              color={color}
              soft={soft}
              selected={level === item.id}
              onPress={() => setLevel(item.id)}
            />
          ))}
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setView({ screen: "polish-skill" })} />
          <PrimaryButton flex label="See my plan" color={color} disabled={!level} onPress={() => setView({ screen: "plan", step: 0 })} />
        </View>
        {exit}
      </View>
    );
  }

  if (view.screen === "find-interests") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey="find-interests" label="What you enjoy" question="What sounds fun or interesting to you?" hint="Pick as many as you like." color={color}>
          <View style={mentalStyles.chips}>
            {INTERESTS.map((item) => (
              <SelectionChip
                key={item.id}
                icon={item.icon}
                label={item.label}
                color={color}
                selected={interests.includes(item.id)}
                onPress={() => setInterests(toggleItem(interests, item.id))}
              />
            ))}
          </View>
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setView({ screen: "start" })} />
          <PrimaryButton flex label="Show ideas" color={color} disabled={interests.length === 0} onPress={() => setView({ screen: "find-pick" })} />
        </View>
        {exit}
      </View>
    );
  }

  if (view.screen === "find-pick") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey="find-pick" label="Skill ideas" question="Which skill would you like to try?" hint="Pick the one that makes you most curious. You can always come back for another." color={color}>
          {suggestSkills(interests).map((item) => (
            <PathCard
              key={item.name}
              icon={item.icon}
              title={item.name}
              detail={item.why}
              color={color}
              soft={soft}
              selected={picked === item.name}
              onPress={() => setPicked(item.name)}
            />
          ))}
          <PathCard
            icon="pencil-outline"
            title="Something else"
            detail="Type a skill you'd like to start."
            color={color}
            soft={soft}
            selected={picked === "custom"}
            onPress={() => setPicked("custom")}
          />
          {picked === "custom" && (
            <TextInput
              accessibilityLabel="Your own skill"
              value={customPick}
              onChangeText={setCustomPick}
              placeholder="e.g. skateboarding"
              placeholderTextColor={COLORS.muted}
              style={mentalStyles.input}
              autoFocus
            />
          )}
        </QuestionCard>
        <View style={mentalStyles.row}>
          <SecondaryButton flex label="Back" color={color} onPress={() => setView({ screen: "find-interests" })} />
          <PrimaryButton flex label="See how to start" color={color} disabled={!findSkill} onPress={() => setView({ screen: "plan", step: 0 })} />
        </View>
        {exit}
      </View>
    );
  }

  if (view.screen === "done") {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge={mode === "polish" ? "target" : "sprout-outline"}
          title={mode === "polish" ? "Your plan is ready" : "Ready to start"}
          message={`Save ${skill} to get a practice idea each day, log your sessions, and move through the steps at your own pace.`}
          color={color}
          soft={soft}
          primary={{ label: "Save & start practising", onPress: addSkill }}
          secondary={{
            label: "Not now",
            onPress: () => {
              resetDraft();
              setView(skills.length ? { screen: "list" } : { screen: "start" });
            },
          }}
        >
          <View style={styles.summary}>
            {steps.map((step, index) => (
              <Text key={step.title} style={mentalStyles.body}>
                {index + 1}. {step.title}
              </Text>
            ))}
          </View>
        </CompletionScreen>
        <Text style={[mentalStyles.muted, styles.center]}>
          <AppIcon name="lock-outline" size={14} color={COLORS.muted} /> Saved skills stay on this phone only. You can delete them at any time.
        </Text>
      </View>
    );
  }

  const stepIndex = Math.min(view.step, steps.length - 1);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const leave = () => {
    const id = reviewing;
    resetDraft();
    if (id) setView({ screen: "skill", id });
  };
  const back = reviewing
    ? stepIndex > 0
      ? () => setView({ screen: "plan", step: stepIndex - 1 })
      : leave
    : stepIndex > 0
      ? () => setView({ screen: "plan", step: stepIndex - 1 })
      : () => setView({ screen: mode === "polish" ? "polish-level" : "find-pick" });

  return (
    <View style={mentalStyles.screen}>
      {header}
      <View style={[styles.skillBadge, { backgroundColor: soft }]}>
        <Text style={[styles.skillBadgeText, { color }]}>
          {mode === "polish" ? "Polishing" : "Starting"}: {skill}
        </Text>
      </View>
      <Progress total={steps.length} current={stepIndex} color={color} />
      <QuestionCard
        stepKey={`${mode}-${stepIndex}`}
        label={`Step ${stepIndex + 1} of ${steps.length}`}
        question={step.title}
        color={color}
      >
        <Text style={mentalStyles.body}>{step.body}</Text>
        <View style={[styles.tryBox, { backgroundColor: soft }]}>
          <Text style={[styles.tryLabel, { color }]}>TRY THIS</Text>
          <Text style={mentalStyles.body}>{step.tryThis}</Text>
        </View>
      </QuestionCard>
      <View style={mentalStyles.row}>
        <SecondaryButton flex label="Back" color={color} onPress={back} />
        <PrimaryButton
          flex
          label={isLast ? (reviewing ? "Done" : "Finish") : "Next step"}
          color={color}
          onPress={() =>
            isLast
              ? reviewing
                ? leave()
                : setView({ screen: "done" })
              : setView({ screen: "plan", step: stepIndex + 1 })
          }
        />
      </View>
      {reviewing ? (
        <SecondaryButton subtle label="Back to my skill" color={COLORS.muted} onPress={leave} />
      ) : (
        exit
      )}
    </View>
  );
}

function SkillPage({
  skill,
  color,
  soft,
  onUpdate,
  onRemove,
  onTryDifferent,
  onOpenPlan,
  onBack,
  exit,
}: {
  skill: SavedSkill;
  color: string;
  soft: string;
  onUpdate: (change: (skill: SavedSkill) => SavedSkill) => void;
  onRemove: () => void;
  onTryDifferent: () => void;
  onOpenPlan: () => void;
  onBack: () => void;
  exit: React.ReactNode;
}) {
  const [logging, setLogging] = useState(false);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [feel, setFeel] = useState<Feel | null>(null);
  const [justLogged, setJustLogged] = useState(false);
  const [holdStep, setHoldStep] = useState(false);

  const today = todayKey();
  const steps = stepsFor(skill);
  const stepIndex = Math.min(skill.step, steps.length - 1);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const idea = pickForDay(step.today, stepIndex + skill.name.length, today);
  const stepDone = skill.sessionsAtStep >= SESSIONS_PER_STEP;
  const trialOver =
    skill.mode === "find" && (daysBetween(skill.startedOn, today) >= TRIAL_DAYS || (isLastStep && stepDone));

  function logSession() {
    onUpdate((current) => ({
      ...current,
      sessions: current.sessions + 1,
      sessionsAtStep: current.sessionsAtStep + 1,
      recent: [{ day: today, minutes, feel }, ...current.recent].slice(0, KEEP_RECENT),
    }));
    setLogging(false);
    setMinutes(null);
    setFeel(null);
    setJustLogged(true);
  }

  const restartPlan = (change: Partial<SavedSkill> = {}) =>
    onUpdate((current) => ({ ...current, step: 0, sessionsAtStep: 0, startedOn: today, ...change }));

  function confirmRemove() {
    Alert.alert(`Remove ${skill.name}?`, "Its sessions and progress will be deleted from this phone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: onRemove },
    ]);
  }

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow={TITLE} title={`My skill: ${skill.name}`} color={color} />
      <Progress total={steps.length} current={stepIndex} color={color} />
      <Text style={mentalStyles.muted}>
        Step {stepIndex + 1} of {steps.length}: {step.title} · {skill.sessions} session{skill.sessions === 1 ? "" : "s"} so far
      </Text>

      <View style={[styles.todayCard, { backgroundColor: soft }]}>
        <Text style={[styles.tryLabel, { color }]}>PRACTISE TODAY</Text>
        <Text style={styles.todayText}>{idea}</Text>
      </View>

      {trialOver ? (
        <View style={[mentalStyles.card, styles.panel]}>
          <Text style={styles.panelTitle}>Two-week check-in</Text>
          <Text style={mentalStyles.body}>
            How has {skill.name} felt? Every option is fine, including stopping.
          </Text>
          <PrimaryButton
            label="Keep going"
            color={color}
            onPress={() => restartPlan({ mode: "polish", level: "starting" })}
          />
          <SecondaryButton label="Change my approach" color={color} onPress={() => restartPlan()} />
          <SecondaryButton label="Try a different skill" color={color} onPress={onTryDifferent} />
        </View>
      ) : stepDone && !holdStep ? (
        <Animated.View entering={FadeIn.duration(220)} style={[mentalStyles.card, styles.panel]}>
          {isLastStep ? (
            <>
              <Text style={styles.panelTitle}>Round complete <AppIcon name="party-popper" size={18} color={color} /></Text>
              <Text style={mentalStyles.body}>
                You&apos;ve worked through every step. Start a new round with a fresh focus?
              </Text>
              <View style={mentalStyles.row}>
                <SecondaryButton flex label="Not yet" color={color} onPress={() => setHoldStep(true)} />
                <PrimaryButton flex label="New round" color={color} onPress={() => restartPlan()} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.panelTitle}>Ready for the next step?</Text>
              <Text style={mentalStyles.body}>
                You&apos;ve practised {skill.sessionsAtStep} times on this step. Next up: {steps[stepIndex + 1].title.toLowerCase()}.
              </Text>
              <View style={mentalStyles.row}>
                <SecondaryButton flex label="Not yet" color={color} onPress={() => setHoldStep(true)} />
                <PrimaryButton
                  flex
                  label="Next step"
                  color={color}
                  onPress={() => onUpdate((current) => ({ ...current, step: current.step + 1, sessionsAtStep: 0 }))}
                />
              </View>
            </>
          )}
        </Animated.View>
      ) : null}

      {logging ? (
        <View style={[mentalStyles.card, styles.panel]}>
          <Text style={styles.panelTitle}>Log a session</Text>
          <Text style={mentalStyles.label}>HOW LONG? (OPTIONAL)</Text>
          <View style={mentalStyles.chips}>
            {MINUTES.map((value) => (
              <SelectionChip
                key={value}
                label={value === 45 ? "45+ min" : `${value} min`}
                color={color}
                selected={minutes === value}
                onPress={() => setMinutes(minutes === value ? null : value)}
              />
            ))}
          </View>
          <Text style={mentalStyles.label}>HOW DID IT GO? (OPTIONAL)</Text>
          <View style={mentalStyles.chips}>
            {FEELS.map((item) => (
              <SelectionChip
                key={item.id}
                icon={item.icon}
                label={item.label}
                color={color}
                selected={feel === item.id}
                onPress={() => setFeel(feel === item.id ? null : item.id)}
              />
            ))}
          </View>
          <View style={mentalStyles.row}>
            <SecondaryButton flex label="Cancel" color={color} onPress={() => setLogging(false)} />
            <PrimaryButton flex label="Save session" color={color} onPress={logSession} />
          </View>
        </View>
      ) : (
        <PrimaryButton label="Practised ✓" color={color} onPress={() => setLogging(true)} />
      )}
      {justLogged && !logging && (
        <Text accessibilityLiveRegion="polite" style={[mentalStyles.body, styles.center]}>
          Nice work. That&apos;s {skill.sessions} session{skill.sessions === 1 ? "" : "s"} of {skill.name}.
        </Text>
      )}

      {skill.recent.length > 0 && (
        <View style={styles.recent}>
          <Text style={mentalStyles.label}>RECENT SESSIONS</Text>
          {skill.recent.slice(0, 3).map((session, index) => (
            <Text key={`${session.day}-${index}`} style={mentalStyles.muted}>
              {formatDay(session.day, today)}
              {session.minutes ? ` · ${session.minutes === 45 ? "45+" : session.minutes} min` : ""}
              {session.feel ? ` · ${session.feel}` : ""}
            </Text>
          ))}
        </View>
      )}

      <SecondaryButton label="See the full plan" color={color} onPress={onOpenPlan} />
      <SecondaryButton label="Back to my skills" color={color} onPress={onBack} />
      <SecondaryButton subtle label={`Remove ${skill.name}`} color={COLORS.muted} onPress={confirmRemove} />
      {exit}
    </View>
  );
}

function formatDay(day: DayKey, today: DayKey) {
  const gap = daysBetween(day, today);
  if (gap === 0) return "Today";
  if (gap === 1) return "Yesterday";
  return `${gap} days ago`;
}

function Progress({ total, current, color }: { total: number; current: number; color: string }) {
  return (
    <View style={styles.progress} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: total }, (_, index) => (
        <View
          key={index}
          style={[styles.progressDot, { backgroundColor: index <= current ? color : COLORS.border }]}
        />
      ))}
    </View>
  );
}

function PathCard({
  icon,
  title,
  detail,
  color,
  soft,
  selected = false,
  onPress,
}: {
  icon?: IconName;
  title: string;
  detail: string;
  color: string;
  soft: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pathCard,
        selected && { borderColor: color, backgroundColor: soft },
        pressed && styles.pressed,
      ]}
    >
      {icon && (
        <View style={[styles.pathIcon, { backgroundColor: soft }]}>
          <AppIcon name={icon} size={24} color={color} />
        </View>
      )}
      <View style={styles.pathCopy}>
        <Text style={[styles.pathTitle, selected && { color }]}>{title}</Text>
        <Text style={mentalStyles.muted}>{detail}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.8 },
  pathCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  pathIcon: { width: 48, height: 48, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  pathCopy: { flex: 1, gap: 4 },
  pathTitle: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  skillBadge: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  skillBadgeText: { fontSize: 13, fontWeight: "800" },
  progress: { flexDirection: "row", gap: 6 },
  progressDot: { flex: 1, height: 5, borderRadius: 3 },
  tryBox: { padding: 14, borderRadius: 14, gap: 4 },
  tryLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  summary: { gap: 4, alignSelf: "stretch" },
  todayCard: { padding: 18, borderRadius: 20, gap: 8 },
  todayText: { color: COLORS.ink, fontSize: 18, fontWeight: "800", lineHeight: 25 },
  panel: { gap: 10 },
  panelTitle: { color: COLORS.ink, fontSize: 16, fontWeight: "800" },
  recent: { gap: 4 },
});
