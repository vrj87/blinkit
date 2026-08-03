import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    globals: false,
  },
  resolve: {
    alias: {
      "@mvp": path.resolve(__dirname, "apps/mvp"),
      "@discovery-core": path.resolve(__dirname, "packages/discovery-core/src"),
    },
  },
});
