import { NextRequest } from "next/server";
import { z, ZodSchema } from "zod";
import {
  apiRateLimited,
  apiValidationError,
  handleApiError,
} from "@/lib/api-response";
import { rateLimitByPreset, type RateLimitPreset } from "@/lib/rate-limit";

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function parseJsonBody<T extends ZodSchema>(
  req: NextRequest,
  schema: T,
): Promise<
  | { success: true; data: z.infer<T> }
  | { success: false; response: Response }
> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return {
      success: false,
      response: apiValidationError(
        new z.ZodError([
          {
            code: "custom",
            message: "Invalid JSON body",
            path: [],
          },
        ]),
      ),
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, response: apiValidationError(parsed.error) };
  }
  return { success: true, data: parsed.data };
}

export function parseSearchParams<T extends ZodSchema>(
  url: string,
  schema: T,
):
  | { success: true; data: z.infer<T> }
  | { success: false; response: Response } {
  const params = Object.fromEntries(new URL(url).searchParams.entries());
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    return { success: false, response: apiValidationError(parsed.error) };
  }
  return { success: true, data: parsed.data };
}

export function enforceRateLimit(
  preset: RateLimitPreset,
  identifier: string,
): Response | null {
  const result = rateLimitByPreset(preset, identifier);
  if (!result.success) {
    return apiRateLimited();
  }
  return null;
}

export { handleApiError };
