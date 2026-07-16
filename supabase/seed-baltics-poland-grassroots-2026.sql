-- ============================================================
-- Baltics & Poland Grassroots Drift Events Seed - 2026
-- Run in Supabase SQL Editor AFTER events-migration.sql
-- ============================================================
-- Sources verified May 2026:
--   SONAX Drift Matsuri:        https://drifting.lt/, https://autorenginiai.lt/renginys/sonax-drift-matsuri/
--   Estonian Drift League:      https://www.driftime.ee/kalender-2026/, https://autosport.ee/sport/drift/
--   Drift Factory:              https://www.driftfactory.ee/
--   Drift Open Polish Series:   https://www.driftopen.com/kalendarz/
--   DMP Polish Championship:    https://driftingowemistrzostwapolski.pl/
-- ============================================================
-- New entries only - existing rounds (NEZ Kehala, Drift Open Rd.1-3,
-- Latvia Grand Opening, DTS Winter Finale, Drift Masters Riga/Warsaw,
-- Baltic Drift Championship rounds, etc.) are NOT re-inserted here.
-- ============================================================

-- ============================================================
-- PART 1: UPDATE - Fix YumeDrift dates/location/coords
-- (Real 2026 event is July 25-26 at STMC Kuršėnai, not July 11 at Šiauliai)
-- Idempotent - safe to re-run.
-- ============================================================

UPDATE public.events
SET date = '2026-07-25',
    end_date = '2026-07-26',
    location = 'Kuršėnai, Šiauliai District, Lithuania',
    track = 'KART3 / Driftiškės (ŠTMC Autodrome)',
    lat = 56.0028,
    lng = 22.9247,
    price = '€45',
    description = 'EZVIZ YumeDrift is Lithuania''s premier international drift festival celebrating Japanese car culture. Two days of drift sessions, show cars, karts, simulators, afterparty with DJs, and camping at the ŠTMC Autodrome in Kuršėnai. 70 hand-picked drivers and selected builds.'
WHERE name = 'YumeDrift International Festival 2026';

-- ============================================================
-- PART 2: INSERT new grassroots events
-- ============================================================

INSERT INTO public.events (name, series, date, end_date, location, country, track, lat, lng, category, cage_required, tire_size, skill_level, description, event_url, price, is_hot, participation, organizer, source) VALUES

-- ============================================================
-- LITHUANIA - SONAX Drift Matsuri (the Lithuanian Drift Matsuri)
-- ============================================================

('SONAX Drift Matsuri 2026', 'Drift Matsuri', '2026-04-25', '2026-04-26', 'Kuršėnai, Šiauliai District, Lithuania', 'LT', 'KART3 / Driftiškės (ŠTMC Autodrome)', 56.0028, 22.9247, 'grassroots', false, 'unlimited', 'all', 'The traditional Lithuanian drift season opener and one of the most-loved grassroots events in the Baltics. Expanded to two days for 2026 with 200 participants and 20 hours of continuous track time. Saturday runs 11:00-23:00 with fireworks at 21:00, Sunday 11:00-19:00. Free entry for kids under 12. Sponsors: SONAX, Liqui Moly, Red Bull.', 'https://drifting.lt/', '€20', true, 'both', 'Drifting.lt', 'manual'),

-- ============================================================
-- ESTONIA - Estonian Drift League (EDL) summer season
-- Sources: driftime.ee, autosport.ee
-- ============================================================

('Avalaks 2026', 'Estonian Drift League', '2026-04-25', NULL, 'Kiltsi, Lääne-Virumaa, Estonia', 'EE', 'Kiltsi', 59.0400, 26.0800, 'grassroots', false, 'unlimited', 'all', 'Avalaks - the official Estonian Drift League season opener. Compact technical layout in Lääne-Virumaa. First taste of asphalt for many local drivers after the Talvedrift winter season on snow. Pro, Pro2 and Street class drivers compete on the same weekend.', 'https://www.driftime.ee/kalender-2026/', '€20', false, 'both', 'Estonian Drift League', 'manual'),

('Mulgi Drift 2026', 'Estonian Drift League', '2026-05-01', '2026-05-02', 'Raasilla, Viljandi County, Estonia', 'EE', 'Raasilla', 58.1000, 25.5500, 'grassroots', false, 'unlimited', 'all', 'Mulgi Drift at Raasilla - one of the cornerstone Estonian grassroots drift events held on the May Day weekend. Tight, fast, and unforgiving layout in Viljandi County. Local Mulgi region hospitality with full-on Baltic drift atmosphere.', 'https://www.driftime.ee/kalender-2026/', '€25', false, 'both', 'Estonian Drift League', 'manual'),

('Jump for Drift 2026', 'Estonian Drift League', '2026-06-05', '2026-06-06', 'Laitse, Estonia', 'EE', 'Laitse Rally Park', 59.2890, 24.2780, 'grassroots', false, 'unlimited', 'all', 'Jump for Drift at Laitse Rally Park - one of the more spectacular Estonian rounds with elevation changes and the iconic jump section. Run as part of the Estonian Drift League. Camping on-site, classic LRP paddock atmosphere.', 'https://www.driftime.ee/kalender-2026/', '€25', false, 'both', 'Estonian Drift League', 'manual'),

('Drift Factory Matsuri 2026', NULL, '2026-08-01', NULL, 'Laitse, Estonia', 'EE', 'Laitse Rally Park', 59.2890, 24.2780, 'practice', false, 'unlimited', 'all', 'Drift Factory Matsuri at Laitse Rally Park - the Estonian take on the Japanese matsuri format. Pure driving joy, emotion, style, community. Open track day with festival atmosphere, no competition pressure. Run by Estonia''s top drift team.', 'https://www.driftfactory.ee/', '€60', false, 'drive', 'Drift Factory', 'manual'),

('Summer Bash 2026', 'Estonian Drift League', '2026-08-14', '2026-08-15', 'Pärnu, Estonia', 'EE', 'Auto24Ring (Audru Ring)', 58.4361, 24.3414, 'grassroots', false, 'unlimited', 'all', 'Summer Bash at Auto24Ring - a true Baltic drift bash on Estonia''s most famous race circuit near the Pärnu beaches. Pro, Pro2 and Street classes battle on the legendary Porsche Ring layout. One of the most-attended events on the EDL calendar with seaside paddock vibes.', 'https://www.driftime.ee/kalender-2026/', '€25', true, 'both', 'Estonian Drift League', 'manual'),

('Superfinaalid 2026', 'Estonian Drift League', '2026-09-18', '2026-09-19', 'Raasilla, Viljandi County, Estonia', 'EE', 'Raasilla', 58.1000, 25.5500, 'grassroots', false, 'unlimited', 'all', 'Superfinaalid - the Estonian Drift League season finale at Raasilla. Pro, Pro2 and Street class champions decided here. End-of-season high stakes plus the traditional Mulgi region after-party.', 'https://www.driftime.ee/kalender-2026/', '€25', false, 'both', 'Estonian Drift League', 'manual'),

('Drift Factory Night Bash 2026', NULL, '2026-10-10', NULL, 'Laitse, Estonia', 'EE', 'Laitse Rally Park', 59.2890, 24.2780, 'practice', false, 'unlimited', 'all', 'Drift Factory Night Bash - the season finale where adrenaline and twilight meet. Full Laitse RP layout in the dark with the cars lit up. Closing event of Drift Factory''s 2026 season. Track day format, no competition.', 'https://www.driftfactory.ee/', '€70', false, 'drive', 'Drift Factory', 'manual'),

('Drift Factory Hooaja Avamine 2026', NULL, '2026-04-18', NULL, 'Laitse, Estonia', 'EE', 'Laitse Rally Park', 59.2890, 24.2780, 'practice', false, 'unlimited', 'all', 'Drift Factory traditional season kickoff at Laitse Rally Park. First open track day of the Estonian asphalt drift season. Friendly format, ideal for shaking off winter and getting cars dialled in before the EDL rounds start.', 'https://www.driftfactory.ee/', '€60', false, 'drive', 'Drift Factory', 'manual'),

-- ============================================================
-- POLAND - Drift Open Grand Finale (Rd.4 was missing)
-- ============================================================

('Drift Open Rd.4 Grand Finale - Slomczyn', 'Drift Open', '2026-10-02', '2026-10-04', 'Slomczyn, Poland', 'PL', 'Autodrom Slomczyn', 51.9540, 21.1370, 'grassroots', true, 'unlimited', 'intermediate', 'Drift Open #85 - the 2026 season Grand Finale at Autodrom Słomczyn near Warsaw. The decisive round across PRO AM, PRO and Masters classes. The 85th competition in Drift Open history. PRO class winner earns a spot in Drift Masters 2027.', 'https://www.driftopen.com/kalendarz/', '120 PLN', true, 'both', 'Drift Open Polish Drift Series', 'manual'),

-- ============================================================
-- POLAND - DMP (Driftingowe Mistrzostwa Polski) season opener
-- ============================================================

('DMP Round 1 - New Grounds Warsaw', 'Driftingowe Mistrzostwa Polski', '2026-06-27', '2026-06-28', 'Nadarzyn, Poland', 'PL', 'Ptak Warsaw Expo', 52.0708, 20.7958, 'grassroots', true, 'unlimited', 'intermediate', 'DMP 2026 season inauguration at Ptak Warsaw Expo, run alongside the Auto Tuning Show. The Polish Drifting Federation championship features 1000hp builds across multiple classes. New venue for 2026 with stadium-style spectator format.', 'https://driftingowemistrzostwapolski.pl/', '80 PLN', false, 'both', 'Polska Federacja Driftingu', 'manual'),

-- ============================================================
-- LATVIA - Poorbaltics Challenge (Liepaja-based grassroots crew)
-- ============================================================

('Poorbaltics Challenge 2026', 'Poorbaltics', '2026-07-25', NULL, 'Priekule, South Kurzeme, Latvia', 'LV', 'Priekules lidlauks (Priekule Airfield)', 56.4567, 21.5667, 'grassroots', false, 'unlimited', 'all', 'Poorbaltics Challenge - the wildest grassroots burnout & drift gathering in Latvia, run by the Liepaja-based Poorbaltics crew. Gymkhana-style format with riders going one-by-one on the airfield, building up to the legendary closing burnout. Drift, smoke, and unstoppable adrenaline. Gates open 10:00, action starts 12:00. Early bird tickets historically as cheap as €12.', 'https://www.poorbaltics.com/', '€15', true, 'both', 'Poorbaltics', 'manual'),

-- ============================================================
-- LATVIA - Street Sinners Skill Check (Dundaga airfield)
-- The "Skill Check" event the user asked about - run by the
-- Street Sinners drift crew. Skill Check 2 was May 2025, the
-- 2026 edition (Skill Check 3) ran on May 3, 2026.
-- ============================================================

('Street Sinners Skill Check 3', 'Street Sinners', '2026-05-03', NULL, 'Dundaga, Talsi Municipality, Latvia', 'LV', 'Dundaga Airfield', 57.5167, 22.3367, 'grassroots', false, 'unlimited', 'all', 'Street Sinners Skill Check 3 at Dundaga Airfield - the third edition of the grassroots drift skill test by Latvia''s Street Sinners crew. Wide open airfield layout with multiple courses for tandem and solo runs. Pure street-drift culture, no cage required, modified RWD cars welcome. Annual gathering of the Latvian street drift scene.', 'https://www.instagram.com/street_sinners_/', '€20', false, 'both', 'Street Sinners', 'manual');

-- ============================================================
-- NOTES on events NOT re-inserted (already in DB):
--   - YumeDrift International Festival 2026 - UPDATE applied above
--   - NEZ Drift Witch Kettle (existing row dated 2026-08-28; real 2026
--     date per FIA-NEZ is closer to early September - leave as-is)
--   - Lithuanian Drift Training Kaunas Spring/Summer (already exist)
--   - Drift Open Rd.1-3, DTS Winter Finale, Drift Masters Riga/Warsaw,
--     Latvia Drift Grand Opening, Baltic Drift Championship rounds,
--     Bikernieki practices, Drift Factory Estonia Practice Day - all exist
-- ============================================================
