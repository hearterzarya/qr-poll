"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  MapPin,
  FileWarning,
  Activity,
  Radio,
} from "lucide-react";
import { motion } from "framer-motion";
import { AdminHeader } from "@/components/admin/admin-header";
import { ControlRoomStatsCard } from "@/components/highway/control-room-stats-card";
import { AlertTicketCard } from "@/components/highway/alert-ticket-card";
import { LiveMapPanel } from "@/components/highway/live-map-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/shared/page-loading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { formatDate } from "@/lib/utils";

type Stats = {
  reportsToday: number;
  openEmergencies: number;
  pendingMaintenance: number;
  resolvedReports: number;
  avgResponseMinutes: number;
  activePoles: number;
  recentReports: Array<{
    id: string;
    reportCode: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    pole: { poleCode: string; highwayName: string; latitude: number; longitude: number };
  }>;
  priorityReports: Array<{
    id: string;
    reportCode: string;
    category: string;
    priority: string;
    pole: { poleCode: string; highwayName: string };
  }>;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  function load() {
    return fetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setStats)
      .catch(() => setError(true));
  }

  useEffect(() => {
    void load();
  }, []);

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <ErrorState
          message="Could not load dashboard data."
          onRetry={() => {
            setError(false);
            void load();
          }}
        />
      </div>
    );
  }

  if (!stats) return <DashboardSkeleton />;

  const topP1 = stats.priorityReports[0];
  const topRecent = stats.recentReports[0];
  const p2Reports = stats.recentReports.filter((r) => r.priority === "P2");

  return (
    <div className="p-6 lg:p-8 space-y-8 pb-24 lg:pb-8">
      <AdminHeader
        title="Highway Control Room"
        description="Real-time safety monitoring for national highway networks"
        live
      />

      {stats.openEmergencies > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="emergency" className="overflow-hidden reflective-border">
            <div className="warning-strip-red" />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-xl bg-destructive/20 p-3 emergency-pulse">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-300 heading-executive">
                  {stats.openEmergencies} active emergency
                  {stats.openEmergencies > 1 ? " alerts" : " alert"}
                </p>
                <p className="label-micro text-red-300/70 mt-1 normal-case tracking-normal">
                  Immediate verification required
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <ControlRoomStatsCard
          title="Reports Today"
          value={stats.reportsToday}
          icon={Activity}
          index={0}
        />
        <ControlRoomStatsCard
          title="Open Emergencies"
          value={stats.openEmergencies}
          icon={AlertTriangle}
          accent="red"
          alert={stats.openEmergencies > 0}
          index={1}
        />
        <ControlRoomStatsCard
          title="Pending Maintenance"
          value={stats.pendingMaintenance}
          icon={FileWarning}
          accent="amber"
          index={2}
        />
        <ControlRoomStatsCard
          title="Resolved"
          value={stats.resolvedReports}
          icon={CheckCircle}
          accent="green"
          index={3}
        />
        <ControlRoomStatsCard
          title="Avg Response"
          value={`${stats.avgResponseMinutes}m`}
          subtitle="Resolved reports"
          icon={Clock}
          index={4}
        />
        <ControlRoomStatsCard
          title="Active QR Poles"
          value={stats.activePoles}
          icon={MapPin}
          index={5}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="overflow-hidden">
            <div className="warning-strip-red h-1" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-red-400 flex items-center gap-2 text-base">
                <span className="live-dot h-2 w-2 rounded-full bg-red-500" />
                P1 Emergency Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.priorityReports.length === 0 ? (
                <EmptyState
                  icon={CheckCircle}
                  title="No active emergencies"
                  description="All P1 reports are being handled."
                  className="py-8"
                />
              ) : (
                stats.priorityReports.map((r, i) => (
                  <AlertTicketCard
                    key={r.id}
                    id={r.id}
                    reportCode={r.reportCode}
                    category={r.category}
                    priority={r.priority}
                    meta={`${r.pole.poleCode} · ${r.pole.highwayName}`}
                    variant="emergency"
                    index={i}
                  />
                ))
              )}
            </CardContent>
          </Card>

          <Card variant="glass" className="overflow-hidden">
            <div className="warning-strip h-1" />
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-400 text-base flex items-center gap-2">
                <FileWarning className="h-4 w-4" />
                P2 Maintenance Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {p2Reports.length === 0 ? (
                <EmptyState
                  icon={FileWarning}
                  title="No P2 maintenance tickets"
                  description="High-priority maintenance queue is clear."
                  className="py-6"
                />
              ) : (
                p2Reports.slice(0, 5).map((r, i) => (
                  <AlertTicketCard
                    key={r.id}
                    id={r.id}
                    reportCode={r.reportCode}
                    category={r.category}
                    priority={r.priority}
                    meta={`${r.pole.highwayName} · ${formatDate(r.createdAt)}`}
                    variant="maintenance"
                    index={i}
                  />
                ))
              )}
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-base">Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.recentReports.length === 0 ? (
                <EmptyState
                  icon={FileWarning}
                  title="No reports yet"
                  description="Citizen reports appear here in real time."
                  className="py-8"
                />
              ) : (
                stats.recentReports.slice(0, 6).map((r, i) => (
                  <AlertTicketCard
                    key={r.id}
                    id={r.id}
                    reportCode={r.reportCode}
                    category={r.category}
                    priority={r.priority}
                    meta={`${r.pole.highwayName} · ${formatDate(r.createdAt)}`}
                    variant={r.priority === "P1" ? "emergency" : "maintenance"}
                    index={i}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {topRecent && (
            <LiveMapPanel
              title="Live Incident Map"
              latitude={topRecent.pole.latitude}
              longitude={topRecent.pole.longitude}
              label={topRecent.pole.poleCode}
              sublabel={topRecent.pole.highwayName}
              variant={
                topRecent.priority === "P1" ? "emergency" : "maintenance"
              }
            />
          )}
          {topP1 && topRecent && topP1.id !== topRecent.id && (
            <LiveMapPanel
              title="Priority Alert Location"
              latitude={topRecent.pole.latitude}
              longitude={topRecent.pole.longitude}
              label={topP1.pole.poleCode}
              sublabel={topP1.pole.highwayName}
              variant="emergency"
            />
          )}

          <Card variant="glass" className="toll-card">
            <CardContent className="p-4 space-y-3">
              <p className="label-micro text-primary/80">QR Pole Network</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active poles</span>
                <span className="font-bold text-primary">{stats.activePoles}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Control room</span>
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-green-400" />
                  Online
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5" />
                  QR scan logging
                </span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
