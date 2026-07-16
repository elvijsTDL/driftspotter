import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "How It Works — DriftSpotter",
  description:
    "One platform, two seats. See how DriftSpotter works for drivers applying to events and for organizers running them — no Google Forms, no spreadsheets.",
};

export default function HowItWorksPage() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 speed-lines pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-drift-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-drift-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-heading font-semibold text-drift-orange uppercase tracking-[0.3em] mb-4 animate-fade-in-up">
            How It Works
          </p>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-foreground tracking-tight leading-tight animate-fade-in-up delay-100">
            PICK YOUR <span className="text-drift-orange text-glow-orange">LANE</span>
          </h1>
          <div className="tire-track w-24 mx-auto mt-5 animate-fade-in-up delay-200" />
          <p className="text-muted mt-5 max-w-xl mx-auto animate-fade-in-up delay-300">
            One platform, two seats. Drivers apply with a card that speaks for them.
            Organizers run their grid without a single spreadsheet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal>
            <Link
              href="/how-it-works/drivers"
              className="group relative block glass rounded-3xl p-8 md:p-10 border border-transparent hover:border-drift-orange/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
            >
              <span className="absolute -top-6 -right-2 font-heading font-bold text-[110px] leading-none text-outline-orange opacity-60 select-none pointer-events-none">
                01
              </span>
              <div className="w-14 h-14 rounded-2xl bg-drift-orange/10 flex items-center justify-center mb-6 group-hover:bg-drift-orange/20 group-hover:glow-orange transition-all">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                </svg>
              </div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-3 group-hover:text-drift-orange transition-colors">
                I&apos;M A DRIVER
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Build your driver card once — car, photos, history — then apply to any event in one click. Never fill a Google Form again.
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-drift-orange">
                See the driver flow
                <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <Link
              href="/how-it-works/organizers"
              className="group relative block glass rounded-3xl p-8 md:p-10 border border-transparent hover:border-drift-cyan/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
            >
              <span className="absolute -top-6 -right-2 font-heading font-bold text-[110px] leading-none text-outline-cyan opacity-60 select-none pointer-events-none">
                02
              </span>
              <div className="w-14 h-14 rounded-2xl bg-drift-cyan/10 flex items-center justify-center mb-6 group-hover:bg-drift-cyan/20 group-hover:glow-cyan transition-all">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-3 group-hover:text-drift-cyan transition-colors">
                I ORGANIZE EVENTS
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Get verified, publish your event with everything drivers need, and watch applications roll in with the car and history attached.
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-drift-cyan">
                See the organizer flow
                <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={200} className="mt-10">
          <p className="text-center text-xs text-muted-dark">
            Most of our organizers drive too — you can be both. Roles never lock you out of the other side.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
