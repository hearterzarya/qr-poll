import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { updateReportStatusSchema } from "@/lib/validators";
import { idParamSchema } from "@/lib/validators";
import { parseJsonBody, handleApiError } from "@/lib/api-request";
import {
  apiSuccess,
  apiNotFound,
  apiForbidden,
  apiError,
} from "@/lib/api-response";
import { ADMIN_READ_ROLES, assertReportAccess } from "@/lib/rbac";
import { sendStatusUpdate } from "@/lib/notifications";
import { ReportStatus } from "@/generated/prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req, ADMIN_READ_ROLES);
    if ("error" in auth) return auth.error;

    const raw = await params;
    const idParsed = idParamSchema.safeParse(raw);
    if (!idParsed.success) {
      return apiNotFound("Report not found");
    }

    const body = await parseJsonBody(req, updateReportStatusSchema);
    if (!body.success) return body.response;

    const existing = await prisma.report.findUnique({
      where: { id: idParsed.data.id },
    });

    if (!existing) {
      return apiNotFound("Report not found");
    }

    if (!assertReportAccess(auth.user, existing)) {
      return apiForbidden("You do not have access to this report");
    }

    const newStatus = body.data.status;

    if (existing.status === newStatus && !body.data.note) {
      return apiError("Status is already set to this value", 400);
    }

    const resolvedAt =
      newStatus === ReportStatus.RESOLVED ? new Date() : null;

    const report = await prisma.$transaction(async (tx) => {
      const updated = await tx.report.update({
        where: { id: idParsed.data.id },
        data: {
          status: newStatus,
          resolvedAt,
        },
        include: { pole: true },
      });

      await tx.reportStatusLog.create({
        data: {
          reportId: idParsed.data.id,
          oldStatus: existing.status,
          newStatus,
          note: body.data.note ?? null,
          changedById: auth.user.id,
        },
      });

      return updated;
    });

    await sendStatusUpdate(report, newStatus);

    return apiSuccess({ report });
  } catch (err) {
    return handleApiError(err);
  }
}
