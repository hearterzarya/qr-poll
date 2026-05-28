import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  apiForbidden,
  apiUnauthorized,
} from "@/lib/api-response";

const COOKIE_NAME = "polesafe_token";
const JWT_EXPIRY = "7d";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be configured (min 16 characters)");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: SessionUser) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.email || !payload.role) return null;
    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: (payload.name as string) || "Admin",
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getSessionFromRequest(
  req: NextRequest,
): Promise<SessionUser | null> {
  const token =
    req.cookies.get(COOKIE_NAME)?.value ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;

export { canManagePoles, canManageUsers, canAssignReports } from "@/lib/rbac";

export async function requireAuth(
  req: NextRequest,
  roles?: UserRole[],
): Promise<{ user: SessionUser } | { error: Response }> {
  const user = await getSessionFromRequest(req);
  if (!user) {
    return { error: apiUnauthorized() };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { status: true, role: true },
  });

  if (!dbUser || dbUser.status !== "ACTIVE") {
    return { error: apiUnauthorized("Account inactive or not found") };
  }

  if (roles && !roles.includes(dbUser.role)) {
    return { error: apiForbidden() };
  }

  return {
    user: {
      ...user,
      role: dbUser.role,
    },
  };
}
