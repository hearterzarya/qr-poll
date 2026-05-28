"use client";

import Image from "next/image";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export function QRPlatePreview({
  poleCode,
  qrImageUrl,
  publicUrl,
  className,
}: {
  poleCode: string;
  qrImageUrl: string;
  publicUrl: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative max-w-[280px] mx-auto rounded-xl overflow-hidden",
        "border-4 border-[#07111F] bg-white shadow-2xl qr-glow",
        className,
      )}
    >
      <div className="warning-strip-red" />
      <div className="p-5 text-[#07111F]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="h-5 w-5 text-[#0B1F3A]" />
          <h3 className="font-bold text-sm uppercase tracking-wide text-center">
            Highway Help Point
          </h3>
        </div>
        <p className="text-[10px] text-center text-slate-600 mb-3">
          Scan for emergency & maintenance reporting
        </p>
        <div className="flex justify-center my-3 p-2 bg-white rounded-lg border-2 border-dashed border-slate-300">
          <Image
            src={qrImageUrl}
            alt={`QR ${poleCode}`}
            width={160}
            height={160}
            className="rounded"
            unoptimized
          />
        </div>
        <p className="text-center font-mono font-bold text-xs border-t border-slate-200 pt-2">
          {poleCode}
        </p>
        <p className="text-center text-[10px] font-bold text-red-600 mt-2">
          Emergency: 1033 / 112
        </p>
        <p className="text-[9px] text-center text-slate-500 mt-1 break-all line-clamp-2">
          {publicUrl}
        </p>
      </div>
      <div className="warning-strip h-2" />
    </div>
  );
}
