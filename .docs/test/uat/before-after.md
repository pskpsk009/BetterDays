# Before / After - Every MUST Task

Numbers for each MUST task (T1-T5), copied from `session-logs.md` after real
sessions. Leave a cell empty until it is measured. Targets come from
`../test-plan.tex` Section 5.

- **Before** = the participant's usual way, without BetterDays.
- **After** = the same task in BetterDays.
- T3-T5 have no usual-way equivalent, so they are compared against the
  test-plan target instead of a before time.

## MUST task map

| Task | MUST item tested | Backlog / requirement | Before measured? |
|---|---|---|---|
| T1 Calm down | Need finder and activities | F6, P2 | Yes |
| T2 Sleep times | Sleep Schedule Guidance | P1, P3 | Yes |
| T3 Backup | Account, consent, and backup | F1, F10, LR1 | No (target) |
| T4 Find help | Safety information | F8, LR7 | No (target) |
| T5 Export and delete | Data rights | F10, LR3 | No (target) |

## T1 - Calm down (time in seconds)

| User | Before: usual way used | Before (s) | After (s) | Change (%) | Taps | Success |
|---|---|---|---|---|---|---|
| U01 | | | | | | |
| U02 | | | | | | |
| U03 | | | | | | |
| U04 | | | | | | |
| U05 | | | | | | |
| U06 | | | | | | |
| **Median** | | | | | | |

Target: after at least 30% lower than before (median); taps median 3 or fewer.

## T2 - Sleep times (time in seconds)

| User | Before: usual way used | Before (s) | After (s) | Change (%) | Success |
|---|---|---|---|---|---|
| U01 | | | | | |
| U02 | | | | | |
| U03 | | | | | |
| U04 | | | | | |
| U05 | | | | | |
| U06 | | | | | |
| **Median** | | | | | |

Target: after at least 30% lower than before (median).

Change (%) = (Before - After) / Before x 100. A positive number means
BetterDays was faster.

## T3 - Backup (setup time)

| User | Setup time (s) | Success | Errors |
|---|---|---|---|
| U01 | | | |
| U02 | | | |
| U03 | | | |
| U04 | | | |
| U05 | | | |
| U06 | | | |
| **Median** | | | |

Target: median 120 s or less.

## T4 - Find help

| User | Time (s) | Taps from Home | Success | Errors |
|---|---|---|---|---|
| U01 | | | | |
| U02 | | | | |
| U03 | | | | |
| U04 | | | | |
| U05 | | | | |
| U06 | | | | |
| **Median** | | | | |

Target: taps median 3 or fewer.

## T5 - Export and delete

| User | Time (s) | Taps from Profile (before final confirm) | Success | Errors |
|---|---|---|---|---|
| U01 | | | | |
| U02 | | | | |
| U03 | | | | |
| U04 | | | | |
| U05 | | | | |
| U06 | | | | |
| **Median** | | | | |

Target: 5 taps or fewer (NFR8).

## Summary

| Task | Before (median) | After (median) | Change | Success rate | Target | Met? |
|---|---|---|---|---|---|---|
| T1 | | | | /6 | 30% faster, 80% success, 3 taps or fewer | |
| T2 | | | | /6 | 30% faster, 80% success | |
| T3 | n/a | | n/a | /6 | 120 s or less, 80% success | |
| T4 | n/a | | n/a | /6 | 3 taps or fewer, 80% success | |
| T5 | n/a | | n/a | /6 | 5 taps or fewer, 80% success | |

Errors per user (all tasks): median ____ (target 1 or fewer).

With 6 users, report medians and ranges. The Wilcoxon signed-rank test for
T1-T2 before vs after can be run once all six pairs are measured.
