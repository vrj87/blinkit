import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "fs";
import { join } from "path";

const TMP_DB = "/tmp/blinkit-mvp.db";

function bundledDbCandidates(): string[] {
  const cwd = process.cwd();
  return [
    join(cwd, "dev.db"),
    join(cwd, "prisma/dev.db"),
    join(cwd, "apps/mvp/dev.db"),
    join(cwd, "apps/mvp/prisma/dev.db"),
    "/var/task/dev.db",
    "/var/task/prisma/dev.db",
    "/var/task/apps/mvp/dev.db",
    "/var/task/apps/mvp/prisma/dev.db",
  ];
}

function isServerlessProduction(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) return false;
  return Boolean(
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NETLIFY ||
      process.env.AWS_EXECUTION_ENV
  );
}

/** Netlify/AWS Lambda: copy seeded SQLite to writable /tmp (bundle is read-only). */
function ensureServerlessDatabase(): void {
  if (!isServerlessProduction()) return;

  if (existsSync(TMP_DB)) {
    process.env.DATABASE_URL = `file:${TMP_DB}`;
    return;
  }

  for (const src of bundledDbCandidates()) {
    if (existsSync(src)) {
      copyFileSync(src, TMP_DB);
      process.env.DATABASE_URL = `file:${TMP_DB}`;
      return;
    }
  }

  console.error(
    "[db] No bundled SQLite found for serverless runtime; order writes may fail.",
    { cwd: process.cwd() }
  );
}

ensureServerlessDatabase();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;
