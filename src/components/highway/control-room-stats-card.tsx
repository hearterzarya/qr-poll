"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const accents = {
  cyan: {
    icon: "text-primary bg-primary/12 border-primary/20",
    value: "text-foreground",
    border: "border-primary/15",
  },
  red: {
    icon: "text-red-400 bg-red-500/15 border-red-500/25",
    value: "text-red-400",
    border: "border-red-500/25",
  },
  amber: {
    icon: "text-amber-400 bg-amber-500/15 border-amber-500/25",
    value: "text-amber-400",
    border: "border-amber-500/20",
  },
  green: {
    icon: "text-green-400 bg-green-500/15 border-green-500/25",
    value: "text-green-400",
    border: "border-green-500/20",
  },
};

export function ControlRoomStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "cyan",
  alert,
  index = 0,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: keyof typeof accents;
  alert?: boolean;
  index?: number;
}) {
  const a = accents[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={cn(
        "glass-strong rounded-xl p-5 border transition-all hover:shadow-xl hover:shadow-primary/5",
        a.border,
        alert && "border-red-500/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <p className="label-micro">{title}</p>
          <p className={cn("text-3xl font-bold tabular-nums heading-executive", a.value)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl p-2.5 border shrink-0",
            a.icon,
            alert && "map-pin-pulse",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {alert && (
        <div className="warning-strip-red mt-3 rounded-sm opacity-80" />
      )}
    </motion.div>
  );
}
