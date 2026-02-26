-- ============================================================
-- New Events Seed Data (March - September 2026)
-- Run in Supabase SQL Editor AFTER events-migration.sql
-- Adds ~150 events across Europe, USA, Japan, Asia, ME, Oceania
-- ============================================================

-- ============================================================
-- PART 1: UPDATE corrections for existing events
-- ============================================================

-- Fix YumeDrift dates and location (actual 2026 data: July 25-26, Kursenai)
UPDATE public.events
SET date = '2026-07-25',
    end_date = '2026-07-26',
    location = 'Kursenai, Lithuania',
    track = 'STMC Autodrome',
    lat = 56.1311,
    lng = 22.9367,
    price = '€45',
    description = 'EZVIZ YumeDrift is Lithuania''s premier international drift festival celebrating Japanese car culture. Two days of drift sessions, show cars, karts, simulators, afterparty with DJs, and camping at the STMC Autodrome.'
WHERE name = 'YumeDrift International Festival 2026';

-- Fix Gatebil Valerbanen dates (actual 2026: May 29-31)
UPDATE public.events
SET date = '2026-05-29',
    end_date = '2026-05-31',
    location = 'Askim, Norway',
    track = 'Valerbanen',
    lat = 59.5590,
    lng = 11.1670,
    description = 'Gatebil Valerbanen kicks off the 2026 Gatebil festival season. 3-day event with drifting, time attack, show & shine, camping, and legendary party atmosphere. A bucket-list event for any car enthusiast.'
WHERE name = 'Gatebil Scandinavian Drift - Valerbanen';

-- Fix Spring Drift Matsuri dates (actual 2026: April 5-6)
UPDATE public.events
SET date = '2026-04-05',
    end_date = '2026-04-06',
    name = 'Spring Drift Matsuri 2026',
    description = 'The UK''s answer to Japanese Drift Matsuri culture. Easter weekend of non-stop drifting at Anglesey Circuit in North Wales. Three different track layouts including a touge-style course. Over 100 drivers, camping and afterparty included.'
WHERE name = 'UK Drift Matsuri - Anglesey';

-- Fix Irish Drift Championship Rd.3 dates (actual 2026: June 13-15)
UPDATE public.events
SET date = '2026-06-13',
    end_date = '2026-06-15',
    location = 'Watergrasshill, Co. Cork, Ireland',
    description = 'The IDC returns to Watergrasshill for Round 3. Known for producing some of the closest tandem battles in European drifting. Hill climb style street circuit with massive elevation changes.'
WHERE name = 'Irish Drift Championship Rd.3 - Watergrasshill';

-- Fix Ebisu Spring Drift Matsuri dates (actual 2026: May 9-10)
UPDATE public.events
SET date = '2026-05-09',
    end_date = '2026-05-10',
    description = 'Non-stop drifting for 36 hours at the legendary Ebisu Circuit, home to 7 individual courses. Open to anyone with a drift car - all skill levels welcome. Night sessions, tandems, and the raw spirit of Japanese drift culture.'
WHERE name = 'Ebisu Spring Drift Matsuri 2026';

-- Fix D1GP Fuji event (2026 has Rd.Zero at Fuji on Apr 19)
UPDATE public.events
SET name = 'D1 Grand Prix Rd.Zero - Fuji Speedway',
    date = '2026-04-19',
    end_date = NULL,
    description = 'The 2026 D1 Grand Prix exhibition round at the iconic Fuji Speedway. An early-season showcase featuring Japan''s top professional drifters on one of motorsport''s most famous circuits, with Mount Fuji as the backdrop.',
    lat = 35.3697,
    lng = 138.9227
WHERE name = 'D1 Grand Prix Rd.4 - Fuji Speedway';


-- ============================================================
-- PART 2: NEW EVENTS
-- ============================================================

insert into public.events (name, series, date, end_date, location, country, track, lat, lng, category, cage_required, tire_size, skill_level, description, event_url, price, is_hot, participation, organizer, source) values

-- ============================================================
-- EUROPE: DRIFT MASTERS (rounds not in original seed)
-- ============================================================
('Drift Masters Rd.2 - Jarama', 'Drift Masters', '2026-05-16', '2026-05-17', 'San Sebastian de los Reyes, Spain', 'ES', 'Circuito del Madrid Jarama-RACE', 40.6170, -3.5860, 'official', true, 'unlimited', 'advanced', 'Drift Masters Round 2 at Spain''s iconic Circuito del Jarama near Madrid. The technical layout with challenging elevation changes and banked corners provides a spectacular backdrop.', 'https://dm.gp/seasons/drift-masters-2026/', '€45', true, 'watch', 'Drift Masters GP', 'manual'),

('Drift Masters Rd.4 - Ahvenisto', 'Drift Masters', '2026-07-11', '2026-07-12', 'Hameenlinna, Finland', 'FI', 'Ahvenisto Race Circuit', 60.9833, 24.4500, 'official', true, 'unlimited', 'advanced', 'A brand-new addition to the Drift Masters calendar. Ahvenisto Race Circuit in Finland is fast, high-commitment, and defined by elevation changes. The Finnish round brings Nordic passion to the championship.', 'https://dm.gp/seasons/drift-masters-2026/', '€40', true, 'watch', 'Drift Masters GP', 'manual'),

-- ============================================================
-- EUROPE: DRIFT KINGS INTERNATIONAL SERIES
-- ============================================================
('Drift Kings Rd.1 - Nurburgring', 'Drift Kings', '2026-04-24', '2026-04-26', 'Nurburg, Germany', 'DE', 'Nurburgring Mullenbachschleife', 50.3356, 6.9475, 'official', true, 'unlimited', 'advanced', 'Drift Kings 2026 season opener at the legendary Nurburgring. Partnership with Skylimit Events and the Nurburgring Drift Cup. Three days of pro drifting at the world''s most famous racing venue.', 'https://driftkings.com/dk26/', '€35', true, 'watch', 'Drift Kings International', 'manual'),

('Drift Kings - Gonco Fest Bulgaria', 'Drift Kings', '2026-05-09', '2026-05-10', 'Plovdiv, Bulgaria', 'BG', 'Plovdiv International Fair', 42.1354, 24.7453, 'official', true, 'unlimited', 'advanced', 'Drift Kings brings professional international drifting to Bulgaria for the first time at the Balkan Drift Cup during Gonco Fest in Plovdiv.', 'https://driftkings.com/dk26/', '€25', false, 'watch', 'Drift Kings International', 'manual'),

('Drift Kings Rd.2 - Anneau du Rhin', 'Drift Kings', '2026-06-12', '2026-06-14', 'Biltzheim, France', 'FR', 'Anneau du Rhin', 47.9250, 7.2950, 'official', true, 'unlimited', 'advanced', 'Round 2 of the Drift Kings European tour at the Anneau du Rhin circuit in Alsace, France. Three days of intense pro drift competition in the heart of wine country.', 'https://driftkings.com/dk26/', '€30', false, 'watch', 'Drift Kings International', 'manual'),

('Drift Kings Rd.3 - RabocsiRing', 'Drift Kings', '2026-07-11', '2026-07-12', 'Mariapocs, Hungary', 'HU', 'RabocsiRing', 47.8753, 21.9850, 'official', true, 'unlimited', 'advanced', 'The Drift Kings Summer Festival at RabocsiRing in Hungary. The venue''s wide corners and technical sections push the best European drifters to their limits.', 'https://driftkings.com/dk26/', '€25', false, 'watch', 'Drift Kings International', 'manual'),

-- ============================================================
-- EUROPE: NURBURGRING DRIFT CUP
-- ============================================================
('Nurburgring Drift Cup Rd.1', 'Nurburgring Drift Cup', '2026-04-25', '2026-04-26', 'Nurburg, Germany', 'DE', 'Nurburgring Mullenbachschleife', 50.3356, 6.9475, 'proam', true, 'unlimited', 'intermediate', 'Opening round of the 2026 Nurburgring Drift Cup. Free practice, qualifying, and head-to-head battles. 1,000-horsepower vehicles drift metres from the fans.', 'https://nuerburgring.de/events/categories/automotive/drift-cup', '€25', false, 'both', 'Nurburgring', 'manual'),

('Nurburgring Drift Cup Rd.2', 'Nurburgring Drift Cup', '2026-08-01', '2026-08-02', 'Nurburg, Germany', 'DE', 'Nurburgring Mullenbachschleife', 50.3356, 6.9475, 'proam', true, 'unlimited', 'intermediate', 'Round 2 of the Nurburgring Drift Cup. Europe''s best drifters return to the iconic Mullenbachschleife for precision driving at high speeds.', 'https://nuerburgring.de/events/categories/automotive/drift-cup', '€25', false, 'both', 'Nurburgring', 'manual'),

-- ============================================================
-- EUROPE: IRISH DRIFT CHAMPIONSHIP
-- ============================================================
('Irish Drift Championship Rd.1 - Mondello', 'Irish Drift Championship', '2026-04-11', '2026-04-13', 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'official', true, 'unlimited', 'advanced', 'The IDC season kicks off at Mondello Park. Ireland''s premier racing circuit hosts the opening round with fierce tandem battles and passionate Irish drift fans.', 'https://www.irishdriftchampionship.com/', '€30', true, 'watch', 'Irish Drift Championship', 'manual'),

('Irish Drift Championship Rd.2 - Bishopcourt', 'Irish Drift Championship', '2026-05-23', '2026-05-25', 'Downpatrick, Northern Ireland', 'GB', 'Bishopcourt Racing Circuit', 54.3280, -5.6110, 'official', true, 'unlimited', 'advanced', 'Round 2 of the IDC heads to Bishopcourt in Northern Ireland. The fast, flowing layout creates epic door-to-door tandem battles.', 'https://www.irishdriftchampionship.com/', '€30', false, 'watch', 'Irish Drift Championship', 'manual'),

('Irish Drift Championship Rd.4 - Bishopcourt', 'Irish Drift Championship', '2026-08-01', '2026-08-03', 'Downpatrick, Northern Ireland', 'GB', 'Bishopcourt Racing Circuit', 54.3280, -5.6110, 'official', true, 'unlimited', 'advanced', 'The IDC returns to Bishopcourt for Round 4. Title contenders battle it out with the championship really heating up.', 'https://www.irishdriftchampionship.com/', '€30', false, 'watch', 'Irish Drift Championship', 'manual'),

('Irish Drift Championship Rd.5 - Watergrasshill', 'Irish Drift Championship', '2026-08-23', '2026-08-24', 'Watergrasshill, Co. Cork, Ireland', 'IE', 'Watergrasshill Motorsport Complex', 51.9500, -8.3500, 'official', true, 'unlimited', 'advanced', 'Penultimate round of the IDC at the iconic Watergrasshill hillclimb venue. The tight, technical hill climb course punishes mistakes and rewards commitment.', 'https://www.irishdriftchampionship.com/', '€30', false, 'watch', 'Irish Drift Championship', 'manual'),

-- ============================================================
-- EUROPE: DRIFT LEAGUE GB
-- ============================================================
('Drift League GB Rd.1 - Three Sisters', 'Drift League GB', '2026-05-02', '2026-05-03', 'Ashton-in-Makerfield, UK', 'GB', 'Three Sisters Circuit', 53.4960, -2.6340, 'proam', true, 'unlimited', 'intermediate', 'The most driver-focused drift series in the UK opens at Three Sisters Circuit. Full championship competition with practice, qualifying, and tandem battles.', 'https://driftleague.co.uk/', '£120', false, 'both', 'Drift League GB', 'manual'),

('Drift League GB Rd.2 - Driftland', 'Drift League GB', '2026-06-06', '2026-06-07', 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'proam', true, 'unlimited', 'intermediate', 'Drift League GB heads to Scotland''s purpose-built drift facility. Driftland''s unique layout challenges drivers with tight corners and committed entries.', 'https://driftleague.co.uk/', '£120', false, 'both', 'Drift League GB', 'manual'),

('Drift League GB Rd.3 - Teesside', 'Drift League GB', '2026-07-11', '2026-07-12', 'Middlesbrough, UK', 'GB', 'Teesside Autodrome', 54.5100, -1.2800, 'proam', true, 'unlimited', 'intermediate', 'Round 3 at Teesside Autodrome. The tight technical layout rewards precision driving and commitment.', 'https://driftleague.co.uk/', '£120', false, 'both', 'Drift League GB', 'manual'),

('Drift League GB Rd.4 - Pembrey', 'Drift League GB', '2026-08-15', '2026-08-16', 'Llanelli, Wales', 'GB', 'Pembrey Circuit', 51.6970, -4.3380, 'proam', true, 'unlimited', 'intermediate', 'Drift League GB at Pembrey Circuit in West Wales. Championship pressure mounts in the penultimate round.', 'https://driftleague.co.uk/', '£120', false, 'both', 'Drift League GB', 'manual'),

-- ============================================================
-- EUROPE: FRENCH DRIFT CHAMPIONSHIP (CFD)
-- ============================================================
('Championnat de France Drift Rd.1 - Val de Vienne', 'CFD', '2026-04-11', '2026-04-12', 'Le Vigeant, France', 'FR', 'Circuit du Val de Vienne', 46.3440, 0.6530, 'official', true, 'unlimited', 'advanced', 'The French Drift Championship FFSA opens at Val de Vienne. Seven-round season with solo qualifications and top-32 head-to-head elimination battles.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.2 - Vesoul', 'CFD', '2026-05-08', '2026-05-09', 'Vesoul, France', 'FR', 'Circuit de la Vallee', 47.6276, 6.1563, 'official', true, 'unlimited', 'advanced', 'Round 2 of the CFD at Circuit de la Vallee near Vesoul.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.3 - Val d''Argenton', 'CFD', '2026-05-23', '2026-05-24', 'Argenton-les-Vallees, France', 'FR', 'Val d''Argenton', 46.9850, -0.4480, 'official', true, 'unlimited', 'advanced', 'The CFD heads to Val d''Argenton for Round 3.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.4 - Croix-en-Ternois', 'CFD', '2026-06-06', '2026-06-07', 'Croix-en-Ternois, France', 'FR', 'Circuit de Croix-en-Ternois', 50.4250, 2.2820, 'official', true, 'unlimited', 'advanced', 'Round 4 at the fast and flowing Croix-en-Ternois circuit in northern France. One of the best-attended rounds.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.5 - Luby Toge', 'CFD', '2026-06-27', '2026-06-28', 'Luby-Betmont, France', 'FR', 'Luby-Betmont to Osmets Road', 43.0980, 0.3760, 'official', true, 'unlimited', 'advanced', 'The CFD takes to the Pyrenean mountain roads for a true Toge-style round. Drifting on closed public roads with spectacular hillside spectating.', 'https://driftfrance.com/', '€20', true, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.6 - Calmont', 'CFD', '2026-08-29', '2026-08-30', 'Calmont, France', 'FR', 'Calmont Toge', 43.2850, 1.6340, 'official', true, 'unlimited', 'advanced', 'The CFD takes to the mountain roads for a Toge-style round near Calmont in southern France. Spectacular hillclimb drifting.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

-- ============================================================
-- EUROPE: ITALIAN DRIFT CHAMPIONSHIP (CID)
-- ============================================================
('Campionato Italiano Drifting Rd.1 - Battipaglia', 'CID', '2026-04-18', '2026-04-19', 'Battipaglia, Italy', 'IT', 'Circuito di Battipaglia', 40.6100, 14.9830, 'official', true, 'unlimited', 'advanced', 'The Italian Drift Championship opens at Battipaglia near Salerno. Organized by D-Race SRL under ACI Sport, the CID features Italy''s best drifters.', 'https://www.acisport.it/it/CID/home', '€20', false, 'watch', 'ACI Sport / D-Race', 'manual'),

('Campionato Italiano Drifting Rd.2 - Prato', 'CID', '2026-05-16', '2026-05-17', 'Prato, Italy', 'IT', 'Autodromo del Mugello Area', 43.8800, 11.0960, 'official', true, 'unlimited', 'advanced', 'Round 2 of the CID heads to Tuscany. Italian passion meets technical drifting excellence in one of motorsport''s most scenic regions.', 'https://www.acisport.it/it/CID/home', '€20', false, 'watch', 'ACI Sport / D-Race', 'manual'),

-- ============================================================
-- EUROPE: CZECH DRIFT SERIES
-- ============================================================
('Czech Drift Series PRO Rd.1 - Slovakia Ring', 'Czech Drift Series', '2026-04-03', NULL, 'Orechova Poton, Slovakia', 'SK', 'Slovakia Ring', 47.9540, 17.6260, 'official', true, 'unlimited', 'advanced', 'Opening round of the Czech Drift Series at Slovakia Ring. The Race the Streets format delivers intense street-style drifting at Central Europe''s premier circuit.', 'https://www.drifting.cz/', '€15', false, 'watch', 'Czech Drift Series', 'manual'),

('Czech Drift Series PRO Rd.2 - Fun Arena Cheb', 'Czech Drift Series', '2026-04-19', NULL, 'Cheb, Czech Republic', 'CZ', 'Fun Arena Cheb', 50.0685, 12.3842, 'official', true, 'unlimited', 'advanced', 'Round 2 of the Czech Drift Series PRO division at Fun Arena Cheb. Tight street-style drifting with concrete walls.', 'https://www.drifting.cz/', '250 CZK', false, 'watch', 'Czech Drift Series', 'manual'),

('Czech Drift Series PRO Rd.3 - Libros', 'Czech Drift Series', '2026-06-13', NULL, 'Liberec, Czech Republic', 'CZ', 'Libros Circuit', 50.7601, 15.0543, 'official', true, 'unlimited', 'advanced', 'Czech Drift Series mid-season round at Libros. The Czech and Slovak drifting scene continues to grow with fierce competition.', 'https://www.drifting.cz/', '250 CZK', false, 'watch', 'Czech Drift Series', 'manual'),

('Czech Drift Series PRO Rd.4 - Ostrava', 'Czech Drift Series', '2026-08-07', '2026-08-08', 'Ostrava, Czech Republic', 'CZ', 'Dolni Vitkovice', 49.8209, 18.2820, 'official', true, 'unlimited', 'advanced', 'The Czech Drift Series Race the Streets round in Ostrava''s industrial Dolni Vitkovice area. Street drifting between heritage industrial buildings.', 'https://www.drifting.cz/', '300 CZK', false, 'watch', 'Czech Drift Series', 'manual'),

-- ============================================================
-- EUROPE: HUNGARIAN PRO DRIFT CHAMPIONSHIP
-- ============================================================
('Hungarian Pro Drift Rd.1 - Slovakia Ring', 'Hungarian Pro Drift', '2026-04-03', NULL, 'Orechova Poton, Slovakia', 'SK', 'Slovakia Ring', 47.9540, 17.6260, 'official', true, 'unlimited', 'advanced', 'The 2026 Hungarian Professional Drift Championship kicks off at Slovakia Ring. Speeds up to 150 km/h.', 'https://drifting.hu/en/', '€15', false, 'watch', 'Drifting.hu', 'manual'),

('Trackwood #15 Drift Festival', 'Hungarian Pro Drift', '2026-08-27', '2026-08-29', 'Mariapocs, Hungary', 'HU', 'RabocsiRing', 47.8753, 21.9850, 'grassroots', false, 'unlimited', 'all', 'Trackwood Drift Festival returns to RabocsiRing for its 15th edition. PRO and PRO2 competition, Kiss the Wall challenge, open practice and festival atmosphere.', 'https://trackwood.com/en/', '€25', false, 'both', 'Trackwood / Drifting.hu', 'manual'),

-- ============================================================
-- EUROPE: GATEBIL FESTIVALS
-- ============================================================
('Gatebil Mantorp Summer Festival', 'Gatebil', '2026-06-11', '2026-06-14', 'Mantorp, Sweden', 'SE', 'Mantorp Park', 58.3000, 15.2830, 'grassroots', true, 'unlimited', 'intermediate', 'Gatebil Summer Festival at Sweden''s Mantorp Park. Four days of drifting, time attack, show cars, camping, and the famous Gatebil Drift Battle with the biggest prize pool ever.', 'https://gatebil.no/mantorp-summer-festival-2026/', '600 SEK', true, 'both', 'Gatebil', 'manual'),

('Gatebil Rudskogen Main Festival', 'Gatebil', '2026-07-02', '2026-07-05', 'Rakkestad, Norway', 'NO', 'Rudskogen Motorsenter', 59.4050, 11.3400, 'grassroots', true, 'unlimited', 'intermediate', 'The flagship Gatebil event. Four massive days with 1000+ cars, non-stop drifting, time attack, show & shine, and camping. The largest car festival in Scandinavia.', 'https://gatebil.no/2026-rudskogen-main-festival-july-2-5/', '800 NOK', true, 'both', 'Gatebil', 'manual'),

-- ============================================================
-- EUROPE: SCANDINAVIAN DRIFT SERIES
-- ============================================================
('Scandinavian Drift Series - Valerbanen', 'Scandinavian Drift Series', '2026-05-30', NULL, 'Askim, Norway', 'NO', 'Valerbanen', 59.5590, 11.1670, 'proam', true, 'unlimited', 'intermediate', 'The Gatebil Scandinavian Drift Series round at Valerbanen during the Gatebil festival weekend.', 'https://gatebil.no/gatebil-scandinavian-drift-series/', '550 NOK', false, 'watch', 'Gatebil SDS', 'manual'),

('Scandinavian Drift Series - Mantorp', 'Scandinavian Drift Series', '2026-06-13', NULL, 'Mantorp, Sweden', 'SE', 'Mantorp Park', 58.3000, 15.2830, 'proam', true, 'unlimited', 'intermediate', 'SDS competition at Mantorp Park during the Gatebil Summer Festival. Top Nordic drifters battle it out.', 'https://gatebil.no/gatebil-scandinavian-drift-series/', '600 SEK', false, 'watch', 'Gatebil SDS', 'manual'),

('Scandinavian Drift Series - Rudskogen', 'Scandinavian Drift Series', '2026-07-04', NULL, 'Rakkestad, Norway', 'NO', 'Rudskogen Motorsenter', 59.4050, 11.3400, 'proam', true, 'unlimited', 'intermediate', 'SDS championship round at Rudskogen during the flagship Gatebil Main Festival. The biggest SDS event of the year.', 'https://gatebil.no/gatebil-scandinavian-drift-series/', '800 NOK', false, 'watch', 'Gatebil SDS', 'manual'),

-- ============================================================
-- EUROPE: DRIFT SPAIN SERIES
-- ============================================================
('Drift Spain Rd.1 - Jarama', 'Drift Spain', '2026-03-07', '2026-03-08', 'San Sebastian de los Reyes, Spain', 'ES', 'Circuito del Madrid Jarama-RACE', 40.6170, -3.5860, 'official', true, 'unlimited', 'advanced', 'Opening round of the Drift Spain Series at the Circuito de Jarama in Madrid. Spain''s new drift championship features Semipro and Pro categories.', 'https://driftspainseries.com/', '€25', false, 'watch', 'Drift Spain Series', 'manual'),

-- ============================================================
-- EUROPE: BALTIC DRIFT CHAMPIONSHIP
-- ============================================================
('Baltic Drift Championship - Latvia Rd.1', 'Baltic Drift Championship', '2026-05-16', NULL, 'Riga, Latvia', 'LV', 'Bikernieki Circuit', 56.9665, 24.2326, 'proam', true, 'unlimited', 'intermediate', 'Opening round of the 2026 Baltic Drift Championship at Bikernieki Circuit in Riga. Six rounds across Latvia, Lithuania, and Estonia.', 'https://www.driftlatvia.com/', '€15', false, 'both', 'Baltic Drift Association', 'manual'),

('Baltic Drift Championship - Lithuania', 'Baltic Drift Championship', '2026-06-14', NULL, 'Kaunas, Lithuania', 'LT', 'Kaunas Nemunas Ring', 54.8869, 23.9275, 'proam', true, 'unlimited', 'intermediate', 'Baltic Drift Championship round in Lithuania. The growing Baltic drift scene showcases talented drivers from across the region.', 'https://www.driftlatvia.com/', '€12', false, 'both', 'Baltic Drift Association', 'manual'),

('Baltic Drift Championship - Estonia', 'Baltic Drift Championship', '2026-07-18', NULL, 'Parnu, Estonia', 'EE', 'Auto24ring', 58.3570, 24.5320, 'proam', true, 'unlimited', 'intermediate', 'Baltic Drift Championship Estonian round at the Auto24ring near Parnu.', 'https://www.driftlatvia.com/', '€12', false, 'both', 'Baltic Drift Association', 'manual'),

-- ============================================================
-- EUROPE: GRASSROOTS & CULTURE EVENTS
-- ============================================================
('Drift Games Spring Bash', NULL, '2026-02-28', '2026-03-01', 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'grassroots', false, 'unlimited', 'all', 'The Tire Streets Drift Games Spring Bash kicks off the drift season at Mondello Park. Over 150 drivers, wild 15-car trains, pro car shakedowns. Pure drift party energy.', 'https://bash.driftgames.life/', '€40', true, 'both', 'Drift Games / Tire Streets', 'manual'),

('Drift Games Summer Bash', NULL, '2026-07-19', '2026-07-20', 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'grassroots', false, 'unlimited', 'all', 'Mid-season Tire Streets Drift Games Bash at Mondello Park. 150+ drivers, pro cars, grassroots heroes, and a legendary afterparty.', 'https://bash.driftgames.life/', '€40', false, 'both', 'Drift Games / Tire Streets', 'manual'),

('Japfest Silverstone 2026', NULL, '2026-04-19', NULL, 'Towcester, UK', 'GB', 'Silverstone Circuit', 52.0786, -1.0169, 'grassroots', false, 'unlimited', 'all', 'The UK''s biggest Japanese car festival returns to Silverstone. Over 3,500 cars on display and 25,000 visitors. Features Drift Kings powered by Drift Matsuri.', 'https://japfest.co.uk/silverstone/', '£30', true, 'both', 'Japfest / Fast Car', 'manual'),

('Iron Drift King - Ferropolis', NULL, '2026-08-13', '2026-08-15', 'Grafenhainichen, Germany', 'DE', 'Ferropolis', 51.7570, 12.4427, 'official', true, 'unlimited', 'advanced', 'The Iron Drift King spectacular at Ferropolis, the City of Iron. Over 32 professional drifting athletes from 20+ nations compete with 1200 hp cars. Towering industrial structures as backdrop.', 'https://www.irondriftking.de/en', '€45', true, 'watch', 'Iron Drift King', 'manual'),

('L8-Night Weekend Lausitzring', NULL, '2026-07-16', '2026-07-18', 'Klettwitz, Germany', 'DE', 'EuroSpeedway Lausitz', 51.5275, 13.9333, 'grassroots', false, 'unlimited', 'all', 'The L8-Night Weekend at EuroSpeedway Lausitz combines quarter-mile racing, road course driving, drift shows, parties and camping.', 'https://www.l8-night.de/lausitzring', '€50', false, 'both', 'L8-Night', 'manual'),

('Reisbrennen Lausitzring', NULL, '2026-07-30', '2026-08-02', 'Klettwitz, Germany', 'DE', 'EuroSpeedway Lausitz', 51.5275, 13.9333, 'grassroots', false, 'unlimited', 'all', 'Europe''s largest 4-day meeting for Asian vehicles at the Lausitzring. The 22nd Reisbrennen features a massive drift show, quarter-mile racing, and drift basic courses.', 'https://www.reisbrennen.de/', '€60', true, 'both', 'Reisbrennen', 'manual'),

('Drift Matsuri Summer 2026', NULL, '2026-08-08', '2026-08-09', 'Anglesey, North Wales, UK', 'GB', 'Anglesey Circuit - Trac Mon', 53.1880, -4.4960, 'grassroots', true, 'unlimited', 'all', 'Summer edition of the UK Drift Matsuri at Anglesey Circuit. Over 100 drivers across three track layouts including the famous touge course.', 'https://www.driftmatsuri.com/', '£80', false, 'drive', 'Drift Matsuri UK', 'manual'),

('Mondello Park Action Day', NULL, '2026-06-01', NULL, 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'grassroots', false, 'unlimited', 'all', 'Bank Holiday Monday multi-discipline event at Mondello Park. On-track action from race cars, buggies, rally cars, drift cars, track cars, and supercars.', 'https://mondellopark.ie/', '€25', false, 'watch', 'Mondello Park', 'manual'),

('Drift Events Scotland - Crimond', 'Drift Events Scotland', '2026-03-07', '2026-03-08', 'Crimond, Scotland', 'GB', 'Crimond Raceway', 57.6200, -1.8700, 'grassroots', true, 'unlimited', 'all', 'Drift Events Scotland at Crimond Raceway in Aberdeenshire. Open to all levels with a relaxed, inclusive atmosphere.', 'https://driftevents.co.uk/', '£60', false, 'drive', 'Drift Events Scotland', 'manual'),

('Crimond Drift Fest 2026', 'Drift Events Scotland', '2026-04-11', '2026-04-12', 'Crimond, Scotland', 'GB', 'Crimond Raceway', 57.6200, -1.8700, 'grassroots', true, 'unlimited', 'all', 'Two-day drift festival at Crimond Raceway. Racing competitions, grudge battles, trade stands, food vendors. One of Scotland''s biggest drift gatherings.', 'https://driftevents.co.uk/events/crimond-drift-fest-2026/', '£70', false, 'both', 'Drift Events Scotland', 'manual'),

('Driftland The Takeover', NULL, '2026-03-28', '2026-03-29', 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'grassroots', true, 'unlimited', 'all', 'Weekend takeover at Driftland, the UK''s only purpose-built drift track. Multiple layouts across two days.', 'https://www.driftlanduk.com/', '£80', false, 'drive', 'Driftland', 'manual'),

('King of Drift - Lilo Arena', 'King of Drift', '2026-05-23', '2026-05-24', 'Tbilisi, Georgia', 'GE', 'Lilo Arena', 41.7500, 44.8630, 'official', true, 'unlimited', 'advanced', 'King of Drift championship round at Lilo Arena in Tbilisi, Georgia. No restrictions on car power or models.', 'https://kingofdrift.com/', '30 GEL', false, 'watch', 'King of Drift', 'manual'),

-- ============================================================
-- EUROPE: PRACTICE DAYS
-- ============================================================
('Driftland Spring Practice Day', NULL, '2026-04-04', NULL, 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'practice', false, 'unlimited', 'beginner', 'Open practice at the UK''s only purpose-built drift track. Drift experiences with tuition, car, and tires provided. Perfect for beginners.', 'https://www.driftlanduk.com/', '£75', false, 'drive', 'Driftland', 'manual'),

('Driftland Summer Practice Day', NULL, '2026-06-20', NULL, 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'practice', false, 'unlimited', 'beginner', 'Summer practice day at Scotland''s purpose-built drift facility. Open pitlane format with multiple layouts.', 'https://www.driftlanduk.com/', '£75', false, 'drive', 'Driftland', 'manual'),

('Mondello Park Drift Experience Day', NULL, '2026-05-09', NULL, 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'practice', false, 'unlimited', 'beginner', 'Learn to drift at Ireland''s premier racing circuit. Professional instruction, purpose-built drift cars. No experience necessary.', 'https://mondellopark.ie/drift-experience/', '€99', false, 'drive', 'Mondello Park', 'manual'),

('Drift Kings Winter Training - Serres', 'Drift Kings', '2026-03-14', '2026-03-15', 'Serres, Greece', 'GR', 'Serres Racing Circuit', 41.0550, 23.5730, 'practice', false, 'unlimited', 'intermediate', 'Pre-season training at the Serres Racing Circuit in Greece. Two days for Drift Kings drivers to sharpen skills. Greece''s only FIA-accredited facility.', 'https://driftkings.com/dk26/', '€100', false, 'drive', 'Drift Kings International', 'manual'),

-- ============================================================
-- USA: FORMULA DRIFT PRO (Rounds 3-6)
-- ============================================================
('Formula Drift Rd.3 - Scorched', 'Formula Drift', '2026-05-29', '2026-05-30', 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'official', true, 'unlimited', 'advanced', 'Formula Drift Round 3 heads to Orlando Speed World for the annual Scorched event. Florida heat, intense competition, and huge tire smoke.', 'https://www.formulad.com/schedule/2026/orlando', '$50', true, 'watch', 'Formula Drift', 'manual'),

('Formula Drift Rd.4 - Stafford Springs', 'Formula Drift', '2026-06-18', '2026-06-20', 'Stafford Springs, Connecticut', 'US', 'Stafford Motor Speedway', 41.9854, -72.2787, 'official', true, 'unlimited', 'advanced', 'Brand new venue for 2026! Formula Drift heads to Stafford Motor Speedway, bringing FD to the Northeast for the first time.', 'https://www.formulad.com/schedule/2026/stafford', '$55', true, 'watch', 'Formula Drift', 'manual'),

('Formula Drift Rd.5 - Midwest Mayhem', 'Formula Drift', '2026-07-30', '2026-08-01', 'Indianapolis, Indiana', 'US', 'Lucas Oil Indianapolis Raceway Park', 39.6933, -86.3444, 'official', true, 'unlimited', 'advanced', 'Another brand new venue for 2026! Formula Drift arrives at Indianapolis Raceway Park, steeped in American racing history since 1960.', 'https://www.formulad.com/schedule/2026/indianapolis', '$55', true, 'watch', 'Formula Drift', 'manual'),

('Formula Drift Rd.6 - Throwdown', 'Formula Drift', '2026-08-21', '2026-08-22', 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'official', true, 'unlimited', 'advanced', 'Formula Drift returns to Evergreen Speedway for the annual Throwdown. The Pacific Northwest fan base creates one of the loudest atmospheres on the FD calendar.', 'https://www.formulad.com/schedule/2026/seattle', '$50', true, 'watch', 'Formula Drift', 'manual'),

-- ============================================================
-- USA: FORMULA DRIFT PROSPEC
-- ============================================================
('Formula Drift PROSPEC Rd.1 - Road Atlanta', 'Formula Drift PROSPEC', '2026-05-07', '2026-05-09', 'Braselton, Georgia', 'US', 'Michelin Raceway Road Atlanta', 34.1413, -83.8173, 'official', true, 'unlimited', 'advanced', 'The 2026 PROSPEC Championship kicks off at Road Atlanta alongside the PRO event. Up-and-coming drivers battle for a chance at the pro ranks.', 'https://www.formulad.com/schedule/2026/atlanta', '$50', false, 'watch', 'Formula Drift', 'manual'),

('Formula Drift PROSPEC Rd.2 - Stafford Springs', 'Formula Drift PROSPEC', '2026-06-18', '2026-06-20', 'Stafford Springs, Connecticut', 'US', 'Stafford Motor Speedway', 41.9854, -72.2787, 'official', true, 'unlimited', 'advanced', 'PROSPEC Round 2 at the brand-new Stafford Motor Speedway venue alongside the PRO championship.', 'https://www.formulad.com/schedule/2026/stafford', '$55', false, 'watch', 'Formula Drift', 'manual'),

('Formula Drift PROSPEC Rd.3 - Indianapolis', 'Formula Drift PROSPEC', '2026-07-30', '2026-08-01', 'Indianapolis, Indiana', 'US', 'Lucas Oil Indianapolis Raceway Park', 39.6933, -86.3444, 'official', true, 'unlimited', 'advanced', 'PROSPEC Round 3 at Indianapolis Raceway Park alongside the PRO event.', 'https://www.formulad.com/schedule/2026/indianapolis', '$55', false, 'watch', 'Formula Drift', 'manual'),

-- ============================================================
-- USA: GRIDLIFE 2026
-- ============================================================
('Gridlife South Carolina', 'Gridlife', '2026-04-17', '2026-04-19', 'Kershaw, South Carolina', 'US', 'Carolina Motorsports Park', 34.5486, -80.5800, 'grassroots', false, 'unlimited', 'all', 'Gridlife kicks off 2026 at Carolina Motorsports Park. Three days of racing, time attack, full-course drifting, skidpad sessions, car show, and live music.', 'https://www.grid.life/south-carolina', '$60', false, 'both', 'Gridlife', 'manual'),

('Gridlife Special Stage ATL', 'Gridlife', '2026-05-07', '2026-05-09', 'Braselton, Georgia', 'US', 'Michelin Raceway Road Atlanta', 34.1413, -83.8173, 'grassroots', false, 'unlimited', 'all', 'Gridlife returns to Road Atlanta for Special Stage ATL, a collaborative weekend with Formula Drift. Drift, time attack, and car culture in the Southeast.', 'https://www.grid.life/events', '$60', true, 'both', 'Gridlife', 'manual'),

('Gridlife Midwest Festival', 'Gridlife', '2026-06-12', '2026-06-14', 'South Haven, Michigan', 'US', 'GingerMan Raceway', 42.3478, -86.3250, 'grassroots', false, 'unlimited', 'all', 'The flagship Gridlife Midwest Festival at GingerMan Raceway. Three days of motorsport and music, featuring drifting, racing, time attack, massive car show, and headlining DJ sets.', 'https://www.grid.life/midwest-festival', '$75', true, 'both', 'Gridlife', 'manual'),

('Gridlife Summer Apex', 'Gridlife', '2026-07-24', '2026-07-26', 'Watkins Glen, New York', 'US', 'Watkins Glen International', 42.3369, -76.9273, 'grassroots', false, 'unlimited', 'all', 'Gridlife returns to the legendary Watkins Glen International. Full-scale festival with drift exhibitions, road racing, time attack, car culture, and live music.', 'https://www.grid.life/events', '$75', true, 'both', 'Gridlife', 'manual'),

('Gridlife Circuit Legends', 'Gridlife', '2026-08-21', '2026-08-23', 'Lakeville, Connecticut', 'US', 'Lime Rock Park', 41.9283, -73.3833, 'grassroots', false, 'unlimited', 'all', 'Gridlife Circuit Legends at the historic Lime Rock Park in Connecticut. Drift exhibitions, road racing, and time attack at New England''s most scenic racetrack.', 'https://www.grid.life/events', '$65', false, 'both', 'Gridlife', 'manual'),

-- ============================================================
-- USA: LZ WORLD TOUR
-- ============================================================
('LZ World Tour - Englishtown', 'LZ World Tour', '2026-04-18', '2026-04-19', 'Englishtown, New Jersey', 'US', 'Old Bridge Township Raceway Park', 40.3310, -74.3340, 'proam', true, 'unlimited', 'advanced', 'Adam LZ brings the LZ World Tour to E-Town Raceway Park. Two days of elite drifting and car culture with Last Chance Top 16 format.', 'https://www.lzworldtour.com/events/englishtown-2026/', '$45', true, 'watch', 'LZ World Tour / LZMFG', 'manual'),

-- ============================================================
-- USA: KLUTCH KICKERS $100K DRIFT SERIES
-- ============================================================
('Klutch Kickers 100K Series Rd.1', 'Klutch Kickers', '2026-04-29', '2026-05-01', 'Bradenton, Florida', 'US', 'Freedom Factory', 27.4350, -82.5550, 'proam', true, 'unlimited', 'advanced', 'Season 3 of the Klutch Kickers $100K Drift Series kicks off at the Freedom Factory. 80 drivers battle for $20,000 per round.', 'https://www.klutchkickers.com', '$40', true, 'watch', 'Klutch Kickers', 'manual'),

('Klutch Kickers 100K Series Rd.2', 'Klutch Kickers', '2026-06-24', '2026-06-26', 'Bradenton, Florida', 'US', 'Freedom Factory', 27.4350, -82.5550, 'proam', true, 'unlimited', 'advanced', 'Round 2 of the Klutch Kickers $100K Drift Series at Freedom Factory. Intense tandem battles under the Florida sun.', 'https://www.klutchkickers.com', '$40', false, 'watch', 'Klutch Kickers', 'manual'),

('Klutch Kickers 100K Series Rd.3', 'Klutch Kickers', '2026-08-12', '2026-08-14', 'Bradenton, Florida', 'US', 'Freedom Factory', 27.4350, -82.5550, 'proam', true, 'unlimited', 'advanced', 'Round 3 of the Klutch Kickers $100K Drift Series. Championship points tighten as the season heats up.', 'https://www.klutchkickers.com', '$40', false, 'watch', 'Klutch Kickers', 'manual'),

-- ============================================================
-- USA: DRIFTCON & FINAL BOUT
-- ============================================================
('DriftCon Season Opener - Big Bounty', 'DriftCon', '2026-04-11', NULL, 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'proam', false, 'unlimited', 'all', 'DriftCon kicks off 2026 with the Big Bounty Tournament at Evergreen Speedway. 64-driver competition bracket, car show, vendors, and beer garden.', 'https://www.driftcon.us', '$30', false, 'both', 'DriftCon', 'manual'),

('Final Bout Special Stage East', 'Final Bout', '2026-05-02', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point Motorsports Park', 39.2313, -77.9703, 'grassroots', false, 'unlimited', 'intermediate', 'Final Bout Special Stage East at Summit Point. Teams of three or more cars compete in tandem drifting judged equally on driving ability and vehicle style. A cornerstone of American drift culture.', 'https://www.final-bout.com/pages/fb2026', '$150', true, 'both', 'Final Bout', 'manual'),

('Final Bout Special Stage Central', 'Final Bout', '2026-06-20', NULL, 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'grassroots', false, 'unlimited', 'intermediate', 'Final Bout Special Stage Central. Team-based tandem drifting where driving (50%) and car style (50%) are equally weighted. Winners advance to the Summit championship.', 'https://www.final-bout.com/pages/fb2026', '$150', false, 'both', 'Final Bout', 'manual'),

-- ============================================================
-- USA: LONE STAR DRIFT
-- ============================================================
('Lone Star Bash', 'Lone Star Drift', '2026-03-20', '2026-03-22', 'College Station, Texas', 'US', 'CAMS Training Facility', 30.5775, -96.3025, 'grassroots', false, 'unlimited', 'all', 'The Lone Star Bash is a 3-day drift party at the CAMS Training Facility. Open track time, tandem sessions, and incredible atmosphere. One of Texas'' most loved grassroots drift events.', 'https://lonestardrift.com', '$250', true, 'drive', 'Lone Star Drift', 'manual'),

-- ============================================================
-- USA: HYPERFEST
-- ============================================================
('HyperFest 2026', NULL, '2026-05-15', '2026-05-17', 'Alton, Virginia', 'US', 'Virginia International Raceway', 36.5667, -79.2072, 'grassroots', false, 'unlimited', 'all', 'HyperFest celebrates its 25th anniversary as the largest automotive festival on the East Coast. Three days of drifting, road racing, off-road, rally, and live music. Over 15,000 spectators.', 'https://www.hyper-fest.com/', '$50', true, 'both', 'NASA / HyperFest', 'manual'),

-- ============================================================
-- USA: CLUB LOOSE
-- ============================================================
('Club Loose East Coast Bash', 'Club Loose', '2026-06-30', '2026-07-01', 'Englishtown, New Jersey', 'US', 'Old Bridge Township Raceway Park', 40.3310, -74.3340, 'grassroots', false, 'unlimited', 'all', 'The legendary Club Loose East Coast Bash at E-Town. A fun-filled weekend of drifting and partying with the East Coast drift community. All levels welcome.', 'https://clubloose.com', '$100', true, 'drive', 'Club Loose', 'manual'),

-- ============================================================
-- USA: HOTPIT AUTOFEST (SoCal ProAm)
-- ============================================================
('HOTPIT Autofest Rd.1', 'HOTPIT Autofest', '2026-03-28', NULL, 'San Bernardino, California', 'US', 'Orange Show Speedway', 34.0886, -117.2792, 'proam', false, 'unlimited', 'intermediate', 'HOTPIT Autofest Round 1 at Orange Show Speedway. Western USA''s most exciting premier drift series. Winner earns points toward a Formula Drift PRO license.', 'https://www.hotpitautofest.com/', '$30', false, 'both', 'HOTPIT Autofest', 'manual'),

('HOTPIT Autofest Rd.2', 'HOTPIT Autofest', '2026-05-16', NULL, 'Bakersfield, California', 'US', 'Kern County Raceway', 35.2478, -118.8644, 'proam', false, 'unlimited', 'intermediate', 'HOTPIT Autofest Round 2 at Kevin Harvick''s Kern County Raceway. Intense tandem battles and car show.', 'https://www.hotpitautofest.com/', '$30', false, 'both', 'HOTPIT Autofest', 'manual'),

('HOTPIT Autofest Rd.3', 'HOTPIT Autofest', '2026-07-11', NULL, 'Irwindale, California', 'US', 'Irwindale Speedway', 34.0856, -117.9711, 'proam', false, 'unlimited', 'intermediate', 'HOTPIT Autofest Round 3 at the legendary Irwindale Speedway, "The House of Drift." The iconic banked oval that helped launch American drift culture.', 'https://www.hotpitautofest.com/', '$30', false, 'both', 'HOTPIT Autofest', 'manual'),

-- ============================================================
-- USA: DRIFT COLORADO
-- ============================================================
('Drift Colorado Rd.1', 'Drift Colorado', '2026-04-25', NULL, 'Colorado Springs, Colorado', 'US', 'Pikes Peak International Raceway', 38.7264, -104.7181, 'proam', false, 'unlimited', 'all', 'Drift Colorado Round 1 at Pikes Peak International Raceway. Multi-round championship as part of Formula Drift''s Pro-Am program.', 'https://www.driftcolorado.com/event-schedule', '$100', false, 'both', 'Drift Colorado', 'manual'),

('Drift Colorado Rd.2', 'Drift Colorado', '2026-06-13', NULL, 'Pueblo, Colorado', 'US', 'Pueblo Motorsports Park', 38.3219, -104.5417, 'proam', false, 'unlimited', 'all', 'Drift Colorado Round 2. Affordable entry-level drifting competition in the Rocky Mountain region.', 'https://www.driftcolorado.com/event-schedule', '$100', false, 'both', 'Drift Colorado', 'manual'),

-- ============================================================
-- USA: EAST10 DRIFT
-- ============================================================
('East10 Drift - Road Atlanta', 'East10 Drift', '2026-04-04', NULL, 'Braselton, Georgia', 'US', 'Michelin Raceway Road Atlanta', 34.1413, -83.8173, 'proam', false, 'unlimited', 'intermediate', 'East10 Drift competition at Road Atlanta. Part of Formula Drift''s Pro-Am program with a path to professional licensing.', 'https://east10drift.com/', '$125', false, 'both', 'East10 Drift', 'manual'),

('East10 Drift - Bristol', 'East10 Drift', '2026-06-06', NULL, 'Bristol, Tennessee', 'US', 'Bristol Motor Speedway', 36.5153, -82.2569, 'proam', false, 'unlimited', 'intermediate', 'East10 Drift brings Pro-Am drifting to Bristol Motor Speedway, one of NASCAR''s most iconic venues.', 'https://east10drift.com/', '$125', false, 'both', 'East10 Drift', 'manual'),

-- ============================================================
-- USA: GREAT LAKES PRO-AM
-- ============================================================
('Great Lakes Pro-Am Rd.1', 'Great Lakes Pro-Am', '2026-05-30', NULL, 'North East, Pennsylvania', 'US', 'Lake Erie Speedway', 42.1539, -79.8347, 'proam', false, 'unlimited', 'intermediate', 'Great Lakes Pro-Am Series Round 1 at Lake Erie Speedway. Part of Formula Drift''s Pro-Am licensing program.', 'https://www.formulad.com/pro-am', '$125', false, 'both', 'Great Lakes Pro-Am', 'manual'),

('Great Lakes Pro-Am Rd.2', 'Great Lakes Pro-Am', '2026-07-18', NULL, 'North East, Pennsylvania', 'US', 'Lake Erie Speedway', 42.1539, -79.8347, 'proam', false, 'unlimited', 'intermediate', 'Great Lakes Pro-Am Series Round 2 at Lake Erie Speedway. Continuing the multi-round championship.', 'https://www.formulad.com/pro-am', '$125', false, 'both', 'Great Lakes Pro-Am', 'manual'),

-- ============================================================
-- USA: USAIR MOTORSPORTS RACEWAY (Wisconsin)
-- ============================================================
('ClubFR Drift Day 108', 'ClubFR', '2026-04-18', '2026-04-19', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'practice', false, 'unlimited', 'all', 'ClubFR Drift Day 108. Two full days of open drifting on one of the Midwest''s best dedicated drift facilities.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$175', false, 'drive', 'ClubFR', 'manual'),

('USAIR Drift Games', NULL, '2026-05-09', '2026-05-10', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'grassroots', false, 'unlimited', 'all', 'USAIR Drift Games: a weekend of competitive drift events. Fun format competition with tandem battles and solo qualifying on the full course.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$175', false, 'both', 'USAIR Motorsports', 'manual'),

('Drift Week 11', 'Drift Week', '2026-05-28', '2026-05-30', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'grassroots', false, 'unlimited', 'intermediate', 'Drift Week 11 is a multi-day, multi-venue drift road trip. One of the most unique events in American drift culture.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$300', true, 'drive', 'Drift Week', 'manual'),

('Off the Rails Drift Competition', NULL, '2026-06-06', '2026-06-07', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'proam', false, 'unlimited', 'intermediate', 'Off the Rails: A Fight to the Top of the Rollercoaster at USAIR. Unique competition format with two days of intense tandem battles.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$175', false, 'both', 'USAIR Motorsports', 'manual'),

-- ============================================================
-- USA: PRACTICE DAYS & BEGINNER EVENTS
-- ============================================================
('Drift Nirvana - Drift 101', 'Drift Nirvana', '2026-03-01', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point - Washington Circuit', 39.2313, -77.9703, 'practice', false, 'unlimited', 'beginner', 'Drift Nirvana Drift 101 at Summit Point. Perfect introduction to drifting with professional instruction. Learn car control, initiating slides, and basic tandem technique.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$200', false, 'drive', 'Drift Nirvana', 'manual'),

('Drift Nirvana - Season Opener', 'Drift Nirvana', '2026-03-08', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point - Shenandoah Circuit', 39.2313, -77.9703, 'practice', false, 'unlimited', 'all', 'Drift Nirvana Season Opener on the Shenandoah Circuit at Summit Point. Open practice with tandem sessions. All skill levels welcome.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$175', false, 'drive', 'Drift Nirvana', 'manual'),

('Drift Nirvana - April Drift 101', 'Drift Nirvana', '2026-04-12', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point - Washington Circuit', 39.2313, -77.9703, 'practice', false, 'unlimited', 'beginner', 'Drift 101 beginner session at Summit Point. Professional instruction for beginners on the Washington Circuit.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$200', false, 'drive', 'Drift Nirvana', 'manual'),

('Evergreen Open Drift - March', NULL, '2026-03-08', NULL, 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'practice', false, 'unlimited', 'all', 'Open drift practice at Evergreen Speedway. Affordable seat time on the famous banked oval that hosts Formula Drift. All skill levels welcome.', 'https://evergreenspeedway.com/drift/drift-schedule/', '$75', false, 'drive', 'Evergreen Speedway', 'manual'),

('OSW Drift Learners Day & After Dark', 'OSW Drift', '2026-03-21', NULL, 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'practice', false, 'unlimited', 'beginner', 'OSW Drift Learners Day at Orlando Speed World. 5 hours of guided in-car instruction, followed by After Dark open drift session.', 'https://oswdrift.com', '$165', false, 'drive', 'OSW Drift', 'manual'),

('Bay Area Drifting School - March', 'Bay Area Drifting', '2026-03-14', '2026-03-15', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'practice', false, 'unlimited', 'beginner', 'Bay Area Drifting school at Thunderhill Raceway. Small student-to-instructor ratio ensures personalized coaching. Perfect for beginners.', 'https://www.bayareadrifting.com/schedule', '$350', false, 'drive', 'Bay Area Drifting', 'manual'),

('Bay Area Drifting School - May', 'Bay Area Drifting', '2026-05-09', '2026-05-10', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'practice', false, 'unlimited', 'beginner', 'Bay Area Drifting school weekend at Thunderhill. Professional drift instruction for beginners and intermediate drivers.', 'https://www.bayareadrifting.com/schedule', '$350', false, 'drive', 'Bay Area Drifting', 'manual'),

('Thunderhill Open 2026', NULL, '2026-05-15', '2026-05-17', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'grassroots', false, 'unlimited', 'all', 'Three days of racing, drifting, music, and motorsport culture at Thunderhill Raceway Park. Grassroots drift competition brought to life by Matt Field and Drift Cave.', 'https://www.thunderhill.com/', '$250', false, 'both', 'Thunderhill Raceway / Drift Cave', 'manual'),

-- ============================================================
-- JAPAN: D1 GRAND PRIX 2026
-- ============================================================
('D1 Grand Prix Rd.1 & Rd.2 - Aichi Sky Expo', 'D1 Grand Prix', '2026-05-09', '2026-05-10', 'Tokoname, Aichi, Japan', 'JP', 'Aichi Sky Expo', 34.8585, 136.8145, 'official', true, 'unlimited', 'advanced', 'The 2026 D1 Grand Prix season officially opens with a double-header at Aichi Sky Expo near Nagoya. Two championship rounds in one weekend.', 'https://d1gp.co.jp', '¥6,000', true, 'watch', 'D1 Corporation', 'manual'),

('D1 Grand Prix Rd.3 & Rd.4 - Tsukuba Circuit', 'D1 Grand Prix', '2026-06-27', '2026-06-28', 'Shimotsuma, Ibaraki, Japan', 'JP', 'Tsukuba Circuit', 36.1510, 139.9195, 'official', true, 'unlimited', 'advanced', 'D1 Grand Prix double-header at Tsukuba Circuit. The tight technical layout demands precision and car control. Close proximity to Tokyo makes this one of the best-attended rounds.', 'https://d1gp.co.jp', '¥5,500', true, 'watch', 'D1 Corporation', 'manual'),

-- ============================================================
-- JAPAN: FORMULA DRIFT JAPAN 2026
-- ============================================================
('Formula Drift Japan Rd.1 - Fuji Speedway', 'Formula Drift Japan', '2026-04-25', '2026-04-26', 'Oyama, Shizuoka, Japan', 'JP', 'Fuji Speedway', 35.3697, 138.9227, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan 2026 opens at Fuji Speedway as part of the 3-day Fuji Xtreme Days festival.', 'https://formulad.jp', '¥5,000', true, 'watch', 'Formula Drift Japan', 'manual'),

('Formula Drift Japan Rd.2 - Suzuka Twin Circuit', 'Formula Drift Japan', '2026-05-16', '2026-05-17', 'Suzuka, Mie, Japan', 'JP', 'Suzuka Twin Circuit', 34.8433, 136.5377, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan Round 2 at Suzuka Twin Circuit. Fast sections and tight corners in Mie Prefecture.', 'https://formulad.jp', '¥4,500', true, 'watch', 'Formula Drift Japan', 'manual'),

('Formula Drift Japan Rd.3 - Ebisu Circuit', 'Formula Drift Japan', '2026-06-13', '2026-06-14', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit West Course', 37.6442, 140.3723, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan Round 3 at the legendary Ebisu Circuit West Course. Ebisu is the spiritual home of Japanese drifting.', 'https://formulad.jp', '¥4,500', true, 'watch', 'Formula Drift Japan', 'manual'),

('Formula Drift Japan Rd.4 - Sportsland SUGO', 'Formula Drift Japan', '2026-07-11', '2026-07-12', 'Murata, Miyagi, Japan', 'JP', 'Sportsland SUGO', 38.1364, 140.7736, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan Round 4 at Sportsland SUGO in Miyagi Prefecture. Challenging circuit known for elevation changes.', 'https://formulad.jp', '¥4,500', false, 'watch', 'Formula Drift Japan', 'manual'),

('Formula Drift Japan Rd.5 - GranSnow Okuibuki', 'Formula Drift Japan', '2026-09-05', '2026-09-06', 'Maibara, Shiga, Japan', 'JP', 'GranSnow Okuibuki Street Course', 35.4500, 136.3500, 'official', true, 'unlimited', 'advanced', 'Formula Drift Japan on the touge-style street course at GranSnow Okuibuki ski resort. One of the most unique drift venues in the world.', 'https://formulad.jp', '¥4,500', true, 'watch', 'Formula Drift Japan', 'manual'),

-- ============================================================
-- JAPAN: EBISU CIRCUIT
-- ============================================================
('Ebisu Summer Drift Matsuri 2026', NULL, '2026-08-22', '2026-08-23', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'grassroots', false, 'unlimited', 'all', 'The summer edition of the legendary Ebisu Drift Matsuri. 36 hours of non-stop drifting across all 7 courses. The ultimate bucket-list drift event.', 'https://powervehicles.com/drift-in-ebisu/', '¥10,000', true, 'both', 'Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - March', NULL, '2026-03-15', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Open practice day at Ebisu Circuit. Access to 5 drift courses all day. Pre-booking through Powervehicles required. Rental cars available.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - June', NULL, '2026-06-07', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Open practice day at Ebisu Circuit during the warm summer months. The Fukushima mountains are lush and green.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

-- ============================================================
-- JAPAN: OTHER CIRCUITS
-- ============================================================
('Nikko Circuit Drift Practice - March', NULL, '2026-03-22', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Grassroots drift practice at the iconic Nikko Circuit. One of Japan''s most legendary drift venues where modern drift culture was born. 2 hours from Tokyo.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

('Nikko Circuit Drift Practice - May', NULL, '2026-05-24', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Grassroots drift practice at Nikko Circuit. A compact, technical track that has been a cornerstone of Japanese drift culture since the 1990s.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

('Meihan Sportsland Drift Practice - Spring', NULL, '2026-04-05', NULL, 'Yamazoe, Nara, Japan', 'JP', 'Meihan Sportsland', 34.6833, 136.0500, 'practice', false, 'unlimited', 'all', 'Drift practice at the famous Meihan Sportsland E-course in Nara. A tight, technical figure-eight layout considered one of Japan''s best drift training grounds.', 'http://web1.kcn.jp/meihansl/', '¥5,000', false, 'drive', 'Meihan Sportsland', 'manual'),

('Meihan Sportsland Drift Practice - Summer', NULL, '2026-07-05', NULL, 'Yamazoe, Nara, Japan', 'JP', 'Meihan Sportsland', 34.6833, 136.0500, 'practice', false, 'unlimited', 'all', 'Summer drift practice at Meihan Sportsland. The iconic E-course is a pilgrimage site for drift enthusiasts visiting the Kansai region.', 'http://web1.kcn.jp/meihansl/', '¥5,000', false, 'drive', 'Meihan Sportsland', 'manual'),

('Mobara Twin Circuit Drift Practice - April', NULL, '2026-04-11', NULL, 'Mobara, Chiba, Japan', 'JP', 'Mobara Twin Circuit', 35.3818, 140.2813, 'practice', false, 'unlimited', 'all', 'Drift practice at Mobara Twin Circuit in Chiba. Only about 90 minutes from Tokyo, the closest drift track to the capital.', NULL, '¥5,500', false, 'drive', 'Mobara Twin Circuit', 'manual'),

('Mobara Twin Circuit Drift Practice - June', NULL, '2026-06-20', NULL, 'Mobara, Chiba, Japan', 'JP', 'Mobara Twin Circuit', 35.3818, 140.2813, 'practice', false, 'unlimited', 'all', 'Summer drift practice at Mobara Twin Circuit. The closest proper drift circuit to central Tokyo.', NULL, '¥5,500', false, 'drive', 'Mobara Twin Circuit', 'manual'),

-- ============================================================
-- JAPAN: DRIFT TOURS
-- ============================================================
('Drift Japan Tour - Kansai March 2026', NULL, '2026-03-07', '2026-03-16', 'Osaka, Japan', 'JP', 'Meihan Sportsland / Bihoku / Tokushima', 34.6833, 136.0500, 'grassroots', false, 'unlimited', 'all', 'A 10-day guided drift tour of Japan''s Kansai region. Includes 3 track days at Meihan Sportsland, Bihoku Highland, and Tokushima Kartland. Flights, accommodation, car hire included.', 'https://driftjapan.com.au/pages/dates-of-drifting-in-japan', '$8,600 USD', false, 'drive', 'Drift Japan Tours', 'manual'),

('Drift Japan Tour - Kansai June 2026', NULL, '2026-06-06', '2026-06-15', 'Osaka, Japan', 'JP', 'Meihan Sportsland / Bihoku / Tokushima', 34.6833, 136.0500, 'grassroots', false, 'unlimited', 'all', 'A 10-day guided drift tour of Japan''s Kansai region in early summer. Full package with flights, hotels, professionally tuned drift car hire, and cultural experiences.', 'https://driftjapan.com.au/pages/dates-of-drifting-in-japan', '$8,600 USD', false, 'drive', 'Drift Japan Tours', 'manual'),

-- ============================================================
-- NEW ZEALAND: D1NZ
-- ============================================================
('D1NZ Round 3 - Pukekohe Park Raceway', 'D1NZ', '2026-02-13', '2026-02-15', 'Pukekohe, Auckland, New Zealand', 'NZ', 'Pukekohe Park Raceway', -37.2093, 174.9180, 'official', true, 'unlimited', 'advanced', 'D1NZ returns to the legendary Pukekohe Park Raceway for one last time. A historic farewell event.', 'https://www.d1nz.com/round-3-pukekohe', 'NZ$35', true, 'watch', 'D1NZ', 'manual'),

('D1NZ Round 4 - H BlackBee Drift Park', 'D1NZ', '2026-03-20', '2026-03-22', 'Gisborne, New Zealand', 'NZ', 'H BlackBee Drift Park', -38.6623, 178.0177, 'official', true, 'unlimited', 'advanced', 'D1NZ makes its East Coast debut at the brand-new H BlackBee Drift Park in Gisborne. Pro drifting visits Tairawhiti for the first time.', 'https://www.d1nz.com/round-4-gisborne', 'NZ$35', true, 'watch', 'D1NZ', 'manual'),

('D1NZ Grand Final - Mercury Baypark Stadium', 'D1NZ', '2026-04-24', '2026-04-25', 'Tauranga, New Zealand', 'NZ', 'Mercury Baypark Stadium', -37.6861, 176.2248, 'official', true, 'unlimited', 'advanced', 'The D1NZ 2026 Grand Final over ANZAC Weekend. Championship battles, massive car show, Mount Cruise parade, live entertainment, and afterparty.', 'https://www.d1nz.com/round-5-baypark', 'NZ$45', true, 'watch', 'D1NZ', 'manual'),

-- ============================================================
-- AUSTRALIA: KEEP IT REET (Victoria)
-- ============================================================
('Keep it Reet - Friday Night Drifts March', NULL, '2026-03-06', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'grassroots', false, 'unlimited', 'all', 'Friday Night Drifts at Calder Park Raceway. 50 drifters throwing down for 6 hours under lights. Australia''s biggest drift club.', 'https://www.keepitreet.com/fridaynightdrifts', 'A$100', false, 'both', 'Keep it Reet', 'manual'),

('Keep it Reet - Friday Night Drifts April', NULL, '2026-04-03', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'grassroots', false, 'unlimited', 'all', 'Friday Night Drifts at Calder Park. 6 hours of grassroots drifting under the lights. Spectators welcome, food trucks on-site.', 'https://www.keepitreet.com/fridaynightdrifts', 'A$100', false, 'both', 'Keep it Reet', 'manual'),

('Keep it Reet - Friday Night Drifts May', NULL, '2026-05-01', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'grassroots', false, 'unlimited', 'all', 'Friday Night Drifts at Calder Park. Perfect entry point into Australian grassroots drifting.', 'https://www.keepitreet.com/fridaynightdrifts', 'A$100', false, 'both', 'Keep it Reet', 'manual'),

('Keep it Reet - Drift School+ June', NULL, '2026-06-14', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'grassroots', false, 'unlimited', 'beginner', 'Keep it Reet Drift School at Calder Park. Beginner-level track day with one-on-one lessons from certified instructors.', 'https://www.keepitreet.com', 'A$150', false, 'drive', 'Keep it Reet', 'manual'),

-- ============================================================
-- AUSTRALIA: DRIFTING SA (South Australia)
-- ============================================================
('Drifting SA - State Series Round 1', 'SA State Drift Series', '2026-03-08', NULL, 'Tailem Bend, South Australia', 'AU', 'The Bend Motorsport Park', -35.3083, 139.5167, 'proam', true, 'unlimited', 'intermediate', 'Round 1 of the SA State Series Drift Championship at The Bend Motorsport Park. Purpose-built drift track with endless layout possibilities.', 'https://www.driftingsa.com.au/championship/', 'A$120', false, 'both', 'Drifting SA', 'manual'),

('Drifting SA - State Series Round 2', 'SA State Drift Series', '2026-05-10', NULL, 'Tailem Bend, South Australia', 'AU', 'The Bend Motorsport Park', -35.3083, 139.5167, 'proam', true, 'unlimited', 'intermediate', 'Round 2 of the SA State Series Drift Championship at The Bend.', 'https://www.driftingsa.com.au/championship/', 'A$120', false, 'both', 'Drifting SA', 'manual'),

('Drifting SA - State Series Round 3', 'SA State Drift Series', '2026-07-12', NULL, 'Mallala, South Australia', 'AU', 'Mallala Motorsport Park', -34.5833, 138.5167, 'proam', true, 'unlimited', 'intermediate', 'Round 3 at the historic Mallala Motorsport Park. Different challenge from The Bend with a flowing, old-school layout.', 'https://www.driftingsa.com.au/championship/', 'A$120', false, 'both', 'Drifting SA', 'manual'),

-- ============================================================
-- AUSTRALIA: DRIFTWEST (Western Australia)
-- ============================================================
('DriftWest Practice Day - March', NULL, '2026-03-14', NULL, 'Neerabup, Western Australia', 'AU', 'Wanneroo Raceway', -31.6634, 115.7910, 'practice', false, 'unlimited', 'all', 'DriftWest members practice day at Wanneroo Raceway. First-timers welcome. Running 12 events in 2026.', 'https://wascc.com.au/driftwest/', 'A$250', false, 'drive', 'WA Sporting Car Club', 'manual'),

('DriftWest Practice Day - May', NULL, '2026-05-16', NULL, 'Neerabup, Western Australia', 'AU', 'Wanneroo Raceway', -31.6634, 115.7910, 'practice', false, 'unlimited', 'all', 'DriftWest practice at Wanneroo Raceway. The home of drifting in Western Australia.', 'https://wascc.com.au/driftwest/', 'A$250', false, 'drive', 'WA Sporting Car Club', 'manual'),

('DriftWest Practice Night - July', NULL, '2026-07-18', NULL, 'Neerabup, Western Australia', 'AU', 'Wanneroo Raceway', -31.6634, 115.7910, 'practice', false, 'unlimited', 'all', 'DriftWest night practice at Wanneroo Raceway under floodlights.', 'https://wascc.com.au/driftwest/', 'A$250', false, 'drive', 'WA Sporting Car Club', 'manual'),

-- ============================================================
-- AUSTRALIA: VICDRIFT & POWERCRUISE
-- ============================================================
('VicDrift Practice Day - April', NULL, '2026-04-25', NULL, 'Melbourne, Victoria, Australia', 'AU', 'Calder Park Raceway', -37.6719, 144.7536, 'practice', false, 'unlimited', 'all', 'VicDrift practice day at Calder Park Raceway. Affordable drift practice run by Victoria''s not-for-profit drift club.', 'https://vicdrift.com/pages/event-days', 'A$35', false, 'drive', 'Victorian Drift Club', 'manual'),

('VicDrift Practice Day - June', NULL, '2026-06-27', NULL, 'Benalla, Victoria, Australia', 'AU', 'Winton Motor Raceway', -36.5177, 146.0858, 'practice', false, 'unlimited', 'all', 'VicDrift practice at Winton Motor Raceway. A longer, faster layout offering a different drifting experience.', 'https://vicdrift.com/pages/event-days', 'A$40', false, 'drive', 'Victorian Drift Club', 'manual'),

('Powercruise #100 - Queensland Raceway', 'Powercruise', '2026-06-18', '2026-06-21', 'Willowbank, Queensland, Australia', 'AU', 'Queensland Raceway', -27.6875, 152.6515, 'grassroots', false, 'unlimited', 'all', 'The massive milestone Powercruise #100 at Queensland Raceway. Powerskids, drifting competition, grudge racing, burnouts, show and shine, and live entertainment.', 'https://www.powercruise.com/events/', 'A$150', true, 'both', 'Powercruise', 'manual'),

-- ============================================================
-- MIDDLE EAST: UAE
-- ============================================================
('Emirates Drift Championship - Round 3', 'Emirates Drift Championship', '2026-03-07', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'official', true, 'unlimited', 'advanced', 'The Emirates Drift Championship at Yas Marina Circuit. Drivers compete on the North Handling Configuration of the iconic Grand Prix track.', 'https://www.yasmarinacircuit.com/en/motorsports/emirates-drift-championship', 'AED 50', false, 'both', 'Emirates Motorsport Organization', 'manual'),

('Yas Drift Night - March', NULL, '2026-03-14', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'practice', false, 'unlimited', 'all', 'Yas Drift Night at Yas Marina Circuit. A 4-hour session mastering the art of drifting on the dedicated drift track. Open to all skill levels.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-night', 'AED 350', false, 'drive', 'Yas Marina Circuit', 'manual'),

('Yas Drift Sprint - April', NULL, '2026-04-04', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'proam', false, 'unlimited', 'intermediate', 'Yas Drift Sprint at Yas Marina Circuit. Drivers go head-to-head on mirrored drift layouts. Competitive but accessible format.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-sprint', 'AED 400', false, 'both', 'Yas Marina Circuit', 'manual'),

('Dubai Autodrome Drift Night - March', NULL, '2026-03-20', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'all', 'Drift practice night at Dubai Autodrome. Open track time on the dedicated drift area of this FIA-sanctioned circuit.', 'https://dubaiautodrome.ae/whats-on/', 'AED 300', false, 'drive', 'Dubai Autodrome', 'manual'),

('Dubai Autodrome Drift Night - May', NULL, '2026-05-15', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'all', 'Drift night at Dubai Autodrome. Evening sessions to beat the summer heat.', 'https://dubaiautodrome.ae/whats-on/', 'AED 300', false, 'drive', 'Dubai Autodrome', 'manual'),

-- ============================================================
-- MIDDLE EAST: SAUDI ARABIA & RED BULL CAR PARK DRIFT
-- ============================================================
('Saudi Toyota Drift Championship - Riyadh', 'Saudi Toyota Championship', '2026-03-13', '2026-03-14', 'Riyadh, Saudi Arabia', 'SA', 'Dirab Motor Park', 24.4617, 46.5789, 'official', true, 'unlimited', 'advanced', 'The Saudi Toyota Drift Championship round at Dirab Motor Park in Riyadh. Part of the larger Saudi Toyota Championship.', 'https://www.saudi-championship.com/t-en/drift-1', 'SAR 50', false, 'both', 'Saudi Automobile & Motorcycle Federation', 'manual'),

('Red Bull Car Park Drift - Saudi Qualifier', 'Red Bull Car Park Drift', '2026-04-17', '2026-04-18', 'Riyadh, Saudi Arabia', 'SA', 'Riyadh Parking Area', 24.6877, 46.7219, 'official', false, 'unlimited', 'intermediate', 'Red Bull Car Park Drift Saudi Arabia national qualifier. Drivers compete on a custom-designed cone course judged on speed, angle, and proximity.', 'https://www.redbull.com/mea-en/events/red-bull-car-park-drift-ksa', NULL, true, 'both', 'Red Bull', 'manual'),

('Red Bull Car Park Drift - Kuwait Qualifier', 'Red Bull Car Park Drift', '2026-03-06', '2026-03-07', 'Arifjan, Kuwait', 'KW', 'Kuwait Motor Town', 28.9290, 48.1407, 'official', false, 'unlimited', 'intermediate', 'Red Bull Car Park Drift Kuwait qualifier at Kuwait Motor Town. Reinvented competition format for 2026.', 'https://www.redbull.com/mea-en/events/red-bull-car-park-drift-kuwait', NULL, false, 'both', 'Red Bull', 'manual'),

('Red Bull Car Park Drift - Jordan Qualifier', 'Red Bull Car Park Drift', '2026-05-22', '2026-05-23', 'Amman, Jordan', 'JO', 'Amman Exhibition Park', 31.9539, 35.9106, 'official', false, 'unlimited', 'intermediate', 'Red Bull Car Park Drift Jordan national qualifier. The 14th edition brings iconic cone-course drifting to Amman.', 'https://www.redbull.com/mea-en/events/red-bull-car-park-drift-jordan', NULL, false, 'both', 'Red Bull', 'manual'),

('Red Bull Car Park Drift - Oman Qualifier', 'Red Bull Car Park Drift', '2026-06-12', '2026-06-13', 'Muscat, Oman', 'OM', 'Oman Convention & Exhibition Centre', 23.5880, 58.1711, 'official', false, 'unlimited', 'intermediate', 'Red Bull Car Park Drift Oman qualifier. Oman is a powerhouse in the series after winning the 2024 World Final.', 'https://www.redbull.com/mea-en/events/red-bull-car-park-drift-oman', NULL, false, 'both', 'Red Bull', 'manual'),

-- ============================================================
-- REST OF ASIA: THAILAND, CHINA, MALAYSIA
-- ============================================================
('Underground Drift Thailand - Bangkok', NULL, '2026-04-25', '2026-04-26', 'Pathumthani, Thailand', 'TH', 'Pathumthani Speedway', 14.0833, 100.5333, 'proam', false, 'unlimited', 'intermediate', 'Underground Drift Thailand competition near Bangkok. Thailand''s growing drift scene with local talent and international competitors.', NULL, 'THB 500', false, 'both', 'Underground Drift Thailand', 'manual'),

('China Drift Championship - Shanghai', 'China Drift Championship', '2026-05-30', '2026-05-31', 'Shanghai, China', 'CN', 'Shanghai International Circuit', 31.3389, 121.2197, 'official', true, 'unlimited', 'advanced', 'The China Drift Championship visits the Shanghai International Circuit. China''s professional drift series with increasing investment and talent.', NULL, '¥100 CNY', false, 'watch', 'China Drift Championship', 'manual'),

('Formula Drift Asia - Malaysia', 'Formula Drift Asia', '2026-06-27', '2026-06-28', 'Sepang, Malaysia', 'MY', 'Sepang International Circuit', 2.7608, 101.7380, 'official', true, 'unlimited', 'advanced', 'Formula Drift Asia at the legendary Sepang International Circuit. Professional-level drifting growing rapidly in the region.', 'https://formuladriftasia.com/', 'MYR 80', true, 'watch', 'SEADS / Formula Drift', 'manual');
