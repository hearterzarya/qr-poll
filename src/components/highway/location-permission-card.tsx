"use client";

import { Loader2, MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LocationPermissionCard({
  onRequest,
  loading,
  captured,
  className,
}: {
  onRequest: () => void;
  loading?: boolean;
  captured?: boolean;
  className?: string;
}) {
  if (captured) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-xl border border-green-500/30 bg-green-500/10 p-3 flex items-center gap-3",
          className,
        )}
      >
        <div className="rounded-full bg-green-500/20 p-2 pin-drop">
          <MapPin className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-green-400">Location captured</p>
          <p className="text-xs text-muted-foreground">
            GPS shared with highway control room
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "reflective-panel rounded-xl p-4 space-y-3 border border-primary/20",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/15 p-2.5 map-pin-pulse">
          <Navigation className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="label-micro text-primary/80">Location</p>
          <p className="text-sm font-semibold text-foreground">
            Share GPS for faster response
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Helps field teams reach the exact spot
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="glass"
        className="w-full min-h-[52px]"
        onClick={onRequest}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4 text-primary" />
        )}
        Enable Location
      </Button>
    </div>
  );
}
