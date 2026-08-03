# Deploy: GitHub → Netlify

Continuous deployment: **push to `main` on GitHub** → Netlify builds and publishes automatically.

**Repo:** [github.com/vrj87/blinkit](https://github.com/vrj87/blinkit)

---

## One-time setup

### 1. Push code to GitHub

```bash
git add .
git commit -m "Your message"
git push origin main
```

(Config lives in root `netlify.toml` — Netlify reads it on each deploy.)

### 2. Connect Netlify to GitHub

1. Open [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Choose **GitHub** → authorize → select **`vrj87/blinkit`**
3. Branch: **`main`**
4. Build settings (should auto-fill from `netlify.toml`):

| Setting | Value |
|---------|--------|
| Base directory | *(leave empty)* |
| Build command | From `netlify.toml` |
| Publish directory | `apps/mvp/.next` |
| Package directory | `apps/mvp` *(set in UI if builds fail — see below)* |

5. Click **Deploy site**

### 3. Environment variables (required)

**Site configuration → Environment variables → Production:**

| Variable | Value |
|----------|--------|
| `GROQ_API_KEY` | Your key from [console.groq.com/keys](https://console.groq.com/keys) |
| `DATABASE_URL` | `file:./dev.db` |
| `N8N_WEBHOOK_SECRET` | Same as `apps/mvp/.env` |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR-SITE.netlify.app` *(after first deploy)* |

After setting `NEXT_PUBLIC_APP_URL`, go to **Deploys → Trigger deploy → Clear cache and deploy**.

Optional: sync env from local `.env` (requires [Netlify CLI](https://docs.netlify.com/cli/get-started/)):

```powershell
npm install -g netlify-cli
netlify login
netlify link
powershell -ExecutionPolicy Bypass -File scripts\set-netlify-env.ps1
```

---

## Day-to-day workflow

```text
Edit code locally → git push origin main → Netlify auto-builds → live site updates
```

Check build status: Netlify **Deploys** tab or GitHub commit checks (if enabled).

---

## Verify production

Replace `YOUR-SITE` with your Netlify subdomain (e.g. `blinkit` → `blinkit.netlify.app`):

| Check | URL |
|-------|-----|
| Health | `https://YOUR-SITE.netlify.app/api/health` |
| MVP demo | `https://YOUR-SITE.netlify.app/mvp` |
| Playground | `https://YOUR-SITE.netlify.app/playground` |
| LLM status | `https://YOUR-SITE.netlify.app/api/ai/status` |

**Deck link:** `https://YOUR-SITE.netlify.app/playground`

---

## Troubleshooting

### 404 on every page

- Confirm `@netlify/plugin-nextjs` is in `netlify.toml` (it is).
- **Publish directory** must be `apps/mvp/.next`, not `public` or repo root.
- Redeploy with **Clear cache**.

### Build fails: workspace / module not found

In Netlify UI → **Build settings**:

- **Base directory:** empty (repo root)
- **Package directory:** `apps/mvp`

Keep `netlify.toml` at the **repository root** so the build command runs `npm install` from root (npm workspaces).

### Build fails: Prisma / seed

Ensure `GROQ_API_KEY` is set before deploy (seed calls Groq for demo nudges).

### Wrong Node version

Root `.node-version` pins Node **20**. `netlify.toml` also sets `NODE_VERSION = "20"`.

---

## Files reference

| File | Purpose |
|------|---------|
| `netlify.toml` | Build command, Next.js plugin, publish path |
| `.node-version` | Node 20 for Netlify |
| `scripts/set-netlify-env.ps1` | Push local `.env` secrets to Netlify (optional) |

See also: [PRODUCTION.md](./PRODUCTION.md)
