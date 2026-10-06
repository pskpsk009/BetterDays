import { View } from "react-native";
import type { RefObject } from "react";

export type TrailCoordinate = {
  latitude: number;
  longitude: number;
};

export type TrailMapHandle = {
  takeSnapshot: () => Promise<string | null>;
};

export function TrailMap({
  coordinates: _coordinates,
  tracking: _tracking,
  userLocation: _userLocation,
  locateRequest: _locateRequest,
  onUserPointChange: _onUserPointChange,
  userLocationColor: _userLocationColor,
  pathBreakAt: _pathBreakAt,
  mapRef: _mapRef,
}: {
  coordinates: TrailCoordinate[];
  tracking: boolean;
  userLocation: TrailCoordinate | null;
  locateRequest: number;
  onUserPointChange?: (point: { x: number; y: number }) => void;
  userLocationColor?: string;
  pathBreakAt?: number;
  mapRef?: RefObject<TrailMapHandle | null>;
}) {
  return <View />;
}
