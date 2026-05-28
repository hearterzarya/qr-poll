"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { PriorityBadge } from "./priority-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReportSuccessCard({
  reportCode,
  priority,
  isEmergency,
  poleCode,
  className,
}: {
  reportCode: string;
  priority?: string;
  isEmergency?: boolean;
  poleCode: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("space-y-5", className)}
    >
      <div className="flex flex-col items-center text-center pt-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "rounded-full p-5 mb-4 reflective-border",
            isEmergency ? "bg-destructive/15" : "bg-green-500/15",
          )}
        >
          <CheckCircle2
            className={cn(
              "h-14 w-14",
              isEmergency ? "text-destructive" : "text-green-400",
            )}
          />
        </motion.div>
        <h1 className="heading-executive text-2xl text-foreground">
          {isEmergency ? "Emergency Alert Sent" : "Report Submitted"}
        </h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-xs">
          {isEmergency
            ? "Highway control room notified. Field teams dispatched."
            : "Registered with highway authority network."}
        </p>
      </div>

      <div className="reflective-panel reflective-border rounded-2xl overflow-hidden">
        <div className="warning-strip" />
        <div className="p-6 text-center space-y-3">
          <p className="label-micro">Your Report ID</p>
          <p className="text-3xl font-mono font-bold text-primary tracking-wide">
            {reportCode}
          </p>
          {priority && <PriorityBadge priority={priority} />}
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Copy className="h-3 w-3" />
            Save this ID to track status
          </p>
        </div>
        <div className="warning-strip opacity-50" />
      </div>

      <div className="space-y-2.5">
        <Button asChild size="lg" className="w-full min-h-[54px]">
          <Link href={`/track/${reportCode}`}>
            Track Report Status
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="glass" size="lg" className="w-full min-h-[48px]">
          <Link href={`/p/${poleCode}`}>Back to Help Point</Link>
        </Button>
      </div>
    </motion.div>
  );
}
