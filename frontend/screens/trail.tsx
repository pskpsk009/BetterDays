import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Polyline, Rect } from "react-native-svg";
import * as Location from "expo-location";
import {
  Accelerometer,
  Gyroscope,
  Magnetometer,
  Pedometer,
} from "expo-sensors";

import {
  COLORS,
  MobileScreen,
  ScreenHeader,
} from "../components/common/AppShell";
import { TrailMap } from "../components/trail/TrailMap";
import type { TrailCoordinate } from "../components/trail/TrailMap";
import { useOutdoorGpsTracker } from "../components/trail/OutdoorGpsTracker";
import { IndoorMotionTracker } from "../components/trail/IndoorMotionTracker";

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

function duration(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

type TrackingMode = "outdoor" | "indoor";
type IndoorPoint = { x: number; y: number };

function indoorDistance(points: IndoorPoint[]) {
  return points.reduce(
    (total, point, index) =>
      index
        ? total +
          Math.hypot(
            point.x - points[index - 1].x,
            point.y - points[index - 1].y,
          )
        : total,
    0,
  );
}

export default function TrailScreen() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<TrackingMode>("outdoor");
  const [nativeSteps, setNativeSteps] = useState(0);
  const [motionMoving, setMotionMoving] = useState(false);
  const [indoorPath, setIndoorPath] = useState<IndoorPoint[]>([{ x: 0, y: 0 }]);
  const [userLocation, setUserLocation] = useState<TrailCoordinate | null>(
    null,
  );
  const [locateRequest, setLocateRequest] = useState(0);
  const [locating, setLocating] = useState(false);
  const motionMovingRef = useRef(false);
  const outdoorTracker = useOutdoorGpsTracker(motionMovingRef);
  const { coordinates } = outdoorTracker;

  useEffect(() => {
    motionMovingRef.current = motionMoving;
  }, [motionMoving]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const startTracking = async () => {
    if (mode === "outdoor" && !(await outdoorTracker.start())) return;
    setIndoorPath([{ x: 0, y: 0 }]);
    setNativeSteps(0);
    setUserLocation(null);

    setRunning(true);
  };

  const locateUser = async () => {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) return;
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLocateRequest((current) => current + 1);
    } finally {
      setLocating(false);
    }
  };

  const stopTracking = () => {
    outdoorTracker.stop();
    setRunning(false);
    setUserLocation(null);
  };

  const clear = () => {
    stopTracking();
    outdoorTracker.clear();
    setSeconds(0);
    setIndoorPath([{ x: 0, y: 0 }]);
    setNativeSteps(0);
  };

  const recordIndoorStep = ({ dx, dy }: { dx: number; dy: number }) => {
    setIndoorPath((current) => {
      const previous = current[current.length - 1];
      return [...current, { x: previous.x + dx, y: previous.y + dy }];
    });
  };

  const selectMode = (nextMode: TrackingMode) => {
    if (running) return;
    setMode(nextMode);
    outdoorTracker.clear();
    setIndoorPath([{ x: 0, y: 0 }]);
    setSeconds(0);
    setNativeSteps(0);
  };

  const indoorPosition = indoorPath[indoorPath.length - 1];
  const currentDistance =
    mode === "indoor" ? indoorDistance(indoorPath) : distance(coordinates);
  const estimatedSteps = Math.round(currentDistance / 0.7);
  const displayedSteps = nativeSteps > 0 ? nativeSteps : estimatedSteps;

  return (
    <MobileScreen tone="movement">
      <ScreenHeader
        title="Movement Trail"
        subtitle="A little more movement, one step at a time."
      />
      <View style={styles.modeSelector}>
        <Pressable
          disabled={running}
          onPress={() => selectMode("outdoor")}
          style={[
            styles.modeOption,
            mode === "outdoor" && styles.modeOptionActive,
          ]}
        >
          <Text
            style={[
              styles.modeText,
              mode === "outdoor" && styles.modeTextActive,
            ]}
          >
            Outdoor GPS
          </Text>
        </Pressable>
        <Pressable
          disabled={running}
          onPress={() => selectMode("indoor")}
          style={[
            styles.modeOption,
            mode === "indoor" && styles.modeOptionActive,
          ]}
        >
          <Text
            style={[
              styles.modeText,
              mode === "indoor" && styles.modeTextActive,
            ]}
          >
            Indoor 2D
          </Text>
        </Pressable>
      </View>
      <View style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>
            {mode === "outdoor" ? "o Current Position" : "o Indoor Drawing"}
          </Text>
          <Text style={styles.simulated}>
            {running
              ? mode === "outdoor"
                ? "LIVE GPS"
                : "LIVE MOTION"
              : "READY"}
          </Text>
        </View>
        <View key={mode} style={styles.mapStage}>
          {mode === "outdoor" ? (
            <TrailMap
              coordinates={coordinates}
              tracking={running}
              userLocation={running ? null : userLocation}
              locateRequest={locateRequest}
            />
          ) : (
            <>
              <TrailMap
                coordinates={[]}
                tracking={running}
                userLocation={running ? null : userLocation}
                locateRequest={locateRequest}
              />
              <IndoorCanvas points={indoorPath} />
            </>
          )}
          {!running && (
            <Pressable
              accessibilityLabel="Show my current location"
              disabled={locating}
              onPress={() => void locateUser()}
              style={[styles.locateButton, locating && styles.disabled]}
            >
              <Text style={styles.locateText}>◎</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View style={styles.stats}>
        <Stat
          label="Distance"
          value={`${currentDistance.toFixed(1)} m`}
          icon="-"
        />
        <Stat label="Duration" value={duration(seconds)} icon="o" />
        <Stat
          label={nativeSteps > 0 ? "Steps" : "Estimated Steps"}
          value={String(displayedSteps)}
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
      <IndoorMotionTracker
        mode={mode}
        tracking={running}
        onStepsChange={setNativeSteps}
        onMovementChange={setMotionMoving}
        onIndoorStep={recordIndoorStep}
        indoorPosition={indoorPosition}
      />
    </MobileScreen>
  );
}

function IndoorCanvas({ points }: { points: IndoorPoint[] }) {
  const padding = 24;
  const width = 360;
  const height = 270;
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  const minX = Math.min(...xValues, 0);
  const maxX = Math.max(...xValues, 0);
  const minY = Math.min(...yValues, 0);
  const maxY = Math.max(...yValues, 0);
  const scale = Math.min(
    (width - padding * 2) / Math.max(maxX - minX, 1),
    (height - padding * 2) / Math.max(maxY - minY, 1),
  );
  const screenPoints = points
    .map(
      (point) =>
        `${padding + (point.x - minX) * scale},${height - padding - (point.y - minY) * scale}`,
    )
    .join(" ");
  const current = points[points.length - 1];
  const currentX = padding + (current.x - minX) * scale;
  const currentY = height - padding - (current.y - minY) * scale;

  return (
    <Svg
      width="100%"
      height={270}
      viewBox={`0 0 ${width} ${height}`}
      pointerEvents="none"
      style={[styles.indoorCanvas, styles.indoorOverlay]}
    >
      <Rect width={width} height={height} fill="#E8F4EF" />
      {points.length > 1 && (
        <Polyline
          points={screenPoints}
          fill="none"
          stroke={COLORS.movement}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <Circle cx={currentX} cy={currentY} r="7" fill={COLORS.movement} />
    </Svg>
  );
}

function AccelerometerTest({
  mode,
  tracking,
  onStepsChange,
  onMovementChange,
  onIndoorStep,
  indoorPosition,
}: {
  mode: TrackingMode;
  tracking: boolean;
  onStepsChange: (steps: number) => void;
  onMovementChange: (moving: boolean) => void;
  onIndoorStep: (movement: { dx: number; dy: number }) => void;
  indoorPosition: { x: number; y: number };
}) {
  const [acceleration, setAcceleration] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [magnitude, setMagnitude] = useState<number | null>(null);
  const [moving, setMoving] = useState(false);
  const [rotation, setRotation] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [magneticField, setMagneticField] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [peakCount, setPeakCount] = useState(0);
  const [pedometerSteps, setPedometerSteps] = useState(0);
  const [pedometerStatus, setPedometerStatus] = useState("IDLE");
  const previousFiltered = useRef<{ x: number; y: number; z: number } | null>(
    null,
  );
  const previousMagnitude = useRef<number | null>(null);
  const lastStepAt = useRef(0);
  const magneticFieldRef = useRef<{ x: number; y: number; z: number } | null>(
    null,
  );
  const trackingRef = useRef(false);
  const modeRef = useRef<TrackingMode>(mode);

  useEffect(() => {
    trackingRef.current = tracking;
  }, [tracking]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    let active = true;
    let subscription: ReturnType<typeof Accelerometer.addListener> | null =
      null;
    Accelerometer.isAvailableAsync().then((available) => {
      if (!active || !available) return;
      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener((sample) => {
        const previous = previousFiltered.current;
        const smoothing = modeRef.current === "indoor" ? 0.22 : 0.35;
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
        const movementThreshold = modeRef.current === "indoor" ? 0.18 : 0.12;
        const currentlyMoving =
          Math.abs(currentMagnitude - 1) > movementThreshold;
        setMoving(currentlyMoving);
        onMovementChange(currentlyMoving);
        const previousMagnitudeValue = previousMagnitude.current;
        const stepThreshold = 1.1;
        const stepCooldown = 400;
        const now = Date.now();
        if (
          previousMagnitudeValue !== null &&
          modeRef.current === "indoor" &&
          previousMagnitudeValue <= stepThreshold &&
          currentMagnitude > stepThreshold &&
          now - lastStepAt.current > stepCooldown
        ) {
          lastStepAt.current = now;
          setPeakCount((current) => current + 1);
          const magnetic = magneticFieldRef.current;
          if (trackingRef.current && magnetic) {
            const heading = Math.atan2(magnetic.y, magnetic.x);
            const stepLength = 0.7;
            onIndoorStep({
              dx: stepLength * Math.sin(heading),
              dy: stepLength * Math.cos(heading),
            });
          }
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
    let active = true;
    let gyroscopeSubscription: ReturnType<typeof Gyroscope.addListener> | null =
      null;
    let magnetometerSubscription: ReturnType<
      typeof Magnetometer.addListener
    > | null = null;

    const subscribe = async () => {
      const [gyroAvailable, magnetometerAvailable] = await Promise.all([
        Gyroscope.isAvailableAsync(),
        Magnetometer.isAvailableAsync(),
      ]);
      if (!active) return;

      if (gyroAvailable) {
        Gyroscope.setUpdateInterval(100);
        gyroscopeSubscription = Gyroscope.addListener((value) => {
          if (active) setRotation(value);
        });
      }
      if (magnetometerAvailable) {
        Magnetometer.setUpdateInterval(100);
        magnetometerSubscription = Magnetometer.addListener((value) => {
          if (active) {
            magneticFieldRef.current = value;
            setMagneticField(value);
          }
        });
      }
    };

    void subscribe();
    return () => {
      active = false;
      gyroscopeSubscription?.remove();
      magnetometerSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!tracking) {
      setPedometerStatus("IDLE");
      return;
    }
    setPedometerSteps(0);
    let active = true;
    let subscription: ReturnType<typeof Pedometer.watchStepCount> | null = null;
    let pollingTimer: ReturnType<typeof setInterval> | null = null;
    const sessionStart = new Date();
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
        if (active) {
          setPedometerSteps(steps);
          onStepsChange(steps);
        }
      });

      if (Platform.OS === "ios") {
        const refreshIosSteps = async () => {
          const result = await Pedometer.getStepCountAsync(
            sessionStart,
            new Date(),
          );
          if (active) {
            setPedometerSteps(result.steps);
            onStepsChange(result.steps);
          }
        };
        void refreshIosSteps();
        pollingTimer = setInterval(() => void refreshIosSteps(), 2000);
      }
    };
    void startPedometer().catch(() => setPedometerStatus("ERROR"));
    return () => {
      active = false;
      subscription?.remove();
      if (pollingTimer) clearInterval(pollingTimer);
    };
  }, [tracking]);

  const status = acceleration
    ? moving
      ? "MOVING"
      : "STILL"
    : "WAITING FOR SENSOR";
  const heading = magneticField
    ? (Math.atan2(magneticField.y, magneticField.x) * 180) / Math.PI
    : null;
  const normalizedHeading = heading === null ? null : (heading + 360) % 360;
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
      <Text style={styles.sensorHint}>
        Heading:{" "}
        {normalizedHeading === null ? "--" : `${normalizedHeading.toFixed(0)}°`}
      </Text>
      <Text style={styles.sensorHint}>
        Rotation:{" "}
        {rotation
          ? `${rotation.x.toFixed(2)}, ${rotation.y.toFixed(2)}, ${rotation.z.toFixed(2)}`
          : "--"}
      </Text>
      <Text style={styles.sensorHint}>
        Indoor X/Y: {indoorPosition.x.toFixed(1)}m,{" "}
        {indoorPosition.y.toFixed(1)}m
      </Text>
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
  modeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  modeOption: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  modeOptionActive: {
    borderColor: COLORS.movement,
    backgroundColor: COLORS.movementSoft,
  },
  modeText: { color: COLORS.muted, fontSize: 12, fontWeight: "800" },
  modeTextActive: { color: "#B96D2C" },
  mapCard: {
    overflow: "hidden",
    borderRadius: 21,
    backgroundColor: "#E8F4EF",
    shadowColor: "#205655",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  mapStage: { position: "relative" },
  indoorCanvas: { width: "100%", aspectRatio: 1.333 },
  indoorOverlay: { position: "absolute", top: 0, left: 0, right: 0 },
  locateButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    shadowColor: "#205655",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  locateText: { color: COLORS.teal, fontSize: 27, fontWeight: "700" },
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
