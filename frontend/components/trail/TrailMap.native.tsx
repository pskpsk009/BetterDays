import { useEffect, useImperativeHandle, useRef } from "react";
import type { RefObject } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { StyleSheet } from "react-native";

import { TrailPath } from "./TrailPath";

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

export type TrailMapHandle = {
  takeSnapshot: () => Promise<string | null>;
};

type TrailMapProps = {
  coordinates: TrailCoordinate[];
  tracking: boolean;
  userLocation: TrailCoordinate | null;
  locateRequest: number;
  onUserPointChange?: (point: { x: number; y: number }) => void;
  userLocationColor?: string;
  pathBreakAt?: number;
};

export function TrailMap({
  coordinates,
  tracking,
  userLocation,
  locateRequest,
  onUserPointChange,
  userLocationColor,
  pathBreakAt,
  mapRef: snapshotRef,
}: TrailMapProps & { mapRef?: RefObject<TrailMapHandle | null> }) {
  const current = coordinates[coordinates.length - 1];
  const mapRef = useRef<MapView>(null);
  const hasCentered = useRef(false);
  const currentRegion = useRef<Region>(DEFAULT_REGION);

  useImperativeHandle(
    snapshotRef,
    () => ({
      takeSnapshot: async () => {
        if (!mapRef.current) return null;
        try {
          return await mapRef.current.takeSnapshot({
            width: 360,
            height: 270,
            region: currentRegion.current,
            format: "jpg",
            quality: 0.9,
            result: "file",
          });
        } catch {
          return null;
        }
      },
    }),
    [snapshotRef],
  );

  const reportUserPoint = async () => {
    const map = mapRef.current;
    if (!userLocation || tracking || !onUserPointChange || !map) return;
    try {
      const point = await map.pointForCoordinate(userLocation);
      if (mapRef.current === map) onUserPointChange(point);
    } catch {
      // The native map can detach while switching modes or rebuilding tiles.
    }
  };

  useEffect(() => {
    if (!userLocation || !locateRequest || !mapRef.current) return;
    hasCentered.current = true;
    try {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        },
        700,
      );
    } catch {
      // Ignore map teardown races during mode transitions.
    }
  }, [locateRequest]);

  useEffect(() => {
    if (!current) {
      hasCentered.current = false;
      return;
    }
    if (hasCentered.current || !mapRef.current) return;
    hasCentered.current = true;
    try {
      mapRef.current.animateToRegion(
        {
          latitude: current.latitude,
          longitude: current.longitude,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        },
        700,
      );
    } catch {
      // Ignore map teardown races during the first GPS update.
    }
  }, [current]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={DEFAULT_REGION}
      zoomEnabled={!tracking}
      scrollEnabled={!tracking}
      minZoomLevel={14}
      maxZoomLevel={20}
      rotateEnabled={false}
      pitchEnabled={false}
      showsUserLocation={Boolean(userLocation)}
      userLocationAnnotationTitle="Current position"
      onRegionChangeComplete={(region) => {
        currentRegion.current = region;
        void reportUserPoint();
      }}
    >
      <TrailPath coordinates={coordinates} breakAt={pathBreakAt} />
      {userLocation && (
        <Marker
          key="user-location-marker"
          coordinate={userLocation}
          pinColor={userLocationColor ?? "#247F7B"}
          title="You are here"
          identifier="user-location-marker"
          tracksViewChanges={false}
          zIndex={1000}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", aspectRatio: 1.2 },
});
