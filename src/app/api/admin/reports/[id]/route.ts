import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { idParamSchema } from "@/lib/validators";
import { handleApiError } from "@/lib/api-request";
import { apiSuccess, apiNotFound, apiForbidden } from "@/lib/api-response";
import { ADMIN_READ_ROLES, assertReportAccess } from "@/lib/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req, ADMIN_READ_ROLES);
    if ("error" in auth) return auth.error;

    const raw = await params;
    const parsed = idParamSchema.safeParse(raw);
    if (!parsed.success) {
      return apiNotFound("Report not found");
    }

    const report = await prisma.report.findUnique({
      where: { id: parsed.data.id },
      include: {
        pole: true,
        media: true,
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
        statusLogs: {
          orderBy: { createdAt: "asc" },
          include: { changedBy: { select: { name: true } } },
        },
      },
    });

    if (!report) {
      return apiNotFound("Report not found");
    }

    if (!assertReportAccess(auth.user, report)) {
      return apiForbidden("You do not have access to this report");
    }

    return apiSuccess({ report });
  } catch (err) {
    return handleApiError(err);
  }
}
