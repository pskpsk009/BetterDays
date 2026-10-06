import { useRef, useState } from "react";
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

export function useOutdoorGpsTracker(motionMovingRef: { current: boolean }) {
  const [coordinates, setCoordinates] = useState<TrailCoordinate[]>([]);
  const subscription = useRef<Location.LocationSubscription | null>(null);

  const start = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) return false;

    subscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 0.5,
        timeInterval: 300,
      },
      ({ coords }) => {
        if (coords.accuracy && coords.accuracy > 15) return;
        const next = { latitude: coords.latitude, longitude: coords.longitude };
        setCoordinates((current) => {
          const previous = current[current.length - 1];
          if (!previous) return [next];
          const walkingSpeed = coords.speed ?? 0;
          if (walkingSpeed < 0.5 && !motionMovingRef.current) return current;
          const movement = metersBetween(previous, next);
          if (movement < 0.75 || movement > 20) return current;
          const smoothing = 0.75;
          return [
            ...current,
            {
              latitude:
                previous.latitude +
                (next.latitude - previous.latitude) * smoothing,
              longitude:
                previous.longitude +
                (next.longitude - previous.longitude) * smoothing,
            },
          ];
        });
      },
    );
    return true;
  };

  const stop = () => {
    subscription.current?.remove();
    subscription.current = null;
  };

  const clear = () => setCoordinates([]);

  return { coordinates, start, stop, clear };
}
