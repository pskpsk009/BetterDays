import { StyleSheet, Text, View } from "react-native";
import type { RefObject } from "react";

import type { TrailCoordinate, TrailMapHandle } from "./TrailMap";

export function TrailMap({
  coordinates,
  tracking: _tracking,
  userLocation: _userLocation,
  locateRequest: _locateRequest,
  onUserPointChange: _onUserPointChange,
  userLocationColor: _userLocationColor,
  pathBreakAt: _pathBreakAt,
  mapRef: _mapRef,
}: {
  coordinates: TrailCoordinate[];
  tracking: boolean;
  userLocation: TrailCoordinate | null;
  locateRequest: number;
  onUserPointChange?: (point: { x: number; y: number }) => void;
  userLocationColor?: string;
  pathBreakAt?: number;
  mapRef?: RefObject<TrailMapHandle | null>;
}) {
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
