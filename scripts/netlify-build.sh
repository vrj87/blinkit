#!/usr/bin/env bash
# Netlify production build (runs on Linux)
set -euo pipefail

echo "=== Netlify build: blinkit-category-discovery ==="

npm install

cd apps/mvp
# Prisma resolves SQLite paths relative to prisma/schema.prisma — use ../dev.db for apps/mvp/dev.db
export DATABASE_URL="file:../dev.db"

echo "=== Prisma generate + migrate + seed ==="
echo "DATABASE_URL=$DATABASE_URL"
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Ensure both trace paths exist (next.config.js bundles apps/mvp/dev.db and prisma/dev.db)
if [[ -f prisma/dev.db && ! -f dev.db ]]; then
  cp -f prisma/dev.db dev.db
fi
if [[ -f dev.db && ! -f prisma/dev.db ]]; then
  mkdir -p prisma
  cp -f dev.db prisma/dev.db
fi

if [[ ! -f dev.db ]]; then
  echo "ERROR: dev.db was not created after seed" >&2
  echo "Contents of apps/mvp:" >&2
  ls -la . prisma/ 2>/dev/null || true
  exit 1
fi
echo "Seeded database: $(du -h dev.db | cut -f1)"

echo "=== Next.js build ==="
npm run build

if [[ ! -d .next/server ]]; then
  echo "ERROR: .next/server missing after build" >&2
  exit 1
fi

echo "=== Build OK ==="
ls -la .next | head -20
