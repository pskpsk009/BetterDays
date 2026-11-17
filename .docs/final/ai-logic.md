# AI Logic - BetterDays

**Short answer:** the BetterDays app contains **no AI model**. Its
suggestions come from a fixed, tested rule table. AI was used by the team to
help **build** the app. Both are documented below with Where, How, Prove,
and Measure.

---

## Part 1 - Suggestion logic in the app (rule-based, not AI)

### Where

- **Screen:** Home, "What do you need right now?"
- **Code:** [frontend/components/home/needs.ts](../../frontend/components/home/needs.ts)
  (`NEEDS`, `findSuggestion`, `orderNeeds`)
- **Requirement:** F6, pain P2 (advice too generic), backlog B13

### How

1. The user taps one of **8 everyday needs**: Stressed, Feeling low, Can't
   focus, Something went wrong, Facing a choice, People stuff, Want to grow,
   Tired or sluggish.
2. Each need maps to **exactly 3 activities**, chosen by the team (for
   example, Stressed leads to Breathing Bubble, Calm-Down Toolkit, and
   5-Senses Grounding; Tired or sluggish leads to Sleep Schedule Guidance,
   Hydration Check-in, and Daily Stretch).
3. `findSuggestion` finds which tab and branch owns the activity and opens it
   directly.
4. `orderNeeds` puts the needs the user picked in the welcome screens first;
   otherwise the order stays the same.
5. Nothing is sent off the phone, nothing is scored, and the result is the
   same for every user who taps the same need.

**Why not AI:** [rule.md](../../rule.md) does not allow diagnosis, and any
AI recommendation needs a separate privacy and safety review first (backlog
B36-B37, Later). A fixed table is predictable, can be checked line by line,
and sends no wellbeing data to a third party (PDPA s.26 sensitive data).

### Prove

| Item | Detail |
|---|---|
| Test set | [tests/unit/needs.test.ts](../../tests/unit/needs.test.ts): 8 tests covering all 8 needs and all 24 picks |
| What the tests check | 8 needs with 3 picks each; all 24 picks open an existing activity; no duplicate within a need; each pick opens in the tab that owns it; unknown IDs return nothing; welcome picks come first in the order chosen; usual order when nothing is picked; the table itself is not changed |
| Eval script | `npm test` |
| Log | 18/11/2026: 13 suites, **50 tests, 50 pass, 0 fail** (all unit tests, including these 8) |
| Test plan case | TC01 need finder: **Pass** ([test-plan.tex](../test/test-plan.tex)) |
| Baseline | Without the finder, a user must open Mind or Body, choose a section and a branch, then find the activity. The real-user comparison is task T1 ("find something to calm down"), timed the participant's usual way and then with BetterDays |

### Measure

| Metric | Target | Result |
|---|---|---|
| Picks that open a real activity | 24 of 24 | **24 of 24** (TEAM, unit test) |
| T1 time with BetterDays vs usual way | At least 30% faster (median) | **135 s to 20 s, 85% faster** (REAL, n = 5-6) |
| T1 taps from Home | Median 3 or fewer | **4** (not met; ISS-04) |
| T1 success without help | At least 80% | **5 of 5 (100%)** |

Source: real sessions, 2-3 November 2026,
[before-after.md](../test/uat/before-after.md).

---

## Part 2 - AI used to build BetterDays

### Where

- **Tools:** Claude Code and Codex, set up in [.claude/](../../.claude/),
  [.codex/](../../.codex/), and [.agents/](../../.agents/).
- **Project agents and skills:** requirement-writer, design-writer,
  backlog-auditor; capture-requirement, audit-backlog, audit-design.
- **Used for:** code and bug fixes, document drafts (requirements, backlog,
  test plan, compliance text), consistency checks, and code review.

### How

The team's rules are in [CLAUDE.md](../../CLAUDE.md) (section "How our team
uses AI") and [rule.md](../../rule.md) (Agent rules):

- AI must not invent user research, quotes, test results, or legal claims.
- AI does not decide product scope, privacy, or safety; the team does.
- AI never sees real user data; interview notes use codes (I1-I6, U01-U06).
- The member who used AI reads, tests, and owns the result before committing.

### Prove

| Item | Detail |
|---|---|
| Log | Commits written with AI help carry a `Co-Authored-By: Claude` line. Check with `git log --grep "Co-Authored-By: Claude" --oneline` |
| Count | 14 of 30 commits on `main` (18/11/2026) |
| Example of the no-invention rule | The practice session log was labelled "invented answers ... Not real test results" and kept separate from the real log |
| Example of human review | Interview answers were copied word for word with names removed; three removed SUS responses are listed, not hidden ([sus-results.md](../test/uat/sus-results.md)) |

### Measure

| Metric | Result |
|---|---|
| Share of commits with AI help | 14 / 30 (47%) |
| Unit tests passing after AI-assisted changes | 50 / 50 |
| Secrets committed | 0 (Git history checked 18/11/2026) |
| Invented user data in the repo | None; every result is labelled REAL, TEAM, PROXY, or SECONDARY |

---

## Part 3 - Can the suggestion logic be trusted?

| Question | Answer |
|---|---|
| Data used | None from the user except which need they tap, and their welcome picks for ordering. No wellbeing answers, no history, no network call |
| Model or prompt | None. A fixed table of 8 needs x 3 activities written by the team in [needs.ts](../../frontend/components/home/needs.ts) |
| Evaluation | 8 unit tests, all passing; TC01 Pass; real users: T1 5 of 5 succeeded, 85% faster than their usual way ([before-after.md](../test/uat/before-after.md)) |
| Bias check | The same need always gives the same three activities for every user; nothing changes by age, gender, or any personal data. The activity choices reflect the team's judgment and have not been reviewed by a wellbeing advisor (B34) |
| Limitations | Only 8 needs; it cannot understand free text; it does not learn; T1 took a median of 4 taps (target 3, ISS-04); the activities are not clinically validated |
| When it fails | If an activity ID is missing, `findSuggestion` returns nothing and the suggestion is not shown (tested). The app never claims to assess safety; Home shows a fixed line pointing to a trusted person or local emergency or support line (ISS-03 notes that no phone number is given yet) |
| Why no AI | `rule.md` forbids diagnosis and requires a separate privacy and safety review before any AI recommendation (B36-B37, Later). Sending wellbeing data to an AI service would also be sensitive-data processing under PDPA s.26 |
