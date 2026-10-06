import { StyleSheet, Text, View } from "react-native";

import type { TrailCoordinate } from "./TrailMap.native";

export function TrailMap({ coordinates }: { coordinates: TrailCoordinate[] }) {
  return (
    <View style={styles.fallback}>
      <Text style={styles.title}>Live map available on your phone</Text>
      <Text style={styles.detail}>
        {coordinates.length
          ? `${coordinates.length} GPS points recorded`
          : "Start tracking to collect GPS points"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E7F5F0",
    padding: 24,
  },
  title: {
    color: "#183B42",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  detail: { color: "#6D8589", marginTop: 8, textAlign: "center" },
});
