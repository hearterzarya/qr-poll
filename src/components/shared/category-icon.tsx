"use client";

import {
  AlertTriangle,
  Ban,
  Car,
  CircleDot,
  Construction,
  Droplets,
  Flame,
  HelpCircle,
  Lightbulb,
  PawPrint,
  Rabbit,
  Signpost,
  Truck,
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

export function ComplaintIcon({
  categoryId,
  className,
}: {
  categoryId: string;
  className?: string;
}) {
  const Icon = COMPLAINT_ICONS[categoryId] ?? Wrench;
  return <Icon className={className} />;
}

export function EmergencyIcon({
  typeId,
  className,
}: {
  typeId: string;
  className?: string;
}) {
  const Icon = EMERGENCY_ICONS[typeId] ?? AlertTriangle;
  return <Icon className={className} />;
}
