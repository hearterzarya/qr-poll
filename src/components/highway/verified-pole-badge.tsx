import { BadgeCheck, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedPoleBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5",
        "reflective-border shadow-sm shadow-cyan-500/10",
        className,
      )}
    >
      <div className="rounded-md bg-cyan-500/20 p-1">
        <BadgeCheck className="h-4 w-4 text-cyan-400" />
      </div>
      <div>
        <p className="label-micro text-cyan-400/90 leading-none">
          Verified
        </p>
        <p className="text-xs font-bold text-foreground leading-tight mt-0.5">
          Highway Help Point
        </p>
      </div>
      <Shield className="h-3.5 w-3.5 text-cyan-500/60 ml-1" />
    </div>
  );
}
