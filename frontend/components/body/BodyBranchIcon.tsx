import Svg, { Circle, Path } from "react-native-svg";

import type { BodyBranchId } from "./branches";

export function BodyBranchIcon({
  branch,
  color,
  size = 46,
}: {
  branch: BodyBranchId;
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
      {branch === "fuel" && (
        <>
          {/* water drop with a leaf */}
          <Path d="M20 10c5 7 9 12 9 17a9 9 0 0 1-18 0c0-5 4-10 9-17Z" fill={color} />
          <Path d="M30 18c6-3 9 0 9 0s-1 7-8 7c0 0-2-4-1-7Z" fill={color} opacity={0.55} />
        </>
      )}
      {branch === "movement" && (
        <>
          {/* stretching figure */}
          <Circle cx={24} cy={12} r={4} fill={color} />
          <Path
            d="M14 16l10 6 10-6M24 22v9m0 0l-6 8m6-8l6 8"
            stroke={color}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}
      {branch === "sleep" && (
        <>
          {/* crescent moon and stars */}
          <Path d="M27 11a13 13 0 1 0 10 21A11 11 0 0 1 27 11Z" fill={color} />
          <Circle cx={35} cy={14} r={1.8} fill={color} />
          <Circle cx={39} cy={21} r={1.3} fill={color} />
        </>
      )}
    </Svg>
  );
}
