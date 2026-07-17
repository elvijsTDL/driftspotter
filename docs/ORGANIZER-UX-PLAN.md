# Organizer UX Plan — Command Center, Updates & Event Board

*2026-07-18 — synthesis of a codebase flow audit + competitive research (Sportity, MotorsportReg, RaceHero, Luma, Eventbrite).*

## Why

Organizer tooling works but is scattered: docs and applicants live inside collapsible
cards on `/my-events`, there is **no way to message the grid** (the #1 gap — a schedule
change today means abusing the share-link email or hoping drivers re-read the page),
and the attendee's participant area is buried at the bottom of a long event modal.

## What the competition teaches

- **Sportity** (FIA digital notice board — WRC, drift champs): an event is a channel;
  organizers publish docs into folders and **publishing IS the notification** (push with
  custom text, scheduled go-live). Zero-friction access via password, no accounts.
  Weaknesses: one-way, no identities (can't see *who* read what), dated UX.
- **Luma**: the **Blast** — an always-visible one-line composer on the event dashboard;
  one send fans out to email + push + in-app + a copy on the event page. Advanced mode
  adds targeting (going/pending ≙ our approved/pending, ticket type ≙ our driver/media).
- **MotorsportReg**: one-click audience reports (entry list for timing, **medical sheet**,
  gate list), guided check-in with first-timer flags.
- **RaceHero** shut down Dec 2024 → free "follow event, get alerts" space is open.
- **Our edge**: driver identities + applications, which Sportity fundamentally lacks —
  we can do read receipts, per-driver state, and profiles they can't.

## The three moves

1. **Per-event command center** — `/my-events/[eventId]` page replaces inline expansion.
   Header vitals (status, capacity, pending count, countdown) + persistent quick-action
   row (Post update · Upload doc · Share link · Review applicants · Edit · View live).
2. **The Update primitive (blast)** — numbered, immutable event updates. One composer;
   send fans out to in-app + email + push for approved participants and the update is
   pinned on the public event page ("Update #3 · Gates open 8am").
3. **Event Board** — docs + links + updates converge into one chronological feed with
   NEW badges; for approved attendees it moves to the top of the event page as their hub.

## Implementation state

| Piece | Status |
|---|---|
| `supabase/event-updates-migration.sql` (`event_updates` table + RLS) | ✅ built — **run manually in Supabase Dashboard** |
| `/api/events/post-update` (ownership-verified fanout: in-app + email + push) | ✅ built |
| `event-update` email template | ✅ built |
| `useEventUpdates` hook | ✅ built |
| Command center page + `/my-events` list simplification | ✅ built |
| Updates section on public event page/modal | ✅ built |
| Participant area moved up for approved users | ✅ built |
| My Applications sorted by event date | ✅ built |

## Next steps (not yet built)

- **Notify-on-edit prompt**: editing date/time/location of a live event offers a
  pre-drafted update to the grid.
- **Applicant list: status filter tabs, name search, bulk approve/reject.**
- **Audience views**: printable Medical Sheet (emergency contacts of approved drivers),
  gate list export.
- **Event-day check-in mode** on the applicant list (equipment/contact checklist,
  "1st event" badge).
- **NEW badges / read receipts** on board items (needs per-user last-seen tracking) —
  then per-driver "seen Update #3" for organizers, our anti-Sportity differentiator.
- **Update targeting** (pending vs approved, drivers vs media) + scheduled go-live.
- **Digest emails** for link shares (batch within an hour).
- Deliberately skipped for now: payments, waitlists, chat.
