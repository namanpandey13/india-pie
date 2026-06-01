# Hardcoded Content Audit

Status: Sprint 4 Supabase integration prep.

## Removed From Frontend/API Runtime

- `packages/api/src/fixtures/dev-data/events.ts`
  - Event records, creator summaries, venue summaries, attendee previews, prompts, checkpoints, and static friend context.
  - Moved to Supabase tables and `supabase/seed.sql`.

- `packages/api/src/fixtures/dev-data/trust.ts`
  - Creator profiles, credentials, reviews, saved records, and extra checkpoints.
  - Moved to `creators`, `creator_credentials`, `creator_links`, `reviews`, `event_checkpoints`, and `saved_events`.

- `packages/api/src/fixtures/dev-data/chats.ts`
  - Plan Inbox thread/message examples.
  - Moved to `plan_inbox_threads` and `plan_inbox_messages`.

- `packages/api/src/fixtures/dev-data/profile.ts`
  - Demo user profile.
  - Replaced by Supabase Auth user plus `profiles`, with an auth trigger creating profile rows for new sign-ins.

- `apps/mobile/features/rsvp/use-rsvp-request.ts`
  - Removed the `current-user` RSVP ID.
  - RSVP creation now uses the authenticated Supabase user through `@hausy/api`.

- `packages/api/src/services/events.ts`
  - Removed hardcoded launch city and discovery tags.
  - Discovery metadata now reads from `discovery_markets` and `discovery_tags`.

- `packages/api/src/services/host.ts`
  - Removed hardcoded creator starter templates.
  - Creator Studio formats now read from `creator_templates`.

## Still Static By Design

- Product navigation labels, empty-state copy, button labels, and section headings remain in the app because they are interface copy, not business data.
- Discovery taxonomy and creator templates are now database content, not runtime constants.

## New Supabase Content Surfaces

- Public discovery: `events`, `event_sessions`, `venues`, `creators`, `event_tags`, `event_prompts`, `event_attendee_previews`, `event_checkpoints`.
- Discovery taxonomy: `discovery_markets`, `discovery_tags`, `creator_templates`.
- Trust: `creator_credentials`, `creator_links`, `reviews`.
- User actions: `saved_events`, `rsvp_requests`.
- Coordination: `plan_inbox_threads`, `plan_inbox_messages`.
- Identity: `auth.users`, `profiles`, plus `handle_new_user()` trigger.

## Remaining Follow-Up

- Apply the migration and seed against local/staging Supabase.
- Generate typed Supabase database types after the first remote schema is applied.
