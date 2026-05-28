import { ReportPriority } from "@/generated/prisma";

const P1_CATEGORIES = new Set([
  "ACCIDENT",
  "INJURY_MEDICAL",
  "FIRE",
  "ROAD_BLOCKED",
  "ANIMAL_COLLISION",
  "MEDICAL_EMERGENCY",
  "OTHER_EMERGENCY",
  "VEHICLE_STUCK",
]);

const P2_CATEGORIES = new Set([
  "POLE_DAMAGED",
  "STREET_LIGHT",
  "ROAD_DAMAGE",
  "WATERLOGGING",
  "ANIMAL_OBSTRUCTION",
  "SIGNBOARD",
]);

const P1_KEYWORDS = [
  "accident",
  "injury",
  "fire",
  "blocked",
  "collision",
  "medical",
  "emergency",
  "stuck",
];

const P2_KEYWORDS = [
  "pole damaged",
  "light not",
  "pothole",
  "waterlog",
  "animal",
  "fallen tree",
  "signboard",
];

export function calculatePriority(
  category: string,
  emergencyType?: string | null,
  description?: string | null,
): ReportPriority {
  const key = (emergencyType || category).toUpperCase();
  if (P1_CATEGORIES.has(key)) return ReportPriority.P1;

  const desc = (description || "").toLowerCase();
  if (P1_KEYWORDS.some((w) => desc.includes(w))) return ReportPriority.P1;

  if (P2_CATEGORIES.has(key)) return ReportPriority.P2;
  if (P2_KEYWORDS.some((w) => desc.includes(w))) return ReportPriority.P2;

  return ReportPriority.P3;
}

export function priorityColor(priority: ReportPriority | string): string {
  switch (priority) {
    case "P1":
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case "P2":
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/40";
  }
}

