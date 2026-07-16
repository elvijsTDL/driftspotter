import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "How It Works for Organizers — DriftSpotter",
  description:
    "Get verified, publish your drift event with everything drivers need, and manage applications that arrive with the car, photos and history attached. Zero spreadsheets.",
};

function StepNumber({ n }: { n: string }) {
  return (
    <span className="absolute -top-10 -left-3 md:-left-8 font-heading font-bold text-[120px] md:text-[160px] leading-none text-outline-cyan opacity-50 select-none pointer-events-none">
      {n}
    </span>
  );
}

function StepHeader({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <>
      <p className="text-xs font-heading font-semibold text-drift-cyan uppercase tracking-[0.25em] mb-3">{kicker}</p>
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground tracking-tight mb-4">{title}</h2>
    </>
  );
}

/* ---- Product mock-ups ---- */

function VerifiedMock() {
  return (
    <div className="relative glass rounded-2xl p-5">
      <p className="text-[10px] text-muted uppercase tracking-wider font-medium mb-3">Organizer Request</p>
      <div className="space-y-2.5 mb-4">
        <div className="px-3 py-2.5 rounded-lg bg-surface-lighter text-xs text-foreground">Baltic Night Slide Series</div>
        <div className="px-3 py-2.5 rounded-lg bg-surface-lighter text-xs text-drift-cyan">instagram.com/balticnightslide</div>
        <div className="px-3 py-2.5 rounded-lg bg-surface-lighter text-xs text-muted leading-relaxed">
          Monthly grassroots nights at Bikernieki since 2022, 40-driver grids...
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-badge-grassroots/10 border border-badge-grassroots/20">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
          <span className="text-[10px] font-semibold text-badge-grassroots uppercase tracking-wider">Verified Organizer</span>
        </span>
        <span className="text-[10px] text-muted-dark">usually within 24h</span>
      </div>
      <div className="absolute -top-3 -right-3 rotate-12 px-3 py-1.5 rounded-lg bg-drift-cyan/10 border border-drift-cyan/30 backdrop-blur-sm">
        <span className="text-[10px] font-heading font-bold text-drift-cyan uppercase tracking-wider">Spam-Free Zone</span>
      </div>
    </div>
  );
}

function PublishMock() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">Night Slide — Round 5</p>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-badge-grassroots/10 border border-badge-grassroots/20">
          <span className="w-1.5 h-1.5 rounded-full bg-badge-grassroots animate-pulse-glow" />
          <span className="text-[10px] font-semibold text-badge-grassroots uppercase tracking-wider">Live</span>
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        <div className="aspect-video rounded-lg bg-gradient-to-br from-drift-orange/30 via-red-900/20 to-surface" />
        <div className="aspect-video rounded-lg bg-gradient-to-br from-drift-cyan/20 via-blue-900/20 to-surface" />
        <div className="aspect-video rounded-lg bg-gradient-to-br from-green-600/20 via-emerald-900/20 to-surface" />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="px-2 py-1 rounded-md bg-drift-orange/10 text-[10px] text-drift-orange font-semibold">€45</span>
        <span className="px-2 py-1 rounded-md bg-surface-lighter text-[10px] text-muted">24 spots</span>
        <span className="px-2 py-1 rounded-md bg-red-500/10 text-[10px] text-red-400">Cage Required</span>
        <span className="px-2 py-1 rounded-md bg-surface-lighter text-[10px] text-muted">225 Max</span>
      </div>
      <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 px-3 py-2">
        <p className="text-[10px] text-yellow-500 font-semibold uppercase tracking-wider">Safety requirements shown to every driver</p>
      </div>
    </div>
  );
}

function ApplicantQueueMock() {
  const applicants = [
    { name: "Kristaps R.", car: "1997 Nissan S14", events: 14, note: "Ran your Round 3, coming back with the new setup" },
    { name: "Tomas B.", car: "2001 BMW E46", events: 8, note: null },
    { name: "Aleksis V.", car: "1993 Toyota JZX90", events: 21, note: "Traveling from Vilnius, need Friday gate time" },
  ];
  return (
    <div className="glass rounded-2xl p-4 space-y-2.5">
      {applicants.map((a, i) => (
        <div key={a.name} className={`p-3 rounded-xl bg-surface-lighter/50 border border-border ${i === 0 ? "glow-cyan" : ""}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-drift-orange/20 flex items-center justify-center text-[11px] font-bold text-drift-orange flex-shrink-0">
              {a.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-xs font-semibold text-foreground">{a.name}</p>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-drift-orange/10 text-drift-orange border border-drift-orange/20">
                  {a.events} events
                </span>
              </div>
              <p className="text-[10px] text-muted">{a.car}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-badge-grassroots/20 text-badge-grassroots">Approve</span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-red-500/10 text-red-400">Reject</span>
            </div>
          </div>
          {a.note && <p className="text-[10px] text-muted-dark italic mt-1.5 ml-10">&ldquo;{a.note}&rdquo;</p>}
        </div>
      ))}
      <p className="text-[10px] text-muted-dark text-center pt-1">Click any name for the full driver card — garage, photos, history</p>
    </div>
  );
}

function CapacityMock() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted">Grid capacity</span>
          <span className="font-heading font-bold text-foreground">18 <span className="text-muted-dark">/ 24</span></span>
        </div>
        <div className="h-2.5 bg-surface-lighter rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-drift-orange to-drift-orange-light rounded-full" />
        </div>
      </div>
      <div className="flex items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1.5 text-badge-grassroots"><span className="w-1.5 h-1.5 rounded-full bg-badge-grassroots" /> 18 approved</span>
        <span className="flex items-center gap-1.5 text-yellow-500"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> 5 pending</span>
        <span className="flex items-center gap-1.5 text-muted-dark"><span className="w-1.5 h-1.5 rounded-full bg-muted-dark" /> 2 declined</span>
      </div>
      <div className="rounded-xl bg-surface-lighter/50 border border-border p-3 flex items-start gap-2.5">
        <svg className="text-drift-cyan flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        <p className="text-[11px] text-muted leading-relaxed">Every decision notifies the driver instantly — no &ldquo;did I get in?&rdquo; DMs at midnight.</p>
      </div>
    </div>
  );
}

function ControlMock() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-lighter/50 border border-border">
        <div className="flex items-center gap-2.5">
          <svg className="text-drift-orange" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          <p className="text-xs text-foreground">Price changed €45 → €40</p>
        </div>
        <span className="text-[10px] font-semibold text-badge-grassroots uppercase">Synced Live</span>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-lighter/50 border border-border">
        <div className="flex items-center gap-2.5">
          <svg className="text-drift-orange" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          <p className="text-xs text-foreground">2 photos added to gallery</p>
        </div>
        <span className="text-[10px] font-semibold text-badge-grassroots uppercase">Synced Live</span>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-drift-cyan/5 border border-drift-cyan/20">
        <div className="flex items-center gap-2.5">
          <svg className="text-drift-cyan" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
          <p className="text-xs text-foreground">Reminders sent to all 18 drivers</p>
        </div>
        <span className="text-[10px] font-semibold text-drift-cyan uppercase">Automatic</span>
      </div>
      <p className="text-[10px] text-muted-dark text-center pt-1">Trusted organizers skip review entirely — publish and it&apos;s live.</p>
    </div>
  );
}

/* ---- Page ---- */

const steps = [
  {
    n: "01",
    kicker: "Verification",
    title: <>GET VERIFIED, <span className="text-drift-cyan">STAND OUT</span></>,
    body: "Tell us who you are and what you run — approval usually lands within 24 hours. Verification is why drivers trust what they see here: your event never sits next to a fake one.",
    points: ["One short form: crew name, link, track record", "Verified-only listings — no spam, no ghost events", "Earn Trusted status and skip review entirely"],
    mock: <VerifiedMock />,
  },
  {
    n: "02",
    kicker: "Publish",
    title: <>YOUR EVENT, <span className="text-drift-cyan">FULLY LOADED</span></>,
    body: "Photos, price, capacity, tire and cage rules, safety requirements, ticket links — everything a driver needs to commit, on one page, on the map, shareable everywhere.",
    points: ["Up to 6 photos with gallery + cover", "Safety requirements shown before anyone applies", "Pinned on the world map automatically"],
    mock: <PublishMock />,
  },
  {
    n: "03",
    kicker: "Applications",
    title: <>APPLICANTS ARRIVE <span className="text-drift-cyan">WITH RECEIPTS</span></>,
    body: "Every application comes with the driver's card attached: their car and mods, photos, verified event history, socials. You know exactly who's asking for a grid spot.",
    points: ["Car + mods + photos on every application", "Verified events-attended count — can't be faked", "Full driver profile one click away"],
    mock: <ApplicantQueueMock />,
  },
  {
    n: "04",
    kicker: "Decisions",
    title: <>FILL YOUR GRID IN <span className="text-drift-cyan">MINUTES</span></>,
    body: "Approve or reject with one click and watch the capacity bar fill. Drivers get notified instantly, so your inbox stays quiet and your grid stays full.",
    points: ["Live capacity tracking against your limit", "Instant notifications on every decision", "Pending queue keeps a waitlist ready"],
    mock: <CapacityMock />,
  },
  {
    n: "05",
    kicker: "Control",
    title: <>EDIT LIVE. <span className="text-drift-cyan">RELAX LATER.</span></>,
    body: "Date slipped? Price changed? Edit the event and the public listing updates instantly. Two days out, every confirmed driver gets an automatic reminder with your safety checklist.",
    points: ["Edits sync to the live listing immediately", "Automatic email + push reminders to your grid", "Public organizer page builds your track record"],
    mock: <ControlMock />,
  },
];

export default function OrganizersHowItWorksPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 speed-lines pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute -top-24 left-0 w-[500px] h-[500px] bg-drift-cyan/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-heading font-semibold text-drift-cyan uppercase tracking-[0.3em] mb-4 animate-fade-in-up">
            For Organizers
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-foreground tracking-tight leading-tight animate-fade-in-up delay-100">
            RUN THE EVENT.
            <br />
            <span className="text-drift-cyan" style={{ textShadow: "0 0 30px rgba(0,212,255,0.4)" }}>NOT THE SPREADSHEET.</span>
          </h1>
          <div className="tire-track w-24 mx-auto mt-6 animate-fade-in-up delay-200" />
          <p className="text-muted mt-6 max-w-xl mx-auto animate-fade-in-up delay-300">
            Publish once, and every application lands with the driver&apos;s car, photos and
            history attached. Approve, fill your grid, and get back to building the track.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <div className="space-y-20 md:space-y-28">
          {steps.map((step, i) => (
            <div key={step.n} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
              <Reveal className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="relative pt-8 pl-4 md:pl-10">
                  <StepNumber n={step.n} />
                  <StepHeader kicker={step.kicker} title={step.title} />
                  <p className="text-sm text-muted leading-relaxed mb-5">{step.body}</p>
                  <ul className="space-y-2">
                    {step.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-muted">
                        <svg className="text-drift-cyan flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={150} className={i % 2 === 1 ? "md:order-1" : ""}>
                {step.mock}
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="relative glass rounded-3xl p-10 md:p-14 text-center overflow-hidden glow-cyan">
              <div className="absolute inset-0 carbon-bg opacity-20 pointer-events-none" />
              <h2 className="relative font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-4">
                YOUR GRID IS <span className="text-drift-cyan">WAITING</span>
              </h2>
              <p className="relative text-muted mb-8 max-w-md mx-auto">
                Verification takes a day. Your first event takes ten minutes. The Google Form retires forever.
              </p>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/submit" className="px-8 py-3.5 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-drift-orange/30 active:scale-[0.98]">
                  Request Organizer Access
                </Link>
                <Link href="/events" className="px-8 py-3.5 glass border border-border hover:border-drift-cyan text-foreground hover:text-drift-cyan font-heading font-semibold rounded-xl transition-all">
                  See Live Events
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-8">
            <Link href="/how-it-works/drivers" className="group flex items-center justify-center gap-2 text-sm text-muted hover:text-drift-orange transition-colors">
              Behind the wheel instead?
              <span className="font-semibold text-drift-orange">See how driving works</span>
              <svg className="text-drift-orange group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
