import { View } from "react-native";

export type TrailCoordinate = {
  latitude: number;
  longitude: number;
};

export function TrailMap({ coordinates: _coordinates }: { coordinates: TrailCoordinate[] }) {
  return <View />;
}