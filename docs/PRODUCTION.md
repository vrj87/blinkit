# Production URLs

> **Deploy:** `scripts\deploy-prod.cmd` from repo root (requires Vercel approval)

| Page | URL (after deploy) |
|------|---------------------|
| **Playground (all features)** | `https://category-explorer-mvp.vercel.app/playground` |
| Discovery Q&A | `https://category-explorer-mvp.vercel.app/dashboard/discovery` |
| P1 demo (Atharv) | `https://category-explorer-mvp.vercel.app/demo/user/user-atharv` |
| Ops dashboard | `https://category-explorer-mvp.vercel.app/dashboard` |

**Deck slide 3 & 8:** Use the **playground** URL as the primary demo link.

## Configured automatically on deploy

- `GROQ_API_KEY` — Groq LLM for explained recommendations (`llama-3.3-70b-versatile`)
- `DATABASE_URL` — SQLite seeded at build (`prisma db push` + `seed`)
- `N8N_WEBHOOK_SECRET` — `blinkit-mvp-webhook-prod`
- `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_COLLECT_URL` — set after first deploy + redeploy

## Production vs local

| Feature | Local | Production |
|---------|-------|--------------|
| Playground | http://localhost:3000/playground | `/playground` on Vercel |
| Collect UI iframe | http://localhost:3001 | Discovery dashboard (read-only workflow) |
| Discovery data | `data/discovery/` (577 signals) | Bundled via `outputFileTracingRoot` |
| LLM nudges | Groq API | Groq API (env on Vercel) |
