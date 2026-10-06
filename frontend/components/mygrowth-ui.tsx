import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Polyline,
  Rect,
  Stop,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const COLORS = {
  background: "#F5FAF8",
  ink: "#183B42",
  muted: "#6D8589",
  border: "#DCEBE8",
  white: "#FFFFFF",
  teal: "#247F7B",
  tealSoft: "#E7F5F0",
  mind: "#6587D9",
  mindSoft: "#EDF1FC",
  movement: "#DD8C43",
  movementSoft: "#FFF1DF",
};

type Tone = "teal" | "mind" | "body" | "movement";
const toneColor: Record<Tone, string> = {
  teal: COLORS.teal,
  mind: COLORS.mind,
  body: COLORS.teal,
  movement: COLORS.movement,
};

export function MobileScreen({
  children,
  tone = "teal",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 18) }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 105 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function HomeHeader() {
  return (
    <View style={styles.homeHeader}>
      <View style={styles.brand}>
        <View style={styles.brandMark}>
          <Text style={styles.leaf}>+</Text>
        </View>
        <Text style={styles.brandText}>MyGrowth</Text>
      </View>
      <Pressable
        accessibilityLabel="Profile and settings"
        style={styles.profile}
      >
        <Text style={styles.profileText}>o</Text>
      </Pressable>
    </View>
  );
}

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.replace("/")} style={styles.back}>
        <Text style={styles.backArrow}>{"<"}</Text>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const zones = {
  head: {
    label: "Mental Development",
    route: "/mental" as const,
    color: COLORS.mind,
  },
  body: {
    label: "Body Functions",
    route: "/body" as const,
    color: COLORS.teal,
  },
  legs: {
    label: "Movement Trail",
    route: "/trail" as const,
    color: COLORS.movement,
  },
};
type Zone = keyof typeof zones;

export function HumanFigure() {
  const router = useRouter();
  const [active, setActive] = useState<Zone | null>(null);
  const select = (zone: Zone) => {
    setActive(zone);
    setTimeout(() => router.push(zones[zone].route), 450);
  };
  const groupProps = (zone: Zone) => ({
    onPress: () => select(zone),
    accessibilityLabel: zones[zone].label,
  });
  return (
    <View style={styles.figureWrap}>
      <View style={styles.figureHalo} />
      <Svg
        width="270"
        height="390"
        viewBox="0 0 300 520"
        accessibilityLabel="Tap head, body, or legs"
      >
        <Defs>
          <LinearGradient id="headFill" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#B7D9F4" />
            <Stop offset="1" stopColor="#88B4E7" />
          </LinearGradient>
          <LinearGradient id="bodyFill" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#B6E5D7" />
            <Stop offset="1" stopColor="#73C5B1" />
          </LinearGradient>
          <LinearGradient id="legFill" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#F8DCA5" />
            <Stop offset="1" stopColor="#EABB71" />
          </LinearGradient>
        </Defs>
        <Ellipse
          cx="150"
          cy="503"
          rx="72"
          ry="9"
          fill="#B5D6CD"
          opacity=".55"
        />
        <G
          {...groupProps("head")}
          opacity={active && active !== "head" ? 0.45 : 1}
        >
          <Path
            d="M150 18 C123 18 112 37 113 61 C114 87 127 101 150 101 C173 101 186 87 187 61 C188 37 177 18 150 18Z"
            fill="url(#headFill)"
            stroke="#FFF"
            strokeWidth="3"
          />
          <Circle cx="150" cy="58" r="5" fill="#FFF" />
        </G>
        <G
          {...groupProps("body")}
          opacity={active && active !== "body" ? 0.45 : 1}
        >
          <Path
            d="M135 107 L165 107 L169 115 C192 117 207 124 214 141 L253 245 Q261 264 248 270 Q235 276 228 257 L198 188 L190 255 Q188 270 184 282 L116 282 Q112 270 110 255 L102 188 L72 257 Q65 276 52 270 Q39 264 47 245 L86 141 Q93 120 131 115Z"
            fill="url(#bodyFill)"
            stroke="#FFF"
            strokeWidth="3"
          />
          <Circle cx="150" cy="190" r="6" fill="#FFF" />
        </G>
        <G
          {...groupProps("legs")}
          opacity={active && active !== "legs" ? 0.45 : 1}
        >
          <Path
            d="M116 289 L184 289 Q190 316 183 356 L178 463 Q180 472 190 479 Q197 487 185 490 L160 490 Q148 489 149 477 L151 365 L145 365 L145 477 Q146 489 134 490 L109 490 Q97 487 104 479 Q115 472 116 463 L110 356 Q103 316 116 289Z"
            fill="url(#legFill)"
            stroke="#FFF"
            strokeWidth="3"
          />
          <Circle cx="150" cy="390" r="5" fill="#FFF" />
        </G>
      </Svg>
      <View style={[styles.pin, styles.pinHead]}>
        <Text style={[styles.pinText, { color: COLORS.mind }]}>Mind</Text>
      </View>
      <View style={[styles.pin, styles.pinBody]}>
        <Text style={[styles.pinText, { color: COLORS.teal }]}>Body</Text>
      </View>
      <View style={[styles.pin, styles.pinLegs]}>
        <Text style={[styles.pinText, { color: COLORS.movement }]}>Trail</Text>
      </View>
      {active && (
        <View style={styles.zoneToast}>
          <Text style={styles.toastSmall}>Selected area</Text>
          <Text style={[styles.toastStrong, { color: zones[active].color }]}>
            {zones[active].label}
          </Text>
        </View>
      )}
    </View>
  );
}

const mentalCards = [
  {
    title: "Focus & Attention",
    detail: "Keep your attention where it matters.",
    progress: 72,
    value: "18 min",
    icon: "o",
  },
  {
    title: "Learning & Memory",
    detail: "Make space for something new today.",
    progress: 58,
    value: "12 min",
    icon: "+",
  },
  {
    title: "Emotional Wellbeing",
    detail: "Notice how you feel, without judgment.",
    progress: 84,
    value: "Good",
    icon: "u",
  },
  {
    title: "Mindfulness & Habits",
    detail: "Small rituals build a steadier rhythm.",
    progress: 64,
    value: "4 / 6",
    icon: "~",
  },
];
const bodyCards = [
  {
    title: "Sleep",
    detail: "Rest that helps you feel restored.",
    progress: 88,
    value: "7h 30m",
    icon: "z",
  },
  {
    title: "Nutrition",
    detail: "Fuel your day with care and balance.",
    progress: 67,
    value: "2 / 3",
    icon: "+",
  },
  {
    title: "Energy",
    detail: "Check in with your natural rhythm.",
    progress: 76,
    value: "Good",
    icon: "*",
  },
  {
    title: "Physical Activity",
    detail: "A little movement makes a difference.",
    progress: 54,
    value: "16 min",
    icon: ">",
  },
  {
    title: "Health",
    detail: "Listen closely to what your body needs.",
    progress: 80,
    value: "Steady",
    icon: "+",
  },
];

export function WellnessScreen({ type }: { type: "mental" | "body" }) {
  const mental = type === "mental";
  const cards = mental ? mentalCards : bodyCards;
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <MobileScreen tone={mental ? "mind" : "body"}>
      <ScreenHeader
        title={mental ? "Mental Development" : "Body Functions"}
        subtitle={
          mental
            ? "A calmer mind, one small practice at a time."
            : "Small choices that help you feel more like you."
        }
      />
      <View style={styles.intro}>
        <Text
          style={[
            styles.eyebrow,
            { color: mental ? COLORS.mind : COLORS.teal },
          ]}
        >
          {mental ? "Mind space" : "Body space"}
        </Text>
        <Text style={styles.introTitle}>
          {mental ? "How are you growing today?" : "Your daily foundations"}
        </Text>
      </View>
      <View style={styles.cardList}>
        {cards.map((card) => (
          <Pressable
            key={card.title}
            onPress={() => setSelected(card.title)}
            style={({ pressed }) => [
              styles.wellnessCard,
              selected === card.title && {
                borderColor: mental ? COLORS.mind : COLORS.teal,
              },
              pressed && styles.pressed,
            ]}
          >
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: mental ? COLORS.mindSoft : COLORS.tealSoft },
              ]}
            >
              <Text
                style={[
                  styles.cardIconText,
                  { color: mental ? COLORS.mind : COLORS.teal },
                ]}
              >
                {card.icon}
              </Text>
            </View>
            <View style={styles.cardCopy}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text numberOfLines={1} style={styles.cardDetail}>
                {card.detail}
              </Text>
            </View>
            <Text
              style={[
                styles.cardValue,
                { color: mental ? COLORS.mind : COLORS.teal },
              ]}
            >
              {card.value}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${card.progress}%`,
                    backgroundColor: mental ? COLORS.mind : COLORS.teal,
                  },
                ]}
              />
            </View>
          </Pressable>
        ))}
      </View>
      {selected && (
        <View style={styles.selectionNote}>
          <View>
            <Text style={styles.selectionTitle}>{selected}</Text>
            <Text style={styles.selectionSub}>
              Ready for your next small step.
            </Text>
          </View>
          <Pressable onPress={() => setSelected(null)} style={styles.close}>
            <Text>x</Text>
          </Pressable>
        </View>
      )}
    </MobileScreen>
  );
}

function point(step: number) {
  return { x: 35 + ((step * 23) % 270), y: 230 - ((step * 17) % 135) };
}
function distance(points: { x: number; y: number }[]) {
  return (
    points.reduce(
      (sum, current, index) =>
        index
          ? sum +
            Math.hypot(
              current.x - points[index - 1].x,
              current.y - points[index - 1].y,
            )
          : 0,
      0,
    ) / 10
  );
}
function duration(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function TrailScreen() {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const step = useRef(0);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      step.current += 1;
      setPoints((current) => [...current, point(step.current)]);
      setSeconds((current) => current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);
  const marker = points[points.length - 1] ?? point(0);
  const clear = () => {
    setRunning(false);
    setPoints([]);
    setSeconds(0);
    step.current = 0;
  };
  return (
    <MobileScreen tone="movement">
      <ScreenHeader
        title="Movement Trail"
        subtitle="A little more movement, one step at a time."
      />
      <View style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>o Current Position</Text>
          <Text style={styles.simulated}>SIMULATED</Text>
        </View>
        <Svg viewBox="0 0 360 270" style={styles.map}>
          <Defs>
            <LinearGradient id="mapBg" x1="0" x2="0" y1="0" y2="1">
              <Stop stopColor="#E8F4EF" />
              <Stop offset="1" stopColor="#DDEFE9" />
            </LinearGradient>
          </Defs>
          <Rect width="360" height="270" fill="url(#mapBg)" />
          <Path
            d="M35 230 C 75 205, 58 150, 112 162 S 147 245, 190 210 S 213 100, 268 118 S 284 199, 330 80"
            fill="none"
            stroke="#BED9D0"
            strokeWidth="3"
            strokeDasharray="3 7"
          />
          {points.length > 0 && (
            <Polyline
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={COLORS.movement}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          <Circle
            cx={marker.x}
            cy={marker.y}
            r="15"
            fill={COLORS.movementSoft}
            stroke="#FFF"
            strokeWidth="5"
          />
          <Circle cx={marker.x} cy={marker.y} r="6" fill={COLORS.movement} />
        </Svg>
      </View>
      <View style={styles.stats}>
        <Stat
          label="Distance"
          value={`${distance(points).toFixed(1)} m`}
          icon="-"
        />
        <Stat label="Duration" value={duration(seconds)} icon="o" />
        <Stat
          label="Steps / Movement"
          value={String(points.length * 4)}
          icon=">"
        />
      </View>
      <View style={styles.actions}>
        <Pressable
          disabled={running}
          onPress={() => {
            if (!points.length) setPoints([point(0)]);
            setRunning(true);
          }}
          style={[styles.primaryAction, running && styles.disabled]}
        >
          <Text style={styles.primaryActionText}>
            {running ? "Tracking..." : "Start Tracking"}
          </Text>
        </Pressable>
        {running && (
          <Pressable
            onPress={() => setRunning(false)}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryText}>Stop</Text>
          </Pressable>
        )}
        <Pressable
          disabled={!points.length}
          onPress={clear}
          style={styles.clearAction}
        >
          <Text style={styles.clearText}>Clear Trail</Text>
        </Pressable>
      </View>
      <Text style={styles.footnote}>
        Demo mode uses simulated movement. Live GPS and motion sensors can plug
        into this tracker later.
      </Text>
    </MobileScreen>
  );
}
function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20 },
  homeHeader: {
    height: 42,
    marginBottom: 29,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  leaf: { color: COLORS.white, fontSize: 20, fontWeight: "700" },
  brandText: { color: "#245963", fontSize: 18, fontWeight: "800" },
  profile: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { color: COLORS.muted, fontSize: 22 },
  header: { paddingTop: 3, paddingBottom: 23 },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 23,
  },
  backArrow: { color: COLORS.muted, fontSize: 21 },
  backText: { color: COLORS.muted, fontSize: 13 },
  title: {
    color: "#1C4C55",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    maxWidth: 340,
    marginTop: 10,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  intro: { paddingBottom: 18 },
  eyebrow: {
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  introTitle: { color: "#315C61", fontSize: 18, fontWeight: "700" },
  figureWrap: {
    height: 450,
    marginHorizontal: -7,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  figureHalo: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#E5F4F0",
    position: "absolute",
  },
  pin: {
    position: "absolute",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: "#265858",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pinText: { fontSize: 11, fontWeight: "800" },
  pinHead: { top: 64, left: 26 },
  pinBody: { top: 220, right: 20 },
  pinLegs: { bottom: 42, left: 30 },
  zoneToast: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    shadowColor: "#265858",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  toastSmall: { color: COLORS.muted, fontSize: 11 },
  toastStrong: { fontSize: 12, fontWeight: "800" },
  cardList: { gap: 12 },
  wellnessCard: {
    minHeight: 104,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#205655",
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  pressed: { opacity: 0.82 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconText: { fontSize: 19, fontWeight: "800" },
  cardCopy: { flex: 1, minWidth: 130, gap: 5 },
  cardTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "800" },
  cardDetail: { color: COLORS.muted, fontSize: 11 },
  cardValue: { fontSize: 12, fontWeight: "800" },
  progressTrack: {
    width: "100%",
    height: 7,
    borderRadius: 7,
    backgroundColor: "#EDF3F1",
    overflow: "hidden",
  },
  progressFill: { height: 7, borderRadius: 7 },
  selectionNote: {
    position: "absolute",
    bottom: 95,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#205655",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  selectionTitle: { color: "#245963", fontSize: 13, fontWeight: "800" },
  selectionSub: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.tealSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  mapCard: {
    overflow: "hidden",
    borderRadius: 21,
    backgroundColor: "#E8F4EF",
    shadowColor: "#205655",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  mapHeader: {
    height: 49,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapTitle: { color: "#356368", fontSize: 12, fontWeight: "800" },
  simulated: {
    color: COLORS.movement,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  map: { width: "100%", aspectRatio: 1.2 },
  stats: { flexDirection: "row", gap: 8, marginVertical: 14 },
  stat: {
    flex: 1,
    minHeight: 78,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  statIcon: { color: COLORS.movement, fontSize: 17 },
  statLabel: { color: COLORS.muted, fontSize: 10, textAlign: "center" },
  statValue: { color: "#315C61", fontSize: 13, fontWeight: "800" },
  actions: { gap: 10 },
  primaryAction: {
    minHeight: 53,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.movement,
    shadowColor: COLORS.movement,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryActionText: { color: COLORS.white, fontSize: 15, fontWeight: "800" },
  secondaryAction: {
    minHeight: 53,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.movementSoft,
  },
  secondaryText: { color: "#B96D2C", fontSize: 15, fontWeight: "800" },
  clearAction: {
    minHeight: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: { color: "#8B6E55", fontSize: 12, fontWeight: "800" },
  disabled: { opacity: 0.6 },
  footnote: {
    marginHorizontal: 14,
    marginTop: 15,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
  },
});
