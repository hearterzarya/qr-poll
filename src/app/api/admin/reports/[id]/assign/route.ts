import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { assignReportSchema, idParamSchema } from "@/lib/validators";
import { parseJsonBody, handleApiError } from "@/lib/api-request";
import {
  apiSuccess,
  apiNotFound,
  apiError,
} from "@/lib/api-response";
import { ADMIN_MANAGE_ROLES } from "@/lib/rbac";
import { ReportStatus, UserRole } from "@/generated/prisma";

const ASSIGNABLE_ROLES: UserRole[] = ["CONTRACTOR", "FIELD_TEAM", "ADMIN"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req, ADMIN_MANAGE_ROLES);
    if ("error" in auth) return auth.error;

    const raw = await params;
    const idParsed = idParamSchema.safeParse(raw);
    if (!idParsed.success) {
      return apiNotFound("Report not found");
    }

    const body = await parseJsonBody(req, assignReportSchema);
    if (!body.success) return body.response;

    const [existing, assignee] = await Promise.all([
      prisma.report.findUnique({ where: { id: idParsed.data.id } }),
      prisma.user.findUnique({
        where: { id: body.data.assignedToId },
        select: { id: true, name: true, role: true, status: true },
      }),
    ]);

    if (!existing) {
      return apiNotFound("Report not found");
    }

    if (!assignee || assignee.status !== "ACTIVE") {
      return apiNotFound("Assignee not found");
    }

    if (!ASSIGNABLE_ROLES.includes(assignee.role)) {
      return apiError("User cannot be assigned reports", 400);
    }

    const report = await prisma.$transaction(async (tx) => {
      const updated = await tx.report.update({
        where: { id: idParsed.data.id },
        data: {
          assignedToId: body.data.assignedToId,
          status: ReportStatus.ASSIGNED,
        },
        include: { pole: true, assignedTo: true },
      });

      await tx.reportStatusLog.create({
        data: {
          reportId: idParsed.data.id,
          oldStatus: existing.status,
          newStatus: ReportStatus.ASSIGNED,
          note: `Assigned to ${assignee.name}`,
          changedById: auth.user.id,
        },
      });

      return updated;
    });

    return apiSuccess({ report });
  } catch (err) {
    return handleApiError(err);
  }
}
