# Feature List - Better Days Wellbeing Companion

- Date: 2026-09-08
- Source spec: `../requirement/spec/20260908-01-wellbeing-habit-support.md`
- Backlog: `../requirement/backlog.md`

Requirements describe what users need; this list describes what gets built.
Acceptance criteria are written so a tester can pass or fail them without making
clinical claims.

## FE1 - Account, Privacy, and Consent - **Must**

Covers **F1, F10** and implements **LR1-LR5**. Relieves **P1, P3**.

| # | Acceptance criteria |
|---|---|
| AC1 | A user can create an account and read the Better Days limitations before sharing wellbeing information (F1). |
| AC2 | Consent stores user, accepted text version, timestamp, and withdrawal status (LR1, LR5). |
| AC3 | A user can view, correct, export, withdraw consent for, and delete permitted personal data (F10, LR3). |
| AC4 | Access control prevents one user from viewing another user's check-ins, profile, journal, consent records, or export (LR4). |
| AC5 | Access, consent, correction, export, and deletion actions are auditable (LR5, NFR10). |

## FE2 - Onboarding Questionnaire - **Must**

Covers **F2** and implements **LR1, LR2**. Relieves **P1**.

| # | Acceptance criteria |
|---|---|
| AC1 | A user can complete 10 to 15 questions using a clear 1-to-5 scale (F2). |
| AC2 | Questions cover sleep, stress, connection, enjoyable activity, work/study balance, and functioning (F2). |
| AC3 | A user can review and correct answers before submission. |
| AC4 | Required answers are validated and missing responses are never silently invented. |
| AC5 | Wording avoids diagnosis, treatment claims, and negative labels (LR6, NFR7). |

## FE3 - Wellbeing Scoring and Profile - **Must**

Covers **F3, F4** and implements **LR6, LR7**. Relieves **P1**.

| # | Acceptance criteria |
|---|---|
| AC1 | The system calculates separate scores for each approved focus area (F3, NFR3). |
| AC2 | The weighted score uses documented weights and repeatable logic (F3, NFR3). |
| AC3 | The user receives exactly one profile: Starting Point, Building Habits, or Maintaining Progress (F4). |
| AC4 | The screen shows individual focus-area values as well as the weighted result (F3, F4, NFR4). |
| AC5 | The profile states that it is not a diagnosis or clinical assessment (LR6). |
| AC6 | Serious-concern answers are evaluated separately and cannot be hidden by the weighted result (LR7, NFR5). |
| AC7 | The same approved answers produce the same scores in 100% of at least 50 automated test cases (NFR3). |

## FE4 - Daily Check-In - **Must**

Covers **F5**. Relieves **P3**.

| # | Acceptance criteria |
|---|---|
| AC1 | A user can record mood, sleep, stress, connection, activity, and work/study balance (F5). |
| AC2 | Optional notes are not required for submission. |
| AC3 | A typical check-in can be completed in under two minutes across at least 10 test sessions (NFR2). |
| AC4 | A user can edit or delete a check-in through the data-management workflow (F10, LR3). |
| AC5 | A serious-concern response triggers separate support messaging (F8, LR7). |

## FE5 - Personalized Recommendations - **Must**

Covers **F6** and implements **LR8**. Relieves **P2**.

| # | Acceptance criteria |
|---|---|
| AC1 | The system presents no more than two primary recommendations (F6, NFR6). |
| AC2 | Each recommendation identifies the focus area it relates to. |
| AC3 | Recommendations are practical, respectful, optional, and non-clinical (LR8). |
| AC4 | Approved recommendation templates contain no diagnosis, medication, or treatment instruction (NFR6). |
| AC5 | If AI is later used, its use is disclosed and the request contains zero direct identifiers unless separately approved (LR11, NFR11). |

## FE6 - Weekly Summary and Reflection - **Must**

Covers **F7** and implements **LR2, LR3**. Relieves **P2, P3**.

| # | Acceptance criteria |
|---|---|
| AC1 | A user can view check-in completion and focus-area trends for the previous week (F7). |
| AC2 | Trends use neutral wording such as reported higher, reported lower, or about the same (LR6). |
| AC3 | Incomplete weeks are explained without unsupported conclusions (F7, NFR4). |
| AC4 | The summary provides a reflection prompt or next-week goal (F7). |
| AC5 | Private reflections are included in export and deletion workflows (LR3). |

## FE7 - Private Journal - **Must**

Covers **F7** and implements **LR2-LR4**. Relieves **P3**.

| # | Acceptance criteria |
|---|---|
| AC1 | A user can create, view, edit, and delete a private journal entry. |
| AC2 | Journal entries are private by default and separate from public stories. |
| AC3 | Journal entries are included in the user's permitted export and deletion workflows. |
| AC4 | The interface clearly distinguishes private reflections from community submissions. |

## FE8 - Moderated Community Stories - **Must**

Covers **F9** and implements **LR9, LR10**. Relieves **P2, P3**.

| # | Acceptance criteria |
|---|---|
| AC1 | Users can read only stories that have passed the moderation workflow (LR9). |
| AC2 | A submitted story remains private until moderation is complete. |
| AC3 | Users can report harmful content, harassment, dangerous advice, or exposed personal information (LR10). |
| AC4 | The project defines a review and removal process before public launch. |
| AC5 | Stories are not described as medically verified or suitable for everyone. |

## FE9 - Safety Support - **Must**

Covers **F8** and implements **LR6-LR8**. Supports the charter safety goal.

| # | Acceptance criteria |
|---|---|
| AC1 | Safety-support information is reachable from the main application. |
| AC2 | Serious-concern responses show supportive professional and crisis-resource information separately from scores. |
| AC3 | The UI tells a user who may be in immediate danger to contact local emergency services or a trusted person. |
| AC4 | The system never claims to determine whether a user is safe. |
| AC5 | Safety wording is reviewed by a qualified wellbeing advisor before release. |

## FE10 - Audit, Accessibility, and Data Rights - **Must** *(cross-cutting)*

Covers **F1, F10**, **NFR7-NFR10**, and **LR3-LR5**.

| # | Acceptance criteria |
|---|---|
| AC1 | Required access, consent, export, moderation, correction, and deletion logs retain user and timestamp information (LR5, NFR10). |
| AC2 | Required logs are retained for at least 90 days with explicit configuration (NFR10). |
| AC3 | Export contains only the requesting user's permitted data (LR3, LR4). |
| AC4 | MVP screens provide labelled controls, keyboard access, readable contrast, and logical focus order (NFR7). |
| AC5 | No UI copy presents Better Days as diagnosis, treatment, or crisis assessment (LR6, LR8). |

## Not built in the first MVP

- Diagnosis, clinical risk classification, treatment planning, or medication advice.
- Automated crisis assessment or autonomous emergency decisions.
- Unmoderated public stories.
- AI recommendations before separate safety and privacy review.

## MVP build commitment

**FE1 -> FE2 -> FE3 -> FE4 -> FE5 -> FE6**, with FE7, FE9, and FE10 running
alongside the core workflow. FE8 is released only when moderation and reporting
are ready.
