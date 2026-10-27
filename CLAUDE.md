# CLAUDE.md

Project context for Claude Code. Loaded automatically at the start of every session.

## Project

**MyGrowth / Better Days Wellbeing Companion** is a mobile-first Expo Go application for students and young adults. It helps users reflect on everyday routines, notice patterns, and choose small practical actions that support wellbeing.

The current implementation is a native Expo prototype. It does not diagnose mental-health conditions, replace therapy, provide medical treatment, or determine whether a user is safe.

Product source of truth: [Better_Days_Project_Charter.md](Better_Days_Project_Charter.md).
Privacy, safety, and compliance source of truth: [rule.md](rule.md).

## Current product workflow

1. A user opens the MyGrowth home screen.
2. The user taps the head, body, or legs of the interactive figure.
3. The app opens Mental Development, Body Functions, or Movement Trail.
4. The user reviews small wellness areas and progress indicators.
5. The user can run a simulated movement session while the real GPS and motion integration remains future work.
6. Future phases may add onboarding, daily check-ins, neutral progress profiles, recommendations, reflections, safety support, and data management.

## Product guardrails

- Profiles and progress labels are descriptive habit-support labels, never diagnoses or clinical risk categories.
- Safety concerns must never be hidden by an average or weighted score.
- Recommendations must be small, practical, respectful, optional, and non-clinical.
- The product must not provide medication instructions, treatment plans, crisis counselling, or autonomous safety decisions.
- Wellbeing data must be minimized, protected, access-controlled, exportable, and deletable.
- Community stories, if added, require moderation, reporting, removal, and appeal workflows.
- AI recommendations are future functionality only and require separate privacy and safety review.
- Do not invent user research, interview quotes, advisor approval, legal claims, clinical evidence, or validation outcomes.

## Legal and compliance rules

When writing a requirement, design, or implementation plan, fold the following into the relevant artifact as numbered legal requirements rather than treating `rule.md` as background-only:

- **LR1 - Privacy and consent:** Explain collection, purpose, retention, access, and deletion before processing sensitive wellbeing data. Store consent text version, timestamp, and withdrawal status.
- **LR2 - Data minimization:** Use wellbeing data only for approved reflection, habit support, safety messaging, account operation, or moderation. Do not use it for advertising, resale, diagnosis, or unrelated profiling.
- **LR3 - User rights:** Provide controlled access, correction, export, consent withdrawal, and permanent deletion. Private journal content belongs in export and deletion workflows.
- **LR4 - Access control:** A user must not access another user's check-ins, profiles, journals, consent records, exports, or audit metadata.
- **LR5 - Safety:** Serious-concern responses require separate supportive messaging and professional-support or crisis-resource information. Never convert them into a diagnosis or hide them in an overall score.
- **LR6 - Audit records:** Log relevant authentication, access, creation, correction, export, consent, moderation, and deletion events. Retain required access or traffic logs for at least 90 days where applicable.
- **LR7 - Electronic records:** Keep retrievable records for terms, disclaimers, consent, withdrawal, export, deletion requests, and future AI generations where applicable.
- **LR8 - Claims:** Do not claim certification, professional approval, clinical validation, medical benefit, or regulatory approval unless it is real, documented, and authorized.

## Scope

The current mobile prototype includes:

- Home screen with exactly three interactive SVG zones: Head, Torso/Body, Legs, plus a "What do you need right now?" finder (`frontend/components/home/needs.ts`) that maps eight everyday needs to three activities each and opens them directly via `?open=<activityId>&t=<timestamp>` on the Mind or Body route. Suggestions only, never an assessment.
- First-open welcome (`frontend/components/home/Welcome.tsx`): three skippable screens (what the app is, how data is handled, optional "what would you like help with?" picks that order the finder). The seen date, notice version, and picks are saved on the device; the Home "i" button reopens it.
- Mind tab with two sections, switched at the top of the branch list. Activities use local component state, with no progress tracking or analytics. Three Mind activities remember data between visits, on the device only, through `frontend/components/common/localStore.ts` (`expo-sqlite` key-value store on native, `localStorage` on web): My Support Circle, Values Compass, and Develop Your Skill. Each shows what is saved and offers a confirmed delete (`SavedOnDeviceNote`). Nothing leaves the device unless a signed-in user turns on account backup.
  - Mental Wellness (five branches): Self-Acceptance (Letter to My Past Self, Lessons Not Labels, My Strengths Garden); Discover Your Joy (Joy Explorer, Develop Your Skill, Little Moments Journal); Purpose in Life (Values Compass, Future Me, One Small Step); Live the Life (Breathing Bubble, 5-Senses Grounding, Watch Your Thoughts); Find Your Focus (Focus Sprint, Target Tap, Distraction Tracker).
  - Emotional Wellness (four branches): Stand Up Again (My Next Step, Plan B, My Support Circle); Self-Awareness (Emotion Explorer, Reflection Detective, What Can I Control?); Self-Control (Pause Before Reacting, Calm-Down Toolkit, Choose Your Response); Social Creatures (Conversation Builder, Walk in Their Shoes, Healthy Boundaries).
  - Branch content lives in `frontend/components/mental/branches.ts` and `frontend/components/emotional/branches.ts`; content-driven activities use the templates in `frontend/components/common/GuidedActivities.tsx`.
- Body Functions screen with a single flat list of four activities (no branches): Hydration Check-in, Build a Balanced Plate, Daily Stretch, and Sleep Schedule Guidance (shared 24-hour scrollable TimePicker, followed by the Improve the Sleep Environment tips). Sleep Schedule Guidance saves on the device (`localStore` key `sleep`): target bedtime (with gradual steps the user advances), target wake time, an on-schedule window of ±30 min or ±1 h, and one morning log per day of actual bed and wake times, each storing the targets and window it was checked against; logs older than 180 days are trimmed. It shows the last 7 nights and first week vs last 7 days of nights on schedule (`sleepSchedule.ts`). The other Body activities use local component state only. Cards reuse the Mind tab's `BranchCard` with SVG icons from `frontend/components/body/BodyActivityIcon.tsx` and a per-activity palette defined in `frontend/screens/body.tsx`; `frontend/components/body/branches.ts` still supplies the Progress screen's grouping.
- Optional Supabase email + password accounts (`frontend/components/auth/`): sign up, sign in, sign out, and password reset by emailed code. The Home header has a single Profile button (`frontend/components/profile/ProfileSheet.tsx`): account and sign-in, change password, sign out, plain-language privacy rules (`privacyRules.ts`, kept in step with `rule.md` and real behaviour), show the welcome again, Back up to my account, Download my data (JSON via the share sheet), Delete all data (`deleteAllData.ts`: every on-device key via `clearAllSaved`, the backup copy, and the session's shared trail images and rows), and Delete account (`delete_my_account` RPC). The session persists on the device (`src/lib/supabase.ts`). Anonymous Supabase sessions (used by Trail sharing) are not treated as signed in. Sign out asks whether to keep the on-device data or remove it (`forgetOnThisDevice`: clears local keys without recording a deletion, so the account backup is untouched and restores on next sign-in); pending backup uploads are flushed first.
- Optional account backup (`frontend/components/sync/`, schema in `backend/supabase/backup.sql`): off by default; turning it on records a versioned consent row. It mirrors the five `localStore` keys as one `user_data` row each (newest copy wins per key, using per-key change times kept on the device), uploads about 2 s after a change, and fully re-syncs on sign-in and on returning to the foreground at most every 5 minutes. The database only accepts backup writes from non-anonymous users with active consent; withdrawing consent deletes the backup in a trigger. `audit_events` records backup on/off, export, data deletion, and account deletion (insert-only, purged after 180 days). Free-plan limits: values are capped at 64 KB per row and trail uploads at 512 KB (SVG or JPEG).
- Movement Trail screen with simulated points, trail drawing, distance, duration, movement count, start, stop, and clear actions.
- Progress screen with a Mind-and-Body Growth Tree (two equal halves; equal importance, never a score) and three states: overview (`selectedArea = null`), Mind detail, and Body detail. It runs on frontend-only, clearly labelled demo data with an empty new-user preview; Supabase is not connected. The data seam is `frontend/components/progress/useProgressData.ts`.
- Native bottom tabs for Home, Mind, Body, Trail, and Progress (Android allows at most five tabs, so new sections go inside an existing tab).

Do not add unrelated product areas or a desktop website without an explicit scope decision.

## Repository structure

```text
frontend/
  components/                 # shared native MyGrowth UI
  screens/                    # Home, Mind, Body, Trail, and Progress implementations
backend/
  README.md                  # placeholder until API and persistence are approved
src/app/
  _layout.tsx                 # Expo Router tab layout
  index.tsx                   # route wrapper for frontend/screens/home.tsx
  mental.tsx                  # route wrapper for frontend/screens/mental.tsx
  body.tsx                    # route wrapper for frontend/screens/body.tsx
  trail.tsx                   # route wrapper for frontend/screens/trail.tsx
  progress.tsx                # route wrapper for frontend/screens/progress.tsx
.docs/
  design/                     # product design artifacts
  requirement/                # backlog, specs, and work logs
```

## Navigation and mobile conventions

- Use Expo Router for navigation. Do not add `react-router-dom` to this native app.
- Keep route entry points in `src/app/` and screen implementations in `frontend/screens/`.
- Keep shared native UI in `frontend/components/`.
- Keep the experience portrait-first, touch-first, and usable at 375 to 430 px widths.
- Use Expo-compatible packages and run `npx expo install <package>` for native dependencies.
- Read the matching Expo SDK documentation before changing Expo, React Native, or native-module APIs.
- Do not manually create or edit `ios/` or `android/` directories.
- Real GPS and motion tracking should replace the simulated trail through a clear adapter boundary.

## Working rules

- If a requirement is unclear, ask and offer at least three options. Do not guess about product scope or safety behavior.
- Keep prototype data local until a backend contract, privacy design, and deletion behavior are approved.
- Keep deterministic calculations in pure modules with focused tests.
- Update the relevant requirement, design, and test artifacts when behavior changes.
- Preserve the one source of truth per layer: charter for vision and scope, `rule.md` for compliance, requirements for acceptance criteria, design docs for UX, and code for implementation.
- Commit and push changes under `.claude/`, `.docs/`, `CLAUDE.md`, or `rule.md` after validation.

## Required validation

Before declaring a change complete:

```bash
npx tsc --noEmit
npx expo lint
npx expo start
```

Also verify the changed flow in Expo Go on a physical device or emulator. For user-facing changes, check the Home, Mind, Body, Trail, and Progress routes as applicable.
