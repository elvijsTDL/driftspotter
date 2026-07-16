"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import DatePicker from "@/components/DatePicker";
import LocationPicker from "@/components/LocationPicker";
import { validateImage } from "@/lib/uploadMedia";
import { EVENT_REQUIREMENT_OPTIONS } from "@/lib/equipment";

export const MAX_EVENT_IMAGES = 6;

export const COUNTRY_OPTIONS: { code: string; name: string }[] = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "JP", name: "Japan" },
  { code: "DE", name: "Germany" },
  { code: "IE", name: "Ireland" },
  { code: "PL", name: "Poland" },
  { code: "NO", name: "Norway" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "AT", name: "Austria" },
  { code: "IT", name: "Italy" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "FI", name: "Finland" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "CA", name: "Canada" },
  { code: "TH", name: "Thailand" },
];

export interface EventFormValues {
  name: string;
  date: string;
  endDate: string;
  location: string;
  category: string;
  cageRequired: boolean;
  tireSize: string;
  skillLevel: string;
  participation: "drive" | "watch" | "both";
  description: string;
  safetyRequirements: string;
  requiredEquipment: string[];
  acceptsMedia: boolean;
  requiresEmergencyContact: boolean;
  eventUrl: string;
  organizer: string;
  contactEmail: string;
  lat: number | null;
  lng: number | null;
  track: string;
  country: string;
  series: string;
  price: string;
  maxParticipants: string;
  mediaUrls: string[];
}

export const emptyEventForm: EventFormValues = {
  name: "", date: "", endDate: "", location: "", category: "grassroots",
  cageRequired: false, tireSize: "unlimited", skillLevel: "all",
  participation: "both", description: "", safetyRequirements: "", requiredEquipment: [], acceptsMedia: false, requiresEmergencyContact: false,
  eventUrl: "", organizer: "", contactEmail: "",
  lat: null, lng: null,
  track: "", country: "", series: "", price: "",
  maxParticipants: "", mediaUrls: [],
};

const inputClass =
  "w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors";
const labelClass = "block text-xs text-muted uppercase tracking-wider font-medium mb-2";

export default function EventForm({
  initial,
  submitLabel,
  submitting,
  disabled = false,
  onSubmit,
}: {
  initial?: Partial<EventFormValues>;
  submitLabel: string;
  submitting: boolean;
  disabled?: boolean;
  onSubmit: (values: EventFormValues, newImages: File[]) => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<EventFormValues>({ ...emptyEventForm, ...initial });

  // New images picked in this session (not yet uploaded)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
  const [dragging, setDragging] = useState(false);

  const totalImages = form.mediaUrls.length + newImages.length;

  // Reverse geocode to auto-detect country from map pin
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const code = data?.address?.country_code?.toUpperCase();
      if (code) setForm((prev) => ({ ...prev, country: code }));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (form.lat == null || form.lng == null) return;
    const timer = setTimeout(() => reverseGeocode(form.lat!, form.lng!), 500);
    return () => clearTimeout(timer);
  }, [form.lat, form.lng, reverseGeocode]);

  const handleImageSelect = (files: File[]) => {
    const remaining = MAX_EVENT_IMAGES - totalImages;
    if (remaining <= 0) {
      toast(`Maximum ${MAX_EVENT_IMAGES} images per event`, "error");
      return;
    }
    for (const file of files.slice(0, remaining)) {
      const invalid = validateImage(file);
      if (invalid) { toast(invalid, "error"); continue; }
      const reader = new FileReader();
      reader.onload = (e) =>
        setNewImages((prev) => [...prev, { file, preview: e.target?.result as string }]);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) { toast("Please select a start date", "error"); return; }
    if (form.endDate && form.endDate < form.date) { toast("End date can't be before the start date", "error"); return; }
    if (form.lat == null || form.lng == null) { toast("Please pin the event location on the map", "error"); return; }
    onSubmit(form, newImages.map((i) => i.file));
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-5">
      {/* Event Name */}
      <div>
        <label className={labelClass}>Event Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Grassroots Drift Day - Round 3"
          className={inputClass}
        />
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Start Date *</label>
          <DatePicker
            value={form.date}
            onChange={(val) => setForm({ ...form, date: val })}
            placeholder="Pick start date"
          />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <DatePicker
            value={form.endDate}
            onChange={(val) => setForm({ ...form, endDate: val })}
            placeholder="Pick end date (optional)"
          />
        </div>
      </div>

      {/* Location text */}
      <div>
        <label className={labelClass}>Location *</label>
        <input
          type="text"
          required
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Track name, City, Country"
          className={inputClass}
        />
      </div>

      {/* Map Pin */}
      <div>
        <label className={labelClass}>Pin Location on Map *</label>
        <p className="text-xs text-muted-dark mb-2">Click the map to place a pin, then drag to adjust</p>
        <LocationPicker
          lat={form.lat}
          lng={form.lng}
          onChange={(lat, lng) => setForm((prev) => ({ ...prev, lat, lng }))}
        />
      </div>

      {/* Track / Venue & Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Track / Venue Name *</label>
          <input
            type="text"
            required
            value={form.track}
            onChange={(e) => setForm({ ...form, track: e.target.value })}
            placeholder="e.g. Ebisu Circuit"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Country {form.country && <span className="text-drift-orange normal-case">(auto-detected)</span>}</label>
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className={inputClass}
          >
            <option value="">Select country...</option>
            {COUNTRY_OPTIONS.map(({ code, name }) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Series & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Series Name</label>
          <input
            type="text"
            value={form.series}
            onChange={(e) => setForm({ ...form, series: e.target.value })}
            placeholder="e.g. Drift Masters (optional)"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Price</label>
          <input
            type="text"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. $50, Free, €45 (optional)"
            className={inputClass}
          />
        </div>
      </div>

      {/* Max Participants */}
      <div>
        <label className={labelClass}>Max Participants</label>
        <input
          type="number"
          min="1"
          value={form.maxParticipants}
          onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
          placeholder="Leave empty for unlimited"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={inputClass}
        >
          <option value="official">Official Championship</option>
          <option value="proam">Pro-Am</option>
          <option value="grassroots">Grassroots</option>
          <option value="practice">Practice Day</option>
        </select>
      </div>

      {/* Required car equipment */}
      <div>
        <label className={labelClass}>Required Car Equipment</label>
        <p className="text-xs text-muted-dark mb-2">
          Drivers&apos; cars are checked against these when they apply — cars missing an item can&apos;t be selected.
        </p>
        <div className="flex flex-wrap gap-2">
          {EVENT_REQUIREMENT_OPTIONS.map(({ key, label }) => {
            const active = form.requiredEquipment.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setForm((f) => ({
                  ...f,
                  requiredEquipment: active
                    ? f.requiredEquipment.filter((k) => k !== key)
                    : [...f.requiredEquipment, key],
                  // keep the legacy boolean in sync for map filters
                  cageRequired: key === "roll_cage" ? !active : f.cageRequired,
                }))}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  active
                    ? "bg-drift-orange text-white border-drift-orange"
                    : "bg-surface-lighter text-muted hover:text-foreground border-border"
                }`}
              >
                {active && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                )}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tire Size & Skill */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Max Tire Size</label>
          <select
            value={form.tireSize}
            onChange={(e) => setForm({ ...form, tireSize: e.target.value })}
            className={inputClass}
          >
            <option value="205">205 Max</option>
            <option value="225">225 Max</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Skill Level</label>
          <select
            value={form.skillLevel}
            onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
            className={inputClass}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced / Pro</option>
          </select>
        </div>
      </div>

      {/* Who Can Attend */}
      <div>
        <label className={labelClass}>Who Can Attend?</label>
        <div className="flex gap-2">
          {([
            { v: "drive" as const, l: "Drivers", active: "bg-drift-orange text-white" },
            { v: "watch" as const, l: "Spectators", active: "bg-drift-cyan text-white" },
            { v: "both" as const, l: "Both", active: "bg-purple-500 text-white" },
          ]).map(({ v, l, active }) => (
            <button
              key={v}
              type="button"
              onClick={() => setForm({ ...form, participation: v })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                form.participation === v ? active : "bg-surface-lighter text-muted hover:text-foreground border border-border"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Media applications */}
      <div>
        <label className={labelClass}>Media Applications</label>
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => setForm({ ...form, acceptsMedia: !form.acceptsMedia })}
            className={`relative w-12 h-7 rounded-full transition-colors ${form.acceptsMedia ? "bg-drift-cyan" : "bg-surface-lighter border border-border"}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${form.acceptsMedia ? "left-6" : "left-1"}`} />
          </button>
          <span className="text-sm text-muted">
            {form.acceptsMedia ? "Photographers & videographers can apply for a media pass" : "Not accepting media applications"}
          </span>
        </div>
      </div>

      {/* Emergency contact requirement */}
      <div>
        <label className={labelClass}>Require Emergency Contact</label>
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => setForm({ ...form, requiresEmergencyContact: !form.requiresEmergencyContact })}
            className={`relative w-12 h-7 rounded-full transition-colors ${form.requiresEmergencyContact ? "bg-drift-orange" : "bg-surface-lighter border border-border"}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${form.requiresEmergencyContact ? "left-6" : "left-1"}`} />
          </button>
          <span className="text-sm text-muted">
            {form.requiresEmergencyContact ? "Drivers must have an emergency contact on file to apply" : "Emergency contact optional for drivers"}
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Tell us about the event..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Safety Requirements */}
      <div>
        <label className={labelClass}>Safety Requirements</label>
        <textarea
          value={form.safetyRequirements}
          onChange={(e) => setForm({ ...form, safetyRequirements: e.target.value })}
          placeholder="Anything beyond car equipment — e.g. helmet mandatory, long sleeves, sound limit 98dB, no passengers under 18..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
        <p className="text-xs text-muted-dark mt-1.5">Drivers see this before applying — list everything their car and gear must have.</p>
      </div>

      {/* Event URL */}
      <div>
        <label className={labelClass}>Event URL / Social Link</label>
        <input
          type="url"
          value={form.eventUrl}
          onChange={(e) => setForm({ ...form, eventUrl: e.target.value })}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      {/* Organizer & Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Organizer Name *</label>
          <input
            type="text"
            required
            value={form.organizer}
            onChange={(e) => setForm({ ...form, organizer: e.target.value })}
            placeholder="Who organizes this event?"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Contact Email *</label>
          <input
            type="email"
            required
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Media */}
      <div>
        <label className={labelClass}>
          Event Photos <span className="normal-case text-muted-dark">({totalImages}/{MAX_EVENT_IMAGES} — first image is the cover)</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) handleImageSelect(files);
            e.target.value = "";
          }}
        />
        {totalImages > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {form.mediaUrls.map((url, i) => (
              <div key={url} className="relative aspect-video rounded-xl overflow-hidden border border-border">
                <img src={url} alt={`Event photo ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-drift-orange">Cover</span>
                )}
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, mediaUrls: prev.mediaUrls.filter((u) => u !== url) }))}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black flex items-center justify-center transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
            {newImages.map(({ preview }, i) => (
              <div key={preview.slice(-24) + i} className="relative aspect-video rounded-xl overflow-hidden border border-drift-orange/30">
                <img src={preview} alt="New upload" className="w-full h-full object-cover" />
                {form.mediaUrls.length === 0 && i === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-drift-orange">Cover</span>
                )}
                <button
                  type="button"
                  onClick={() => setNewImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black flex items-center justify-center transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        {totalImages < MAX_EVENT_IMAGES && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const files = Array.from(e.dataTransfer.files);
              if (files.length > 0) handleImageSelect(files);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragging ? "border-drift-orange bg-drift-orange/5" : "border-border hover:border-drift-orange/50"
            }`}
          >
            <svg className="mx-auto mb-3 text-muted-dark" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            <p className="text-sm text-muted-dark">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-dark mt-1">PNG, JPG up to 5MB each</p>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || disabled}
        className="w-full py-4 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold text-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-drift-orange/20 active:scale-[0.98] disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
