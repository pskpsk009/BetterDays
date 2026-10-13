import Svg, { Circle, Path, Rect } from "react-native-svg";

import type { EmotionalBranchId } from "./branches";

export function EmotionalBranchIcon({
  branch,
  color,
  size = 46,
}: {
  branch: EmotionalBranchId;
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
      {branch === "stand-up-again" && (
        <>
          <Path d="M12 34h24" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M24 34V17" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M24 25c-5 0-8-3-8-7 4.8 0 8 3 8 7Z" fill={color} opacity={0.45} />
          <Path d="M24 21c5 0 8-3 8-7-4.8 0-8 3-8 7Z" fill={color} />
        </>
      )}
      {branch === "self-awareness" && (
        <>
          <Path
            d="M10 24c4-7 9-10 14-10s10 3 14 10c-4 7-9 10-14 10s-10-3-14-10Z"
            fill="none"
            stroke={color}
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
          <Circle cx={24} cy={24} r={5} fill={color} />
        </>
      )}
      {branch === "self-control" && (
        <>
          <Circle cx={24} cy={24} r={12} fill={color} opacity={0.22} />
          <Rect x={18.5} y={17} width={4} height={14} rx={2} fill={color} />
          <Rect x={25.5} y={17} width={4} height={14} rx={2} fill={color} />
        </>
      )}
      {branch === "social-creatures" && (
        <>
          <Circle cx={19} cy={19} r={4.5} fill={color} opacity={0.5} />
          <Path d="M10.5 33c0-5 3.8-8.5 8.5-8.5s8.5 3.5 8.5 8.5Z" fill={color} opacity={0.5} />
          <Circle cx={29} cy={20} r={4.5} fill={color} />
          <Path d="M20.5 34c0-5 3.8-8.5 8.5-8.5s8.5 3.5 8.5 8.5Z" fill={color} />
        </>
      )}
    </Svg>
  );
}
