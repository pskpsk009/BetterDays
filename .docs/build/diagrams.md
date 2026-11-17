# Build - Diagrams

UML views of MyGrowth as built (commit `e1a35f4`). For how the parts connect,
see [architecture.md](architecture.md). The planned versions from the design
phase are in [design/diagrams/](../design/diagrams/).

1. [Use case](#1-use-case)
2. [Activity](#2-activity)
3. [Sequence](#3-sequence)
4. [Entity-relationship](#4-entity-relationship)

---

## 1. Use case

Three kinds of user. A **guest** has no account. A **signed-in user** has an
email + password account and can do everything a guest can, plus backup and
account actions. Anyone can browse public trails.

```mermaid
flowchart LR
  Guest((Guest<br/>no account))
  Member((Signed-in user))
  Supa[[Supabase<br/>Auth · Postgres · Storage]]

  subgraph App[MyGrowth app]
    UC1([Read welcome notice and pick focus needs])
    UC2([Tap head / body / legs to open Mind, Body, Trail])
    UC3([Find an activity by need])
    UC4([Do a Mind or Body activity])
    UC5([Save and delete activity data on the phone])
    UC6([Track a walk: outdoor GPS or indoor sensors])
    UC7([Share trail image to public gallery])
    UC8([Browse public trails])
    UC9([View Progress: my data or demo])
    UC10([Read privacy summary])
    UC11([Export my data])
    UC12([Delete all my data])
    UC13([Create account / sign in / reset password])
    UC14([Turn backup on or off])
    UC15([Sync backup across devices])
    UC16([Delete account])
  end

  Guest --> UC1 & UC2 & UC3 & UC4 & UC5 & UC6 & UC7 & UC8 & UC9 & UC10 & UC11 & UC12 & UC13
  Member --> UC14 & UC15 & UC16
  Member -.->|"inherits all guest use cases"| Guest

  UC7 -.->|"«include» anonymous sign-in"| Supa
  UC8 --> Supa
  UC13 --> Supa
  UC14 -.->|"«include» record consent"| Supa
  UC15 --> Supa
  UC12 -.->|"«extend» if a session exists"| Supa
  UC16 -.->|"«include» delete all data"| UC12
```

| Use case | Code entry point | Rule |
| --- | --- | --- |
| UC1 | `home/Welcome.tsx` | LR1, LR8 |
| UC2, UC3 | `screens/home.tsx`, `home/NeedFinder.tsx` | LR5 (support line text) |
| UC4, UC5 | `common/BranchExplorer.tsx`, `common/localStore.ts` | LR2, LR3 |
| UC6, UC7 | `screens/trail.tsx`, `trail/saveTrailImage.ts` | LR4 |
| UC8 | `screens/public-trails.tsx` | - |
| UC9 | `screens/progress.tsx`, `progress/useProgressData.ts` | LR8 (demo label) |
| UC10-UC12, UC16 | `profile/ProfileSheet.tsx`, `profile/deleteAllData.ts` | LR3, LR6 |
| UC13 | `auth/AuthProvider.tsx`, `auth/AuthSheet.tsx` | LR4 |
| UC14, UC15 | `sync/BackupProvider.tsx`, `sync/cloudSync.ts` | LR1, LR6, LR7 |

---

## 2. Activity

### 2a. Doing an activity

From opening the app to the activity showing up on Progress.

```mermaid
flowchart TD
  Start([Open app]) --> First{First visit or<br/>notice version changed?}
  First -->|Yes| Welcome[Show welcome notice<br/>and pick focus needs]
  Welcome --> SaveW[(Save 'welcome' on phone)]
  SaveW --> Home
  First -->|No| Home[Home: figure + need finder]

  Home --> How{How does the user<br/>choose?}
  How -->|Tap head| Mind[Mind tab]
  How -->|Tap body| Body[Body tab]
  How -->|Tap legs| Trail([Trail: see 2b])
  How -->|Pick a need| Need[Show 3 suggested activities]
  Need --> Open

  Mind --> Section{Mental or<br/>Emotional?}
  Section --> Branch[Pick a branch]
  Body --> Branch
  Branch --> Open[Open activity]

  Open --> Do[Do the activity]
  Do --> Keeps{Activity remembers<br/>what was added?}
  Keeps -->|"Yes: Support Circle, Values Compass,<br/>Skills, Sleep"| SaveA[(Save on phone)]
  Keeps -->|No| Forget[Entries cleared when closed]
  SaveA --> Done
  Forget --> Done{Finished?}
  Done -->|No, left early| Back[Back to activity list]
  Done -->|Yes| Log[(Add to activity log:<br/>activity id, day, minutes)]
  Log --> Backup{Signed in and<br/>backup on?}
  Backup -->|Yes| Push[Upload changed key after 2 s]
  Backup -->|No| Local[Stays on phone only]
  Push --> Prog
  Local --> Prog[Progress tab re-reads<br/>the log and updates the Growth Tree]
  Back --> Branch
  Prog --> End([End])
```

### 2b. Trail session

```mermaid
flowchart TD
  S([Open Trail]) --> Mode{Mode?}
  Mode -->|Outdoor| Perm{Location<br/>permission?}
  Perm -->|Denied| S
  Perm -->|Granted| GPS[Watch GPS every 1 s / 2 m]
  Mode -->|Indoor| Sens[Start accelerometer,<br/>magnetometer, pedometer]

  GPS --> Fix{Accuracy ≤ 25 m?}
  Fix -->|No| GPS
  Fix -->|Yes| Draw[Add point to trail]
  Sens --> Step{Step detected?}
  Step -->|No| Sens
  Step -->|Yes| DrawI[Move one step in heading direction]

  Draw --> Ctrl
  DrawI --> Ctrl{User action}
  Ctrl -->|Keep walking| Mode
  Ctrl -->|Pause| Paused[Stop drawing, keep live position]
  Paused -->|Resume| NewSeg[Start a new segment] --> Mode
  Ctrl -->|Stop| Ask{Save this trail?}
  Ask -->|Cancel| Ctrl
  Ask -->|Discard| Clear[Stop tracking, nothing saved]
  Ask -->|Save| Build[Build SVG of the trail]
  Build --> Up[Upload to public gallery<br/>see sequence 3b]
  Up --> OK{Upload worked?}
  OK -->|Yes| Saved[Show 'Trail saved']
  OK -->|No| Err[Show 'Could not save trail']
  Clear --> E([End])
  Saved --> E
  Err --> Ctrl
```

---

## 3. Sequence

### 3a. Turn on backup, then sync

```mermaid
sequenceDiagram
  autonumber
  actor U as Signed-in user
  participant P as ProfileSheet
  participant B as BackupProvider
  participant C as cloudSync
  participant L as localStore (phone)
  participant DB as Supabase Postgres

  U->>P: Tap "Turn on backup"
  P->>B: turnOn()
  B->>C: giveBackupConsent()
  C->>DB: insert consents (purpose=backup, version=1)
  Note over DB: RLS: real user only.<br/>Trigger writes audit_events 'backup_on'
  DB-->>C: ok
  B->>C: syncAll(userId)
  C->>DB: select key, value, updated_at from user_data
  DB-->>C: remote rows
  loop each of the 6 store keys
    C->>L: changedAt(key), readRaw(key)
    alt remote copy is newer
      C->>L: applyRemote(key, value, time)
      L-->>L: screens using the key reload
    else phone copy is newer
      C->>DB: upsert user_data (user_id, key, value, updated_at)
      Note over DB: RLS: needs active backup consent.<br/>Value ≤ 64 KB
    else deleted on phone more recently
      C->>DB: delete user_data row
    end
  end
  C-->>B: done
  B-->>P: status "on", lastSynced
  P-->>U: Backup is on

  Note over U,DB: Later: the user finishes an activity
  L-)B: change event for "activity-log"
  B->>B: wait 2 s (merges bursts of taps)
  B->>C: pushKey(userId, "activity-log")
  C->>DB: upsert user_data
```

### 3b. Share a trail to the public gallery

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant T as Trail screen
  participant S as buildTrailSvg
  participant Up as uploadTrailImage
  participant A as Supabase Auth
  participant St as Storage (public-trails)
  participant DB as Postgres (public_trails)

  U->>T: Stop → "Save"
  T->>S: build SVG (mode, points, breaks)
  S-->>T: svg text
  T->>Up: uploadTrailImage(svg, mode, distance)
  Up->>A: getUser()
  alt no session
    Up->>A: signInAnonymously()
    A-->>Up: anonymous user
  end
  Up->>St: upload "<userId>/<time>.svg"
  Note over St: Policy: folder must equal auth.uid().<br/>≤ 512 KB, SVG or JPEG only
  St-->>Up: ok
  Up->>DB: insert (user_id, image_path, mode, distance_m)
  alt insert fails
    Up->>St: remove image (no orphan files)
    Up-->>T: error
    T-->>U: "Could not save trail"
  else insert ok
    DB-->>Up: trail id
    Up-->>T: path, trail id
    T->>T: stop tracking
    T-->>U: "Trail saved"
  end
```

### 3c. Delete account

```mermaid
sequenceDiagram
  autonumber
  actor U as Signed-in user
  participant P as ProfileSheet
  participant D as deleteAllData
  participant L as localStore (phone)
  participant St as Storage
  participant DB as Postgres
  participant A as Supabase Auth

  U->>P: Confirm "Delete account"
  P->>D: deleteAccount()
  D->>L: clearAllSaved()
  Note over L: Removes all 6 keys, records<br/>deletion time so sync can't restore them
  D->>St: list + remove files in "<userId>/"
  D->>DB: delete public_trails where user_id
  D->>DB: delete user_data where user_id
  D->>DB: insert audit_events 'data_deleted'
  D->>DB: rpc delete_my_account()
  Note over DB: Writes audit 'account_deleted', deletes auth user.<br/>Cascades remove consents and any leftover rows
  DB-->>D: ok
  D->>A: signOut(scope: local)
  D-->>P: done
  P-->>U: Account deleted
```

---

## 4. Entity-relationship

Server tables come from `backend/supabase/schema.sql` and `backup.sql`. The
on-device store is shown too, because most data lives there and `user_data` is
a copy of it.

```mermaid
erDiagram
  AUTH_USERS ||--o{ CONSENTS : gives
  AUTH_USERS ||--o{ USER_DATA : "backs up (max 6 rows)"
  AUTH_USERS ||--o{ PUBLIC_TRAILS : publishes
  AUTH_USERS ||--o{ TRAIL_IMAGES : "owns folder"
  PUBLIC_TRAILS ||--|| TRAIL_IMAGES : "image_path points to"
  AUTH_USERS |o..o{ AUDIT_EVENTS : "logged for (no FK)"
  DEVICE_STORE ||..o| USER_DATA : "mirrored when backup is on"

  AUTH_USERS {
    uuid id PK
    text email
    bool is_anonymous
  }
  CONSENTS {
    uuid id PK
    uuid user_id FK
    text purpose "only 'backup'"
    smallint version
    timestamptz accepted_at
    timestamptz withdrawn_at "null = active"
  }
  USER_DATA {
    uuid user_id PK,FK
    text key PK "one of the 6 store keys"
    jsonb value "≤ 64 KB"
    timestamptz updated_at "set by device, newest wins"
  }
  AUDIT_EVENTS {
    bigint id PK
    uuid user_id "kept after account deletion"
    text action "backup_on | backup_off | export | data_deleted | account_deleted"
    timestamptz created_at "purged after 180 days"
  }
  PUBLIC_TRAILS {
    uuid id PK
    uuid user_id FK
    text image_path
    text mode "indoor | outdoor"
    numeric distance_m
    timestamptz created_at
  }
  TRAIL_IMAGES {
    text name PK "storage object: userId/time.svg"
    text bucket_id "public-trails"
  }
  DEVICE_STORE {
    text key PK "mygrowth:<key>"
    json value
    number changed_at "in mygrowth:meta"
  }
```

**Device store keys:** `support-circle`, `values-compass`, `skills`, `sleep`,
`welcome`, `activity-log`. The same list is enforced by a check constraint on
`user_data.key`.

**Access rules (RLS):** users read and change only their own `consents`,
`user_data`, and trail rows. Writes to `user_data` also need an active backup
consent and a non-anonymous user. `audit_events` is insert-only, with no reads
through the API. Anyone can read `public_trails` and the trail images.

**Not shown:** `grounding_sessions` and `grounding_answers` are still in
`schema.sql` but the app no longer writes to them.
