import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { StyleProp, TextStyle } from "react-native";

import { COLORS } from "./AppShell";

// One icon set for the whole app (Material Design Icons via @expo/vector-icons),
// used instead of emoji so icons look the same on every phone.

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function isIconName(value: string): value is IconName {
  return value in MaterialCommunityIcons.glyphMap;
}

export function AppIcon({
  name,
  size = 20,
  color = COLORS.ink,
  style,
}: {
  /** An icon name. Unknown names (such as emoji in data saved by an older version) fall back to a dot. */
  name: IconName | (string & {});
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <MaterialCommunityIcons
      name={isIconName(name) ? name : "circle-small"}
      size={size}
      color={color}
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
