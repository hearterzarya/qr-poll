"use client";

import { QrCode, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function QrScanTrustIndicator({
  scanned,
  className,
}: {
  scanned?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2",
        scanned
          ? "border-green-500/30 bg-green-500/10"
          : "border-primary/25 bg-primary/5 qr-glow",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-md p-1.5",
          scanned ? "bg-green-500/20" : "bg-primary/15",
        )}
      >
        {scanned ? (
          <ShieldCheck className="h-4 w-4 text-green-400" />
        ) : (
          <QrCode className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="min-w-0">
        <p className="label-micro text-[9px]">
          {scanned ? "QR Verified" : "QR Help Point"}
        </p>
        <p className="text-xs font-medium text-foreground truncate">
          {scanned
            ? "Scan logged · Official help point"
            : "Secure highway reporting"}
        </p>
      </div>
    </div>
  );
}
