import { prisma } from "@/lib/prisma";
import { ReportPriority, ReportStatus } from "@/generated/prisma/client";

/** Window in ms for duplicate detection (30 minutes). */
export const DUPLICATE_WINDOW_MS = 30 * 60 * 1000;

export type DuplicateCheckResult = {
  isDuplicate: boolean;
  existingReportId?: string;
  existingReportCode?: string;
};

export async function checkDuplicateReport(
  poleId: string,
  category: string,
  priority: ReportPriority,
): Promise<DuplicateCheckResult> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);

  const existing = await prisma.report.findFirst({
    where: {
      poleId,
      category,
      priority,
      createdAt: { gte: since },
      status: { notIn: [ReportStatus.RESOLVED, ReportStatus.REJECTED] },
    },
    select: { id: true, reportCode: true },
  });

  if (!existing) {
    return { isDuplicate: false };
  }

  return {
    isDuplicate: true,
    existingReportId: existing.id,
    existingReportCode: existing.reportCode,
  };
}
