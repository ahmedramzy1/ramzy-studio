import {
  defineConfig,
  esmExternalRequirePlugin,
  loadEnv,
} from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

const workspaceRoot = path.resolve(process.cwd(), "..", "..");

const hostExternals = [
  /^react(?:\/|$)/,
  /^react-dom(?:\/|$)/,
  /^react-router-dom(?:\/|$)/,
];

// ProseMirror decoration objects rely on instanceof checks. If Rolldown/Vite
// resolves the same package through more than one pnpm/peer path, a DecorationSet
// produced by one copy is not recognized by another. The failure first surfaces
// when Suggestion opens the slash menu as `localsInner` on an undefined member.
// Keep the complete TipTap/ProseMirror identity graph on one module instance in
// the reusable portfolio runtime.
const editorSingletons = [
  "@tiptap/core",
  "@tiptap/pm",
  "@tiptap/react",
  "@tiptap/suggestion",
  "prosemirror-changeset",
  "prosemirror-collab",
  "prosemirror-commands",
  "prosemirror-dropcursor",
  "prosemirror-gapcursor",
  "prosemirror-history",
  "prosemirror-inputrules",
  "prosemirror-keymap",
  "prosemirror-model",
  "prosemirror-schema-list",
  "prosemirror-state",
  "prosemirror-tables",
  "prosemirror-trailing-node",
  "prosemirror-transform",
  "prosemirror-view",
  "y-prosemirror",
  "yjs",
];

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
    // This is a reusable library build, not the standalone Ramzy Studio web
    // application. Do not copy PWA icons, manifests, locale JSON, or other
    // public/ assets into the package distribution automatically.
    publicDir: false,
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
    plugins: [
      // Rolldown intentionally preserves CommonJS require() semantics for
      // externals by default. A browser library cannot execute require('react'),
      // so let Rolldown's official bridge own React/router externals and turn
      // any CJS require() calls into ESM imports. This handles every bundled
      // dependency, not only use-sync-external-store.
      esmExternalRequirePlugin({ external: hostExternals }),
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
      dedupe: editorSingletons,
    },
    build: {
      outDir: "dist-portfolio-runtime",
      emptyOutDir: true,
      // Shipping source maps multiplied the private runtime artifact size and
      // exposed implementation source without helping the consuming website.
      sourcemap: false,
      lib: {
        entry: path.resolve(process.cwd(), "src/portfolio-runtime/index.ts"),
        formats: ["es"],
        fileName: "index",
        cssFileName: "style",
      },
    },
  };
});
