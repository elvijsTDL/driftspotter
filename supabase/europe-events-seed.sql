-- ============================================================
-- European Drift Events Seed (March 2026 - August 2026)
-- Run AFTER events-migration.sql
-- ============================================================
-- NOTE: Some events already exist in events-migration.sql seed.
-- This file adds NEW European events not present in the original seed,
-- plus corrections to existing entries via UPDATE statements.

-- ============================================================
-- PART 1: Update existing events with corrected data
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

-- Fix Spring Drift Matsuri dates (actual 2026: April 5-6, Easter weekend)
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


-- ============================================================
-- PART 2: Insert NEW European events (March - August 2026)
-- ============================================================

INSERT INTO public.events (name, series, date, end_date, location, country, track, lat, lng, category, cage_required, tire_size, skill_level, description, event_url, price, is_hot, participation, organizer, source) VALUES

-- ============================================================
-- DRIFT MASTERS (remaining rounds not in original seed)
-- ============================================================
('Drift Masters Rd.2 - Jarama', 'Drift Masters', '2026-05-16', '2026-05-17', 'San Sebastian de los Reyes, Spain', 'ES', 'Circuito del Madrid Jarama-RACE', 40.6170, -3.5860, 'official', true, 'unlimited', 'advanced', 'Drift Masters Round 2 at Spain''s iconic Circuito del Jarama near Madrid. The technical layout with challenging elevation changes and banked corners provides a spectacular backdrop. Warm Spanish atmosphere and passionate fans.', 'https://dm.gp/seasons/drift-masters-2026/', '€45', true, 'watch', 'Drift Masters GP', 'manual'),

('Drift Masters Rd.4 - Ahvenisto', 'Drift Masters', '2026-07-11', '2026-07-12', 'Hameenlinna, Finland', 'FI', 'Ahvenisto Race Circuit', 60.9833, 24.4500, 'official', true, 'unlimited', 'advanced', 'A brand-new addition to the Drift Masters calendar. Ahvenisto Race Circuit in Finland is fast, high-commitment, and defined by elevation changes. The Finnish round brings Nordic passion to the championship.', 'https://dm.gp/seasons/drift-masters-2026/', '€40', true, 'watch', 'Drift Masters GP', 'manual'),

-- ============================================================
-- DRIFT KINGS INTERNATIONAL SERIES (European rounds)
-- ============================================================
('Drift Kings Rd.1 - Nurburgring', 'Drift Kings', '2026-04-24', '2026-04-26', 'Nurburg, Germany', 'DE', 'Nurburgring Mullenbachschleife', 50.3356, 6.9475, 'official', true, 'unlimited', 'advanced', 'Drift Kings 2026 season opener at the legendary Nurburgring. Partnership with Skylimit Events and the Nurburgring Drift Cup. Three days of pro drifting at the world''s most famous racing venue.', 'https://driftkings.com/dk26/', '€35', true, 'watch', 'Drift Kings International', 'manual'),

('Drift Kings - Gonco Fest Bulgaria', 'Drift Kings', '2026-05-09', '2026-05-10', 'Plovdiv, Bulgaria', 'BG', 'Plovdiv International Fair', 42.1354, 24.7453, 'official', true, 'unlimited', 'advanced', 'For the first time ever, Drift Kings brings professional international drifting to Bulgaria at the Balkan Drift Cup during Gonco Fest in Plovdiv. A historic debut for competitive drifting in the Balkans.', 'https://driftkings.com/dk26/', '€25', false, 'watch', 'Drift Kings International', 'manual'),

('Drift Kings Rd.2 - Anneau du Rhin', 'Drift Kings', '2026-06-12', '2026-06-14', 'Biltzheim, France', 'FR', 'Anneau du Rhin', 47.9250, 7.2950, 'official', true, 'unlimited', 'advanced', 'Round 2 of the Drift Kings European tour at the Anneau du Rhin circuit in Alsace, France. Partnership with Drift Cup MSO. Three days of intense pro drift competition in the heart of wine country.', 'https://driftkings.com/dk26/', '€30', false, 'watch', 'Drift Kings International', 'manual'),

('Drift Kings Rd.3 - RabocsiRing', 'Drift Kings', '2026-07-11', '2026-07-12', 'Mariapocs, Hungary', 'HU', 'RabocsiRing', 47.8753, 21.9850, 'official', true, 'unlimited', 'advanced', 'The Drift Kings Summer Festival at RabocsiRing in Hungary. Partnership with Drifting.hu and Hunakamo. The venue''s wide corners and technical sections push the best European drifters to their limits.', 'https://driftkings.com/dk26/', '€25', false, 'watch', 'Drift Kings International', 'manual'),

-- ============================================================
-- NURBURGRING DRIFT CUP
-- ============================================================
('Nurburgring Drift Cup Rd.1', 'Nurburgring Drift Cup', '2026-04-25', '2026-04-26', 'Nurburg, Germany', 'DE', 'Nurburgring Mullenbachschleife', 50.3356, 6.9475, 'proam', true, 'unlimited', 'intermediate', 'Opening round of the 2026 Nurburgring Drift Cup in the Mullenbachschleife section. Free practice, qualifying, and spectacular head-to-head battles. 1,000-horsepower vehicles drift metres from the fans.', 'https://nuerburgring.de/events/categories/automotive/drift-cup', '€25', false, 'both', 'Nurburgring', 'manual'),

('Nurburgring Drift Cup Rd.2', 'Nurburgring Drift Cup', '2026-08-01', '2026-08-02', 'Nurburg, Germany', 'DE', 'Nurburgring Mullenbachschleife', 50.3356, 6.9475, 'proam', true, 'unlimited', 'intermediate', 'Round 2 of the Nurburgring Drift Cup. Europe''s best drifters return to the iconic Mullenbachschleife for precision driving at high speeds. Close proximity spectating and incredible atmosphere.', 'https://nuerburgring.de/events/categories/automotive/drift-cup', '€25', false, 'both', 'Nurburgring', 'manual'),

-- ============================================================
-- IRISH DRIFT CHAMPIONSHIP (IDC)
-- ============================================================
('Irish Drift Championship Rd.1 - Mondello', 'Irish Drift Championship', '2026-04-11', '2026-04-13', 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'official', true, 'unlimited', 'advanced', 'The IDC season kicks off at Mondello Park. Ireland''s premier racing circuit hosts the opening round with fierce tandem battles and passionate Irish drift fans creating an electric atmosphere.', 'https://www.irishdriftchampionship.com/', '€30', true, 'watch', 'Irish Drift Championship', 'manual'),

('Irish Drift Championship Rd.2 - Bishopcourt', 'Irish Drift Championship', '2026-05-23', '2026-05-25', 'Downpatrick, Northern Ireland', 'GB', 'Bishopcourt Racing Circuit', 54.3280, -5.6110, 'official', true, 'unlimited', 'advanced', 'Round 2 of the IDC heads to Bishopcourt in Northern Ireland. The fast, flowing layout with its challenging corners creates epic door-to-door tandem battles.', 'https://www.irishdriftchampionship.com/', '€30', false, 'watch', 'Irish Drift Championship', 'manual'),

('Irish Drift Championship Rd.4 - Bishopcourt', 'Irish Drift Championship', '2026-08-01', '2026-08-03', 'Downpatrick, Northern Ireland', 'GB', 'Bishopcourt Racing Circuit', 54.3280, -5.6110, 'official', true, 'unlimited', 'advanced', 'The IDC returns to Bishopcourt for Round 4. Title contenders battle it out in the second half of the season with the championship really heating up.', 'https://www.irishdriftchampionship.com/', '€30', false, 'watch', 'Irish Drift Championship', 'manual'),

('Irish Drift Championship Rd.5 - Watergrasshill', 'Irish Drift Championship', '2026-08-23', '2026-08-24', 'Watergrasshill, Co. Cork, Ireland', 'IE', 'Watergrasshill Motorsport Complex', 51.9500, -8.3500, 'official', true, 'unlimited', 'advanced', 'Penultimate round of the IDC at the iconic Watergrasshill hillclimb venue. The tight, technical hill climb course punishes mistakes and rewards commitment. Championship positions on the line.', 'https://www.irishdriftchampionship.com/', '€30', false, 'watch', 'Irish Drift Championship', 'manual'),

-- ============================================================
-- DRIFT LEAGUE GB
-- ============================================================
('Drift League GB Rd.1 - Three Sisters', 'Drift League GB', '2026-05-02', '2026-05-03', 'Ashton-in-Makerfield, UK', 'GB', 'Three Sisters Circuit', 53.4960, -2.6340, 'proam', true, 'unlimited', 'intermediate', 'The most driver-focused drift series in the UK opens at Three Sisters Circuit. Full championship competition with practice sessions, qualifying, and tandem battles.', 'https://driftleague.co.uk/', '£120', false, 'both', 'Drift League GB', 'manual'),

('Drift League GB Rd.2 - Driftland', 'Drift League GB', '2026-06-06', '2026-06-07', 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'proam', true, 'unlimited', 'intermediate', 'Drift League GB heads to Scotland''s purpose-built drift facility. Driftland''s unique layout challenges drivers with its tight corners and committed entries.', 'https://driftleague.co.uk/', '£120', false, 'both', 'Drift League GB', 'manual'),

('Drift League GB Rd.3 - Teesside', 'Drift League GB', '2026-07-11', '2026-07-12', 'Middlesbrough, UK', 'GB', 'Teesside Autodrome', 54.5100, -1.2800, 'proam', true, 'unlimited', 'intermediate', 'Round 3 at Teesside Autodrome. The tight technical layout rewards precision driving and commitment. Mid-season battles intensify as championship points accumulate.', 'https://driftleague.co.uk/', '£120', false, 'both', 'Drift League GB', 'manual'),

('Drift League GB Rd.4 - Pembrey', 'Drift League GB', '2026-08-15', '2026-08-16', 'Llanelli, Wales', 'GB', 'Pembrey Circuit', 51.6970, -4.3380, 'proam', true, 'unlimited', 'intermediate', 'Drift League GB at Pembrey Circuit in West Wales. The Welsh round offers a unique track layout and great spectator views. Championship pressure mounts in the penultimate round.', 'https://driftleague.co.uk/', '£120', false, 'both', 'Drift League GB', 'manual'),

-- ============================================================
-- FRENCH DRIFT CHAMPIONSHIP (CFD)
-- ============================================================
('Championnat de France Drift Rd.1 - Val de Vienne', 'CFD', '2026-04-11', '2026-04-12', 'Le Vigeant, France', 'FR', 'Circuit du Val de Vienne', 46.3440, 0.6530, 'official', true, 'unlimited', 'advanced', 'The French Drift Championship FFSA opens at Val de Vienne. Seven-round season with solo qualifications and top-32 head-to-head elimination battles.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.2 - Vesoul', 'CFD', '2026-05-08', '2026-05-09', 'Vesoul, France', 'FR', 'Circuit de la Vallee', 47.6276, 6.1563, 'official', true, 'unlimited', 'advanced', 'Round 2 of the CFD at Circuit de la Vallee near Vesoul. The 2026 season promises to be explosive with seven rounds and a mystery circuit.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.3 - Val d''Argenton', 'CFD', '2026-05-23', '2026-05-24', 'Argenton-les-Vallees, France', 'FR', 'Val d''Argenton', 46.9850, -0.4480, 'official', true, 'unlimited', 'advanced', 'The CFD heads to Val d''Argenton for Round 3. French drifting''s top drivers battle through the qualifying and elimination rounds.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.4 - Croix-en-Ternois', 'CFD', '2026-06-06', '2026-06-07', 'Croix-en-Ternois, France', 'FR', 'Circuit de Croix-en-Ternois', 50.4250, 2.2820, 'official', true, 'unlimited', 'advanced', 'Round 4 at the fast and flowing Croix-en-Ternois circuit in northern France. One of the best-attended rounds with strong local support.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

('Championnat de France Drift Rd.6 - Calmont', 'CFD', '2026-08-29', '2026-08-30', 'Calmont, France', 'FR', 'Calmont Toge', 43.2850, 1.6340, 'official', true, 'unlimited', 'advanced', 'The CFD takes to the mountain roads for a Toge-style round near Calmont in southern France. Spectacular hillclimb drifting on closed public roads.', 'https://driftfrance.com/', '€20', false, 'watch', 'FFSA / CFD', 'manual'),

-- ============================================================
-- ITALIAN DRIFT CHAMPIONSHIP (CID)
-- ============================================================
('Campionato Italiano Drifting Rd.1 - Battipaglia', 'CID', '2026-04-18', '2026-04-19', 'Battipaglia, Italy', 'IT', 'Circuito di Battipaglia', 40.6100, 14.9830, 'official', true, 'unlimited', 'advanced', 'The Italian Drift Championship opens at Battipaglia near Salerno. Organized by D-Race SRL under ACI Sport, the CID features Italy''s best drifters across multiple classes.', 'https://www.acisport.it/it/CID/home', '€20', false, 'watch', 'ACI Sport / D-Race', 'manual'),

('Campionato Italiano Drifting Rd.2 - Prato', 'CID', '2026-05-16', '2026-05-17', 'Prato, Italy', 'IT', 'Autodromo del Mugello Area', 43.8800, 11.0960, 'official', true, 'unlimited', 'advanced', 'Round 2 of the CID heads to Tuscany for the Prato round. Italian passion meets technical drifting excellence in one of motorsport''s most scenic regions.', 'https://www.acisport.it/it/CID/home', '€20', false, 'watch', 'ACI Sport / D-Race', 'manual'),

-- ============================================================
-- CZECH DRIFT SERIES
-- ============================================================
('Czech Drift Series PRO Rd.2 - Fun Arena Cheb', 'Czech Drift Series', '2026-04-19', NULL, 'Cheb, Czech Republic', 'CZ', 'Fun Arena Cheb', 50.0685, 12.3842, 'official', true, 'unlimited', 'advanced', 'Round 2 of the Czech Drift Series PRO division at Fun Arena Cheb. Organized by Drift Corporation, featuring tight street-style drifting with concrete walls.', 'https://www.drifting.cz/', '250 CZK', false, 'watch', 'Czech Drift Series', 'manual'),

('Czech Drift Series PRO Rd.3 - Libros', 'Czech Drift Series', '2026-06-13', NULL, 'Liberec, Czech Republic', 'CZ', 'Libros Circuit', 50.7601, 15.0543, 'official', true, 'unlimited', 'advanced', 'Czech Drift Series mid-season round at Libros. Organized by Furt Bokem. The Czech and Slovak drifting scene continues to grow with fierce competition across PRO and PRO2 divisions.', 'https://www.drifting.cz/', '250 CZK', false, 'watch', 'Czech Drift Series', 'manual'),

('Czech Drift Series PRO Rd.4 - Ostrava', 'Czech Drift Series', '2026-08-07', '2026-08-08', 'Ostrava, Czech Republic', 'CZ', 'Dolni Vitkovice', 49.8209, 18.2820, 'official', true, 'unlimited', 'advanced', 'The Czech Drift Series Race the Streets round in Ostrava''s industrial Dolni Vitkovice area. Street drifting between heritage industrial buildings creates an unforgettable atmosphere.', 'https://www.drifting.cz/', '300 CZK', false, 'watch', 'Czech Drift Series', 'manual'),

-- ============================================================
-- HUNGARIAN PRO DRIFT CHAMPIONSHIP
-- ============================================================
('Hungarian Pro Drift Rd.1 - Slovakia Ring', 'Hungarian Pro Drift', '2026-04-03', NULL, 'Orechova Poton, Slovakia', 'SK', 'Slovakia Ring', 47.9540, 17.6260, 'official', true, 'unlimited', 'advanced', 'The 2026 Hungarian Professional Drift Championship kicks off a month earlier than usual at Slovakia Ring. Speeds up to 150 km/h as drivers battle through the demanding layout.', 'https://drifting.hu/en/', '€15', false, 'watch', 'Drifting.hu', 'manual'),

('Hungarian Pro Drift Rd.2 - DK Summer Festival', 'Hungarian Pro Drift', '2026-07-11', '2026-07-12', 'Mariapocs, Hungary', 'HU', 'RabocsiRing', 47.8753, 21.9850, 'official', true, 'unlimited', 'advanced', 'Round 2 combined with the Drift Kings Summer Festival at RabocsiRing. PRO, PRO2, and STREET classes compete. International drivers join the Hungarian regulars for an epic weekend.', 'https://drifting.hu/en/', '€20', false, 'watch', 'Drifting.hu', 'manual'),

('Trackwood #15 Drift Festival', 'Hungarian Pro Drift', '2026-08-27', '2026-08-29', 'Mariapocs, Hungary', 'HU', 'RabocsiRing', 47.8753, 21.9850, 'grassroots', false, 'unlimited', 'all', 'Trackwood Drift Festival returns to RabocsiRing for its 15th edition. PRO and PRO2 competition on Saturday, plus Kiss the Wall challenge. Open practice and festival atmosphere all weekend.', 'https://trackwood.com/en/', '€25', false, 'both', 'Trackwood / Drifting.hu', 'manual'),

-- ============================================================
-- GATEBIL FESTIVALS
-- ============================================================
('Gatebil Mantorp Summer Festival', 'Gatebil', '2026-06-11', '2026-06-14', 'Mantorp, Sweden', 'SE', 'Mantorp Park', 58.3000, 15.2830, 'grassroots', true, 'unlimited', 'intermediate', 'Gatebil Summer Festival at Sweden''s Mantorp Park. Four days of drifting, time attack, show cars, camping, parties, and the famous Gatebil Drift Battle with the biggest prize pool ever. One of the highlights of the season.', 'https://gatebil.no/mantorp-summer-festival-2026/', '600 SEK', true, 'both', 'Gatebil', 'manual'),

('Gatebil Rudskogen Main Festival', 'Gatebil', '2026-07-02', '2026-07-05', 'Rakkestad, Norway', 'NO', 'Rudskogen Motorsenter', 59.4050, 11.3400, 'grassroots', true, 'unlimited', 'intermediate', 'The flagship Gatebil event. Four massive days at Rudskogen Motorsenter with 1000+ cars, non-stop drifting, time attack, show & shine, and camping. The largest car festival in Scandinavia and a true bucket-list event.', 'https://gatebil.no/2026-rudskogen-main-festival-july-2-5/', '800 NOK', true, 'both', 'Gatebil', 'manual'),

-- ============================================================
-- DRIFT SPAIN SERIES
-- ============================================================
('Drift Spain Rd.1 - Jarama', 'Drift Spain', '2026-03-07', '2026-03-08', 'San Sebastian de los Reyes, Spain', 'ES', 'Circuito del Madrid Jarama-RACE', 40.6170, -3.5860, 'official', true, 'unlimited', 'advanced', 'Opening round of the Drift Spain Series at the Circuito de Jarama in Madrid. Spain''s new drift championship features Semipro and Pro categories with direct competition format. Includes an EXPO event.', 'https://driftspainseries.com/', '€25', false, 'watch', 'Drift Spain Series', 'manual'),

-- ============================================================
-- GRASSROOTS & CULTURE EVENTS
-- ============================================================
('Drift Games Spring Bash', NULL, '2026-02-28', '2026-03-01', 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'grassroots', false, 'unlimited', 'all', 'The Tire Streets Drift Games Spring Bash kicks off the drift season at Mondello Park. Over 150 drivers, wild 15-car trains, pro car shakedowns ahead of Drift Masters, and Irish Drift Series warm-ups. Pure drift party energy.', 'https://bash.driftgames.life/', '€40', true, 'both', 'Drift Games / Tire Streets', 'manual'),

('Drift Games Summer Bash', NULL, '2026-07-19', '2026-07-20', 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'grassroots', false, 'unlimited', 'all', 'Mid-season Tire Streets Drift Games Bash at Mondello Park. Non-stop drifting across four layouts, 150+ drivers, pro cars, grassroots heroes, and a legendary afterparty. Ireland''s craziest drift party.', 'https://bash.driftgames.life/', '€40', false, 'both', 'Drift Games / Tire Streets', 'manual'),

('Japfest Silverstone 2026', NULL, '2026-04-19', NULL, 'Towcester, UK', 'GB', 'Silverstone Circuit', 52.0786, -1.0169, 'grassroots', false, 'unlimited', 'all', 'The UK''s biggest Japanese car festival returns to Silverstone. Over 3,500 cars on display and 25,000 visitors. Features Drift Kings powered by Drift Matsuri with the UK''s best drifters competing in three sessions. Drift Taxis from £35.', 'https://japfest.co.uk/silverstone/', '£30', true, 'both', 'Japfest / Fast Car', 'manual'),

('Drift Events Scotland Rd.3 - Crimond', 'Drift Events Scotland', '2026-03-07', '2026-03-08', 'Crimond, Scotland', 'GB', 'Crimond Raceway', 57.6200, -1.8700, 'grassroots', true, 'unlimited', 'all', 'Drift Events Scotland at Crimond Raceway in Aberdeenshire. Open to all levels with a relaxed, inclusive atmosphere. Scotland''s drift community at its finest.', 'https://driftevents.co.uk/', '£60', false, 'drive', 'Drift Events Scotland', 'manual'),

('Crimond Drift Fest 2026', 'Drift Events Scotland', '2026-04-11', '2026-04-12', 'Crimond, Scotland', 'GB', 'Crimond Raceway', 57.6200, -1.8700, 'grassroots', true, 'unlimited', 'all', 'Two-day drift festival at Crimond Raceway. Racing competitions, grudge battles, trade stands, food vendors, and a huge spectator area. One of Scotland''s biggest drift gatherings.', 'https://driftevents.co.uk/events/crimond-drift-fest-2026/', '£70', false, 'both', 'Drift Events Scotland', 'manual'),

('Driftland The Takeover', NULL, '2026-03-28', '2026-03-29', 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'grassroots', true, 'unlimited', 'all', 'Weekend takeover at Driftland, the UK''s only purpose-built drift track. Multiple layouts available across the two days. Bring your own car to drift at the Lochgelly Motorsport Complex.', 'https://www.driftlanduk.com/', '£80', false, 'drive', 'Driftland', 'manual'),

('Iron Drift King - Ferropolis', NULL, '2026-08-13', '2026-08-15', 'Grafenhainichen, Germany', 'DE', 'Ferropolis', 51.7570, 12.4427, 'official', true, 'unlimited', 'advanced', 'The Iron Drift King spectacular at Ferropolis, the City of Iron. Over 32 professional drifting athletes from 20+ nations compete with racing cars up to 1200 hp. Towering industrial structures create a stunning backdrop. Combined with Drift Masters Rd.6.', 'https://www.irondriftking.de/en', '€45', true, 'watch', 'Iron Drift King', 'manual'),

('L8-Night Weekend Lausitzring', NULL, '2026-07-16', '2026-07-18', 'Klettwitz, Germany', 'DE', 'EuroSpeedway Lausitz', 51.5275, 13.9333, 'grassroots', false, 'unlimited', 'all', 'The L8-Night Weekend at EuroSpeedway Lausitz combines quarter-mile racing, road course driving, spectacular drift shows, parties and camping. One of Germany''s most impressive tuning and motorsport events.', 'https://www.l8-night.de/lausitzring', '€50', false, 'both', 'L8-Night', 'manual'),

('Reisbrennen Lausitzring', NULL, '2026-07-30', '2026-08-02', 'Klettwitz, Germany', 'DE', 'EuroSpeedway Lausitz', 51.5275, 13.9333, 'grassroots', false, 'unlimited', 'all', 'Europe''s largest 4-day meeting for Asian vehicles at the Lausitzring. The 22nd Reisbrennen features a massive drift show, quarter-mile racing, time attack, and drift basic courses. International festival of Japanese tuning culture.', 'https://www.reisbrennen.de/', '€60', true, 'both', 'Reisbrennen', 'manual'),

('Mondello Park Action Day', NULL, '2026-06-01', NULL, 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'grassroots', false, 'unlimited', 'all', 'Bank Holiday Monday multi-discipline event at Mondello Park. On-track action from race cars, buggies, rally cars, drift cars, track cars, and supercars. Attractions for the whole family. A great introduction to Irish motorsport.', 'https://mondellopark.ie/', '€25', false, 'watch', 'Mondello Park', 'manual'),

-- ============================================================
-- SCANDINAVIAN DRIFT SERIES (SDS)
-- ============================================================
('Scandinavian Drift Series - Valerbanen', 'Scandinavian Drift Series', '2026-05-30', NULL, 'Askim, Norway', 'NO', 'Valerbanen', 59.5590, 11.1670, 'proam', true, 'unlimited', 'intermediate', 'The Gatebil Scandinavian Drift Series round at Valerbanen, held during the Gatebil festival weekend. Norway''s best drifters compete in the SDS top-16 battles format.', 'https://gatebil.no/gatebil-scandinavian-drift-series/', '550 NOK', false, 'watch', 'Gatebil SDS', 'manual'),

('Scandinavian Drift Series - Mantorp', 'Scandinavian Drift Series', '2026-06-13', NULL, 'Mantorp, Sweden', 'SE', 'Mantorp Park', 58.3000, 15.2830, 'proam', true, 'unlimited', 'intermediate', 'Scandinavian Drift Series competition at Mantorp Park during the Gatebil Summer Festival. Top Nordic drifters battle it out in the SDS championship rounds.', 'https://gatebil.no/gatebil-scandinavian-drift-series/', '600 SEK', false, 'watch', 'Gatebil SDS', 'manual'),

('Scandinavian Drift Series - Rudskogen', 'Scandinavian Drift Series', '2026-07-04', NULL, 'Rakkestad, Norway', 'NO', 'Rudskogen Motorsenter', 59.4050, 11.3400, 'proam', true, 'unlimited', 'intermediate', 'SDS championship round at Rudskogen during the flagship Gatebil Main Festival. The biggest SDS event of the year with massive crowds. Championship decider atmosphere.', 'https://gatebil.no/gatebil-scandinavian-drift-series/', '800 NOK', false, 'watch', 'Gatebil SDS', 'manual'),

-- ============================================================
-- DRIFT LEAGUE GB PRE-SEASON
-- ============================================================
('Drift League GB Pre-Season Shakedown', 'Drift League GB', '2026-04-18', NULL, 'Ashton-in-Makerfield, UK', 'GB', 'Three Sisters Circuit', 53.4960, -2.6340, 'practice', false, 'unlimited', 'all', 'Drift League GB pre-season shakedown at Three Sisters. Open practice day for DLGB competitors and newcomers to test setups and get seat time before the championship begins.', 'https://driftleague.co.uk/', '£80', false, 'drive', 'Drift League GB', 'manual'),

-- ============================================================
-- HUNGARIAN PRO DRIFT - Slovakia Ring (already above)
-- CZECH DRIFT - Slovakia Ring overlap round
-- ============================================================
('Czech Drift Series PRO Rd.1 - Slovakia Ring', 'Czech Drift Series', '2026-04-03', NULL, 'Orechova Poton, Slovakia', 'SK', 'Slovakia Ring', 47.9540, 17.6260, 'official', true, 'unlimited', 'advanced', 'Opening round of both the Czech Drift Series and Hungarian Pro Drift Championship at Slovakia Ring. The Race the Streets format delivers intense street-style drifting at one of Central Europe''s premier circuits.', 'https://www.drifting.cz/', '€15', false, 'watch', 'Czech Drift Series / Race the Streets', 'manual'),

-- ============================================================
-- ADDITIONAL PRACTICE DAYS & REGIONAL EVENTS
-- ============================================================
('Driftland Spring Practice Day', NULL, '2026-04-04', NULL, 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'practice', false, 'unlimited', 'beginner', 'Open practice day at Driftland, the UK''s only purpose-built drift track. Bring your own car or book a drift experience with tuition, car, and tires provided. Perfect for beginners getting into drifting.', 'https://www.driftlanduk.com/', '£75', false, 'drive', 'Driftland', 'manual'),

('Driftland Summer Practice Day', NULL, '2026-06-20', NULL, 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'practice', false, 'unlimited', 'beginner', 'Summer practice day at Scotland''s purpose-built drift facility. Open pitlane format with multiple layouts. Drift experiences available for beginners with professional instruction.', 'https://www.driftlanduk.com/', '£75', false, 'drive', 'Driftland', 'manual'),

('Mondello Park Drift Experience Day', NULL, '2026-05-09', NULL, 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'practice', false, 'unlimited', 'beginner', 'Learn to drift at Ireland''s premier racing circuit. Professional instruction, purpose-built drift cars, and progressive learning on Mondello Park''s drift pad. No experience necessary.', 'https://mondellopark.ie/drift-experience/', '€99', false, 'drive', 'Mondello Park', 'manual'),

-- ============================================================
-- CFD TOGE ROUND (mountain road)
-- ============================================================
('Championnat de France Drift Rd.5 - Luby Toge', 'CFD', '2026-06-27', '2026-06-28', 'Luby-Betmont, France', 'FR', 'Luby-Betmont to Osmets Road', 43.0980, 0.3760, 'official', true, 'unlimited', 'advanced', 'The CFD takes to the Pyrenean mountain roads for a true Toge-style round. Drifting on closed public roads between Luby-Betmont and Osmets. Spectacular hillside spectating and maximum commitment driving.', 'https://driftfrance.com/', '€20', true, 'watch', 'FFSA / CFD', 'manual'),

-- ============================================================
-- ADDITIONAL UK EVENTS
-- ============================================================
('Drift Matsuri Summer 2026', NULL, '2026-08-08', '2026-08-09', 'Anglesey, North Wales, UK', 'GB', 'Anglesey Circuit - Trac Mon', 53.1880, -4.4960, 'grassroots', true, 'unlimited', 'all', 'Summer edition of the UK Drift Matsuri at Anglesey Circuit. Over 100 drivers across three track layouts including the famous touge course, fast track, and hairpin. Non-stop drifting, camping, and afterparty.', 'https://www.driftmatsuri.com/', '£80', false, 'drive', 'Drift Matsuri UK', 'manual'),

-- ============================================================
-- BALTIC & EASTERN EUROPEAN EVENTS
-- ============================================================
('Baltic Drift Championship - Latvia Rd.1', 'Baltic Drift Championship', '2026-05-16', NULL, 'Riga, Latvia', 'LV', 'Bikernieki Circuit', 56.9665, 24.2326, 'proam', true, 'unlimited', 'intermediate', 'Opening round of the 2026 Baltic Drift Championship at the legendary Bikernieki Circuit in Riga. Six rounds across Latvia, Lithuania, and Estonia. The premier regional drift series in the Baltics.', 'https://www.driftlatvia.com/', '€15', false, 'both', 'Baltic Drift Association', 'manual'),

('Baltic Drift Championship - Lithuania', 'Baltic Drift Championship', '2026-06-14', NULL, 'Kaunas, Lithuania', 'LT', 'Kaunas Nemunas Ring', 54.8869, 23.9275, 'proam', true, 'unlimited', 'intermediate', 'Baltic Drift Championship round in Lithuania. The growing Baltic drift scene showcases talented drivers from across the region competing on Lithuanian soil.', 'https://www.driftlatvia.com/', '€12', false, 'both', 'Baltic Drift Association', 'manual'),

('Baltic Drift Championship - Estonia', 'Baltic Drift Championship', '2026-07-18', NULL, 'Parnu, Estonia', 'EE', 'Auto24ring', 58.3570, 24.5320, 'proam', true, 'unlimited', 'intermediate', 'Baltic Drift Championship Estonian round at the Auto24ring near Parnu. Estonia''s only permanent road circuit hosts the best drifters from Latvia, Lithuania, and Estonia.', 'https://www.driftlatvia.com/', '€12', false, 'both', 'Baltic Drift Association', 'manual'),

-- ============================================================
-- DRIFT KINGS WINTER TRAINING
-- ============================================================
('Drift Kings Winter Training - Serres', 'Drift Kings', '2026-03-14', '2026-03-15', 'Serres, Greece', 'GR', 'Serres Racing Circuit', 41.0550, 23.5730, 'practice', false, 'unlimited', 'intermediate', 'Pre-season training at the Serres Racing Circuit in Greece. Two days for Drift Kings drivers to dial in their setups and sharpen their skills before the competitive season begins. Greece''s only FIA-accredited facility.', 'https://driftkings.com/dk26/', '€100', false, 'drive', 'Drift Kings International', 'manual'),

-- ============================================================
-- ADDITIONAL INTERESTING EUROPEAN EVENTS
-- ============================================================
('King of Drift - Lilo Arena', 'King of Drift', '2026-05-23', '2026-05-24', 'Tbilisi, Georgia', 'GE', 'Lilo Arena', 41.7500, 44.8630, 'official', true, 'unlimited', 'advanced', 'King of Drift championship round at Lilo Arena in Tbilisi, Georgia. No restrictions on car power or models. Returning champions, rising talents, and new international entries compete for the crown.', 'https://kingofdrift.com/', '30 GEL', false, 'watch', 'King of Drift', 'manual'),

('Drift Cup MSO - Anneau du Rhin', 'Drift Cup MSO', '2026-06-12', '2026-06-13', 'Biltzheim, France', 'FR', 'Anneau du Rhin', 47.9250, 7.2950, 'proam', true, 'unlimited', 'intermediate', 'The Drift Cup MSO round held alongside Drift Kings at the Anneau du Rhin in Alsace. Pro-Am format allowing developing drivers to compete alongside professionals on the same weekend.', 'https://driftkings.com/dk26/', '€80', false, 'both', 'Drift Cup MSO', 'manual');
