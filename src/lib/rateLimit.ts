import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting with automatic periodic cleanup
const ipCache = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 60 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of ipCache.entries()) {
      if (value.resetAt <= now) {
        ipCache.delete(key);
      }
    }
  }, 60_000);
}

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests within window
  windowMs: number; // Time window in milliseconds (e.g., 60000 = 1 min)
  prefix?: string; // Endpoint identifier to namespace limits
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Extract client IP from various proxy headers or fallback
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "127.0.0.1";
}

/**
 * Check if the request exceeds rate limits.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const ip = getClientIp(req);
  const key = `${options.prefix || "global"}:${ip}`;
  const now = Date.now();

  const record = ipCache.get(key);

  if (!record || record.resetAt <= now) {
    // New window
    ipCache.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= options.limit) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - record.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Helper to generate a 429 Too Many Requests response with standard headers
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: `Too many requests. Please try again in ${result.retryAfterSeconds} seconds.`,
      retryAfter: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
      },
    }
  );
}
