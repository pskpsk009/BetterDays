import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import { useAuth } from "../components/auth/AuthProvider";
import { ProfileSheet } from "../components/profile/ProfileSheet";
import { COLORS, MobileScreen } from "../components/common/AppShell";
import { DayKey, todayKey, useStoredState } from "../components/common/localStore";
import { NeedId } from "../components/home/needs";
import { NeedFinder } from "../components/home/NeedFinder";
import { Welcome, WELCOME_NOTICE_VERSION } from "../components/home/Welcome";

type Zone = "head" | "body" | "legs";

const zones: Record<
  Zone,
  { label: string; route: "/mental" | "/body" | "/trail"; color: string }
> = {
  head: { label: "Mental Development", route: "/mental", color: COLORS.mind },
  body: { label: "Body Functions", route: "/body", color: COLORS.teal },
  legs: { label: "Movement Trail", route: "/trail", color: COLORS.movement },
};

export function HomeHeader({ onProfile }: { onProfile: () => void }) {
  const { user } = useAuth();
  const initial = user?.email?.[0]?.toUpperCase();

  return (
    <View style={styles.homeHeader}>
      <View style={styles.brand}>
        <View style={styles.brandMark}>
          <Text style={styles.leaf}>+</Text>
        </View>
        <Text style={styles.brandText}>MyGrowth</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={user ? `Profile, signed in as ${user.email}` : "Profile"}
        onPress={onProfile}
        style={({ pressed }) => [styles.profile, user && styles.profileSignedIn, pressed && styles.pressed]}
      >
        {initial ? <Text style={styles.avatarText}>{initial}</Text> : <PersonIcon />}
      </Pressable>
    </View>
  );
}

function PersonIcon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.teal} strokeWidth="2" strokeLinecap="round">
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </Svg>
  );
}

const NAVIGATE_DELAY_MS = 450;
const LIMB_OUTLINE = 6;

function Callout({
  label,
  color,
  selected,
  pill,
  from,
  to,
}: {
  label: string;
  color: string;
  selected: boolean;
  pill: { x: number; y: number };
  from: { x: number; y: number };
  to: { x: number; y: number };
}) {
  return (
    <G>
      <Line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth="2"
        strokeDasharray="3 4"
        strokeLinecap="round"
      />
      <Circle cx={to.x} cy={to.y} r="5" fill={color} stroke="#FFF" strokeWidth="2" />
      <Rect
        x={pill.x}
        y={pill.y}
        width="80"
        height="30"
        rx="15"
        fill={selected ? color : "#FFF"}
        stroke={color}
        strokeOpacity={selected ? 1 : 0.3}
        strokeWidth="1.5"
      />
      <SvgText
        x={pill.x + 40}
        y={pill.y + 20}
        fill={selected ? "#FFF" : color}
        fontSize="14"
        fontWeight="800"
        textAnchor="middle"
      >
        {label}
      </SvgText>
    </G>
  );
}

function BreathingHalo() {
  const reduceMotion = useReducedMotion();
  const breath = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    breath.set(
      withRepeat(
        withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(breath);
  }, [breath, reduceMotion]);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.95 + breath.get() * 0.07 }],
    opacity: 0.6 + breath.get() * 0.4,
  }));

  return (
    <>
      <Animated.View style={[styles.haloOuter, outerStyle]} />
      <View style={styles.haloInner} />
    </>
  );
}

export function HumanFigure() {
  const router = useRouter();
  const [active, setActive] = useState<Zone | null>(null);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Home is a tab and stays mounted, so clear the selection whenever it regains focus.
  useFocusEffect(
    useCallback(() => {
      setActive(null);
      return () => {
        if (navigateTimer.current) clearTimeout(navigateTimer.current);
      };
    }, []),
  );

  const select = (zone: Zone) => {
    if (active) return;
    setActive(zone);
    navigateTimer.current = setTimeout(
      () => router.push(zones[zone].route),
      NAVIGATE_DELAY_MS,
    );
  };
  const zoneProps = (zone: Zone) => ({
    onPress: () => select(zone),
    accessibilityLabel: `Open ${zones[zone].label}`,
    opacity: active && active !== zone ? 0.35 : 1,
  });
  const outline = (zone: Zone) =>
    active === zone ? zones[zone].color : "#FFF";

  return (
    <View style={styles.figureWrap}>
      <BreathingHalo />
      <Svg
        width="310"
        height="448"
        viewBox="-30 0 360 520"
        accessibilityLabel="Tap head, body, or legs"
      >
        <Defs>
          <LinearGradient id="homeHeadFill" gradientUnits="userSpaceOnUse" x1="106" y1="24" x2="194" y2="112">
            <Stop offset="0" stopColor="#C4DDF7" />
            <Stop offset="1" stopColor="#7FA6E6" />
          </LinearGradient>
          <LinearGradient id="homeBodyFill" gradientUnits="userSpaceOnUse" x1="60" y1="116" x2="240" y2="282">
            <Stop offset="0" stopColor="#BDE8DB" />
            <Stop offset="1" stopColor="#5FB9A3" />
          </LinearGradient>
          <LinearGradient id="homeLegFill" gradientUnits="userSpaceOnUse" x1="100" y1="286" x2="200" y2="492">
            <Stop offset="0" stopColor="#FADFAA" />
            <Stop offset="1" stopColor="#E7A95E" />
          </LinearGradient>
        </Defs>

        <Ellipse cx="150" cy="500" rx="84" ry="10" fill="#B5D6CD" opacity=".5" />

        <G {...zoneProps("head")}>
          <Circle cx="150" cy="68" r="44" fill="url(#homeHeadFill)" stroke={outline("head")} strokeWidth="4" />
          <G
            stroke="#FFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(150 47) scale(0.88 0.62) translate(-150 -70)"
          >
            <Path
              d="M150 54 C145 49 136 50 134 57 C127 57 123 64 126 70 C121 74 123 83 130 84 C132 90 142 91 150 86 C158 91 168 90 170 84 C177 83 179 74 174 70 C177 64 173 57 166 57 C164 50 155 49 150 54Z"
              fill="#FFF"
              fillOpacity=".25"
            />
            <G fill="none">
              <Path d="M150 54 L150 86" />
              <Path d="M134 57 C137 61 141 62 144 60" />
              <Path d="M126 70 C131 72 136 71 139 68" />
              <Path d="M130 84 C134 80 139 80 142 82" />
              <Path d="M166 57 C163 61 159 62 156 60" />
              <Path d="M174 70 C169 72 164 71 161 68" />
              <Path d="M170 84 C166 80 161 80 158 82" />
            </G>
          </G>
          <Callout
            label="Mind"
            color={COLORS.mind}
            selected={active === "head"}
            pill={{ x: 236, y: 44 }}
            from={{ x: 236, y: 59 }}
            to={{ x: 194, y: 64 }}
          />
        </G>

        <G {...zoneProps("body")}>
          <G stroke={outline("body")} strokeLinecap="round">
            <Line x1="96" y1="150" x2="68" y2="250" strokeWidth={30 + LIMB_OUTLINE} />
            <Line x1="204" y1="150" x2="232" y2="250" strokeWidth={30 + LIMB_OUTLINE} />
          </G>
          <G stroke="url(#homeBodyFill)" strokeLinecap="round" strokeWidth="30">
            <Line x1="96" y1="150" x2="68" y2="250" />
            <Line x1="204" y1="150" x2="232" y2="250" />
          </G>
          <Path
            d="M114 126 Q150 116 186 126 Q206 132 205 154 L196 262 Q194 282 174 282 L126 282 Q106 282 104 262 L95 154 Q94 132 114 126Z"
            fill="url(#homeBodyFill)"
            stroke={outline("body")}
            strokeWidth="4"
          />
          <Ellipse cx="126" cy="148" rx="18" ry="8" fill="#FFF" opacity=".3" transform="rotate(-20 126 148)" />
          <Path
            d="M150 214 C126 198 120 182 130 172 C138 164 147 167 150 176 C153 167 162 164 170 172 C180 182 174 198 150 214Z"
            fill="#FFF"
          />
          <Callout
            label="Body"
            color={COLORS.teal}
            selected={active === "body"}
            pill={{ x: -16, y: 300 }}
            from={{ x: 64, y: 312 }}
            to={{ x: 110, y: 254 }}
          />
        </G>

        <G {...zoneProps("legs")}>
          <G stroke={outline("legs")} strokeLinecap="round">
            <Line x1="130" y1="300" x2="126" y2="466" strokeWidth={32 + LIMB_OUTLINE} />
            <Line x1="170" y1="300" x2="174" y2="466" strokeWidth={32 + LIMB_OUTLINE} />
          </G>
          <G fill="url(#homeLegFill)" stroke={outline("legs")} strokeWidth="3">
            <Path d="M112 292 Q150 284 188 292 L186 318 L114 318Z" />
            <Ellipse cx="118" cy="478" rx="21" ry="11" />
            <Ellipse cx="182" cy="478" rx="21" ry="11" />
          </G>
          <G stroke="url(#homeLegFill)" strokeLinecap="round" strokeWidth="32">
            <Line x1="130" y1="300" x2="126" y2="466" />
            <Line x1="170" y1="300" x2="174" y2="466" />
          </G>
          <G fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M120 392 L128 383 L136 392" />
            <Path d="M120 406 L128 397 L136 406" opacity=".6" />
            <Path d="M164 392 L172 383 L180 392" />
            <Path d="M164 406 L172 397 L180 406" opacity=".6" />
          </G>
          <Callout
            label="Trail"
            color={COLORS.movement}
            selected={active === "legs"}
            pill={{ x: 236, y: 390 }}
            from={{ x: 236, y: 405 }}
            to={{ x: 190, y: 404 }}
          />
        </G>
      </Svg>
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

type WelcomeRecord = { seenOn: DayKey; noticeVersion: number; focus: NeedId[] };

// Lets the animated splash finish before the first-open welcome appears.
const WELCOME_DELAY_MS = 900;

export default function HomeScreen() {
  const [welcome, setWelcome] = useStoredState<WelcomeRecord | null>("welcome", null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Also covers "Delete all data", which clears the welcome record: wait until
  // Profile has closed, since iOS can't present two full-screen modals at once.
  useEffect(() => {
    if (welcome || showProfile) return;
    const timer = setTimeout(() => setShowWelcome(true), WELCOME_DELAY_MS);
    return () => clearTimeout(timer);
  }, [welcome, showProfile]);

  return (
    <MobileScreen>
      <HomeHeader onProfile={() => setShowProfile(true)} />
      <ProfileSheet
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        onShowWelcome={() => setTimeout(() => setShowWelcome(true), WELCOME_DELAY_MS)}
      />
      <View style={styles.intro}>
        <Text style={styles.heroTitle}>
          Your Development{"\n"}
          <Text style={styles.heroAccent}>Starts Here</Text>
        </Text>
        <Text style={styles.heroCopy}>
          A healthier mind. A stronger body. A more active you.
        </Text>
      </View>
      <NeedFinder focus={welcome?.focus ?? []} />
      <Welcome
        // Remounts after "Delete all data" so old picks aren't pre-selected.
        key={welcome ? "seen" : "new"}
        visible={showWelcome}
        initialFocus={welcome?.focus ?? []}
        onFinish={(focus) => {
          setWelcome({ seenOn: todayKey(), noticeVersion: WELCOME_NOTICE_VERSION, focus });
          setShowWelcome(false);
        }}
      />
      <HumanFigure />
      <Text style={styles.hint}>Tap the head, body or legs to begin</Text>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
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
  profileSignedIn: { backgroundColor: COLORS.tealSoft, borderWidth: 1.5, borderColor: COLORS.teal },
  avatarText: { color: COLORS.teal, fontSize: 17, fontWeight: "800" },
  pressed: { opacity: 0.78 },
  intro: { paddingHorizontal: 4 },
  heroTitle: {
    color: "#1C4C55",
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
    letterSpacing: -1.5,
  },
  heroAccent: { color: COLORS.teal },
  heroCopy: {
    maxWidth: 310,
    marginTop: 16,
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  figureWrap: {
    height: 470,
    marginHorizontal: -7,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  haloOuter: {
    position: "absolute",
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor: "#EAF6F2",
  },
  haloInner: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#DDF0EA",
  },
  zoneToast: {
    position: "absolute",
    bottom: 0,
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
  hint: { textAlign: "center", color: "#719095", fontSize: 12 },
});
