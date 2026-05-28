import { ReportStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function createReportStatusLog(params: {
  reportId: string;
  oldStatus: ReportStatus | null;
  newStatus: ReportStatus;
  note?: string | null;
  changedById?: string | null;
}) {
  return prisma.reportStatusLog.create({
    data: {
      reportId: params.reportId,
      oldStatus: params.oldStatus,
      newStatus: params.newStatus,
      note: params.note ?? null,
      changedById: params.changedById ?? null,
    },
  });
}
