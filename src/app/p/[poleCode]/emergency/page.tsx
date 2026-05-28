"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EMERGENCY_TYPES } from "@/lib/constants";
import { getEmergencyIcon } from "@/lib/category-icons";
import { CitizenShell } from "@/components/public/citizen-shell";
import { EmergencyCTA } from "@/components/public/emergency-cta";
import { EmergencyAlertCard } from "@/components/highway/emergency-alert-card";
import { cn } from "@/lib/utils";
import { useGeolocation } from "@/hooks/use-geolocation";

export default function EmergencyPage({
  params,
}: {
  params: Promise<{ poleCode: string }>;
}) {
  const { poleCode } = use(params);
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { requestLocation } = useGeolocation();

  async function submitEmergency(typeId: string) {
    setSubmitting(true);
    setSelected(typeId);

    const location = await requestLocation(true);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        poleCode,
        category: typeId,
        emergencyType: typeId,
        isEmergency: true,
        userLatitude: location?.latitude ?? null,
        userLongitude: location?.longitude ?? null,
        deviceInfo: navigator.userAgent,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (res.ok) {
      toast.success("Emergency alert dispatched to control room");
      router.push(
        `/p/${poleCode}/confirmation?code=${data.reportCode}&priority=${data.priority}&emergency=1`,
      );
    } else {
      toast.error(data.error || "Failed to send alert. Call 112 immediately.");
      setSelected(null);
    }
  }

  return (
    <CitizenShell backHref={`/p/${poleCode}`} showTrustBar={false}>
      <EmergencyAlertCard description="Tap one option. Control room alerted instantly. For immediate danger, call 112." />

      <div className="text-center py-1">
        <p className="label-micro text-destructive/80">Select incident type</p>
        <h1 className="heading-executive text-xl text-foreground mt-1">
          What happened?
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {EMERGENCY_TYPES.map((type, i) => {
          const Icon = getEmergencyIcon(type.id);
          const isActive = selected === type.id;
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => submitEmergency(type.id)}
              disabled={submitting}
              className={cn(
                "w-full min-h-[64px] rounded-xl border p-4 flex items-center gap-4 text-left transition-all active:scale-[0.98]",
                isActive
                  ? "border-destructive bg-destructive/20 shadow-lg shadow-destructive/20"
                  : "reflective-panel hover:border-destructive/40 hover:bg-destructive/5 safety-edge",
              )}
            >
              <div
                className={cn(
                  "rounded-xl p-2.5 shrink-0",
                  isActive ? "bg-destructive/30" : "bg-destructive/10",
                )}
              >
                <Icon className="h-6 w-6 text-destructive" />
              </div>
              <span className="font-semibold text-foreground text-base">
                {type.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {submitting && (
        <div className="flex items-center justify-center gap-3 py-4 rounded-xl glass border-destructive/30">
          <Loader2 className="h-6 w-6 animate-spin text-destructive" />
          <span className="text-sm font-medium text-destructive">
            Dispatching emergency alert…
          </span>
        </div>
      )}

      <div className="pt-2">
        <p className="label-micro text-center mb-3">Or call directly</p>
        <EmergencyCTA poleCode={poleCode} callsOnly />
      </div>
    </CitizenShell>
  );
}
