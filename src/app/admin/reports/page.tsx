"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, FileWarning } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { PriorityBadge, StatusBadge } from "@/components/highway/priority-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PageLoading } from "@/components/shared/page-loading";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Report = {
  id: string;
  reportCode: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  pole: { poleCode: string; highwayName: string; district: string };
  assignedTo?: { name: string } | null;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (priority !== "all") params.set("priority", priority);
    if (search) params.set("search", search);

    fetch(`/api/admin/reports?${params}`)
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []));
  }, [status, priority, search]);

  if (reports === null) return <PageLoading rows={6} />;

  return (
    <div className="p-6 lg:p-8 space-y-6 pb-24 lg:pb-8">
      <AdminHeader
        title="Ticket Management"
        description={`${reports.length} incidents in highway safety queue`}
        live
      />

      <Card variant="glass" className="p-4 toll-card">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search report ID or pole code..."
              className="pl-10 min-h-[48px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full lg:w-44 min-h-[48px]">
              <Filter className="h-4 w-4 mr-1 shrink-0" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
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
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-full lg:w-36 min-h-[48px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="P1">P1 Critical</SelectItem>
              <SelectItem value="P2">P2 High</SelectItem>
              <SelectItem value="P3">P3 Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {reports.length === 0 ? (
        <EmptyState
          icon={FileWarning}
          title="No reports found"
          description="Try adjusting filters or wait for new citizen submissions."
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden glass-strong">
          <div className="warning-strip opacity-40" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left">
                  <th className="p-4 label-micro normal-case">Report ID</th>
                  <th className="p-4 label-micro normal-case">Pole</th>
                  <th className="p-4 label-micro normal-case">Category</th>
                  <th className="p-4 label-micro normal-case">Priority</th>
                  <th className="p-4 label-micro normal-case">Status</th>
                  <th className="p-4 label-micro normal-case hidden md:table-cell">
                    Assigned
                  </th>
                  <th className="p-4 label-micro normal-case hidden sm:table-cell">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-b border-border/40 hover:bg-primary/5 transition-colors",
                      r.priority === "P1" && "bg-red-500/5",
                    )}
                  >
                    <td className="p-4">
                      <Link
                        href={`/admin/reports/${r.id}`}
                        className="font-mono text-primary font-bold hover:underline"
                      >
                        {r.reportCode}
                      </Link>
                    </td>
                    <td className="p-4 text-foreground font-mono text-xs">
                      {r.pole.poleCode}
                    </td>
                    <td className="p-4 text-muted-foreground max-w-[140px] truncate">
                      {r.category.replace(/_/g, " ")}
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={r.priority} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">
                      {r.assignedTo?.name || "—"}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs hidden sm:table-cell">
                      {formatDate(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
