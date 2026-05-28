"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, QrCode, MapPin } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { KmMarkerBadge } from "@/components/highway/km-marker-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/shared/page-loading";
import { EmptyState } from "@/components/shared/empty-state";

type Pole = {
  id: string;
  poleCode: string;
  highwayName: string;
  district: string;
  state: string;
  kmMarker: string;
  status: string;
  _count: { reports: number };
};

export default function PolesPage() {
  const [poles, setPoles] = useState<Pole[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/poles")
      .then((r) => r.json())
      .then((d) => setPoles(d.poles || []));
  }, []);

  if (poles === null) return <PageLoading rows={5} />;

  return (
    <div className="p-6 lg:p-8 space-y-6 pb-24 lg:pb-8">
      <AdminHeader
        title="QR Pole Network"
        description={`${poles.length} highway help points · toll-plaza style deployment`}
        action={
          <Button asChild className="min-h-[44px]">
            <Link href="/admin/poles/new">
              <Plus className="h-4 w-4" />
              Add Pole
            </Link>
          </Button>
        }
      />

      {poles.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No poles registered"
          description="Add highway poles to generate QR help points."
          action={
            <Button asChild>
              <Link href="/admin/poles/new">Add first pole</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {poles.map((p) => (
            <div
              key={p.id}
              className="toll-card rounded-xl p-4 hover:border-primary/35 transition-all group overflow-hidden"
            >
              <div className="warning-strip opacity-30 mb-3 -mx-4 -mt-4" />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-bold text-primary truncate">
                    {p.poleCode}
                  </p>
                  <p className="text-sm text-foreground mt-1 line-clamp-2 font-medium">
                    {p.highwayName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {p.district}, {p.state}
                  </p>
                </div>
                <Badge variant={p.status === "ACTIVE" ? "success" : "outline"}>
                  {p.status}
                </Badge>
              </div>
              <div className="mt-3">
                <KmMarkerBadge km={p.kmMarker} />
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                <span className="text-xs text-muted-foreground">
                  {p._count.reports} reports
                </span>
                <Button asChild size="sm" variant="glass" className="min-h-[40px]">
                  <Link href={`/admin/poles/${p.id}`}>
                    <QrCode className="h-3.5 w-3.5" />
                    QR Plate
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
