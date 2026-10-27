# MyGrowth Backend

Device-facing code belongs in `frontend/`: GPS, accelerometer, pedometer,
maps, and trail drawing all require the phone's native APIs. This backend
should receive completed sessions only when persistence or synchronization is
needed.

Supabase is the backend. Run the SQL in the Supabase SQL editor, in order:

1. `supabase/schema.sql`: public trail gallery table and storage bucket (and the older grounding tables, which the app no longer writes).
2. `supabase/backup.sql`: optional account backup (`user_data`), backup consent (`consents`), insert-only `audit_events`, the `delete_my_account()` function, and size limits for trail uploads.

Everything is protected by row-level security: users can only read or change their own rows. The Progress page still uses demo data.

Not built yet: syncing measurable activity metrics, and real data for the Progress page.
