# Diagram 4 of 4 - Activity

The core flow separates wellbeing reflection from safety support. Serious-concern
answers are never reduced to the weighted score.

```mermaid
flowchart TD
  Start([User opens Better Days]) --> Consent{Privacy and wellbeing
limitations accepted?}
  Consent -->|No| Explain[Explain collection, purpose,
and product limitations\nF1, LR1-LR2]
  Explain --> Consent
  Consent -->|Yes| Onboard[Complete 10-15 question
onboarding questionnaire\nF2, NFR2]
  Onboard --> Valid{Required answers complete?}
  Valid -->|No| Missing[Show missing answers]
  Missing --> Onboard
  Valid -->|Yes| Score[Calculate focus-area and
weighted scores deterministically\nF3, NFR3]
  Score --> Concern{Serious-concern response?}
  Concern -->|Yes| Safety[Show separate professional and
crisis-support information\nF8, LR7-LR8]
  Concern -->|No| Profile[Show area scores and one neutral profile\nF4, LR6]
  Safety --> Profile
  Profile --> Checkin[Complete daily check-in\nF5, NFR2]
  Checkin --> Concern2{Serious concern in check-in?}
  Concern2 -->|Yes| Safety2[Show separate support path\nDo not change profile]
  Concern2 -->|No| Recommend[Show one or two small actions\nF6, LR8]
  Safety2 --> Recommend
  Recommend --> Weekly[Review weekly summary and
private reflection\nF7, NFR4]
  Weekly --> DataRights[Optional export, correction,
consent withdrawal, or deletion\nF10, LR3-LR5]
  DataRights --> End([Workflow complete])

  AI[Optional AI recommendation service] -.->|minimum context only;
never diagnosis or crisis assessment| Recommend
```

## Decision-point notes

- Consent must be recorded before sensitive wellbeing processing (F1, LR1).
- Missing answers cannot produce a misleading profile (F2, NFR3).
- Safety support is independent from the weighted score (F8, LR7, NFR5).
- Recommendations remain practical and non-clinical (F6, LR8).
- Data rights remain available after normal use (F10, LR3-LR5).
- Optional AI is not part of the first MVP and cannot make safety decisions
  (LR11, NFR11).
