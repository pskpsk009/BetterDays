# User Journey - the Better Days core workflow

- Date: 2026-09-08
- Persona: **A student or young adult** who wants to understand daily routines,
  build manageable habits, and notice gradual progress without diagnosis.
- Workflow: **consent -> baseline reflection -> profile -> daily check-in ->
  small action -> weekly summary/reflection**

## Step-by-step

| # | Screen | User does | System does | Traces | Pain relieved |
|---|---|---|---|---|---|
| J1 | Welcome and consent | Reads privacy explanation and wellbeing limitations, then accepts | Stores consent version, user, timestamp, and withdrawal status | F1, LR1, LR5 | Trust and privacy concern |
| J2 | Onboarding questionnaire | Answers 10 to 15 questions about sleep, stress, connection, activity, and functioning | Validates and securely stores the baseline | F2, NFR2 | **P1** self-awareness |
| J3 | Progress profile | Reviews individual focus-area scores and one profile label | Calculates deterministic scores and shows neutral explanations | F3, F4, NFR3, NFR4, LR6 | **P1** self-awareness |
| J4 | Small next steps | Chooses one practical recommendation to try | Shows no more than two actions linked to lower-scoring focus areas | F6, NFR6, LR8 | **P2** unclear next steps |
| J5 | Daily check-in | Records mood, sleep, stress, connection, activity, and work/study balance | Saves the check-in and targets completion under two minutes | F5, NFR2, LR2 | **P3** inconsistent tracking |
| J6 | Action response | Marks a recommendation completed, skipped, or saved when available | Records the response without judgement | F6, F11, LR5 | **P2** habit difficulty |
| J7 | Weekly summary | Reviews seven-day trends and writes an optional private reflection | Shows neutral trends, check-in count, and a next-week prompt | F7, NFR4, FE7 | **P2, P3** progress is hard to see |
| J8 | Safety support | Opens support information or selects a serious-concern response | Shows separate professional and crisis-resource information | F8, LR7, LR8 | Appropriate support |
| J9 | Community stories | Reads a moderated story or submits one for review | Shows approved stories and keeps new submissions private until moderation | F9, LR9, LR10 | **P2, P3** shared learning |
| J10 | Privacy settings | Views, exports, corrects, withdraws consent, or deletes data | Runs a controlled data-rights workflow and records the action | F1, F10, LR3-LR5 | **P3** data control |

## Alternate and failure paths

| # | Trigger | System behavior | Traces |
|---|---|---|---|
| A1 | Required onboarding answer is missing | Highlights the missing answer and does not calculate a misleading profile | F2, NFR3 |
| A2 | Optional check-in field is skipped | Saves permitted answers and explains what was omitted | F5, NFR2 |
| A3 | Serious-concern response is selected | Shows supportive safety information separately and never returns a diagnosis | F8, LR6-LR8, NFR5 |
| A4 | User withdraws consent | Stops affected processing, records withdrawal, and explains the impact | F1, F10, LR1, LR3, LR5 |
| A5 | Weekly data is incomplete | Shows an incomplete-week message rather than an unsupported conclusion | F7, NFR4 |
| A6 | User submits a community story | Keeps it private until moderation is complete | F9, LR9 |
| A7 | User reports a harmful story | Records the report and routes it to the defined review/removal process | F9, LR10 |
| A8 | Unauthorized user requests private data | Denies access and records the security event | F1, F10, LR4, LR5 |
| A9 | Account deletion is confirmed | Deletes account-linked content according to the documented deletion workflow | F10, LR3 |
| A10 | Optional AI service fails | Shows a plain-language message and keeps check-ins and journals usable | NFR9, LR11 |

## Drop-off risks

| Risk | Where | Mitigation | Traces |
|---|---|---|---|
| Onboarding feels like a long survey | J2 | Keep it to 10 to 15 questions, show progress, and use plain language | F2, NFR2 |
| Users interpret a profile as a diagnosis | J3 | Use neutral labels, visible limitations, and separate area scores | F4, LR6, NFR4 |
| Daily check-ins feel repetitive | J5 | Keep the flow under two minutes and make notes optional | F5, NFR2 |
| Recommendations feel generic | J4 | Link every action to a focus area and show only one or two primary actions | F6, NFR6 |
| Safety messaging feels alarming | J8 | Use calm supportive wording and make resources easy to reach | F8, LR7 |
| Users do not trust data handling | J1, J10 | Explain collection, access, export, consent withdrawal, and deletion clearly | F1, F10, LR1-LR5 |
| Community content causes harm | J9 | Moderate before publication and provide reporting/removal controls | F9, LR9, LR10 |

## Pain coverage check

- **P1** lack of self-awareness -> J2, J3, J5, J7
- **P2** unclear next steps -> J3, J4, J6, J7, J9
- **P3** inconsistent tracking -> J5, J7, J9, J10
