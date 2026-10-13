import Svg, { Circle, Line, Path } from "react-native-svg";

import type { MentalBranchId } from "./branches";

export function BranchIcon({
  branch,
  color,
  size = 46,
}: {
  branch: MentalBranchId;
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
      {branch === "self-acceptance" && (
        <>
          <Path
            d="M24 35c-8-5-12-9.5-12-14.5 0-3.6 2.7-6 5.8-6 2.6 0 4.6 1.6 6.2 3.8 1.6-2.2 3.6-3.8 6.2-3.8 3.1 0 5.8 2.4 5.8 6 0 5-4 9.5-12 14.5Z"
            fill={color}
            opacity={0.3}
          />
          <Path d="M24 33V22" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
          <Path d="M24 26c-3.5 0-5.5-2-5.5-5 3.4 0 5.5 2 5.5 5Zm0-2c3.5 0 5.5-2 5.5-5-3.4 0-5.5 2-5.5 5Z" fill={color} />
        </>
      )}
      {branch === "discover-joy" && (
        <>
          <Circle cx={24} cy={24} r={7} fill={color} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <Line
              key={angle}
              x1={24}
              y1={12}
              x2={24}
              y2={8}
              stroke={color}
              strokeWidth={2.6}
              strokeLinecap="round"
              transform={`rotate(${angle} 24 24)`}
            />
          ))}
        </>
      )}
      {branch === "purpose" && (
        <>
          <Circle cx={24} cy={24} r={13} fill="none" stroke={color} strokeWidth={2.6} />
          <Path d="M24 13l4 11-4 11-4-11Z" fill={color} opacity={0.35} />
          <Path d="M24 13l4 11h-8Z" fill={color} />
          <Circle cx={24} cy={24} r={2} fill="#FFFFFF" />
        </>
      )}
      {branch === "live-the-life" && (
        <>
          <Circle cx={24} cy={24} r={13} fill={color} opacity={0.24} />
          <Path
            d="M24 33c-6-3.5-8-8-6.5-13.5C22 21 24 24 24 33Zm0 0c6-3.5 8-8 6.5-13.5C26 21 24 24 24 33Z"
            fill={color}
          />
        </>
      )}
      {branch === "find-your-focus" && (
        <>
          <Circle cx={24} cy={24} r={13} fill="none" stroke={color} strokeWidth={2.6} />
          <Circle cx={24} cy={24} r={7} fill="none" stroke={color} strokeWidth={2.6} />
          <Circle cx={24} cy={24} r={2.6} fill={color} />
        </>
      )}
    </Svg>
  );
}
