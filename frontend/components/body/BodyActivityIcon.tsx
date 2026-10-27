import Svg, { Circle, Path } from "react-native-svg";

export type BodyIconId = "hydration" | "balanced-plate" | "daily-stretch" | "schedule-guidance";

export function BodyActivityIcon({
  activity,
  color,
  size = 46,
}: {
  activity: BodyIconId;
  color: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx={24} cy={24} r={20} fill={color} opacity={0.14} />
      {activity === "hydration" && (
        <>
          {/* glass with water and a drop */}
          <Path d="M16.4 22.5c2.5-1.4 5-1.4 7.6 0s5.1 1.4 7.6 0l-1.3 12.8a2 2 0 0 1-2 1.7h-8.6a2 2 0 0 1-2-1.7Z" fill={color} opacity={0.4} />
          <Path
            d="M14.5 12h19l-2.6 24.2a2.8 2.8 0 0 1-2.8 2.5h-8.2a2.8 2.8 0 0 1-2.8-2.5Z"
            stroke={color}
            strokeWidth={2.4}
            strokeLinejoin="round"
            fill="none"
          />
          <Path d="M24 25.5c1.8 2.4 2.8 4 2.8 5.2a2.8 2.8 0 0 1-5.6 0c0-1.2 1-2.8 2.8-5.2Z" fill={color} />
        </>
      )}
      {activity === "balanced-plate" && (
        <>
          {/* plate divided into food groups */}
          <Circle cx={24} cy={24} r={13} fill={color} opacity={0.22} />
          <Path d="M24 24V11a13 13 0 0 1 11.3 19.5Z" fill={color} opacity={0.55} />
          <Circle cx={24} cy={24} r={13} stroke={color} strokeWidth={2.4} fill="none" />
          <Path
            d="M24 24V11M24 24l11.3 6.5M24 24l-11.3 6.5"
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
          <Circle cx={24} cy={24} r={2.4} fill="#FFFFFF" />
        </>
      )}
      {activity === "daily-stretch" && (
        <>
          {/* figure reaching up, with motion arcs */}
          <Circle cx={24} cy={11.5} r={3.6} fill={color} />
          <Path
            d="M24 17v10M24 19l-8-7M24 19l8-7M24 27l-5.5 10M24 27l5.5 10"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M11 20a14 14 0 0 0 0 9M37 20a14 14 0 0 1 0 9"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.5}
            fill="none"
          />
        </>
      )}
      {activity === "schedule-guidance" && (
        <>
          {/* bedtime clock with a crescent moon */}
          <Circle cx={22} cy={26} r={12} fill={color} opacity={0.2} />
          <Circle cx={22} cy={26} r={12} stroke={color} strokeWidth={2.4} fill="none" />
          <Path
            d="M22 19v7l5 3"
            stroke={color}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path d="M35.5 7.5a6 6 0 1 0 5.5 9 5 5 0 0 1-5.5-9Z" fill={color} />
        </>
      )}
    </Svg>
  );
}
