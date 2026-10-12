import { useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PrimaryButton } from "./ActivityUI";
import { COLORS, useScrollLock } from "./AppShell";
import { ClockTime, formatTime } from "./time";

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const EDGE_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

function minuteValues(step: number) {
  return Array.from({ length: Math.ceil(60 / step) }, (_, i) => String(i * step).padStart(2, "0"));
}

/**
 * Scrollable, mobile-clock style 24-hour time picker with hour (00-23) and
 * minute wheels. Changes are a draft until the user presses the confirm button.
 * To re-initialise it from a new `value`, change its `key`.
 */
export function TimePicker({
  value,
  onConfirm,
  color,
  soft,
  label,
  confirmLabel = "Done",
  minuteStep = 5,
}: {
  value: ClockTime;
  onConfirm: (time: ClockTime) => void;
  color: string;
  soft: string;
  label: string;
  confirmLabel?: string;
  minuteStep?: number;
}) {
  const minutes = minuteValues(minuteStep);
  const [draft, setDraft] = useState<ClockTime>(() => ({
    hour: value.hour,
    // Snap to the nearest wheel value (e.g. :58 -> :00 with 5-minute steps).
    minute: (Math.round(value.minute / minuteStep) * minuteStep) % 60,
  }));

  return (
    <View style={styles.picker}>
      <Text accessibilityLiveRegion="polite" style={[styles.preview, { color }]}>
        {formatTime(draft)}
      </Text>
      <View style={styles.wheels}>
        <View pointerEvents="none" style={[styles.band, { backgroundColor: soft, borderColor: color }]} />
        <WheelColumn
          label={`${label}, hour`}
          values={HOURS}
          index={draft.hour}
          color={color}
          onChange={(i) => setDraft((time) => ({ ...time, hour: i }))}
        />
        <Text style={styles.colon}>:</Text>
        <WheelColumn
          label={`${label}, minutes`}
          values={minutes}
          index={Math.round(draft.minute / minuteStep)}
          color={color}
          onChange={(i) => setDraft((time) => ({ ...time, minute: i * minuteStep }))}
        />
      </View>
      <PrimaryButton label={confirmLabel} color={color} onPress={() => onConfirm(draft)} />
    </View>
  );
}

function WheelColumn({
  values,
  index,
  onChange,
  label,
  color,
}: {
  values: string[];
  index: number;
  onChange: (index: number) => void;
  label: string;
  color: string;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const lastIndex = useRef(index);
  const positioned = useRef(false);
  const [centered, setCentered] = useState(index);
  const lockScroll = useScrollLock();

  const clamp = (i: number) => Math.max(0, Math.min(values.length - 1, i));

  // Keep the wheel in sync when the value changes from outside (e.g. a11y actions).
  useEffect(() => {
    if (index !== lastIndex.current) {
      lastIndex.current = index;
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    }
  }, [index]);

  // Never leave the page locked if the wheel unmounts mid-touch.
  useEffect(() => () => lockScroll(false), [lockScroll]);

  function select(i: number) {
    const next = clamp(i);
    setCentered(next);
    if (next !== lastIndex.current) {
      lastIndex.current = next;
      onChange(next);
    }
  }

  function settle(event: NativeSyntheticEvent<NativeScrollEvent>) {
    select(Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT));
  }

  function jumpTo(i: number) {
    scrollRef.current?.scrollTo({ y: clamp(i) * ITEM_HEIGHT, animated: true });
    select(i);
  }

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: values[index] }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event) =>
        jumpTo(index + (event.nativeEvent.actionName === "increment" ? 1 : -1))
      }
      // Hold the page still while the finger is on the wheel.
      onTouchStart={() => lockScroll(true)}
      onTouchEnd={() => lockScroll(false)}
      onTouchCancel={() => lockScroll(false)}
      style={styles.column}
    >
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={styles.columnContent}
        onLayout={() => {
          if (positioned.current) return;
          positioned.current = true;
          scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
        }}
        onScroll={(event) => {
          const i = clamp(Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT));
          if (i !== centered) setCentered(i);
        }}
        onMomentumScrollEnd={settle}
        onScrollEndDrag={settle}
      >
        {values.map((item, i) => (
          <Pressable key={item} onPress={() => jumpTo(i)} style={styles.item}>
            <Text
              style={[
                styles.itemText,
                i === centered ? [styles.itemSelected, { color }] : styles.itemIdle,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: { gap: 12 },
  preview: {
    alignSelf: "center",
    fontSize: 30,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  wheels: {
    height: WHEEL_HEIGHT,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: EDGE_PADDING,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
  },
  colon: { color: COLORS.ink, fontSize: 24, fontWeight: "800", marginTop: -4, marginHorizontal: 4 },
  column: { width: 84, height: WHEEL_HEIGHT },
  columnContent: { paddingVertical: EDGE_PADDING },
  item: { height: ITEM_HEIGHT, alignItems: "center", justifyContent: "center" },
  itemText: { fontSize: 20, fontVariant: ["tabular-nums"] },
  itemSelected: { fontSize: 24, fontWeight: "800" },
  itemIdle: { color: COLORS.muted, opacity: 0.7, fontWeight: "600" },
});
