import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

const workspaceRoot = path.resolve(process.cwd(), "..", "..");
const clientSourceRoot = path.resolve(process.cwd(), "src");
const portfolioRuntimeRoot = path.resolve(clientSourceRoot, "portfolio-runtime");

const hostExternals = new Set([
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "react-router-dom",
]);

export default defineConfig(({ mode }) => {
  const {
    APP_URL,
    FILE_UPLOAD_SIZE_LIMIT,
    FILE_IMPORT_SIZE_LIMIT,
    DRAWIO_URL,
    CLOUD,
    SUBDOMAIN_HOST,
    COLLAB_URL,
    BILLING_TRIAL_DAYS,
    POSTHOG_HOST,
    POSTHOG_KEY,
    AI_VECTOR_DRIVER,
  } = loadEnv(mode, workspaceRoot, "");

  return {
    define: {
      "process.env": {
        APP_URL,
        FILE_UPLOAD_SIZE_LIMIT,
        FILE_IMPORT_SIZE_LIMIT,
        DRAWIO_URL,
        CLOUD,
        SUBDOMAIN_HOST,
        COLLAB_URL,
        BILLING_TRIAL_DAYS,
        POSTHOG_HOST,
        POSTHOG_KEY,
        AI_VECTOR_DRIVER,
      },
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: /^use-sync-external-store\/shim\/with-selector$/,
          replacement: path.resolve(
            portfolioRuntimeRoot,
            "react-external-store-selector.ts",
          ),
        },
        {
          find: /^use-sync-external-store\/shim$/,
          replacement: path.resolve(
            portfolioRuntimeRoot,
            "react-external-store-shim.ts",
          ),
        },
        {
          find: "@",
          replacement: clientSourceRoot,
        },
      ],
    },
    build: {
      outDir: "dist-portfolio-runtime",
      emptyOutDir: true,
      sourcemap: true,
      lib: {
        entry: path.resolve(process.cwd(), "src/portfolio-runtime/index.ts"),
        formats: ["es"],
        fileName: "index",
        cssFileName: "style",
      },
      rolldownOptions: {
        // React and the host router stay external so ahmedramzy.com owns one
        // runtime instance. Legacy external-store shims are aliased above to
        // native ESM bridges and are bundled into the Ramzy runtime instead.
        external: (id: string) => hostExternals.has(id),
      },
    },
  };
});
