-- ============================================================
-- USA / North America Drift Events: March - August 2026
-- Run in Supabase SQL Editor AFTER events-migration.sql
-- ============================================================

insert into public.events (name, series, date, end_date, location, country, track, lat, lng, category, cage_required, tire_size, skill_level, description, event_url, price, is_hot, participation, organizer, source) values

-- ============================================================
-- FORMULA DRIFT PRO CHAMPIONSHIP 2026 (Rounds within Mar-Aug)
-- NOTE: Rd.1 Long Beach and Rd.2 Road Atlanta already in events-migration.sql
-- ============================================================
('Formula Drift Rd.3 - Scorched', 'Formula Drift', '2026-05-29', '2026-05-30', 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'official', true, 'unlimited', 'advanced', 'Formula Drift Round 3 heads to Orlando Speed World for the annual Scorched event. Florida heat makes for intense competition and huge tire smoke. One of the most spectator-friendly venues on the calendar.', 'https://www.formulad.com/schedule/2026/orlando', '$50', true, 'watch', 'Formula Drift', 'manual'),

('Formula Drift Rd.4 - Battle at the Springs', 'Formula Drift', '2026-06-18', '2026-06-20', 'Stafford Springs, Connecticut', 'US', 'Stafford Motor Speedway', 41.9854, -72.2787, 'official', true, 'unlimited', 'advanced', 'Brand new venue for 2026! Formula Drift heads to Stafford Motor Speedway in Connecticut. The historic half-mile oval brings FD to the Northeast for the first time. Also hosts PROSPEC Round 2.', 'https://www.formulad.com/schedule/2026/stafford', '$55', true, 'watch', 'Formula Drift', 'manual'),

('Formula Drift Rd.5 - Midwest Mayhem', 'Formula Drift', '2026-07-30', '2026-08-01', 'Indianapolis, Indiana', 'US', 'Lucas Oil Indianapolis Raceway Park', 39.6933, -86.3444, 'official', true, 'unlimited', 'advanced', 'Another brand new venue for 2026! Formula Drift arrives at Indianapolis Raceway Park, a facility steeped in American racing history since 1960. Features both PRO and PROSPEC championships on the IRP oval.', 'https://www.formulad.com/schedule/2026/indianapolis', '$55', true, 'watch', 'Formula Drift', 'manual'),

('Formula Drift Rd.6 - Throwdown', 'Formula Drift', '2026-08-21', '2026-08-22', 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'official', true, 'unlimited', 'advanced', 'Formula Drift returns to Evergreen Speedway for the annual Throwdown. The Pacific Northwest fan base creates one of the loudest, most energetic atmospheres on the FD calendar.', 'https://www.formulad.com/schedule/2026/seattle', '$50', true, 'watch', 'Formula Drift', 'manual'),

-- ============================================================
-- FORMULA DRIFT PROSPEC 2026 (within Mar-Aug window)
-- ============================================================
('Formula Drift PROSPEC Rd.1 - Road Atlanta', 'Formula Drift PROSPEC', '2026-05-07', '2026-05-09', 'Braselton, Georgia', 'US', 'Michelin Raceway Road Atlanta', 34.1413, -83.8173, 'official', true, 'unlimited', 'advanced', 'The 2026 Link ECU PROSPEC Championship kicks off at Road Atlanta alongside the PRO event. Up-and-coming drivers battle for a chance at the pro ranks. Three-day weekend of non-stop drifting.', 'https://www.formulad.com/schedule/2026/atlanta', '$50', false, 'watch', 'Formula Drift', 'manual'),

('Formula Drift PROSPEC Rd.2 - Stafford Springs', 'Formula Drift PROSPEC', '2026-06-18', '2026-06-20', 'Stafford Springs, Connecticut', 'US', 'Stafford Motor Speedway', 41.9854, -72.2787, 'official', true, 'unlimited', 'advanced', 'PROSPEC Round 2 at the brand-new Stafford Motor Speedway venue. The next generation of Formula Drift drivers compete on the half-mile oval alongside the PRO championship.', 'https://www.formulad.com/schedule/2026/stafford', '$55', false, 'watch', 'Formula Drift', 'manual'),

('Formula Drift PROSPEC Rd.3 - Indianapolis', 'Formula Drift PROSPEC', '2026-07-30', '2026-08-01', 'Indianapolis, Indiana', 'US', 'Lucas Oil Indianapolis Raceway Park', 39.6933, -86.3444, 'official', true, 'unlimited', 'advanced', 'PROSPEC Round 3 at Indianapolis Raceway Park. The PROSPEC drivers bring the heat to the Midwest as they chase championship points alongside the PRO event.', 'https://www.formulad.com/schedule/2026/indianapolis', '$55', false, 'watch', 'Formula Drift', 'manual'),

-- ============================================================
-- GRIDLIFE 2026 (within Mar-Aug window)
-- ============================================================
('Gridlife South Carolina', 'Gridlife', '2026-04-17', '2026-04-19', 'Kershaw, South Carolina', 'US', 'Carolina Motorsports Park', 34.5486, -80.5800, 'grassroots', false, 'unlimited', 'all', 'Gridlife kicks off 2026 at Carolina Motorsports Park. Three days of wheel-to-wheel racing, time attack, full-course drifting, skidpad sessions, car show, and live music. GRIDLIFE Drift features guest pro drivers.', 'https://www.grid.life/south-carolina', '$60', false, 'both', 'Gridlife', 'manual'),

('Gridlife Special Stage ATL', 'Gridlife', '2026-05-07', '2026-05-09', 'Braselton, Georgia', 'US', 'Michelin Raceway Road Atlanta', 34.1413, -83.8173, 'grassroots', false, 'unlimited', 'all', 'Gridlife returns to Road Atlanta for Special Stage ATL, a collaborative weekend experience with Formula Drift. Two sanctioning bodies unite for nonstop motorsport action featuring drift, time attack, and car culture in the heart of the Southeast.', 'https://www.grid.life/events', '$60', true, 'both', 'Gridlife', 'manual'),

('Gridlife Midwest Festival', 'Gridlife', '2026-06-12', '2026-06-14', 'South Haven, Michigan', 'US', 'GingerMan Raceway', 42.3478, -86.3250, 'grassroots', false, 'unlimited', 'all', 'The flagship Gridlife Midwest Festival at GingerMan Raceway. Three days of motorsport and music, featuring drifting, racing, time attack, a massive car show, and headlining DJ sets from Crankdat and Tape B. A bucket-list event for car enthusiasts.', 'https://www.grid.life/midwest-festival', '$75', true, 'both', 'Gridlife', 'manual'),

('Gridlife Summer Apex', 'Gridlife', '2026-07-24', '2026-07-26', 'Watkins Glen, New York', 'US', 'Watkins Glen International', 42.3369, -76.9273, 'grassroots', false, 'unlimited', 'all', 'Gridlife returns to the legendary Watkins Glen International for Summer Apex 2026. Full-scale festival with drift exhibitions, road racing, time attack, car culture, and live music at one of America''s most iconic racetracks.', 'https://www.grid.life/events', '$75', true, 'both', 'Gridlife', 'manual'),

('Gridlife Circuit Legends', 'Gridlife', '2026-08-21', '2026-08-23', 'Lakeville, Connecticut', 'US', 'Lime Rock Park', 41.9283, -73.3833, 'grassroots', false, 'unlimited', 'all', 'Gridlife Circuit Legends at the historic Lime Rock Park in Connecticut. Drift exhibitions, road racing, and time attack at one of New England''s most scenic and beloved racetracks. Music and car show round out the weekend.', 'https://www.grid.life/events', '$65', false, 'both', 'Gridlife', 'manual'),

-- ============================================================
-- LZ WORLD TOUR 2026
-- ============================================================
('LZ World Tour - Englishtown', 'LZ World Tour', '2026-04-18', '2026-04-19', 'Englishtown, New Jersey', 'US', 'Old Bridge Township Raceway Park', 40.3310, -74.3340, 'proam', true, 'unlimited', 'advanced', 'Adam LZ brings the LZ World Tour to the legendary E-Town Raceway Park. Two days of elite drifting and car culture, featuring door-to-door battles on the stadium-style layout. Last Chance Top 16 format with the top 13 straight into the Day 2 Main Show.', 'https://www.lzworldtour.com/events/englishtown-2026/', '$45', true, 'watch', 'LZ World Tour / LZMFG', 'manual'),

-- ============================================================
-- KLUTCH KICKERS $100K DRIFT SERIES 2026 (Season 3)
-- ============================================================
('Klutch Kickers 100K Series Rd.1', 'Klutch Kickers', '2026-04-29', '2026-05-01', 'Bradenton, Florida', 'US', 'Freedom Factory', 27.4350, -82.5550, 'proam', true, 'unlimited', 'advanced', 'Season 3 of the Klutch Kickers $100K Drift Series kicks off at the World Famous Freedom Factory. 80 drivers battle for the chance to win $20,000 per round and the shot at becoming the champion. The largest payout drift series in the US.', 'https://www.klutchkickers.com', '$40', true, 'watch', 'Klutch Kickers', 'manual'),

('Klutch Kickers 100K Series Rd.2', 'Klutch Kickers', '2026-06-24', '2026-06-26', 'Bradenton, Florida', 'US', 'Freedom Factory', 27.4350, -82.5550, 'proam', true, 'unlimited', 'advanced', 'Round 2 of the Klutch Kickers $100K Drift Series at Freedom Factory. 80 of drifting''s finest compete for the $20,000 round prize. Intense tandem battles under the Florida sun.', 'https://www.klutchkickers.com', '$40', false, 'watch', 'Klutch Kickers', 'manual'),

('Klutch Kickers 100K Series Rd.3', 'Klutch Kickers', '2026-08-12', '2026-08-14', 'Bradenton, Florida', 'US', 'Freedom Factory', 27.4350, -82.5550, 'proam', true, 'unlimited', 'advanced', 'Round 3 of the Klutch Kickers $100K Drift Series at Freedom Factory. Championship points tighten as the season heats up. $20,000 round prize on the line.', 'https://www.klutchkickers.com', '$40', false, 'watch', 'Klutch Kickers', 'manual'),

-- ============================================================
-- DRIFTCON 2026 (Pacific Northwest - Evergreen Speedway)
-- ============================================================
('DriftCon Season Opener - Big Bounty Tournament', 'DriftCon', '2026-04-11', NULL, 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'proam', false, 'unlimited', 'all', 'DriftCon kicks off 2026 with the Big Bounty Tournament at Evergreen Speedway. 64-driver competition bracket, car show, vendors, and beer garden. One of the Pacific Northwest''s premiere grassroots drift events since 2014.', 'https://www.driftcon.us', '$30', false, 'both', 'DriftCon', 'manual'),

-- ============================================================
-- FINAL BOUT 2026 SPECIAL STAGE EVENTS
-- ============================================================
('Final Bout Special Stage East', 'Final Bout', '2026-05-02', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point Motorsports Park', 39.2313, -77.9703, 'grassroots', false, 'unlimited', 'intermediate', 'Final Bout Special Stage East at Summit Point. Teams of three or more cars compete in tandem drifting judged equally on driving ability and vehicle style. Top teams earn invitations to the Summit championship event. A cornerstone of American drift culture.', 'https://www.final-bout.com/pages/fb2026', '$150', true, 'both', 'Final Bout', 'manual'),

('Final Bout Special Stage Central', 'Final Bout', '2026-06-20', NULL, 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'grassroots', false, 'unlimited', 'intermediate', 'Final Bout Special Stage Central at USAIR Motorsports Raceway. Team-based tandem drifting competition where driving (50%) and car style (50%) are equally weighted. Winners advance to the Final Bout 9 Summit championship.', 'https://www.final-bout.com/pages/fb2026', '$150', false, 'both', 'Final Bout', 'manual'),

-- ============================================================
-- LONE STAR DRIFT 2026 (Texas)
-- ============================================================
('Lone Star Drift - Import Face-Off Demo', 'Lone Star Drift', '2026-03-01', NULL, 'Houston, Texas', 'US', 'Houston Motorsports Park', 29.6683, -95.1621, 'grassroots', false, 'unlimited', 'all', 'Lone Star Drift drifting demo and paid ride-alongs at the Import Face-Off event at Houston Motorsports Park. Great opportunity to experience drifting first-hand or watch the action up close.', 'https://lonestardrift.com', '$150', false, 'both', 'Lone Star Drift', 'manual'),

('Lone Star Bash', 'Lone Star Drift', '2026-03-20', '2026-03-22', 'College Station, Texas', 'US', 'CAMS Training Facility', 30.5775, -96.3025, 'grassroots', false, 'unlimited', 'all', 'The Lone Star Bash is a 3-day drift party at the CAMS Training Facility. Open track time, tandem sessions, and an incredible atmosphere. One of Texas'' most loved grassroots drift events with limited spots available.', 'https://lonestardrift.com', '$250', true, 'drive', 'Lone Star Drift', 'manual'),

-- ============================================================
-- HYPERFEST 2026 (Virginia)
-- ============================================================
('HyperFest 2026', NULL, '2026-05-15', '2026-05-17', 'Alton, Virginia', 'US', 'Virginia International Raceway', 36.5667, -79.2072, 'grassroots', false, 'unlimited', 'all', 'HyperFest celebrates its 25th anniversary as the largest automotive festival on the East Coast. Three days of NASA road racing, US Drift on the Patriot Course, off-road, rally, live music, camping, and drift ride-alongs. Over 15,000 spectators annually. Title partnered by Haltech.', 'https://www.hyper-fest.com/', '$50', true, 'both', 'NASA / HyperFest', 'manual'),

-- ============================================================
-- IMPORT FACE-OFF 2026 (events with drift components, Mar-Aug)
-- ============================================================
('Import Face-Off - Houston', 'Import Face-Off', '2026-03-01', NULL, 'Houston, Texas', 'US', 'Houston Motorsports Park', 29.6683, -95.1621, 'grassroots', false, 'unlimited', 'all', 'Import Face-Off comes to Houston Motorsports Park featuring drag racing, car show, and Lone Star Drift drifting exhibitions and ride-alongs. A celebration of import car culture.', 'https://importfaceoff.net/schedule-and-times', '$25', false, 'both', 'Import Face-Off', 'manual'),

('Import Face-Off - Ennis', 'Import Face-Off', '2026-03-08', NULL, 'Ennis, Texas', 'US', 'Texas Motorplex', 32.2768, -96.6544, 'grassroots', false, 'unlimited', 'all', 'Import Face-Off at the legendary Texas Motorplex in Ennis. Drag racing, car show, and vendor village. One of the premier import automotive events in the DFW area.', 'https://importfaceoff.net/schedule-and-times', '$25', false, 'both', 'Import Face-Off', 'manual'),

('Import Face-Off - Noble', 'Import Face-Off', '2026-03-15', NULL, 'Noble, Oklahoma', 'US', 'Thunder Valley Raceway', 35.1206, -97.3486, 'grassroots', false, 'unlimited', 'all', 'Import Face-Off heads to Thunder Valley Raceway in Oklahoma. Drag racing competitions, car show, and import culture gathering.', 'https://importfaceoff.net/schedule-and-times', '$25', false, 'both', 'Import Face-Off', 'manual'),

('Import Face-Off - Rockingham', 'Import Face-Off', '2026-03-29', NULL, 'Rockingham, North Carolina', 'US', 'Rockingham Dragway', 34.9283, -79.7442, 'grassroots', false, 'unlimited', 'all', 'Import Face-Off at Rockingham Dragway in North Carolina. Drag racing, car show, and import automotive culture. Great spectator atmosphere.', 'https://importfaceoff.net/schedule-and-times', '$25', false, 'both', 'Import Face-Off', 'manual'),

('Import Face-Off - Madison', 'Import Face-Off', '2026-04-12', NULL, 'Madison, Illinois', 'US', 'World Wide Technology Raceway', 38.6394, -90.1333, 'grassroots', false, 'unlimited', 'all', 'Import Face-Off at World Wide Technology Raceway near St. Louis. Full day of drag racing, car shows, and vendor village at one of the Midwest''s top racing facilities.', 'https://importfaceoff.net/schedule-and-times', '$25', false, 'both', 'Import Face-Off', 'manual'),

('Import Face-Off - Kent', 'Import Face-Off', '2026-04-26', NULL, 'Kent, Washington', 'US', 'Pacific Raceways', 47.3228, -122.1592, 'grassroots', false, 'unlimited', 'all', 'Import Face-Off at Pacific Raceways in Kent, WA. The Pacific Northwest stop on the IFO tour bringing drag racing and import car culture to the Seattle area.', 'https://importfaceoff.net/schedule-and-times', '$25', false, 'both', 'Import Face-Off', 'manual'),

('Import Face-Off - Joliet', 'Import Face-Off', '2026-05-31', NULL, 'Joliet, Illinois', 'US', 'Route 66 Raceway', 41.5181, -88.0625, 'grassroots', false, 'unlimited', 'all', 'Import Face-Off at Route 66 Raceway in Joliet, IL. A full day of import drag racing, car shows, and automotive culture near Chicago.', 'https://importfaceoff.net/schedule-and-times', '$25', false, 'both', 'Import Face-Off', 'manual'),

('Import Face-Off - Concord', 'Import Face-Off', '2026-08-08', NULL, 'Concord, North Carolina', 'US', 'zMAX Dragway', 35.3533, -80.6889, 'grassroots', false, 'unlimited', 'all', 'Import Face-Off at zMAX Dragway near Charlotte, NC. One of the premier drag racing and import car culture events on the East Coast at a world-class facility.', 'https://importfaceoff.net/schedule-and-times', '$25', false, 'both', 'Import Face-Off', 'manual'),

-- ============================================================
-- USAIR MOTORSPORTS RACEWAY 2026 DRIFT EVENTS (Wisconsin)
-- ============================================================
('ClubFR Drift Day 108', 'ClubFR', '2026-04-18', '2026-04-19', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'practice', false, 'unlimited', 'all', 'ClubFR Drift Day 108 at USAIR Motorsports Raceway. Two full days of open drifting on one of the Midwest''s best dedicated drift facilities, with its flowing course featuring elevation changes and banked turns.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$175', false, 'drive', 'ClubFR', 'manual'),

('USAIR Drift Games', NULL, '2026-05-09', '2026-05-10', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'grassroots', false, 'unlimited', 'all', 'USAIR Drift Games: a weekend of competitive drift events at USAIR Motorsports Raceway. Fun format competition with tandem battles and solo qualifying on the full course.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$175', false, 'both', 'USAIR Motorsports', 'manual'),

('ClubFR JAM', 'ClubFR', '2026-05-23', '2026-05-24', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'practice', false, 'unlimited', 'all', 'ClubFR JAM at USAIR Motorsports Raceway. Two days of open drift practice and tandem sessions with a festival atmosphere. One of the most popular grassroots drift weekends in the Midwest.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$175', false, 'drive', 'ClubFR', 'manual'),

('Drift Week 11', 'Drift Week', '2026-05-28', '2026-05-30', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'grassroots', false, 'unlimited', 'intermediate', 'Drift Week 11 is a multi-day, multi-venue drift road trip. Drivers travel between tracks, drifting at each stop. This leg visits USAIR Motorsports Raceway. One of the most unique events in American drift culture.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$300', true, 'drive', 'Drift Week', 'manual'),

('Off the Rails Drift Competition', NULL, '2026-06-06', '2026-06-07', 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'proam', false, 'unlimited', 'intermediate', 'Off the Rails: A Fight to the Top of the Rollercoaster at USAIR Motorsports Raceway. Unique competition format on the flowing course with elevation changes. Two days of intense tandem battles.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$175', false, 'both', 'USAIR Motorsports', 'manual'),

('ClubFR Drift Day Limited Edition', 'ClubFR', '2026-06-21', NULL, 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'practice', false, 'unlimited', 'advanced', 'ClubFR Drift Day Limited Edition (DDLE) at USAIR. A refined drift day built specifically for high-skill drivers wanting serious tandem time, technical layouts, and elevated intensity. Limited entry.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$200', false, 'drive', 'ClubFR', 'manual'),

-- ============================================================
-- EVERGREEN SPEEDWAY DRIFT EVENTS (Washington)
-- ============================================================
('Evergreen Open Drift - March', NULL, '2026-03-08', NULL, 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'practice', false, 'unlimited', 'all', 'Open drift practice day at Evergreen Speedway. Affordable seat time on the famous banked oval that hosts Formula Drift. All skill levels welcome. One of the Pacific Northwest''s most accessible drift venues.', 'https://evergreenspeedway.com/drift/drift-schedule/', '$75', false, 'drive', 'Evergreen Speedway', 'manual'),

('Evergreen Practice & Rookie Orientation + BBQ', NULL, '2026-03-14', NULL, 'Monroe, Washington', 'US', 'Evergreen Speedway', 47.8628, -121.9787, 'practice', false, 'unlimited', 'beginner', 'Rookie orientation and practice day at Evergreen Speedway with a BBQ social. Perfect for first-time drifters to learn the basics on the banked oval. Experienced drivers welcome for practice sessions too.', 'https://evergreenspeedway.com/drift/drift-schedule/', '$75', false, 'drive', 'Evergreen Speedway', 'manual'),

-- ============================================================
-- CLUB LOOSE 2026 (East Coast - New Jersey)
-- ============================================================
('Club Loose East Coast Bash', 'Club Loose', '2026-06-30', '2026-07-01', 'Englishtown, New Jersey', 'US', 'Old Bridge Township Raceway Park', 40.3310, -74.3340, 'grassroots', false, 'unlimited', 'all', 'The legendary Club Loose East Coast Bash at E-Town Raceway Park. A fun-filled weekend of drifting and partying with the East Coast drift community. One of the biggest and best-organized grassroots programs in the country. All levels welcome.', 'https://clubloose.com', '$100', true, 'drive', 'Club Loose', 'manual'),

-- ============================================================
-- THUNDERHILL RACEWAY 2026 (California)
-- ============================================================
('Thunderhill Open 2026', NULL, '2026-05-15', '2026-05-17', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'grassroots', false, 'unlimited', 'all', 'The Thunderhill Open is three days of racing, drifting, music, and motorsport culture at Thunderhill Raceway Park. Grassroots drift competition brought to life by Matt Field and Drift Cave. Driver entry by application, $250 for selected drivers.', 'https://www.thunderhill.com/', '$250', false, 'both', 'Thunderhill Raceway / Drift Cave', 'manual'),

-- ============================================================
-- DRIFT NIRVANA 2026 (Summit Point, West Virginia)
-- ============================================================
('Drift Nirvana - Drift 101', 'Drift Nirvana', '2026-03-01', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point - Washington Circuit', 39.2313, -77.9703, 'practice', false, 'unlimited', 'beginner', 'Drift Nirvana Drift 101 at Summit Point''s Washington Circuit. Perfect introduction to drifting with professional instruction. Learn car control, initiating slides, and basic tandem technique in a safe, structured environment.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$200', false, 'drive', 'Drift Nirvana', 'manual'),

('Drift Nirvana - Season Opener', 'Drift Nirvana', '2026-03-08', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point - Shenandoah Circuit', 39.2313, -77.9703, 'practice', false, 'unlimited', 'all', 'Drift Nirvana Season Opener on the Shenandoah Circuit at Summit Point. Open practice with tandem sessions for the 2026 season kickoff. All skill levels welcome at one of the East Coast''s best drift-friendly facilities.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$175', false, 'drive', 'Drift Nirvana', 'manual'),

('Drift Nirvana - Skid & Advanced', 'Drift Nirvana', '2026-03-14', '2026-03-15', 'Summit Point, West Virginia', 'US', 'Summit Point - Shenandoah & Patterson Circuits', 39.2313, -77.9703, 'practice', false, 'unlimited', 'all', 'Two-day Drift Nirvana event featuring skidpad training and advanced drifting at Summit Point. Saturday focuses on car control fundamentals; Sunday steps up to the full course for tandem practice.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$200', false, 'drive', 'Drift Nirvana', 'manual'),

('Drift Nirvana - Drift 101 (April)', 'Drift Nirvana', '2026-04-12', NULL, 'Summit Point, West Virginia', 'US', 'Summit Point - Washington Circuit', 39.2313, -77.9703, 'practice', false, 'unlimited', 'beginner', 'Another Drift 101 session at Summit Point. Professional instruction for beginners on the Washington Circuit. Learn the fundamentals of drift car control in a safe environment with experienced coaches.', 'https://summitpointmp.com/driving-programs/drift-nirvana/', '$200', false, 'drive', 'Drift Nirvana', 'manual'),

-- ============================================================
-- OSW DRIFT (Orlando Speed World - Florida)
-- ============================================================
('OSW Drift Learners Day & After Dark', 'OSW Drift', '2026-03-21', NULL, 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'practice', false, 'unlimited', 'beginner', 'OSW Drift Learners Day at Orlando Speed World. 5 hours of guided in-car instruction from A-class tandem drivers, followed by the After Dark open drift session in the evening. Central Florida''s premiere drift track runs two tracks simultaneously.', 'https://oswdrift.com', '$165', false, 'drive', 'OSW Drift', 'manual'),

('OSW Drift After Dark', 'OSW Drift', '2026-04-18', NULL, 'Orlando, Florida', 'US', 'Orlando Speed World', 28.5414, -81.1041, 'practice', false, 'unlimited', 'all', 'OSW After Dark open drift night at Orlando Speed World. 6 hours of open drifting on two tracks simultaneously under the lights. One of the best-value drift events in the Southeast. Pay at the gate, all levels welcome.', 'https://oswdrift.com', '$60', false, 'drive', 'OSW Drift', 'manual'),

-- ============================================================
-- ADAMS MOTORSPORTS PARK (California - grassroots)
-- ============================================================
('Thursday Night Drift - Adams Motorsports Park (March)', NULL, '2026-03-05', NULL, 'Riverside, California', 'US', 'Adams Motorsports Park', 33.8750, -117.2500, 'practice', false, 'unlimited', 'all', 'Thursday Night Drift at Adams Motorsports Park, one of the longest-running open drift sessions in the US. Tight, technical kart track layout perfect for beginner and tandem drifting. Pre-registration recommended. Runs weekly most Thursdays.', 'https://adamsmotorsportspark.com/racing/drifting/', '$40', false, 'drive', 'Adams Motorsports Park', 'manual'),

('Thursday Night Drift - Adams Motorsports Park (April)', NULL, '2026-04-02', NULL, 'Riverside, California', 'US', 'Adams Motorsports Park', 33.8750, -117.2500, 'practice', false, 'unlimited', 'all', 'Weekly Thursday Night Drift at Adams Motorsports Park. One of SoCal''s oldest grassroots drift venues with a tight, technical layout. Affordable seat time for all skill levels. Sessions run in the evening.', 'https://adamsmotorsportspark.com/racing/drifting/', '$40', false, 'drive', 'Adams Motorsports Park', 'manual'),

('Thursday Night Drift - Adams Motorsports Park (May)', NULL, '2026-05-07', NULL, 'Riverside, California', 'US', 'Adams Motorsports Park', 33.8750, -117.2500, 'practice', false, 'unlimited', 'all', 'Weekly Thursday Night Drift at Adams Motorsports Park. Affordable, accessible grassroots drifting in Southern California. All skill levels, all cars. The heart of the SoCal grassroots drift scene.', 'https://adamsmotorsportspark.com/racing/drifting/', '$40', false, 'drive', 'Adams Motorsports Park', 'manual'),

-- ============================================================
-- HOTPIT AUTOFEST 2026 (Southern California ProAm)
-- ============================================================
('HOTPIT Autofest Rd.1', 'HOTPIT Autofest', '2026-03-28', NULL, 'San Bernardino, California', 'US', 'Orange Show Speedway', 34.0886, -117.2792, 'proam', false, 'unlimited', 'intermediate', 'HOTPIT Autofest Round 1 at Orange Show Speedway. The most exciting premier drift series of Western USA. Door-to-door battles, drift ride-alongs, stunt bikes, RC racing, vendors, and music. Winner earns points toward a Formula Drift PRO license.', 'https://www.hotpitautofest.com/', '$30', false, 'both', 'HOTPIT Autofest', 'manual'),

('HOTPIT Autofest Rd.2', 'HOTPIT Autofest', '2026-05-16', NULL, 'Bakersfield, California', 'US', 'Kern County Raceway', 35.2478, -118.8644, 'proam', false, 'unlimited', 'intermediate', 'HOTPIT Autofest Round 2 at Kevin Harvick''s Kern County Raceway. Western USA''s premier drift competition series continues with intense tandem battles. Drift ride-alongs, car show, and vendor village.', 'https://www.hotpitautofest.com/', '$30', false, 'both', 'HOTPIT Autofest', 'manual'),

('HOTPIT Autofest Rd.3', 'HOTPIT Autofest', '2026-07-11', NULL, 'Irwindale, California', 'US', 'Irwindale Speedway', 34.0856, -117.9711, 'proam', false, 'unlimited', 'intermediate', 'HOTPIT Autofest Round 3 at the legendary Irwindale Speedway, known as "The House of Drift." The iconic banked oval that helped launch American drift culture. Door-to-door battles, ride-alongs, and car culture.', 'https://www.hotpitautofest.com/', '$30', false, 'both', 'HOTPIT Autofest', 'manual'),

-- ============================================================
-- DRIFT COLORADO 2026 (Formula Drift ProAm Partner)
-- ============================================================
('Drift Colorado Rd.1', 'Drift Colorado', '2026-04-25', NULL, 'Colorado Springs, Colorado', 'US', 'Pikes Peak International Raceway', 38.7264, -104.7181, 'proam', false, 'unlimited', 'all', 'Drift Colorado Round 1 at Pikes Peak International Raceway. Multi-round championship as part of Formula Drift''s Pro-Am program. Grassroots competition in the Denver/Colorado Springs area with a path to a PROSPEC license.', 'https://www.driftcolorado.com/event-schedule', '$100', false, 'both', 'Drift Colorado', 'manual'),

('Drift Colorado Rd.2', 'Drift Colorado', '2026-06-13', NULL, 'Pueblo, Colorado', 'US', 'Pueblo Motorsports Park', 38.3219, -104.5417, 'proam', false, 'unlimited', 'all', 'Drift Colorado Round 2 at Pueblo Motorsports Park. Competition continues in the multi-round championship. Affordable entry-level drifting competition in the Rocky Mountain region.', 'https://www.driftcolorado.com/event-schedule', '$100', false, 'both', 'Drift Colorado', 'manual'),

-- ============================================================
-- EAST10 DRIFT 2026 (Southeast ProAm)
-- ============================================================
('East10 Drift - Road Atlanta', 'East10 Drift', '2026-04-04', NULL, 'Braselton, Georgia', 'US', 'Michelin Raceway Road Atlanta', 34.1413, -83.8173, 'proam', false, 'unlimited', 'intermediate', 'East10 Drift competition at Road Atlanta. Part of Formula Drift''s Pro-Am program, East10 events are conducted in the Atlanta and Bristol communities. Competitive tandem drifting with a path to professional licensing.', 'https://east10drift.com/', '$125', false, 'both', 'East10 Drift', 'manual'),

('East10 Drift - Bristol', 'East10 Drift', '2026-06-06', NULL, 'Bristol, Tennessee', 'US', 'Bristol Motor Speedway', 36.5153, -82.2569, 'proam', false, 'unlimited', 'intermediate', 'East10 Drift brings Pro-Am drifting to Bristol Motor Speedway in Tennessee. Competitive tandem battles at one of NASCAR''s most iconic venues. Part of Formula Drift''s Pro-Am licensing pathway.', 'https://east10drift.com/', '$125', false, 'both', 'East10 Drift', 'manual'),

-- ============================================================
-- BAY AREA DRIFTING 2026 (Northern California)
-- ============================================================
('Bay Area Drifting - Thunderhill (March)', 'Bay Area Drifting', '2026-03-14', '2026-03-15', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'practice', false, 'unlimited', 'beginner', 'Bay Area Drifting school and practice at Thunderhill Raceway Park. Small student-to-instructor ratio ensures personalized coaching. Perfect for beginners wanting to learn in a safe, structured environment. Spots fill fast.', 'https://www.bayareadrifting.com/schedule', '$350', false, 'drive', 'Bay Area Drifting', 'manual'),

('Bay Area Drifting - Thunderhill (May)', 'Bay Area Drifting', '2026-05-09', '2026-05-10', 'Willows, California', 'US', 'Thunderhill Raceway Park', 39.5378, -122.3322, 'practice', false, 'unlimited', 'beginner', 'Bay Area Drifting school weekend at Thunderhill. Professional drift instruction for beginners and intermediate drivers. Small class sizes and personalized attention at NorCal''s premier drift school.', 'https://www.bayareadrifting.com/schedule', '$350', false, 'drive', 'Bay Area Drifting', 'manual'),

-- ============================================================
-- USAIR DRIFT TEST & TUNE / PRACTICE (Wisconsin)
-- ============================================================
('USAIR Drift Test & Tune (April)', NULL, '2026-04-17', NULL, 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'practice', false, 'unlimited', 'all', 'Drift Test and Tune at USAIR Motorsports Raceway. Low-pressure open practice on the full drift course. Perfect for testing new setups, shaking down builds, or just getting seat time before the competition season heats up.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$100', false, 'drive', 'USAIR Motorsports', 'manual'),

('USAIR Drift Test & Tune (May)', NULL, '2026-05-01', NULL, 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'practice', false, 'unlimited', 'all', 'Drift Test and Tune at USAIR Motorsports Raceway. Open practice day on the flowing course. Ideal for pre-season testing and getting comfortable with the layout ahead of competition weekends.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$100', false, 'drive', 'USAIR Motorsports', 'manual'),

('USAIR Drift Test & Tune (June)', NULL, '2026-06-05', NULL, 'Shawano, Wisconsin', 'US', 'USAIR Motorsports Raceway', 44.7339, -88.6010, 'practice', false, 'unlimited', 'all', 'Drift Test and Tune at USAIR Motorsports Raceway. Mid-season open practice on the full course. Great opportunity for seat time between competition events.', 'https://www.usairmotorsportsraceway.com/events-schedule', '$100', false, 'drive', 'USAIR Motorsports', 'manual'),

-- ============================================================
-- LZ WORLD TOUR - CANADA
-- ============================================================
('LZ World Tour - ICAR Mirabel', 'LZ World Tour', '2026-10-03', '2026-10-04', 'Mirabel, Quebec', 'CA', 'ICAR Mirabel Motorsports Complex', 45.6547, -74.0386, 'proam', true, 'unlimited', 'advanced', 'Adam LZ brings the World Tour to Canada at ICAR Mirabel in Quebec. Two days of elite drifting competition featuring the Last Chance Top 16 format. The only Canadian stop on the 2026 LZ World Tour.', 'https://www.lzworldtour.com/events/', '$45', false, 'watch', 'LZ World Tour / LZMFG', 'manual'),

-- NOTE: Grassroots Bash - AMP already in events-migration.sql

-- ============================================================
-- GREAT LAKES PRO-AM (Pennsylvania)
-- ============================================================
('Great Lakes Pro-Am Rd.1', 'Great Lakes Pro-Am', '2026-05-30', NULL, 'North East, Pennsylvania', 'US', 'Lake Erie Speedway', 42.1539, -79.8347, 'proam', false, 'unlimited', 'intermediate', 'Great Lakes Pro-Am Series Round 1 at Lake Erie Speedway. Part of Formula Drift''s Pro-Am licensing program. Grassroots competition on the oval track in Pennsylvania''s Lake Erie region.', 'https://www.formulad.com/pro-am', '$125', false, 'both', 'Great Lakes Pro-Am', 'manual'),

('Great Lakes Pro-Am Rd.2', 'Great Lakes Pro-Am', '2026-07-18', NULL, 'North East, Pennsylvania', 'US', 'Lake Erie Speedway', 42.1539, -79.8347, 'proam', false, 'unlimited', 'intermediate', 'Great Lakes Pro-Am Series Round 2 at Lake Erie Speedway. Continuing the multi-round championship with competitive tandem battles on the oval. Part of Formula Drift''s Pro-Am pathway.', 'https://www.formulad.com/pro-am', '$125', false, 'both', 'Great Lakes Pro-Am', 'manual');
