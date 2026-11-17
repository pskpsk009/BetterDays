# Data Sources and Permissions - BetterDays

What data the app uses, where it comes from, where it is stored, what phone
permissions it asks for, and where the project's research data came from.
Legal basis: [rule.md](../../rule.md) (Thailand PDPA section).

## 1. Phone permissions

Declared in [app.json](../../app.json). Each is asked only when the feature
is first used, and the app works without them.

| Permission | Asked when | Used for | If refused |
|---|---|---|---|
| Location (while in use) | Starting an **Outdoor** trail | Drawing the walking trail | Outdoor trail is unavailable; Indoor still works |
| Motion / step sensor | Starting an **Indoor** trail | Counting steps and movement | Indoor trail is unavailable |
| Share screen | Download my data, share a trail | Saving the export file or trail image | Nothing is shared |

The app does not use the camera, microphone, contacts, or background
location.

## 2. Data stored on the phone

Stored with `expo-sqlite` through
[localStore.ts](../../frontend/components/common/localStore.ts). Nothing
leaves the phone unless the user turns on backup or shares a trail.

| Key | What it holds | Written by |
|---|---|---|
| `support-circle` | Names or roles the user lists as support | My Support Circle |
| `values-compass` | Chosen values | Values Compass |
| `skills` | Skill-building notes | Develop Your Skill |
| `sleep` | Target bedtime and wake time, steps, one morning log per day (trimmed after 180 days) | Sleep Schedule Guidance |
| `welcome` | Date seen, notice version, help picks | Welcome screens |
| `activity-log` | Which activity was finished, date, minutes (no typed text) | Progress page |

All six keys are included in **Download my data** and removed by **Delete all
data**.

## 3. Data stored in the cloud (Supabase, optional)

Schema: [backend/supabase/schema.sql](../../backend/supabase/schema.sql) and
[backend/supabase/backup.sql](../../backend/supabase/backup.sql). Every table
uses row-level security.

| Table / storage | When | Who can read it | Deleted when |
|---|---|---|---|
| `consents` | User turns on backup | Only that user | Account deleted |
| `user_data` | Backup is on (one row per key above) | Only that user | Consent withdrawn (trigger) or account deleted |
| `audit_events` | Backup on/off, export, data deletion, account deletion | Nobody through the app (insert-only) | Purged after 180 days |
| `public_trails` + `public-trails` bucket | User shares a trail | Anyone (public gallery) | User deletes it, Delete all data, or account deleted |

**Region:** the Supabase project region is not yet confirmed; this is an open
PDPA gap (s.28, data sent outside Thailand) in `rule.md`.

## 4. Consent

- **Backup:** off by default. Turning it on records a consent row with the
  consent text version and time. Turning it off withdraws consent and deletes
  the backup.
- **Research participants:** consent was asked before every interview and
  test session ([interviews.md](../requirement/interviews.md),
  [session-logs.md](../test/uat/session-logs.md)).

## 5. Project research data

| Source | Type | Permission | Stored as |
|---|---|---|---|
| Discover interviews (I1-I6), 2/11/2026 | REAL, online survey via social app | Consent given by all six | [interviews.md](../requirement/interviews.md), codes only, no names |
| Test sessions (U01-U06), 2-3/11/2026 | REAL, in person and video call | Consent given by all six | [session-logs.md](../test/uat/session-logs.md), codes only |
| SUS answers | REAL, online form | Collected with the test | [sus.csv](../test/uat/sus.csv) |
| Published research and reports | SECONDARY, public | Public sources, cited with links | [no-real-user-test.md](../test/no-real-user-test.md#25-secondary-evidence) |

Participants were asked to type made-up text only. Names and contact details
are not stored in this repository.

## 6. Data the app does not collect

No advertising IDs, no analytics or tracking SDKs, no diagnosis or risk
scores, and no wellbeing data sent to any AI service.
