import { useRouter } from "expo-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { G, Path, Polygon } from "react-native-svg";
import { SymbolView } from "expo-symbols";
import * as Location from "expo-location";

import {
  COLORS,
  MobileScreen,
  ScreenHeader,
} from "../components/common/AppShell";
import {
  TrailMap,
  useOutdoorGpsTracker,
  IndoorMotionTracker,
  uploadTrailImage,
  buildTrailSvg,
} from "../components/trail";
import type { TrailCoordinate } from "../components/trail";
import PublicTrailsScreen from "./public-trails";

// `breaks` are indexes where a new segment starts after a pause; the gap
// walked while paused is not counted.
function distance(points: TrailCoordinate[], breaks: number[] = []) {
  return points.reduce((sum, current, index) => {
    if (!index || breaks.includes(index)) return sum;
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

function indoorDistance(points: IndoorPoint[], breaks: number[] = []) {
  return points.reduce(
    (total, point, index) =>
      index && !breaks.includes(index)
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
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<TrackingMode>("outdoor");
  const [nativeSteps, setNativeSteps] = useState(0);
  const [motionMoving, setMotionMoving] = useState(false);
  const [indoorPath, setIndoorPath] = useState<IndoorPoint[]>([{ x: 0, y: 0 }]);
  const [indoorLivePosition, setIndoorLivePosition] = useState<IndoorPoint>({
    x: 0,
    y: 0,
  });
  const [indoorBreaks, setIndoorBreaks] = useState<number[]>([]);
  const [gpsBreaks, setGpsBreaks] = useState<number[]>([]);
  // Direction of the latest indoor step, in degrees (0 = up on the canvas).
  const [indoorHeading, setIndoorHeading] = useState(0);
  const [indoorOrigin, setIndoorOrigin] = useState({ x: 180, y: 150 });
  const [userLocation, setUserLocation] = useState<TrailCoordinate | null>(
    null,
  );
  const [navigationLocation, setNavigationLocation] =
    useState<TrailCoordinate | null>(null);
  const [locateRequest, setLocateRequest] = useState(0);
  const [locating, setLocating] = useState(false);
  const [showPublicTrails, setShowPublicTrails] = useState(false);
  const motionMovingRef = useRef(false);
  const drawingPausedRef = useRef(false);
  const gpsDrawingRef = useRef(true);
  const outdoorTracker = useOutdoorGpsTracker(
    motionMovingRef,
    drawingPausedRef,
    gpsDrawingRef,
  );
  const { coordinates, currentLocation } = outdoorTracker;

  useEffect(() => {
    motionMovingRef.current = motionMoving;
  }, [motionMoving]);

  useEffect(() => {
    drawingPausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (!running || paused) return;
    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running, paused]);

  const startTracking = async () => {
    gpsDrawingRef.current = mode === "outdoor";
    if (mode === "outdoor" && !(await outdoorTracker.start())) return;
    setIndoorPath([{ x: 0, y: 0 }]);
    setIndoorLivePosition({ x: 0, y: 0 });
    setIndoorBreaks([]);
    setGpsBreaks([]);
    setIndoorHeading(0);
    setNativeSteps(0);
    setTimeout(() => setUserLocation(null), 800);
    setPaused(false);
    drawingPausedRef.current = false;

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
      const nextLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setNavigationLocation(nextLocation);
      setUserLocation(nextLocation);
      setLocateRequest((current) => current + 1);
    } finally {
      setLocating(false);
    }
  };

  const finishStopTracking = () => {
    outdoorTracker.stop();
    gpsDrawingRef.current = false;
    drawingPausedRef.current = false;
    setRunning(false);
    setPaused(false);
    setUserLocation(null);
  };

  const saveTrailImage = async () => {
    try {
      const svg = buildTrailSvg({
        mode,
        coordinates,
        indoorPath,
        breaks: mode === "indoor" ? indoorBreaks : gpsBreaks,
      });
      const uploaded = await uploadTrailImage(svg, {
        mode,
        distanceMeters: currentDistance,
      });
      finishStopTracking();
      Alert.alert(
        "Trail saved",
        `Your drawing was saved to Supabase Storage.\n${uploaded.path}`,
      );
      return svg;
    } catch {
      Alert.alert(
        "Could not save trail",
        "The map image could not be captured.",
      );
      return null;
    }
  };

  const requestStopTracking = () => {
    if (!running) return;
    Alert.alert(
      "Save this trail?",
      "Choose whether to keep an image of your drawing.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: finishStopTracking },
        { text: "Save image", onPress: () => void saveTrailImage() },
      ],
    );
  };

  const togglePause = async () => {
    if (!running) return;
    if (!paused) {
      drawingPausedRef.current = true;
      setPaused(true);
      return;
    }
    // Resume starts a new segment wherever you are now.
    if (mode === "outdoor") {
      setGpsBreaks((current) => [...current, coordinates.length]);
      outdoorTracker.startNewSegment();
    } else {
      setIndoorBreaks((current) => [...current, indoorPath.length]);
      setIndoorPath((current) => [...current, indoorLivePosition]);
    }
    drawingPausedRef.current = false;
    setPaused(false);
  };

  // While paused outdoors the arrow follows your live GPS position.
  const liveLocation =
    running && paused && mode === "outdoor" ? currentLocation : null;
  const visibleLocation = running
    ? mode === "indoor" && paused
      ? navigationLocation
      : null
    : userLocation;

  const clear = () => {
    finishStopTracking();
    outdoorTracker.clear();
    setSeconds(0);
    setIndoorPath([{ x: 0, y: 0 }]);
    setIndoorLivePosition({ x: 0, y: 0 });
    setIndoorBreaks([]);
    setGpsBreaks([]);
    setIndoorHeading(0);
    setNativeSteps(0);
  };

  const recordIndoorStep = ({ dx, dy }: { dx: number; dy: number }) => {
    setIndoorPath((current) => {
      const previous = current[current.length - 1];
      return [...current, { x: previous.x + dx, y: previous.y + dy }];
    });
  };

  const recordIndoorPosition = ({ dx, dy }: { dx: number; dy: number }) => {
    setIndoorHeading((Math.atan2(dx, dy) * 180) / Math.PI);
    setIndoorLivePosition((current) => ({
      x: current.x + dx,
      y: current.y + dy,
    }));
  };

  const selectMode = (nextMode: TrackingMode) => {
    if (running) return;
    setMode(nextMode);
    outdoorTracker.clear();
    setIndoorPath([{ x: 0, y: 0 }]);
    setIndoorBreaks([]);
    setGpsBreaks([]);
    setIndoorHeading(0);
    setSeconds(0);
    setNativeSteps(0);
  };

  const indoorPosition = indoorPath[indoorPath.length - 1];
  const currentDistance =
    mode === "indoor"
      ? indoorDistance(indoorPath, indoorBreaks)
      : distance(coordinates, gpsBreaks);
  const estimatedSteps = Math.round(currentDistance / 0.7);
  const displayedSteps = nativeSteps > 0 ? nativeSteps : estimatedSteps;

  if (showPublicTrails) {
    return <PublicTrailsScreen onClose={() => setShowPublicTrails(false)} />;
  }

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
              ? paused
                ? "PAUSED"
                : mode === "outdoor"
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
              userLocation={visibleLocation}
              locateRequest={locateRequest}
              onUserPointChange={running ? undefined : setIndoorOrigin}
              userLocationColor="#DD8C43"
              pathBreaks={gpsBreaks}
              liveLocation={liveLocation}
            />
          ) : (
            <>
              <TrailMap
                coordinates={[]}
                tracking={running}
                userLocation={visibleLocation}
                locateRequest={locateRequest}
                onUserPointChange={running ? undefined : setIndoorOrigin}
                userLocationColor="#DD8C43"
                pathBreaks={gpsBreaks}
              liveLocation={liveLocation}
              />
              <IndoorCanvas
                points={indoorPath}
                breaks={indoorBreaks}
                origin={indoorOrigin}
                livePosition={indoorLivePosition}
                heading={indoorHeading}
              />
            </>
          )}
          {!running && (
            <Pressable
              accessibilityLabel="Show my current location"
              disabled={locating}
              onPress={() => void locateUser()}
              style={[styles.locateButton, locating && styles.disabled]}
            >
              <SymbolView
                name={{
                  ios: "location.fill",
                  android: "my_location",
                  web: "my_location",
                }}
                tintColor={COLORS.teal}
                size={22}
              />
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
          <Pressable
            onPress={() => void togglePause()}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryText}>
              {paused ? "Resume" : "Pause"}
            </Text>
          </Pressable>
        )}
        {running && (
          <Pressable
            onPress={requestStopTracking}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryText}>Stop</Text>
          </Pressable>
        )}
        <Pressable
          disabled={!coordinates.length && indoorPath.length <= 1}
          onPress={clear}
          style={styles.clearAction}
        >
          <Text style={styles.clearText}>Clear Trail</Text>
        </Pressable>
      </View>
      <Pressable
        onPress={() => setShowPublicTrails(true)}
        style={styles.viewTrailsButton}
      >
        <Text style={styles.viewTrailsText}>View Trails</Text>
      </Pressable>
      <Text style={styles.footnote}>
        Live GPS draws the path on your phone. Keep the app open while tracking.
      </Text>
      <IndoorMotionTracker
        mode={mode}
        tracking={running}
        drawingPaused={paused}
        onStepsChange={setNativeSteps}
        onMovementChange={setMotionMoving}
        onIndoorStep={recordIndoorStep}
        onIndoorPosition={recordIndoorPosition}
        indoorPosition={indoorPosition}
      />
    </MobileScreen>
  );
}

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 300;
const CANVAS_PADDING = 24;
const MAX_PIXELS_PER_METER = 16;
const HEAD_GLIDE_MS = 220;
const HEAD_SNAP_METERS = 3;

// Glides the drawing head toward each new step so the line grows instead of jumping.
function useGlidingPoint(target: IndoorPoint) {
  const [point, setPoint] = useState(target);
  const pointRef = useRef(target);

  useEffect(() => {
    const from = pointRef.current;
    const to = { x: target.x, y: target.y };
    const snap = Math.hypot(to.x - from.x, to.y - from.y) > HEAD_SNAP_METERS;
    const startedAt = Date.now();
    let frame = requestAnimationFrame(function step() {
      const progress = snap
        ? 1
        : Math.min(1, (Date.now() - startedAt) / HEAD_GLIDE_MS);
      const eased = 1 - (1 - progress) ** 3;
      const next = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
      };
      pointRef.current = next;
      setPoint(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [target.x, target.y]);

  return point;
}

function smoothPathData(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let data = `M${points[0].x},${points[0].y}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    data += ` Q${current.x},${current.y} ${(current.x + next.x) / 2},${(current.y + next.y) / 2}`;
  }
  const last = points[points.length - 1];
  return `${data} L${last.x},${last.y}`;
}

const IndoorCanvas = memo(function IndoorCanvas({
  points,
  breaks,
  origin,
  livePosition,
  heading,
}: {
  points: IndoorPoint[];
  breaks: number[];
  origin: { x: number; y: number };
  livePosition: IndoorPoint;
  /** Direction of the latest step in degrees, so the arrow turns while paused too. */
  heading: number;
}) {
  const head = useGlidingPoint(livePosition);

  const pixelsPerMeter = useMemo(() => {
    let right = 0;
    let left = 0;
    let up = 0;
    let down = 0;
    for (const point of [...points, livePosition]) {
      right = Math.max(right, point.x);
      left = Math.max(left, -point.x);
      up = Math.max(up, point.y);
      down = Math.max(down, -point.y);
    }
    const candidates = [
      right ? (CANVAS_WIDTH - CANVAS_PADDING - origin.x) / right : MAX_PIXELS_PER_METER,
      left ? (origin.x - CANVAS_PADDING) / left : MAX_PIXELS_PER_METER,
      up ? (origin.y - CANVAS_PADDING) / up : MAX_PIXELS_PER_METER,
      down ? (CANVAS_HEIGHT - CANVAS_PADDING - origin.y) / down : MAX_PIXELS_PER_METER,
    ];
    return Math.min(
      MAX_PIXELS_PER_METER,
      ...candidates.map((candidate) => Math.max(candidate, 1)),
    );
  }, [points, livePosition, origin]);

  const toScreen = (point: IndoorPoint) => ({
    x: origin.x + point.x * pixelsPerMeter,
    y: origin.y - point.y * pixelsPerMeter,
  });

  const last = points[points.length - 1];
  const headIsOnPath =
    last && last.x === livePosition.x && last.y === livePosition.y;
  const drawnPoints = headIsOnPath ? [...points.slice(0, -1), head] : points;

  const segmentStarts = [0, ...breaks];
  const segments = segmentStarts.map((start, index) =>
    drawnPoints.slice(start, segmentStarts[index + 1] ?? drawnPoints.length),
  );

  const headScreen = toScreen(head);
  const direction = heading;

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      pointerEvents="none"
      style={[styles.indoorCanvas, styles.indoorOverlay]}
    >
      {segments.map(
        (segment, index) =>
          segment.length > 1 && (
            <Path
              key={`indoor-segment-${index}`}
              d={smoothPathData(segment.map(toScreen))}
              fill="none"
              stroke={COLORS.movement}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ),
      )}
      <G
        transform={`translate(${headScreen.x} ${headScreen.y}) rotate(${direction})`}
      >
        <Polygon
          points="0,-11 8,8 0,4 -8,8"
          fill={COLORS.movement}
          stroke={COLORS.white}
          strokeWidth="1.5"
        />
      </G>
    </Svg>
  );
});


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
  indoorCanvas: { width: "100%", height: "100%" },
  indoorOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    elevation: 2,
  },
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
  viewTrailsButton: {
    marginTop: 14,
    minHeight: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.tealSoft,
  },
  viewTrailsText: { color: COLORS.teal, fontSize: 14, fontWeight: "800" },
});
