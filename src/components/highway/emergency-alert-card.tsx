"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Siren } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmergencyAlertCard({
  title = "Emergency Mode",
  description,
  className,
}: {
  title?: string;
  description: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-xl overflow-hidden border border-red-500/40 bg-red-500/10",
        className,
      )}
    >
      <div className="warning-strip-red" />
      <div className="p-4 flex gap-3">
        <div className="rounded-xl bg-red-500/20 p-2.5 shrink-0 emergency-pulse">
          <Siren className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <p className="font-bold text-red-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {title}
          </p>
          <p className="text-sm text-red-200/80 mt-1">{description}</p>
        </div>
      </div>
      <div className="warning-strip-red opacity-70" />
    </motion.div>
  );
}
