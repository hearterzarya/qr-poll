import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hashPassword } from "@/lib/auth";
import { createUserSchema } from "@/lib/validators";
import { parseJsonBody, handleApiError } from "@/lib/api-request";
import { apiSuccess, apiConflict } from "@/lib/api-response";
import { USER_READ_ROLES } from "@/lib/rbac";
import { UserRole } from "@/generated/prisma";

const USER_MANAGE_ROLES: UserRole[] = ["SUPER_ADMIN"];

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, USER_READ_ROLES);
    if ("error" in auth) return auth.error;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    return apiSuccess({ users });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, USER_MANAGE_ROLES);
    if ("error" in auth) return auth.error;

    const body = await parseJsonBody(req, createUserSchema);
    if (!body.success) return body.response;

    const existing = await prisma.user.findUnique({
      where: { email: body.data.email },
    });
    if (existing) {
      return apiConflict("Email already exists");
    }

    const user = await prisma.user.create({
      data: {
        name: body.data.name,
        email: body.data.email,
        passwordHash: await hashPassword(body.data.password),
        role: body.data.role,
        phone: body.data.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        status: true,
      },
    });

    return apiSuccess({ user }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
