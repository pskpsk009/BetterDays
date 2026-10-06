import type { TrailCoordinate } from "./TrailMap";

type IndoorPoint = { x: number; y: number };

type Options = {
  mode: "indoor" | "outdoor";
  coordinates: TrailCoordinate[];
  indoorPath: IndoorPoint[];
};

export function buildTrailSvg({ mode, coordinates, indoorPath }: Options) {
  const points =
    mode === "indoor"
      ? indoorPath
      : coordinates.map((coordinate, index) => {
          const origin = coordinates[0] ?? coordinate;
          const latitude = (origin.latitude * Math.PI) / 180;
          return {
            x:
              (coordinate.longitude - origin.longitude) *
              111320 *
              Math.cos(latitude),
            y: (origin.latitude - coordinate.latitude) * 110540,
          };
        });
  const width = 720;
  const height = 540;
  const extent = Math.max(
    ...points.map((point) => Math.max(Math.abs(point.x), Math.abs(point.y))),
    1,
  );
  const scale = Math.min(24, 220 / extent);
  const originX = width / 2;
  const originY = height / 2;
  const line = points
    .map((point) => `${originX + point.x * scale},${originY - point.y * scale}`)
    .join(" ");
  const current = points[points.length - 1] ?? { x: 0, y: 0 };
  const currentX = originX + current.x * scale;
  const currentY = originY - current.y * scale;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#E8F4EF"/><polyline points="${line}" fill="none" stroke="#DD8C43" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${currentX}" cy="${currentY}" r="14" fill="#DD8C43"/></svg>`;
}
