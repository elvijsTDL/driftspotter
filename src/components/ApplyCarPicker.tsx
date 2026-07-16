"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useDriverCars } from "@/hooks/useProfile";
import { missingEquipment, equipmentLabel } from "@/lib/equipment";

/**
 * "Which car are you bringing?" — shown in the apply form for drivable
 * events. Cars that don't meet the event's equipment requirements are
 * excluded from selection, with the missing items spelled out.
 */
export default function ApplyCarPicker({
  selectedCarId,
  onSelect,
  requiredEquipment = [],
}: {
  selectedCarId: string | null;
  onSelect: (carId: string | null) => void;
  requiredEquipment?: string[];
}) {
  const { user } = useAuth();
  const { cars, loading } = useDriverCars(user?.id ?? null);

  const carsWithEligibility = useMemo(
    () => cars.map((car) => ({
      car,
      missing: missingEquipment(car.equipment ?? [], requiredEquipment),
    })),
    [cars, requiredEquipment]
  );

  const eligible = carsWithEligibility.filter((c) => c.missing.length === 0);

  // Preselect the default car among those that actually qualify
  useEffect(() => {
    if (loading || cars.length === 0) return;
    const selectedStillEligible = eligible.some((c) => c.car.id === selectedCarId);
    if (selectedCarId && selectedStillEligible) return;
    const preferred = eligible.find((c) => c.car.is_primary) ?? eligible[0];
    onSelect(preferred ? preferred.car.id : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, cars, requiredEquipment]);

  if (!user || loading || cars.length === 0) return null;

  return (
    <div>
      <label className="block text-xs text-muted uppercase tracking-wider font-medium mb-2">
        Which car are you bringing?
      </label>
      <div className="flex flex-wrap gap-2">
        {carsWithEligibility.map(({ car, missing }) => {
          const disabled = missing.length > 0;
          return (
            <button
              key={car.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(car.id)}
              title={disabled ? `Missing: ${missing.map(equipmentLabel).join(", ")}` : undefined}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                disabled
                  ? "bg-surface-lighter/40 text-muted-dark border-border line-through cursor-not-allowed"
                  : selectedCarId === car.id
                    ? "bg-drift-orange text-white border-drift-orange"
                    : "bg-surface-lighter text-muted hover:text-foreground border-border"
              }`}
            >
              {car.car_year ? `${car.car_year} ` : ""}{car.car}
              {car.horsepower != null && (
                <span className={selectedCarId === car.id && !disabled ? "text-white/80" : "text-drift-cyan"}> · {car.horsepower} hp</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explain exclusions */}
      {carsWithEligibility.some((c) => c.missing.length > 0) && (
        <p className="text-[11px] text-muted-dark mt-2">
          Crossed-out cars don&apos;t meet this event&apos;s requirements
          {eligible.length === 0 ? "" : " — hover to see what's missing"}.
        </p>
      )}
      {eligible.length === 0 && (
        <div className="mt-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
          <p className="text-xs text-red-400 leading-relaxed">
            None of your cars meet this event&apos;s equipment requirements
            {" "}({requiredEquipment.map(equipmentLabel).join(", ")}).
            You can still apply without a car, or{" "}
            <Link href="/profile" className="underline hover:text-red-300">update your garage</Link>{" "}
            if your car actually has these.
          </p>
        </div>
      )}
    </div>
  );
}
