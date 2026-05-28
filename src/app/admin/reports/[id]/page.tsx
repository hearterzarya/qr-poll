"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PriorityBadge, StatusBadge } from "@/components/highway/priority-badge";
import { LiveMapPanel } from "@/components/highway/live-map-panel";
import { ReportTimeline } from "@/components/highway/report-timeline";
import { KmMarkerBadge } from "@/components/highway/km-marker-badge";
import { HighwayRouteBadge } from "@/components/highway/highway-route-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoading } from "@/components/shared/page-loading";
import { ErrorState } from "@/components/shared/error-state";
import { formatDate } from "@/lib/utils";

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const fileRef = useRef<HTMLInputElement>(null);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);

  function load() {
    setError(false);
    fetch(`/api/admin/reports/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setReport(d.report);
        setStatus(d.report?.status || "");
      })
      .catch(() => setError(true));
  }

  useEffect(() => {
    load();
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .catch(() => {});
  }, [id]);

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message="Report not found or access denied." onRetry={load} />
      </div>
    );
  }

  if (!report) return <PageLoading rows={5} />;

  const pole = report.pole as Record<string, unknown>;
  const media = (report.media as Array<Record<string, string>>) || [];
  const logs = (report.statusLogs as Array<Record<string, unknown>>) || [];
  const poleLat = pole.latitude as number;
  const poleLng = pole.longitude as number;
  const userLat = report.userLatitude as number | null;
  const userLng = report.userLongitude as number | null;
  const isP1 = report.priority === "P1";

  async function updateStatus() {
    const res = await fetch(`/api/admin/reports/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });
    if (res.ok) {
      toast.success("Status updated");
      setNote("");
      load();
    } else toast.error("Failed to update");
  }

  async function assignReport() {
    if (!assigneeId) {
      toast.error("Select a team member");
      return;
    }
    const res = await fetch(`/api/admin/reports/${id}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedToId: assigneeId }),
    });
    if (res.ok) {
      toast.success("Report assigned");
      load();
    } else toast.error("Failed to assign");
  }

  async function addNote() {
    if (!note.trim()) return;
    const res = await fetch(`/api/admin/reports/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    if (res.ok) {
      toast.success("Note added");
      setNote("");
      load();
    }
  }

  async function uploadResolutionProof(file: File) {
    setUploadingProof(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/admin/reports/${id}/resolution-proof`, {
      method: "POST",
      body: formData,
    });
    setUploadingProof(false);
    if (res.ok) {
      toast.success("Resolution proof uploaded");
      load();
    } else {
      const data = await res.json();
      toast.error(data.error || "Upload failed");
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 pb-24 lg:pb-8 max-w-6xl">
      <Link
        href="/admin/reports"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        All Reports
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-micro">Report ID</p>
          <p className="font-mono text-2xl font-bold text-foreground heading-executive">
            {report.reportCode as string}
          </p>
          <p className="text-muted-foreground mt-1">
            {(report.category as string).replace(/_/g, " ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <PriorityBadge priority={report.priority as string} />
          <StatusBadge status={report.status as string} />
          <HighwayRouteBadge route={pole.highwayName as string} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="overflow-hidden">
            <div className={isP1 ? "warning-strip-red" : "warning-strip"} />
            <CardHeader>
              <CardTitle className="text-base heading-executive">
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="label-micro">Pole</p>
                  <p className="font-mono text-primary font-bold">
                    {pole.poleCode as string}
                  </p>
                </div>
                <KmMarkerBadge km={String(pole.kmMarker)} />
              </div>
              <p className="text-foreground font-medium">
                {pole.highwayName as string}
              </p>
              {report.description ? (
                <p className="text-muted-foreground border-l-2 border-amber-500/40 pl-3 safety-edge">
                  {String(report.description)}
                </p>
              ) : null}
              {report.userPhone ? (
                <p>
                  <span className="text-muted-foreground">Phone: </span>
                  {String(report.userPhone)}
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Created {formatDate(report.createdAt as string)}
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTimeline
                logs={logs.map((log) => ({
                  id: log.id as string,
                  newStatus: log.newStatus as string,
                  note: log.note as string | null,
                  createdAt: log.createdAt as string,
                }))}
              />
            </CardContent>
          </Card>

          {media.length > 0 && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base">
                  Evidence & Resolution ({media.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {media.map((m) => (
                    <a
                      key={m.id}
                      href={m.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-colors aspect-video"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.mediaUrl}
                        alt={m.fileName || "media"}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card variant="glass" className="overflow-hidden">
            <div className="warning-strip opacity-50" />
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                Resolution Proof Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Upload photo evidence after field resolution. Logged to report timeline.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadResolutionProof(file);
                  e.target.value = "";
                }}
              />
              <Button
                variant="glass"
                className="w-full min-h-[48px]"
                disabled={uploadingProof}
                onClick={() => fileRef.current?.click()}
              >
                {uploadingProof ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload Resolution Photo
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <LiveMapPanel
            title="Pole Location"
            latitude={poleLat}
            longitude={poleLng}
            label={pole.poleCode as string}
            sublabel={`KM ${pole.kmMarker as string}`}
            variant={isP1 ? "emergency" : "maintenance"}
          />
          {userLat && userLng && (
            <LiveMapPanel
              title="Citizen GPS"
              latitude={userLat}
              longitude={userLng}
              label="Reporter location"
              variant="emergency"
            />
          )}

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "NEW",
                    "VERIFIED",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "RESOLVED",
                    "REJECTED",
                    "DUPLICATE",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Add note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <div className="flex flex-col gap-2">
                <Button onClick={updateStatus} className="min-h-[44px]">
                  Update Status
                </Button>
                <Button variant="glass" onClick={addNote} className="min-h-[44px]">
                  Add Internal Note
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="toll-card">
            <CardHeader>
              <CardTitle className="text-base">Assign Field Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="secondary"
                className="w-full min-h-[44px]"
                onClick={assignReport}
              >
                Assign Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
