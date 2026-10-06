# Prototype - Better Days low-fidelity wireframes

- Date: 2026-09-08
- Fidelity: **low - layout and content only**
- Product: Better Days Wellbeing Companion
- Visual file: `Better_Days_App_Design.zip` contains the clickable prototype.

These wireframes define what each MVP screen contains and why. Visual styling,
colors, type, and spacing can be refined by the designer. The product must stay
calm, private, accessible, and non-clinical.

## S1 - Welcome and consent · F1, LR1

```
+--------------------------------+
|          BETTER DAYS           |
|                                |
|  A gentler way to notice       |
|  your days.                    |
|                                |
|  Reflect on routines and       |
|  choose small next steps.      |
|                                |
|  This is not diagnosis,        |
|  therapy, or emergency care.   |
|                                |
|  [ ] I understand the limits   |
|  [ ] I agree to the privacy    |
|      and wellbeing information |
|                                |
|          [ Begin ]             |
+--------------------------------+
```

Consent is explicit and stored with accepted text version and timestamp (F1,
LR1, LR5).

## S2 - Onboarding questionnaire · F2, NFR2

```
+--------------------------------+
|  Getting to know your routine  |
|              3 of 12           |
|                                |
|  How has your sleep felt       |
|  recently?                     |
|                                |
|  1      2      3      4      5 |
|  low                           high
|                                |
|        [ Back ] [ Continue ]   |
+--------------------------------+
```

Questions cover sleep, stress, connection, enjoyable activity, work/study, and
functioning. The user can review answers before submitting (F2).

## S3 - Progress profile · F3, F4, NFR3, NFR4, LR6

```
+--------------------------------+
|       Your current snapshot    |
|                                |
|        BUILDING HABITS         |
|  A neutral reflection profile, |
|  not a medical assessment.     |
|                                |
|  Sleep       3.2 / 5           |
|  Stress      2.8 / 5           |
|  Connection  3.7 / 5           |
|  Activity    2.9 / 5           |
|                                |
|       [ See small actions ]    |
+--------------------------------+
```

Individual focus-area values remain visible. A serious concern is never
represented by this profile alone (F3, F4, LR6, LR7).

## S4 - Daily check-in · F5, NFR2

```
+--------------------------------+
|       Today's check-in         |
|          under 2 minutes       |
|                                |
|  Mood          1  2  3  4  5  |
|  Sleep         1  2  3  4  5  |
|  Stress        1  2  3  4  5  |
|  Connection    1  2  3  4  5  |
|  Activity      1  2  3  4  5  |
|                                |
|  Optional note [              ]|
|          [ Save check-in ]     |
+--------------------------------+
```

Optional notes remain private and are included in export and deletion workflows.

## S5 - Small recommendations · F6, LR8

```
+--------------------------------+
|          Small next steps      |
|                                |
|  Based on your recent check-in:|
|                                |
|  [ ] Put your phone away 20    |
|      minutes before bed        |
|      Focus: sleep and rest     |
|                                |
|  [ ] Message someone you trust |
|      Focus: connection         |
|                                |
|        [ Done ] [ Skip ]       |
+--------------------------------+
```

Suggestions are optional, practical, and non-clinical. No medication, diagnosis,
or treatment instructions are shown (F6, LR8).

## S6 - Weekly summary · F7, NFR4

```
+--------------------------------+
|        Your week in view       |
|                                |
|  Check-ins completed     5 / 7 |
|  Sleep          reported higher|
|  Stress         reported lower |
|  Connection     about the same |
|                                |
|  What helped this week?        |
|  [                            ] |
|                                |
|  [ Set a goal for next week ]  |
+--------------------------------+
```

Use neutral trends and never label the user's mental or physical health (F7,
LR6, NFR4).

## S7 - Private journal · F7, LR2-LR4

```
+--------------------------------+
|        Private reflection      |
|                                |
|  This note is private to you.  |
|                                |
|  [ Write what you noticed... ] |
|                                |
|        [ Save privately ]      |
+--------------------------------+
```

Private reflections are separate from community submissions and included in
user data rights workflows.

## S8 - Community stories · F9, LR9, LR10

```
+--------------------------------+
|        Community stories       |
|  Personal experiences reviewed |
|  before publication.            |
|                                |
|  Finding a calmer morning      |
|  A student's reflection        |
|                         [ Read ]|
|                                |
|  [ Share for review ]          |
|  [ Report a story ]             |
+--------------------------------+
```

A story remains private until moderation is complete.

## S9 - Safety support · F8, LR7

```
+--------------------------------+
|          You deserve support   |
|  If you may be in immediate     |
|  danger, contact local emergency|
|  services or a trusted person.  |
|                                |
|  [ Professional support ]       |
|  [ Crisis resources ]           |
|  [ Return to Better Days ]      |
+--------------------------------+
```

This path is separate from scoring and does not claim to assess safety.

## S10 - Privacy and data management · F1, F10, LR3-LR5

```
+--------------------------------+
|       Your data and privacy    |
|  Stored: check-ins, profile,   |
|  reflections, preferences      |
|                                |
|  Consent status: Active        |
|  [ Download my data ]          |
|  [ Correct my data ]           |
|  [ Change consent ]            |
|  [ Delete my account ]         |
+--------------------------------+
```

Deletion requires clear confirmation and a controlled, auditable workflow.

## Screen-to-requirement map

| Screen | Requirements |
|---|---|
| S1 Welcome and consent | F1, LR1, LR5 |
| S2 Onboarding | F2, NFR2 |
| S3 Progress profile | F3, F4, NFR3, NFR4, LR6, LR7 |
| S4 Daily check-in | F5, NFR2 |
| S5 Recommendations | F6, LR8, NFR6 |
| S6 Weekly summary | F7, NFR4, LR6 |
| S7 Private journal | F7, LR2, LR3, LR4 |
| S8 Community stories | F9, LR9, LR10 |
| S9 Safety support | F8, LR7, LR8 |
| S10 Data management | F1, F10, LR3-LR5, NFR7-NFR10 |
