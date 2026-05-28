import type { NextRequest } from "next/server";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhostHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "[::1]" ||
    h.endsWith(".local")
  );
}

function isLocalhostUrl(url: string): boolean {
  try {
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    return isLocalhostHost(new URL(normalized).hostname);
  } catch {
    return false;
  }
}

function baseFromHeaders(headers: Headers | NextRequest["headers"]): string | null {
  const host =
    headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    headers.get("host")?.trim();
  if (!host || isLocalhostHost(host)) return null;

  const proto =
    headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  return `${proto}://${host}`;
}

/**
 * Base URL for QR codes, SMS links, etc.
 * On Vercel, ignores NEXT_PUBLIC_APP_URL when it still points at localhost.
 */
export function getAppBaseUrl(
  headers?: Headers | NextRequest["headers"],
): string {
  const onVercel = process.env.VERCEL === "1";
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();

  // Actual request host wins (QR API hit on qr-poll.vercel.app)
  if (headers) {
    const fromRequest = baseFromHeaders(headers);
    if (fromRequest) return stripTrailingSlash(fromRequest);
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction && !isLocalhostUrl(vercelProduction)) {
    return `https://${vercelProduction.replace(/^https?:\/\//, "")}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl && !isLocalhostUrl(vercelUrl)) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "")}`;
  }

  if (fromEnv && !(onVercel && isLocalhostUrl(fromEnv))) {
    return stripTrailingSlash(fromEnv);
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
