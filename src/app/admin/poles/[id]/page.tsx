"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrintableQRPlate } from "@/components/highway/printable-qr-plate";
import { LiveMapPanel } from "@/components/highway/live-map-panel";
import { KmMarkerBadge } from "@/components/highway/km-marker-badge";
import { HighwayRouteBadge } from "@/components/highway/highway-route-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/page-loading";
import { formatDate } from "@/lib/utils";
import { getPolePublicUrl } from "@/lib/qr";
import { PriorityBadge } from "@/components/highway/priority-badge";

export default function PoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [pole, setPole] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/poles/${id}`)
      .then((r) => r.json())
      .then((d) => setPole(d.pole));
  }, [id]);

  if (!pole) return <PageLoading rows={4} />;

  const reports = (pole.reports as Array<Record<string, unknown>>) || [];
  const poleCode = pole.poleCode as string;

  return (
    <div className="p-6 lg:p-8 space-y-8 pb-24 lg:pb-8 max-w-4xl">
      <Link
        href="/admin/poles"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        All Poles
      </Link>

      <div className="flex flex-wrap items-start gap-4 justify-between">
        <div>
          <p className="label-micro">QR Help Point</p>
          <p className="font-mono text-2xl font-bold text-primary heading-executive">
            {poleCode}
          </p>
          <p className="text-foreground mt-1 font-medium">
            {pole.highwayName as string}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <KmMarkerBadge km={String(pole.kmMarker)} />
            <HighwayRouteBadge route={pole.highwayName as string} />
            <Badge variant={pole.status === "ACTIVE" ? "success" : "outline"}>
              {pole.status as string}
            </Badge>
          </div>
        </div>
      </div>

      <Card variant="glass" className="overflow-hidden">
        <div className="warning-strip" />
        <CardHeader>
          <CardTitle className="heading-executive text-base">
            QR Plate Generator
          </CardTitle>
          <p className="text-xs text-muted-foreground font-mono break-all">
            {getPolePublicUrl(poleCode)}
          </p>
        </CardHeader>
        <CardContent>
          <PrintableQRPlate
            poleId={id}
            poleCode={poleCode}
            publicUrl={getPolePublicUrl(poleCode)}
          />
        </CardContent>
      </Card>

      <LiveMapPanel
        latitude={pole.latitude as number}
        longitude={pole.longitude as number}
        label={poleCode}
        sublabel={`KM ${pole.kmMarker as string} · ${pole.district as string}, ${pole.state as string}`}
      />

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-base">
            Recent Reports ({reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {reports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reports for this pole yet.</p>
          ) : (
            reports.map((r) => (
              <Link
                key={r.id as string}
                href={`/admin/reports/${r.id}`}
                className="block rounded-xl toll-card p-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm text-primary font-bold">
                    {r.reportCode as string}
                  </span>
                  {r.priority ? (
                    <PriorityBadge priority={r.priority as string} />
                  ) : null}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(r.createdAt as string)}
                </span>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
