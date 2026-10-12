import { useMemo } from "react";

import { createDemoDataset, createEmptyDataset } from "./mockData";
import { toDateKey } from "./progressMath";
import type { DateKey, ProgressDataset } from "./types";

export type DataMode = "demo" | "preview";

/**
 * The single data seam for the Progress page.
 *
 * Today it returns frontend-only demo data, or an empty dataset that previews
 * the new-user view. To connect Supabase later, load the signed-in user's own
 * rows for each ProgressDataset list here (row-level security scoped to the
 * user, LR4), set `source: "user"`, and expose loading and error states. No
 * component below this hook needs to change.
 */
export function useProgressData(mode: DataMode): { data: ProgressDataset; today: DateKey } {
  const today = toDateKey(new Date());
  const data = useMemo(
    () => (mode === "demo" ? createDemoDataset(new Date(`${today}T12:00:00`)) : createEmptyDataset()),
    [mode, today],
  );
  return { data, today };
}
