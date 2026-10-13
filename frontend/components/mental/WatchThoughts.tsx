import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { COLORS } from "../common/AppShell";
import {
  ActivityHeader,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
  SelectionChip,
  SupportNote,
} from "../common/ActivityUI";

const CATEGORIES = [
  "Worry",
  "Planning",
  "Memory",
  "Prediction",
  "Self-criticism",
];

const EXAMPLES = [
  "I have so much to do tomorrow.",
  "What if I say the wrong thing?",
  "I keep replaying that conversation.",
  "I should be better at this by now.",
];

type Stage = "write" | "float" | "breathe" | "done";

export function WatchThoughts({
  color,
  soft,
  onExit,
}: {
  color: string;
  soft: string;
  onExit: () => void;
}) {
  const [stage, setStage] = useState<Stage>("write");
  const [thought, setThought] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  function restart() {
    setThought("");
    setCategory(null);
    setStage("write");
  }

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Live the Life" title="Watch Your Thoughts" color={color} />

      <View style={[styles.scene, { backgroundColor: soft }]}>
        <DriftingBackground color={color} />

        {stage === "write" && (
          <View style={styles.sceneContent}>
            <Text style={styles.sceneTitle}>What is on your mind?</Text>
            <Text style={mentalStyles.body}>
              Thoughts come and go on their own. You don&apos;t need to judge
              them or push them away, just notice one.
            </Text>
            <TextInput
              accessibilityLabel="A thought you notice"
              maxLength={140}
              multiline
              onChangeText={setThought}
              placeholder="Type a thought, or pick an example below"
              placeholderTextColor={COLORS.muted}
              style={mentalStyles.input}
              textAlignVertical="top"
              value={thought}
            />
            <View style={mentalStyles.chips}>
              {EXAMPLES.map((example) => (
                <SelectionChip
                  key={example}
                  label={example}
                  color={color}
                  selected={thought === example}
                  onPress={() => setThought(example)}
                />
              ))}
            </View>
            <Text style={mentalStyles.label}>KIND OF THOUGHT (OPTIONAL)</Text>
            <View style={mentalStyles.chips}>
              {CATEGORIES.map((item) => (
                <SelectionChip
                  key={item}
                  label={item}
                  color={color}
                  selected={category === item}
                  onPress={() =>
                    setCategory((current) => (current === item ? null : item))
                  }
                />
              ))}
            </View>
          </View>
        )}

        {stage === "float" && (
          <FloatingThought
            text={thought}
            category={category}
            color={color}
          />
        )}

        {stage === "breathe" && <BreathPrompt color={color} />}

        {stage === "done" && (
          <View style={[styles.sceneContent, styles.centered]}>
            <Text style={styles.sceneTitle}>Thanks for pausing</Text>
            <Text style={[mentalStyles.body, styles.center]}>
              You noticed a thought and gave it a little space. It may come
              back later, and that&apos;s okay. You can always watch it again.
            </Text>
          </View>
        )}
      </View>

      {stage === "write" && (
        <>
          <View style={mentalStyles.row}>
            <SecondaryButton
              flex
              label="Skip"
              color={color}

              onPress={() => setStage("breathe")}
            />
            <PrimaryButton
              flex
              label="Continue"
              color={color}
              disabled={thought.trim().length === 0}
              onPress={() => setStage("float")}
            />
          </View>
          <SupportNote>Nothing you type here is saved.</SupportNote>
        </>
      )}

      {stage === "float" && (
        <View style={mentalStyles.row}>
          <SecondaryButton
            flex
            label="Finish"
            color={color}

            onPress={() => setStage("done")}
          />
          <PrimaryButton
            flex
            label="Continue"
            color={color}
            onPress={() => setStage("breathe")}
          />
        </View>
      )}

      {stage === "breathe" && (
        <View style={mentalStyles.row}>
          <SecondaryButton
            flex
            label="Skip"
            color={color}

            onPress={() => setStage("done")}
          />
          <PrimaryButton
            flex
            label="Finish"
            color={color}
            onPress={() => setStage("done")}
          />
        </View>
      )}

      {stage === "done" && (
        <View style={styles.stack}>
          <PrimaryButton label="Watch another thought" color={color} onPress={restart} />
          <SecondaryButton
            label="Back to Live the Life"
            color={color}

            onPress={onExit}
          />
        </View>
      )}
    </View>
  );
}

function DriftingBackground({ color }: { color: string }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <DriftOrb color={color} size={140} left="-12%" top={30} delay={0} />
      <DriftOrb color={color} size={90} left="70%" top={140} delay={1800} />
      <DriftOrb color={color} size={60} left="40%" top={320} delay={900} />
    </View>
  );
}

function DriftOrb({
  color,
  size,
  left,
  top,
  delay,
}: {
  color: string;
  size: number;
  left: `${number}%`;
  top: number;
  delay: number;
}) {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, [delay, drift]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -24 * drift.value },
      { translateX: 10 * drift.value },
    ],
    opacity: 0.1 + 0.08 * drift.value,
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left,
          top,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

function FloatingThought({
  text,
  category,
  color,
}: {
  text: string;
  category: string | null;
  color: string;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      1200,
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
    );
  }, [progress]);

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * 0.92,
    transform: [
      { translateY: -170 * progress.value },
      { translateX: 18 * Math.sin(progress.value * Math.PI * 2) },
      { scale: 1 - progress.value * 0.25 },
    ],
  }));

  return (
    <View style={[styles.sceneContent, styles.floatScene]}>
      <Animated.View style={[styles.thoughtBubble, bubbleStyle]}>
        {category && (
          <Text style={[mentalStyles.label, { color }]}>
            {category.toUpperCase()}
          </Text>
        )}
        <Text style={styles.thoughtText}>{text}</Text>
      </Animated.View>
      <Text style={[mentalStyles.body, styles.center, styles.floatCaption]}>
        Notice the thought without judging it. Watch it drift, like a cloud
        passing by. It&apos;s just a thought, not a fact or a command.
      </Text>
    </View>
  );
}

function BreathPrompt({ color }: { color: string }) {
  const scale = useSharedValue(0.7);
  const [label, setLabel] = useState("Breathe in");

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.7, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    let inhale = true;
    let timeout: ReturnType<typeof setTimeout>;
    const flip = () => {
      timeout = setTimeout(() => {
        inhale = !inhale;
        setLabel(inhale ? "Breathe in" : "Breathe out");
        flip();
      }, inhale ? 4000 : 6000);
    };
    flip();
    return () => clearTimeout(timeout);
  }, [scale]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.sceneContent, styles.centered]}>
      <Text style={styles.sceneTitle}>One slow breath</Text>
      <Text style={[mentalStyles.body, styles.center]}>
        Before you move on, breathe in gently and let a long breath out.
      </Text>
      <View style={styles.breathStage}>
        <Animated.View
          style={[styles.breathCircle, { backgroundColor: color }, circleStyle]}
        />
        <Text accessibilityLiveRegion="polite" style={styles.breathLabel}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  centered: { alignItems: "center" },
  scene: {
    minHeight: 400,
    borderRadius: 22,
    overflow: "hidden",
  },
  sceneContent: { padding: 18, gap: 12 },
  sceneTitle: { color: COLORS.ink, fontSize: 19, fontWeight: "800" },
  orb: { position: "absolute" },
  floatScene: {
    flex: 1,
    minHeight: 400,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 26,
  },
  thoughtBubble: {
    maxWidth: "88%",
    marginBottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 26,
    backgroundColor: COLORS.white,
    gap: 6,
    shadowColor: "#205655",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  },
  thoughtText: {
    color: COLORS.ink,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  floatCaption: { maxWidth: 320 },
  breathStage: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  breathCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.85,
  },
  breathLabel: { color: COLORS.white, fontSize: 18, fontWeight: "800" },
  stack: { gap: 10 },
});
