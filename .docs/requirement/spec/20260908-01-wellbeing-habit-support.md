# Requirement Spec - Better Days Wellbeing Companion

- Date: 2026-09-08
- No: 01
- Topic: wellbeing-habit-support
- Phase: DISCOVER / MVP planning
- Charter: `Better_Days_Project_Charter.md`
- Product rules: `CLAUDE.md` and `rule.md`
- Backlog: `../backlog.md`

## 1. Problem and users

### Users

- **Primary:** Students and young adults who want to understand daily routines
  and build manageable habits.
- **Secondary:** Users who currently keep mood notes, habit tracking, goals,
  and wellbeing advice in separate places.
- **Support stakeholders:** A qualified wellbeing advisor reviews wording,
  scoring, recommendations, and safety information before release.

### Research and charter pains

The following pains are derived from the Better Days project charter and must be
confirmed or refined through real target-user research before release.

- **P1 - Lack of self-awareness:** Users may not notice patterns across sleep,
  stress, social connection, enjoyable activity, and daily functioning.
- **P2 - Unclear next steps:** General wellbeing advice can be too broad. Users
  need one or two small, realistic actions that match their current situation.
- **P3 - Inconsistent tracking:** Journals, check-ins, goals, and advice are
  often stored separately, making gradual progress difficult to see.

## 2. Functional requirements

| ID | User story | MoSCoW | Traces |
|---|---|---|---|
| F1 | As a student or young adult, I want to create an account and understand Better Days' privacy and wellbeing limitations, so that I know what the tool can and cannot do before sharing information. | Must | solves P1, charter privacy goal |
| F2 | As a user, I want to complete a 10 to 15-question onboarding questionnaire, so that I can reflect on my current routines. | Must | solves P1 |
| F3 | As a user, I want the system to calculate separate focus-area scores and a weighted overall score, so that I can see patterns across my wellbeing habits. | Must | solves P1 |
| F4 | As a user, I want one neutral progress profile based on multiple focus areas, so that I can understand my current habit-building position without being diagnosed. | Must | solves P1, charter safety goal |
| F5 | As a user, I want to complete a short daily check-in about mood, sleep, stress, connection, activity, and work or study balance, so that I can track changes consistently. | Must | solves P3 |
| F6 | As a user, I want one or two small recommendations based on lower-scoring focus areas, so that I know what practical action I could try next. | Must | solves P2 |
| F7 | As a user, I want to review a weekly progress summary and write a private reflection, so that I can recognize gradual change and set a next step. | Must | solves P2, P3 |
| F8 | As a user whose answer indicates serious concern, I want clear professional-support and crisis-resource information separate from my score, so that I can find appropriate help without the app making a safety judgement. | Must | charter safety goal |
| F9 | As a user, I want to read moderated community stories and report harmful content, so that I can learn from personal experiences in a safer shared space. | Must | solves P2, P3, charter connection goal |
| F10 | As a user, I want to view, export, correct, withdraw consent for, and permanently delete my personal data, so that I remain in control of sensitive wellbeing information. | Must | solves P3, charter privacy goal |
| F11 | As a user, I want to mark a recommendation completed, skipped, or saved for later, so that I can manage actions without judgement. | Should | solves P2, P3 |
| F12 | As a user, I want to create and review personal wellbeing goals, so that I can connect daily actions to something meaningful. | Should | solves P2, P3 |
| F13 | As a user, I want to edit or delete my journal entries and story submissions before moderation, so that I can correct or withdraw my own content. | Should | solves P3 |
| F14 | As a user, I want optional AI-assisted recommendation drafting with clear disclosure, so that I can choose whether to use that future feature. | Could | solves P2 |
| F15 | As a user, I want the system never to diagnose me or assess crisis risk automatically, so that the product remains a wellbeing reflection tool rather than a medical service. | Won't | safety boundary |

## 3. Non-functional requirements

- **NFR1 (project metric):** In a before/after pilot, at least **3** real target
  users complete at least **2 weeks** of use. The team measures weekly check-in
  completion, perceived awareness of routines, and perceived usefulness of the
  next-step suggestions. No impact claim is made without collected evidence.
- **NFR2 (check-in time):** A typical daily check-in can be completed in **under
  2 minutes**, excluding optional journal writing, measured across at least **10**
  observed or recorded completion sessions.
- **NFR3 (scoring determinism):** The same approved questionnaire answers produce
  the same focus-area and weighted scores in **100% of** at least **50** automated
  test cases.
- **NFR4 (profile traceability):** Every profile result can be explained using
  at least **3** focus-area values and the documented profile rules; no profile
  is calculated from the total score alone.
- **NFR5 (safety separation):** In **100%** of test cases containing a configured
  serious-concern response, separate support information is shown and the safety
  signal is not removed or hidden by the weighted score.
- **NFR6 (recommendation scope):** Each result displays no more than **2** primary
  recommendations, and **100%** of approved recommendation templates contain no
  diagnosis, medication instruction, or treatment claim.
- **NFR7 (accessibility):** All MVP screens provide labelled controls, keyboard
  access, readable contrast, and a logical focus order, verified against the
  team's chosen accessibility checklist before release.
- **NFR8 (privacy operations):** A signed-in user can request an export or account
  deletion in no more than **5** clearly labelled interactions, excluding the
  final deletion confirmation.
- **NFR9 (availability failure):** If a future optional AI service fails, the app
  shows a plain-language message within **5 seconds**, exposes no raw provider
  error, and remains usable for non-AI check-ins and journal features.
- **NFR10 (audit retention):** Required access, consent, export, moderation, and
  deletion logs are retained for at least **90 days**, configured explicitly and
  documented rather than relying on an undocumented provider default.
- **NFR11 (data minimization):** A normal recommendation request, if AI is later
  enabled, contains only the minimum approved context and contains **0** direct
  identifiers unless a separate approved requirement permits one.

## 4. Privacy, safety, and moderation requirements

### Sensitive wellbeing data

- **LR1 (privacy - sensitive data consent):** Wellbeing responses, mood, stress,
  journal entries, and information that may reveal health status are treated as
  sensitive personal data. The system must explain the purpose and obtain
  explicit consent where required before collection or processing.
- **LR2 (privacy - minimization and purpose limitation):** Better Days must collect
  only fields needed for reflection, habit support, safety messaging, moderation,
  account operation, or data rights. It must not use wellbeing data for
  advertising, resale, diagnosis, or unrelated profiling without a separate
  lawful basis and explicit approval.
- **LR3 (privacy - access, correction, export, and deletion):** A user can access,
  correct, export, withdraw consent for, and permanently delete their permitted
  personal data through controlled workflows.
- **LR4 (privacy - ownership):** Access control must prevent one user from viewing
  another user's check-ins, profile, journal entries, consent records, or exports.
- **LR5 (privacy - audit):** Relevant access, consent, correction, export,
  moderation, and deletion actions must record the responsible user, timestamp,
  action, and required source information.

### Safety boundary

- **LR6 (safety - non-diagnostic product):** The interface must not describe a
  progress profile as a diagnosis, clinical risk category, treatment result, or
  professional assessment.
- **LR7 (safety - separate support):** Serious-concern responses must trigger
  separate professional-support and crisis-resource information. The system must
  not claim to determine whether the user is safe or in immediate danger.
- **LR8 (safety - recommendation limits):** Recommendations must be small,
  practical, respectful, and non-clinical. They must not provide medication
  changes, treatment instructions, or diagnosis.

### Community moderation

- **LR9 (moderation - pre-publication review):** A community story must remain
  private until it passes the approved moderation workflow.
- **LR10 (moderation - reporting and removal):** Users must be able to report
  harmful content, harassment, dangerous advice, or exposed personal data. The
  project must define a review and removal path.

### Optional AI

- **LR11 (AI - future feature only):** If AI recommendations are added, the UI
  must disclose AI use, the request must be minimized, and the system must not
  use AI for diagnosis, crisis assessment, or autonomous safety decisions.

## 5. Scope

### In scope

- Account creation, privacy explanation, and consent records.
- 10 to 15-question onboarding questionnaire.
- Deterministic focus-area and weighted scoring.
- Neutral progress profile and separate area scores.
- Daily check-ins targeted under two minutes.
- One or two practical, non-clinical recommendations.
- Weekly progress summaries and private reflections.
- Moderated community stories and reporting.
- Separate professional-support and crisis-resource information.
- View, export, correction, consent withdrawal, and deletion workflows.
- Required access and action audit logging.

### Out of scope

- Mental-health diagnosis or clinical risk classification.
- Treatment planning, medication advice, or therapy replacement.
- Automated crisis assessment or emergency decision-making.
- Unmoderated public stories.
- Selling or advertising against wellbeing data.
- AI recommendations in the first MVP unless separately reviewed and approved.

### The core workflow this phase builds end-to-end

A student or young adult accepts the privacy and wellbeing limitations -> completes
the onboarding questionnaire -> reviews separate focus-area scores and one neutral
profile -> completes a short daily check-in -> receives one or two small actions
linked to lower-scoring areas -> reviews a weekly summary and writes an optional
private reflection. If a serious-concern response appears, the system shows a
separate support path that is never replaced by the weighted profile.
