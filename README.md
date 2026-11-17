# BetterDays
BetterDyas (project name: **Better Days Wellbeing Companion**) is a mobile-first Expo app for students and young adults. It helps people reflect on everyday routines, notice patterns, and try small, practical actions that support their wellbeing.

> **Prototype.** MyGrowth is a habit-support tool. It does not diagnose mental-health conditions, replace therapy, provide medical treatment, or decide whether someone is safe. Activity data stays on the device. Nothing is sent to a server unless the user signs in and turns on backup, or chooses to share a trail image.

## At a glance

**The problem.** Students and young adults often want to feel better day to day, but advice is vague and their journals, habit trackers, and tips are spread across different apps. They lose motivation and don't notice small improvements.

**The idea.** One calm app that turns wellbeing into small, hands-on activities (breathing, reflection, stretching, sleep planning, walking) grouped by **Mind** and **Body**, with a visual Growth Tree that shows progress without labels or diagnoses.

**What's in the prototype**

- **35+ interactive activities** across 9 Mind branches and 3 Body branches. Examples: an animated breathing bubble, a reaction-time focus game, a balanced-plate builder, and a sleep-schedule calculator.
- **Trail tracker** that draws your walk outdoors with GPS, and indoors with no GPS at all by detecting steps (accelerometer) and direction (magnetometer). Users can save the trail as an image and share it to a public gallery.
- **Growth Tree progress view** built with custom SVG charts, running on demo data behind a single data hook so it can be switched to a real backend.

**Technical highlights**

- **Content separate from UI.** Activities are defined as data (`branches.ts`) and rendered by reusable templates, so most new activities need no new screen code.
- **One shared navigator** (`BranchExplorer`) handles branch → activity flow and Android back for every section.
- **Platform-aware code.** Native and web versions of the tab bar and map (`.native.tsx` / `.web.tsx`), so the app also runs in a browser.
- **Privacy by design.** Accounts are optional and data stays on the phone by default. Account backup is off until the user consents, and the database itself enforces that consent. Users can export their data, delete it, or delete their account.
- **Pure, testable logic.** Progress maths, sleep timing, and game rules live in plain TypeScript files, separate from components.

**What I'd build next:** daily check-ins feeding the Growth Tree, moderation and reporting for the public trail gallery, a dedicated safety-support screen, and automated integration tests for the Supabase access rules.

## Features

The app has five tabs.

| Tab          | What it does                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**     | An interactive figure. Tap the head, body, or legs to open Mind, Body, or Trail.                                                          |
| **Mind**     | Two sections, switched at the top: **Mental Wellness** and **Emotional Wellness**.                                                        |
| **Body**     | Fuel Your Body, Movement & Flexibility, and Good Night Sleep.                                                                             |
| **Trail**    | Draws a walking trail using outdoor GPS or indoor motion sensors. You can pause and resume, save a trail image, and browse public trails. |
| **Progress** | A Mind-and-Body Growth Tree with overview, Mind detail, and Body detail views. It runs on clearly labelled **demo data**.                 |

### Mind tab

Every branch has three activities.

**Mental Wellness**

- **Self-Acceptance:** Letter to My Past Self, Lessons Not Labels, My Strengths Garden
- **Discover Your Joy:** Joy Explorer, Try Something New, Little Moments Journal
- **Purpose in Life:** Values Compass, Future Me, One Small Step
- **Live the Life:** Breathing Bubble, 5-Senses Grounding, Watch Your Thoughts
- **Find Your Focus:** Focus Sprint, Target Tap, Distraction Tracker

**Emotional Wellness**

- **Stand Up Again:** My Next Step, Plan B, My Support Circle
- **Self-Awareness:** Emotion Explorer, Reflection Detective, What Can I Control?
- **Self-Control:** Pause Before Reacting, Calm-Down Toolkit, Choose Your Response
- **Social Creatures:** Conversation Builder, Walk in Their Shoes, Healthy Boundaries

### Body tab

- **Fuel Your Body:** Hydration Check-in, Build a Balanced Plate (five equal 20% slices), Drink Detective
- **Movement & Flexibility:** Daily Stretch, Desk Break, Mobility Flow, Movement Dice, Body Awareness Scan
- **Good Night Sleep:** Relaxing Bedtime Routine, Improve the Sleep Environment, Sleep Schedule Guidance

## Getting started

### Requirements

- Node.js 20 or later (22 LTS recommended)
- A free [Supabase](https://supabase.com) project
- The [Expo Go](https://expo.dev/go) app on a phone, or an Android emulator or iOS simulator

### 1. Get the code and install dependencies

```bash
git clone https://github.com/pskpsk009/BetterDays.git
cd BetterDays
npm install
```

### 2. Add Supabase keys

The app creates a Supabase client at startup, so it won't start without these two values, even if you never sign in or save a trail. Copy the example file and fill in your project's URL and publishable key (Supabase: **Project Settings → API**):

```bash
cp .env.example .env.local
```

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

`.env.local` is gitignored. Never commit real keys, and never use the `service_role` key in the app.

### 3. Set up Supabase (once per project)

1. In the Supabase **SQL editor**, run [backend/supabase/schema.sql](backend/supabase/schema.sql), then [backend/supabase/backup.sql](backend/supabase/backup.sql). Both are safe to run again. Together they create:
   - the public trail gallery table and the `public-trails` storage bucket
   - account backup, consent, and audit tables, plus the delete-account function
   - row-level security on every table
2. Under **Authentication → Sign In / Providers**, turn on **Email** and **Anonymous sign-ins**. Trail sharing uses an anonymous sign-in when nobody is logged in.
3. Under **Authentication → Emails → Reset password**, make sure the template shows the code `{{ .Token }}`. The app asks for a code, not a link.
4. Optional: turn off **Confirm email** while testing, so new accounts can sign in straight away.
5. Optional: to purge audit rows weekly, enable `pg_cron` and run the `cron.schedule` line at the end of `backup.sql`.

### 4. Start the app

```bash
npx expo start --lan
```

Scan the QR code with Expo Go, or press `a` (Android) or `i` (iOS) to open an emulator. If your phone can't reach your computer on the network, use `npx expo start --tunnel`.

Live GPS, the indoor motion sensors, and the map only work on a real phone. The web build (`npx expo start --web`) shows a placeholder for the map.

### Test account

**No account is needed.** Everything in the app works without signing in: Home, Mind, Body, Trail, Progress, **Download my data**, and **Delete all data**. Data stays on the phone.

An account is optional and only adds: **Back up to my account**, change password, sign out, and **Delete account**. There is no shared reviewer account, because a password must never be stored in this public repository.

**To test the optional account features, create your own:** open the app, tap the profile button on Home, choose **Sign in or create an account**, then **Create account**, and use any email you can receive mail at. If **Confirm email** is on, click the link in the email first. You can also add a user in Supabase under **Authentication → Users → Add user** (tick "Auto Confirm User").

Use made-up text only. Never type real feelings or personal history into a test account. When you're done, use **Profile → Delete all data** (or **Delete account**) to clean up.

## Checks

Run these before you commit:

```bash
npx tsc --noEmit   # type check
npx expo lint      # lint
npm test           # unit tests (tests/unit/, node:test + tsx)
```

Then test the screens you changed in Expo Go.

If `tsc` reports that a route such as `"/progress"` is not assignable, run `npx expo start` once. That regenerates the route types in `.expo/types`.

## Project structure

```text
src/app/                     Expo Router routes (thin wrappers around frontend/screens)
src/components/app-tabs*.tsx Bottom tabs (native and web)
frontend/
  screens/                   Home, Mind, Body, Trail, Progress, public trails
  components/
    common/                  App shell, shared activity UI, BranchExplorer,
                             GuidedActivities (reusable activity templates)
    mental/                  Mental Wellness branches, icons, activities
    emotional/               Emotional Wellness branches, icons, activities
    body/                    Body branches and activities
    trail/                   GPS and motion trackers, map, trail drawing, upload
    progress/                Growth Tree, charts, demo data, pure calculations
backend/
  supabase/schema.sql        Trail gallery table, storage bucket, row-level security
  supabase/backup.sql        Account backup, consent, audit log, delete-account function
tests/unit/                  Unit tests for the pure logic modules (npm test)
.docs/                       Requirements, design documents, work logs
```

### How the Mind and Body tabs work

- **Content is kept apart from rendering.** Branch titles, colors, and activity lists live in `branches.ts` files (`mental/`, `emotional/`, `body/`). Screens map each activity ID to a component.
- **One shared navigator.** `BranchExplorer` provides the branch → activity navigation for every section, including Android's back button.
- **Most new activities are content files.** They configure templates from `common/GuidedActivities.tsx`: reflection journal, choice explorer, small step picker, and scenario practice.

### Progress page data

`frontend/components/progress/useProgressData.ts` is the only data seam. It builds the page from the activity log and sleep logs saved on the device, or from the labelled demo data in `mockData.ts`. Both return the same `ProgressDataset` shape (see `types.ts`). The calculations in `progressMath.ts` and `progressSummary.ts` are pure functions that work on either.

## Product and privacy rules

Read these before changing features:

- [Better_Days_Project_Charter.md](Better_Days_Project_Charter.md): vision and scope
- [rule.md](rule.md): privacy, safety, and compliance
- [CLAUDE.md](CLAUDE.md): working rules for the codebase

In short:

- Labels describe habits; they never diagnose.
- Safety concerns are never hidden in a score.
- Recommendations stay small, optional, and non-clinical.
- Wellbeing data must stay minimal, access-controlled, exportable, and deletable before any persistence is added.

## Built with

[Expo](https://expo.dev) SDK 58, Expo Router, React Native, TypeScript, react-native-svg, Reanimated, expo-location, expo-sensors, react-native-maps, and Supabase (auth, Postgres with row-level security, storage).
