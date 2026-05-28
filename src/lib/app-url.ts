import type { NextRequest } from "next/server";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Production-safe base URL for links embedded in QR codes, SMS, etc.
 * Prefers explicit env, then Vercel system env, then request headers.
 */
export function getAppBaseUrl(
  headers?: Headers | NextRequest["headers"],
): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return stripTrailingSlash(fromEnv);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) {
    return `https://${vercelProduction.replace(/^https?:\/\//, "")}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "")}`;
  }

  if (headers) {
    const host =
      headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      headers.get("host")?.trim();
    if (host) {
      const proto =
        headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
      return `${proto}://${host}`;
    }
  }

  return "http://localhost:3000";
}

/** Use in client components when showing or previewing public pole URLs. */
export function getClientAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return getAppBaseUrl();
}
