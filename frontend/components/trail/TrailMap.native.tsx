import { useEffect, useRef } from "react";
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

export function TrailMap({
  coordinates,
  tracking,
  userLocation,
  locateRequest,
}: {
  coordinates: TrailCoordinate[];
  tracking: boolean;
  userLocation: TrailCoordinate | null;
  locateRequest: number;
}) {
  const current = coordinates[coordinates.length - 1];
  const mapRef = useRef<MapView>(null);
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!userLocation || !locateRequest || !mapRef.current) return;
    hasCentered.current = true;
    mapRef.current.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      },
      700,
    );
  }, [locateRequest, userLocation]);

  useEffect(() => {
    if (!current) {
      hasCentered.current = false;
      return;
    }
    if (hasCentered.current || !mapRef.current) return;
    hasCentered.current = true;
    mapRef.current.animateToRegion(
      {
        latitude: current.latitude,
        longitude: current.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      },
      700,
    );
  }, [current]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={DEFAULT_REGION}
      zoomEnabled={!tracking}
      scrollEnabled={!tracking}
      rotateEnabled={false}
      pitchEnabled={false}
      showsUserLocation={false}
    >
      <TrailPath coordinates={coordinates} />
      {userLocation && (
        <Marker
          coordinate={userLocation}
          pinColor="#247F7B"
          title="You are here"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", aspectRatio: 1.2 },
});
