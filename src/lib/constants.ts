export const APP_NAME = "PoleSafe QR";
export const APP_TAGLINE = "Every Highway Pole Becomes an Emergency Help Point";
export const LOGO_PATH = "/images/logo.png";

export const HELPLINE_1033 = "1033";
export const HELPLINE_112 = "112";

export const EMERGENCY_TYPES = [
  { id: "ACCIDENT", label: "Accident" },
  { id: "INJURY_MEDICAL", label: "Injury / Medical Help" },
  { id: "FIRE", label: "Fire" },
  { id: "VEHICLE_STUCK", label: "Vehicle Stuck" },
  { id: "ROAD_BLOCKED", label: "Road Blocked" },
  { id: "ANIMAL_COLLISION", label: "Animal Collision" },
  { id: "OTHER_EMERGENCY", label: "Other Emergency" },
] as const;

export const COMPLAINT_CATEGORIES = [
  { id: "STREET_LIGHT", label: "Street Light Not Working" },
  { id: "POLE_DAMAGED", label: "Pole Damaged" },
  { id: "ROAD_DAMAGE", label: "Road Damage / Pothole" },
  { id: "VEHICLE_BREAKDOWN", label: "Vehicle Breakdown" },
  { id: "ANIMAL_OBSTRUCTION", label: "Animal / Obstruction on Road" },
  { id: "WATERLOGGING", label: "Waterlogging" },
  { id: "SIGNBOARD", label: "Signboard Issue" },
  { id: "OTHER_COMPLAINT", label: "Other Complaint" },
] as const;

export const REPORT_STATUSES = [
  "NEW",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
  "DUPLICATE",
] as const;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];
