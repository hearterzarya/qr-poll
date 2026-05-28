"use client";

import { useEffect } from "react";

export function QrScanLogger({ poleCode }: { poleCode: string }) {
  useEffect(() => {
    const deviceHash = localStorage.getItem("ps_device") || crypto.randomUUID();
    localStorage.setItem("ps_device", deviceHash);

    fetch("/api/qr-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ poleCode, deviceHash }),
    }).catch(() => {});
  }, [poleCode]);

  return null;
}
