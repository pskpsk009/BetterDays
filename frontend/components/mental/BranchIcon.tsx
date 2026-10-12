import Svg, { Circle, Path } from "react-native-svg";

import type { BranchId } from "./branches";

export function BranchIcon({
  branch,
  color,
  size = 46,
}: {
  branch: BranchId;
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {branch === "mindfulness" && (
        <>
          <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
          <Circle cx={24} cy={24} r={13} fill={color} opacity={0.24} />
          <Path
            d="M24 33c-6-3.5-8-8-6.5-13.5C22 21 24 24 24 33Zm0 0c6-3.5 8-8 6.5-13.5C26 21 24 24 24 33Z"
            fill={color}
          />
        </>
      )}
      {branch === "awareness" && (
        <>
          <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
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
      {branch === "concentration" && (
        <>
          <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
          <Circle cx={24} cy={24} r={13} fill="none" stroke={color} strokeWidth={2.6} />
          <Circle cx={24} cy={24} r={7} fill="none" stroke={color} strokeWidth={2.6} />
          <Circle cx={24} cy={24} r={2.6} fill={color} />
        </>
      )}
    </Svg>
  );
}
