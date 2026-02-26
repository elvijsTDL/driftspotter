"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const stats = [
  { label: "Events", value: 142, suffix: "+" },
  { label: "Countries", value: 12, suffix: "" },
  { label: "Drivers", value: 8400, suffix: "+" },
  { label: "Tracks", value: 320, suffix: "+" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [visible, target]);

  return (
    <span className="font-heading font-bold text-3xl md:text-4xl text-foreground">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-drift-orange/5 blur-[150px]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-drift-cyan/3 blur-[120px]" />

      {/* Smoke layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-1/4 w-[600px] h-[200px] bg-gradient-to-r from-drift-orange/10 via-drift-orange/5 to-transparent rounded-full blur-3xl animate-drift-smoke" />
        <div className="absolute top-1/2 -left-1/4 w-[500px] h-[150px] bg-gradient-to-r from-white/5 via-white/3 to-transparent rounded-full blur-3xl animate-drift-smoke" style={{ animationDelay: "3s" }} />
        <div className="absolute top-2/3 -left-1/4 w-[700px] h-[180px] bg-gradient-to-r from-drift-cyan/5 via-drift-cyan/3 to-transparent rounded-full blur-3xl animate-drift-smoke" style={{ animationDelay: "5s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,107,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.3) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-drift-orange animate-pulse-glow" />
          <span className="text-xs font-medium text-muted tracking-wider uppercase">Live events happening now</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] mb-6 animate-fade-in-up delay-100" style={{ opacity: 0, animationFillMode: "forwards" }}>
          EVERY SLIDE.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-drift-orange via-drift-orange-light to-drift-cyan">
            EVERY EVENT.
          </span>
          <br />
          ONE MAP.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted leading-relaxed mb-10 animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
          The ultimate community for drifting enthusiasts. Find events, connect
          with drivers, and never miss a session.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300" style={{ opacity: 0, animationFillMode: "forwards" }}>
          <Link
            href="/events"
            className="group relative px-8 py-4 bg-drift-orange text-foreground font-heading font-semibold text-lg rounded-xl transition-all duration-300 hover:bg-drift-orange-light hover:shadow-xl hover:shadow-drift-orange/25 active:scale-95"
          >
            <span className="relative z-10">Explore Events</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-drift-orange to-drift-orange-light opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/submit"
            className="px-8 py-4 border border-border-light text-foreground font-heading font-semibold text-lg rounded-xl transition-all duration-300 hover:border-drift-orange hover:text-drift-orange hover:shadow-lg hover:shadow-drift-orange/10 active:scale-95"
          >
            Submit an Event
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 animate-fade-in-up delay-400" style={{ opacity: 0, animationFillMode: "forwards" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-muted-dark mt-1 uppercase tracking-widest font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-hint">
        <span className="text-xs text-muted-dark uppercase tracking-widest">Scroll</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted-dark">
          <path d="M10 4L10 16M10 16L16 10M10 16L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
