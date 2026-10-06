import { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Polyline, Rect } from "react-native-svg";

import type { TrailCoordinate } from "./TrailMap";

type IndoorPoint = { x: number; y: number };

type Props = {
  mode: "indoor" | "outdoor";
  coordinates: TrailCoordinate[];
  indoorPath: IndoorPoint[];
};

export const TrailSnapshot = forwardRef<View, Props>(
  ({ mode, coordinates, indoorPath }, ref) => {
    const points =
      mode === "indoor"
        ? indoorPath
        : coordinates.map((coordinate, index) => {
            const origin = coordinates[0] ?? coordinate;
            const latitude = (origin.latitude * Math.PI) / 180;
            return {
              x:
                (coordinate.longitude - origin.longitude) *
                111320 *
                Math.cos(latitude),
              y: (origin.latitude - coordinate.latitude) * 110540,
            };
          });
    const width = 360;
    const height = 270;
    const maxExtent = Math.max(
      ...points.map((point) => Math.max(Math.abs(point.x), Math.abs(point.y))),
      1,
    );
    const scale = Math.min(16, 110 / maxExtent);
    const originX = width / 2;
    const originY = height / 2;
    const line = points
      .map(
        (point) => `${originX + point.x * scale},${originY - point.y * scale}`,
      )
      .join(" ");
    const current = points[points.length - 1] ?? { x: 0, y: 0 };

    return (
      <View ref={ref} collapsable={false} style={styles.canvas}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Rect width={width} height={height} fill="#E8F4EF" />
          {points.length > 1 && (
            <Polyline
              points={line}
              fill="none"
              stroke="#DD8C43"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          <Circle
            cx={originX + current.x * scale}
            cy={originY - current.y * scale}
            r="7"
            fill="#DD8C43"
          />
        </Svg>
      </View>
    );
  },
);

TrailSnapshot.displayName = "TrailSnapshot";

const styles = StyleSheet.create({
  canvas: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 360,
    height: 270,
    zIndex: -1,
    pointerEvents: "none",
  },
});
