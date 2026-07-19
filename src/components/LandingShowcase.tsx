import Link from "next/link";
import Reveal from "@/components/Reveal";

/* Landing-page product story in the how-it-works visual language:
   ghost outlined numerals, alternating rows, pure-JSX product mock-ups. */

function GhostNumber({ n, cyan = false }: { n: string; cyan?: boolean }) {
  return (
    <span
      className={`absolute -top-10 -left-3 md:-left-8 font-heading font-bold text-[120px] md:text-[160px] leading-none ${
        cyan ? "text-outline-cyan" : "text-outline-orange"
      } opacity-50 select-none pointer-events-none`}
    >
      {n}
    </span>
  );
}

/* ---- Product mock-ups ---- */

function MapMock() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap gap-1.5 mb-4">
        {["Latvia", "Japan", "USA"].map((c, i) => (
          <span
            key={c}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
              i === 0 ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted"
            }`}
          >
            {c}
          </span>
        ))}
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-drift-cyan/15 text-drift-cyan">Drive</span>
        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-lighter text-muted">Watch</span>
      </div>
      <div className="relative h-40 rounded-xl bg-surface-light overflow-hidden carbon-bg">
        <div className="absolute top-7 left-10 w-3 h-3 rounded-full bg-badge-grassroots shadow-[0_0_12px_#22C55E88]" />
        <div className="absolute top-16 left-28 w-3 h-3 rounded-full bg-badge-grassroots shadow-[0_0_12px_#22C55E88]" />
        <div className="absolute top-10 right-14 w-3 h-3 rounded-full bg-badge-official shadow-[0_0_12px_#FFD70088] animate-pulse-glow" />
        <div className="absolute bottom-10 right-24 w-3 h-3 rounded-full bg-badge-proam shadow-[0_0_12px_#3B82F688]" />
        <div className="absolute bottom-7 left-16 w-3 h-3 rounded-full bg-badge-practice shadow-[0_0_10px_#6B728088]" />
        <div className="absolute top-5 right-32 w-3 h-3 rounded-full bg-badge-grassroots shadow-[0_0_12px_#22C55E88]" />
        <div className="absolute bottom-2 right-3 text-[10px] text-muted-dark font-mono">every country · every weekend</div>
      </div>
      <p className="text-[11px] text-muted mt-3">
        <span className="text-drift-orange font-semibold">Price, track and safety rules</span> visible before you commit
      </p>
    </div>
  );
}

function DriverApplyMock() {
  return (
    <div className="glass rounded-2xl p-5 glow-orange">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-drift-orange/20 flex items-center justify-center font-heading font-bold text-drift-orange">K</div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Kristaps R.</p>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-drift-orange/10 text-drift-orange border border-drift-orange/20">Intermediate</span>
          </div>
          <p className="text-xs text-muted">14 events attended · full cage · hydro</p>
        </div>
      </div>
      <p className="text-xs text-muted mb-2 font-medium">1997 Nissan Silvia S14 · SR20DET · 320 hp</p>
      <div className="grid grid-cols-3 gap-1.5 mb-4">
        <div className="aspect-video rounded-lg bg-gradient-to-br from-drift-orange/30 via-red-900/20 to-surface" />
        <div className="aspect-video rounded-lg bg-gradient-to-br from-drift-cyan/20 via-blue-900/20 to-surface" />
        <div className="aspect-video rounded-lg bg-gradient-to-br from-purple-600/20 via-indigo-900/20 to-surface" />
      </div>
      <div className="w-full py-3 rounded-xl bg-drift-orange text-white text-center text-sm font-heading font-semibold">
        Apply to Attend
      </div>
      <p className="text-[10px] text-muted-dark text-center mt-3">
        Your card rides along automatically. That&apos;s the whole form.
      </p>
    </div>
  );
}

function OrganizerQueueMock() {
  return (
    <div className="glass rounded-2xl p-5 glow-cyan">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-foreground">Night Slide — Round 4</p>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-drift-cyan/10 text-drift-cyan border border-drift-cyan/20">
          12 applications
        </span>
      </div>
      <div className="space-y-2">
        <div className="rounded-xl bg-surface-lighter/60 p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-drift-orange/20 flex items-center justify-center text-xs font-heading font-bold text-drift-orange flex-shrink-0">M</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">Matiss L. · BMW E36 · 280 hp</p>
            <p className="text-[10px] text-muted">9 events · cage · emergency contact ✓</p>
          </div>
          <svg className="text-badge-grassroots flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div className="rounded-xl bg-surface-lighter/60 p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-drift-cyan/20 flex items-center justify-center text-xs font-heading font-bold text-drift-cyan flex-shrink-0">A</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">Anna V. · Nissan 200SX · 250 hp</p>
            <p className="text-[10px] text-muted">First event · all equipment listed</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-badge-grassroots/15 text-badge-grassroots text-[10px] font-semibold">Approve</span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-lighter text-muted text-[10px] font-semibold">Pass</span>
          </div>
        </div>
        <div className="rounded-xl bg-surface-lighter/60 p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-heading font-bold text-purple-400 flex-shrink-0">J</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate">Janis O. · Sony FX3</p>
            <p className="text-[10px] text-muted">Applying as media</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-400 flex-shrink-0">MEDIA</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-dark mt-3 text-center">
        Approve from your phone — drivers are notified instantly.
      </p>
    </div>
  );
}

/* ---- Showcase rows ---- */

const rows = [
  {
    n: "01",
    cyan: false,
    kicker: "Discover",
    title: (
      <>
        EVERY EVENT ON <span className="text-drift-orange">ONE MAP</span>
      </>
    ),
    body: "From grassroots practice nights to pro-am rounds, in every country we can find them. Filter by what actually matters to your car and your plans — no more digging through Facebook groups.",
    points: [
      "Live world map with country filters",
      "Cage rules, tire limits and price up front",
      "Near Me sorting when you're on the road",
    ],
    mock: <MapMock />,
  },
  {
    n: "02",
    cyan: false,
    kicker: "For Drivers",
    title: (
      <>
        YOUR CAR IS THE <span className="text-drift-orange">APPLICATION</span>
      </>
    ),
    body: "Build your driver card once — garage, photos, event history. Every application carries it automatically, so organizers approve a real driver instead of reading a wall of form fields.",
    points: [
      "One-click applications, no Google Forms",
      "Multi-car garage with equipment tracked",
      "Verified event history that builds your rep",
    ],
    mock: <DriverApplyMock />,
  },
  {
    n: "03",
    cyan: true,
    kicker: "For Organizers",
    title: (
      <>
        RUN THE GRID, <span className="text-drift-cyan">NOT THE PAPERWORK</span>
      </>
    ),
    body: "Publish your event with everything drivers need, then watch applications arrive with the car, equipment and seat time attached. Decisions, documents and updates all live in one place.",
    points: [
      "Applicant review with full driver cards",
      "Docs, updates and galleries per event",
      "Trusted organizers publish instantly",
    ],
    mock: <OrganizerQueueMock />,
  },
];

export default function LandingShowcase() {
  return (
    <>
      {/* Product story */}
      <section className="relative py-20 md:py-28">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 md:mb-24">
            <Reveal>
              <p className="text-xs font-heading font-semibold text-drift-orange uppercase tracking-[0.3em] mb-4">
                Why DriftSpotter
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground tracking-tight">
                ONE PLATFORM. <span className="text-drift-orange text-glow-orange">BOTH SEATS.</span>
              </h2>
              <div className="tire-track w-24 mx-auto mt-5" />
              <p className="text-muted mt-5 max-w-xl mx-auto">
                Drivers apply with a card that speaks for them. Organizers run their grid
                without a single spreadsheet.
              </p>
            </Reveal>
          </div>

          <div className="space-y-20 md:space-y-28">
            {rows.map((row, i) => (
              <div key={row.n} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
                <Reveal className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative pt-8 pl-4 md:pl-10">
                    <GhostNumber n={row.n} cyan={row.cyan} />
                    <p className={`text-xs font-heading font-semibold uppercase tracking-[0.25em] mb-3 ${row.cyan ? "text-drift-cyan" : "text-drift-orange"}`}>
                      {row.kicker}
                    </p>
                    <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground tracking-tight mb-4">
                      {row.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mb-5">{row.body}</p>
                    <ul className="space-y-2">
                      {row.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm text-muted">
                          <svg
                            className={`flex-shrink-0 mt-0.5 ${row.cyan ? "text-drift-cyan" : "text-drift-orange"}`}
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <Reveal delay={150} className={i % 2 === 1 ? "md:order-1" : ""}>
                  {row.mock}
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="relative glass rounded-3xl p-10 md:p-14 text-center overflow-hidden glow-orange">
              <div className="absolute inset-0 carbon-bg opacity-20 pointer-events-none" />
              <h2 className="relative font-heading font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-4">
                FIND YOUR NEXT <span className="text-drift-orange">SLIDE</span>
              </h2>
              <p className="relative text-muted mb-8 max-w-md mx-auto">
                Free for drivers. Free for organizers. Every drift event in one place.
              </p>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/events"
                  className="px-8 py-3.5 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-drift-orange/30 active:scale-[0.98]"
                >
                  Explore Events
                </Link>
                <Link
                  href="/how-it-works"
                  className="px-8 py-3.5 glass border border-border hover:border-drift-orange text-foreground hover:text-drift-orange font-heading font-semibold rounded-xl transition-all"
                >
                  How It Works
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} className="mt-8">
            <Link
              href="/how-it-works/organizers"
              className="group flex items-center justify-center gap-2 text-sm text-muted hover:text-drift-cyan transition-colors"
            >
              Running events?
              <span className="font-semibold text-drift-cyan">See how organizing works</span>
              <svg className="text-drift-cyan group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
