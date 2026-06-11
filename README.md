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
EXPO_PUBLIC_AUTH_REDIRECT_SCHEME=hausy
EXPO_PUBLIC_AUTH_REDIRECT_PATH=auth/callback
# Optional. Leave unset for local dev and Vercel previews.
# EXPO_PUBLIC_AUTH_REDIRECT_URL=https://your-domain.com/auth/callback
```

Supabase Auth → URL Configuration, add:
```
exp://**
hausy://**
http://localhost:8081/auth/callback
https://*-<team-or-account-slug>.vercel.app/auth/callback
https://your-production-domain.com/auth/callback
```

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
