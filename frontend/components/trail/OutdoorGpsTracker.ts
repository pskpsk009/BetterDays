import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

import type { TrailCoordinate } from "./TrailMap";

function metersBetween(first: TrailCoordinate, second: TrailCoordinate) {
  const latitudeDelta = ((second.latitude - first.latitude) * Math.PI) / 180;
  const longitudeDelta = ((second.longitude - first.longitude) * Math.PI) / 180;
  const latitude = (first.latitude * Math.PI) / 180;
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitude) *
      Math.cos((second.latitude * Math.PI) / 180) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useOutdoorGpsTracker(
  motionMovingRef: { current: boolean },
  drawingPausedRef: { current: boolean },
  drawingEnabledRef: { current: boolean },
) {
  const [coordinates, setCoordinates] = useState<TrailCoordinate[]>([]);
  const [currentLocation, setCurrentLocation] =
    useState<TrailCoordinate | null>(null);
  const subscription = useRef<Location.LocationSubscription | null>(null);
  // Latest accurate fix, kept even while drawing is paused.
  const latestFix = useRef<TrailCoordinate | null>(null);
  // After a resume, the next accurate fix starts a fresh segment.
  const segmentPending = useRef(false);
  // Bumped by every start, stop and unmount, so a start that is still waiting
  // on the permission prompt or the GPS watch can tell it has been replaced
  // and never leaves a second watcher running.
  const startId = useRef(0);

  useEffect(() => {
    return () => {
      startId.current += 1;
      subscription.current?.remove();
      subscription.current = null;
    };
  }, []);

  const start = async () => {
    const id = ++startId.current;
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted || id !== startId.current) return false;

    subscription.current?.remove();
    subscription.current = null;
    // Each session starts a fresh line. Keeping the previous session's last
    // point would bridge the gap, and any fix more than 35 m from it would be
    // rejected, so nothing new would ever be drawn.
    setCoordinates([]);
    latestFix.current = null;
    segmentPending.current = false;

    const watch = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 2,
        timeInterval: 1000,
      },
      ({ coords }) => {
        const next = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          heading: coords.heading ?? undefined,
        };
        // The live position keeps updating while paused; only drawing stops.
        setCurrentLocation(next);
        if (coords.accuracy && coords.accuracy > 25) return;
        latestFix.current = next;
        if (drawingPausedRef.current || !drawingEnabledRef.current) return;
        if (segmentPending.current) {
          segmentPending.current = false;
          setCoordinates((current) => [...current, next]);
          return;
        }
        setCoordinates((current) => {
          const previous = current[current.length - 1];
          if (!previous) return [next];
          const walkingSpeed = coords.speed ?? 0;
          if (walkingSpeed < 0.5 && !motionMovingRef.current) return current;
          const movement = metersBetween(previous, next);
          if (movement < 1 || movement > 35) return current;
          const smoothing = 0.65;
          return [
            ...current,
            {
              latitude:
                previous.latitude +
                (next.latitude - previous.latitude) * smoothing,
              longitude:
                previous.longitude +
                (next.longitude - previous.longitude) * smoothing,
              heading: next.heading ?? previous.heading,
            },
          ];
        });
      },
    );
    if (id !== startId.current) {
      watch.remove();
      return false;
    }
    subscription.current = watch;
    return true;
  };

  const stop = () => {
    startId.current += 1;
    subscription.current?.remove();
    subscription.current = null;
  };

  /**
   * Begins a new segment after a pause, at the current position, so the
   * line never bridges the distance walked while paused.
   */
  const startNewSegment = () => {
    const fix = latestFix.current;
    if (fix) {
      segmentPending.current = false;
      setCoordinates((current) => [...current, fix]);
    } else {
      segmentPending.current = true;
    }
  };

  const clear = () => {
    setCoordinates([]);
    setCurrentLocation(null);
    latestFix.current = null;
    segmentPending.current = false;
  };

  return { coordinates, currentLocation, start, stop, clear, startNewSegment };
}
