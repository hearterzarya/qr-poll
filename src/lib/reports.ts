import { ReportPriority, ReportStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { calculatePriority } from "@/lib/priority";
import { generateReportCode } from "@/lib/report-code";
import { checkDuplicateReport } from "@/lib/duplicate";
import { notifyOnReportCreated } from "@/lib/notifications";
import { sanitizeDescription } from "@/lib/validators";

export type CreateReportInput = {
  poleCode: string;
  category: string;
  emergencyType?: string | null;
  description?: string | null;
  userPhone?: string | null;
  userLatitude?: number | null;
  userLongitude?: number | null;
  mediaUrls?: { url: string; mediaType: "IMAGE" | "VIDEO"; fileName?: string }[];
  deviceInfo?: string | null;
  ipAddress?: string | null;
  isEmergency?: boolean;
};

export type CreateReportResult =
  | { report: Awaited<ReturnType<typeof createReportSuccess>> }
  | { error: string; status: 404 | 400 };

async function createReportSuccess(
  input: CreateReportInput,
) {
  const pole = await prisma.pole.findUnique({
    where: { poleCode: input.poleCode },
  });

  if (!pole) {
    throw new Error("NOT_FOUND");
  }

  if (pole.status !== "ACTIVE") {
    throw new Error("INACTIVE");
  }

  const description = sanitizeDescription(input.description);

  const priority = input.isEmergency
    ? ReportPriority.P1
    : calculatePriority(input.category, input.emergencyType, description);

  const duplicate = await checkDuplicateReport(pole.id, input.category, priority);
  const reportCode = await generateReportCode();
  const initialStatus = duplicate.isDuplicate
    ? ReportStatus.DUPLICATE
    : ReportStatus.NEW;

  const report = await prisma.$transaction(async (tx) => {
    const created = await tx.report.create({
      data: {
        reportCode,
        poleId: pole.id,
        category: input.category,
        emergencyType: input.emergencyType,
        priority,
        description,
        userPhone: input.userPhone,
        userLatitude: input.userLatitude,
        userLongitude: input.userLongitude,
        deviceInfo: input.deviceInfo,
        ipAddress: input.ipAddress,
        status: initialStatus,
        isDuplicate: duplicate.isDuplicate,
        media: input.mediaUrls?.length
          ? {
              create: input.mediaUrls.map((m) => ({
                mediaUrl: m.url,
                mediaType: m.mediaType,
                fileName: m.fileName,
              })),
            }
          : undefined,
      },
      include: { pole: true, media: true },
    });

    await tx.reportStatusLog.create({
      data: {
        reportId: created.id,
        oldStatus: null,
        newStatus: initialStatus,
        note: duplicate.isDuplicate
          ? `Possible duplicate of ${duplicate.existingReportCode} (within 30 min)`
          : input.isEmergency
            ? "Emergency report submitted by citizen"
            : "Report submitted by citizen",
      },
    });

    return created;
  });

  await notifyOnReportCreated(report);

  return report;
}

export async function createReport(
  input: CreateReportInput,
): Promise<CreateReportResult> {
  try {
    const report = await createReportSuccess(input);
    return { report };
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return { error: "Pole not found", status: 404 };
    }
    if (err instanceof Error && err.message === "INACTIVE") {
      return {
        error: "This help point is temporarily unavailable",
        status: 400,
      };
    }
    throw err;
  }
}
