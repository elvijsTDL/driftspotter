-- ============================================================
-- Events Table Migration
-- Run in Supabase SQL Editor AFTER the main migration.sql
-- ============================================================

-- Events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  series text,
  date date not null,
  end_date date,
  location text not null,
  country text not null default '',
  track text not null default '',
  lat double precision not null,
  lng double precision not null,
  category text not null default 'grassroots' check (category in ('official','grassroots','proam','practice')),
  cage_required boolean default false,
  tire_size text default 'unlimited' check (tire_size in ('205','225','unlimited')),
  skill_level text default 'all' check (skill_level in ('beginner','intermediate','advanced','all')),
  description text default '',
  event_url text,
  image_url text,
  price text,
  is_hot boolean default false,
  participation text default 'both' check (participation in ('drive','watch','both')),
  organizer text not null default '',

  -- Outscraper / Google Maps metadata
  google_place_id text unique,
  google_rating double precision,
  google_reviews_count int,
  phone text,
  website text,
  source text default 'manual' check (source in ('manual','outscraper','user_submitted')),

  -- Status for moderation
  status text default 'approved' check (status in ('approved','pending','rejected')),

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index idx_events_date on public.events(date);
create index idx_events_category on public.events(category);
create index idx_events_country on public.events(country);
create index idx_events_location on public.events using gist (
  point(lng, lat)
);
create index idx_events_status on public.events(status);
create index idx_events_source on public.events(source);

-- RLS
alter table public.events enable row level security;
create policy "Approved events are viewable by everyone"
  on public.events for select using (status = 'approved');
create policy "Admins can insert events"
  on public.events for insert with check (true);
create policy "Admins can update events"
  on public.events for update using (true);

-- Enable Realtime for live event updates
alter publication supabase_realtime add table public.events;

-- ============================================================
-- Update event_comments and event_rsvps to use UUID FK
-- (They currently use text event_id matching static IDs.
--  We'll add a uuid column and keep text for backward compat)
-- ============================================================

-- Add uuid event reference columns
alter table public.event_comments add column event_uuid uuid references public.events(id) on delete cascade;
alter table public.event_rsvps add column event_uuid uuid references public.events(id) on delete cascade;

create index idx_event_comments_event_uuid on public.event_comments(event_uuid);
create index idx_event_rsvps_event_uuid on public.event_rsvps(event_uuid);

-- ============================================================
-- Seed existing 24 hardcoded events
-- ============================================================

insert into public.events (name, series, date, end_date, location, country, track, lat, lng, category, cage_required, tire_size, skill_level, description, event_url, price, is_hot, participation, organizer, source) values
('Drift Masters Rd.1 - Vallelunga', 'Drift Masters', '2026-05-01', '2026-05-02', 'Campagnano di Roma, Italy', 'IT', 'Vallelunga Race Track', 42.1565, 12.3682, 'official', true, 'unlimited', 'advanced', 'The 2026 Drift Masters season opens at Vallelunga, just outside Rome. Europe''s #1 pro drifting series kicks off a record 7-round season. Broadcast live on Red Bull TV.', 'https://dm.gp/seasons/drift-masters-2026/', '€45', true, 'watch', 'Drift Masters GP', 'manual'),
('Formula Drift Rd.1 - Streets of Long Beach', 'Formula Drift', '2026-04-10', '2026-04-11', 'Long Beach, California, USA', 'US', 'Long Beach Street Circuit', 33.7598, -118.1890, 'official', true, 'unlimited', 'advanced', 'Formula Drift 2026 opens at the iconic Streets of Long Beach. The most prestigious round on the calendar, featuring Adam LZ, James Deane, and Daigo Saito. 3 new venues this season.', 'https://www.formulad.com/schedule', '$50', true, 'watch', 'Formula Drift', 'manual'),
('YumeDrift International Festival 2026', 'YumeDrift', '2026-07-11', '2026-07-12', 'Siauliai, Lithuania', 'LT', 'Siauliai Autodrome', 55.9333, 23.3167, 'grassroots', false, 'unlimited', 'all', 'YumeDrift is a passionate Japanese-style drift culture festival in Lithuania. Drift sessions, show cars, karts, simulators, afterparty with DJs, and camping. All skill levels welcome.', 'https://yumedrift.eu/', '€40', true, 'both', 'YumeDrift', 'manual'),
('Ebisu Spring Drift Matsuri 2026', NULL, '2026-04-18', '2026-04-19', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'grassroots', false, 'unlimited', 'all', 'Non-stop drifting for 2 days at the legendary Ebisu Circuit, home to 7 individual courses. Open for anyone - drivers, passengers, and spectators. The ultimate Japanese drift culture experience with night sessions.', 'https://www.ebisu-circuit.com/', '¥10,000', true, 'both', 'Ebisu Circuit', 'manual'),
('Drift Masters Rd.5 - Riga', 'Drift Masters', '2026-07-24', '2026-07-25', 'Riga, Latvia', 'LV', 'Biķernieki Circuit', 56.9665, 24.2326, 'official', true, 'unlimited', 'advanced', 'Drift Masters comes to the legendary Biķernieki Circuit in Riga, winding through scenic forest. Also host to the Baltic Drift Championship and FIA Intercontinental Drift Cup.', 'https://dm.gp/seasons/drift-masters-2026/', '€35', true, 'watch', 'Drift Masters GP', 'manual'),
('Nordic Drift Series - Rudskogen', 'Nordic Drift Series', '2026-07-11', '2026-07-12', 'Rudskogen Motorsenter, Norway', 'NO', 'Rudskogen Motorsenter', 59.6550, 11.4200, 'official', true, '225', 'intermediate', 'The Nordic Drift Series comes to Norway''s premier motorsport facility. Known for its flowing layout and massive spectator banks.', NULL, '350 NOK', true, 'watch', 'Nordic Drift Series', 'manual'),
('Shotsu Open Practice', NULL, '2026-04-25', NULL, 'Ebisu Circuit, Japan', 'JP', 'Ebisu Circuit - Minami', 37.7461, 140.3494, 'practice', false, 'unlimited', 'all', 'Open practice day at the legendary Ebisu Circuit Minami course. Perfect for all levels, from first-timers to seasoned veterans. Multiple courses available.', NULL, '¥12,000', false, 'drive', 'Shotsu', 'manual'),
('British Drift Championship Rd.2 - Teesside', 'British Drift Championship', '2026-06-14', '2026-06-15', 'Teesside Autodrome, UK', 'GB', 'Teesside Autodrome', 54.5100, -1.2800, 'official', true, 'unlimited', 'advanced', 'The BDC heads to Teesside for Round 2. The tight technical layout rewards precision and commitment. Support classes run alongside the main event.', 'https://britishdriftchampionship.co.uk', '£30', true, 'watch', 'BDC', 'manual'),
('Grassroots Bash - Atlanta Motorsports Park', NULL, '2026-05-23', NULL, 'Dawsonville, Georgia, USA', 'US', 'Atlanta Motorsports Park', 34.3942, -84.1288, 'grassroots', false, '225', 'beginner', 'Beginner-friendly grassroots drift event at AMP. No cage required, 225 tire limit keeps speeds safe. Instruction available for newcomers. Come learn to slide!', NULL, '$80', false, 'drive', 'Southeast Drift Community', 'manual'),
('D1 Grand Prix Rd.4 - Fuji Speedway', 'D1 Grand Prix', '2026-07-25', '2026-07-26', 'Oyama, Shizuoka, Japan', 'JP', 'Fuji Speedway', 35.3722, 138.9275, 'official', true, 'unlimited', 'advanced', 'D1 Grand Prix at the iconic Fuji Speedway. Japan''s premier drift competition showcasing the world''s most skilled drivers on one of motorsport''s most famous circuits.', 'https://d1gp.co.jp', '¥5,000', true, 'watch', 'D1 Corporation', 'manual'),
('Irish Drift Championship Rd.3 - Watergrasshill', 'Irish Drift Championship', '2026-07-04', '2026-07-05', 'Watergrasshill, Cork, Ireland', 'IE', 'Watergrasshill Motorsport Complex', 51.9500, -8.3500, 'official', true, 'unlimited', 'advanced', 'The IDC returns to Watergrasshill for an action-packed weekend. Known for producing some of the closest tandem battles in European drifting.', 'https://idcnews.ie', '€35', false, 'watch', 'IDC', 'manual'),
('King of Europe Drift Series - Greinbach', 'King of Europe', '2026-08-15', '2026-08-16', 'Greinbach, Austria', 'AT', 'Red Bull Ring Drift Arena', 47.2197, 14.7647, 'official', true, 'unlimited', 'advanced', 'King of Europe comes to Austria. The prestigious series attracts drivers from across the continent for a weekend of world-class tandem drifting.', 'https://kingofeurope.net', '€40', false, 'watch', 'King of Europe', 'manual'),
('LZ Compound Open Day', NULL, '2026-05-30', NULL, 'LZ Compound, Florida, USA', 'US', 'LZ Compound', 28.7800, -81.2600, 'practice', false, 'unlimited', 'all', 'Adam LZ opens the Compound for a special open practice day. Skid pad, figure 8, and full course available. Limited spots — sign up fast.', NULL, '$120', true, 'drive', 'LZ Compound', 'manual'),
('Drift Kings International Series - Lydden Hill', 'Drift Kings', '2026-08-02', '2026-08-03', 'Lydden Hill, Kent, UK', 'GB', 'Lydden Hill Race Circuit', 51.1667, 1.1833, 'proam', true, '225', 'intermediate', 'Drift Kings International Series at the legendary Lydden Hill. Pro-Am format gives upcoming drivers the chance to compete alongside established names.', 'https://driftkings.eu', '£35', false, 'both', 'Drift Kings', 'manual'),
('Baltic Drift Open - Pärnu', 'Baltic Drift', '2026-06-28', NULL, 'Pärnu, Estonia', 'EE', 'Pärnu Street Circuit', 58.3853, 24.4971, 'proam', true, '225', 'intermediate', 'Street circuit drifting in the beautiful Estonian coastal city of Pärnu. Temporary barriers create an intense, close-quarters battle arena.', NULL, '€20', false, 'both', 'Baltic Drift Association', 'manual'),
('Clubloose Northeast - Englishtown', NULL, '2026-05-03', NULL, 'Englishtown, New Jersey, USA', 'US', 'Old Bridge Township Raceway Park', 40.3310, -74.3340, 'grassroots', false, 'unlimited', 'all', 'Clubloose''s legendary grassroots drift events at E-Town. One of the biggest and best-organized grassroots programs on the East Coast. All levels welcome.', 'https://clubloose.com', '$100', false, 'drive', 'Clubloose', 'manual'),
('Shotsu Drift 2026', 'Shotsu', '2026-06-06', NULL, 'Modlin, Poland', 'PL', 'Modlin Track', 52.4450, 20.6530, 'grassroots', false, 'unlimited', 'all', 'Shotsu Drift is a style-focused community that values clean builds and great atmosphere. Curated car selection - not random cars allowed. Drift area, show & shine, food, drift taxi, and merch.', 'https://shotsudrift.com/', '€30', true, 'both', 'Shotsu Drift', 'manual'),
('Drift Masters Grand Finale - Warsaw', 'Drift Masters', '2026-09-11', '2026-09-12', 'Warsaw, Poland', 'PL', 'PGE Narodowy Stadium', 52.2370, 21.0407, 'official', true, 'unlimited', 'advanced', 'The Drift Masters 2026 Grand Finale inside PGE Narodowy Stadium in Warsaw. 55,000 fans pack the national stadium for the championship decider. The biggest drift event in Europe.', 'https://dm.gp/seasons/drift-masters-2026/', '€60', true, 'watch', 'Drift Masters GP', 'manual'),
('Formula Drift Rd.2 - Road Atlanta', 'Formula Drift', '2026-05-07', '2026-05-09', 'Braselton, Georgia, USA', 'US', 'Road Atlanta', 34.1413, -83.8173, 'official', true, 'unlimited', 'advanced', 'Formula Drift returns to Road Atlanta for Round 2. One of the most technical tracks on the calendar with massive elevation changes. Also hosts the PROSPEC opener.', 'https://www.formulad.com/schedule', '$50', false, 'watch', 'Formula Drift', 'manual'),
('Gatebil Scandinavian Drift - Valerbanen', 'Gatebil', '2026-06-19', '2026-06-21', 'Valer, Norway', 'NO', 'Valerbanen', 59.4850, 10.9530, 'grassroots', true, 'unlimited', 'intermediate', 'Gatebil is Scandinavia''s biggest motorsport festival. Massive 3-day event with drifting, time attack, show & shine, camping, and legendary party atmosphere. A bucket-list event for any enthusiast.', 'https://gatebil.no', '550 NOK', true, 'both', 'Gatebil', 'manual'),
('Drift Masters Rd.3 - Mondello Park', 'Drift Masters', '2026-06-13', '2026-06-14', 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'official', true, 'unlimited', 'advanced', 'Drift Masters Round 3 at Ireland''s Mondello Park. Features the Red Bull Drift Pursuit on opening day. One of the most atmospheric rounds with passionate Irish drift fans.', 'https://dm.gp/seasons/drift-masters-2026/', '€45', false, 'watch', 'Drift Masters GP', 'manual'),
('UK Drift Matsuri - Anglesey', NULL, '2026-04-20', '2026-04-21', 'Anglesey, North Wales, UK', 'GB', 'Anglesey Circuit', 53.1880, -4.4960, 'grassroots', true, 'unlimited', 'all', 'The UK''s answer to Japanese Drift Matsuri culture. 2 days of non-stop drifting at Anglesey Circuit in North Wales. Minimum 6-point bolt-in cage required. Camping and afterparty included.', 'https://www.driftmatsuri.com/', '£80', false, 'drive', 'Drift Matsuri UK', 'manual'),
('Formula Drift Rd.7 - Sin City', 'Formula Drift', '2026-09-24', '2026-09-26', 'Las Vegas, Nevada, USA', 'US', 'The Bullring at LVMS', 36.2713, -115.0111, 'official', true, 'unlimited', 'advanced', 'Brand new venue for Formula Drift 2026! The Bullring at Las Vegas Motor Speedway hosts its first-ever FD round. Expect insane Vegas energy and a packed house.', 'https://www.formulad.com/schedule', '$55', true, 'watch', 'Formula Drift', 'manual'),
('Drift Masters Rd.6 - Ferropolis', 'Drift Masters', '2026-08-13', '2026-08-14', 'Grafenhainichen, Germany', 'DE', 'Ferropolis', 51.7570, 12.4427, 'official', true, 'unlimited', 'advanced', 'Drift Masters at Ferropolis, the ''City of Iron'' - an open-air museum with massive industrial machines as backdrop. One of the most unique drift venues in the world.', 'https://dm.gp/seasons/drift-masters-2026/', '€40', false, 'watch', 'Drift Masters GP', 'manual');
