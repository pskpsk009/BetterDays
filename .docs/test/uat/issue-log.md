# Issue Log - Real-User Testing

Every problem seen in a real session, from `session-logs.md`. One row per
issue; if several users hit the same problem, list all their codes in one row.

**Severity (Nielsen):** 0 not a problem, 1 cosmetic, 2 minor, 3 major,
4 catastrophe (must fix before release). Wording that reads as a diagnosis, or
any leak of one user's data to another, is always severity 4.

**Rule:** severity 3-4 issues are fixed and retested before the next round.

| ID | Found by (U-codes) | Task | What happened | Severity (0-4) | Fix (what changed) | Fix commit | Retest by (U-code / team) | Retest result | Status |
|---|---|---|---|---|---|---|---|---|---|
| ISS-01 | U01 | T2 Sleep times | "Unsure how to use the set date function"; task not completed without help | 2 (proposed) | | | | | Open |
| ISS-02 | U05 | T3 Backup | "Unsure about apps"; backup not set up without help | 2 (proposed) | | | | | Open |
| ISS-03 | U01, U02, U03, U04, U06 (median 4 taps) | T4 Find help | Help took a median of 4 taps from Home (target 3 or fewer). The only help text on Home is one general sentence with no phone number | 2 (proposed) | | | | | Open |
| ISS-04 | U03, U04, U05, U06 (median 4 taps) | T1 Calm down | Starting a calming activity took a median of 4 taps from Home (target 3 or fewer); U05 needed 6 | 1 (proposed) | | | | | Open |
| ISS-05 | U06 (7 taps) | T5 Export and delete | One user needed 7 taps from Profile (target 5 or fewer); median met (3.5) | 1 (proposed) | | | | | Open |

Severities are proposed from the session data; the team confirms them.
Sources: `session-logs.md` and `before-after.md` (REAL, 2-3 November 2026).

Add rows as needed (ISS-04, ISS-05, ...).

## How to fill in

1. **After each session:** copy every problem from the user's "Issues seen"
   table into a new row (or add the U-code to an existing row).
2. **Severity:** the team agrees on a severity together.
3. **Fix commit:** after fixing, paste the short commit hash, for example
   `f0effe5`. Each fix commit message should mention the issue ID, for
   example "Fix ISS-02: ...".
4. **Retest:** check the fix with a user in the next round, or with the team if
   no session is left. Write who retested and whether it passed.
5. **Status:** Fixed only after a passing retest.

## Summary

| Severity | Found | Fixed | Open |
|---|---|---|---|
| 4 Catastrophe | 0 | 0 | 0 |
| 3 Major | 0 | 0 | 0 |
| 2 Minor | 3 | 0 | 3 |
| 1 Cosmetic | 2 | 0 | 2 |
| **Total** | 5 | 0 | 5 |

Target: no severity 3-4 issue open after fixes. **Met** (no severity 3-4 issue found), but nothing is fixed or retested yet.
