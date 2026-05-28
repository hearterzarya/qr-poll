import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { idParamSchema } from "@/lib/validators";
import { saveUpload, validateUpload } from "@/lib/uploads";
import { handleApiError } from "@/lib/api-request";
import {
  apiSuccess,
  apiNotFound,
  apiForbidden,
  apiError,
} from "@/lib/api-response";
import { ADMIN_READ_ROLES, assertReportAccess } from "@/lib/rbac";

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

    const report = await prisma.report.findUnique({
      where: { id: idParsed.data.id },
    });

    if (!report) {
      return apiNotFound("Report not found");
    }

    if (!assertReportAccess(auth.user, report)) {
      return apiForbidden("You do not have access to this report");
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return apiError("No file provided", 400);
    }

    const err = validateUpload(file);
    if (err) return apiError(err, 400);

    const upload = await saveUpload(file);

    const media = await prisma.$transaction(async (tx) => {
      const created = await tx.reportMedia.create({
        data: {
          reportId: idParsed.data.id,
          mediaUrl: upload.url,
          mediaType: upload.mediaType,
          fileName: `resolution-${upload.fileName}`,
        },
      });

      await tx.reportStatusLog.create({
        data: {
          reportId: idParsed.data.id,
          oldStatus: report.status,
          newStatus: report.status,
          note: "Resolution proof uploaded",
          changedById: auth.user.id,
        },
      });

      return created;
    });

    return apiSuccess({ media }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
