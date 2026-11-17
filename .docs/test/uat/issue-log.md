# Issue Log - Real-User Testing

Every problem seen in a real session, from `session-logs.md`. One row per
issue; if several users hit the same problem, list all their codes in one row.

**Severity (Nielsen):** 0 not a problem, 1 cosmetic, 2 minor, 3 major,
4 catastrophe (must fix before release). Wording that reads as a diagnosis, or
any leak of one user's data to another, is always severity 4.

**Rule:** severity 3-4 issues are fixed and retested before the next round.

| ID | Found by (U-codes) | Task | What happened | Severity (0-4) | Fix (what changed) | Fix commit | Retest by (U-code / team) | Retest result | Status |
|---|---|---|---|---|---|---|---|---|---|
| ISS-01 | | | | | | | | Pass / Fail | Open / Fixed / Won't fix |
| ISS-02 | | | | | | | | Pass / Fail | Open / Fixed / Won't fix |
| ISS-03 | | | | | | | | Pass / Fail | Open / Fixed / Won't fix |

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
| 4 Catastrophe | | | |
| 3 Major | | | |
| 2 Minor | | | |
| 1 Cosmetic | | | |
| **Total** | | | |

Target: no severity 3-4 issue open after fixes.
