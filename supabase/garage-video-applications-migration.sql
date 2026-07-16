-- ============================================================
-- GARAGE UPGRADE: horsepower, videos, apply-with-any-car
-- Run AFTER driver-event-platform-migration.sql
-- ============================================================

-- Horsepower is the number drifters care about; year stays optional
alter table public.driver_cars add column if not exists horsepower integer;

-- Video links (YouTube etc.) per car — embedded on the driver profile
alter table public.driver_cars add column if not exists video_urls text[] not null default '{}';

-- Applications pin the car the driver is bringing (primary is just the default)
alter table public.event_rsvps add column if not exists car_id uuid references public.driver_cars(id) on delete set null;
