/**
 * Canonical car equipment list — the items grassroots drift events
 * actually check at tech inspection. Cars declare what they have;
 * events declare what they require; the apply flow matches the two.
 */
export interface EquipmentItem {
  key: string;
  label: string;
  /** Can an event require this? (hydro is a spec, not a safety requirement) */
  eventRequirement: boolean;
}

export const CAR_EQUIPMENT: EquipmentItem[] = [
  { key: "roll_cage", label: "Roll Cage", eventRequirement: true },
  { key: "bucket_seat", label: "Bucket Seat", eventRequirement: true },
  { key: "harness", label: "Racing Harness", eventRequirement: true },
  { key: "fire_extinguisher", label: "Fire Extinguisher", eventRequirement: true },
  { key: "battery_tiedown", label: "Secured Battery", eventRequirement: true },
  { key: "tow_hooks", label: "Tow Hooks", eventRequirement: true },
  { key: "kill_switch", label: "Kill Switch", eventRequirement: true },
  { key: "catch_can", label: "Oil Catch Can", eventRequirement: true },
  { key: "hydraulic_handbrake", label: "Hydro Handbrake", eventRequirement: false },
];

export const EVENT_REQUIREMENT_OPTIONS = CAR_EQUIPMENT.filter((e) => e.eventRequirement);

const labelByKey = new Map(CAR_EQUIPMENT.map((e) => [e.key, e.label]));

export function equipmentLabel(key: string): string {
  return labelByKey.get(key) ?? key;
}

/** Requirement keys the car does NOT have. */
export function missingEquipment(carEquipment: string[], required: string[]): string[] {
  const has = new Set(carEquipment);
  return required.filter((r) => !has.has(r));
}
