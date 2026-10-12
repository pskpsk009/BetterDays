import { useState } from "react";
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";

import { COLORS } from "../common/AppShell";
import type { Series } from "./progressSummary";
import { EmptyState } from "./ProgressUI";

// Single-series bar or line chart drawn with react-native-svg. Tapping (or
// hovering / focusing on web) a column shows its value; every column is also
// a labelled accessible element so screen readers can step through the data.

const PAD = { top: 26, right: 8, bottom: 22 };
const GRID = "#E3EEEB";
// SVG text defaults to a serif face on web; match the app's sans-serif text.
const FONT = Platform.select({ web: "system-ui, -apple-system, Segoe UI, sans-serif", default: undefined });

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((candidate) => candidate * magnitude >= value) ?? 10;
  return step * magnitude;
}

// Bar with 4px rounded top corners, anchored flat on the baseline.
function barPath(x: number, y: number, width: number, base: number): string {
  const r = Math.min(4, width / 2, base - y);
  return `M${x},${base} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${base} Z`;
}

export function ProgressChart({
  data,
  color,
  kind = "bar",
  title,
  format,
  height = 170,
  maxValue,
  emptyMessage,
}: {
  data: Series;
  color: string;
  kind?: "bar" | "line";
  /** Names the series for screen readers, e.g. "Mindfulness minutes". */
  title: string;
  format: (value: number) => string;
  height?: number;
  maxValue?: number;
  emptyMessage?: string;
}) {
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  const values = data.map((point) => point.value);
  const hasData = values.some((value) => value !== null && value > 0);
  if (!hasData) return <EmptyState compact message={emptyMessage} />;

  const top = maxValue ?? niceMax(Math.max(...values.map((value) => value ?? 0)));
  // Room for the widest y-axis label at 10px (about 6px per character).
  const padLeft = 10 + Math.max(format(0).length, format(top).length) * 6;
  const plotWidth = Math.max(0, width - padLeft - PAD.right);
  const plotHeight = height - PAD.top - PAD.bottom;
  const base = PAD.top + plotHeight;
  const slot = data.length > 0 ? plotWidth / data.length : 0;
  const barWidth = Math.max(4, Math.min(22, slot * 0.55));
  const yFor = (value: number) => base - (Math.min(value, top) / top) * plotHeight;
  const xCenter = (index: number) => padLeft + slot * index + slot / 2;
  // Thin out x labels when columns get narrow, always keeping the latest one.
  const labelEvery = slot < 34 ? 2 : 1;
  const showLabel = (index: number) =>
    index === data.length - 1 || (data.length - 1 - index) % labelEvery === 0;

  const linePath = data
    .map((point, index) => (point.value === null ? null : { x: xCenter(index), y: yFor(point.value) }))
    .reduce<{ d: string; open: boolean }>(
      (acc, point) => {
        // A missing value breaks the line instead of dropping it to zero.
        if (!point) return { d: acc.d, open: false };
        return { d: `${acc.d}${acc.open ? "L" : "M"}${point.x},${point.y} `, open: true };
      },
      { d: "", open: false },
    ).d;

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);
  const activePoint = active !== null ? data[active] : null;

  return (
    <View onLayout={onLayout} style={{ height }} accessibilityLabel={`${title} chart`}>
      {width > 0 && (
        <>
          <Svg width={width} height={height}>
            {[0, 0.5, 1].map((fraction) => {
              const y = base - fraction * plotHeight;
              return (
                <Line
                  key={fraction}
                  x1={padLeft}
                  x2={width - PAD.right}
                  y1={y}
                  y2={y}
                  stroke={fraction === 0 ? "#C9DBD7" : GRID}
                  strokeWidth={1}
                />
              );
            })}
            {[0, top].map((tick) => (
              <SvgText
                key={tick}
                x={padLeft - 6}
                y={yFor(tick) + 4}
                fontSize="10"
                fontFamily={FONT}
                fill={COLORS.muted}
                textAnchor="end"
              >
                {format(tick)}
              </SvgText>
            ))}

            {kind === "bar" &&
              data.map((point, index) =>
                point.value ? (
                  <Path
                    key={index}
                    d={barPath(xCenter(index) - barWidth / 2, yFor(point.value), barWidth, base)}
                    fill={color}
                    opacity={active === null || active === index ? 1 : 0.45}
                  />
                ) : null,
              )}

            {kind === "line" && (
              <>
                <Path d={linePath} stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
                {data.map((point, index) =>
                  point.value === null ? null : (
                    <Circle
                      key={index}
                      cx={xCenter(index)}
                      cy={yFor(point.value)}
                      r={active === index ? 6 : 4}
                      fill={color}
                      stroke={COLORS.white}
                      strokeWidth={2}
                    />
                  ),
                )}
              </>
            )}

            {active !== null && (
              <Line
                x1={xCenter(active)}
                x2={xCenter(active)}
                y1={PAD.top}
                y2={base}
                stroke={COLORS.muted}
                strokeOpacity={0.35}
                strokeDasharray="3 3"
              />
            )}

            {data.map((point, index) =>
              showLabel(index) ? (
                <SvgText
                  key={index}
                  x={xCenter(index)}
                  y={height - 6}
                  fontSize="10"
                fontFamily={FONT}
                  fill={active === index ? COLORS.ink : COLORS.muted}
                  fontWeight={active === index ? "700" : "400"}
                  textAnchor="middle"
                >
                  {point.label}
                </SvgText>
              ) : null,
            )}
          </Svg>

          {/* Hit targets: full-height columns, larger than the marks. */}
          {data.map((point, index) => (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`${point.label}: ${point.value === null ? "no data" : format(point.value)}`}
              accessibilityState={{ selected: active === index }}
              onPress={() => setActive((current) => (current === index ? null : index))}
              onHoverIn={() => setActive(index)}
              onHoverOut={() => setActive((current) => (current === index ? null : current))}
              onFocus={() => setActive(index)}
              style={[styles.hit, { left: padLeft + slot * index, width: slot, top: PAD.top, height: plotHeight + PAD.bottom }]}
            />
          ))}

          {activePoint && active !== null && (
            <View
              pointerEvents="none"
              style={[
                styles.tooltip,
                {
                  left: Math.min(Math.max(0, xCenter(active) - 60), width - 120),
                },
              ]}
            >
              <Text style={styles.tooltipText} numberOfLines={1}>
                <Text style={styles.tooltipLabel}>{activePoint.label} · </Text>
                {activePoint.value === null ? "No data" : format(activePoint.value)}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hit: { position: "absolute" },
  tooltip: {
    position: "absolute",
    top: 0,
    width: 120,
    alignItems: "center",
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: COLORS.ink,
  },
  tooltipText: { color: COLORS.white, fontSize: 11, fontWeight: "700" },
  tooltipLabel: { color: "#C5D6D8", fontWeight: "500" },
});
