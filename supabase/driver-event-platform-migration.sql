-- ============================================================
-- DRIVER PROFILES + EVENT PLATFORM MIGRATION
-- Run AFTER event-management-migration.sql in the Supabase
-- Dashboard SQL editor.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Driver profile fields (bio, socials, car photos)
-- ------------------------------------------------------------
alter table public.profiles add column if not exists bio text not null default '';
alter table public.profiles add column if not exists facebook text;
alter table public.profiles add column if not exists tiktok text;
alter table public.profiles add column if not exists youtube text;
alter table public.profiles add column if not exists car_photos text[] not null default '{}';

-- ------------------------------------------------------------
-- 2. Event media + safety requirements
-- ------------------------------------------------------------
alter table public.events add column if not exists media_urls text[] not null default '{}';
alter table public.events add column if not exists safety_requirements text not null default '';

alter table public.submitted_events add column if not exists media_urls text[] not null default '{}';
alter table public.submitted_events add column if not exists safety_requirements text not null default '';

-- These three were previously added via the dashboard only; make sure
-- they exist so this migration is complete on a fresh database.
alter table public.submitted_events add column if not exists image_url text;
alter table public.submitted_events add column if not exists lat double precision;
alter table public.submitted_events add column if not exists lng double precision;

-- ------------------------------------------------------------
-- 3. Storage buckets + policies
--    event-images  : event cover / gallery images
--    profile-media : avatars + car photos
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('profile-media', 'profile-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  using (bucket_id in ('event-images', 'profile-media'));

-- Uploads are namespaced per user: {user_id}/filename
drop policy if exists "Users upload own media" on storage.objects;
create policy "Users upload own media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('event-images', 'profile-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own media" on storage.objects;
create policy "Users update own media"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('event-images', 'profile-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own media" on storage.objects;
create policy "Users delete own media"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('event-images', 'profile-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ------------------------------------------------------------
-- 4. Driver stats (events attended / upcoming) — SECURITY DEFINER
--    so counts work even though raw RSVP rows are restricted.
-- ------------------------------------------------------------
create or replace function public.get_driver_stats(driver_ids uuid[])
returns table (user_id uuid, events_attended bigint, upcoming_events bigint)
language sql
security definer
set search_path = public
stable
as $$
  select
    r.user_id,
    count(*) filter (where e.date < current_date)::bigint as events_attended,
    count(*) filter (where e.date >= current_date)::bigint as upcoming_events
  from public.event_rsvps r
  join public.events e on e.id::text = r.event_id
  where r.user_id = any(driver_ids)
    and r.status = 'approved'
  group by r.user_id;
$$;

grant execute on function public.get_driver_stats(uuid[]) to anon, authenticated;

-- ------------------------------------------------------------
-- 5. RSVP privacy fix
--    The base migration left ALL rsvps (incl. application messages)
--    publicly readable. Restrict public reads to approved rows;
--    applicants still see their own, organizers see their events'.
-- ------------------------------------------------------------
drop policy if exists "RSVPs are viewable by everyone" on public.event_rsvps;

drop policy if exists "Approved RSVPs are viewable by everyone" on public.event_rsvps;
create policy "Approved RSVPs are viewable by everyone"
  on public.event_rsvps for select
  using (status = 'approved');

drop policy if exists "Users can view own RSVPs" on public.event_rsvps;
create policy "Users can view own RSVPs"
  on public.event_rsvps for select
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. Helpful indexes
-- ------------------------------------------------------------
create index if not exists event_rsvps_user_idx on public.event_rsvps(user_id);
create index if not exists event_rsvps_event_idx on public.event_rsvps(event_id);
create index if not exists events_submitted_by_idx on public.events(submitted_by);

-- ------------------------------------------------------------
-- 7. Organizer roles & trust lifecycle
--    none     : regular driver account — cannot submit events (default)
--    pending  : requested organizer access, awaiting admin review
--    standard : approved organizer — each event reviewed before publishing
--    trusted  : whitelisted — events publish instantly
--    blocked  : cannot submit events
-- ------------------------------------------------------------
alter table public.profiles add column if not exists organizer_status text not null default 'none';

do $$ begin
  alter table public.profiles drop constraint if exists profiles_organizer_status_check;
  alter table public.profiles add constraint profiles_organizer_status_check
    check (organizer_status in ('none', 'pending', 'standard', 'trusted', 'blocked'));
end $$;

-- Onboarding role choice + organizer request details
alter table public.profiles add column if not exists account_type text
  check (account_type in ('driver', 'organizer', 'both'));
alter table public.profiles add column if not exists organizer_name text;
alter table public.profiles add column if not exists organizer_website text;
alter table public.profiles add column if not exists organizer_about text;
alter table public.profiles add column if not exists organizer_requested_at timestamptz;

-- Grandfather: anyone who already submitted events keeps organizer access
update public.profiles p
set organizer_status = 'standard'
where p.organizer_status = 'none'
  and exists (select 1 from public.submitted_events se where se.submitted_by = p.id);

-- Only approved organizers can submit events
drop policy if exists "Authenticated users can submit events" on public.submitted_events;
drop policy if exists "Non-blocked users can submit events" on public.submitted_events;
drop policy if exists "Approved organizers can submit events" on public.submitted_events;
create policy "Approved organizers can submit events"
  on public.submitted_events for insert
  with check (
    auth.uid() = submitted_by
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and organizer_status in ('standard', 'trusted')
    )
  );

-- SECURITY FIX: the base "Users can update own profile" policy lets users
-- write ANY column, including is_admin and organizer_status. This trigger
-- reverts privileged columns on end-user requests; the only self-service
-- transition allowed is requesting organizer access (none -> pending).
-- Service-role and SQL-editor sessions are unaffected.
create or replace function public.protect_privileged_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') then
    new.is_admin := old.is_admin;
    if new.organizer_status is distinct from old.organizer_status then
      if old.organizer_status = 'none' and new.organizer_status = 'pending' then
        new.organizer_requested_at := now();
      else
        new.organizer_status := old.organizer_status;
      end if;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_privileged_profile_columns on public.profiles;
create trigger protect_privileged_profile_columns
  before update on public.profiles
  for each row execute function public.protect_privileged_profile_columns();

-- Tell every admin when someone requests organizer access
create or replace function public.notify_organizer_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.organizer_status = 'pending' and old.organizer_status is distinct from 'pending' then
    insert into public.notifications (user_id, type, title, body, link)
    select p.id, 'system',
      'New organizer request',
      coalesce(new.organizer_name, new.username) || ' wants to become an event organizer',
      '/admin'
    from public.profiles p
    where p.is_admin = true and p.id <> new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_organizer_request on public.profiles;
create trigger on_organizer_request
  after update on public.profiles
  for each row execute function public.notify_organizer_request();

-- Trusted organizers: submissions are approved and published immediately.
-- BEFORE INSERT so we can stamp status without a self-update; the column
-- defaults (incl. id) are already applied when row triggers fire.
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

  -- events.lat/lng are NOT NULL; fall back to normal review if missing
  if new.lat is null or new.lng is null then
    return new;
  end if;

  new.status := 'approved';

  insert into public.events (
    id, name, date, end_date, location, country, track, lat, lng,
    category, cage_required, tire_size, skill_level, description,
    safety_requirements, event_url, image_url, media_urls, price,
    participation, organizer, series, max_participants,
    source, status, submitted_by
  ) values (
    new.id, new.name, new.date, new.end_date, new.location,
    coalesce(new.country, ''), coalesce(new.track, ''), new.lat, new.lng,
    new.category, new.cage_required, new.tire_size, new.skill_level, new.description,
    coalesce(new.safety_requirements, ''), new.event_url, new.image_url,
    coalesce(new.media_urls, '{}'), new.price,
    new.participation, new.organizer, new.series, new.max_participants,
    'user_submitted', 'approved', new.submitted_by
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_trusted_event_submitted on public.submitted_events;
create trigger on_trusted_event_submitted
  before insert on public.submitted_events
  for each row execute function public.auto_approve_trusted_events();

-- ------------------------------------------------------------
-- 8. Driver profile visibility
--    public     : anyone can view the full profile (default)
--    organizers : only the driver, admins, and organizers of
--                 events the driver applied to can view it
-- ------------------------------------------------------------
alter table public.profiles add column if not exists profile_visibility text not null default 'public';

do $$ begin
  alter table public.profiles add constraint profiles_visibility_check
    check (profile_visibility in ('public', 'organizers'));
exception when duplicate_object then null; end $$;

-- SECURITY DEFINER so the check can read profiles/rsvps without
-- recursing into the profiles RLS policy that calls it.
create or replace function public.can_view_profile(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce((select profile_visibility from public.profiles where id = profile_id), 'public') = 'public'
    or profile_id = auth.uid()
    or coalesce((select is_admin from public.profiles where id = auth.uid()), false)
    or exists (
      select 1
      from public.event_rsvps r
      join public.events e on e.id::text = r.event_id
      where r.user_id = profile_id
        and e.submitted_by = auth.uid()
    );
$$;

grant execute on function public.can_view_profile(uuid) to anon, authenticated;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Profiles are viewable based on visibility" on public.profiles;
create policy "Profiles are viewable based on visibility"
  on public.profiles for select
  using (public.can_view_profile(id));

-- Username + avatar stay visible everywhere (comments, attendee lists)
-- even for private profiles — only the full profile is gated.
create or replace function public.get_public_profiles(profile_ids uuid[])
returns table (id uuid, username text, avatar_url text)
language sql
stable
security definer
set search_path = public
as $$
  select id, username, avatar_url
  from public.profiles
  where id = any(profile_ids);
$$;

grant execute on function public.get_public_profiles(uuid[]) to anon, authenticated;

-- ------------------------------------------------------------
-- 9. Driver garage — multiple cars per driver
--    Legacy profiles.car/car_year/mods/car_photos are migrated
--    into this table and become read-only fallbacks.
-- ------------------------------------------------------------
create table if not exists public.driver_cars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  car text not null,
  car_year text,
  mods text,
  photos text[] not null default '{}',
  is_primary boolean not null default false,
  created_at timestamptz default now() not null
);

create index if not exists driver_cars_user_idx on public.driver_cars(user_id);
-- at most one primary car per driver
create unique index if not exists driver_cars_primary_idx on public.driver_cars(user_id) where is_primary;

alter table public.driver_cars enable row level security;

drop policy if exists "Cars follow profile visibility" on public.driver_cars;
create policy "Cars follow profile visibility"
  on public.driver_cars for select
  using (public.can_view_profile(user_id));

drop policy if exists "Users can add own cars" on public.driver_cars;
create policy "Users can add own cars"
  on public.driver_cars for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own cars" on public.driver_cars;
create policy "Users can update own cars"
  on public.driver_cars for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own cars" on public.driver_cars;
create policy "Users can delete own cars"
  on public.driver_cars for delete
  using (auth.uid() = user_id);

-- Migrate the legacy single-car fields into the garage (once)
insert into public.driver_cars (user_id, car, car_year, mods, photos, is_primary)
select p.id, p.car, p.car_year, p.mods, coalesce(p.car_photos, '{}'), true
from public.profiles p
where p.car is not null and p.car <> ''
  and not exists (select 1 from public.driver_cars dc where dc.user_id = p.id);

-- ------------------------------------------------------------
-- 10. Event reminder log — dedupes the daily reminder cron so a
--     driver never gets two reminders for the same event.
--     Service-role only (no anon/authenticated policies).
-- ------------------------------------------------------------
create table if not exists public.event_reminder_log (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  sent_at timestamptz default now() not null,
  unique (event_id, user_id)
);

alter table public.event_reminder_log enable row level security;

-- ------------------------------------------------------------
-- 11. Point application-decision notifications at /my-applications
-- ------------------------------------------------------------
create or replace function public.notify_rsvp_decision()
returns trigger as $$
declare
  event_name text;
  status_label text;
begin
  if old.status = new.status then return new; end if;
  select name into event_name from public.events where id::text = new.event_id;
  if new.status = 'approved' then status_label := 'approved';
  elsif new.status = 'rejected' then status_label := 'declined';
  else return new;
  end if;

  insert into public.notifications (user_id, type, title, body, link) values (
    new.user_id, 'event',
    'Application ' || status_label,
    'Your application to "' || left(event_name, 50) || '" has been ' || status_label,
    '/my-applications'
  );
  return new;
end;
$$ language plpgsql security definer;
