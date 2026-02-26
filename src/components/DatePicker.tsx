"use client";

import { useState, useRef, useEffect } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface DatePickerProps {
  value: string;            // "YYYY-MM-DD" or ""
  onChange: (val: string) => void;
  placeholder?: string;
  compact?: boolean;        // smaller trigger for sidebar use
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseDate(str: string) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

export default function DatePicker({ value, onChange, placeholder = "Pick a date", compact }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const parsed = parseDate(value);
  const [viewYear, setViewYear] = useState(parsed?.year ?? 2026);
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? 3); // April 2026

  // Sync view when value changes externally
  useEffect(() => {
    const p = parseDate(value);
    if (p) { setViewYear(p.year); setViewMonth(p.month); }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectDay = (day: number) => {
    onChange(toDateStr(viewYear, viewMonth, day));
    setOpen(false);
  };

  const displayLabel = parsed
    ? new Date(parsed.year, parsed.month, parsed.day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : placeholder;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 w-full text-left border border-border rounded-xl transition-all focus:outline-none focus:border-drift-orange hover:border-border-light ${
          compact ? "px-3 py-2 text-xs" : "px-3 py-2.5 text-sm"
        } ${value ? "text-foreground" : "text-muted-dark"} bg-surface-lighter`}
      >
        {/* Calendar icon */}
        <svg className="flex-shrink-0 text-muted-dark" width={compact ? "14" : "16"} height={compact ? "14" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span className="flex-1 truncate">{displayLabel}</span>
        {value && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="flex-shrink-0 w-4 h-4 rounded-full hover:bg-white/10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute z-50 mt-2 w-[280px] rounded-2xl glass border border-border shadow-2xl shadow-black/50 p-4 animate-fade-in-up" style={{ animationDuration: "150ms" }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-surface-lighter transition-colors text-muted hover:text-foreground"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="font-heading font-semibold text-sm text-foreground">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-surface-lighter transition-colors text-muted hover:text-foreground"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[10px] text-muted-dark font-medium py-1 uppercase tracking-wider">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;
              const dateStr = toDateStr(viewYear, viewMonth, day);
              const isSelected = dateStr === value;
              const isToday = dateStr === new Date().toISOString().slice(0, 10);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`relative w-full aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-drift-orange text-white shadow-lg shadow-drift-orange/30"
                      : isToday
                        ? "text-drift-orange bg-drift-orange/10 hover:bg-drift-orange/20"
                        : "text-muted hover:text-foreground hover:bg-surface-lighter"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className="text-[11px] text-muted hover:text-foreground transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                onChange(now.toISOString().slice(0, 10));
                setOpen(false);
              }}
              className="text-[11px] text-drift-orange hover:text-drift-orange-light transition-colors font-medium"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
