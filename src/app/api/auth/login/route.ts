import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createToken,
  verifyPassword,
  COOKIE_NAME_EXPORT,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import {
  getClientIp,
  parseJsonBody,
  enforceRateLimit,
  handleApiError,
} from "@/lib/api-request";
import { apiSuccess, apiUnauthorized } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = enforceRateLimit("AUTH_LOGIN", ip);
    if (limited) return limited;

    const body = await parseJsonBody(req, loginSchema);
    if (!body.success) return body.response;

    const user = await prisma.user.findUnique({
      where: { email: body.data.email },
    });

    if (!user || user.status !== "ACTIVE") {
      return apiUnauthorized("Invalid credentials");
    }

    const valid = await verifyPassword(body.data.password, user.passwordHash);
    if (!valid) {
      return apiUnauthorized("Invalid credentials");
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await createToken(sessionUser);

    const response = apiSuccess({ user: sessionUser });

    response.cookies.set(COOKIE_NAME_EXPORT, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}
