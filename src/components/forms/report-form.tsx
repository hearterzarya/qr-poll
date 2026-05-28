"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MediaUpload } from "@/components/forms/media-upload";
import { LocationPermissionCard } from "@/components/highway/location-permission-card";
import { useGeolocation } from "@/hooks/use-geolocation";

type Props = {
  poleCode: string;
  category: string;
  emergencyType?: string;
  isEmergency?: boolean;
  submitLabel?: string;
};

export function ReportForm({
  poleCode,
  category,
  emergencyType,
  isEmergency = false,
  submitLabel = "Submit Report",
}: Props) {
  const router = useRouter();
  const { coords, requestLocation, loading: geoLoading } = useGeolocation();
  const [description, setDescription] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [mediaUrls, setMediaUrls] = useState<
    { url: string; mediaType: "IMAGE" | "VIDEO"; fileName?: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const location = isEmergency
      ? await requestLocation(true)
      : coords
        ? coords
        : await requestLocation(false);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        poleCode,
        category,
        emergencyType,
        description: description || null,
        userPhone: userPhone || null,
        userLatitude: location?.latitude ?? null,
        userLongitude: location?.longitude ?? null,
        mediaUrls,
        isEmergency,
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : null,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(data.error || "Failed to submit report");
      return;
    }

    toast.success("Report submitted successfully");
    router.push(
      `/p/${encodeURIComponent(poleCode)}/confirmation?code=${data.reportCode}&priority=${data.priority}`,
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="reflective-panel rounded-2xl p-4 space-y-4">
        {!isEmergency && (
          <div>
            <Label htmlFor="description" className="label-micro">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the issue…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[96px] rounded-xl"
            />
          </div>
        )}

        <div>
          <Label className="label-micro flex items-center gap-2 mb-2">
            <Camera className="h-3.5 w-3.5 text-primary" />
            Photo / Video (optional)
          </Label>
          <MediaUpload onUploaded={setMediaUrls} />
        </div>

        <div>
          <Label htmlFor="phone" className="label-micro">
            Phone (optional)
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            className="mt-2 min-h-[48px]"
          />
        </div>
      </div>

      {!isEmergency && (
        <LocationPermissionCard
          onRequest={() => requestLocation(false)}
          loading={geoLoading}
          captured={!!coords}
        />
      )}

      <Button
        type="submit"
        size="xl"
        className="w-full min-h-[56px]"
        disabled={submitting}
      >
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}
