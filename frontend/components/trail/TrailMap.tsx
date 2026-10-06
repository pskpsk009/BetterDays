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
}: {
  coordinates: TrailCoordinate[];
  tracking: boolean;
  userLocation: TrailCoordinate | null;
  locateRequest: number;
}) {
  return <View />;
}
