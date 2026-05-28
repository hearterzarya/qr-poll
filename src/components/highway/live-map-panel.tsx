"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGoogleMapsLink } from "@/lib/maps";
import { cn } from "@/lib/utils";

export function LiveMapPanel({
  title = "Live Map",
  latitude,
  longitude,
  label,
  sublabel,
  variant = "default",
  className,
}: {
  title?: string;
  latitude: number;
  longitude: number;
  label?: string;
  sublabel?: string;
  variant?: "default" | "emergency" | "maintenance";
  className?: string;
}) {
  const mapUrl = getGoogleMapsLink(latitude, longitude);
  const pinColor =
    variant === "emergency"
      ? "text-destructive border-destructive bg-destructive/20 shadow-destructive/30"
      : variant === "maintenance"
        ? "text-amber-400 border-amber-500 bg-amber-500/20 shadow-amber-500/20"
        : "text-primary border-primary bg-primary/20 shadow-primary/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-strong rounded-xl overflow-hidden border border-primary/15",
        className,
      )}
    >
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <p className="label-micro text-primary/80 flex items-center gap-2">
          <Navigation className="h-3.5 w-3.5" />
          {title}
        </p>
        {variant === "emergency" && (
          <span className="live-dot h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>

      <div className="relative mx-4 h-36 rounded-xl map-grid border border-primary/10 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          preserveAspectRatio="none"
        >
          <line
            x1="10%"
            y1="70%"
            x2="90%"
            y2="30%"
            stroke="#00D4FF"
            strokeWidth="2"
            strokeDasharray="6 4"
            className="route-line-animate"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/90 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={cn(
              "rounded-full p-2.5 border-2 shadow-lg map-pin-pulse pin-drop",
              pinColor,
            )}
          >
            <MapPin className="h-6 w-6" />
          </div>
          {label && (
            <p className="text-xs font-mono text-primary mt-2 font-bold">{label}</p>
          )}
        </div>
        {variant === "emergency" && (
          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 live-dot" />
        )}
      </div>

      {sublabel && (
        <p className="text-xs text-muted-foreground px-4 py-2">{sublabel}</p>
      )}

      <div className="p-4 pt-2">
        <Button asChild variant="glass" size="sm" className="w-full min-h-[44px]">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
