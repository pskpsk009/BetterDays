# Better Days - Privacy, Safety, and Compliance Rules

**Product:** Better Days Wellbeing Companion

Better Days is a private wellbeing habit and reflection tool for students and
young adults. It is not a medical device, diagnostic service, therapy service,
crisis assessor, or replacement for professional care.

These rules are project requirements and do not replace review by a qualified
legal or wellbeing professional.

## Product boundary

- The product may help users reflect on routines and choose small practical
  actions.
- The product must not diagnose a mental-health condition or assign a clinical
  risk category.
- The product must not claim to determine whether a user is safe or in immediate
  danger.
- The profiles `Starting Point`, `Building Habits`, and `Maintaining Progress`
  are descriptive habit-support labels only.
- Serious-concern responses must be handled separately from weighted scoring.

## Personal data and sensitive wellbeing information

### What it is

Wellbeing responses, mood, stress, journal entries, and information that may
reveal health status can be sensitive personal data. The project must handle
this data lawfully, fairly, transparently, and with appropriate protection.

### Rules for the system

- Collect only information needed for reflection, habit support, safety
  messaging, moderation, account operation, or data rights.
- Explain what information is collected, why it is collected, how it is used,
  and how long it is retained before collection or processing.
- Obtain explicit consent where required before storing or processing sensitive
  wellbeing information.
- Store consent with the user, accepted text version, timestamp, and withdrawal
  status. Withdrawal must be retrievable like acceptance.
- Use wellbeing data only for the approved Better Days purpose. Do not use it for
  advertising, resale, diagnosis, treatment decisions, or unrelated profiling.
- Enforce user ownership and access control. A user must not see another user's
  check-ins, profile, journal entries, consent records, or export.
- Provide controlled access, correction, export, consent withdrawal, and
  permanent deletion workflows.
- Include private journal entries in the user's export and deletion workflow.
- Do not include private journal text in a community story unless the user makes
  a separate deliberate submission.
- Protect data in transit and at rest according to the selected technical
  architecture and deployment provider.

## Scoring and progress profiles

- Scoring must be deterministic, documented, and covered by focused automated
  tests.
- Display individual focus-area scores as well as any weighted overall score.
- Profiles must use only the approved neutral labels.
- A profile must be based on multiple focus areas, not only one overall number.
- Serious-concern answers must not be averaged away, hidden, or converted into a
  diagnosis.
- User-facing copy must not use terms such as diagnosis, disorder, clinical
  risk, recovered, medically healthy, or treatment result for a profile.
- Any change to questionnaire wording, weights, thresholds, or profile rules
  requires review and updated tests.

## Recommendations

- Recommendations must be small, practical, respectful, and optional.
- Recommendations must be linked to approved focus areas or user goals.
- Recommendations must not give medication instructions, treatment plans,
  diagnosis, or crisis counselling.
- Recommendations must not shame, blame, or imply that a user caused their own
  wellbeing difficulty.
- AI recommendations are future functionality only unless separately reviewed.
- If AI is added, the UI must disclose its use, send only minimum approved data,
  and never use AI to diagnose, assess crisis risk, or make an autonomous safety
  decision.

## Safety support

- Safety-support information must be easy to find from the main application.
- A serious-concern response must show a separate supportive message and
  professional-support or crisis-resource information.
- The app must tell a user who may be in immediate danger to contact local
  emergency services or a trusted person.
- The app must not claim that its score or algorithm determines safety.
- Resource wording must be checked for the intended user locations and reviewed
  by a qualified wellbeing advisor before release.
- Safety messaging must not be hidden because the user's overall score is high.

## Community stories and moderation

- Community stories are separate from private journals.
- A story remains private until it passes the approved moderation workflow.
- Provide reporting for harmful content, harassment, dangerous advice, crisis
  misinformation, and exposed personal information.
- Define a review, removal, and appeal process before public stories launch.
- Do not describe stories as medically verified, professional advice, or safe for
  every user.
- Do not publish identifying information without the required consent.

## Audit and access logs

- Log relevant successful and failed authentication events.
- Log access, creation, correction, export, consent change, moderation, and
  deletion actions with the responsible user and timestamp.
- Include source information such as IP address only when required by the
  approved legal and technical design.
- Retain required access or traffic logs for at least 90 days under applicable
  rules and configure the retention period explicitly.
- Keep audit records separate from user content where practical.
- Do not expose audit metadata to other users.
- Account deletion must remove account-linked wellbeing content according to the
  documented deletion window; required audit records may be retained as allowed
  by applicable rules.

## Electronic consent and records

- Consent and terms acceptance must be distinguishable from ordinary navigation.
- Store who accepted, what version was accepted, and when it happened.
- Store withdrawal with the same traceability as acceptance.
- Preserve retrievable records for consent, export, deletion requests, and future
  AI-generation events where applicable.
- Do not claim certification, professional approval, clinical validation, or
  regulatory approval unless it is real, documented, and authorized.

## Agent rules

- Do not invent user research, interview quotes, advisor approval, legal claims,
  clinical evidence, or validation outcomes.
- Do not weaken privacy, consent, safety, moderation, or deletion behavior to
  make implementation easier.
- Do not add diagnosis, treatment, crisis assessment, or unrelated profiling to
  the MVP without an explicit approved requirement and professional review.
- When requirements conflict with these rules, stop and resolve the conflict
  before writing code or design content.
