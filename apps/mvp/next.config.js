const path = require("path");

const discoveryDataIncludes = [
  "data/discovery/**/*",
  "data/research/**/*",
  "apps/mvp/data/discovery/**/*",
  "apps/mvp/data/research/**/*",
];

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
      "/playground": [...discoveryDataIncludes, "apps/mvp/dev.db", "apps/mvp/prisma/dev.db"],
      "/discovery/part1": discoveryDataIncludes,
      "/discovery/part3": discoveryDataIncludes,
      "/demo/user/[id]": ["apps/mvp/dev.db", "apps/mvp/prisma/dev.db"],
      "/dashboard": ["apps/mvp/dev.db", "apps/mvp/prisma/dev.db"],
      "/dashboard/discovery": discoveryDataIncludes,
      "/api/discovery": discoveryDataIncludes,
      "/api/research/questions": discoveryDataIncludes,
      "/api/*": ["apps/mvp/dev.db", "apps/mvp/prisma/dev.db"],
    },
  },
};

module.exports = nextConfig;
