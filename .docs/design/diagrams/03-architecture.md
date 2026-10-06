# Diagram 3 of 4 - Architecture

```mermaid
flowchart LR
  Browser[React / mobile-first frontend\nF1-F10, NFR7]
  API[Authenticated Better Days API\nLR2-LR5]
  Auth[Authentication service\nF1, LR4]
  Score[Deterministic scoring service\nF3-F4, NFR3-NFR4]
  Safety[Safety support service/content\nF8, LR7-LR8]
  Recommend[Recommendation rules\nF6, LR8]
  Moderation[Story moderation workflow\nF9, LR9-LR10]
  Data[(Protected wellbeing data\ncheck-ins, profiles, journals\nLR1-LR4)]
  Audit[(Separate audit log\nLR5, NFR10)]
  Resources[Local support resources\nF8, LR7]
  OptionalAI[Optional AI service\nNFR11, LR11]

  Browser --> API
  API <--> Auth
  API --> Score
  API --> Safety
  API --> Recommend
  API --> Moderation
  API <--> Data
  API --> Audit
  Safety --> Resources
  API -.->|future minimum approved context| OptionalAI
```

## Component responsibilities

- **Frontend:** collects input and displays results; it never makes clinical or
  safety decisions.
- **API:** authenticates requests, enforces ownership, and controls data rights.
- **Scoring service:** applies documented deterministic focus-area and profile
  rules (F3, F4, NFR3, NFR4).
- **Recommendation rules:** returns small non-clinical actions (F6, LR8).
- **Safety service:** shows support information separately from scoring (F8,
  LR7).
- **Moderation workflow:** keeps stories private until review (F9, LR9-LR10).
- **Audit log:** records consent, access, export, correction, moderation, and
  deletion actions (LR5, NFR10).

## Explicit trade-off

The project uses a **separate deterministic scoring service and protected data
store** instead of putting scoring directly in the frontend. This adds API and
test setup, but it makes scoring consistent across devices, keeps sensitive
rules out of the browser, and makes safety behavior easier to audit (F3, LR1,
LR5, NFR3).
