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
  PlateQuarter,
  plateFeedback,
} from "./plateFeedback";

const QUARTER_NAMES = ["Top left", "Top right", "Bottom right", "Bottom left"];
const EMPTY_PLATE: PlateQuarter[] = [null, null, null, null];
const LONG_PRESS_MS = 180;

type Rect = { x: number; y: number; width: number; height: number };

/** Which quarter a window point falls in, or null if outside the plate. */
function quarterAt(rect: Rect, pageX: number, pageY: number): number | null {
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  const radius = rect.width / 2;
  if ((pageX - cx) ** 2 + (pageY - cy) ** 2 > radius ** 2) return null;
  if (pageY < cy) return pageX < cx ? 0 : 1;
  return pageX < cx ? 3 : 2;
}

export function BalancedPlate({ color, soft }: ActivityProps) {
  const [plate, setPlate] = useState<PlateQuarter[]>(EMPTY_PLATE);
  const [selectedGroup, setSelectedGroup] = useState<FoodGroup | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [plateSize, setPlateSize] = useState(260);
  const plateRef = useRef<View>(null);

  const filled = plate.filter(Boolean).length;
  const feedback = plateFeedback(plate);

  function assign(index: number, group: FoodGroup | null) {
    setPlate((current) => current.map((value, i) => (i === index ? group : value)));
  }

  function tapQuarter(index: number) {
    if (selectedGroup) assign(index, selectedGroup);
    else if (plate[index]) assign(index, null);
  }

  function dropAt(group: FoodGroup, pageX: number, pageY: number) {
    plateRef.current?.measureInWindow((x, y, width, height) => {
      const index = quarterAt({ x, y, width, height }, pageX, pageY);
      if (index !== null) assign(index, group);
    });
  }

  const r = plateSize / 2 - 6;
  const c = plateSize / 2;
  const slices = [
    `M${c} ${c} L${c} ${c - r} A${r} ${r} 0 0 0 ${c - r} ${c} Z`,
    `M${c} ${c} L${c + r} ${c} A${r} ${r} 0 0 0 ${c} ${c - r} Z`,
    `M${c} ${c} L${c} ${c + r} A${r} ${r} 0 0 0 ${c + r} ${c} Z`,
    `M${c} ${c} L${c - r} ${c} A${r} ${r} 0 0 0 ${c} ${c + r} Z`,
  ];

  return (
    <View style={mentalStyles.screen}>
      <ActivityHeader eyebrow="Fuel Your Body" title="Build a Balanced Plate" color={color} />
      <Text style={mentalStyles.body}>
        The plate is split into four quarters of 25%. Tap a food group, then
        tap a quarter, or press and hold a card and drag it onto the plate.
      </Text>

      <View
        style={styles.plateArea}
        onLayout={(event) => setPlateSize(Math.min(300, event.nativeEvent.layout.width - 8))}
      >
        <View
          ref={plateRef}
          collapsable={false}
          style={{ width: plateSize, height: plateSize }}
        >
          <Svg width={plateSize} height={plateSize}>
            <Circle cx={c} cy={c} r={c - 1} fill="#FFFFFF" stroke={COLORS.border} strokeWidth={2} />
            {slices.map((d, index) => {
              const group = plate[index];
              return (
                <Path
                  key={d}
                  d={d}
                  fill={group ? FOOD_GROUPS[group].color : "#F2F6F4"}
                  opacity={group ? 0.85 : 1}
                />
              );
            })}
            <Line x1={c} y1={c - r} x2={c} y2={c + r} stroke="#FFFFFF" strokeWidth={4} />
            <Line x1={c - r} y1={c} x2={c + r} y2={c} stroke="#FFFFFF" strokeWidth={4} />
          </Svg>
          {plate.map((group, index) => {
            const left = index === 0 || index === 3 ? 0 : plateSize / 2;
            const top = index < 2 ? 0 : plateSize / 2;
            return (
              <Pressable
                key={QUARTER_NAMES[index]}
                accessibilityRole="button"
                accessibilityLabel={`${QUARTER_NAMES[index]} quarter, ${
                  group ? FOOD_GROUPS[group].name : "empty"
                }`}
                accessibilityHint={
                  selectedGroup
                    ? `Places ${FOOD_GROUPS[selectedGroup].name}`
                    : group
                      ? "Removes this food group"
                      : "Select a food group first"
                }
                onPress={() => tapQuarter(index)}
                style={[
                  styles.quarter,
                  { left, top, width: plateSize / 2, height: plateSize / 2 },
                  index === 0 && styles.alignBR,
                  index === 1 && styles.alignBL,
                  index === 2 && styles.alignTL,
                  index === 3 && styles.alignTR,
                ]}
              >
                <View style={styles.quarterLabel}>
                  {group ? (
                    <>
                      <Text style={styles.quarterIcon}>{FOOD_GROUPS[group].icon}</Text>
                      <Text style={styles.quarterName}>{FOOD_GROUPS[group].short}</Text>
                      <Text style={styles.quarterPct}>25%</Text>
                    </>
                  ) : (
                    <Text style={styles.quarterEmpty}>
                      {selectedGroup ? "Tap to place" : "Empty"}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
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
          ? `${FOOD_GROUPS[selectedGroup].name} selected. Tap a quarter to place it.`
          : "To change a quarter, place a different group on it. With no card selected, tap a quarter to empty it."}
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
      accessibilityHint="Selects this food group. Then tap a plate quarter."
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
  quarter: { position: "absolute", padding: 14 },
  alignBR: { alignItems: "flex-end", justifyContent: "flex-end" },
  alignBL: { alignItems: "flex-start", justifyContent: "flex-end" },
  alignTL: { alignItems: "flex-start", justifyContent: "flex-start" },
  alignTR: { alignItems: "flex-end", justifyContent: "flex-start" },
  quarterLabel: { width: "78%", height: "78%", alignItems: "center", justifyContent: "center" },
  quarterIcon: { fontSize: 26 },
  quarterName: { color: COLORS.ink, fontSize: 11, fontWeight: "800", textAlign: "center" },
  quarterPct: { color: COLORS.ink, fontSize: 11, fontWeight: "600" },
  quarterEmpty: { color: COLORS.muted, fontSize: 12, fontWeight: "600", textAlign: "center" },
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
