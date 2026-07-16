import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "How It Works for Drivers — DriftSpotter",
  description:
    "Build your driver card once, apply to any drift event in one click, and let your event history speak for itself. No Google Forms. Ever.",
};

function StepNumber({ n }: { n: string }) {
  return (
    <span className="absolute -top-10 -left-3 md:-left-8 font-heading font-bold text-[120px] md:text-[160px] leading-none text-outline-orange opacity-50 select-none pointer-events-none">
      {n}
    </span>
  );
}

function StepHeader({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <>
      <p className="text-xs font-heading font-semibold text-drift-orange uppercase tracking-[0.25em] mb-3">{kicker}</p>
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground tracking-tight mb-4">{title}</h2>
    </>
  );
}

/* ---- Product mock-ups (pure JSX, always in sync with the brand) ---- */

function DriverCardMock() {
  return (
    <div className="glass rounded-2xl p-5 glow-orange">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-drift-orange/20 flex items-center justify-center font-heading font-bold text-drift-orange">K</div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Kristaps R.</p>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-drift-orange/10 text-drift-orange border border-drift-orange/20">Intermediate</span>
          </div>
          <p className="text-xs text-muted">14 events attended · 2 upcoming</p>
        </div>
      </div>
      <p className="text-xs text-muted mb-1.5 font-medium">1997 Nissan Silvia S14</p>
      <p className="text-[11px] text-muted-dark mb-3">SR20DET · Wisefab angle kit · hydro · full cage</p>
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        <div className="aspect-video rounded-lg bg-gradient-to-br from-drift-orange/30 via-red-900/20 to-surface" />
        <div className="aspect-video rounded-lg bg-gradient-to-br from-drift-cyan/20 via-blue-900/20 to-surface" />
        <div className="aspect-video rounded-lg bg-gradient-to-br from-purple-600/20 via-indigo-900/20 to-surface" />
      </div>
      <div className="flex gap-1.5">
        <span className="px-2 py-1 rounded-md bg-surface-lighter text-[10px] text-drift-cyan font-medium">Instagram</span>
        <span className="px-2 py-1 rounded-md bg-surface-lighter text-[10px] text-drift-cyan font-medium">TikTok</span>
        <span className="px-2 py-1 rounded-md bg-surface-lighter text-[10px] text-muted font-medium">+ 2 cars in garage</span>
      </div>
    </div>
  );
}

function FindEventsMock() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap gap-1.5 mb-4">
        {["Latvia", "Lithuania", "Poland"].map((c, i) => (
          <span key={c} className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${i === 0 ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted"}`}>{c}</span>
        ))}
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-lighter text-muted">225 Max</span>
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-lighter text-muted">No Cage OK</span>
      </div>
      <div className="relative h-36 rounded-xl bg-surface-light overflow-hidden carbon-bg">
        <div className="absolute top-6 left-10 w-3 h-3 rounded-full bg-badge-grassroots shadow-[0_0_12px_#22C55E88]" />
        <div className="absolute top-16 left-24 w-3 h-3 rounded-full bg-badge-grassroots shadow-[0_0_12px_#22C55E88]" />
        <div className="absolute top-9 right-16 w-3 h-3 rounded-full bg-badge-official shadow-[0_0_12px_#FFD70088]" />
        <div className="absolute bottom-8 right-24 w-3 h-3 rounded-full bg-badge-practice shadow-[0_0_10px_#6B728088]" />
        <div className="absolute bottom-6 left-16 w-3 h-3 rounded-full bg-badge-proam shadow-[0_0_12px_#3B82F688]" />
        <div className="absolute bottom-2 right-3 text-[10px] text-muted-dark font-mono">2D · your rules · your radius</div>
      </div>
      <p className="text-[11px] text-muted mt-3"><span className="text-drift-orange font-semibold">7 events</span> match your car this month</p>
    </div>
  );
}

function ApplyMock() {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm font-semibold text-foreground mb-1">Grassroots Night Slide — Round 4</p>
      <p className="text-xs text-muted mb-4">Sat, Aug 15 · Bikernieki, Riga · €45</p>
      <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-3 mb-4">
        <p className="text-[10px] font-semibold text-yellow-500 uppercase tracking-wider mb-1">Safety Requirements</p>
        <p className="text-[11px] text-muted">Helmet, fire extinguisher, battery tie-down, tow hooks</p>
      </div>
      <div className="w-full py-3 rounded-xl bg-drift-orange text-white text-center text-sm font-heading font-semibold glow-orange">
        Apply to Attend
      </div>
      <p className="text-[10px] text-muted-dark text-center mt-3">Your driver card rides along automatically. That&apos;s the whole form.</p>
    </div>
  );
}

function GreenLightMock() {
  return (
    <div className="space-y-2.5">
      <div className="glass rounded-xl p-4 flex items-start gap-3 animate-float">
        <div className="w-8 h-8 rounded-full bg-badge-grassroots/20 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Application approved</p>
          <p className="text-[11px] text-muted">You&apos;re in for Grassroots Night Slide — Round 4</p>
        </div>
      </div>
      <div className="glass rounded-xl p-4 flex items-start gap-3 ml-6">
        <div className="w-8 h-8 rounded-full bg-drift-orange/20 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Event coming up!</p>
          <p className="text-[11px] text-muted">Night Slide is this Saturday — safety checklist inside</p>
        </div>
      </div>
      <div className="glass rounded-xl p-4 ml-3">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-muted">My Applications</span>
          <span className="text-badge-grassroots font-semibold">2 confirmed · 1 pending</span>
        </div>
        <div className="h-1.5 bg-surface-lighter rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-badge-grassroots rounded-full" />
        </div>
      </div>
    </div>
  );
}

function HistoryMock() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-4 mb-4">
        <div className="px-4 py-3 rounded-xl bg-surface-lighter text-center">
          <p className="font-heading font-bold text-2xl text-drift-orange">14</p>
          <p className="text-[9px] text-muted uppercase tracking-wider">Attended</p>
        </div>
        <div className="px-4 py-3 rounded-xl bg-surface-lighter text-center">
          <p className="font-heading font-bold text-2xl text-drift-cyan">2</p>
          <p className="text-[9px] text-muted uppercase tracking-wider">Upcoming</p>
        </div>
        <p className="text-[11px] text-muted leading-snug flex-1">Verified from real applications — can&apos;t be faked, doesn&apos;t need updating.</p>
      </div>
      {["Night Slide Rd.3 — Bikernieki", "Drift Practice — Kandava", "Season Opener — Riga"].map((e) => (
        <div key={e} className="flex items-center gap-2.5 py-2 border-t border-border">
          <div className="w-1.5 h-1.5 rounded-full bg-badge-grassroots" />
          <p className="text-[11px] text-muted">{e}</p>
          <svg className="ml-auto text-badge-grassroots" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
      ))}
    </div>
  );
}

/* ---- Page ---- */

const steps = [
  {
    n: "01",
    kicker: "Set Up Once",
    title: <>BUILD YOUR <span className="text-drift-orange">DRIVER CARD</span></>,
    body: "Your car (or your whole garage), photos, mods, skill level, socials — filled in once, attached to every application forever. Organizers see a real driver, not a wall of form fields.",
    points: ["Multi-car garage with photos", "Instagram, TikTok, YouTube linked", "Private mode: only organizers you apply to can see it"],
    mock: <DriverCardMock />,
  },
  {
    n: "02",
    kicker: "Discover",
    title: <>FIND EVENTS THAT <span className="text-drift-orange">FIT YOUR CAR</span></>,
    body: "Every event on one map, filtered by what actually matters: country, tire size, cage rules, skill level, spectator or drive. See price and safety requirements before you commit.",
    points: ["Interactive world map + country filters", "Requirements shown up front", "Near Me sorting when you're traveling"],
    mock: <FindEventsMock />,
  },
  {
    n: "03",
    kicker: "Apply",
    title: <>ONE CLICK. <span className="text-drift-orange">NO GOOGLE FORMS.</span></>,
    body: "Hit apply, optionally add a note, done. Your driver card travels with the application — car, photos, history, everything the organizer would have asked for anyway.",
    points: ["Optional message to the organizer", "Withdraw anytime while pending", "Profile completeness hints so you're never rejected for a blank card"],
    mock: <ApplyMock />,
  },
  {
    n: "04",
    kicker: "Confirmed",
    title: <>GET THE <span className="text-badge-grassroots">GREEN LIGHT</span></>,
    body: "Track every application in one place. When you're approved you'll know instantly — and before the event we remind you by email and push, safety checklist included.",
    points: ["My Applications: all statuses, one page", "In-app, email and push notifications", "Automatic reminders 2 days before you drive"],
    mock: <GreenLightMock />,
  },
  {
    n: "05",
    kicker: "Reputation",
    title: <>YOUR REP <span className="text-drift-orange">BUILDS ITSELF</span></>,
    body: "Every event you attend goes on your public record. Next time you apply, organizers see a proven driver with real seat time — which means faster approvals and easier grid spots.",
    points: ["Verified events-attended counter", "Public event history on your profile", "Organizers see it on every application"],
    mock: <HistoryMock />,
  },
];

export default function DriversHowItWorksPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 speed-lines pointer-events-none" />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-drift-orange/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-heading font-semibold text-drift-orange uppercase tracking-[0.3em] mb-4 animate-fade-in-up">
            For Drivers
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-foreground tracking-tight leading-tight animate-fade-in-up delay-100">
            THE LAST ENTRY FORM
            <br />
            YOU&apos;LL EVER FILL IS <span className="text-drift-orange text-glow-orange">NONE</span>
          </h1>
          <div className="tire-track w-24 mx-auto mt-6 animate-fade-in-up delay-200" />
          <p className="text-muted mt-6 max-w-xl mx-auto animate-fade-in-up delay-300">
            Build your driver card once. Apply to any drift event on the map in one click.
            Your car, your photos, your history — always attached, always up to date.
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
                        <svg className="text-drift-orange flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
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
            <div className="relative glass rounded-3xl p-10 md:p-14 text-center overflow-hidden glow-orange">
              <div className="absolute inset-0 carbon-bg opacity-20 pointer-events-none" />
              <h2 className="relative font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-4">
                READY TO <span className="text-drift-orange">SEND IT?</span>
              </h2>
              <p className="relative text-muted mb-8 max-w-md mx-auto">
                Your driver card takes five minutes. Your first application takes one click.
              </p>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/profile" className="px-8 py-3.5 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-drift-orange/30 active:scale-[0.98]">
                  Build Your Driver Card
                </Link>
                <Link href="/events" className="px-8 py-3.5 glass border border-border hover:border-drift-orange text-foreground hover:text-drift-orange font-heading font-semibold rounded-xl transition-all">
                  Browse Events First
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-8">
            <Link href="/how-it-works/organizers" className="group flex items-center justify-center gap-2 text-sm text-muted hover:text-drift-cyan transition-colors">
              Running events instead?
              <span className="font-semibold text-drift-cyan">See how organizing works</span>
              <svg className="text-drift-cyan group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
