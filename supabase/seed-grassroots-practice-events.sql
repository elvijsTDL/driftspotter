-- ============================================================
-- Grassroots & Practice Drift Events Seed
-- Japan, Australia, New Zealand, Middle East
-- March 2026 through August 2026
-- Run in Supabase SQL Editor AFTER events-migration.sql
-- ============================================================
-- Sources:
--   Powervehicles / Ebisu Circuit: https://powervehicles.com/drift-in-ebisu/
--   The Sideways Experience: https://www.sidewaysx.com/
--   Matenro Drift Racing: https://matenro-drift-racing.com/
--   Drift Academy Japan: https://www.driftacademy.co.nz/pages/drift-academy-japan
--   Nikko Circuit: https://motorsportfanclub.com/venue/nikko-circuit-japan/
--   Meihan Sportsland: https://driftspots.com/japan/meihan-sportsland/
--   Mobara Twin Circuit: https://jdm4all.com/jdm-tracks/kanto/mobara-twin-circuit/
--   Honjo Circuit: https://jdm4all.com/honjo-circuit/
--   Bihoku Highland: https://driftspots.com/japan/bihoku-highland-circuit/
--   Motorland Suzuka: https://k-dori.com/motorland-suzuka
--   Nihonkai Maze Circuit: https://driftspots.com/japan/nihonkai-maze-circuit/
--   Australian Drift Club: https://www.australiandriftclub.com.au/events-list/
--   Drift School Australia: https://driftschoolaustralia.com.au/
--   Queensland Raceway: https://www.qldraceways.com.au/events-at-queensland-raceway/drifting
--   Drift School WA: https://driftschoolwa.com/
--   Drift Academy NZ: https://www.driftacademy.co.nz/
--   Mad Mike Drift Force: https://www.madmike.co.nz/pages/drift-force
--   Taupo Motorsport Park: https://www.taupomp.co.nz/events/taupo-drift
--   Manawatu Car Club: https://www.manawatucarclub.org.nz/events/drifting
--   DriftSouth: https://www.driftsouth.co.nz/
--   Yas Marina Circuit: https://www.yasmarinacircuit.com/en/openyas/yas-drift-night
--   Dubai Autodrome: https://dubaiautodrome.ae/open-track-days/drift-dxb/
--   Bahrain International Circuit: https://www.bahraingp.com/blog/experiences/ebrahim-k-kanoo-drag-and-drift-nights/
-- ============================================================
--
-- NOTE: This file seeds ONLY grassroots and practice-level events.
-- Official/pro events are in seed-asia-pacific-me-events.sql.
-- Some Ebisu practice days already exist in that file - this adds
-- additional dates and new venues not yet covered.
-- ============================================================

INSERT INTO public.events (name, series, date, end_date, location, country, track, lat, lng, category, cage_required, tire_size, skill_level, description, event_url, price, is_hot, participation, organizer, source) VALUES

-- ============================================================
-- JAPAN - Ebisu Circuit Additional Practice Days
-- Ebisu runs practice nearly every weekend Mar-Dec.
-- These fill gaps not covered in seed-asia-pacific-me-events.sql.
-- ============================================================

('Ebisu Circuit Open Practice - May', NULL, '2026-05-03', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Weekend open practice at Ebisu Circuit before the Spring Matsuri. Access to 5 drift courses all day for ¥9,000. The legendary home of Japanese drifting with 7 individual courses in the Fukushima mountains. Rental cars available through Powervehicles.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - July', NULL, '2026-07-12', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Midsummer open practice at Ebisu Circuit. Access to 5 drift courses including the famous Minami course. Warm summer conditions make this an ideal time to visit. Pre-booking through Powervehicles required.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

('Ebisu Circuit Open Practice - August', NULL, '2026-08-09', NULL, 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'all', 'Late summer practice day at Ebisu Circuit ahead of the Summer Matsuri. Great warm-up session to learn the courses before the big festival weekend. All skill levels from beginners to pros welcome.', 'https://powervehicles.com/drift-in-ebisu/', '¥9,000', false, 'drive', 'Powervehicles / Ebisu Circuit', 'manual'),

-- ============================================================
-- JAPAN - Sideways Experience Drift School (Ebisu)
-- ============================================================

('Sideways Experience - 7 Day Drift School April', NULL, '2026-04-16', '2026-04-22', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'beginner', 'The Sideways Experience 7-day all-inclusive drift school at Ebisu Circuit. Designed for beginners to intermediate drivers. Progresses from donuts and figure-8s to handbrake entries and linking courses. Includes accommodation, transport from Koriyama station, drift car hire, fuel, and instruction.', 'https://www.sidewaysx.com/', '¥180,000', false, 'drive', 'The Sideways Experience', 'manual'),

('Sideways Experience - 3 Day Drift School June', NULL, '2026-06-11', '2026-06-13', 'Nihonmatsu, Fukushima, Japan', 'JP', 'Ebisu Circuit', 37.6442, 140.3723, 'practice', false, 'unlimited', 'beginner', 'A 3-day intensive drift school at Ebisu Circuit run by SidewaysX. Novice curriculum for drivers with limited to no drifting experience. Cars provided include 1JZ Toyota Chasers, RX-8s, and 350Zs, all with roll cages and proper setup. Small group format with personal instruction.', 'https://www.sidewaysx.com/', '¥90,000', false, 'drive', 'The Sideways Experience', 'manual'),

-- ============================================================
-- JAPAN - Matenro Drift Racing (Tokyo / Chiba area)
-- Runs ongoing lessons at Minami Chiba Circuit near Tokyo
-- ============================================================

('Matenro Drift Lesson - Spring Sessions', NULL, '2026-04-04', NULL, 'Ichihara, Chiba, Japan', 'JP', 'Minami Chiba Circuit', 35.3420, 140.1380, 'practice', false, 'unlimited', 'beginner', 'Private and small-group drift lessons with OG pro instructors at Minami Chiba Circuit, 90 minutes from central Tokyo. Beginners start in MX-5 Miatas, progressing to RX-8, 350Z, or 180SX. Includes pickup from Tokyo. The original OG drift team from the Chiba/Tokyo area.', 'https://matenro-drift-racing.com/', '¥25,000', false, 'drive', 'Matenro Drift Racing', 'manual'),

('Matenro Drift Lesson - Summer Sessions', NULL, '2026-07-04', NULL, 'Ichihara, Chiba, Japan', 'JP', 'Minami Chiba Circuit', 35.3420, 140.1380, 'practice', false, 'unlimited', 'beginner', 'Summer drift lessons at Minami Chiba Circuit with Matenro Drift Racing. One-on-one coaching in English with experienced instructors. Transport from central Tokyo included. Unique police car chase experience at end of lesson. Book through their website or GetYourGuide.', 'https://matenro-drift-racing.com/', '¥25,000', false, 'drive', 'Matenro Drift Racing', 'manual'),

-- ============================================================
-- JAPAN - Nikko Circuit Additional Practice Days
-- ============================================================

('Nikko Circuit Drift Practice - April', NULL, '2026-04-19', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Spring drift practice at the iconic Nikko Circuit in Tochigi Prefecture. Where modern drift culture was born in the 1990s. A compact, technical track that rewards skill over power. 2 hours from Tokyo. Open to all - from OG street drifters to complete beginners.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

('Nikko Circuit Drift Practice - June', NULL, '2026-06-14', NULL, 'Utsunomiya, Tochigi, Japan', 'JP', 'Nikko Circuit', 36.6621, 139.8621, 'practice', false, 'unlimited', 'all', 'Early summer drift practice at Nikko Circuit. The legendary Tochigi venue that helped shape Japanese drift culture. Technical layout with tight hairpins and flowing sections. Popular with local drift teams and welcoming to visitors. Paddock vibe is friendly and authentic JDM.', NULL, '¥6,000', false, 'drive', 'Nikko Circuit', 'manual'),

-- ============================================================
-- JAPAN - Honjo Circuit (Saitama)
-- ============================================================

('Honjo Circuit Drift Practice - March', NULL, '2026-03-28', NULL, 'Honjo, Saitama, Japan', 'JP', 'Honjo Circuit', 36.1870, 139.1290, 'practice', false, 'unlimited', 'all', 'Drift practice at Honjo Circuit, a 1,112m mini circuit hidden in an old quarry in Saitama Prefecture. Stop-and-go layout with hairpins connected by short straights. Very accessible from Tokyo - approximately 2 hours drive. Friendly paddock atmosphere, great for first-timers.', 'https://en.activityjapan.com/publish/plan/8762', '¥5,000', false, 'drive', 'Honjo Circuit', 'manual'),

('Honjo Circuit Drift Practice - May', NULL, '2026-05-17', NULL, 'Honjo, Saitama, Japan', 'JP', 'Honjo Circuit', 36.1870, 139.1290, 'practice', false, 'unlimited', 'all', 'Weekend drift practice at Honjo Circuit in Saitama. A popular grassroots venue in the greater Tokyo area. The mini circuit layout is ideal for learning drift techniques. Spectators welcome. Regular events draw a mix of experienced locals and newcomers.', 'https://en.activityjapan.com/publish/plan/8762', '¥5,000', false, 'drive', 'Honjo Circuit', 'manual'),

-- ============================================================
-- JAPAN - Tsukuba Circuit (TC1000 Drift Practice)
-- ============================================================

('Tsukuba TC1000 Drift Practice - April', NULL, '2026-04-26', NULL, 'Shimotsuma, Ibaraki, Japan', 'JP', 'Tsukuba Circuit TC1000', 36.1510, 139.9195, 'practice', false, 'unlimited', 'all', 'Drift practice on Tsukuba Circuit''s TC1000 course. The shorter 1,000m course is ideal for drift practice with excellent visibility and safe runoff. Perfect for beginners and intermediate drivers looking to improve. Just 90 minutes from Tokyo.', 'https://www.tsukuba-circuit.jp/', '¥8,000', false, 'drive', 'Tsukuba Circuit', 'manual'),

-- ============================================================
-- JAPAN - Meihan Sportsland Additional Practice
-- ============================================================

('Meihan Sportsland Drift Practice - March', NULL, '2026-03-14', NULL, 'Yamazoe, Nara, Japan', 'JP', 'Meihan Sportsland', 34.6833, 136.0500, 'practice', false, 'unlimited', 'all', 'Early spring drift practice at Meihan Sportsland E-course. The famous tight figure-eight layout in Nara Prefecture is considered one of Japan''s best drift training grounds. Wall-ride sections and technical corners. A pilgrimage site for drift enthusiasts visiting the Kansai region.', 'http://web1.kcn.jp/meihansl/', '¥5,000', false, 'drive', 'Meihan Sportsland', 'manual'),

('Meihan Sportsland Drift Practice - June', NULL, '2026-06-21', NULL, 'Yamazoe, Nara, Japan', 'JP', 'Meihan Sportsland', 34.6833, 136.0500, 'practice', false, 'unlimited', 'all', 'Summer drift practice at Meihan Sportsland. The E-course layout with its wall-ride sections has produced some of Japan''s most skilled drifters. All skill levels welcome. Popular with the Osaka/Kansai drift community. Pay and drive all day format.', 'http://web1.kcn.jp/meihansl/', '¥5,000', false, 'drive', 'Meihan Sportsland', 'manual'),

-- ============================================================
-- JAPAN - Mobara Twin Circuit Additional Practice
-- ============================================================

('Mobara Twin Circuit Drift Practice - March', NULL, '2026-03-21', NULL, 'Mobara, Chiba, Japan', 'JP', 'Mobara Twin Circuit', 35.3818, 140.2813, 'practice', false, 'unlimited', 'all', 'Spring drift practice at Mobara Twin Circuit, the closest dedicated drift track to Tokyo at only 90 minutes away. The East Course features tight hairpins and technical sections. Very popular weekend venue for the Tokyo drift community.', NULL, '¥5,500', false, 'drive', 'Mobara Twin Circuit', 'manual'),

('Mobara Twin Circuit Drift Practice - August', NULL, '2026-08-15', NULL, 'Mobara, Chiba, Japan', 'JP', 'Mobara Twin Circuit', 35.3818, 140.2813, 'practice', false, 'unlimited', 'all', 'Obon holiday drift practice at Mobara Twin Circuit. Take advantage of the national holiday week to hit the track. Accessible from central Tokyo and a popular choice for summer drifting in the Kanto region. All skill levels welcome.', NULL, '¥5,500', false, 'drive', 'Mobara Twin Circuit', 'manual'),

-- ============================================================
-- JAPAN - Bihoku Highland Circuit
-- ============================================================

('Bihoku Highland Circuit Drift Practice - April', NULL, '2026-04-18', NULL, 'Niimi, Okayama, Japan', 'JP', 'Bihoku Highland Circuit', 34.9500, 133.4333, 'practice', false, 'unlimited', 'all', 'Drift practice at Bihoku Highland Circuit in Okayama Prefecture. A historic drift venue that hosted early D1GP rounds. Features elevation changes, slippery tarmac, and a famous dirt bank section. Two courses for drifting, grip, and gymkhana. Pay the entry fee and drift all day.', 'https://driftspots.com/japan/bihoku-highland-circuit/', '¥5,000', false, 'drive', 'Bihoku Highland Circuit', 'manual'),

-- ============================================================
-- JAPAN - Motorland Suzuka
-- ============================================================

('Motorland Suzuka Drift Practice - May', NULL, '2026-05-23', NULL, 'Suzuka, Mie, Japan', 'JP', 'Motorland Suzuka', 34.8500, 136.5300, 'practice', false, 'unlimited', 'all', 'Drift practice at Motorland Suzuka, a compact circuit near the famous Suzuka Circuit in Mie Prefecture. Sessions run in 2 x 3-hour blocks (9:00-12:00 and 13:00-16:00). Booking required. Popular with Kansai and Tokai region drifters.', 'https://k-dori.com/motorland-suzuka', '¥6,000', false, 'drive', 'Motorland Suzuka', 'manual'),

-- ============================================================
-- JAPAN - Nihonkai Maze Circuit
-- ============================================================

('Nihonkai Maze Circuit Drift Practice - June', NULL, '2026-06-28', NULL, 'Tainai, Niigata, Japan', 'JP', 'Nihonkai Maze Circuit', 38.0667, 139.4333, 'practice', false, 'unlimited', 'all', 'Drift practice at Nihonkai Maze Circuit, one of Japan''s most atmospheric coastal tracks near the Sea of Japan. A classic grassroots venue in Niigata Prefecture with a raw, authentic feel. Technical layout popular with the Niigata and Tohoku drift communities.', 'https://driftspots.com/japan/nihonkai-maze-circuit/', '¥5,000', false, 'drive', 'Nihonkai Maze Circuit', 'manual'),

-- ============================================================
-- AUSTRALIA - Australian Drift Club (Sydney Motorsport Park)
-- ============================================================

('SMSP Drift Matsuri 2026', NULL, '2026-03-21', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park - South Circuit', -33.8025, 150.8690, 'grassroots', false, 'unlimited', 'intermediate', 'South Circuit DRIFT Matsuri at Sydney Motorsport Park under lights from 6:30pm to 10:30pm. The Australian Drift Club''s signature festival event. Advanced drivers pushing limits on the South Circuit. Big spectator turnout with food trucks and drift culture atmosphere.', 'https://www.australiandriftclub.com.au/events-list/', 'A$220', true, 'both', 'Australian Drift Club', 'manual'),

('ADC Drift Day - April 6', NULL, '2026-04-06', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'all', 'Drift practice day at Sydney Motorsport Park run by the Australian Drift Club. Open to all skill levels with plenty of track time. SMSP is Australia''s premier motorsport facility with excellent safety infrastructure. Evening session under lights.', 'https://www.australiandriftclub.com.au/events-list/', 'A$180', false, 'drive', 'Australian Drift Club', 'manual'),

('ADC Drift Day - April 19', NULL, '2026-04-19', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'all', 'Another ADC drift practice evening at Sydney Motorsport Park. The Australian Drift Club provides a welcoming community for newcomers and experienced drifters alike. Regular events ensure consistent seat time for development.', 'https://www.australiandriftclub.com.au/events-list/', 'A$180', false, 'drive', 'Australian Drift Club', 'manual'),

('ADC Drift Day - May 10', NULL, '2026-05-10', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'all', 'May drift practice at Sydney Motorsport Park with the Australian Drift Club. Running on the drift-configured portion of the circuit. Great community atmosphere with experienced drivers happy to share tips with beginners.', 'https://www.australiandriftclub.com.au/events-list/', 'A$180', false, 'drive', 'Australian Drift Club', 'manual'),

-- ============================================================
-- AUSTRALIA - Drift School Australia (Sydney)
-- ============================================================

('Drift School Australia - Beginner Class', NULL, '2026-04-11', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'beginner', 'Drift School Australia beginner class at Sydney Motorsport Park. Learn to drift in highly modified drift cars with professional instructors. No experience required - cars, helmets, and instruction all provided. Perfect introduction to drifting in a safe environment.', 'https://driftschoolaustralia.com.au/', 'A$299', false, 'drive', 'Drift School Australia', 'manual'),

('Drift School Australia - Masterclass', NULL, '2026-06-13', NULL, 'Eastern Creek, NSW, Australia', 'AU', 'Sydney Motorsport Park', -33.8025, 150.8690, 'practice', false, 'unlimited', 'intermediate', 'Drift School Australia Masterclass at Sydney Motorsport Park. For drivers who have completed the beginner class or have drift experience. Advanced techniques including transitions, tandem basics, and line precision. School-provided cars and instruction included.', 'https://driftschoolaustralia.com.au/', 'A$399', false, 'drive', 'Drift School Australia', 'manual'),

-- ============================================================
-- AUSTRALIA - Queensland Raceway Drift Events
-- ============================================================

('QR Friday Night Drift - March', NULL, '2026-03-13', NULL, 'Willowbank, Queensland, Australia', 'AU', 'Queensland Raceway', -27.6875, 152.6515, 'grassroots', false, 'unlimited', 'intermediate', 'Friday Night Drift at Queensland Raceway. Gates open 4pm, briefing at 5pm, track hot 5:30pm to 10pm. Extended start lines allow for faster entries. Drivers must hold a QR drift qualification or obtain one on the day. Spectators welcome. The famous QR atmosphere under lights.', 'https://www.qldraceways.com.au/events-at-queensland-raceway/drifting', 'A$150', false, 'both', 'Queensland Raceway', 'manual'),

('QR Friday Night Drift - May', NULL, '2026-05-08', NULL, 'Willowbank, Queensland, Australia', 'AU', 'Queensland Raceway', -27.6875, 152.6515, 'grassroots', false, 'unlimited', 'intermediate', 'Friday Night Drift at Queensland Raceway. Monthly evening drift session from 5pm to 10pm. The Drift Playground section is available for amateur drivers without a drift qualification. Experienced drifters take on the main track layout.', 'https://www.qldraceways.com.au/events-at-queensland-raceway/drifting', 'A$150', false, 'both', 'Queensland Raceway', 'manual'),

('QR Morning Drift Session - July', NULL, '2026-07-11', NULL, 'Willowbank, Queensland, Australia', 'AU', 'Queensland Raceway', -27.6875, 152.6515, 'practice', false, 'unlimited', 'all', 'Morning drift session at Queensland Raceway from 7:45am to 12 noon. A less intense alternative to the Friday Night Drifts, ideal for newer drivers. The Drift Playground area caters to beginners while the main track suits experienced drifters.', 'https://www.qldraceways.com.au/events-at-queensland-raceway/drifting', 'A$120', false, 'drive', 'Queensland Raceway', 'manual'),

-- ============================================================
-- AUSTRALIA - Drift School WA (Perth)
-- ============================================================

('Drift School WA - Experience Day April', NULL, '2026-04-18', NULL, 'Balcatta, Western Australia', 'AU', 'CarCo Raceway', -31.8500, 115.8300, 'practice', false, 'unlimited', 'beginner', 'Drift School WA experience day at CarCo Raceway in Perth. Australia''s premier drift school offering coaching from expert instructors. Range of packages from Drift Xperience joyrides to full hands-on coaching. Cars and instruction provided.', 'https://driftschoolwa.com/', 'A$249', false, 'drive', 'Drift School WA', 'manual'),

('Drift School WA - Experience Day July', NULL, '2026-07-25', NULL, 'Balcatta, Western Australia', 'AU', 'CarCo Raceway', -31.8500, 115.8300, 'practice', false, 'unlimited', 'beginner', 'Winter drift school session at CarCo Raceway with Drift School WA. Based at CarCo since 2016, offering the ultimate drifting experience in Western Australia. Perfect for beginners wanting to learn the fundamentals or for a unique experience gift.', 'https://driftschoolwa.com/', 'A$249', false, 'drive', 'Drift School WA', 'manual'),

-- ============================================================
-- AUSTRALIA - Marulan / Pheasant Wood Circuit (NSW)
-- ============================================================

('Pheasant Wood Drift Day - May', NULL, '2026-05-16', NULL, 'Marulan, NSW, Australia', 'AU', 'Pheasant Wood Circuit', -34.6833, 150.0167, 'practice', false, 'unlimited', 'all', 'Drift practice day at Pheasant Wood Circuit (formerly Marulan Driver Training Centre), 90 minutes south of Sydney. A closed circuit facility purpose-built for driver training with good runoff areas. Excellent venue for intermediate drivers to build confidence.', 'https://pheasantwood.com.au/', 'A$150', false, 'drive', 'Pheasant Wood Circuit', 'manual'),

-- ============================================================
-- NEW ZEALAND - Drift Academy (Hampton Downs)
-- Monthly sessions running on the last Saturday of each month
-- ============================================================

('Drift Academy NZ - March Session', NULL, '2026-03-28', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'practice', false, 'unlimited', 'beginner', 'Monthly Drift Academy session at Hampton Downs. Choose from Drift 101 for first-timers, Drift Master for intermediate skills, or Drift Elite for 1-on-1 advanced coaching. All courses include drift car hire, instruction, and helmets. New Zealand''s premier drift training program.', 'https://www.driftacademy.co.nz/', 'NZ$299', false, 'drive', 'Drift Academy International', 'manual'),

('Drift Academy NZ - May Session', NULL, '2026-05-23', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'practice', false, 'unlimited', 'beginner', 'May Drift Academy at Hampton Downs. Drift 101 covers the fundamental techniques to get you sliding. Drift Master adds advanced techniques like transitions and tandem setups. Equipment and cars provided - just bring your enthusiasm.', 'https://www.driftacademy.co.nz/', 'NZ$299', false, 'drive', 'Drift Academy International', 'manual'),

('Drift Academy NZ - July Session', NULL, '2026-07-18', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'practice', false, 'unlimited', 'beginner', 'Winter Drift Academy session at Hampton Downs. The cooler conditions can make for exciting sideways action. All three program tiers available. Perfect gift experience or way to try drifting for the first time in a controlled environment.', 'https://www.driftacademy.co.nz/', 'NZ$299', false, 'drive', 'Drift Academy International', 'manual'),

-- ============================================================
-- NEW ZEALAND - Mad Mike Drift Force (Hampton Downs)
-- Monthly grassroots drift practice events
-- ============================================================

('Mad Mike Drift Force - April', NULL, '2026-04-19', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'grassroots', false, 'unlimited', 'all', 'Mad Mike Drift Force at Hampton Downs. Monthly grassroots practice for all levels of drifting. Gates/tech inspection from 7:30am, drivers briefing at 9:00am. Sessions cycle through classes in both regular and reverse direction. Open track from 4pm to 5pm. Non-competitive fun environment.', 'https://www.madmike.co.nz/pages/drift-force', 'NZ$180', false, 'drive', 'Mad Mike Motorsport', 'manual'),

('Mad Mike Drift Force - June', NULL, '2026-06-15', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'grassroots', false, 'unlimited', 'all', 'Mad Mike Drift Force at Hampton Downs. Run by Mad Mike Whiddett to make drifting and top-level circuits more accessible to grassroots drivers. The only opportunity to drift the Hampton Downs club circuit extension in reverse configuration. All levels welcome.', 'https://www.madmike.co.nz/pages/drift-force', 'NZ$180', false, 'drive', 'Mad Mike Motorsport', 'manual'),

('Mad Mike Drift Force - August', NULL, '2026-08-16', NULL, 'Meremere, Waikato, New Zealand', 'NZ', 'Hampton Downs Motorsport Park', -37.5431, 175.1289, 'grassroots', false, 'unlimited', 'all', 'August Mad Mike Drift Force at Hampton Downs. Cycling class-based sessions from 9:20am to 4pm with lunch break. A key stepping stone for New Zealand''s up-and-coming drift stars. Supportive community atmosphere run by one of NZ''s most famous drifters.', 'https://www.madmike.co.nz/pages/drift-force', 'NZ$180', false, 'drive', 'Mad Mike Motorsport', 'manual'),

-- ============================================================
-- NEW ZEALAND - Taupo Drift
-- ============================================================

('Taupo Drift - April', NULL, '2026-04-04', NULL, 'Taupo, Waikato, New Zealand', 'NZ', 'Taupo Motorsport Park', -38.7167, 176.0833, 'practice', false, 'unlimited', 'all', 'Taupo Drift grassroots day at Taupo Motorsport Park. 5 x 20-minute sessions on track in a safe, controlled environment designed for drifters of all levels. RWD cars only. Minimum NZ restricted licence required. Bookings essential by 4pm the day prior.', 'https://www.taupomp.co.nz/events/taupo-drift', 'NZ$250', false, 'drive', 'Taupo Motorsport Park', 'manual'),

('Taupo Drift - June', NULL, '2026-06-06', NULL, 'Taupo, Waikato, New Zealand', 'NZ', 'Taupo Motorsport Park', -38.7167, 176.0833, 'practice', false, 'unlimited', 'all', 'Winter Taupo Drift day at Taupo Motorsport Park. Grassroots practice for all skill levels with structured 20-minute sessions. The central North Island location makes it accessible from both Auckland and Wellington. RWD only - no FWD or AWD.', 'https://www.taupomp.co.nz/events/taupo-drift', 'NZ$250', false, 'drive', 'Taupo Motorsport Park', 'manual'),

-- ============================================================
-- NEW ZEALAND - Manfeild Circuit Drift Tutoring
-- ============================================================

('Manfeild Drift Tutoring - April', NULL, '2026-04-11', NULL, 'Feilding, Manawatu, New Zealand', 'NZ', 'Manfeild Circuit Chris Amon', -40.2333, 175.5667, 'practice', false, 'unlimited', 'beginner', 'Drift tutoring at Manfeild Circuit Chris Amon run by the Manawatu Car Club. Specialist tuition from experienced drifters on the 1.2km Backtrack. Skill courses rotate through different stations throughout the day. Entry-level event perfect for learning car control fundamentals.', 'https://www.manawatucarclub.org.nz/events/drifting', 'NZ$120', false, 'drive', 'Manawatu Car Club', 'manual'),

('Manfeild Drift Tutoring - June', NULL, '2026-06-20', NULL, 'Feilding, Manawatu, New Zealand', 'NZ', 'Manfeild Circuit Chris Amon', -40.2333, 175.5667, 'practice', false, 'unlimited', 'beginner', 'Winter drift tutoring session at Manfeild. The Manawatu Car Club offers a progression path from basic cone-work tutoring through open-section practice to grassroots competition. Vehicles must be in roadworthy condition. Drivers bring their own car and safety gear.', 'https://www.manawatucarclub.org.nz/events/drifting', 'NZ$120', false, 'drive', 'Manawatu Car Club', 'manual'),

-- ============================================================
-- MIDDLE EAST - Yas Marina Circuit Drift Nights (Abu Dhabi)
-- ============================================================

('Yas Drift Night - April', NULL, '2026-04-11', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'practice', false, 'unlimited', 'all', 'Yas Drift Night at Yas Marina Circuit. A 4-hour session on the dedicated drift track where participants can spin, slide, and sharpen their skills. Bring your own car or rent one on-site. Open to all skill levels from complete beginners to experienced drifters.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-night', 'AED 350', false, 'drive', 'Yas Marina Circuit', 'manual'),

('Yas Drift Night - May', NULL, '2026-05-09', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'practice', false, 'unlimited', 'all', 'Monthly Yas Drift Night at Yas Marina Circuit. Evening session on the purpose-built drift layout adjacent to the F1 Grand Prix track. Professional marshalling and safety. One of the most prestigious drift practice venues in the Middle East.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-night', 'AED 350', false, 'drive', 'Yas Marina Circuit', 'manual'),

('Yas Drift Night - June', NULL, '2026-06-13', NULL, 'Abu Dhabi, UAE', 'AE', 'Yas Marina Circuit', 24.4670, 54.6018, 'practice', false, 'unlimited', 'all', 'Summer Yas Drift Night at Yas Marina Circuit. Evening sessions ideal for beating the Gulf summer heat. The floodlit drift track offers excellent conditions for practice and fun. Rental cars available for those without their own drift machine.', 'https://www.yasmarinacircuit.com/en/openyas/yas-drift-night', 'AED 350', false, 'drive', 'Yas Marina Circuit', 'manual'),

-- ============================================================
-- MIDDLE EAST - Dubai Autodrome Drift DXB
-- ============================================================

('Drift DXB - March', NULL, '2026-03-12', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'all', 'Drift DXB night session at Dubai Autodrome on the custom drift layout on the Oval Circuit. Running 8pm to midnight with separate Novice and Advanced groups. Bring your own car and drift under the Dubai night sky. One of the Gulf''s most popular regular drift sessions.', 'https://dubaiautodrome.ae/open-track-days/drift-dxb/', 'AED 300', false, 'drive', 'Dubai Autodrome', 'manual'),

('Drift DXB - April', NULL, '2026-04-09', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'all', 'Monthly Drift DXB at Dubai Autodrome. Night-time drifting on the 2.46km Club Circuit drift configuration. Novice and Advanced groups ensure appropriate skill matching. Online pre-booking required. Part of Dubai Autodrome''s packed motorsport calendar.', 'https://dubaiautodrome.ae/open-track-days/drift-dxb/', 'AED 300', false, 'drive', 'Dubai Autodrome', 'manual'),

('DX Drift Training - Intermediate Course', NULL, '2026-03-15', NULL, 'Dubai, UAE', 'AE', 'Dubai Autodrome', 25.0502, 55.2391, 'practice', false, 'unlimited', 'intermediate', 'Intermediate drift training course at Dubai Autodrome operated by DX Drift. Intensive skills development for drivers who have mastered the basics. Professional instruction on advanced techniques including transitions and tandem preparation. Cars and equipment provided.', 'https://grandeturismo.com/events/intermediate-drift-training-course-intensive-skills', 'AED 800', false, 'drive', 'DX Drift', 'manual'),

-- ============================================================
-- MIDDLE EAST - Bahrain International Circuit
-- ============================================================

('Ebrahim K Kanoo Drag & Drift Night - March', NULL, '2026-03-02', NULL, 'Sakhir, Bahrain', 'BH', 'Bahrain International Circuit', 26.0325, 50.5106, 'grassroots', false, 'unlimited', 'all', 'Ebrahim K Kanoo Drag and Drift Night at Bahrain International Circuit. Running from 5pm to 11pm, participants can bring their own vehicle for drag racing or drifting. A unique opportunity to drift on the same facility that hosts the F1 Bahrain Grand Prix. Recurring monthly event.', 'https://www.bahraingp.com/blog/experiences/ebrahim-k-kanoo-drag-and-drift-nights/', 'BHD 15', false, 'drive', 'Bahrain International Circuit', 'manual'),

('Ebrahim K Kanoo Drag & Drift Night - May', NULL, '2026-05-04', NULL, 'Sakhir, Bahrain', 'BH', 'Bahrain International Circuit', 26.0325, 50.5106, 'grassroots', false, 'unlimited', 'all', 'Monthly Drag & Drift Night at BIC. Bring your own car and experience drifting at the world-class Bahrain International Circuit. Evening sessions keep temperatures comfortable. Popular with the Gulf drift community. Registration through BIC website or hotline.', 'https://www.bahraingp.com/blog/experiences/ebrahim-k-kanoo-drag-and-drift-nights/', 'BHD 15', false, 'drive', 'Bahrain International Circuit', 'manual');
