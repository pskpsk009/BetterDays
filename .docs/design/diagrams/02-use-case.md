# Diagram 2 of 4 - Use Case

Each use case maps to a Better Days requirement, privacy rule, safety rule, or
charter release gate.

```mermaid
flowchart LR
  User((Student or young adult))
  Advisor((Wellbeing advisor))
  Moderator((Story moderation process))

  subgraph BD[Better Days Wellbeing Companion]
    UC1[Create account and accept limitations\nF1, LR1]
    UC2[Complete onboarding questionnaire\nF2, NFR2]
    UC3[View focus-area scores\nF3, NFR3]
    UC4[View neutral progress profile\nF4, LR6]
    UC5[Complete daily check-in\nF5, NFR2]
    UC6[Review small recommendations\nF6, LR8]
    UC7[View weekly summary and reflection\nF7, NFR4]
    UC8[Open safety support\nF8, LR7]
    UC9[Read or submit community story\nF9, LR9]
    UC10[Report harmful story\nF9, LR10]
    UC11[View, correct, export, or delete data\nF10, LR3-LR5]
    UC12[Withdraw consent\nF1, F10, LR1, LR5]
    UC13[Review questionnaire, scoring, and safety copy\nNFR3, NFR5, charter gate]
  end

  User --> UC1
  User --> UC2
  User --> UC3
  User --> UC4
  User --> UC5
  User --> UC6
  User --> UC7
  User --> UC8
  User --> UC9
  User --> UC10
  User --> UC11
  User --> UC12
  Advisor --> UC13
  Moderator --> UC9
  Moderator --> UC10
```

## Use-case notes

- UC3 and UC4 are descriptive reflections, never diagnosis (F3, F4, LR6).
- UC8 is separate from the weighted score and does not determine safety (F8,
  LR7).
- UC9 requires moderation before publication and UC10 provides reporting (F9,
  LR9-LR10).
- UC11 and UC12 are controlled data-rights operations (F10, LR1-LR5).
