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

- Profiles are descriptive habit-support labels, never diagnoses or clinical risk categories.
- Safety concerns must never be hidden by an average or weighted score.
- Recommendations must be small, practical, respectful, and non-clinical.
- The daily check-in target is under two minutes.
- Wellbeing data is sensitive personal information and must be minimized and protected.
- Community stories require moderation, reporting, and clear community rules.
- AI recommendations are optional future work and must not be used for diagnosis or crisis assessment.
- The app must provide professional-support and crisis-resource information when appropriate.

## Repository conventions

- `frontend/` is the canonical user interface.
- `backend/api/` is the canonical API when a backend feature is required.
- Keep scoring logic deterministic and covered by focused tests.
- Keep privacy, consent, safety, and deletion behavior testable.
- Use the Better Days project charter and `rule.md` as the product and compliance sources of truth.
- Do not invent clinical claims, user quotes, advisor approval, or validation results.

## Required validation

Before release, verify:

- onboarding answers calculate the expected focus-area and weighted scores;
- profiles use multiple focus areas and remain neutral;
- serious-concern responses trigger separate support messaging;
- daily check-ins can be completed in under two minutes;
- users can view, export, and delete their personal data;
- stories cannot be published without moderation;
- at least three real target users test the product;
- a qualified wellbeing advisor reviews questionnaire wording, scoring, recommendations, and safety copy.
