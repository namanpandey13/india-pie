# Aangan v0.1

An Expo Go prototype for a Delhi NCR-only, Pie-inspired offline social app.

## Try It On Laptop

```bash
npm run web
```

Open the localhost URL Expo prints. The app starts at a fake prefilled login screen, then enters Discover.

## Try It On iPhone With Expo Go

```bash
npm start
```

Scan the QR code from Expo Go.

## Current Prototype Scope

The build is local-state only. It is meant to test flow, positioning, and trust cues before auth, backend, payments, notifications, or real chat.

- Login: fake Delhi NCR profile with phone, Instagram, LinkedIn, and intent prefilled.
- Discover: Pie-style dark feed, all/friends toggle, Delhi NCR only, filters, event cards, saved state.
- Event detail: tap an event to inspect details, organizer reputation, trust signals, prompts, and who is going.
- Host: creator-led event setup with guest list control, venue proof, pre-chat prompts, and host accountability.
- Chat: fake pre-event group chats and "stars aligned" people prompt.
- Profile: lightweight social proof and trust graph mock.

## Cofounder Alignment Baked In

- The category is a trust and social-confidence problem, not just event discovery.
- Registration is not attendance; the product must reduce the "booked to showed up" drop-off.
- Free events are good for entry but weak for commitment, so confidence signals matter.
- Hosts should behave like creators with reputation, reviews, and operational standards.
- Guest lists, identity links, and attendee previews are part of the trust layer.
- Communication should stay in-app instead of immediately collapsing into WhatsApp.

## Next Build Slice

- Persist login, profiles, events, RSVP, save, and chat state.
- Add true join request flow with host approval.
- Add host reputation and post-event review data.
- Add city/locality search after Delhi NCR feels right.
- Add notification and calendar flows only after RSVP intent tests well.
