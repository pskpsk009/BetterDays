# Comparison Table - Before vs After

Labels: **REAL** = real target users; **TEAM** = measured by the team;
**SECONDARY** = published source. Nothing is estimated.

| Item | Before | After | Change | Measured with | Evidence |
|---|---|---|---|---|---|
| T1 Find a calming activity (time) | 135 s median; 3 of 6 completed (REAL) | 20 s median; 5 of 5 succeeded (REAL) | 85% faster | Stopwatch, real-user sessions (target: 30% faster) | [before-after.md](../test/uat/before-after.md) |
| T2 Set sleep times and log a night (success) | 0 of 6 could do it their usual way (REAL) | 4 of 5 succeeded; 20 s median (REAL) | 0% to 80% success | Real-user sessions | [before-after.md](../test/uat/before-after.md) |
| T3 Turn on backup (setup time) | No equivalent | 20 s median; 4 of 5 succeeded (REAL) | Target 120 s met | Stopwatch (target: 120 s or less) | [before-after.md](../test/uat/before-after.md) |
| T4 Find help (taps) | No equivalent | 4 taps median; 5 of 5 succeeded (REAL) | Target 3 taps not met (ISS-03) | Tap count from Home | [before-after.md](../test/uat/before-after.md) |
| T5 Export and delete data (taps) | No equivalent | 3.5 taps median; 4 of 4 succeeded (REAL) | Target 5 taps met | Tap count from Profile | [before-after.md](../test/uat/before-after.md) |
| Acceptance (UTAUT2) | No earlier version | PE 3.61, EE 3.28, BI 3.83 out of 5 (REAL, n = 6) | Target 4.0 not met for PE, EE, BI | UTAUT2, 18 items | [utaut2.csv](../test/uat/utaut2.csv) |
| Usability (SUS) | Benchmark average 68 (SECONDARY, [MeasuringU](https://measuringu.com/sus/)) | **70.8** (REAL, n = 6) | +2.8 above benchmark | SUS questionnaire, 10 items | [sus-results.md](../test/uat/sus-results.md) |
| User pains backed by evidence | 3 assumed pains (P1-P3), none checked with users | 7 pains checked with 6 real users: 5 confirmed, 1 weak, 1 not confirmed | +5 confirmed pains | Interviews, count of participants per pain | [interviews.md](../requirement/interviews.md), [backlog.md](../requirement/backlog.md) |
| Automated tests | 0 (test plan noted "no automated test in the repository") | 50 tests, 50 pass | +50 | `npm test` (node:test + tsx) | [tests/unit/](../../tests/unit/), [test-plan.tex](../test/test-plan.tex) |
| Test plan cases passed | 0 of 20 run | 4 of 20 pass (TC01-TC04) | +4 | Unit tests mapped to test cases | [test-plan.tex](../test/test-plan.tex) |
| PDPA coverage in rule.md | Privacy rules, no law named | 16 PDPA rows mapped to rules and LR codes; 3 gaps listed | Law named; 3 gaps found | Section-by-section mapping | [rule.md](../../rule.md) |
| Secret protection | Only `.env*.local` gitignored | All `.env` files gitignored except `.env.example`; 0 secrets in Git history | Wider protection; history clean | `.gitignore` diff; Git history scan (18/11/2026) | [.gitignore](../../.gitignore), [.env.example](../../.env.example) |
| **AI: suggestion logic in the app** | No finder; user browses tabs and branches | Rule-based finder (no AI model): 8 needs, 24 picks, all open a real activity | 24 of 24 picks work | `tests/unit/needs.test.ts`, TC01 | [ai-logic.md](ai-logic.md), [needs.ts](../../frontend/components/home/needs.ts) |
| **AI: used to build the app** | - | 14 of 30 commits AI-assisted, all human-reviewed; 0 invented data | 47% of commits | `git log --grep "Co-Authored-By: Claude"` | [ai-logic.md](ai-logic.md#part-2---ai-used-to-build-betterdays), [CLAUDE.md](../../CLAUDE.md) |

## Notes

- Task and UTAUT2 data: 6 real sessions on 2-3 November 2026. Some values were
  not recorded (for example, all of U02's task times), and all six
  participants answered Yes to a screening question the test plan uses to
  exclude people. See the data notes in
  [session-logs.md](../test/uat/session-logs.md#data-notes).
- **SUS before/after the app:** there was no earlier version to test, so SUS
  is compared with the published average (SECONDARY) instead.
