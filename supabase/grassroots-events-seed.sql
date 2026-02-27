-- ============================================================
-- Grassroots & Practice Drift Events Seed
-- March - August 2026
-- Run in Supabase SQL Editor AFTER new-events-seed.sql
-- ~165 community-level events worldwide
-- ============================================================

INSERT INTO public.events (name, series, date, end_date, location, country, track, lat, lng, category, cage_required, tire_size, skill_level, description, event_url, price, is_hot, participation, organizer, source) VALUES

-- ============================================================
-- EUROPE: LATVIA
-- ============================================================
('Latvia Drift Grand Opening 2026', 'Latvijas Drifts', '2026-05-16', '2026-05-17', 'Riga, Latvia', 'LV', 'Bikernieki Circuit', 56.9665, 24.2326, 'grassroots', false, 'unlimited', 'all', 'Season opening event for Latvian drift. Features Latvian PRO2 championship, Baltic drift round, and Livonian drift round. Open to all skill levels. Free entrance for children under 9.', 'https://www.driftlatvia.com/eventinformation/grand-opening/', '€15', false, 'both', 'Latvijas Drifts / LDA', 'manual'),

('Bikernieki Drift Practice - Spring', NULL, '2026-04-18', NULL, 'Riga, Latvia', 'LV', 'Bikernieki Circuit - Witch Kettle', 56.9665, 24.2326, 'practice', false, 'unlimited', 'all', 'Regular spring drift practice at the legendary Bikernieki circuit. The Witch Kettle configuration is used for drift training. Coaching available from local instructors.', 'https://www.driftlatvia.com/', '€30', false, 'drive', 'Latvijas Drifts / LDA', 'manual'),

('Bikernieki Drift Practice - Summer', NULL, '2026-06-27', NULL, 'Riga, Latvia', 'LV', 'Bikernieki Circuit - Witch Kettle', 56.9665, 24.2326, 'practice', false, 'unlimited', 'all', 'Mid-summer drift practice at Bikernieki. Perfect conditions for seat time on the Witch Kettle layout. Ideal preparation for Baltic drift championship rounds.', 'https://www.driftlatvia.com/', '€30', false, 'drive', 'Latvijas Drifts / LDA', 'manual'),

('NEZ Drift - Bikernieki Witch Kettle', 'NEZ Drift', '2026-08-28', '2026-08-29', 'Riga, Latvia', 'LV', 'Bikernieki Circuit - Witch Kettle', 56.9665, 24.2326, 'grassroots', true, 'unlimited', 'intermediate', 'Season finale of NEZ Drift Season 15 at Bikernieki''s legendary Witch Kettle configuration. Practice day included before competition. Baltic drift at its finest.', 'http://www.drifteurope.com/', '€40', false, 'both', 'NEZ Drift / Drift Europe', 'manual'),

-- ============================================================
-- EUROPE: ESTONIA
-- ============================================================
('NEZ Drift Rd.1 - Kehala Rollercoaster from Hell', 'NEZ Drift', '2026-05-15', '2026-05-16', 'Kehala, Estonia', 'EE', 'Kehala Ring', 59.3450, 24.0300, 'grassroots', true, 'unlimited', 'intermediate', 'The legendary "Rollercoaster from Hell" at Kehala Ring. Famous for dramatic elevation changes and the iconic jump feature. Season 15 of NEZ Drift.', 'http://www.drifteurope.com/', '€40', true, 'both', 'NEZ Drift / Drift Europe', 'manual'),

('Drift Factory Estonia Practice Day', NULL, '2026-05-30', NULL, 'Laitse, Estonia', 'EE', 'Laitse Rally Park', 59.2890, 24.2780, 'practice', false, 'unlimited', 'beginner', 'Open practice by Drift Factory, Estonia''s top drift team. Beginner-friendly with coaching available. Wide run-off zones for safe learning.', 'https://www.driftfactory.ee/en/pages/kalender', '€35', false, 'drive', 'Drift Factory', 'manual'),

-- ============================================================
-- EUROPE: LITHUANIA
-- ============================================================
('Lithuanian Drift Training - Kaunas Spring', NULL, '2026-04-25', NULL, 'Kaunas, Lithuania', 'LT', 'Kaunas Nemunas Ring', 54.8869, 23.9275, 'practice', false, 'unlimited', 'beginner', 'Spring drift training at Kaunas Nemunas Ring. Open to beginners and intermediate drivers. Lithuanian instructors provide guidance on car control and initiation techniques.', NULL, '€25', false, 'drive', 'Lithuanian Drift Association', 'manual'),

('Lithuanian Drift Training - Kaunas Summer', NULL, '2026-07-04', NULL, 'Kaunas, Lithuania', 'LT', 'Kaunas Nemunas Ring', 54.8869, 23.9275, 'practice', false, 'unlimited', 'all', 'Summer drift practice at Kaunas Nemunas Ring. Extended daylight for maximum seat time. All skill levels from beginners to competitors preparing for Baltic championships.', NULL, '€25', false, 'drive', 'Lithuanian Drift Association', 'manual'),

-- ============================================================
-- EUROPE: UK - L2D PUBLIC DRIFT DAYS
-- ============================================================
('L2D Public Drift Days Rd.1 - Stafford', 'L2D Public Drift Days', '2026-03-01', '2026-03-02', 'Stafford, UK', 'GB', 'Stafford Driving Centre', 52.8070, -2.1170, 'grassroots', false, 'unlimited', 'beginner', 'Round 1 of L2D Public Drift Days at Stafford. No cage required. The UK''s most accessible drift series with practice and competition format.', 'https://l2dpublicdriftdaysuk.com/', '£45', false, 'drive', 'L2D Public Drift Days UK', 'manual'),

('L2D Public Drift Days Rd.2 - Stafford', 'L2D Public Drift Days', '2026-05-03', '2026-05-04', 'Stafford, UK', 'GB', 'Stafford Driving Centre', 52.8070, -2.1170, 'grassroots', false, 'unlimited', 'beginner', 'Round 2 of L2D at Stafford. Perfect stepping stone from practice days into light competition.', 'https://l2dpublicdriftdaysuk.com/', '£45', false, 'drive', 'L2D Public Drift Days UK', 'manual'),

('L2D Public Drift Days Rd.3 - Standlake Arena', 'L2D Public Drift Days', '2026-07-12', '2026-07-13', 'Standlake, Oxfordshire, UK', 'GB', 'Standlake Arena', 51.7230, -1.3880, 'grassroots', false, 'unlimited', 'beginner', 'Round 3 at Standlake Arena. Series winner receives fully paid entry into Drift League Class 2 for the following season.', 'https://l2dpublicdriftdaysuk.com/', '£45', false, 'drive', 'L2D Public Drift Days UK', 'manual'),

-- ============================================================
-- EUROPE: UK - SANTA POD DRIFT WHAT YA BRUNG
-- ============================================================
('Santa Pod DWYB Drift Day - March', NULL, '2026-03-14', NULL, 'Wellingborough, UK', 'GB', 'Santa Pod Raceway', 52.2890, -0.5400, 'practice', false, 'unlimited', 'beginner', 'Drift What Ya Brung at Santa Pod Raceway. 30 acres of tarmac with beginner, intermediate, and advanced tracks open simultaneously. Limited to 80 drivers.', 'https://santapod.co.uk/experience/drift-what-ya-brung/', '£55', false, 'drive', 'Santa Pod Raceway', 'manual'),

('Santa Pod DWYB Drift Day - April', NULL, '2026-04-11', NULL, 'Wellingborough, UK', 'GB', 'Santa Pod Raceway', 52.2890, -0.5400, 'practice', false, 'unlimited', 'beginner', 'Spring DWYB drift day at Santa Pod. Bring any rear-wheel-drive car and learn to slide. Professional marshals and safe run-off areas.', 'https://santapod.co.uk/experience/drift-what-ya-brung/', '£55', false, 'drive', 'Santa Pod Raceway', 'manual'),

('Santa Pod DWYB Drift Day - May', NULL, '2026-05-09', NULL, 'Wellingborough, UK', 'GB', 'Santa Pod Raceway', 52.2890, -0.5400, 'practice', false, 'unlimited', 'beginner', 'Bank Holiday weekend DWYB drift day at Santa Pod. One of the most popular dates - arrive early as the 80-driver limit fills fast.', 'https://santapod.co.uk/experience/drift-what-ya-brung/', '£55', false, 'drive', 'Santa Pod Raceway', 'manual'),

('Santa Pod DWYB Drift Day - July', NULL, '2026-07-25', NULL, 'Wellingborough, UK', 'GB', 'Santa Pod Raceway', 52.2890, -0.5400, 'practice', false, 'unlimited', 'beginner', 'Summer DWYB drift day at Santa Pod. Long daylight for maximum track time. No cage required, just a helmet and a RWD car.', 'https://santapod.co.uk/experience/drift-what-ya-brung/', '£55', false, 'drive', 'Santa Pod Raceway', 'manual'),

-- ============================================================
-- EUROPE: UK - THREE SISTERS & TEESSIDE
-- ============================================================
('Three Sisters Novice Drift Day - Spring', NULL, '2026-04-04', NULL, 'Ashton-in-Makerfield, UK', 'GB', 'Three Sisters Circuit', 53.4960, -2.6340, 'practice', false, 'unlimited', 'beginner', 'Novice drift day at Three Sisters. RDX Academy Drift School offers structured sessions for newcomers. Perfect for first-timers learning drift basics.', 'https://threesisterscircuit.co.uk/cars/drift', '£85', false, 'drive', 'Three Sisters Circuit / RDX Academy', 'manual'),

('Three Sisters Big Boys Drift Day - Spring', NULL, '2026-04-26', NULL, 'Ashton-in-Makerfield, UK', 'GB', 'Three Sisters Circuit', 53.4960, -2.6340, 'practice', false, 'unlimited', 'intermediate', 'Big Boys drift day for drivers with at least two novice sessions. Higher speed limits and more freedom on track.', 'https://threesisterscircuit.co.uk/cars/drift', '£99', false, 'drive', 'Three Sisters Circuit / RDX Academy', 'manual'),

('Three Sisters Big Boys Drift Day - Summer', NULL, '2026-06-28', NULL, 'Ashton-in-Makerfield, UK', 'GB', 'Three Sisters Circuit', 53.4960, -2.6340, 'practice', false, 'unlimited', 'intermediate', 'Summer Big Boys drift day at Three Sisters. Open pit lane format on the drift configuration.', 'https://threesisterscircuit.co.uk/cars/drift', '£99', false, 'drive', 'Three Sisters Circuit / RDX Academy', 'manual'),

('Teesside Autodrome Drift Practice - Spring', NULL, '2026-04-12', NULL, 'Middlesbrough, UK', 'GB', 'Teesside Autodrome', 54.5100, -1.2800, 'practice', false, 'unlimited', 'all', 'Open drift practice at Teesside Autodrome, birthplace of British drifting and home of the BDC since 2008. Tight technical layout with concrete barriers.', 'https://teessidemotorsports.co.uk/autodrome/drifting/', '£70', false, 'drive', 'Teesside Motorsports', 'manual'),

('Teesside Autodrome Drift Practice - Summer', NULL, '2026-07-05', NULL, 'Middlesbrough, UK', 'GB', 'Teesside Autodrome', 54.5100, -1.2800, 'practice', false, 'unlimited', 'all', 'Summer drift practice at Teesside Autodrome. Mid-season seat time on the UK''s most iconic drift layout.', 'https://teessidemotorsports.co.uk/autodrome/drifting/', '£70', false, 'drive', 'Teesside Motorsports', 'manual'),

-- ============================================================
-- EUROPE: UK - NORFOLK ARENA & LYDDEN HILL
-- ============================================================
('Norfolk Arena Drift Practice - Spring', NULL, '2026-04-05', NULL, 'Kings Lynn, UK', 'GB', 'Norfolk Arena', 52.7260, 0.4070, 'practice', false, 'unlimited', 'beginner', 'Drift practice at Norfolk Arena. Affordable grassroots drifting from £45 for a full day. East Anglia''s drift community home base.', 'http://www.norfolkarena.co.uk/', '£45', false, 'drive', 'Norfolk Arena', 'manual'),

('Norfolk Arena Drift Practice - Summer', NULL, '2026-07-11', NULL, 'Kings Lynn, UK', 'GB', 'Norfolk Arena', 52.7260, 0.4070, 'practice', false, 'unlimited', 'beginner', 'Summer drift practice at Norfolk Arena. One of the most affordable drift venues in the UK. Bring your own RWD car.', 'http://www.norfolkarena.co.uk/', '£45', false, 'drive', 'Norfolk Arena', 'manual'),

('Lydden Hill Drift Experience Day', NULL, '2026-05-17', NULL, 'Wootton, Kent, UK', 'GB', 'Lydden Hill Race Circuit', 51.1667, 1.1833, 'practice', false, 'unlimited', 'beginner', 'Drift experience day at the historic Lydden Hill. Southern England''s most accessible drift venue.', 'https://lyddenhill.co.uk/events/', '£85', false, 'drive', 'Lydden Hill Race Circuit', 'manual'),

-- ============================================================
-- EUROPE: SCOTLAND
-- ============================================================
('Driftland Practice Day - May', NULL, '2026-05-09', NULL, 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'practice', false, 'unlimited', 'beginner', 'Monthly practice at Driftland, the UK''s only purpose-built drift track. Drift experiences with tuition and car for beginners. BYOC also welcome.', 'https://www.driftlanduk.com/', '£75', false, 'drive', 'Driftland', 'manual'),

('Driftland Practice Day - July', NULL, '2026-07-25', NULL, 'Lochgelly, Scotland', 'GB', 'Driftland', 56.1283, -3.3758, 'practice', false, 'unlimited', 'beginner', 'Summer practice at Driftland. Open pitlane with multiple configurations. Drift experience packages available for beginners.', 'https://www.driftlanduk.com/', '£75', false, 'drive', 'Driftland', 'manual'),

-- ============================================================
-- EUROPE: IRELAND
-- ============================================================
('TS Drift Days - Watergrasshill March', NULL, '2026-03-22', NULL, 'Watergrasshill, Co. Cork, Ireland', 'IE', 'Adventure Park at Kartworld', 51.9530, -8.3380, 'grassroots', false, 'unlimited', 'beginner', 'Cruz Invitational Drift Day at Watergrasshill. The home of grassroots drifting in Ireland. Free coaching included. Relaxed, community-focused atmosphere.', 'https://www.tsdriftdays.com/', '€50', false, 'drive', 'TS Drift Days', 'manual'),

('TS Drift Days - Watergrasshill June', NULL, '2026-06-13', '2026-06-15', 'Watergrasshill, Co. Cork, Ireland', 'IE', 'Adventure Park at Kartworld', 51.9530, -8.3380, 'grassroots', false, 'unlimited', 'beginner', 'Summer weekend drift event at Watergrasshill. Three days of grassroots drifting with free coaching and BBQ social atmosphere.', 'https://www.tsdriftdays.com/', '€50', false, 'drive', 'TS Drift Days', 'manual'),

('TS Drift Days - Watergrasshill August', NULL, '2026-08-23', '2026-08-24', 'Watergrasshill, Co. Cork, Ireland', 'IE', 'Adventure Park at Kartworld', 51.9530, -8.3380, 'grassroots', false, 'unlimited', 'beginner', 'Late summer grassroots drift weekend. One of the last outdoor drift events of the season in the south of Ireland.', 'https://www.tsdriftdays.com/', '€50', false, 'drive', 'TS Drift Days', 'manual'),

('Mondello Park Learn to Drift - April', NULL, '2026-04-18', NULL, 'Naas, Co. Kildare, Ireland', 'IE', 'Mondello Park', 53.2545, -6.7403, 'practice', false, 'unlimited', 'beginner', 'Learn to drift in purpose-built 280bhp Nissan 350Z drift cars. No experience necessary - designed for absolute beginners.', 'https://mondellopark.ie/drift-experience/', '€99', false, 'drive', 'Mondello Park', 'manual'),

('360 Motorsports Park Drift Day - May', NULL, '2026-05-04', NULL, 'Fermoy, Co. Cork, Ireland', 'IE', '360 Motorsports Park', 52.1420, -8.2790, 'practice', false, 'unlimited', 'all', 'Open drift day at Ireland''s most demanding custom-built drift track. Elevation changes, camber corners, wall runs. Free coaching included.', 'https://www.360msp.ie/opendriftdays/', '€180', false, 'drive', '360 Motorsports Park', 'manual'),

('360 Motorsports Park Drift Day - July', NULL, '2026-07-12', NULL, 'Fermoy, Co. Cork, Ireland', 'IE', '360 Motorsports Park', 52.1420, -8.2790, 'practice', false, 'unlimited', 'all', 'Summer open drift day at 360MSP. Four unique layouts with elevation changes. Free coaching included.', 'https://www.360msp.ie/opendriftdays/', '€180', false, 'drive', '360 Motorsports Park', 'manual'),

-- ============================================================
-- EUROPE: GERMANY - DRIFT.de
-- ============================================================
('DRIFT.de Driftday Nurburgring - March', NULL, '2026-03-15', NULL, 'Nurburg, Germany', 'DE', 'Nurburgring Driftpark', 50.3356, 6.9475, 'practice', false, 'unlimited', 'all', 'Driftday at the Nurburgring Driftpark. Watered course with uphill/downhill sections and large run-off zones. All skill levels welcome.', 'https://www.drift.de/freies-driften/nuerburg-rheinland-pfalz.html', '€189', false, 'drive', 'DRIFT.de', 'manual'),

('DRIFT.de Drift Weekend Nurburgring - April', NULL, '2026-04-11', '2026-04-12', 'Nurburg, Germany', 'DE', 'Nurburgring Driftpark', 50.3356, 6.9475, 'practice', false, 'unlimited', 'all', 'Two-day drift weekend at the Nurburgring Driftpark. Half-day and full-day options. Watered drift course with technical sections.', 'https://www.drift.de/nbr-dw-26-04-11.html', '€189', false, 'drive', 'DRIFT.de', 'manual'),

('DRIFT.de Freies Driften Hockenheim - March', NULL, '2026-03-27', '2026-03-29', 'Hockenheim, Germany', 'DE', 'Hockenheimring Drift Arena', 49.3271, 8.5656, 'practice', false, 'unlimited', 'intermediate', 'Three days of free drifting at the Hockenheimring drift arena. East event area at the former Mercedes grandstand.', 'https://www.drift.de/freies-driften/hockenheim-baden-wuerttemberg.html', '€150', false, 'drive', 'DRIFT.de', 'manual'),

('DRIFT.de Freies Driften Hockenheim - May', NULL, '2026-05-29', '2026-05-31', 'Hockenheim, Germany', 'DE', 'Hockenheimring Drift Arena', 49.3271, 8.5656, 'practice', false, 'unlimited', 'intermediate', 'Late May open drift session at Hockenheim. Three days on the drift arena at the East event area.', 'https://www.drift.de/freies-driften/hockenheim-baden-wuerttemberg.html', '€150', false, 'drive', 'DRIFT.de', 'manual'),

('DRIFT.de Driftday Nurburgring - June', NULL, '2026-06-20', '2026-06-21', 'Nurburg, Germany', 'DE', 'Nurburgring Driftpark', 50.3356, 6.9475, 'practice', false, 'unlimited', 'all', 'Summer driftday weekend at the Nurburgring Driftpark. Double sessions over two days.', 'https://www.drift.de/freies-driften/nuerburg-rheinland-pfalz.html', '€189', false, 'drive', 'DRIFT.de', 'manual'),

('DRIFT.de Drift Weekend Nurburgring - July', NULL, '2026-07-18', '2026-07-19', 'Nurburg, Germany', 'DE', 'Nurburgring Driftpark', 50.3356, 6.9475, 'practice', false, 'unlimited', 'all', 'Mid-summer drift weekend at the Nurburgring. Two days of driftday action.', 'https://www.drift.de/nbr-dw-26-07-18.html', '€189', false, 'drive', 'DRIFT.de', 'manual'),

('FSZN Nurburgring Drift Training Basic', NULL, '2026-05-02', NULL, 'Nurburg, Germany', 'DE', 'Nurburgring Driftpark FSZN', 50.3356, 6.9475, 'practice', false, 'unlimited', 'beginner', 'Basic drift training at the Fahrsicherheitszentrum Nurburgring. Professional instruction for complete novices. Approximately 4 hours.', 'https://www.fszn.de/en/driftpark/drift-trainings/drift-training-basic', '€189', false, 'drive', 'FSZN Nurburgring', 'manual'),

-- ============================================================
-- EUROPE: POLAND
-- ============================================================
('Drift Open Driver Search - Slomczyn', 'Drift Open', '2026-04-18', '2026-04-19', 'Slomczyn, Poland', 'PL', 'Autodrom Slomczyn', 52.0190, 20.5720, 'grassroots', false, 'unlimited', 'beginner', 'Drift Open Driver Search at Autodrom Slomczyn. Training-focused event to find and develop new drift talent. The gateway to Drift Open competition.', 'https://www.driftopen.com/', '200 PLN', false, 'drive', 'Drift Open', 'manual'),

('Drift Open Rd.1 - Tor Kielce', 'Drift Open', '2026-05-28', '2026-05-30', 'Kielce, Poland', 'PL', 'Tor Kielce', 50.8190, 20.6440, 'grassroots', false, 'unlimited', 'all', 'Round 1 of the 18th Drift Open season at Tor Kielce. Three days of grassroots drift competition. Friday training included in entry.', 'https://www.driftopen.com/', '250 PLN', false, 'both', 'Drift Open', 'manual'),

('Drift Open Rd.2 - Motopark Torun', 'Drift Open', '2026-07-03', '2026-07-05', 'Torun, Poland', 'PL', 'Motopark Torun', 53.0270, 18.5630, 'grassroots', false, 'unlimited', 'all', 'Drift Open Round 2 at Motopark Torun. Three days including Friday practice.', 'https://www.driftopen.com/', '250 PLN', false, 'both', 'Drift Open', 'manual'),

('Drift Open Rd.3 - Motopark Koszalin', 'Drift Open', '2026-08-14', '2026-08-16', 'Koszalin, Poland', 'PL', 'Motopark Koszalin', 54.1390, 16.1730, 'grassroots', false, 'unlimited', 'all', 'Round 3 on the Baltic coast. Popular summer destination for Polish drift enthusiasts.', 'https://www.driftopen.com/', '250 PLN', false, 'both', 'Drift Open', 'manual'),

('DTS Winter Finale - Autodrom Slomczyn', 'DTS Drift Tournament Series', '2026-03-22', NULL, 'Slomczyn, Poland', 'PL', 'Autodrom Slomczyn', 52.0190, 20.5720, 'grassroots', false, 'unlimited', 'all', 'Grand finale of DTS Winter Season. Training day March 21, competition March 22. Judges coach participants to improve technique.', 'https://dtseries.pl/kalendarz/', '150 PLN', false, 'both', 'DTS Drift Tournament Series', 'manual'),

-- ============================================================
-- EUROPE: BELGIUM & NETHERLANDS
-- ============================================================
('Skylimit Drift Day Zolder - March', NULL, '2026-03-26', NULL, 'Heusden-Zolder, Belgium', 'BE', 'Circuit Zolder', 50.9913, 5.2573, 'practice', false, 'unlimited', 'beginner', 'Monthly drift day at Circuit Zolder. Wet paddock for beginners with expert instruction alongside open practice for experienced drifters.', 'https://skylimitevents.com/en', '€95', false, 'drive', 'Skylimit Events', 'manual'),

('Skylimit Drift Day Zolder - May', NULL, '2026-05-21', NULL, 'Heusden-Zolder, Belgium', 'BE', 'Circuit Zolder', 50.9913, 5.2573, 'practice', false, 'unlimited', 'beginner', 'Spring drift day at Circuit Zolder. One of Belgium''s most regular drift practice opportunities.', 'https://skylimitevents.com/en', '€95', false, 'drive', 'Skylimit Events', 'manual'),

('Skylimit Drift Day Zolder - July', NULL, '2026-07-16', NULL, 'Heusden-Zolder, Belgium', 'BE', 'Circuit Zolder', 50.9913, 5.2573, 'practice', false, 'unlimited', 'beginner', 'Summer drift day at Circuit Zolder. Membership (€95/year) required.', 'https://skylimitevents.com/en', '€95', false, 'drive', 'Skylimit Events', 'manual'),

('RSZ Drift Training Zandvoort - Spring', NULL, '2026-04-19', NULL, 'Zandvoort, Netherlands', 'NL', 'Circuit Zandvoort', 52.3888, 4.5409, 'practice', false, 'unlimited', 'beginner', 'Drift training at Circuit Zandvoort. 4 hours using rear-wheel-drive BMW 325i cars on wet surfaces. RSZ Drift Certificate awarded.', 'https://www.rsz.nl/en/rsz/driften/', '€150', false, 'drive', 'RSZ Autosport', 'manual'),

('RSZ Drift Training Zandvoort - Summer', NULL, '2026-07-05', NULL, 'Zandvoort, Netherlands', 'NL', 'Circuit Zandvoort', 52.3888, 4.5409, 'practice', false, 'unlimited', 'beginner', 'Summer drift course at Circuit Zandvoort. BMW 325i drift cars provided. Perfect coastal summer day out.', 'https://www.rsz.nl/en/rsz/driften/', '€150', false, 'drive', 'RSZ Autosport', 'manual'),

-- ============================================================
-- EUROPE: FRANCE & ITALY
-- ============================================================
('Torque Drift School - Vaison Piste', NULL, '2026-04-12', NULL, 'Torcy, France', 'FR', 'Vaison Piste Circuit de Torcy', 46.7730, 4.4530, 'practice', false, 'unlimited', 'beginner', 'Drift training with Torque Drift School. Open from age 15, no experience required. One of France''s most respected drift schools.', 'https://www.torqueschool.com/en', '€250', false, 'drive', 'Torque Drift School', 'manual'),

('Torque Drift School - Lurcy-Levis', NULL, '2026-06-14', NULL, 'Lurcy-Levis, France', 'FR', 'Circuit de Lurcy-Levis', 46.7250, 2.9390, 'practice', false, 'unlimited', 'beginner', 'Drift school at former F1 test circuit. Varied layouts ideal for learning.', 'https://www.torqueschool.com/en/circuit-lurcy-levis', '€250', false, 'drive', 'Torque Drift School', 'manual'),

('Italian Drift Academy - Castelletto', NULL, '2026-05-10', NULL, 'Castelletto di Branduzzo, Italy', 'IT', 'Autodromo di Castelletto', 45.0680, 9.0610, 'practice', false, 'unlimited', 'beginner', 'Private drift course near Milan. Professional instruction in race-prepared cars. From age 14. CID competitors as instructors.', 'https://www.racinginitaly.com/', '€199', false, 'drive', 'Racing in Italy', 'manual'),

-- ============================================================
-- EUROPE: SCANDINAVIA
-- ============================================================
('Mantorp Park Drift School - Spring', NULL, '2026-04-25', NULL, 'Mantorp, Sweden', 'SE', 'Mantorp Park', 58.3000, 15.2830, 'practice', false, 'unlimited', 'beginner', 'Learn to drift at Sweden''s legendary Mantorp Park. Rental cars available. No prior experience needed.', 'https://www.mantorppark.com/en/kor-pa-mantorp-park/drift-school/', '1200 SEK', false, 'drive', 'Mantorp Park', 'manual'),

('Mantorp Park Drift School - Summer', NULL, '2026-06-27', NULL, 'Mantorp, Sweden', 'SE', 'Mantorp Park', 58.3000, 15.2830, 'practice', false, 'unlimited', 'beginner', 'Summer drift school at Mantorp Park. Perfect pre-Gatebil warm-up. Car rental available or bring your own.', 'https://www.mantorppark.com/en/kor-pa-mantorp-park/drift-school/', '1200 SEK', false, 'drive', 'Mantorp Park', 'manual'),

('HolyDrift Festival - Sturup Raceway', NULL, '2026-07-24', '2026-07-26', 'Svedala, Sweden', 'SE', 'Sturup Raceway', 55.5330, 13.3560, 'grassroots', false, 'unlimited', 'all', 'Sweden''s wildest 3-day drift festival. Best drifters from Sweden, Denmark, and Norway compete. Open practice, AfterTrack parties, and camping.', 'https://holydrift.com/', '800 SEK', true, 'both', 'HolyDrift', 'manual'),

('Ahvenisto Open Drift Practice', NULL, '2026-06-06', NULL, 'Hameenlinna, Finland', 'FI', 'Ahvenisto Race Circuit', 60.9833, 24.4500, 'practice', false, 'unlimited', 'all', 'Open drift practice ahead of the Drift Masters Finnish round. 100km from Helsinki. Elevation changes and natural stadium setting.', 'https://ahvenistoracecircuit.com/en/', '€40', false, 'drive', 'Ahvenisto Race Circuit', 'manual'),

('NEZ Drift - Pesamaki Finland', 'NEZ Drift', '2026-08-17', '2026-08-19', 'Pesamaki, Finland', 'FI', 'Pesamaki Circuit', 61.4780, 23.7580, 'grassroots', true, 'unlimited', 'intermediate', 'NEZ Drift Championship round at Pesamaki. Practice days before competition. Finnish, Estonian, Latvian, Lithuanian, and Swedish drifters compete.', 'http://www.drifteurope.com/', '€40', false, 'both', 'NEZ Drift / Drift Europe', 'manual'),

-- ============================================================
-- EUROPE: ROMANIA, CROATIA, WALES
-- ============================================================
('RoDrift Training Day - Transilvania Motor Ring', NULL, '2026-05-23', NULL, 'Targu Mures, Romania', 'RO', 'Transilvania Motor Ring', 46.5100, 24.4200, 'practice', false, 'unlimited', 'beginner', 'Drift training at Romania''s newest 3.4km permanent circuit. Growing Romanian drift community.', 'https://rodrift.ro/', '150 RON', false, 'drive', 'RoDrift', 'manual'),

('Croatian Drift Challenge - Practice Round', 'Croatian Drift Challenge', '2026-06-20', '2026-06-21', 'Zagreb, Croatia', 'HR', 'Automotodrom Grobnik', 45.3530, 14.5140, 'grassroots', false, 'unlimited', 'all', 'Croatian Drift Challenge practice and competition at Grobnik. Saturday practice, Sunday competition. Part of the Adria Drift Series.', 'https://www.croatiandriftchallenge.hr/', '€60', false, 'both', 'Croatian Drift Challenge', 'manual'),

('Anglesey Circuit Drift Practice - June', NULL, '2026-06-07', NULL, 'Ty Croes, Anglesey, UK', 'GB', 'Anglesey Circuit - Trac Mon', 53.1880, -4.4960, 'practice', false, 'unlimited', 'all', 'Open drift practice at Anglesey in North Wales. Three track layouts including the famous touge-style course.', 'https://www.angleseycircuit.co.uk/', '£65', false, 'drive', 'Anglesey Circuit', 'manual'),

-- ============================================================
-- USA: DRIFT NIRVANA - SUMMIT POINT
-- ============================================================
('Drift Nirvana - PC Drift .5 April', 'Drift Nirvana', '2026-04-25', '2026-04-26', 'Summit Point, West Virginia', 'US', 'Summit Point Motorsports Park', 39.2313, -77.9703, 'practice', false, 'unlimited', 'all', 'Drift Nirvana PC Drift .5 at Summit Point. Two days of open practice and tandem sessions.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$205', false, 'drive', 'Drift Nirvana', 'manual'),

('Drift Nirvana - PC Drift .5 May', 'Drift Nirvana', '2026-05-24', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point Motorsports Park', 39.2313, -77.9703, 'practice', false, 'unlimited', 'all', 'Monthly Drift Nirvana session at Summit Point.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$205', false, 'drive', 'Drift Nirvana', 'manual'),

('Drift Nirvana - Skid & Advanced June', 'Drift Nirvana', '2026-06-06', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point Motorsports Park', 39.2313, -77.9703, 'practice', false, 'unlimited', 'all', 'Skid pad and advanced drift session at Summit Point.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$205', false, 'drive', 'Drift Nirvana', 'manual'),

('Drift Nirvana - Feint or Freight', 'Drift Nirvana', '2026-07-11', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point Motorsports Park', 39.2313, -77.9703, 'grassroots', false, 'unlimited', 'all', 'Drift Nirvana''s Feint or Freight fun competition at Summit Point.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$205', false, 'both', 'Drift Nirvana', 'manual'),

('Drift Nirvana - Rivals', 'Drift Nirvana', '2026-08-02', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point Motorsports Park', 39.2313, -77.9703, 'grassroots', false, 'unlimited', 'all', 'Drift Nirvana Rivals tandem competition at Summit Point.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$205', false, 'both', 'Drift Nirvana', 'manual'),

-- ============================================================
-- USA: CLUB LOOSE
-- ============================================================
('Club Loose - Pitt Race April', 'Club Loose', '2026-04-19', NULL, 'Wampum, Pennsylvania', 'US', 'Pittsburgh International Race Complex', 40.8870, -80.3470, 'grassroots', false, 'unlimited', 'all', 'Club Loose drift day at Pitt Race. One of the biggest grassroots programs on the East Coast.', 'https://clubloose.com', '$100', false, 'drive', 'Club Loose', 'manual'),

('Club Loose - Pitt Race May', 'Club Loose', '2026-05-17', NULL, 'Wampum, Pennsylvania', 'US', 'Pittsburgh International Race Complex', 40.8870, -80.3470, 'grassroots', false, 'unlimited', 'all', 'Monthly Club Loose at Pitt Race.', 'https://clubloose.com', '$100', false, 'drive', 'Club Loose', 'manual'),

('Club Loose - Pitt Race June', 'Club Loose', '2026-06-07', NULL, 'Wampum, Pennsylvania', 'US', 'Pittsburgh International Race Complex', 40.8870, -80.3470, 'grassroots', false, 'unlimited', 'all', 'Club Loose at Pitt Race. Relaxed community atmosphere.', 'https://clubloose.com', '$100', false, 'drive', 'Club Loose', 'manual'),

('Club Loose - Pitt Race July', 'Club Loose', '2026-07-19', NULL, 'Wampum, Pennsylvania', 'US', 'Pittsburgh International Race Complex', 40.8870, -80.3470, 'grassroots', false, 'unlimited', 'all', 'Summer Club Loose at Pitt Race.', 'https://clubloose.com', '$100', false, 'drive', 'Club Loose', 'manual'),

('Club Loose - Pitt Race August Double', 'Club Loose', '2026-08-15', '2026-08-16', 'Wampum, Pennsylvania', 'US', 'Pittsburgh International Race Complex', 40.8870, -80.3470, 'grassroots', false, 'unlimited', 'all', 'Two-day Club Loose weekend at Pitt Race.', 'https://clubloose.com', '$175', false, 'drive', 'Club Loose', 'manual'),

('Club Loose - E-Town April', 'Club Loose', '2026-04-05', NULL, 'Englishtown, New Jersey', 'US', 'Old Bridge Township Raceway Park', 40.3310, -74.3340, 'grassroots', false, 'unlimited', 'all', 'Club Loose at the legendary E-Town. All levels welcome.', 'https://clubloose.com', '$100', false, 'drive', 'Club Loose', 'manual'),

('Club Loose - E-Town August', 'Club Loose', '2026-08-02', NULL, 'Englishtown, New Jersey', 'US', 'Old Bridge Township Raceway Park', 40.3310, -74.3340, 'grassroots', false, 'unlimited', 'all', 'Summer Club Loose at E-Town.', 'https://clubloose.com', '$100', false, 'drive', 'Club Loose', 'manual'),

-- ============================================================
-- USA: LOCK CITY DRIFT - THOMPSON CT
-- ============================================================
('Lock City Drift - Season Opener', 'Lock City Drift', '2026-03-14', NULL, 'Thompson, Connecticut', 'US', 'Thompson Speedway Motorsports Park', 41.9720, -71.8640, 'grassroots', false, 'unlimited', 'all', 'Lock City Drift season opener at Thompson Speedway. New England''s premiere grassroots drift series.', NULL, '$100', false, 'drive', 'Lock City Drift', 'manual'),

('Lock City Drift - Spring Session', 'Lock City Drift', '2026-04-24', '2026-04-25', 'Thompson, Connecticut', 'US', 'Thompson Speedway Motorsports Park', 41.9720, -71.8640, 'grassroots', false, 'unlimited', 'all', 'Two-day Lock City Drift at Thompson Speedway.', NULL, '$100', false, 'drive', 'Lock City Drift', 'manual'),

('Lock City Drift - Mayhem Weekend', 'Lock City Drift', '2026-05-15', '2026-05-16', 'Thompson, Connecticut', 'US', 'Thompson Speedway Motorsports Park', 41.9720, -71.8640, 'grassroots', false, 'unlimited', 'all', 'Mayhem Weekend at Thompson Speedway.', NULL, '$100', false, 'drive', 'Lock City Drift', 'manual'),

('Lock City Drift - Night Stage Invitational', 'Lock City Drift', '2026-07-10', '2026-07-12', 'Thompson, Connecticut', 'US', 'Thompson Speedway Motorsports Park', 41.9720, -71.8640, 'grassroots', false, 'unlimited', 'all', 'Three-day Night Stage Invitational at Thompson. Under the lights.', NULL, '$125', true, 'drive', 'Lock City Drift', 'manual'),

-- ============================================================
-- USA: MB DRIFT - ROCKINGHAM NC
-- ============================================================
('MB Drift Spring Matsuri', 'MB Drift', '2026-03-07', '2026-03-08', 'Rockingham, North Carolina', 'US', 'Rockingham Speedway', 34.9730, -79.7440, 'grassroots', false, 'unlimited', 'all', 'MB Drift Spring Matsuri at Rockingham. Two days of grassroots drifting on the oval.', NULL, '$150', false, 'drive', 'MB Drift', 'manual'),

('MB Drift Open Drift & Rd.1', 'MB Drift', '2026-04-25', '2026-04-26', 'Rockingham, North Carolina', 'US', 'Rockingham Speedway', 34.9730, -79.7440, 'grassroots', false, 'unlimited', 'all', 'MB Drift competition Round 1 with open drift sessions.', NULL, '$150', false, 'both', 'MB Drift', 'manual'),

('MB Drift Open Drift & Rd.2', 'MB Drift', '2026-06-06', '2026-06-07', 'Rockingham, North Carolina', 'US', 'Rockingham Speedway', 34.9730, -79.7440, 'grassroots', false, 'unlimited', 'all', 'MB Drift Round 2 with open drift.', NULL, '$150', false, 'both', 'MB Drift', 'manual'),

('MB Drift Summer Matsuri', 'MB Drift', '2026-07-18', '2026-07-19', 'Rockingham, North Carolina', 'US', 'Rockingham Speedway', 34.9730, -79.7440, 'grassroots', false, 'unlimited', 'all', 'MB Drift Summer Matsuri at Rockingham.', NULL, '$150', true, 'drive', 'MB Drift', 'manual'),

-- ============================================================
-- USA: OSW DRIFT - ORLANDO (additional dates)
-- ============================================================
('OSW Drift After Dark - May', 'OSW Drift', '2026-05-16', NULL, 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'practice', false, 'unlimited', 'all', 'OSW After Dark open drift night. 6 hours on two tracks under the lights. Pay at the gate.', 'https://oswdrift.com', '$60', false, 'drive', 'OSW Drift', 'manual'),

('OSW Drift Learners Day - June', 'OSW Drift', '2026-06-20', NULL, 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'practice', false, 'unlimited', 'beginner', 'OSW Learners Day with 5 hours of guided instruction followed by After Dark session.', 'https://oswdrift.com', '$165', false, 'drive', 'OSW Drift', 'manual'),

('OSW Drift After Dark - July', 'OSW Drift', '2026-07-18', NULL, 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'practice', false, 'unlimited', 'all', 'Monthly After Dark drift night at Orlando Speed World.', 'https://oswdrift.com', '$60', false, 'drive', 'OSW Drift', 'manual'),

('OSW Drift After Dark - August', 'OSW Drift', '2026-08-15', NULL, 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'practice', false, 'unlimited', 'all', 'Summer After Dark at OSW.', 'https://oswdrift.com', '$60', false, 'drive', 'OSW Drift', 'manual'),

-- ============================================================
-- USA: LONE STAR DRIFT - TEXAS (championship rounds)
-- ============================================================
('Lone Star Drift Rd.1 - Gulf Greyhound Park', 'Lone Star Drift', '2026-03-28', NULL, 'La Marque, Texas', 'US', 'Gulf Greyhound Park', 29.3710, -94.9790, 'grassroots', false, 'unlimited', 'all', 'Lone Star Drift Round 1 at Gulf Greyhound Park. Texas grassroots drifting.', 'https://lonestardrift.com', '$150', false, 'both', 'Lone Star Drift', 'manual'),

('Lone Star Drift Rd.2 - Mineral Wells Airport', 'Lone Star Drift', '2026-04-25', NULL, 'Mineral Wells, Texas', 'US', 'Mineral Wells Airport', 32.7840, -98.0610, 'grassroots', false, 'unlimited', 'all', 'Lone Star Drift Round 2 on the airport course at Mineral Wells.', 'https://lonestardrift.com', '$150', false, 'both', 'Lone Star Drift', 'manual'),

('Lone Star Drift Rd.3 - Gulf Greyhound Park', 'Lone Star Drift', '2026-05-16', NULL, 'La Marque, Texas', 'US', 'Gulf Greyhound Park', 29.3710, -94.9790, 'grassroots', false, 'unlimited', 'all', 'Lone Star Drift Round 3.', 'https://lonestardrift.com', '$150', false, 'both', 'Lone Star Drift', 'manual'),

('Lone Star Drift Rd.4 - Texas Motor Speedway', 'Lone Star Drift', '2026-06-13', NULL, 'Fort Worth, Texas', 'US', 'Texas Motor Speedway', 33.0372, -97.2812, 'grassroots', false, 'unlimited', 'all', 'Lone Star Drift at Texas Motor Speedway. One of the biggest venues on the LSD calendar.', 'https://lonestardrift.com', '$150', false, 'both', 'Lone Star Drift', 'manual'),

('Lone Star Drift Rd.5 - Mineral Wells Airport', 'Lone Star Drift', '2026-08-15', NULL, 'Mineral Wells, Texas', 'US', 'Mineral Wells Airport', 32.7840, -98.0610, 'grassroots', false, 'unlimited', 'all', 'Late summer Lone Star Drift at Mineral Wells.', 'https://lonestardrift.com', '$150', false, 'both', 'Lone Star Drift', 'manual'),

-- ============================================================
-- USA: MIDWEST & OTHER
-- ============================================================
('Drift STL Season Opener', 'Drift STL', '2026-03-07', NULL, 'Madison, Illinois', 'US', 'World Wide Technology Raceway', 38.6394, -90.1333, 'grassroots', false, 'unlimited', 'all', 'Drift STL season opener at WWT Raceway near St. Louis.', NULL, '$75', false, 'both', 'Drift STL', 'manual'),

('Drift STL Summer Session', 'Drift STL', '2026-06-01', NULL, 'Madison, Illinois', 'US', 'World Wide Technology Raceway', 38.6394, -90.1333, 'grassroots', false, 'unlimited', 'all', 'Drift STL summer session at WWT Raceway.', NULL, '$75', false, 'both', 'Drift STL', 'manual'),

('NCM Drift Day - March', NULL, '2026-03-15', NULL, 'Bowling Green, Kentucky', 'US', 'NCM Motorsports Park', 36.9847, -86.3756, 'practice', false, 'unlimited', 'all', 'Drift day at NCM Motorsports Park in Bowling Green. Open practice for all skill levels.', NULL, '$125', false, 'drive', 'NCM Motorsports Park', 'manual'),

('NCM Drift Day - May', NULL, '2026-05-10', NULL, 'Bowling Green, Kentucky', 'US', 'NCM Motorsports Park', 36.9847, -86.3756, 'practice', false, 'unlimited', 'all', 'Spring drift day at NCM Motorsports Park.', NULL, '$125', false, 'drive', 'NCM Motorsports Park', 'manual'),

('NCM Drift Day - July', NULL, '2026-07-12', NULL, 'Bowling Green, Kentucky', 'US', 'NCM Motorsports Park', 36.9847, -86.3756, 'practice', false, 'unlimited', 'all', 'Summer drift day at NCM Motorsports Park.', NULL, '$125', false, 'drive', 'NCM Motorsports Park', 'manual'),

('Ready Set Drift - Pocono Spring', 'Ready Set Drift', '2026-05-02', NULL, 'Long Pond, Pennsylvania', 'US', 'Pocono Raceway', 41.0578, -75.5106, 'grassroots', false, 'unlimited', 'all', 'Ready Set Drift at Pocono Raceway. Grassroots drifting at one of NASCAR''s iconic venues.', NULL, '$100', false, 'both', 'Ready Set Drift', 'manual'),

('Ready Set Drift - Poconos Bash', 'Ready Set Drift', '2026-07-26', '2026-07-27', 'Long Pond, Pennsylvania', 'US', 'Pocono Raceway', 41.0578, -75.5106, 'grassroots', false, 'unlimited', 'all', 'Two-day Poconos Bash at Pocono Raceway.', NULL, '$175', true, 'both', 'Ready Set Drift', 'manual'),

('Woodward Drift at M1 Concourse', 'Drift Indy', '2026-08-16', '2026-08-17', 'Pontiac, Michigan', 'US', 'M1 Concourse', 42.6389, -83.2806, 'grassroots', false, 'unlimited', 'all', 'Drift Indy brings drifting to M1 Concourse during Woodward Dream Cruise week.', NULL, '$150', true, 'both', 'Drift Indy', 'manual'),

-- ============================================================
-- USA: WEST COAST (additional dates)
-- ============================================================
('Thursday Night Drift - Adams June', NULL, '2026-06-04', NULL, 'Riverside, California', 'US', 'Adams Motorsports Park', 33.8750, -117.2500, 'practice', false, 'unlimited', 'all', 'Weekly Thursday Night Drift at Adams Motorsports Park. SoCal''s oldest grassroots drift venue.', 'https://adamsmotorsportspark.com/racing/drifting/', '$40', false, 'drive', 'Adams Motorsports Park', 'manual'),

('Thursday Night Drift - Adams July', NULL, '2026-07-02', NULL, 'Riverside, California', 'US', 'Adams Motorsports Park', 33.8750, -117.2500, 'practice', false, 'unlimited', 'all', 'Monthly Thursday Night Drift at Adams Motorsports Park.', 'https://adamsmotorsportspark.com/racing/drifting/', '$40', false, 'drive', 'Adams Motorsports Park', 'manual'),

('Thursday Night Drift - Adams August', NULL, '2026-08-06', NULL, 'Riverside, California', 'US', 'Adams Motorsports Park', 33.8750, -117.2500, 'practice', false, 'unlimited', 'all', 'Summer Thursday Night Drift at Adams.', 'https://adamsmotorsportspark.com/racing/drifting/', '$40', false, 'drive', 'Adams Motorsports Park', 'manual'),

('Bay Area Drifting School - April', 'Bay Area Drifting', '2026-04-18', '2026-04-19', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'practice', false, 'unlimited', 'beginner', 'Bay Area Drifting school at Thunderhill. Small class sizes and personalized coaching.', 'https://www.bayareadrifting.com/schedule', '$350', false, 'drive', 'Bay Area Drifting', 'manual'),

('Bay Area Drifting School - June', 'Bay Area Drifting', '2026-06-20', '2026-06-21', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'practice', false, 'unlimited', 'beginner', 'Summer Bay Area Drifting at Thunderhill.', 'https://www.bayareadrifting.com/schedule', '$350', false, 'drive', 'Bay Area Drifting', 'manual'),

('Bay Area Drifting School - August', 'Bay Area Drifting', '2026-08-08', '2026-08-09', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'practice', false, 'unlimited', 'beginner', 'Late summer Bay Area Drifting at Thunderhill.', 'https://www.bayareadrifting.com/schedule', '$350', false, 'drive', 'Bay Area Drifting', 'manual'),

('Raceworz Drift & Drag - Sonoma', NULL, '2026-06-13', '2026-06-14', 'Sonoma, California', 'US', 'Sonoma Raceway', 38.1611, -122.4547, 'grassroots', false, 'unlimited', 'all', 'Raceworz Drift & Drag at Sonoma Raceway. Drifting and drag racing at the famous NorCal circuit.', NULL, '$80', false, 'both', 'Raceworz', 'manual'),

-- ============================================================
-- USA: EVERGREEN SPEEDWAY (additional dates)
-- ============================================================
('Evergreen Open Drift - May', NULL, '2026-05-09', NULL, 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'practice', false, 'unlimited', 'all', 'Open drift at Evergreen Speedway. The famous banked oval that hosts Formula Drift.', 'https://evergreenspeedway.com/drift/drift-schedule/', '$75', false, 'drive', 'Evergreen Speedway', 'manual'),

('Evergreen Open Drift - June', NULL, '2026-06-13', NULL, 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'practice', false, 'unlimited', 'all', 'Monthly open drift at Evergreen Speedway.', 'https://evergreenspeedway.com/drift/drift-schedule/', '$75', false, 'drive', 'Evergreen Speedway', 'manual'),

('Evergreen Open Drift - July', NULL, '2026-07-11', NULL, 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'practice', false, 'unlimited', 'all', 'Summer open drift at Evergreen.', 'https://evergreenspeedway.com/drift/drift-schedule/', '$75', false, 'drive', 'Evergreen Speedway', 'manual'),

-- ============================================================
-- JAPAN: EBISU CIRCUIT (additional practice days)
-- ============================================================
('Ebisu Circuit Open Practice - May', NULL, '2026-05-03', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Weekend practice at Ebisu before the Spring Matsuri. Access to 5 drift courses. Rental cars available through Powervehicles.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - July', NULL, '2026-07-12', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Midsummer practice at Ebisu including the famous Minami course.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - August', NULL, '2026-08-09', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Late summer practice ahead of the Summer Matsuri. Great warm-up to learn the courses.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

-- ============================================================
-- JAPAN: DRIFT SCHOOLS
-- ============================================================
('Sideways Experience - 7 Day Drift School', NULL, '2026-04-16', '2026-04-22', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'beginner', 'All-inclusive 7-day drift school at Ebisu. From donuts to linking courses. Includes accommodation, transport from Koriyama station, car hire, fuel, and instruction.', 'https://www.sidewaysx.com/', '¥180,000', false, 'drive', 'The Sideways Experience', 'manual'),

('Sideways Experience - 3 Day Drift School', NULL, '2026-06-11', '2026-06-13', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'beginner', 'Intensive 3-day drift school at Ebisu. Cars include 1JZ Toyota Chasers, RX-8s, and 350Zs. Small group format.', 'https://www.sidewaysx.com/', '¥90,000', false, 'drive', 'The Sideways Experience', 'manual'),

('Matenro Drift Lesson - Spring', NULL, '2026-04-04', NULL, 'Ichihara, Chiba, Japan', 'JP', 'Minami Chiba Circuit', 35.3420, 140.1380, 'practice', false, 'unlimited', 'beginner', 'Private drift lessons with OG pro instructors near Tokyo. Beginners start in MX-5s. Includes pickup from Tokyo.', 'https://matenro-drift-racing.com/', '¥25,000', false, 'drive', 'Matenro Drift Racing', 'manual'),

('Matenro Drift Lesson - Summer', NULL, '2026-07-04', NULL, 'Ichihara, Chiba, Japan', 'JP', 'Minami Chiba Circuit', 35.3420, 140.1380, 'practice', false, 'unlimited', 'beginner', 'Summer drift lessons with Matenro. One-on-one coaching in English. Transport from central Tokyo included.', 'https://matenro-drift-racing.com/', '¥25,000', false, 'drive', 'Matenro Drift Racing', 'manual'),

-- ============================================================
-- JAPAN: OTHER CIRCUITS (additional dates)
-- ============================================================
('Nikko Circuit Drift Practice - April', NULL, '2026-04-19', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Spring practice at the iconic Nikko Circuit where modern drift culture was born.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

('Nikko Circuit Drift Practice - June', NULL, '2026-06-14', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Early summer practice at Nikko. Friendly paddock, authentic JDM vibe.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

('Honjo Circuit Drift Practice - March', NULL, '2026-03-28', NULL, 'Honjo, Saitama, Japan', 'JP', 'Honjo Circuit', 36.1870, 139.1290, 'practice', false, 'unlimited', 'all', 'Practice at Honjo Circuit, a 1,112m mini circuit in an old quarry. Approximately 2 hours from Tokyo.', 'https://en.activityjapan.com/publish/plan/8762', '¥5,000', false, 'drive', 'Honjo Circuit', 'manual'),

('Honjo Circuit Drift Practice - May', NULL, '2026-05-17', NULL, 'Honjo, Saitama, Japan', 'JP', 'Honjo Circuit', 36.1870, 139.1290, 'practice', false, 'unlimited', 'all', 'Weekend practice at Honjo Circuit in the greater Tokyo area.', 'https://en.activityjapan.com/publish/plan/8762', '¥5,000', false, 'drive', 'Honjo Circuit', 'manual'),

('Tsukuba TC1000 Drift Practice - April', NULL, '2026-04-26', NULL, 'Shimotsuma, Ibaraki, Japan', 'JP', 'Tsukuba Circuit TC1000', 36.1510, 139.9195, 'practice', false, 'unlimited', 'all', 'Drift practice on Tsukuba''s shorter 1,000m course. Safe runoff, 90 minutes from Tokyo.', 'https://www.tsukuba-circuit.jp/', '¥8,000', false, 'drive', 'Tsukuba Circuit', 'manual'),

('Meihan Sportsland Practice - March', NULL, '2026-03-14', NULL, 'Yamazoe, Nara, Japan', 'JP', 'Meihan Sportsland', 34.6833, 136.0500, 'practice', false, 'unlimited', 'all', 'Early spring practice at Meihan''s famous E-course figure-eight with wall-ride sections.', 'http://web1.kcn.jp/meihansl/', '¥5,000', false, 'drive', 'Meihan Sportsland', 'manual'),

('Meihan Sportsland Practice - June', NULL, '2026-06-21', NULL, 'Yamazoe, Nara, Japan', 'JP', 'Meihan Sportsland', 34.6833, 136.0500, 'practice', false, 'unlimited', 'all', 'Summer practice at Meihan. Popular with the Osaka/Kansai drift community.', 'http://web1.kcn.jp/meihansl/', '¥5,000', false, 'drive', 'Meihan Sportsland', 'manual'),

('Mobara Twin Circuit Practice - March', NULL, '2026-03-21', NULL, 'Mobara, Chiba, Japan', 'JP', 'Mobara Twin Circuit', 35.3818, 140.2813, 'practice', false, 'unlimited', 'all', 'Spring practice at Mobara, the closest dedicated drift track to Tokyo.', NULL, '¥5,500', false, 'drive', 'Mobara Twin Circuit', 'manual'),

('Mobara Twin Circuit Practice - August', NULL, '2026-08-15', NULL, 'Mobara, Chiba, Japan', 'JP', 'Mobara Twin Circuit', 35.3818, 140.2813, 'practice', false, 'unlimited', 'all', 'Obon holiday drift practice at Mobara.', NULL, '¥5,500', false, 'drive', 'Mobara Twin Circuit', 'manual'),

('Bihoku Highland Circuit Practice - April', NULL, '2026-04-18', NULL, 'Niimi, Okayama, Japan', 'JP', 'Bihoku Highland Circuit', 34.9500, 133.4333, 'practice', false, 'unlimited', 'all', 'Practice at a historic D1GP venue. Elevation changes, slippery tarmac, and a famous dirt bank section.', 'https://driftspots.com/japan/bihoku-highland-circuit/', '¥5,000', false, 'drive', 'Bihoku Highland Circuit', 'manual'),

('Motorland Suzuka Practice - May', NULL, '2026-05-23', NULL, 'Suzuka, Mie, Japan', 'JP', 'Motorland Suzuka', 34.8500, 136.5300, 'practice', false, 'unlimited', 'all', 'Practice at Motorland Suzuka. Sessions run in 2 x 3-hour blocks.', 'https://k-dori.com/motorland-suzuka', '¥6,000', false, 'drive', 'Motorland Suzuka', 'manual'),

('Nihonkai Maze Circuit Practice - June', NULL, '2026-06-28', NULL, 'Tainai, Niigata, Japan', 'JP', 'Nihonkai Maze Circuit', 38.0667, 139.4333, 'practice', false, 'unlimited', 'all', 'Practice at an atmospheric coastal track near the Sea of Japan. Raw, authentic grassroots feel.', 'https://driftspots.com/japan/nihonkai-maze-circuit/', '¥5,000', false, 'drive', 'Nihonkai Maze Circuit', 'manual'),

-- ============================================================
-- AUSTRALIA: SYDNEY & QUEENSLAND
-- ============================================================
('SMSP Drift Matsuri 2026', NULL, '2026-03-21', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park - South Circuit', -33.8025, 150.8690, 'grassroots', false, 'unlimited', 'intermediate', 'South Circuit DRIFT Matsuri under lights 6:30pm-10:30pm. Australian Drift Club''s signature festival event.', 'https://www.australiandriftclub.com.au/events-list/', 'A$220', true, 'both', 'Australian Drift Club', 'manual'),

('ADC Drift Day - April', NULL, '2026-04-06', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'all', 'Drift practice at Sydney Motorsport Park run by the Australian Drift Club. Evening session under lights.', 'https://www.australiandriftclub.com.au/events-list/', 'A$180', false, 'drive', 'Australian Drift Club', 'manual'),

('ADC Drift Day - May', NULL, '2026-05-10', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'all', 'May drift practice with the Australian Drift Club at SMSP.', 'https://www.australiandriftclub.com.au/events-list/', 'A$180', false, 'drive', 'Australian Drift Club', 'manual'),

('Drift School Australia - Beginner Class', NULL, '2026-04-11', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'beginner', 'Learn to drift in highly modified cars with professional instructors. No experience required - everything provided.', 'https://driftschoolaustralia.com.au/', 'A$299', false, 'drive', 'Drift School Australia', 'manual'),

('Drift School Australia - Masterclass', NULL, '2026-06-13', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'intermediate', 'Advanced drift techniques including transitions and tandem basics. School-provided cars and instruction.', 'https://driftschoolaustralia.com.au/', 'A$399', false, 'drive', 'Drift School Australia', 'manual'),

('QR Friday Night Drift - March', NULL, '2026-03-13', NULL, 'Willowbank, Queensland, Australia', 'AU', 'Queensland Raceway', -27.6875, 152.6515, 'grassroots', false, 'unlimited', 'intermediate', 'Friday Night Drift at Queensland Raceway. Track hot 5:30pm to 10pm. Drift Playground section for amateurs.', 'https://www.qldraceways.com.au/events-at-queensland-raceway/drifting', 'A$150', false, 'both', 'Queensland Raceway', 'manual'),

('QR Friday Night Drift - May', NULL, '2026-05-08', NULL, 'Willowbank, Queensland, Australia', 'AU', 'Queensland Raceway', -27.6875, 152.6515, 'grassroots', false, 'unlimited', 'intermediate', 'Monthly evening drift at QR. Drift Playground for beginners, main track for experienced.', 'https://www.qldraceways.com.au/events-at-queensland-raceway/drifting', 'A$150', false, 'both', 'Queensland Raceway', 'manual'),

('Pheasant Wood Drift Day - May', NULL, '2026-05-16', NULL, 'Marulan, NSW, Australia', 'AU', 'Pheasant Wood Circuit', -34.6833, 150.0167, 'practice', false, 'unlimited', 'all', 'Drift practice at Pheasant Wood Circuit, 90 min south of Sydney. Purpose-built for driver training.', 'https://pheasantwood.com.au/', 'A$150', false, 'drive', 'Pheasant Wood Circuit', 'manual'),

-- ============================================================
-- AUSTRALIA: WESTERN AUSTRALIA
-- ============================================================
('Drift School WA - Experience April', NULL, '2026-04-18', NULL, 'Balcatta, Western Australia', 'AU', 'CarCo Raceway', -31.8500, 115.8300, 'practice', false, 'unlimited', 'beginner', 'Drift School WA at CarCo Raceway in Perth. Coaching from expert instructors. Cars and instruction provided.', 'https://driftschoolwa.com/', 'A$249', false, 'drive', 'Drift School WA', 'manual'),

('Drift School WA - Experience July', NULL, '2026-07-25', NULL, 'Balcatta, Western Australia', 'AU', 'CarCo Raceway', -31.8500, 115.8300, 'practice', false, 'unlimited', 'beginner', 'Winter drift school at CarCo Raceway. Based here since 2016.', 'https://driftschoolwa.com/', 'A$249', false, 'drive', 'Drift School WA', 'manual'),

-- ============================================================
-- NEW ZEALAND
-- ============================================================
('Drift Academy NZ - March', NULL, '2026-03-28', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'practice', false, 'unlimited', 'beginner', 'Monthly Drift Academy at Hampton Downs. Drift 101 for first-timers, Drift Master for intermediate, Drift Elite for advanced. Cars and helmets included.', 'https://www.driftacademy.co.nz/', 'NZ$299', false, 'drive', 'Drift Academy International', 'manual'),

('Drift Academy NZ - May', NULL, '2026-05-23', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'practice', false, 'unlimited', 'beginner', 'May Drift Academy at Hampton Downs. Equipment and cars provided.', 'https://www.driftacademy.co.nz/', 'NZ$299', false, 'drive', 'Drift Academy International', 'manual'),

('Drift Academy NZ - July', NULL, '2026-07-18', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'practice', false, 'unlimited', 'beginner', 'Winter Drift Academy at Hampton Downs.', 'https://www.driftacademy.co.nz/', 'NZ$299', false, 'drive', 'Drift Academy International', 'manual'),

('Mad Mike Drift Force - April', NULL, '2026-04-19', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'grassroots', false, 'unlimited', 'all', 'Mad Mike Drift Force grassroots practice. Regular and reverse direction. Non-competitive fun environment.', 'https://www.madmike.co.nz/pages/drift-force', 'NZ$180', false, 'drive', 'Mad Mike Motorsport', 'manual'),

('Mad Mike Drift Force - June', NULL, '2026-06-15', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'grassroots', false, 'unlimited', 'all', 'Mad Mike Drift Force - the only opportunity to drift Hampton Downs in reverse.', 'https://www.madmike.co.nz/pages/drift-force', 'NZ$180', false, 'drive', 'Mad Mike Motorsport', 'manual'),

('Mad Mike Drift Force - August', NULL, '2026-08-16', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'grassroots', false, 'unlimited', 'all', 'August Mad Mike Drift Force. A stepping stone for NZ''s up-and-coming drift stars.', 'https://www.madmike.co.nz/pages/drift-force', 'NZ$180', false, 'drive', 'Mad Mike Motorsport', 'manual'),

('Taupo Drift - April', NULL, '2026-04-04', NULL, 'Taupo, Waikato, New Zealand', 'NZ', 'Taupo Motorsport Park', -38.7167, 176.0833, 'practice', false, 'unlimited', 'all', 'Taupo Drift grassroots day. 5 x 20-minute sessions. RWD only.', 'https://www.taupomp.co.nz/events/taupo-drift', 'NZ$250', false, 'drive', 'Taupo Motorsport Park', 'manual'),

('Taupo Drift - June', NULL, '2026-06-06', NULL, 'Taupo, Waikato, New Zealand', 'NZ', 'Taupo Motorsport Park', -38.7167, 176.0833, 'practice', false, 'unlimited', 'all', 'Winter Taupo Drift. Accessible from both Auckland and Wellington. RWD only.', 'https://www.taupomp.co.nz/events/taupo-drift', 'NZ$250', false, 'drive', 'Taupo Motorsport Park', 'manual'),

('Manfeild Drift Tutoring - April', NULL, '2026-04-11', NULL, 'Feilding, Manawatu, New Zealand', 'NZ', 'Manfeild Circuit Chris Amon', -40.2333, 175.5667, 'practice', false, 'unlimited', 'beginner', 'Drift tutoring on the 1.2km Backtrack. Skill courses rotate through stations. Entry-level event.', 'https://www.manawatucarclub.org.nz/events/drifting', 'NZ$120', false, 'drive', 'Manawatu Car Club', 'manual'),

('Manfeild Drift Tutoring - June', NULL, '2026-06-20', NULL, 'Feilding, Manawatu, New Zealand', 'NZ', 'Manfeild Circuit Chris Amon', -40.2333, 175.5667, 'practice', false, 'unlimited', 'beginner', 'Winter drift tutoring at Manfeild. Progression path from cone-work to open-section practice.', 'https://www.manawatucarclub.org.nz/events/drifting', 'NZ$120', false, 'drive', 'Manawatu Car Club', 'manual'),

-- ============================================================
-- MIDDLE EAST
-- ============================================================
('Yas Drift Night - April', NULL, '2026-04-11', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'practice', false, 'unlimited', 'all', 'Yas Drift Night at Yas Marina Circuit. 4-hour session on the dedicated drift track. BYOC or rental.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-night', 'AED 350', false, 'drive', 'Yas Marina Circuit', 'manual'),

('Yas Drift Night - May', NULL, '2026-05-09', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'practice', false, 'unlimited', 'all', 'Monthly Yas Drift Night. One of the most prestigious drift practice venues in the Middle East.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-night', 'AED 350', false, 'drive', 'Yas Marina Circuit', 'manual'),

('Yas Drift Night - June', NULL, '2026-06-13', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'practice', false, 'unlimited', 'all', 'Summer Yas Drift Night. Evening sessions to beat the Gulf heat.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-night', 'AED 350', false, 'drive', 'Yas Marina Circuit', 'manual'),

('Drift DXB - March', NULL, '2026-03-12', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'all', 'Drift DXB night session 8pm-midnight. Separate Novice and Advanced groups.', 'https://dubaiautodrome.ae/open-track-days/drift-dxb/', 'AED 300', false, 'drive', 'Dubai Autodrome', 'manual'),

('Drift DXB - April', NULL, '2026-04-09', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'all', 'Monthly Drift DXB at Dubai Autodrome. Night-time drifting on the Club Circuit.', 'https://dubaiautodrome.ae/open-track-days/drift-dxb/', 'AED 300', false, 'drive', 'Dubai Autodrome', 'manual'),

('DX Drift Training - Intermediate', NULL, '2026-03-15', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'intermediate', 'Intermediate drift training at Dubai Autodrome. Professional instruction. Cars and equipment provided.', 'https://grandeturismo.com/events/intermediate-drift-training-course-intensive-skills', 'AED 800', false, 'drive', 'DX Drift', 'manual'),

('Bahrain Drag & Drift Night - March', NULL, '2026-03-02', NULL, 'Sakhir, Bahrain', 'BH', 'Bahrain International Circuit', 26.0325, 50.5106, 'grassroots', false, 'unlimited', 'all', 'Ebrahim K Kanoo Drag and Drift Night at Bahrain International Circuit. 5pm-11pm, BYOC.', 'https://www.bahraingp.com/blog/experiences/ebrahim-k-kanoo-drag-and-drift-nights/', 'BHD 15', false, 'drive', 'Bahrain International Circuit', 'manual'),

('Bahrain Drag & Drift Night - May', NULL, '2026-05-04', NULL, 'Sakhir, Bahrain', 'BH', 'Bahrain International Circuit', 26.0325, 50.5106, 'grassroots', false, 'unlimited', 'all', 'Monthly Drag & Drift Night at BIC. Popular with the Gulf drift community.', 'https://www.bahraingp.com/blog/experiences/ebrahim-k-kanoo-drag-and-drift-nights/', 'BHD 15', false, 'drive', 'Bahrain International Circuit', 'manual');
