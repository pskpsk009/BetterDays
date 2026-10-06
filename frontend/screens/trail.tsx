import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { Accelerometer, Pedometer } from "expo-sensors";

import {
  COLORS,
  MobileScreen,
  ScreenHeader,
} from "../components/common/AppShell";
import { TrailMap } from "../components/trail/TrailMap";
import type { TrailCoordinate } from "../components/trail/TrailMap";

function distance(points: TrailCoordinate[]) {
  return points.reduce((sum, current, index) => {
    if (!index) return sum;
    const previous = points[index - 1];
    const latitudeDelta =
      ((current.latitude - previous.latitude) * Math.PI) / 180;
    const longitudeDelta =
      ((current.longitude - previous.longitude) * Math.PI) / 180;
    const latitude = (previous.latitude * Math.PI) / 180;
    const a =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(latitude) *
        Math.cos((current.latitude * Math.PI) / 180) *
        Math.sin(longitudeDelta / 2) ** 2;
    return sum + 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, 0);
}

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

function duration(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function TrailScreen() {
  const [coordinates, setCoordinates] = useState<TrailCoordinate[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null,
  );

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const startTracking = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) return;

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
        timeInterval: 500,
      },
      ({ coords }) => {
        if (coords.accuracy && coords.accuracy > 25) return;
        const next = { latitude: coords.latitude, longitude: coords.longitude };
        setCoordinates((current) => {
          const previous = current[current.length - 1];
          if (!previous) return [next];

          const movement = metersBetween(previous, next);
          if (movement < 0.75 || movement > 20) return current;

          const smoothing = 0.55;
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
    setRunning(true);
  };

  const stopTracking = () => {
    locationSubscription.current?.remove();
    locationSubscription.current = null;
    setRunning(false);
  };

  const clear = () => {
    stopTracking();
    setCoordinates([]);
    setSeconds(0);
  };

  return (
    <MobileScreen tone="movement">
      <ScreenHeader
        title="Movement Trail"
        subtitle="A little more movement, one step at a time."
      />
      <View style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>o Current Position</Text>
          <Text style={styles.simulated}>{running ? "LIVE GPS" : "READY"}</Text>
        </View>
        <TrailMap coordinates={coordinates} />
      </View>
      <View style={styles.stats}>
        <Stat
          label="Distance"
          value={`${distance(coordinates).toFixed(1)} m`}
          icon="-"
        />
        <Stat label="Duration" value={duration(seconds)} icon="o" />
        <Stat
          label="Steps / Movement"
          value={String(coordinates.length)}
          icon=">"
        />
      </View>
      <View style={styles.actions}>
        <Pressable
          disabled={running}
          onPress={() => void startTracking()}
          style={[styles.primaryAction, running && styles.disabled]}
        >
          <Text style={styles.primaryActionText}>
            {running ? "Tracking..." : "Start Tracking"}
          </Text>
        </Pressable>
        {running && (
          <Pressable onPress={stopTracking} style={styles.secondaryAction}>
            <Text style={styles.secondaryText}>Stop</Text>
          </Pressable>
        )}
        <Pressable
          disabled={!coordinates.length}
          onPress={clear}
          style={styles.clearAction}
        >
          <Text style={styles.clearText}>Clear Trail</Text>
        </Pressable>
      </View>
      <Text style={styles.footnote}>
        Live GPS draws the path on your phone. Keep the app open while tracking.
      </Text>
      <AccelerometerTest tracking={running} />
    </MobileScreen>
  );
}

function AccelerometerTest({ tracking }: { tracking: boolean }) {
  const [acceleration, setAcceleration] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [magnitude, setMagnitude] = useState<number | null>(null);
  const [moving, setMoving] = useState(false);
  const [peakCount, setPeakCount] = useState(0);
  const [pedometerSteps, setPedometerSteps] = useState(0);
  const [pedometerStatus, setPedometerStatus] = useState("IDLE");
  const previousFiltered = useRef<{ x: number; y: number; z: number } | null>(
    null,
  );
  const previousMagnitude = useRef<number | null>(null);
  const lastStepAt = useRef(0);

  useEffect(() => {
    let active = true;
    let subscription: ReturnType<typeof Accelerometer.addListener> | null =
      null;
    Accelerometer.isAvailableAsync().then((available) => {
      if (!active || !available) return;
      Accelerometer.setUpdateInterval(200);
      subscription = Accelerometer.addListener((sample) => {
        const previous = previousFiltered.current;
        const smoothing = 0.15;
        const filtered = previous
          ? {
              x: previous.x + (sample.x - previous.x) * smoothing,
              y: previous.y + (sample.y - previous.y) * smoothing,
              z: previous.z + (sample.z - previous.z) * smoothing,
            }
          : sample;
        previousFiltered.current = filtered;
        setAcceleration(filtered);
        const currentMagnitude = Math.sqrt(
          filtered.x ** 2 + filtered.y ** 2 + filtered.z ** 2,
        );
        setMagnitude(currentMagnitude);
        setMoving(Math.abs(currentMagnitude - 1) > 0.12);
        const previousMagnitudeValue = previousMagnitude.current;
        const stepThreshold = 1.12;
        const now = Date.now();
        if (
          previousMagnitudeValue !== null &&
          previousMagnitudeValue <= stepThreshold &&
          currentMagnitude > stepThreshold &&
          now - lastStepAt.current > 300
        ) {
          lastStepAt.current = now;
          setPeakCount((current) => current + 1);
        }
        previousMagnitude.current = currentMagnitude;
      });
    });
    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!tracking) {
      setPedometerSteps(0);
      setPedometerStatus("IDLE");
      return;
    }
    let active = true;
    let subscription: ReturnType<typeof Pedometer.watchStepCount> | null = null;
    const startPedometer = async () => {
      setPedometerStatus("CHECKING");
      if (!(await Pedometer.isAvailableAsync())) {
        setPedometerStatus("UNAVAILABLE");
        return;
      }
      const permission = await Pedometer.requestPermissionsAsync();
      if (!active || !permission.granted) {
        setPedometerStatus("DENIED");
        return;
      }
      setPedometerStatus("READY");
      subscription = Pedometer.watchStepCount(({ steps }) => {
        if (active) setPedometerSteps(steps);
      });
    };
    void startPedometer().catch(() => setPedometerStatus("ERROR"));
    return () => {
      active = false;
      subscription?.remove();
    };
  }, [tracking]);

  const status = acceleration
    ? moving
      ? "MOVING"
      : "STILL"
    : "WAITING FOR SENSOR";
  return (
    <View style={styles.sensorCard}>
      <View style={styles.sensorHeader}>
        <Text style={styles.sensorTitle}>Accelerometer Test</Text>
        <Text style={styles.sensorStatus}>{status}</Text>
      </View>
      <View style={styles.sensorValues}>
        <SensorValue label="X" value={acceleration?.x} />
        <SensorValue label="Y" value={acceleration?.y} />
        <SensorValue label="Z" value={acceleration?.z} />
      </View>
      <Text style={styles.sensorHint}>
        Magnitude: {magnitude === null ? "--" : magnitude.toFixed(2)}g. Move the
        phone to test the threshold.
      </Text>
      <Text style={styles.sensorHint}>Pedometer: {pedometerStatus}</Text>
      <Text style={styles.sensorHint}>Native steps: {pedometerSteps}</Text>
      <Text style={styles.sensorHint}>Acceleration peaks: {peakCount}</Text>
    </View>
  );
}

function SensorValue({ label, value }: { label: string; value?: number }) {
  return (
    <View style={styles.sensorValue}>
      <Text style={styles.sensorLabel}>{label}</Text>
      <Text style={styles.sensorNumber}>
        {value === undefined ? "--" : value.toFixed(2)}
      </Text>
    </View>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapCard: {
    overflow: "hidden",
    borderRadius: 21,
    backgroundColor: "#E8F4EF",
    shadowColor: "#205655",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  mapHeader: {
    height: 49,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapTitle: { color: "#356368", fontSize: 12, fontWeight: "800" },
  simulated: {
    color: COLORS.movement,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  stats: { flexDirection: "row", gap: 8, marginVertical: 14 },
  stat: {
    flex: 1,
    minHeight: 78,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  statIcon: { color: COLORS.movement, fontSize: 17 },
  statLabel: { color: COLORS.muted, fontSize: 10, textAlign: "center" },
  statValue: { color: "#315C61", fontSize: 13, fontWeight: "800" },
  actions: { gap: 10 },
  primaryAction: {
    minHeight: 53,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.movement,
    shadowColor: COLORS.movement,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryActionText: { color: COLORS.white, fontSize: 15, fontWeight: "800" },
  secondaryAction: {
    minHeight: 53,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.movementSoft,
  },
  secondaryText: { color: "#B96D2C", fontSize: 15, fontWeight: "800" },
  clearAction: {
    minHeight: 43,
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: { color: "#8B6E55", fontSize: 12, fontWeight: "800" },
  disabled: { opacity: 0.6 },
  footnote: {
    marginHorizontal: 14,
    marginTop: 15,
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
  },
  sensorCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sensorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sensorTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "800" },
  sensorStatus: {
    color: COLORS.teal,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sensorValues: { flexDirection: "row", gap: 8, marginTop: 12 },
  sensorValue: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.tealSoft,
    alignItems: "center",
  },
  sensorLabel: { color: COLORS.muted, fontSize: 10, fontWeight: "800" },
  sensorNumber: {
    color: COLORS.ink,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 3,
  },
  sensorHint: { color: COLORS.muted, fontSize: 11, marginTop: 11 },
});
