import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { mentalStyles } from "../../common/ActivityUI";
import { COLORS } from "../../common/AppShell";
import { TimePicker } from "../../common/TimePicker";
import { ClockTime, formatTime } from "../../common/time";

/** A labelled time value that opens the shared TimePicker when tapped. */
export function TimeField({
  label,
  value,
  onChange,
  color,
  soft,
}: {
  label: string;
  value: ClockTime;
  onChange: (time: ClockTime) => void;
  color: string;
  soft: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.field, open && { borderColor: color }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatTime(value)}`}
        accessibilityHint={open ? "Closes the time picker" : "Opens the time picker"}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={styles.row}
      >
        <Text style={[mentalStyles.label, styles.flex]}>{label.toUpperCase()}</Text>
        <Text style={[styles.value, { color }]}>{formatTime(value)}</Text>
        <Text style={[styles.change, { color }]}>{open ? "Close" : "Change"}</Text>
      </Pressable>
      {open && (
        <TimePicker
          key={formatTime(value)}
          label={label}
          value={value}
          color={color}
          soft={soft}
          onConfirm={(time) => {
            onChange(time);
            setOpen(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 32 },
  flex: { flex: 1 },
  value: { fontSize: 18, fontWeight: "800", fontVariant: ["tabular-nums"] },
  change: { fontSize: 12, fontWeight: "800" },
});
