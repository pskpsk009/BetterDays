# Extra Test Evidence - Own Tests and SECONDARY Sources

**Real-user task sessions were run** on 2-3 November 2026 (U01-U06).
Results: [uat/session-logs.md](uat/session-logs.md),
[uat/before-after.md](uat/before-after.md), [uat/utaut2.csv](uat/utaut2.csv),
[uat/issue-log.md](uat/issue-log.md).

This file adds evidence beyond the real sessions: our own automated tests,
SUS, and SECONDARY sources. No real-user data is invented; each item is
labelled with what it does and does not prove.

## 1. Gaps in the real-user data

Some values were empty on the session forms (for example, all of U02's task
times), think-aloud quotes and closing interviews were not recorded, and the
screening answers conflict with the test plan's eligibility rule. Details:
[uat/session-logs.md, Data notes](uat/session-logs.md#data-notes).

## 2. Extra evidence

### 2.1 Our own test cases (TEAM)

Automated unit tests for the app's pure logic modules, run on 18/11/2026:

```bash
npm test
```

| Result | Count |
|---|---|
| Test suites | 13 |
| Tests | 50 |
| Pass | **50** |
| Fail | 0 |

Test files: `tests/unit/` (activities, copy, needs, progressMath, sleep).

Test plan cases covered (`test-plan.tex` Section 3):

| ID | What it checks | Result |
|---|---|---|
| TC01 | Every need-finder suggestion opens a real activity (8 needs x 3) | Pass |
| TC02 | Gradual sleep schedule takes the shorter way round midnight | Pass |
| TC03 | Night on/off schedule within the +-30 min and +-1 h windows | Pass |
| TC04 | No banned diagnostic words in user-facing text | Pass |
| TC05-TC20 | Integration and system tests (Supabase, flows on device) | Not run |

**Proves:** the need finder, sleep maths, progress maths, and wording rules
work as specified. **Does not prove:** that real users can find or complete
anything in the app, or that the Supabase privacy rules work (TC05-TC11 not
run).

### 2.2 Real-user SUS (REAL, partial)

| Measure | Value |
|---|---|
| Users | 6 (3 further responses removed; listed in `uat/sus-results.md`) |
| Mean SUS | **70.8** (SD 8.0) |
| Target | 68 or higher |
| Met? | Yes |

Details: [uat/sus-results.md](uat/sus-results.md), raw answers:
[uat/sus.csv](uat/sus.csv).

**Proves:** these 6 users rated the app's usability as about average or
slightly above (grade C). **Does not prove:** task success, speed, or
benefit, because no tasks were observed. With 6 users the margin of error is
wide.

### 2.3 Proxy users and 2.4 heuristic review

Not used. Real-user sessions (U01-U06) were run instead, so no proxy users
were needed. A team heuristic review form exists
([team-test-form.docx](team-test-form.docx)) but no completed review is
reported here.

### 2.5 SECONDARY evidence

| # | Source | What it says | What it proves | What it does not prove |
|---|---|---|---|---|
| S1 | SECONDARY: Nakie et al. (2024), *Sleep quality and associated factors among university students in Africa: a systematic review and meta-analysis*, Frontiers in Psychiatry. [Link](https://pmc.ncbi.nlm.nih.gov/articles/PMC10979362/) | 35 studies, 16,275 students: pooled poor sleep quality 63.3%; stress and device use at bedtime were linked to poor sleep | Poor sleep is common among university students, supporting our interview pain P4 (6/6) | Results are from African universities, not Thai students; says nothing about whether BetterDays improves sleep |
| S2 | SECONDARY: Baumel et al. (2019), *Objective User Engagement With Mental Health Apps*, JMIR 21(9):e14567. [Link](https://www.jmir.org/2019/9/e14567) | 93 wellbeing apps: median 30-day retention 3.3%; tracker apps 6.1%, breathing-exercise apps 0.0% | People stop using wellbeing apps quickly, supporting pain P5 (consistency, 4/6) and our focus on small, easy habits | Does not measure BetterDays; Android only; does not show which features keep users |
| S3 | SECONDARY: Mozilla Foundation, *Privacy Not Included: mental health apps* (2022, 2023 update). [Link](https://www.mozillafoundation.org/en/blog/shady-mental-health-apps-inch-toward-privacy-and-security-improvements-but-many-still-siphon-personal-data/) | Most reviewed mental health apps shared data or had weak privacy; 19 of 32 still carried warnings in 2023 | Privacy worries are reasonable, supporting pain P6 (4/6) and our on-device-first, delete-anything design | Does not test BetterDays' own privacy; is a consumer review, not a peer-reviewed study |
| S4 | SECONDARY: MeasuringU, *Measuring Usability with the System Usability Scale*, and Lewis (2018), Journal of Usability Studies 13(3). [Link](https://measuringu.com/sus/) / [PDF](https://uxpajournal.org/wp-content/uploads/sites/7/pdf/JUS_Lewis_May2018.pdf) | Average SUS across 500 products is 68 (50th percentile) | Gives the benchmark our SUS mean (70.8) is compared with | Does not make our 6-user result statistically reliable |

## 3. Before / after

Measured with real users instead of the team: see
[uat/before-after.md](uat/before-after.md) (REAL, 2-3 November 2026).

## 4. Ready-to-run plan for real users

Everything needed to run the real sessions is ready:

| Step | File |
|---|---|
| How to run an online session, message to send, consent wording, tasks, SUS and UTAUT2 items | [uat/README.md](uat/README.md) |
| Record each session (U01-U06) | [uat/session-logs.md](uat/session-logs.md) |
| Before/after numbers for each MUST task | [uat/before-after.md](uat/before-after.md) |
| UTAUT2 answers (scores calculate themselves) | [uat/utaut2.csv](uat/utaut2.csv) |
| Issues, fix commit, retest | [uat/issue-log.md](uat/issue-log.md) |
| Full plan, metrics, and pass targets | [test-plan.tex](test-plan.tex) |

Plan: 6 real users aged 18-30, about 25 minutes each over a video call with
screen share. Fix any severity 3-4 issue, then retest with the next users.
