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
      "/playground": ["data/discovery/**/*", "data/research/**/*"],
      "/dashboard/discovery": ["data/discovery/**/*", "data/research/**/*"],
      "/api/discovery": ["data/discovery/**/*", "data/research/**/*"],
    },
  },
};

module.exports = nextConfig;
