# Hausy v0.1

Trust-first social discovery for real-world experiences and recurring communities.

## Quick Start

### Laptop (Web)
```bash
npm run web
```

### iPhone (Expo Go)
```bash
npm run start --workspace=@hausy/mobile
```

## Local Setup

Create `apps/mobile/.env.local`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Authentication currently uses email and password only. For frictionless test accounts, open Supabase Dashboard -> Authentication -> Sign In / Providers -> Email and temporarily disable **Confirm email**. Re-enable confirmation before production.

Before pushing:
```bash
npm run audit:tracked
npm run audit:secrets
```

---

## Production Backlog

| Task | Status |
|------|--------|
| Replace wildcard OAuth URIs with production domain in Supabase | ☐ |
