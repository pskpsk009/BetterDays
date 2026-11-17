# UAT Kit - Real-User Testing (U01-U06)

How to run the real-user test sessions defined in `../test-plan.tex`
(Section 4: UAT tasks, Section 5: Metrics), and where to record the results.

**Status:** not run yet. Every result field is empty until a real session
happens. Do not fill any field from memory, from the Discover interviews, or
by estimate.

## Files

| File | What goes in it |
|---|---|
| `session-logs.md` | One block per user (U01-U06): background, task results, errors, quotes, interview answers |
| `before-after.md` | Before/after numbers for every MUST task (T1-T5) and the summary |
| `sus.csv` | SUS answers (10 items, 1-5). The score column calculates itself |
| `utaut2.csv` | UTAUT2 answers (18 items, 1-5). Construct scores calculate themselves |
| `issue-log.md` | Every problem seen: severity, fix commit, retest result |

Open the CSV files in Excel or Google Sheets. The formula cells calculate when
the answers are filled in.

## Participants

- Codes **U01-U06** only. No names, phone numbers, or social media handles in
  any file.
- If a participant also took part in the Discover interviews, write their
  I-code in their session log (for example "Also interviewed as I4").
- **Eligibility (test-plan.tex Section 4):** age 18-30, not enrolled in
  1305493, and not an ADT student who entered in 2566. If the team wants to
  include people outside these rules, update the test plan first and record
  the reason. Do not change a participant's details to fit.

## How to run a session online (about 20-30 minutes)

Sessions run over a video call in the social app, with the participant sharing
their phone screen.

### Before the call

1. Start the app so the participant can open it in Expo Go:
   `npx expo start --tunnel`, then send them the QR code or link.
2. Ask them to install **Expo Go** and open the app before the call starts.
3. Prepare a team test account for T3 (or let them use their own email).
4. Have a stopwatch and `session-logs.md` open. One team member gives the
   tasks (moderator) and one takes notes (note-taker).

### Message to send

> Hi! Our team is testing a wellbeing habit app called BetterDays for our
> university project. Could you try it for about 20-30 minutes on a video
> call? You'll do 5 short tasks on your phone and answer two short
> questionnaires. We test the app, not you. We won't record your name, and
> you can stop at any time. Is that okay?

### During the call

1. **Consent (2 min).** Read:
   > "BetterDays is not a diagnostic or therapy tool, and its wording has not
   > been reviewed by a wellbeing advisor yet. Please type made-up text, never
   > your real feelings. We will delete all your test data at the end. Is it
   > okay to continue?"

   Record the answer in the session log. No yes means no session.
2. **Before (5 min).** T1 and T2 the participant's usual way (search, YouTube,
   phone clock, notes). Time each one.
3. **Tasks (10-15 min).** T1-T5 in BetterDays, one at a time, read word for
   word. Do not help or point. Ask them to think aloud. Record time, success,
   taps, and errors.
4. **Questionnaires (5 min).** Send the SUS form, then the UTAUT2 form (items
   below and in `test-plan.tex` Section 5.3).
5. **Close (5 min).** Ask the three interview questions, then delete their data
   together (Profile > Delete all data).

If a participant becomes upset, stop the session, share the support-resource
information, and do not count the session.

## Tasks (read word for word)

| Task | Scenario | Success when |
|---|---|---|
| T1 | "You have an exam tomorrow and feel tense. Find something you can do right now, in about two minutes, to calm down." | A calming activity is running (e.g. Breathing Bubble, 5-Senses Grounding) |
| T2 | "You keep going to bed at different times. Set the bedtime and wake-up time you want, and note when you slept last night." | Targets saved and one night logged |
| T3 | "You would hate to lose what you saved if you lost your phone. Set BetterDays up so it is kept safe." | Signed in, consent accepted, backup on |
| T4 | "A friend is going through a really hard time. Find out where they could get help." | Crisis and support guidance is on screen |
| T5 | "You no longer want BetterDays to keep anything about you. Keep a copy for yourself, then remove everything." | Data downloaded, all data deleted and confirmed |

## SUS questionnaire (Brooke, 1996)

Scale: 1 = strongly disagree, 5 = strongly agree.

1. I think that I would like to use BetterDays frequently.
2. I found BetterDays unnecessarily complex.
3. I thought BetterDays was easy to use.
4. I think that I would need the support of a technical person to be able to use BetterDays.
5. I found the various functions in BetterDays were well integrated.
6. I thought there was too much inconsistency in BetterDays.
7. I would imagine that most people would learn to use BetterDays very quickly.
8. I found BetterDays very cumbersome to use.
9. I felt very confident using BetterDays.
10. I needed to learn a lot of things before I could get going with BetterDays.

## UTAUT2 questionnaire

Scale: 1 = strongly disagree, 5 = strongly agree. Item codes match `utaut2.csv`.

| Code | Item |
|---|---|
| PE1 | I find BetterDays useful for looking after my everyday wellbeing. |
| PE2 | Using BetterDays helps me find a small, helpful thing to do more quickly. |
| PE3 | Using BetterDays means I need fewer separate apps for notes, habits and tips. |
| EE1 | Learning how to use BetterDays is easy for me. |
| EE2 | My interaction with BetterDays is clear and understandable. |
| EE3 | I find BetterDays easy to use. |
| SI1 | People who are important to me would think I should use BetterDays. |
| SI2 | People whose opinions I value would like me to use BetterDays. |
| SI3 | People who influence my behaviour think I should use BetterDays. |
| FC1 | I have the resources necessary to use BetterDays. |
| FC2 | I have the knowledge necessary to use BetterDays. |
| FC3 | BetterDays works with the phone and other tools I already use. |
| HM1 | Using BetterDays is fun. |
| HM2 | Using BetterDays is enjoyable. |
| HM3 | Using BetterDays is entertaining. |
| BI1 | I intend to continue using BetterDays in the future. |
| BI2 | I will try to use BetterDays in my daily life. |
| BI3 | I plan to keep using BetterDays next month. |

## Closing interview

1. What did you like?
2. Where did you get stuck?
3. Would you keep using it, and why?

## Pass targets (test-plan.tex Section 5)

| Measure | Target |
|---|---|
| T1-T2 time, after vs before | At least 30% lower (median) |
| Task success | At least 80% per task |
| Errors per user | Median 1 or fewer |
| Taps to the action (T1, T4) | Median 3 or fewer |
| T3 setup time | Median 120 s or less |
| T5 data-rights taps | 5 or fewer |
| SUS | Mean 68 or higher |
| UTAUT2 PE, EE, BI | Mean 4.0 or higher |
| Issues | No severity 3-4 issue open after fixes |
