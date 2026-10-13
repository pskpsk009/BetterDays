import { useEffect, useRef, useState } from "react";
import {
  Animated as RNAnimated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Svg, { Circle, Line, Path } from "react-native-svg";

import {
  ActivityHeader,
  ActivityProps,
  mentalStyles,
  PrimaryButton,
  SecondaryButton,
} from "../../common/ActivityUI";
import { COLORS, useScrollLock } from "../../common/AppShell";
import {
  describeComposition,
  FOOD_GROUPS,
  FoodGroup,
  GROUP_ORDER,
  PlateSlice,
  plateFeedback,
  SLICE_COUNT,
  SLICE_PERCENT,
} from "./plateFeedback";

const SLICE_NAMES = ["Top", "Upper right", "Lower right", "Lower left", "Upper left"];
const EMPTY_PLATE: PlateSlice[] = Array(SLICE_COUNT).fill(null);
const SLICE_DEGREES = 360 / SLICE_COUNT;
const LONG_PRESS_MS = 180;

type Rect = { x: number; y: number; width: number; height: number };

/** Slices run clockwise from 12 o'clock. Angle 0 here is straight up. */
function pointAt(center: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return { x: center + radius * Math.cos(radians), y: center + radius * Math.sin(radians) };
}

/** Which slice a point (relative to the plate's top-left) falls in, or null if off the plate. */
function sliceAt(size: number, x: number, y: number): number | null {
  const center = size / 2;
  if ((x - center) ** 2 + (y - center) ** 2 > center ** 2) return null;
  const degrees = ((Math.atan2(y - center, x - center) * 180) / Math.PI + 90 + 360) % 360;
  return Math.min(SLICE_COUNT - 1, Math.floor(degrees / SLICE_DEGREES));
}

function sliceAtPage(rect: Rect, pageX: number, pageY: number): number | null {
  return sliceAt(rect.width, pageX - rect.x, pageY - rect.y);
}

export function BalancedPlate({ color, soft }: ActivityProps) {
  const [plate, setPlate] = useState<PlateSlice[]>(EMPTY_PLATE);
  const [selectedGroup, setSelectedGroup] = useState<FoodGroup | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [plateSize, setPlateSize] = useState(260);
  const plateRef = useRef<View>(null);

  const filled = plate.filter(Boolean).length;
  const feedback = plateFeedback(plate);

  function assign(index: number, group: FoodGroup | null) {
    setPlate((current) => current.map((value, i) => (i === index ? group : value)));
  }

  function tapSlice(index: number) {
    if (selectedGroup) assign(index, selectedGroup);
    else if (plate[index]) assign(index, null);
  }

  function dropAt(group: FoodGroup, pageX: number, pageY: number) {
    plateRef.current?.measureInWindow((x, y, width, height) => {
      const index = sliceAtPage({ x, y, width, height }, pageX, pageY);
      if (index !== null) assign(index, group);
    });
  }

  const r = plateSize / 2 - 6;
  const c = plateSize / 2;
  const labelSize = r * 0.66;
  const slices = plate.map((_, index) => {
    const from = pointAt(c, r, index * SLICE_DEGREES);
    const to = pointAt(c, r, (index + 1) * SLICE_DEGREES);
    return {
      d: `M${c} ${c} L${from.x} ${from.y} A${r} ${r} 0 0 1 ${to.x} ${to.y} Z`,
      edge: from,
      label: pointAt(c, r * 0.6, (index + 0.5) * SLICE_DEGREES),
    };
  });

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Fuel Your Body" title="Build a Balanced Plate" color={color} />
      <Text style={mentalStyles.body}>
        The plate is split into five equal slices of 20%. Tap a food group,
        then tap a slice, or press and hold a card and drag it onto the plate.
      </Text>

      <View
        style={styles.plateArea}
        onLayout={(event) => setPlateSize(Math.min(300, event.nativeEvent.layout.width - 8))}
      >
        {/* Taps anywhere on the plate pick the slice by angle; the labelled
            buttons inside give each slice its own accessible target. */}
        <Pressable
          ref={plateRef}
          collapsable={false}
          accessible={false}
          onPress={(event) => {
            // Page coordinates: locationX/Y are relative to whichever child was touched.
            const { pageX, pageY } = event.nativeEvent;
            plateRef.current?.measureInWindow((x, y, width, height) => {
              const index = sliceAtPage({ x, y, width, height }, pageX, pageY);
              if (index !== null) tapSlice(index);
            });
          }}
          style={{ width: plateSize, height: plateSize }}
        >
          <View pointerEvents="none">
            <Svg width={plateSize} height={plateSize}>
              <Circle cx={c} cy={c} r={c - 1} fill="#FFFFFF" stroke={COLORS.border} strokeWidth={2} />
              {slices.map((slice, index) => {
                const group = plate[index];
                return (
                  <Path
                    key={SLICE_NAMES[index]}
                    d={slice.d}
                    fill={group ? FOOD_GROUPS[group].color : "#F2F6F4"}
                    opacity={group ? 0.85 : 1}
                  />
                );
              })}
              {slices.map((slice, index) => (
                <Line
                  key={`divider-${SLICE_NAMES[index]}`}
                  x1={c}
                  y1={c}
                  x2={slice.edge.x}
                  y2={slice.edge.y}
                  stroke="#FFFFFF"
                  strokeWidth={4}
                />
              ))}
            </Svg>
          </View>
          {slices.map((slice, index) => {
            const group = plate[index];
            return (
              <Pressable
                key={SLICE_NAMES[index]}
                accessibilityRole="button"
                accessibilityLabel={`${SLICE_NAMES[index]} slice, ${
                  group ? FOOD_GROUPS[group].name : "empty"
                }`}
                accessibilityHint={
                  selectedGroup
                    ? `Places ${FOOD_GROUPS[selectedGroup].name}`
                    : group
                      ? "Removes this food group"
                      : "Select a food group first"
                }
                onPress={() => tapSlice(index)}
                style={[
                  styles.slice,
                  {
                    left: slice.label.x - labelSize / 2,
                    top: slice.label.y - labelSize / 2,
                    width: labelSize,
                    height: labelSize,
                  },
                ]}
              >
                {group ? (
                  <>
                    <Text style={styles.sliceIcon}>{FOOD_GROUPS[group].icon}</Text>
                    <Text style={styles.sliceName} numberOfLines={2}>
                      {FOOD_GROUPS[group].short}
                    </Text>
                    <Text style={styles.slicePct}>{SLICE_PERCENT}%</Text>
                  </>
                ) : (
                  <Text style={styles.sliceEmpty}>{selectedGroup ? "Tap to place" : "Empty"}</Text>
                )}
              </Pressable>
            );
          })}
        </Pressable>
      </View>

      <Text accessibilityLiveRegion="polite" style={[mentalStyles.body, styles.center]}>
        {filled === 0 ? "Your plate is empty." : describeComposition(plate)}
      </Text>

      <View style={styles.cards}>
        {GROUP_ORDER.map((group) => (
          <DraggableFoodCard
            key={group}
            group={group}
            color={color}
            soft={soft}
            selected={selectedGroup === group}
            onSelect={() => setSelectedGroup((current) => (current === group ? null : group))}
            onDrop={dropAt}
          />
        ))}
      </View>
      <Text style={[mentalStyles.muted, styles.center]}>
        {selectedGroup
          ? `${FOOD_GROUPS[selectedGroup].name} selected. Tap a slice to place it.`
          : "To change a slice, place a different group on it. With no card selected, tap a slice to empty it."}
      </Text>

      <View style={mentalStyles.row}>
        <SecondaryButton
          flex
          label="Clear plate"
          color={color}
          disabled={filled === 0}
          onPress={() => {
            setPlate(EMPTY_PLATE);
            setShowFeedback(false);
          }}
        />
        <PrimaryButton
          flex
          label={showFeedback ? "Hide feedback" : "View feedback"}
          color={color}
          disabled={filled === 0}
          onPress={() => setShowFeedback((value) => !value)}
        />
      </View>

      {showFeedback && filled > 0 && (
        <Animated.View
          key={plate.join("|")}
          entering={FadeIn.duration(220)}
          accessibilityLiveRegion="polite"
          style={[mentalStyles.card, styles.feedback]}
        >
          <Text style={[mentalStyles.label, { color }]}>ABOUT THIS PLATE</Text>
          <Text style={styles.feedbackTitle}>{feedback.title}</Text>
          {feedback.points.map((point) => (
            <Text key={point} style={mentalStyles.body}>
              • {point}
            </Text>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

type DragCallbacks = {
  onSelect: () => void;
  onDrop: (group: FoodGroup, pageX: number, pageY: number) => void;
  lockScroll: (locked: boolean) => void;
};

/**
 * Press-and-hold drag for a food card. A quick tap selects the card; holding
 * for a moment starts a drag (and pauses page scrolling); moving before the
 * hold completes is left to the page as a normal scroll.
 */
class CardDrag {
  readonly offset = new RNAnimated.ValueXY();
  readonly responder;
  private callbacks: DragCallbacks = { onSelect: () => {}, onDrop: () => {}, lockScroll: () => {} };
  private dragging = false;
  private moved = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly group: FoodGroup,
    private readonly setDragging: (dragging: boolean) => void,
  ) {
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.moved = false;
        this.timer = setTimeout(() => {
          this.dragging = true;
          this.setDragging(true);
          this.callbacks.lockScroll(true);
        }, LONG_PRESS_MS);
      },
      onPanResponderMove: (_, { dx, dy }) => {
        if (this.dragging) {
          this.offset.setValue({ x: dx, y: dy });
        } else if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          this.moved = true;
          this.clearTimer();
        }
      },
      onPanResponderTerminationRequest: () => !this.dragging,
      onPanResponderRelease: (event) => this.end(event.nativeEvent.pageX, event.nativeEvent.pageY),
      onPanResponderTerminate: () => this.end(null, null),
    });
  }

  setCallbacks(callbacks: DragCallbacks) {
    this.callbacks = callbacks;
  }

  dispose() {
    this.clearTimer();
    if (this.dragging) this.callbacks.lockScroll(false);
  }

  private clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  private end(pageX: number | null, pageY: number | null) {
    this.clearTimer();
    if (this.dragging) {
      if (pageX !== null && pageY !== null) this.callbacks.onDrop(this.group, pageX, pageY);
      this.callbacks.lockScroll(false);
      RNAnimated.spring(this.offset, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    } else if (!this.moved && pageX !== null) {
      this.callbacks.onSelect();
    }
    this.dragging = false;
    this.setDragging(false);
  }
}

function DraggableFoodCard({
  group,
  color,
  soft,
  selected,
  onSelect,
  onDrop,
}: {
  group: FoodGroup;
  color: string;
  soft: string;
  selected: boolean;
  onSelect: () => void;
  onDrop: (group: FoodGroup, pageX: number, pageY: number) => void;
}) {
  const lockScroll = useScrollLock();
  const [dragging, setDragging] = useState(false);
  const [drag] = useState(() => new CardDrag(group, setDragging));

  useEffect(() => {
    drag.setCallbacks({ onSelect, onDrop, lockScroll });
  });

  useEffect(() => () => drag.dispose(), [drag]);

  const info = FOOD_GROUPS[group];

  return (
    <RNAnimated.View
      {...drag.responder.panHandlers}
      accessible
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${info.name}. ${info.examples}`}
      accessibilityHint="Selects this food group. Then tap a plate slice."
      accessibilityActions={[{ name: "activate" }]}
      onAccessibilityAction={() => onSelect()}
      style={[
        styles.foodCard,
        selected && { borderColor: color, backgroundColor: soft },
        dragging && styles.foodCardDragging,
        { transform: drag.offset.getTranslateTransform() },
      ]}
    >
      <View style={[styles.swatch, { backgroundColor: info.color }]}>
        <Text style={styles.foodIcon}>{info.icon}</Text>
      </View>
      <View style={styles.foodCopy}>
        <Text style={[styles.foodName, selected && { color }]}>{info.name}</Text>
        <Text style={mentalStyles.muted}>{info.examples}</Text>
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: "center" },
  plateArea: { alignItems: "center", paddingVertical: 4 },
  slice: { position: "absolute", alignItems: "center", justifyContent: "center" },
  sliceIcon: { fontSize: 22 },
  sliceName: { color: COLORS.ink, fontSize: 10, fontWeight: "800", textAlign: "center" },
  slicePct: { color: COLORS.ink, fontSize: 10, fontWeight: "600" },
  sliceEmpty: { color: COLORS.muted, fontSize: 11, fontWeight: "600", textAlign: "center" },
  cards: { gap: 10, zIndex: 10 },
  foodCard: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  foodCardDragging: {
    zIndex: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  swatch: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  foodIcon: { fontSize: 22 },
  foodCopy: { flex: 1, gap: 2 },
  foodName: { color: COLORS.ink, fontSize: 15, fontWeight: "800" },
  feedback: { gap: 10 },
  feedbackTitle: { color: COLORS.ink, fontSize: 18, fontWeight: "800" },
});
