import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { poleSchema, idParamSchema } from "@/lib/validators";
import { parseJsonBody, handleApiError } from "@/lib/api-request";
import { apiSuccess, apiNotFound, apiConflict } from "@/lib/api-response";
import { ADMIN_READ_ROLES, ADMIN_MANAGE_ROLES } from "@/lib/rbac";
import { PoleStatus } from "@/generated/prisma";

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
      return apiNotFound("Pole not found");
    }

    const pole = await prisma.pole.findUnique({
      where: { id: parsed.data.id },
      include: {
        reports: {
          take: 20,
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reports: true, scanLogs: true } },
      },
    });

    if (!pole) {
      return apiNotFound("Pole not found");
    }

    return apiSuccess({ pole });
  } catch (err) {
    return handleApiError(err);
  }
}

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
      return apiNotFound("Pole not found");
    }

    const body = await parseJsonBody(req, poleSchema.partial());
    if (!body.success) return body.response;

    const existing = await prisma.pole.findUnique({
      where: { id: idParsed.data.id },
    });
    if (!existing) {
      return apiNotFound("Pole not found");
    }

    if (body.data.poleCode && body.data.poleCode !== existing.poleCode) {
      const conflict = await prisma.pole.findUnique({
        where: { poleCode: body.data.poleCode },
      });
      if (conflict) {
        return apiConflict("Pole code already in use");
      }
    }

    const pole = await prisma.pole.update({
      where: { id: idParsed.data.id },
      data: body.data,
    });

    return apiSuccess({ pole });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req, ADMIN_MANAGE_ROLES);
    if ("error" in auth) return auth.error;

    const raw = await params;
    const idParsed = idParamSchema.safeParse(raw);
    if (!idParsed.success) {
      return apiNotFound("Pole not found");
    }

    const pole = await prisma.pole.update({
      where: { id: idParsed.data.id },
      data: { status: PoleStatus.INACTIVE },
    });

    return apiSuccess({ pole });
  } catch (err) {
    return handleApiError(err);
  }
}
