import type { NextConfig } from 'next';

// Guard against NextAuth ERR_INVALID_URL when NEXTAUTH_URL is missing or empty on Vercel build
const rawUrl = process.env.NEXTAUTH_URL?.trim();
if (!rawUrl) {
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'localhost:3000';
  process.env.NEXTAUTH_URL = vercelHost.startsWith('http')
    ? vercelHost
    : `https://${vercelHost}`;
}

if (!process.env.NEXTAUTH_SECRET || !process.env.NEXTAUTH_SECRET.trim()) {
  process.env.NEXTAUTH_SECRET = 'fallback-anti-burnout-rulebook-secret-key-32';
}

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  serverExternalPackages: ['@prisma/client'],
  reactStrictMode: true,
};

export default nextConfig;
