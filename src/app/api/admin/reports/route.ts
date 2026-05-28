import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { reportFiltersSchema } from "@/lib/validators";
import { parseSearchParams, handleApiError } from "@/lib/api-request";
import { apiSuccess } from "@/lib/api-response";
import { ADMIN_READ_ROLES } from "@/lib/rbac";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ADMIN_READ_ROLES);
    if ("error" in auth) return auth.error;

    const filters = parseSearchParams(req.url, reportFiltersSchema);
    if (!filters.success) return filters.response;

    const { status, priority, category, district, highway, search } =
      filters.data;

    const where: Prisma.ReportWhereInput = {};

    if (auth.user.role === "CONTRACTOR" || auth.user.role === "FIELD_TEAM") {
      where.assignedToId = auth.user.id;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (district || highway) {
      where.pole = {};
      if (district) {
        where.pole.district = { contains: district, mode: "insensitive" };
      }
      if (highway) {
        where.pole.highwayName = { contains: highway, mode: "insensitive" };
      }
    }
    if (search) {
      where.OR = [
        { reportCode: { contains: search, mode: "insensitive" } },
        { pole: { poleCode: { contains: search, mode: "insensitive" } } },
      ];
    }

    const reports = await prisma.report.findMany({
      where,
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
      include: {
        pole: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        _count: { select: { media: true } },
      },
      take: 200,
    });

    return apiSuccess({ reports });
  } catch (err) {
    return handleApiError(err);
  }
}
