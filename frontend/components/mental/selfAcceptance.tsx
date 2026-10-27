import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import {
  ActivityHeader,
  ActivityProps,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SelectionChip,
} from "../common/ActivityUI";
import { COLORS } from "../common/AppShell";
import { ReflectionJournal } from "../common/GuidedActivities";

// Self-Acceptance activities. Every prompt is optional, and the letter lets
// people choose a moment that feels okay to revisit.

const BRANCH = "Self-Acceptance";

const TIME_FRAMES = ["3 months ago", "6 months ago", "1 year ago", "3 years ago"];
const CUSTOM = "Custom";

export function LetterToPastSelf(props: ActivityProps) {
  const { color, onExit } = props;
  const [choice, setChoice] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [frame, setFrame] = useState<string | null>(null);

  const selected = choice === CUSTOM ? custom.trim() : choice;

  if (frame) {
    return (
      <ReflectionJournal
        {...props}
        key={frame}
        onBack={() => setFrame(null)}
        branch={BRANCH}
        title="Letter to My Past Self"
        intro=""
        main={{
          label: frame,
          description: "",
          prompts: [
            {
              question: `Think back to ${frame}. What was one big problem you were facing?`,
              hint: "Choose something that feels okay to revisit. A few words is enough.",
              ideas: ["School or exam stress", "A friendship or relationship", "Family pressure", "Feeling lost or unsure", "A big change"],
            },
            {
              question: "Write a letter of encouragement to yourself in that situation.",
              hint: "What do you wish someone had told you then? Speak to yourself the way you'd speak to a good friend.",
              placeholder: `Dear me, ${frame}…`,
              ideas: ["You were doing your best", "It gets easier", "You don't have to be perfect", "You are not alone"],
            },
            {
              question: "How would you like to sign off?",
              ideas: ["With love", "I've got you", "Keep going", "Thank you"],
            },
          ],
        }}
        completion={{
          badge: "email-outline",
          title: "Letter written",
          message: "Speaking to yourself with kindness is a skill, and you just practised it. Your words stay with you, not in the app.",
        }}
      />
    );
  }

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow={BRANCH} title="Letter to My Past Self" color={color} />
      <Text style={mentalStyles.body}>
        Pick a moment in your past, then write that version of you a few words of encouragement.
      </Text>
      <Text style={mentalStyles.label}>WHEN ARE YOU WRITING TO?</Text>
      <View style={mentalStyles.chips}>
        {[...TIME_FRAMES, CUSTOM].map((option) => (
          <SelectionChip
            key={option}
            label={option}
            color={color}
            selected={choice === option}
            onPress={() => setChoice(option)}
          />
        ))}
      </View>
      {choice === CUSTOM && (
        <TextInput
          accessibilityLabel="Custom time frame"
          value={custom}
          onChangeText={setCustom}
          placeholder="e.g. 2 weeks ago, or when I started university"
          placeholderTextColor={COLORS.muted}
          style={mentalStyles.input}
          autoFocus
        />
      )}
      <PrimaryButton label="Start writing" color={color} disabled={!selected} onPress={() => setFrame(selected)} />
      <Text style={[mentalStyles.muted, styles.center]}>
        Every prompt is optional. You can skip any of them or stop at any time.
      </Text>
      <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />
    </View>
  );
}

export function LessonsNotLabels(props: ActivityProps) {
  return (
    <ReflectionJournal
      {...props}
      branch={BRANCH}
      title="Lessons, Not Labels"
      intro="A mistake is something that happened, not who you are. Let's turn a label into a lesson."
      main={{
        label: "Look at a small moment",
        description: "Pick an everyday slip-up, like a missed deadline or a message you regret.",
        prompts: [
          {
            question: "What happened?",
            hint: "Just the facts, briefly. A small, everyday moment is perfect.",
            placeholder: "e.g. I forgot to reply to a friend.",
          },
          {
            question: "What label did you put on yourself?",
            hint: "The harsh words your inner critic used.",
            ideas: ["I'm useless", "I always mess up", "I'm a bad friend", "I'm not smart enough"],
          },
          {
            question: "What did the experience teach you?",
            ideas: [
              "I need reminders for important things",
              "I was overloaded",
              "I care about doing well",
              "It's okay to ask for help",
            ],
          },
          {
            question: "Now rewrite the label as a fair, kind sentence.",
            hint: "Try: “I made a mistake, and I'm learning…”",
            placeholder: "I made a mistake, and…",
          },
        ],
      }}
      completion={{
        badge: "pencil-outline",
        title: "Label turned into a lesson",
        message: "Mistakes are how everyone learns. Noticing the lesson, without the label, is a real act of self-acceptance.",
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
});
