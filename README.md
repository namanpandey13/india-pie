# Hausy v0.1

Hausy is a trust-first social discovery product for real-world experiences and recurring communities.

This repo is organized as a Turborepo monorepo:

- `apps/mobile`: Expo SDK 54 app.
- `apps/web`: placeholder Next.js shell.
- `packages/design-tokens`: semantic color and typography tokens.
- `packages/types`: shared Zod schemas and inferred TypeScript contracts.
- `packages/ui`: shared UI package entrypoint.
- `packages/api`: typed service boundary for mobile/web data access.
- `supabase`: launch MVP schema, RLS policies, and seed guidance.

## Try It On Laptop

```bash
npm run web --workspace=@hausy/mobile
```

Open the localhost URL Expo prints. The app starts at Google sign-in and then enters the launch MVP tabs.

## Try It On iPhone With Expo Go

```bash
npm run start --workspace=@hausy/mobile
```

Scan the QR code from Expo Go.

## Security And Repo Hygiene

Use `.env.example` for placeholders only. Real secrets belong in local ignored `.env` files,
Supabase project settings, EAS secrets, or deployment provider environment variables.

Before pushing, run:

```bash
npm run audit:tracked
npm run audit:secrets
```

If `audit:tracked` reports generated files or credentials, remove them from Git while keeping
the local copy:

```bash
git rm --cached <path>
```

## Launch MVP Scope

The launch MVP is trust-first and production-shaped. Frontend screens use typed API contracts and empty production adapters until Supabase is connected.

- Auth: Google OAuth through Supabase.
- Home: calm summary of RSVP, saved, inbox, and creator status.
- Explore: planning and confirmed creator-led plans with loading, empty, and error states.
- Saved: saved plans backed by service contracts.
- Plan Inbox: event-thread updates and RSVP context, not generic chat.
- Profile: social proof, comfort settings, and Creator Studio entry.
- Creator Studio: creator-led event drafts submitted for review, not open self-publishing.

## Cofounder Alignment Baked In

- The category is a trust and social-confidence problem, not just event discovery.
- Registration is not attendance; the product must reduce the "booked to showed up" drop-off.
- Free events are good for entry but weak for commitment, so lifecycle labels and verified readiness checkpoints matter.
- Hosts should behave like Hausy Creators with reputation, reviews, and operational standards.
- Guest lists, identity links, and attendee previews are part of the trust layer.
- Communication should stay in-app instead of immediately collapsing into WhatsApp.

## Supabase Setup

Create local ignored env files from the examples. The Expo app reads the one inside `apps/mobile` when you run `npm run start --workspace=@hausy/mobile`.

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
EXPO_PUBLIC_AUTH_REDIRECT_SCHEME=hausy
EXPO_PUBLIC_AUTH_REDIRECT_PATH=auth/callback
```

Use publishable client keys only in Expo. Never commit Supabase secret keys, service-role keys, OAuth client secrets, EAS credentials, or native signing files.

For Google OAuth, add this redirect URL to Supabase Auth redirect allow list:

```text
hausy://auth/callback
```

In Google Cloud OAuth, configure Supabase's callback URL:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```
