---
name: audit-backlog
description: >-
  Check that Better Days requirements, design documents, and feature backlog are
  in sync. Every core requirement must be covered by a feature, every feature
  must trace to a real requirement or charter goal, and safety and privacy rules
  must remain covered. Run after editing requirements or design documents.
---

# Audit Better Days Requirements and Design

Verify that the Better Days requirement documents, feature list, user journey,
prototype, and charter remain consistent.

## Source files

Read these files when they exist:

- `Better_Days_Project_Charter.md`
- `CLAUDE.md`
- `rule.md`
- `.docs/requirement/`
- `.docs/design/`
- `.docs/design/diagrams/`

## Steps

1. Read every requirement file in `.docs/requirement/`. Collect:
   - functional requirement IDs and priorities (`F1 Must`, `F2 Should`, etc.);
   - non-functional requirement IDs (`NFR1`, `NFR2`, etc.);
   - privacy and safety requirement IDs;
   - research pain IDs (`P1`, `P2`, etc.).
2. Read every feature list or backlog file in `.docs/design/`. Collect each
   feature, acceptance criterion, priority, and trace reference.
3. Read the user journey and prototype. Collect every journey step, alternate
   path, screen ID, and requirement trace.
4. Read all diagrams in `.docs/design/diagrams/` when present.
5. Report the following lists:

   - **Missing coverage** - core charter features or Must requirements with no
     feature, acceptance criterion, journey step, or screen coverage.
   - **Orphan trace** - references to `F`, `NFR`, `P`, privacy, or safety IDs
     that do not exist in the requirements or charter.
   - **Priority mismatch** - a feature priority that disagrees with the linked
     requirement priority.
   - **Untraced pain** - a research pain that no functional requirement or
     journey step addresses.
   - **Design drift** - a screen or journey behavior that is not supported by
     the charter, requirements, or `rule.md`.
   - **Scope creep** - proposed MVP work that adds diagnosis, treatment,
     automated crisis assessment, unmoderated publishing, or unrelated user
     profiling.

## Better Days safety checks

The audit fails if any document:

- describes Starting Point, Building Habits, or Maintaining Progress as a
  diagnosis or clinical risk category;
- hides a serious-concern response inside an average or weighted score;
- claims that Better Days can determine whether a user is safe;
- presents AI as a crisis assessor, diagnostician, or treatment provider;
- gives medication or clinical treatment instructions;
- publishes community stories without moderation and reporting controls.

## Better Days privacy checks

The audit fails if any relevant feature lacks coverage for:

- clear consent before collecting or processing sensitive wellbeing data;
- data minimization and purpose limitation;
- user-only access to private check-ins and journal entries;
- correction, export, and permanent deletion behavior;
- consent withdrawal records;
- access, consent, export, moderation, and deletion audit logging;
- applicable access-log retention requirements.

## Required release checks

Pass only when the documents show:

- deterministic focus-area and weighted scoring;
- separate area scores and neutral profile language;
- a separate safety-support path;
- daily check-ins targeted under two minutes;
- private journal behavior;
- moderated community stories;
- view, export, correction, and deletion of personal data;
- testing with at least three real target users planned;
- qualified wellbeing-advisor review identified as a release gate.

## Output

Start with `PASS` or `FAIL`.

Then list exact file names and IDs under:

1. Missing coverage
2. Orphan traces
3. Priority mismatches
4. Untraced pains
5. Safety gaps
6. Privacy gaps
7. Moderation gaps
8. Design drift
9. Scope creep

Separate confirmed facts from open questions. Do not claim that real-user testing,
advisor review, or safety validation happened unless evidence exists.

Do not edit any file unless the user explicitly asks you to fix a named gap.

## Rule

If two items appear to mean the same thing but use different wording, do not
merge them silently. Ask whether to merge, keep separate, or rename one. Never
guess.
