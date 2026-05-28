"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Siren } from "lucide-react";
import { PriorityBadge } from "./priority-badge";
import { cn } from "@/lib/utils";

export function AlertTicketCard({
  id,
  reportCode,
  category,
  priority,
  meta,
  variant = "emergency",
  index = 0,
}: {
  id: string;
  reportCode: string;
  category: string;
  priority: string;
  meta: string;
  variant?: "emergency" | "maintenance" | "critical";
  index?: number;
}) {
  const isEmergency = variant === "emergency" || variant === "critical";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/admin/reports/${id}`}
        className={cn(
          "group flex items-center gap-3 rounded-xl border p-4 min-h-[76px] transition-all",
          isEmergency
            ? "border-red-500/30 bg-red-500/8 hover:border-red-500/50 hover:bg-red-500/12 safety-edge"
            : "glass border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5",
        )}
      >
        <div
          className={cn(
            "rounded-xl p-2.5 shrink-0",
            isEmergency ? "bg-red-500/20" : "bg-amber-500/15",
          )}
        >
          <Siren
            className={cn(
              "h-5 w-5",
              isEmergency ? "text-red-400" : "text-amber-400",
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-foreground">
              {reportCode}
            </span>
            <PriorityBadge priority={priority} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {category}
          </p>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5 truncate">
            {meta}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0" />
      </Link>
    </motion.div>
  );
}
