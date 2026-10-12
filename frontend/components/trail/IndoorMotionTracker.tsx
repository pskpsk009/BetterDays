import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Accelerometer, Magnetometer, Pedometer } from "expo-sensors";

import { COLORS } from "../common/AppShell";

type TrackingMode = "outdoor" | "indoor";

type Props = {
  mode: TrackingMode;
  tracking: boolean;
  drawingPaused: boolean;
  indoorPosition: { x: number; y: number };
  onStepsChange: (steps: number) => void;
  onMovementChange: (moving: boolean) => void;
  onIndoorStep: (movement: { dx: number; dy: number }) => void;
  onIndoorPosition: (movement: { dx: number; dy: number }) => void;
};

export function IndoorMotionTracker({
  mode,
  tracking,
  drawingPaused,
  indoorPosition,
  onStepsChange,
  onMovementChange,
  onIndoorStep,
  onIndoorPosition,
}: Props) {
  const [hasSample, setHasSample] = useState(false);
  const [magnitude, setMagnitude] = useState<number | null>(null);
  const [moving, setMoving] = useState(false);
  const [steps, setSteps] = useState(0);
  const [pedometerStatus, setPedometerStatus] = useState("IDLE");
  const [heading, setHeading] = useState<number | null>(null);
  const previous = useRef<{ x: number; y: number; z: number } | null>(null);
  const previousMagnitude = useRef<number | null>(null);
  const lastStepAt = useRef(0);
  const stepArmed = useRef(true);
  const magnetic = useRef<{ x: number; y: number } | null>(null);
  const movingRef = useRef(false);
  const lastReadoutAt = useRef(0);
  const trackingRef = useRef(tracking);
  const modeRef = useRef(mode);
  const drawingPausedRef = useRef(drawingPaused);
  const onIndoorStepRef = useRef(onIndoorStep);
  const onMovementChangeRef = useRef(onMovementChange);
  const onStepsChangeRef = useRef(onStepsChange);
  const onIndoorPositionRef = useRef(onIndoorPosition);

  useEffect(() => {
    trackingRef.current = tracking;
  }, [tracking]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    drawingPausedRef.current = drawingPaused;
  }, [drawingPaused]);
  useEffect(() => {
    onIndoorStepRef.current = onIndoorStep;
  }, [onIndoorStep]);
  useEffect(() => {
    onMovementChangeRef.current = onMovementChange;
  }, [onMovementChange]);
  useEffect(() => {
    onStepsChangeRef.current = onStepsChange;
  }, [onStepsChange]);
  useEffect(() => {
    onIndoorPositionRef.current = onIndoorPosition;
  }, [onIndoorPosition]);

  useEffect(() => {
    let active = true;
    let accelerometerSubscription: ReturnType<
      typeof Accelerometer.addListener
    > | null = null;
    let magnetometerSubscription: ReturnType<
      typeof Magnetometer.addListener
    > | null = null;

    const subscribe = async () => {
      if (await Accelerometer.isAvailableAsync()) {
        Accelerometer.setUpdateInterval(50);
        accelerometerSubscription = Accelerometer.addListener((sample) => {
          const old = previous.current;
          const smoothing = modeRef.current === "indoor" ? 0.3 : 0.35;
          const filtered = old
            ? {
                x: old.x + (sample.x - old.x) * smoothing,
                y: old.y + (sample.y - old.y) * smoothing,
                z: old.z + (sample.z - old.z) * smoothing,
              }
            : sample;
          previous.current = filtered;
          const currentMagnitude = Math.sqrt(
            filtered.x ** 2 + filtered.y ** 2 + filtered.z ** 2,
          );
          const now = Date.now();
          // Sensor runs at 20 Hz; throttle the debug readout so the screen isn't re-rendered every sample.
          if (now - lastReadoutAt.current > 250) {
            lastReadoutAt.current = now;
            setHasSample(true);
            setMagnitude(currentMagnitude);
          }
          const currentlyMoving =
            Math.abs(currentMagnitude - 1) >
            (modeRef.current === "indoor" ? 0.18 : 0.12);
          if (currentlyMoving !== movingRef.current) {
            movingRef.current = currentlyMoving;
            setMoving(currentlyMoving);
            onMovementChangeRef.current(currentlyMoving);
          }
          const oldMagnitude = previousMagnitude.current;
          if (currentMagnitude < 1.0) stepArmed.current = true;
          if (
            modeRef.current === "indoor" &&
            trackingRef.current &&
            !drawingPausedRef.current &&
            stepArmed.current &&
            oldMagnitude !== null &&
            currentMagnitude > 1.06 &&
            now - lastStepAt.current > 300
          ) {
            const previousStepAt = lastStepAt.current;
            lastStepAt.current = now;
            stepArmed.current = false;
            setSteps((current) => current + 1);
            if (magnetic.current) {
              const direction = Math.atan2(
                magnetic.current.y,
                magnetic.current.x,
              );
              const stepInterval = previousStepAt ? now - previousStepAt : 700;
              const cadence = Math.min(170, Math.max(55, 60000 / stepInterval));
              const stepLength = Math.min(
                1,
                Math.max(0.45, 0.35 + cadence * 0.004),
              );
              const movement = {
                dx: stepLength * Math.sin(direction),
                dy: stepLength * Math.cos(direction),
              };
              onIndoorPositionRef.current(movement);
              onIndoorStepRef.current(movement);
            }
          }
          previousMagnitude.current = currentMagnitude;
        });
      }
      if (await Magnetometer.isAvailableAsync()) {
        Magnetometer.setUpdateInterval(100);
        magnetometerSubscription = Magnetometer.addListener((value) => {
          // Low-pass the field vector (not the angle) so heading noise doesn't zigzag the path
          // and averaging never breaks at the 0°/360° wraparound.
          const old = magnetic.current;
          const next = old
            ? {
                x: old.x + (value.x - old.x) * 0.25,
                y: old.y + (value.y - old.y) * 0.25,
              }
            : { x: value.x, y: value.y };
          magnetic.current = next;
          if (active)
            setHeading(Math.round((Math.atan2(next.y, next.x) * 180) / Math.PI));
        });
      }
    };

    void subscribe();
    return () => {
      active = false;
      accelerometerSubscription?.remove();
      magnetometerSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!tracking) {
      setPedometerStatus("IDLE");
      return;
    }
    setSteps(0);
    let active = true;
    let subscription: ReturnType<typeof Pedometer.watchStepCount> | null = null;
    let pollingTimer: ReturnType<typeof setInterval> | null = null;
    const sessionStart = new Date();
    const start = async () => {
      setPedometerStatus("CHECKING");
      if (!(await Pedometer.isAvailableAsync()))
        return setPedometerStatus("UNAVAILABLE");
      const permission = await Pedometer.requestPermissionsAsync();
      if (!active || !permission.granted) return setPedometerStatus("DENIED");
      setPedometerStatus("READY");
      const update = (value: number) => {
        setSteps(value);
        onStepsChangeRef.current(value);
      };
      subscription = Pedometer.watchStepCount(({ steps: value }) => {
        if (active) update(value);
      });
      if (Platform.OS === "ios") {
        const refresh = async () => {
          const result = await Pedometer.getStepCountAsync(
            sessionStart,
            new Date(),
          );
          if (active) update(result.steps);
        };
        void refresh();
        pollingTimer = setInterval(() => void refresh(), 2000);
      }
    };
    void start().catch(() => setPedometerStatus("ERROR"));
    return () => {
      active = false;
      subscription?.remove();
      if (pollingTimer) clearInterval(pollingTimer);
    };
  }, [tracking]);

  if (mode !== "indoor") return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {mode === "indoor" ? "Indoor Motion" : "Outdoor Motion"}
        </Text>
        <Text style={styles.status}>
          {hasSample ? (moving ? "MOVING" : "STILL") : "WAITING"}
        </Text>
      </View>
      <Text style={styles.value}>
        Magnitude: {magnitude === null ? "--" : magnitude.toFixed(2)}g
      </Text>
      <Text style={styles.value}>
        Pedometer: {pedometerStatus} · Steps: {steps}
      </Text>
      <Text style={styles.value}>
        Heading:{" "}
        {heading === null ? "--" : `${((heading + 360) % 360).toFixed(0)}°`}
      </Text>
      <Text style={styles.value}>
        Indoor X/Y: {indoorPosition.x.toFixed(1)}m,{" "}
        {indoorPosition.y.toFixed(1)}m
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: COLORS.ink, fontSize: 13, fontWeight: "800" },
  status: {
    color: COLORS.teal,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  value: { color: COLORS.muted, fontSize: 11, marginTop: 10 },
});
