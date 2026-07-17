-- Organizer review queue: a shortlist is intentionally not an approval decision.
ALTER TABLE public.event_rsvps
  ADD COLUMN IF NOT EXISTS shortlisted boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS event_rsvps_shortlisted_idx
  ON public.event_rsvps (event_id, shortlisted)
  WHERE status = 'pending';
