/** Resolve public app URL (Netlify, Vercel, or explicit env). */
function resolveAppUrl(): string | null {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const url = raw.startsWith("http") ? raw : `https://${raw}`;
    if (!url.includes("localhost")) {
      return url.replace(/\/$/, "");
    }
  }
  return null;
}

/** Collect / discovery workflow URL — local collect UI or production discovery dashboard */
export function collectAppUrl(): string {
  const localCollect = process.env.NEXT_PUBLIC_COLLECT_URL;
  const app = resolveAppUrl();

  // Local dev: prefer the separate collect app on :3001
  if (process.env.NODE_ENV === "development" && localCollect?.includes("localhost")) {
    return localCollect;
  }

  if (app) {
    return `${app}/dashboard/discovery`;
  }

  return localCollect ?? "http://localhost:3001";
}

/** True when the separate collect app (:3001) is the target — local dev only */
export function isLocalCollectHost(url: string): boolean {
  return url.includes("localhost:3001") && process.env.NODE_ENV === "development";
}

/** Whether to render an inline iframe for the collect / discovery workflow */
export function shouldEmbedCollectFrame(url: string): boolean {
  if (isLocalCollectHost(url)) return true;
  return url.includes("/dashboard/discovery");
}

/** Same-origin path for iframe src (avoids mixed-content / localhost on production) */
export function collectIframeSrc(url: string): string {
  if (url.includes("/dashboard/discovery")) {
    return "/dashboard/discovery";
  }
  return url;
}
