# SUS Results

System Usability Scale (Brooke, 1996), 10 items on a 1-5 scale. Raw answers
and formulas for the included users are in `sus.csv`.

**Responses received:** 9. **Included:** 6 (U01-U06). **Removed:** 3 (see
"Removed responses" below). Users are coded in the order their responses
appear in the form sheet.

Answer coding: Strongly Disagree = 1, Disagree = 2, Neither Agree nor
Disagree = 3, Agree = 4, Strongly Agree = 5.

**Scoring:** odd items (positive) score s - 1, even items (negative) score
5 - s; the total is multiplied by 2.5 to give 0-100.

## Scores (included users)

| User | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | SUS | Grade (Sauro & Lewis) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| U01 | 4 | 3 | 4 | 3 | 4 | 1 | 4 | 2 | 3 | 3 | 67.5 | C |
| U02 | 4 | 2 | 5 | 1 | 5 | 1 | 4 | 2 | 3 | 2 | 82.5 | A |
| U03 | 3 | 4 | 4 | 2 | 3 | 3 | 4 | 2 | 3 | 1 | 62.5 | D |
| U04 | 2 | 2 | 4 | 2 | 2 | 2 | 4 | 2 | 3 | 2 | 62.5 | D |
| U05 | 5 | 2 | 4 | 3 | 5 | 2 | 4 | 2 | 4 | 3 | 75.0 | B |
| U06 | 4 | 3 | 4 | 2 | 4 | 2 | 4 | 2 | 5 | 2 | 75.0 | B |

## Summary

| Measure | Value |
|---|---|
| Mean | **70.8** |
| SD | 8.0 |
| Median | 71.25 |
| Range | 62.5 - 82.5 |
| Grade of the mean | C (average) |
| Target (test-plan.tex Section 5.2) | Mean 68 or higher |
| **Target met?** | **Yes** (2.8 above target) |
| Users at or above 68 | 3 of 6 (U02, U05, U06) |

## What the answers show

- **Easy to learn:** all 6 agreed that most people would learn the app very
  quickly (Q7).
- **Not hard to use:** all 6 disagreed that the app was very hard to use (Q8).
- **Confidence is the weakest point:** 4 of 6 were neutral on "I felt very
  confident using the system" (Q9). Look for where users hesitated in the
  session notes.
- **Lowest scores:** U03 and U04 (62.5). U04 disagreed with "I would like to
  use this system frequently" (Q1) and "functions were well integrated" (Q5).
  Link these to issues in `issue-log.md` once session notes are available.

## Removed responses

The last three responses in the form sheet were removed at the team's
request on 17/11/2026.

**Reason:** _to be confirmed by the team_ (for example: did not complete a
test session, outside eligibility rules, or duplicate submission).

| Response | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | SUS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Removed 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 100.0 |
| Removed 2 | 3 | 4 | 2 | 3 | 3 | 3 | 4 | 3 | 2 | 4 | 42.5 |
| Removed 3 | 4 | 3 | 3 | 3 | 2 | 5 | 2 | 3 | 3 | 5 | 37.5 |

For transparency, the mean of all 9 responses was 67.2 (SD 19.3), just
below the target of 68.

## Notes on the method

- The form used the standard SUS wording with "this system". Item 8 said
  "very hard to use" instead of the original "very cumbersome to use", a
  common plain-English variant. This is a small change from the test plan,
  which says no item is reworded.
- The test plan asks for a mean and SD, not item-by-item results; the item
  notes above are for finding problems only.
- With 6 responses the mean has a wide margin of error, so 70.8 should be read
  as "about average", not a strong result.
