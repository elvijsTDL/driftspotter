"use client";

import { useState, useRef, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useToast } from "@/components/ui/Toast";
import { useDriverCars, type DriverCar } from "@/hooks/useProfile";
import { uploadImages, validateImage } from "@/lib/uploadMedia";
import { CAR_EQUIPMENT, equipmentLabel } from "@/lib/equipment";

const MAX_PHOTOS_PER_CAR = 6;

const inputClass =
  "w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors";
const labelClass = "block text-xs text-muted uppercase tracking-wider font-medium mb-2";

interface CarDraft {
  car: string;
  car_year: string;
  horsepower: string;
  mods: string;
  photos: string[];
  video_urls: string[];
  equipment: string[];
}

function isValidVideoUrl(url: string): boolean {
  return /^https?:\/\/\S+\.\S+/.test(url.trim());
}

function CarForm({
  userId,
  initial,
  saving,
  onSave,
  onCancel,
}: {
  userId: string;
  initial: CarDraft;
  saving: boolean;
  onSave: (draft: CarDraft) => void;
  onCancel?: () => void;
}) {
  const { toast } = useToast();
  const [draft, setDraft] = useState<CarDraft>(initial);
  const [uploading, setUploading] = useState(false);
  const [videoInput, setVideoInput] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  const addVideo = () => {
    const url = videoInput.trim();
    if (!url) return;
    if (!isValidVideoUrl(url)) { toast("That doesn't look like a valid link", "error"); return; }
    if (draft.video_urls.includes(url)) { toast("That video is already added", "error"); return; }
    setDraft((d) => ({ ...d, video_urls: [...d.video_urls, url] }));
    setVideoInput("");
  };
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);

  const handlePhotosUpload = async (files: File[]) => {
    const remaining = MAX_PHOTOS_PER_CAR - draft.photos.length;
    if (remaining <= 0) { toast(`Maximum ${MAX_PHOTOS_PER_CAR} photos per car`, "error"); return; }
    const selected = files.slice(0, remaining);
    for (const f of selected) {
      const invalid = validateImage(f);
      if (invalid) { toast(invalid, "error"); return; }
    }
    setUploading(true);
    const { urls, error } = await uploadImages(supabase, "profile-media", userId, selected);
    setUploading(false);
    if (error) { toast(error, "error"); return; }
    setDraft((d) => ({ ...d, photos: [...d.photos, ...urls] }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Car *</label>
          <input
            type="text"
            value={draft.car}
            onChange={(e) => setDraft({ ...draft, car: e.target.value })}
            placeholder="e.g. Nissan Silvia S14"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Horsepower</label>
          <input
            type="number"
            min="0"
            value={draft.horsepower}
            onChange={(e) => setDraft({ ...draft, horsepower: e.target.value })}
            placeholder="e.g. 420"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input
            type="text"
            value={draft.car_year}
            onChange={(e) => setDraft({ ...draft, car_year: e.target.value })}
            placeholder="Optional"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Equipment <span className="normal-case text-muted-dark">(what&apos;s in the car — events check these)</span></label>
        <div className="flex flex-wrap gap-2">
          {CAR_EQUIPMENT.map(({ key, label }) => {
            const active = draft.equipment.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setDraft((d) => ({
                  ...d,
                  equipment: active ? d.equipment.filter((k) => k !== key) : [...d.equipment, key],
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

      <div>
        <label className={labelClass}>Mods / Setup</label>
        <textarea
          value={draft.mods}
          onChange={(e) => setDraft({ ...draft, mods: e.target.value })}
          placeholder="Engine, suspension, angle kit..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>Photos <span className="normal-case text-muted-dark">({draft.photos.length}/{MAX_PHOTOS_PER_CAR})</span></label>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) handlePhotosUpload(files);
            e.target.value = "";
          }}
        />
        <div className="grid grid-cols-3 gap-3">
          {draft.photos.map((url) => (
            <div key={url} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
              <img src={url} alt="Car" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, photos: d.photos.filter((u) => u !== url) }))}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black flex items-center justify-center transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          {draft.photos.length < MAX_PHOTOS_PER_CAR && (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={uploading}
              className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-drift-orange/50 flex flex-col items-center justify-center text-muted-dark transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <span className="text-xs">Uploading...</span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-[10px] mt-1">Add photo</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Videos <span className="normal-case text-muted-dark">(YouTube, Instagram, TikTok links)</span></label>
        {draft.video_urls.length > 0 && (
          <div className="space-y-1.5 mb-2">
            {draft.video_urls.map((url) => (
              <div key={url} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-lighter border border-border">
                <svg className="text-drift-cyan flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                <span className="text-[11px] text-muted truncate flex-1">{url}</span>
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, video_urls: d.video_urls.filter((u) => u !== url) }))}
                  className="text-muted-dark hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="url"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            placeholder="Paste a video link..."
            className={inputClass}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addVideo(); }
            }}
          />
          <button
            type="button"
            onClick={addVideo}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-lighter text-muted hover:text-drift-cyan border border-border hover:border-drift-cyan/40 transition-colors flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (!draft.car.trim()) { toast("Car name is required", "error"); return; }
            onSave(draft);
          }}
          disabled={saving || uploading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-drift-orange text-white hover:bg-drift-orange-light transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Car"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default function CarGarage({ userId }: { userId: string }) {
  const { toast } = useToast();
  const { cars, loading, addCar, updateCar, deleteCar, setPrimary } = useDriverCars(userId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const handleAdd = async (draft: CarDraft) => {
    setSaving(true);
    const { error } = await addCar({
      car: draft.car.trim(),
      car_year: draft.car_year || null,
      horsepower: draft.horsepower ? parseInt(draft.horsepower) : null,
      mods: draft.mods || null,
      photos: draft.photos,
      video_urls: draft.video_urls,
      equipment: draft.equipment,
    });
    setSaving(false);
    if (error) toast(error, "error");
    else { setAdding(false); toast("Car added to your garage!"); }
  };

  const handleUpdate = async (carId: string, draft: CarDraft) => {
    setSaving(true);
    const { error } = await updateCar(carId, {
      car: draft.car.trim(),
      car_year: draft.car_year || null,
      horsepower: draft.horsepower ? parseInt(draft.horsepower) : null,
      mods: draft.mods || null,
      photos: draft.photos,
      video_urls: draft.video_urls,
      equipment: draft.equipment,
    });
    setSaving(false);
    if (error) toast(error, "error");
    else { setEditingId(null); toast("Car updated!"); }
  };

  const handleDelete = async (car: DriverCar) => {
    if (confirmingDelete !== car.id) {
      setConfirmingDelete(car.id);
      toast("Click Remove again to confirm", "error");
      return;
    }
    setConfirmingDelete(null);
    const { error } = await deleteCar(car.id);
    if (error) toast(error, "error");
    else toast("Car removed");
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="h-24 bg-surface-lighter rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">
          Garage <span className="text-muted-dark normal-case font-normal">({cars.length} {cars.length === 1 ? "car" : "cars"})</span>
        </h3>
        {!adding && (
          <button
            type="button"
            onClick={() => { setAdding(true); setEditingId(null); }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-drift-orange/10 text-drift-orange hover:bg-drift-orange/20 border border-drift-orange/20 transition-colors"
          >
            + Add Car
          </button>
        )}
      </div>

      {cars.length === 0 && !adding && (
        <div className="text-center py-6">
          <p className="text-sm text-muted mb-1">Your garage is empty.</p>
          <p className="text-xs text-muted-dark">Add your car so organizers can see what you&apos;re bringing when you apply.</p>
        </div>
      )}

      {adding && (
        <div className="p-4 rounded-xl border border-drift-orange/30 bg-drift-orange/5">
          <p className="text-xs text-drift-orange font-semibold uppercase tracking-wider mb-4">New Car</p>
          <CarForm
            userId={userId}
            initial={{ car: "", car_year: "", horsepower: "", mods: "", photos: [], video_urls: [], equipment: [] }}
            saving={saving}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {cars.map((car) => (
        <div key={car.id} className="p-4 rounded-xl bg-surface-lighter/40 border border-border">
          {editingId === car.id ? (
            <CarForm
              userId={userId}
              initial={{
                car: car.car,
                car_year: car.car_year ?? "",
                horsepower: car.horsepower != null ? String(car.horsepower) : "",
                mods: car.mods ?? "",
                photos: car.photos,
                video_urls: car.video_urls ?? [],
                equipment: car.equipment ?? [],
              }}
              saving={saving}
              onSave={(draft) => handleUpdate(car.id, draft)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-start gap-4">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-surface-lighter flex-shrink-0">
                {car.photos[0] ? (
                  <img src={car.photos[0]} alt={car.car} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full carbon-bg flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                      <path d="M5 17h14l-1.5-4.5a2 2 0 00-1.9-1.5H8.4a2 2 0 00-1.9 1.5z" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="16.5" cy="17.5" r="1.5" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {car.car_year ? `${car.car_year} ` : ""}{car.car}
                  </p>
                  {car.horsepower != null && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-drift-cyan/10 text-drift-cyan border border-drift-cyan/20">
                      {car.horsepower} HP
                    </span>
                  )}
                  {car.is_primary && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-drift-orange/10 text-drift-orange border border-drift-orange/20">
                      Default
                    </span>
                  )}
                </div>
                {car.mods && <p className="text-xs text-muted mt-1 line-clamp-2">{car.mods}</p>}
                {(car.equipment?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {car.equipment.map((key) => (
                      <span key={key} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-badge-grassroots/10 text-badge-grassroots border border-badge-grassroots/20">
                        {equipmentLabel(key)}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-muted-dark mt-1">
                  {car.photos.length} {car.photos.length === 1 ? "photo" : "photos"}
                  {(car.video_urls?.length ?? 0) > 0 && ` · ${car.video_urls.length} ${car.video_urls.length === 1 ? "video" : "videos"}`}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!car.is_primary && (
                  <button
                    type="button"
                    onClick={async () => { const { error } = await setPrimary(car.id); if (error) toast(error, "error"); }}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-muted hover:text-drift-orange border border-border hover:border-drift-orange/40 transition-colors"
                    title="Preselected when you apply — you can still pick any car per application"
                  >
                    Make Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setEditingId(car.id); setAdding(false); }}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-muted hover:text-foreground border border-border transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(car)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-muted hover:text-red-400 border border-border hover:border-red-500/40 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <p className="text-xs text-muted-dark">
        Your <span className="text-drift-orange">default</span> car is preselected when you apply — you can pick any car on each application.
      </p>
    </div>
  );
}
