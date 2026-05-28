import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CitizenShell } from "@/components/public/citizen-shell";
import { PriorityBadge, StatusBadge } from "@/components/highway/priority-badge";
import { LiveMapPanel } from "@/components/highway/live-map-panel";
import { ReportTimeline } from "@/components/highway/report-timeline";
import { PoleInfoCard } from "@/components/highway/pole-info-card";
import { Button } from "@/components/ui/button";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ reportCode: string }>;
}) {
  const { reportCode } = await params;

  const report = await prisma.report.findUnique({
    where: { reportCode: decodeURIComponent(reportCode) },
    include: {
      pole: true,
      statusLogs: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!report) notFound();

  const isEmergency = report.priority === "P1";

  return (
    <CitizenShell showTrustBar={false}>
      <div className="space-y-1">
        <p className="label-micro">Track Report</p>
        <h1 className="heading-executive text-xl font-mono text-primary">
          {report.reportCode}
        </h1>
      </div>

      <div className="reflective-panel rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <p className="label-micro">Current Status</p>
          <StatusBadge status={report.status} />
        </div>
        <PriorityBadge priority={report.priority} />
        <p className="text-sm text-muted-foreground">
          {report.category.replace(/_/g, " ")}
        </p>
        {report.description && (
          <p className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-3">
            {report.description}
          </p>
        )}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Submitted {formatDate(report.createdAt)}
          </span>
        </div>
      </div>

      <PoleInfoCard pole={report.pole} showVerified compact />

      <LiveMapPanel
        title="Incident Location"
        latitude={report.pole.latitude}
        longitude={report.pole.longitude}
        label={report.pole.poleCode}
        sublabel={`${report.pole.highwayName} · KM ${report.pole.kmMarker}`}
        variant={isEmergency ? "emergency" : "maintenance"}
      />

      <div className="reflective-panel rounded-2xl p-4">
        <p className="label-micro mb-4">Status Timeline</p>
        <ReportTimeline
          logs={report.statusLogs.map((l) => ({
            id: l.id,
            newStatus: l.newStatus,
            note: l.note,
            createdAt: l.createdAt,
          }))}
        />
      </div>

      <Button asChild variant="glass" className="w-full min-h-[48px]">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </CitizenShell>
  );
}
