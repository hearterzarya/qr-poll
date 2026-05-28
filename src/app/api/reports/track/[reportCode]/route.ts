import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reportCodeParamSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/api-request";
import { apiSuccess, apiNotFound } from "@/lib/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reportCode: string }> },
) {
  try {
    const raw = await params;
    const parsed = reportCodeParamSchema.safeParse({
      reportCode: decodeURIComponent(raw.reportCode).toUpperCase(),
    });
    if (!parsed.success) {
      return apiNotFound("Report not found");
    }

    const report = await prisma.report.findUnique({
      where: { reportCode: parsed.data.reportCode },
      include: {
        pole: true,
        statusLogs: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!report) {
      return apiNotFound("Report not found");
    }

    return apiSuccess({
      reportCode: report.reportCode,
      category: report.category,
      emergencyType: report.emergencyType,
      priority: report.priority,
      status: report.status,
      description: report.description,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      resolvedAt: report.resolvedAt,
      pole: {
        poleCode: report.pole.poleCode,
        highwayName: report.pole.highwayName,
        kmMarker: report.pole.kmMarker,
        district: report.pole.district,
        state: report.pole.state,
        latitude: report.pole.latitude,
        longitude: report.pole.longitude,
      },
      timeline: report.statusLogs.map((log) => ({
        status: log.newStatus,
        note: log.note,
        createdAt: log.createdAt,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
