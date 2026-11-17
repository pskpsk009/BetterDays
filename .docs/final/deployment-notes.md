# Deployment Notes - BetterDays

How the app is run and shown today, why there is no public build, and what a
real release would need. Full setup steps are in the
[README](../../README.md#getting-started).

## 1. How it runs today

| Part | Where it runs | Cost |
|---|---|---|
| Mobile app | **Expo Go** on the user's phone, served from a team laptop with `npx expo start --tunnel` | Free |
| Database, accounts, storage | Supabase free plan | Free |
| Source code | GitHub, branch `main` | Free |

**Showcase steps:**

1. On the laptop: `npm install`, copy `.env.example` to `.env.local` and add
   the Supabase URL and publishable key.
2. Run `npx expo start --tunnel`.
3. Viewers install Expo Go and scan the QR code. The laptop must stay on
   while the app is used.

## 2. Why there is no live URL

A build that installs without the team's laptop needs an app store account
(Apple Developer Program or Google Play) or paid build hosting. The team has
no budget for this, so the app is shown through Expo Go. The web build is not
used because GPS, motion sensors, and the map need a real phone.

## 3. Environment and secrets

- `.env.local` holds `EXPO_PUBLIC_SUPABASE_URL` and
  `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. It is gitignored; only the
  placeholder [.env.example](../../.env.example) is committed.
- The publishable key is safe in the app because every table uses row-level
  security. The `service_role` key is never used in the app.
- Git history was checked on 18/11/2026: no keys were ever committed.

## 4. Database setup (once)

1. Run [schema.sql](../../backend/supabase/schema.sql), then
   [backup.sql](../../backend/supabase/backup.sql) in the Supabase SQL editor.
2. Turn on Email and Anonymous sign-ins.
3. Make the reset-password email show the code `{{ .Token }}`.
4. Optional: schedule the weekly audit purge with `pg_cron`.

## 5. Free-plan limits

- Backup values are capped at 64 KB per row; trail images at 512 KB.
- Supabase free projects pause after a period of no use; a paused project
  must be resumed from the Supabase dashboard before the showcase.

## 6. Before a public release

| Need | Why | Status |
|---|---|---|
| Confirm Supabase region and tell users | PDPA s.28 | Open |
| Minimum age or guardian consent | PDPA s.20 | Open |
| Data breach plan (72-hour report) | PDPA s.37(4) | Open |
| Wellbeing advisor review of activity and safety wording | Backlog B34 | Open |
| Fix logged issues ISS-01 to ISS-05 and retest | [issue-log.md](../test/uat/issue-log.md) | Open |
| Store build (EAS Build) and store accounts | Install without Expo Go | Not funded |
