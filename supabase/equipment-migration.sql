-- ============================================================
-- EQUIPMENT SYSTEM: car equipment toggles + event requirements
-- Run AFTER garage-video-applications-migration.sql
-- ============================================================

-- What the car has (keys from src/lib/equipment.ts)
alter table public.driver_cars add column if not exists equipment text[] not null default '{}';

-- What the event requires
alter table public.events add column if not exists required_equipment text[] not null default '{}';
alter table public.submitted_events add column if not exists required_equipment text[] not null default '{}';

-- Backfill: the legacy cage_required boolean becomes a requirement entry
update public.events
set required_equipment = array['roll_cage']
where cage_required = true and not ('roll_cage' = any(required_equipment));

update public.submitted_events
set required_equipment = array['roll_cage']
where cage_required = true and not ('roll_cage' = any(required_equipment));

-- Recreate the trusted auto-approve trigger so instant-published events
-- carry required_equipment through to the live row.
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
    safety_requirements, required_equipment, event_url, image_url, media_urls, price,
    participation, organizer, series, max_participants,
    source, status, submitted_by
  ) values (
    new.id, new.name, new.date, new.end_date, new.location,
    coalesce(new.country, ''), coalesce(new.track, ''), new.lat, new.lng,
    new.category, new.cage_required, new.tire_size, new.skill_level, new.description,
    coalesce(new.safety_requirements, ''), coalesce(new.required_equipment, '{}'),
    new.event_url, new.image_url,
    coalesce(new.media_urls, '{}'), new.price,
    new.participation, new.organizer, new.series, new.max_participants,
    'user_submitted', 'approved', new.submitted_by
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
