-- ============================================================
-- Asia-Pacific & Middle East Drift Events Seed
-- March 2026 through August 2026
-- Run in Supabase SQL Editor AFTER events-migration.sql
-- ============================================================
-- Sources:
--   D1GP official: https://d1gp.co.jp/
--   Formula Drift Japan: https://formulad.jp/
--   Ebisu Circuit / Powervehicles: https://powervehicles.com/drift-in-ebisu/
--   D1NZ: https://www.d1nz.com/
--   Keep it Reet: https://www.keepitreet.com/calendar
--   Drifting SA: https://www.driftingsa.com.au/championship/
--   DriftWest / WASCC: https://wascc.com.au/driftwest/
--   Powercruise: https://www.powercruise.com/events/
--   Yas Marina Circuit: https://www.yasmarinacircuit.com/
--   Red Bull Car Park Drift: https://www.redbull.com/mea-en/event-series/red-bull-car-park-drift
--   Saudi Toyota Championship: https://www.saudi-championship.com/
--   World Time Attack Challenge: https://www.worldtimeattack.com/
-- ============================================================
--
-- NOTE: The events-migration.sql has 3 existing Japan events that should be
-- corrected with the UPDATEs below before running this INSERT:
--
-- 1. "Ebisu Spring Drift Matsuri 2026" date should be 2026-05-09/2026-05-10
--    (was 2026-04-18/2026-04-19)
-- 2. "D1 Grand Prix Rd.4 - Fuji Speedway" is incorrect. The 2026 D1GP
--    has Rd.Zero at Fuji (Apr 19) and Rd.3&4 at Tsukuba (Jun 27-28).
--    The existing event should be deleted or updated.
-- ============================================================

-- Fix existing Ebisu Matsuri dates (actual 2026 dates are May 9-10)
UPDATE public.events
SET date = '2026-05-09', end_date = '2026-05-10',
    description = 'Non-stop drifting for 36 hours at the legendary Ebisu Circuit, home to 7 individual courses. Open to anyone with a drift car - all skill levels welcome. Night sessions, tandems, and the raw spirit of Japanese drift culture. Spectators welcome for ¥1,500.'
WHERE name = 'Ebisu Spring Drift Matsuri 2026';

-- Fix existing D1GP Fuji event (2026 has Rd.Zero at Fuji on Apr 19, not Rd.4 in July)
UPDATE public.events
SET name = 'D1 Grand Prix Rd.Zero - Fuji Speedway',
    date = '2026-04-19',
    end_date = NULL,
    description = 'The 2026 D1 Grand Prix exhibition round at the iconic Fuji Speedway. An early-season showcase featuring Japan''s top professional drifters on one of motorsport''s most famous circuits, with Mount Fuji as the backdrop.',
    lat = 35.3697,
    lng = 138.9227
WHERE name = 'D1 Grand Prix Rd.4 - Fuji Speedway';

-- Now insert new events (excluding duplicates already in events-migration.sql)
insert into public.events (name, series, date, end_date, location, country, track, lat, lng, category, cage_required, tire_size, skill_level, description, event_url, price, is_hot, participation, organizer, source) values

-- ============================================================
-- JAPAN - D1 Grand Prix 2026
-- ============================================================

-- D1GP Rd.Zero at Fuji already exists in events-migration.sql (updated via UPDATE above)

('D1 Grand Prix Rd.1 & Rd.2 - Aichi Sky Expo', 'D1 Grand Prix', '2026-05-09', '2026-05-10', 'Tokoname, Aichi, Japan', 'JP', 'Aichi Sky Expo', 34.8585, 136.8145, 'official', true, 'unlimited', 'advanced', 'The 2026 D1 Grand Prix season officially opens with a double-header at Aichi Sky Expo near Nagoya. Indoor/outdoor special stage near Centrair Airport. Two championship rounds in one weekend.', 'https://d1gp.co.jp', '¥6,000', true, 'watch', 'D1 Corporation', 'manual'),

('D1 Grand Prix Rd.3 & Rd.4 - Tsukuba Circuit', 'D1 Grand Prix', '2026-06-27', '2026-06-28', 'Shimotsuma, Ibaraki, Japan', 'JP', 'Tsukuba Circuit', 36.1510, 139.9195, 'official', true, 'unlimited', 'advanced', 'D1 Grand Prix double-header at Tsukuba Circuit. The tight technical layout of Tsukuba demands precision and car control. Close proximity to Tokyo makes this one of the best-attended rounds.', 'https://d1gp.co.jp', '¥5,500', true, 'watch', 'D1 Corporation', 'manual'),

-- ============================================================
-- JAPAN - Formula Drift Japan 2026
-- ============================================================

('Formula Drift Japan Rd.1 - Fuji Speedway', 'Formula Drift Japan', '2026-04-25', '2026-04-26', 'Oyama, Shizuoka, Japan', 'JP', 'Fuji Speedway', 35.3697, 138.9227, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan 2026 opens at Fuji Speedway as part of the 3-day Fuji Xtreme Days festival. Friday practice, Saturday qualifying, Sunday battles. FDJ2 support series also competes.', 'https://formulad.jp', '¥5,000', true, 'watch', 'Formula Drift Japan', 'manual'),

('Fuji Xtreme Days 2026 - Practice Day', 'Formula Drift Japan', '2026-04-24', NULL, 'Oyama, Shizuoka, Japan', 'JP', 'Fuji Speedway', 35.3697, 138.9227, 'practice', true, 'unlimited', 'intermediate', 'The opening day of Fuji Xtreme Days features FDJ2 qualifying and Formula Drift Japan open practice sessions at Fuji Speedway. A rare chance to drive on one of Japan''s most famous circuits.', 'https://en.fujispeedway.jp/event/2026-fxd', '¥15,000', false, 'drive', 'Formula Drift Japan', 'manual'),

('Formula Drift Japan Rd.2 - Suzuka Twin Circuit', 'Formula Drift Japan', '2026-05-16', '2026-05-17', 'Suzuka, Mie, Japan', 'JP', 'Suzuka Twin Circuit', 34.8433, 136.5377, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan Round 2 at Suzuka Twin Circuit. The left half of the famous Suzuka complex is used for drifting with mainly fast sections and a few tight corners. Great atmosphere in Mie Prefecture.', 'https://formulad.jp', '¥4,500', true, 'watch', 'Formula Drift Japan', 'manual'),

('Formula Drift Japan Rd.3 - Ebisu Circuit', 'Formula Drift Japan', '2026-06-13', '2026-06-14', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit West Course', 37.6442, 140.3723, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan Round 3 at the legendary Ebisu Circuit West Course. Ebisu is the spiritual home of Japanese drifting, and this round is always a fan favorite with incredible mountain scenery.', 'https://formulad.jp', '¥4,500', true, 'watch', 'Formula Drift Japan', 'manual'),

('Formula Drift Japan Rd.4 - Sportsland SUGO', 'Formula Drift Japan', '2026-07-11', '2026-07-12', 'Murata, Miyagi, Japan', 'JP', 'Sportsland SUGO', 38.1364, 140.7736, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan Round 4 at Sportsland SUGO in Miyagi Prefecture. A challenging circuit in Japan''s Tohoku region known for elevation changes and a technical drift layout.', 'https://formulad.jp', '¥4,500', false, 'watch', 'Formula Drift Japan', 'manual'),

-- ============================================================
-- JAPAN - Ebisu Circuit Events
-- ============================================================

-- Ebisu Spring Matsuri already exists in events-migration.sql (updated via UPDATE above)

('Ebisu Summer Drift Matsuri 2026', NULL, '2026-08-22', '2026-08-23', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'grassroots', false, 'unlimited', 'all', 'The summer edition of the legendary Ebisu Drift Matsuri. 36 hours of non-stop drifting across all 7 courses including Higashi and Nishi which only open during Matsuri weekends. The ultimate bucket-list drift event.', 'https://powervehicles.com/drift-in-ebisu/', '¥10,000', true, 'both', 'Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - March', NULL, '2026-03-15', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Open practice day at Ebisu Circuit. Access to 5 drift courses all day for ¥9,000 or 4 courses (excluding Minami) for ¥6,000. Pre-booking through Powervehicles required. Rental cars available on-site.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - April', NULL, '2026-04-12', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Open practice day at Ebisu Circuit. Access to 5 drift courses all day. Ideal warm-up before the Spring Matsuri. Pre-booking through Powervehicles required. Rental drift cars available.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - June', NULL, '2026-06-07', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Open practice day at Ebisu Circuit during the warm summer months. Access to 5 drift courses. Great time to visit as the Fukushima mountains are lush and green. Pre-book through Powervehicles.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

-- ============================================================
-- JAPAN - Nikko Circuit Events
-- ============================================================

('Nikko Circuit Drift Practice Day - March', NULL, '2026-03-22', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Grassroots drift practice at the iconic Nikko Circuit in Tochigi. One of Japan''s most legendary drift venues where modern drift culture was born. Technical layout rewards skill over power. 2 hours from Tokyo.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

('Nikko Circuit Drift Practice Day - May', NULL, '2026-05-24', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Grassroots drift practice at Nikko Circuit. A compact, technical track that has been a cornerstone of Japanese drift culture since the 1990s. Open to all levels - bring your own car or watch from the paddock.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

('Nikko Circuit Drift Practice Day - July', NULL, '2026-07-19', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Summer drift practice at Nikko Circuit. The legendary Tochigi venue hosts regular practice sessions popular with local drifters and visitors. Great technical layout for improving car control skills.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

-- ============================================================
-- JAPAN - Meihan Sportsland Events
-- ============================================================

('Meihan Sportsland Drift Practice - Spring', NULL, '2026-04-05', NULL, 'Yamazoe, Nara, Japan', 'JP', 'Meihan Sportsland', 34.6833, 136.0500, 'practice', false, 'unlimited', 'all', 'Drift practice at the famous Meihan Sportsland E-course in Nara Prefecture. A tight, technical figure-eight layout that is considered one of Japan''s best drift training grounds. Popular with Kansai-area drifters.', 'http://web1.kcn.jp/meihansl/', '¥5,000', false, 'drive', 'Meihan Sportsland', 'manual'),

('Meihan Sportsland Drift Practice - Summer', NULL, '2026-07-05', NULL, 'Yamazoe, Nara, Japan', 'JP', 'Meihan Sportsland', 34.6833, 136.0500, 'practice', false, 'unlimited', 'all', 'Summer drift practice at Meihan Sportsland. The iconic E-course is a pilgrimage site for drift enthusiasts visiting the Kansai region. Technical, tight layout ideal for all skill levels.', 'http://web1.kcn.jp/meihansl/', '¥5,000', false, 'drive', 'Meihan Sportsland', 'manual'),

-- ============================================================
-- JAPAN - Mobara Twin Circuit Events
-- ============================================================

('Mobara Twin Circuit Drift Practice - April', NULL, '2026-04-11', NULL, 'Mobara, Chiba, Japan', 'JP', 'Mobara Twin Circuit', 35.3818, 140.2813, 'practice', false, 'unlimited', 'all', 'Drift practice at Mobara Twin Circuit in Chiba Prefecture. Only about 90 minutes from Tokyo, Mobara is the closest drift track to the capital. Technical layout with tight hairpins. Popular weekend practice venue.', NULL, '¥5,500', false, 'drive', 'Mobara Twin Circuit', 'manual'),

('Mobara Twin Circuit Drift Practice - June', NULL, '2026-06-20', NULL, 'Mobara, Chiba, Japan', 'JP', 'Mobara Twin Circuit', 35.3818, 140.2813, 'practice', false, 'unlimited', 'all', 'Summer drift practice at Mobara Twin Circuit. The closest proper drift circuit to central Tokyo, making it extremely popular for weekend sessions. Great for beginners and experienced drifters alike.', NULL, '¥5,500', false, 'drive', 'Mobara Twin Circuit', 'manual'),

-- ============================================================
-- JAPAN - Drift Tour / Kansai Events
-- ============================================================

('Drift Japan Tour - Kansai March 2026', NULL, '2026-03-07', '2026-03-16', 'Osaka, Japan', 'JP', 'Meihan Sportsland / Bihoku / Tokushima', 34.6833, 136.0500, 'grassroots', false, 'unlimited', 'all', 'A 10-day guided drift tour of Japan''s Kansai region. Includes 3 dedicated track days at Meihan Sportsland, Bihoku Highland, and Tokushima Kartland. Flights, accommodation, drift car hire, fuel, and tyres included.', 'https://driftjapan.com.au/pages/dates-of-drifting-in-japan', '$8,600 USD', false, 'drive', 'Drift Japan Tours', 'manual'),

('Drift Japan Tour - Kansai June 2026', NULL, '2026-06-06', '2026-06-15', 'Osaka, Japan', 'JP', 'Meihan Sportsland / Bihoku / Tokushima', 34.6833, 136.0500, 'grassroots', false, 'unlimited', 'all', 'A 10-day guided drift tour of Japan''s Kansai region in early summer. 3 track days at iconic circuits including Meihan Sportsland. Full package with flights, hotels, professionally tuned drift car hire, and cultural experiences.', 'https://driftjapan.com.au/pages/dates-of-drifting-in-japan', '$8,600 USD', false, 'drive', 'Drift Japan Tours', 'manual'),

-- ============================================================
-- JAPAN - GranSnow Okuibuki (FDJ)
-- ============================================================

('Formula Drift Japan Rd.5 - GranSnow Okuibuki', 'Formula Drift Japan', '2026-09-05', '2026-09-06', 'Maibara, Shiga, Japan', 'JP', 'GranSnow Okuibuki Street Course', 35.4500, 136.3500, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan Round 5 on the touge-style street course at GranSnow Okuibuki ski resort. One of the most unique drift venues in the world - a mountain road course through a ski area. Incredible atmosphere.', 'https://formulad.jp', '¥4,500', true, 'watch', 'Formula Drift Japan', 'manual'),

-- ============================================================
-- NEW ZEALAND - D1NZ 2026 Season
-- ============================================================

('D1NZ Round 3 - Pukekohe Park Raceway', 'D1NZ', '2026-02-13', '2026-02-15', 'Pukekohe, Auckland, New Zealand', 'NZ', 'Pukekohe Park Raceway', -37.2093, 174.9180, 'official', true, 'unlimited', 'advanced', 'D1NZ returns to the legendary Pukekohe Park Raceway for one last time. This iconic Auckland circuit hosts Round 3 of the 2026 championship in a historic farewell event.', 'https://www.d1nz.com/round-3-pukekohe', 'NZ$35', true, 'watch', 'D1NZ', 'manual'),

('D1NZ Round 4 - H BlackBee Drift Park', 'D1NZ', '2026-03-20', '2026-03-22', 'Gisborne, New Zealand', 'NZ', 'H BlackBee Drift Park', -38.6623, 178.0177, 'official', true, 'unlimited', 'advanced', 'D1NZ makes its East Coast debut at the brand-new H BlackBee Drift Park in Gisborne. Pro drifting visits Tairawhiti for the first time with a purpose-built custom layout.', 'https://www.d1nz.com/round-4-gisborne', 'NZ$35', true, 'watch', 'D1NZ', 'manual'),

('D1NZ Grand Final - Mercury Baypark Stadium', 'D1NZ', '2026-04-24', '2026-04-25', 'Tauranga, New Zealand', 'NZ', 'Mercury Baypark Stadium', -37.6861, 176.2248, 'official', true, 'unlimited', 'advanced', 'The D1NZ 2026 Grand Final at Mercury Baypark Stadium over ANZAC Weekend. The season-ending spectacular features Pro and Pro-Sport championship battles, a massive car show, Mount Cruise parade, live entertainment, and afterparty.', 'https://www.d1nz.com/round-5-baypark', 'NZ$45', true, 'watch', 'D1NZ', 'manual'),

-- ============================================================
-- AUSTRALIA - Keep it Reet Events (Victoria)
-- ============================================================

('Keep it Reet - Friday Night Drifts March', NULL, '2026-03-06', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'grassroots', false, 'unlimited', 'all', 'Friday Night Drifts at Calder Park Raceway. 50 drifters throwing down for 6 hours of non-stop drifting from 5pm to 11pm. Tandems, carnage, and pure grassroots energy. Australia''s biggest drift club.', 'https://www.keepitreet.com/fridaynightdrifts', 'A$100', false, 'both', 'Keep it Reet', 'manual'),

('Keep it Reet - Friday Night Drifts April', NULL, '2026-04-03', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'grassroots', false, 'unlimited', 'all', 'Friday Night Drifts at Calder Park. 6 hours of grassroots drifting under the lights. One of the most vibrant drift communities in the Southern Hemisphere. Spectators welcome, food trucks on-site.', 'https://www.keepitreet.com/fridaynightdrifts', 'A$100', false, 'both', 'Keep it Reet', 'manual'),

('Keep it Reet - Friday Night Drifts May', NULL, '2026-05-01', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'grassroots', false, 'unlimited', 'all', 'Friday Night Drifts at Calder Park. 6-hour evening drift session with 50 drivers. Perfect entry point into Australian grassroots drifting. Inclusive community welcoming beginners to pros.', 'https://www.keepitreet.com/fridaynightdrifts', 'A$100', false, 'both', 'Keep it Reet', 'manual'),

('Keep it Reet - Drift School+ June', NULL, '2026-06-14', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'grassroots', false, 'unlimited', 'beginner', 'Keep it Reet Drift School at Calder Park. Beginner-level track day with one-on-one lessons from certified instructors. Learn the fundamentals of drifting in a safe, controlled environment. Progress into Friday Night Drifts.', 'https://www.keepitreet.com', 'A$150', false, 'drive', 'Keep it Reet', 'manual'),

-- ============================================================
-- AUSTRALIA - Drifting SA (South Australia)
-- ============================================================

('Drifting SA - State Series Round 1', 'SA State Drift Series', '2026-03-08', NULL, 'Tailem Bend, South Australia', 'AU', 'The Bend Motorsport Park', -35.3083, 139.5167, 'proam', true, 'unlimited', 'intermediate', 'Round 1 of the 2026 SA State Series Drift Championship at The Bend Motorsport Park. Features a purpose-built drift track with endless layout possibilities at this world-class facility. Drifting Collective practice on Saturday.', 'https://www.driftingsa.com.au/championship/', 'A$120', false, 'both', 'Drifting SA', 'manual'),

('Drifting SA - State Series Round 2', 'SA State Drift Series', '2026-05-10', NULL, 'Tailem Bend, South Australia', 'AU', 'The Bend Motorsport Park', -35.3083, 139.5167, 'proam', true, 'unlimited', 'intermediate', 'Round 2 of the SA State Series Drift Championship at The Bend. High-speed and technical layout possibilities on the purpose-built drift track. Competition and practice sessions available.', 'https://www.driftingsa.com.au/championship/', 'A$120', false, 'both', 'Drifting SA', 'manual'),

('Drifting SA - State Series Round 3', 'SA State Drift Series', '2026-07-12', NULL, 'Mallala, South Australia', 'AU', 'Mallala Motorsport Park', -34.5833, 138.5167, 'proam', true, 'unlimited', 'intermediate', 'Round 3 of the SA State Series Drift Championship at Mallala Motorsport Park. The historic Mallala circuit provides a different challenge from The Bend with its flowing, old-school layout.', 'https://www.driftingsa.com.au/championship/', 'A$120', false, 'both', 'Drifting SA', 'manual'),

-- ============================================================
-- AUSTRALIA - DriftWest (Western Australia)
-- ============================================================

('DriftWest Practice Day - March', NULL, '2026-03-14', NULL, 'Neerabup, Western Australia', 'AU', 'Wanneroo Raceway', -31.6634, 115.7910, 'practice', false, 'unlimited', 'all', 'DriftWest members practice day at Wanneroo Raceway (Barbagallo). Running 12 events in 2026 with graded driver management through Motorsport Australia. First-timers welcome for $250 without membership.', 'https://wascc.com.au/driftwest/', 'A$250', false, 'drive', 'WA Sporting Car Club', 'manual'),

('DriftWest Practice Day - May', NULL, '2026-05-16', NULL, 'Neerabup, Western Australia', 'AU', 'Wanneroo Raceway', -31.6634, 115.7910, 'practice', false, 'unlimited', 'all', 'DriftWest members practice day at Wanneroo Raceway. The home of drifting in Western Australia. Events run day and night with graded driver sessions. WASCC membership offers discounted ongoing entry.', 'https://wascc.com.au/driftwest/', 'A$250', false, 'drive', 'WA Sporting Car Club', 'manual'),

('DriftWest Practice Night - July', NULL, '2026-07-18', NULL, 'Neerabup, Western Australia', 'AU', 'Wanneroo Raceway', -31.6634, 115.7910, 'practice', false, 'unlimited', 'all', 'DriftWest night practice at Wanneroo Raceway under floodlights. One of 12 practice events in the 2026 calendar. All skill levels welcome with graded sessions for safety.', 'https://wascc.com.au/driftwest/', 'A$250', false, 'drive', 'WA Sporting Car Club', 'manual'),

-- ============================================================
-- AUSTRALIA - VicDrift (Victoria)
-- ============================================================

('VicDrift Practice Day - April', NULL, '2026-04-25', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'practice', false, 'unlimited', 'all', 'VicDrift practice day at Calder Park Raceway. Affordable drift practice from 9am to 4:30pm run by Victoria''s not-for-profit drift club. Open to beginners through competition-level drivers. Spectators welcome.', 'https://vicdrift.com/pages/event-days', 'A$35', false, 'drive', 'Victorian Drift Club', 'manual'),

('VicDrift Practice Day - June', NULL, '2026-06-27', NULL, 'Benalla, Victoria, Australia', 'AU', 'Winton Motor Raceway', -36.5177, 146.0858, 'practice', false, 'unlimited', 'all', 'VicDrift practice day at Winton Motor Raceway in country Victoria. A longer, faster layout than Calder Park offering a different drifting experience. Great for intermediate to advanced drivers looking to stretch their legs.', 'https://vicdrift.com/pages/event-days', 'A$40', false, 'drive', 'Victorian Drift Club', 'manual'),

-- ============================================================
-- AUSTRALIA - Powercruise
-- ============================================================

('Powercruise #100 - Queensland Raceway', 'Powercruise', '2026-06-18', '2026-06-21', 'Willowbank, Queensland, Australia', 'AU', 'Queensland Raceway', -27.6875, 152.6515, 'grassroots', false, 'unlimited', 'all', 'The massive milestone Powercruise #100 at Queensland Raceway, the home of Powercruise. Features cruise sessions, Powerskids, drifting competition, grudge racing, burnouts, show and shine, and live entertainment. A celebration of Australian car culture.', 'https://www.powercruise.com/events/', 'A$150', true, 'both', 'Powercruise', 'manual'),

-- ============================================================
-- AUSTRALIA - World Time Attack Challenge
-- ============================================================

('World Time Attack Challenge 2026', 'WTAC', '2026-09-04', '2026-09-05', 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'official', true, 'unlimited', 'advanced', 'The Yokohama World Time Attack Challenge returns to Sydney Motorsport Park. Two days of world-class time attack racing plus the Shannons StylizeD Show & Shine featuring drift demonstrations and a massive car culture festival.', 'https://www.worldtimeattack.com/', 'A$55', true, 'watch', 'WTAC', 'manual'),

-- ============================================================
-- MIDDLE EAST - UAE (Emirates Drift Championship)
-- ============================================================

('Emirates Drift Championship - Round 3', 'Emirates Drift Championship', '2026-03-07', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'official', true, 'unlimited', 'advanced', 'The Emirates Drift Championship at Yas Marina Circuit in Abu Dhabi. Drivers compete on the North Handling Configuration of the iconic Grand Prix track. Test & Tune session held the day before.', 'https://www.yasmarinacircuit.com/en/motorsports/emirates-drift-championship', 'AED 50', false, 'both', 'Emirates Motorsport Organization', 'manual'),

('Yas Drift Night - March', NULL, '2026-03-14', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'practice', false, 'unlimited', 'all', 'Yas Drift Night at Yas Marina Circuit. A 4-hour adrenaline-packed session where participants master the art of drifting on the dedicated drift track. Bring your own car or rent one on-site. Open to all skill levels.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-night', 'AED 350', false, 'drive', 'Yas Marina Circuit', 'manual'),

('Yas Drift Sprint - April', NULL, '2026-04-04', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'proam', false, 'unlimited', 'intermediate', 'Yas Drift Sprint at Yas Marina Circuit. An adrenaline-fueled battle where drivers bring their own cars and go head-to-head with opponents on mirrored drift layouts. Competitive but accessible format.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-sprint', 'AED 400', false, 'both', 'Yas Marina Circuit', 'manual'),

-- ============================================================
-- MIDDLE EAST - Dubai
-- ============================================================

('Dubai Autodrome Drift Night - March', NULL, '2026-03-20', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'all', 'Drift practice night at Dubai Autodrome. Open track time on the dedicated drift area of this FIA-sanctioned circuit. Popular with the UAE drift community. Bring your own car and tires.', 'https://dubaiautodrome.ae/whats-on/', 'AED 300', false, 'drive', 'Dubai Autodrome', 'manual'),

('Dubai Autodrome Drift Night - May', NULL, '2026-05-15', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'all', 'Drift night at Dubai Autodrome. Evening sessions to beat the summer heat. Open practice on the drift configuration with Dubai''s skyline in the distance. Helmet and closed shoes required.', 'https://dubaiautodrome.ae/whats-on/', 'AED 300', false, 'drive', 'Dubai Autodrome', 'manual'),

-- ============================================================
-- MIDDLE EAST - Saudi Arabia
-- ============================================================

('Saudi Toyota Drift Championship - Riyadh Round', 'Saudi Toyota Championship', '2026-03-13', '2026-03-14', 'Riyadh, Saudi Arabia', 'SA', 'Dirab Motor Park', 24.4617, 46.5789, 'official', true, 'unlimited', 'advanced', 'The Saudi Toyota Drift Championship round at Dirab Motor Park in Riyadh. Part of the larger Saudi Toyota Championship which includes rally, time attack, drag, and drift disciplines. Growing professional drift scene.', 'https://www.saudi-championship.com/t-en/drift-1', 'SAR 50', false, 'both', 'Saudi Automobile & Motorcycle Federation', 'manual'),

('Red Bull Car Park Drift - Saudi Arabia Qualifier', 'Red Bull Car Park Drift', '2026-04-17', '2026-04-18', 'Riyadh, Saudi Arabia', 'SA', 'Riyadh Parking Area', 24.6877, 46.7219, 'official', false, 'unlimited', 'intermediate', 'Red Bull Car Park Drift Saudi Arabia national qualifier. Drivers compete on a custom-designed cone course in a parking area, judged on speed, angle, and proximity to obstacles. Top finishers advance to the World Final.', 'https://www.redbull.com/mea-en/events/red-bull-car-park-drift-ksa', NULL, true, 'both', 'Red Bull', 'manual'),

-- ============================================================
-- MIDDLE EAST - Kuwait
-- ============================================================

('Red Bull Car Park Drift - Kuwait Qualifier', 'Red Bull Car Park Drift', '2026-03-06', '2026-03-07', 'Arifjan, Kuwait', 'KW', 'Kuwait Motor Town', 28.9290, 48.1407, 'official', false, 'unlimited', 'intermediate', 'Red Bull Car Park Drift Kuwait qualifier at Kuwait Motor Town, the region''s premier motorsport facility. Reinvented competition format for 2026. Qualifiers and National Final across two days.', 'https://www.redbull.com/mea-en/events/red-bull-car-park-drift-kuwait', NULL, false, 'both', 'Red Bull', 'manual'),

-- ============================================================
-- MIDDLE EAST - Jordan
-- ============================================================

('Red Bull Car Park Drift - Jordan Qualifier', 'Red Bull Car Park Drift', '2026-05-22', '2026-05-23', 'Amman, Jordan', 'JO', 'Amman Exhibition Park', 31.9539, 35.9106, 'official', false, 'unlimited', 'intermediate', 'Red Bull Car Park Drift Jordan national qualifier. The 14th edition brings the iconic cone-course drifting competition to Amman. Hundreds of competitors battle for a spot at the World Final.', 'https://www.redbull.com/mea-en/events/red-bull-car-park-drift-jordan', NULL, false, 'both', 'Red Bull', 'manual'),

-- ============================================================
-- MIDDLE EAST - Oman
-- ============================================================

('Red Bull Car Park Drift - Oman Qualifier', 'Red Bull Car Park Drift', '2026-06-12', '2026-06-13', 'Muscat, Oman', 'OM', 'Oman Convention & Exhibition Centre', 23.5880, 58.1711, 'official', false, 'unlimited', 'intermediate', 'Red Bull Car Park Drift Oman qualifier in Muscat. Oman''s Alamri won the 2024 World Final title, making Oman a powerhouse in the series. Top drifters compete for national glory and a World Final berth.', 'https://www.redbull.com/mea-en/events/red-bull-car-park-drift-oman', NULL, false, 'both', 'Red Bull', 'manual'),

-- ============================================================
-- REST OF ASIA - Thailand
-- ============================================================

('Underground Drift Thailand - Bangkok Round', NULL, '2026-04-25', '2026-04-26', 'Pathumthani, Thailand', 'TH', 'Pathumthani Speedway', 14.0833, 100.5333, 'proam', false, 'unlimited', 'intermediate', 'Underground Drift Thailand competition round at Pathumthani Speedway near Bangkok. Thailand''s growing drift scene features both local talent and international competitors. Southeast Asia''s drift culture is booming.', NULL, 'THB 500', false, 'both', 'Underground Drift Thailand', 'manual'),

-- ============================================================
-- REST OF ASIA - China
-- ============================================================

('China Drift Championship - Shanghai Round', 'China Drift Championship', '2026-05-30', '2026-05-31', 'Shanghai, China', 'CN', 'Shanghai International Circuit', 31.3389, 121.2197, 'official', true, 'unlimited', 'advanced', 'The China Drift Championship visits the Shanghai International Circuit. China''s professional drift series continues to grow with increasing investment and driver talent. Major spectator event in the Shanghai motorsport calendar.', NULL, '¥100 CNY', false, 'watch', 'China Drift Championship', 'manual'),

-- ============================================================
-- REST OF ASIA - Malaysia
-- ============================================================

('Formula Drift Asia - Malaysia Round', 'Formula Drift Asia', '2026-06-27', '2026-06-28', 'Sepang, Malaysia', 'MY', 'Sepang International Circuit', 2.7608, 101.7380, 'official', true, 'unlimited', 'advanced', 'Formula Drift Asia at the legendary Sepang International Circuit. The Southeast Asia Drift Series (SEADS) affiliate brings professional-level drifting to Malaysia. Growing rapidly with regional talent development.', 'https://formuladriftasia.com/', 'MYR 80', true, 'watch', 'SEADS / Formula Drift', 'manual');
