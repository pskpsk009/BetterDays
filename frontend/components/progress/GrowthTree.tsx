import { useEffect, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

import { COLORS } from "../common/AppShell";
import { AREAS, useInteraction } from "./ProgressUI";
import type { ProgressArea } from "./types";

// The Growth Tree: one canopy split into two equal halves, Mind on the left
// and Body on the right. The equal split shows equal importance, never a
// score. The SVG is decorative; the two overlaid Pressables carry selection,
// hover, keyboard focus and screen-reader labels.

const VIEW_W = 340;
const VIEW_H = 300;
const MID = VIEW_W / 2;
const MAX_BUDS = 7;

// Canopy circles for the left half; the right half mirrors them.
const CANOPY = [
  { x: 70, y: 122, r: 40 },
  { x: 96, y: 80, r: 46 },
  { x: 142, y: 52, r: 38 },
  { x: 148, y: 106, r: 32 },
  { x: 112, y: 130, r: 34 },
  { x: 58, y: 84, r: 28 },
];
const BUDS = [
  { x: 52, y: 104 },
  { x: 82, y: 56 },
  { x: 128, y: 32 },
  { x: 154, y: 76 },
  { x: 66, y: 142 },
  { x: 122, y: 140 },
  { x: 156, y: 120 },
];
const mirror = (x: number) => VIEW_W - x;

function CanopyHalf({
  area,
  buds,
  dimmed,
  selected,
}: {
  area: ProgressArea;
  buds: number;
  dimmed: boolean;
  selected: boolean;
}) {
  const isMind = area === "mind";
  const x = (value: number) => (isMind ? value : mirror(value));
  const color = AREAS[area].color;
  return (
    <G clipPath={`url(#growth-clip-${area})`} opacity={dimmed ? 0.35 : 1}>
      {CANOPY.map((leaf, index) => (
        <Circle key={index} cx={x(leaf.x)} cy={leaf.y} r={leaf.r} fill={`url(#growth-leaf-${area})`} />
      ))}
      <Ellipse cx={x(84)} cy={62} rx={20} ry={9} fill="#FFF" opacity={0.25} transform={`rotate(${isMind ? -25 : 25} ${x(84)} 62)`} />
      {selected && (
        <Path
          d={
            isMind
              ? "M168 18 C120 6 40 30 28 92 C20 136 50 168 100 166 L168 166"
              : "M172 18 C220 6 300 30 312 92 C320 136 290 168 240 166 L172 166"
          }
          fill="none"
          stroke="#FFF"
          strokeWidth={3}
          strokeDasharray="2 7"
          strokeLinecap="round"
          opacity={0.9}
        />
      )}
      {BUDS.map((bud, index) => {
        const lit = index < buds;
        return (
          <Circle
            key={index}
            cx={x(bud.x)}
            cy={bud.y}
            r={lit ? 5 : 3.5}
            fill="#FFF"
            opacity={lit ? 1 : 0.35}
            stroke={lit ? color : "none"}
            strokeWidth={2}
          />
        );
      })}
      {isMind ? (
        <G
          stroke="#FFF"
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          transform="translate(102 96) scale(0.9) translate(-150 -70)"
        >
          <Path
            d="M150 54 C145 49 136 50 134 57 C127 57 123 64 126 70 C121 74 123 83 130 84 C132 90 142 91 150 86 C158 91 168 90 170 84 C177 83 179 74 174 70 C177 64 173 57 166 57 C164 50 155 49 150 54Z"
            fill="#FFF"
            fillOpacity={0.25}
          />
          <Path d="M150 54 L150 86" />
          <Path d="M134 57 C137 61 141 62 144 60" />
          <Path d="M126 70 C131 72 136 71 139 68" />
          <Path d="M166 57 C163 61 159 62 156 60" />
          <Path d="M174 70 C169 72 164 71 161 68" />
        </G>
      ) : (
        <Path
          transform="translate(238 96) scale(0.85) translate(-150 -190)"
          d="M150 214 C126 198 120 182 130 172 C138 164 147 167 150 176 C153 167 162 164 170 172 C180 182 174 198 150 214Z"
          fill="#FFF"
        />
      )}
    </G>
  );
}

function TreeIllustration({ selected, mindBuds, bodyBuds }: { selected: ProgressArea | null; mindBuds: number; bodyBuds: number }) {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
      <Defs>
        <LinearGradient id="growth-leaf-mind" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#B9CCF5" />
          <Stop offset="1" stopColor="#6587D9" />
        </LinearGradient>
        <LinearGradient id="growth-leaf-body" x1="1" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#A6DDCC" />
          <Stop offset="1" stopColor="#2E8E86" />
        </LinearGradient>
        <LinearGradient id="growth-trunk" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#A47E5F" />
          <Stop offset="1" stopColor="#7B5B44" />
        </LinearGradient>
        <ClipPath id="growth-clip-mind">
          <Rect x={0} y={0} width={MID - 2} height={200} />
        </ClipPath>
        <ClipPath id="growth-clip-body">
          <Rect x={MID + 2} y={0} width={MID - 2} height={200} />
        </ClipPath>
      </Defs>

      <Ellipse cx={MID} cy={284} rx={124} ry={11} fill="#D5EAE3" />
      <G stroke="#8F6E52" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.55}>
        <Path d="M160 280 C146 286 128 288 110 290" />
        <Path d="M180 280 C194 286 212 288 230 290" />
        <Path d="M170 282 L170 292" />
      </G>
      <Path
        d="M154 286 C159 250 161 214 163 186 C150 168 128 156 102 146 L108 134 C134 143 154 154 167 168 L167 140 L173 140 L173 168 C186 154 206 143 232 134 L238 146 C212 156 190 168 177 186 C179 214 181 250 186 286 Z"
        fill="url(#growth-trunk)"
      />

      <CanopyHalf area="mind" buds={mindBuds} selected={selected === "mind"} dimmed={selected === "body"} />
      <CanopyHalf area="body" buds={bodyBuds} selected={selected === "body"} dimmed={selected === "mind"} />
    </Svg>
  );
}

function TreeHalf({
  area,
  selected,
  activityLabel,
  onPress,
}: {
  area: ProgressArea;
  selected: ProgressArea | null;
  activityLabel: string;
  onPress: () => void;
}) {
  const { hovered, focused, handlers } = useInteraction();
  const meta = AREAS[area];
  const isSelected = selected === area;
  const isMind = area === "mind";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${meta.title} half of your growth tree. ${activityLabel}.`}
      accessibilityHint={isSelected ? "Returns to the overview" : `Shows ${meta.title} progress details`}
      onPress={onPress}
      {...handlers}
      style={({ pressed }) => [
        styles.half,
        isMind ? styles.halfLeft : styles.halfRight,
        (hovered || pressed) && { backgroundColor: `${meta.soft}99` },
        focused && { borderColor: meta.color },
      ]}
    >
      <View
        style={[
          styles.pill,
          isMind ? styles.pillLeft : styles.pillRight,
          { borderColor: meta.color },
          isSelected && { backgroundColor: meta.color },
          (hovered || focused) && !isSelected && styles.pillLifted,
        ]}
      >
        <Text style={[styles.pillTitle, { color: isSelected ? COLORS.white : meta.color }]}>{meta.title}</Text>
        <Text style={[styles.pillSub, { color: isSelected ? COLORS.white : COLORS.muted }]}>{activityLabel}</Text>
      </View>
    </Pressable>
  );
}

export function GrowthTree({
  selected,
  onSelect,
  mindActivityLabel,
  bodyActivityLabel,
  mindActiveDays,
  bodyActiveDays,
}: {
  selected: ProgressArea | null;
  onSelect: (area: ProgressArea) => void;
  mindActivityLabel: string;
  bodyActivityLabel: string;
  /** Days with at least one activity; lights up to seven buds per side. */
  mindActiveDays: number;
  bodyActiveDays: number;
}) {
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const grow = useSharedValue(reduceMotion ? 1 : 0);
  const mindHalo = useSharedValue(0);
  const bodyHalo = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      grow.set(1);
      return;
    }
    grow.set(withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, [grow, reduceMotion]);

  useEffect(() => {
    const animate = (value: number) =>
      reduceMotion ? value : withTiming(value, { duration: 420, easing: Easing.out(Easing.quad) });
    mindHalo.set(animate(selected === "mind" ? 1 : 0));
    bodyHalo.set(animate(selected === "body" ? 1 : 0));
  }, [selected, mindHalo, bodyHalo, reduceMotion]);

  const treeStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + grow.get() * 0.75,
    transform: [{ translateY: (1 - grow.get()) * 16 }, { scale: 0.86 + grow.get() * 0.14 }],
  }));
  const mindHaloStyle = useAnimatedStyle(() => ({
    opacity: mindHalo.get(),
    transform: [{ scale: 0.8 + mindHalo.get() * 0.2 }],
  }));
  const bodyHaloStyle = useAnimatedStyle(() => ({
    opacity: bodyHalo.get(),
    transform: [{ scale: 0.8 + bodyHalo.get() * 0.2 }],
  }));

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);
  const treeWidth = Math.min(width, 380);
  const treeHeight = (treeWidth * VIEW_H) / VIEW_W;
  const haloSize = treeWidth * 0.52;
  const haloTop = treeHeight * (92 / VIEW_H) - haloSize / 2;

  const toggle = (area: ProgressArea) => onSelect(area);

  return (
    <View onLayout={onLayout} style={styles.wrap}>
      {width > 0 && (
        <View style={{ width: treeWidth, height: treeHeight }}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.halo,
              { width: haloSize, height: haloSize, borderRadius: haloSize / 2, top: haloTop },
              { left: treeWidth * (100 / VIEW_W) - haloSize / 2, backgroundColor: AREAS.mind.soft },
              mindHaloStyle,
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.halo,
              { width: haloSize, height: haloSize, borderRadius: haloSize / 2, top: haloTop },
              { left: treeWidth * (240 / VIEW_W) - haloSize / 2, backgroundColor: AREAS.body.soft },
              bodyHaloStyle,
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { transformOrigin: "50% 100%" }, treeStyle]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <TreeIllustration
              selected={selected}
              mindBuds={Math.min(MAX_BUDS, mindActiveDays)}
              bodyBuds={Math.min(MAX_BUDS, bodyActiveDays)}
            />
          </Animated.View>
          <TreeHalf area="mind" selected={selected} activityLabel={mindActivityLabel} onPress={() => toggle("mind")} />
          <TreeHalf area="body" selected={selected} activityLabel={bodyActivityLabel} onPress={() => toggle("body")} />
        </View>
      )}
      <Text style={styles.caption}>
        Mind and Body each make up half of your tree because both matter equally. The halves show what you care for,
        not a score.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 6, minHeight: 200 },
  halo: { position: "absolute" },
  half: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "50%",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 24,
  },
  halfLeft: { left: 0 },
  halfRight: { right: 0 },
  pill: {
    position: "absolute",
    bottom: 8,
    minWidth: 96,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  pillLeft: { left: 6 },
  pillRight: { right: 6 },
  pillLifted: { transform: [{ translateY: -2 }], shadowColor: "#205655", shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  pillTitle: { fontSize: 15, fontWeight: "800" },
  pillSub: { fontSize: 10, fontWeight: "600" },
  caption: {
    maxWidth: 340,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
