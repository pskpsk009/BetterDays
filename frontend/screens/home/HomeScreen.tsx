import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

import { COLORS, MobileScreen } from "../../components/common/AppShell";

type Zone = "head" | "body" | "legs";

const zones: Record<
  Zone,
  { label: string; route: "/mental" | "/body" | "/trail"; color: string }
> = {
  head: { label: "Mental Development", route: "/mental", color: COLORS.mind },
  body: { label: "Body Functions", route: "/body", color: COLORS.teal },
  legs: { label: "Movement Trail", route: "/trail", color: COLORS.movement },
};

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
          <LinearGradient id="homeHeadFill" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#B7D9F4" />
            <Stop offset="1" stopColor="#88B4E7" />
          </LinearGradient>
          <LinearGradient id="homeBodyFill" x1="0" x2="1" y1="0" y2="1">
            <Stop offset="0" stopColor="#B6E5D7" />
            <Stop offset="1" stopColor="#73C5B1" />
          </LinearGradient>
          <LinearGradient id="homeLegFill" x1="0" x2="1" y1="0" y2="1">
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
            fill="url(#homeHeadFill)"
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
            fill="url(#homeBodyFill)"
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
            fill="url(#homeLegFill)"
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

export default function HomeScreen() {
  return (
    <MobileScreen>
      <HomeHeader />
      <View style={styles.intro}>
        <Text style={styles.heroTitle}>
          Your Development{"\n"}
          <Text style={styles.heroAccent}>Starts Here</Text>
        </Text>
        <Text style={styles.heroCopy}>
          A healthier mind. A stronger body. A more active you.
        </Text>
      </View>
      <HumanFigure />
      <Text style={styles.hint}>{"↓"} Tap the head, body or legs to begin</Text>
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
  profileText: { color: COLORS.muted, fontSize: 22 },
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
  hint: { textAlign: "center", color: "#719095", fontSize: 12 },
});
