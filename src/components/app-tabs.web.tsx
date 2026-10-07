import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from "expo-router/ui";
import { Link } from "expo-router";
import { SymbolView, type AndroidSymbol, type SFSymbol } from "expo-symbols";
import { Pressable, useColorScheme, View, StyleSheet } from "react-native";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon={{ ios: "house.fill", web: "home" }}>
              Home
            </TabButton>
          </TabTrigger>
          <TabTrigger name="mental" href="/mental" asChild>
            <TabButton icon={{ ios: "brain.head.profile", web: "psychology" }}>
              Mind
            </TabButton>
          </TabTrigger>
          <TabTrigger name="body" href="/body" asChild>
            <TabButton icon={{ ios: "heart", web: "favorite" }}>Body</TabButton>
          </TabTrigger>
          <TabTrigger name="trail" href="/trail" asChild>
            <TabButton icon={{ ios: "figure.walk", web: "directions_walk" }}>
              Trail
            </TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabIcon = { ios: SFSymbol; web: AndroidSymbol };

export function TabButton({
  children,
  icon,
  isFocused,
  ...props
}: TabTriggerSlotProps & {
  icon: TabIcon;
}) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? "backgroundSelected" : "backgroundElement"}
        style={styles.tabButtonView}
      >
        <SymbolView
          name={icon}
          tintColor={isFocused ? "#247F7B" : "#60646C"}
          size={16}
        />
        <ThemedText
          type="small"
          themeColor={isFocused ? "text" : "textSecondary"}
        >
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          MyGrowth
        </ThemedText>

        {props.children}

        <Link href="/trail" asChild>
          <Pressable
            style={styles.externalPressable}
            accessibilityRole="button"
          >
            <SymbolView
              tintColor={colors.text}
              name={{ ios: "location.north.fill", web: "explore" }}
              size={15}
            />
            <ThemedText type="link">Navigate</ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: "absolute",
    width: "100%",
    padding: Spacing.three,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: "auto",
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  externalPressable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
