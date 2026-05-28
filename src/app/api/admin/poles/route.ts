import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { poleSchema } from "@/lib/validators";
import { parseJsonBody, handleApiError } from "@/lib/api-request";
import { apiSuccess, apiConflict } from "@/lib/api-response";
import { ADMIN_READ_ROLES, ADMIN_MANAGE_ROLES } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ADMIN_READ_ROLES);
    if ("error" in auth) return auth.error;

    const poles = await prisma.pole.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { reports: true } } },
    });

    return apiSuccess({ poles });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ADMIN_MANAGE_ROLES);
    if ("error" in auth) return auth.error;

    const body = await parseJsonBody(req, poleSchema);
    if (!body.success) return body.response;

    const existing = await prisma.pole.findUnique({
      where: { poleCode: body.data.poleCode },
    });
    if (existing) {
      return apiConflict("Pole code already exists");
    }

    const pole = await prisma.pole.create({
      data: {
        ...body.data,
        status: body.data.status || "ACTIVE",
      },
    });

    return apiSuccess({ pole }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
