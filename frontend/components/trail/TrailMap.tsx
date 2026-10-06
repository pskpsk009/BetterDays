import { View } from "react-native";

export type TrailCoordinate = {
  latitude: number;
  longitude: number;
};

export function TrailMap({
  coordinates: _coordinates,
  tracking: _tracking,
  userLocation: _userLocation,
  locateRequest: _locateRequest,
  onUserPointChange: _onUserPointChange,
  userLocationColor: _userLocationColor,
  pathBreakAt: _pathBreakAt,
}: {
  coordinates: TrailCoordinate[];
  tracking: boolean;
  userLocation: TrailCoordinate | null;
  locateRequest: number;
  onUserPointChange?: (point: { x: number; y: number }) => void;
  userLocationColor?: string;
  pathBreakAt?: number;
}) {
  return <View />;
}
