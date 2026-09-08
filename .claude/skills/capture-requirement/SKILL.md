---
name: capture-requirement
description: >-
  Capture verified Better Days user-research notes and turn them into a
  numbered wellbeing requirement document with functional, non-functional,
  privacy, safety, and scope sections. Use after user interviews or when a new
  feature area needs specifying.
---

# Capture Requirement

Turn messy Better Days research notes into a structured requirement document,
then synchronize the design documents when requested.

## Step 1 - collect the inputs

Ask the user for, and do not proceed without:

1. The **raw pain notes** or a file path. Record who said each pain and when.
2. A **topic name** for the file slug, such as `onboarding`, `daily-checkin`,
   `wellbeing-scoring`, `recommendations`, `journal`, `stories`, or `safety`.
3. Confirmation that each pain came from a real user interview or clearly marked
   observation. Do not turn assumptions into research findings.
4. Any relevant privacy or safety concern from `rule.md`.

If anything is unclear, ask and offer at least three options. Never guess.
Never invent an interviewee, quote, clinical claim, advisor approval, or pain.

## Step 2 - hand off to the requirement agent

Invoke the Better Days `requirement-writer` agent with the verified pains and
topic. It writes a file under:

`.docs/requirement/{YYYYMMDD}-{no}-{topic}.md`

The requirement document must contain:

1. **Problem and users** - real pains labelled `P1`, `P2`, etc.
2. **Functional requirements** - `F1`, `F2`, etc., each with a user story,
   MoSCoW priority, and `solves P<n>` trace.
3. **Non-functional requirements** - measurable `NFR` values for completion
   time, scoring accuracy, accessibility, privacy, deletion, or availability.
4. **Privacy and safety requirements** - consent, minimization, access control,
   safety support, moderation, audit logging, and deletion.
5. **Scope** - in scope, out of scope, and the core Better Days workflow.

## Step 3 - synchronize and verify

1. Update `.docs/design/` only when the user asks for design synchronization.
2. Ensure every core requirement has a feature or design trace.
3. Run `/audit-backlog` after requirement or feature-list changes.
4. Run `/audit-design` after design changes.
5. Append a short factual entry to the project work log when one exists.
6. Report changed files, new IDs, unresolved gaps, and open questions.

Do not commit or push automatically. Ask the user before performing version
control operations.

## Better Days product reminders

- The core workflow is: consent -> baseline questionnaire -> focus-area scores
  -> neutral profile -> daily check-in -> small recommendation -> weekly
  summary/reflection.
- Every NFR needs a measurable value such as seconds, percentage, count, or
  retention period. Words like "easy" or "fast" alone are not testable.
- Wellbeing responses, mood, stress, and journal entries may be sensitive
  personal data. Require clear purpose, minimization, consent, access control,
  export, correction, and deletion behavior.
- Safety-support behavior must be separate from scoring. Never turn a serious-
  concern response into a diagnosis or hide it inside an average.
- Recommendations must be small, respectful, and non-clinical. Do not write
  medication, treatment, or diagnosis requirements.
- Community stories require moderation, reporting, and removal behavior before
  publication.
- AI recommendations are optional future work. AI must not assess crisis risk,
  diagnose users, or make autonomous safety decisions.
- Profiles are descriptive labels only: Starting Point, Building Habits, and
  Maintaining Progress.

## Rule

If two requirements may be duplicates, do not merge them silently. Ask whether
to merge, keep separate, or rename one. Never guess.
