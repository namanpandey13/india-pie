# HAUSY — UX, PRODUCT & BRAND SYSTEM
Version: v1
Status: Foundational Product Document
Last Updated: May 2026

---

# 1. PRODUCT VISION

Hausy exists to help people discover meaningful real-world experiences and communities through trust-first social discovery.

The product is not optimized for content consumption.

It is optimized for:
- attendance
- human connection
- recurring communities
- host trust
- real-world memories

Core emotional outcome:
> “I found people and experiences I genuinely want to return to.”

---

# 2. BRAND POSITIONING

## Product Personality

Hausy should feel:

- calm
- premium
- trustworthy
- intentional
- warm
- real
- socially intelligent
- minimal
- emotionally safe

Hausy should NEVER feel:

- tacky
- noisy
- “startup gradient”
- crypto-like
- gaming-inspired
- dopamine-feed optimized
- cluttered
- over-animated
- AI-generated

---

# 3. UX INSPIRATION REFERENCES

## Airbnb Experiences
Reference:
https://www.airbnb.co.in/experiences

What we adopt:
- trust-centric hierarchy
- elegant spacing
- premium photography
- clean booking flow
- host identity visibility
- beautiful reviews
- calm information density
- simple navigation
- strong emotional reassurance

What we improve:
- hosts become central
- recurring community identity
- stronger attendee trust visibility
- social compatibility signals
- more intimate experience framing

---

## Apple App Store UX

Hausy should emulate:
- premium typography hierarchy
- calm layouts
- whitespace discipline
- polished spacing
- restrained UI
- predictable interactions
- elegant cards
- subtle transitions
- clean visual rhythm

The App Store aesthetic works because:
- users instantly trust it
- cognitive load is low
- typography is extremely controlled
- visual hierarchy is obvious

Hausy should feel similarly polished.

---

## Luma

What we learn from Luma:
- event discovery structure
- social utility
- fast event browsing
- clean cards

What we avoid:
- over-colorful interfaces
- inconsistent visual rhythm
- “vibe-coded” aesthetics
- weak premium identity
- weak typography discipline

Hausy must feel:
more premium,
more emotionally intentional,
and more timeless.

---

# 4. DESIGN PRINCIPLES

## Principle 1 — Calm Interfaces

Every screen should reduce anxiety.

Users should never feel:
- overwhelmed
- rushed
- visually attacked

The interface should feel:
- breathable
- spacious
- reassuring

---

## Principle 2 — Trust Before Action

Users should trust before they RSVP.

Trust signals must appear early:
- host
- attendee quality
- reviews
- social proof
- real imagery
- event tone

---

## Principle 3 — Real Over Artificial

Only use:
- real photography
- authentic imagery
- real spaces
- real faces

Avoid:
- AI-generated imagery
- abstract illustrations
- synthetic visuals

Hausy should feel grounded in reality.

---

## Principle 4 — One Primary Action

Every screen should have:
ONE dominant action.

Never compete CTAs.

Example:
- RSVP
- Join Waitlist
- Save Event

Only one should dominate visually.

---

## Principle 5 — Predictability

Navigation should feel obvious.

Users should never think:
“Where do I go next?”

---

# 5. VISUAL DESIGN SYSTEM

## NO GRADIENTS

Gradients are prohibited.

Reasons:
- reduce timelessness
- often feel trendy/tacky
- weaken premium perception
- create visual inconsistency

Use:
- solid surfaces
- subtle depth
- spacing
- typography hierarchy

---

# 6. TYPOGRAPHY SYSTEM

Typography is critical to premium perception.

Use:
- Inter
- SF Pro
- Geist
- Airbnb/Clean modern sans-serif families

Typography should feel:
- neutral
- modern
- readable
- elegant

Avoid:
- decorative fonts
- futuristic fonts
- playful fonts
- startup gimmick fonts

---

## Typography Hierarchy

### H1
Large emotional headlines.

### H2
Section headers.

### H3
Card titles.

### Body
Readable long-form text.

### Caption
Metadata and subtle information.

Typography should create hierarchy BEFORE color does.

---

# 7. COLOR PHILOSOPHY

Hausy should use restrained colors.

Primary feeling:
- warm neutral
- premium monochrome
- subtle earth-inspired accents

Avoid:
- neon
- saturated gradients
- excessive accent colors

Suggested direction:
- soft white
- warm gray
- charcoal
- muted black
- subtle beige/stone tones

Brand accent:
- Hausy Coral is the single primary brand accent.
- Use it for primary CTAs, active navigation, key trust highlights, and small status signals.
- Do not use rainbow accents, neon palettes, or multiple competing feature colors.
- Secondary colors should remain neutral or semantic system states only.

---

# 8. SPACING PHILOSOPHY

Whitespace is part of the brand.

Hausy should breathe.

Rules:
- generous vertical spacing
- clear section separation
- avoid dense grids
- avoid visual crowding

Users should feel:
calm,
not stimulated.

---

# 9. IMAGE SYSTEM

Photography is one of the most important trust mechanisms.

Image rules:
- authentic
- human
- warm lighting
- social realism
- natural environments
- candid moments

Avoid:
- stock-feeling imagery
- fake smiling
- hyper-processed photos
- AI visuals

Hosts should appear real and approachable.

---

# 10. CREATOR-HOST EXPERIENCE

Unlike Airbnb Experiences,
Hausy highlights the CREATOR heavily.

Hausy Creators are real-life creator/operators for offline experiences.

They are similar in importance to YouTube creators:
- users follow them for taste, judgment, and community quality
- their reputation compounds across plans
- their profile is a trust anchor, not a listing footnote
- their past events, reviews, and repeat attendees define credibility

Creators are:
- trust anchors
- community builders
- emotional tone setters

Creator sections should prominently show:
- profile
- credibility
- philosophy
- community tone
- past events
- reviews
- recurring attendees

Creator Studio should feel like a calm publishing flow:
- create a plan
- choose or propose a venue
- prove venue/route/context
- explain guest fit
- submit for Hausy review
- receive plan inbox updates

Open self-publishing is not part of the launch MVP.

## Creator Verification

Creator verification is part of the creator profile workflow.

Hausy does not treat creator applications as a separate public product object.
The creator profile moves through:
- Draft
- In review
- Approved
- Paused
- Rejected

Verification documents are private.

Rules:
- document files live in private storage only
- public creator profiles never expose document URLs
- document metadata can show review state internally
- document states are Uploaded, Approved, or Rejected
- document review is implied while the creator profile is In review

This keeps the public creator profile simple while preserving strong internal review.

---

# 10A. VENUE MODEL

Venues are first-class trust entities.

Events should reference a venue instead of storing venue text directly.

Venue states:
- Unverified — added from creator input or early sourcing
- Verified — checked by Hausy or a trusted operator
- Restricted — not available for new plans

Venue UI should show:
- name
- locality
- city
- verified/restricted state when relevant
- route or meeting-point proof when available

Venue onboarding can scale later without changing event structure.

---

# 10B. EVENT LIFECYCLE

Hausy does not use a generic “published” state.

Event states are intentionally sequential:

1. Draft — creator is editing privately.
2. In review — submitted to Hausy for quality/safety review.
3. Planning — visible for interest or early RSVP, but not guaranteed yet.
4. Confirmed — creator has committed venue/time/plan; cancellation affects creator reliability.
5. Cancelled — event will not happen.
6. Completed — event happened and can receive attendance/reviews.

Public discovery may show Planning and Confirmed events.

Planning events should feel transparent:
- users can express interest
- users may request to join when enabled
- Hausy does not imply the event is guaranteed

Confirmed events should feel stronger:
- creator has committed
- venue/time/plan are verified enough to proceed
- cancellation affects creator reliability

Do not show raw confidence scores or hidden trust metrics in UI.
Show clear lifecycle labels and verified readiness checkpoints instead.

Readiness checkpoints may include:
- venue verified
- route proof added
- guest list reviewed
- creator confirmed

Only positive verified checkpoints should be visible to users.

---

# 10C. RSVP, INTEREST & ATTENDANCE COMMITMENT

Hausy separates interest from attendance commitment.

Interest:
- means “keep me updated”
- does not reserve a spot
- does not affect reliability if withdrawn

RSVP request:
- user asks to join
- creator/Hausy can accept, decline, or waitlist

Accepted:
- user is allowed to attend
- user still needs to confirm the attendance promise

Confirmed:
- user has promised to attend
- no-show can affect user reliability

Attendance outcomes:
- Attended
- No-show
- Excused

Future booking fees or deposits may reinforce commitment, but payments are not part of the launch MVP.

---

# 10D. SOCIAL PROFILES, FOLLOWS & CONNECTIONS

Hausy profiles should feel like calm social portfolios, not settings pages.

Every user profile can show:
- public identity
- bio and city
- social links
- interests
- plans attended
- reviews given and received
- uploaded media
- followers and following
- connections

Creator profiles extend user profiles with:
- creator positioning
- community tone
- past plans
- repeat attendee signal
- creator reviews
- current or upcoming plans

Relationship model:
- following a profile is lightweight social interest
- following a creator is creator/community interest
- connections are stronger friend-like relationships, usually mutual or post-event
- blocked relationships prevent contact and discovery surfaces

---

# 11. REVIEWS SYSTEM

Reviews should feel:
- human
- emotional
- specific

Good reviews:
“I met 3 people I still talk to weekly.”

Bad reviews:
“Great event.”

Encourage meaningful reflection.

---

# 12. INFORMATION HIERARCHY

Priority order on event pages:

1. Hero Image
2. Event Name
3. Host
4. Social Trust Signals
5. What You’ll Do
6. Attendee Vibe
7. Reviews
8. Logistics
9. RSVP

Trust before logistics.

---

# 13. CORE NAVIGATION

MVP Navigation:

- Home
- Explore
- Saved
- Plan Inbox
- Profile

Creator Studio lives inside Profile, not as a primary tab.

Avoid:
- excessive tabs
- hidden complexity
- nested navigation

---

# 14. UX WRITING STYLE

Tone should feel:
- human
- calm
- warm
- intelligent
- concise

Avoid:
- hype language
- startup buzzwords
- aggressive growth copy

---

# 15. MOTION & ANIMATION

Motion should:
- guide
- reassure
- soften transitions

Motion should NEVER:
- distract
- entertain unnecessarily
- feel playful for no reason

Use:
- subtle fades
- gentle scale transitions
- smooth card movement

Avoid:
- bouncing
- flashy transitions
- excessive motion

---

# 16. MVP UX FLOWS

## Flow 1 — Discover Event
Open App
→ Explore Feed
→ Open Event
→ Inspect Trust
→ RSVP

---

## Flow 2 — RSVP
Open Event
→ Review Host
→ Review Attendees
→ Pick Date
→ Confirm RSVP

---

## Flow 3 — Post Event
Attend Event
→ Share Reflection
→ Save Connections
→ Follow Host

---

# 17. COLD START STRATEGY

Potential early-stage issue:
lack of event imagery.

Temporary strategy:
- source real location imagery
- curated real photos
- Google Maps/place imagery where legal/appropriate

Goal:
Maintain realism and trust.

Never use fake AI-generated event imagery.

---

# 18. LONG TERM PRODUCT PRINCIPLE

Hausy is not a social media app.

It is:
- an offline social infrastructure layer
- a trust network
- a community discovery system

Success metric is NOT:
time spent scrolling.

Success metric IS:
real-world recurring participation.

---

# 19. CURRENT EVENT DETAIL RULES

These rules override older event-page hierarchy guidance in this document.

- Keep event detail visually lean and image-led.
- Order content as: hero image, event identity, date/place, RSVP comment, host, attendees, visual prompts.
- RSVP should feel like sending a like with a comment, not completing a booking form.
- Place RSVP near the top; do not require deep scrolling before expressing interest.
- Do not add dedicated trust, logistics, reviews, or experience sections when they repeat existing information.
- Reviews appear only when recurring events or previous editions make them meaningful.
- Use one concise section label. Do not pair small eyebrows with redundant large section titles.
- Do not place divider lines above the event title.
- Write date and place naturally; avoid uppercase labels such as WHEN and WHERE.
- Use the brand color for the primary action and rare emphasis only.
- Prefer whitespace, photography, and typography over bordered containers.
- Keep the first hero image slightly shorter than a full-screen poster.
- Host details are directly tappable; do not add a separate View profile button.
- Use Hinge-inspired image and prompt moments to add personality without repeating the event description.
- Every piece of text must earn its place. Remove explanatory copy that the interface already communicates.
- Event recurrence is explicit data, not inferred from names. First editions display New; later editions display the number of previous occurrences as a compact honor mark.
- Recurrence marks must be consistent across Explore, Vizz, event cards, and event detail.
- Segment event detail with strong single labels, generous spacing, and image rhythm. Do not use paired eyebrow/title headings or repeated divider boxes.
