# Case Study - BetterDays

A mobile wellbeing habit app that helps university students find a small,
practical thing to do right now and keep healthier sleep routines, with
private data that stays on the phone unless the user chooses backup.

- **Live URL:** none. Publishing the app (app stores, or a hosted build that
  installs outside Expo Go) costs money, which the team does not have for a
  student project. The app is shown through **Expo Go**: run
  `npx expo start --tunnel` and scan the QR code with the Expo Go app on any
  phone (steps in the [README](../../README.md#getting-started)). The live
  showcase uses this same build.
- **Repository:** https://github.com/pskpsk009/BetterDays (branch `main`)
- **Team:** Thura Min Tun (Project Owner and Frontend), Paing Soe Khant
  (QA / Tester), Myint Myat Pyae Sone (Backend), Min Myat Hein (Designer)



---

## 1. Problem

Students want to feel better day to day, but general advice is hard to act on
and healthy habits rarely last. We started with three assumed pains (P1-P3)
in the charter, then tested them with real users.

**Six real user interviews (REAL, 2/11/2026,
[interviews.md](../requirement/interviews.md)):**

| Pain | Mentioned by | Result |
|---|---|---|
| P4 Poor or irregular sleep affects stress and energy | 6/6 | Strongest pain |
| P5 Hard to stay consistent with habits | 4/6 | Confirmed |
| P6 Worry that personal data could leak | 4/6 | Confirmed |
| P2 Advice is too generic or hard to apply | 3/6 | Confirmed |
| P3 No tracking habit (never used a tracker) | 6/6 | Confirmed (reworded) |
| P1 Lack of awareness of patterns | 2/6 | Weak |

In their own words: *"Sleep schudle is almost reversed, stress hit hard
because of lack of good night sleep"* (I1); *"often too genericor hard to
stick with schedule"* (I4); *"The hardest part about keeping healthy habits
for you is consistency."* (I6).

**SECONDARY evidence** (full table in
[no-real-user-test.md](../test/no-real-user-test.md#25-secondary-evidence)):

- Poor sleep quality affects 63% of university students in a 35-study
  meta-analysis ([Nakie et al., 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10979362/)).
  Supports P4; the students were in Africa, not Thailand.
- Median 30-day retention of wellbeing apps is 3.3%
  ([Baumel et al., 2019](https://www.jmir.org/2019/9/e14567)). Supports P5.
- Most mental health apps reviewed had weak privacy
  ([Mozilla Foundation, 2023](https://www.mozillafoundation.org/en/blog/shady-mental-health-apps-inch-toward-privacy-and-security-improvements-but-many-still-siphon-personal-data/)).
  Supports P6.

**Problem statement:** students lose sleep and stop healthy habits within
weeks, the advice they find online is too generic, and they do not trust
wellbeing apps with their data.

## 2. Process

| Phase | Dates | What we did | Evidence |
|---|---|---|---|
| Discover | Sep - Nov 2026 | Charter with roles and team rules; requirements F1-F15, NFR1-NFR11, LR1-LR11; MoSCoW backlog; six real interviews; PDPA mapping | [Charter](../../Better_Days_Project_Charter.md), [spec](../requirement/spec/20260908-01-wellbeing-habit-support.md), [backlog](../requirement/backlog.md), [interviews](../requirement/interviews.md), [rule.md](../../rule.md) |
| Design | Sep 2026 | Context, use case, architecture, and activity diagrams; user journey; prototype | [.docs/design/](../design/) |
| Build | Oct - Nov 2026 | Expo (React Native) app with Home need finder, Mind and Body activities, Sleep Schedule Guidance, Movement Trail, Progress tree, optional Supabase account and backup, export and delete | [Architecture](../build/architecture.md), [diagrams](../build/diagrams.md), [source](../../frontend/) |
| Test | Oct - Nov 2026 | Test plan (20 test cases, 5 user tasks, SUS, UTAUT2); 50 unit tests; real-user SUS; UAT kit for task sessions | [Test plan](../test/test-plan.tex), [tests](../../tests/unit/), [SUS](../test/uat/sus-results.md) |

**Key decisions, and why:**

1. **No diagnosis, no AI in the app.** `rule.md` forbids diagnosis and
   requires a separate safety review before any AI recommendation. The
   suggestions use a fixed, tested rule table instead (see
   [ai-logic.md](ai-logic.md)).
2. **On-device first.** Answers to P6: activity data is stored on the phone.
   Backup is off by default and needs a versioned consent; users can download
   or delete everything from Profile.
3. **Sleep is front and centre.** P4 was 6/6, so Sleep Schedule Guidance
   (gradual bedtime steps, a morning log, nights on schedule) is a MUST item
   (B43), and a bedtime reminder was added to the backlog (B44).
4. **Small, clear steps.** Answers P2: each need in the Home finder leads to
   three short activities, opened in one tap.

## 3. Outcome

**What works now:**

- Home "What do you need right now?" finder: 8 needs, 3 activities each.
- 27 Mind activities in 9 branches, 4 Body activities, Sleep Schedule
  Guidance, Movement Trail with GPS and step tracking, Progress Growth Tree.
- Optional account, backup with consent, Download my data, Delete all data,
  Delete account.

**Results:**

| Measure | Result | Label | Evidence |
|---|---|---|---|
| Unit tests | 50 of 50 pass (18/11/2026) | TEAM | [tests/unit/](../../tests/unit/) |
| Test plan cases TC01-TC04 | Pass | TEAM | [test-plan.tex](../test/test-plan.tex) |
| SUS usability | Mean **70.8** (SD 8.0, n = 6), target 68 met, grade C | REAL | [sus-results.md](../test/uat/sus-results.md) |
| T1 calm down: time before vs after | 135 s to 20 s median (85% faster) | REAL | [before-after.md](../test/uat/before-after.md) |
| T2 sleep times: success before vs after | 0 of 6 to 4 of 5 | REAL | [before-after.md](../test/uat/before-after.md) |
| Task success T1-T5 | 80-100% per task | REAL | [before-after.md](../test/uat/before-after.md) |
| UTAUT2 acceptance | PE 3.61, EE 3.28, BI 3.83 of 5 (target 4.0 not met) | REAL | [utaut2.csv](../test/uat/utaut2.csv) |
| Issues found | 5 (3 minor, 2 cosmetic), none fixed yet | REAL | [issue-log.md](../test/uat/issue-log.md) |
| Secrets in Git history | None found (18/11/2026) | TEAM | [.gitignore](../../.gitignore) |

Full before/after view: [comparison-table.md](comparison-table.md).

**Limits, stated honestly:**

- In the real-user task sessions, some values were not recorded, and all six
  participants answered Yes to a screening question the test plan uses to
  exclude people
  ([data notes](../test/uat/session-logs.md#data-notes)).
- UTAUT2 acceptance was below the 4.0 target (PE 3.61, EE 3.28, BI 3.83).
- Three SUS responses were removed by the team; they are still listed in
  [sus-results.md](../test/uat/sus-results.md). With all nine the mean was
  67.2.
- Activity and safety wording has not been reviewed by a wellbeing advisor
  (B34).
- Three PDPA gaps are open: minimum age (s.20), data stored outside Thailand
  (s.28), and a breach plan (s.37(4)).

**Next steps:** fix the five logged issues (fewer taps to help and to
calming activities, clearer sleep date picker and backup steps) and retest, build the bedtime reminder (B44), and close the PDPA gaps before any
public release.
