import { useEffect, useRef, useState } from "react";
import { Marker, Polyline } from "react-native-maps";
import Svg, { Polygon } from "react-native-svg";

import type { TrailCoordinate } from "./TrailMap";

export function TrailPath({
  coordinates,
  breakAt,
}: {
  coordinates: TrailCoordinate[];
  breakAt?: number;
}) {
  const [renderedCoordinates, setRenderedCoordinates] =
    useState<TrailCoordinate[]>(coordinates);
  const renderedRef = useRef<TrailCoordinate[]>(coordinates);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (!coordinates.length) {
      renderedRef.current = [];
      setRenderedCoordinates([]);
      return;
    }
    if (coordinates.length === 1) {
      renderedRef.current = coordinates;
      setRenderedCoordinates(coordinates);
      return;
    }

    const start =
      renderedRef.current[renderedRef.current.length - 1] ??
      coordinates[coordinates.length - 2];
    const target = coordinates[coordinates.length - 1];
    const fixed = coordinates.slice(0, -1);
    const startedAt = Date.now();
    const animationDuration = 900;

    const animate = () => {
      const progress = Math.min(
        1,
        (Date.now() - startedAt) / animationDuration,
      );
      const next = [
        ...fixed,
        {
          latitude:
            start.latitude + (target.latitude - start.latitude) * progress,
          longitude:
            start.longitude + (target.longitude - start.longitude) * progress,
          heading: target.heading,
        },
      ];
      renderedRef.current = next;
      setRenderedCoordinates(next);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [coordinates]);

  const current = renderedCoordinates[renderedCoordinates.length - 1];
  const firstSegment = breakAt ? renderedCoordinates.slice(0, breakAt) : [];
  const secondSegment = breakAt
    ? renderedCoordinates.slice(breakAt)
    : renderedCoordinates;

  return (
    <>
      {firstSegment.length > 1 && (
        <Polyline
          coordinates={firstSegment}
          strokeColor="#DD8C43"
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
      )}
      {secondSegment.length > 1 && (
        <Polyline
          coordinates={secondSegment}
          strokeColor="#DD8C43"
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
      )}
      {current && (
        <Marker coordinate={current} title="Current position">
          <Svg width={28} height={28} viewBox="0 0 28 28">
            <Polygon
              points="14,2 24,24 14,19 4,24"
              fill="#DD8C43"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              transform={`rotate(${current.heading ?? 0} 14 14)`}
            />
          </Svg>
        </Marker>
      )}
    </>
  );
}
