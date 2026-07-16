"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDriverCars } from "@/hooks/useProfile";
import { useToast } from "@/components/ui/Toast";
import ApplyCarPicker from "@/components/ApplyCarPicker";
import type { UserApplication } from "@/hooks/useEventRsvp";

/**
 * Shows what you applied with (car + note) under the application status,
 * with in-place editing while the application is still pending.
 */
export default function ApplicationDetails({
  application,
  requiredEquipment,
  canEdit,
  onSave,
}: {
  application: UserApplication;
  requiredEquipment?: string[];
  canEdit: boolean;
  onSave: (message: string | null, carId: string | null) => Promise<void>;
}) {
  const { user } = useAuth();
  const { cars } = useDriverCars(user?.id ?? null);
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [carId, setCarId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const appliedCar = application.carId ? cars.find((c) => c.id === application.carId) : null;

  const startEditing = () => {
    setMessage(application.message ?? "");
    setCarId(application.carId);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(message.trim() || null, carId);
    setSaving(false);
    setEditing(false);
    toast("Application updated!");
  };

  const isMedia = application.role === "media";

  if (editing) {
    return (
      <div className="mt-3 p-4 rounded-xl bg-surface-lighter/40 border border-border space-y-3">
        {!isMedia && <ApplyCarPicker selectedCarId={carId} onSelect={setCarId} requiredEquipment={requiredEquipment} />}
        <div>
          <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">Note to the organizer</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell the organizer why you'd like to attend (optional)..."
            rows={3}
            className="w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors resize-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-drift-orange text-white hover:bg-drift-orange-light transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 rounded-xl bg-surface-lighter/40 border border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          {isMedia ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted">Applying as:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-drift-cyan/10 text-drift-cyan border border-drift-cyan/20 uppercase tracking-wider">
                Media
              </span>
            </div>
          ) : appliedCar ? (
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="text-muted">Applying with:</span>
              <span className="font-semibold text-foreground">
                {appliedCar.car_year ? `${appliedCar.car_year} ` : ""}{appliedCar.car}
              </span>
              {appliedCar.horsepower != null && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-drift-cyan/10 text-drift-cyan border border-drift-cyan/20">
                  {appliedCar.horsepower} HP
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">No car attached to this application.</p>
          )}
          {application.message ? (
            <p className="text-xs text-muted-dark italic">Your note: &ldquo;{application.message}&rdquo;</p>
          ) : (
            <p className="text-xs text-muted-dark">No note added.</p>
          )}
        </div>
        {canEdit && (
          <button
            onClick={startEditing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-lighter text-muted hover:text-drift-orange border border-border hover:border-drift-orange/40 transition-colors flex-shrink-0"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
