import { useEffect, useRef } from "react";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { StyleSheet } from "react-native";

export type TrailCoordinate = {
  latitude: number;
  longitude: number;
};

const DEFAULT_REGION: Region = {
  latitude: 20,
  longitude: 0,
  latitudeDelta: 0.004,
  longitudeDelta: 0.004,
};

export function TrailMap({ coordinates }: { coordinates: TrailCoordinate[] }) {
  const current = coordinates[coordinates.length - 1];
  const mapRef = useRef<MapView>(null);
  const lastCameraUpdate = useRef(0);

  useEffect(() => {
    if (!current || !mapRef.current) return;
    const now = Date.now();
    if (now - lastCameraUpdate.current < 1000) return;
    lastCameraUpdate.current = now;
    mapRef.current.animateCamera(
      { center: { latitude: current.latitude, longitude: current.longitude } },
      { duration: 700 },
    );
  }, [current]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={DEFAULT_REGION}
      zoomEnabled={true}
      rotateEnabled={false}
      pitchEnabled={false}
      showsUserLocation={false}
    >
      {coordinates.length > 1 && (
        <Polyline
          coordinates={coordinates}
          strokeColor="#DD8C43"
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
      )}
      {current && (
        <Marker
          coordinate={current}
          pinColor="#DD8C43"
          title="Current position"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", aspectRatio: 1.2 },
});
