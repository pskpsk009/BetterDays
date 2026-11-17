# Role Statement - Myint Myat Pyae Sone (6631503073)

**Role:** Backend Developer

For Better Days, I worked on designing and building the backend with Supabase. Since the app deals with personal wellbeing information, we wanted users to be able to try it without sending their reflections to a server. Their activity data is saved on the device first. Making an account does not automatically upload it. I worked on the rules for the optional backup feature. If a user chooses to turn it on and agrees to the consent, selected data can be synced to Supabase. The database checks that the user is signed in with a real account and has active consent before it accept a backup. Row-level security keeps each user private records separate. If they withdraw consent, their backup is removed. Users can also export or delete their data. Shared trail posts are handled separately. My job was to build and maintain these backend parts and consider how the backend protect users in real time. I tried to keep the amount of stored data small and make sure users stay in control of it.

## Evidence

- Database schema and row-level security: [backend/supabase/schema.sql](../../../backend/supabase/schema.sql)
- Backup, consent and audit tables, delete-account function: [backend/supabase/backup.sql](../../../backend/supabase/backup.sql)
- Backup sync: [frontend/components/sync/](../../../frontend/components/sync/)
- Data and permissions overview: [.docs/final/data-and-permissions.md](../data-and-permissions.md)

## AI disclosure

This statement was written without AI.
