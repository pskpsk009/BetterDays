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

- Home screen with exactly three interactive SVG zones: Head, Torso/Body, Legs.
- Mental Development screen with Focus & Attention, Learning & Memory, Emotional Wellbeing, and Mindfulness & Habits.
- Body Functions screen with Sleep, Nutrition, Energy, Physical Activity, and Health.
- Movement Trail screen with simulated points, trail drawing, distance, duration, movement count, start, stop, and clear actions.
- Native bottom tabs for Home, Mind, Body, and Trail.

Do not add unrelated product areas or a desktop website without an explicit scope decision.

## Repository structure

```text
frontend/
  components/                 # shared native MyGrowth UI
  screens/                    # Home, Mind, Body, and Trail implementations
backend/
  README.md                  # placeholder until API and persistence are approved
src/app/
  _layout.tsx                 # Expo Router tab layout
  index.tsx                   # route wrapper for frontend/screens/home.tsx
  mental.tsx                  # route wrapper for frontend/screens/mental.tsx
  body.tsx                    # route wrapper for frontend/screens/body.tsx
  trail.tsx                   # route wrapper for frontend/screens/trail.tsx
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

Also verify the changed flow in Expo Go on a physical device or emulator. For user-facing changes, check the Home, Mind, Body, and Trail routes as applicable.
