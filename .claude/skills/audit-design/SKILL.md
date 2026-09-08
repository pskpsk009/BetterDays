---
name: audit-design
description: >-
  Check the Better Days design draft against its requirements and charter.
  Verify feature coverage, traceability, safety, privacy, moderation, and the
  four required system diagrams. Run after editing files in .docs/design/.
---

# Audit Better Days Design

Verify that `.docs/design/` and `.docs/requirement/` agree and that the Better
Days design is ready for user validation.

## Steps

1. Read `Better_Days_Project_Charter.md`, `CLAUDE.md`, and `rule.md`.
2. Read every requirement file in `.docs/requirement/`. Collect every `F`,
   `NFR`, privacy, safety, and research pain ID with its priority.
3. Read every file in `.docs/design/`, including `.docs/design/diagrams/` when
   present.
4. Report these lists:

   - **Missing diagrams** - the design should contain context, use case,
     architecture, and activity diagrams when the diagram phase is in scope.
   - **Uncovered core requirements** - core requirements with no feature,
     acceptance criterion, journey step, screen, or diagram trace.
   - **Uncovered safeguards** - privacy, consent, safety, deletion, or
     moderation rules that appear in no design document.
   - **Orphan design elements** - features, journey steps, screens, or diagram
     nodes with no `F`, `NFR`, `P`, privacy, safety, or charter trace.
   - **Spec drift** - a feature priority disagrees with its requirement, or a
     journey step describes behavior not stated in the requirements.
   - **Scope creep** - design elements add diagnosis, treatment, automated
     crisis assessment, unmoderated publishing, or unrelated profiling.

## Better Days gate checks

- The **context diagram** must show the user, Better Days, protected data,
  authentication, support resources, and the moderation boundary.
- The **use-case diagram** must map user actions to feature or requirement IDs,
  including consent, onboarding, check-in, profile, journal, stories, safety,
  and data management.
- The **architecture diagram** must show the frontend, authenticated API,
  deterministic scoring service, protected wellbeing data store, audit log, and
  one explicit trade-off.
- The **activity diagram** must show consent, onboarding, scoring, neutral
  profile, daily check-in, recommendation, weekly summary, and a separate
  safety-support branch.
- The **user journey** must cover the core workflow end to end:
  consent -> baseline reflection -> profile -> check-in -> small action ->
  weekly summary/reflection.
- The **feature list** must cover onboarding, scoring, profiles, check-ins,
  recommendations, weekly summaries, journals, safety support, privacy, and
  moderated stories.
- Daily check-ins must target completion in under two minutes.
- Serious-concern responses must never be hidden by an average or weighted score.
- Profiles must remain descriptive habit-support labels, not diagnoses.
- Community stories must not become public without moderation and reporting.
- Data export, correction, consent withdrawal, and deletion must be designed.
- The release plan must include testing with at least three real target users and
  review by a qualified wellbeing advisor.

## Traceability rule

Every feature, journey step, screen, and diagram element must trace to an
existing requirement, charter goal, research pain, privacy rule, or safety rule.
Do not accept invented user quotes, clinical claims, advisor approval, or
validation results as evidence.

## Output

Start with `PASS` or `FAIL`, followed by:

1. Missing diagrams
2. Uncovered core requirements
3. Uncovered safeguards
4. Orphan design elements
5. Spec drift
6. Safety gaps
7. Privacy gaps
8. Moderation gaps
9. Scope creep

Use exact file names and IDs. Separate confirmed facts from open questions.
Do not edit any file unless the user explicitly asks to fix a named gap.

## Rule

If two items look like the same thing but use different wording, do not merge
them silently. Ask whether to merge, keep separate, or rename one. Never guess.
