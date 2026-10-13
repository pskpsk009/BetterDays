# Frontend structure

The mobile app owns all device-facing behavior:

- `screens/` contains route-level screen entries.
- `screens/home.tsx` contains the home experience and interactive body figure.
- `screens/trail.tsx` contains movement tracking and sensor session logic.
- `screens/mental.tsx` owns the Mind tab: the Mental Wellness / Emotional Wellness switch and the activity maps.
- `components/mental/` and `components/emotional/` hold each section's branch config, icons, and activities.
- `components/common/GuidedActivities.tsx` holds reusable, content-driven activity templates (reflection journal, choice explorer, small step picker, scenario practice).
- `screens/body.tsx` owns body card data and screen copy.
- `components/wellness/` contains only the reusable wellness card list.
- `components/common/` contains shared app-shell primitives and theme values.
- `components/trail/` contains map and trail rendering components.
- `screens/progress.tsx` owns the Progress page state (`selectedArea`, period, demo/empty preview).
- `components/progress/` contains the Growth Tree, charts, and Mind/Body detail views. Data flows
  `useProgressData` (demo data today, Supabase later) -> `progressSummary.ts` / `progressMath.ts`
  (pure calculations) -> presentation components.
- `components/mygrowth-ui.tsx` is a compatibility barrel with exports only.

GPS, accelerometer, pedometer, and map code stay in the frontend because they require the phone's native APIs.

## Backend boundary

The frontend should send completed trail sessions to `backend/` only when persistence, accounts, or synchronization are added. The backend should not read phone sensors directly.
