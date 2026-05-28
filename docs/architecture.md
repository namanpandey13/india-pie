# HAUSY — ENGINEERING RULES & ARCHITECTURE PRINCIPLES
Version: v1
Status: Core Engineering Guardrails
Last Updated: May 2026

---

# 1. ENGINEERING PHILOSOPHY

Hausy prioritizes:
- maintainability
- scalability
- clarity
- modularity
- fast iteration

We optimize for:
long-term product velocity,
NOT short-term hacks.

---

# 2. CORE STACK

Locked Stack:

- Turborepo
- Next.js
- React Native + Expo
- TypeScript
- Supabase
- PostgreSQL
- Zustand
- TanStack Query
- Zod
- Tailwind / NativeWind

Do NOT introduce alternative frameworks casually.

---

# 3. MONOREPO STRUCTURE

/apps
  /web
  /mobile

/packages
  /ui
  /types
  /config
  /design-tokens
  /api
  /utils

/docs

/supabase

---

# 4. ARCHITECTURE PRINCIPLES

## Principle 1 — Shared Types Everywhere

All API contracts must use shared types.

Never duplicate interfaces.

Use:
- Zod schemas
- inferred TypeScript types

---

## Principle 2 — Thin UI Components

Components should render.

Business logic belongs elsewhere.

Avoid:
- fetch logic inside components
- massive screen files
- inline transformations

---

## Principle 3 — Service Layer First

All backend interactions go through:
- service layer
- API abstraction layer

Never directly scatter database logic across components.

---

## Principle 4 — Reusable Primitives

Before creating a new component:
check if an existing primitive can be extended.

Avoid duplicate:
- buttons
- cards
- modals
- inputs

---

## Principle 5 — Semantic Design Tokens

Never hardcode:
- colors
- spacing
- typography values

Always use semantic tokens.

Example:
GOOD:
bg-surface-primary

BAD:
bg-[#FFFFFF]

---

# 5. STATE MANAGEMENT RULES

## Zustand

Use for:
- client UI state
- lightweight shared app state

Avoid:
- backend cache duplication

---

## TanStack Query

Use for:
- server state
- caching
- async fetching
- mutations

Never replace TanStack Query with Zustand.

---

# 6. DATABASE PRINCIPLES

Supabase/PostgreSQL is the source of truth.

Model relationships carefully.

Primary entities:
- users
- hosts
- events
- RSVPs
- communities
- reviews
- attendance history

Design for:
- trust systems
- relationship graphs
- future recommendations

---

# 7. API DESIGN RULES

APIs should be:
- typed
- predictable
- composable

Never:
- return inconsistent shapes
- leak internal structures
- mix concerns

---

# 8. FILE STRUCTURE RULES

Feature-first architecture preferred.

Example:

/features/events
/features/auth
/features/profile

Avoid:
- giant shared junk folders
- random utilities
- unclear naming

---

# 9. COMPONENT RULES

Each component should:
- do one thing well
- be composable
- remain visually predictable

Avoid:
- giant “god components”
- deeply nested conditional rendering

---

# 10. DESIGN SYSTEM RULES

UI primitives belong in:
/packages/ui

Never duplicate primitives inside features.

---

# 11. AI CODING GUARDRAILS

AI tools are accelerators,
NOT architects.

AI-generated code MUST:
- follow existing patterns
- preserve architecture consistency
- reuse primitives
- avoid unnecessary dependencies
- remain modular

AI must NOT:
- invent architecture
- introduce new styling systems
- add duplicate libraries
- create duplicate components
- bypass shared types

---

# 12. PERFORMANCE PRINCIPLES

Optimize:
- perceived speed
- navigation responsiveness
- image loading
- list virtualization

Avoid premature optimization.

Ship first.
Measure second.
Optimize third.

---

# 13. DEPLOYMENT STRATEGY

## Web
Deploy via:
- Vercel

## Backend
Deploy via:
- Supabase Cloud

## Mobile
Deploy via:
- Expo EAS

---

# 14. BRANCH STRATEGY

main
→ production-ready only

develop
→ integration branch

feature/*
→ isolated features

Never push unstable code to main.

---

# 15. CODE QUALITY RULES

Required:
- ESLint
- Prettier
- strict TypeScript
- Husky hooks

No ignored TypeScript errors.

---

# 16. SCALABILITY PHILOSOPHY

Do NOT prematurely optimize with:
- microservices
- Kubernetes
- distributed systems

Monolith-first approach preferred.

Scale complexity only when necessary.

---

# 17. SECURITY PRINCIPLES

Never trust client-side validation.

All critical validation must exist:
- server-side
- database-level where possible

Use:
- Row Level Security
- secure auth flows
- permission boundaries

---

# 18. FUTURE ENGINEERING DIRECTION

Potential future expansions:
- recommendation systems
- trust scoring
- social graph intelligence
- event quality ranking
- recurring communities
- AI-assisted community discovery

Current architecture should remain flexible enough to support these later.

---

# 19. FINAL PRINCIPLE

Clarity over cleverness.

Simple scalable systems beat impressive complicated systems.

Every engineer and AI agent working on Hausy should prioritize:
- readability
- maintainability
- consistency
- trustworthiness
