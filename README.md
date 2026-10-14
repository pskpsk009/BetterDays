# BetterDays
MyGrowth (project name: **Better Days Wellbeing Companion**) is a mobile-first Expo app for students and young adults. It helps people reflect on everyday routines, notice patterns, and try small, practical actions that support their wellbeing.

> **Prototype.** MyGrowth is a habit-support tool. It does not diagnose mental-health conditions, replace therapy, provide medical treatment, or decide whether someone is safe. Activities keep their state on the device and nothing is saved, except trail images that a user chooses to upload.

## Features

The app has five tabs.

| Tab | What it does |
|---|---|
| **Home** | An interactive figure. Tap the head, body, or legs to open Mind, Body, or Trail. |
| **Mind** | Two sections, switched at the top: **Mental Wellness** and **Emotional Wellness**. |
| **Body** | Fuel Your Body, Movement & Flexibility, and Good Night Sleep. |
| **Trail** | Draws a walking trail using outdoor GPS or indoor motion sensors. You can pause and resume, save a trail image, and browse public trails. |
| **Progress** | A Mind-and-Body Growth Tree with overview, Mind detail, and Body detail views. It runs on clearly labelled **demo data**. |

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
- **Good Night Sleep:** Relaxing Bedtime Routine, Improve the Sleep Environment, Personalized Sleep Plan, Sleep Schedule Guidance

## Getting started

### Requirements

- Node.js 20 or later
- The [Expo Go](https://expo.dev/go) app on a phone, or an Android emulator or iOS simulator

### 1. Install dependencies

```bash
npm install
```

### 2. Add Supabase keys

The app creates a Supabase client at startup, so it needs these two values even if you never save a trail. Create a file called `.env.local` in the project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

`.env.local` is gitignored. Never commit real keys.

Saving and browsing trails requires the following in your Supabase project:
- **Anonymous sign-ins** enabled.
- A storage bucket named **`public-trails`**.

### 3. Start the app

```bash
npx expo start --lan
```

Scan the QR code with Expo Go, or press `a` (Android) or `i` (iOS) to open an emulator.

Live GPS, the indoor motion sensors, and the map only work on a real phone. The web build shows a placeholder for the map.

## Checks

Run these before you commit:

```bash
npx tsc --noEmit   # type check
npx expo lint      # lint
```

Then test the screens you changed in Expo Go.

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
  supabase/schema.sql        Draft schema for future grounding-session storage (not used yet)
.docs/                       Requirements, design documents, work logs
```

### How the Mind and Body tabs work

- **Content is kept apart from rendering.** Branch titles, colors, and activity lists live in `branches.ts` files (`mental/`, `emotional/`, `body/`). Screens map each activity ID to a component.
- **One shared navigator.** `BranchExplorer` provides the branch → activity navigation for every section, including Android's back button.
- **Most new activities are content files.** They configure templates from `common/GuidedActivities.tsx`: reflection journal, choice explorer, small step picker, and scenario practice.

### Progress page data

`frontend/components/progress/useProgressData.ts` is the only data seam. Today it returns demo data from `mockData.ts`. To show real data, replace it with Supabase queries that return the same `ProgressDataset` shape (see `types.ts`). The calculations in `progressMath.ts` and `progressSummary.ts` are pure functions that work on either.

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

[Expo](https://expo.dev) SDK 57, Expo Router, React Native, TypeScript, react-native-svg, Reanimated, expo-location, expo-sensors, react-native-maps, and Supabase (storage and anonymous auth for trails).
