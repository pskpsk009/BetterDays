# Project Charter: Better Days Wellbeing Companion

## Team Members

- Paing Soe Khant - 6631503082
- Thura Min Tun - 6631503095
- Min Myat Hein - 6631503068
- Myint Myat Pyae Sone - 6631503073

## 1. Project Overview

Better Days is a private digital wellbeing platform that helps users reflect on daily habits, identify areas they may want to improve, and receive small, practical recommendations.

Users complete a 10 to 15-question onboarding questionnaire, followed by short daily check-ins about sleep, stress, social connection, enjoyable activities, and work or study balance. The system uses weighted scoring to create a neutral progress profile and provide personalized suggestions.

Better Days is a wellbeing support tool. It does not diagnose mental-health conditions, replace therapy, or provide medical treatment.

## 2. Problem Statement

Many people want to improve their wellbeing but struggle to understand daily patterns or maintain healthy routines. Users may lack self-awareness, receive advice that is too broad, and keep journals, mood notes, habit trackers, and advice in separate places.

As a result, users may feel overwhelmed, lose motivation, or fail to recognize gradual improvement. Better Days brings check-ins, recommendations, reflections, and moderated community stories into one platform.

## 3. Goals and Objectives

- Help users reflect on sleep, stress, connection, activity, and daily functioning.
- Provide one or two small recommendations based on lower-scoring focus areas.
- Support consistent habits through short check-ins and weekly summaries.
- Track progress using neutral profiles rather than diagnoses or negative labels.
- Provide moderated community stories and appropriate support information.
- Protect sensitive wellbeing information and provide data deletion.

## 4. Stakeholders

| Role | Name | Responsibility |
|---|---|---|
| Project Owner and Frontend Developer | Thura Min Tun | Product vision, requirements, scope, priorities, and timeline; mobile app screens and navigation (Expo, React Native) |
| QA / Tester | Paing Soe Khant | Scoring, safety, requirements, test plan, and acceptance testing |
| Backend Developer | Myint Myat Pyae Sone | Supabase database, accounts, backup, security, and data deletion |
| Designer | Min Myat Hein | Accessible, calm, understandable user experience |
| Target Users | Students and young adults | Complete check-ins, review recommendations, track habits, and read stories |

## 5. Scope and Key Features

| No. | Feature | Description | Priority |
|---:|---|---|---|
| 1 | User Account and Consent | Account creation, privacy settings, and wellbeing limitations | Core |
| 2 | Onboarding Questionnaire | 10 to 15 questions using a 1-to-5 rating scale | Core |
| 3 | Weighted Wellbeing Score | Separate weighted scores for sleep, stress, connection, activity, and functioning | Core |
| 4 | Progress Profile | Starting Point, Building Habits, or Maintaining Progress | Core |
| 5 | Daily Check-In | Record mood, sleep, connection, activity, work/study, and stress | Core |
| 6 | Personalized Recommendations | Provide small actions based on focus-area scores | Core |
| 7 | Weekly Progress Summary | Display trends without diagnosing or judging users | Core |
| 8 | Private Reflection Journal | Write private notes and goals | Core |
| 9 | Community Stories | Read moderated personal wellbeing stories | Core |
| 10 | Story Moderation | Review submissions, reports, harmful content, and inappropriate advice | Core |
| 11 | Safety Support | Provide professional-support and crisis-resource information | Core |
| 12 | Data Management | View, export, and permanently delete personal data | Core |
| 13 | AI Recommendations | Optional future feature under strict safety and privacy rules | Later |

## 6. Progress Profile Rules

Profiles describe current support and habit-building needs. They are not medical categories.

- **Starting Point:** The user may benefit from focusing on basic routines such as sleep, connection, stress management, or enjoyable activities.
- **Building Habits:** The user has some positive routines but may benefit from improving consistency.
- **Maintaining Progress:** The user reports relatively stable routines and may benefit from reflection, maintenance, and continued personal goals.

Profiles must use multiple focus areas, not only one total score. Safety concerns are handled separately from weighted scoring.

## 7. Constraints and Risks

- Users may misunderstand profiles as diagnoses.
- Serious distress answers must not be hidden by an average score.
- Wellbeing responses require secure storage, access control, consent, and deletion.
- Suggestions must be realistic, respectful, and safe.
- The app must show individual area scores as well as the overall profile.
- Daily questions should take less than two minutes.
- Community stories require moderation, reporting, and community rules.
- The questionnaire must be tested with real target users and reviewed by a qualified advisor.

## 8. Timeline and Milestones

| Phase | Deliverable | Weeks |
|---|---|---|
| Discover | Charter, requirements, questionnaire, privacy and safety plan, diagrams, prototype, validation gate | W1-W5 |
| Build | Onboarding, weighted scoring, progress profile, daily check-in, and recommendation flow | W6-W8 |
| Test | Real-user beta review, scoring and safety tests, accessibility review, and at least three fixes | W9-W11 |
| Deliver | User sign-off, final safety review, showcase, case study, demo video, evidence log, and impact metrics | W12-W14 |

## 9. MVP Success Criteria

- A user can complete the onboarding questionnaire.
- The system calculates focus-area and weighted overall scores.
- The user receives one neutral progress profile.
- A daily check-in can be completed in under two minutes.
- Recommendations are relevant to focus areas and non-clinical.
- The user can view a weekly progress summary.
- Users can read moderated community stories.
- Safety and crisis-support information is easy to find.
- Users can delete their personal data.
- At least three real target users complete testing and provide feedback.
- A qualified advisor reviews questionnaire, scoring, recommendations, and safety wording before release.

## 10. Team Rules

> **Draft:** all four members must check and agree to these rules. Change
> anything that does not match how the team actually works.

### Meetings

- Weekly team meeting every Monday, 9pm, about 30-60 minutes, in person or
  online.
- Each member says what they finished, what they will do next, and what is
  blocking them.
- The Project Owner writes short notes (decisions and action items) and shares
  them within 24 hours.
- Tell the team before the meeting if you cannot attend, and read the notes
  afterwards.

### Communication

- Main channel: Messenger Group. Project decisions are made there or
  in meetings, not in private chats.
- Reply within **24 hours** on weekdays. Mark urgent messages with "URGENT".
- Be respectful. Criticise the work, not the person.

### Decisions

| Decision | Who decides |
|---|---|
| Product scope, priorities, timeline | Project Owner, after team discussion |
| App screens and frontend code | Frontend Developer |
| Database, accounts, security | Backend Developer |
| UX and visual design | Designer |
| Testing, acceptance, release readiness | QA / Tester |
| Anything affecting privacy or safety | Whole team; `rule.md` always wins |

- Try for agreement first. If the team cannot agree, the owner above decides.
  Ties go to a majority vote.
- Record important decisions in the requirement log (`.docs/requirement/log/`).

### Work and deadlines

- Work is tracked in the backlog (`.docs/requirement/backlog.md`). Each task has
  one owner and a due date.
- Tell the team **at least 48 hours before** a deadline if you might miss it, so
  the work can be shared or re-planned.
- Missing a deadline without warning twice: the team talks about it at the next
  meeting. After that, the issue goes to the course instructor.
- Everyone contributes to each phase deliverable (Discover, Build, Test,
  Deliver).

### Git and code

- `main` must always run. Pull before you start work and before you push.
- Write clear commit messages that say what changed (for example, "Fix Trail
  timer reset").
- Run the required checks before pushing: `npx tsc --noEmit` and
  `npx expo lint`.
- Larger changes go on a branch and are reviewed by at least one other member
  before merging.
- Never commit passwords, API keys, or real user data.

### Privacy and AI

- Follow `rule.md` and the PDPA for all user and interview data.
- AI tools may help with code and documents, but a member reviews and tests
  everything before it is committed. AI must never invent research, quotes, or
  results (see `CLAUDE.md`).

### Agreement

| Member | Agreed (date) |
|---|---|
| Paing Soe Khant | 5/10/2026 |
| Thura Min Tun | 5/10/2026 |
| Min Myat Hein | 5/10/2026 |
| Myint Myat Pyae Sone | 5/10/2026 |

## Product Decision

Better Days should be developed as a wellbeing habit and reflection platform, not as a mental-health diagnosis or treatment application.
