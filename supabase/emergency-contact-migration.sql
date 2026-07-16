-- ============================================================
-- Emergency contact for drivers
-- ------------------------------------------------------------
-- Lots of track days require an emergency contact on file.
-- This is sensitive PII, so it lives in its own table and is
-- NEVER public — not even for drivers whose profile_visibility
-- is 'public'. It is readable only by:
--   * the driver themselves
--   * admins
--   * organizers of an event the driver is APPROVED for
--     (so they have it on hand on race day)
--
-- Run manually in the Supabase SQL editor.
-- ============================================================

create table if not exists public.driver_emergency_contacts (
  user_id               uuid primary key references public.profiles(id) on delete cascade,
  contact_name          text not null,
  contact_phone         text not null,
  contact_relationship  text,
  updated_at            timestamptz not null default now()
);

alter table public.driver_emergency_contacts enable row level security;

-- SECURITY DEFINER so the check can read event_rsvps/events without
-- recursing into this table's own RLS. Approved-only on purpose: an
-- organizer gets the contact once the driver has an approved spot at
-- one of their events, not merely on application.
create or replace function public.can_view_emergency_contact(driver_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    driver_id = auth.uid()
    or coalesce((select is_admin from public.profiles where id = auth.uid()), false)
    or exists (
      select 1
      from public.event_rsvps r
      join public.events e on e.id::text = r.event_id
      where r.user_id = driver_id
        and r.status = 'approved'
        and e.submitted_by = auth.uid()
    );
$$;

-- Never granted to anon — emergency contacts are for signed-in eyes only.
grant execute on function public.can_view_emergency_contact(uuid) to authenticated;

-- Read: owner, admins, approved-event organizers.
drop policy if exists "Emergency contact viewable by owner and approved organizers" on public.driver_emergency_contacts;
create policy "Emergency contact viewable by owner and approved organizers"
  on public.driver_emergency_contacts for select
  using (public.can_view_emergency_contact(user_id));

-- Write: only the driver, only their own row.
drop policy if exists "Drivers manage own emergency contact" on public.driver_emergency_contacts;
create policy "Drivers manage own emergency contact"
  on public.driver_emergency_contacts for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------
-- Presence-only lookup: which of these drivers have a contact
-- on file, WITHOUT exposing the PII. Unlike the row RLS (approved
-- only), this uses "applied to" so an organizer can see the flag
-- on PENDING applicants and chase a missing contact before
-- approving. Returns only user_ids the caller is entitled to know
-- about (the driver themselves, admins, or an organizer of an
-- event the driver applied to — any status).
-- ------------------------------------------------------------
create or replace function public.applicants_with_emergency_contact(driver_ids uuid[])
returns table (user_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select c.user_id
  from public.driver_emergency_contacts c
  where c.user_id = any(driver_ids)
    and (
      c.user_id = auth.uid()
      or coalesce((select is_admin from public.profiles where id = auth.uid()), false)
      or exists (
        select 1
        from public.event_rsvps r
        join public.events e on e.id::text = r.event_id
        where r.user_id = c.user_id
          and e.submitted_by = auth.uid()
      )
    );
$$;

grant execute on function public.applicants_with_emergency_contact(uuid[]) to authenticated;

-- ------------------------------------------------------------
-- Per-event requirement: organizer can mark that a driver MUST
-- have an emergency contact on file to apply. Media applications
-- are never gated (they don't drive).
-- ------------------------------------------------------------
alter table public.events           add column if not exists requires_emergency_contact boolean not null default false;
alter table public.submitted_events add column if not exists requires_emergency_contact boolean not null default false;

-- Server-side enforcement so the rule can't be bypassed by a raw client
-- insert. SECURITY DEFINER so it can read the (RLS-protected) contact table.
create or replace function public.enforce_emergency_contact_on_rsvp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  needs boolean;
begin
  -- Only driver applications are gated
  if new.role is distinct from 'driver' then
    return new;
  end if;

  select coalesce(e.requires_emergency_contact, false) into needs
  from public.events e
  where e.id::text = new.event_id;

  if coalesce(needs, false) and not exists (
    select 1 from public.driver_emergency_contacts c where c.user_id = new.user_id
  ) then
    raise exception 'EMERGENCY_CONTACT_REQUIRED'
      using errcode = 'check_violation',
            hint = 'Add an emergency contact to your profile before applying.';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_emergency_contact_on_rsvp on public.event_rsvps;
create trigger enforce_emergency_contact_on_rsvp
  before insert on public.event_rsvps
  for each row execute function public.enforce_emergency_contact_on_rsvp();

-- ------------------------------------------------------------
-- Carry requires_emergency_contact through trusted instant-publish.
-- (Recreates the trigger fn from event-docs-media-migration with the
--  new column added — run this AFTER that migration.)
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
    safety_requirements, required_equipment, accepts_media, requires_emergency_contact,
    event_url, image_url, media_urls, price,
    participation, organizer, series, max_participants,
    source, status, submitted_by
  ) values (
    new.id, new.name, new.date, new.end_date, new.location,
    coalesce(new.country, ''), coalesce(new.track, ''), new.lat, new.lng,
    new.category, new.cage_required, new.tire_size, new.skill_level, new.description,
    coalesce(new.safety_requirements, ''), coalesce(new.required_equipment, '{}'),
    coalesce(new.accepts_media, false), coalesce(new.requires_emergency_contact, false),
    new.event_url, new.image_url,
    coalesce(new.media_urls, '{}'), new.price,
    new.participation, new.organizer, new.series, new.max_participants,
    'user_submitted', 'approved', new.submitted_by
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
