import {
  AlertTriangle,
  Flame,
  Car,
  Ban,
  Rabbit,
  HelpCircle,
  Lightbulb,
  Construction,
  CircleDot,
  Truck,
  PawPrint,
  Droplets,
  Signpost,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const EMERGENCY_ICONS: Record<string, LucideIcon> = {
  ACCIDENT: AlertTriangle,
  INJURY_MEDICAL: HelpCircle,
  FIRE: Flame,
  VEHICLE_STUCK: Car,
  ROAD_BLOCKED: Ban,
  ANIMAL_COLLISION: Rabbit,
  OTHER_EMERGENCY: AlertTriangle,
};

const COMPLAINT_ICONS: Record<string, LucideIcon> = {
  STREET_LIGHT: Lightbulb,
  POLE_DAMAGED: Construction,
  ROAD_DAMAGE: CircleDot,
  VEHICLE_BREAKDOWN: Truck,
  ANIMAL_OBSTRUCTION: PawPrint,
  WATERLOGGING: Droplets,
  SIGNBOARD: Signpost,
  OTHER_COMPLAINT: Wrench,
};

export function getEmergencyIcon(id: string): LucideIcon {
  return EMERGENCY_ICONS[id] ?? AlertTriangle;
}

export function getComplaintIcon(id: string): LucideIcon {
  return COMPLAINT_ICONS[id] ?? Wrench;
}
