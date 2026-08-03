const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@blinkit/discovery-core"],
  // Include monorepo root so data/discovery JSON is traced in serverless bundles
  outputFileTracingRoot: path.join(__dirname, "../.."),
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    outputFileTracingIncludes: {
      "/mvp": ["apps/mvp/dev.db", "apps/mvp/prisma/dev.db"],
      "/playground": [
        "data/discovery/**/*",
        "data/research/**/*",
        "apps/mvp/dev.db",
        "apps/mvp/prisma/dev.db",
      ],
      "/demo/user/[id]": ["apps/mvp/dev.db", "apps/mvp/prisma/dev.db"],
      "/dashboard": ["apps/mvp/dev.db", "apps/mvp/prisma/dev.db"],
      "/dashboard/discovery": ["data/discovery/**/*", "data/research/**/*"],
      "/api/discovery": ["data/discovery/**/*", "data/research/**/*"],
      "/api/*": ["apps/mvp/dev.db", "apps/mvp/prisma/dev.db"],
    },
  },
};

module.exports = nextConfig;
