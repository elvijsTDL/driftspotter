-- ============================================================
-- EVENT DOCUMENTS + MEDIA APPLICATIONS
-- Run AFTER equipment-migration.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. Media applications
--    Applications carry a role; events opt in to media passes.
-- ------------------------------------------------------------
alter table public.event_rsvps add column if not exists role text not null default 'driver';

do $$ begin
  alter table public.event_rsvps add constraint event_rsvps_role_check
    check (role in ('driver', 'media'));
exception when duplicate_object then null; end $$;

alter table public.events add column if not exists accepts_media boolean not null default false;
alter table public.submitted_events add column if not exists accepts_media boolean not null default false;

-- ------------------------------------------------------------
-- 2. Event documents (briefings, timetables, regulations...)
--    Metadata here; files in the PRIVATE `event-docs` bucket.
--    Readable only by the organizer, admins, and APPROVED applicants.
-- ------------------------------------------------------------
create table if not exists public.event_documents (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  uploaded_by uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  file_path text not null,
  size_bytes bigint,
  created_at timestamptz default now() not null
);

create index if not exists event_documents_event_idx on public.event_documents(event_id);

alter table public.event_documents enable row level security;

drop policy if exists "Docs readable by organizer and approved applicants" on public.event_documents;
create policy "Docs readable by organizer and approved applicants"
  on public.event_documents for select
  using (
    exists (
      select 1 from public.events e
      where e.id = event_documents.event_id and e.submitted_by = auth.uid()
    )
    or exists (
      select 1 from public.event_rsvps r
      where r.event_id = event_documents.event_id::text
        and r.user_id = auth.uid()
        and r.status = 'approved'
    )
    or coalesce((select is_admin from public.profiles where id = auth.uid()), false)
  );

drop policy if exists "Organizers manage own event docs" on public.event_documents;
create policy "Organizers manage own event docs"
  on public.event_documents for insert
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.events e
      where e.id = event_documents.event_id and e.submitted_by = auth.uid()
    )
  );

drop policy if exists "Organizers delete own event docs" on public.event_documents;
create policy "Organizers delete own event docs"
  on public.event_documents for delete
  using (
    exists (
      select 1 from public.events e
      where e.id = event_documents.event_id and e.submitted_by = auth.uid()
    )
  );

-- Private bucket: files are served via signed URLs / authed downloads only.
insert into storage.buckets (id, name, public)
values ('event-docs', 'event-docs', false)
on conflict (id) do nothing;

-- Paths are {event_id}/{filename}
drop policy if exists "Event docs readable by organizer and approved" on storage.objects;
create policy "Event docs readable by organizer and approved"
  on storage.objects for select
  using (
    bucket_id = 'event-docs' and (
      exists (
        select 1 from public.events e
        where e.id::text = (storage.foldername(name))[1] and e.submitted_by = auth.uid()
      )
      or exists (
        select 1 from public.event_rsvps r
        where r.event_id = (storage.foldername(name))[1]
          and r.user_id = auth.uid()
          and r.status = 'approved'
      )
      or coalesce((select is_admin from public.profiles where id = auth.uid()), false)
    )
  );

drop policy if exists "Organizers upload event docs" on storage.objects;
create policy "Organizers upload event docs"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'event-docs'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[1] and e.submitted_by = auth.uid()
    )
  );

drop policy if exists "Organizers delete event doc files" on storage.objects;
create policy "Organizers delete event doc files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'event-docs'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[1] and e.submitted_by = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- 3. Event links (post-event galleries, Google Drive folders...)
--    Organizer and any APPROVED participant can add; visible to
--    the same circle as documents.
-- ------------------------------------------------------------
create table if not exists public.event_links (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  added_by uuid references public.profiles(id) on delete cascade not null,
  label text not null,
  url text not null,
  created_at timestamptz default now() not null
);

create index if not exists event_links_event_idx on public.event_links(event_id);

alter table public.event_links enable row level security;

drop policy if exists "Links readable by organizer and approved applicants" on public.event_links;
create policy "Links readable by organizer and approved applicants"
  on public.event_links for select
  using (
    exists (
      select 1 from public.events e
      where e.id = event_links.event_id and e.submitted_by = auth.uid()
    )
    or exists (
      select 1 from public.event_rsvps r
      where r.event_id = event_links.event_id::text
        and r.user_id = auth.uid()
        and r.status = 'approved'
    )
    or coalesce((select is_admin from public.profiles where id = auth.uid()), false)
  );

drop policy if exists "Organizer and approved participants add links" on public.event_links;
create policy "Organizer and approved participants add links"
  on public.event_links for insert
  with check (
    added_by = auth.uid()
    and (
      exists (
        select 1 from public.events e
        where e.id = event_links.event_id and e.submitted_by = auth.uid()
      )
      or exists (
        select 1 from public.event_rsvps r
        where r.event_id = event_links.event_id::text
          and r.user_id = auth.uid()
          and r.status = 'approved'
      )
    )
  );

drop policy if exists "Own links and organizer can delete" on public.event_links;
create policy "Own links and organizer can delete"
  on public.event_links for delete
  using (
    added_by = auth.uid()
    or exists (
      select 1 from public.events e
      where e.id = event_links.event_id and e.submitted_by = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- 4. Carry accepts_media through trusted instant-publish
-- ------------------------------------------------------------
create or replace function public.auto_approve_trusted_events()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  submitter_status text;
begin
  select organizer_status into submitter_status
  from public.profiles where id = new.submitted_by;

  if submitter_status is distinct from 'trusted' then
    return new;
  end if;

  if new.lat is null or new.lng is null then
    return new;
  end if;

  new.status := 'approved';

  insert into public.events (
    id, name, date, end_date, location, country, track, lat, lng,
    category, cage_required, tire_size, skill_level, description,
    safety_requirements, required_equipment, accepts_media,
    event_url, image_url, media_urls, price,
    participation, organizer, series, max_participants,
    source, status, submitted_by
  ) values (
    new.id, new.name, new.date, new.end_date, new.location,
    coalesce(new.country, ''), coalesce(new.track, ''), new.lat, new.lng,
    new.category, new.cage_required, new.tire_size, new.skill_level, new.description,
    coalesce(new.safety_requirements, ''), coalesce(new.required_equipment, '{}'),
    coalesce(new.accepts_media, false),
    new.event_url, new.image_url,
    coalesce(new.media_urls, '{}'), new.price,
    new.participation, new.organizer, new.series, new.max_participants,
    'user_submitted', 'approved', new.submitted_by
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
