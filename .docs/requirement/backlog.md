# Backlog - Better Days Wellbeing Companion

Prioritized by MoSCoW. Every row traces to a requirement ID, a charter goal,
a research pain, or a privacy and safety rule. Source of truth:
`Better_Days_Project_Charter.md`, `CLAUDE.md`, and `rule.md`.

Pains, updated from six real user interviews on 13/11/2026
(`.docs/requirement/interviews.md`). A pain is confirmed when at least 3 of 6
participants mention it.

| Pain | Description | Evidence | Status |
|---|---|---|---|
| **P1** | Lack of self-awareness about patterns across sleep, stress, connection, activity, and daily functioning | 2/6 (I2, I3) | Weak. Half already link good days to enough sleep |
| **P2** | Unclear next steps because general wellbeing advice is too broad or difficult to apply | 3/6 (I1, I3, I4) | Confirmed. Clear step-by-step advice worked (I6) |
| **P3** | No tracking habit: people have never used an app, journal, or notes to track sleep, mood, or habits, so tracking must be quick and easy to start | 6/6 had never tracked | Confirmed (reworded; the old "kept in separate places" was not supported, 0/6) |
| **P4** | Poor or irregular sleep that affects stress and energy | 6/6 | Confirmed, strongest pain |
| **P5** | Hard to stay consistent with healthy habits over time | 4/6 (I1, I3, I4, I6) | Confirmed |
| **P6** | Worry that personal or sensitive data could leak | 4/6 (I1, I4, I5, I6) | Confirmed |
| P7 | Expect wellbeing apps to cost money | 1/6 (I5) | Not confirmed; noted |

## Must

| #   | Item                                                                                                                    | Traces to               |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| B1  | Account creation with clear privacy and wellbeing limitations before data collection                                    | F1, P1, Privacy rule, P6    |
| B2  | Explicit consent record with user, timestamp, accepted text version, and withdrawal status                              | F1, Safety/Privacy rule, P6 |
| B3  | 10 to 15-question onboarding questionnaire using a 1-to-5 rating scale                                                  | F2, P1                  |
| B4  | Questionnaire covers sleep, stress, connection, enjoyable activity, work/study balance, and functioning                 | F2, P1                  |
| B5  | Deterministic focus-area scores for the approved wellbeing areas                                                        | F3, P1                  |
| B6  | Weighted overall score using documented weights and repeatable calculation                                              | F3, P1                  |
| B7  | Neutral profile: Starting Point, Building Habits, or Maintaining Progress                                               | F3, P1, Safety rule     |
| B8  | Display individual focus-area scores as well as the overall result                                                      | F3, P1                  |
| B9  | Profile language clearly states that it is not a diagnosis or clinical assessment                                       | F3, Safety rule         |
| B10 | Serious-concern responses handled separately from the weighted profile                                                  | F3, F8, Safety rule     |
| B11 | Daily check-in for mood, sleep, stress, connection, activity, and work/study balance                                    | F4, P3, P5                  |
| B12 | Daily check-in target of under two minutes with optional notes                                                          | F4, P3, P5                  |
| B13 | One or two practical recommendations linked to lower-scoring focus areas                                                | F5, P2 (clear steps)                  |
| B14 | Recommendations remain non-clinical and do not provide medication or treatment advice                                   | F5, Safety rule         |
| B15 | Weekly progress summary with neutral focus-area trends and check-in completion                                          | F6, P1, P3              |
| B16 | Weekly reflection prompt or personal goal for the next week                                                             | F6, F7, P2, P3, P5          |
| B17 | Private journal entries with create, view, edit, and delete behavior                                                    | F7, P3                  |
| B18 | Journal entries remain private and separate from community story submissions                                            | F7, F8, Privacy rule, P6    |
| B19 | Community stories cannot become public before moderation review                                                         | F8, P3, Moderation rule |
| B20 | Reporting and removal workflow for harmful content, dangerous advice, harassment, or exposed personal data              | F8, Moderation rule     |
| B21 | Safety-support information is easy to find from the application                                                         | F9, Safety rule         |
| B22 | Serious-concern support message provides professional and crisis-resource information without claiming to assess safety | F9, Safety rule         |
| B23 | Users can view, export, correct, and permanently delete their personal data                                             | F1, F10, Privacy rule, P6   |
| B24 | User ownership and access control prevent access to another user's check-ins, journal, or profile                       | F1, F10, Privacy rule, P6   |
| B25 | Access, consent, export, moderation, correction, and deletion actions are auditable                                     | F10, Audit rule         |
| B26 | Required access or traffic logs are retained for at least 90 days under applicable rules                                | F10, Audit rule         |
| B27 | No interface language presents Better Days as a diagnosis, treatment service, or crisis assessor                        | F3, F5, F9, Safety rule |
| B43 | Sleep Schedule Guidance: target bedtime and wake time, gradual steps, one morning log per day, and nights on schedule (built) | P4, P5, P3 |

## Should

| #   | Item                                                                                                                  | Traces to                            |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| B28 | User can mark a recommendation completed, skipped, or saved for later                                                 | F5, P2, P3                           |
| B29 | User can set, edit, and review personal wellbeing goals                                                               | F6, F7, P2, P3                       |
| B30 | User can edit or delete submitted story content before moderation decision                                            | F8, P3                               |
| B31 | User can withdraw individual wellbeing-data consent from privacy settings                                             | F1, F10, Privacy rule, P6                |
| B32 | Incomplete weeks show a clear message instead of unsupported trend conclusions                                        | F6, Safety rule                      |
| B33 | Accessibility support including keyboard navigation, readable contrast, labels, and screen-reader structure           | F10, Charter accessibility goal      |
| B34 | A qualified wellbeing advisor reviews questionnaire wording, scoring, recommendations, and safety copy before release | F2, F3, F5, F9, Charter release gate |
| B35 | At least three real students or young adults complete usability testing and provide feedback                          | F10, Charter release gate            |
| B44 | Optional bedtime reminder: a notification at a user-chosen time before the target bedtime, off by default, easy to turn off | P4, P5 (I5, I4, I6) |

## Later

| #   | Item                                                                                         | Traces to           |
| --- | -------------------------------------------------------------------------------------------- | ------------------- |
| B36 | Optional AI-assisted recommendation drafting with explicit disclosure and data minimization  | F5, Privacy rule    |
| B37 | AI recommendations may not diagnose, assess crisis risk, or make autonomous safety decisions | F5, F9, Safety rule |
| B38 | Additional moderated community discovery and saved-story features                            | F8, P3              |

## Won't

| #   | Item                                                                         | Traces to                             |
| --- | ---------------------------------------------------------------------------- | ------------------------------------- |
| B39 | Mental-health diagnosis, clinical risk classification, or treatment planning | Charter product boundary, Safety rule |
| B40 | AI crisis assessment or autonomous emergency decision-making                 | Charter product boundary, Safety rule |
| B41 | Unmoderated public wellbeing-story publishing                                | F8, Moderation rule                   |
| B42 | Selling, advertising against, or unrelated profiling from wellbeing data     | Privacy rule                          |
| B45 | Paywalls or paid plans for core wellbeing features | P7 (I5), Charter scope |
