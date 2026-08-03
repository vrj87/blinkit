/** Collect / discovery workflow URL — local collect UI or production discovery dashboard */
export function collectAppUrl(): string {
  if (process.env.NEXT_PUBLIC_COLLECT_URL) {
    return process.env.NEXT_PUBLIC_COLLECT_URL;
  }

  const app =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (app && !app.includes("localhost")) {
    return `${app.replace(/\/$/, "")}/dashboard/discovery`;
  }

  return "http://localhost:3001";
}

export function isLocalCollectHost(url: string): boolean {
  return url.includes("localhost:3001");
}
