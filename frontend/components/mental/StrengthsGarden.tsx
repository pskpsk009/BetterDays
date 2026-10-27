import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  ActivityHeader,
  ActivityProps,
  ModeCard,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  QuestionCard,
  SecondaryButton,
  SelectionChip,
} from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { ChoiceExplorer } from "../common/GuidedActivities";
import { pickForDay } from "../common/localStore";
import { CHALLENGES, SPOT_PEOPLE, STRENGTH_GROUPS, STRENGTHS } from "./strengths";

// My Strengths Garden: plant the strengths you see in yourself, grow one with
// a small daily challenge, or practise noticing strengths in other people.

const BRANCH = "Self-Acceptance";
const TITLE = "My Strengths Garden";

type Mode = "start" | "plant" | "grow" | "spot";

export function StrengthsGarden(props: ActivityProps) {
  const { color, soft, onExit } = props;
  const [mode, setMode] = useState<Mode>("start");

  const header = <ActivityHeader eyebrow={BRANCH} title={TITLE} color={color} />;
  const back = () => setMode("start");

  if (mode === "plant") {
    return (
      <ChoiceExplorer
        {...props}
        branch={BRANCH}
        title={TITLE}
        intro="Everyone has strengths, even on days when it doesn't feel like it. Pick the ones you see in yourself, or that others have noticed."
        pickLabel="Plant your strengths"
        maxPicks={6}
        groups={STRENGTH_GROUPS}
        customPlaceholder="Add another strength…"
        customNote="A strength that's uniquely yours."
        resultTitle="Your garden"
        resultIntro="Here's what's growing. Strengths grow stronger the more you use them."
        followUp="Which one would you like to grow a little more this week?"
        followUpAnswer={(label) =>
          `Look for one small chance to use “${label}” this week. "Grow a strength" can give you a daily challenge for it.`
        }
        completion={{
          badge: "✿",
          title: "Garden planted",
          message: "You named real strengths. On harder days, it can help to come back and remember them.",
        }}
      />
    );
  }

  if (mode === "grow") return <GrowStrength color={color} soft={soft} onBack={back} onExit={onExit} />;
  if (mode === "spot") return <SpotStrength color={color} soft={soft} onBack={back} onExit={onExit} />;

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Text style={mentalStyles.body}>
        Everyone has strengths. Plant yours, grow one a little more, or notice them in the people around you.
      </Text>
      <Text style={mentalStyles.label}>WHAT WOULD YOU LIKE TO DO?</Text>
      <ModeCard icon="🌱" title="Plant my garden" detail="Pick the strengths you see in yourself." color={color} soft={soft} onPress={() => setMode("plant")} />
      <ModeCard icon="💪" title="Grow a strength" detail="Get a small challenge for a strength you'd like more of." color={color} soft={soft} onPress={() => setMode("grow")} />
      <ModeCard icon="👀" title="Spot it in others" detail="Notice who showed a strength today." color={color} soft={soft} onPress={() => setMode("spot")} />
      <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />
    </View>
  );
}

type SubProps = { color: string; soft: string; onBack: () => void; onExit: () => void };

function GrowStrength({ color, soft, onBack, onExit }: SubProps) {
  const [strength, setStrength] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [done, setDone] = useState(false);

  const header = <ActivityHeader eyebrow={BRANCH} title="Grow a strength" color={color} />;

  if (done && strength) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="💪"
          title="Challenge accepted"
          message={`Every time you use “${strength}”, it grows a little. Come back tomorrow for a new challenge.`}
          color={color}
          soft={soft}
          primary={{ label: "Back to the garden", onPress: onBack }}
          secondary={{ label: `Back to ${BRANCH}`, onPress: onExit }}
        />
      </View>
    );
  }

  if (!strength) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <QuestionCard stepKey="grow-pick" label="Choose a strength" question="Which strength would you like more of?" hint="Pick one you'd like to grow, even if it doesn't feel strong yet." color={color}>
          <View style={mentalStyles.chips}>
            {STRENGTHS.map((item) => (
              <SelectionChip
                key={item.label}
                label={`${item.icon} ${item.label}`}
                color={color}
                selected={false}
                onPress={() => {
                  setStrength(item.label);
                  setOffset(0);
                }}
              />
            ))}
          </View>
        </QuestionCard>
        <SecondaryButton label="Back" color={color} onPress={onBack} />
      </View>
    );
  }

  const challenges = CHALLENGES[strength];
  // Today's challenge stays the same all day; "Another idea" steps through the rest.
  const base = challenges.indexOf(pickForDay(challenges, strength.length));
  const challenge = challenges[(base + offset) % challenges.length];
  const icon = STRENGTHS.find((item) => item.label === strength)?.icon;

  return (
    <View style={mentalStyles.screen}>
      {header}
      <Animated.View key={offset} entering={FadeIn.duration(220)} style={[styles.challenge, { backgroundColor: soft }]}>
        <Text style={[mentalStyles.label, { color }]}>
          {offset === 0 ? "TODAY'S CHALLENGE" : "ANOTHER IDEA"} · {icon} {strength.toUpperCase()}
        </Text>
        <Text style={styles.challengeText}>{challenge}</Text>
      </Animated.View>
      <PrimaryButton label="I'll try it" color={color} onPress={() => setDone(true)} />
      <View style={mentalStyles.row}>
        <SecondaryButton flex label="Another idea" color={color} onPress={() => setOffset(offset + 1)} />
        <SecondaryButton flex label="Other strength" color={color} onPress={() => setStrength(null)} />
      </View>
      <Text style={[mentalStyles.muted, styles.center]}>Every challenge is optional. Smaller is fine.</Text>
    </View>
  );
}

function SpotStrength({ color, soft, onBack, onExit }: SubProps) {
  const [offset, setOffset] = useState(0);
  const [who, setWho] = useState<string | null>(null);
  const [what, setWhat] = useState("");
  const [done, setDone] = useState(false);

  // Today's strength stays the same all day; "Try another" steps through the rest.
  const base = STRENGTHS.indexOf(pickForDay(STRENGTHS, 7));
  const strength = STRENGTHS[(base + offset) % STRENGTHS.length];
  const header = <ActivityHeader eyebrow={BRANCH} title="Spot it in others" color={color} />;

  if (done) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="👀"
          title="Strength spotted"
          message={
            who === "Me"
              ? `You noticed “${strength.label}” in yourself. That counts.`
              : `Noticing strengths in others helps you see them in yourself too. You could even tell them what you noticed.`
          }
          color={color}
          soft={soft}
          primary={{ label: "Back to the garden", onPress: onBack }}
          secondary={{ label: `Back to ${BRANCH}`, onPress: onExit }}
        />
      </View>
    );
  }

  return (
    <View style={mentalStyles.screen}>
      {header}
      <QuestionCard
        stepKey={`spot-${offset}`}
        label={offset === 0 ? "Today's strength" : "Another strength"}
        question={`Who showed ${strength.icon} ${strength.label.toLowerCase()} today?`}
        hint={strength.note}
        color={color}
      >
        <View style={mentalStyles.chips}>
          {SPOT_PEOPLE.map((person) => (
            <SelectionChip
              key={person}
              label={person}
              color={color}
              selected={who === person}
              onPress={() => setWho(who === person ? null : person)}
            />
          ))}
        </View>
        <TextInput
          accessibilityLabel="What did they do?"
          multiline
          value={what}
          onChangeText={setWhat}
          placeholder="What did they do? (optional)"
          placeholderTextColor={COLORS.muted}
          style={mentalStyles.input}
          textAlignVertical="top"
        />
      </QuestionCard>
      <PrimaryButton label="Done" color={color} disabled={!who} onPress={() => setDone(true)} />
      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Try another"
          color={color}
          onPress={() => {
            setOffset(offset + 1);
            setWho(null);
            setWhat("");
          }}
        />
        <SecondaryButton flex label="Back" color={color} onPress={onBack} />
      </View>
      <Text style={[mentalStyles.muted, styles.center]}>Nothing you enter here is saved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  challenge: { padding: 20, borderRadius: 20, gap: 10 },
  challengeText: { color: COLORS.ink, fontSize: 19, fontWeight: "800", lineHeight: 26 },
});
