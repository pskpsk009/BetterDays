# Role Statement - Myint Myat Pyae Sone (6631503073)

**Role:** Backend Developer

For Better Days, I worked on designing and building the backend with Supabase. Since the app deals with personal wellbeing information, we wanted users to be able to try it without sending their reflections to a server. Their activity data is saved on the device first. Making an account does not automatically upload it. I worked on the rules for the optional backup feature. If a user chooses to turn it on and agrees to the consent, selected data can be synced to Supabase. The database checks that the user is signed in with a real account and has active consent before it accept a backup. Row-level security keeps each user private records separate. If they withdraw consent, their backup is removed. Users can also export or delete their data. Shared trail posts are handled separately. My job was to build and maintain these backend parts and consider how the backend protect users in real time. I tried to keep the amount of stored data small and make sure users stay in control of it.

## Reflection

Building the backend of our app with Supabase and heavy AI assistance reshaped how I experience software engineering. Requirements became clearer and faster because AI helped me translate business needs into concrete database schemas, RLS policies, and API patterns almost immediately. Design and coding also improved: I could generate solid Supabase functions, authentication flows, and data models in minutes instead of hours, which let me iterate more. One thing that clearly got better was speed and confidence in the data layer—I shipped a working multi-table system with proper security rules far quicker than I would have alone. One thing that got worse was deep understanding and ownership. Because AI produced so much of the code, I sometimes accepted solutions without fully tracing edge cases or performance implications, which made testing and long-term quality slightly shallower than if I had written everything myself. Teamwork stayed collaborative, but the AI sometimes acted as a silent third member that reduced the need for detailed pairwise discussion on implementation details.

As a junior developer in the AI era, I sit at an interesting but still early stage. AI has raised the baseline of what juniors can produce, yet the industry still values people who can reason about trade-offs, debug production issues, and take responsibility when the generated code fails. I am currently stronger at shipping functional features quickly than at architecting systems that remain maintainable under real load and changing requirements. That gap is the real work ahead.

Next year I plan to keep strengthening my backend fundamentals while deliberately exploring blockchain development—smart contracts, on-chain data patterns, and the security mindset that comes with irreversible systems. In five years I want to be a developer who can move fluidly between traditional cloud backends and blockchain-based systems, contributing to products that combine reliable off-chain services with transparent, decentralized components.

## Evidence

- Database schema and row-level security: [backend/supabase/schema.sql](../../../backend/supabase/schema.sql)
- Backup, consent and audit tables, delete-account function: [backend/supabase/backup.sql](../../../backend/supabase/backup.sql)
- Backup sync: [frontend/components/sync/](../../../frontend/components/sync/)
- Data and permissions overview: [.docs/final/data-and-permissions.md](../data-and-permissions.md)

## AI disclosure

This statement was written without AI.
