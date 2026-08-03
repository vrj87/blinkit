#!/usr/bin/env bash
# Netlify production build (runs on Linux)
set -euo pipefail

npm install

cd apps/mvp
export DATABASE_URL="${DATABASE_URL:-file:./dev.db}"

npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Extra copy paths for serverless file tracing
mkdir -p prisma
cp -f dev.db prisma/dev.db

npm run build
