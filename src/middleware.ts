import { NextRequest, NextResponse } from 'next/server';

// Sliding window in-memory rate limiter (30 requests per 60 seconds per IP)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale IP records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apply rate limiting specifically to mutation routes
  const isProtectedApiRoute =
    pathname.startsWith('/api/assessment') ||
    pathname.startsWith('/api/user');

  if (isProtectedApiRoute && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    const now = Date.now();
    const record = rateLimitMap.get(ip) || { timestamps: [] };

    // Filter out timestamps outside the active 60s sliding window
    record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded. Maximum 30 requests per minute allowed.',
          retryAfterSeconds: 60
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }

    record.timestamps.push(now);
    rateLimitMap.set(ip, record);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/assessment/:path*', '/api/user/:path*']
};
