"use client";

import Image from "next/image";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRPlatePreview } from "./qr-plate-preview";

export function PrintableQRPlate({
  poleCode,
  publicUrl,
}: {
  poleCode: string;
  publicUrl: string;
}) {
  const encodedCode = encodeURIComponent(poleCode);
  const qrImageUrl = `/api/poles/${encodedCode}/qr?format=png&v=2`;

  return (
    <div className="space-y-6">
      <QRPlatePreview
        poleCode={poleCode}
        qrImageUrl={qrImageUrl}
        publicUrl={publicUrl}
      />

      <div id="qr-print-plate" className="hidden print:block">
        <div className="bg-white text-[#07111F] p-8 max-w-md mx-auto border-8 border-[#07111F]">
          <div className="h-3 bg-amber-500 mb-4" />
          <h2 className="text-center font-black text-xl uppercase tracking-wider">
            Highway Help Point
          </h2>
          <p className="text-center text-sm mt-2 text-slate-600">
            National Highway · Citizen Safety QR
          </p>
          <ul className="text-xs mt-4 space-y-1 text-center text-slate-700">
            <li>• Accident & Medical Emergency</li>
            <li>• Street Light / Pole Damage</li>
            <li>• Road Damage & Breakdown</li>
            <li>• Maintenance Complaints</li>
          </ul>
          <div className="flex justify-center my-6">
            <Image
              src={qrImageUrl}
              alt={`QR ${poleCode}`}
              width={220}
              height={220}
              unoptimized
            />
          </div>
          <p className="text-center font-mono font-bold text-lg">
            Pole ID: {poleCode}
          </p>
          <p className="text-center text-sm font-bold text-red-600 mt-3">
            Emergency Helpline: 1033 · 112
          </p>
          <p className="text-center text-[10px] mt-4 text-slate-500 break-all">
            {publicUrl}
          </p>
          <div className="h-3 bg-amber-500 mt-6" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button asChild size="sm">
          <a href={`/api/poles/${encodedCode}/qr?format=png&v=2`} download>
            <Download className="h-4 w-4" />
            Download PNG
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={`/api/poles/${encodedCode}/qr?format=svg&v=2`} download>
            Download SVG
          </a>
        </Button>
        <Button size="sm" variant="secondary" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print Plate
        </Button>
      </div>
    </div>
  );
}
