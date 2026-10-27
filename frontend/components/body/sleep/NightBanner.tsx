import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

export const NIGHT = {
  deep: "#232A5C",
  mid: "#3C3F86",
  lavender: "#8E86C9",
  text: "#F3F1FF",
  muted: "#CFCBF0",
};

const STARS: [string, string, number][] = [
  ["8%", "22%", 1.6],
  ["18%", "70%", 1.2],
  ["30%", "35%", 1],
  ["46%", "15%", 1.4],
  ["58%", "62%", 1],
  ["66%", "28%", 1.2],
  ["90%", "78%", 1.4],
  ["38%", "82%", 1.1],
];

/** Night-sky header with a soft gradient, moon, and stars for Good Night Sleep. */
export function NightBanner({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  // Size the sky from the measured banner so it grows with wrapped text.
  const [size, setSize] = useState({ width: 0, height: 0 });
  return (
    <View
      style={styles.banner}
      onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      <Svg style={StyleSheet.absoluteFill} width={size.width} height={size.height}>
        <Defs>
          <LinearGradient id="night" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={NIGHT.deep} />
            <Stop offset="0.65" stopColor={NIGHT.mid} />
            <Stop offset="1" stopColor={NIGHT.lavender} />
          </LinearGradient>
        </Defs>
        <Rect width={size.width} height={size.height} fill="url(#night)" />
        {STARS.map(([cx, cy, r]) => (
          <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#FFFFFF" opacity={0.75} />
        ))}
      </Svg>
      <Svg style={styles.moon} width={46} height={46} viewBox="0 0 46 46">
        <Path d="M30 4a19 19 0 1 0 12 30A16 16 0 0 1 30 4Z" fill="#F6EFC8" />
      </Svg>
      <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 132,
    padding: 20,
    paddingRight: 70,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: NIGHT.mid,
    justifyContent: "flex-end",
    gap: 6,
  },
  moon: { position: "absolute", top: 16, right: 18 },
  eyebrow: { color: NIGHT.muted, fontSize: 10, fontWeight: "800", letterSpacing: 0.9 },
  title: { color: NIGHT.text, fontSize: 24, fontWeight: "800", letterSpacing: -0.4 },
  subtitle: { color: NIGHT.muted, fontSize: 14, lineHeight: 20 },
});
