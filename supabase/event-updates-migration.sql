-- ============================================================
-- EVENT UPDATES (organizer announcements / "blasts")
-- Run AFTER event-docs-media-migration.sql
--
-- Numbered, immutable updates an organizer posts to their event.
-- Posting fans out in-app + email + push to approved participants
-- (handled by /api/events/post-update) and the update is pinned on
-- the public event page — Sportity-style "publishing is the
-- notification".
-- ============================================================

create table if not exists public.event_updates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  number int not null,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz default now() not null,
  unique (event_id, number)
);

create index if not exists event_updates_event_idx on public.event_updates(event_id);

alter table public.event_updates enable row level security;

-- Updates are public announcements: anyone who can see the event page
-- can read them (pending applicants included — schedule changes matter
-- to them too).
drop policy if exists "Event updates are readable by everyone" on public.event_updates;
create policy "Event updates are readable by everyone"
  on public.event_updates for select
  using (true);

-- No insert/update/delete policies for anon/authenticated on purpose:
-- writes go exclusively through the service-role /api/events/post-update
-- route, which verifies the caller organizes the event. Updates are
-- immutable once posted (numbered like motorsport bulletins).
