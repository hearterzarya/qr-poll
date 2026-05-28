import { MapPin } from "lucide-react";
import { VerifiedPoleBadge } from "./verified-pole-badge";
import { HighwayRouteBadge } from "./highway-route-badge";
import { KmMarkerBadge } from "./km-marker-badge";
import { cn } from "@/lib/utils";

type Pole = {
  poleCode: string;
  highwayName: string;
  state: string;
  district: string;
  kmMarker: string;
  nearestLandmark?: string | null;
  authorityName?: string | null;
};

export function PoleInfoCard({
  pole,
  showVerified = true,
  compact = false,
  className,
}: {
  pole: Pole;
  showVerified?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "reflective-panel reflective-border rounded-2xl overflow-hidden",
        className,
      )}
    >
      <div className="warning-strip" />
      <div className={cn("p-4 space-y-3", compact && "p-3 space-y-2")}>
        {showVerified && <VerifiedPoleBadge />}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="label-micro">Pole ID</p>
            <p className="font-mono text-base font-bold text-primary truncate">
              {pole.poleCode}
            </p>
          </div>
          <HighwayRouteBadge route={pole.highwayName} />
        </div>

        <h2
          className={cn(
            "heading-executive text-foreground",
            compact ? "text-base" : "text-lg",
          )}
        >
          {pole.highwayName}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <KmMarkerBadge km={pole.kmMarker} />
          <span className="text-xs text-muted-foreground">
            {pole.district}, {pole.state}
          </span>
        </div>

        {(pole.nearestLandmark || pole.authorityName) && (
          <div className="flex items-start gap-2 pt-1 border-t border-border/60">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-0.5">
              {pole.nearestLandmark && (
                <p>
                  <span className="text-foreground/80">Near </span>
                  {pole.nearestLandmark}
                </p>
              )}
              {pole.authorityName && (
                <p className="label-micro normal-case tracking-normal">
                  {pole.authorityName}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="warning-strip opacity-60" />
    </div>
  );
}
