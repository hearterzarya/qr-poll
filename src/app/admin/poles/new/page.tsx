"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewPolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    poleCode: "",
    highwayName: "",
    state: "",
    district: "",
    kmMarker: "",
    latitude: "",
    longitude: "",
    nearestLandmark: "",
    authorityName: "",
    contractorName: "",
    status: "ACTIVE",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/poles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      }),
    });

    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      toast.success("Pole created — QR ready to print");
      router.push(`/admin/poles/${data.pole.id}`);
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to create pole");
    }
  }

  const fields = [
    ["poleCode", "Pole Code", "NH44-UP-AGRA-0001", true],
    ["highwayName", "Highway Name", "NH-44", true],
    ["state", "State", "Uttar Pradesh", true],
    ["district", "District", "Agra", true],
    ["kmMarker", "KM Marker", "142.5", true],
    ["latitude", "Latitude", "27.1767", true],
    ["longitude", "Longitude", "78.0081", true],
    ["nearestLandmark", "Nearest Landmark", "", false],
    ["authorityName", "Authority Name", "", false],
    ["contractorName", "Contractor Name", "", false],
  ] as const;

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6 pb-24 lg:pb-8">
      <Link
        href="/admin/poles"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Register Highway Pole</CardTitle>
          <CardDescription>
            Creates a verified help point with instant QR code generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(([key, label, placeholder, required]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className="mt-2"
                  required={required}
                />
              </div>
            ))}
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => update("status", v)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full min-h-[48px]">
              Create Pole & Generate QR
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
