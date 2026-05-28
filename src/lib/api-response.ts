import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(
  message: string,
  status: number,
  code: ApiErrorCode = "BAD_REQUEST",
) {
  return NextResponse.json({ error: message, code }, { status });
}

export function apiValidationError(error: ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      code: "BAD_REQUEST" as const,
      details: error.flatten(),
    },
    { status: 400 },
  );
}

export function apiUnauthorized(message = "Unauthorized") {
  return apiError(message, 401, "UNAUTHORIZED");
}

export function apiForbidden(message = "Forbidden") {
  return apiError(message, 403, "FORBIDDEN");
}

export function apiNotFound(message = "Not found") {
  return apiError(message, 404, "NOT_FOUND");
}

export function apiConflict(message: string) {
  return apiError(message, 409, "CONFLICT");
}

export function apiRateLimited(message = "Too many requests. Please try again later.") {
  return apiError(message, 429, "RATE_LIMITED");
}

export function apiInternalError(message = "An unexpected error occurred") {
  return apiError(message, 500, "INTERNAL_ERROR");
}

export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return apiValidationError(err);
  }
  console.error("[PoleSafe API]", err);
  return apiInternalError();
}
