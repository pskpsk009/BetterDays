# Frontend structure

The mobile app owns all device-facing behavior:

- `screens/` contains route-level screen entries.
- `screens/home.tsx` contains the home experience and interactive body figure.
- `screens/trail.tsx` contains movement tracking and sensor session logic.
- `screens/mental.tsx` owns mental card data and screen copy.
- `screens/body.tsx` owns body card data and screen copy.
- `components/wellness/` contains only the reusable wellness card list.
- `components/common/` contains shared app-shell primitives and theme values.
- `components/trail/` contains map and trail rendering components.
- `components/mygrowth-ui.tsx` is a compatibility barrel with exports only.

GPS, accelerometer, pedometer, and map code stay in the frontend because they require the phone's native APIs.

## Backend boundary

The frontend should send completed trail sessions to `backend/` only when persistence, accounts, or synchronization are added. The backend should not read phone sensors directly.
