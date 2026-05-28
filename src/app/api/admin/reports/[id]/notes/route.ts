import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { addNoteSchema, idParamSchema } from "@/lib/validators";
import { parseJsonBody, handleApiError } from "@/lib/api-request";
import { apiSuccess, apiNotFound, apiForbidden } from "@/lib/api-response";
import { ADMIN_READ_ROLES, assertReportAccess } from "@/lib/rbac";
import { createReportStatusLog } from "@/lib/report-status-log";

export async function POST(
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

    const body = await parseJsonBody(req, addNoteSchema);
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

    const log = await createReportStatusLog({
      reportId: idParsed.data.id,
      oldStatus: existing.status,
      newStatus: existing.status,
      note: `[Internal] ${body.data.note}`,
      changedById: auth.user.id,
    });

    return apiSuccess({ log }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
