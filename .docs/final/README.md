# BetterDays - Final Project Index

One link per required item, from Discover to Deliver.

- **Repository:** https://github.com/pskpsk009/BetterDays
- **Branch:** `main`
- **Team:** Paing Soe Khant (6631503082), Thura Min Tun (6631503095),
  Min Myat Hein (6631503068), Myint Myat Pyae Sone (6631503073)

Labels used in the repo: **REAL** = data from real target users; **TEAM** =
measured by team members; **PROXY** = people outside the team who are not
target users; **SECONDARY** = published sources, with links. No real-user data
is invented.

## 1. Discover

| Item | Link |
|---|---|
| Company Charter: members, roles, team rules | [Better_Days_Project_Charter.md](../../Better_Days_Project_Charter.md) (team rules: Section 10) |
| Real-user interviews (6) and pains found | [.docs/requirement/interviews.md](../requirement/interviews.md) (REAL, 2/11/2026) |
| Lean Canvas (optional) | Not included |
| Requirements | [.docs/requirement/spec/20260908-01-wellbeing-habit-support.md](../requirement/spec/20260908-01-wellbeing-habit-support.md) |
| Product Backlog (MoSCoW, MUST marked) | [.docs/requirement/backlog.md](../requirement/backlog.md) |
| PDPA and legal requirements | [rule.md](../../rule.md) (Thailand PDPA section near the top) |
| How the team uses AI | [CLAUDE.md](../../CLAUDE.md) (section "How our team uses AI") |

## 2. Build

| Item | Link |
|---|---|
| Diagrams: use case, activity, sequence, ER | [.docs/build/diagrams.md](../build/diagrams.md) |
| More design diagrams (context, use case, architecture, activity) | [.docs/design/diagrams/](../design/diagrams/) |
| Architecture | [.docs/build/architecture.md](../build/architecture.md) |
| Source code | [src/app/](../../src/app/) (routes), [frontend/](../../frontend/) (screens and components), [backend/supabase/](../../backend/supabase/) (database schema) |
| Our own tests | [tests/unit/](../../tests/unit/): 50 tests, 50 pass (`npm test`, 18/11/2026) |
| How to run (setup, .env.example, test account) | [README.md](../../README.md) (Getting started, Test account), [.env.example](../../.env.example) |
| No secrets | `.env` files are gitignored ([.gitignore](../../.gitignore)); Git history checked on 18/11/2026: only `.env.example` (placeholders) was ever committed, and no key strings were found |

## 3. Test

| Item | Link |
|---|---|
| Test Plan | [.docs/test/test-plan.tex](../test/test-plan.tex) |
| Session logs (U01-U06) | [.docs/test/uat/session-logs.md](../test/uat/session-logs.md) (REAL, 6 sessions, 2-3 Nov 2026; see data notes) |
| Before / After for every MUST task | [.docs/test/uat/before-after.md](../test/uat/before-after.md) (REAL: T1 85% faster, T2 0/6 to 4/5 success) |
| SUS results | [.docs/test/uat/sus-results.md](../test/uat/sus-results.md) (REAL, 6 users, mean 70.8), raw: [sus.csv](../test/uat/sus.csv) |
| UTAUT2 | [.docs/test/uat/utaut2.csv](../test/uat/utaut2.csv) (REAL, 6 users: PE 3.61, EE 3.28, BI 3.83) |
| Issue log: severity, fix commit, retest | [.docs/test/uat/issue-log.md](../test/uat/issue-log.md) (5 issues; fixes and retests pending) |
| Extra evidence (own tests, SECONDARY, team checks) | [.docs/test/no-real-user-test.md](../test/no-real-user-test.md) (TEAM tests, REAL SUS, SECONDARY evidence, ready-to-run plan) |
| How to run a real session | [.docs/test/uat/README.md](../test/uat/README.md) |

## 4. Deliver

| Item | Link |
|---|---|
| Case study (Problem, Process, Outcome, live URL) | [case-study.md](case-study.md) |
| AI logic (Where, How, Prove, Measure) | [ai-logic.md](ai-logic.md) |
| Comparison table (Before, After, Change, Measured with, Evidence) | [comparison-table.md](comparison-table.md) |
| Role statements (one per member) | `role-statements/`: to be added |

## 5. Other supporting documents

| Item | Link |
|---|---|
| AI in the system: where, how, evaluation, limits, bias, failure | [ai-logic.md](ai-logic.md) (Parts 1 and 3) |
| Data sources and permissions | [data-and-permissions.md](data-and-permissions.md) |
| User guide | [user-guide.md](user-guide.md) |
| Deployment notes | [deployment-notes.md](deployment-notes.md) |
| Requirement work logs | [.docs/requirement/log/](../requirement/log/) |
| Design documents (feature list, user journey, prototype) | [.docs/design/](../design/) |
