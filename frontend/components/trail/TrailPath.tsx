import { useEffect, useRef, useState } from "react";
import { Marker, Polyline } from "react-native-maps";
import Svg, { Polygon } from "react-native-svg";

import type { TrailCoordinate } from "./TrailMap";

const LIVE_GLIDE_MS = 800;

// Glides the live-position arrow between GPS fixes instead of jumping.
function useGlidingCoordinate(target: TrailCoordinate | null) {
  const [point, setPoint] = useState(target);
  const pointRef = useRef(target);

  useEffect(() => {
    const from = pointRef.current;
    if (!target || !from) {
      pointRef.current = target;
      setPoint(target);
      return;
    }
    const startedAt = Date.now();
    let frame = requestAnimationFrame(function step() {
      const progress = Math.min(1, (Date.now() - startedAt) / LIVE_GLIDE_MS);
      const next = {
        latitude: from.latitude + (target.latitude - from.latitude) * progress,
        longitude: from.longitude + (target.longitude - from.longitude) * progress,
        heading: target.heading,
      };
      pointRef.current = next;
      setPoint(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return point;
}

/**
 * Draws the trail as separate segments (a new one starts at each index in
 * `breaks`, i.e. after every pause). The arrow sits at the end of the line,
 * or at `liveLocation` while drawing is paused so it keeps following you.
 */
export function TrailPath({
  coordinates,
  breaks = [],
  liveLocation = null,
}: {
  coordinates: TrailCoordinate[];
  breaks?: number[];
  liveLocation?: TrailCoordinate | null;
}) {
  const live = useGlidingCoordinate(liveLocation);
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

  const pathEnd = renderedCoordinates[renderedCoordinates.length - 1];
  const current = live
    ? { ...live, heading: live.heading ?? pathEnd?.heading }
    : pathEnd;
  const starts = [0, ...breaks.filter((index) => index > 0)];
  const segments = starts.map((start, index) =>
    renderedCoordinates.slice(start, starts[index + 1] ?? renderedCoordinates.length),
  );

  return (
    <>
      {segments.map(
        (segment, index) =>
          segment.length > 1 && (
            <Polyline
              key={`trail-segment-${index}`}
              coordinates={segment}
              strokeColor="#DD8C43"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          ),
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
