import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "fs";
import { join } from "path";

/** Netlify/AWS Lambda: copy seeded SQLite to writable /tmp (bundle is read-only). */
function ensureServerlessDatabase(): void {
  if (process.env.VERCEL) return;
  if (!process.env.AWS_LAMBDA_FUNCTION_NAME) return;

  const tmpDb = "/tmp/blinkit-mvp.db";
  if (existsSync(tmpDb)) {
    process.env.DATABASE_URL = `file:${tmpDb}`;
    return;
  }

  const candidates = [
    join(process.cwd(), "dev.db"),
    join(process.cwd(), "prisma/dev.db"),
    join(process.cwd(), "apps/mvp/dev.db"),
    join(process.cwd(), "apps/mvp/prisma/dev.db"),
  ];

  for (const src of candidates) {
    if (existsSync(src)) {
      copyFileSync(src, tmpDb);
      process.env.DATABASE_URL = `file:${tmpDb}`;
      return;
    }
  }
}

ensureServerlessDatabase();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
