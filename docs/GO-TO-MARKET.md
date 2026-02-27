# DriftSpotter Go-To-Market Strategy

> "Every Slide. Every Event. One Map."

Last updated: 2026-02-27

---

## 1. Product Positioning

**What it is:** The global hub for discovering, sharing, and attending drift events — from Formula Drift rounds to weekend grassroots sessions.

**One-liner:** DriftSpotter is Songkick for drifting — one map, every event, worldwide.

**Who it's for (primary segments):**

| Segment | Description | What they want |
|---------|-------------|----------------|
| **Grassroots drivers** | Weekend warriors, 200-series tire heroes | Cheap local practice days, community |
| **Spectators / fans** | Love watching but don't drive (yet) | Know what events are near them, buy tickets |
| **Event organisers** | Run grassroots days, small comps | Free promotion, more sign-ups, legitimacy |
| **Pro-Am / semi-pro drivers** | Competing regionally, building a name | Find comps, track their season, get noticed |
| **Car builders & wrenchers** | Forum-first users | Technical help, marketplace, build threads |

**Why now:** Drift is exploding globally (Formula Drift expansion, Drift Masters, Japanese matsuri tourism, grassroots growth in SEA & Middle East). There is no single centralised platform — information is scattered across Instagram stories, Facebook groups, and regional forums.

---

## 2. Launch Phases

### Phase 0 — Foundation (now - week 2)
*Goal: Make the product solid enough that early visitors stick.*

- [x] Event database seeded with 300+ real events
- [x] Map, calendar, filters, event detail modals working
- [x] Forum with categories live
- [x] Event submission flow with approval pipeline
- [ ] Auth fully wired (login, profile, RSVP persistence)
- [ ] Email flows working (welcome, weekly digest, reply notifications)
- [ ] Add "Share event" button (copy link + native share API)
- [ ] SEO: dynamic `<title>` and `<meta og:*>` for each event page (critical for link sharing)
- [ ] Create public-facing landing at root domain with clear CTA

### Phase 1 — Seed the Community (weeks 2-6)
*Goal: 500 registered users, 50 organiser-submitted events.*

**Tactics:**

1. **Organiser outreach (direct):**
   - Build a spreadsheet of 100 grassroots organisers (Instagram, Facebook groups).
   - DM each one: *"We built a free global map of drift events. Your event is already listed — want to claim it and manage RSVPs?"*
   - Offer "Verified Organiser" badge as an incentive.
   - Priority regions: USA (east coast grassroots scene), UK, Germany/Scandinavia, Japan, Australia.

2. **Content seeding (forum):**
   - Pre-populate 10-15 quality threads: "Best budget drift cars 2026", "How to prep for your first grassroots day", "Cage builders by region", etc.
   - These double as SEO long-tail pages.

3. **Social accounts (Instagram + TikTok):**
   - Launch @driftspotter on Instagram and TikTok.
   - Content format: **"Drift events near you this weekend"** — short reels showing event cards from the site with location, date, category. Use trending drift audio.
   - Post 3-5x/week. Region-targeted hashtags (#driftaustralia, #grassrootsdrift, #ukdrifting).

4. **Reddit & Facebook Groups:**
   - Identify top 20 drift communities (r/Drifting, r/Grassrootsmotorsport, regional FB groups).
   - Don't spam links. Post genuinely useful event round-ups: *"All grassroots drift days in the Southeast US this month"* with a link to the filtered map view.

### Phase 2 — Growth Loops (weeks 6-16)
*Goal: 3,000 users, 200 organiser-submitted events, organic traffic growing.*

**Tactics:**

1. **Weekly Digest Email:**
   - Personalised by region (based on signup location or last-viewed events).
   - Subject lines like: *"4 drift events near you this week"*
   - Include one forum highlight and one "new event alert."

2. **"I'm Going" social proof loop:**
   - When a user clicks "I'm Going," prompt them to share on Instagram stories with a branded template/sticker.
   - The shared story links back to the event page (deep link with UTM).

3. **Event Organiser Tools (free tier):**
   - Let verified organisers see RSVP counts, export attendee lists, post updates.
   - This makes DriftSpotter *useful* to organisers, not just a listing site. They'll promote it themselves.

4. **SEO play — programmatic pages:**
   - Auto-generate pages like `/events/usa`, `/events/germany`, `/events/grassroots/uk`.
   - Target searches like "drift events near me", "grassroots drift days UK 2026", "formula drift schedule 2026".
   - Each page is a filtered view of the existing data — low effort, high surface area.

5. **Partnerships with drift media:**
   - Reach out to YouTube channels (Adam LZ, TJ Hunt, Hert from Donut Media, etc.) and drift photographers.
   - Offer: "We'll feature your content in our video highlights section + link your socials on every event you attend."
   - Even a single story mention from a 500K+ account would drive thousands of signups.

### Phase 3 — Monetisation & Moat (months 4-12)
*Goal: Sustainable revenue, become the default place organisers list events.*

**Revenue streams (in order of priority):**

| Stream | Model | Notes |
|--------|-------|-------|
| **Featured events** | $20-50/event | Organisers pay to pin their event at the top of the map/calendar for their region |
| **Organiser Pro tier** | $10-30/month | Analytics, custom branding on event page, attendee messaging, multi-event management |
| **Affiliate / ticket integration** | Commission | Partner with ticketing platforms (Eventbrite, Motorsport Tickets) — earn a cut on referred ticket sales |
| **Marketplace fees** | 5-10% | Take a cut on parts/cars sold through the forum marketplace |
| **Sponsorship slots** | CPM/flat fee | Tire brands, oil companies, parts retailers sponsor the weekly digest or event pages (e.g., "This event is presented by [Brand]") |

**Do NOT charge users to browse or RSVP.** The free consumer experience is the growth engine.

---

## 3. Key Metrics to Track

| Metric | Phase 1 target | Phase 2 target | Why it matters |
|--------|---------------|---------------|----------------|
| Registered users | 500 | 3,000 | Core growth |
| Weekly active users (WAU) | 150 | 1,000 | Engagement, not just signups |
| Events submitted by organisers | 50 | 200 | Supply side — the product is only as good as its data |
| RSVP clicks ("I'm Going") | 200 | 1,500 | Signal of intent, social proof |
| Forum threads created | 30 | 150 | Community stickiness |
| Organic search sessions/week | 100 | 1,000 | SEO is the long-term acquisition channel |
| Email open rate | 35%+ | 35%+ | Quality of digest content |
| Event share clicks | — | 500/month | Viral loop strength |

---

## 4. Brand Voice & Content Guidelines

**Tone:** Enthusiast-first, never corporate. Write like a driver talking to another driver at a grassroots day, not a marketing department.

**Do:**
- Use driver slang naturally (grassroots, matsuri, tandem, clipping point)
- Be opinionated ("the best grassroots days in Europe right now")
- Highlight underdogs and local scenes, not just FD/DM

**Don't:**
- Use generic startup language ("disrupting motorsport", "leveraging synergies")
- Over-produce content — raw phone footage > polished corporate videos
- Gate basic features behind sign-up walls (map and events should always be public)

**Content pillars for socials:**
1. **Event spotlights** — "This weekend's must-attend events" (drives traffic to map)
2. **Scene reports** — "The grassroots scene in [country] is going crazy right now" (builds authority)
3. **Build threads** — Repost/feature forum build threads on IG (drives forum engagement)
4. **Driver features** — Short profiles of grassroots drivers (community building)

---

## 5. Competitive Landscape

| Competitor | What they do | Our advantage |
|-----------|-------------|---------------|
| **Drifted.com** | Media/news site with some event listings | We're interactive (map, RSVP, filters) not just articles |
| **Regional Facebook groups** | Informal event sharing | Fragmented, unsearchable, no map — we aggregate globally |
| **Motorsport.com / FIA sites** | Official series schedules only | We cover grassroots + practice, not just pro |
| **Instagram** | Where drivers post events | Stories disappear, no search, no filtering — we're the permanent record |
| **Eventbrite** | Generic event ticketing | Not built for motorsport — no map, no cage/tire filters, no community |

**Our moat (over time):** Network effects. Once organisers default to listing on DriftSpotter and drivers default to checking it, switching costs are high. The forum and build threads add a second layer of stickiness beyond events.

---

## 6. Launch Checklist (Actionable Next Steps)

Priority order for the next 2 weeks:

1. **Finish auth + email flows** (tomorrow's task)
2. **Add share button to event cards and detail modal** (copy link + native share)
3. **Add dynamic OG meta tags** for event pages so shared links look good on socials
4. **Set up @driftspotter Instagram and TikTok accounts**
5. **Create 5 initial social posts** (event round-up reels for this week's events by region)
6. **Build the organiser outreach spreadsheet** (50 grassroots organisers to DM)
7. **Write 5 seed forum threads** (evergreen topics that rank on Google)
8. **Set up Vercel Analytics dashboard** to track the key metrics above
9. **Add programmatic SEO routes** (`/events/[country]` pages)
10. **Draft the first weekly digest email template**

---

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Event data goes stale (past events linger, new ones missing) | High | Automated stale-event cleanup (done: `.gte("date", today)`). Incentivise organiser submissions. Weekly manual audit of major series schedules. |
| Low organiser adoption | Medium | Make the free tier genuinely useful (RSVP counts, attendee list). Remove all friction from submission. Feature their events prominently. |
| Regional concentration (only US/EU events) | Medium | Actively seed events from Japan, Australia, SEA, Middle East. Partner with regional drift media in those markets. |
| Forum becomes a ghost town | Medium | Seed with quality content. Integrate forum into the main nav and weekly digest. Don't launch marketplace until there's organic activity. |
| Competitor copies the map concept | Low | Our head start on data + community is the moat. Focus on depth (filters, RSVP, organiser tools) not breadth. |
