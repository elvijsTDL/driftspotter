-- Launch security hardening. Run after all existing migrations.

-- Live event writes must never be available to anon/authenticated clients.
drop policy if exists "Admins can insert events" on public.events;
drop policy if exists "Admins can update events" on public.events;

-- Applicants may edit their application, but may not decide its status.
drop policy if exists "Users can update own RSVP" on public.event_rsvps;
create policy "Users can edit pending own RSVP"
  on public.event_rsvps for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');

-- Application creation must always begin pending; trusted server code can bypass RLS.
drop policy if exists "Authenticated users can RSVP" on public.event_rsvps;
create policy "Authenticated users can apply pending"
  on public.event_rsvps for insert to authenticated
  with check (auth.uid() = user_id and status = 'pending');

-- Notifications are produced by service-role routes and SECURITY DEFINER triggers only.
drop policy if exists "System can insert notifications" on public.notifications;

-- Stop users changing privileged submission workflow fields through direct REST updates.
create or replace function public.protect_submitted_event_workflow()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then
    new.status := old.status;
    new.submitted_by := old.submitted_by;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_submitted_event_workflow on public.submitted_events;
create trigger protect_submitted_event_workflow
  before update on public.submitted_events
  for each row execute function public.protect_submitted_event_workflow();

-- Enforce upload limits in Storage itself; browser checks are only UX.
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif']
where id in ('event-images', 'profile-media');

update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array[
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'image/png', 'image/jpeg'
    ]
where id = 'event-docs';
