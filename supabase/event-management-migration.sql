-- Event Management System Migration
-- Run this in Supabase Dashboard SQL editor before testing

-- 1. Add is_admin to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 2. Add missing columns to submitted_events (to match events table)
ALTER TABLE public.submitted_events
  ADD COLUMN IF NOT EXISTS track text DEFAULT '',
  ADD COLUMN IF NOT EXISTS country text DEFAULT '',
  ADD COLUMN IF NOT EXISTS series text,
  ADD COLUMN IF NOT EXISTS price text,
  ADD COLUMN IF NOT EXISTS max_participants integer;

-- 3. Add submitted_by to events table (link approved events to organizer)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES public.profiles(id);

-- 4. Add max_participants to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS max_participants integer;

-- 5. Allow organizers to UPDATE their own submitted events
CREATE POLICY "Users can update own submitted events"
  ON public.submitted_events FOR UPDATE USING (auth.uid() = submitted_by);

-- 6. Replace submitted_events SELECT policy to include admin access
DROP POLICY IF EXISTS "Users can view own submitted events" ON public.submitted_events;
CREATE POLICY "Users and admins can view submitted events"
  ON public.submitted_events FOR SELECT USING (
    auth.uid() = submitted_by
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 7. Migrate existing RSVPs and change constraint
UPDATE public.event_rsvps SET status = 'approved' WHERE status = 'going';
UPDATE public.event_rsvps SET status = 'pending' WHERE status = 'interested';
ALTER TABLE public.event_rsvps DROP CONSTRAINT IF EXISTS event_rsvps_status_check;
ALTER TABLE public.event_rsvps ADD CONSTRAINT event_rsvps_status_check
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- 8. Add message column to event_rsvps
ALTER TABLE public.event_rsvps ADD COLUMN IF NOT EXISTS message text;

-- 9. Allow organizers to view + update RSVPs for their approved events
CREATE POLICY "Organizers can view RSVPs for their events"
  ON public.event_rsvps FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_rsvps.event_id::uuid
        AND events.submitted_by = auth.uid()
    )
  );

CREATE POLICY "Organizers can update RSVPs for their events"
  ON public.event_rsvps FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_rsvps.event_id::uuid
        AND events.submitted_by = auth.uid()
    )
  );

-- 10. Notification triggers for applications
CREATE OR REPLACE FUNCTION public.notify_event_application()
RETURNS trigger AS $$
DECLARE
  organizer_id uuid;
  applicant_name text;
  event_name text;
BEGIN
  SELECT submitted_by INTO organizer_id FROM public.events WHERE id::text = NEW.event_id;
  IF organizer_id IS NULL THEN RETURN NEW; END IF;
  SELECT username INTO applicant_name FROM public.profiles WHERE id = NEW.user_id;
  SELECT name INTO event_name FROM public.events WHERE id::text = NEW.event_id;

  IF organizer_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, title, body, link) VALUES (
      organizer_id, 'event',
      'New event application',
      applicant_name || ' applied to attend "' || LEFT(event_name, 50) || '"',
      '/my-events'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_event_application ON public.event_rsvps;
CREATE TRIGGER on_event_application
  AFTER INSERT ON public.event_rsvps
  FOR EACH ROW EXECUTE FUNCTION public.notify_event_application();

-- Notify user when organizer approves/rejects
CREATE OR REPLACE FUNCTION public.notify_rsvp_decision()
RETURNS trigger AS $$
DECLARE
  event_name text;
  status_label text;
BEGIN
  IF OLD.status = NEW.status THEN RETURN NEW; END IF;
  SELECT name INTO event_name FROM public.events WHERE id::text = NEW.event_id;
  IF NEW.status = 'approved' THEN status_label := 'approved';
  ELSIF NEW.status = 'rejected' THEN status_label := 'declined';
  ELSE RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, type, title, body, link) VALUES (
    NEW.user_id, 'event',
    'Application ' || status_label,
    'Your application to "' || LEFT(event_name, 50) || '" has been ' || status_label,
    '/events'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_rsvp_decision ON public.event_rsvps;
CREATE TRIGGER on_rsvp_decision
  AFTER UPDATE ON public.event_rsvps
  FOR EACH ROW EXECUTE FUNCTION public.notify_rsvp_decision();
