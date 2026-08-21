import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

const workspaceRoot = path.resolve(process.cwd(), "..", "..");

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
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
    },
    build: {
      outDir: "dist-portfolio-runtime",
      emptyOutDir: true,
      sourcemap: true,
      lib: {
        entry: path.resolve(process.cwd(), "src/portfolio-runtime/index.ts"),
        formats: ["es"],
        fileName: "index",
      },
      rolldownOptions: {
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          // ahmedramzy.com already owns the exact same router major/version.
          // Keeping one router instance preserves context for any editor node
          // view that uses navigation primitives inside the host application.
          "react-router-dom",
        ],
      },
    },
  };
});
