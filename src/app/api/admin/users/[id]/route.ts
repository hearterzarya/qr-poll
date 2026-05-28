import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { updateUserSchema, idParamSchema } from "@/lib/validators";
import { parseJsonBody, handleApiError } from "@/lib/api-request";
import { apiSuccess, apiNotFound, apiError } from "@/lib/api-response";
import { UserRole } from "@/generated/prisma";

const USER_MANAGE_ROLES: UserRole[] = ["SUPER_ADMIN"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req, USER_MANAGE_ROLES);
    if ("error" in auth) return auth.error;

    const raw = await params;
    const idParsed = idParamSchema.safeParse(raw);
    if (!idParsed.success) {
      return apiNotFound("User not found");
    }

    const body = await parseJsonBody(req, updateUserSchema);
    if (!body.success) return body.response;

    if (
      idParsed.data.id === auth.user.id &&
      body.data.role &&
      body.data.role !== "SUPER_ADMIN"
    ) {
      return apiError("Cannot change your own role", 400);
    }

    if (
      idParsed.data.id === auth.user.id &&
      body.data.status === "INACTIVE"
    ) {
      return apiError("Cannot deactivate your own account", 400);
    }

    const user = await prisma.user.update({
      where: { id: idParsed.data.id },
      data: body.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        status: true,
      },
    });

    return apiSuccess({ user });
  } catch (err) {
    return handleApiError(err);
  }
}
