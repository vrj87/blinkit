#!/usr/bin/env bash
# Netlify production build (runs on Linux)
set -euo pipefail

echo "=== Netlify build: blinkit-category-discovery ==="

npm install

cd apps/mvp
export DATABASE_URL="${DATABASE_URL:-file:./dev.db}"

echo "=== Prisma generate + migrate + seed ==="
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

if [[ ! -f dev.db ]]; then
  echo "ERROR: dev.db was not created after seed" >&2
  exit 1
fi

# Extra copy paths for serverless file tracing
mkdir -p prisma
cp -f dev.db prisma/dev.db
echo "Seeded database: $(du -h dev.db | cut -f1)"

echo "=== Next.js build ==="
npm run build

if [[ ! -d .next/server ]]; then
  echo "ERROR: .next/server missing after build" >&2
  exit 1
fi

echo "=== Build OK ==="
ls -la .next | head -20
