import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ReportPriority, ReportStatus } from "@/generated/prisma/client";
import { handleApiError } from "@/lib/api-request";
import { apiSuccess } from "@/lib/api-response";
import { ADMIN_READ_ROLES } from "@/lib/rbac";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ADMIN_READ_ROLES);
    if ("error" in auth) return auth.error;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reportScope: Prisma.ReportWhereInput =
      auth.user.role === "CONTRACTOR" || auth.user.role === "FIELD_TEAM"
        ? { assignedToId: auth.user.id }
        : {};

    const [
      reportsToday,
      openEmergencies,
      pendingMaintenance,
      resolvedReports,
      activePoles,
      recentReports,
      priorityReports,
    ] = await Promise.all([
      prisma.report.count({
        where: { ...reportScope, createdAt: { gte: today } },
      }),
      prisma.report.count({
        where: {
          ...reportScope,
          priority: ReportPriority.P1,
          status: { notIn: [ReportStatus.RESOLVED, ReportStatus.REJECTED] },
        },
      }),
      prisma.report.count({
        where: {
          ...reportScope,
          priority: { in: [ReportPriority.P2, ReportPriority.P3] },
          status: {
            in: [
              ReportStatus.NEW,
              ReportStatus.VERIFIED,
              ReportStatus.ASSIGNED,
              ReportStatus.IN_PROGRESS,
            ],
          },
        },
      }),
      prisma.report.count({
        where: { ...reportScope, status: ReportStatus.RESOLVED },
      }),
      prisma.pole.count({ where: { status: "ACTIVE" } }),
      prisma.report.findMany({
        where: reportScope,
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { pole: true },
      }),
      prisma.report.findMany({
        where: {
          ...reportScope,
          priority: ReportPriority.P1,
          status: { notIn: [ReportStatus.RESOLVED, ReportStatus.REJECTED] },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { pole: true },
      }),
    ]);

    const resolvedWithTime = await prisma.report.findMany({
      where: {
        ...reportScope,
        status: ReportStatus.RESOLVED,
        resolvedAt: { not: null },
      },
      select: { createdAt: true, resolvedAt: true },
      take: 100,
      orderBy: { resolvedAt: "desc" },
    });

    let avgResponseMinutes = 0;
    if (resolvedWithTime.length > 0) {
      const totalMs = resolvedWithTime.reduce((sum, r) => {
        if (!r.resolvedAt) return sum;
        return sum + (r.resolvedAt.getTime() - r.createdAt.getTime());
      }, 0);
      avgResponseMinutes = Math.round(
        totalMs / resolvedWithTime.length / 60000,
      );
    }

    return apiSuccess({
      reportsToday,
      openEmergencies,
      pendingMaintenance,
      resolvedReports,
      avgResponseMinutes,
      activePoles,
      recentReports,
      priorityReports,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
