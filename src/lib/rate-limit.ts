const store = new Map<string, { count: number; resetAt: number }>();

export const RATE_LIMITS = {
  REPORT_CREATE: { key: "report", limit: 5, windowMs: 60_000 },
  QR_SCAN: { key: "qr-scan", limit: 30, windowMs: 60_000 },
  UPLOAD: { key: "upload", limit: 10, windowMs: 60_000 },
  AUTH_LOGIN: { key: "auth-login", limit: 10, windowMs: 15 * 60_000 },
} as const;

export type RateLimitPreset = keyof typeof RATE_LIMITS;

export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): { success: boolean; remaining: number; retryAfterMs?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterMs: Math.max(0, entry.resetAt - now),
    };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

export function rateLimitByPreset(
  preset: RateLimitPreset,
  identifier: string,
) {
  const config = RATE_LIMITS[preset];
  return rateLimit(`${config.key}:${identifier}`, config.limit, config.windowMs);
}

/** Prune expired entries periodically (dev/single-instance). */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, 5 * 60_000);
}
