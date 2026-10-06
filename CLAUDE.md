<<<<<<< HEAD
@AGENTS.md
=======
# CLAUDE.md

## Project

**Better Days Wellbeing Companion** is a private digital wellbeing platform for students and young adults. It helps users reflect on daily habits, understand patterns across sleep, stress, connection, enjoyable activity, and work or study balance, and choose small practical actions.

The product is a wellbeing support tool. It does not diagnose mental-health conditions, replace therapy, or provide medical treatment.

## Product workflow

1. A user accepts the privacy and wellbeing limitations.
2. The user completes a 10 to 15-question onboarding questionnaire.
3. The system calculates separate focus-area scores and a weighted overall score.
4. The system presents one neutral progress profile: Starting Point, Building Habits, or Maintaining Progress.
5. The user completes short daily check-ins.
6. The system displays small recommendations based on the lowest-scoring focus areas.
7. The user reviews a weekly progress summary and may write private reflections.
8. Safety support is shown separately whenever an answer indicates serious concern.

## Product guardrails


## Repository conventions


## Required validation

Before release, verify:

>>>>>>> origin/main
## Better Days / MyGrowth

This repository contains the Expo Go mobile frontend for the Better Days wellbeing companion, currently branded as MyGrowth.

## Project structure

- `frontend/` contains the canonical native screen implementations and shared mobile UI.
- `src/app/` contains the Expo Router route entry points.
- `backend/` is a placeholder for future API and persistence work.
- `rule.md` and the Better Days project charter are product and compliance sources of truth when present.

## Mobile conventions

- Use Expo Router for navigation and keep route wrappers in `src/app/`.
- Keep screen implementations in `frontend/screens/` and shared native UI in `frontend/components/`.
- Validate with `npx tsc --noEmit` and test in Expo Go before release.
