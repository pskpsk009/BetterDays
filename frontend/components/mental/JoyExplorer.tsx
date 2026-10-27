import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import {
  ActivityHeader,
  ActivityProps,
  CompletionScreen,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
} from "../common/ActivityUI";
import { AppIcon, IconName } from "../common/AppIcon";
import { COLORS } from "../common/AppShell";

// Joy Explorer: pick a field, then roll the dice for a small idea to try.
// Ideas are a menu, never a recommendation everyone should follow.

const BRANCH = "Discover Your Joy";

type Idea = { icon: IconName; text: string };
type Field = { id: string; label: string; icon: IconName; ideas: Idea[] };

const FIELDS: Field[] = [
  {
    id: "creativity",
    label: "Creativity",
    icon: "palette-outline",
    ideas: [
      { icon: "pencil-outline", text: "Doodle anything for five minutes, no skill needed." },
      { icon: "note-edit-outline", text: "Write a four-line poem about your day." },
      { icon: "bird", text: "Fold a simple origami shape from scrap paper." },
      { icon: "camera-outline", text: "Take five photos of things that share one colour." },
      { icon: "tshirt-crew-outline", text: "Make something small with your hands: a bracelet, a card, a clay shape." },
      { icon: "recycle", text: "Turn something you'd throw away into something new." },
    ],
  },
  {
    id: "social",
    label: "Social",
    icon: "hand-wave-outline",
    ideas: [
      { icon: "chat-outline", text: "Message a friend you haven't talked to in a while." },
      { icon: "walk", text: "Invite someone for a short walk or a coffee." },
      { icon: "dice-5-outline", text: "Play a game with a friend, in person or online." },
      { icon: "flower-tulip-outline", text: "Give someone a genuine compliment." },
      { icon: "egg-fried", text: "Cook or share a meal with someone." },
      { icon: "domain", text: "Look up a club or group that meets near you." },
    ],
  },
  {
    id: "music",
    label: "Music",
    icon: "music-note",
    ideas: [
      { icon: "headphones", text: "Make a short playlist for the mood you're in." },
      { icon: "album", text: "Listen to an album from start to finish." },
      { icon: "microphone-outline", text: "Learn the chorus of a song you like." },
      { icon: "piano", text: "Try a free instrument app for a few minutes." },
      { icon: "earth", text: "Discover an artist from another country." },
      { icon: "metronome", text: "Tap out a rhythm along with your favourite song." },
    ],
  },
  {
    id: "nature",
    label: "Nature",
    icon: "tree-outline",
    ideas: [
      { icon: "ear-hearing", text: "Take a ten-minute walk and notice every sound." },
      { icon: "cloud-outline", text: "Sit outside or by a window and watch the sky." },
      { icon: "sprout", text: "Water or care for a plant, even a small one." },
      { icon: "leaf-maple", text: "Find three leaves or stones that look interesting." },
      { icon: "weather-sunset", text: "Watch a sunrise or sunset." },
      { icon: "basket-outline", text: "Eat a snack or meal outdoors." },
    ],
  },
  {
    id: "movement",
    label: "Movement",
    icon: "human-female-dance",
    ideas: [
      { icon: "music", text: "Dance to one song, your own way." },
      { icon: "meditation", text: "Stretch gently for five minutes." },
      { icon: "map-outline", text: "Walk a route you've never taken before." },
      { icon: "television", text: "Follow a short beginner yoga or dance video." },
      { icon: "soccer", text: "Kick, throw, or bounce a ball around." },
      { icon: "bike", text: "Go for a short bike or scooter ride." },
    ],
  },
  {
    id: "learning",
    label: "Learning",
    icon: "lightbulb-on-outline",
    ideas: [
      { icon: "video-outline", text: "Watch a short tutorial on something you're curious about." },
      { icon: "account-voice", text: "Learn five words in a new language." },
      { icon: "puzzle-outline", text: "Try a puzzle or brain teaser." },
      { icon: "newspaper-variant-outline", text: "Read one article about a topic you know nothing about." },
      { icon: "cards-playing-outline", text: "Learn a simple card trick." },
      { icon: "pasta", text: "Cook a recipe you've never tried." },
    ],
  },
  {
    id: "calm",
    label: "Calm",
    icon: "tea-outline",
    ideas: [
      { icon: "coffee-outline", text: "Make a warm drink and sip it slowly." },
      { icon: "bookshelf", text: "Read a few pages of something you enjoy." },
      { icon: "brush-outline", text: "Colour in a picture or pattern." },
      { icon: "weather-pouring", text: "Listen to rain or nature sounds for a few minutes." },
      { icon: "notebook-outline", text: "Write down three small things that went well today." },
      { icon: "bathtub-outline", text: "Take a slow shower or bath with music on." },
    ],
  },
];

// Pip positions on a 3x3 grid for each dice face.
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function randomOther(count: number, current: number | null) {
  if (count <= 1) return 0;
  const next = Math.floor(Math.random() * (count - 1));
  return current !== null && next >= current ? next + 1 : next;
}

export function JoyExplorer({ color, soft, onExit }: ActivityProps) {
  const [field, setField] = useState<Field | null>(null);
  const [ideaIndex, setIdeaIndex] = useState<number | null>(null);
  const [face, setFace] = useState(6);
  const [rolls, setRolls] = useState(0);
  const [done, setDone] = useState(false);

  const reduceMotion = useReducedMotion();
  const spin = useSharedValue(0);
  const diceStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }, { scale: 1 - Math.abs(Math.sin((spin.value * Math.PI) / 180)) * 0.12 }],
  }));

  const header = <ActivityHeader eyebrow={BRANCH} title="Joy Explorer" color={color} />;

  function chooseField(next: Field) {
    setField(next);
    setIdeaIndex(null);
    setRolls(0);
  }

  function roll() {
    if (!field) return;
    setIdeaIndex(randomOther(field.ideas.length, ideaIndex));
    setFace(1 + randomOther(6, face - 1));
    setRolls((count) => count + 1);
    if (!reduceMotion) {
      spin.value = withSequence(withTiming(0, { duration: 0 }), withTiming(360, { duration: 520 }));
    }
  }

  if (done && field && ideaIndex !== null) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <CompletionScreen
          badge="white-balance-sunny"
          title="Idea picked"
          message={`“${field.ideas[ideaIndex].text}” Try it whenever suits you, and notice how it feels. Your pick stays with you, not in the app.`}
          color={color}
          soft={soft}
          primary={{
            label: "Explore another field",
            onPress: () => {
              setDone(false);
              setField(null);
              setIdeaIndex(null);
            },
          }}
          secondary={{ label: `Back to ${BRANCH}`, onPress: onExit }}
        />
      </View>
    );
  }

  if (!field) {
    return (
      <View style={mentalStyles.screen}>
        {header}
        <Text style={mentalStyles.body}>
          Choose a field that sounds fun right now, then roll the dice for a small idea to try.
        </Text>
        <Text style={mentalStyles.label}>CHOOSE A FIELD</Text>
        <View style={styles.grid}>
          {FIELDS.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => chooseField(item)}
              style={({ pressed }) => [styles.field, pressed && { backgroundColor: soft, borderColor: color }]}
            >
              <AppIcon name={item.icon} size={28} color={color} />
              <Text style={styles.fieldLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
        <SecondaryButton subtle label={`Back to ${BRANCH}`} color={COLORS.muted} onPress={onExit} />
      </View>
    );
  }

  const idea = ideaIndex === null ? null : field.ideas[ideaIndex];

  return (
    <View style={mentalStyles.screen}>
      {header}
      <View style={[styles.fieldBadge, { backgroundColor: soft }]}>
        <Text style={styles.fieldBadgeText}>
          <AppIcon name={field.icon} size={16} color={color} /> {field.label}
        </Text>
      </View>

      <View style={styles.diceWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Roll the dice for a ${field.label.toLowerCase()} idea`}
          onPress={roll}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Animated.View style={[styles.dice, { borderColor: color }, diceStyle]}>
            {Array.from({ length: 9 }, (_, cell) => (
              <View key={cell} style={styles.pipCell}>
                {PIPS[face].includes(cell) && <View style={[styles.pip, { backgroundColor: color }]} />}
              </View>
            ))}
          </Animated.View>
        </Pressable>
        <Text style={mentalStyles.muted}>{rolls === 0 ? "Tap the dice to roll" : "Tap to roll again"}</Text>
      </View>

      {idea && (
        <Animated.View
          key={rolls}
          entering={reduceMotion ? undefined : FadeIn.delay(380).duration(240)}
          style={[mentalStyles.card, styles.idea]}
          accessibilityLiveRegion="polite"
        >
          <View style={[styles.ideaIcon, { backgroundColor: soft }]}>
            <AppIcon name={idea.icon} size={26} color={color} />
          </View>
          <Text style={styles.ideaText}>{idea.text}</Text>
        </Animated.View>
      )}

      {idea && <PrimaryButton label="I'll try this" color={color} onPress={() => setDone(true)} />}
      <SecondaryButton label="Change field" color={color} onPress={() => setField(null)} />
      <Text style={[mentalStyles.muted, styles.center]}>
        Not feeling it? Roll again. There are no right answers.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  pressed: { opacity: 0.8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  field: {
    width: "31%",
    flexGrow: 1,
    minHeight: 92,
    padding: 12,
    gap: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: { color: COLORS.ink, fontSize: 13, fontWeight: "800" },
  fieldBadge: { alignSelf: "center", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  fieldBadgeText: { color: COLORS.ink, fontSize: 14, fontWeight: "800" },
  diceWrap: { alignItems: "center", gap: 12, paddingVertical: 8 },
  dice: {
    width: 120,
    height: 120,
    padding: 14,
    borderRadius: 26,
    borderWidth: 3,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    flexWrap: "wrap",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pipCell: { width: "33.33%", height: "33.33%", alignItems: "center", justifyContent: "center" },
  pip: { width: 18, height: 18, borderRadius: 9 },
  idea: { flexDirection: "row", alignItems: "center", gap: 14 },
  ideaIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  ideaText: { flex: 1, color: COLORS.ink, fontSize: 16, fontWeight: "700", lineHeight: 22 },
});
