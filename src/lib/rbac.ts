import { UserRole } from "@/generated/prisma/client";
import type { SessionUser } from "@/lib/auth";

export const ADMIN_READ_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "CONTRACTOR",
  "FIELD_TEAM",
];

export const ADMIN_MANAGE_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];

export const FIELD_ROLES: UserRole[] = ["CONTRACTOR", "FIELD_TEAM"];

export function isFieldRole(role: UserRole) {
  return FIELD_ROLES.includes(role);
}

export function canReadAllReports(role: UserRole) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canManagePoles(role: UserRole) {
  return ADMIN_MANAGE_ROLES.includes(role);
}

export function canManageUsers(role: UserRole) {
  return role === "SUPER_ADMIN";
}

export const USER_READ_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];

export function canAssignReports(role: UserRole) {
  return ADMIN_MANAGE_ROLES.includes(role);
}

export function assertReportAccess(
  user: SessionUser,
  report: { assignedToId: string | null },
): boolean {
  if (canReadAllReports(user.role)) return true;
  if (isFieldRole(user.role)) {
    return report.assignedToId === user.id;
  }
  return false;
}
