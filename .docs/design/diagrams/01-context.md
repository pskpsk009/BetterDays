# Diagram 1 of 4 - Context

Better Days is shown as one system boundary. External services are limited to
identity, protected storage, support resources, and future optional AI.

```mermaid
flowchart LR
  User[Student or young adult\nF1-F10, P1-P3]
  Advisor[Qualified wellbeing advisor\nRelease review gate]
  BetterDays[Better Days Wellbeing Companion\nF1-F10, LR1-LR11]
  Identity[Identity provider\nF1, LR4]
  Store[(Protected wellbeing data store\nLR1-LR5)]
  Audit[(Access and consent audit log\nLR5, NFR10)]
  Support[Professional and crisis resources\nF8, LR7]
  Moderation[Story moderation process\nF9, LR9-LR10]
  AI[Optional AI recommendation service\nNFR11, LR11]

  User -->|consent, questionnaire, check-ins, journal| BetterDays
  BetterDays -->|profile, recommendations, summaries, support| User
  BetterDays <--> Identity
  BetterDays <--> Store
  BetterDays --> Audit
  BetterDays --> Support
  User -->|story submission or report| BetterDays
  BetterDays --> Moderation
  Advisor -->|reviews wording, scoring, safety| BetterDays
  BetterDays -.->|future minimum context only| AI
```

## Boundary notes

- Private journals and check-ins stay inside Better Days and the protected store
  (F5, F7, LR2-LR4).
- Safety resources are presented separately from scoring (F8, LR7).
- AI is optional future work and cannot diagnose, assess crisis risk, or make
  autonomous safety decisions (LR11).
- Moderation is an operational boundary for stories; private journals are not
  visible to it unless deliberately submitted (F9, LR9-LR10).
